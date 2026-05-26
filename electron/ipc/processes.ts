import { ipcMain, BrowserWindow } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile } from 'fs/promises'

const execAsync = promisify(exec)

function sh(cmd: string): Promise<string> {
  return execAsync(cmd).then(r => r.stdout.trim()).catch(() => '')
}

export interface ProcessEntry {
  pid: number
  name: string
  cpu: number
  memMb: number
  memPct: number
  status: string
  user: string
  command: string
}

export function registerProcessHandlers(): void {

  // ── List processes ────────────────────────────────────────────────────────

  ipcMain.handle('processes:list', async (): Promise<ProcessEntry[]> => {
    // ps aux columns: USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND
    const out = await sh('ps aux --no-headers 2>/dev/null')
    if (!out) return []

    return out.split('\n').filter(Boolean).map(line => {
      // Split on whitespace, keep remainder as command (col 10 onward)
      const parts = line.trimStart().split(/\s+/)
      const user    = parts[0] ?? ''
      const pid     = parseInt(parts[1]) || 0
      const cpu     = parseFloat(parts[2]) || 0
      const memPct  = parseFloat(parts[3]) || 0
      const rssKb   = parseInt(parts[5]) || 0
      const stat    = parts[7] ?? ''
      const command = parts.slice(10).join(' ') || parts[0]

      // Map STAT code to human-readable status
      let status = 'running'
      if (stat.startsWith('S')) status = 'sleeping'
      else if (stat.startsWith('D')) status = 'disk-wait'
      else if (stat.startsWith('Z')) status = 'zombie'
      else if (stat.startsWith('T')) status = 'stopped'
      else if (stat.startsWith('R')) status = 'running'
      else if (stat.startsWith('I')) status = 'idle'

      // Derive short name from command
      const cmdParts = command.replace(/^[\[\]]/g, '').split(/[\s/]/)
      const name = cmdParts[cmdParts.length - 1]?.replace(/[[\]]/g, '') || command.slice(0, 20)

      return {
        pid,
        name,
        cpu,
        memMb: Math.round(rssKb / 1024 * 10) / 10,
        memPct,
        status,
        user,
        command,
      }
    }).filter(p => p.pid > 0)
  })

  // ── Kill process ──────────────────────────────────────────────────────────

  ipcMain.handle('processes:kill', async (_, pid: number, signal?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const sig = signal || 'SIGTERM'
      process.kill(pid, sig as NodeJS.Signals)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err?.message ?? 'Failed to kill process' }
    }
  })

  // ── System stats ──────────────────────────────────────────────────────────

  ipcMain.handle('processes:getSystemStats', async (): Promise<{
    cpuPct: number
    memTotal: number
    memUsed: number
    memPct: number
  }> => {
    try {
      // CPU: read /proc/stat twice with 200ms gap, compute delta
      const readCpu = async () => {
        const stat = await readFile('/proc/stat', 'utf8').catch(() => '')
        const line = stat.split('\n').find(l => l.startsWith('cpu '))
        if (!line) return null
        const nums = line.split(/\s+/).slice(1).map(Number)
        // user, nice, system, idle, iowait, irq, softirq, steal
        const idle  = (nums[3] ?? 0) + (nums[4] ?? 0)
        const total = nums.reduce((a, b) => a + b, 0)
        return { idle, total }
      }

      const [a] = await Promise.all([readCpu()])
      await new Promise(r => setTimeout(r, 200))
      const b = await readCpu()

      let cpuPct = 0
      if (a && b) {
        const totalDelta = b.total - a.total
        const idleDelta  = b.idle  - a.idle
        if (totalDelta > 0) cpuPct = Math.max(0, Math.min(100, ((totalDelta - idleDelta) / totalDelta) * 100))
      }

      // Memory: /proc/meminfo
      const memInfo = await readFile('/proc/meminfo', 'utf8').catch(() => '')
      const getKb = (key: string): number => {
        const l = memInfo.split('\n').find(l => l.startsWith(key))
        return l ? parseInt(l.split(/\s+/)[1]) || 0 : 0
      }
      const memTotal = getKb('MemTotal:')
      const memAvail = getKb('MemAvailable:')
      const memUsed  = memTotal - memAvail
      const memPct   = memTotal > 0 ? (memUsed / memTotal) * 100 : 0

      return {
        cpuPct: Math.round(cpuPct * 10) / 10,
        memTotal: Math.round(memTotal / 1024),   // MB
        memUsed:  Math.round(memUsed  / 1024),   // MB
        memPct:   Math.round(memPct   * 10) / 10,
      }
    } catch {
      return { cpuPct: 0, memTotal: 0, memUsed: 0, memPct: 0 }
    }
  })
}
