import { useState } from 'react'

interface Props {
  targets: LeakerTarget[]
  breaches: Breach[]
  onAdd: (type: string, value: string, label?: string) => Promise<void>
  onRemove: (id: number) => Promise<void>
}

type TargetType = 'email' | 'domain' | 'username'

export function MonitorDashboard({ targets, breaches, onAdd, onRemove }: Props) {
  const [type, setType] = useState<TargetType>('email')
  const [value, setValue] = useState('')
  const [label, setLabel] = useState('')
  const [adding, setAdding] = useState(false)

  const add = async () => {
    if (!value.trim()) return
    setAdding(true)
    try {
      await onAdd(type, value.trim(), label.trim() || undefined)
      setValue('')
      setLabel('')
    } finally {
      setAdding(false)
    }
  }

  const breachCountFor = (targetId: number) =>
    breaches.filter((b) => b.target_id === targetId).length

  return (
    <div className="flex flex-col gap-4 p-4 overflow-auto flex-1">
      {/* Add target */}
      <div className="panel p-4">
        <div className="text-xs text-den-muted uppercase tracking-wider mb-3">Add Target to Monitor</div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TargetType)}
            className="w-28"
          >
            <option value="email">Email</option>
            <option value="domain">Domain</option>
            <option value="username">Username</option>
          </select>
          <input
            className="flex-1 min-w-40"
            placeholder={type === 'email' ? 'user@company.com' : type === 'domain' ? 'company.com' : 'username'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <input
            className="w-36"
            placeholder="Label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button className="btn btn-primary" onClick={add} disabled={!value.trim() || adding}>
            {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      {/* Target list */}
      <div>
        <div className="text-xs text-den-muted uppercase tracking-wider mb-2">
          Monitored Targets ({targets.length})
        </div>
        {targets.length === 0 ? (
          <div className="panel p-4 text-center text-xs text-den-muted">
            No targets yet. Add emails, domains, or usernames to monitor for breaches.
          </div>
        ) : (
          <div className="space-y-1.5">
            {targets.map((t) => {
              const count = breachCountFor(t.id)
              return (
                <div key={t.id} className="panel p-3 flex items-center gap-3">
                  <span className={`badge text-xs ${
                    t.type === 'email' ? 'bg-den-accent/10 text-den-accent' :
                    t.type === 'domain' ? 'bg-den-purple/10 text-den-purple' :
                    'bg-den-green/10 text-den-green'
                  }`}>
                    {t.type}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm text-den-text">{t.label}</div>
                    <div className="text-xs text-den-muted font-mono">{t.value}</div>
                  </div>
                  <div className="text-right">
                    {count > 0 ? (
                      <span className="badge bg-den-red/20 text-den-red">{count} breaches</span>
                    ) : (
                      <span className="badge bg-den-green/10 text-den-green">Clean</span>
                    )}
                    {t.last_checked && (
                      <div className="text-xs text-den-muted mt-0.5">
                        Checked: {new Date(t.last_checked).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(t.id)}
                    className="text-den-muted hover:text-den-red transition-colors text-xs ml-1"
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      {targets.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Monitored', value: targets.length, color: '#00d4ff' },
            { label: 'Total Breaches', value: breaches.length, color: '#ff4466' },
            { label: 'Clean Targets', value: targets.filter((t) => breachCountFor(t.id) === 0).length, color: '#00ff88' },
          ].map(({ label, value, color }) => (
            <div key={label} className="panel p-3 text-center">
              <div className="text-2xl font-bold font-mono" style={{ color }}>{value}</div>
              <div className="text-xs text-den-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
