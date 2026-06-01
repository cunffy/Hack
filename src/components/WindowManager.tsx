import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'
import { AppWindow } from './Window'

export function WindowManager() {
  const windows = useWindowStore((s) => s.windows)
  const cssWindows = windows.filter(w => !w.native)

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {cssWindows.map((win) => (
          <AppWindow key={win.id} window={win} />
        ))}
      </AnimatePresence>
    </div>
  )
}
