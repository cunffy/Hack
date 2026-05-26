import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────────

type ScanType = 'ping' | 'ports' | 'service' | 'full'

interface ScanHost {
  host: string
  status: 'up' | 'down' | 'unknown'
  openPorts: string[]
  services: string[]
}

interface ScanResult {
  id: string
  target: string
  type: ScanType
  portRange: string
  startedAt: number
  finishedAt?: number
  hosts: ScanHost[]
  rawLines: string[]
}

const SCAN_TYPES: { id: ScanType; label: string; desc: string }[] = [
  { id: 'ping',    label: 'Quick Ping',        desc: 'Host discovery only (-sn)' },
  { id: 'ports',   label: 'Port Scan',          desc: 'Open ports + versions (-sV)' },
  { id: 'service', label: 'Service Detection',  desc: 'Ports + scripts (-sV -sC)' },
  { id: 'full',    label: 'Full Scan',           desc: 'OS + traceroute + all (-A)' },
]

// ── nmap output parser ────────────────────────────────────────────────────────

function parseNmapLines(lines: string[]): ScanHost[] {
  const hosts: ScanHost[] = []
  let current: ScanHost | null = null

  for (const raw of lines) {
    const line = raw.trim()

    // New host block
    const reportMatch = line.match(/^Nmap scan report for (.+)$/)
    if (reportMatch) {
      if (current) hosts.push(current)
      current = { host: reportMatch[1], status: 'unknown', openPorts: [], services: [] }
      continue
    }

    if (!current) continue

    if (/^Host is up/.test(line)) {
      current.status = 'up'
      continue
    }
    if (/^Host seems down/.test(line)) {
      current.status = 'down'
      continue
    }

    // Port line: "80/tcp  open  http  Apache httpd 2.4.41"
    const portMatch = line.match(/^(\d+)\/(tcp|udp)\s+(open|filtered|closed)\s+(\S+)(?:\s+(.+))?$/)
    if (portMatch) {
      const [, port, proto, state, service, version] = portMatch
      if (state === 'open') {
        current.openPorts.push(`${port}/${proto}`)
        const svc = version ? `${service} (${version.trim()})` : service
        current.services.push(svc)
      }
      continue
    }

    // Host status from ping scan — no "Host is up" line, just latency
    if (/latency/.test(line)) {
      current.status = 'up'
    }
  }

  if (current) hosts.push(current)
  return hosts
}

// ── Utility ───────────────────────────────────────────────────────────────────

function elapsed(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}m ${s}s`
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LogLine({ text }: { text: string }) {
  const isPort    = /^\d+\/tcp|^\d+\/udp/.test(text.trim())
  const isReport  = /^Nmap scan report/.test(text.trim())
  const isStatus  = /^Host is/.test(text.trim())
  const isNmapMeta = /^Starting Nmap|^Nmap done/.test(text.trim())

  let color = 'rgba(140,160,180,0.75)'
  if (isPort)     color = 'var(--cryo-accent)'
  if (isReport)   color = '#e0e8f0'
  if (isStatus)   color = 'rgba(0,255,136,0.8)'
  if (isNmapMeta) color = 'rgba(200,180,100,0.7)'

  return (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 11,
      color,
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
    }}>
      {text}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function NetworkScannerApp() {
  const [nmapAvailable, setNmapAvailable]   = useState<boolean | null>(null)
  const [target, setTarget]                 = useState('')
  const [scanType, setScanType]             = useState<ScanType>('ports')
  const [portRange, setPortRange]           = useState('')
  const [scanning, setScanning]             = useState(false)
  const [logLines, setLogLines]             = useState<string[]>([])
  const [currentHosts, setCurrentHosts]     = useState<ScanHost[]>([])
  const [history, setHistory]               = useState<ScanResult[]>([])
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null)
  const [error, setError]                   = useState<string | null>(null)
  const [tab, setTab]                       = useState<'log' | 'results'>('log')
  const [copied, setCopied]                 = useState(false)

  const logRef     = useRef<HTMLDivElement>(null)
  const scanIdRef  = useRef<string | null>(null)
  const startedRef = useRef<number>(0)
  const cleanupRef = useRef<(() => void) | null>(null)
  const linesRef   = useRef<string[]>([])

  // Check nmap availability on mount
  useEffect(() => {
    window.cryogram.scanner.check()
      .then((res: { available: boolean }) => setNmapAvailable(res.available))
      .catch(() => setNmapAvailable(false))
  }, [])

  // Subscribe to scan progress events
  useEffect(() => {
    const cleanup = window.cryogram.scanner.onProgress((line: string) => {
      linesRef.current = [...linesRef.current, line]
      setLogLines(prev => [...prev, line])
      // Incrementally parse hosts as output comes in
      setCurrentHosts(parseNmapLines(linesRef.current))
    })
    cleanupRef.current = cleanup
    return cleanup
  }, [])

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logLines])

  const startScan = useCallback(async () => {
    if (!target.trim()) { setError('Enter a target IP, range, or hostname'); return }
    setError(null)
    setScanning(true)
    setLogLines([])
    setCurrentHosts([])
    linesRef.current = []
    setTab('log')
    startedRef.current = Date.now()
    scanIdRef.current = `scan_${Date.now()}`

    try {
      await window.cryogram.scanner.run(target.trim(), scanType, portRange.trim() || undefined)
      const finalHosts = parseNmapLines(linesRef.current)
      setCurrentHosts(finalHosts)
      setTab('results')

      const result: ScanResult = {
        id: scanIdRef.current!,
        target: target.trim(),
        type: scanType,
        portRange: portRange.trim(),
        startedAt: startedRef.current,
        finishedAt: Date.now(),
        hosts: finalHosts,
        rawLines: [...linesRef.current],
      }
      setHistory(prev => [result, ...prev].slice(0, 5))
      setSelectedHistory(result.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed')
    } finally {
      setScanning(false)
    }
  }, [target, scanType, portRange])

  const cancelScan = useCallback(() => {
    window.cryogram.scanner.cancel()
    setScanning(false)
  }, [])

  const exportResults = useCallback(() => {
    const active = selectedHistory ? history.find(h => h.id === selectedHistory) : null
    const lines = active ? active.rawLines : logLines
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [selectedHistory, history, logLines])

  // Display data: either history item or live
  const displayHosts = (() => {
    if (selectedHistory) {
      return history.find(h => h.id === selectedHistory)?.hosts ?? currentHosts
    }
    return currentHosts
  })()

  const displayLines = (() => {
    if (selectedHistory) {
      return history.find(h => h.id === selectedHistory)?.rawLines ?? logLines
    }
    return logLines
  })()

  // ── No nmap state ──────────────────────────────────────────────────────────

  if (nmapAvailable === false) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-5 p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: 'rgba(8,12,20,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '32px 40px',
            textAlign: 'center',
            maxWidth: 480,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>📡</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#e0e8f0', marginBottom: 8 }}>
            nmap not found
          </div>
          <div style={{ fontSize: 12, color: 'rgba(140,160,180,0.8)', marginBottom: 20, lineHeight: 1.6 }}>
            The network scanner requires nmap to be installed on this system.
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            background: 'rgba(0,212,255,0.06)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: 6,
            padding: '10px 16px',
            color: 'var(--cryo-accent)',
          }}>
            sudo apt install nmap
          </div>
        </motion.div>
      </div>
    )
  }

  if (nmapAvailable === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <motion.span
          style={{ fontSize: 12, color: 'rgba(140,160,180,0.6)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Checking for nmap…
        </motion.span>
      </div>
    )
  }

  // ── Main UI ────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* Top controls */}
      <div
        className="shrink-0 p-4 flex flex-col gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(8,12,20,0.6)' }}
      >
        {/* Row 1: Target + scan type */}
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.7)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Target
            </label>
            <input
              value={target}
              onChange={e => setTarget(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !scanning && startScan()}
              placeholder="192.168.1.1 · 192.168.1.0/24 · hostname"
              disabled={scanning}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                padding: '7px 10px',
                color: '#e0e8f0',
                fontSize: 13,
                fontFamily: '"JetBrains Mono", monospace',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ width: 180 }}>
            <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.7)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Scan Type
            </label>
            <select
              value={scanType}
              onChange={e => setScanType(e.target.value as ScanType)}
              disabled={scanning}
              style={{
                width: '100%',
                background: 'rgba(8,12,20,0.9)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                padding: '7px 10px',
                color: '#e0e8f0',
                fontSize: 12,
                outline: 'none',
              }}
            >
              {SCAN_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ width: 130 }}>
            <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.7)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Port Range
            </label>
            <input
              value={portRange}
              onChange={e => setPortRange(e.target.value)}
              placeholder="1-1000"
              disabled={scanning || scanType === 'ping'}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                padding: '7px 10px',
                color: '#e0e8f0',
                fontSize: 12,
                fontFamily: '"JetBrains Mono", monospace',
                outline: 'none',
                opacity: scanType === 'ping' ? 0.4 : 1,
              }}
            />
          </div>
        </div>

        {/* Row 2: Actions + scan type hint */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={!scanning ? { scale: 1.02 } : {}}
            whileTap={!scanning ? { scale: 0.97 } : {}}
            onClick={scanning ? cancelScan : startScan}
            style={{
              padding: '7px 20px',
              background: scanning ? 'rgba(255,68,102,0.15)' : 'rgba(0,212,255,0.12)',
              border: `1px solid ${scanning ? 'rgba(255,68,102,0.4)' : 'rgba(0,212,255,0.3)'}`,
              borderRadius: 6,
              color: scanning ? '#ff4466' : 'var(--cryo-accent)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            {scanning ? 'Cancel Scan' : 'Start Scan'}
          </motion.button>

          {(displayHosts.length > 0 || displayLines.length > 0) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={exportResults}
              style={{
                padding: '7px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                color: copied ? 'rgba(0,255,136,0.8)' : 'rgba(140,160,180,0.8)',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {copied ? 'Copied!' : 'Export'}
            </motion.button>
          )}

          {scanning && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cryo-accent)' }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <span style={{ fontSize: 11, color: 'rgba(0,212,255,0.7)' }}>Scanning…</span>
            </motion.div>
          )}

          <span style={{ fontSize: 11, color: 'rgba(100,120,140,0.6)', marginLeft: 'auto' }}>
            {SCAN_TYPES.find(t => t.id === scanType)?.desc}
          </span>
        </div>

        {error && (
          <div style={{ fontSize: 11, color: '#ff4466', background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.2)', borderRadius: 5, padding: '6px 10px' }}>
            {error}
          </div>
        )}
      </div>

      {/* Body: sidebar history + main panel */}
      <div className="flex flex-1 overflow-hidden">

        {/* Scan history sidebar */}
        {history.length > 0 && (
          <div
            style={{
              width: 200,
              borderRight: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(8,12,20,0.4)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: 10, color: 'rgba(140,160,180,0.5)', padding: '10px 12px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              History
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {history.map(h => (
                <button
                  key={h.id}
                  onClick={() => { setSelectedHistory(h.id); setTab('results') }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    background: selectedHistory === h.id ? 'rgba(0,212,255,0.07)' : 'transparent',
                    borderLeft: selectedHistory === h.id ? '2px solid var(--cryo-accent)' : '2px solid transparent',
                    cursor: 'pointer',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div style={{ fontSize: 11, color: selectedHistory === h.id ? 'var(--cryo-accent)' : '#c9d1d9', fontFamily: '"JetBrains Mono", monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.target}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(140,160,180,0.5)', marginTop: 2 }}>
                    {SCAN_TYPES.find(t => t.id === h.type)?.label} · {formatTimestamp(h.startedAt)}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(0,255,136,0.6)', marginTop: 1 }}>
                    {h.hosts.filter(x => x.status === 'up').length} host{h.hosts.filter(x => x.status === 'up').length !== 1 ? 's' : ''} up
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,12,20,0.3)' }}>
            {(['log', 'results'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  position: 'relative',
                  padding: '8px 18px',
                  fontSize: 11,
                  fontWeight: 500,
                  color: tab === t ? 'var(--cryo-accent)' : 'rgba(140,160,180,0.6)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {t === 'results' ? `Results${displayHosts.length > 0 ? ` (${displayHosts.length})` : ''}` : 'Live Log'}
                {tab === t && (
                  <motion.div
                    layoutId="scanner-tab"
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'var(--cryo-accent)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              className="flex-1 overflow-hidden"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {tab === 'log' ? (
                <div
                  ref={logRef}
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '12px 14px',
                    background: 'rgba(4,8,14,0.7)',
                  }}
                >
                  {displayLines.length === 0 ? (
                    <div style={{ fontSize: 11, color: 'rgba(100,120,140,0.4)', fontFamily: '"JetBrains Mono", monospace', paddingTop: 8 }}>
                      {scanning ? 'Waiting for output…' : 'Run a scan to see output here'}
                    </div>
                  ) : (
                    displayLines.map((line, i) => <LogLine key={i} text={line} />)
                  )}
                </div>
              ) : (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {displayHosts.length === 0 ? (
                    <div style={{ padding: '20px 16px', fontSize: 11, color: 'rgba(100,120,140,0.4)', fontFamily: '"JetBrains Mono", monospace' }}>
                      No results yet — run a scan first
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          {['Host', 'Status', 'Open Ports', 'Services'].map(col => (
                            <th key={col} style={{
                              textAlign: 'left',
                              padding: '8px 14px',
                              fontSize: 10,
                              color: 'rgba(140,160,180,0.5)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.07em',
                              fontWeight: 600,
                              background: 'rgba(8,12,20,0.5)',
                            }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayHosts.map((host, i) => (
                          <motion.tr
                            key={`${host.host}-${i}`}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                          >
                            <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: '#e0e8f0', fontSize: 12 }}>
                              {host.host}
                            </td>
                            <td style={{ padding: '9px 14px' }}>
                              <span style={{
                                fontSize: 10,
                                fontWeight: 600,
                                padding: '2px 7px',
                                borderRadius: 4,
                                background: host.status === 'up' ? 'rgba(0,255,136,0.1)' : host.status === 'down' ? 'rgba(255,68,102,0.1)' : 'rgba(255,255,255,0.05)',
                                color: host.status === 'up' ? 'rgba(0,255,136,0.9)' : host.status === 'down' ? '#ff4466' : 'rgba(140,160,180,0.6)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}>
                                {host.status}
                              </span>
                            </td>
                            <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: 'var(--cryo-accent)', fontSize: 11 }}>
                              {host.openPorts.length > 0 ? host.openPorts.join(', ') : (
                                <span style={{ color: 'rgba(100,120,140,0.4)' }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: '9px 14px', color: 'rgba(180,200,220,0.7)', fontSize: 11, maxWidth: 300 }}>
                              {host.services.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  {host.services.map((s, j) => (
                                    <span key={j} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s}</span>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: 'rgba(100,120,140,0.4)' }}>—</span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Summary footer */}
                  {displayHosts.length > 0 && (
                    <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 10, color: 'rgba(100,120,140,0.5)', display: 'flex', gap: 16 }}>
                      <span>{displayHosts.length} host{displayHosts.length !== 1 ? 's' : ''} scanned</span>
                      <span style={{ color: 'rgba(0,255,136,0.6)' }}>{displayHosts.filter(h => h.status === 'up').length} up</span>
                      <span>{displayHosts.reduce((s, h) => s + h.openPorts.length, 0)} open ports</span>
                      {(() => {
                        const h = history.find(x => x.id === selectedHistory)
                        if (!h?.finishedAt) return null
                        return <span>Duration: {elapsed(h.finishedAt - h.startedAt)}</span>
                      })()}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
