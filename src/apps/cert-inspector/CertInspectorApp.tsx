import { useState, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

interface CertInfo {
  subject: { CN?: string; O?: string; C?: string; [k: string]: string | undefined }
  issuer: { CN?: string; O?: string; C?: string; [k: string]: string | undefined }
  validFrom: string
  validTo: string
  daysRemaining: number
  sans: string[]
  publicKey: { algorithm: string; bits?: number; curve?: string }
  fingerprints: { sha256: string; sha1?: string }
  serialNumber: string
  signatureAlgorithm: string
  isCA: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ACCENT = '#00d4ff'
const ipc = (window as any).cryogram

function formatDate(s: string): string {
  try { return new Date(s).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' } as any) } catch { return s }
}

function validityColor(days: number): string {
  if (days < 0) return '#ff4466'
  if (days <= 30) return '#ffaa00'
  return '#00ff88'
}

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'rgba(10,14,22,0.94)', color: 'rgba(255,255,255,0.85)', fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 13 },
  input: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '7px 12px', color: 'rgba(255,255,255,0.85)', fontSize: 12, outline: 'none' } as React.CSSProperties,
  label: { fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 4 },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 16px' },
}

// ── Field Row ─────────────────────────────────────────────────────────────────

function Field({ label, value, mono, accent, action }: { label: string; value: React.ReactNode; mono?: boolean; accent?: boolean; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={S.label}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: accent ? ACCENT : 'rgba(255,255,255,0.8)', fontFamily: mono ? '"JetBrains Mono",monospace' : 'inherit', wordBreak: 'break-all' }}>{value}</span>
        {action}
      </div>
    </div>
  )
}

// ── Validity Bar ──────────────────────────────────────────────────────────────

function ValidityBar({ cert }: { cert: CertInfo }) {
  const color = validityColor(cert.daysRemaining)
  const from = new Date(cert.validFrom).getTime()
  const to = new Date(cert.validTo).getTime()
  const now = Date.now()
  const pct = Math.max(0, Math.min(100, ((now - from) / (to - from)) * 100))
  const label = cert.daysRemaining < 0 ? 'EXPIRED' : cert.daysRemaining <= 30 ? 'EXPIRING SOON' : 'VALID'
  return (
    <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: 12, color, fontFamily: '"JetBrains Mono",monospace' }}>
          {cert.daysRemaining < 0 ? `${Math.abs(cert.daysRemaining)} days ago` : `${cert.daysRemaining} days remaining`}
        </span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: color, width: `${pct}%`, boxShadow: `0 0 8px ${color}66`, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
        <span>{formatDate(cert.validFrom)}</span>
        <span>{formatDate(cert.validTo)}</span>
      </div>
    </div>
  )
}

// ── SAN Chips ─────────────────────────────────────────────────────────────────

function SANChips({ sans }: { sans: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {sans.map((san, i) => (
        <span key={i} style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, padding: '2px 8px', fontSize: 11, color: ACCENT, fontFamily: '"JetBrains Mono",monospace' }}>{san}</span>
      ))}
    </div>
  )
}

// ── Result View ───────────────────────────────────────────────────────────────

function CertResult({ cert }: { cert: CertInfo }) {
  const copy = (s: string) => navigator.clipboard.writeText(s)
  const pkLabel = `${cert.publicKey?.algorithm}${cert.publicKey?.bits ? ` ${cert.publicKey.bits}-bit` : cert.publicKey?.curve ? ` (${cert.publicKey.curve})` : ''}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 16px', overflowY: 'auto', flex: 1 }}>
      <ValidityBar cert={cert} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={S.card}>
          <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Subject</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Field label="Common Name" value={cert.subject?.CN || '—'} />
            {cert.subject?.O && <Field label="Organization" value={cert.subject.O} />}
            {cert.subject?.C && <Field label="Country" value={cert.subject.C} />}
          </div>
        </div>
        <div style={S.card}>
          <div style={{ fontSize: 11, color: '#bb88ff', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Issuer</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Field label="Common Name" value={cert.issuer?.CN || '—'} />
            {cert.issuer?.O && <Field label="Organization" value={cert.issuer.O} />}
            {cert.issuer?.C && <Field label="Country" value={cert.issuer.C} />}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Technical Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Signature Algorithm" value={cert.signatureAlgorithm} mono />
          <Field label="Public Key" value={pkLabel} mono />
          <Field label="Serial Number" value={cert.serialNumber} mono />
          <Field label="Certificate Authority" value={
            <span style={{ background: cert.isCA ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${cert.isCA ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 4, padding: '1px 7px', fontSize: 11, color: cert.isCA ? ACCENT : 'rgba(255,255,255,0.4)' }}>
              {cert.isCA ? 'Yes' : 'No'}
            </span>
          } />
        </div>
      </div>

      <div style={S.card}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Fingerprint SHA-256</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <code style={{ fontSize: 11, fontFamily: '"JetBrains Mono",monospace', color: 'rgba(255,255,255,0.7)', wordBreak: 'break-all', flex: 1 }}>{cert.fingerprints?.sha256}</code>
          <button className="btn" onClick={() => copy(cert.fingerprints?.sha256)} style={{ fontSize: 11, padding: '4px 10px', flexShrink: 0 }}>Copy</button>
        </div>
        {cert.fingerprints?.sha1 && (
          <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: '"JetBrains Mono",monospace' }}>SHA-1: {cert.fingerprints.sha1}</div>
        )}
      </div>

      {cert.sans?.length > 0 && (
        <div style={S.card}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Subject Alternative Names ({cert.sans.length})</div>
          <SANChips sans={cert.sans} />
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CertInspectorApp() {
  const [activeTab, setActiveTab] = useState<'domain' | 'pem'>('domain')
  const [host, setHost] = useState('')
  const [port, setPort] = useState('443')
  const [pem, setPem] = useState('')
  const [cert, setCert] = useState<CertInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const inspect = useCallback(async () => {
    if (!host.trim()) return
    setLoading(true); setError(null); setCert(null)
    try {
      const res = await ipc?.cert?.inspect?.(host.trim(), parseInt(port) || 443)
      if (res?.error) { setError(res.error); return }
      setCert(res)
    } catch (e: any) { setError(e.message || 'Inspection failed') } finally { setLoading(false) }
  }, [host, port])

  const decodePem = useCallback(async () => {
    if (!pem.trim()) return
    setLoading(true); setError(null); setCert(null)
    try {
      const res = await ipc?.cert?.parsePem?.(pem.trim())
      if (res?.error) { setError(res.error); return }
      setCert(res)
    } catch (e: any) { setError(e.message || 'Decode failed') } finally { setLoading(false) }
  }, [pem])

  return (
    <div style={S.root}>
      {/* Tabs */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 14px', display: 'flex', gap: 2 }}>
        {(['domain', 'pem'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: activeTab === t ? ACCENT : 'rgba(255,255,255,0.45)', borderBottom: activeTab === t ? `2px solid ${ACCENT}` : '2px solid transparent', transition: 'all 0.15s' }}>
            {t === 'domain' ? 'Domain' : 'PEM Paste'}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {activeTab === 'domain' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={host} onChange={e => setHost(e.target.value)} onKeyDown={e => e.key === 'Enter' && inspect()} placeholder="example.com" style={{ ...S.input, flex: 1 }} />
            <input value={port} onChange={e => setPort(e.target.value)} placeholder="443" style={{ ...S.input, width: 70 }} />
            <button className="btn btn-primary" onClick={inspect} disabled={loading || !host.trim()} style={{ fontSize: 12 }}>{loading ? 'Inspecting...' : 'Inspect'}</button>
          </div>
        )}
        {activeTab === 'pem' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <textarea value={pem} onChange={e => setPem(e.target.value)} placeholder="-----BEGIN CERTIFICATE-----" style={{ ...S.input, flex: 1, height: 80, resize: 'none', fontFamily: '"JetBrains Mono",monospace', fontSize: 11, lineHeight: 1.5 }} />
            <button className="btn btn-primary" onClick={decodePem} disabled={loading || !pem.trim()} style={{ fontSize: 12, alignSelf: 'flex-end' }}>{loading ? 'Decoding...' : 'Decode'}</button>
          </div>
        )}
      </div>

      {/* Result */}
      {error && (
        <div style={{ margin: '14px 16px', padding: '12px 16px', background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.25)', borderRadius: 8, color: '#ff6680', fontSize: 12, fontFamily: '"JetBrains Mono",monospace' }}>
          {error}
        </div>
      )}
      {!cert && !error && !loading && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(255,255,255,0.25)' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{ fontSize: 13 }}>Enter a domain or paste a PEM certificate</span>
        </div>
      )}
      {cert && <CertResult cert={cert} />}
    </div>
  )
}
