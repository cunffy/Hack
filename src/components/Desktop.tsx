import { useState, useCallback, useEffect } from 'react'
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

export function Desktop() {
  const hasWindows = useWindowStore(s => s.windows.some(w => !w.minimized))
  const { windows, openApp, focusWindow, restoreWindow } = useWindowStore()
  const { icons, wallpaper, removeIcon, moveIcon, addIcon, setWallpaper } = useDesktopStore()
  const { desktop: pinnedDesktop, unpinDesktop } = usePinnedStore()
  const [ctx, setCtx] = useState<CtxState | null>(null)
  const [appPicker, setAppPicker] = useState(false)

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

  const bgItems: MenuItem[] = [
    { label: 'Add App to Desktop', icon: <PlusIcon />, action: () => setAppPicker(true) },
    { label: 'Change Wallpaper',   icon: <ImageIcon />, action: pickWallpaper },
  ]

  const iconItems = (icon: DesktopIcon): MenuItem[] => {
    const win = windows.find(w => w.appId === icon.appId)
    return [
      {
        label: win ? 'Focus Window' : 'Open',
        action: () => {
          if (!win) openApp(icon.appId)
          else { restoreWindow(win.id); focusWindow(win.id) }
        },
      },
      { sep: true },
      { label: 'Remove from Desktop', danger: true, action: () => removeIcon(icon.id) },
    ]
  }

  return (
    <div
      className="absolute inset-0 select-none"
      onContextMenu={handleBgCtx}
    >
      {/* Watermark — hidden when wallpaper is set */}
      {!wallpaper && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0.014 }}
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

      {/* Empty state hint */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-32 pointer-events-none"
        animate={{ opacity: hasWindows || icons.length > 0 ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <div
            className="text-sm font-medium"
            style={{
              color: 'rgba(255,255,255,0.22)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            Open an app from the dock · Right-click for options
          </div>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Desktop icons — built-in Cryogram apps */}
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

      {/* Desktop icons — pinned external apps (from launcher) */}
      {pinnedDesktop.map((app, i) => (
        <ExternalDesktopIcon
          key={app.id}
          app={app}
          offsetIndex={icons.length + i}
          onRemove={() => unpinDesktop(app.id)}
        />
      ))}

      {/* Bottom-left status */}
      <motion.div
        className="absolute left-6 flex items-center gap-2 text-xs pointer-events-none"
        style={{ bottom: 88, color: 'rgba(78,93,110,0.45)', fontFamily: '"JetBrains Mono", monospace' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: '#00ff88', boxShadow: '0 0 6px rgba(0,255,136,0.8)' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span style={{ letterSpacing: '0.1em', fontSize: 10 }}>ALL SYSTEMS OPERATIONAL</span>
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

      {/* App picker modal */}
      <AnimatePresence>
        {appPicker && (
          <AppPickerOverlay
            onClose={() => setAppPicker(false)}
            onPick={appId => { addIcon(appId); setAppPicker(false) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Draggable desktop icon ────────────────────────────────────────────────────
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

  // Sync if external update (e.g. newly added icon)
  useEffect(() => { x.set(icon.x); y.set(icon.y) }, [icon.x, icon.y])

  return (
    <motion.div
      data-desktop-icon
      drag
      dragMomentum={false}
      style={{ position: 'absolute', top: 0, left: 0, x, y, width: 72, touchAction: 'none', zIndex: 10 }}
      onDragEnd={() => {
        const nx = Math.max(0, Math.round(x.get()))
        const ny = Math.max(28, Math.round(y.get()))
        onMove(icon.id, nx, ny)
      }}
      className="flex flex-col items-center cursor-default"
      onContextMenu={e => onContextMenu(e, icon)}
      onDoubleClick={onOpen}
      whileTap={{ scale: 0.9 }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: `radial-gradient(ellipse at 38% 28%, ${meta.color}28, rgba(8,12,20,0.88) 70%)`,
          border: `1px solid ${isOpen ? `${meta.color}40` : 'rgba(255,255,255,0.1)'}`,
          boxShadow: isOpen
            ? `0 0 18px ${meta.color}20, 0 4px 16px rgba(0,0,0,0.55)`
            : '0 4px 16px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ color: meta.color }}>{meta.icon}</div>
      </div>
      {isOpen && (
        <div
          className="w-1 h-1 rounded-full mt-0.5"
          style={{ background: meta.color, boxShadow: `0 0 4px ${meta.color}` }}
        />
      )}
      <div
        className="mt-1 text-center px-1 leading-tight"
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.88)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          textShadow: '0 1px 5px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.7)',
          maxWidth: 72,
          wordBreak: 'break-word',
          lineHeight: 1.2,
        }}
      >
        {meta.label}
      </div>
    </motion.div>
  )
}

// ── External app desktop icon ─────────────────────────────────────────────────
function ExternalDesktopIcon({ app, offsetIndex, onRemove }: { app: PinnedApp; offsetIndex: number; onRemove: () => void }) {
  const col = offsetIndex % 4
  const row = Math.floor(offsetIndex / 4)
  const defaultX = 24 + col * 104
  const defaultY = 36 + row * 110
  const [pos, setPos] = useState({ x: defaultX, y: defaultY })
  const mx = useMotionValue(pos.x)
  const my = useMotionValue(pos.y)
  const [ctx, setCtx] = useState(false)

  return (
    <>
      <motion.div
        data-desktop-icon
        drag dragMomentum={false}
        style={{ position: 'absolute', top: 0, left: 0, x: mx, y: my, width: 72, touchAction: 'none', zIndex: 10 }}
        onDragEnd={() => setPos({ x: Math.max(0, Math.round(mx.get())), y: Math.max(28, Math.round(my.get())) })}
        className="flex flex-col items-center cursor-default"
        onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setCtx(true) }}
        onDoubleClick={() => (window as any).cryogram?.launcher?.launch(app)}
        whileTap={{ scale: 0.9 }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at 38% 28%, var(--cryo-a18), rgba(8,12,20,0.88) 70%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {app.icon ? (
            <img src={app.icon} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <span style={{ fontSize: 28 }}>🌐</span>
          )}
        </div>
        <div className="mt-1 text-center px-1 leading-tight" style={{
          fontSize: 11, color: 'rgba(255,255,255,0.88)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          textShadow: '0 1px 5px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.7)',
          maxWidth: 72, wordBreak: 'break-word', lineHeight: 1.2,
        }}>
          {app.name}
        </div>
      </motion.div>
      <AnimatePresence>
        {ctx && (
          <ContextMenu
            x={pos.x + 36} y={pos.y + 40}
            onClose={() => setCtx(false)}
            items={[
              { label: `Open ${app.name}`, action: () => { (window as any).cryogram?.launcher?.launch(app); setCtx(false) } },
              { sep: true },
              { label: 'Remove from Desktop', danger: true, action: () => { onRemove(); setCtx(false) } },
            ]}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── App picker modal ──────────────────────────────────────────────────────────
function AppPickerOverlay({ onClose, onPick }: { onClose: () => void; onPick: (appId: AppId) => void }) {
  const allAppIds = Object.keys(APP_META) as AppId[]
  const existingIds = useDesktopStore(s => s.icons.map(i => i.appId))

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', zIndex: 8000 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(8,14,24,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.85)',
          minWidth: 380,
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="text-sm font-semibold mb-5"
          style={{ color: 'rgba(255,255,255,0.65)', fontFamily: '-apple-system, sans-serif', letterSpacing: '0.01em' }}
        >
          Add App to Desktop
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {allAppIds.map(appId => {
            const meta = APP_META[appId]
            const added = existingIds.includes(appId)
            return (
              <button
                key={appId}
                onClick={() => !added && onPick(appId)}
                disabled={added}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all"
                style={{
                  opacity: added ? 0.4 : 1,
                  cursor: added ? 'default' : 'pointer',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={e => { if (!added) (e.currentTarget as HTMLElement).style.background = 'var(--cryo-a08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: `radial-gradient(ellipse at 38% 28%, ${meta.color}25, rgba(8,14,24,0.9) 70%)`,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ color: meta.color }}>{meta.icon}</div>
                </div>
                <div
                  className="text-center leading-tight"
                  style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.55)', fontFamily: '-apple-system, sans-serif' }}
                >
                  {meta.label}
                </div>
                {added && (
                  <div style={{ fontSize: 8, color: 'var(--cryo-a50)', fontFamily: '-apple-system, sans-serif' }}>
                    Added
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-sm"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: '-apple-system, sans-serif',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Mini icons ────────────────────────────────────────────────────────────────
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}
