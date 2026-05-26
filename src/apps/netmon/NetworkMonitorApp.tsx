import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────────

interface InterfaceStats {
  name: string
  rxBytes: number
  txBytes: number
}

interface NetworkConnection {
  protocol: string
  local: string
  remote: string
  state: string
  pid: string
  process: string
}

interface LiveInterface {
  name: string
  rxRate: number     // bytes/sec
  txRate: number
  rxTotal: number
  txTotal: number
  history: { rx: number; tx: number }[]
}

type Tab = 'bandwidth' | 'connections'
type ConnState = 'all' | 'ESTABLISHED' | 'LISTEN' | 'TIME_WAIT' | 'CLOSE_WAIT'

const ACCENT = '#00d4ff'
const SPARKLINE_POINTS = 30
const cryogram = () => (window as any).cryogram

// ── Formatting ────────────────────────────────────────────────────────────────

function fmtRate(bytesPerSec: number): string {
  if (bytesPerSec >= 1024 * 1024) return `${(bytesPerSec / 1024 / 1024).toFixed(2)} MB/s`
  if (bytesPerSec >= 1024)        return `${(bytesPerSec / 1024).toFixed(1)} KB/s`
  return `${bytesPerSec.toFixed(0)} B/s`
}

function fmtBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
  if (bytes >= 1024 * 1024)        return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  if (bytes >= 1024)               return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────────

function Sparkline({ data, color, width = 120, height = 28 }: {
  data: number[]
  color: string
  width?: number
  height?: number
}) {
  if (data.length < 2) {
    return <svg width={width} height={height} />
  }

  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (v / max) * (height - 2) - 1
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.8}
      />
      {/* Gradient fill under curve */}
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${pts} ${width},${height}`}
        fill={`url(#grad-${color.replace('#','')})`}
      />
    </svg>
  )
}

// ── Interface card ────────────────────────────────────────────────────────────

function InterfaceCard({ iface }: { iface: LiveInterface }) {
  const rxHistory = iface.history.map(h => h.rx)
  const txHistory = iface.history.map(h => h.tx)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(8,12,18,0.5)',
        border: '1px solid rgba(255,255,255,0.055)',
        borderRadius: 10,
        padding: '12px 14px',
        minWidth: 220,
        flex: '1 1 220px',
      }}
    >
      {/* Interface name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#c9d1d9', fontFamily: '"JetBrains Mono", monospace' }}>
          {iface.name}
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
          {fmtBytes(iface.rxTotal + iface.txTotal)}
        </span>
      </div>

      {/* RX */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>RX</span>
          <span style={{ fontSize: 11, color: '#34d399', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>
            {fmtRate(iface.rxRate)}
          </span>
        </div>
        <Sparkline data={rxHistory} color="#34d399" width={180} height={24} />
      </div>

      {/* TX */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>TX</span>
          <span style={{ fontSize: 11, color: ACCENT, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>
            {fmtRate(iface.txRate)}
          </span>
        </div>
        <Sparkline data={txHistory} color={ACCENT} width={180} height={24} />
      </div>
    </motion.div>
  )
}

// ── Connections table ─────────────────────────────────────────────────────────

function ConnectionsTab() {
  const [connections, setConnections] = useState<NetworkConnection[]>([])
  const [stateFilter, setStateFilter] = useState<ConnState>('all')
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    try {
      const conns = await cryogram().netmon.getConnections() as NetworkConnection[]
      setConnections(conns)
      setLoading(false)
    } catch {}
  }, [])

  useEffect(() => {
    load()
    intervalRef.current = setInterval(load, 3000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [load])

  const filtered = connections.filter(c =>
    stateFilter === 'all' || c.state.toUpperCase() === stateFilter
  )

  const stateColor = (s: string): string => {
    const u = s.toUpperCase()
    if (u === 'ESTABLISHED') return '#34d399'
    if (u === 'LISTEN')      return ACCENT
    if (u.includes('WAIT'))  return '#fbbf24'
    if (u === 'CLOSE')       return '#f87171'
    return 'rgba(255,255,255,0.35)'
  }

  const protoColor = (p: string): string => {
    if (p === 'tcp')  return ACCENT
    if (p === 'udp')  return '#fbbf24'
    return 'rgba(255,255,255,0.35)'
  }

  const uniqueStates: ConnState[] = ['all', 'ESTABLISHED', 'LISTEN', 'TIME_WAIT', 'CLOSE_WAIT']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Filter bar */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        {uniqueStates.map(s => (
          <button
            key={s}
            onClick={() => setStateFilter(s)}
            style={{
              padding: '3px 9px',
              borderRadius: 4,
              border: `1px solid ${stateFilter === s ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
              background: stateFilter === s ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: stateFilter === s ? ACCENT : 'rgba(255,255,255,0.4)',
              fontSize: 10,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
          {filtered.length} connections
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            Loading connections…
          </motion.span>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead style={{ position: 'sticky', top: 0 }}>
              <tr style={{ background: 'rgba(10,14,22,0.94)', borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
                {['Proto', 'Local', 'Remote', 'State', 'Process'].map(col => (
                  <th key={col} style={{
                    padding: '6px 10px',
                    textAlign: 'left',
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    color: 'rgba(255,255,255,0.35)',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.025)' }}
                >
                  <td style={{ padding: '5px 10px' }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: protoColor(c.protocol),
                      fontFamily: '"JetBrains Mono", monospace',
                      textTransform: 'uppercase',
                    }}>
                      {c.protocol}
                    </span>
                  </td>
                  <td style={{ padding: '5px 10px', fontFamily: '"JetBrains Mono", monospace', color: '#c9d1d9', fontSize: 11 }}>
                    {c.local}
                  </td>
                  <td style={{ padding: '5px 10px', fontFamily: '"JetBrains Mono", monospace', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                    {c.remote || '—'}
                  </td>
                  <td style={{ padding: '5px 10px' }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: stateColor(c.state),
                      fontFamily: '"JetBrains Mono", monospace',
                    }}>
                      {c.state}
                    </span>
                  </td>
                  <td style={{ padding: '5px 10px', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                    {c.process ? (
                      <span>
                        <span style={{ color: '#c9d1d9' }}>{c.process}</span>
                        {c.pid && <span style={{ color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>({c.pid})</span>}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                    No connections match the filter
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

// ── Bandwidth tab ─────────────────────────────────────────────────────────────

function BandwidthTab() {
  const [interfaces, setInterfaces] = useState<Map<string, LiveInterface>>(new Map())
  const streamStarted = useRef(false)

  useEffect(() => {
    if (streamStarted.current) return
    streamStarted.current = true

    // Start stream
    cryogram().netmon.startStream().catch(() => {})

    // Subscribe to events
    const { ipcRenderer } = (window as any).require?.('electron') ?? {}

    const onStats = (_: unknown, data: { interfaces: { name: string; rxRate: number; txRate: number; rxTotal: number; txTotal: number }[] }) => {
      setInterfaces(prev => {
        const next = new Map(prev)
        for (const iface of data.interfaces) {
          const existing = next.get(iface.name)
          const history = existing?.history ?? []
          const newHistory = [...history, { rx: iface.rxRate, tx: iface.txRate }].slice(-SPARKLINE_POINTS)
          next.set(iface.name, {
            ...iface,
            history: newHistory,
          })
        }
        return next
      })
    }

    if (ipcRenderer) {
      ipcRenderer.on('netmon:stats', onStats)
      return () => {
        ipcRenderer.removeListener('netmon:stats', onStats)
        cryogram().netmon.stopStream().catch(() => {})
        streamStarted.current = false
      }
    }

    // Fallback: no ipcRenderer access
    return () => {
      cryogram().netmon.stopStream().catch(() => {})
      streamStarted.current = false
    }
  }, [])

  const ifaceList = Array.from(interfaces.values()).sort((a, b) => a.name.localeCompare(b.name))

  // Total bandwidth summary
  const totalRx = ifaceList.reduce((s, i) => s + i.rxRate, 0)
  const totalTx = ifaceList.reduce((s, i) => s + i.txRate, 0)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Summary bar */}
      <div style={{
        padding: '8px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        flexShrink: 0,
        background: 'rgba(8,12,18,0.3)',
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Total RX</span>
          <span style={{ fontSize: 12, color: '#34d399', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>
            {fmtRate(totalRx)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Total TX</span>
          <span style={{ fontSize: 12, color: ACCENT, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>
            {fmtRate(totalTx)}
          </span>
        </div>
        {ifaceList.length === 0 && (
          <motion.span
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            Waiting for data…
          </motion.span>
        )}
      </div>

      {/* Interface cards */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignContent: 'flex-start',
      }}>
        {ifaceList.length === 0 ? (
          <div style={{ width: '100%', textAlign: 'center', paddingTop: 40, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            No network interfaces detected
          </div>
        ) : (
          ifaceList.map(iface => (
            <InterfaceCard key={iface.name} iface={iface} />
          ))
        )}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function NetworkMonitorApp() {
  const [tab, setTab] = useState<Tab>('bandwidth')

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
      {/* ── Tab bar ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
        background: 'rgba(8,12,18,0.5)',
        flexShrink: 0,
      }}>
        {(['bandwidth', 'connections'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              position: 'relative',
              padding: '9px 20px',
              fontSize: 12,
              fontWeight: 500,
              color: tab === t ? ACCENT : 'rgba(255,255,255,0.4)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'capitalize',
              letterSpacing: '0.02em',
            }}
          >
            {t === 'bandwidth' ? 'Bandwidth' : 'Connections'}
            {tab === t && (
              <motion.div
                layoutId="netmon-tab"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: ACCENT, borderRadius: '2px 2px 0 0' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.13 }}
          style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'column' }}
        >
          {tab === 'bandwidth'   && <BandwidthTab />}
          {tab === 'connections' && <ConnectionsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
