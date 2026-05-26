import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'
import { APP_META } from './Dock'

interface Props { open: boolean; onClose: () => void }

export function MissionControl({ open, onClose }: Props) {
  const { windows, focusWindow, restoreWindow } = useWindowStore()

  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  const nonMinimized = windows
  const cols = Math.ceil(Math.sqrt(Math.max(nonMinimized.length, 1)))

  const activate = (id: string) => {
    restoreWindow(id)
    focusWindow(id)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mission-control"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 99980, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}
        >
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            Mission Control
          </motion.div>

          {windows.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>
              No open windows
            </motion.div>
          ) : (
            <div
              onClick={e => e.stopPropagation()}
              style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, padding: '0 40px', maxWidth: '90vw' }}
            >
              {nonMinimized.map((win, i) => {
                const meta = APP_META[win.appId as keyof typeof APP_META]
                const color = meta?.color ?? '#00d4ff'
                return (
                  <motion.div
                    key={win.id}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => activate(win.id)}
                    style={{ cursor: 'pointer', background: 'rgba(12,16,26,0.85)', border: `1px solid ${win.focused ? color : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, overflow: 'hidden', width: 200, boxShadow: win.focused ? `0 0 20px ${color}33` : 'none', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = win.focused ? color : 'rgba(255,255,255,0.1)' }}
                  >
                    {/* Title bar replica */}
                    <div style={{ padding: '8px 12px', background: `${color}18`, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {win.title}
                      </span>
                    </div>
                    {/* Preview area */}
                    <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 28, color, opacity: 0.7 }}>
                        {meta?.icon}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                        {win.minimized ? 'Minimized' : `${win.width}×${win.height}`}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
