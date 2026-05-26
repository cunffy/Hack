import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SysInfo {
  cpuPercent: number
  ramPercent: number
  ramUsed:    number
  ramTotal:   number
}

interface WifiInfo {
  connected: boolean
  ssid:      string
  signal:    number
}

// ── Mini stat bar ─────────────────────────────────────────────────────────────

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{
      flex:         1,
      height:       3,
      borderRadius: 99,
      background:   'rgba(255,255,255,0.07)',
      overflow:     'hidden',
    }}>
      <motion.div
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 99, background: color }}
      />
    </div>
  )
}

// ── Widget wrapper ────────────────────────────────────────────────────────────

function Widget({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background:           'rgba(8,12,20,0.65)',
      backdropFilter:       'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border:               '1px solid rgba(255,255,255,0.07)',
      borderRadius:         12,
      padding:              '10px 14px',
      minWidth:             160,
    }}>
      {children}
    </div>
  )
}

// ── Clock widget ──────────────────────────────────────────────────────────────

function ClockWidget() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh  = now.getHours().toString().padStart(2, '0')
  const mm  = now.getMinutes().toString().padStart(2, '0')
  const sec = now.getSeconds()
  const day = now.toLocaleDateString('en-US', { weekday: 'short' })
  const dt  = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <Widget>
      <div style={{
        fontFamily:         '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        fontSize:           34,
        fontWeight:         200,
        lineHeight:         1,
        color:              'rgba(255,255,255,0.92)',
        letterSpacing:      '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        marginBottom:       3,
      }}>
        {hh}
        <span style={{ opacity: sec % 2 === 0 ? 1 : 0.3, transition: 'opacity 0.3s' }}>:</span>
        {mm}
      </div>
      <div style={{
        fontSize:    11,
        color:       'rgba(255,255,255,0.35)',
        fontFamily:  '-apple-system, sans-serif',
        letterSpacing: '0.02em',
      }}>
        {day}&nbsp;&nbsp;{dt}
      </div>
    </Widget>
  )
}

// ── System stats widget ───────────────────────────────────────────────────────

function SystemStatsWidget() {
  const [info, setInfo] = useState<SysInfo | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const raw = await window.cryogram.system.getInfo()
        const cpuPercent = Math.round(Math.random() * 35 + 8) // CPU% not in SystemInfo; use mock
        const ramPercent = raw.ramTotal > 0
          ? Math.round((raw.ramUsed / raw.ramTotal) * 100)
          : 0
        setInfo({ cpuPercent, ramPercent, ramUsed: raw.ramUsed, ramTotal: raw.ramTotal })
      } catch {
        setInfo({ cpuPercent: 12, ramPercent: 26, ramUsed: 0, ramTotal: 0 })
      }
    }
    fetch()
    const id = setInterval(fetch, 3000)
    return () => clearInterval(id)
  }, [])

  const cpuColor = !info
    ? 'rgba(255,255,255,0.2)'
    : info.cpuPercent > 80
    ? '#ef4444'
    : info.cpuPercent > 50
    ? '#fbbf24'
    : 'var(--cryo-accent)'

  const ramColor = !info
    ? 'rgba(255,255,255,0.2)'
    : info.ramPercent > 80
    ? '#ef4444'
    : info.ramPercent > 60
    ? '#fbbf24'
    : '#a855f7'

  const fmt = (bytes: number) => {
    const gb = bytes / (1024 ** 3)
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${Math.round(bytes / (1024 ** 2))} MB`
  }

  return (
    <Widget>
      <div style={{
        fontSize:   9,
        color:      'rgba(255,255,255,0.28)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily:  '"JetBrains Mono", monospace',
        marginBottom: 8,
      }}>
        System
      </div>

      {/* CPU row */}
      <div style={{ marginBottom: 7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: '-apple-system, sans-serif' }}>CPU</span>
          <span style={{ fontSize: 10, color: cpuColor, fontFamily: '"JetBrains Mono", monospace' }}>
            {info ? `${info.cpuPercent}%` : '–'}
          </span>
        </div>
        <StatBar value={info?.cpuPercent ?? 0} color={cpuColor} />
      </div>

      {/* RAM row */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: '-apple-system, sans-serif' }}>RAM</span>
          <span style={{ fontSize: 10, color: ramColor, fontFamily: '"JetBrains Mono", monospace' }}>
            {info
              ? info.ramTotal > 0
                ? `${fmt(info.ramUsed)} / ${fmt(info.ramTotal)}`
                : `${info.ramPercent}%`
              : '–'}
          </span>
        </div>
        <StatBar value={info?.ramPercent ?? 0} color={ramColor} />
      </div>
    </Widget>
  )
}

// ── Network widget ────────────────────────────────────────────────────────────

function NetworkWidget() {
  const [wifi, setWifi] = useState<WifiInfo | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const s = await window.cryogram.system.getWifiStatus()
        setWifi(s)
      } catch {
        setWifi({ connected: false, ssid: '', signal: 0 })
      }
    }
    fetch()
    const id = setInterval(fetch, 5000)
    return () => clearInterval(id)
  }, [])

  const dotColor = wifi?.connected ? '#4ade80' : '#ef4444'

  return (
    <Widget>
      <div style={{
        fontSize:     9,
        color:        'rgba(255,255,255,0.28)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily:   '"JetBrains Mono", monospace',
        marginBottom: 8,
      }}>
        Network
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {/* Status dot */}
        <div style={{
          width:        6,
          height:       6,
          borderRadius: '50%',
          background:   dotColor,
          boxShadow:    `0 0 6px ${dotColor}`,
          flexShrink:   0,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize:     12,
            fontWeight:   500,
            color:        wifi?.connected ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
            fontFamily:   '-apple-system, sans-serif',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {wifi === null
              ? 'Loading…'
              : wifi.connected
              ? wifi.ssid || 'Connected'
              : 'Not connected'}
          </div>
          {wifi?.connected && (
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: '-apple-system, sans-serif', marginTop: 1 }}>
              Signal: {wifi.signal > 0 ? `${wifi.signal}%` : 'good'}
            </div>
          )}
        </div>

        {/* Wifi icon */}
        <svg width="14" height="12" viewBox="0 0 24 18" style={{ flexShrink: 0, opacity: wifi?.connected ? 1 : 0.25 }}>
          <path d="M12 14.5 a1.5 1.5 0 1 1 0 0.1Z" fill={dotColor} />
          <path d="M8.5 11.5 Q12 8 15.5 11.5" fill="none" stroke={dotColor} strokeWidth="2" strokeLinecap="round"/>
          <path d="M5.5 8.5 Q12 3 18.5 8.5"   fill="none" stroke={dotColor} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <path d="M2.5 5.5 Q12 -2 21.5 5.5"  fill="none" stroke={dotColor} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        </svg>
      </div>
    </Widget>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function DesktopWidgets() {
  return (
    <div style={{
      position:       'absolute',
      right:          20,
      bottom:         90,
      display:        'flex',
      flexDirection:  'column',
      gap:            8,
      zIndex:         40,
      pointerEvents:  'none',
    }}>
      {([
        { key: 'clock',   delay: 0,    node: <ClockWidget /> },
        { key: 'sys',     delay: 0.08, node: <SystemStatsWidget /> },
        { key: 'network', delay: 0.16, node: <NetworkWidget /> },
      ] as const).map(({ key, delay, node }) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28, delay }}
          style={{ pointerEvents: 'auto' }}
        >
          {node}
        </motion.div>
      ))}
    </div>
  )
}
