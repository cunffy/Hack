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
      <div className="p-3 border-b border-den-border shrink-0">
        <input
          className="w-full"
          placeholder="Filter by breach name, target, source..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-den-muted text-xs">
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
              <div key={b.id} className={`p-3 border-b border-den-border hover:bg-den-surface/50 transition-colors ${isNew ? 'border-l-2 border-l-den-red' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {isNew && <span className="badge bg-den-red/20 text-den-red text-xs">NEW</span>}
                    <span className="text-den-text font-medium text-sm">
                      {b.breach_name || 'Unknown Breach'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="badge bg-den-surface text-den-muted text-xs">{b.source}</span>
                    {b.breach_date && (
                      <span className="text-xs text-den-muted">{b.breach_date}</span>
                    )}
                  </div>
                </div>

                {target && (
                  <div className="text-xs text-den-muted mb-1.5">
                    Target: <span className="text-den-accent font-mono">{target.value}</span>
                  </div>
                )}

                {dataClasses.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {dataClasses.map((dc) => (
                      <span key={dc} className="badge bg-den-yellow/10 text-den-yellow text-xs">{dc}</span>
                    ))}
                  </div>
                )}

                {b.description && (
                  <div className="text-xs text-den-muted line-clamp-2">
                    {b.description.replace(/<[^>]+>/g, '')}
                  </div>
                )}

                <div className="text-xs text-den-muted mt-1.5">
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
