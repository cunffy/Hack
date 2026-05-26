import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Device {
  serial: string
  model: string
  transport: 'usb' | 'wifi'
}

interface DeviceInfo {
  model: string
  brand: string
  androidVersion: string
  sdk: string
  cpu: string
  screenSize: string
}

interface Battery {
  level: number
  charging: boolean
  plugged: boolean
  temperature: number
  voltage: number
}

interface Storage {
  total: number
  used: number
  free: number
}

const phone = () => (window as any).cryogram?.phone

function fmt(bytes: number) {
  const gb = bytes / 1073741824
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1048576).toFixed(0)} MB`
}

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        style={{ height: '100%', borderRadius: 3, background: color, boxShadow: `0 0 8px ${color}80` }}
      />
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px', ...style }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</p>
}

function ActionBtn({ label, icon, color, onClick, disabled, loading }: {
  label: string; icon: React.ReactNode; color: string
  onClick: () => void; disabled?: boolean; loading?: boolean
}) {
  return (
    <button
      onClick={onClick} disabled={disabled || loading}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 16px', borderRadius: 12,
        background: `${color}12`, border: `1px solid ${color}30`, color,
        cursor: disabled || loading ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s', minWidth: 90 }}
      onMouseEnter={e => { if (!disabled && !loading) (e.currentTarget as HTMLElement).style.background = `${color}22` }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}12` }}
    >
      {loading
        ? <motion.div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${color}30`, borderTopColor: color }}
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        : icon}
      <span style={{ fontSize: 10, fontFamily: '-apple-system, sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  )
}

export default function PhoneApp() {
  const [devices, setDevices]     = useState<Device[]>([])
  const [selected, setSelected]   = useState<string | null>(null)
  const [info, setInfo]           = useState<DeviceInfo | null>(null)
  const [battery, setBattery]     = useState<Battery | null>(null)
  const [storage, setStorage]     = useState<Storage | null>(null)
  const [mirroring, setMirroring] = useState(false)
  const [scrcpyOk, setScrcpyOk]   = useState<boolean | null>(null)
  const [loading, setLoading]     = useState<string | null>(null)
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null)
  const [wifiStep, setWifiStep]   = useState<'idle' | 'enabling' | 'connecting' | 'done'>('idle')
  const [wifiIp, setWifiIp]       = useState('')
  const [wifiInputIp, setWifiInputIp] = useState('')
  const [noAdb, setNoAdb]         = useState<boolean | null>(null)

  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3200)
  }, [])

  const loadDevices = useCallback(async () => {
    try {
      const devs: Device[] = await phone().getDevices()
      setDevices(devs)
      setNoAdb(false)
      if (devs.length > 0 && !selected) setSelected(devs[0].serial)
    } catch (err: any) {
      const msg = String(err)
      if (msg.includes('not found') || msg.includes('ENOENT') || msg.includes('adb')) setNoAdb(true)
    }
  }, [selected])

  useEffect(() => {
    loadDevices()
    const t = setInterval(loadDevices, 4000)
    return () => clearInterval(t)
  }, [loadDevices])

  useEffect(() => {
    if (!selected) { setInfo(null); setBattery(null); setStorage(null); return }
    const load = async () => {
      try { setInfo(await phone().getInfo(selected)) } catch {}
      try { setBattery(await phone().getBattery(selected)) } catch {}
      try { setStorage(await phone().getStorage(selected)) } catch {}
      try {
        const scrcpy = await phone().checkScrcpy()
        setScrcpyOk(scrcpy?.installed ?? false)
      } catch { setScrcpyOk(false) }
      try { setMirroring(await phone().isMirroring()) } catch {}
    }
    load()
    const t = setInterval(load, 8000)
    return () => clearInterval(t)
  }, [selected])

  const handleMirror = async () => {
    if (!selected) return
    if (mirroring) {
      await phone().stopMirror()
      setMirroring(false)
      showToast('Screen mirror stopped')
      return
    }
    if (!scrcpyOk) {
      setLoading('scrcpy')
      try {
        await phone().installScrcpy()
        setScrcpyOk(true)
        showToast('scrcpy installed')
      } catch {
        showToast('Could not install scrcpy', false)
      }
      setLoading(null)
      return
    }
    setLoading('mirror')
    try {
      const res = await phone().startMirror(selected)
      if (res?.ok === false) throw new Error(res.error || 'Failed')
      setMirroring(true)
      showToast('Mirror started — scrcpy window opened')
    } catch (e: any) {
      showToast(e?.message || 'Failed to start mirror', false)
    }
    setLoading(null)
  }

  const handleScreenshot = async () => {
    if (!selected) return
    setLoading('screenshot')
    try {
      const res = await phone().screenshot(selected)
      if (res?.ok) showToast(`Screenshot saved: ${res.path}`)
      else showToast('Screenshot failed', false)
    } catch {
      showToast('Screenshot failed', false)
    }
    setLoading(null)
  }

  const handleEnableWireless = async () => {
    if (!selected) return
    setWifiStep('enabling')
    try {
      const res = await phone().enableWireless(selected)
      if (res?.ok === false) throw new Error(res.error)
      const ip: string | null = await phone().getDeviceIp(selected)
      if (ip) {
        setWifiIp(ip)
        setWifiInputIp(ip)
      }
      setWifiStep('connecting')
    } catch (e: any) {
      showToast(e?.message || 'Could not enable wireless ADB', false)
      setWifiStep('idle')
    }
  }

  const handleConnectWifi = async () => {
    setWifiStep('connecting')
    try {
      const res = await phone().connectWifi(wifiInputIp)
      if (res?.ok) {
        showToast(res.message || 'Connected wirelessly!')
        setWifiStep('done')
        setTimeout(() => setWifiStep('idle'), 2000)
        loadDevices()
      } else {
        showToast(res?.message || 'Connection failed', false)
        setWifiStep('connecting')
      }
    } catch (e: any) {
      showToast(e?.message || 'Connection failed', false)
      setWifiStep('idle')
    }
  }

  const selectedDevice = devices.find(d => d.serial === selected)
  const storageUsedPct = storage && storage.total > 0 ? (storage.used / storage.total) * 100 : 0

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto"
      style={{ background: 'rgba(8,12,18,0.98)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
              background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${toast.ok ? '#10b98140' : '#ef444440'}`, borderRadius: 10,
              padding: '7px 16px', zIndex: 200, fontSize: 12,
              color: toast.ok ? '#10b981' : '#ef4444', backdropFilter: 'blur(20px)', whiteSpace: 'nowrap' }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Phone Companion</h2>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Android ADB bridge</p>
          </div>
          <button onClick={loadDevices}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              padding: '5px 12px', color: 'rgba(255,255,255,0.6)', fontSize: 11, cursor: 'pointer' }}>
            Refresh
          </button>
        </div>

        {/* Checking state */}
        {noAdb === null && devices.length === 0 && (
          <Card>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '12px 0' }}>
              Checking for connected devices…
            </p>
          </Card>
        )}

        {/* No ADB warning */}
        {noAdb === true && (
          <Card style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.05)' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#fbbf24' }}>ADB not found. Install Android Debug Bridge:</p>
            <code style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: 6 }}>
              sudo apt install adb
            </code>
          </Card>
        )}

        {/* No devices */}
        {noAdb === false && devices.length === 0 && (
          <>
            <Card>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '12px 0' }}>
                No devices detected. Connect via USB or use wireless ADB.
              </p>
            </Card>
            <Card style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <SectionLabel>Setup Guide</SectionLabel>
              <ol style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.9 }}>
                <li>Go to <em>Settings → About phone</em>, tap <em>Build number</em> 7 times.</li>
                <li>Open <em>Developer Options</em> → enable <em>USB Debugging</em>.</li>
                <li>Plug in via USB and accept the authorization prompt on the phone.</li>
                <li>Click <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Refresh</strong> above.</li>
              </ol>
            </Card>
          </>
        )}

        {/* Device picker (multiple devices) */}
        {devices.length > 1 && (
          <Card>
            <SectionLabel>Devices</SectionLabel>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {devices.map(d => (
                <button key={d.serial} onClick={() => setSelected(d.serial)}
                  style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                    background: selected === d.serial ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${selected === d.serial ? '#a855f750' : 'rgba(255,255,255,0.1)'}`,
                    color: selected === d.serial ? '#a855f7' : 'rgba(255,255,255,0.6)' }}>
                  {d.model ?? d.serial} <span style={{ opacity: 0.5 }}>({d.transport})</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {selected && info && (
          <>
            {/* Device info */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                    {info.brand} {info.model}
                    {info.screenSize ? <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 400, marginLeft: 8 }}>{info.screenSize}</span> : null}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                    Android {info.androidVersion} · SDK {info.sdk} · {info.cpu}
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    {selectedDevice?.transport === 'wifi' ? '📶 Wi-Fi' : '🔌 USB'}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{selected}</p>
                </div>
              </div>
            </Card>

            {/* Battery & Storage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {battery && (
                <Card>
                  <SectionLabel>Battery</SectionLabel>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: battery.level > 20 ? '#10b981' : '#ef4444' }}>{battery.level}</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>%</span>
                    {battery.charging && <span style={{ fontSize: 10, color: '#fbbf24', marginLeft: 4 }}>⚡ Charging</span>}
                  </div>
                  <StatBar value={battery.level} color={battery.level > 20 ? '#10b981' : '#ef4444'} />
                  <p style={{ margin: '8px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                    {battery.temperature.toFixed(1)}°C · {battery.voltage.toFixed(2)} V
                  </p>
                </Card>
              )}
              {storage && storage.total > 0 && (
                <Card>
                  <SectionLabel>Storage</SectionLabel>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{fmt(storage.used)}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>/ {fmt(storage.total)}</span>
                  </div>
                  <StatBar value={storageUsedPct} color={storageUsedPct > 80 ? '#f59e0b' : '#60a5fa'} />
                  <p style={{ margin: '8px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{fmt(storage.free)} free</p>
                </Card>
              )}
            </div>

            {/* Actions */}
            <Card>
              <SectionLabel>Actions</SectionLabel>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ActionBtn
                  label={mirroring ? 'Stop Mirror' : scrcpyOk === false ? 'Install scrcpy' : 'Mirror Screen'}
                  color="#a855f7"
                  loading={loading === 'mirror' || loading === 'scrcpy'}
                  onClick={handleMirror}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {mirroring
                        ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                        : <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>}
                    </svg>
                  }
                />
                <ActionBtn
                  label="Screenshot"
                  color="#60a5fa"
                  loading={loading === 'screenshot'}
                  onClick={handleScreenshot}
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>}
                />
              </div>
              {scrcpyOk === false && (
                <p style={{ margin: '10px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  scrcpy not found — clicking "Install scrcpy" will run <code>apt-get install scrcpy</code>.
                </p>
              )}
            </Card>

            {/* Wireless ADB */}
            <Card>
              <SectionLabel>Wireless ADB</SectionLabel>
              {wifiStep === 'idle' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                    Connect wirelessly — no USB cable needed after setup.
                  </p>
                  <button onClick={handleEnableWireless}
                    style={{ alignSelf: 'flex-start', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                      background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.35)', color: '#a855f7', cursor: 'pointer' }}>
                    Enable Wireless ADB
                  </button>
                </div>
              )}
              {wifiStep === 'enabling' && (
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Switching to TCP/IP mode on port 5555…</p>
              )}
              {wifiStep === 'connecting' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                    {wifiIp ? <>Device IP: <code style={{ color: '#a855f7' }}>{wifiIp}</code> — you can now unplug USB.</> : 'Enter your device\'s IP address:'}
                  </p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input value={wifiInputIp} onChange={e => setWifiInputIp(e.target.value)}
                      placeholder="192.168.x.x"
                      onKeyDown={e => e.key === 'Enter' && handleConnectWifi()}
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 7, padding: '5px 10px', fontSize: 11, color: 'rgba(255,255,255,0.8)',
                        outline: 'none', width: 140 }} />
                    <button onClick={handleConnectWifi}
                      style={{ padding: '5px 14px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                        background: '#a855f7', color: '#fff', border: 'none', cursor: 'pointer' }}>
                      Connect
                    </button>
                    <button onClick={() => setWifiStep('idle')}
                      style={{ padding: '5px 10px', borderRadius: 7, fontSize: 11,
                        background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {wifiStep === 'done' && (
                <p style={{ margin: 0, fontSize: 11, color: '#10b981' }}>✓ Connected wirelessly!</p>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
