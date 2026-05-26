import { ipcMain } from 'electron'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'

const TRASH_FILES = path.join(os.homedir(), '.local/share/Trash/files')
const TRASH_INFO  = path.join(os.homedir(), '.local/share/Trash/info')

async function ensureDirs() {
  await fs.mkdir(TRASH_FILES, { recursive: true })
  await fs.mkdir(TRASH_INFO,  { recursive: true })
}

function trashInfoContent(originalPath: string) {
  return `[Trash Info]\nPath=${originalPath}\nDeletionDate=${new Date().toISOString().slice(0, 19)}\n`
}

export function registerTrashHandlers(): void {
  ipcMain.handle('trash:list', async () => {
    await ensureDirs()
    try {
      const infos = (await fs.readdir(TRASH_INFO)).filter(f => f.endsWith('.trashinfo'))
      return Promise.all(infos.map(async info => {
        const base = info.slice(0, -10)
        const content = await fs.readFile(path.join(TRASH_INFO, info), 'utf8').catch(() => '')
        const originalPath  = content.match(/Path=(.+)/)?.[1]?.trim() ?? ''
        const deletionDate  = content.match(/DeletionDate=(.+)/)?.[1]?.trim() ?? ''
        let size = 0
        try { const s = await fs.stat(path.join(TRASH_FILES, base)); size = s.size } catch {}
        return { name: base, originalPath, deletionDate, size }
      }))
    } catch { return [] }
  })

  ipcMain.handle('trash:moveToTrash', async (_, filePath: string) => {
    await ensureDirs()
    const name = path.basename(filePath)
    await fs.rename(filePath, path.join(TRASH_FILES, name))
    await fs.writeFile(path.join(TRASH_INFO, `${name}.trashinfo`), trashInfoContent(filePath))
    return true
  })

  ipcMain.handle('trash:restore', async (_, name: string) => {
    const content = await fs.readFile(path.join(TRASH_INFO, `${name}.trashinfo`), 'utf8')
    const orig = content.match(/Path=(.+)/)?.[1]?.trim()
    if (!orig) throw new Error('Original path unknown')
    await fs.rename(path.join(TRASH_FILES, name), orig)
    await fs.unlink(path.join(TRASH_INFO, `${name}.trashinfo`)).catch(() => {})
    return true
  })

  ipcMain.handle('trash:deletePermanent', async (_, name: string) => {
    await fs.rm(path.join(TRASH_FILES, name), { recursive: true, force: true })
    await fs.unlink(path.join(TRASH_INFO, `${name}.trashinfo`)).catch(() => {})
    return true
  })

  ipcMain.handle('trash:empty', async () => {
    await ensureDirs()
    const files = await fs.readdir(TRASH_FILES).catch(() => [] as string[])
    const infos = await fs.readdir(TRASH_INFO).catch(()  => [] as string[])
    await Promise.all([
      ...files.map(f => fs.rm(path.join(TRASH_FILES, f), { recursive: true, force: true })),
      ...infos.map(f => fs.unlink(path.join(TRASH_INFO, f)).catch(() => {})),
    ])
    return true
  })

  ipcMain.handle('trash:getSize', async () => {
    await ensureDirs()
    const files = await fs.readdir(TRASH_FILES).catch(() => [] as string[])
    let bytes = 0
    for (const f of files) {
      try { const s = await fs.stat(path.join(TRASH_FILES, f)); bytes += s.size } catch {}
    }
    return { count: files.length, bytes }
  })
}
