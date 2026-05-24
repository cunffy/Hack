import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORY_ICONS: Record<string, string> = {
  Security:    '🔐',
  Development: '💻',
  Gaming:      '🎮',
  Internet:    '🌐',
  Multimedia:  '🎵',
  Graphics:    '🎨',
  Office:      '📄',
  System:      '⚙️',
  Utilities:   '🔧',
  Other:       '📦',
}

const CATEGORY_ORDER = [
  'Security', 'Development', 'Gaming', 'Internet',
  'Multimedia', 'Graphics', 'Office', 'System', 'Utilities', 'Other',
]

export default function LauncherApp() {
  const [apps, setApps] = useState<AppEntry[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [launching, setLaunching] = useState<string | null>(null)

  useEffect(() => {
    window.cryogram.launcher.getApps().then(setApps).catch(() => setApps([]))
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(apps.map(a => a.category))
    return ['All', ...CATEGORY_ORDER.filter(c => cats.has(c)), ...([...cats].filter(c => !CATEGORY_ORDER.includes(c)))]
  }, [apps])

  const filtered = useMemo(() => {
    return apps.filter(a => {
      const matchCat = activeCategory === 'All' || a.category === activeCategory
      const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.comment?.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [apps, search, activeCategory])

  const launch = async (app: AppEntry) => {
    setLaunching(app.desktopFile)
    try {
      await window.cryogram.launcher.launch(app)
    } catch {}
    setTimeout(() => setLaunching(null), 1500)
  }

  return (
    <div className="flex flex-1 overflow-hidden text-cryo-text">
      {/* Sidebar */}
      <div
        className="w-44 shrink-0 flex flex-col py-3 overflow-auto"
        style={{ borderRight: '1px solid rgba(26,40,64,0.6)', background: 'rgba(8,12,18,0.5)' }}
      >
        <div className="px-3 mb-2 text-cryo-muted text-xs uppercase tracking-widest">Categories</div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-white/5 text-left"
            style={{ color: activeCategory === cat ? '#00d4ff' : '#c9d1d9' }}
          >
            <span className="w-5 text-center">{cat === 'All' ? '✦' : (CATEGORY_ICONS[cat] || '📦')}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar */}
        <div
          className="px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(26,40,64,0.6)', background: 'rgba(13,20,33,0.4)' }}
        >
          <input
            autoFocus
            className="w-full text-sm py-2 px-3 rounded-lg"
            style={{ background: 'rgba(8,12,18,0.6)', border: '1px solid rgba(26,40,64,0.6)', color: '#c9d1d9' }}
            placeholder="Search applications…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* App grid */}
        <div className="flex-1 overflow-auto p-4">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-cryo-muted text-xs">
              No applications found
            </div>
          ) : (
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))' }}
            >
              <AnimatePresence>
                {filtered.map((app, i) => (
                  <motion.div
                    key={app.desktopFile}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.01 }}
                    onDoubleClick={() => launch(app)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-default transition-all"
                    style={{
                      background: launching === app.desktopFile
                        ? 'rgba(0,212,255,0.15)'
                        : 'rgba(13,20,33,0.4)',
                      border: launching === app.desktopFile
                        ? '1px solid rgba(0,212,255,0.4)'
                        : '1px solid rgba(26,40,64,0.5)',
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}
                    >
                      {app.icon ? (
                        <img
                          src={app.icon}
                          alt=""
                          className="w-10 h-10 object-contain"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <span>{CATEGORY_ICONS[app.category] || '📦'}</span>
                      )}
                    </div>
                    <span className="text-xs text-center leading-tight line-clamp-2 max-w-full">{app.name}</span>
                    {launching === app.desktopFile && (
                      <span className="text-xs text-cryo-accent">Launching…</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div
          className="px-4 py-1 text-xs text-cryo-muted shrink-0"
          style={{ borderTop: '1px solid rgba(26,40,64,0.4)' }}
        >
          {filtered.length} app{filtered.length !== 1 ? 's' : ''} · Double-click to launch
        </div>
      </div>
    </div>
  )
}
