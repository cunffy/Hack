import { useState, useEffect, useMemo, useRef, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePinnedStore, PinnedApp } from '../../store/pinnedStore'
import { useWindowStore, AppId } from '../../store/windowStore'
import { useDesktopStore } from '../../store/desktopStore'
import { APP_META } from '../../components/Dock'

const CATEGORY_ICONS: Record<string, string> = {
  Cryogram:    '✦',
  Security:    '🔐',
  Development: '💻',
  Gaming:      '🎮',
  Internet:    '🌐',
  Multimedia:  '🎵',
  Media:       '🎵',
  Graphics:    '🎨',
  Office:      '📄',
  System:      '⚙️',
  Utilities:   '🔧',
  Other:       '📦',
}

const CATEGORY_ORDER = [
  'Cryogram', 'Security', 'Development', 'Internet', 'System',
  'Utilities', 'Multimedia', 'Media', 'Graphics', 'Office', 'Gaming', 'Other',
]

// Category for each built-in Cryogram app so they slot into the same category
// sidebar as native apps (grouped by purpose, not by "which launch system").
const BUILTIN_CAT: Record<string, string> = {
  terminal: 'Development', editor: 'Development', git: 'Development', docker: 'Development',
  database: 'Development', 'api-tester': 'Development', 'json-explorer': 'Development',
  regex: 'Development', 'encoding-chain': 'Development', markdown: 'Development',
  'password-tester': 'Security', leaker: 'Security', firewall: 'Security', 'ssh-keys': 'Security',
  vpn: 'Security', shodan: 'Security', osint: 'Security', cve: 'Security',
  'packet-sniffer': 'Security', netmon: 'Security', scanner: 'Security',
  'cert-inspector': 'Security', wordlists: 'Security', 'password-health': 'Security',
  totp: 'Security', 'crypto-tools': 'Security', passwords: 'Security', 'audit-log': 'Security',
  'code-scanner': 'Security',
  settings: 'System', 'task-manager': 'System', logs: 'System', backup: 'System',
  trash: 'System', files: 'System', wallpaper: 'System', 'clipboard-history': 'System',
  calculator: 'Utilities', 'color-picker': 'Utilities', 'unit-converter': 'Utilities',
  'world-clock': 'Utilities', pomodoro: 'Utilities', screenshot: 'Utilities',
  'image-viewer': 'Utilities', 'remote-desktop': 'Utilities',
  mail: 'Internet', 'rss-reader': 'Internet', opticseo: 'Internet', phone: 'Internet',
  'ai-assistant': 'Internet',
  notes: 'Utilities', launcher: 'System',
}

// Unified launcher item — either a built-in Cryogram app or a native .desktop app.
type LItem =
  | { kind: 'builtin'; key: string; appId: AppId; name: string; category: string; color: string; icon: ReactNode }
  | { kind: 'native';  key: string; name: string; category: string; comment: string; icon: string; app: AppEntry }

export default function LauncherApp() {
  const [native, setNative] = useState<AppEntry[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [launching, setLaunching] = useState<string | null>(null)
  const [selIdx, setSelIdx] = useState(0)
  const [cols, setCols] = useState(1)
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; item: LItem } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const openApp = useWindowStore(s => s.openApp)
  const addDesktopIcon = useDesktopStore(s => s.addIcon)
  const { taskbar: pinnedTaskbar, desktop: pinnedDesktop, pinToTaskbar, pinToDesktop, unpinTaskbar, unpinDesktop } = usePinnedStore()

  useEffect(() => {
    window.cryogram.launcher.getApps().then(setNative).catch(() => setNative([]))
  }, [])

  // Build the unified item list: built-in Cryogram apps first, then native apps.
  const allItems = useMemo<LItem[]>(() => {
    const builtins: LItem[] = (Object.keys(APP_META) as AppId[])
      // 'system' is an alias of 'settings'; 'brave' is a native .desktop app
      // (listed below via getApps with its real icon), so skip both here.
      .filter(id => id !== 'system' && id !== 'brave')
      .map(id => ({
        kind: 'builtin' as const,
        key: `builtin-${id}`,
        appId: id,
        name: APP_META[id].label,
        category: BUILTIN_CAT[id] ?? 'Cryogram',
        color: APP_META[id].color,
        icon: APP_META[id].icon,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    const natives: LItem[] = native.map(app => ({
      kind: 'native' as const,
      key: `native-${app.desktopFile}`,
      name: app.name,
      category: app.category,
      comment: app.comment,
      icon: app.icon,
      app,
    }))

    return [...builtins, ...natives]
  }, [native])

  const categories = useMemo(() => {
    const cats = new Set(allItems.map(a => a.category))
    const ordered = CATEGORY_ORDER.filter(c => cats.has(c))
    const extra = [...cats].filter(c => !CATEGORY_ORDER.includes(c)).sort()
    return ['All', ...ordered, ...extra]
  }, [allItems])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allItems.filter(a => {
      const matchCat = activeCategory === 'All' || a.category === activeCategory
      const comment = a.kind === 'native' ? a.comment : ''
      const matchSearch = !q || a.name.toLowerCase().includes(q) ||
        comment.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [allItems, search, activeCategory])

  // Keep selection in range when the filtered list changes.
  useEffect(() => { setSelIdx(i => Math.min(i, Math.max(0, filtered.length - 1))) }, [filtered.length])

  // Track the grid column count so arrow-key navigation moves by rows correctly.
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const measure = () => {
      const cs = getComputedStyle(el)
      const n = cs.gridTemplateColumns.split(' ').filter(Boolean).length
      setCols(Math.max(1, n))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [filtered.length])

  const launch = useCallback(async (item: LItem) => {
    if (item.kind === 'builtin') {
      openApp(item.appId)
      return
    }
    setLaunching(item.key)
    try { await window.cryogram.launcher.launch(item.app) } catch {}
    setTimeout(() => setLaunching(null), 1500)
  }, [openApp])

  // Keyboard navigation: arrows move the selection, Enter launches, Escape
  // clears the search, and typing anywhere focuses the search box.
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const n = filtered.length
    if (n === 0) return
    if (e.key === 'ArrowRight') { e.preventDefault(); setSelIdx(i => Math.min(n - 1, i + 1)) }
    else if (e.key === 'ArrowLeft')  { e.preventDefault(); setSelIdx(i => Math.max(0, i - 1)) }
    else if (e.key === 'ArrowDown')  { e.preventDefault(); setSelIdx(i => Math.min(n - 1, i + cols)) }
    else if (e.key === 'ArrowUp')    { e.preventDefault(); setSelIdx(i => Math.max(0, i - cols)) }
    else if (e.key === 'Enter')      { e.preventDefault(); if (filtered[selIdx]) launch(filtered[selIdx]) }
    else if (e.key === 'Escape')     { if (search) { e.preventDefault(); setSearch('') } }
  }, [filtered, cols, selIdx, search, launch])

  // Scroll the selected tile into view as it moves.
  useEffect(() => {
    const el = gridRef.current?.querySelector<HTMLElement>(`[data-idx="${selIdx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selIdx])

  const toPinned = (app: AppEntry): PinnedApp => ({
    id: app.desktopFile, name: app.name, exec: app.exec,
    icon: app.icon, category: app.category, desktopFile: app.desktopFile,
  })

  return (
    <div className="flex flex-1 overflow-hidden text-cryo-text" onKeyDown={onKeyDown} tabIndex={-1}>
      {/* Sidebar */}
      <div
        className="w-48 shrink-0 flex flex-col py-3 overflow-auto"
        style={{ borderRight: '1px solid rgba(26,40,64,0.6)', background: 'rgba(8,12,18,0.5)' }}
      >
        <div className="px-4 mb-2 text-cryo-muted text-[11px] uppercase tracking-widest font-semibold">Categories</div>
        {categories.map(cat => {
          const count = cat === 'All' ? allItems.length : allItems.filter(a => a.category === cat).length
          const active = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelIdx(0) }}
              className="flex items-center gap-2.5 mx-2 px-2.5 py-2 text-[13px] rounded-lg transition-colors text-left"
              style={{
                color: active ? '#00d4ff' : '#c9d1d9',
                background: active ? 'rgba(0,212,255,0.12)' : 'transparent',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <span className="w-5 text-center text-base">{cat === 'All' ? '✦' : (CATEGORY_ICONS[cat] || '📦')}</span>
              <span className="flex-1">{cat}</span>
              <span style={{ fontSize: 10, color: active ? '#00d4ff' : 'rgba(255,255,255,0.3)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar */}
        <div
          className="px-4 py-3 shrink-0 flex items-center gap-2"
          style={{ borderBottom: '1px solid rgba(26,40,64,0.6)', background: 'rgba(13,20,33,0.4)' }}
        >
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              autoFocus
              className="w-full text-sm py-2 pl-9 pr-3 rounded-lg outline-none"
              style={{ background: 'rgba(8,12,18,0.6)', border: '1px solid rgba(26,40,64,0.6)', color: '#c9d1d9' }}
              placeholder="Search applications…  (type to filter, ↵ to launch)"
              value={search}
              onChange={e => { setSearch(e.target.value); setSelIdx(0) }}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>

        {/* App grid */}
        <div className="flex-1 overflow-auto p-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-cryo-muted gap-2">
              <div style={{ fontSize: 34 }}>🔍</div>
              <div className="text-sm">No applications found</div>
              {search && <button className="text-xs mt-1" style={{ color: '#00d4ff' }} onClick={() => setSearch('')}>Clear search</button>}
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid gap-3"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(116px, 1fr))' }}
            >
              <AnimatePresence>
                {filtered.map((item, i) => {
                  const pinnedTb = item.kind === 'native' && pinnedTaskbar.some(p => p.id === item.app.desktopFile)
                  const pinnedDt = item.kind === 'native' && pinnedDesktop.some(p => p.id === item.app.desktopFile)
                  const selected = i === selIdx
                  const isLaunching = item.kind === 'native' && launching === item.key
                  const accent = item.kind === 'builtin' ? item.color : '#00d4ff'
                  return (
                    <motion.div
                      key={item.key}
                      data-idx={i}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.12, delay: Math.min(i * 0.008, 0.2) }}
                      onClick={() => { setSelIdx(i); launch(item) }}
                      onMouseEnter={() => setSelIdx(i)}
                      onContextMenu={e => { e.preventDefault(); setSelIdx(i); setCtxMenu({ x: e.clientX, y: e.clientY, item }) }}
                      title={item.kind === 'native' ? (item.comment || item.name) : item.name}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors relative"
                      style={{
                        background: isLaunching ? 'rgba(0,212,255,0.15)' : selected ? 'rgba(255,255,255,0.07)' : 'rgba(13,20,33,0.4)',
                        border: `1px solid ${selected || isLaunching ? `${accent}66` : 'rgba(26,40,64,0.5)'}`,
                        boxShadow: selected ? `0 0 18px ${accent}22` : 'none',
                      }}
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
                        style={{
                          background: item.kind === 'builtin'
                            ? `radial-gradient(ellipse at 38% 28%, ${item.color}2e, rgba(10,15,24,0.9) 72%)`
                            : 'rgba(0,212,255,0.07)',
                          border: `1px solid ${item.kind === 'builtin' ? `${item.color}33` : 'rgba(0,212,255,0.15)'}`,
                        }}
                      >
                        {item.kind === 'builtin' ? (
                          <div style={{ color: item.color, transform: 'scale(1.25)' }}>{item.icon}</div>
                        ) : (
                          <NativeIcon icon={item.icon} fallback={CATEGORY_ICONS[item.category] || '📦'} />
                        )}
                      </div>
                      <span className="text-xs text-center leading-tight line-clamp-2 max-w-full" style={{ color: selected ? '#fff' : '#c9d1d9' }}>
                        {item.name}
                      </span>
                      {isLaunching && <span className="text-[10px]" style={{ color: '#00d4ff' }}>Launching…</span>}
                      {(pinnedTb || pinnedDt) && (
                        <div className="absolute top-1.5 right-1.5 flex gap-0.5">
                          {pinnedTb && <span title="Pinned to Taskbar" style={{ fontSize: 8, color: '#00d4ff' }}>▬</span>}
                          {pinnedDt && <span title="Pinned to Desktop" style={{ fontSize: 8, color: '#34d399' }}>⬛</span>}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div
          className="px-4 py-1.5 text-[11px] text-cryo-muted shrink-0 flex items-center gap-3"
          style={{ borderTop: '1px solid rgba(26,40,64,0.4)' }}
        >
          <span>{filtered.length} app{filtered.length !== 1 ? 's' : ''}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Click to launch</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>↑↓←→ to navigate · ↵ to open</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>Right-click to pin</span>
        </div>
      </div>

      {/* Right-click context menu */}
      <AnimatePresence>
        {ctxMenu && (() => {
          const it = ctxMenu.item
          const nat = it.kind === 'native' ? it.app : null
          return (
            <LauncherCtxMenu
              x={ctxMenu.x}
              y={ctxMenu.y}
              item={it}
              isPinnedTaskbar={!!nat && pinnedTaskbar.some(p => p.id === nat.desktopFile)}
              isPinnedDesktop={!!nat && pinnedDesktop.some(p => p.id === nat.desktopFile)}
              onLaunch={() => { launch(it); setCtxMenu(null) }}
              onAddBuiltinDesktop={() => { if (it.kind === 'builtin') addDesktopIcon(it.appId); setCtxMenu(null) }}
              onPinTaskbar={() => { if (nat) pinToTaskbar(toPinned(nat)); setCtxMenu(null) }}
              onUnpinTaskbar={() => { if (nat) unpinTaskbar(nat.desktopFile); setCtxMenu(null) }}
              onPinDesktop={() => { if (nat) pinToDesktop(toPinned(nat)); setCtxMenu(null) }}
              onUnpinDesktop={() => { if (nat) unpinDesktop(nat.desktopFile); setCtxMenu(null) }}
              onClose={() => setCtxMenu(null)}
            />
          )
        })()}
      </AnimatePresence>
    </div>
  )
}

// Native .desktop icon: render the image, but fall back to the category emoji if
// the icon path is empty OR fails to load (the old code showed an empty box).
function NativeIcon({ icon, fallback }: { icon: string; fallback: string }) {
  const [failed, setFailed] = useState(false)
  if (!icon || failed) return <span style={{ fontSize: 26 }}>{fallback}</span>
  return (
    <img
      src={icon}
      alt=""
      className="w-10 h-10 object-contain"
      onError={() => setFailed(true)}
    />
  )
}

// ── Launcher context menu ─────────────────────────────────────────────────────
interface CtxProps {
  x: number; y: number; item: LItem
  isPinnedTaskbar: boolean; isPinnedDesktop: boolean
  onLaunch: () => void
  onAddBuiltinDesktop: () => void
  onPinTaskbar: () => void; onUnpinTaskbar: () => void
  onPinDesktop: () => void; onUnpinDesktop: () => void
  onClose: () => void
}

function LauncherCtxMenu({ x, y, item, isPinnedTaskbar, isPinnedDesktop, onLaunch, onAddBuiltinDesktop, onPinTaskbar, onUnpinTaskbar, onPinDesktop, onUnpinDesktop, onClose }: CtxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const left = Math.min(x, window.innerWidth - 210)
  const top  = Math.min(y, window.innerHeight - 200)

  type MenuItem = { label: string; action: () => void; icon: string } | null
  const items: MenuItem[] = item.kind === 'builtin'
    ? [
        { label: `Open ${item.name}`, action: onLaunch, icon: '▶' },
        null,
        { label: 'Add to Desktop', action: onAddBuiltinDesktop, icon: '⬛' },
      ]
    : [
        { label: `Launch ${item.name}`, action: onLaunch, icon: '▶' },
        null,
        isPinnedTaskbar
          ? { label: 'Unpin from Taskbar', action: onUnpinTaskbar, icon: '▬' }
          : { label: 'Pin to Taskbar',     action: onPinTaskbar,   icon: '▬' },
        isPinnedDesktop
          ? { label: 'Remove from Desktop', action: onUnpinDesktop, icon: '⬛' }
          : { label: 'Add to Desktop',      action: onPinDesktop,   icon: '⬛' },
      ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.93, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93, y: 4 }}
      transition={{ duration: 0.1 }}
      onContextMenu={e => e.preventDefault()}
      style={{
        position: 'fixed', left, top,
        background: 'rgba(13,20,33,0.99)', border: '1px solid rgba(0,212,255,0.2)',
        borderRadius: 10, padding: 4, zIndex: 99999, minWidth: 200,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      }}
    >
      <div className="px-3 py-1.5 text-xs font-semibold" style={{ color: '#00d4ff', fontFamily: 'monospace', borderBottom: '1px solid rgba(0,212,255,0.1)', marginBottom: 2 }}>
        {item.name}
      </div>
      {items.map((it, i) =>
        it === null ? (
          <div key={i} style={{ height: 1, background: 'rgba(0,212,255,0.08)', margin: '3px 8px' }} />
        ) : (
          <button
            key={it.label}
            onClick={it.action}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', textAlign: 'left',
              padding: '7px 12px', borderRadius: 6, border: 'none', background: 'none',
              cursor: 'pointer', fontSize: 12, fontFamily: 'monospace', color: '#c9d1d9',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <span style={{ width: 16, textAlign: 'center', fontSize: 10, color: '#00d4ff' }}>{it.icon}</span>
            {it.label}
          </button>
        )
      )}
    </motion.div>
  )
}
