import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MonitorDashboard } from './MonitorDashboard'
import { BreachList } from './BreachList'
import { HelpBox, FieldHelp } from '../../components/SecurityHelpers'

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
  const [hibpKey, setHibpKey] = useState('')
  const [savedKey, setSavedKey] = useState('')
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const [t, b] = await Promise.all([
      window.cryogram.leaker.getTargets(),
      window.cryogram.leaker.getBreaches(),
    ])
    setTargets(t)
    setBreaches(b)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Load any saved HaveIBeenPwned API key (the breach checks need one).
  useEffect(() => {
    window.cryogram.settings.get('hibpApiKey').then((k: any) => {
      if (typeof k === 'string') { setHibpKey(k); setSavedKey(k) }
    }).catch(() => {})
  }, [])

  const saveKey = async () => {
    await window.cryogram.settings.set('hibpApiKey', hibpKey.trim())
    setSavedKey(hibpKey.trim())
    setRefreshMsg(hibpKey.trim() ? 'API key saved. Add a target, then press Refresh Now.' : 'API key cleared.')
  }

  const refresh = async () => {
    setRefreshing(true)
    setRefreshMsg(null)
    try {
      if (!savedKey) { setRefreshMsg('No HaveIBeenPwned API key set — add one above first.'); return }
      if (targets.length === 0) { setRefreshMsg('No targets yet — add an email to monitor below.'); return }
      const res = await window.cryogram.leaker.forceRefresh()
      await loadData()
      setLastRefresh(new Date())
      const checked = (res as any)?.checked ?? targets.length
      const found = (res as any)?.newBreaches ?? 0
      setRefreshMsg(`Checked ${checked} target${checked !== 1 ? 's' : ''} — ${found} new breach${found !== 1 ? 'es' : ''} found.`)
    } catch (e: any) {
      setRefreshMsg(`Check failed: ${e?.message ?? 'network or API error'} (verify your API key).`)
    } finally {
      setRefreshing(false)
    }
  }

  const addTarget = async (type: string, value: string, label?: string) => {
    await window.cryogram.leaker.addTarget({ type, value, label })
    await loadData()
  }

  const removeTarget = async (id: number) => {
    await window.cryogram.leaker.removeTarget(id)
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
            className="w-2 h-2 rounded-full bg-cryo-red"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: '0 0 6px rgba(255,68,102,0.7)' }}
          />
          <span className="text-xs text-cryo-muted">
            {targets.length} monitored · {breaches.length} total breaches
            {newBreaches > 0 && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-cryo-red ml-2 font-bold"
              >
                {newBreaches} new
              </motion.span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="text-xs text-cryo-muted">
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

      {/* Setup / instructions */}
      <div className="px-4 pt-3 shrink-0 flex flex-col gap-2">
        <HelpBox storageKey="leaker" title="How breach monitoring works" defaultOpen={!savedKey}>
          Watches whether your emails/usernames/domains appear in known data
          breaches, using the HaveIBeenPwned database. It needs a HIBP API key
          (their account breach search is key‑only).
          <FieldHelp name="1. Get a key">Sign up at <code>haveibeenpwned.com/API/Key</code> and paste it below.</FieldHelp>
          <FieldHelp name="2. Add targets">On the Monitor tab, add an email (or domain/username) to watch.</FieldHelp>
          <FieldHelp name="3. Refresh">Press <b>Refresh Now</b> — matches appear in the Breach Feed, and you get a notification when a new one is found.</FieldHelp>
          <div style={{ marginTop: 6, opacity: 0.7 }}>Without a key the checks can't run — that's why nothing appears.</div>
        </HelpBox>

        <div className="flex items-center gap-2">
          <input
            type="password"
            className="flex-1"
            style={{ height: 32, padding: '0 10px', background: 'rgba(8,12,18,0.6)', border: `1px solid ${savedKey ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,102,0.35)'}`, borderRadius: 6, color: '#c9d1d9', fontSize: 13, outline: 'none' }}
            placeholder="Paste your HaveIBeenPwned API key…"
            value={hibpKey}
            onChange={e => setHibpKey(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveKey() }}
          />
          <button className="btn btn-primary text-xs" style={{ height: 32 }} onClick={saveKey}>
            {savedKey && savedKey === hibpKey.trim() ? 'Saved ✓' : 'Save Key'}
          </button>
        </div>
        {refreshMsg && (
          <div className="text-xs" style={{ color: refreshMsg.includes('failed') || refreshMsg.includes('No ') ? '#ff6688' : '#34d399' }}>
            {refreshMsg}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div
        className="flex shrink-0 relative mt-2"
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
                className="ml-1.5 badge bg-cryo-red/20 text-cryo-red"
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
