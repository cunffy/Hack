import { useState, useEffect, useCallback } from 'react'
import { MonitorDashboard } from './MonitorDashboard'
import { BreachList } from './BreachList'

type Tab = 'dashboard' | 'breaches'

export default function LeakerApp() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [targets, setTargets] = useState<LeakerTarget[]>([])
  const [breaches, setBreaches] = useState<Breach[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const loadData = useCallback(async () => {
    const [t, b] = await Promise.all([
      window.cyberden.leaker.getTargets(),
      window.cyberden.leaker.getBreaches(),
    ])
    setTargets(t)
    setBreaches(b)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const refresh = async () => {
    setRefreshing(true)
    try {
      await window.cyberden.leaker.forceRefresh()
      await loadData()
      setLastRefresh(new Date())
    } finally {
      setRefreshing(false)
    }
  }

  const addTarget = async (type: string, value: string, label?: string) => {
    await window.cyberden.leaker.addTarget({ type, value, label })
    await loadData()
  }

  const removeTarget = async (id: number) => {
    await window.cyberden.leaker.removeTarget(id)
    await loadData()
  }

  const newBreaches = breaches.filter((b) => {
    const hours = (Date.now() - new Date(b.discovered_at).getTime()) / 3600000
    return hours < 24
  }).length

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-den-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            <div className="w-2 h-2 rounded-full bg-den-red animate-pulse" />
          </div>
          <span className="text-xs text-den-muted">
            {targets.length} monitored · {breaches.length} total breaches
            {newBreaches > 0 && <span className="text-den-red ml-2 font-bold">{newBreaches} new</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="text-xs text-den-muted">
              Last: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button className="btn text-xs py-1" onClick={refresh} disabled={refreshing}>
            {refreshing ? 'Checking...' : 'Refresh Now'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-den-border shrink-0">
        {([['dashboard', 'Monitor'], ['breaches', 'Breach Feed']] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
              tab === id
                ? 'border-den-red text-den-red'
                : 'border-transparent text-den-muted hover:text-den-text'
            }`}
          >
            {label}
            {id === 'breaches' && newBreaches > 0 && (
              <span className="ml-1.5 badge bg-den-red/20 text-den-red">{newBreaches}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'dashboard' ? (
          <MonitorDashboard
            targets={targets}
            breaches={breaches}
            onAdd={addTarget}
            onRemove={removeTarget}
          />
        ) : (
          <BreachList breaches={breaches} targets={targets} />
        )}
      </div>
    </div>
  )
}
