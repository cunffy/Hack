import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NotificationEntry {
  id:        number
  title:     string
  body:      string
  timestamp: number
}

// ── Module-level store (shared across mounts) ─────────────────────────────────

let _nextId   = 1
let _entries: NotificationEntry[] = []
const _listeners = new Set<() => void>()

function _notify() {
  _listeners.forEach(fn => fn())
}

/** Call this from anywhere to push a notification into the history panel. */
export function addToNotificationHistory(n: { title: string; body: string }): void {
  const entry: NotificationEntry = {
    id:        _nextId++,
    title:     n.title,
    body:      n.body,
    timestamp: Date.now(),
  }
  _entries = [entry, ..._entries].slice(0, 50)
  _notify()
}

// Auto-wire into the cryogram notification event so history is populated
// automatically whenever a toast fires.
if (typeof window !== 'undefined') {
  window.addEventListener('cryogram:notification', (e: Event) => {
    const { title, body } = (e as CustomEvent).detail
    addToNotificationHistory({ title, body })
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 10)  return 'just now'
  if (diff < 60)  return `${diff}s ago`
  const m = Math.floor(diff / 60)
  if (m < 60) return `${m} minute${m !== 1 ? 's' : ''} ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hour${h !== 1 ? 's' : ''} ago`
  const d = Math.floor(h / 24)
  return `${d} day${d !== 1 ? 's' : ''} ago`
}

/** Derive a simple group key from the notification title (first word). */
function groupKey(n: NotificationEntry): string {
  return n.title.split(/\s+/)[0] ?? 'Other'
}

// ── Notification card ─────────────────────────────────────────────────────────

function NotifCard({ entry, ticker }: { entry: NotificationEntry; ticker: number }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding:      '10px 12px',
        borderRadius: 10,
        background:   hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border:       hov ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
        transition:   'background 0.15s, border-color 0.15s',
        cursor:       'default',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
        {/* Small accent dot */}
        <div style={{
          width:        5,
          height:       5,
          borderRadius: '50%',
          background:   'var(--cryo-accent)',
          flexShrink:   0,
        }} />
        <span style={{
          flex:        1,
          fontSize:    12,
          fontWeight:  600,
          color:       'rgba(255,255,255,0.88)',
          fontFamily:  '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          overflow:    'hidden',
          textOverflow:'ellipsis',
          whiteSpace:  'nowrap',
        }}>
          {entry.title}
        </span>
        <span style={{
          fontSize:   10,
          color:      'rgba(255,255,255,0.25)',
          fontFamily: '-apple-system, sans-serif',
          flexShrink: 0,
        }}>
          {timeAgo(entry.timestamp)}
        </span>
      </div>

      {/* Body */}
      <div style={{
        fontSize:    11,
        color:       'rgba(255,255,255,0.5)',
        fontFamily:  '-apple-system, sans-serif',
        lineHeight:  1.5,
        marginLeft:  12,
      }}>
        {entry.body}
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function NotificationHistory({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Subscribe to module-level store
  const [entries, setEntries] = useState<NotificationEntry[]>([..._entries])
  // Ticker forces relative timestamps to refresh every 30 s
  const [ticker, setTicker] = useState(0)

  useEffect(() => {
    const sync = () => setEntries([..._entries])
    _listeners.add(sync)
    return () => { _listeners.delete(sync) }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTicker(t => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  const clearAll = () => {
    _entries = []
    _notify()
  }

  // Group entries
  const grouped: Record<string, NotificationEntry[]> = {}
  entries.forEach(n => {
    const k = groupKey(n)
    if (!grouped[k]) grouped[k] = []
    grouped[k].push(n)
  })
  const groups = Object.entries(grouped)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — clicking outside closes panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset:    0,
              zIndex:   88000,
            }}
          />

          {/* Slide-in panel */}
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0,   opacity: 1 }}
            exit={{ x: 320,    opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
            style={{
              position:             'fixed',
              top:                  36,   // below titlebar (36px)
              right:                0,
              bottom:               0,
              width:                320,
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
            onClick={e => e.stopPropagation()}
          >
            {/* ── Header ────────────────────────────────────────────────────── */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              justifyContent:'space-between',
              padding:       '14px 16px 12px',
              borderBottom:  '1px solid rgba(255,255,255,0.07)',
              flexShrink:    0,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>
                  Notifications
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                  {entries.length === 0 ? 'None' : `${entries.length} item${entries.length !== 1 ? 's' : ''}`}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {entries.length > 0 && (
                  <button
                    onClick={clearAll}
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

            {/* ── Body ──────────────────────────────────────────────────────── */}
            <div style={{
              flex:         1,
              overflowY:    'auto',
              padding:      '10px 12px 16px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              <AnimatePresence>
                {entries.length === 0 ? (
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
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                      No notifications yet
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {groups.map(([groupLabel, items]) => (
                      <div key={groupLabel}>
                        {/* Group header */}
                        <div style={{
                          fontSize:      9,
                          fontWeight:    600,
                          color:         'rgba(255,255,255,0.22)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontFamily:    '"JetBrains Mono", monospace',
                          marginBottom:  5,
                          paddingLeft:   2,
                        }}>
                          {groupLabel}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {items.map(entry => (
                            <NotifCard key={entry.id} entry={entry} ticker={ticker} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer accent line ─────────────────────────────────────────── */}
            <div style={{
              height:     1,
              flexShrink: 0,
              background: 'linear-gradient(90deg, transparent, var(--cryo-a20) 40%, var(--cryo-a20) 60%, transparent)',
            }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
