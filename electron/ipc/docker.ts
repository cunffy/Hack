import { ipcMain, BrowserWindow } from 'electron'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const sh = (cmd: string) => execAsync(cmd, { maxBuffer: 5 * 1024 * 1024 }).then(r => r.stdout.trim()).catch(() => '')

function parseJsonLines(out: string): any[] {
  return out.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
}

// Parse a human-readable size like "142MB", "12MiB", "8GiB", "0B" into bytes.
function parseSize(s: string): number {
  if (!s) return 0
  const m = String(s).trim().match(/^([\d.]+)\s*([KMGTP]?)i?B?$/i)
  if (!m) return 0
  const n = parseFloat(m[1])
  if (isNaN(n)) return 0
  const mult: Record<string, number> = { '': 1, K: 1024, M: 1024 ** 2, G: 1024 ** 3, T: 1024 ** 4, P: 1024 ** 5 }
  return Math.round(n * (mult[m[2].toUpperCase()] ?? 1))
}

// Parse a docker CreatedAt string (e.g. "2024-01-01 12:00:00 +0000 UTC") into epoch seconds.
function parseCreated(s: string): number {
  if (!s) return Math.floor(Date.now() / 1000)
  const t = Date.parse(String(s).replace(/\s+UTC$/, ''))
  return isNaN(t) ? Math.floor(Date.now() / 1000) : Math.floor(t / 1000)
}

// Parse a docker ports string ("0.0.0.0:80->80/tcp, :::80->80/tcp") into an array.
function parsePorts(s: string): string[] {
  if (!s) return []
  return String(s).split(',').map(p => p.trim()).filter(Boolean)
}

export function registerDockerHandlers(): void {
  ipcMain.handle('docker:listContainers', async () => {
    const out = await sh('docker ps -a --format "{{json .}}" 2>/dev/null')
    return parseJsonLines(out).map((c: any) => ({
      id: c.ID, name: c.Names, image: c.Image,
      status: c.Status, state: c.State,
      ports: parsePorts(c.Ports), created: parseCreated(c.CreatedAt),
    }))
  })

  ipcMain.handle('docker:startContainer',   async (_, id: string) => { await sh(`docker start ${id} 2>/dev/null`);   return true })
  ipcMain.handle('docker:stopContainer',    async (_, id: string) => { await sh(`docker stop ${id} 2>/dev/null`);    return true })
  ipcMain.handle('docker:restartContainer', async (_, id: string) => { await sh(`docker restart ${id} 2>/dev/null`); return true })
  ipcMain.handle('docker:removeContainer',  async (_, id: string) => { await sh(`docker rm -f ${id} 2>/dev/null`);   return true })

  ipcMain.handle('docker:getLogs', async (_, id: string, lines = 200) =>
    sh(`docker logs --tail ${lines} ${id} 2>&1`)
  )

  ipcMain.handle('docker:listImages', async () => {
    const out = await sh('docker images --format "{{json .}}" 2>/dev/null')
    return parseJsonLines(out).map((img: any) => ({
      id: img.ID, repository: img.Repository, tag: img.Tag,
      size: parseSize(img.Size), created: parseCreated(img.CreatedAt),
    }))
  })

  ipcMain.handle('docker:removeImage', async (_, id: string) => { await sh(`docker rmi ${id} 2>/dev/null`); return true })

  ipcMain.handle('docker:pullImage', async (_, name: string) => {
    const win = BrowserWindow.getAllWindows()[0]
    return new Promise<void>(resolve => {
      const proc = spawn('docker', ['pull', name], { env: { ...process.env } })
      proc.stdout.on('data', (d: Buffer) => win?.webContents.send('docker:pullLine', d.toString()))
      proc.stderr.on('data', (d: Buffer) => win?.webContents.send('docker:pullLine', d.toString()))
      proc.on('close', () => resolve())
    })
  })

  ipcMain.handle('docker:getStats', async () => {
    const out = await sh('docker stats --no-stream --format "{{json .}}" 2>/dev/null')
    return parseJsonLines(out).map((s: any) => {
      // MemUsage looks like "12MiB / 8GiB"
      const [usedRaw, limitRaw] = String(s.MemUsage ?? '').split('/').map((x: string) => x.trim())
      return {
        id: s.ID, name: s.Name,
        cpuPercent: parseFloat(String(s.CPUPerc ?? '').replace('%', '')) || 0,
        memUsage: parseSize(usedRaw), memLimit: parseSize(limitRaw),
      }
    })
  })
}
