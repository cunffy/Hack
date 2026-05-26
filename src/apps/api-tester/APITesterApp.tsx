import { useState, useRef, useEffect, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

interface KeyValue { key: string; value: string; enabled: boolean }
interface SavedRequest {
  id: string; name: string; method: string; url: string
  params: KeyValue[]; headers: KeyValue[]; body: string; contentType: string
  authType: 'none' | 'bearer' | 'basic'; bearerToken: string; basicUser: string; basicPass: string
}
interface Collection { id: string; name: string; requests: SavedRequest[] }
interface ResponseData {
  status: number; statusText: string; time: number; size: number
  body: string; headers: Record<string, string>; error?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCENT = '#00d4ff'
const ipc = (window as any).cryogram

const METHOD_COLORS: Record<string, string> = {
  GET: '#00ff88', POST: '#00d4ff', PUT: '#ffaa00',
  PATCH: '#bb88ff', DELETE: '#ff4466',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function genId() { return `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` }

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

function statusColor(s: number) {
  if (s < 300) return '#00ff88'
  if (s < 400) return '#00d4ff'
  if (s < 500) return '#ffaa00'
  return '#ff4466'
}

function tryPretty(body: string): string {
  try { return JSON.stringify(JSON.parse(body), null, 2) } catch { return body }
}

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', height: '100%', overflow: 'hidden', background: 'rgba(10,14,22,0.94)', color: 'rgba(255,255,255,0.85)', fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 13 },
  sidebar: { width: 200, minWidth: 200, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  bottom: { height: 280, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' },
  input: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '6px 10px', color: 'rgba(255,255,255,0.85)', fontSize: 12, outline: 'none', width: '100%' } as React.CSSProperties,
}

function tabStyle(active: boolean): React.CSSProperties {
  return { padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: active ? ACCENT : 'rgba(255,255,255,0.45)', background: 'none', border: 'none', borderBottom: active ? `2px solid ${ACCENT}` : '2px solid transparent' }
}

// ── KV Grid ───────────────────────────────────────────────────────────────────

function KVGrid({ rows, onChange }: { rows: KeyValue[]; onChange: (r: KeyValue[]) => void }) {
  const update = (i: number, f: keyof KeyValue, v: string | boolean) => {
    const next = rows.map((r, idx) => idx === i ? { ...r, [f]: v } : r)
    onChange(next)
  }
  const addRow = () => onChange([...rows, { key: '', value: '', enabled: true }])
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i))
  return (
    <div style={{ padding: '8px 12px', flex: 1, overflowY: 'auto' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={row.enabled} onChange={e => update(i, 'enabled', e.target.checked)} style={{ width: 14, height: 14, accentColor: ACCENT, flexShrink: 0 }} />
          <input placeholder="Key" value={row.key} onChange={e => update(i, 'key', e.target.value)} style={{ ...S.input, flex: 1, fontFamily: '"JetBrains Mono",monospace', fontSize: 11 }} />
          <input placeholder="Value" value={row.value} onChange={e => update(i, 'value', e.target.value)} style={{ ...S.input, flex: 1, fontFamily: '"JetBrains Mono",monospace', fontSize: 11 }} />
          <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#ff4466', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>✕</button>
        </div>
      ))}
      <button className="btn" onClick={addRow} style={{ fontSize: 11, padding: '4px 10px' }}>+ Add Row</button>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function APITesterApp() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [params, setParams] = useState<KeyValue[]>([{ key: '', value: '', enabled: true }])
  const [headers, setHeaders] = useState<KeyValue[]>([{ key: 'Content-Type', value: 'application/json', enabled: true }])
  const [body, setBody] = useState('')
  const [contentType, setContentType] = useState('application/json')
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic'>('none')
  const [bearerToken, setBearerToken] = useState('')
  const [basicUser, setBasicUser] = useState('')
  const [basicPass, setBasicPass] = useState('')
  const [reqTab, setReqTab] = useState<'params' | 'headers' | 'body' | 'auth'>('params')
  const [resTab, setResTab] = useState<'body' | 'headers' | 'info'>('body')
  const [response, setResponse] = useState<ResponseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [saveModal, setSaveModal] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveCollection, setSaveCollection] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const raw = ipc?.settings?.get?.('apitester.collections')
    if (raw) try { setCollections(JSON.parse(raw)) } catch {}
  }, [])

  const persistCollections = (cols: Collection[]) => {
    setCollections(cols)
    ipc?.settings?.set?.('apitester.collections', JSON.stringify(cols))
  }

  const loadRequest = (req: SavedRequest) => {
    setMethod(req.method); setUrl(req.url); setParams(req.params)
    setHeaders(req.headers); setBody(req.body); setContentType(req.contentType)
    setAuthType(req.authType); setBearerToken(req.bearerToken)
    setBasicUser(req.basicUser); setBasicPass(req.basicPass)
  }

  const sendRequest = useCallback(async () => {
    if (!url) return
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setTimeout(() => ctrl.abort(), 30000)
    setLoading(true); setResponse(null)
    const t0 = performance.now()
    try {
      const hdrs: Record<string, string> = {}
      headers.filter(h => h.enabled && h.key).forEach(h => { hdrs[h.key] = h.value })
      if (authType === 'bearer' && bearerToken) hdrs['Authorization'] = `Bearer ${bearerToken}`
      if (authType === 'basic' && basicUser) hdrs['Authorization'] = `Basic ${btoa(`${basicUser}:${basicPass}`)}`
      let queryUrl = url
      const enabledParams = params.filter(p => p.enabled && p.key)
      if (enabledParams.length) {
        const qs = new URLSearchParams(enabledParams.map(p => [p.key, p.value])).toString()
        queryUrl += (url.includes('?') ? '&' : '?') + qs
      }
      const opts: RequestInit = { method, headers: hdrs, signal: ctrl.signal }
      if (!['GET', 'HEAD'].includes(method) && body) opts.body = body
      const res = await fetch(queryUrl, opts)
      const elapsed = Math.round(performance.now() - t0)
      const text = await res.text()
      const resHeaders: Record<string, string> = {}
      res.headers.forEach((v, k) => { resHeaders[k] = v })
      setResponse({ status: res.status, statusText: res.statusText, time: elapsed, size: new TextEncoder().encode(text).length, body: text, headers: resHeaders })
    } catch (e: any) {
      const elapsed = Math.round(performance.now() - t0)
      setResponse({ status: 0, statusText: 'Error', time: elapsed, size: 0, body: '', headers: {}, error: e.message })
    } finally { setLoading(false) }
  }, [url, method, headers, params, body, authType, bearerToken, basicUser, basicPass])

  const saveRequest = () => {
    if (!saveName) return
    const req: SavedRequest = { id: genId(), name: saveName, method, url, params, headers, body, contentType, authType, bearerToken, basicUser, basicPass }
    let cols = [...collections]
    let col = cols.find(c => c.name === saveCollection)
    if (!col) { col = { id: genId(), name: saveCollection || 'Default', requests: [] }; cols.push(col) }
    col.requests = [...col.requests, req]
    persistCollections(cols)
    setSaveModal(false); setSaveName(''); setSaveCollection('')
  }

  const copyBody = () => { if (response?.body) navigator.clipboard.writeText(tryPretty(response.body)) }

  const REQ_TABS = ['params', 'headers', 'body', 'auth'] as const
  const RES_TABS = ['body', 'headers', 'info'] as const

  return (
    <div style={S.root}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: 11 }} onClick={() => { setMethod('GET'); setUrl(''); setParams([{ key: '', value: '', enabled: true }]); setHeaders([{ key: '', value: '', enabled: true }]); setBody('') }}>
            + New Request
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {collections.length === 0 && <div style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>No collections yet</div>}
          {collections.map(col => (
            <div key={col.id}>
              <div style={{ padding: '6px 14px', fontSize: 11, color: ACCENT, fontWeight: 600, letterSpacing: '0.05em' }}>{col.name}</div>
              {col.requests.map(req => (
                <div key={req.id} onClick={() => loadRequest(req)} style={{ padding: '5px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: METHOD_COLORS[req.method] || '#fff', minWidth: 36 }}>{req.method}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Center + Bottom */}
      <div style={S.center}>
        {/* URL Bar */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={method} onChange={e => setMethod(e.target.value)} style={{ ...S.input, width: 90, color: METHOD_COLORS[method] || '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
            {['GET','POST','PUT','PATCH','DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendRequest()} placeholder="https://api.example.com/endpoint" style={{ ...S.input, fontFamily: '"JetBrains Mono",monospace', fontSize: 12, flex: 1 }} />
          <button className="btn btn-primary" onClick={sendRequest} disabled={loading} style={{ minWidth: 70, fontSize: 12 }}>
            {loading ? <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#080c12', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : 'Send'}
          </button>
          <button className="btn" onClick={() => setSaveModal(true)} style={{ fontSize: 12 }}>Save</button>
        </div>

        {/* Request Tabs */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '0 14px' }}>
          {REQ_TABS.map(t => (
            <button key={t} onClick={() => setReqTab(t)} style={tabStyle(reqTab === t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Request Tab Body */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {reqTab === 'params' && <KVGrid rows={params} onChange={setParams} />}
          {reqTab === 'headers' && <KVGrid rows={headers} onChange={setHeaders} />}
          {reqTab === 'body' && (
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Content-Type:</span>
                <input value={contentType} onChange={e => setContentType(e.target.value)} style={{ ...S.input, width: 220, fontSize: 11 }} />
              </div>
              <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Request body..." style={{ ...S.input, flex: 1, resize: 'none', fontFamily: '"JetBrains Mono",monospace', fontSize: 11, lineHeight: 1.6 }} />
            </div>
          )}
          {reqTab === 'auth' && (
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['none','bearer','basic'] as const).map(a => (
                  <label key={a} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: authType === a ? ACCENT : 'rgba(255,255,255,0.6)' }}>
                    <input type="radio" checked={authType === a} onChange={() => setAuthType(a)} style={{ accentColor: ACCENT }} />
                    {a === 'none' ? 'None' : a === 'bearer' ? 'Bearer Token' : 'Basic Auth'}
                  </label>
                ))}
              </div>
              {authType === 'bearer' && <input value={bearerToken} onChange={e => setBearerToken(e.target.value)} placeholder="Token" style={{ ...S.input, fontFamily: '"JetBrains Mono",monospace', fontSize: 11 }} />}
              {authType === 'basic' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={basicUser} onChange={e => setBasicUser(e.target.value)} placeholder="Username" style={{ ...S.input, flex: 1 }} />
                  <input type="password" value={basicPass} onChange={e => setBasicPass(e.target.value)} placeholder="Password" style={{ ...S.input, flex: 1 }} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div style={S.bottom}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Response</span>
            {response && !response.error && (
              <>
                <span style={{ fontSize: 12, fontWeight: 700, color: statusColor(response.status) }}>{response.status} {response.statusText}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{response.time}ms</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{formatSize(response.size)}</span>
              </>
            )}
            {response?.error && <span style={{ fontSize: 12, color: '#ff4466' }}>{response.error}</span>}
            <div style={{ flex: 1 }} />
            {RES_TABS.map(t => <button key={t} onClick={() => setResTab(t)} style={tabStyle(resTab === t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
            {response?.body && <button className="btn" onClick={copyBody} style={{ fontSize: 11, padding: '4px 10px' }}>Copy</button>}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
            {!response && !loading && <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, padding: 8 }}>Send a request to see the response</div>}
            {loading && <div style={{ color: ACCENT, fontSize: 12, padding: 8 }}>Loading...</div>}
            {response && resTab === 'body' && (
              <pre style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {tryPretty(response.body) || <span style={{ color: 'rgba(255,255,255,0.3)' }}>(empty body)</span>}
              </pre>
            )}
            {response && resTab === 'headers' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: '"JetBrains Mono",monospace' }}>
                <tbody>
                  {Object.entries(response.headers).map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '4px 8px', color: ACCENT, width: '35%' }}>{k}</td>
                      <td style={{ padding: '4px 8px', color: 'rgba(255,255,255,0.7)', wordBreak: 'break-all' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {response && resTab === 'info' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', fontSize: 12 }}>
                {[['Method', method], ['URL', url], ['Status', `${response.status} ${response.statusText}`], ['Time', `${response.time}ms`], ['Size', formatSize(response.size)]].map(([k, v]) => (
                  <>
                    <span key={`k-${k}`} style={{ color: 'rgba(255,255,255,0.45)' }}>{k}</span>
                    <span key={`v-${k}`} style={{ color: 'rgba(255,255,255,0.8)', fontFamily: '"JetBrains Mono",monospace' }}>{v}</span>
                  </>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {saveModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="panel" style={{ width: 340, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Save Request</div>
            <input placeholder="Request name" value={saveName} onChange={e => setSaveName(e.target.value)} style={S.input} />
            <input placeholder="Collection name (default: Default)" value={saveCollection} onChange={e => setSaveCollection(e.target.value)} style={S.input} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setSaveModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveRequest}>Save</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
