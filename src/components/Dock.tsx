import { useState, useRef, useCallback, useEffect } from 'react'
import { Reorder, motion, AnimatePresence } from 'framer-motion'
import { AppId, useWindowStore } from '../store/windowStore'
import { useDockStore } from '../store/dockStore'
import { useDesktopStore } from '../store/desktopStore'
import { ContextMenu, MenuItem } from './ContextMenu'

const BASE = 48
const MAX_SCALE = 1.52
const MAG_RADIUS = 88

function getX11Meta(title: string): { icon: string; color: string; name: string } {
  const t = title.toLowerCase()
  const last = title.split(' - ').pop()?.trim() ?? title
  const firstName = last.split(' ')[0]
  if (t.includes('brave'))    return { icon: '🦁', color: '#fb923c', name: 'Brave' }
  if (t.includes('chromium')) return { icon: '🌐', color: '#4ade80', name: 'Chromium' }
  if (t.includes('chrome'))   return { icon: '🌐', color: '#4ade80', name: 'Chrome' }
  if (t.includes('firefox'))  return { icon: '🦊', color: '#f97316', name: 'Firefox' }
  if (t.includes('visual studio code') || t.includes('vscode')) return { icon: '💻', color: '#60a5fa', name: 'VS Code' }
  if (t.includes('thunar') || t.includes('nautilus'))           return { icon: '📁', color: '#f59e0b', name: 'Files' }
  if (t.includes('vlc') || t.includes(' mpv'))                  return { icon: '▶',  color: '#f43f5e', name: 'Media' }
  if (t.includes('discord'))  return { icon: '💬', color: '#818cf8', name: 'Discord' }
  if (t.includes('slack'))    return { icon: '💬', color: '#4ade80', name: 'Slack' }
  if (t.includes('spotify'))  return { icon: '🎵', color: '#4ade80', name: 'Spotify' }
  if (t.includes('gimp'))     return { icon: '🎨', color: '#e879f9', name: 'GIMP' }
  const name = firstName.length > 11 ? firstName.slice(0, 10) + '…' : firstName
  return { icon: '⬡', color: '#64748b', name: name || 'App' }
}

export const APP_META: Record<AppId, { label: string; color: string; icon: React.ReactNode }> = {
  terminal:          { label: 'Terminal',        color: '#00ff88', icon: <TermIcon /> },
  editor:            { label: 'Code Editor',     color: '#00d4ff', icon: <EditorIcon /> },
  'password-tester': { label: 'Password Tester', color: '#ffcc00', icon: <ShieldLockIcon /> },
  leaker:            { label: 'Leaker',           color: '#ff4466', icon: <LeakIcon /> },
  files:             { label: 'Files',            color: '#f59e0b', icon: <FolderIcon /> },
  launcher:          { label: 'Launcher',         color: '#34d399', icon: <GridIcon /> },
  settings:          { label: 'Settings',         color: '#bb88ff', icon: <GearIcon /> },
  system:            { label: 'System',           color: '#818cf8', icon: <PulseIcon /> },
  opticseo:          { label: 'OpticSEO Pro',     color: '#10b981', icon: <OpticSEOIcon /> },
  phone:             { label: 'Phone',            color: '#a855f7', icon: <PhoneIcon /> },
  scanner:           { label: 'Net Scanner',      color: '#00ff88', icon: <ScannerIcon /> },
  vpn:               { label: 'VPN',              color: '#a78bfa', icon: <VPNIcon /> },
  notes:             { label: 'Notes',            color: '#fbbf24', icon: <NotesIcon /> },
}

interface X11Win { id: string; desktop: number; title: string }
interface CtxState { x: number; y: number; appId: AppId }

export function Dock() {
  const { order, setOrder, removeApp } = useDockStore()
  const addDesktopIcon = useDesktopStore(s => s.addIcon)
  const { windows, openApp, focusWindow, restoreWindow, minimizeWindow } = useWindowStore()

  const [mouseX, setMouseX]     = useState<number | null>(null)
  const [hovered, setHovered]   = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [x11Windows, setX11Windows] = useState<X11Win[]>([])
  const [ctx, setCtx]           = useState<CtxState | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const poll = async () => {
      try {
        const all: X11Win[] = await (window.cryogram as any).wm?.getWindows() ?? []
        setX11Windows(all.filter(w =>
          w.desktop >= 0 &&
          !w.title.toLowerCase().includes('cryogram') &&
          w.title.trim() !== '' && w.title !== 'Desktop'
        ))
      } catch {}
    }
    poll(); const id = setInterval(poll, 2000); return () => clearInterval(id)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) return
    const rect = dockRef.current?.getBoundingClientRect()
    if (rect) setMouseX(e.clientX - rect.left)
  }, [dragging])

  const onMouseLeave = useCallback(() => {
    setMouseX(null); setHovered(null)
  }, [])

  function getScale(idx: number): number {
    if (mouseX === null || dragging) return 1
    const center = idx * (BASE + 10) + BASE / 2
    const dist = Math.abs(mouseX - center)
    if (dist >= MAG_RADIUS) return 1
    const t = 1 - dist / MAG_RADIUS
    return 1 + (MAX_SCALE - 1) * t * t
  }

  return (
    <>
      <AnimatePresence>
        {ctx && (
          <ContextMenu
            x={ctx.x} y={ctx.y}
            onClose={() => setCtx(null)}
            items={[
              {
                label: windows.find(w => w.appId === ctx.appId) ? 'Focus Window' : 'Open',
                action: () => {
                  const win = windows.find(w => w.appId === ctx.appId)
                  if (!win) openApp(ctx.appId)
                  else { restoreWindow(win.id); focusWindow(win.id) }
                },
              },
              { label: 'Add to Desktop', action: () => addDesktopIcon(ctx.appId) },
              { sep: true },
              { label: 'Remove from Dock', danger: true, action: () => removeApp(ctx.appId) },
            ] as MenuItem[]}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="relative flex flex-col items-center">
          <AnimatePresence>
            {hovered && !dragging && (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.1 }}
                className="absolute pointer-events-none text-xs px-2.5 py-1 rounded-lg whitespace-nowrap"
                style={{
                  bottom: 'calc(100% + 6px)',
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

          <div
            ref={dockRef}
            className="flex items-end pointer-events-auto"
            style={{
              paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
              background: 'rgba(12,16,26,0.80)',
              backdropFilter: 'blur(40px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 22,
              boxShadow: '0 8px 40px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.06) inset',
              gap: 10,
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            <Reorder.Group
              axis="x"
              values={order}
              onReorder={setOrder}
              className="flex items-end"
              style={{ gap: 10, listStyle: 'none', padding: 0, margin: 0 }}
            >
              {order.map((appId, idx) => {
                const meta = APP_META[appId]
                if (!meta) return null
                const win = windows.find(w => w.appId === appId)
                const isOpen      = !!win
                const isMinimized = !!win?.minimized
                const isFocused   = win?.focused && !win.minimized
                const scale = getScale(idx)
                const size  = BASE * scale

                return (
                  <Reorder.Item
                    key={appId}
                    value={appId}
                    onDragStart={() => { setDragging(true); setHovered(null) }}
                    onDragEnd={() => setDragging(false)}
                    style={{ listStyle: 'none' }}
                  >
                    <div
                      className="flex flex-col items-center cursor-default"
                      style={{ width: BASE }}
                      onMouseEnter={() => setHovered(meta.label)}
                      onContextMenu={e => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY - 8, appId }) }}
                    >
                      <motion.button
                        onClick={() => {
                          if (!win) { openApp(appId); return }
                          if (win.minimized) { restoreWindow(win.id); focusWindow(win.id); return }
                          if (win.focused) minimizeWindow(win.id)
                          else focusWindow(win.id)
                        }}
                        animate={{ width: size, height: size, y: -(size - BASE) }}
                        transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.6 }}
                        className="relative rounded-2xl flex items-center justify-center overflow-hidden"
                        style={{
                          background: `radial-gradient(ellipse at 38% 28%, ${meta.color}25, rgba(10,15,24,0.92) 70%)`,
                          border: isFocused ? `1px solid ${meta.color}50` : '1px solid rgba(255,255,255,0.07)',
                          boxShadow: isFocused
                            ? `0 0 24px ${meta.color}25, 0 4px 18px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset`
                            : '0 6px 20px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset',
                        }}
                        whileTap={!dragging ? { scale: 0.88, transition: { duration: 0.07 } } : undefined}
                      >
                        <div className="absolute inset-0 pointer-events-none"
                          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 55%)' }} />
                        <div style={{ color: meta.color }}>{meta.icon}</div>
                      </motion.button>

                      <div
                        className="mt-1 text-center leading-none select-none truncate pointer-events-none"
                        style={{
                          fontSize: 9, maxWidth: BASE,
                          color: isFocused ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                          transition: 'color 0.2s',
                        }}
                      >
                        {meta.label}
                      </div>
                      <div className="flex gap-0.5 mt-0.5 items-center justify-center" style={{ height: 5 }}>
                        {isOpen && !isMinimized && (
                          <div className="rounded-full transition-all duration-300" style={{
                            width: isFocused ? 5 : 3, height: isFocused ? 5 : 3,
                            background: meta.color,
                            boxShadow: isFocused ? `0 0 6px ${meta.color}` : 'none',
                          }} />
                        )}
                        {isMinimized && (
                          <div className="rounded-full transition-all duration-300" style={{
                            width: 3, height: 3, background: 'rgba(255,255,255,0.3)',
                          }} />
                        )}
                      </div>
                    </div>
                  </Reorder.Item>
                )
              })}
            </Reorder.Group>

            {x11Windows.length > 0 && (
              <>
                <div className="self-stretch"
                  style={{ width: 1, background: 'rgba(255,255,255,0.12)', margin: '6px 4px' }} />
                {x11Windows.map(xwin => {
                  const meta = getX11Meta(xwin.title)
                  return (
                    <div
                      key={xwin.id}
                      className="flex flex-col items-center cursor-default"
                      style={{ width: BASE }}
                      onMouseEnter={() => setHovered(meta.name)}
                    >
                      <motion.button
                        onClick={async () => {
                          try {
                            // Hide the shell so the external window becomes visible
                            await (window.cryogram as any).wm?.hideShell()
                            // Small delay lets the shell minimize before wmctrl raises the target
                            await new Promise(r => setTimeout(r, 120))
                            await (window.cryogram as any).wm?.focusWindow(xwin.id)
                          } catch {}
                        }}
                        animate={{ width: BASE, height: BASE }}
                        className="relative rounded-2xl flex items-center justify-center overflow-hidden"
                        style={{
                          background: `radial-gradient(ellipse at 38% 28%, ${meta.color}18, rgba(10,15,24,0.92) 70%)`,
                          border: `1px solid ${meta.color}28`,
                        }}
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
                      >
                        <div className="absolute inset-0 pointer-events-none"
                          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 55%)' }} />
                        <span style={{ fontSize: 22 }}>{meta.icon}</span>
                      </motion.button>
                      <div
                        className="mt-1 text-center leading-none select-none pointer-events-none truncate"
                        style={{ fontSize: 9, maxWidth: BASE, color: `${meta.color}bb`, fontFamily: '-apple-system, sans-serif' }}
                      >
                        {meta.name}
                      </div>
                      <div className="rounded-full mt-0.5"
                        style={{ width: 3, height: 3, background: meta.color, opacity: 0.75 }} />
                    </div>
                  )
                })}
              </>
            )}
          </div>

          <motion.div
            className="mt-1.5 text-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
            style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', fontFamily: '-apple-system, sans-serif' }}
          >
            Drag to reorder · Right-click for options · Super+D to show/hide shell
          </motion.div>
        </div>
      </div>
    </>
  )
}

// ── Dock Icon Components ───────────────────────────────────────────────────

function TermIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17l6-6-6-6"/>
      <line x1="12" y1="17" x2="20" y2="17"/>
    </svg>
  )
}

function EditorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}

function ShieldLockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <rect x="9" y="11" width="6" height="5" rx="1"/>
      <path d="M12 8v3"/>
    </svg>
  )
}

function LeakIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function PulseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}

function OpticSEOIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <polyline points="8 13 11 10 13 12 16 8"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  )
}

function ScannerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"/>
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
    </svg>
  )
}

function VPNIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function NotesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  )
}
