import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppId, useWindowStore } from '../store/windowStore'

const BASE = 48
const MAX_SCALE = 1.55
const MAG_RADIUS = 90
const GAP = 10

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

interface X11Window { id: string; title: string }

function getScale(mouseX: number | null, idx: number, total: number, isExternal = false, extOffset = 0): number {
  if (mouseX === null) return 1
  const offset = isExternal ? (total * (BASE + GAP) + 20 + extOffset) : 0
  const center = (isExternal ? extOffset : idx * (BASE + GAP)) + BASE / 2 + offset
  const dist = Math.abs(mouseX - center)
  if (dist >= MAG_RADIUS) return 1
  const t = 1 - dist / MAG_RADIUS
  return 1 + (MAX_SCALE - 1) * t * t
}

export function Dock() {
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [x11Windows, setX11Windows] = useState<X11Window[]>([])
  const dockRef = useRef<HTMLDivElement>(null)
  const { windows, openApp, focusWindow, restoreWindow, minimizeWindow } = useWindowStore()

  // Poll X11 windows every 2s so external apps (Opera, etc.) appear in dock
  useEffect(() => {
    const poll = async () => {
      try {
        const all: X11Window[] = await window.cryogram.wm?.getWindows() ?? []
        // Filter out: Cryogram itself, desktop windows, hidden windows (desktop -1)
        const external = all.filter(w =>
          w.desktop >= 0 &&
          !w.title.toLowerCase().includes('cryogram') &&
          w.title !== '' &&
          w.title !== 'Desktop'
        )
        setX11Windows(external)
      } catch { /* wmctrl not available in dev */ }
    }
    poll()
    const id = setInterval(poll, 2000)
    return () => clearInterval(id)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = dockRef.current?.getBoundingClientRect()
    if (rect) setMouseX(e.clientX - rect.left)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseX(null)
    setHovered(null)
  }, [])

  const dockStyle: React.CSSProperties = {
    gap: GAP,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8,
    background: 'rgba(10,15,24,0.72)',
    backdropFilter: 'blur(40px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    boxShadow: '0 8px 40px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.06) inset',
  }

  return (
    <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-50">
      <div className="relative flex flex-col items-end">

        {/* Tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.1 }}
              className="absolute pointer-events-none text-xs px-2.5 py-1 rounded-lg whitespace-nowrap"
              style={{
                bottom: 'calc(100% + 6px)',
                right: 0,
                left: 0,
                textAlign: 'center',
                background: 'rgba(8,12,18,0.97)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              {hovered}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dock */}
        <motion.div
          ref={dockRef}
          className="flex items-end pointer-events-auto"
          style={dockStyle}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {/* ── Internal Cryogram apps ── */}
          {APPS.map((app, idx) => {
            const win = windows.find(w => w.appId === app.id)
            const isOpen = !!win
            const isFocused = win?.focused && !win.minimized
            const scale = getScale(mouseX, idx, APPS.length)
            const size = BASE * scale

            return (
              <DockItem
                key={app.id}
                label={app.label}
                color={app.color}
                size={size}
                baseSize={BASE}
                isOpen={isOpen}
                isFocused={isFocused}
                onHover={() => setHovered(app.label)}
                onClick={() => {
                  if (!win) { openApp(app.id); return }
                  if (win.minimized) { restoreWindow(win.id); focusWindow(win.id); return }
                  if (win.focused) minimizeWindow(win.id)
                  else focusWindow(win.id)
                }}
              >
                {app.icon}
              </DockItem>
            )
          })}

          {/* ── Separator + External X11 windows ── */}
          {x11Windows.length > 0 && (
            <>
              <div
                className="self-stretch mx-1 rounded-full"
                style={{ width: 1, background: 'rgba(255,255,255,0.12)', margin: '8px 6px' }}
              />
              {x11Windows.map((xwin, idx) => {
                const scale = getScale(mouseX, APPS.length + 1 + idx, APPS.length)
                const size = BASE * scale
                const shortTitle = xwin.title.length > 14 ? xwin.title.slice(0, 13) + '…' : xwin.title
                return (
                  <DockItem
                    key={xwin.id}
                    label={xwin.title}
                    color="#94a3b8"
                    size={size}
                    baseSize={BASE}
                    isOpen={true}
                    isFocused={false}
                    onHover={() => setHovered(xwin.title)}
                    onClick={async () => {
                      try { await window.cryogram.wm?.focusWindow(xwin.id) } catch {}
                    }}
                  >
                    <AppWindowIcon shortTitle={shortTitle} />
                  </DockItem>
                )
              })}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ── Shared dock item ──────────────────────────────────────────────────────
function DockItem({
  children, label, color, size, baseSize, isOpen, isFocused, onHover, onClick,
}: {
  children: React.ReactNode
  label: string
  color: string
  size: number
  baseSize: number
  isOpen: boolean
  isFocused: boolean
  onHover: () => void
  onClick: () => void
}) {
  return (
    <div
      className="flex flex-col items-center"
      style={{ width: baseSize }}
      onMouseEnter={onHover}
    >
      <motion.button
        onClick={onClick}
        animate={{ width: size, height: size, y: -(size - baseSize) }}
        transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.6 }}
        className="relative rounded-[16px] flex items-center justify-center cursor-default overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 38% 28%, ${color}20 0%, rgba(10,15,24,0.92) 70%)`,
          border: isFocused ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.07)',
          boxShadow: isFocused ? `0 0 24px ${color}25, 0 4px 18px rgba(0,0,0,0.5)` : '0 4px 14px rgba(0,0,0,0.4)',
        }}
        whileTap={{ scale: 0.86, transition: { duration: 0.07 } }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 55%)', borderRadius: 'inherit' }}
        />
        <div style={{ color }}>{children}</div>
      </motion.button>

      {/* Label */}
      <div
        className="mt-1 text-center pointer-events-none leading-none select-none truncate"
        style={{
          fontSize: 9,
          maxWidth: baseSize,
          color: isFocused ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          transition: 'color 0.2s',
        }}
      >
        {label}
      </div>

      {/* Open dot */}
      <div
        className="rounded-full mt-0.5 transition-all duration-300"
        style={{
          width: isFocused ? 4 : isOpen ? 3 : 0,
          height: isFocused ? 4 : isOpen ? 3 : 0,
          background: color,
          boxShadow: isOpen ? `0 0 5px ${color}` : 'none',
          opacity: isOpen ? 1 : 0,
        }}
      />
    </div>
  )
}

function AppWindowIcon({ shortTitle }: { shortTitle: string }) {
  return (
    <div
      className="flex items-center justify-center w-6 h-6 rounded text-center leading-none"
      style={{
        fontSize: shortTitle.length > 6 ? 7 : 9,
        color: '#94a3b8',
        fontFamily: '-apple-system, sans-serif',
        fontWeight: 600,
      }}
    >
      {shortTitle.slice(0, 8)}
    </div>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────
function TermIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
}
function EditorIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
}
function LockIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}
function LeakIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L12 10"/><path d="M12 10 C12 10 5.5 14.5 5.5 18.5a6.5 6.5 0 0 0 13 0C18.5 14.5 12 10 12 10Z"/></svg>
}
function FolderIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
}
function GridIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
}
function GearIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}
function DisplayIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
}
