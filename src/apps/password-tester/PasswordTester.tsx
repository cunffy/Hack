import { useState, useEffect } from 'react'
import { AuthDisclaimer } from './AuthDisclaimer'
import { HashCracker } from './HashCracker'
import { NetworkTester } from './NetworkTester'

type Tab = 'hash' | 'network'

export default function PasswordTester() {
  const [accepted, setAccepted] = useState<boolean | null>(null)
  const [tab, setTab] = useState<Tab>('hash')

  useEffect(() => {
    window.cyberden.settings.get('ptDisclaimerAccepted').then((val) => {
      if (!val) { setAccepted(false); return }
      const acceptedDate = new Date(val as string)
      const daysSince = (Date.now() - acceptedDate.getTime()) / (1000 * 60 * 60 * 24)
      setAccepted(daysSince < 90)
    })
  }, [])

  const onAccept = async () => {
    await window.cyberden.settings.set('ptDisclaimerAccepted', new Date().toISOString())
    setAccepted(true)
  }

  if (accepted === null) return <div className="flex-1 flex items-center justify-center text-den-muted">Loading...</div>
  if (!accepted) return <AuthDisclaimer onAccept={onAccept} />

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-den-border shrink-0">
        {([['hash', 'Hash Cracker'], ['network', 'Network Tester']] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
              tab === id
                ? 'border-den-accent text-den-accent'
                : 'border-transparent text-den-muted hover:text-den-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'hash' ? <HashCracker /> : <NetworkTester />}
      </div>
    </div>
  )
}
