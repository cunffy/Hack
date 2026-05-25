import { app, BrowserWindow, shell, ipcMain, powerMonitor, globalShortcut } from 'electron'
import { join } from 'path'
import { exec, execFile } from 'child_process'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { registerTerminalHandlers } from './ipc/terminal'
import { registerPasswordTesterHandlers } from './ipc/password-tester'
import { registerLeakerHandlers } from './ipc/leaker'
import { registerEditorHandlers } from './ipc/editor'
import { registerSettingsHandlers } from './ipc/settings'
import { registerSystemHandlers } from './ipc/system'
import { registerLauncherHandlers, killLaunchedApps } from './ipc/launcher'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#070b11',
    skipTaskbar: true,     // Don't show in any system taskbar — WE are the taskbar
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: join(__dirname, '../../resources/icon.png'),
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
    mainWindow!.maximize()
    // Re-maximize if something else pushes us out of fullscreen
    mainWindow!.on('restore', () => mainWindow?.maximize())

    // ── Block WM-level shortcuts that would expose the underlying desktop ──
    // Super+D  = "show desktop" in most WMs — we swallow it
    globalShortcut.register('Super+D', () => {})
    // Super+Tab = WM window switcher — Cryogram's own task switcher handles this
    globalShortcut.register('Super+Tab', () => {})
    // Super+L = OS lock — redirect to Cryogram's lock screen
    globalShortcut.register('Super+L', () => {
      mainWindow?.webContents.send('screen:lock')
    })
    // Ctrl+Alt+T = terminal shortcut some WMs bind — open Cryogram terminal instead
    globalShortcut.register('CommandOrControl+Alt+T', () => {
      mainWindow?.webContents.send('open:app', 'terminal')
    })

    // ── Volume keys ────────────────────────────────────────────────────────
    // Track last known level so we can show optimistic updates immediately
    // instead of defaulting to 50 when pactl is slow to respond.
    let _vol = -1

    const readVolAndSend = () => {
      exec('pactl get-sink-volume @DEFAULT_SINK@', (err, volOut) => {
        if (err || !volOut) return
        const match = volOut.match(/(\d+)%/)
        if (!match) return
        _vol = Math.min(100, parseInt(match[1]))
        exec('pactl get-sink-mute @DEFAULT_SINK@', (_, muteOut) => {
          mainWindow?.webContents.send('hud:volume', { level: _vol, muted: muteOut?.includes('yes') ?? false })
        })
      })
    }

    const sendVolOptimistic = (delta: number) => {
      if (_vol >= 0) {
        _vol = Math.max(0, Math.min(100, _vol + delta))
        mainWindow?.webContents.send('hud:volume', { level: _vol, muted: false })
      }
      setTimeout(readVolAndSend, 300)
    }

    globalShortcut.register('VolumeUp', () => {
      exec('pactl set-sink-volume @DEFAULT_SINK@ +5%')
      sendVolOptimistic(5)
    })
    globalShortcut.register('VolumeDown', () => {
      exec('pactl set-sink-volume @DEFAULT_SINK@ -5%')
      sendVolOptimistic(-5)
    })
    globalShortcut.register('VolumeMute', () => {
      exec('pactl set-sink-mute @DEFAULT_SINK@ toggle')
      setTimeout(readVolAndSend, 300)
    })

    // ── Brightness keys ────────────────────────────────────────────────────
    // BrightnessUp/Down are not valid Electron accelerator names on Linux.
    // Brightness is handled by ACPI (configured by cryogram-update) at OS level.
    // We only send the HUD update here if ACPI notifies us via a custom IPC path.
    // For now the brightness slider in System Settings works via setBrightness IPC.

    // ── Alt+Tab window switcher ────────────────────────────────────────────
    globalShortcut.register('Alt+Tab', () => {
      mainWindow?.webContents.send('app:switcher', 'next')
    })
    globalShortcut.register('Alt+Shift+Tab', () => {
      mainWindow?.webContents.send('app:switcher', 'prev')
    })
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.cryogram.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Window control IPC
  ipcMain.on('window:minimize', () => mainWindow?.minimize())
  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) mainWindow.unmaximize()
    else mainWindow?.maximize()
  })
  ipcMain.on('window:close', () => mainWindow?.close())

  // Register all feature IPC handlers
  registerTerminalHandlers()
  registerPasswordTesterHandlers()
  registerLeakerHandlers()
  registerEditorHandlers()
  registerSettingsHandlers()
  registerSystemHandlers()
  registerLauncherHandlers()

  createWindow()

  // Lock screen on system resume (lid open / wake from sleep) and OS lock-screen
  powerMonitor.on('resume',      () => mainWindow?.webContents.send('screen:lock'))
  powerMonitor.on('lock-screen', () => mainWindow?.webContents.send('screen:lock'))

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  globalShortcut.unregisterAll()
  killLaunchedApps()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
