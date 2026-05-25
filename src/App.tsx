import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Desktop } from './components/Desktop'
import { WindowManager } from './components/WindowManager'
import { Dock } from './components/Dock'
import { TitleBar } from './components/TitleBar'
import { NotificationToast } from './components/NotificationToast'
import { AnimatedBackground } from './components/AnimatedBackground'
import { BootSplash } from './components/BootSplash'
import { LockScreen } from './components/LockScreen'
import { useDesktopStore } from './store/desktopStore'
import { useLockStore } from './store/lockStore'

export default function App() {
  const [booted, setBooted] = useState(false)
  const wallpaper = useDesktopStore(s => s.wallpaper)
  const { isLocked, lock } = useLockStore()

  // After boot splash: check if PIN is enabled and lock if so
  const handleBooted = useCallback(async () => {
    try {
      const enabled = await window.cryogram.settings.get('pin.enabled')
      const hash    = await window.cryogram.settings.get('pin.hash')
      if (enabled && hash) lock(true)
      else if (enabled) lock(false)  // enabled but no PIN set → just show lock screen without PIN
    } catch {
      // settings unavailable (browser mode) — proceed unlocked
    }
    setBooted(true)
  }, [lock])

  // Forward system notifications to custom event bus
  useEffect(() => {
    const cleanup = window.cryogram.onNotification((n) => {
      const event = new CustomEvent('cryogram:notification', { detail: n })
      window.dispatchEvent(event)
    })
    return cleanup
  }, [])

  // Listen for lock events from main process (resume from sleep, manual lock)
  useEffect(() => {
    const cleanup = (window.cryogram as any).onLock?.(async () => {
      if (!booted) return
      try {
        const enabled = await window.cryogram.settings.get('pin.enabled')
        const hash    = await window.cryogram.settings.get('pin.hash')
        lock(!!(enabled && hash))
      } catch {
        lock(false)
      }
    })
    return cleanup ?? undefined
  }, [booted, lock])

  return (
    <>
      <AnimatePresence>
        {!booted && <BootSplash onDone={handleBooted} />}
      </AnimatePresence>

      <AnimatePresence>
        {booted && (
          <motion.div
            className="flex flex-col h-screen w-screen overflow-hidden"
            style={{ background: '#070b11' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {!wallpaper && <AnimatedBackground />}
            <TitleBar />
            {/* Desktop area: windows float here, dock overlaid at bottom */}
            <div className="flex-1 relative overflow-hidden">
              <Desktop />
              <WindowManager />
              <Dock />
            </div>
            <NotificationToast />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lock screen — rendered on top of everything */}
      <AnimatePresence>
        {booted && isLocked && <LockScreen key="lock" />}
      </AnimatePresence>
    </>
  )
}
