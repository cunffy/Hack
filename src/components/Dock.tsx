import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppId, useWindowStore } from '../store/windowStore'

const BASE = 52
const MAX_SCALE = 1.52
const MAG_RADIUS = 96

const APPS: { id: AppId; label: string; color: string; icon: React.ReactNode }[] = [
  { id: 'terminal',        label: 'Terminal',        color: '#00ff88', icon: <TermIcon /> },
  { id: 'editor',          label: 'Code Editor',     color: '#00d4ff', icon: <EditorIcon /> },
  { id: 'password-tester', label: 'Password Tester', color: '#ffcc00', icon: <LockIcon /> },
  { id: 'leaker',          label: 'Leaker',           color: '#ff4466', icon: <LeakIcon /> },
  { id: 'files',           label: 'Files',            color: '#f59e0b', icon: <FolderIcon /> },
  { id: 'launcher',        label: 'Launcher',         color: '#34d399', icon: <GridIcon /> },
  { id: 'settings',        label: 'Settings',         color: '#bb88ff', icon: <GearIcon /> },
  { id: 'system',          label: 'System',           color: '#818cf8', icon: <DisplayIcon /> },
]

const GAP = 10

function getScale(mouseX: number | null, idx: number): number {
  if (mouseX === null) return 1
  const center = idx * (BASE + GAP) + BASE / 2
  const dist = Math.abs(mouseX - center)
  if (dist >= MAG_RADIUS) return 1
  const t = 1 - dist / MAG_RADIUS
  return 1 + (MAX_SCALE - 1) * t * t
}

export function Dock() {
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [hovered, setHovered] = useState<AppId | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const { windows, openApp, focusWindow, restoreWindow, minimizeWindow } = useWindowStore()

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = dockRef.current?.getBoundingClientRect()
    if (rect) setMouseX(e.clientX - rect.left)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseX(null)
    setHovered(null)
  }, [])

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-50">
      <div className="relative flex flex-col items-center">
        {/* Tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.92 }}
              transition={{ duration: 0.12 }}
              className="absolute pointer-events-none text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
              style={{
                bottom: '100%',
                marginBottom: 10,
                background: 'rgba(8,12,18,0.96)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                letterSpacing: '0.01em',
              }}
            >
              {APPS.find(a => a.id === hovered)?.label}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dock container */}
        <motion.div
          ref={dockRef}
          className="flex items-end pointer-events-auto"
          style={{
            gap: GAP,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 10,
            paddingBottom: 10,
            background: 'rgba(12,18,28,0.7)',
            backdropFilter: 'blur(40px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 22,
            boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset',
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {APPS.map((app, idx) => {
            const win = windows.find(w => w.appId === app.id)
            const isOpen = !!win
            const isFocused = win?.focused && !win.minimized
            const scale = getScale(mouseX, idx)
            const size = BASE * scale

            return (
              <div
                key={app.id}
                className="relative flex flex-col items-center"
                style={{ width: BASE }}
                onMouseEnter={() => setHovered(app.id)}
              >
                {/* Icon button — grows upward from bottom */}
                <motion.button
                  onClick={() => {
                    if (!win) { openApp(app.id); return }
                    if (win.minimized) { restoreWindow(win.id); focusWindow(win.id); return }
                    if (win.focused) minimizeWindow(win.id)
                    else focusWindow(win.id)
                  }}
                  animate={{ width: size, height: size, y: -(size - BASE) }}
                  transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.6 }}
                  className="relative rounded-[18px] flex items-center justify-center cursor-default overflow-hidden"
                  style={{
                    background: `radial-gradient(ellipse at 38% 28%, ${app.color}22 0%, rgba(10,15,24,0.92) 70%)`,
                    border: isFocused
                      ? `1px solid ${app.color}50`
                      : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: isFocused
                      ? `0 0 28px ${app.color}28, 0 4px 20px rgba(0,0,0,0.55)`
                      : '0 4px 18px rgba(0,0,0,0.45)',
                  }}
                  whileTap={{ scale: 0.84, transition: { duration: 0.07 } }}
                >
                  {/* Shine */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, transparent 55%)',
                      borderRadius: 'inherit',
                    }}
                  />
                  <div style={{ color: app.color }}>{app.icon}</div>
                </motion.button>

                {/* Open dot indicator */}
                <div
                  className="absolute rounded-full transition-all duration-300"
                  style={{
                    bottom: -7,
                    width: isFocused ? 5 : isOpen ? 3 : 0,
                    height: isFocused ? 5 : isOpen ? 3 : 0,
                    background: app.color,
                    boxShadow: isOpen ? `0 0 5px ${app.color}` : 'none',
                    opacity: isOpen ? 1 : 0,
                  }}
                />
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

function TermIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}
function EditorIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
function LeakIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L12 10" /><path d="M12 10 C 12 10 5.5 14.5 5.5 18.5 a 6.5 6.5 0 0 0 13 0 C 18.5 14.5 12 10 12 10Z" />
    </svg>
  )
}
function FolderIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function GridIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function GearIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
function DisplayIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
