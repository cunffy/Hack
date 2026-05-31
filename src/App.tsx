import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Desktop } from './components/Desktop'
import { WindowManager } from './components/WindowManager'
import { Dock } from './components/Dock'
import { TitleBar } from './components/TitleBar'
import { NotificationToast } from './components/NotificationToast'
import { SystemHUD } from './components/Taskbar'
import { AppSwitcherOverlay } from './components/AppSwitcherOverlay'
import { AnimatedBackground } from './components/AnimatedBackground'
import { BootSplash } from './components/BootSplash'
import { LockScreen } from './components/LockScreen'
import { ThemeProvider } from './components/ThemeProvider'
import { UpdateNotification } from './components/UpdateNotification'
import { UpdateScreen } from './components/UpdateScreen'
import { SpotlightSearch } from './components/SpotlightSearch'
import { DesktopWidgets } from './components/DesktopWidgets'
import { NotificationHistory } from './components/NotificationHistory'
import { SetupWizard } from './components/SetupWizard'
import { ClipboardManager } from './components/ClipboardManager'
import { MissionControl } from './components/MissionControl'
import { KeyboardShortcutsOverlay } from './components/KeyboardShortcutsOverlay'
import { useDesktopStore } from './store/desktopStore'
import { useLockStore } from './store/lockStore'
import { useWindowStore } from './store/windowStore'

interface UpdateInfo { commitCount: number; changes: string[] }

export default function App() {
  const [booted, setBooted] = useState(false)
  const wallpaper = useDesktopStore(s => s.wallpaper)
  const { isLocked, lock } = useLockStore()
  const openApp = useWindowStore(s => s.openApp)
  const snapWindow = useWindowStore(s => s.snapWindow)
  const focusedWinId = useWindowStore(s => s.windows.find(w => w.focused && !w.minimized)?.id)

  const [updateInfo, setUpdateInfo]       = useState<UpdateInfo | null>(null)
  const [showUpdateScreen, setShowScreen] = useState(false)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [notifHistoryOpen, setNotifHistoryOpen] = useState(false)
  const [clipboardOpen, setClipboardOpen] = useState(false)
  const [missionControlOpen, setMissionControlOpen] = useState(false)
  const [kbShortcutsOpen, setKbShortcutsOpen] = useState(false)
  const [setupDone, setSetupDone]         = useState(true)

  // After boot splash: check if PIN is enabled and lock if so; check setup wizard
  const handleBooted = useCallback(async () => {
    try {
      const enabled = await window.cryogram.settings.get('pin.enabled')
      const hash    = await window.cryogram.settings.get('pin.hash')
      if (enabled && hash) lock(true)
      else if (enabled) lock(false)
    } catch {}
    try {
      const done = await window.cryogram.settings.get('setup.done')
      if (!done) setSetupDone(false)
    } catch {}
    setBooted(true)
  }, [lock])

  // Check for updates 8s after boot (non-blocking)
  useEffect(() => {
    if (!booted) return
    const t = setTimeout(async () => {
      try {
        const api = (window as any).cryogram?.updater
        if (!api) return
        const result = await api.check()
        if (result?.hasUpdate) {
          setUpdateInfo({ commitCount: result.commitCount, changes: result.changes ?? [] })
        }
      } catch {}
    }, 8000)
    return () => clearTimeout(t)
  }, [booted])

  // Expose manual update trigger globally so Settings can call it
  useEffect(() => {
    ;(window as any).__cryogram_checkUpdate = async () => {
      try {
        const api = (window as any).cryogram?.updater
        if (!api) return
        const result = await api.check()
        if (result?.hasUpdate) {
          setUpdateInfo({ commitCount: result.commitCount, changes: result.changes ?? [] })
        } else {
          setUpdateInfo(null)
        }
        return result
      } catch { return { hasUpdate: false } }
    }
    ;(window as any).__cryogram_startUpdate = () => {
      setUpdateInfo(null)
      setShowScreen(true)
    }
    return () => {
      delete (window as any).__cryogram_checkUpdate
      delete (window as any).__cryogram_startUpdate
    }
  }, [])

  // Forward system notifications to custom event bus
  useEffect(() => {
    const cleanup = window.cryogram.onNotification((n) => {
      const event = new CustomEvent('cryogram:notification', { detail: n })
      window.dispatchEvent(event)
    })
    return cleanup
  }, [])

  // Listen for lock events from main process
  useEffect(() => {
    const cleanup = (window.cryogram as any).onLock?.(async () => {
      if (!booted) return
      try {
        const enabled = await window.cryogram.settings.get('pin.enabled')
        const hash    = await window.cryogram.settings.get('pin.hash')
        lock(!!(enabled && hash))
      } catch { lock(false) }
    })
    return cleanup ?? undefined
  }, [booted, lock])

  // Global shortcut → open app
  useEffect(() => {
    const cleanup = (window.cryogram as any).onOpenApp?.((appId: string) => {
      openApp(appId as any)
    })
    return cleanup ?? undefined
  }, [openApp])

  // Global shortcut → spotlight
  useEffect(() => {
    const cleanup = (window.cryogram as any).onSpotlight?.(() => {
      setSpotlightOpen(o => !o)
    })
    return cleanup ?? undefined
  }, [])

  // Super+arrows window snapping — snap focused internal window
  useEffect(() => {
    const cleanup = (window.cryogram as any).onSnap?.((side: 'left' | 'right' | 'max') => {
      if (focusedWinId) snapWindow(focusedWinId, side)
    })
    return cleanup ?? undefined
  }, [focusedWinId, snapWindow])

  // Inactivity auto-lock
  useEffect(() => {
    if (!booted) return
    let minutes = 0
    window.cryogram.settings.get('autolock.minutes').then((v: any) => { minutes = typeof v === 'number' ? v : 0 }).catch(() => {})

    let timer: ReturnType<typeof setTimeout>
    const reset = () => {
      clearTimeout(timer)
      if (!minutes) return
      timer = setTimeout(async () => {
        if (isLocked) return
        try {
          const enabled = await window.cryogram.settings.get('pin.enabled')
          const hash    = await window.cryogram.settings.get('pin.hash')
          lock(!!(enabled && hash))
        } catch { lock(false) }
      }, minutes * 60 * 1000)
    }

    const reread = async () => {
      const v = await window.cryogram.settings.get('autolock.minutes').catch(() => 0)
      minutes = typeof v === 'number' ? v : 0
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'] as const
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    window.addEventListener('cryogram:autolock-changed', reread as any)
    reset()

    return () => {
      clearTimeout(timer)
      events.forEach(e => window.removeEventListener(e, reset))
      window.removeEventListener('cryogram:autolock-changed', reread as any)
    }
  }, [booted, isLocked, lock])

  // Keyboard shortcuts (Alt+Tab is handled by globalShortcut in main process)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+Space → spotlight
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault()
        setSpotlightOpen(o => !o)
      }
      // Ctrl+Shift+V → clipboard history (skip when xterm has focus)
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyV') {
        const inTerminal = !!(e.target as HTMLElement)?.closest('.xterm-helper-textarea, .xterm-screen, .xterm-viewport')
        if (!inTerminal) {
          e.preventDefault()
          setClipboardOpen(o => !o)
        }
      }
      // Super+M → Mission Control
      if (e.metaKey && e.code === 'KeyM') {
        e.preventDefault()
        setMissionControlOpen(o => !o)
      }
      // Ctrl+/ → Keyboard shortcuts
      if (e.ctrlKey && e.code === 'Slash') {
        e.preventDefault()
        setKbShortcutsOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Expose notification history toggle globally (for TitleBar bell icon)
  useEffect(() => {
    ;(window as any).__cryogram_toggleNotifHistory = () => setNotifHistoryOpen(o => !o)
    return () => { delete (window as any).__cryogram_toggleNotifHistory }
  }, [])

  return (
    <ThemeProvider>
    <>
      <AnimatePresence>
        {!booted && <BootSplash onDone={handleBooted} />}
      </AnimatePresence>

      <AnimatePresence>
        {booted && (
          <motion.div
            className="flex flex-col h-screen w-screen overflow-hidden"
            style={{ background: 'var(--cryo-bg, #070b11)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Full-screen background layer */}
            {!wallpaper && <AnimatedBackground />}
            {wallpaper && (
              <img
                src={wallpaper.startsWith('file://') ? wallpaper : `file://${wallpaper}`}
                alt=""
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                draggable={false}
              />
            )}
            {/* Vignette depth overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(0,0,0,0.45) 100%)',
                zIndex: 1,
              }}
            />
            <TitleBar />
            <div className="flex-1 relative overflow-hidden">
              <Desktop />
              <WindowManager />
              <Dock />
            </div>
            <NotificationToast />
            <SystemHUD />

            <DesktopWidgets />
            <AppSwitcherOverlay />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lock screen */}
      <AnimatePresence>
        {booted && isLocked && <LockScreen key="lock" />}
      </AnimatePresence>

      {/* Update notification popup */}
      <AnimatePresence>
        {booted && updateInfo && !showUpdateScreen && (
          <UpdateNotification
            key="update-notif"
            info={updateInfo}
            onUpdate={() => { setUpdateInfo(null); setShowScreen(true) }}
            onDismiss={() => setUpdateInfo(null)}
          />
        )}
      </AnimatePresence>

      {/* Update screen overlay */}
      <AnimatePresence>
        {showUpdateScreen && (
          <UpdateScreen
            key="update-screen"
            onCancel={() => setShowScreen(false)}
          />
        )}
      </AnimatePresence>

      {/* Spotlight search */}
      <SpotlightSearch open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />

      {/* Notification history panel */}
      <NotificationHistory open={notifHistoryOpen} onClose={() => setNotifHistoryOpen(false)} />

      {/* Clipboard history panel */}
      <ClipboardManager open={clipboardOpen} onClose={() => setClipboardOpen(false)} />

      {/* Mission Control (Super+M) */}
      <MissionControl open={missionControlOpen} onClose={() => setMissionControlOpen(false)} />

      {/* Keyboard shortcuts overlay (Ctrl+/) */}
      <KeyboardShortcutsOverlay open={kbShortcutsOpen} onClose={() => setKbShortcutsOpen(false)} />

      {/* First-run setup wizard */}
      <AnimatePresence>
        {booted && !setupDone && (
          <SetupWizard
            key="setup"
            onComplete={async () => {
              await window.cryogram.settings.set('setup.done', true)
              setSetupDone(true)
            }}
          />
        )}
      </AnimatePresence>
    </>
    </ThemeProvider>
  )
}
