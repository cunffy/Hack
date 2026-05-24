import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'

const APP_COLORS: Record<string, string> = {
  terminal:          '#00ff88',
  editor:            '#00d4ff',
  'password-tester': '#ffcc00',
  leaker:            '#ff4466',
  settings:          '#bb88ff',
  files:             '#f59e0b',
  launcher:          '#34d399',
  system:            '#818cf8',
}

export function Taskbar() {
  const { windows, focusWindow, restoreWindow, minimizeWindow } = useWindowStore()

  return (
    <div
      className="flex items-center h-10 px-3 gap-2 shrink-0 relative select-none"
      style={{
        background: 'rgba(8,12,18,0.93)',
        borderTop: '1px solid rgba(26,40,64,0.7)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top gradient edge */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.18) 50%, transparent)' }}
      />

      {/* Logo mark */}
      <div
        className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
        style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.18)' }}
        title="Cryogram"
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-cryo-accent text-sm"
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.9))' }}
        >
          ⬡
        </motion.div>
      </div>

      {/* Divider */}
      <div className="w-px h-5 shrink-0" style={{ background: 'rgba(26,40,64,0.8)' }} />

      {/* Window buttons — scrollable row */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto scrollbar-none">
        <AnimatePresence initial={false}>
          {windows.map((win) => {
            const accent = APP_COLORS[win.appId] ?? '#00d4ff'
            const isActive = win.focused && !win.minimized
            return (
              <motion.button
                key={win.id}
                initial={{ opacity: 0, scale: 0.75, x: -12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.75, x: -12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                onClick={() => {
                  if (win.minimized) restoreWindow(win.id)
                  else if (win.focused) minimizeWindow(win.id)
                  else focusWindow(win.id)
                }}
                className="relative flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-xs shrink-0 transition-all"
                style={{
                  background: isActive ? `${accent}14` : 'rgba(13,20,33,0.5)',
                  border: isActive ? `1px solid ${accent}40` : '1px solid rgba(26,40,64,0.55)',
                  color: isActive ? accent : win.minimized ? 'rgba(78,93,110,0.55)' : '#c9d1d9',
                  maxWidth: 160,
                  boxShadow: isActive ? `0 0 12px ${accent}18` : 'none',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 transition-all"
                  style={{
                    background: isActive ? accent : win.minimized ? 'rgba(78,93,110,0.3)' : 'rgba(78,93,110,0.5)',
                    boxShadow: isActive ? `0 0 6px ${accent}` : 'none',
                  }}
                />
                <span className="truncate">{win.title}</span>

                {isActive && (
                  <motion.div
                    layoutId="taskbar-active"
                    className="absolute bottom-0 left-2 right-2 h-px rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>

        {windows.length === 0 && (
          <span className="text-xs text-cryo-muted/40 pl-1 italic">No open apps</span>
        )}
      </div>
    </div>
  )
}
