import { useState, useEffect, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ShodanHost {
  ip_str: string
  hostnames: string[]
  ports: number[]
  org?: string
  isp?: string
  country_code?: string
  country_name?: string
  os?: string
  last_update?: string
  city?: string
  asn?: string
  vulns?: string[]
  tags?: string[]
}

interface ShodanSearchResult {
  matches: ShodanHost[]
  total: number
}

interface ShodanPortEntry {
  port: number
  transport: string
  product?: string
  version?: string
  banner?: string
  cpe?: string[]
  vulns?: Record<string, { cvss?: number; summary?: string }>
}

interface ShodanHostDetail extends ShodanHost {
  data?: ShodanPortEntry[]
  latitude?: number
  longitude?: number
  region_code?: string
  area_code?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCENT = '#00d4ff'

const S: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    background: 'rgba(8,12,20,0.8)',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
    fontSize: 13,
  },
  sidebar: {
    width: 260,
    minWidth: 260,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: '7px 10px',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    outline: 'none',
    width: '100%',
    fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
  },
  btn: {
    background: ACCENT,
    border: 'none',
    borderRadius: 6,
    padding: '7px 14px',
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
    padding: '5px 10px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    cursor: 'pointer',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: '12px 14px',
    cursor: 'pointer',
  },
  label: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    padding: '10px 14px 6px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 7px',
    borderRadius: 4,
    fontSize: 11,
    fontFamily: '"JetBrains Mono",monospace',
    fontWeight: 600,
    background: 'rgba(0,212,255,0.1)',
    color: ACCENT,
    border: '1px solid rgba(0,212,255,0.2)',
  },
  mono: {
    fontFamily: '"JetBrains Mono",monospace',
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ipc = (window as any).cryogram

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', CN: '🇨🇳', RU: '🇷🇺', JP: '🇯🇵',
  IN: '🇮🇳', BR: '🇧🇷', CA: '🇨🇦', AU: '🇦🇺', NL: '🇳🇱', KR: '🇰🇷', SG: '🇸🇬',
  HK: '🇭🇰', SE: '🇸🇪', NO: '🇳🇴', CH: '🇨🇭', IT: '🇮🇹', ES: '🇪🇸', PL: '🇵🇱',
  UA: '🇺🇦', TR: '🇹🇷', IR: '🇮🇷', MX: '🇲🇽', ZA: '🇿🇦', AR: '🇦🇷', PK: '🇵🇰',
}

function countryFlag(code?: string): string {
  if (!code) return '🌐'
  return COUNTRY_FLAGS[code.toUpperCase()] ?? '🌐'
}

function portColor(port: number): string {
  if ([22, 23, 3389].includes(port)) return '#ff4466'
  if ([80, 443, 8080, 8443].includes(port)) return '#00d4ff'
  if ([21, 25, 110, 143, 587, 993, 995].includes(port)) return '#ffaa00'
  if ([3306, 5432, 27017, 6379, 5984].includes(port)) return '#bb88ff'
  return '#4488bb'
}

function formatDate(s?: string): string {
  if (!s) return '—'
  try { return new Date(s).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' } as any) } catch { return s }
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.08)',
        borderTopColor: ACCENT,
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── No-API-Key screen ─────────────────────────────────────────────────────────

function NoApiKey() {
  const open = () => {
    window.dispatchEvent(new CustomEvent('cryogram:openSettingsTab', { detail: 'apikeys' }))
  }
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 12,
        padding: '36px 44px',
        textAlign: 'center',
        maxWidth: 380,
      }}>
        <div style={{ fontSize: 32, marginBottom: 14 }}>🔑</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
          Shodan API Key Required
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 22 }}>
          To search the Shodan database, you need a valid API key.
          Register at <span style={{ color: ACCENT }}>shodan.io</span> to get one.
        </div>
        <button style={S.btn} onClick={open}>Configure in Settings</button>
      </div>
    </div>
  )
}

// ── Host Card ─────────────────────────────────────────────────────────────────

function HostCard({ host, selected, onClick }: { host: ShodanHost; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...S.card,
        marginBottom: 8,
        borderColor: selected ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.07)',
        background: selected ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.04)',
        transition: 'all 0.15s ease',
      }}
    >
      {/* IP + country */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ ...S.mono, fontSize: 15, fontWeight: 700, color: ACCENT, letterSpacing: '-0.02em' }}>
          {host.ip_str}
        </span>
        <span style={{ fontSize: 16 }} title={host.country_name ?? host.country_code}>
          {countryFlag(host.country_code)}
        </span>
      </div>

      {/* Hostnames */}
      {host.hostnames && host.hostnames.length > 0 && (
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, wordBreak: 'break-all' }}>
          {host.hostnames.slice(0, 3).join(', ')}{host.hostnames.length > 3 ? ` +${host.hostnames.length - 3}` : ''}
        </div>
      )}

      {/* Port chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 7 }}>
        {(host.ports ?? []).slice(0, 12).map(p => (
          <span key={p} style={{
            ...S.mono,
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 3,
            background: `${portColor(p)}18`,
            color: portColor(p),
            border: `1px solid ${portColor(p)}33`,
          }}>
            {p}
          </span>
        ))}
        {(host.ports ?? []).length > 12 && (
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>
            +{host.ports.length - 12}
          </span>
        )}
      </div>

      {/* Org + OS */}
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {host.org && <span>{host.org}</span>}
        {host.os && <span style={{ color: '#ffaa00' }}>OS: {host.os}</span>}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
          {formatDate(host.last_update)}
        </span>
      </div>
    </div>
  )
}

// ── Host Detail ───────────────────────────────────────────────────────────────

function HostDetail({ ip, onClose }: { ip: string; onClose: () => void }) {
  const [host, setHost] = useState<ShodanHostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    ipc?.shodan?.host(ip)
      .then((data: ShodanHostDetail) => setHost(data))
      .catch((e: any) => setError(e?.message ?? 'Failed to load host'))
      .finally(() => setLoading(false))
  }, [ip])

  if (loading) return <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}><Spinner /></div>
  if (error) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4466', fontSize: 13 }}>
      {error}
    </div>
  )
  if (!host) return null

  const allVulns = Array.from(new Set([
    ...(host.vulns ?? []),
    ...((host.data ?? []).flatMap(d => d.vulns ? Object.keys(d.vulns) : [])),
  ]))

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Detail header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}>
        <button onClick={onClose} style={{ ...S.btnGhost, padding: '4px 10px' }}>← Back</button>
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 700, color: ACCENT }}>{host.ip_str}</span>
        <span style={{ fontSize: 20 }}>{countryFlag(host.country_code)}</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{host.country_name}</span>
        {host.org && <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{host.org}</span>}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'ISP', val: host.isp },
            { label: 'ASN', val: host.asn },
            { label: 'OS', val: host.os ?? '—' },
            { label: 'City', val: host.city ?? '—' },
            { label: 'Region', val: host.region_code ?? '—' },
            { label: 'Coordinates', val: host.latitude != null ? `${host.latitude?.toFixed(4)}, ${host.longitude?.toFixed(4)}` : '—' },
          ].map(({ label, val }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '8px 12px' }}>
              <div style={S.label}>{label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{val ?? '—'}</div>
            </div>
          ))}
        </div>

        {/* Hostnames */}
        {host.hostnames && host.hostnames.length > 0 && (
          <div>
            <div style={S.label}>Hostnames</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {host.hostnames.map(h => (
                <span key={h} style={{ ...S.mono, fontSize: 11, padding: '3px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, color: 'rgba(255,255,255,0.75)' }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {host.tags && host.tags.length > 0 && (
          <div>
            <div style={S.label}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {host.tags.map(t => (
                <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 10, color: ACCENT }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Vulnerabilities */}
        {allVulns.length > 0 && (
          <div>
            <div style={S.label}>Vulnerabilities ({allVulns.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {allVulns.map(cve => (
                <span
                  key={cve}
                  onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${cve}`, '_blank')}
                  style={{ ...S.mono, fontSize: 11, padding: '3px 8px', background: 'rgba(255,68,102,0.12)', border: '1px solid rgba(255,68,102,0.3)', borderRadius: 4, color: '#ff4466', cursor: 'pointer' }}
                >
                  {cve}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Open ports table */}
        {host.data && host.data.length > 0 && (
          <div>
            <div style={S.label}>Open Ports ({host.data.length})</div>
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Port', 'Protocol', 'Service', 'Banner'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {host.data.map((entry, i) => (
                    <tr key={`${entry.port}-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '7px 12px' }}>
                        <span style={{ ...S.mono, color: portColor(entry.port), fontWeight: 700 }}>{entry.port}</span>
                      </td>
                      <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.5)', ...S.mono, fontSize: 11 }}>
                        {entry.transport ?? 'tcp'}
                      </td>
                      <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.75)' }}>
                        {[entry.product, entry.version].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.35)', ...S.mono, fontSize: 10, maxWidth: 200 }}>
                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {entry.banner ? entry.banner.slice(0, 80) : '—'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function ShodanApp() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [keyChecked, setKeyChecked] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ShodanHost[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIp, setSelectedIp] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [currentQuery, setCurrentQuery] = useState('')

  // Check API key on mount
  useEffect(() => {
    const check = async () => {
      try {
        const key = await ipc?.settings?.get('shodan.apiKey')
        setApiKey(key ?? null)
      } catch {
        setApiKey(null)
      }
      setKeyChecked(true)
    }
    check()

    // Load stored searches
    const loadStored = async () => {
      try {
        const r = await ipc?.settings?.get('shodan.recentSearches')
        setRecentSearches(r ? JSON.parse(r) : [])
        const s = await ipc?.settings?.get('shodan.savedSearches')
        setSavedSearches(s ? JSON.parse(s) : [])
      } catch { /* ignore */ }
    }
    loadStored()
  }, [])

  const addRecentSearch = useCallback(async (q: string) => {
    setRecentSearches(prev => {
      const next = [q, ...prev.filter(s => s !== q)].slice(0, 10)
      ipc?.settings?.set('shodan.recentSearches', JSON.stringify(next)).catch(() => {})
      return next
    })
  }, [])

  const doSearch = useCallback(async (q: string, pg = 1) => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setSelectedIp(null)
    setPage(pg)
    setCurrentQuery(q)
    try {
      const res: ShodanSearchResult = await ipc?.shodan?.search(q, pg)
      setResults(res?.matches ?? [])
      setTotal(res?.total ?? 0)
      await addRecentSearch(q)
    } catch (e: any) {
      setError(e?.message ?? 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [addRecentSearch])

  const saveCurrentSearch = async () => {
    if (!currentQuery) return
    setSavedSearches(prev => {
      const next = [currentQuery, ...prev.filter(s => s !== currentQuery)].slice(0, 20)
      ipc?.settings?.set('shodan.savedSearches', JSON.stringify(next)).catch(() => {})
      return next
    })
  }

  const removeSaved = async (q: string) => {
    setSavedSearches(prev => {
      const next = prev.filter(s => s !== q)
      ipc?.settings?.set('shodan.savedSearches', JSON.stringify(next)).catch(() => {})
      return next
    })
  }

  const totalPages = Math.ceil(total / 10)

  if (!keyChecked) return (
    <div style={S.root}><Spinner /></div>
  )

  if (!apiKey) return (
    <div style={S.root}><NoApiKey /></div>
  )

  return (
    <div style={S.root}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        {/* Search input */}
        <div style={{ padding: '12px 12px 8px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <input
              style={S.input}
              placeholder='apache city:"Berlin"'
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch(query)}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              style={{ ...S.btn, flex: 1, padding: '7px 0' }}
              onClick={() => doSearch(query)}
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
            {currentQuery && (
              <button style={S.btnGhost} onClick={saveCurrentSearch} title="Save this search">
                ☆
              </button>
            )}
          </div>
        </div>

        {/* Saved searches */}
        {savedSearches.length > 0 && (
          <>
            <div style={S.sectionTitle}>Saved Searches</div>
            <div style={{ overflowY: 'auto', maxHeight: 140, padding: '2px 8px' }}>
              {savedSearches.map(s => (
                <div
                  key={s}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', borderRadius: 5, cursor: 'pointer', marginBottom: 2 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span
                    style={{ flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    onClick={() => { setQuery(s); doSearch(s) }}
                  >
                    {s}
                  </span>
                  <span
                    style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', cursor: 'pointer', flexShrink: 0 }}
                    onClick={() => removeSaved(s)}
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <>
            <div style={S.sectionTitle}>Recent Searches</div>
            <div style={{ overflowY: 'auto', flex: 1, padding: '2px 8px' }}>
              {recentSearches.map(s => (
                <div
                  key={s}
                  style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', borderRadius: 5, cursor: 'pointer', marginBottom: 2 }}
                  onClick={() => { setQuery(s); doSearch(s) }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginRight: 6 }}>↩</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {recentSearches.length === 0 && savedSearches.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
              Search Shodan's database of internet-connected devices
            </span>
          </div>
        )}
      </div>

      {/* Main area */}
      <div style={S.main}>
        {selectedIp ? (
          <HostDetail ip={selectedIp} onClose={() => setSelectedIp(null)} />
        ) : (
          <>
            {/* Results header */}
            {results.length > 0 && (
              <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexShrink: 0,
                fontSize: 12,
                color: 'rgba(255,255,255,0.45)',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  {total.toLocaleString()} results
                </span>
                <span>for</span>
                <span style={{ ...S.mono, fontSize: 11, color: ACCENT }}>"{currentQuery}"</span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    style={{ ...S.btnGhost, opacity: page <= 1 ? 0.4 : 1 }}
                    disabled={page <= 1}
                    onClick={() => doSearch(currentQuery, page - 1)}
                  >
                    ←
                  </button>
                  <span>Page {page} of {totalPages || 1}</span>
                  <button
                    style={{ ...S.btnGhost, opacity: page >= totalPages ? 0.4 : 1 }}
                    disabled={page >= totalPages}
                    onClick={() => doSearch(currentQuery, page + 1)}
                  >
                    →
                  </button>
                </span>
              </div>
            )}

            {/* Results list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {loading && <Spinner />}
              {error && (
                <div style={{ textAlign: 'center', color: '#ff4466', padding: 40, fontSize: 13 }}>
                  {error}
                </div>
              )}
              {!loading && !error && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.2)', fontSize: 13, lineHeight: 2 }}>
                  {currentQuery ? 'No results found.' : 'Enter a search query to find internet-connected devices.'}
                </div>
              )}
              {!loading && results.map(host => (
                <HostCard
                  key={host.ip_str}
                  host={host}
                  selected={selectedIp === host.ip_str}
                  onClick={() => setSelectedIp(host.ip_str)}
                />
              ))}
            </div>

            {/* Pagination footer */}
            {results.length > 0 && (
              <div style={{
                padding: '10px 16px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                flexShrink: 0,
              }}>
                <button
                  style={{ ...S.btnGhost, opacity: page <= 1 ? 0.4 : 1 }}
                  disabled={page <= 1 || loading}
                  onClick={() => doSearch(currentQuery, page - 1)}
                >
                  ← Prev
                </button>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  {page} / {totalPages || 1}
                </span>
                <button
                  style={{ ...S.btnGhost, opacity: page >= totalPages ? 0.4 : 1 }}
                  disabled={page >= totalPages || loading}
                  onClick={() => doSearch(currentQuery, page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
