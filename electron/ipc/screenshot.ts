import { ipcMain, clipboard, nativeImage, desktopCapturer } from 'electron'
import { writeFile } from 'fs/promises'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

function defaultFilename(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `Screenshot-${now.getFullYear()}-` +
    `${pad(now.getMonth() + 1)}-` +
    `${pad(now.getDate())}-` +
    `${pad(now.getHours())}-` +
    `${pad(now.getMinutes())}-` +
    `${pad(now.getSeconds())}.png`
  )
}

export function registerScreenshotHandlers(): void {
  // ── capture ────────────────────────────────────────────────────────────────
  ipcMain.handle('screenshot:capture', async () => {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 },
    })
    const src = sources[0]
    if (!src) throw new Error('No screen source found')
    const dataUrl = src.thumbnail.toDataURL()
    const size = src.thumbnail.getSize()
    return { dataUrl, width: size.width, height: size.height }
  })

  // ── save ───────────────────────────────────────────────────────────────────
  ipcMain.handle('screenshot:save', async (_, dataUrl: string, filename?: string) => {
    const screenshotsDir = join(homedir(), 'Screenshots')
    if (!existsSync(screenshotsDir)) {
      mkdirSync(screenshotsDir, { recursive: true })
    }
    const name = filename ?? defaultFilename()
    const filePath = join(screenshotsDir, name)
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64, 'base64')
    await writeFile(filePath, buffer)
    return { path: filePath }
  })

  // ── copyToClipboard ────────────────────────────────────────────────────────
  ipcMain.handle('screenshot:copyToClipboard', async (_, dataUrl: string) => {
    try {
      const image = nativeImage.createFromDataURL(dataUrl)
      clipboard.writeImage(image)
      return true
    } catch {
      return false
    }
  })
}
