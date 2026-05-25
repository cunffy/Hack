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

  // ── PIN state ────────────────────────────────────────────────────────────
  const [pinEnabled, setPinEnabled]   = useState(false)
  const [pinSet, setPinSet]           = useState(false)
  const [pinMode, setPinMode]         = useState<'none' | 'set' | 'change' | 'remove'>('none')
  const [newPin, setNewPin]           = useState('')
  const [confirmPin, setConfirmPin]   = useState('')
  const [currentPin, setCurrentPin]   = useState('')
  const [pinMsg, setPinMsg]           = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    window.cryogram.settings.getAll().then((all) => {
      setVals({
        hibpApiKey:    (all.hibpApiKey    as string) || '',
        dehashedEmail: (all.dehashedEmail as string) || '',
        dehashedApiKey:(all.dehashedApiKey as string) || '',
        workspace:     (all.workspace     as string) || '',
      })
      setPinEnabled(!!(all['pin.enabled'] as boolean))
      setPinSet(!!(all['pin.hash'] as string))
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
    if (path) setVals(v => ({ ...v, workspace: path }))
  }

  // ── PIN helpers ──────────────────────────────────────────────────────────
  const flash = (text: string, ok: boolean) => {
    setPinMsg({ text, ok })
    setTimeout(() => setPinMsg(null), 3000)
  }

  const resetPinForm = () => {
    setNewPin(''); setConfirmPin(''); setCurrentPin('')
    setPinMode('none')
  }

  const handleTogglePinEnabled = async (checked: boolean) => {
    if (checked && !pinSet) {
      // Can't enable without setting a PIN first
      setPinMode('set')
      return
    }
    await (window.cryogram as any).system.setPinEnabled(checked)
    await window.cryogram.settings.set('pin.enabled', checked)
    setPinEnabled(checked)
    flash(checked ? 'PIN lock enabled' : 'PIN lock disabled', true)
  }

  const handleSetPin = async () => {
    if (newPin.length < 4) { flash('PIN must be at least 4 digits', false); return }
    if (!/^[0-9]+$/.test(newPin)) { flash('PIN must contain only digits', false); return }
    if (newPin !== confirmPin) { flash('PINs do not match', false); return }

    const result: any = await (window.cryogram as any).system.setPin(
      newPin,
      pinSet ? currentPin : undefined
    )
    if (result?.success) {
      setPinSet(true)
      setPinEnabled(true)
      await window.cryogram.settings.set('pin.enabled', true)
      flash(pinSet ? 'PIN changed' : 'PIN set — lock screen enabled', true)
      resetPinForm()
    } else {
      flash(result?.error || 'Failed to set PIN', false)
    }
  }

  const handleRemovePin = async () => {
    const result: any = await (window.cryogram as any).system.removePin(currentPin)
    if (result?.success) {
      setPinSet(false)
      setPinEnabled(false)
      flash('PIN removed — lock screen disabled', true)
      resetPinForm()
    } else {
      flash(result?.error || 'Failed to remove PIN', false)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto p-5 gap-5">
      <div>
        <h2 className="text-sm font-bold text-cryo-text mb-1">Settings</h2>
        <p className="text-xs text-cryo-muted">API keys are stored encrypted on your local machine.</p>
      </div>

      {/* ── Security & Lock Screen ──────────────────────────────────────────── */}
      <section className="panel p-4 space-y-4">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Security &amp; Lock Screen</div>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-cryo-text">PIN Lock</div>
            <div className="text-xs text-cryo-muted">
              {pinSet
                ? pinEnabled ? 'Locks on boot, resume & manual lock' : 'PIN is set but currently disabled'
                : 'Set a PIN to enable the lock screen'}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={pinEnabled}
              onChange={e => handleTogglePinEnabled(e.target.checked)}
            />
            <div className="w-11 h-6 rounded-full peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:transition-all"
              style={{
                background: pinEnabled ? '#00d4ff' : 'rgba(255,255,255,0.15)',
                transition: 'background 0.2s',
              }}
            >
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ transform: pinEnabled ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
            </div>
          </label>
        </div>

        {/* PIN status + actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: pinSet ? '#00ff88' : 'rgba(255,255,255,0.2)' }} />
            <span className="text-xs" style={{ color: pinSet ? '#00ff88' : 'rgba(255,255,255,0.35)', fontFamily: '"JetBrains Mono", monospace' }}>
              {pinSet ? 'PIN is set' : 'No PIN set'}
            </span>
          </div>
          <div className="flex gap-2 ml-auto">
            {!pinSet ? (
              <button className="btn text-xs py-1 px-3" onClick={() => setPinMode('set')}>Set PIN</button>
            ) : (
              <>
                <button className="btn text-xs py-1 px-3" onClick={() => setPinMode('change')}>Change PIN</button>
                <button className="btn text-xs py-1 px-3" style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }} onClick={() => setPinMode('remove')}>Remove PIN</button>
              </>
            )}
          </div>
        </div>

        {/* PIN form */}
        {pinMode !== 'none' && (
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {pinMode === 'set' ? 'Set New PIN' : pinMode === 'change' ? 'Change PIN' : 'Remove PIN'}
            </div>

            {(pinMode === 'change' || pinMode === 'remove') && (
              <div>
                <label className="block text-xs text-cryo-muted mb-1">Current PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  className="w-full"
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={e => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                />
              </div>
            )}

            {pinMode !== 'remove' && (
              <>
                <div>
                  <label className="block text-xs text-cryo-muted mb-1">New PIN <span style={{ color: 'rgba(255,255,255,0.3)' }}>(4–8 digits)</span></label>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    className="w-full"
                    placeholder="4–8 digit PIN"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-cryo-muted mb-1">Confirm New PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    className="w-full"
                    placeholder="Repeat PIN"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-1">
              {pinMode === 'remove' ? (
                <button
                  className="btn text-xs py-1 px-3"
                  style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
                  onClick={handleRemovePin}
                >
                  Confirm Remove
                </button>
              ) : (
                <button className="btn btn-primary text-xs py-1 px-3" onClick={handleSetPin}>
                  {pinMode === 'set' ? 'Set PIN' : 'Change PIN'}
                </button>
              )}
              <button className="btn text-xs py-1 px-3" onClick={resetPinForm}>Cancel</button>
            </div>
          </div>
        )}

        {/* Feedback message */}
        {pinMsg && (
          <div className="text-xs py-1.5 px-3 rounded-lg" style={{
            background: pinMsg.ok ? 'rgba(0,255,136,0.08)' : 'rgba(248,113,113,0.1)',
            border: `1px solid ${pinMsg.ok ? 'rgba(0,255,136,0.2)' : 'rgba(248,113,113,0.2)'}`,
            color: pinMsg.ok ? '#00ff88' : '#f87171',
            fontFamily: '-apple-system, sans-serif',
          }}>
            {pinMsg.text}
          </div>
        )}
      </section>

      {/* ── Have I Been Pwned ───────────────────────────────────────────────── */}
      <section className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Have I Been Pwned (Leaker)</div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1">API Key</label>
          <input
            type="password"
            className="w-full"
            placeholder="hibp-api-key"
            value={vals.hibpApiKey}
            onChange={e => setVals(v => ({ ...v, hibpApiKey: e.target.value }))}
          />
          <p className="text-xs text-cryo-muted mt-1">Required for email breach lookups</p>
        </div>
      </section>

      {/* ── Dehashed ───────────────────────────────────────────────────────── */}
      <section className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Dehashed (Leaker)</div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1">Account Email</label>
          <input
            className="w-full"
            placeholder="your@email.com"
            value={vals.dehashedEmail}
            onChange={e => setVals(v => ({ ...v, dehashedEmail: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1">API Key</label>
          <input
            type="password"
            className="w-full"
            placeholder="dehashed-api-key"
            value={vals.dehashedApiKey}
            onChange={e => setVals(v => ({ ...v, dehashedApiKey: e.target.value }))}
          />
        </div>
      </section>

      {/* ── Code Editor Workspace ───────────────────────────────────────────── */}
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
