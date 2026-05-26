import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────

interface ClipboardEntry {
  id:        number
  text:      string
  timestamp: number
  pinned:    boolean
}

// ── Module-level store ─────────────────────────────────────────────────────────

let _nextId   = 1
let _items:   ClipboardEntry[] = []
const _listeners = new Set<() => void>()
let _lastText = ''

function _notify() { _listeners.forEach(fn => fn()) }

const PINNED_KEY = 'cryogram:clipboard:pinned'

function _loadPinned(): Set<number> {
  try {
    const raw = localStorage.getItem(PINNED_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch {}
  return new Set()
}

function _savePinned(ids: number[]) {
  try { localStorage.setItem(PINNED_KEY, JSON.stringify(ids)) } catch {}
}

/** Push a new text entry into clipboard history from external code. */
export function addToClipboardHistory(text: string): void {
  if (!text.trim()) return
  if (_items.length > 0 && _items[0].text === text) return   // deduplicate
  _lastText = text
  const pinned = _loadPinned()
  const entry: ClipboardEntry = { id: _nextId++, text, timestamp: Date.now(), pinned: false }
  _items = [entry, ..._items].slice(0, 50)
  _notify()
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 10)  return 'just now'
  if (diff < 60)  return `${diff}s ago`
  const m = Math.floor(diff / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── Clipboard item card ────────────────────────────────────────────────────────

function ClipItem({
  entry, onCopy, onDelete, onTogglePin, ticker,
}: {
  entry:        ClipboardEntry
  onCopy:       (id: number, text: string) => void
  onDelete:     (id: number) => void
  onTogglePin:  (id: number) => void
  ticker:       number
}) {
  const [hov,    setHov]    = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(entry.id, entry.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={handleCopy}
      style={{
        padding:      '9px 10px',
        borderRadius: 10,
        background:   hov ? 'rgba(255,255,255,0.07)' : entry.pinned ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border:       entry.pinned
          ? '1px solid var(--cryo-a20)'
          : hov
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(255,255,255,0.05)',
        cursor:       'pointer',
        position:     'relative',
        transition:   'background 0.12s, border-color 0.12s',
      }}
    >
      {/* Pin indicator */}
      {entry.pinned && (
        <div style={{
          position:   'absolute',
          top:        6,
          left:       8,
          fontSize:   8,
          color:      'var(--cryo-accent)',
          lineHeight: 1,
        }}>
          ▲
        </div>
      )}

      {/* Text preview */}
      <div style={{
        fontSize:           11,
        color:              'rgba(255,255,255,0.75)',
        lineHeight:         1.5,
        display:            '-webkit-box',
        WebkitLineClamp:    2,
        WebkitBoxOrient:    'vertical',
        overflow:           'hidden',
        wordBreak:          'break-all',
        paddingLeft:        entry.pinned ? 14 : 0,
        paddingRight:       36,
        fontFamily:         'ui-monospace, "JetBrains Mono", monospace',
      }}>
        {entry.text}
      </div>

      {/* Footer row */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 5, paddingLeft: entry.pinned ? 14 : 0 }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
          {timeAgo(entry.timestamp)}
        </span>
        <AnimatePresence>
          {copied && (
            <motion.span
              key="copied"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: 9, color: 'var(--cryo-accent)', marginLeft: 8 }}
            >
              Copied!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Hover actions */}
      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              top:      6,
              right:    6,
              display:  'flex',
              gap:      3,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Pin */}
            <ActionBtn
              title={entry.pinned ? 'Unpin' : 'Pin'}
              onClick={() => onTogglePin(entry.id)}
              active={entry.pinned}
            >
              <svg width="10" height="11" viewBox="0 0 24 24" fill={entry.pinned ? 'var(--cryo-accent)' : 'none'} stroke={entry.pinned ? 'var(--cryo-accent)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </ActionBtn>
            {/* Delete */}
            <ActionBtn title="Remove" onClick={() => onDelete(entry.id)} danger>
              ×
            </ActionBtn>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ActionBtn({
  children, onClick, title, active, danger,
}: {
  children: React.ReactNode
  onClick:  () => void
  title?:   string
  active?:  boolean
  danger?:  boolean
}) {
  const col  = danger ? '#f87171' : active ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.5)'
  const base = danger ? 'rgba(239,68,68,0.1)' : active ? 'var(--cryo-a12)' : 'rgba(255,255,255,0.06)'
  const hov  = danger ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.12)'
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          20,
        height:         20,
        borderRadius:   6,
        border:         'none',
        background:     base,
        color:          col,
        cursor:         'pointer',
        fontSize:       12,
        lineHeight:     1,
        padding:        0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = hov }}
      onMouseLeave={e => { e.currentTarget.style.background = base }}
    >
      {children}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ClipboardManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items,   setItems]   = useState<ClipboardEntry[]>([..._items])
  const [query,   setQuery]   = useState('')
  const [ticker,  setTicker]  = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)
  const pollRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  // Subscribe to module-level changes
  useEffect(() => {
    const sync = () => setItems([..._items])
    _listeners.add(sync)
    return () => { _listeners.delete(sync) }
  }, [])

  // Relative timestamp ticker
  useEffect(() => {
    const id = setInterval(() => setTicker(t => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  // Poll clipboard while open
  useEffect(() => {
    if (!open) {
      if (pollRef.current) clearInterval(pollRef.current)
      return
    }

    const poll = async () => {
      try {
        const text = await navigator.clipboard.readText()
        if (text && text !== _lastText && text.trim()) {
          addToClipboardHistory(text)
        }
      } catch {
        // clipboard read permission denied — silently ignore
      }
    }

    poll()
    pollRef.current = setInterval(poll, 1500)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [open])

  // Focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 120)
    } else {
      setQuery('')
    }
  }, [open])

  // Escape key
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  const handleCopy = useCallback(async (_id: number, text: string) => {
    try { await navigator.clipboard.writeText(text) } catch {}
  }, [])

  const handleDelete = useCallback((id: number) => {
    _items = _items.filter(i => i.id !== id)
    _notify()
  }, [])

  const handleTogglePin = useCallback((id: number) => {
    _items = _items.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i)
    // Persist pinned IDs
    _savePinned(_items.filter(i => i.pinned).map(i => i.id))
    _notify()
  }, [])

  const handleClearAll = () => {
    _items = _items.filter(i => i.pinned)   // keep pinned
    _notify()
  }

  // Filter and sort: pinned first, then by timestamp
  const filtered = items
    .filter(i => !query || i.text.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.timestamp - a.timestamp
    })

  const pinned    = filtered.filter(i => i.pinned)
  const unpinned  = filtered.filter(i => !i.pinned)
  const total     = items.length

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 88000 }}
          />

          {/* Slide-in panel */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0,   opacity: 1 }}
            exit={{ x: 300,    opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
            onClick={e => e.stopPropagation()}
            style={{
              position:             'fixed',
              top:                  36,
              right:                0,
              bottom:               0,
              width:                300,
              zIndex:               89000,
              background:           'rgba(10,14,22,0.97)',
              backdropFilter:       'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderLeft:           '1px solid rgba(255,255,255,0.08)',
              display:              'flex',
              flexDirection:        'column',
              fontFamily:           '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              overflow:             'hidden',
            }}
          >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        '14px 14px 10px',
              borderBottom:   '1px solid rgba(255,255,255,0.07)',
              flexShrink:     0,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>
                  Clipboard
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                  {total === 0 ? 'Empty' : `${total} item${total !== 1 ? 's' : ''}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {total > 0 && (
                  <button
                    onClick={handleClearAll}
                    style={{
                      background:   'rgba(239,68,68,0.1)',
                      border:       '1px solid rgba(239,68,68,0.25)',
                      borderRadius: 7,
                      color:        '#f87171',
                      fontSize:     11,
                      fontWeight:   500,
                      padding:      '4px 10px',
                      cursor:       'pointer',
                      fontFamily:   'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  style={{
                    background:   'rgba(255,255,255,0.06)',
                    border:       '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 7,
                    color:        'rgba(255,255,255,0.5)',
                    fontSize:     14,
                    lineHeight:   1,
                    padding:      '3px 8px',
                    cursor:       'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ── Search ──────────────────────────────────────────────────── */}
            <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position:  'absolute',
                  left:      9,
                  top:       '50%',
                  transform: 'translateY(-50%)',
                  color:     'rgba(255,255,255,0.25)',
                  lineHeight:0,
                  pointerEvents: 'none',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search clipboard…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{
                    width:        '100%',
                    padding:      '7px 10px 7px 28px',
                    borderRadius: 8,
                    border:       '1px solid rgba(255,255,255,0.08)',
                    background:   'rgba(255,255,255,0.04)',
                    color:        'rgba(255,255,255,0.8)',
                    fontSize:     12,
                    outline:      'none',
                    boxSizing:    'border-box',
                    fontFamily:   'inherit',
                  }}
                />
              </div>
            </div>

            {/* ── Body ────────────────────────────────────────────────────── */}
            <div style={{
              flex:           1,
              overflowY:      'auto',
              padding:        '10px 10px 16px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display:        'flex',
                      flexDirection:  'column',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            12,
                      paddingTop:     60,
                    }}
                  >
                    <div style={{
                      width:          48,
                      height:         48,
                      borderRadius:   14,
                      background:     'rgba(255,255,255,0.04)',
                      border:         '1px solid rgba(255,255,255,0.08)',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      </svg>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                      {query ? 'No matches' : 'Nothing copied yet'}
                    </div>
                  </motion.div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Pinned section */}
                    {pinned.length > 0 && (
                      <>
                        <div style={{
                          fontSize:      9,
                          fontWeight:    600,
                          color:         'rgba(255,255,255,0.22)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontFamily:    '"JetBrains Mono", monospace',
                          marginBottom:  4,
                          marginTop:     2,
                          paddingLeft:   2,
                        }}>
                          Pinned
                        </div>
                        {pinned.map(entry => (
                          <ClipItem
                            key={entry.id}
                            entry={entry}
                            ticker={ticker}
                            onCopy={handleCopy}
                            onDelete={handleDelete}
                            onTogglePin={handleTogglePin}
                          />
                        ))}
                        {unpinned.length > 0 && (
                          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
                        )}
                      </>
                    )}

                    {/* Unpinned section */}
                    {unpinned.length > 0 && (
                      <>
                        {pinned.length > 0 && (
                          <div style={{
                            fontSize:      9,
                            fontWeight:    600,
                            color:         'rgba(255,255,255,0.22)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontFamily:    '"JetBrains Mono", monospace',
                            marginBottom:  4,
                            paddingLeft:   2,
                          }}>
                            Recent
                          </div>
                        )}
                        {unpinned.map(entry => (
                          <ClipItem
                            key={entry.id}
                            entry={entry}
                            ticker={ticker}
                            onCopy={handleCopy}
                            onDelete={handleDelete}
                            onTogglePin={handleTogglePin}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom accent line */}
            <div style={{ height: 1, flexShrink: 0, background: 'linear-gradient(90deg, transparent, var(--cryo-a20) 40%, var(--cryo-a20) 60%, transparent)' }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
