import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'network' | 'bluetooth' | 'sound' | 'display' | 'about'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'network',   label: 'Network',   icon: '📶' },
  { id: 'bluetooth', label: 'Bluetooth', icon: '🔵' },
  { id: 'sound',     label: 'Sound',     icon: '🔊' },
  { id: 'display',   label: 'Display',   icon: '🖥' },
  { id: 'about',     label: 'About',     icon: 'ℹ️' },
]

export default function SystemApp() {
  const [tab, setTab] = useState<Tab>('network')

  return (
    <div className="flex flex-1 overflow-hidden text-cryo-text">
      {/* Sidebar */}
      <div
        className="w-44 shrink-0 flex flex-col py-3"
        style={{ borderRight: '1px solid rgba(26,40,64,0.6)', background: 'rgba(8,12,18,0.5)' }}
      >
        <div className="px-3 mb-2 text-cryo-muted text-xs uppercase tracking-widest">Settings</div>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-white/5 text-left"
            style={{ color: tab === t.id ? '#00d4ff' : '#c9d1d9' }}
          >
            <span className="w-5 text-center text-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {tab === 'network'   && <NetworkPanel />}
            {tab === 'bluetooth' && <BluetoothPanel />}
            {tab === 'sound'     && <SoundPanel />}
            {tab === 'display'   && <DisplayPanel />}
            {tab === 'about'     && <AboutPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Network ───────────────────────────────────────────────────────────────────

function NetworkPanel() {
  const [networks, setNetworks] = useState<WifiNetwork[]>([])
  const [status, setStatus] = useState<WifiStatus | null>(null)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [pwdFor, setPwdFor] = useState<string | null>(null)
  const [pwd, setPwd] = useState('')
  const [scanning, setScanning] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [nets, s] = await Promise.all([
      window.cryogram.system.getNetworks(),
      window.cryogram.system.getWifiStatus(),
    ])
    setNetworks(nets)
    setStatus(s)
  }, [])

  useEffect(() => { load() }, [load])

  const connect = async (ssid: string, password?: string) => {
    setConnecting(ssid)
    setConnectError(null)
    const result = await (window.cryogram.system as any).connectNetwork(ssid, password)
    if (result?.success === false) {
      setConnectError(result.message || 'Connection failed')
      setConnecting(null)
      // Keep the password dialog open so user can retry with correct password
      return
    }
    setPwdFor(null)
    setPwd('')
    await load()
    setConnecting(null)
  }

  const disconnect = async () => {
    await window.cryogram.system.disconnectNetwork()
    await load()
  }

  const rescan = async () => {
    setScanning(true)
    await window.cryogram.system.rescanNetworks()
    await load()
    setScanning(false)
  }

  const signalBars = (sig: number) => {
    const pct = Math.max(0, Math.min(100, sig))
    if (pct > 75) return '████'
    if (pct > 50) return '███░'
    if (pct > 25) return '██░░'
    return '█░░░'
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold">Wi-Fi</h2>
          {status?.connected && (
            <p className="text-xs text-cryo-muted mt-0.5">Connected to <span style={{ color: '#00d4ff' }}>{status.ssid}</span></p>
          )}
        </div>
        <div className="flex gap-2">
          {status?.connected && (
            <SettingBtn onClick={disconnect}>Disconnect</SettingBtn>
          )}
          <SettingBtn onClick={rescan} disabled={scanning}>
            {scanning ? 'Scanning…' : 'Scan'}
          </SettingBtn>
        </div>
      </div>

      <div className="space-y-1.5">
        {networks.map(net => (
          <div
            key={net.ssid}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors"
            style={{ background: 'rgba(13,20,33,0.5)', border: net.active ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(26,40,64,0.5)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono" style={{ color: net.active ? '#00d4ff' : '#4e5d6e' }}>
                {signalBars(net.signal)}
              </span>
              <div>
                <div className="text-xs" style={{ color: net.active ? '#00d4ff' : '#c9d1d9' }}>{net.ssid}</div>
                <div className="text-xs text-cryo-muted">{net.security || 'Open'}</div>
              </div>
            </div>
            {!net.active && (
              <SettingBtn
                onClick={() => net.security ? setPwdFor(net.ssid) : connect(net.ssid)}
                disabled={connecting === net.ssid}
              >
                {connecting === net.ssid ? 'Connecting…' : 'Connect'}
              </SettingBtn>
            )}
          </div>
        ))}
        {networks.length === 0 && (
          <p className="text-xs text-cryo-muted text-center py-8">No networks found — click Scan</p>
        )}
      </div>

      <AnimatePresence>
        {pwdFor && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <div
              className="w-72 rounded-xl p-5"
              style={{ background: 'rgba(13,20,33,0.98)', border: '1px solid rgba(26,40,64,0.9)' }}
            >
              <p className="text-sm mb-1">Connect to <span style={{ color: '#00d4ff' }}>{pwdFor}</span></p>
              <p className="text-xs text-cryo-muted mb-3">Enter Wi-Fi password</p>
              <input
                autoFocus
                type="password"
                value={pwd}
                onChange={e => { setPwd(e.target.value); setConnectError(null) }}
                onKeyDown={e => {
                  if (e.key === 'Enter') connect(pwdFor, pwd)
                  if (e.key === 'Escape') { setPwdFor(null); setPwd(''); setConnectError(null) }
                }}
                className="w-full text-xs py-2 px-3 rounded-lg mb-2"
                style={{
                  background: 'rgba(8,12,18,0.6)',
                  border: connectError ? '1px solid rgba(255,68,102,0.6)' : '1px solid rgba(26,40,64,0.6)',
                  color: '#c9d1d9',
                }}
                placeholder="Password"
              />
              {connectError && (
                <p className="text-xs mb-3" style={{ color: '#ff4466' }}>⚠ {connectError}</p>
              )}
              <div className="flex gap-2 justify-end">
                <SettingBtn onClick={() => { setPwdFor(null); setPwd(''); setConnectError(null) }}>Cancel</SettingBtn>
                <SettingBtn primary onClick={() => connect(pwdFor, pwd)} disabled={connecting === pwdFor}>
                  {connecting === pwdFor ? 'Connecting…' : 'Connect'}
                </SettingBtn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Bluetooth ─────────────────────────────────────────────────────────────────

function BluetoothPanel() {
  const [devices, setDevices] = useState<BtDevice[]>([])
  const [scanning, setScanning] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  const load = async () => {
    const devs = await window.cryogram.system.getBluetoothDevices()
    setDevices(devs)
  }

  useEffect(() => { load() }, [])

  const scan = async () => {
    setScanning(true)
    await window.cryogram.system.bluetoothScan()
    await load()
    setScanning(false)
  }

  const toggle = async (dev: BtDevice) => {
    setBusy(dev.address)
    if (dev.connected) await window.cryogram.system.bluetoothDisconnect(dev.address)
    else await window.cryogram.system.bluetoothConnect(dev.address)
    await load()
    setBusy(null)
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Bluetooth</h2>
        <SettingBtn onClick={scan} disabled={scanning}>
          {scanning ? 'Scanning…' : 'Scan for Devices'}
        </SettingBtn>
      </div>
      <div className="space-y-1.5">
        {devices.map(dev => (
          <div
            key={dev.address}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg"
            style={{ background: 'rgba(13,20,33,0.5)', border: dev.connected ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(26,40,64,0.5)' }}
          >
            <div>
              <div className="text-xs" style={{ color: dev.connected ? '#00d4ff' : '#c9d1d9' }}>{dev.name || dev.address}</div>
              <div className="text-xs text-cryo-muted">{dev.address}</div>
            </div>
            <SettingBtn onClick={() => toggle(dev)} disabled={busy === dev.address} primary={dev.connected}>
              {busy === dev.address ? '…' : dev.connected ? 'Disconnect' : 'Connect'}
            </SettingBtn>
          </div>
        ))}
        {devices.length === 0 && (
          <p className="text-xs text-cryo-muted text-center py-8">No paired devices — click Scan</p>
        )}
      </div>
    </div>
  )
}

// ── Sound ─────────────────────────────────────────────────────────────────────

function SoundPanel() {
  const [vol, setVol] = useState<VolumeInfo | null>(null)

  const load = async () => {
    const v = await window.cryogram.system.getVolume()
    setVol(v)
  }

  useEffect(() => { load() }, [])

  const setVolume = async (level: number) => {
    setVol((v: VolumeInfo | null) => v ? { ...v, level } : v)
    await window.cryogram.system.setVolume(level)
  }

  const toggleMute = async () => {
    await window.cryogram.system.toggleMute()
    load()
  }

  return (
    <div className="p-5">
      <h2 className="text-sm font-semibold mb-4">Sound</h2>
      {vol && (
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(13,20,33,0.5)', border: '1px solid rgba(26,40,64,0.5)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-cryo-muted">Output Volume</span>
            <span className="text-xs font-mono" style={{ color: vol.muted ? '#6b7280' : '#00d4ff' }}>
              {vol.muted ? 'Muted' : `${vol.level}%`}
            </span>
          </div>
          <input
            type="range" min={0} max={100} value={vol.level}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-full mb-3"
            disabled={vol.muted}
          />
          <SettingBtn onClick={toggleMute} primary={vol.muted}>
            {vol.muted ? '🔇 Unmute' : '🔊 Mute'}
          </SettingBtn>
        </div>
      )}
    </div>
  )
}

// ── Display ───────────────────────────────────────────────────────────────────

function DisplayPanel() {
  const [brightness, setBrightnessState] = useState<number | null>(null)

  const load = async () => {
    const b = await window.cryogram.system.getBrightness()
    setBrightnessState(b)
  }

  useEffect(() => { load() }, [])

  const setBrightness = async (pct: number) => {
    setBrightnessState(pct)
    await window.cryogram.system.setBrightness(pct)
  }

  return (
    <div className="p-5">
      <h2 className="text-sm font-semibold mb-4">Display</h2>
      <div
        className="p-4 rounded-xl"
        style={{ background: 'rgba(13,20,33,0.5)', border: '1px solid rgba(26,40,64,0.5)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-cryo-muted">Brightness</span>
          <span className="text-xs font-mono" style={{ color: '#00d4ff' }}>
            {brightness !== null ? `${brightness}%` : '—'}
          </span>
        </div>
        {brightness !== null && (
          <input
            type="range" min={5} max={100} value={brightness}
            onChange={e => setBrightness(Number(e.target.value))}
            className="w-full"
          />
        )}
      </div>
    </div>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────

function AboutPanel() {
  const [info, setInfo] = useState<SystemInfo | null>(null)

  useEffect(() => {
    window.cryogram.system.getInfo().then(setInfo).catch(() => {})
  }, [])

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between py-2.5" style={{ borderBottom: '1px solid rgba(26,40,64,0.4)' }}>
      <span className="text-xs text-cryo-muted">{label}</span>
      <span className="text-xs text-right ml-4" style={{ color: '#c9d1d9', maxWidth: '60%' }}>{value}</span>
    </div>
  )

  return (
    <div className="p-5">
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          🛡
        </div>
        <div>
          <div className="text-lg font-bold" style={{ color: '#00d4ff' }}>Cryogram</div>
          <div className="text-xs text-cryo-muted">Security Operations Platform</div>
        </div>
      </div>
      {info && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(13,20,33,0.5)', border: '1px solid rgba(26,40,64,0.5)' }}
        >
          <div className="px-4">
            <Row label="Hostname"  value={info.hostname} />
            <Row label="OS"        value={info.os} />
            <Row label="Kernel"    value={info.kernel} />
            <Row label="CPU"       value={info.cpu} />
            <Row label="RAM"       value={`${Math.round(info.ramUsed / 1024 / 1024)} MB / ${Math.round(info.ramTotal / 1024 / 1024)} MB`} />
            <Row label="Uptime"    value={info.uptime} />
          </div>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <SettingBtn onClick={() => window.cryogram.system.lock()}>Lock Screen</SettingBtn>
        <SettingBtn onClick={() => window.cryogram.system.reboot()}>Reboot</SettingBtn>
        <SettingBtn onClick={() => window.cryogram.system.shutdown()} primary>Shut Down</SettingBtn>
      </div>
    </div>
  )
}

// ── Shared ────────────────────────────────────────────────────────────────────

function SettingBtn({
  children, onClick, disabled, primary,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  primary?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
      style={{
        background: primary ? 'rgba(0,212,255,0.15)' : 'rgba(26,40,64,0.5)',
        border: primary ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(26,40,64,0.6)',
        color: primary ? '#00d4ff' : '#c9d1d9',
      }}
    >
      {children}
    </button>
  )
}
