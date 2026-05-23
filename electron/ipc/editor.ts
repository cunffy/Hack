import { ipcMain, dialog, app } from 'electron'
import { readdir, readFile, writeFile, stat } from 'fs/promises'
import { join, extname } from 'path'
import { store } from './settings'

function getWorkspacePath(): string {
  const saved = store.get('workspace') as string
  return saved || join(app.getPath('documents'), 'CyberDen', 'workspace')
}

async function safeResolve(requestedPath: string): Promise<string> {
  const workspace = getWorkspacePath()
  const resolved = join(workspace, requestedPath.replace(workspace, ''))
  if (!resolved.startsWith(workspace)) throw new Error('Path outside workspace')
  return resolved
}

export function registerEditorHandlers(): void {
  ipcMain.handle('fs:getWorkspace', () => getWorkspacePath())

  ipcMain.handle('fs:readDir', async (_, dirPath: string) => {
    const resolved = dirPath === '__workspace__' ? getWorkspacePath() : await safeResolve(dirPath)
    const entries = await readdir(resolved, { withFileTypes: true })
    return Promise.all(
      entries.map(async (e) => ({
        name: e.name,
        path: join(resolved, e.name),
        isDir: e.isDirectory(),
        ext: extname(e.name).slice(1),
      }))
    )
  })

  ipcMain.handle('fs:readFile', async (_, filePath: string) => {
    const resolved = await safeResolve(filePath)
    return readFile(resolved, 'utf-8')
  })

  ipcMain.handle('fs:writeFile', async (_, filePath: string, content: string) => {
    const resolved = await safeResolve(filePath)
    await writeFile(resolved, content, 'utf-8')
    return true
  })

  ipcMain.handle('fs:openDialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Workspace Folder',
    })
    if (!result.canceled && result.filePaths[0]) {
      store.set('workspace', result.filePaths[0])
      return result.filePaths[0]
    }
    return null
  })
}
