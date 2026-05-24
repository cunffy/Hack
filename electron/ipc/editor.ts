import { ipcMain, dialog, app, shell } from 'electron'
import { readdir, readFile, writeFile, stat, copyFile, rename, rm, mkdir } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'
import { homedir } from 'os'
import { store } from './settings'

function getWorkspacePath(): string {
  const saved = store.get('workspace') as string
  return saved || join(app.getPath('documents'), 'Cryogram', 'workspace')
}

async function safeResolve(requestedPath: string): Promise<string> {
  const workspace = getWorkspacePath()
  const resolved = join(workspace, requestedPath.replace(workspace, ''))
  if (!resolved.startsWith(workspace)) throw new Error('Path outside workspace')
  return resolved
}

// File manager uses home-scoped paths (not restricted to workspace)
function safeHome(requestedPath: string): string {
  const home = homedir()
  // Allow absolute paths under home or /media /mnt for drives
  if (requestedPath.startsWith('/media/') || requestedPath.startsWith('/mnt/')) {
    return requestedPath
  }
  if (requestedPath.startsWith(home)) return requestedPath
  // Relative: resolve under home
  const resolved = join(home, requestedPath)
  if (!resolved.startsWith(home)) throw new Error('Path outside home')
  return resolved
}

export function registerEditorHandlers(): void {

  // ── Code editor (workspace-scoped) ─────────────────────────────────────────

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

  // ── File manager (home-scoped) ─────────────────────────────────────────────

  ipcMain.handle('files:getHome', () => homedir())

  ipcMain.handle('files:getDrives', async () => {
    const drives: { path: string; name: string; mounted: boolean }[] = []
    for (const base of ['/media', '/mnt']) {
      try {
        const users = await readdir(base, { withFileTypes: true })
        for (const u of users) {
          if (!u.isDirectory()) continue
          const sub = join(base, u.name)
          try {
            const mounts = await readdir(sub, { withFileTypes: true })
            for (const m of mounts.filter(e => e.isDirectory())) {
              drives.push({ path: join(sub, m.name), name: m.name, mounted: true })
            }
          } catch {
            drives.push({ path: sub, name: u.name, mounted: true })
          }
        }
      } catch { /* skip */ }
    }
    return drives
  })

  ipcMain.handle('files:readDir', async (_, dirPath: string) => {
    const resolved = safeHome(dirPath)
    const entries = await readdir(resolved, { withFileTypes: true })
    const results = await Promise.all(
      entries
        .filter(e => !e.name.startsWith('.'))
        .map(async (e) => {
          const fullPath = join(resolved, e.name)
          try {
            const info = await stat(fullPath)
            return {
              name:  e.name,
              path:  fullPath,
              isDir: e.isDirectory(),
              ext:   extname(e.name).slice(1).toLowerCase(),
              size:  info.size,
              modified: info.mtime.toISOString(),
            }
          } catch {
            return { name: e.name, path: fullPath, isDir: e.isDirectory(), ext: '', size: 0, modified: '' }
          }
        })
    )
    return results.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
      return a.name.localeCompare(b.name)
    })
  })

  ipcMain.handle('files:stat', async (_, filePath: string) => {
    const resolved = safeHome(filePath)
    const info = await stat(resolved)
    return { size: info.size, modified: info.mtime.toISOString(), isDir: info.isDirectory() }
  })

  ipcMain.handle('files:readFile', async (_, filePath: string) => {
    const resolved = safeHome(filePath)
    return readFile(resolved, 'utf-8')
  })

  ipcMain.handle('files:writeFile', async (_, filePath: string, content: string) => {
    const resolved = safeHome(filePath)
    await writeFile(resolved, content, 'utf-8')
    return true
  })

  ipcMain.handle('files:copy', async (_, src: string, dest: string) => {
    await copyFile(safeHome(src), safeHome(dest))
    return true
  })

  ipcMain.handle('files:move', async (_, src: string, dest: string) => {
    await rename(safeHome(src), safeHome(dest))
    return true
  })

  ipcMain.handle('files:delete', async (_, filePath: string) => {
    await rm(safeHome(filePath), { recursive: true, force: true })
    return true
  })

  ipcMain.handle('files:mkdir', async (_, dirPath: string) => {
    await mkdir(safeHome(dirPath), { recursive: true })
    return true
  })

  ipcMain.handle('files:rename', async (_, oldPath: string, newName: string) => {
    const resolved = safeHome(oldPath)
    const newPath = join(dirname(resolved), newName)
    await rename(resolved, newPath)
    return newPath
  })

  ipcMain.handle('files:openExternal', async (_, filePath: string) => {
    await shell.openPath(safeHome(filePath))
    return true
  })

  ipcMain.handle('files:openDialog', async (_, mode: 'open' | 'save' | 'folder' = 'open') => {
    const props: ('openFile' | 'openDirectory' | 'multiSelections')[] =
      mode === 'folder' ? ['openDirectory'] : ['openFile', 'multiSelections']
    const result = await dialog.showOpenDialog({ properties: props })
    return result.canceled ? null : result.filePaths
  })
}
