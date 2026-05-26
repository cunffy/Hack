import { ipcMain, BrowserWindow } from 'electron'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const sh = (cmd: string) => execAsync(cmd, { maxBuffer: 5 * 1024 * 1024 }).then(r => r.stdout.trim()).catch(() => '')

function parseJsonLines(out: string): any[] {
  return out.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
}

export function registerDockerHandlers(): void {
  ipcMain.handle('docker:listContainers', async () => {
    const out = await sh('docker ps -a --format "{{json .}}" 2>/dev/null')
    return parseJsonLines(out).map((c: any) => ({
      id: c.ID, name: c.Names, image: c.Image,
      status: c.Status, state: c.State, ports: c.Ports, created: c.CreatedAt,
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
      size: img.Size, created: img.CreatedAt,
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
    return parseJsonLines(out).map((s: any) => ({
      id: s.ID, name: s.Name,
      cpuPct: s.CPUPerc, memUsage: s.MemUsage, memPct: s.MemPerc,
      netIO: s.NetIO, blockIO: s.BlockIO,
    }))
  })
}
