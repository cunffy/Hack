import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────────

interface LogLine {
  timestamp: string
  unit: string
  level: string
  message: string
  raw: string
}

type Priority = 'all' | 'err' | 'warning' | 'notice' | 'info' | 'debug'
type LineCount = 100 | 500 | 1000

const ACCENT = '#a855f7'
const cryogram = () => (window as any).cryogram

// ── Level badge ───────────────────────────────────────────────────────────────

const LEVEL_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  emerg:   { bg: 'rgba(248,113,113,0.2)',   color: '#f87171', label: 'EMERG' },
  alert:   { bg: 'rgba(248,113,113,0.15)',  color: '#fca5a5', label: 'ALERT' },
  crit:    { bg: 'rgba(248,113,113,0.12)',  color: '#f87171', label: 'CRIT' },
  err:     { bg: 'rgba(248,113,113,0.1)',   color: '#f87171', label: 'ERR' },
  warning: { bg: 'rgba(251,191,36,0.1)',    color: '#fbbf24', label: 'WARN' },
  notice:  { bg: 'rgba(99,102,241,0.1)',    color: '#818cf8', label: 'NOTICE' },
  info:    { bg: 'rgba(34,211,238,0.1)',    color: '#22d3ee', label: 'INFO' },
  debug:   { bg: 'rgba(255,255,255,0.05)',  color: 'rgba(255,255,255,0.35)', label: 'DBG' },
}

function levelStyle(level: string) {
  return LEVEL_STYLES[level] ?? LEVEL_STYLES.info
}

// ── Toolbar select ────────────────────────────────────────────────────────────

function ToolSelect({
  value, onChange, children,
}: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'rgba(8,12,18,0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 5,
        padding: '4px 8px',
        color: '#c9d1d9',
        fontSize: 11,
        outline: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
    </select>
  )
}

// ── Log row ───────────────────────────────────────────────────────────────────

function LogRow({ line, expanded, onClick }: {
  line: LogLine
  expanded: boolean
  onClick: () => void
}) {
  const lvlStyle = levelStyle(line.level)

  return (
    <div
      onClick={onClick}
      style={{
        padding: '3px 10px',
        cursor: 'pointer',
        background: expanded ? 'rgba(168,85,247,0.06)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.025)',
        transition: 'background 0.1s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'nowrap', overflow: 'hidden' }}>
        {/* Level badge */}
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          padding: '1px 5px',
          borderRadius: 3,
          background: lvlStyle.bg,
          color: lvlStyle.color,
          flexShrink: 0,
          letterSpacing: '0.05em',
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          {lvlStyle.label}
        </span>

        {/* Timestamp */}
        {line.timestamp && (
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }}>
            {line.timestamp}
          </span>
        )}

        {/* Unit */}
        {line.unit && (
          <span style={{ fontSize: 10, color: ACCENT, opacity: 0.7, flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }}>
            {line.unit}
          </span>
        )}

        {/* Message */}
        <span style={{
          fontSize: 11,
          color: lvlStyle.color === '#f87171' ? '#fca5a5' : '#c9d1d9',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: '"JetBrains Mono", monospace',
          flex: 1,
          minWidth: 0,
        }}>
          {line.message || line.raw}
        </span>
      </div>

      {/* Expanded raw view */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.14 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 4,
              padding: '6px 8px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 4,
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: '"JetBrains Mono", monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              lineHeight: 1.6,
            }}>
              {line.raw}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LogViewerApp() {
  const [units, setUnits]         = useState<string[]>(['all'])
  const [unit, setUnit]           = useState('all')
  const [lineCount, setLineCount] = useState<LineCount>(100)
  const [priority, setPriority]   = useState<Priority>('all')
  const [search, setSearch]       = useState('')
  const [liveTail, setLiveTail]   = useState(false)
  const [lines, setLines]         = useState<LogLine[]>([])
  const [loading, setLoading]     = useState(false)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  const listRef        = useRef<HTMLDivElement>(null)
  const userScrolledUp = useRef(false)
  const liveCleanupRef = useRef<(() => void) | null>(null)

  // Load available units on mount
  useEffect(() => {
    cryogram().logs.getUnits()
      .then((u: string[]) => setUnits(u))
      .catch(() => {})
  }, [])

  // Query logs when params change (non-live mode)
  const query = useCallback(async () => {
    if (liveTail) return
    setLoading(true)
    setExpandedIdx(null)
    try {
      const result = await cryogram().logs.query({
        unit,
        lines: lineCount,
        priority: priority === 'all' ? undefined : priority,
        search: search || undefined,
      }) as { lines: LogLine[] }
      setLines(result.lines)
    } catch {}
    setLoading(false)
  }, [unit, lineCount, priority, search, liveTail])

  useEffect(() => { query() }, [query])

  // Live tail toggle
  useEffect(() => {
    if (liveTail) {
      setLines([])
      userScrolledUp.current = false

      cryogram().logs.stream({ unit }).catch(() => {})

      const listener = (_: unknown, line: LogLine) => {
        setLines(prev => [...prev.slice(-2000), line])
      }
      const { ipcRenderer } = (window as any).require?.('electron') ?? {}
      if (ipcRenderer) {
        ipcRenderer.on('logs:line', listener)
        liveCleanupRef.current = () => ipcRenderer.removeListener('logs:line', listener)
      } else {
        // Use the cryogram bridge pattern for receiving events
        const cleanup = (window as any).cryogram?.logs?.onLine?.((line: LogLine) => {
          setLines(prev => [...prev.slice(-2000), line])
        })
        liveCleanupRef.current = cleanup ?? null
      }
    } else {
      cryogram().logs.stopStream().catch(() => {})
      liveCleanupRef.current?.()
      liveCleanupRef.current = null
    }

    return () => {
      cryogram().logs.stopStream().catch(() => {})
      liveCleanupRef.current?.()
      liveCleanupRef.current = null
    }
  }, [liveTail, unit])

  // Auto-scroll in live tail
  useEffect(() => {
    if (!liveTail || userScrolledUp.current) return
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, liveTail])

  const handleListScroll = () => {
    const el = listRef.current
    if (!el || !liveTail) return
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    userScrolledUp.current = !isAtBottom
  }

  const clearLogs = () => {
    setLines([])
    setExpandedIdx(null)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        background: 'rgba(10,14,22,0.94)',
      }}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          background: 'rgba(8,12,18,0.5)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        {/* Unit selector */}
        <ToolSelect value={unit} onChange={v => { setUnit(v); setExpandedIdx(null) }}>
          {units.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </ToolSelect>

        {/* Line count */}
        <ToolSelect value={String(lineCount)} onChange={v => setLineCount(Number(v) as LineCount)}>
          <option value="100">100 lines</option>
          <option value="500">500 lines</option>
          <option value="1000">1000 lines</option>
        </ToolSelect>

        {/* Priority */}
        <ToolSelect value={priority} onChange={v => setPriority(v as Priority)}>
          <option value="all">All levels</option>
          <option value="err">Errors</option>
          <option value="warning">Warnings+</option>
          <option value="notice">Notice+</option>
          <option value="info">Info+</option>
          <option value="debug">Debug</option>
        </ToolSelect>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search…"
          style={{
            flex: 1,
            minWidth: 100,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 5,
            padding: '4px 9px',
            color: '#c9d1d9',
            fontSize: 11,
            outline: 'none',
          }}
        />

        {/* Live tail toggle */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => setLiveTail(l => !l)}
          style={{
            padding: '4px 10px',
            background: liveTail ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${liveTail ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 5,
            color: liveTail ? ACCENT : 'rgba(255,255,255,0.5)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            flexShrink: 0,
          }}
        >
          {liveTail && (
            <motion.span
              style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, display: 'inline-block' }}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
          Live
        </motion.button>

        {/* Clear */}
        <button
          onClick={clearLogs}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 5,
            color: 'rgba(255,255,255,0.3)',
            fontSize: 11,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Clear
        </button>

        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
          {lines.length} lines
        </span>
      </div>

      {/* ── Log list ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            Loading logs…
          </motion.span>
        </div>
      ) : (
        <div
          ref={listRef}
          onScroll={handleListScroll}
          style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}
        >
          {lines.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
              {liveTail ? 'Waiting for log entries…' : 'No log entries found'}
            </div>
          ) : (
            lines.map((line, i) => (
              <LogRow
                key={i}
                line={line}
                expanded={expandedIdx === i}
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
