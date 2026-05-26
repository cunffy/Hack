import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────

interface PasswordEntry {
  id: string
  title: string
  username: string
  password: string
  url?: string
  notes?: string
  tags?: string[]
  createdAt: number
  updatedAt: number
}

type NewEntry = Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>

interface GenOpts {
  length: number
  upper: boolean
  lower: boolean
  numbers: boolean
  symbols: boolean
}

// ── Accent ────────────────────────────────────────────────────────────────────

const ACCENT = '#ffcc00'

// ── Helpers ───────────────────────────────────────────────────────────────────

const ipc = (window as any).cryogram

async function loadEntries(): Promise<PasswordEntry[]> {
  return ipc.passwords.getAll()
}

function fieldStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: '7px 10px',
    color: '#e0e8f0',
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
    ...extra,
  }
}

function label(text: string) {
  return (
    <label style={{
      display: 'block',
      fontSize: 10,
      color: 'rgba(140,160,180,0.6)',
      marginBottom: 4,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.07em',
    }}>
      {text}
    </label>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ text, title }: { text: string; title?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [text])

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={copy}
      title={title}
      style={{
        padding: '4px 10px',
        background: copied ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${copied ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 5,
        color: copied ? 'rgba(0,255,136,0.9)' : 'rgba(180,200,220,0.7)',
        fontSize: 10,
        cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
        flexShrink: 0,
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </motion.button>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: 32 }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{ fontSize: 48, filter: `drop-shadow(0 0 18px ${ACCENT}44)` }}
      >
        🔒
      </motion.div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(200,210,220,0.7)' }}>No entries yet</div>
      <div style={{ fontSize: 12, color: 'rgba(140,160,180,0.45)', textAlign: 'center' }}>
        Click "New Entry" to add your first password.
      </div>
    </div>
  )
}

// ── EntryForm ─────────────────────────────────────────────────────────────────

interface EntryFormProps {
  initial?: Partial<NewEntry>
  onSave: (entry: NewEntry) => void
  onCancel: () => void
  saving?: boolean
}

function EntryForm({ initial, onSave, onCancel, saving }: EntryFormProps) {
  const [title,    setTitle]    = useState(initial?.title    ?? '')
  const [username, setUsername] = useState(initial?.username ?? '')
  const [password, setPassword] = useState(initial?.password ?? '')
  const [url,      setUrl]      = useState(initial?.url      ?? '')
  const [notes,    setNotes]    = useState(initial?.notes    ?? '')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const submit = () => {
    if (!title.trim())    { setError('Title is required'); return }
    if (!username.trim()) { setError('Username is required'); return }
    if (!password.trim()) { setError('Password is required'); return }
    setError(null)
    onSave({ title: title.trim(), username: username.trim(), password, url: url.trim(), notes: notes.trim() })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 16px' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 2 }}>
        {initial?.title ? 'Edit Entry' : 'New Entry'}
      </div>

      <div>
        {label('Title')}
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. GitHub" style={fieldStyle()} />
      </div>
      <div>
        {label('Username / Email')}
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="you@example.com" style={fieldStyle()} />
      </div>
      <div>
        {label('Password')}
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={fieldStyle({ flex: 1, fontFamily: showPw ? 'inherit' : 'monospace' })}
          />
          <button onClick={() => setShowPw(v => !v)} style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: 'rgba(180,200,220,0.7)', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {showPw ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div>
        {label('URL')}
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" style={fieldStyle()} />
      </div>
      <div>
        {label('Notes')}
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Optional notes…"
          style={{ ...fieldStyle(), resize: 'vertical' as const }}
        />
      </div>

      {error && (
        <div style={{ fontSize: 11, color: '#ff4466', background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.2)', borderRadius: 5, padding: '5px 9px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: 'rgba(180,200,220,0.6)', fontSize: 11, cursor: 'pointer' }}>
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          disabled={saving}
          style={{ padding: '7px 18px', background: `rgba(255,204,0,0.12)`, border: `1px solid rgba(255,204,0,0.3)`, borderRadius: 6, color: ACCENT, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          {saving ? 'Saving…' : 'Save'}
        </motion.button>
      </div>
    </div>
  )
}

// ── PasswordGenerator ─────────────────────────────────────────────────────────

function PasswordGenerator({ onUse }: { onUse?: (pw: string) => void }) {
  const [opts, setOpts] = useState<GenOpts>({ length: 20, upper: true, lower: true, numbers: true, symbols: true })
  const [generated, setGenerated] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copiedGen, setCopiedGen] = useState(false)

  const generate = useCallback(async () => {
    setGenerating(true)
    try {
      const pw = await ipc.passwords.generate(opts) as string
      setGenerated(pw)
    } finally {
      setGenerating(false)
    }
  }, [opts])

  const copyGen = () => {
    if (!generated) return
    navigator.clipboard.writeText(generated).then(() => {
      setCopiedGen(true)
      setTimeout(() => setCopiedGen(false), 1500)
    })
  }

  const toggle = (key: keyof Omit<GenOpts, 'length'>) => setOpts(o => ({ ...o, [key]: !o[key] }))

  return (
    <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,204,0,0.02)' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT, marginBottom: 10 }}>Password Generator</div>

      {/* Length slider */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          {label('Length')}
          <span style={{ fontSize: 11, color: ACCENT, fontFamily: 'monospace' }}>{opts.length}</span>
        </div>
        <input
          type="range" min={8} max={64} value={opts.length}
          onChange={e => setOpts(o => ({ ...o, length: parseInt(e.target.value) }))}
          style={{ width: '100%', accentColor: ACCENT }}
        />
      </div>

      {/* Charset toggles */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 10 }}>
        {([['upper', 'A–Z'], ['lower', 'a–z'], ['numbers', '0–9'], ['symbols', '!@#…']] as const).map(([key, lbl]) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            style={{
              padding: '4px 10px',
              background: opts[key] ? `rgba(255,204,0,0.12)` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${opts[key] ? 'rgba(255,204,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 5,
              color: opts[key] ? ACCENT : 'rgba(140,160,180,0.5)',
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Generated output */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
        <div style={{
          flex: 1,
          background: 'rgba(4,8,14,0.6)',
          border: '1px solid rgba(255,204,0,0.15)',
          borderRadius: 6,
          padding: '7px 10px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 12,
          color: generated ? '#e0e8f0' : 'rgba(100,120,140,0.4)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap' as const,
          minHeight: 32,
        }}>
          {generated || 'Click Generate…'}
        </div>
        {generated && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyGen}
            style={{ padding: '6px 10px', background: copiedGen ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copiedGen ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 6, color: copiedGen ? 'rgba(0,255,136,0.9)' : 'rgba(180,200,220,0.7)', fontSize: 11, cursor: 'pointer' }}
          >
            {copiedGen ? 'Copied!' : 'Copy'}
          </motion.button>
        )}
        {generated && onUse && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUse(generated)}
            style={{ padding: '6px 10px', background: `rgba(255,204,0,0.1)`, border: `1px solid rgba(255,204,0,0.25)`, borderRadius: 6, color: ACCENT, fontSize: 11, cursor: 'pointer' }}
          >
            Use
          </motion.button>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generate}
        disabled={generating}
        style={{ padding: '7px 18px', background: `rgba(255,204,0,0.1)`, border: `1px solid rgba(255,204,0,0.25)`, borderRadius: 6, color: ACCENT, fontSize: 12, fontWeight: 600, cursor: 'pointer', width: '100%' }}
      >
        {generating ? 'Generating…' : 'Generate Password'}
      </motion.button>
    </div>
  )
}

// ── EntryDetail ───────────────────────────────────────────────────────────────

interface EntryDetailProps {
  entry: PasswordEntry
  onEdit: () => void
  onDelete: () => void
}

function EntryDetail({ entry, onEdit, onDelete }: EntryDetailProps) {
  const [showPw, setShowPw]     = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%', overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#e0e8f0' }}>{entry.title}</div>
          {entry.url && (
            <div style={{ fontSize: 11, color: 'rgba(140,160,180,0.55)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>
              {entry.url}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onEdit}
            style={{ padding: '5px 12px', background: `rgba(255,204,0,0.08)`, border: `1px solid rgba(255,204,0,0.2)`, borderRadius: 5, color: ACCENT, fontSize: 11, cursor: 'pointer' }}
          >
            Edit
          </motion.button>
          {confirmDel ? (
            <>
              <button onClick={onDelete} style={{ padding: '5px 12px', background: 'rgba(255,68,102,0.15)', border: '1px solid rgba(255,68,102,0.35)', borderRadius: 5, color: '#ff4466', fontSize: 11, cursor: 'pointer' }}>
                Confirm Delete
              </button>
              <button onClick={() => setConfirmDel(false)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, color: 'rgba(140,160,180,0.5)', fontSize: 11, cursor: 'pointer' }}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setConfirmDel(true)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, color: 'rgba(200,80,80,0.6)', fontSize: 11, cursor: 'pointer' }}>
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Username */}
        <div>
          {label('Username')}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ ...fieldStyle(), flex: 1, fontFamily: 'monospace', color: '#c9d1d9' }}>
              {entry.username}
            </div>
            <CopyButton text={entry.username} title="Copy username" />
          </div>
        </div>

        {/* Password */}
        <div>
          {label('Password')}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ ...fieldStyle(), flex: 1, fontFamily: 'monospace', letterSpacing: showPw ? 'normal' : '0.1em', color: '#c9d1d9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {showPw ? entry.password : '•'.repeat(Math.min(entry.password.length, 24))}
            </div>
            <button
              onClick={() => setShowPw(v => !v)}
              style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: 'rgba(180,200,220,0.7)', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {showPw ? 'Hide' : 'Show'}
            </button>
            <CopyButton text={entry.password} title="Copy password" />
          </div>
        </div>

        {/* URL */}
        {entry.url && (
          <div>
            {label('URL')}
            <div style={{ ...fieldStyle(), color: 'rgba(140,200,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.url}
            </div>
          </div>
        )}

        {/* Notes */}
        {entry.notes && (
          <div>
            {label('Notes')}
            <div style={{ ...fieldStyle(), whiteSpace: 'pre-wrap', lineHeight: 1.6, minHeight: 60, color: 'rgba(180,200,220,0.8)' }}>
              {entry.notes}
            </div>
          </div>
        )}

        <div style={{ fontSize: 10, color: 'rgba(100,120,140,0.4)', marginTop: 4 }}>
          Created {new Date(entry.createdAt).toLocaleDateString()} · Updated {new Date(entry.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function PasswordManagerApp() {
  const [entries,     setEntries]     = useState<PasswordEntry[]>([])
  const [search,      setSearch]      = useState('')
  const [selectedId,  setSelectedId]  = useState<string | null>(null)
  const [mode,        setMode]        = useState<'list' | 'new' | 'edit'>('list')
  const [saving,      setSaving]      = useState(false)
  const [showGen,     setShowGen]     = useState(false)

  useEffect(() => {
    loadEntries().then(setEntries).catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return entries
      .filter(e => !q || e.title.toLowerCase().includes(q) || e.username.toLowerCase().includes(q) || (e.url ?? '').toLowerCase().includes(q))
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [entries, search])

  const selected = useMemo(() => entries.find(e => e.id === selectedId) ?? null, [entries, selectedId])

  const handleAdd = useCallback(async (entry: NewEntry) => {
    setSaving(true)
    try {
      const created = await ipc.passwords.add(entry) as PasswordEntry
      setEntries(prev => [...prev, created])
      setSelectedId(created.id)
      setMode('list')
    } finally {
      setSaving(false)
    }
  }, [])

  const handleUpdate = useCallback(async (entry: NewEntry) => {
    if (!selectedId) return
    setSaving(true)
    try {
      await ipc.passwords.update(selectedId, { ...entry, updatedAt: Date.now() })
      setEntries(prev => prev.map(e => e.id === selectedId ? { ...e, ...entry, updatedAt: Date.now() } : e))
      setMode('list')
    } finally {
      setSaving(false)
    }
  }, [selectedId])

  const handleDelete = useCallback(async () => {
    if (!selectedId) return
    await ipc.passwords.delete(selectedId)
    setEntries(prev => prev.filter(e => e.id !== selectedId))
    setSelectedId(null)
  }, [selectedId])

  const showPanel = mode !== 'list' || selected

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Sidebar ── */}
        <div style={{ width: 260, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.055)', background: 'rgba(8,12,18,0.5)', overflow: 'hidden', flexShrink: 0 }}>

          {/* Search + New button */}
          <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid rgba(255,255,255,0.055)', flexShrink: 0, display: 'flex', gap: 6 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search entries…"
              style={{ ...fieldStyle(), flex: 1, fontSize: 12, padding: '6px 10px' }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMode('new'); setSelectedId(null) }}
              style={{ padding: '6px 12px', background: `rgba(255,204,0,0.1)`, border: `1px solid rgba(255,204,0,0.25)`, borderRadius: 6, color: ACCENT, fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              + New
            </motion.button>
          </div>

          {/* Entry list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <AnimatePresence initial={false}>
              {filtered.length === 0 ? (
                <div style={{ padding: '20px 14px', fontSize: 11, color: 'rgba(100,120,140,0.4)' }}>
                  {search ? 'No matching entries' : 'No saved passwords yet'}
                </div>
              ) : (
                filtered.map(entry => (
                  <motion.button
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    onClick={() => { setSelectedId(entry.id); setMode('list') }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 12px',
                      background: selectedId === entry.id ? `rgba(255,204,0,0.07)` : 'transparent',
                      borderLeft: `2px solid ${selectedId === entry.id ? ACCENT : 'transparent'}`,
                      borderTop: 'none',
                      borderRight: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      display: 'block',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 500, color: selectedId === entry.id ? ACCENT : '#c9d1d9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.title}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(140,160,180,0.5)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.username}
                    </div>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Generator toggle */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.055)', flexShrink: 0 }}>
            <button
              onClick={() => setShowGen(v => !v)}
              style={{ width: '100%', padding: '9px 12px', background: showGen ? `rgba(255,204,0,0.06)` : 'transparent', border: 'none', color: showGen ? ACCENT : 'rgba(140,160,180,0.5)', fontSize: 11, cursor: 'pointer', textAlign: 'left' }}
            >
              {showGen ? '▾' : '▸'} Password Generator
            </button>
            <AnimatePresence>
              {showGen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <PasswordGenerator />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            {mode === 'new' ? (
              <motion.div key="new" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflowY: 'auto' }}>
                <EntryForm
                  onSave={handleAdd}
                  onCancel={() => setMode('list')}
                  saving={saving}
                />
              </motion.div>
            ) : mode === 'edit' && selected ? (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflowY: 'auto' }}>
                <EntryForm
                  initial={selected}
                  onSave={handleUpdate}
                  onCancel={() => setMode('list')}
                  saving={saving}
                />
              </motion.div>
            ) : selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <EntryDetail entry={selected} onEdit={() => setMode('edit')} onDelete={handleDelete} />
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1 }}>
                <EmptyState />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
