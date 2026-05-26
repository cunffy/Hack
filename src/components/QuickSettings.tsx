import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────

interface QuickSettingsProps {
  open: boolean
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement>
}

// ── Slider ─────────────────────────────────────────────────────────────────────

function StyledSlider({
  value, min, max, onChange, disabled,
}: {
  value: number; min: number; max: number
  onChange: (v: number) => void; disabled?: boolean
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <div style={{
        position:     'absolute',
        top:          '50%',
        left:         0,
        right:        0,
        height:       3,
        transform:    'translateY(-50%)',
        borderRadius: 99,
        background:   'rgba(255,255,255,0.08)',
        overflow:     'hidden',
        pointerEvents:'none',
      }}>
        <div style={{
          width:      `${pct}%`,
          height:     '100%',
          background: disabled ? 'rgba(255,255,255,0.15)' : 'var(--cryo-accent)',
          borderRadius: 99,
          transition: 'width 0.08s',
        }} />
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width:      '100%',
          cursor:     disabled ? 'not-allowed' : 'pointer',
          opacity:    disabled ? 0.4 : 1,
          accentColor:'var(--cryo-accent)',
          background: 'transparent',
        }}
      />
    </div>
  )
}

// ── Toggle button ──────────────────────────────────────────────────────────────

function ToggleBtn({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            5,
        padding:        '10px 6px',
        borderRadius:   12,
        border:         active
          ? '1px solid var(--cryo-a35)'
          : '1px solid rgba(255,255,255,0.08)',
        background:     active
          ? 'var(--cryo-a18)'
          : 'rgba(255,255,255,0.04)',
        cursor:         'pointer',
        transition:     'background 0.15s, border-color 0.15s',
        flex:           1,
        minWidth:       0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = active ? 'var(--cryo-a25)' : 'rgba(255,255,255,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.background = active ? 'var(--cryo-a18)' : 'rgba(255,255,255,0.04)' }}
    >
      <div style={{ color: active ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.55)', lineHeight: 1 }}>
        {icon}
      </div>
      <span style={{
        fontSize:    9,
        fontWeight:  500,
        color:       active ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.4)',
        letterSpacing:'0.03em',
        textTransform:'uppercase',
        whiteSpace:  'nowrap',
        overflow:    'hidden',
        textOverflow:'ellipsis',
        maxWidth:    '100%',
      }}>
        {label}
      </span>
    </motion.button>
  )
}

// ── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize:      9,
      fontWeight:    600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color:         'rgba(255,255,255,0.22)',
      fontFamily:    '"JetBrains Mono", monospace',
      marginBottom:  7,
      paddingLeft:   2,
    }}>
      {children}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function QuickSettings({ open, onClose }: QuickSettingsProps) {
  // System state
  const [vol,        setVol]        = useState<VolumeInfo>({ level: 60, muted: false })
  const [brightness, setBrightness] = useState(80)
  const [wifi,       setWifi]       = useState<WifiStatus | null>(null)
  const [networks,   setNetworks]   = useState<WifiNetwork[]>([])
  const [battery,    setBattery]    = useState<BatteryInfo | null>(null)
  const [btDevices,  setBtDevices]  = useState<BtDevice[]>([])

  // Local toggles
  const [dnd,           setDnd]           = useState(false)
  const [darkTheme,     setDarkTheme]     = useState(true)
  const [wifiExpanded,  setWifiExpanded]  = useState(false)
  const [connectTarget, setConnectTarget] = useState<WifiNetwork | null>(null)
  const [password,      setPassword]      = useState('')
  const [connecting,    setConnecting]    = useState<string | null>(null)
  const [btOn,          setBtOn]          = useState(false)

  // Load system data when opening
  useEffect(() => {
    if (!open) return
    const load = async () => {
      try { setVol(await window.cryogram.system.getVolume()) } catch {}
      try { setBrightness(await window.cryogram.system.getBrightness()) } catch {}
      try { setWifi(await window.cryogram.system.getWifiStatus()) } catch {}
      try { setBattery(await window.cryogram.system.getBattery()) } catch {}
      try { setBtDevices(await window.cryogram.system.getBluetoothDevices()); setBtOn(true) } catch {}
    }
    load()
  }, [open])

  // Load networks when WiFi section expanded
  useEffect(() => {
    if (!wifiExpanded) return
    const load = async () => {
      try { setNetworks(await window.cryogram.system.getNetworks()) } catch {}
    }
    load()
  }, [wifiExpanded])

  // Escape key
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  const handleVolChange = useCallback(async (v: number) => {
    setVol(prev => ({ ...prev, level: v }))
    try { await window.cryogram.system.setVolume(v) } catch {}
  }, [])

  const handleToggleMute = useCallback(async () => {
    try {
      await window.cryogram.system.toggleMute()
      const updated = await window.cryogram.system.getVolume()
      setVol(updated)
    } catch {
      setVol(prev => ({ ...prev, muted: !prev.muted }))
    }
  }, [])

  const handleBrightnessChange = useCallback(async (v: number) => {
    setBrightness(v)
    try { await window.cryogram.system.setBrightness(v) } catch {}
  }, [])

  const handleDnd = () => {
    const next = !dnd
    setDnd(next)
    window.dispatchEvent(new CustomEvent('cryogram:dnd', { detail: { enabled: next } }))
  }

  const handleTheme = () => {
    const next = !darkTheme
    setDarkTheme(next)
    window.dispatchEvent(new CustomEvent('cryogram:theme-toggle', { detail: { dark: next } }))
  }

  const handleLock = () => {
    onClose()
    try { window.cryogram.system.lock() } catch {}
  }

  const handleConnect = async (net: WifiNetwork, pw: string) => {
    setConnecting(net.ssid)
    try {
      await window.cryogram.system.connectNetwork(net.ssid, pw || undefined)
      const updated = await window.cryogram.system.getWifiStatus()
      setWifi(updated)
      setConnectTarget(null)
      setPassword('')
    } catch {}
    setConnecting(null)
  }

  const volIcon = vol.muted ? (
    // Muted
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : vol.level > 50 ? (
    // High
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ) : (
    // Low
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )

  const battLevel = battery?.level ?? 0

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 87000 }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -12,  scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.85 }}
            onClick={e => e.stopPropagation()}
            style={{
              position:             'fixed',
              top:                  36,
              right:                8,
              width:                320,
              maxHeight:            '80vh',
              zIndex:               88000,
              background:           'rgba(12,16,26,0.92)',
              backdropFilter:       'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border:               '1px solid rgba(255,255,255,0.08)',
              borderRadius:         16,
              boxShadow:            '0 20px 60px rgba(0,0,0,0.75)',
              overflowY:            'auto',
              fontFamily:           '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              scrollbarWidth:       'thin',
              scrollbarColor:       'rgba(255,255,255,0.1) transparent',
            }}
          >
            <div style={{ padding: '14px 14px 8px' }}>

              {/* ── Quick Toggles ──────────────────────────────────────────── */}
              <SectionLabel>Quick Toggles</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 14 }}>
                {/* WiFi */}
                <ToggleBtn
                  active={wifi?.connected ?? false}
                  label={wifi?.connected ? (wifi.ssid.slice(0, 8) + (wifi.ssid.length > 8 ? '…' : '')) : 'Wi-Fi'}
                  onClick={() => setWifiExpanded(x => !x)}
                  icon={
                    <svg width="18" height="16" viewBox="0 0 24 18">
                      <path d="M12 14.5 a1.5 1.5 0 1 1 0 0.1Z" fill="currentColor" />
                      <path d="M8.5 11.5 Q12 8 15.5 11.5"   fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M5.5 8.5 Q12 3 18.5 8.5"     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M2.5 5.5 Q12 -2 21.5 5.5"    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  }
                />

                {/* Bluetooth */}
                <ToggleBtn
                  active={btOn && btDevices.some(d => d.connected)}
                  label="Bluetooth"
                  onClick={() => setBtOn(x => !x)}
                  icon={
                    <svg width="14" height="18" viewBox="0 0 14 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 7 11 14 7 18 7 3 11 7 3 14" />
                    </svg>
                  }
                />

                {/* Mute */}
                <ToggleBtn
                  active={vol.muted}
                  label={vol.muted ? 'Muted' : 'Sound'}
                  onClick={handleToggleMute}
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      {vol.muted
                        ? <><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>
                        : <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      }
                    </svg>
                  }
                />

                {/* Lock */}
                <ToggleBtn
                  active={false}
                  label="Lock"
                  onClick={handleLock}
                  icon={
                    <svg width="16" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                />

                {/* DND */}
                <ToggleBtn
                  active={dnd}
                  label="Do Not Disturb"
                  onClick={handleDnd}
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      {dnd && <line x1="2" y1="2" x2="22" y2="22" />}
                    </svg>
                  }
                />

                {/* Theme */}
                <ToggleBtn
                  active={!darkTheme}
                  label={darkTheme ? 'Dark' : 'Light'}
                  onClick={handleTheme}
                  icon={darkTheme ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  )}
                />
              </div>

              {/* ── Divider ────────────────────────────────────────────────── */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '2px 0 12px' }} />

              {/* ── Volume ────────────────────────────────────────────────── */}
              <SectionLabel>Volume</SectionLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <button
                  onClick={handleToggleMute}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: vol.muted ? '#ef4444' : 'rgba(255,255,255,0.6)',
                    padding: 0, lineHeight: 0, flexShrink: 0,
                  }}
                >
                  {volIcon}
                </button>
                <StyledSlider
                  value={vol.level} min={0} max={100}
                  disabled={vol.muted}
                  onChange={handleVolChange}
                />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', width: 28, textAlign: 'right', flexShrink: 0 }}>
                  {vol.muted ? '—' : `${vol.level}`}
                </span>
              </div>

              {/* ── Brightness ───────────────────────────────────────────── */}
              <SectionLabel>Brightness</SectionLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 0, flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                </div>
                <StyledSlider
                  value={brightness} min={5} max={100}
                  onChange={handleBrightnessChange}
                />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', width: 28, textAlign: 'right', flexShrink: 0 }}>
                  {brightness}
                </span>
              </div>

              {/* ── WiFi Networks (collapsible) ──────────────────────────── */}
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 6 }}
                onClick={() => setWifiExpanded(x => !x)}
              >
                <SectionLabel>Wi-Fi {wifi?.connected ? `· ${wifi.ssid}` : ''}</SectionLabel>
                <motion.div
                  animate={{ rotate: wifiExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 0, marginBottom: 7 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.div>
              </div>

              <AnimatePresence>
                {wifiExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden', marginBottom: 10 }}
                  >
                    <div style={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {networks.length === 0 ? (
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '8px 0' }}>
                          Scanning…
                        </div>
                      ) : (
                        networks.map(net => (
                          <button
                            key={net.ssid}
                            onClick={() => {
                              setConnectTarget(t => t?.ssid === net.ssid ? null : net)
                              setPassword('')
                            }}
                            style={{
                              display:     'flex',
                              alignItems:  'center',
                              gap:         8,
                              padding:     '6px 8px',
                              borderRadius:8,
                              background:  net.active ? 'var(--cryo-a12)' : connectTarget?.ssid === net.ssid ? 'rgba(255,255,255,0.07)' : 'transparent',
                              border:      net.active ? '1px solid var(--cryo-a20)' : '1px solid transparent',
                              cursor:      'pointer',
                              textAlign:   'left',
                              width:       '100%',
                            }}
                          >
                            <svg width="12" height="10" viewBox="0 0 14 12">
                              <rect x="0"  y="8" width="3" height="4" rx="1" fill={net.signal > 20 ? (net.active ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.6)') : 'rgba(255,255,255,0.18)'} />
                              <rect x="4"  y="5" width="3" height="7" rx="1" fill={net.signal > 40 ? (net.active ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.6)') : 'rgba(255,255,255,0.18)'} />
                              <rect x="8"  y="2" width="3" height="10" rx="1" fill={net.signal > 65 ? (net.active ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.6)') : 'rgba(255,255,255,0.18)'} />
                            </svg>
                            <span style={{ flex: 1, fontSize: 11, color: net.active ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {net.ssid}
                            </span>
                            {net.security && (
                              <svg width="8" height="10" viewBox="0 0 9 10" fill="none">
                                <rect x="0.5" y="4" width="8" height="5.5" rx="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                                <path d="M2.5 4V3a2 2 0 0 1 4 0v1" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
                              </svg>
                            )}
                            {net.active && <span style={{ fontSize: 10, color: 'var(--cryo-accent)' }}>✓</span>}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Password prompt */}
                    <AnimatePresence>
                      {connectTarget && !connectTarget.active && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: 'hidden', marginTop: 6 }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {connectTarget.security && (
                              <input
                                type="password"
                                placeholder="Wi-Fi password"
                                value={password}
                                autoFocus
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleConnect(connectTarget, password) }}
                                style={{
                                  width:        '100%',
                                  padding:      '7px 10px',
                                  borderRadius: 8,
                                  border:       '1px solid rgba(255,255,255,0.12)',
                                  background:   'rgba(255,255,255,0.06)',
                                  color:        '#e2e8f0',
                                  fontSize:     12,
                                  outline:      'none',
                                  boxSizing:    'border-box',
                                }}
                              />
                            )}
                            <button
                              onClick={() => handleConnect(connectTarget, password)}
                              disabled={!!connecting}
                              style={{
                                padding:      '6px',
                                borderRadius: 8,
                                border:       '1px solid var(--cryo-a25)',
                                background:   connecting ? 'var(--cryo-a08)' : 'var(--cryo-a18)',
                                color:        connecting ? 'var(--cryo-a50)' : 'var(--cryo-accent)',
                                fontSize:     11,
                                cursor:       connecting ? 'wait' : 'pointer',
                                fontWeight:   500,
                              }}
                            >
                              {connecting === connectTarget.ssid ? 'Connecting…' : `Connect to ${connectTarget.ssid}`}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Battery ───────────────────────────────────────────────── */}
              {battery && (
                <>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '2px 0 12px' }} />
                  <SectionLabel>Battery</SectionLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    {/* Battery icon */}
                    <svg width="24" height="14" viewBox="0 0 22 12" style={{ flexShrink: 0 }}>
                      <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" fill="none" stroke={battLevel > 20 ? 'rgba(255,255,255,0.6)' : '#ef4444'} strokeWidth="1.2" />
                      <rect x="19" y="3.5" width="2.5" height="5" rx="1" fill={battLevel > 20 ? 'rgba(255,255,255,0.6)' : '#ef4444'} />
                      <rect x="1.5" y="1.5" width={Math.max(1, (battLevel / 100) * 16)} height="9" rx="1.5"
                        fill={battery.charging ? '#00ff88' : battLevel > 20 ? 'rgba(255,255,255,0.85)' : '#ef4444'}
                      />
                    </svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: battLevel > 20 ? '#c9d1d9' : '#ef4444' }}>
                        {battLevel}%
                        {battery.charging && (
                          <span style={{ fontSize: 10, color: '#00ff88', marginLeft: 6, fontWeight: 400 }}>Charging</span>
                        )}
                      </div>
                      {/* Bar */}
                      <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.08)', marginTop: 4, overflow: 'hidden' }}>
                        <div style={{
                          width:        `${battLevel}%`,
                          height:       '100%',
                          borderRadius: 99,
                          background:   battery.charging ? '#00ff88' : battLevel > 20 ? 'var(--cryo-accent)' : '#ef4444',
                          transition:   'width 0.4s',
                        }} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── Footer ───────────────────────────────────────────────── */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0 10px' }} />
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                {/* Settings */}
                <FooterBtn
                  title="Settings"
                  onClick={() => {
                    onClose()
                    window.dispatchEvent(new CustomEvent('cryogram:openApp', { detail: { appId: 'settings' } }))
                  }}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  }
                />
                {/* Restart */}
                <FooterBtn
                  title="Restart"
                  onClick={() => { try { window.cryogram.system.reboot() } catch {} }}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
                    </svg>
                  }
                />
                {/* Shutdown */}
                <FooterBtn
                  title="Shut Down"
                  danger
                  onClick={() => { try { window.cryogram.system.shutdown() } catch {} }}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                      <line x1="12" y1="2" x2="12" y2="12" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Bottom accent line */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--cryo-a20) 40%, var(--cryo-a20) 60%, transparent)' }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function FooterBtn({
  icon, title, onClick, danger,
}: {
  icon: React.ReactNode; title: string; onClick: () => void; danger?: boolean
}) {
  const base = danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)'
  const hover = danger ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.1)'
  const color = danger ? '#f87171' : 'rgba(255,255,255,0.55)'
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            5,
        padding:        '6px 10px',
        borderRadius:   8,
        border:         `1px solid ${danger ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}`,
        background:     base,
        cursor:         'pointer',
        color,
        fontSize:       11,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = hover }}
      onMouseLeave={e => { e.currentTarget.style.background = base }}
    >
      {icon}
      <span>{title}</span>
    </button>
  )
}
