import { ipcMain, BrowserWindow, dialog } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg', '.ico', '.tiff', '.avif']

export function registerImageViewerHandlers() {
  ipcMain.handle('imageViewer:open', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog.showOpenDialog(win!, {
      title: 'Open Image',
      filters: [{ name: 'Images', extensions: ['png','jpg','jpeg','gif','webp','bmp','svg','ico','tiff','avif'] }],
      properties: ['openFile'],
    })
    const filePath = result.filePaths[0]
    if (!filePath) return null
    return readImageFile(filePath)
  })

  ipcMain.handle('imageViewer:readFile', async (_, filePath: string) => {
    return readImageFile(filePath)
  })

  ipcMain.handle('imageViewer:browseDir', async (event, dirPath: string) => {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      const images = entries
        .filter(e => !e.isDirectory() && IMAGE_EXTS.includes(path.extname(e.name).toLowerCase()))
        .map(e => path.join(dirPath, e.name))
      return images
    } catch { return [] }
  })
}

async function readImageFile(filePath: string): Promise<{ path: string; dataUrl: string; name: string; size: number } | null> {
  try {
    const buf = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase().slice(1)
    const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
    const dataUrl = `data:${mime};base64,${buf.toString('base64')}`
    const stat = await fs.stat(filePath)
    return { path: filePath, dataUrl, name: path.basename(filePath), size: stat.size }
  } catch { return null }
}
