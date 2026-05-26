import { app, BrowserWindow, shell, ipcMain, powerMonitor, globalShortcut } from 'electron'
import { join } from 'path'
import { exec, execFileSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// On the live OS, store userData at a fixed path inside /opt/ which is
// guaranteed persistent (the app itself lives there). The default path
// (/root/.config/...) is often on a tmpfs or un-persisted overlay layer.
// Must be called before app.ready.
if (!is.dev) {
  try {
    const PERSISTENT_USERDATA = '/opt/cryogram-data'
    const defaultPath = app.getPath('userData')
    if (!existsSync(PERSISTENT_USERDATA)) {
      mkdirSync(PERSISTENT_USERDATA, { recursive: true, mode: 0o755 })
      // Migrate any existing settings so the user doesn't lose their config
      if (existsSync(defaultPath) && defaultPath !== PERSISTENT_USERDATA) {
        try { execFileSync('cp', ['-rp', defaultPath + '/.', PERSISTENT_USERDATA]) } catch {}
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
import { registerNetworkScannerHandlers } from './ipc/network-scanner'
import { registerVpnHandlers } from './ipc/vpn'
import { startNotificationBridge, stopNotificationBridge } from './ipc/notification-bridge'
import { registerPasswordManagerHandlers } from './ipc/password-manager'
import { registerSSHKeyHandlers } from './ipc/ssh-keys'
import { registerFirewallHandlers } from './ipc/firewall'
import { registerProcessHandlers } from './ipc/processes'
import { registerLogHandlers } from './ipc/logs'
import { registerNetmonHandlers } from './ipc/netmon'
import { registerScreenshotHandlers } from './ipc/screenshot'
import { registerCertHandlers } from './ipc/cert'
import { registerDockerHandlers } from './ipc/docker'
import { registerGitHandlers } from './ipc/git'
import { registerDatabaseHandlers } from './ipc/database'
import { registerTrashHandlers } from './ipc/trash'
import { registerShodanHandlers } from './ipc/shodan'
import { registerOSINTHandlers } from './ipc/osint'
import { registerCVEHandlers } from './ipc/cve'
import { registerAIHandlers } from './ipc/ai'
import { registerPacketSnifferHandlers } from './ipc/packet-sniffer'
import { registerBackupHandlers } from './ipc/backup'
import { registerAuditLogHandlers } from './ipc/audit-log'
import { registerCodeScannerHandlers } from './ipc/code-scanner'
import { registerTOTPHandlers } from './ipc/totp'
import { registerWordlistsHandlers } from './ipc/wordlists'
import { registerPasswordHealthHandlers } from './ipc/password-health'
import { registerWallpaperHandlers } from './ipc/wallpaper'

let mainWindow: BrowserWindow | null = null
let screenLocked = false  // tracked in main so shortcuts can check it

function lockScreen(): void {
  if (!mainWindow) return
  screenLocked = true
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

    globalShortcut.register('Super+D', () => {
      if (screenLocked) return
      if (mainWindow?.isMinimized() || !mainWindow?.isVisible()) {
        mainWindow?.show()
        mainWindow?.maximize()
        mainWindow?.focus()
      } else {
        mainWindow?.minimize()
      }
    })
    globalShortcut.register('Super+Tab', () => {})
    // Workspace switching
    ;[1, 2, 3, 4].forEach(n => {
      globalShortcut.register(`Super+${n}`, () => {
        if (screenLocked) return
        const { exec } = require('child_process')
        exec(`wmctrl -s ${n - 1} 2>/dev/null`)
        mainWindow?.webContents.send('workspace:changed', n - 1)
      })
    })
    globalShortcut.register('Super+L', () => lockScreen())
    globalShortcut.register('CommandOrControl+Alt+T', () => {
      if (screenLocked) return
      mainWindow?.webContents.send('open:app', 'terminal')
    })
    globalShortcut.register('CommandOrControl+Space', () => {
      if (screenLocked) return
      mainWindow?.webContents.send('open:spotlight')
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
      if (screenLocked) return
      mainWindow?.webContents.send('app:switcher', 'next')
    })
    globalShortcut.register('Alt+Shift+Tab', () => {
      if (screenLocked) return
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

  // Hide shell so an external X11 app can be seen; Super+D restores it
  ipcMain.handle('wm:hideShell', () => {
    mainWindow?.minimize()
    return true
  })

  // Raise Electron above all X11 windows when locked so apps like Brave
  // cannot be seen or clicked through the lock screen.
  ipcMain.on('screen:unlock', () => {
    screenLocked = false
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
  registerNetworkScannerHandlers()
  registerVpnHandlers()
  registerPasswordManagerHandlers()
  registerSSHKeyHandlers()
  registerFirewallHandlers()
  registerProcessHandlers()
  registerLogHandlers()
  registerNetmonHandlers()
  registerScreenshotHandlers()
  registerCertHandlers()
  registerDockerHandlers()
  registerGitHandlers()
  registerDatabaseHandlers()
  registerTrashHandlers()
  registerShodanHandlers()
  registerOSINTHandlers()
  registerCVEHandlers()
  registerAIHandlers()
  registerPacketSnifferHandlers()
  registerBackupHandlers()
  registerAuditLogHandlers()
  registerCodeScannerHandlers()
  registerTOTPHandlers()
  registerWordlistsHandlers()
  registerPasswordHealthHandlers()
  registerWallpaperHandlers()

  createWindow()
  startNotificationBridge()

  powerMonitor.on('resume',      () => lockScreen())
  powerMonitor.on('lock-screen', () => lockScreen())

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  globalShortcut.unregisterAll()
  killLaunchedApps()
  stopNotificationBridge()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
