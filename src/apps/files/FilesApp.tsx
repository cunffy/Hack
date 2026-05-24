import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SIDEBAR_LOCS = [
  { label: 'Home',      icon: '⌂', key: 'home' },
  { label: 'Desktop',   icon: '🖥', key: 'desktop' },
  { label: 'Documents', icon: '📄', key: 'documents' },
  { label: 'Downloads', icon: '↓',  key: 'downloads' },
  { label: 'Pictures',  icon: '🖼', key: 'pictures' },
  { label: 'Music',     icon: '♪',  key: 'music' },
  { label: 'Videos',    icon: '▶',  key: 'videos' },
]

const EXT_COLORS: Record<string, string> = {
  py: '#3572A5', js: '#f7df1e', ts: '#3178c6', tsx: '#3178c6', jsx: '#61dafb',
  rs: '#dea584', go: '#00acd7', c: '#555555', cpp: '#f34b7d', sh: '#89e051',
  json: '#cbcb41', md: '#083fa1', html: '#e34c26', css: '#563d7c',
  png: '#a78bfa', jpg: '#a78bfa', jpeg: '#a78bfa', gif: '#a78bfa', svg: '#a78bfa',
  mp4: '#ef4444', mp3: '#f97316', pdf: '#ef4444', zip: '#eab308', tar: '#eab308',
  txt: '#c9d1d9', log: '#6b7280',
}

function fileColor(ext: string): string {
  return EXT_COLORS[ext.toLowerCase()] || '#4e5d6e'
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

export default function FilesApp() {
  const [home, setHome] = useState('')
  const [cwd, setCwd] = useState('')
  const [items, setItems] = useState<FileItem[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [drives, setDrives] = useState<DriveEntry[]>([])
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameVal, setRenameVal] = useState('')
  const [loading, setLoading] = useState(false)
  const [ctx, setCtx] = useState<{ x: number; y: number; item: FileItem | null } | null>(null)

  useEffect(() => {
    window.cryogram.files.getHome().then(h => {
      setHome(h)
      navigate(h)
    })
    window.cryogram.files.getDrives().then(setDrives)
  }, [])

  const navigate = useCallback(async (path: string, addHistory = true) => {
    setLoading(true)
    setSelected(new Set())
    setSearch('')
    try {
      const entries = await window.cryogram.files.readDir(path)
      setCwd(path)
      setItems(entries)
      if (addHistory) {
        setHistory(h => [...h.slice(0, histIdx + 1), path])
        setHistIdx(i => i + 1)
      }
    } catch (e) {
      console.error('readDir failed', e)
    } finally {
      setLoading(false)
    }
  }, [histIdx])

  const goBack = () => {
    if (histIdx > 0) {
      setHistIdx(i => i - 1)
      navigate(history[histIdx - 1], false)
    }
  }
  const goForward = () => {
    if (histIdx < history.length - 1) {
      setHistIdx(i => i + 1)
      navigate(history[histIdx + 1], false)
    }
  }
  const goUp = () => {
    const parent = cwd.split('/').slice(0, -1).join('/') || '/'
    if (parent !== cwd) navigate(parent)
  }

  const openItem = async (item: FileItem) => {
    if (item.isDir) {
      navigate(item.path)
    } else {
      await window.cryogram.files.openExternal(item.path)
    }
  }

  const deleteSelected = async () => {
    for (const path of selected) {
      await window.cryogram.files.delete(path)
    }
    navigate(cwd, false)
    setCtx(null)
  }

  const startRename = (item: FileItem) => {
    setRenaming(item.path)
    setRenameVal(item.name)
    setCtx(null)
  }

  const commitRename = async () => {
    if (renaming && renameVal.trim()) {
      await window.cryogram.files.rename(renaming, renameVal.trim())
      navigate(cwd, false)
    }
    setRenaming(null)
  }

  const newFolder = async () => {
    let name = 'New Folder'; let i = 1
    const names = items.map(x => x.name)
    while (names.includes(name)) name = `New Folder ${++i}`
    await window.cryogram.files.mkdir(`${cwd}/${name}`)
    navigate(cwd, false)
  }

  const sidebarPath = (key: string) => {
    if (key === 'home') return home
    return `${home}/${key.charAt(0).toUpperCase() + key.slice(1)}`
  }

  const filtered = items.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="flex flex-1 overflow-hidden text-cryo-text"
      onContextMenu={e => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, item: null }) }}
      onClick={() => { setCtx(null); setSelected(new Set()) }}
    >
      {/* Sidebar */}
      <div
        className="w-44 shrink-0 flex flex-col py-3 overflow-auto"
        style={{ borderRight: '1px solid rgba(26,40,64,0.6)', background: 'rgba(8,12,18,0.5)' }}
      >
        <div className="px-3 mb-1 text-cryo-muted text-xs uppercase tracking-widest">Locations</div>
        {SIDEBAR_LOCS.map(loc => (
          <button
            key={loc.key}
            onClick={() => navigate(sidebarPath(loc.key))}
            className="flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-white/5 text-left"
            style={{ color: cwd === sidebarPath(loc.key) ? '#00d4ff' : '#c9d1d9' }}
          >
            <span className="text-sm w-5 text-center">{loc.icon}</span>
            {loc.label}
          </button>
        ))}

        {drives.length > 0 && (
          <>
            <div className="px-3 mt-3 mb-1 text-cryo-muted text-xs uppercase tracking-widest">Drives</div>
            {drives.map(d => (
              <button
                key={d.path}
                onClick={() => navigate(d.path)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-white/5 text-left"
                style={{ color: cwd === d.path ? '#00d4ff' : '#c9d1d9' }}
              >
                <span className="text-sm w-5 text-center">💾</span>
                {d.name}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 shrink-0"
          style={{ borderBottom: '1px solid rgba(26,40,64,0.6)', background: 'rgba(13,20,33,0.4)' }}
        >
          <NavBtn onClick={goBack}    disabled={histIdx <= 0}>←</NavBtn>
          <NavBtn onClick={goForward} disabled={histIdx >= history.length - 1}>→</NavBtn>
          <NavBtn onClick={goUp}      disabled={!cwd || cwd === '/'}>↑</NavBtn>

          {/* Path bar */}
          <div
            className="flex-1 mx-2 px-2.5 py-1 rounded-md text-xs truncate text-cryo-muted"
            style={{ background: 'rgba(8,12,18,0.6)', border: '1px solid rgba(26,40,64,0.6)' }}
            title={cwd}
          >
            {cwd}
          </div>

          <input
            className="w-36 text-xs py-1 px-2"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
          <NavBtn onClick={newFolder} title="New Folder">+</NavBtn>
        </div>

        {/* File grid */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-cryo-muted text-xs">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-cryo-muted text-xs">
              {search ? 'No results' : 'Empty folder'}
            </div>
          ) : (
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))' }}>
              {filtered.map(item => (
                <div
                  key={item.path}
                  onDoubleClick={() => openItem(item)}
                  onClick={e => { e.stopPropagation(); setSelected(new Set([item.path])) }}
                  onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setCtx({ x: e.clientX, y: e.clientY, item }) }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-default transition-colors"
                  style={{
                    background: selected.has(item.path) ? 'rgba(0,212,255,0.12)' : 'transparent',
                    border: selected.has(item.path) ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                    style={{
                      background: item.isDir ? 'rgba(0,212,255,0.1)' : `${fileColor(item.ext)}18`,
                      border: `1px solid ${item.isDir ? 'rgba(0,212,255,0.2)' : fileColor(item.ext) + '33'}`,
                      color: item.isDir ? '#00d4ff' : fileColor(item.ext),
                      fontSize: item.isDir ? 24 : 11,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {item.isDir ? '📁' : (item.ext ? `.${item.ext}` : '?')}
                  </div>

                  {/* Name */}
                  {renaming === item.path ? (
                    <input
                      autoFocus
                      value={renameVal}
                      onChange={e => setRenameVal(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitRename()
                        if (e.key === 'Escape') setRenaming(null)
                      }}
                      className="text-xs w-full text-center px-1 py-0.5 rounded"
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-xs text-center leading-tight line-clamp-2 max-w-full break-all">
                      {item.name}
                    </span>
                  )}

                  {!item.isDir && (
                    <span className="text-xs text-cryo-muted">{formatSize(item.size)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div
          className="px-4 py-1 text-xs text-cryo-muted shrink-0"
          style={{ borderTop: '1px solid rgba(26,40,64,0.4)' }}
        >
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          {selected.size > 0 && ` · ${selected.size} selected`}
        </div>
      </div>

      {/* Context menu */}
      <AnimatePresence>
        {ctx && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 py-1 rounded-lg overflow-hidden"
            style={{
              left: ctx.x, top: ctx.y,
              background: 'rgba(13,20,33,0.97)',
              border: '1px solid rgba(26,40,64,0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              minWidth: 180,
            }}
            onClick={e => e.stopPropagation()}
          >
            {ctx.item ? (
              <>
                <CtxItem label={ctx.item.isDir ? 'Open' : 'Open'} onClick={() => { openItem(ctx.item!); setCtx(null) }} />
                <CtxItem label="Rename"  onClick={() => startRename(ctx.item!)} />
                <CtxDivider />
                <CtxItem label="Delete"  onClick={deleteSelected} danger />
              </>
            ) : (
              <>
                <CtxItem label="New Folder"  onClick={() => { newFolder(); setCtx(null) }} />
                <CtxItem label="Refresh"     onClick={() => { navigate(cwd, false); setCtx(null) }} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavBtn({ onClick, disabled, children, title }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; title?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded text-cryo-muted hover:text-cryo-text hover:bg-white/5 transition-colors text-sm disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function CtxItem({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-1.5 text-xs transition-colors hover:bg-white/5"
      style={{ color: danger ? '#ff4466' : '#c9d1d9' }}
    >
      {label}
    </button>
  )
}
function CtxDivider() {
  return <div className="my-1 mx-2" style={{ height: 1, background: 'rgba(26,40,64,0.8)' }} />
}
