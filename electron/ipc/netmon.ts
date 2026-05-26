import { ipcMain, BrowserWindow } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile } from 'fs/promises'

const execAsync = promisify(exec)

function sh(cmd: string): Promise<string> {
  return execAsync(cmd).then(r => r.stdout.trim()).catch(() => '')
}

export interface InterfaceStats {
  name: string
  rxBytes: number
  txBytes: number
}

export interface NetworkConnection {
  protocol: string
  local: string
  remote: string
  state: string
  pid: string
  process: string
}

// Snapshot of /proc/net/dev readings (bytes, packets, errors, drops, etc.)
// We only care about rx/tx bytes (cols 1 and 9 in the data portion).
async function readNetDev(): Promise<Map<string, { rx: number; tx: number }>> {
  const map = new Map<string, { rx: number; tx: number }>()
  try {
    const content = await readFile('/proc/net/dev', 'utf8')
    for (const line of content.split('\n').slice(2)) {
      const trimmed = line.trim()
      if (!trimmed) continue
      const colonIdx = trimmed.indexOf(':')
      if (colonIdx < 0) continue
      const name = trimmed.slice(0, colonIdx).trim()
      const cols = trimmed.slice(colonIdx + 1).trim().split(/\s+/)
      const rx = parseInt(cols[0]) || 0
      const tx = parseInt(cols[8]) || 0
      map.set(name, { rx, tx })
    }
  } catch {}
  return map
}

let streamInterval: ReturnType<typeof setInterval> | null = null
let prevSnapshot: Map<string, { rx: number; tx: number }> | null = null

export function registerNetmonHandlers(): void {

  // ── Interface snapshots ───────────────────────────────────────────────────

  ipcMain.handle('netmon:getInterfaces', async (): Promise<InterfaceStats[]> => {
    const snap = await readNetDev()
    const results: InterfaceStats[] = []
    for (const [name, vals] of snap) {
      if (name === 'lo') continue
      results.push({ name, rxBytes: vals.rx, txBytes: vals.tx })
    }
    return results.sort((a, b) => a.name.localeCompare(b.name))
  })

  // ── Active connections ────────────────────────────────────────────────────

  ipcMain.handle('netmon:getConnections', async (): Promise<NetworkConnection[]> => {
    // ss -tunap: TCP+UDP, no DNS resolve, all processes
    const out = await sh('ss -tunap 2>/dev/null')
    if (!out) return []

    const connections: NetworkConnection[] = []

    for (const line of out.split('\n').slice(1)) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // Columns: Netid State Recv-Q Send-Q Local Remote Process
      // e.g.:  tcp  ESTABLISHED  0  0  192.168.1.5:44212  1.2.3.4:443  users:(("chrome",pid=1234,fd=30))
      const parts = trimmed.split(/\s+/)
      if (parts.length < 6) continue

      const protocol = (parts[0] ?? '').toLowerCase()
      const state    = parts[1] ?? ''
      const local    = parts[4] ?? ''
      const remote   = parts[5] ?? ''

      // Skip loopback
      if (local.startsWith('127.') || remote.startsWith('127.')) continue
      if (local.startsWith('[::1]') || remote.startsWith('[::1]')) continue
      if (local === '*' || remote === '*') {
        // listening on wildcard — include but remote will be *
      }

      // Parse process info: users:(("chrome",pid=1234,fd=30))
      const procRaw = parts.slice(6).join(' ')
      let pid = ''
      let processName = ''
      const pidMatch = procRaw.match(/pid=(\d+)/)
      const nameMatch = procRaw.match(/"([^"]+)"/)
      if (pidMatch)  pid         = pidMatch[1]
      if (nameMatch) processName = nameMatch[1]

      connections.push({ protocol, local, remote, state, pid, process: processName })
    }

    return connections
  })

  // ── Start bandwidth stream ────────────────────────────────────────────────

  ipcMain.handle('netmon:startStream', async (event): Promise<void> => {
    // Clear existing
    if (streamInterval !== null) {
      clearInterval(streamInterval)
      streamInterval = null
    }
    prevSnapshot = await readNetDev()

    streamInterval = setInterval(async () => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win || win.isDestroyed()) {
        clearInterval(streamInterval!)
        streamInterval = null
        return
      }

      const current = await readNetDev()
      const prev    = prevSnapshot ?? current

      const interfaces: {
        name: string
        rxRate: number
        txRate: number
        rxTotal: number
        txTotal: number
      }[] = []

      for (const [name, cur] of current) {
        if (name === 'lo') continue
        const p = prev.get(name) ?? cur
        interfaces.push({
          name,
          rxRate:  Math.max(0, cur.rx - p.rx),   // bytes/sec (1s interval)
          txRate:  Math.max(0, cur.tx - p.tx),
          rxTotal: cur.rx,
          txTotal: cur.tx,
        })
      }

      prevSnapshot = current
      win.webContents.send('netmon:stats', { interfaces })
    }, 1000)
  })

  // ── Stop bandwidth stream ─────────────────────────────────────────────────

  ipcMain.handle('netmon:stopStream', async (): Promise<void> => {
    if (streamInterval !== null) {
      clearInterval(streamInterval)
      streamInterval = null
    }
    prevSnapshot = null
  })
}
