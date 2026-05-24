import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'

const APP_COLORS: Record<string, string> = {
  terminal: '#00ff88',
  editor: '#00d4ff',
  'password-tester': '#ffcc00',
  leaker: '#ff4466',
  settings: '#bb88ff',
}

export function Taskbar() {
  const { windows, focusWindow, restoreWindow, minimizeWindow } = useWindowStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="flex items-center h-11 px-3 gap-3 shrink-0 relative"
      style={{
        background: 'rgba(8,12,18,0.92)',
        borderTop: '1px solid rgba(26,40,64,0.7)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top gradient line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2) 50%, transparent)' }}
      />

      {/* Branding pill */}
      <div
        className="flex items-center gap-1.5 px-3 h-7 rounded-lg shrink-0 select-none"
        style={{
          background: 'rgba(0,212,255,0.06)',
          border: '1px solid rgba(0,212,255,0.2)',
        }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-cryo-accent"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ boxShadow: '0 0 5px rgba(0,212,255,0.8)' }}
        />
        <span
          className="text-cryo-accent text-xs font-black tracking-widest"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          CD
        </span>
      </div>

      {/* Window buttons */}
      <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {windows.map((win) => {
            const accent = APP_COLORS[win.appId] ?? '#00d4ff'
            const isActive = win.focused && !win.minimized
            return (
              <motion.button
                key={win.id}
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() => {
                  if (win.minimized) restoreWindow(win.id)
                  else if (win.focused) minimizeWindow(win.id)
                  else focusWindow(win.id)
                }}
                className="relative flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-xs shrink-0 transition-colors"
                style={{
                  background: isActive ? `${accent}14` : 'rgba(13,20,33,0.5)',
                  border: isActive ? `1px solid ${accent}44` : '1px solid rgba(26,40,64,0.6)',
                  color: isActive ? accent : win.minimized ? 'rgba(78,93,110,0.6)' : '#c9d1d9',
                }}
              >
                {/* Active dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: isActive ? accent : 'rgba(78,93,110,0.4)',
                    boxShadow: isActive ? `0 0 5px ${accent}` : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                />
                <span className="max-w-28 truncate">{win.title}</span>

                {/* Active underline */}
                {isActive && (
                  <motion.div
                    layoutId="taskbar-underline"
                    className="absolute bottom-0 left-2 right-2 h-px rounded-full"
                    style={{ background: accent }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Clock */}
      <div className="text-cryo-muted text-xs font-mono shrink-0 tabular-nums">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
