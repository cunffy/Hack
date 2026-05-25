import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'

const APP_ICONS: Record<string, string> = {
  terminal:          '⌨',
  editor:            '📝',
  'password-tester': '🔐',
  leaker:            '🔍',
  settings:          '⚙',
  files:             '📁',
  launcher:          '🚀',
  system:            '🖥',
}

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

// ── Clock ──────────────────────────────────────────────────────────────────
function Clock() {
  const [now, setNow] = useState(new Date())
  const [showDate, setShowDate] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="relative" onMouseEnter={() => setShowDate(true)} onMouseLeave={() => setShowDate(false)}>
      <button
        className="flex items-center justify-center px-3 h-8 rounded-lg hover:bg-white/5 transition-colors select-none"
        style={{ color: '#c9d1d9', fontFamily: 'monospace', fontSize: 12, letterSpacing: 1 }}
      >
        {time}
      </button>
      <AnimatePresence>
        {showDate && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
              background: 'rgba(13,20,33,0.98)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 8, padding: '6px 14px', whiteSpace: 'nowrap',
              color: '#00d4ff', fontFamily: 'monospace', fontSize: 11, letterSpacing: 1,
              zIndex: 9999, boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          >
            {date}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Volume Tray ─────────────────────────────────────────────────────────────
function VolumeTray() {
  const [open, setOpen] = useState(false)
  const [vol, setVol] = useState(50)
  const [muted, setMuted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const api = (window as any).cryogram
    if (!api) return
    api.system?.getVolume?.().then((v: { level: number; muted: boolean }) => {
      setVol(v.level); setMuted(v.muted)
    }).catch(() => {})
    const cleanup = api.onHudVolume?.((v: { level: number; muted: boolean }) => {
      setVol(v.level); setMuted(v.muted)
    })
    return cleanup
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const setVolume = (level: number) => {
    setVol(level)
    ;(window as any).cryogram?.system?.setVolume(level)
  }

  const toggleMute = () => {
    setMuted(m => !m)
    ;(window as any).cryogram?.system?.toggleMute()
  }

  const icon = muted || vol === 0 ? '🔇' : vol < 40 ? '🔈' : vol < 70 ? '🔉' : '🔊'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        onContextMenu={e => { e.preventDefault(); toggleMute() }}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors select-none"
        title="Volume (right-click to mute)"
        style={{ fontSize: 14, color: muted ? '#ef4444' : '#8b949e' }}
      >
        {icon}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
              background: 'rgba(13,20,33,0.98)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 12, padding: '14px 12px', zIndex: 9999,
              boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <input
              type="range" min={0} max={100} value={vol}
              onChange={e => setVolume(Number(e.target.value))}
              style={{ writingMode: 'vertical-lr', direction: 'rtl', height: 80, accentColor: '#00d4ff' }}
            />
            <span style={{ fontSize: 10, color: '#8b949e', fontFamily: 'monospace' }}>{vol}%</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── WiFi Tray ───────────────────────────────────────────────────────────────
function WifiTray() {
  const [ssid, setSsid] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const s = await (window as any).cryogram?.system?.getWifiStatus()
      setSsid(s?.ssid ?? null)
    } catch { setSsid(null) }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 15000)
    return () => clearInterval(id)
  }, [refresh])

  return (
    <button
      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors select-none"
      title={ssid ? `WiFi: ${ssid}` : 'Not connected — click to open Settings'}
      onClick={() => useWindowStore.getState().openApp('settings')}
      style={{ fontSize: 14, color: ssid ? '#00d4ff' : '#3d4a55' }}
    >
      {ssid ? '📶' : '📵'}
    </button>
  )
}

// ── Right-click context menu ────────────────────────────────────────────────
interface CtxMenuProps {
  x: number
  win: { id: string; minimized: boolean; maximized: boolean }
  onClose: () => void
}

function WinContextMenu({ x, win, onClose }: CtxMenuProps) {
  const { minimizeWindow, restoreWindow, toggleMaximize, closeWindow } = useWindowStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  type Item = { label: string; action: () => void; danger?: boolean } | null
  const items: Item[] = [
    win.minimized
      ? { label: 'Restore', action: () => restoreWindow(win.id) }
      : { label: 'Minimize', action: () => minimizeWindow(win.id) },
    { label: win.maximized ? 'Unmaximize' : 'Maximize', action: () => toggleMaximize(win.id) },
    null,
    { label: 'Close', action: () => closeWindow(win.id), danger: true },
  ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.93, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93, y: 6 }}
      transition={{ duration: 0.1 }}
      onContextMenu={e => e.preventDefault()}
      style={{
        position: 'fixed', left: x, bottom: 44,
        background: 'rgba(13,20,33,0.99)', border: '1px solid rgba(0,212,255,0.2)',
        borderRadius: 10, padding: 4, zIndex: 99999, minWidth: 148,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      }}
    >
      {items.map((item, i) =>
        item === null ? (
          <div key={i} style={{ height: 1, background: 'rgba(0,212,255,0.1)', margin: '3px 8px' }} />
        ) : (
          <button
            key={item.label}
            onClick={() => { item.action(); onClose() }}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '7px 12px', borderRadius: 6, border: 'none', background: 'none',
              cursor: 'pointer', fontSize: 12, fontFamily: 'monospace',
              color: item.danger ? '#ff4466' : '#c9d1d9', transition: 'background 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = item.danger ? 'rgba(255,68,102,0.15)' : 'rgba(0,212,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {item.label}
          </button>
        )
      )}
    </motion.div>
  )
}

// ── System HUD overlay (volume / brightness feedback) ──────────────────────
export function SystemHUD() {
  const [hud, setHud] = useState<{ type: 'volume' | 'brightness'; value: number; muted?: boolean } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const show = useCallback((next: typeof hud) => {
    setHud(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHud(null), 2200)
  }, [])

  useEffect(() => {
    const api = (window as any).cryogram
    const c1 = api?.onHudVolume?.((v: { level: number; muted: boolean }) =>
      show({ type: 'volume', value: v.level, muted: v.muted }))
    const c2 = api?.onHudBrightness?.((v: { level: number }) =>
      show({ type: 'brightness', value: v.level }))
    return () => { c1?.(); c2?.() }
  }, [show])

  if (!hud) return null

  const icon = hud.type === 'brightness' ? '☀' : hud.muted ? '🔇' : hud.value < 40 ? '🔈' : '🔊'
  const label = hud.type === 'brightness' ? 'Brightness' : 'Volume'

  return (
    <AnimatePresence>
      <motion.div
        key="hud"
        initial={{ opacity: 0, y: -12, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.94 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed', top: 38, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(13,20,33,0.96)', border: '1px solid rgba(0,212,255,0.25)',
          borderRadius: 14, padding: '10px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
          zIndex: 99999, boxShadow: '0 8px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,212,255,0.08)',
          backdropFilter: 'blur(20px)', minWidth: 210, pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#8b949e', fontFamily: 'monospace', marginBottom: 5, letterSpacing: 1 }}>
            {label.toUpperCase()}
          </div>
          <div style={{ background: 'rgba(0,212,255,0.1)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #00d4ff, #00ff88)', borderRadius: 4 }}
              animate={{ width: `${hud.muted ? 0 : hud.value}%` }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            />
          </div>
        </div>
        <span style={{ fontSize: 13, color: '#00d4ff', fontFamily: 'monospace', width: 34, textAlign: 'right' }}>
          {hud.muted ? 'M' : `${hud.value}%`}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Alt+Tab App Switcher overlay ────────────────────────────────────────────
export function AppSwitcher() {
  const { windows, focusWindow, restoreWindow } = useWindowStore()
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const allWins = windows

  useEffect(() => {
    const api = (window as any).cryogram
    const cleanup = api?.onAppSwitcher?.((dir: 'next' | 'prev') => {
      setOpen(true)
      setIdx(prev => {
        const len = allWins.length
        if (len === 0) return 0
        return dir === 'next'
          ? (prev + 1) % len
          : (prev - 1 + len) % len
      })
    })
    return cleanup
  }, [allWins.length])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key === 'Enter' || (e.key !== 'Tab' && !e.altKey)) {
        const win = allWins[idx]
        if (win) {
          if (win.minimized) restoreWindow(win.id)
          else focusWindow(win.id)
        }
        setOpen(false)
      }
    }
    window.addEventListener('keyup', handler)
    return () => window.removeEventListener('keyup', handler)
  }, [open, idx, allWins, focusWindow, restoreWindow])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="switcher"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99998,
            background: 'rgba(7,11,17,0.72)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.94 }}
            transition={{ duration: 0.15 }}
            style={{
              background: 'rgba(13,20,33,0.98)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 18, padding: 20,
              display: 'flex', gap: 12, maxWidth: '80vw', flexWrap: 'wrap', justifyContent: 'center',
              boxShadow: '0 12px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,212,255,0.06)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {allWins.length === 0 ? (
              <p style={{ color: '#4e5d6e', fontFamily: 'monospace', fontSize: 13, padding: '8px 16px' }}>
                No open windows
              </p>
            ) : allWins.map((win, i) => {
              const sel = i === idx
              const accent = APP_COLORS[win.appId] ?? '#00d4ff'
              const icon = APP_ICONS[win.appId] ?? '🪟'
              return (
                <button
                  key={win.id}
                  onClick={() => { focusWindow(win.id); setOpen(false) }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '14px 18px', borderRadius: 12,
                    border: sel ? `1px solid ${accent}55` : '1px solid rgba(26,40,64,0.5)',
                    background: sel ? `${accent}14` : 'rgba(13,20,33,0.6)',
                    cursor: 'pointer', minWidth: 90, transition: 'all 0.12s',
                    boxShadow: sel ? `0 0 20px ${accent}1a` : 'none',
                    opacity: win.minimized ? 0.55 : 1,
                  }}
                >
                  <span style={{ fontSize: 30 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: sel ? accent : '#8b949e', fontFamily: 'monospace', maxWidth: 90, textAlign: 'center' }}>
                    {win.title}
                  </span>
                  {win.minimized && (
                    <span style={{ fontSize: 9, color: '#4e5d6e', fontFamily: 'monospace' }}>minimized</span>
                  )}
                </button>
              )
            })}
          </motion.div>
          <div style={{
            position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(13,20,33,0.85)', border: '1px solid rgba(0,212,255,0.15)',
            borderRadius: 8, padding: '5px 14px',
            color: '#4e5d6e', fontSize: 11, fontFamily: 'monospace', letterSpacing: 1,
          }}>
            ALT+TAB to cycle  ·  ENTER or click to switch  ·  ESC to cancel
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Main Taskbar ────────────────────────────────────────────────────────────
export function Taskbar() {
  const { windows, focusWindow, restoreWindow, minimizeWindow } = useWindowStore()
  const openApp = useWindowStore(s => s.openApp)
  const [x11Wins, setX11Wins] = useState<Array<{ id: string; title: string }>>([])
  const [ctxMenu, setCtxMenu] = useState<{ x: number; winId: string } | null>(null)

  // Poll X11 windows every 3s to show external apps like Brave
  useEffect(() => {
    const poll = async () => {
      try {
        const wins = await (window as any).cryogram?.wm?.getWindows()
        if (Array.isArray(wins)) {
          setX11Wins(wins.filter((w: any) =>
            w.title &&
            !w.title.toLowerCase().includes('cryogram') &&
            !w.title.toLowerCase().includes('electron')
          ))
        }
      } catch {}
    }
    poll()
    const id = setInterval(poll, 3000)
    return () => clearInterval(id)
  }, [])

  const cleanTitle = (raw: string) => {
    const parts = raw.split(' - ')
    return parts.length > 1 ? parts[parts.length - 1].trim() : raw.trim()
  }

  return (
    <>
      <div
        className="flex items-center h-10 px-2 gap-1.5 shrink-0 relative select-none"
        style={{
          background: 'rgba(7,11,17,0.96)',
          borderTop: '1px solid rgba(0,212,255,0.09)',
          backdropFilter: 'blur(28px)',
        }}
      >
        {/* Accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.22) 50%, transparent 100%)' }}
        />

        {/* Logo → opens launcher */}
        <button
          onClick={() => openApp('launcher')}
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all hover:scale-105 active:scale-95"
          title="Launcher"
          style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)' }}
        >
          <motion.span
            animate={{ opacity: [1, 0.45, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 15, filter: 'drop-shadow(0 0 5px rgba(0,212,255,0.85))' }}
          >
            ⬡
          </motion.span>
        </button>

        <div className="w-px h-5 shrink-0 mx-0.5" style={{ background: 'rgba(0,212,255,0.1)' }} />

        {/* Window buttons */}
        <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <AnimatePresence initial={false}>
            {windows.map(win => {
              const accent = APP_COLORS[win.appId] ?? '#00d4ff'
              const icon = APP_ICONS[win.appId] ?? '🪟'
              const isActive = win.focused && !win.minimized
              return (
                <motion.button
                  key={win.id}
                  initial={{ opacity: 0, scale: 0.78, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.78, x: -10 }}
                  transition={{ type: 'spring', stiffness: 440, damping: 30 }}
                  onClick={() => {
                    if (win.minimized) restoreWindow(win.id)
                    else if (win.focused) minimizeWindow(win.id)
                    else focusWindow(win.id)
                  }}
                  onContextMenu={e => { e.preventDefault(); setCtxMenu({ x: e.clientX, winId: win.id }) }}
                  className="relative flex items-center gap-1.5 px-2 h-7 rounded-lg text-xs shrink-0 transition-all"
                  style={{
                    background: isActive ? `${accent}11` : 'rgba(13,20,33,0.65)',
                    border: isActive ? `1px solid ${accent}32` : '1px solid rgba(26,40,64,0.5)',
                    color: isActive ? accent : win.minimized ? '#2e3a46' : '#8b949e',
                    maxWidth: 156, boxShadow: isActive ? `0 0 12px ${accent}12` : 'none',
                  }}
                >
                  <span style={{ fontSize: 12, opacity: win.minimized ? 0.3 : 1 }}>{icon}</span>
                  <span className="truncate" style={{ fontFamily: 'monospace', letterSpacing: 0.2 }}>{win.title}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                      layoutId={`pill-${win.id}`}
                    />
                  )}
                </motion.button>
              )
            })}
          </AnimatePresence>

          {/* External X11 windows (Brave, etc.) */}
          <AnimatePresence initial={false}>
            {x11Wins.map(xw => (
              <motion.button
                key={xw.id}
                initial={{ opacity: 0, scale: 0.78, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.78, x: -10 }}
                transition={{ type: 'spring', stiffness: 440, damping: 30 }}
                onClick={() => (window as any).cryogram?.wm?.focusWindow(xw.id)}
                className="flex items-center gap-1.5 px-2 h-7 rounded-lg text-xs shrink-0"
                style={{
                  background: 'rgba(13,20,33,0.65)', border: '1px solid rgba(26,40,64,0.5)',
                  color: '#8b949e', maxWidth: 156,
                }}
              >
                <span style={{ fontSize: 12 }}>🌐</span>
                <span className="truncate" style={{ fontFamily: 'monospace', letterSpacing: 0.2 }}>
                  {cleanTitle(xw.title)}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>

          {windows.length === 0 && x11Wins.length === 0 && (
            <span style={{ fontSize: 11, color: '#2e3a46', fontFamily: 'monospace', paddingLeft: 4, fontStyle: 'italic' }}>
              — no open windows —
            </span>
          )}
        </div>

        {/* System tray */}
        <div className="flex items-center gap-0.5 shrink-0">
          <WifiTray />
          <VolumeTray />
          <div className="w-px h-4 mx-1" style={{ background: 'rgba(0,212,255,0.1)' }} />
          <Clock />
        </div>
      </div>

      {/* Context menu portal */}
      <AnimatePresence>
        {ctxMenu && (() => {
          const win = windows.find(w => w.id === ctxMenu.winId)
          if (!win) return null
          return <WinContextMenu key="ctx" x={ctxMenu.x} win={win} onClose={() => setCtxMenu(null)} />
        })()}
      </AnimatePresence>
    </>
  )
}
