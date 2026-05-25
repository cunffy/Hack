import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'

// ── Apple-menu equivalent ──────────────────────────────────────────────────
function CryogramMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const openApp = useWindowStore(s => s.openApp)
  const isMock = !window.cryogram?.system?.shutdown

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const items = [
    { label: 'About Cryogram',       action: () => { openApp('settings'); setOpen(false) } },
    { sep: true },
    { label: 'System Preferences',   action: () => { openApp('system'); setOpen(false) } },
    { sep: true },
    { label: 'Lock Screen',          action: () => { !isMock && window.cryogram.system.lock(); setOpen(false) } },
    { label: 'Restart…',             action: () => { !isMock && window.cryogram.system.reboot(); setOpen(false) } },
    { label: 'Shut Down…',           action: () => { !isMock && window.cryogram.system.shutdown(); setOpen(false) } },
  ]

  return (
    <div ref={ref} className="relative" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 h-7 rounded-md transition-colors"
        style={{
          background: open ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: open ? '#fff' : 'rgba(255,255,255,0.7)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
        onMouseLeave={e => { e.currentTarget.style.background = open ? 'rgba(255,255,255,0.1)' : 'transparent' }}
      >
        {/* Cryogram hex logo */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
        </svg>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#00d4ff' }}>
          CRYOGRAM
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 mt-1 min-w-44 rounded-xl overflow-hidden z-[999]"
            style={{
              background: 'rgba(18,24,36,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(32px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            }}
          >
            <div className="py-1.5">
              {items.map((item, i) =>
                item.sep ? (
                  <div key={i} className="my-1 mx-3 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                ) : (
                  <button
                    key={i}
                    onClick={item.action}
                    className="w-full text-left px-4 py-1.5 text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.78)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.15)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.78)' }}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main TitleBar ──────────────────────────────────────────────────────────
export function TitleBar() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const focusedWindow = useWindowStore(s => s.windows.find(w => w.focused && !w.minimized))

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="flex items-center h-7 px-2 shrink-0 select-none relative"
      style={{
        background: 'rgba(6,9,15,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        WebkitAppRegion: 'drag',
        zIndex: 100,
      } as React.CSSProperties}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.45) 35%, rgba(187,136,255,0.25) 65%, transparent)' }}
      />

      {/* Left: Cryogram menu */}
      <CryogramMenu />

      {/* Active app name — shows when a window is focused */}
      <AnimatePresence>
        {focusedWindow && (
          <motion.div
            key={focusedWindow.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 ml-1"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>›</span>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.01em' }}>
              {focusedWindow.title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right: status icons + clock */}
      <div
        className="ml-auto flex items-center gap-0.5"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <StatusIcons />
        <div className="w-px h-3.5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="flex items-center gap-1.5 px-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.01em' }}>
          <span>{date}</span>
          <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{time}</span>
        </div>
      </div>
    </div>
  )
}

// ── Inline status icons (WiFi, Volume, Battery) ────────────────────────────
type BatteryInfo = { level: number; charging: boolean; status: string }
type WifiStatus  = { connected: boolean; ssid: string; signal: number }
type VolumeInfo  = { level: number; muted: boolean }

function StatusIcons() {
  const [battery, setBattery] = useState<BatteryInfo | null>(null)
  const [wifi,    setWifi]    = useState<WifiStatus | null>(null)
  const [vol,     setVol]     = useState<VolumeInfo | null>(null)
  const [popup,   setPopup]   = useState<'wifi'|'vol'|'bat'|null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      try { setBattery(await window.cryogram.system.getBattery()) } catch {}
      try { setWifi(await window.cryogram.system.getWifiStatus()) } catch {}
      try { setVol(await window.cryogram.system.getVolume()) } catch {}
    }
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setPopup(null) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const toggle = (id: typeof popup) => setPopup(p => p === id ? null : id)

  return (
    <div ref={ref} className="relative flex items-center gap-0.5">

      {/* WiFi */}
      <TrayIcon onClick={() => toggle('wifi')} active={popup === 'wifi'} title={wifi?.connected ? wifi.ssid : 'No Wi-Fi'}>
        <WifiIcon connected={wifi?.connected ?? false} signal={wifi?.signal ?? 0} />
      </TrayIcon>

      {/* Volume */}
      <TrayIcon onClick={() => toggle('vol')} active={popup === 'vol'} title={vol ? (vol.muted ? 'Muted' : `${vol.level}%`) : 'Volume'}>
        <VolumeIcon muted={vol?.muted ?? false} level={vol?.level ?? 50} />
      </TrayIcon>

      {/* Battery */}
      {battery && (
        <TrayIcon onClick={() => toggle('bat')} active={popup === 'bat'} title={`${battery.level}%`}>
          <BattIcon level={battery.level} charging={battery.charging} />
        </TrayIcon>
      )}

      {/* Popover panel */}
      <AnimatePresence>
        {popup && (
          <motion.div
            key={popup}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.13 }}
            className="absolute top-full right-0 mt-2 z-[999] rounded-2xl p-4 min-w-56"
            style={{
              background: 'rgba(14,20,32,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(32px)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
            }}
          >
            {popup === 'wifi'  && <WifiPanel wifi={wifi} />}
            {popup === 'vol'   && <VolumePanel vol={vol} setVol={setVol} />}
            {popup === 'bat'   && <BattPanel battery={battery} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TrayIcon({ children, onClick, active, title }: { children: React.ReactNode; onClick: () => void; active: boolean; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center w-7 h-6 rounded-md transition-colors"
      style={{ background: active ? 'rgba(255,255,255,0.12)' : 'transparent', color: 'rgba(255,255,255,0.7)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)' }}
      onMouseLeave={e => { e.currentTarget.style.background = active ? 'rgba(255,255,255,0.12)' : 'transparent' }}
    >
      {children}
    </button>
  )
}

// ── SVG Status Icons ───────────────────────────────────────────────────────
function WifiIcon({ connected, signal }: { connected: boolean; signal: number }) {
  const c = connected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'
  const s1 = signal > 25  ? c : 'rgba(255,255,255,0.2)'
  const s2 = signal > 50  ? c : 'rgba(255,255,255,0.2)'
  const s3 = signal > 75  ? c : 'rgba(255,255,255,0.2)'
  return (
    <svg width="14" height="12" viewBox="0 0 24 18">
      <path d="M12 14.5 a1.5 1.5 0 1 1 0 0.1Z" fill={c} />
      <path d="M8.5 11.5 Q12 8 15.5 11.5" fill="none" stroke={s1} strokeWidth="2" strokeLinecap="round" />
      <path d="M5.5 8.5 Q12 3 18.5 8.5"   fill="none" stroke={s2} strokeWidth="2" strokeLinecap="round" />
      <path d="M2.5 5.5 Q12 -2 21.5 5.5"  fill="none" stroke={s3} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function VolumeIcon({ muted, level }: { muted: boolean; level: number }) {
  return (
    <svg width="14" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {muted ? (
        <><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>
      ) : level > 50 ? (
        <><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></>
      ) : (
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      )}
    </svg>
  )
}

function BattIcon({ level, charging }: { level: number; charging: boolean }) {
  const color = level > 20 ? 'rgba(255,255,255,0.85)' : '#ef4444'
  const fill = level > 20 ? (charging ? '#00ff88' : 'rgba(255,255,255,0.85)') : '#ef4444'
  return (
    <svg width="18" height="11" viewBox="0 0 22 12">
      <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" fill="none" stroke={color} strokeWidth="1.2" />
      <rect x="19" y="3.5" width="2.5" height="5" rx="1" fill={color} />
      <rect x="1.5" y="1.5" width={Math.max(1, (level / 100) * 16)} height="9" rx="1.5" fill={fill} />
      {charging && (
        <text x="9" y="10" fontSize="8" fill="#080c12" textAnchor="middle" fontWeight="bold">⚡</text>
      )}
    </svg>
  )
}

// ── Popover panels ─────────────────────────────────────────────────────────
function PanelLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold mb-3" style={{ color: '#00d4ff', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 10 }}>{children}</div>
}

function WifiPanel({ wifi }: { wifi: WifiStatus | null }) {
  const openApp = useWindowStore(s => s.openApp)
  return (
    <div>
      <PanelLabel>Wi-Fi</PanelLabel>
      {wifi?.connected ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #4ade80' }} />
            <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{wifi.ssid}</span>
          </div>
          <div className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Signal: {wifi.signal}%</div>
        </>
      ) : (
        <div className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Not connected</div>
      )}
      <button
        onClick={() => openApp('system')}
        className="w-full text-xs py-1.5 rounded-lg text-center transition-colors"
        style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.12)' }}
      >
        Network Settings
      </button>
    </div>
  )
}

function VolumePanel({ vol, setVol }: { vol: VolumeInfo | null; setVol: (v: VolumeInfo) => void }) {
  if (!vol) return <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-sm">Unavailable</div>
  return (
    <div>
      <PanelLabel>Volume</PanelLabel>
      <div className="flex items-center gap-3 mb-4">
        <VolumeIcon muted={vol.muted} level={vol.level} />
        <div className="flex-1 relative">
          <input
            type="range" min={0} max={100} value={vol.level} disabled={vol.muted}
            onChange={async e => {
              const v = Number(e.target.value)
              setVol({ ...vol, level: v })
              await window.cryogram.system.setVolume(v)
            }}
            className="w-full accent-cyan-400"
            style={{ opacity: vol.muted ? 0.4 : 1 }}
          />
        </div>
        <span className="text-xs w-8 text-right" style={{ color: 'rgba(255,255,255,0.5)' }}>{vol.muted ? '—' : `${vol.level}%`}</span>
      </div>
      <button
        onClick={async () => { await window.cryogram.system.toggleMute(); const u = await window.cryogram.system.getVolume(); setVol(u) }}
        className="w-full text-xs py-1.5 rounded-lg transition-colors"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
      >
        {vol.muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  )
}

function BattPanel({ battery }: { battery: BatteryInfo | null }) {
  if (!battery) return null
  const color = battery.level > 20 ? '#00d4ff' : '#ef4444'
  return (
    <div>
      <PanelLabel>Battery</PanelLabel>
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-3xl font-bold" style={{ color }}>{battery.level}%</span>
        {battery.charging && <span className="text-xs" style={{ color: '#00ff88' }}>Charging</span>}
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${battery.level}%` }}
          style={{ background: battery.level > 20 ? 'linear-gradient(90deg,#00d4ff,#bb88ff)' : '#ef4444' }}
        />
      </div>
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{battery.status}</div>
    </div>
  )
}
