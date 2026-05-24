import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MonitorDashboard } from './MonitorDashboard'
import { BreachList } from './BreachList'

type Tab = 'dashboard' | 'breaches'

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Monitor' },
  { id: 'breaches', label: 'Breach Feed' },
]

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

  useEffect(() => { loadData() }, [loadData])

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
      <div
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid rgba(26,40,64,0.7)' }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-den-red"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: '0 0 6px rgba(255,68,102,0.7)' }}
          />
          <span className="text-xs text-den-muted">
            {targets.length} monitored · {breaches.length} total breaches
            {newBreaches > 0 && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-den-red ml-2 font-bold"
              >
                {newBreaches} new
              </motion.span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="text-xs text-den-muted">
              Last: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button className="btn text-xs py-1" onClick={refresh} disabled={refreshing}>
            {refreshing ? (
              <span className="flex items-center gap-1.5">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  ⟳
                </motion.span>
                Checking…
              </span>
            ) : 'Refresh Now'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex shrink-0 relative"
        style={{ borderBottom: '1px solid rgba(26,40,64,0.7)' }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="relative px-5 py-2.5 text-xs font-medium transition-colors"
            style={{ color: tab === id ? '#ff4466' : '#4e5d6e' }}
          >
            {label}
            {id === 'breaches' && newBreaches > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-1.5 badge bg-den-red/20 text-den-red"
              >
                {newBreaches}
              </motion.span>
            )}
            {tab === id && (
              <motion.div
                layoutId="leaker-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: '#ff4466', boxShadow: '0 0 6px rgba(255,68,102,0.6)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="absolute inset-0"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
