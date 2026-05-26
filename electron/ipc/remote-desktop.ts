import { ipcMain, BrowserWindow, shell } from 'electron'
import { exec, spawn, ChildProcess } from 'child_process'
import { promisify } from 'util'
import { networkInterfaces } from 'os'
import { createServer } from 'http'
import { readFile, access } from 'fs/promises'
import path from 'path'

const sh = promisify(exec)

const VNC_PORT = 5900
const WS_PORT  = 6080
const HTTP_PORT = 6081

let vncProc:  ChildProcess | null = null
let wsProc:   ChildProcess | null = null
let httpServer: ReturnType<typeof createServer> | null = null

function getLocalIP(): string {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of (nets[name] ?? [])) {
      if (net.family === 'IPv4' && !net.internal) return net.address
    }
  }
  return '127.0.0.1'
}

async function novncDir(): Promise<string | null> {
  const candidates = [
    '/usr/share/novnc',
    '/usr/share/noVNC',
    '/opt/novnc',
  ]
  for (const dir of candidates) {
    try { await access(path.join(dir, 'vnc.html')); return dir } catch {}
    try { await access(path.join(dir, 'vnc_lite.html')); return dir } catch {}
    try { await access(path.join(dir, 'core/rfb.js')); return dir } catch {}
  }
  return null
}

function startHTTPServer(webRoot: string | null): void {
  if (httpServer) { httpServer.close(); httpServer = null }

  httpServer = createServer(async (req, res) => {
    if (!webRoot) {
      // Serve a redirect page that uses noVNC CDN
      const ip = getLocalIP()
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CyberDen Remote Desktop</title>
<style>body{font-family:system-ui,sans-serif;background:#0a0a0a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:16px}
h2{color:#10b981;margin:0}p{color:#64748b;margin:0;font-size:14px}a{display:inline-block;padding:12px 24px;background:#10b981;color:#000;text-decoration:none;border-radius:8px;font-weight:600;margin-top:8px}</style>
</head><body>
<h2>CyberDen Remote Desktop</h2>
<p>Loading remote desktop client…</p>
<a href="https://novnc.com/noVNC/vnc.html?host=${ip}&port=${WS_PORT}&autoconnect=1&resize=remote">Launch Remote Desktop</a>
<p style="margin-top:16px;font-size:12px">Or install novnc on the host: <code>sudo apt install novnc</code></p>
</body></html>`
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(html)
      return
    }

    // Serve noVNC static files
    let urlPath = req.url?.split('?')[0] ?? '/'
    if (urlPath === '/' || urlPath === '/index.html') {
      // Try vnc.html or vnc_lite.html
      const candidates = ['vnc.html', 'vnc_lite.html']
      let served = false
      for (const f of candidates) {
        try {
          const content = await readFile(path.join(webRoot, f))
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(content)
          served = true
          break
        } catch {}
      }
      if (!served) { res.writeHead(404); res.end('Not found') }
      return
    }

    const ext = path.extname(urlPath)
    const mimeMap: Record<string, string> = {
      '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
      '.png': 'image/png', '.ico': 'image/x-icon', '.wasm': 'application/wasm',
    }
    try {
      const content = await readFile(path.join(webRoot, urlPath))
      res.writeHead(200, { 'Content-Type': mimeMap[ext] ?? 'application/octet-stream' })
      res.end(content)
    } catch {
      res.writeHead(404); res.end('Not found')
    }
  })

  httpServer.listen(HTTP_PORT)
}

export function registerRemoteDesktopHandlers() {

  ipcMain.handle('remoteDesktop:checkDeps', async () => {
    const [x11vnc, websockify, novnc] = await Promise.all([
      sh('which x11vnc').then(() => true).catch(() => false),
      sh('which websockify || which websockify3').then(() => true).catch(() => false),
      novncDir().then(d => !!d),
    ])
    return { x11vnc, websockify, novnc }
  })

  ipcMain.handle('remoteDesktop:installDeps', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const send = (msg: string) => win?.webContents.send('remoteDesktop:log', msg)
    try {
      send('Installing x11vnc and novnc…')
      await sh('apt-get install -y x11vnc novnc 2>&1')
      send('Done.')
      return { ok: true }
    } catch (e: any) {
      send(`Error: ${e.message}`)
      return { ok: false, error: e.message }
    }
  })

  ipcMain.handle('remoteDesktop:start', async (event, opts: {
    password?: string; viewOnly?: boolean; vncPort?: number
  }) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const send = (msg: string) => win?.webContents.send('remoteDesktop:log', msg)

    // Tear down any existing session
    if (vncProc) { vncProc.kill(); vncProc = null }
    if (wsProc)  { wsProc.kill();  wsProc  = null }
    try { await sh('pkill -f x11vnc 2>/dev/null') } catch {}

    const vncPort = opts.vncPort ?? VNC_PORT

    const vncArgs = ['-display', ':0', '-rfbport', String(vncPort), '-forever', '-shared']
    if (opts.password) vncArgs.push('-passwd', opts.password)
    else vncArgs.push('-nopw')
    if (opts.viewOnly) vncArgs.push('-viewonly')

    send('Starting VNC server…')
    vncProc = spawn('x11vnc', vncArgs, { detached: false })
    vncProc.stderr?.on('data', (d: Buffer) => send(d.toString().trim()))
    vncProc.on('exit', (code) => {
      vncProc = null
      send(`VNC server exited (code ${code})`)
      BrowserWindow.getAllWindows().forEach(w => w.webContents.send('remoteDesktop:stopped'))
    })

    await new Promise(r => setTimeout(r, 1200))

    // Find websockify binary
    let wsBin = 'websockify'
    try { await sh('which websockify') } catch {
      try { await sh('which websockify3'); wsBin = 'websockify3' } catch {}
    }

    send('Starting WebSocket proxy…')
    wsProc = spawn(wsBin, [String(WS_PORT), `localhost:${vncPort}`], { detached: false })
    wsProc.stderr?.on('data', (d: Buffer) => send(d.toString().trim()))
    wsProc.on('exit', () => { wsProc = null })

    // Start HTTP server serving noVNC
    const webRoot = await novncDir()
    send(webRoot ? `Serving noVNC from ${webRoot}` : 'noVNC not found locally — using CDN fallback')
    startHTTPServer(webRoot)

    const ip = getLocalIP()
    const url = `http://${ip}:${HTTP_PORT}`
    send(`Ready — connect from: ${url}`)

    return { ok: true, ip, vncPort, wsPort: WS_PORT, httpPort: HTTP_PORT, url }
  })

  ipcMain.handle('remoteDesktop:stop', async () => {
    if (vncProc) { vncProc.kill('SIGTERM'); vncProc = null }
    if (wsProc)  { wsProc.kill('SIGTERM');  wsProc  = null }
    if (httpServer) { httpServer.close(); httpServer = null }
    try { await sh('pkill -f x11vnc 2>/dev/null') } catch {}
    return { ok: true }
  })

  ipcMain.handle('remoteDesktop:status', async () => ({
    running: !!(vncProc && wsProc),
    vncAlive: !!vncProc,
    wsAlive: !!wsProc,
  }))

  ipcMain.handle('remoteDesktop:getIP', async () => getLocalIP())

  ipcMain.handle('remoteDesktop:tailscaleStatus', async () => {
    try {
      const { stdout } = await sh('tailscale status --json 2>/dev/null')
      const data = JSON.parse(stdout)
      const self = data?.Self
      const ip: string = self?.TailscaleIPs?.[0] ?? ''
      const hostname: string = self?.HostName ?? ''
      const running = data?.BackendState === 'Running'
      return { installed: true, running, ip, hostname }
    } catch {
      // tailscale not installed or daemon not running
      try {
        await sh('which tailscale')
        return { installed: true, running: false, ip: '', hostname: '' }
      } catch {
        return { installed: false, running: false, ip: '', hostname: '' }
      }
    }
  })

  ipcMain.handle('remoteDesktop:installTailscale', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const send = (msg: string) => win?.webContents.send('remoteDesktop:log', msg)
    try {
      send('Downloading Tailscale installer…')
      await sh('curl -fsSL https://tailscale.com/install.sh | sh 2>&1')
      send('Tailscale installed. Run "tailscale up" to authenticate.')
      return { ok: true }
    } catch (e: any) {
      send(`Install failed: ${e.message}`)
      return { ok: false, error: e.message }
    }
  })

  ipcMain.handle('remoteDesktop:tailscaleUp', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const send = (msg: string) => win?.webContents.send('remoteDesktop:log', msg)
    send('Running: tailscale up…')
    return new Promise((resolve) => {
      const proc = spawn('tailscale', ['up', '--accept-routes'], { detached: false })
      proc.stdout?.on('data', (d: Buffer) => {
        const line = d.toString().trim()
        send(line)
        // Open auth URL automatically in browser
        const urlMatch = line.match(/https:\/\/login\.tailscale\.com\/\S+/)
        if (urlMatch) shell.openExternal(urlMatch[0])
      })
      proc.stderr?.on('data', (d: Buffer) => {
        const line = d.toString().trim()
        send(line)
        const urlMatch = line.match(/https:\/\/login\.tailscale\.com\/\S+/)
        if (urlMatch) shell.openExternal(urlMatch[0])
      })
      proc.on('close', (code) => {
        send(code === 0 ? 'Tailscale connected.' : `tailscale up exited (code ${code})`)
        resolve({ ok: code === 0 })
      })
    })
  })
}
