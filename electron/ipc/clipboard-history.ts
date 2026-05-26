import { ipcMain, clipboard, BrowserWindow, nativeImage } from 'electron'
import { getSettingsStore } from './settings'

interface ClipEntry {
  id: string
  text: string
  ts: number
  pinned: boolean
}

const MAX_HISTORY = 200
let history: ClipEntry[] = []
let lastText = ''
let pollTimer: ReturnType<typeof setInterval> | null = null

function poll() {
  try {
    const text = clipboard.readText()
    if (text && text !== lastText && text.trim().length > 0) {
      lastText = text
      const entry: ClipEntry = { id: `clip-${Date.now()}`, text, ts: Date.now(), pinned: false }
      history = [entry, ...history.filter(e => e.text !== text)].slice(0, MAX_HISTORY)
      BrowserWindow.getAllWindows().forEach(w =>
        w.webContents.send('clipboard:change', entry)
      )
    }
  } catch {}
}

export function registerClipboardHistoryHandlers() {
  pollTimer = setInterval(poll, 600)

  ipcMain.handle('clipboard:getAll', () => history)

  ipcMain.handle('clipboard:copy', (_, id: string) => {
    const entry = history.find(e => e.id === id)
    if (entry) {
      clipboard.writeText(entry.text)
      lastText = entry.text
    }
  })

  ipcMain.handle('clipboard:pin', (_, id: string) => {
    history = history.map(e => e.id === id ? { ...e, pinned: !e.pinned } : e)
    return history
  })

  ipcMain.handle('clipboard:delete', (_, id: string) => {
    history = history.filter(e => e.id !== id)
    return history
  })

  ipcMain.handle('clipboard:clear', () => {
    history = history.filter(e => e.pinned)
    return history
  })
}

export function stopClipboardPoller() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
}
