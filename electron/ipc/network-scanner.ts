import { ipcMain, BrowserWindow } from 'electron'
import { spawn, execFile, ChildProcess } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

let activeNmapProc: ChildProcess | null = null

export function registerNetworkScannerHandlers(): void {

  // ── Check if nmap is installed ─────────────────────────────────────────────
  ipcMain.handle('scanner:check', async () => {
    try {
      await execFileAsync('which', ['nmap'])
      return { available: true }
    } catch {
      // 'which' failed — try 'nmap --version' as a fallback (e.g. on macOS with custom PATH)
      try {
        await execFileAsync('nmap', ['--version'])
        return { available: true }
      } catch {
        return { available: false }
      }
    }
  })

  // ── Run a scan ─────────────────────────────────────────────────────────────
  ipcMain.handle('scanner:run', (event, target: string, type: string, portRange?: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!target?.trim()) {
        reject(new Error('No target specified'))
        return
      }

      const win = BrowserWindow.fromWebContents(event.sender)

      // Build nmap argument list based on scan type
      let args: string[]
      switch (type) {
        case 'ping':
          args = ['-sn', target]
          break
        case 'ports':
          args = ['-sV', '--open', '-p', portRange?.trim() || '1-1000', target]
          break
        case 'service':
          args = ['-sV', '-sC', '--open', '-p', portRange?.trim() || '1-1000', target]
          break
        case 'full':
          args = ['-A', '--open', '-p', portRange?.trim() || '-', target]
          break
        default:
          args = ['-sV', '--open', '-p', portRange?.trim() || '1-1000', target]
      }

      // Kill any existing scan before starting a new one
      if (activeNmapProc) {
        try { activeNmapProc.kill('SIGTERM') } catch {}
        activeNmapProc = null
      }

      const proc = spawn('nmap', args, { stdio: ['ignore', 'pipe', 'pipe'] })
      activeNmapProc = proc

      let lineBuffer = ''

      const sendLine = (line: string) => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('scanner:progress', line)
        }
      }

      const flushBuffer = (chunk: string) => {
        lineBuffer += chunk
        const parts = lineBuffer.split('\n')
        // Keep the incomplete tail in the buffer
        lineBuffer = parts.pop() ?? ''
        for (const part of parts) {
          const trimmed = part.trimEnd()
          if (trimmed) sendLine(trimmed)
        }
      }

      proc.stdout?.on('data', (data: Buffer) => {
        flushBuffer(data.toString())
      })

      proc.stderr?.on('data', (data: Buffer) => {
        // nmap occasionally writes warnings to stderr — surface them as progress
        const text = data.toString().trim()
        if (text) {
          for (const line of text.split('\n')) {
            const l = line.trimEnd()
            if (l) sendLine(l)
          }
        }
      })

      proc.on('close', (code) => {
        // Flush any remaining partial line
        if (lineBuffer.trim()) sendLine(lineBuffer.trim())
        lineBuffer = ''

        if (activeNmapProc === proc) activeNmapProc = null

        if (code === 0 || code === null) {
          resolve()
        } else {
          reject(new Error(`nmap exited with code ${code}`))
        }
      })

      proc.on('error', (err) => {
        if (activeNmapProc === proc) activeNmapProc = null
        reject(new Error(`Failed to start nmap: ${err.message}`))
      })
    })
  })

  // ── Cancel a running scan ──────────────────────────────────────────────────
  ipcMain.on('scanner:cancel', () => {
    if (activeNmapProc) {
      try { activeNmapProc.kill('SIGTERM') } catch {}
      // Give it a moment then SIGKILL if still alive
      const proc = activeNmapProc
      setTimeout(() => {
        try { proc.kill('SIGKILL') } catch {}
      }, 2000)
      activeNmapProc = null
    }
  })
}
