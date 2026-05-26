import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────────

type VpnType = 'openvpn' | 'wireguard'

interface VpnProfile {
  id: string
  name: string
  type: VpnType
  configPath: string
  createdAt: number
}

interface VpnStatus {
  connected: boolean
  interface?: string
  ip?: string
  connectedSince?: number
}

interface LogEntry {
  ts: number
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m ${sec}s`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

function genId(): string {
  return `vpn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function nowLog(level: LogEntry['level'], message: string): LogEntry {
  return { ts: Date.now(), level, message }
}

const TYPE_LABELS: Record<VpnType, string> = {
  openvpn: 'OpenVPN',
  wireguard: 'WireGuard',
}

// ── Status indicator ──────────────────────────────────────────────────────────

function StatusDot({ connected }: { connected: boolean }) {
  return (
    <motion.div
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: connected ? 'rgba(0,255,136,0.9)' : 'rgba(255,68,102,0.8)',
        boxShadow: connected ? '0 0 8px rgba(0,255,136,0.6)' : '0 0 8px rgba(255,68,102,0.5)',
        flexShrink: 0,
      }}
      animate={connected ? {
        opacity: [1, 0.5, 1],
        scale: [1, 1.2, 1],
      } : { opacity: 1, scale: 1 }}
      transition={connected ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
    />
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function VPNApp() {
  const [status, setStatus]             = useState<VpnStatus>({ connected: false })
  const [profiles, setProfiles]         = useState<VpnProfile[]>([])
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)
  const [showAddForm, setShowAddForm]   = useState(false)
  const [logs, setLogs]                 = useState<LogEntry[]>([])
  const [tick, setTick]                 = useState(0)

  const logRef   = useRef<HTMLDivElement>(null)
  const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs(prev => [...prev.slice(-199), nowLog(level, message)])
  }, [])

  // Load persisted profiles
  useEffect(() => {
    window.cryogram.settings.get('vpn.profiles').then((raw: unknown) => {
      if (Array.isArray(raw)) setProfiles(raw as VpnProfile[])
    })
  }, [])

  // Poll VPN status every 3 seconds
  useEffect(() => {
    const poll = async () => {
      try {
        const s = await window.cryogram.vpn.getStatus() as VpnStatus
        setStatus(prev => {
          if (prev.connected !== s.connected) {
            addLog(
              s.connected ? 'success' : 'warn',
              s.connected
                ? `VPN connected via ${s.interface ?? 'tun0'} — IP: ${s.ip ?? 'unknown'}`
                : 'VPN disconnected'
            )
          }
          return s
        })
      } catch {
        // silently ignore polling errors
      }
    }

    poll()
    pollRef.current = setInterval(poll, 3000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [addLog])

  // Duration ticker
  useEffect(() => {
    if (!status.connected || !status.connectedSince) return
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [status.connected, status.connectedSince])

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const persistProfiles = useCallback((p: VpnProfile[]) => {
    window.cryogram.settings.set('vpn.profiles', p)
  }, [])

  const connect = useCallback(async (profile: VpnProfile) => {
    if (status.connected || connectingId) return
    setConnectingId(profile.id)
    addLog('info', `Connecting to "${profile.name}" (${TYPE_LABELS[profile.type]})…`)
    try {
      const res = await window.cryogram.vpn.connect(profile) as { success: boolean; message?: string }
      if (res.success) {
        addLog('success', `Connected to "${profile.name}"`)
      } else {
        addLog('error', `Failed to connect: ${res.message ?? 'Unknown error'}`)
      }
    } catch (err) {
      addLog('error', `Connection error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setConnectingId(null)
    }
  }, [status.connected, connectingId, addLog])

  const disconnect = useCallback(async () => {
    if (!status.connected || disconnecting) return
    setDisconnecting(true)
    addLog('info', 'Disconnecting VPN…')
    try {
      const res = await window.cryogram.vpn.disconnect() as { success: boolean }
      if (res.success) {
        addLog('warn', 'VPN disconnected')
      } else {
        addLog('error', 'Failed to disconnect')
      }
    } catch (err) {
      addLog('error', `Disconnect error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setDisconnecting(false)
    }
  }, [status.connected, disconnecting, addLog])

  const removeProfile = useCallback((id: string) => {
    setProfiles(prev => {
      const next = prev.filter(p => p.id !== id)
      persistProfiles(next)
      return next
    })
    addLog('info', 'Profile removed')
  }, [persistProfiles, addLog])

  // ── Add profile form ───────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* Status header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(8,12,20,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusDot connected={status.connected} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: status.connected ? 'rgba(0,255,136,0.9)' : 'rgba(255,68,102,0.8)' }}>
              {status.connected ? 'Connected' : 'Disconnected'}
            </div>
            {status.connected && (
              <div style={{ fontSize: 11, color: 'rgba(140,160,180,0.65)', marginTop: 1 }}>
                {status.ip && <span style={{ marginRight: 10 }}>IP: <span style={{ color: 'var(--cryo-accent)', fontFamily: '"JetBrains Mono", monospace' }}>{status.ip}</span></span>}
                {status.interface && <span style={{ marginRight: 10 }}>via {status.interface}</span>}
                {status.connectedSince && (
                  <span>
                    {/* tick forces re-render every second */}
                    {tick >= 0 && formatDuration(Date.now() - status.connectedSince)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {status.connected && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={disconnect}
              disabled={disconnecting}
              style={{
                padding: '6px 14px',
                background: 'rgba(255,68,102,0.12)',
                border: '1px solid rgba(255,68,102,0.35)',
                borderRadius: 6,
                color: '#ff4466',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {disconnecting ? 'Disconnecting…' : 'Disconnect'}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddForm(v => !v)}
            style={{
              padding: '6px 14px',
              background: showAddForm ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${showAddForm ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 6,
              color: showAddForm ? 'var(--cryo-accent)' : 'rgba(180,200,220,0.7)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {showAddForm ? 'Cancel' : '+ Add Profile'}
          </motion.button>
        </div>
      </div>

      {/* Add profile form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <AddProfileForm
              onAdd={(profile) => {
                const next = [...profiles, profile]
                setProfiles(next)
                persistProfiles(next)
                setShowAddForm(false)
                addLog('info', `Profile "${profile.name}" added`)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body: profiles + log */}
      <div className="flex flex-1 overflow-hidden">
        {/* Profile list */}
        <div
          style={{
            width: 260,
            borderRight: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(8,12,20,0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: 10, color: 'rgba(140,160,180,0.45)', padding: '10px 12px 5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            VPN Profiles
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {profiles.length === 0 ? (
              <div style={{ padding: '12px', fontSize: 11, color: 'rgba(100,120,140,0.4)' }}>
                No profiles configured — add one to get started.
              </div>
            ) : (
              profiles.map(profile => (
                <ProfileRow
                  key={profile.id}
                  profile={profile}
                  vpnStatus={status}
                  connecting={connectingId === profile.id}
                  onConnect={() => connect(profile)}
                  onRemove={() => removeProfile(profile.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Log panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            fontSize: 10,
            color: 'rgba(140,160,180,0.45)',
            padding: '10px 14px 5px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Connection Log</span>
            {logs.length > 0 && (
              <button
                onClick={() => setLogs([])}
                style={{ fontSize: 10, color: 'rgba(100,120,140,0.5)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
              >
                Clear
              </button>
            )}
          </div>
          <div
            ref={logRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 14px',
              background: 'rgba(4,8,14,0.5)',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: 'rgba(100,120,140,0.35)', paddingTop: 4 }}>Events will appear here…</div>
            ) : (
              logs.map((entry, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, lineHeight: '1.7', alignItems: 'flex-start' }}>
                  <span style={{ color: 'rgba(100,120,140,0.4)', flexShrink: 0, fontSize: 10 }}>
                    {new Date(entry.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span style={{
                    color: entry.level === 'success' ? 'rgba(0,255,136,0.8)'
                      : entry.level === 'error'   ? '#ff4466'
                      : entry.level === 'warn'    ? 'rgba(255,200,0,0.7)'
                      : 'rgba(180,200,220,0.7)',
                  }}>
                    {entry.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ProfileRow ────────────────────────────────────────────────────────────────

interface ProfileRowProps {
  profile: VpnProfile
  vpnStatus: VpnStatus
  connecting: boolean
  onConnect: () => void
  onRemove: () => void
}

function ProfileRow({ profile, vpnStatus, connecting, onConnect, onRemove }: ProfileRowProps) {
  const [confirmRemove, setConfirmRemove] = useState(false)
  const isConnected = vpnStatus.connected

  return (
    <div
      style={{
        padding: '10px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#c9d1d9' }}>{profile.name}</div>
          <div style={{ fontSize: 10, color: 'rgba(140,160,180,0.5)', marginTop: 1 }}>
            {TYPE_LABELS[profile.type]}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {!isConnected && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConnect}
              disabled={connecting || isConnected}
              style={{
                padding: '4px 10px',
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.25)',
                borderRadius: 5,
                color: 'var(--cryo-accent)',
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {connecting ? '…' : 'Connect'}
            </motion.button>
          )}
          {confirmRemove ? (
            <>
              <button
                onClick={() => { onRemove(); setConfirmRemove(false) }}
                style={{ padding: '4px 8px', background: 'rgba(255,68,102,0.15)', border: '1px solid rgba(255,68,102,0.35)', borderRadius: 5, color: '#ff4466', fontSize: 10, cursor: 'pointer' }}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmRemove(false)}
                style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, color: 'rgba(140,160,180,0.6)', fontSize: 10, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmRemove(true)}
              style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 5, color: 'rgba(140,160,180,0.4)', fontSize: 10, cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10,
        color: 'rgba(100,120,140,0.55)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {profile.configPath}
      </div>
    </div>
  )
}

// ── AddProfileForm ────────────────────────────────────────────────────────────

interface AddProfileFormProps {
  onAdd: (profile: VpnProfile) => void
}

function AddProfileForm({ onAdd }: AddProfileFormProps) {
  const [name, setName]           = useState('')
  const [type, setType]           = useState<VpnType>('openvpn')
  const [configPath, setConfigPath] = useState('')
  const [error, setError]         = useState<string | null>(null)

  const browse = async () => {
    try {
      const path = await window.cryogram.fs.openDialog() as string | null
      if (path) setConfigPath(path)
    } catch {}
  }

  const submit = () => {
    if (!name.trim()) { setError('Profile name is required'); return }
    if (!configPath.trim()) { setError('Config file path is required'); return }
    setError(null)
    onAdd({
      id: genId(),
      name: name.trim(),
      type,
      configPath: configPath.trim(),
      createdAt: Date.now(),
    })
  }

  return (
    <div style={{ padding: '14px 16px', background: 'rgba(0,212,255,0.03)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--cryo-accent)', marginBottom: 2 }}>Add VPN Profile</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 10 }}>
        <div>
          <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My VPN"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 5,
              padding: '6px 9px',
              color: '#e0e8f0',
              fontSize: 12,
              outline: 'none',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as VpnType)}
            style={{
              width: '100%',
              background: 'rgba(8,12,20,0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 5,
              padding: '6px 9px',
              color: '#e0e8f0',
              fontSize: 12,
              outline: 'none',
            }}
          >
            <option value="openvpn">OpenVPN</option>
            <option value="wireguard">WireGuard</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Config File {type === 'openvpn' ? '(.ovpn)' : '(.conf)'}
        </label>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={configPath}
            onChange={e => setConfigPath(e.target.value)}
            placeholder={type === 'openvpn' ? '/etc/openvpn/client.ovpn' : '/etc/wireguard/wg0.conf'}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 5,
              padding: '6px 9px',
              color: '#e0e8f0',
              fontSize: 12,
              fontFamily: '"JetBrains Mono", monospace',
              outline: 'none',
            }}
          />
          <button
            onClick={browse}
            style={{
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 5,
              color: 'rgba(180,200,220,0.7)',
              fontSize: 11,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Browse…
          </button>
        </div>
      </div>

      {error && (
        <div style={{ fontSize: 11, color: '#ff4466', background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.2)', borderRadius: 5, padding: '5px 9px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          style={{
            padding: '7px 18px',
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: 6,
            color: 'var(--cryo-accent)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Add Profile
        </motion.button>
      </div>
    </div>
  )
}
