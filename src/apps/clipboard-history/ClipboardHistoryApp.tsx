import React, { useEffect, useState, useRef } from 'react'

interface ClipEntry { id: string; text: string; ts: number; pinned: boolean }

const api = () => (window as any).cryogram?.clipboardHistory

export default function ClipboardHistoryApp() {
  const [entries, setEntries] = useState<ClipEntry[]>([])
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    api()?.getAll().then(setEntries)
    const off = api()?.onChange?.((entry: ClipEntry) => setEntries(prev => [entry, ...prev.filter(e => e.text !== entry.text)].slice(0, 200)))
    return () => off?.()
  }, [])

  const filtered = entries.filter(e =>
    !search || e.text.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.ts - a.ts)

  async function copy(id: string) {
    await api()?.copy(id)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  async function togglePin(id: string) {
    const updated = await api()?.pin(id)
    if (updated) setEntries(updated)
  }

  async function del(id: string) {
    const updated = await api()?.delete(id)
    if (updated) setEntries(updated)
  }

  async function clearAll() {
    const updated = await api()?.clear()
    if (updated) setEntries(updated)
  }

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-100 font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <span className="text-lg">📋</span>
        <span className="font-bold text-purple-400">Clipboard History</span>
        <span className="text-xs text-gray-500 ml-auto">{entries.length} items</span>
        <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-800 hover:border-red-600">
          Clear unpinned
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-gray-800">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clipboard history…"
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-12">
            {search ? 'No matches' : 'Copy something to start building history'}
          </div>
        )}
        {filtered.map(entry => (
          <div key={entry.id} className={`group flex items-start gap-2 px-4 py-3 border-b border-gray-800/60 hover:bg-gray-900 ${entry.pinned ? 'bg-purple-950/20' : ''}`}>
            {/* Pin indicator */}
            {entry.pinned && <span className="text-purple-400 mt-0.5 shrink-0">📌</span>}

            {/* Text preview */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate whitespace-pre-wrap line-clamp-3 break-all leading-relaxed">
                {entry.text}
              </p>
              <p className="text-xs text-gray-600 mt-1">{new Date(entry.ts).toLocaleTimeString()}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 shrink-0">
              <button onClick={() => copy(entry.id)}
                className={`text-xs px-2 py-1 rounded ${copied === entry.id ? 'bg-green-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                {copied === entry.id ? '✓' : 'Copy'}
              </button>
              <button onClick={() => togglePin(entry.id)}
                className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-purple-700 text-gray-300">
                {entry.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button onClick={() => del(entry.id)}
                className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-red-700 text-gray-300">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
