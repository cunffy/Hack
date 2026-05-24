import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthDisclaimer } from './AuthDisclaimer'
import { HashCracker } from './HashCracker'
import { NetworkTester } from './NetworkTester'

type Tab = 'hash' | 'network'

const TABS: { id: Tab; label: string }[] = [
  { id: 'hash', label: 'Hash Cracker' },
  { id: 'network', label: 'Network Tester' },
]

export default function PasswordTester() {
  const [accepted, setAccepted] = useState<boolean | null>(null)
  const [tab, setTab] = useState<Tab>('hash')

  useEffect(() => {
    window.cryogram.settings.get('ptDisclaimerAccepted').then((val) => {
      if (!val) { setAccepted(false); return }
      const acceptedDate = new Date(val as string)
      const daysSince = (Date.now() - acceptedDate.getTime()) / (1000 * 60 * 60 * 24)
      setAccepted(daysSince < 90)
    })
  }, [])

  const onAccept = async () => {
    await window.cryogram.settings.set('ptDisclaimerAccepted', new Date().toISOString())
    setAccepted(true)
  }

  if (accepted === null) {
    return (
      <div className="flex-1 flex items-center justify-center text-cryo-muted text-xs">
        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Loading…
        </motion.span>
      </div>
    )
  }
  if (!accepted) return <AuthDisclaimer onAccept={onAccept} />

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab bar */}
      <div
        className="flex shrink-0 relative"
        style={{ borderBottom: '1px solid rgba(26,40,64,0.7)' }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="relative px-5 py-2.5 text-xs font-medium transition-colors"
            style={{ color: tab === id ? '#ffcc00' : '#4e5d6e' }}
          >
            {label}
            {tab === id && (
              <motion.div
                layoutId="pt-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: '#ffcc00', boxShadow: '0 0 6px rgba(255,204,0,0.6)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content with crossfade */}
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
            {tab === 'hash' ? <HashCracker /> : <NetworkTester />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
