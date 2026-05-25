import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { AppId, useWindowStore } from '../store/windowStore'
import { useDesktopStore, DesktopIcon } from '../store/desktopStore'
import { usePinnedStore, PinnedApp } from '../store/pinnedStore'
import { APP_META } from './Dock'
import { ContextMenu, MenuItem } from './ContextMenu'

interface CtxState {
  x: number
  y: number
  type: 'bg' | 'icon'
  iconId?: string
  iconAppId?: AppId
}

interface ExternalApp {
  name: string
  exec: string
  icon: string
  comment: string
  categories: string[]
  category: string
  desktopFile: string
}

export function Desktop() {
  const hasWindows = useWindowStore(s => s.windows.some(w => !w.minimized))
  const { windows, openApp, focusWindow, restoreWindow } = useWindowStore()
  const { icons, wallpaper, removeIcon, moveIcon, addIcon, setWallpaper } = useDesktopStore()
  const { desktop: pinnedDesktop, unpinDesktop } = usePinnedStore()
  const [ctx, setCtx]         = useState<CtxState | null>(null)
  const [appChooser, setAppChooser] = useState(false)

  const handleBgCtx = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-desktop-icon]')) return
    e.preventDefault()
    setCtx({ x: e.clientX, y: e.clientY, type: 'bg' })
  }, [])

  const handleIconCtx = useCallback((e: React.MouseEvent, icon: DesktopIcon) => {
    e.preventDefault()
    e.stopPropagation()
    setCtx({ x: e.clientX, y: e.clientY, type: 'icon', iconId: icon.id, iconAppId: icon.appId })
  }, [])

  const pickWallpaper = useCallback(async () => {
    try {
      const path = await (window.cryogram as any).system?.pickWallpaper?.()
      if (path) {
        setWallpaper(path)
        ;(window.cryogram as any).system?.setWallpaper?.(path)
      }
    } catch {}
  }, [setWallpaper])

  const removeWallpaper = useCallback(() => setWallpaper(''), [setWallpaper])

  const bgItems: MenuItem[] = [
    { label: 'Add App to Desktop', icon: <PlusIcon />, action: () => setAppChooser(true) },
    { sep: true },
    { label: 'Change Wallpaper', icon: <ImageIcon />, action: pickWallpaper },
    ...(wallpaper ? [{ label: 'Remove Wallpaper', action: removeWallpaper } as MenuItem] : []),
  ]

  const iconItems = (icon: DesktopIcon): MenuItem[] => {
    const win = windows.find(w => w.appId === icon.appId)
    return [
      {
        label: win ? 'Focus Window' : 'Open',
        icon: win ? <FocusIcon /> : <OpenIcon />,
        action: () => {
          if (!win) openApp(icon.appId)
          else { restoreWindow(win.id); focusWindow(win.id) }
        },
      },
      { sep: true },
      { label: 'Remove from Desktop', danger: true, icon: <TrashIcon />, action: () => removeIcon(icon.id) },
    ]
  }

  return (
    <div className="absolute inset-0 select-none" onContextMenu={handleBgCtx}>
      {/* Subtle watermark */}
      {!wallpaper && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0.012 }}
        >
          <div
            className="font-black"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '22vw',
              color: 'var(--cryo-accent)',
              letterSpacing: '0.08em',
            }}
          >
            CG
          </div>
        </div>
      )}

      {/* Empty state */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-32 pointer-events-none"
        animate={{ opacity: hasWindows || icons.length > 0 || pinnedDesktop.length > 0 ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col items-center gap-2.5"
        >
          <div
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.2)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '0.01em',
            }}
          >
            Open an app from the dock · Right-click for options
          </div>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Built-in app icons */}
      {icons.map(icon => {
        const meta = APP_META[icon.appId]
        if (!meta) return null
        const win = windows.find(w => w.appId === icon.appId)
        return (
          <DesktopIconItem
            key={icon.id}
            icon={icon}
            meta={meta}
            isOpen={!!win}
            onContextMenu={handleIconCtx}
            onMove={moveIcon}
            onOpen={() => {
              if (!win) openApp(icon.appId)
              else { restoreWindow(win.id); focusWindow(win.id) }
            }}
          />
        )
      })}

      {/* External pinned app icons */}
      {pinnedDesktop.map((app, i) => (
        <ExternalDesktopIcon
          key={app.id}
          app={app}
          offsetIndex={icons.length + i}
          onRemove={() => unpinDesktop(app.id)}
        />
      ))}

      {/* Status pulse */}
      <motion.div
        className="absolute left-5 flex items-center gap-2 pointer-events-none"
        style={{ bottom: 88, fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#00ff88', boxShadow: '0 0 6px rgba(0,255,136,0.8)' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span style={{ color: 'rgba(80,100,120,0.45)', letterSpacing: '0.1em' }}>ALL SYSTEMS OPERATIONAL</span>
      </motion.div>

      {/* Context menu */}
      <AnimatePresence>
        {ctx && (
          <ContextMenu
            x={ctx.x}
            y={ctx.y}
            onClose={() => setCtx(null)}
            items={
              ctx.type === 'bg'
                ? bgItems
                : iconItems({ id: ctx.iconId!, appId: ctx.iconAppId!, x: 0, y: 0 })
            }
          />
        )}
      </AnimatePresence>

      {/* Full-screen app chooser */}
      <AnimatePresence>
        {appChooser && (
          <AppChooserOverlay
            onClose={() => setAppChooser(false)}
            onPickInternal={appId => { addIcon(appId); setAppChooser(false) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Draggable built-in desktop icon ──────────────────────────────────────────
interface IconItemProps {
  icon: DesktopIcon
  meta: { label: string; color: string; icon: React.ReactNode }
  isOpen: boolean
  onContextMenu: (e: React.MouseEvent, icon: DesktopIcon) => void
  onMove: (id: string, x: number, y: number) => void
  onOpen: () => void
}

function DesktopIconItem({ icon, meta, isOpen, onContextMenu, onMove, onOpen }: IconItemProps) {
  const x = useMotionValue(icon.x)
  const y = useMotionValue(icon.y)

  useEffect(() => { x.set(icon.x); y.set(icon.y) }, [icon.x, icon.y])

  return (
    <motion.div
      data-desktop-icon
      drag
      dragMomentum={false}
      style={{ position: 'absolute', top: 0, left: 0, x, y, width: 76, touchAction: 'none', zIndex: 10 }}
      onDragEnd={() => onMove(icon.id, Math.max(0, Math.round(x.get())), Math.max(28, Math.round(y.get())))}
      className="flex flex-col items-center cursor-default"
      onContextMenu={e => onContextMenu(e, icon)}
      onDoubleClick={onOpen}
      whileTap={{ scale: 0.88 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 440, damping: 22 }}
    >
      <div
        className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 38% 28%, ${meta.color}28, rgba(8,12,20,0.9) 70%)`,
          border: `1px solid ${isOpen ? `${meta.color}45` : 'rgba(255,255,255,0.1)'}`,
          boxShadow: isOpen
            ? `0 0 18px ${meta.color}22, 0 4px 18px rgba(0,0,0,0.6)`
            : '0 4px 16px rgba(0,0,0,0.55)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 55%)' }} />
        <div style={{ color: meta.color }}>{meta.icon}</div>
      </div>
      {isOpen && (
        <div
          className="w-1 h-1 rounded-full mt-0.5"
          style={{ background: meta.color, boxShadow: `0 0 4px ${meta.color}` }}
        />
      )}
      <div
        className="mt-1.5 text-center px-1 leading-snug"
        style={{
          fontSize: 10.5,
          color: 'rgba(255,255,255,0.9)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          textShadow: '0 1px 6px rgba(0,0,0,0.95)',
          maxWidth: 76,
          wordBreak: 'break-word',
        }}
      >
        {meta.label}
      </div>
    </motion.div>
  )
}

// ── External app desktop icon ─────────────────────────────────────────────────
function ExternalDesktopIcon({
  app, offsetIndex, onRemove,
}: { app: PinnedApp; offsetIndex: number; onRemove: () => void }) {
  const col = offsetIndex % 4
  const row = Math.floor(offsetIndex / 4)
  const [pos, setPos] = useState({ x: 24 + col * 104, y: 36 + row * 110 })
  const mx = useMotionValue(pos.x)
  const my = useMotionValue(pos.y)
  const [ctxOpen, setCtxOpen] = useState(false)

  return (
    <>
      <motion.div
        data-desktop-icon
        drag dragMomentum={false}
        style={{ position: 'absolute', top: 0, left: 0, x: mx, y: my, width: 76, touchAction: 'none', zIndex: 10 }}
        onDragEnd={() => setPos({ x: Math.max(0, Math.round(mx.get())), y: Math.max(28, Math.round(my.get())) })}
        className="flex flex-col items-center cursor-default"
        onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setCtxOpen(true) }}
        onDoubleClick={() => (window as any).cryogram?.launcher?.launch(app)}
        whileTap={{ scale: 0.88 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 440, damping: 22 }}
      >
        <div
          className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 38% 28%, var(--cryo-a18), rgba(8,12,20,0.9) 70%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.55)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 55%)' }} />
          {app.icon ? (
            <img
              src={app.icon}
              alt=""
              style={{ width: 34, height: 34, objectFit: 'contain' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <span style={{ fontSize: 26 }}>📦</span>
          )}
        </div>
        <div
          className="mt-1.5 text-center px-1 leading-snug"
          style={{
            fontSize: 10.5,
            color: 'rgba(255,255,255,0.9)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            textShadow: '0 1px 6px rgba(0,0,0,0.95)',
            maxWidth: 76,
            wordBreak: 'break-word',
          }}
        >
          {app.name}
        </div>
      </motion.div>
      <AnimatePresence>
        {ctxOpen && (
          <ContextMenu
            x={pos.x + 38} y={pos.y + 44}
            onClose={() => setCtxOpen(false)}
            items={[
              { label: `Open ${app.name}`, icon: <OpenIcon />, action: () => { (window as any).cryogram?.launcher?.launch(app) } },
              { sep: true },
              { label: 'Remove from Desktop', danger: true, icon: <TrashIcon />, action: onRemove },
            ]}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Launchpad-style app chooser ───────────────────────────────────────────────
function AppChooserOverlay({
  onClose,
  onPickInternal,
}: {
  onClose: () => void
  onPickInternal: (appId: AppId) => void
}) {
  const [search, setSearch]         = useState('')
  const [externalApps, setExternal] = useState<ExternalApp[]>([])
  const [launching, setLaunching]   = useState<string | null>(null)
  const existingIds = useDesktopStore(s => s.icons.map(i => i.appId))
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchRef.current?.focus()
    window.cryogram.launcher
      .getApps()
      .then(setExternal as any)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const internalApps = Object.entries(APP_META) as [AppId, typeof APP_META[AppId]][]

  const lc = search.toLowerCase()
  const filteredInternal = lc
    ? internalApps.filter(([, m]) => m.label.toLowerCase().includes(lc))
    : internalApps
  const filteredExternal = lc
    ? externalApps.filter(a => a.name.toLowerCase().includes(lc) || a.comment?.toLowerCase().includes(lc))
    : externalApps

  const launchExternal = async (app: ExternalApp) => {
    setLaunching(app.desktopFile)
    try { await (window as any).cryogram.launcher.launch(app) } catch {}
    setTimeout(() => setLaunching(null), 1500)
    onClose()
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center"
      style={{
        background: 'rgba(5,8,15,0.88)',
        backdropFilter: 'blur(40px)',
        zIndex: 8000,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Search bar */}
      <motion.div
        className="mt-16 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.04 }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 14,
            width: 380,
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search apps…"
            className="flex-1 bg-transparent outline-none"
            style={{
              color: 'rgba(255,255,255,0.88)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              fontSize: 15,
              caretColor: 'var(--cryo-accent)',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, lineHeight: 1 }}>✕</button>
          )}
        </div>
      </motion.div>

      {/* Scrollable app grid */}
      <div className="flex-1 overflow-y-auto w-full px-8 pb-16" style={{ maxWidth: 900 }}>
        {/* Internal CryoGram apps */}
        {filteredInternal.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28, delay: 0.07 }}
          >
            <div
              className="text-xs font-semibold mb-3 pl-1"
              style={{
                color: 'rgba(255,255,255,0.28)',
                fontFamily: '-apple-system, sans-serif',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Cryogram Apps
            </div>
            <div className="grid grid-cols-6 gap-3 mb-8">
              {filteredInternal.map(([appId, meta]) => {
                const added = existingIds.includes(appId)
                return (
                  <AppTile
                    key={appId}
                    label={meta.label}
                    color={meta.color}
                    icon={<div style={{ color: meta.color }}>{meta.icon}</div>}
                    added={added}
                    onClick={() => { if (!added) onPickInternal(appId) }}
                    buttonLabel={added ? 'Added' : 'Add to Desktop'}
                  />
                )
              })}
            </div>
          </motion.div>
        )}

        {/* External launcher apps */}
        {filteredExternal.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28, delay: 0.12 }}
          >
            <div
              className="text-xs font-semibold mb-3 pl-1"
              style={{
                color: 'rgba(255,255,255,0.28)',
                fontFamily: '-apple-system, sans-serif',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Installed Apps
            </div>
            <div className="grid grid-cols-6 gap-3">
              {filteredExternal.map(app => (
                <AppTile
                  key={app.desktopFile}
                  label={app.name}
                  color="var(--cryo-accent)"
                  icon={
                    app.icon ? (
                      <img
                        src={app.icon}
                        alt=""
                        style={{ width: 32, height: 32, objectFit: 'contain' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <span style={{ fontSize: 26 }}>📦</span>
                    )
                  }
                  added={false}
                  onClick={() => launchExternal(app)}
                  buttonLabel={launching === app.desktopFile ? 'Launching…' : 'Launch'}
                />
              ))}
            </div>
          </motion.div>
        )}

        {filteredInternal.length === 0 && filteredExternal.length === 0 && (
          <div
            className="text-center mt-20"
            style={{ color: 'rgba(255,255,255,0.25)', fontFamily: '-apple-system, sans-serif', fontSize: 14 }}
          >
            No apps found for "{search}"
          </div>
        )}
      </div>

      {/* Dismiss hint */}
      <div
        className="mb-6"
        style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', fontFamily: '-apple-system, sans-serif' }}
      >
        Press Esc or click outside to dismiss
      </div>
    </motion.div>
  )
}

// ── App tile used inside AppChooserOverlay ────────────────────────────────────
function AppTile({
  label, color, icon, added, onClick, buttonLabel,
}: {
  label: string
  color: string
  icon: React.ReactNode
  added: boolean
  onClick: () => void
  buttonLabel: string
}) {
  const [hov, setHov] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      disabled={added}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl"
      style={{
        background: hov && !added ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: hov && !added ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.05)',
        cursor: added ? 'default' : 'pointer',
        opacity: added ? 0.45 : 1,
        transition: 'background 0.12s, border-color 0.12s',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileTap={!added ? { scale: 0.9 } : {}}
      transition={{ type: 'spring', stiffness: 500, damping: 24 }}
    >
      <div
        className="w-14 h-14 rounded-[16px] flex items-center justify-center relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 38% 28%, ${color === 'var(--cryo-accent)' ? 'rgba(0,212,255,0.18)' : color + '25'}, rgba(8,12,20,0.92) 70%)`,
          border: `1px solid rgba(255,255,255,${hov ? '0.14' : '0.07'})`,
          boxShadow: hov ? `0 0 20px ${color === 'var(--cryo-accent)' ? 'rgba(0,212,255,0.15)' : color + '20'}` : 'none',
          transition: 'box-shadow 0.15s, border-color 0.15s',
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 55%)' }} />
        {icon}
      </div>
      <div
        style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.72)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: 80,
          wordBreak: 'break-word',
        }}
      >
        {label}
      </div>
      {added && (
        <div style={{ fontSize: 9, color: 'var(--cryo-a50)', fontFamily: '-apple-system, sans-serif' }}>
          {buttonLabel}
        </div>
      )}
    </motion.button>
  )
}

// ── Icon helpers ──────────────────────────────────────────────────────────────
function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
function ImageIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
}
function OpenIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
}
function FocusIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
}
function TrashIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
}
