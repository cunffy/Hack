import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProcessEntry {
  pid: number
  name: string
  cpu: number
  memMb: number
  memPct: number
  status: string
  user: string
  command: string
}

interface SystemStats {
  cpuPct: number
  memTotal: number
  memUsed: number
  memPct: number
}

type SortKey = 'name' | 'pid' | 'cpu' | 'memMb' | 'status' | 'user'
type SortDir = 'asc' | 'desc'

const ACCENT = '#818cf8'
const cryogram = () => (window as any).cryogram

// ── Utility ───────────────────────────────────────────────────────────────────

function cpuColor(pct: number): string {
  if (pct > 80) return '#f87171'   // red
  if (pct > 50) return '#fbbf24'   // yellow
  return '#c9d1d9'
}

function StatBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160 }}>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 32, textAlign: 'right', flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 3 }}
        />
      </div>
      <span style={{ fontSize: 10, color, width: 34, flexShrink: 0 }}>
        {pct.toFixed(1)}%
      </span>
    </div>
  )
}

// ── Kill confirm tooltip ──────────────────────────────────────────────────────

function KillButton({ pid, name, onKilled }: { pid: number; name: string; onKilled: () => void }) {
  const [busy, setBusy] = useState(false)

  const kill = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const signal = e.shiftKey ? 'SIGKILL' : 'SIGTERM'
    setBusy(true)
    try {
      const result = await cryogram().processes.kill(pid, signal)
      if (result.success) onKilled()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div title="Click: SIGTERM  |  Shift+Click: SIGKILL">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={kill}
        disabled={busy}
        style={{
          padding: '2px 10px',
          background: 'rgba(248,113,113,0.12)',
          border: '1px solid rgba(248,113,113,0.35)',
          borderRadius: 4,
          color: busy ? 'rgba(248,113,113,0.4)' : '#f87171',
          fontSize: 10,
          fontWeight: 600,
          cursor: busy ? 'not-allowed' : 'pointer',
          letterSpacing: '0.04em',
        }}
      >
        {busy ? '…' : 'Kill'}
      </motion.button>
    </div>
  )
}

// ── Process row ───────────────────────────────────────────────────────────────

function ProcessRow({
  proc,
  onKilled,
}: {
  proc: ProcessEntry
  onKilled: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const isCryogram = /electron|cryogram/i.test(proc.command)

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'rgba(129,140,248,0.06)'
          : isCryogram
          ? 'rgba(129,140,248,0.025)'
          : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        transition: 'background 0.12s',
      }}
    >
      {/* Name */}
      <td style={{ padding: '5px 10px', maxWidth: 160, overflow: 'hidden' }}>
        <div
          title={proc.command}
          style={{
            fontSize: 12,
            color: isCryogram ? 'rgba(129,140,248,0.7)' : '#c9d1d9',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {proc.name}
        </div>
      </td>

      {/* PID */}
      <td style={{ padding: '5px 8px' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: '"JetBrains Mono", monospace' }}>
          {proc.pid}
        </span>
      </td>

      {/* CPU */}
      <td style={{ padding: '5px 8px', textAlign: 'right' }}>
        <span style={{ fontSize: 11, color: cpuColor(proc.cpu), fontFamily: '"JetBrains Mono", monospace', fontWeight: proc.cpu > 50 ? 600 : 400 }}>
          {proc.cpu.toFixed(1)}%
        </span>
      </td>

      {/* Memory */}
      <td style={{ padding: '5px 8px', textAlign: 'right' }}>
        <span style={{ fontSize: 11, color: '#c9d1d9', fontFamily: '"JetBrains Mono", monospace' }}>
          {proc.memMb < 1024
            ? `${proc.memMb.toFixed(1)} MB`
            : `${(proc.memMb / 1024).toFixed(2)} GB`}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: '5px 8px' }}>
        <span style={{
          fontSize: 10,
          padding: '1px 6px',
          borderRadius: 3,
          background: proc.status === 'running' ? 'rgba(52,211,153,0.1)' : proc.status === 'zombie' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)',
          color: proc.status === 'running' ? '#34d399' : proc.status === 'zombie' ? '#f87171' : 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          fontWeight: 600,
        }}>
          {proc.status}
        </span>
      </td>

      {/* User */}
      <td style={{ padding: '5px 8px' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{proc.user}</span>
      </td>

      {/* Kill button (revealed on hover) */}
      <td style={{ padding: '5px 10px', width: 70 }}>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.1 }}
            >
              <KillButton pid={proc.pid} name={proc.name} onKilled={onKilled} />
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  )
}

// ── Sortable column header ─────────────────────────────────────────────────────

function ColHeader({
  label, sortKey, active, dir, onClick,
}: {
  label: string
  sortKey: SortKey
  active: boolean
  dir: SortDir
  onClick: (k: SortKey) => void
}) {
  return (
    <th
      onClick={() => onClick(sortKey)}
      style={{
        padding: '7px 8px',
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: active ? ACCENT : 'rgba(255,255,255,0.35)',
        textAlign: sortKey === 'cpu' || sortKey === 'memMb' ? 'right' : 'left',
        cursor: 'pointer',
        userSelect: 'none',
        background: 'rgba(10,14,22,0.94)',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {active && <span style={{ marginLeft: 4, fontSize: 9, opacity: 0.7 }}>{dir === 'asc' ? '▲' : '▼'}</span>}
    </th>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TaskManagerApp() {
  const [processes, setProcesses] = useState<ProcessEntry[]>([])
  const [stats, setStats]         = useState<SystemStats>({ cpuPct: 0, memTotal: 0, memUsed: 0, memPct: 0 })
  const [search, setSearch]       = useState('')
  const [sortKey, setSortKey]     = useState<SortKey>('cpu')
  const [sortDir, setSortDir]     = useState<SortDir>('desc')
  const [loading, setLoading]     = useState(true)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = useCallback(async () => {
    try {
      const [procs, sysStats] = await Promise.all([
        cryogram().processes.list() as Promise<ProcessEntry[]>,
        cryogram().processes.getSystemStats() as Promise<SystemStats>,
      ])
      setProcesses(procs)
      setStats(sysStats)
      setLoading(false)
    } catch {}
  }, [])

  useEffect(() => {
    refresh()
    intervalRef.current = setInterval(refresh, 2000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [refresh])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir(key === 'cpu' || key === 'memMb' ? 'desc' : 'asc')
    }
  }

  // Filter + sort
  const filtered = processes
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.command.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul
      return String(av).localeCompare(String(bv)) * mul
    })

  const COLS: { label: string; key: SortKey }[] = [
    { label: 'Name',    key: 'name' },
    { label: 'PID',     key: 'pid' },
    { label: 'CPU%',    key: 'cpu' },
    { label: 'Memory',  key: 'memMb' },
    { label: 'Status',  key: 'status' },
    { label: 'User',    key: 'user' },
  ]

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
      {/* ── Header: system stats + search ─────────────────────────────────── */}
      <div
        style={{
          padding: '10px 14px 8px',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          background: 'rgba(8,12,18,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* CPU + RAM bars */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <StatBar label="CPU" pct={stats.cpuPct} color={cpuColor(stats.cpuPct)} />
          <StatBar label="RAM" pct={stats.memPct} color={stats.memPct > 80 ? '#f87171' : stats.memPct > 60 ? '#fbbf24' : ACCENT} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', alignSelf: 'center', marginLeft: 'auto' }}>
            {stats.memUsed} / {stats.memTotal} MB
          </span>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by name or command…"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 5,
              padding: '5px 10px',
              color: '#c9d1d9',
              fontSize: 12,
              outline: 'none',
            }}
          />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
            {filtered.length} of {processes.length}
          </span>
        </div>
      </div>

      {/* ── Process table ─────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            Loading processes…
          </motion.span>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                {COLS.map(c => (
                  <ColHeader
                    key={c.key}
                    label={c.label}
                    sortKey={c.key}
                    active={sortKey === c.key}
                    dir={sortDir}
                    onClick={handleSort}
                  />
                ))}
                <th style={{
                  padding: '7px 10px',
                  background: 'rgba(10,14,22,0.94)',
                  borderBottom: '1px solid rgba(255,255,255,0.055)',
                  width: 70,
                }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(proc => (
                <ProcessRow
                  key={proc.pid}
                  proc={proc}
                  onKilled={refresh}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
                    No processes match your filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
