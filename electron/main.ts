import { app, BrowserWindow, shell, ipcMain, powerMonitor, globalShortcut } from 'electron'
import { join } from 'path'
import { exec, execFile } from 'child_process'
import { existsSync, mkdirSync, cpSync } from 'fs'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// Persist user data (settings, localStorage) to a fixed location that survives
// updates. The default Electron userData path may be under /root/ which isn't
// always included in the overlay persistence layer on the live OS.
// We only activate this on the live OS where /etc/cryogram exists.
const PERSISTENT_USERDATA = '/etc/cryogram/userdata'
if (existsSync('/etc/cryogram')) {
  try {
    const defaultPath = app.getPath('userData')
    if (!existsSync(PERSISTENT_USERDATA)) {
      mkdirSync(PERSISTENT_USERDATA, { recursive: true, mode: 0o755 })
      // Migrate any existing settings so nothing is lost
      if (existsSync(defaultPath) && defaultPath !== PERSISTENT_USERDATA) {
        try { cpSync(defaultPath, PERSISTENT_USERDATA, { recursive: true }) } catch {}
      }
    }
    app.setPath('userData', PERSISTENT_USERDATA)
  } catch {}
}
import { registerTerminalHandlers } from './ipc/terminal'
import { registerPasswordTesterHandlers } from './ipc/password-tester'
import { registerLeakerHandlers } from './ipc/leaker'
import { registerEditorHandlers } from './ipc/editor'
import { registerSettingsHandlers } from './ipc/settings'
import { registerSystemHandlers } from './ipc/system'
import { registerLauncherHandlers, killLaunchedApps } from './ipc/launcher'
import { registerPhoneHandlers } from './ipc/phone'
import { registerUpdaterHandlers } from './ipc/updater'

let mainWindow: BrowserWindow | null = null

function lockScreen(): void {
  if (!mainWindow) return
  // Put Electron above every X11 window (Brave, terminals, etc.) so apps
  // cannot be seen or interacted with while the lock screen is active.
  mainWindow.setAlwaysOnTop(true, 'screen-saver')
  mainWindow.focus()
  mainWindow.moveTop()
  mainWindow.webContents.send('screen:lock')
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#070b11',
    skipTaskbar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
    icon: join(__dirname, '../../resources/icon.png'),
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
    mainWindow!.maximize()
    mainWindow!.on('restore', () => mainWindow?.maximize())

    globalShortcut.register('Super+D', () => {})
    globalShortcut.register('Super+Tab', () => {})
    globalShortcut.register('Super+L', () => {
      lockScreen()
    })
    globalShortcut.register('CommandOrControl+Alt+T', () => {
      mainWindow?.webContents.send('open:app', 'terminal')
    })

    // ── Volume keys ────────────────────────────────────────────────────────
    // Track last known level for optimistic HUD updates — never default to 50
    // when pactl is slow or the sink isn't resolved yet.
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
    // The brightness slider in System Settings works via setBrightness IPC.

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

  ipcMain.on('window:minimize', () => mainWindow?.minimize())
  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) mainWindow.unmaximize()
    else mainWindow?.maximize()
  })
  ipcMain.on('window:close', () => mainWindow?.close())

  // Raise Electron above all X11 windows when locked so apps like Brave
  // cannot be seen or clicked through the lock screen.
  ipcMain.on('screen:unlock', () => {
    mainWindow?.setAlwaysOnTop(false)
  })

  registerTerminalHandlers()
  registerPasswordTesterHandlers()
  registerLeakerHandlers()
  registerEditorHandlers()
  registerSettingsHandlers()
  registerSystemHandlers()
  registerLauncherHandlers()
  registerPhoneHandlers()
  registerUpdaterHandlers()

  createWindow()

  powerMonitor.on('resume',      () => lockScreen())
  powerMonitor.on('lock-screen', () => lockScreen())

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
