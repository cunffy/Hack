import { useState, useEffect } from 'react'

const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  py: { icon: '🐍', color: '#ffcc00' },
  js: { icon: 'JS', color: '#f7df1e' },
  ts: { icon: 'TS', color: '#3178c6' },
  tsx: { icon: 'TSX', color: '#61dafb' },
  jsx: { icon: 'JSX', color: '#61dafb' },
  rs: { icon: '🦀', color: '#f74c00' },
  go: { icon: 'Go', color: '#00add8' },
  c: { icon: 'C', color: '#00d4ff' },
  cpp: { icon: 'C++', color: '#00d4ff' },
  sh: { icon: '$', color: '#00ff88' },
  json: { icon: '{}', color: '#bb88ff' },
  md: { icon: 'MD', color: '#c9d1d9' },
}

interface Entry {
  name: string
  path: string
  isDir: boolean
  ext: string
}

interface FileTreeProps {
  workspace: string
  onOpenFile: (path: string, name: string) => void
}

function TreeNode({
  entry,
  depth,
  onOpenFile,
}: {
  entry: Entry
  depth: number
  onOpenFile: (path: string, name: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [children, setChildren] = useState<Entry[]>([])

  const toggle = async () => {
    if (!entry.isDir) { onOpenFile(entry.path, entry.name); return }
    if (!open) {
      const entries = await window.cryogram.fs.readDir(entry.path)
      setChildren(entries)
    }
    setOpen(!open)
  }

  const icon = entry.isDir
    ? open ? '📂' : '📁'
    : (FILE_ICONS[entry.ext] || { icon: '📄', color: '#6e7681' })

  const iconEl = typeof icon === 'string'
    ? <span>{icon}</span>
    : <span style={{ color: icon.color, fontSize: 10, fontWeight: 'bold' }}>{icon.icon}</span>

  return (
    <div>
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 cursor-pointer hover:bg-cryo-border/40 text-cryo-text text-xs rounded transition-colors"
        style={{ paddingLeft: `${8 + depth * 12}px` }}
        onClick={toggle}
      >
        <span className="shrink-0 w-4 text-center">{iconEl}</span>
        <span className="truncate">{entry.name}</span>
      </div>
      {open && children.map((child) => (
        <TreeNode key={child.path} entry={child} depth={depth + 1} onOpenFile={onOpenFile} />
      ))}
    </div>
  )
}

export function FileTree({ workspace, onOpenFile }: FileTreeProps) {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    window.cryogram.fs.readDir('__workspace__').then(setEntries).catch(() => setEntries([]))
  }, [workspace])

  return (
    <div className="py-2">
      <div className="px-2 pb-1 text-xs text-cryo-muted font-bold uppercase tracking-wider">
        Explorer
      </div>
      {entries.length === 0 ? (
        <div className="px-3 py-2 text-xs text-cryo-muted">Empty workspace</div>
      ) : (
        entries.map((e) => (
          <TreeNode key={e.path} entry={e} depth={0} onOpenFile={onOpenFile} />
        ))
      )}
    </div>
  )
}
