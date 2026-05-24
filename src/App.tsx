import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Desktop } from './components/Desktop'
import { WindowManager } from './components/WindowManager'
import { Dock } from './components/Dock'
import { TitleBar } from './components/TitleBar'
import { NotificationToast } from './components/NotificationToast'
import { AnimatedBackground } from './components/AnimatedBackground'
import { BootSplash } from './components/BootSplash'

export default function App() {
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const cleanup = window.cryogram.onNotification((n) => {
      const event = new CustomEvent('cryogram:notification', { detail: n })
      window.dispatchEvent(event)
    })
    return cleanup
  }, [])

  return (
    <>
      <AnimatePresence>
        {!booted && <BootSplash onDone={() => setBooted(true)} />}
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
            <AnimatedBackground />
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
    </>
  )
}
