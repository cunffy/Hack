import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore, AppId } from '../store/windowStore'

// ── App color / icon maps (no Dock import to avoid circular deps) ─────────────

const APP_COLORS: Record<string, string> = {
  terminal:           '#00ff88',
  editor:             '#00d4ff',
  'password-tester':  '#ffcc00',
  leaker:             '#ff4466',
  settings:           '#bb88ff',
  files:              '#f59e0b',
  launcher:           '#34d399',
  system:             '#818cf8',
  opticseo:           '#10b981',
  phone:              '#a855f7',
  scanner:            '#00ff88',
  vpn:                '#a78bfa',
  notes:              '#fbbf24',
  mail:               '#ea4335',
  'password-manager': '#ffcc00',
  'ssh-keys':         '#00d4ff',
  firewall:           '#ff4466',
  'task-manager':     '#818cf8',
  logs:               '#a855f7',
  netmon:             '#00d4ff',
  screenshot:         '#34d399',
}

const APP_ICONS: Record<string, string> = {
  terminal:           '>_',
  editor:             '{}',
  mail:               '✉',
  files:              '📁',
  launcher:           '⊞',
  settings:           '⚙',
  system:             '♡',
  phone:              '📱',
  scanner:            '◎',
  vpn:                '🔒',
  notes:              '📝',
  screenshot:         '📸',
  'password-tester':  '🔑',
  leaker:             '💧',
  opticseo:           '🔍',
  'password-manager': '🗝',
  'ssh-keys':         '🔐',
  firewall:           '🛡',
  'task-manager':     '📊',
  logs:               '📋',
  netmon:             '📡',
}

const APP_LABELS: Record<string, string> = {
  terminal:           'Terminal',
  editor:             'Editor',
  'password-tester':  'Pwd Tester',
  leaker:             'Leaker',
  settings:           'Settings',
  files:              'Files',
  launcher:           'Launcher',
  system:             'System',
  opticseo:           'OpticSEO',
  phone:              'Phone',
  scanner:            'Scanner',
  vpn:                'VPN',
  notes:              'Notes',
  mail:               'Gmail',
  'password-manager': 'Pwd Mgr',
  'ssh-keys':         'SSH Keys',
  firewall:           'Firewall',
  'task-manager':     'Tasks',
  logs:               'Logs',
  netmon:             'NetMon',
  screenshot:         'Screenshot',
}

// ── X11 title detection (mirrors Dock.tsx logic) ──────────────────────────────

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

// ── Entry type ────────────────────────────────────────────────────────────────

interface SwitcherEntry {
  key: string
  type: 'app' | 'x11'
  // app window
  windowId?: string
  appId?: AppId
  // x11 window
  x11Title?: string
  // display
  icon: string
  color: string
  label: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AppSwitcherOverlay() {
  const [visible, setVisible]   = useState(false)
  const [selIdx, setSelIdx]     = useState(0)

  const windows       = useWindowStore(s => s.windows)
  const focusWindow   = useWindowStore(s => s.focusWindow)
  const restoreWindow = useWindowStore(s => s.restoreWindow)

  const [x11Windows, setX11Windows] = useState<{ id: string; title: string }[]>([])

  // Auto-hide timer ref
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Fetch X11 windows ────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) return
    const fetchX11 = () => {
      try {
        ;(window.cryogram as any)?.wm?.getWindows?.()?.then?.((wins: any[]) => {
          if (Array.isArray(wins)) setX11Windows(wins.filter((w: any) =>
            w.desktop >= 0 && !w.title?.toLowerCase().includes('cryogram') && w.title?.trim()
          ))
        })
      } catch {}
    }
    fetchX11()
  }, [visible])

  // ── Build entry list ─────────────────────────────────────────────────────

  const entries: SwitcherEntry[] = []

  // Internal app windows (deduplicated by appId)
  const seenApps = new Set<string>()
  for (const win of windows) {
    if (seenApps.has(win.appId)) continue
    seenApps.add(win.appId)
    const color = APP_COLORS[win.appId] ?? '#64748b'
    const icon  = APP_ICONS[win.appId]  ?? '⬡'
    const label = APP_LABELS[win.appId] ?? win.title
    entries.push({
      key:      `app-${win.id}`,
      type:     'app',
      windowId: win.id,
      appId:    win.appId as AppId,
      icon,
      color,
      label,
    })
  }

  // X11 external windows
  for (const x of x11Windows) {
    const meta = getX11Meta(x.title)
    entries.push({
      key:      `x11-${x.id}`,
      type:     'x11',
      x11Title: x.title,
      icon:     meta.icon,
      color:    meta.color,
      label:    meta.name,
    })
  }

  // Max 8 visible
  const shown = entries.slice(0, 8)

  // ── Reset selection on open ──────────────────────────────────────────────

  const resetHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 1000)
  }, [])

  const showSwitcher = useCallback((direction: 'next' | 'prev') => {
    setVisible(true)
    setSelIdx(idx => {
      const len = Math.max(shown.length, 1)
      if (direction === 'next') return (idx + 1) % len
      return (idx - 1 + len) % len
    })
    resetHideTimer()
  }, [shown.length, resetHideTimer])

  // ── Listen for cryogram:switcher CustomEvent ─────────────────────────────

  useEffect(() => {
    const onSwitcherEvent = (e: Event) => {
      const ce = e as CustomEvent<'next' | 'prev'>
      showSwitcher(ce.detail ?? 'next')
    }
    window.addEventListener('cryogram:switcher', onSwitcherEvent)
    return () => window.removeEventListener('cryogram:switcher', onSwitcherEvent)
  }, [showSwitcher])

  // ── Listen for global shortcut via window.cryogram.onAppSwitcher ─────────

  useEffect(() => {
    const cg = (window.cryogram as any)
    if (cg?.onAppSwitcher) {
      const unsub = cg.onAppSwitcher((dir: 'next' | 'prev') => showSwitcher(dir))
      return unsub
    }
  }, [showSwitcher])

  // ── Keyboard navigation ──────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault()
        setSelIdx(i => (i + 1) % Math.max(shown.length, 1))
        resetHideTimer()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelIdx(i => (i - 1 + Math.max(shown.length, 1)) % Math.max(shown.length, 1))
        resetHideTimer()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        activateEntry(shown[selIdx])
        setVisible(false)
      } else if (e.key === 'Escape') {
        setVisible(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, shown, selIdx, resetHideTimer])

  // ── Activate selected entry ──────────────────────────────────────────────

  function activateEntry(entry: SwitcherEntry | undefined) {
    if (!entry) return
    if (entry.type === 'app' && entry.windowId) {
      restoreWindow(entry.windowId)
      focusWindow(entry.windowId)
    }
    // X11 windows: no JS focus possible from renderer; no-op
  }

  // ── Cleanup timer on unmount ─────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          style={{
            position:            'fixed',
            inset:               0,
            zIndex:              99000,
            background:          'rgba(0,0,0,0.55)',
            backdropFilter:      'blur(12px)',
            WebkitBackdropFilter:'blur(12px)',
            display:             'flex',
            alignItems:          'center',
            justifyContent:      'center',
            fontFamily:          font,
          }}
          onClick={() => setVisible(false)}
        >
          {/* Card row container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0, scale: 0.92,    y: 10 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.7 }}
            onClick={e => e.stopPropagation()}
            style={{
              background:   'rgba(12,16,26,0.92)',
              border:       '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding:      '20px 24px',
              display:      'flex',
              alignItems:   'center',
              gap:          12,
              overflowX:    'auto',
              maxWidth:     'min(90vw, 900px)',
              boxShadow:    '0 32px 80px rgba(0,0,0,0.75)',
            }}
          >
            {shown.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '8px 16px' }}>
                No open windows
              </div>
            ) : (
              shown.map((entry, i) => {
                const isSelected = i === selIdx
                const color = entry.color
                return (
                  <motion.button
                    key={entry.key}
                    onClick={() => { activateEntry(entry); setVisible(false) }}
                    whileHover={{ scale: 1.08 }}
                    animate={{
                      scale:   isSelected ? 1.12 : 1,
                      opacity: isSelected ? 1 : 0.55,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                    style={{
                      width:        96,
                      height:       96,
                      flexShrink:   0,
                      borderRadius: 18,
                      display:      'flex',
                      flexDirection:'column',
                      alignItems:   'center',
                      justifyContent:'center',
                      gap:          8,
                      cursor:       'pointer',
                      background:   `radial-gradient(ellipse at 40% 30%, ${color}30, rgba(8,12,20,0.92) 70%)`,
                      border:       isSelected
                        ? `1.5px solid ${color}`
                        : '1px solid rgba(255,255,255,0.08)',
                      boxShadow:    isSelected
                        ? `0 0 20px ${color}55, 0 0 6px ${color}30`
                        : 'none',
                      outline:      'none',
                      padding:      0,
                    }}
                  >
                    {/* Icon */}
                    <span
                      style={{
                        fontSize:   28,
                        lineHeight: 1,
                        color:      isSelected ? color : 'rgba(255,255,255,0.75)',
                        fontFamily: font,
                      }}
                    >
                      {entry.icon}
                    </span>

                    {/* Label */}
                    <span
                      style={{
                        fontSize:     10,
                        color:        isSelected ? color : 'rgba(255,255,255,0.4)',
                        fontWeight:   isSelected ? 600 : 400,
                        textAlign:    'center',
                        maxWidth:     82,
                        overflow:     'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace:   'nowrap',
                        letterSpacing:'0.01em',
                      }}
                    >
                      {entry.label}
                    </span>
                  </motion.button>
                )
              })
            )}
          </motion.div>

          {/* Hint bar */}
          <div style={{
            position:   'absolute',
            bottom:     40,
            left:       '50%',
            transform:  'translateX(-50%)',
            display:    'flex',
            gap:        16,
            alignItems: 'center',
          }}>
            {[
              { key: '←→', desc: 'navigate' },
              { key: '↵',  desc: 'switch'   },
              { key: 'esc',desc: 'cancel'   },
            ].map(({ key, desc }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <kbd style={{
                  background:   'rgba(255,255,255,0.07)',
                  border:       '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 5,
                  color:        'rgba(255,255,255,0.35)',
                  fontSize:     10,
                  padding:      '1px 6px',
                  fontFamily:   font,
                }}>
                  {key}
                </kbd>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
