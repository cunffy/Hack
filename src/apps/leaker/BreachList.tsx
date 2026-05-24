import { useState } from 'react'

interface Props {
  breaches: Breach[]
  targets: LeakerTarget[]
}

export function BreachList({ breaches, targets }: Props) {
  const [filter, setFilter] = useState('')
  const targetMap = Object.fromEntries(targets.map((t) => [t.id, t]))

  const filtered = breaches.filter((b) => {
    if (!filter) return true
    const target = targetMap[b.target_id]
    return (
      b.breach_name?.toLowerCase().includes(filter.toLowerCase()) ||
      target?.value.toLowerCase().includes(filter.toLowerCase()) ||
      b.source?.toLowerCase().includes(filter.toLowerCase())
    )
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-3 border-b border-cryo-border shrink-0">
        <input
          className="w-full"
          placeholder="Filter by breach name, target, source..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-cryo-muted text-xs">
            {breaches.length === 0 ? 'No breaches found yet — run a refresh to check' : 'No results match filter'}
          </div>
        ) : (
          filtered.map((b) => {
            const target = targetMap[b.target_id]
            let dataClasses: string[] = []
            try { dataClasses = b.data_classes ? JSON.parse(b.data_classes) : [] } catch {}
            const hoursAgo = (Date.now() - new Date(b.discovered_at).getTime()) / 3600000
            const isNew = hoursAgo < 24

            return (
              <div key={b.id} className={`p-3 border-b border-cryo-border hover:bg-cryo-surface/50 transition-colors ${isNew ? 'border-l-2 border-l-den-red' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {isNew && <span className="badge bg-cryo-red/20 text-cryo-red text-xs">NEW</span>}
                    <span className="text-cryo-text font-medium text-sm">
                      {b.breach_name || 'Unknown Breach'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="badge bg-cryo-surface text-cryo-muted text-xs">{b.source}</span>
                    {b.breach_date && (
                      <span className="text-xs text-cryo-muted">{b.breach_date}</span>
                    )}
                  </div>
                </div>

                {target && (
                  <div className="text-xs text-cryo-muted mb-1.5">
                    Target: <span className="text-cryo-accent font-mono">{target.value}</span>
                  </div>
                )}

                {dataClasses.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {dataClasses.map((dc) => (
                      <span key={dc} className="badge bg-cryo-yellow/10 text-cryo-yellow text-xs">{dc}</span>
                    ))}
                  </div>
                )}

                {b.description && (
                  <div className="text-xs text-cryo-muted line-clamp-2">
                    {b.description.replace(/<[^>]+>/g, '')}
                  </div>
                )}

                <div className="text-xs text-cryo-muted mt-1.5">
                  Discovered: {new Date(b.discovered_at).toLocaleString()}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
