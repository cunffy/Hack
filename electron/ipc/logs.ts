import { ipcMain, BrowserWindow } from 'electron'
import { exec, spawn, ChildProcess } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

function sh(cmd: string): Promise<string> {
  return execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 }).then(r => r.stdout.trim()).catch(() => '')
}

export interface LogLine {
  timestamp: string
  unit: string
  level: string
  message: string
  raw: string
}

let tailProc: ChildProcess | null = null

// Parse a journalctl short-precise line.
// Format: "Mon DD HH:MM:SS.usec hostname unit[pid]: message"
// e.g.  "May 26 10:23:45.123456 myhost kernel: some message"
function parseLine(raw: string): LogLine {
  // Detect level from common prefix patterns in message text
  const detectLevel = (msg: string, unit: string): string => {
    const m = msg.toLowerCase()
    const u = unit.toLowerCase()
    if (m.includes('emerg') || m.includes('panic'))    return 'emerg'
    if (m.includes('alert'))                            return 'alert'
    if (m.includes('crit'))                            return 'crit'
    if (m.includes('error') || m.includes('err:') || m.includes('failed') || m.includes('failure'))
                                                        return 'err'
    if (m.includes('warn'))                            return 'warning'
    if (m.includes('notice'))                          return 'notice'
    if (m.includes('debug') || m.includes('trace'))   return 'debug'
    if (u === 'kernel')                                return 'info'
    return 'info'
  }

  // journalctl short-precise: "MMM DD HH:MM:SS.ffffff hostname svcname[pid]: msg"
  const m = raw.match(/^(\w{3}\s+\d+\s+[\d:.]+)\s+\S+\s+([^\[:]+)(?:\[\d+\])?\s*:\s*(.*)$/)
  if (m) {
    const [, ts, unit, message] = m
    return {
      timestamp: ts.trim(),
      unit: unit.trim(),
      level: detectLevel(message, unit.trim()),
      message: message.trim(),
      raw,
    }
  }

  // Fallback: can't parse
  return {
    timestamp: '',
    unit: '',
    level: 'info',
    message: raw,
    raw,
  }
}

export function registerLogHandlers(): void {

  // ── List units ────────────────────────────────────────────────────────────

  ipcMain.handle('logs:getUnits', async (): Promise<string[]> => {
    const out = await sh(
      'systemctl list-units --type=service --state=loaded -q --no-legend --no-pager 2>/dev/null'
    )
    const units = out.split('\n').filter(Boolean).map(line => {
      const name = line.trim().split(/\s+/)[0] ?? ''
      return name.replace(/\.service$/, '')
    }).filter(Boolean).sort()

    return ['all', 'kernel', ...units]
  })

  // ── Query logs ────────────────────────────────────────────────────────────

  ipcMain.handle('logs:query', async (_, opts: {
    unit?: string
    lines?: number
    since?: string
    priority?: string
    search?: string
  }): Promise<{ lines: LogLine[] }> => {
    const { unit = 'all', lines = 100, since, priority, search } = opts

    const args: string[] = ['--no-pager', '--output', 'short-precise', '-n', String(lines)]

    if (unit && unit !== 'all') {
      if (unit === 'kernel') {
        args.push('-k')
      } else {
        args.push('-u', `${unit}.service`)
      }
    }

    if (since) {
      args.push('--since', since)
    }

    if (priority && priority !== 'all') {
      args.push('-p', priority)
    }

    const cmd = `journalctl ${args.map(a => `'${a.replace(/'/g, "'\\''")}'`).join(' ')} 2>/dev/null`
    let out = await sh(cmd)

    if (search) {
      const lower = search.toLowerCase()
      out = out.split('\n').filter(l => l.toLowerCase().includes(lower)).join('\n')
    }

    const parsed = out.split('\n').filter(Boolean).map(parseLine)
    return { lines: parsed }
  })

  // ── Start live tail stream ────────────────────────────────────────────────

  ipcMain.handle('logs:stream', async (event, opts: { unit?: string }): Promise<void> => {
    // Kill existing tail
    if (tailProc) {
      try { tailProc.kill('SIGTERM') } catch {}
      tailProc = null
    }

    const { unit = 'all' } = opts
    const args = ['-f', '--no-pager', '--output', 'short-precise']

    if (unit && unit !== 'all') {
      if (unit === 'kernel') {
        args.push('-k')
      } else {
        args.push('-u', `${unit}.service`)
      }
    }

    const proc = spawn('journalctl', args, { stdio: ['ignore', 'pipe', 'ignore'] })
    tailProc = proc

    const win = BrowserWindow.fromWebContents(event.sender)
    let buf = ''

    proc.stdout?.on('data', (data: Buffer) => {
      buf += data.toString()
      const parts = buf.split('\n')
      buf = parts.pop() ?? ''
      for (const line of parts) {
        const trimmed = line.trimEnd()
        if (trimmed && win && !win.isDestroyed()) {
          win.webContents.send('logs:line', parseLine(trimmed))
        }
      }
    })

    proc.on('close', () => {
      if (tailProc === proc) tailProc = null
    })
  })

  // ── Stop live tail stream ─────────────────────────────────────────────────

  ipcMain.handle('logs:stopStream', async (): Promise<void> => {
    if (tailProc) {
      try { tailProc.kill('SIGTERM') } catch {}
      tailProc = null
    }
  })
}
