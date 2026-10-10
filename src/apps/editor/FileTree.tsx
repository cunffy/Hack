import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ContextMenu, MenuItem } from '../../components/ContextMenu'

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

interface CtxState { x: number; y: number; entry: Entry }

interface FileTreeProps {
  workspace: string
  onOpenFile: (path: string, name: string) => void
}

function TreeNode({
  entry,
  depth,
  onOpenFile,
  onContextMenu,
}: {
  entry: Entry
  depth: number
  onOpenFile: (path: string, name: string) => void
  onContextMenu: (e: React.MouseEvent, entry: Entry) => void
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
        onContextMenu={e => { e.preventDefault(); onContextMenu(e, entry) }}
      >
        <span className="shrink-0 w-4 text-center">{iconEl}</span>
        <span className="truncate">{entry.name}</span>
      </div>
      {open && children.map((child) => (
        <TreeNode key={child.path} entry={child} depth={depth + 1} onOpenFile={onOpenFile} onContextMenu={onContextMenu} />
      ))}
    </div>
  )
}

export function FileTree({ workspace, onOpenFile }: FileTreeProps) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [ctx, setCtx] = useState<CtxState | null>(null)

  const reload = () => {
    window.cryogram.fs.readDir('__workspace__').then(setEntries).catch(() => setEntries([]))
  }

  useEffect(() => { reload() }, [workspace])

  const ctxItems = (): MenuItem[] => {
    if (!ctx) return []
    const { entry } = ctx
    const items: MenuItem[] = []

    if (!entry.isDir) {
      items.push({ label: 'Open File', action: () => onOpenFile(entry.path, entry.name) })
    }

    items.push({
      label: 'Copy Path',
      action: () => navigator.clipboard.writeText(entry.path).catch(() => {}),
    })

    if (entry.isDir) {
      items.push({ sep: true })
      items.push({
        label: 'New File Here',
        action: async () => {
          const name = prompt('File name:')
          if (!name) return
          const sep = entry.path.endsWith('/') ? '' : '/'
          await window.cryogram.fs.writeFile(`${entry.path}${sep}${name}`, '').catch(() => {})
          reload()
        },
      })
    }

    return items
  }

  return (
    <div className="py-2">
      <div className="px-2 pb-1 text-xs text-cryo-muted font-bold uppercase tracking-wider">
        Explorer
      </div>
      {entries.length === 0 ? (
        <div className="px-3 py-2 text-xs text-cryo-muted">Empty workspace</div>
      ) : (
        entries.map((e) => (
          <TreeNode key={e.path} entry={e} depth={0} onOpenFile={onOpenFile} onContextMenu={(ev, entry) => setCtx({ x: ev.clientX, y: ev.clientY, entry })} />
        ))
      )}

      <AnimatePresence>
        {ctx && (
          <ContextMenu
            x={ctx.x} y={ctx.y}
            onClose={() => setCtx(null)}
            items={ctxItems()}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
