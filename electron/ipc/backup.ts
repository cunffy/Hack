import { ipcMain, BrowserWindow } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

const BACKUP_DIR = path.join(os.homedir(), '.cryogram', 'backups')
const CONFIG_DIR = path.join(os.homedir(), '.cryogram')

interface BackupMeta { id: string; name: string; size: string; created: string; status: string; items: number }

export function registerBackupHandlers() {
  ipcMain.handle('backup:list', async () => {
    try {
      await fs.mkdir(BACKUP_DIR, { recursive: true })
      const entries = await fs.readdir(BACKUP_DIR)
      const metas: BackupMeta[] = []
      for (const e of entries) {
        if (!e.endsWith('.json')) continue
        try {
          const raw = await fs.readFile(path.join(BACKUP_DIR, e), 'utf-8')
          metas.push(JSON.parse(raw))
        } catch {}
      }
      return metas.sort((a, b) => b.created.localeCompare(a.created))
    } catch { return [] }
  })

  ipcMain.handle('backup:create', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    await fs.mkdir(BACKUP_DIR, { recursive: true })

    const id = Date.now().toString()
    const name = `Backup ${new Date().toLocaleString()}`
    const dest = path.join(BACKUP_DIR, id)
    await fs.mkdir(dest, { recursive: true })

    const sources = [CONFIG_DIR]
    let items = 0

    win?.webContents.send('backup:progress', 'Scanning files…', 10)
    for (const src of sources) {
      try {
        const files = await walkDir(src)
        const total = files.length
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const rel = path.relative(src, file)
          const out = path.join(dest, rel)
          await fs.mkdir(path.dirname(out), { recursive: true })
          await fs.copyFile(file, out)
          items++
          win?.webContents.send('backup:progress', `Backing up: ${rel}`, 10 + Math.round((i/total)*80))
        }
      } catch {}
    }

    const stat = await fs.stat(dest).catch(() => ({ size: 0 }))
    const meta: BackupMeta = { id, name, size: formatSize(stat.size), created: new Date().toISOString().slice(0,16).replace('T',' '), status: 'complete', items }
    await fs.writeFile(path.join(BACKUP_DIR, `${id}.json`), JSON.stringify(meta))
    win?.webContents.send('backup:progress', 'Complete', 100)
    return meta
  })

  ipcMain.handle('backup:restore', async (_, id: string) => {
    const src = path.join(BACKUP_DIR, id)
    const files = await walkDir(src)
    for (const file of files) {
      const rel = path.relative(src, file)
      const dest = path.join(CONFIG_DIR, rel)
      await fs.mkdir(path.dirname(dest), { recursive: true })
      await fs.copyFile(file, dest)
    }
    return true
  })

  ipcMain.handle('backup:delete', async (_, id: string) => {
    await fs.rm(path.join(BACKUP_DIR, id), { recursive: true, force: true })
    await fs.rm(path.join(BACKUP_DIR, `${id}.json`), { force: true })
    return true
  })
}

async function walkDir(dir: string): Promise<string[]> {
  const files: string[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) files.push(...await walkDir(full))
      else files.push(full)
    }
  } catch {}
  return files
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)}KB`
  return `${(bytes/1024/1024).toFixed(1)}MB`
}
