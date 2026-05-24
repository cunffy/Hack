import { useState, useEffect } from 'react'

interface SettingsValues {
  hibpApiKey: string
  dehashedEmail: string
  dehashedApiKey: string
  workspace: string
}

export default function SettingsApp() {
  const [vals, setVals] = useState<SettingsValues>({
    hibpApiKey: '',
    dehashedEmail: '',
    dehashedApiKey: '',
    workspace: '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    window.cryogram.settings.getAll().then((all) => {
      setVals({
        hibpApiKey: (all.hibpApiKey as string) || '',
        dehashedEmail: (all.dehashedEmail as string) || '',
        dehashedApiKey: (all.dehashedApiKey as string) || '',
        workspace: (all.workspace as string) || '',
      })
    })
  }, [])

  const save = async () => {
    for (const [key, value] of Object.entries(vals)) {
      await window.cryogram.settings.set(key, value)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const openWorkspace = async () => {
    const path = await window.cryogram.fs.openDialog()
    if (path) setVals((v) => ({ ...v, workspace: path }))
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto p-5 gap-5">
      <div>
        <h2 className="text-sm font-bold text-cryo-text mb-1">Settings</h2>
        <p className="text-xs text-cryo-muted">API keys are stored encrypted on your local machine.</p>
      </div>

      <section className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Have I Been Pwned (Leaker)</div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1">API Key</label>
          <input
            type="password"
            className="w-full"
            placeholder="hibp-api-key"
            value={vals.hibpApiKey}
            onChange={(e) => setVals((v) => ({ ...v, hibpApiKey: e.target.value }))}
          />
          <p className="text-xs text-cryo-muted mt-1">Required for email breach lookups</p>
        </div>
      </section>

      <section className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Dehashed (Leaker)</div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1">Account Email</label>
          <input
            className="w-full"
            placeholder="your@email.com"
            value={vals.dehashedEmail}
            onChange={(e) => setVals((v) => ({ ...v, dehashedEmail: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1">API Key</label>
          <input
            type="password"
            className="w-full"
            placeholder="dehashed-api-key"
            value={vals.dehashedApiKey}
            onChange={(e) => setVals((v) => ({ ...v, dehashedApiKey: e.target.value }))}
          />
        </div>
      </section>

      <section className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Code Editor Workspace</div>
        <div className="flex gap-2">
          <input
            className="flex-1 text-cryo-muted"
            readOnly
            value={vals.workspace || 'Not set — defaults to ~/Documents/Cryogram/workspace'}
          />
          <button className="btn" onClick={openWorkspace}>Browse</button>
        </div>
      </section>

      <button className="btn btn-primary w-fit" onClick={save}>
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </div>
  )
}
