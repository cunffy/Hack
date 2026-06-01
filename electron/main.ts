import { app, BrowserWindow, shell, ipcMain, powerMonitor, globalShortcut, screen as electronScreen } from 'electron'
import { join } from 'path'
import { exec, execFileSync } from 'child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// ── Performance flags (set before app.ready) ──────────────────────────────────
// Disable spare renderer pre-spawn — saves ~40 MB RAM on a single-window app.
app.commandLine.appendSwitch('disable-features', 'SpareRendererForSitePerProcess,TranslateUI,AutofillServerCommunication,HardwareMediaKeyHandling,MediaSessionService')
// Enable GPU raster and zero-copy for faster 2D rendering.
app.commandLine.appendSwitch('enable-gpu-rasterization')
app.commandLine.appendSwitch('enable-zero-copy')
// Disable background throttling — Electron is the desktop shell, always needs full speed.
app.commandLine.appendSwitch('disable-background-timer-throttling')
app.commandLine.appendSwitch('disable-renderer-backgrounding')

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
import { registerClipboardHistoryHandlers } from './ipc/clipboard-history'
import { registerColorPickerHandlers } from './ipc/color-picker'
import { registerImageViewerHandlers } from './ipc/image-viewer'
import { registerRSSReaderHandlers } from './ipc/rss-reader'
import { registerRemoteDesktopHandlers } from './ipc/remote-desktop'
import { setShellWindow, raiseShell, sinkShell, unpinShell, pinToDesktopLayer } from './shellControl'

let mainWindow: BrowserWindow | null = null
let screenLocked = false  // tracked in main so shortcuts can check it

function lockScreen(): void {
  if (!mainWindow) return
  screenLocked = true
  // Restore full-screen state before raising — if the window was snapped to
  // a half-screen by the snap keybinding, lock screen would only cover half.
  mainWindow.unmaximize()
  mainWindow.maximize()
  // Put Electron above every X11 window so no app is visible while locked.
  mainWindow.setAlwaysOnTop(true, 'screen-saver')
  mainWindow.focus()
  mainWindow.moveTop()
  // Re-assert after 200ms in case a pending sinkShell() timer fires and
  // removes the above state that we just set.
  setTimeout(() => {
    if (screenLocked) {
      mainWindow?.setAlwaysOnTop(true, 'screen-saver')
      mainWindow?.moveTop()
    }
  }, 200)
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

  // Register shell window for raise/sink control
  setShellWindow(mainWindow)
  // When Electron loses focus to any X11 app, return to the desktop layer
  mainWindow.on('blur', () => {
    if (!screenLocked) sinkShell()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
    mainWindow!.maximize()

    // Pin to desktop layer — X11 apps always float on top, Electron is the floor
    setTimeout(pinToDesktopLayer, 500)

    // Never minimize under any condition — restore immediately if the WM tries
    mainWindow!.on('minimize', () => {
      mainWindow?.restore()
      setTimeout(pinToDesktopLayer, 200)
    })
    mainWindow!.on('restore', () => mainWindow?.maximize())

    // Super+D: toggle — raise Cryogram above X11 apps so the user can interact
    // with the dock/apps, or sink it back below so X11 apps are visible again.
    globalShortcut.register('Super+D', () => {
      if (screenLocked) return
      raiseShell()
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

    // ── Window snapping ────────────────────────────────────────────────────
    // Snaps the active X11 window via wmctrl. Skips if Cryogram itself is the
    // active window — internal window snapping is handled by the renderer via
    // the window:snap event sent below.
    const snapX11 = (side: 'left' | 'right' | 'max') => {
      const { width, height } = electronScreen.getPrimaryDisplay().workAreaSize
      const TB = 28
      exec('xdotool getactivewindow', (_err, xidStr) => {
        const xid = xidStr?.trim()
        if (!xid) return
        // Skip if active window IS the main desktop shell
        try {
          const mainNativeId = mainWindow?.getNativeWindowHandle().readUInt32LE(0)
          if (mainNativeId) {
            const mainXid = `0x${mainNativeId.toString(16)}`
            const decXid = String(mainNativeId)
            if (xid === mainXid || xid === decXid) return
          }
        } catch {}
        if (side === 'max') {
          exec(`wmctrl -i -r ${xid} -b add,maximized_vert,maximized_horz 2>/dev/null || true`, () => {})
        } else {
          const x = side === 'left' ? 0 : Math.floor(width / 2)
          const w = Math.floor(width / 2)
          const h = height - TB
          exec(`wmctrl -i -r ${xid} -b remove,maximized_vert,maximized_horz 2>/dev/null; wmctrl -i -r ${xid} -e 0,${x},${TB},${w},${h} 2>/dev/null || true`, () => {})
        }
      })
    }
    globalShortcut.register('Super+Left',  () => { if (!screenLocked) { snapX11('left');  mainWindow?.webContents.send('window:snap', 'left')  } })
    globalShortcut.register('Super+Right', () => { if (!screenLocked) { snapX11('right'); mainWindow?.webContents.send('window:snap', 'right') } })
    globalShortcut.register('Super+Up',    () => { if (!screenLocked) { snapX11('max');   mainWindow?.webContents.send('window:snap', 'max')   } })
    globalShortcut.register('CommandOrControl+Alt+T', () => {
      if (screenLocked) return
      raiseShell()
      mainWindow?.webContents.send('open:app', 'terminal')
    })
    globalShortcut.register('CommandOrControl+Space', () => {
      if (screenLocked) return
      mainWindow?.webContents.send('open:spotlight')
    })

    // ── Volume keys ────────────────────────────────────────────────────────
    let _vol = -1

    // PipeWire/PulseAudio find their socket via XDG_RUNTIME_DIR.
    // Prefer the env var (set by cryogram-session for the correct user).
    // If Electron runs as root, fall back to uid 1000 (the desktop user).
    const uid = process.getuid?.() ?? 1000
    const audioEnv = {
      ...process.env,
      XDG_RUNTIME_DIR: process.env['XDG_RUNTIME_DIR'] ?? `/run/user/${uid === 0 ? 1000 : uid}`,
    }

    const execVol = (delta: string) => {
      exec(`pactl set-sink-volume @DEFAULT_SINK@ ${delta} 2>/dev/null || pactl list sinks short 2>/dev/null | awk 'NR==1{print $1}' | xargs -r -I{} pactl set-sink-volume {} ${delta} 2>/dev/null || true`, { env: audioEnv })
    }
    const readVolCmd = `pactl get-sink-volume @DEFAULT_SINK@ 2>/dev/null || pactl list sinks short 2>/dev/null | awk 'NR==1{print $1}' | xargs -r pactl get-sink-volume 2>/dev/null`
    const readMuteCmd = `pactl get-sink-mute @DEFAULT_SINK@ 2>/dev/null || pactl list sinks short 2>/dev/null | awk 'NR==1{print $1}' | xargs -r pactl get-sink-mute 2>/dev/null`

    const readVolAndSend = () => {
      exec(readVolCmd, { env: audioEnv }, (err, volOut) => {
        if (err || !volOut) return
        const match = volOut.match(/(\d+)%/)
        if (!match) return
        _vol = Math.min(100, parseInt(match[1]))
        exec(readMuteCmd, { env: audioEnv }, (_, muteOut) => {
          mainWindow?.webContents.send('hud:volume', { level: _vol, muted: muteOut?.includes('yes') ?? false })
        })
      })
    }

    // Read current volume immediately
    readVolAndSend()

    const sendVolOptimistic = (delta: number) => {
      // Always show HUD immediately — use 50 as baseline if volume unknown yet
      _vol = Math.max(0, Math.min(100, (_vol < 0 ? 50 : _vol) + delta))
      mainWindow?.webContents.send('hud:volume', { level: _vol, muted: false })
      setTimeout(readVolAndSend, 300)
    }

    globalShortcut.register('VolumeUp', () => {
      execVol('+5%')
      sendVolOptimistic(5)
    })
    globalShortcut.register('VolumeDown', () => {
      execVol('-5%')
      sendVolOptimistic(-5)
    })
    globalShortcut.register('VolumeMute', () => {
      exec(`pactl set-sink-mute @DEFAULT_SINK@ toggle 2>/dev/null || pactl list sinks short 2>/dev/null | awk 'NR==1{print $1}' | xargs -r -I{} pactl set-sink-mute {} toggle 2>/dev/null || true`, { env: audioEnv })
      setTimeout(readVolAndSend, 300)
    })

    // ── Brightness keys ────────────────────────────────────────────────────
    // Electron can't register XF86MonBrightnessUp/Down on Linux — Openbox
    // handles them via keybindings calling brightnessctl. We poll the sysfs
    // file every 200ms so any change (from any source) triggers the HUD.
    let _brightness = -1
    const backlightBase = (() => {
      try {
        const dirs = readdirSync('/sys/class/backlight')
        return dirs.length ? `/sys/class/backlight/${dirs[0]}` : null
      } catch { return null }
    })()
    if (backlightBase) {
      setInterval(() => {
        try {
          const cur = parseInt(readFileSync(`${backlightBase}/brightness`, 'utf8').trim())
          const max = parseInt(readFileSync(`${backlightBase}/max_brightness`, 'utf8').trim())
          if (max <= 0) return
          const level = Math.round(cur * 100 / max)
          if (level !== _brightness) {
            _brightness = level
            mainWindow?.webContents.send('hud:brightness', { level })
          }
        } catch {}
      }, 200)
    }

    // ── Alt+Tab window switcher ────────────────────────────────────────────
    // Raise Electron above all X11 apps first so the overlay is visible even
    // when Cryogram is pinned below Brave or another X11 window.
    globalShortcut.register('Alt+Tab', () => {
      if (screenLocked) return
      raiseShell()
      mainWindow?.webContents.send('app:switcher', 'next')
    })
    globalShortcut.register('Alt+Shift+Tab', () => {
      if (screenLocked) return
      raiseShell()
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

// Prevent double-start: if another instance is already running (e.g., the
// session loop races with app.relaunch() after an update), quit immediately.
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Map of open app windows spawned as separate BrowserWindows
const appWindowMap = new Map<number, { win: BrowserWindow; appId: string }>()

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.cryogram.app')

  // Sync system clock immediately — the hardware RTC can drift when offline.
  exec('chronyc makestep 2>/dev/null || timedatectl set-ntp true 2>/dev/null || true', () => {})

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('window:minimize', () => mainWindow?.minimize())
  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) mainWindow.unmaximize()
    else mainWindow?.maximize()
  })
  ipcMain.on('window:close', () => mainWindow?.close())

  // Renderer requests shell layer changes (called by AppSwitcherOverlay)
  ipcMain.on('shell:sink',  () => sinkShell())
  ipcMain.on('shell:unpin', () => unpinShell())

  // ── App windows: each Cryogram app as its own BrowserWindow ──────────────────
  ipcMain.handle('shell:open-app-window', (_, appId: string) => {
    // Focus existing window if already open
    for (const [id, { win, appId: aid }] of appWindowMap) {
      if (aid === appId && !win.isDestroyed()) {
        win.show()
        win.focus()
        return id
      }
    }

    const display = electronScreen.getPrimaryDisplay()
    const { width, height } = display.workAreaSize
    const defaultSizes: Record<string, [number, number]> = {
      terminal: [900, 580], editor: [1100, 740], 'password-tester': [820, 620],
      leaker: [860, 560], settings: [760, 560], system: [760, 560], files: [860, 580],
      launcher: [760, 560], opticseo: [1280, 820], phone: [780, 600], scanner: [900, 620],
      vpn: [720, 560], notes: [820, 580], mail: [1100, 780], passwords: [860, 600],
      'ssh-keys': [820, 600], firewall: [780, 580], 'task-manager': [900, 600],
      logs: [960, 640], netmon: [900, 600], screenshot: [900, 640], calculator: [560, 520],
      'crypto-tools': [720, 580], 'api-tester': [1100, 720], 'cert-inspector': [780, 580],
      docker: [960, 640], git: [980, 640], database: [960, 640], markdown: [1000, 680],
      trash: [820, 560], shodan: [1100, 720], osint: [1060, 700], cve: [1060, 700],
      'ai-assistant': [820, 640], wordlists: [900, 600], 'json-explorer': [1060, 680],
      totp: [760, 540], regex: [900, 640], 'encoding-chain': [980, 640],
      'packet-sniffer': [1100, 680], backup: [820, 580], 'password-health': [760, 580],
      pomodoro: [560, 700], 'audit-log': [980, 640], 'code-scanner': [1060, 700],
      wallpaper: [820, 580], 'clipboard-history': [720, 580], 'color-picker': [680, 560],
      'unit-converter': [680, 520], 'world-clock': [780, 520], 'image-viewer': [960, 700],
      'rss-reader': [1000, 680], 'remote-desktop': [860, 600],
    }
    const [w, h] = defaultSizes[appId] || [920, 640]
    const x = Math.max(0, Math.floor((width - w) / 2))
    const y = Math.max(0, Math.floor((height - h) / 2))

    const win = new BrowserWindow({
      width: w, height: h, x, y,
      minWidth: 380, minHeight: 280,
      frame: false,
      backgroundColor: '#070b11',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false,
        webviewTag: true,
      },
      show: false,
    })

    if (is.dev) {
      win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}?standalone=${encodeURIComponent(appId)}`)
    } else {
      win.loadFile(join(__dirname, '../renderer/index.html'), {
        query: { standalone: appId }
      })
    }

    win.once('ready-to-show', () => {
      win.show()
      win.focus()
      // Remove any Openbox below-layer rule that may have applied to cryogram-class windows
      try {
        const nativeId = win.getNativeWindowHandle().readUInt32LE(0)
        exec(`wmctrl -i -r 0x${nativeId.toString(16)} -b remove,below 2>/dev/null || true`, () => {})
      } catch {}
    })

    const winId = win.id
    appWindowMap.set(winId, { win, appId })

    win.on('closed', () => {
      appWindowMap.delete(winId)
      mainWindow?.webContents.send('app-window:closed', appId)
    })

    return winId
  })

  ipcMain.on('shell:winctrl-close',    (e) => BrowserWindow.fromWebContents(e.sender)?.close())
  ipcMain.on('shell:winctrl-minimize', (e) => BrowserWindow.fromWebContents(e.sender)?.minimize())
  ipcMain.on('shell:winctrl-maximize', (e) => {
    const w = BrowserWindow.fromWebContents(e.sender)
    if (!w) return
    w.isMaximized() ? w.unmaximize() : w.maximize()
  })

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
    setTimeout(pinToDesktopLayer, 300)
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
  registerClipboardHistoryHandlers()
  registerColorPickerHandlers()
  registerImageViewerHandlers()
  registerRSSReaderHandlers()
  registerRemoteDesktopHandlers()

  createWindow()
  startNotificationBridge()

  // Lock immediately when the lid closes (suspend) so the lock screen is
  // already visible when the display turns back on — no desktop flash on wake.
  powerMonitor.on('suspend',     () => lockScreen())
  powerMonitor.on('resume',      () => lockScreen())  // belt-and-suspenders fallback
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
