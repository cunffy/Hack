import { useState, useEffect } from 'react'
import { SearchView } from './SearchView'
import { HostDetail } from './HostDetail'

export default function ShodanApp() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [keyInput, setKeyInput] = useState('')
  const [selectedHost, setSelectedHost] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    window.cyberden.settings.get('shodanApiKey').then((k) => {
      setApiKey((k as string) || null)
    })
  }, [])

  const saveKey = async () => {
    setSaving(true)
    await window.cyberden.settings.set('shodanApiKey', keyInput.trim())
    setApiKey(keyInput.trim())
    setSaving(false)
  }

  if (!apiKey) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="panel max-w-md w-full p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">👁</span>
            <h2 className="font-bold text-den-accent">Shodan API Key Required</h2>
          </div>
          <p className="text-xs text-den-muted mb-4 leading-relaxed">
            Enter your Shodan API key to enable internet intelligence lookups.
            Get one at <span className="text-den-accent">shodan.io</span>.
            Keys are stored encrypted on your local machine.
          </p>
          <div className="flex gap-2">
            <input
              className="flex-1"
              type="password"
              placeholder="your-shodan-api-key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && keyInput && saveKey()}
            />
            <button className="btn btn-primary" onClick={saveKey} disabled={!keyInput || saving}>
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className={`flex flex-col ${selectedHost ? 'w-1/2 border-r border-den-border' : 'flex-1'} overflow-hidden`}>
        <SearchView onSelectHost={setSelectedHost} />
      </div>
      {selectedHost && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <HostDetail ip={selectedHost} onClose={() => setSelectedHost(null)} />
        </div>
      )}
    </div>
  )
}
