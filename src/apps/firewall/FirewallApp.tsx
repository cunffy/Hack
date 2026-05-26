import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────

interface FirewallRule {
  number: number
  to: string
  action: string
  from: string
  v6: boolean
}

interface FirewallStatus {
  active: boolean
  defaultIn: string
  defaultOut: string
  rules: FirewallRule[]
}

// ── Accent ────────────────────────────────────────────────────────────────────

const ACCENT = '#ff4466'

// ── Helpers ───────────────────────────────────────────────────────────────────

const ipc = (window as any).cryogram

// ── StatusBadge ───────────────────────────────────────────────────────────────

function StatusBadge({ active }: { active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <motion.div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: active ? 'rgba(0,255,136,0.9)' : 'rgba(255,68,102,0.8)',
          boxShadow: active ? '0 0 8px rgba(0,255,136,0.6)' : '0 0 6px rgba(255,68,102,0.5)',
        }}
        animate={active ? { opacity: [1, 0.5, 1], scale: [1, 1.2, 1] } : { opacity: 1, scale: 1 }}
        transition={active ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
      />
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        color: active ? 'rgba(0,255,136,0.9)' : 'rgba(255,68,102,0.85)',
        letterSpacing: '0.03em',
      }}>
        {active ? 'Active' : 'Inactive'}
      </span>
    </div>
  )
}

// ── PolicyBadge ───────────────────────────────────────────────────────────────

function PolicyBadge({ policy }: { policy: string }) {
  const isDeny = policy === 'deny' || policy === 'reject'
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 4,
      background: isDeny ? 'rgba(255,68,102,0.1)' : 'rgba(0,255,136,0.1)',
      border: `1px solid ${isDeny ? 'rgba(255,68,102,0.3)' : 'rgba(0,255,136,0.25)'}`,
      color: isDeny ? '#ff4466' : 'rgba(0,255,136,0.85)',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    }}>
      {policy}
    </span>
  )
}

// ── ActionBadge ───────────────────────────────────────────────────────────────

function ActionBadge({ action }: { action: string }) {
  const isAllow = action.toUpperCase().includes('ALLOW')
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: 4,
      background: isAllow ? 'rgba(0,255,136,0.08)' : 'rgba(255,68,102,0.1)',
      border: `1px solid ${isAllow ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,102,0.3)'}`,
      color: isAllow ? 'rgba(0,255,136,0.85)' : '#ff4466',
      letterSpacing: '0.04em',
      fontFamily: 'monospace',
    }}>
      {action}
    </span>
  )
}

// ── AddRuleForm ───────────────────────────────────────────────────────────────

interface AddRuleFormProps {
  onAdded: () => void
}

function AddRuleForm({ onAdded }: AddRuleFormProps) {
  const [port,     setPort]     = useState('')
  const [proto,    setProto]    = useState('tcp')
  const [from,     setFrom]     = useState('any')
  const [action,   setAction]   = useState<'allow' | 'deny'>('allow')
  const [adding,   setAdding]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState(false)

  const fieldStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: '7px 10px',
    color: '#e0e8f0',
    fontSize: 12,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  const submit = async () => {
    if (!port.trim() && !from.trim()) { setError('Specify at least a port or source address'); return }
    setError(null)
    setAdding(true)
    try {
      const result = await ipc.firewall.addRule({
        port: port.trim() || undefined,
        proto: proto !== 'any' ? proto : undefined,
        from: from.trim() || undefined,
        action,
      }) as { success: boolean; error?: string }

      if (result.success) {
        setSuccess(true)
        setPort('')
        setFrom('any')
        onAdded()
        setTimeout(() => setSuccess(false), 2000)
      } else {
        setError(result.error ?? 'Failed to add rule')
      }
    } finally {
      setAdding(false)
    }
  }

  return (
    <div style={{ padding: '14px 14px', background: 'rgba(255,68,102,0.02)', borderTop: '1px solid rgba(255,255,255,0.055)' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT, marginBottom: 12 }}>Add Rule</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr 100px', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Port</label>
          <input value={port} onChange={e => setPort(e.target.value)} placeholder="22, 80, 443…" style={fieldStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Protocol</label>
          <select value={proto} onChange={e => setProto(e.target.value)} style={{ ...fieldStyle, background: 'rgba(8,12,20,0.9)' }}>
            <option value="tcp">TCP</option>
            <option value="udp">UDP</option>
            <option value="any">Any</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>From</label>
          <input value={from} onChange={e => setFrom(e.target.value)} placeholder="any, 192.168.1.0/24…" style={{ ...fieldStyle, fontFamily: 'monospace' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, color: 'rgba(140,160,180,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Action</label>
          <select value={action} onChange={e => setAction(e.target.value as 'allow' | 'deny')} style={{ ...fieldStyle, background: 'rgba(8,12,20,0.9)' }}>
            <option value="allow">Allow</option>
            <option value="deny">Deny</option>
          </select>
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
        onClick={submit}
        disabled={adding}
        style={{
          padding: '7px 18px',
          background: success ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,102,0.1)',
          border: `1px solid ${success ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,102,0.25)'}`,
          borderRadius: 6,
          color: success ? 'rgba(0,255,136,0.9)' : ACCENT,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {adding ? 'Adding…' : success ? 'Rule Added!' : 'Add Rule'}
      </motion.button>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function FirewallApp() {
  const [status,        setStatus]        = useState<FirewallStatus | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [toggling,      setToggling]      = useState(false)
  const [notInstalled,  setNotInstalled]  = useState(false)
  const [confirmReset,  setConfirmReset]  = useState(false)
  const [resetting,     setResetting]     = useState(false)

  const loadStatus = useCallback(async () => {
    setLoading(true)
    try {
      const s = await ipc.firewall.status() as FirewallStatus
      setStatus(s)
      setNotInstalled(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('not found') || msg.includes('ENOENT') || msg.includes('ufw')) {
        setNotInstalled(true)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])

  const toggle = useCallback(async () => {
    if (!status || toggling) return
    setToggling(true)
    try {
      if (status.active) {
        await ipc.firewall.disable()
      } else {
        await ipc.firewall.enable()
      }
      await loadStatus()
    } finally {
      setToggling(false)
    }
  }, [status, toggling, loadStatus])

  const deleteRule = useCallback(async (number: number) => {
    await ipc.firewall.deleteRule(number)
    await loadStatus()
  }, [loadStatus])

  const reset = useCallback(async () => {
    setResetting(true)
    try {
      await ipc.firewall.reset()
      setConfirmReset(false)
      await loadStatus()
    } finally {
      setResetting(false)
    }
  }, [loadStatus])

  // ── Not installed ──────────────────────────────────────────────────────────

  if (notInstalled) {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: 'rgba(10,14,22,0.94)',
            border: '1px solid rgba(255,255,255,0.055)',
            borderRadius: 12,
            padding: '32px 40px',
            textAlign: 'center',
            maxWidth: 420,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>🛡️</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#e0e8f0', marginBottom: 8 }}>UFW not found</div>
          <div style={{ fontSize: 12, color: 'rgba(140,160,180,0.7)', marginBottom: 20, lineHeight: 1.6 }}>
            This app requires UFW (Uncomplicated Firewall) to be installed on the system.
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, background: 'rgba(255,68,102,0.06)', border: '1px solid rgba(255,68,102,0.2)', borderRadius: 6, padding: '10px 16px', color: ACCENT }}>
            sudo apt install ufw
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading && !status) {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <motion.span
          style={{ fontSize: 12, color: 'rgba(140,160,180,0.5)', fontFamily: 'monospace' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          Loading firewall status…
        </motion.span>
      </div>
    )
  }

  const rules = status?.rules ?? []
  const nonV6Rules = rules.filter(r => !r.v6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>

      {/* ── Status header ── */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
        background: 'rgba(10,14,22,0.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <StatusBadge active={status?.active ?? false} />
          {status && (
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'rgba(140,160,180,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>IN</span>
                <PolicyBadge policy={status.defaultIn} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'rgba(140,160,180,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>OUT</span>
                <PolicyBadge policy={status.defaultOut} />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => loadStatus()}
            disabled={loading}
            style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, color: 'rgba(140,160,180,0.6)', fontSize: 11, cursor: 'pointer' }}
          >
            {loading ? '…' : 'Refresh'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggle}
            disabled={toggling}
            style={{
              padding: '7px 16px',
              background: status?.active ? 'rgba(255,68,102,0.1)' : 'rgba(0,255,136,0.1)',
              border: `1px solid ${status?.active ? 'rgba(255,68,102,0.3)' : 'rgba(0,255,136,0.25)'}`,
              borderRadius: 6,
              color: status?.active ? ACCENT : 'rgba(0,255,136,0.85)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {toggling ? '…' : status?.active ? 'Disable Firewall' : 'Enable Firewall'}
          </motion.button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Rules table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {nonV6Rules.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 13, color: 'rgba(180,200,220,0.5)' }}>No rules configured</div>
              <div style={{ fontSize: 11, color: 'rgba(120,140,160,0.4)', marginTop: 6 }}>Add a rule below to get started</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,12,20,0.5)' }}>
                  {['#', 'To / Port', 'Action', 'From', ''].map((col, i) => (
                    <th key={col + i} style={{
                      textAlign: 'left',
                      padding: '8px 14px',
                      fontSize: 10,
                      color: 'rgba(140,160,180,0.45)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      fontWeight: 600,
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {nonV6Rules.map((rule, i) => (
                    <RuleRow key={`${rule.number}-${rule.to}-${rule.from}`} rule={rule} index={i} onDelete={() => deleteRule(rule.number)} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

        {/* Add rule form */}
        <AddRuleForm onAdded={loadStatus} />

        {/* Reset footer */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(8,12,20,0.3)', flexShrink: 0 }}>
          <AnimatePresence mode="wait">
            {confirmReset ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                style={{ display: 'flex', gap: 8, alignItems: 'center' }}
              >
                <span style={{ fontSize: 11, color: 'rgba(200,100,100,0.8)' }}>Reset all rules to defaults?</span>
                <button
                  onClick={reset}
                  disabled={resetting}
                  style={{ padding: '5px 12px', background: 'rgba(255,68,102,0.15)', border: '1px solid rgba(255,68,102,0.4)', borderRadius: 5, color: ACCENT, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                >
                  {resetting ? 'Resetting…' : 'Confirm Reset'}
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, color: 'rgba(140,160,180,0.5)', fontSize: 11, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="reset-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setConfirmReset(true)}
                style={{ padding: '5px 12px', background: 'transparent', border: '1px solid rgba(255,68,102,0.15)', borderRadius: 5, color: 'rgba(200,80,80,0.5)', fontSize: 11, cursor: 'pointer' }}
              >
                Reset to Defaults
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ── RuleRow ───────────────────────────────────────────────────────────────────

interface RuleRowProps {
  rule: FirewallRule
  index: number
  onDelete: () => void
}

function RuleRow({ rule, index, onDelete }: RuleRowProps) {
  const [confirmDel, setConfirmDel] = useState(false)

  return (
    <motion.tr
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ delay: index * 0.03 }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <td style={{ padding: '9px 14px', fontFamily: 'monospace', color: 'rgba(140,160,180,0.45)', fontSize: 11 }}>
        {rule.number}
      </td>
      <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: '#c9d1d9', fontSize: 12 }}>
        {rule.to}
      </td>
      <td style={{ padding: '9px 14px' }}>
        <ActionBadge action={rule.action} />
      </td>
      <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: 'rgba(180,200,220,0.65)', fontSize: 12 }}>
        {rule.from}
      </td>
      <td style={{ padding: '9px 14px', textAlign: 'right' }}>
        {confirmDel ? (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button onClick={onDelete} style={{ padding: '3px 8px', background: 'rgba(255,68,102,0.15)', border: '1px solid rgba(255,68,102,0.35)', borderRadius: 4, color: ACCENT, fontSize: 10, cursor: 'pointer' }}>
              Delete
            </button>
            <button onClick={() => setConfirmDel(false)} style={{ padding: '3px 7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, color: 'rgba(140,160,180,0.5)', fontSize: 10, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDel(true)}
            style={{ padding: '3px 8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, color: 'rgba(200,80,80,0.45)', fontSize: 10, cursor: 'pointer' }}
          >
            ✕
          </button>
        )}
      </td>
    </motion.tr>
  )
}
