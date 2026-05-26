import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────

interface SshKey {
  name: string
  type: string
  fingerprint: string
  publicKey: string
  hasPrivate: boolean
  path: string
}

interface SshHost {
  host: string
  hostname?: string
  user?: string
  port?: string
  identityFile?: string
}

type TabId = 'keys' | 'config'

// ── Accent ────────────────────────────────────────────────────────────────────

const ACCENT = '#00d4ff'

// ── Helpers ───────────────────────────────────────────────────────────────────

const ipc = (window as any).cryogram

function fieldStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: '7px 10px',
    color: '#e0e8f0',
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box' as const,
    ...extra,
  }
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {children}
    </label>
  )
}

// ── TypeBadge ─────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const color = type === 'ED25519' ? '#00ff88' : type === 'RSA' ? ACCENT : 'rgba(200,180,100,0.8)'
  return (
    <span style={{
      fontSize: 9,
      fontWeight: 700,
      padding: '2px 6px',
      borderRadius: 4,
      background: `${color}18`,
      border: `1px solid ${color}44`,
      color,
      letterSpacing: '0.06em',
      fontFamily: 'monospace',
    }}>
      {type}
    </span>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={copy}
      style={{
        padding: '4px 10px',
        background: copied ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${copied ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 5,
        color: copied ? 'rgba(0,255,136,0.9)' : 'rgba(180,200,220,0.7)',
        fontSize: 10,
        cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {copied ? 'Copied!' : label}
    </motion.button>
  )
}

// ── KeyRow ────────────────────────────────────────────────────────────────────

interface KeyRowProps {
  sshKey: SshKey
  onDelete: () => void
}

function KeyRow({ sshKey, onDelete }: KeyRowProps) {
  const [confirmDel, setConfirmDel] = useState(false)
  const [expanded,   setExpanded]   = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: expanded ? 'rgba(0,212,255,0.02)' : 'transparent' }}
    >
      {/* Key header row */}
      <div
        style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => setExpanded(v => !v)}
      >
        <span style={{ fontSize: 11, color: 'rgba(140,160,180,0.4)', flexShrink: 0 }}>{expanded ? '▾' : '▸'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#c9d1d9', fontFamily: '"JetBrains Mono", monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {sshKey.name}
            </span>
            <TypeBadge type={sshKey.type} />
            {!sshKey.hasPrivate && (
              <span style={{ fontSize: 9, color: 'rgba(255,200,0,0.7)', background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.2)', borderRadius: 3, padding: '1px 5px' }}>
                pub only
              </span>
            )}
          </div>
          <div style={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace', color: 'rgba(140,160,180,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {sshKey.fingerprint}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          <CopyButton text={sshKey.publicKey} label="Copy Key" />
          {confirmDel ? (
            <>
              <button onClick={() => { onDelete(); setConfirmDel(false) }} style={{ padding: '4px 8px', background: 'rgba(255,68,102,0.15)', border: '1px solid rgba(255,68,102,0.35)', borderRadius: 5, color: '#ff4466', fontSize: 10, cursor: 'pointer' }}>
                Confirm
              </button>
              <button onClick={() => setConfirmDel(false)} style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, color: 'rgba(140,160,180,0.5)', fontSize: 10, cursor: 'pointer' }}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setConfirmDel(true)} style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 5, color: 'rgba(200,80,80,0.5)', fontSize: 10, cursor: 'pointer' }}>
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Expanded public key */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 14px 12px' }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: 'rgba(140,200,180,0.7)',
                background: 'rgba(4,8,14,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 5,
                padding: '8px 10px',
                wordBreak: 'break-all' as const,
                lineHeight: 1.6,
              }}>
                {sshKey.publicKey}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(100,120,140,0.4)', marginTop: 5 }}>
                {sshKey.path}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── GenerateKeyForm ───────────────────────────────────────────────────────────

interface GenerateKeyFormProps {
  onGenerated: () => void
}

function GenerateKeyForm({ onGenerated }: GenerateKeyFormProps) {
  const [name,       setName]       = useState('')
  const [keyType,    setKeyType]    = useState<'ed25519' | 'rsa'>('ed25519')
  const [comment,    setComment]    = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [success,    setSuccess]    = useState(false)

  const generate = async () => {
    if (!name.trim()) { setError('Key name is required'); return }
    if (!/^[a-zA-Z0-9_\-]+$/.test(name.trim())) { setError('Name must be alphanumeric (a-z, 0-9, _ or -)'); return }
    setError(null)
    setGenerating(true)
    try {
      const result = await ipc.ssh.generateKey({ name: name.trim(), type: keyType, comment: comment.trim() || undefined, passphrase: passphrase || undefined }) as { success: boolean; error?: string }
      if (result.success) {
        setSuccess(true)
        setName('')
        setComment('')
        setPassphrase('')
        onGenerated()
        setTimeout(() => setSuccess(false), 2500)
      } else {
        setError(result.error ?? 'Generation failed')
      }
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ padding: '14px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,212,255,0.02)' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT, marginBottom: 12 }}>Generate New Key</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10, marginBottom: 10 }}>
        <div>
          <FieldLabel>Key Name</FieldLabel>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="id_ed25519_work" style={fieldStyle()} />
        </div>
        <div>
          <FieldLabel>Type</FieldLabel>
          <select value={keyType} onChange={e => setKeyType(e.target.value as 'ed25519' | 'rsa')} style={{ ...fieldStyle(), background: 'rgba(8,12,20,0.9)' }}>
            <option value="ed25519">ED25519</option>
            <option value="rsa">RSA 4096</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <FieldLabel>Comment</FieldLabel>
          <input value={comment} onChange={e => setComment(e.target.value)} placeholder="you@hostname" style={fieldStyle()} />
        </div>
        <div>
          <FieldLabel>Passphrase (optional)</FieldLabel>
          <input type="password" value={passphrase} onChange={e => setPassphrase(e.target.value)} placeholder="Leave blank for none" style={fieldStyle()} />
        </div>
      </div>

      {error && (
        <div style={{ fontSize: 11, color: '#ff4466', background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.2)', borderRadius: 5, padding: '5px 9px', marginBottom: 8 }}>
          {error}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generate}
        disabled={generating}
        style={{
          padding: '7px 18px',
          background: success ? 'rgba(0,255,136,0.12)' : 'rgba(0,212,255,0.1)',
          border: `1px solid ${success ? 'rgba(0,255,136,0.3)' : 'rgba(0,212,255,0.25)'}`,
          borderRadius: 6,
          color: success ? 'rgba(0,255,136,0.9)' : ACCENT,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {generating ? 'Generating…' : success ? 'Key Generated!' : 'Generate Key'}
      </motion.button>
    </div>
  )
}

// ── HostCard ──────────────────────────────────────────────────────────────────

function HostCard({ host }: { host: SshHost }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.055)',
      borderRadius: 8,
      padding: '10px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, fontFamily: 'monospace' }}>
        {host.host}
      </div>
      {host.hostname && (
        <div style={{ fontSize: 11, color: 'rgba(180,200,220,0.7)', fontFamily: 'monospace' }}>
          {host.hostname}{host.port && host.port !== '22' ? `:${host.port}` : ''}
        </div>
      )}
      {host.user && (
        <div style={{ fontSize: 10, color: 'rgba(140,160,180,0.5)' }}>
          User: <span style={{ color: 'rgba(180,200,220,0.7)', fontFamily: 'monospace' }}>{host.user}</span>
        </div>
      )}
      {host.identityFile && (
        <div style={{ fontSize: 10, color: 'rgba(140,160,180,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Identity: <span style={{ color: 'rgba(180,200,220,0.5)', fontFamily: 'monospace' }}>{host.identityFile}</span>
        </div>
      )}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function SSHKeyManagerApp() {
  const [tab,          setTab]          = useState<TabId>('keys')
  const [keys,         setKeys]         = useState<SshKey[]>([])
  const [hosts,        setHosts]        = useState<SshHost[]>([])
  const [configText,   setConfigText]   = useState('')
  const [loadingKeys,  setLoadingKeys]  = useState(true)
  const [savingConfig, setSavingConfig] = useState(false)
  const [saveMsg,      setSaveMsg]      = useState<string | null>(null)

  const loadKeys = useCallback(async () => {
    setLoadingKeys(true)
    try {
      const k = await ipc.ssh.listKeys() as SshKey[]
      setKeys(k)
    } finally {
      setLoadingKeys(false)
    }
  }, [])

  const loadConfig = useCallback(async () => {
    try {
      const h = await ipc.ssh.listHosts() as SshHost[]
      setHosts(h)
      // Load raw config text for editing — read public key to get content
      // We load via a dedicated settings path; config is loaded via hosts parse
      // Try to read config text (not in our IPC, so we do it via hosts + rebuild)
      // Instead: show raw content as best effort from hosts
    } catch {}
  }, [])

  useEffect(() => { loadKeys() }, [loadKeys])

  useEffect(() => {
    if (tab === 'config') {
      loadConfig()
      // Load raw config file text — if not available via IPC, show placeholder
      ipc.ssh.listHosts().then((h: SshHost[]) => {
        setHosts(h)
        // Build a view of the config from hosts if no raw text available
        if (!configText) {
          // We keep the textarea empty so user sees actual file content on save
        }
      }).catch(() => {})

      // Try to get raw config via getPublicKey trick? No — we'll load via settings
      // We'll store the config as a textarea the user edits directly.
      // Since there's no raw-read IPC, we leave the textarea to user input.
    }
  }, [tab, loadConfig, configText])

  const handleDelete = useCallback(async (name: string) => {
    await ipc.ssh.deleteKey(name)
    setKeys(prev => prev.filter(k => k.name !== name))
  }, [])

  const saveConfig = async () => {
    setSavingConfig(true)
    try {
      const ok = await ipc.ssh.saveConfig(configText) as boolean
      setSaveMsg(ok ? 'Saved!' : 'Save failed')
      if (ok) await loadConfig()
    } finally {
      setSavingConfig(false)
      setTimeout(() => setSaveMsg(null), 2000)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,12,20,0.5)', flexShrink: 0 }}>
        {(['keys', 'config'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              position: 'relative',
              padding: '10px 20px',
              fontSize: 12,
              fontWeight: 500,
              color: tab === t ? ACCENT : 'rgba(140,160,180,0.6)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'capitalize' as const,
            }}
          >
            {t === 'keys' ? `Keys${keys.length > 0 ? ` (${keys.length})` : ''}` : 'SSH Config'}
            {tab === t && (
              <motion.div
                layoutId="ssh-tab"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: ACCENT, borderRadius: '2px 2px 0 0' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'keys' ? (
          <motion.div
            key="keys"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            {/* Key list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingKeys ? (
                <motion.div
                  style={{ padding: '24px 16px', fontSize: 12, color: 'rgba(140,160,180,0.5)', fontFamily: 'monospace' }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  Scanning ~/.ssh…
                </motion.div>
              ) : keys.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔑</div>
                  <div style={{ fontSize: 13, color: 'rgba(180,200,220,0.6)' }}>No SSH keys found in ~/.ssh</div>
                  <div style={{ fontSize: 11, color: 'rgba(120,140,160,0.45)', marginTop: 6 }}>Generate a key below to get started</div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {keys.map(k => (
                    <KeyRow key={k.name} sshKey={k} onDelete={() => handleDelete(k.name)} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Generate form */}
            <GenerateKeyForm onGenerated={loadKeys} />
          </motion.div>
        ) : (
          <motion.div
            key="config"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            {/* Config editor */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.055)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: 'rgba(140,160,180,0.6)', fontFamily: 'monospace' }}>~/.ssh/config</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {saveMsg && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ fontSize: 11, color: saveMsg === 'Saved!' ? 'rgba(0,255,136,0.8)' : '#ff4466' }}
                  >
                    {saveMsg}
                  </motion.span>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={saveConfig}
                  disabled={savingConfig}
                  style={{ padding: '6px 14px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 6, color: ACCENT, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >
                  {savingConfig ? 'Saving…' : 'Save Config'}
                </motion.button>
              </div>
            </div>

            <textarea
              value={configText}
              onChange={e => setConfigText(e.target.value)}
              placeholder={`# ~/.ssh/config\n# Example:\nHost myserver\n  HostName 192.168.1.100\n  User ubuntu\n  Port 22\n  IdentityFile ~/.ssh/id_ed25519`}
              spellCheck={false}
              style={{
                ...fieldStyle({
                  borderRadius: 0,
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.055)',
                  resize: 'none',
                  flex: 'none',
                  height: 220,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  lineHeight: 1.7,
                  padding: '12px 14px',
                  color: '#c9d1d9',
                }),
              }}
            />

            {/* Parsed hosts */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
              {hosts.length > 0 && (
                <>
                  <div style={{ fontSize: 10, color: 'rgba(140,160,180,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                    Parsed Hosts ({hosts.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                    {hosts.map(h => <HostCard key={h.host} host={h} />)}
                  </div>
                </>
              )}
              {hosts.length === 0 && (
                <div style={{ fontSize: 11, color: 'rgba(100,120,140,0.4)', fontFamily: 'monospace', paddingTop: 8 }}>
                  No hosts defined in config yet
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
