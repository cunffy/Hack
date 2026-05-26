import { ipcMain, dialog } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

const WALLPAPER_DIR = path.join(os.homedir(), '.cryogram', 'wallpapers')

export function registerWallpaperHandlers() {
  ipcMain.handle('wallpaper:listCustom', async () => {
    await fs.mkdir(WALLPAPER_DIR, { recursive: true })
    const entries = await fs.readdir(WALLPAPER_DIR).catch(() => [] as string[])
    const imgExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']
    return entries
      .filter(e => imgExts.includes(path.extname(e).toLowerCase()))
      .map(e => ({
        id: e,
        name: path.basename(e, path.extname(e)),
        path: path.join(WALLPAPER_DIR, e),
        type: 'custom',
      }))
  })

  ipcMain.handle('wallpaper:browse', async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg','jpeg','png','webp','gif','bmp'] }],
      title: 'Select wallpaper image',
    })
    if (!result.filePaths[0]) return null
    await fs.mkdir(WALLPAPER_DIR, { recursive: true })
    const dest = path.join(WALLPAPER_DIR, path.basename(result.filePaths[0]))
    await fs.copyFile(result.filePaths[0], dest)
    return dest
  })
}
