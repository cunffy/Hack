import { useState, useRef, useCallback, useEffect } from 'react'
import { Reorder, motion, AnimatePresence } from 'framer-motion'
import { AppId, useWindowStore } from '../store/windowStore'
import { useDockStore } from '../store/dockStore'
import { useDesktopStore } from '../store/desktopStore'
import { ContextMenu, MenuItem } from './ContextMenu'

const BASE = 48
const MAX_SCALE = 1.52
const MAG_RADIUS = 88

export const APP_META: Record<AppId, { label: string; color: string; icon: React.ReactNode }> = {
  terminal:          { label: 'Terminal',        color: '#00ff88', icon: <TermIcon /> },
  editor:            { label: 'Code Editor',     color: '#00d4ff', icon: <EditorIcon /> },
  'password-tester': { label: 'Password Tester', color: '#ffcc00', icon: <LockIcon /> },
  leaker:            { label: 'Leaker',           color: '#ff4466', icon: <LeakIcon /> },
  files:             { label: 'Files',            color: '#f59e0b', icon: <FolderIcon /> },
  launcher:          { label: 'Launcher',         color: '#34d399', icon: <GridIcon /> },
  settings:          { label: 'Settings',         color: '#bb88ff', icon: <GearIcon /> },
  system:            { label: 'System',           color: '#818cf8', icon: <DisplayIcon /> },
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

  // Poll external X11 windows every 2 s
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
              {
                label: 'Add to Desktop',
                action: () => addDesktopIcon(ctx.appId),
              },
              { sep: true },
              {
                label: 'Remove from Dock',
                danger: true,
                action: () => removeApp(ctx.appId),
              },
            ] as MenuItem[]}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="relative flex flex-col items-center">
          {/* Tooltip */}
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

          {/* Dock glass pill */}
          <div
            ref={dockRef}
            className="flex items-end pointer-events-auto"
            style={{
              paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
              background: 'rgba(10,15,24,0.72)',
              backdropFilter: 'blur(40px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              boxShadow: '0 8px 40px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.06) inset',
              gap: 10,
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            {/* Reorderable internal apps */}
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
                const isOpen    = !!win
                const isFocused = win?.focused && !win.minimized
                const scale     = getScale(idx)
                const size      = BASE * scale

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
                      onContextMenu={e => {
                        e.preventDefault()
                        setCtx({ x: e.clientX, y: e.clientY - 8, appId })
                      }}
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
                          background: `radial-gradient(ellipse at 38% 28%, ${meta.color}20, rgba(10,15,24,0.92) 70%)`,
                          border: isFocused ? `1px solid ${meta.color}50` : '1px solid rgba(255,255,255,0.07)',
                          boxShadow: isFocused
                            ? `0 0 24px ${meta.color}25, 0 4px 18px rgba(0,0,0,0.5)`
                            : '0 4px 14px rgba(0,0,0,0.4)',
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
                          fontSize: 9,
                          maxWidth: BASE,
                          color: isFocused ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                          transition: 'color 0.2s',
                        }}
                      >
                        {meta.label}
                      </div>
                      <div
                        className="rounded-full mt-0.5 transition-all duration-300"
                        style={{
                          width:  isFocused ? 4 : isOpen ? 3 : 0,
                          height: isFocused ? 4 : isOpen ? 3 : 0,
                          background: meta.color,
                          boxShadow: isOpen ? `0 0 5px ${meta.color}` : 'none',
                          opacity: isOpen ? 1 : 0,
                        }}
                      />
                    </div>
                  </Reorder.Item>
                )
              })}
            </Reorder.Group>

            {/* Separator + External X11 windows */}
            {x11Windows.length > 0 && (
              <>
                <div
                  className="self-stretch"
                  style={{ width: 1, background: 'rgba(255,255,255,0.12)', margin: '6px 4px' }}
                />
                {x11Windows.map(xwin => (
                  <div
                    key={xwin.id}
                    className="flex flex-col items-center cursor-default"
                    style={{ width: BASE }}
                    onMouseEnter={() => setHovered(xwin.title)}
                  >
                    <motion.button
                      onClick={async () => {
                        try { await (window.cryogram as any).wm?.focusWindow(xwin.id) } catch {}
                      }}
                      animate={{ width: BASE, height: BASE }}
                      className="relative rounded-2xl flex items-center justify-center overflow-hidden"
                      style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.15)' }}
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
                    >
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, transparent 55%)' }} />
                      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
                        {xwin.title.slice(0, 2).toUpperCase()}
                      </span>
                    </motion.button>
                    <div
                      className="mt-1 text-center leading-none select-none pointer-events-none truncate"
                      style={{ fontSize: 9, maxWidth: BASE, color: 'rgba(148,163,184,0.5)', fontFamily: '-apple-system, sans-serif' }}
                    >
                      {xwin.title.length > 10 ? xwin.title.slice(0, 9) + '…' : xwin.title}
                    </div>
                    <div className="rounded-full mt-0.5"
                      style={{ width: 3, height: 3, background: '#94a3b8', opacity: 0.6 }} />
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Drag hint */}
          <motion.div
            className="mt-1.5 text-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
            style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', fontFamily: '-apple-system, sans-serif' }}
          >
            Drag to reorder · Right-click to customize
          </motion.div>
        </div>
      </div>
    </>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function TermIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> }
function EditorIcon()  { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> }
function LockIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> }
function LeakIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L12 10"/><path d="M12 10C12 10 5.5 14.5 5.5 18.5a6.5 6.5 0 0 0 13 0C18.5 14.5 12 10 12 10Z"/></svg> }
function FolderIcon()  { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> }
function GridIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
function GearIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function DisplayIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> }
