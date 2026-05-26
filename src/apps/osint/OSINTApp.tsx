import { useState, useCallback } from 'react'

// ── Shared styles ─────────────────────────────────────────────────────────────

const ACCENT = '#00d4ff'

const S: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    background: 'rgba(8,12,20,0.8)',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
    fontSize: 13,
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: '7px 12px',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    outline: 'none',
    fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
  },
  btn: {
    background: ACCENT,
    border: 'none',
    borderRadius: 6,
    padding: '7px 18px',
    color: '#000',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    letterSpacing: '0.03em',
  },
  btnGhost: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    padding: '5px 12px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    cursor: 'pointer',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: '14px 16px',
  },
  label: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    marginBottom: 4,
  },
  mono: {
    fontFamily: '"JetBrains Mono",monospace',
  },
  select: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: '7px 10px',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: '10px 12px',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    outline: 'none',
    resize: 'none' as const,
    fontFamily: '"JetBrains Mono",monospace',
    lineHeight: 1.5,
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.07)',
        borderTopColor: ACCENT,
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div style={{ padding: '14px 16px', color: '#ff4466', fontSize: 12, background: 'rgba(255,68,102,0.06)', border: '1px solid rgba(255,68,102,0.15)', borderRadius: 7 }}>
      {msg}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, lineHeight: 2 }}>
      {text}
    </div>
  )
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      style={{ ...S.btnGhost, padding: '2px 8px', fontSize: 10 }}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
    >
      {copied ? '✓' : 'Copy'}
    </button>
  )
}

function formatDate(s?: string): string {
  if (!s) return '—'
  try { return new Date(s).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' } as any) } catch { return s }
}

function isIP(s: string): boolean {
  return /^[\d.]+$/.test(s) || /^[0-9a-f:]+$/i.test(s)
}

// ── Tab 1: WHOIS ──────────────────────────────────────────────────────────────

interface RdapResult {
  ldhName?: string
  unicodeName?: string
  events?: { eventAction: string; eventDate: string }[]
  entities?: { roles: string[]; vcardArray?: any[] }[]
  nameservers?: { ldhName: string }[]
  handle?: string
  startAddress?: string
  endAddress?: string
  name?: string
  country?: string
  status?: string | string[]
  [k: string]: any
}

function WhoisTab() {
  const [input, setInput] = useState('')
  const [data, setData] = useState<RdapResult | null>(null)
  const [raw, setRaw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(async () => {
    const q = input.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const url = isIP(q)
        ? `https://rdap.arin.net/registry/ip/${encodeURIComponent(q)}`
        : `https://rdap.verisign.com/com/v1/domain/${encodeURIComponent(q)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: RdapResult = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e?.message ?? 'Lookup failed')
    } finally {
      setLoading(false)
    }
  }, [input])

  const getEvent = (action: string) =>
    data?.events?.find(e => e.eventAction === action)?.eventDate ?? '—'

  const getEntityField = (role: string, fieldName: string): string => {
    const ent = data?.entities?.find(e => e.roles?.includes(role))
    if (!ent?.vcardArray) return '—'
    const fields: any[] = ent.vcardArray[1] ?? []
    const f = fields.find(([name]: any) => name === fieldName)
    return f ? (Array.isArray(f[3]) ? f[3].join(' ') : String(f[3])) : '—'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflowY: 'auto', padding: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="example.com or 8.8.8.8"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && lookup()}
        />
        <button style={S.btn} onClick={lookup} disabled={loading}>Lookup</button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg msg={error} />}
      {!loading && !error && !data && <EmptyState text="Enter a domain or IP address to retrieve WHOIS/RDAP registration data." />}

      {data && !loading && (
        <>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              style={{ ...S.btnGhost, background: raw ? 'rgba(0,212,255,0.1)' : undefined, color: raw ? ACCENT : undefined }}
              onClick={() => setRaw(r => !r)}
            >
              {raw ? 'Parsed View' : 'Raw JSON'}
            </button>
          </div>

          {raw ? (
            <pre style={{
              ...S.mono, fontSize: 11, padding: 14, background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, overflowX: 'auto',
              color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={S.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT, marginBottom: 12, ...S.mono }}>
                  {data.ldhName ?? data.name ?? input}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Handle', val: data.handle ?? '—' },
                    { label: 'Registrar', val: getEntityField('registrar', 'fn') },
                    { label: 'Registrant', val: getEntityField('registrant', 'fn') },
                    { label: 'Created', val: formatDate(getEvent('registration')) },
                    { label: 'Updated', val: formatDate(getEvent('last changed')) },
                    { label: 'Expires', val: formatDate(getEvent('expiration')) },
                    { label: 'Country', val: data.country ?? getEntityField('registrant', 'adr') },
                    { label: 'Status', val: Array.isArray(data.status) ? data.status.join(', ') : (data.status ?? '—') },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div style={S.label}>{label}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              {data.nameservers && data.nameservers.length > 0 && (
                <div style={S.card}>
                  <div style={S.label}>Nameservers</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                    {data.nameservers.map(ns => (
                      <span key={ns.ldhName} style={{ ...S.mono, fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{ns.ldhName}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Tab 2: DNS ────────────────────────────────────────────────────────────────

interface DnsAnswer {
  name: string
  type: number
  TTL: number
  data: string
}

const DNS_TYPE_NAMES: Record<number, string> = {
  1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 12: 'PTR',
  15: 'MX', 16: 'TXT', 28: 'AAAA', 33: 'SRV',
}

function DnsTab() {
  const [domain, setDomain] = useState('')
  const [type, setType] = useState('A')
  const [records, setRecords] = useState<DnsAnswer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [queried, setQueried] = useState(false)

  const lookup = useCallback(async () => {
    const q = domain.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    setRecords([])
    setQueried(true)
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.Status !== 0) throw new Error(`DNS error code ${json.Status}`)
      setRecords(json.Answer ?? json.Authority ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'DNS lookup failed')
    } finally {
      setLoading(false)
    }
  }, [domain, type])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflowY: 'auto', padding: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="domain.com"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && lookup()}
        />
        <select style={{ ...S.select, minWidth: 80 }} value={type} onChange={e => setType(e.target.value)}>
          {['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'PTR'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button style={S.btn} onClick={lookup} disabled={loading}>Resolve</button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg msg={error} />}
      {!loading && !error && !queried && <EmptyState text="Enter a domain name and select a record type to perform a DNS lookup." />}
      {!loading && !error && queried && records.length === 0 && <EmptyState text="No records found." />}

      {!loading && records.length > 0 && (
        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Name', 'TTL', 'Type', 'Value'].map(h => (
                  <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '8px 14px', ...S.mono, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{r.name}</td>
                  <td style={{ padding: '8px 14px', color: 'rgba(255,255,255,0.4)', ...S.mono, fontSize: 11 }}>{r.TTL}s</td>
                  <td style={{ padding: '8px 14px' }}>
                    <span style={{ fontSize: 11, padding: '2px 6px', background: 'rgba(0,212,255,0.1)', color: ACCENT, border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, ...S.mono }}>
                      {DNS_TYPE_NAMES[r.type] ?? String(r.type)}
                    </span>
                  </td>
                  <td style={{ padding: '8px 14px', ...S.mono, fontSize: 11, color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all' }}>{r.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Tab 3: IP Info ────────────────────────────────────────────────────────────

interface IpApiResult {
  ip?: string
  asn?: string
  org?: string
  city?: string
  region?: string
  region_code?: string
  country_name?: string
  country?: string
  latitude?: number
  longitude?: number
  timezone?: string
  is_eu?: boolean
  bogon?: boolean
  error?: boolean
  reason?: string
  [k: string]: any
}

function IpInfoTab() {
  const [input, setInput] = useState('')
  const [data, setData] = useState<IpApiResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(async () => {
    const q = input.trim() || 'json'
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`https://ipapi.co/${encodeURIComponent(q)}/json/`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: IpApiResult = await res.json()
      if (json.error) throw new Error(json.reason ?? 'IP lookup failed')
      setData(json)
    } catch (e: any) {
      setError(e?.message ?? 'Lookup failed')
    } finally {
      setLoading(false)
    }
  }, [input])

  const fields: [string, string | undefined | null][] = data ? [
    ['IP Address', data.ip],
    ['ASN', data.asn],
    ['Organization', data.org],
    ['City', data.city],
    ['Region', data.region ? `${data.region} (${data.region_code})` : undefined],
    ['Country', data.country_name ? `${data.country_name} (${data.country})` : undefined],
    ['Timezone', data.timezone],
    ['Latitude', data.latitude?.toString()],
    ['Longitude', data.longitude?.toString()],
    ['EU Member', data.is_eu != null ? String(data.is_eu) : undefined],
    ['Bogon/Reserved', data.bogon != null ? String(data.bogon) : undefined],
  ] : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflowY: 'auto', padding: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="IP address (leave blank for your IP)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && lookup()}
        />
        <button style={S.btn} onClick={lookup} disabled={loading}>Lookup</button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg msg={error} />}
      {!loading && !error && !data && <EmptyState text="Enter an IP address to get geolocation, ASN, and network information." />}

      {data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={S.card}>
            <div style={{ fontSize: 18, fontWeight: 700, color: ACCENT, marginBottom: 14, ...S.mono }}>{data.ip}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {fields.filter(([, v]) => v != null && v !== 'undefined').map(([label, val]) => (
                <div key={label}>
                  <div style={S.label}>{label}</div>
                  <div style={{ fontSize: 12, color: label === 'Bogon/Reserved' && val === 'true' ? '#ffaa00' : 'rgba(255,255,255,0.8)' }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {data.latitude != null && data.longitude != null && (
            <div style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={S.label}>Coordinates</div>
                <span style={{ ...S.mono, fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                  {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                </span>
              </div>
              <button
                style={S.btnGhost}
                onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}&zoom=12`, '_blank')}
              >
                View on Map ↗
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Tab 4: Subdomains ─────────────────────────────────────────────────────────

interface CrtShEntry {
  name_value: string
  common_name: string
  issuer_name: string
  not_before: string
}

function SubdomainsTab() {
  const [domain, setDomain] = useState('')
  const [subdomains, setSubdomains] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const find = useCallback(async () => {
    const q = domain.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    setSubdomains([])
    setSearched(true)
    try {
      const res = await fetch(`https://crt.sh/?q=%25.${encodeURIComponent(q)}&output=json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: CrtShEntry[] = await res.json()
      const names = new Set<string>()
      for (const entry of json) {
        for (const name of entry.name_value.split('\n')) {
          const n = name.trim().toLowerCase()
          if (n && (n.endsWith(`.${q.toLowerCase()}`) || n === q.toLowerCase())) {
            if (!n.startsWith('*.')) names.add(n)
          }
        }
      }
      setSubdomains(Array.from(names).sort())
    } catch (e: any) {
      setError(e?.message ?? 'crt.sh lookup failed')
    } finally {
      setLoading(false)
    }
  }, [domain])

  const exportTxt = () => {
    const blob = new Blob([subdomains.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${domain}-subdomains.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflow: 'hidden', padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="example.com"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && find()}
        />
        <button style={S.btn} onClick={find} disabled={loading}>Find</button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg msg={error} />}
      {!loading && !error && !searched && <EmptyState text="Enumerate subdomains via certificate transparency logs (crt.sh)." />}
      {!loading && !error && searched && subdomains.length === 0 && <EmptyState text="No subdomains found in certificate transparency logs." />}

      {!loading && subdomains.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {subdomains.length} unique subdomain{subdomains.length !== 1 ? 's' : ''} found
            </span>
            <button style={S.btnGhost} onClick={exportTxt}>Export .txt</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 7, alignContent: 'flex-start' }}>
            {subdomains.map(sub => (
              <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '3px 4px 3px 9px' }}>
                <span style={{ ...S.mono, fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{sub}</span>
                <CopyBtn text={sub} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Tab 5: Email Headers ──────────────────────────────────────────────────────

interface HopEntry {
  server: string
  timestamp: string
  raw: string
  suspicious: boolean
}

interface ParsedHeaders {
  from?: string
  to?: string
  subject?: string
  messageId?: string
  originatingIp?: string
  spf?: string
  dkim?: string
  dmarc?: string
  hops: HopEntry[]
}

function parseEmailHeaders(rawText: string): ParsedHeaders {
  const lines = rawText.replace(/\r\n/g, '\n').split('\n')
  const unfolded: string[] = []
  for (const line of lines) {
    if (/^\s+/.test(line) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += ' ' + line.trim()
    } else {
      unfolded.push(line)
    }
  }

  const getHeader = (name: string): string | undefined => {
    const re = new RegExp(`^${name}:\\s*(.+)$`, 'i')
    const found = unfolded.find(l => re.test(l))
    return found ? found.replace(re, '$1').trim() : undefined
  }

  const hops: HopEntry[] = []
  for (const line of unfolded) {
    if (/^Received:/i.test(line)) {
      const body = line.replace(/^Received:\s*/i, '')
      const byMatch = body.match(/from\s+([^\s;]+)/)
      const dateMatch = body.match(/;\s*(.+)$/)
      const server = byMatch?.[1] ?? body.slice(0, 40)
      const timestamp = dateMatch?.[1]?.trim() ?? ''
      const suspicious = /fail|reject|spam|blacklist/i.test(body)
      hops.push({ server, timestamp, raw: body, suspicious })
    }
  }

  const spfLine = unfolded.find(l => /^Received-SPF:/i.test(l) || /spf=/i.test(l))
  const dkimLine = unfolded.find(l => /DKIM-Signature/i.test(l) || /dkim=/i.test(l))
  const dmarcLine = unfolded.find(l => /dmarc=/i.test(l))

  const extractResult = (line?: string): string | undefined => {
    if (!line) return undefined
    const m = line.match(/\b(pass|fail|softfail|neutral|none|temperror|permerror)\b/i)
    return m?.[1]?.toUpperCase()
  }

  return {
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject'),
    messageId: getHeader('Message-ID'),
    originatingIp: getHeader('X-Originating-IP') ?? getHeader('X-Forwarded-For'),
    spf: extractResult(spfLine),
    dkim: extractResult(dkimLine),
    dmarc: extractResult(dmarcLine),
    hops: hops.reverse(),
  }
}

function authBadge(label: string, val?: string) {
  if (!val) return null
  const pass = val === 'PASS'
  const fail = ['FAIL', 'SOFTFAIL'].includes(val)
  const color = pass ? '#00ff88' : fail ? '#ff4466' : '#ffaa00'
  return (
    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: `${color}18`, color, border: `1px solid ${color}33`, fontWeight: 700, ...S.mono }}>
      {label}: {val}
    </span>
  )
}

function EmailHeadersTab() {
  const [rawInput, setRawInput] = useState('')
  const [parsed, setParsed] = useState<ParsedHeaders | null>(null)

  const analyze = () => {
    if (!rawInput.trim()) return
    setParsed(parseEmailHeaders(rawInput))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflow: 'hidden', padding: 16 }}>
      {!parsed ? (
        <>
          <textarea
            style={{ ...S.textarea, flex: 1, minHeight: 200 }}
            placeholder={"Paste raw email headers here...\n\nReceived: from mail.example.com...\nFrom: sender@example.com\nTo: recipient@example.com\n..."}
            value={rawInput}
            onChange={e => setRawInput(e.target.value)}
          />
          <button style={{ ...S.btn, alignSelf: 'flex-start' }} onClick={analyze} disabled={!rawInput.trim()}>
            Analyze Headers
          </button>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={{ ...S.btnGhost, alignSelf: 'flex-start' }} onClick={() => setParsed(null)}>
            ← Paste New Headers
          </button>

          <div style={S.card}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
              {([
                ['From', parsed.from],
                ['To', parsed.to],
                ['Subject', parsed.subject],
                ['Message-ID', parsed.messageId],
                ['Originating IP', parsed.originatingIp],
              ] as [string, string | undefined][]).filter(([, v]) => v).map(([label, val]) => (
                <div key={label}>
                  <div style={S.label}>{label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', ...S.mono, wordBreak: 'break-all' }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {authBadge('SPF', parsed.spf)}
              {authBadge('DKIM', parsed.dkim)}
              {authBadge('DMARC', parsed.dmarc)}
            </div>
          </div>

          <div>
            <div style={{ ...S.label, marginBottom: 10 }}>Received Chain ({parsed.hops.length} hops) — earliest first</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {parsed.hops.map((hop, i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 6,
                      background: hop.suspicious ? '#ff4466' : i === parsed.hops.length - 1 ? ACCENT : 'rgba(255,255,255,0.2)',
                      boxShadow: hop.suspicious ? '0 0 6px rgba(255,68,102,0.5)' : i === parsed.hops.length - 1 ? `0 0 6px ${ACCENT}66` : undefined,
                    }} />
                    {i < parsed.hops.length - 1 && (
                      <div style={{ flex: 1, width: 1, background: 'rgba(255,255,255,0.08)', marginTop: 2 }} />
                    )}
                  </div>
                  <div style={{
                    flex: 1,
                    background: hop.suspicious ? 'rgba(255,68,102,0.07)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${hop.suspicious ? 'rgba(255,68,102,0.25)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 6,
                    padding: '8px 12px',
                    marginBottom: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <span style={{ ...S.mono, fontSize: 12, fontWeight: 600, color: hop.suspicious ? '#ff4466' : 'rgba(255,255,255,0.85)' }}>
                        {hop.server}
                      </span>
                      {hop.suspicious && (
                        <span style={{ fontSize: 10, color: '#ff4466', fontWeight: 700, letterSpacing: '0.07em' }}>SUSPICIOUS</span>
                      )}
                    </div>
                    {hop.timestamp && (
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', ...S.mono }}>{hop.timestamp}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

type TabId = 'whois' | 'dns' | 'ipinfo' | 'subdomains' | 'emailheaders'

const TABS: { id: TabId; label: string }[] = [
  { id: 'whois', label: 'WHOIS' },
  { id: 'dns', label: 'DNS' },
  { id: 'ipinfo', label: 'IP Info' },
  { id: 'subdomains', label: 'Subdomains' },
  { id: 'emailheaders', label: 'Email Headers' },
]

// ── Main App ──────────────────────────────────────────────────────────────────

export default function OSINTApp() {
  const [tab, setTab] = useState<TabId>('whois')

  return (
    <div style={S.root}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
        flexShrink: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? `2px solid ${ACCENT}` : '2px solid transparent',
              color: tab === t.id ? ACCENT : 'rgba(255,255,255,0.45)',
              padding: '11px 18px',
              fontSize: 12,
              fontWeight: tab === t.id ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'whois' && <WhoisTab />}
        {tab === 'dns' && <DnsTab />}
        {tab === 'ipinfo' && <IpInfoTab />}
        {tab === 'subdomains' && <SubdomainsTab />}
        {tab === 'emailheaders' && <EmailHeadersTab />}
      </div>
    </div>
  )
}
