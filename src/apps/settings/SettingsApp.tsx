import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore, THEME_PRESETS } from '../../store/themeStore'
import { TutorialSlides } from '../../components/TutorialSlides'

type Tab =
  | 'appearance'
  | 'profile'
  | 'network'
  | 'bluetooth'
  | 'sound'
  | 'display'
  | 'security'
  | 'apikeys'
  | 'update'
  | 'about'
  | 'guide'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'profile',    label: 'Profile',    icon: '👤' },
  { id: 'network',    label: 'Network',    icon: '📶' },
  { id: 'bluetooth',  label: 'Bluetooth',  icon: '🔵' },
  { id: 'sound',      label: 'Sound',      icon: '🔊' },
  { id: 'display',    label: 'Display',    icon: '🖥' },
  { id: 'security',   label: 'Security',   icon: '🔒' },
  { id: 'apikeys',    label: 'API Keys',   icon: '🔑' },
  { id: 'update',     label: 'Update',     icon: '🔄' },
  { id: 'about',      label: 'About',      icon: 'ℹ️' },
  { id: 'guide',      label: 'Guide',      icon: '📖' },
]

export default function SettingsApp({ initialTab }: { initialTab?: string }) {
  const [tab, setTab] = useState<Tab>((initialTab as Tab) ?? 'appearance')

  useEffect(() => {
    const h = (e: Event) => setTab((e as CustomEvent).detail as Tab)
    window.addEventListener('cryogram:openSettingsTab', h)
    return () => window.removeEventListener('cryogram:openSettingsTab', h)
  }, [])

  return (
    <div className="flex flex-1 overflow-hidden text-cryo-text">
      {/* Sidebar */}
      <div
        className="shrink-0 flex flex-col py-3"
        style={{
          width: 180,
          borderRight: '1px solid rgba(26,40,64,0.6)',
          background: 'rgba(8,12,18,0.5)',
        }}
      >
        <div className="px-3 mb-2 text-cryo-muted text-xs uppercase tracking-widest">Settings</div>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-white/5 text-left"
            style={{
              color: tab === t.id ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.55)',
              background: tab === t.id ? 'var(--cryo-a08)' : 'transparent',
            }}
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
            {tab === 'appearance' && <AppearancePanel />}
            {tab === 'profile'    && <ProfilePanel />}
            {tab === 'network'    && <NetworkPanel />}
            {tab === 'bluetooth'  && <BluetoothPanel />}
            {tab === 'sound'      && <SoundPanel />}
            {tab === 'display'    && <DisplayPanel />}
            {tab === 'security'   && <SecurityPanel />}
            {tab === 'apikeys'    && <ApiKeysPanel />}
            {tab === 'update'     && <UpdatePanel />}
            {tab === 'about'      && <AboutPanel />}
            {tab === 'guide'      && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <TutorialSlides inline />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Appearance ────────────────────────────────────────────────────────────────

function AppearancePanel() {
  const { preset: activePreset, accent, setPreset, setCustomAccent } = useThemeStore()
  const [hexInput, setHexInput] = useState(accent)

  useEffect(() => setHexInput(accent), [accent])

  const handleHexCommit = (v: string) => {
    if (/^#[0-9a-fA-F]{6}$/.test(v)) setCustomAccent(v)
  }

  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-bold text-cryo-text mb-1">Appearance</h2>
        <p className="text-xs text-cryo-muted">Customize the look and feel of Cryogram OS.</p>
      </div>

      <section className="panel p-4 space-y-4">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Theme Preset</div>
        <div className="flex flex-wrap gap-2">
          {THEME_PRESETS.map(p => {
            const active = activePreset === p.id
            return (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px', borderRadius: 10, cursor: 'pointer',
                  border: active ? `1px solid ${p.accent}55` : '1px solid rgba(255,255,255,0.08)',
                  background: active ? `${p.accent}12` : 'rgba(255,255,255,0.04)',
                  transition: 'all 0.15s',
                  boxShadow: active ? `0 0 12px ${p.accent}20` : 'none',
                }}
              >
                <span
                  style={{
                    width: 10, height: 10, borderRadius: '50%', display: 'inline-block',
                    background: p.accent,
                    boxShadow: active ? `0 0 8px ${p.accent}` : 'none',
                  }}
                />
                <span style={{
                  fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.04em',
                  color: active ? p.accent : 'rgba(255,255,255,0.5)',
                  transition: 'color 0.15s',
                }}>
                  {p.name}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="panel p-4 space-y-4">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Custom Accent Color</div>
        <div className="flex items-center gap-3">
          <label
            style={{
              position: 'relative', width: 36, height: 36, borderRadius: 8,
              background: accent, cursor: 'pointer', overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.15)',
              boxShadow: `0 0 12px ${accent}40`,
              flexShrink: 0,
            }}
          >
            <input
              type="color"
              value={hexInput}
              onChange={e => { setHexInput(e.target.value); setCustomAccent(e.target.value) }}
              style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </label>
          <input
            type="text"
            className="w-28"
            value={hexInput}
            maxLength={7}
            placeholder="#00d4ff"
            onChange={e => setHexInput(e.target.value)}
            onBlur={e => handleHexCommit(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleHexCommit(hexInput) }}
            style={{ fontFamily: 'monospace', fontSize: 12, textTransform: 'uppercase' }}
          />
          <span className="text-xs text-cryo-muted">Overrides the preset accent</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {['#00d4ff','#a855f7','#10b981','#f97316','#ef4444','#f59e0b','#ec4899','#94a3b8'].map(c => (
            <button
              key={c}
              onClick={() => { setHexInput(c); setCustomAccent(c) }}
              title={c}
              style={{
                width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer',
                border: accent === c ? `2px solid white` : '2px solid transparent',
                boxShadow: accent === c ? `0 0 8px ${c}` : 'none',
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Profile ───────────────────────────────────────────────────────────────────

function ProfilePanel() {
  const [name, setName] = useState('Operator')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    window.cryogram.settings.getAll().then(all => {
      setName((all['profile.name'] as string) || 'Operator')
      setEmail((all['profile.email'] as string) || '')
    }).catch(() => {})
  }, [])

  const save = async () => {
    await window.cryogram.settings.set('profile.name', name)
    await window.cryogram.settings.set('profile.email', email)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const letter = name?.trim()?.[0]?.toUpperCase() || 'O'

  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-bold text-cryo-text mb-1">Profile</h2>
        <p className="text-xs text-cryo-muted">Your operator identity on this system.</p>
      </div>

      <section className="panel p-4 space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--cryo-a08)',
              border: '2px solid var(--cryo-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: 'var(--cryo-accent)',
              flexShrink: 0,
            }}
          >
            {letter}
          </div>
          <div>
            <div className="text-sm font-semibold text-cryo-text">{name || 'Operator'}</div>
            <div className="text-xs text-cryo-muted">{email || 'No email set'}</div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs text-cryo-muted mb-1">Display Name</label>
          <input
            className="w-full"
            placeholder="Operator"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs text-cryo-muted mb-1">Email</label>
          <input
            className="w-full"
            type="email"
            placeholder="operator@cryogram.local"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-fit" onClick={save}>
          {saved ? '✓ Saved' : 'Save Profile'}
        </button>
      </section>
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
            <p className="text-xs text-cryo-muted mt-0.5">
              Connected to <span style={{ color: 'var(--cryo-accent)' }}>{status.ssid}</span>
            </p>
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
            style={{
              background: 'rgba(13,20,33,0.5)',
              border: net.active ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(26,40,64,0.5)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono" style={{ color: net.active ? 'var(--cryo-accent)' : '#4e5d6e' }}>
                {signalBars(net.signal)}
              </span>
              <div>
                <div className="text-xs" style={{ color: net.active ? 'var(--cryo-accent)' : '#c9d1d9' }}>{net.ssid}</div>
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
              <p className="text-sm mb-1">Connect to <span style={{ color: 'var(--cryo-accent)' }}>{pwdFor}</span></p>
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
            style={{
              background: 'rgba(13,20,33,0.5)',
              border: dev.connected ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(26,40,64,0.5)',
            }}
          >
            <div>
              <div className="text-xs" style={{ color: dev.connected ? 'var(--cryo-accent)' : '#c9d1d9' }}>
                {dev.name || dev.address}
              </div>
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
            <span className="text-xs font-mono" style={{ color: vol.muted ? '#6b7280' : 'var(--cryo-accent)' }}>
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
          <span className="text-xs font-mono" style={{ color: 'var(--cryo-accent)' }}>
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

// ── Security ──────────────────────────────────────────────────────────────────

function SecurityPanel() {
  const [pinEnabled, setPinEnabled]   = useState(false)
  const [pinSet, setPinSet]           = useState(false)
  const [pinMode, setPinMode]         = useState<'none' | 'set' | 'change' | 'remove'>('none')
  const [newPin, setNewPin]           = useState('')
  const [confirmPin, setConfirmPin]   = useState('')
  const [currentPin, setCurrentPin]   = useState('')
  const [pinMsg, setPinMsg]           = useState<{ text: string; ok: boolean } | null>(null)
  const [autoLockMinutes, setAutoLockMinutes] = useState(0)

  useEffect(() => {
    window.cryogram.settings.getAll().then(all => {
      setPinEnabled(!!(all['pin.enabled'] as boolean))
      setPinSet(!!(all['pin.hash'] as string))
      const al = all['autolock.minutes']
      setAutoLockMinutes(typeof al === 'number' ? al : 0)
    })
  }, [])

  const handleAutoLockChange = async (minutes: number) => {
    setAutoLockMinutes(minutes)
    await window.cryogram.settings.set('autolock.minutes', minutes)
    window.dispatchEvent(new CustomEvent('cryogram:autolock-changed'))
  }

  const flash = (text: string, ok: boolean) => {
    setPinMsg({ text, ok })
    setTimeout(() => setPinMsg(null), 3000)
  }

  const resetPinForm = () => {
    setNewPin(''); setConfirmPin(''); setCurrentPin('')
    setPinMode('none')
  }

  const handleTogglePinEnabled = async (checked: boolean) => {
    if (checked && !pinSet) {
      setPinMode('set')
      return
    }
    await (window.cryogram as any).system.setPinEnabled(checked)
    await window.cryogram.settings.set('pin.enabled', checked)
    setPinEnabled(checked)
    flash(checked ? 'PIN lock enabled' : 'PIN lock disabled', true)
  }

  const handleSetPin = async () => {
    if (newPin.length < 4) { flash('PIN must be at least 4 digits', false); return }
    if (!/^[0-9]+$/.test(newPin)) { flash('PIN must contain only digits', false); return }
    if (newPin !== confirmPin) { flash('PINs do not match', false); return }

    const result: any = await (window.cryogram as any).system.setPin(
      newPin,
      pinSet ? currentPin : undefined
    )
    if (result?.success) {
      setPinSet(true)
      setPinEnabled(true)
      await window.cryogram.settings.set('pin.enabled', true)
      flash(pinSet ? 'PIN changed' : 'PIN set — lock screen enabled', true)
      resetPinForm()
    } else {
      flash(result?.error || 'Failed to set PIN', false)
    }
  }

  const handleRemovePin = async () => {
    const result: any = await (window.cryogram as any).system.removePin(currentPin)
    if (result?.success) {
      setPinSet(false)
      setPinEnabled(false)
      flash('PIN removed — lock screen disabled', true)
      resetPinForm()
    } else {
      flash(result?.error || 'Failed to remove PIN', false)
    }
  }

  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-bold text-cryo-text mb-1">Security &amp; Lock Screen</h2>
        <p className="text-xs text-cryo-muted">Configure PIN lock, auto-lock, and screen security.</p>
      </div>

      {/* Auto-lock */}
      <section className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Auto-Lock</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-cryo-text">Lock after inactivity</div>
            <div className="text-xs text-cryo-muted">Automatically locks the screen when idle</div>
          </div>
          <select
            value={autoLockMinutes}
            onChange={e => handleAutoLockChange(Number(e.target.value))}
            className="text-xs rounded-lg px-3 py-1.5"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="0">Never</option>
            <option value="1">1 minute</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="30">30 minutes</option>
          </select>
        </div>
        {autoLockMinutes > 0 && (
          <div className="text-xs" style={{ color: 'rgba(0,212,255,0.7)' }}>
            Screen will lock after {autoLockMinutes} {autoLockMinutes === 1 ? 'minute' : 'minutes'} of inactivity
          </div>
        )}
      </section>

      <section className="panel p-4 space-y-4">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">PIN Lock</div>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-cryo-text">PIN Lock</div>
            <div className="text-xs text-cryo-muted">
              {pinSet
                ? pinEnabled ? 'Locks on boot, resume & manual lock' : 'PIN is set but currently disabled'
                : 'Set a PIN to enable the lock screen'}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={pinEnabled}
              onChange={e => handleTogglePinEnabled(e.target.checked)}
            />
            <div
              className="w-11 h-6 rounded-full peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:transition-all"
              style={{
                background: pinEnabled ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.15)',
                transition: 'background 0.2s',
              }}
            >
              <div
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ transform: pinEnabled ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }}
              />
            </div>
          </label>
        </div>

        {/* PIN status + actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: pinSet ? '#00ff88' : 'rgba(255,255,255,0.2)' }} />
            <span
              className="text-xs"
              style={{ color: pinSet ? '#00ff88' : 'rgba(255,255,255,0.35)', fontFamily: '"JetBrains Mono", monospace' }}
            >
              {pinSet ? 'PIN is set' : 'No PIN set'}
            </span>
          </div>
          <div className="flex gap-2 ml-auto">
            {!pinSet ? (
              <button className="btn text-xs py-1 px-3" onClick={() => setPinMode('set')}>Set PIN</button>
            ) : (
              <>
                <button className="btn text-xs py-1 px-3" onClick={() => setPinMode('change')}>Change PIN</button>
                <button
                  className="btn text-xs py-1 px-3"
                  style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
                  onClick={() => setPinMode('remove')}
                >
                  Remove PIN
                </button>
              </>
            )}
          </div>
        </div>

        {/* PIN form */}
        {pinMode !== 'none' && (
          <div
            className="rounded-xl p-4 space-y-3"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {pinMode === 'set' ? 'Set New PIN' : pinMode === 'change' ? 'Change PIN' : 'Remove PIN'}
            </div>

            {(pinMode === 'change' || pinMode === 'remove') && (
              <div>
                <label className="block text-xs text-cryo-muted mb-1">Current PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  className="w-full"
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={e => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                />
              </div>
            )}

            {pinMode !== 'remove' && (
              <>
                <div>
                  <label className="block text-xs text-cryo-muted mb-1">
                    New PIN <span style={{ color: 'rgba(255,255,255,0.3)' }}>(4–8 digits)</span>
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    className="w-full"
                    placeholder="4–8 digit PIN"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-cryo-muted mb-1">Confirm New PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    className="w-full"
                    placeholder="Repeat PIN"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-1">
              {pinMode === 'remove' ? (
                <button
                  className="btn text-xs py-1 px-3"
                  style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
                  onClick={handleRemovePin}
                >
                  Confirm Remove
                </button>
              ) : (
                <button className="btn btn-primary text-xs py-1 px-3" onClick={handleSetPin}>
                  {pinMode === 'set' ? 'Set PIN' : 'Change PIN'}
                </button>
              )}
              <button className="btn text-xs py-1 px-3" onClick={resetPinForm}>Cancel</button>
            </div>
          </div>
        )}

        {/* Feedback message */}
        {pinMsg && (
          <div
            className="text-xs py-1.5 px-3 rounded-lg"
            style={{
              background: pinMsg.ok ? 'rgba(0,255,136,0.08)' : 'rgba(248,113,113,0.1)',
              border: `1px solid ${pinMsg.ok ? 'rgba(0,255,136,0.2)' : 'rgba(248,113,113,0.2)'}`,
              color: pinMsg.ok ? '#00ff88' : '#f87171',
              fontFamily: '-apple-system, sans-serif',
            }}
          >
            {pinMsg.text}
          </div>
        )}
      </section>
    </div>
  )
}

// ── API Keys ──────────────────────────────────────────────────────────────────

interface ApiKeyValues {
  hibpApiKey: string
  dehashedEmail: string
  dehashedApiKey: string
  workspace: string
}

function ApiKeysPanel() {
  const [vals, setVals] = useState<ApiKeyValues>({
    hibpApiKey: '',
    dehashedEmail: '',
    dehashedApiKey: '',
    workspace: '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    window.cryogram.settings.getAll().then(all => {
      setVals({
        hibpApiKey:     (all.hibpApiKey     as string) || '',
        dehashedEmail:  (all.dehashedEmail  as string) || '',
        dehashedApiKey: (all.dehashedApiKey as string) || '',
        workspace:      (all.workspace      as string) || '',
      })
    })
  }, [])

  const save = async () => {
    for (const [key, value] of Object.entries(vals)) {
      await window.cryogram.settings.set(key, value)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const openWorkspace = async () => {
    const path = await window.cryogram.fs.openDialog()
    if (path) setVals(v => ({ ...v, workspace: path }))
  }

  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-bold text-cryo-text mb-1">API Keys</h2>
        <p className="text-xs text-cryo-muted">API keys are stored encrypted on your local machine.</p>
      </div>

      {/* Have I Been Pwned */}
      <section className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Have I Been Pwned (Leaker)</div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1">API Key</label>
          <input
            type="password"
            className="w-full"
            placeholder="hibp-api-key"
            value={vals.hibpApiKey}
            onChange={e => setVals(v => ({ ...v, hibpApiKey: e.target.value }))}
          />
          <p className="text-xs text-cryo-muted mt-1">Required for email breach lookups</p>
        </div>
      </section>

      {/* Dehashed */}
      <section className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Dehashed (Leaker)</div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1">Account Email</label>
          <input
            className="w-full"
            placeholder="your@email.com"
            value={vals.dehashedEmail}
            onChange={e => setVals(v => ({ ...v, dehashedEmail: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1">API Key</label>
          <input
            type="password"
            className="w-full"
            placeholder="dehashed-api-key"
            value={vals.dehashedApiKey}
            onChange={e => setVals(v => ({ ...v, dehashedApiKey: e.target.value }))}
          />
        </div>
      </section>

      {/* Code Editor Workspace */}
      <section className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Code Editor Workspace</div>
        <div className="flex gap-2">
          <input
            className="flex-1 text-cryo-muted"
            readOnly
            value={vals.workspace || 'Not set — defaults to ~/Documents/Cryogram/workspace'}
          />
          <button className="btn" onClick={openWorkspace}>Browse</button>
        </div>
      </section>

      <button className="btn btn-primary w-fit" onClick={save}>
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </div>
  )
}

// ── Update ────────────────────────────────────────────────────────────────────

function UpdatePanel() {
  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-bold text-cryo-text mb-1">System Update</h2>
        <p className="text-xs text-cryo-muted">Check for and apply Cryogram OS updates.</p>
      </div>
      <UpdateSection />
    </div>
  )
}

function UpdateSection() {
  const [checking, setChecking]   = useState(false)
  const [status, setStatus]       = useState<'idle' | 'uptodate' | 'available' | 'error'>('idle')
  const [errorCode, setErrorCode] = useState('')
  const [commitCount, setCount]   = useState(0)
  const [changes, setChanges]     = useState<string[]>([])
  const [errorMsg, setErrorMsg]   = useState('')

  const check = async () => {
    setChecking(true)
    setStatus('idle')
    setErrorMsg('')
    setErrorCode('')
    try {
      const result = await (window as any).__cryogram_checkUpdate?.()
      if (result?.hasUpdate) {
        setStatus('available')
        setCount(result.commitCount ?? 1)
        setChanges(result.changes ?? [])
      } else if (result?.error) {
        setStatus('error')
        setErrorCode(result.error)
        setErrorMsg(result.message ?? result.error)
      } else {
        setStatus('uptodate')
      }
    } catch (e: any) {
      setStatus('error')
      setErrorMsg(String(e?.message ?? e))
    }
    setChecking(false)
  }

  const startUpdate = () => {
    ;(window as any).__cryogram_startUpdate?.()
  }

  const isSSLError = errorCode === 'ssl-error'

  return (
    <section className="panel p-4 space-y-3">
      <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">System Update</div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          className="btn"
          onClick={check}
          disabled={checking}
          style={{ opacity: checking ? 0.6 : 1 }}
        >
          {checking ? 'Checking…' : 'Check for Updates'}
        </button>

        {status === 'uptodate' && (
          <span style={{ fontSize: 12, color: '#4ade80' }}>✓ Cryogram OS is up to date</span>
        )}
        {status === 'error' && !isSSLError && (
          <div style={{ fontSize: 11, color: '#f87171', maxWidth: 360, lineHeight: 1.5 }}>
            {errorMsg || 'Could not reach update server'}
          </div>
        )}
      </div>

      {/* SSL error — update script installs certs, so offer to run it directly */}
      {status === 'error' && isSSLError && (
        <div style={{
          background: 'rgba(251,146,60,0.08)',
          border: '1px solid rgba(251,146,60,0.25)',
          borderRadius: 10,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{ fontSize: 12, color: '#fb923c', fontWeight: 600 }}>
            ⚠ SSL certificates not installed
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            The update check requires SSL certificates which are missing on this system.
            Click <strong style={{ color: '#fb923c' }}>Update Now</strong> — the update script
            installs them automatically before downloading updates.
          </div>
          <button
            className="btn"
            onClick={startUpdate}
            style={{ alignSelf: 'flex-start', background: 'rgba(251,146,60,0.15)', borderColor: 'rgba(251,146,60,0.4)', color: '#fb923c' }}
          >
            Update Now (auto-fixes SSL)
          </button>
        </div>
      )}

      {status === 'available' && (
        <div style={{
          background: 'rgba(0,212,255,0.06)',
          border: '1px solid rgba(0,212,255,0.18)',
          borderRadius: 10,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
            {commitCount} update{commitCount !== 1 ? 's' : ''} available
          </div>
          {changes.length > 0 && (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {changes.map((c, i) => (
                <li key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--cryo-accent)', opacity: 0.7 }}>›</span>
                  {c}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={startUpdate}
            style={{
              alignSelf: 'flex-start',
              padding: '6px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: 'linear-gradient(135deg, var(--cryo-accent) 0%, #00ff88 100%)',
              border: 'none', color: '#000', cursor: 'pointer',
              boxShadow: '0 0 12px rgba(0,212,255,0.3)',
            }}
          >
            Update &amp; Reboot
          </button>
        </div>
      )}
    </section>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────

function AboutPanel() {
  const [info, setInfo] = useState<SystemInfo | null>(null)

  useEffect(() => {
    window.cryogram.system.getInfo().then(setInfo).catch(() => {})
  }, [])

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div
      className="flex items-start justify-between py-2.5"
      style={{ borderBottom: '1px solid rgba(26,40,64,0.4)' }}
    >
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
          <div className="text-lg font-bold" style={{ color: 'var(--cryo-accent)' }}>Cryogram</div>
          <div className="text-xs text-cryo-muted">Security Operations Platform</div>
        </div>
      </div>
      {info && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(13,20,33,0.5)', border: '1px solid rgba(26,40,64,0.5)' }}
        >
          <div className="px-4">
            <Row label="Hostname" value={info.hostname} />
            <Row label="OS"       value={info.os} />
            <Row label="Kernel"   value={info.kernel} />
            <Row label="CPU"      value={info.cpu} />
            <Row label="RAM"      value={`${Math.round(info.ramUsed / 1024 / 1024)} MB / ${Math.round(info.ramTotal / 1024 / 1024)} MB`} />
            <Row label="Uptime"   value={info.uptime} />
          </div>
        </div>
      )}
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
        color: primary ? 'var(--cryo-accent)' : '#c9d1d9',
      }}
    >
      {children}
    </button>
  )
}
