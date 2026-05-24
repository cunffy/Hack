import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'

export default function SystemTray() {
  const openApp = useWindowStore(s => s.openApp)
  const [battery, setBattery] = useState<BatteryInfo | null>(null)
  const [wifi, setWifi] = useState<WifiStatus | null>(null)
  const [vol, setVol] = useState<VolumeInfo | null>(null)
  const [clock, setClock] = useState('')
  const [popup, setPopup] = useState<'wifi' | 'vol' | 'bat' | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    tick()
    const t = setInterval(tick, 10000)
    return () => clearInterval(t)
  }, [])

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
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPopup(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const battPct = battery?.level ?? null
  const battIcon = battPct === null ? '🔋' : battPct > 80 ? '🔋' : battPct > 40 ? '🔋' : battPct > 15 ? '🪫' : '🪫'
  const volIcon = !vol ? '🔊' : vol.muted ? '🔇' : vol.level > 60 ? '🔊' : vol.level > 20 ? '🔉' : '🔈'
  const wifiIcon = !wifi?.connected ? '📵' : wifi.signal > 70 ? '📶' : wifi.signal > 40 ? '📶' : '📶'

  const togglePopup = (id: typeof popup) => setPopup(p => p === id ? null : id)

  return (
    <div ref={ref} className="flex items-center gap-0.5">
      {/* Wi-Fi */}
      <TrayBtn onClick={() => togglePopup('wifi')} title={wifi?.connected ? wifi.ssid : 'Not connected'}>
        {wifiIcon}
      </TrayBtn>

      {/* Volume */}
      <TrayBtn onClick={() => togglePopup('vol')} title={vol ? (vol.muted ? 'Muted' : `${vol.level}%`) : 'Volume'}>
        {volIcon}
      </TrayBtn>

      {/* Battery */}
      {battery !== null && (
        <TrayBtn onClick={() => togglePopup('bat')} title={`${battPct}%${battery?.charging ? ' · Charging' : ''}`}>
          {battIcon}
          <span className="text-xs ml-0.5">{battPct}%</span>
        </TrayBtn>
      )}

      {/* Clock / open System Settings */}
      <button
        onClick={() => openApp('system')}
        className="px-2 py-1 rounded text-xs transition-colors hover:bg-white/10"
        style={{ color: '#c9d1d9', fontFamily: '"JetBrains Mono", monospace' }}
      >
        {clock}
      </button>

      {/* Popups */}
      <AnimatePresence>
        {popup && (
          <motion.div
            key={popup}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full right-0 mt-2 z-50 rounded-xl p-3 min-w-48"
            style={{
              background: 'rgba(13,20,33,0.97)',
              border: '1px solid rgba(26,40,64,0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            {popup === 'wifi' && <WifiPopup wifi={wifi} />}
            {popup === 'vol' && <VolumePopup vol={vol} onChange={async v => {
              setVol((prev: VolumeInfo | null) => prev ? { ...prev, level: v } : prev)
              await window.cryogram.system.setVolume(v)
            }} onToggleMute={async () => {
              await window.cryogram.system.toggleMute()
              const updated = await window.cryogram.system.getVolume()
              setVol(updated)
            }} />}
            {popup === 'bat' && <BatteryPopup battery={battery} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TrayBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center px-1.5 py-1 rounded text-sm transition-colors hover:bg-white/10"
      style={{ color: '#c9d1d9' }}
    >
      {children}
    </button>
  )
}

function WifiPopup({ wifi }: { wifi: WifiStatus | null }) {
  return (
    <div>
      <div className="text-xs font-semibold mb-2" style={{ color: '#00d4ff' }}>Wi-Fi</div>
      {wifi?.connected ? (
        <>
          <div className="text-xs text-cryo-muted mb-1">Connected to</div>
          <div className="text-sm" style={{ color: '#c9d1d9' }}>{wifi.ssid}</div>
          <div className="text-xs text-cryo-muted mt-1">Signal: {wifi.signal}%</div>
        </>
      ) : (
        <div className="text-xs text-cryo-muted">Not connected</div>
      )}
    </div>
  )
}

function VolumePopup({
  vol, onChange, onToggleMute,
}: {
  vol: VolumeInfo | null
  onChange: (v: number) => void
  onToggleMute: () => void
}) {
  return (
    <div>
      <div className="text-xs font-semibold mb-3" style={{ color: '#00d4ff' }}>Volume</div>
      {vol && (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-cryo-muted">{vol.muted ? 'Muted' : `${vol.level}%`}</span>
          </div>
          <input
            type="range" min={0} max={100} value={vol.level}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full mb-3"
            disabled={vol.muted}
          />
          <button
            onClick={onToggleMute}
            className="text-xs px-3 py-1.5 rounded-lg w-full transition-colors"
            style={{ background: 'rgba(26,40,64,0.5)', border: '1px solid rgba(26,40,64,0.6)', color: '#c9d1d9' }}
          >
            {vol.muted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        </>
      )}
    </div>
  )
}

function BatteryPopup({ battery }: { battery: BatteryInfo | null }) {
  if (!battery) return null
  return (
    <div>
      <div className="text-xs font-semibold mb-2" style={{ color: '#00d4ff' }}>Battery</div>
      <div className="text-2xl font-bold mb-1" style={{ color: battery.level > 20 ? '#00d4ff' : '#ef4444' }}>
        {battery.level}%
      </div>
      <div className="w-full h-2 rounded-full mb-2" style={{ background: 'rgba(26,40,64,0.8)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${battery.level}%`,
            background: battery.level > 20 ? '#00d4ff' : '#ef4444',
          }}
        />
      </div>
      <div className="text-xs text-cryo-muted">{battery.charging ? '⚡ Charging' : battery.status}</div>
    </div>
  )
}
