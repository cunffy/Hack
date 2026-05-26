import { useState, useEffect, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface NvdCveItem {
  id: string
  sourceIdentifier?: string
  published: string
  lastModified: string
  vulnStatus?: string
  descriptions: { lang: string; value: string }[]
  metrics?: {
    cvssMetricV31?: NvdCvssMetric[]
    cvssMetricV30?: NvdCvssMetric[]
    cvssMetricV2?: NvdCvssV2[]
  }
  weaknesses?: { description: { lang: string; value: string }[] }[]
  configurations?: any[]
  references?: { url: string; source?: string; tags?: string[] }[]
  cpeMatch?: { criteria: string; vulnerable: boolean }[]
}

interface NvdCvssMetric {
  source: string
  type: string
  cvssData: { version: string; vectorString: string; baseScore: number; baseSeverity: string }
}

interface NvdCvssV2 {
  source: string
  type: string
  cvssData: { version: string; vectorString: string; baseScore: number }
  baseSeverity?: string
}

interface NvdResponse {
  totalResults: number
  startIndex: number
  resultsPerPage: number
  vulnerabilities: { cve: NvdCveItem }[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ACCENT = '#00d4ff'
const ipc = (window as any).cryogram

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#22c55e',
  NONE: '#6b7280',
}

function severityColor(s: string): string {
  return SEVERITY_COLORS[s?.toUpperCase()] ?? '#6b7280'
}

function getCvss(cve: NvdCveItem): { score: number; severity: string; vector?: string } | null {
  const m31 = cve.metrics?.cvssMetricV31?.[0]
  if (m31) return { score: m31.cvssData.baseScore, severity: m31.cvssData.baseSeverity, vector: m31.cvssData.vectorString }
  const m30 = cve.metrics?.cvssMetricV30?.[0]
  if (m30) return { score: m30.cvssData.baseScore, severity: m30.cvssData.baseSeverity, vector: m30.cvssData.vectorString }
  const m2 = cve.metrics?.cvssMetricV2?.[0]
  if (m2) return { score: m2.cvssData.baseScore, severity: m2.baseSeverity ?? 'NONE' }
  return null
}

function getDescription(cve: NvdCveItem): string {
  return cve.descriptions.find(d => d.lang === 'en')?.value ?? cve.descriptions[0]?.value ?? '—'
}

function formatDate(s: string): string {
  try { return new Date(s).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) } catch { return s }
}

function extractCpes(cve: NvdCveItem): string[] {
  const cpes: string[] = []
  const walk = (obj: any) => {
    if (!obj || typeof obj !== 'object') return
    if (Array.isArray(obj)) { obj.forEach(walk); return }
    if (obj.criteria && obj.vulnerable !== false) cpes.push(obj.criteria)
    Object.values(obj).forEach(walk)
  }
  walk(cve.configurations)
  return [...new Set(cpes)]
}

// ── Shared styles ─────────────────────────────────────────────────────────────

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
    padding: '7px 16px',
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
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    cursor: 'pointer',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: '11px 13px',
    cursor: 'pointer',
    marginBottom: 7,
  },
  label: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    marginBottom: 5,
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
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
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

// ── CVSS Badge ────────────────────────────────────────────────────────────────

function CvssBadge({ score, severity, large }: { score: number; severity: string; large?: boolean }) {
  const color = severityColor(severity)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: large ? '4px 10px' : '2px 7px',
      borderRadius: large ? 6 : 4,
      background: `${color}18`,
      border: `1px solid ${color}40`,
      color,
      fontSize: large ? 13 : 10,
      fontWeight: 700,
      ...S.mono,
      flexShrink: 0,
    }}>
      {severity} {score.toFixed(1)}
    </span>
  )
}

// ── CVE List Item ─────────────────────────────────────────────────────────────

function CveListItem({ cve, selected, onClick }: { cve: NvdCveItem; selected: boolean; onClick: () => void }) {
  const cvss = getCvss(cve)
  const desc = getDescription(cve)
  return (
    <div
      onClick={onClick}
      style={{
        ...S.card,
        borderColor: selected ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.07)',
        background: selected ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.04)',
        transition: 'all 0.12s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
        <span style={{ ...S.mono, fontSize: 12, fontWeight: 700, color: ACCENT, flexShrink: 0 }}>{cve.id}</span>
        {cvss && <CvssBadge score={cvss.score} severity={cvss.severity} />}
      </div>
      <div style={{
        fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
        marginBottom: 5,
      }}>
        {desc}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{formatDate(cve.published)}</div>
    </div>
  )
}

// ── CVE Detail panel ──────────────────────────────────────────────────────────

function CveDetail({ cve, onBookmark, isBookmarked }: { cve: NvdCveItem; onBookmark: () => void; isBookmarked: boolean }) {
  const [copied, setCopied] = useState(false)
  const cvss = getCvss(cve)
  const desc = getDescription(cve)
  const cpes = extractCpes(cve)
  const cwes = (cve.weaknesses ?? []).flatMap(w => w.description.filter(d => d.lang === 'en').map(d => d.value))
  const refs = cve.references ?? []

  const copy = () => {
    navigator.clipboard.writeText(cve.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: ACCENT, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {cve.id}
          </div>
          {cvss && <CvssBadge score={cvss.score} severity={cvss.severity} large />}
        </div>
        <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
          <button style={S.btnGhost} onClick={copy}>{copied ? '✓ Copied' : 'Copy ID'}</button>
          <button
            style={{ ...S.btnGhost, color: isBookmarked ? '#ffaa00' : undefined, borderColor: isBookmarked ? 'rgba(255,170,0,0.3)' : undefined, background: isBookmarked ? 'rgba(255,170,0,0.08)' : undefined }}
            onClick={onBookmark}
          >
            {isBookmarked ? '★ Saved' : '☆ Bookmark'}
          </button>
        </div>
      </div>

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {[
          { label: 'Published', val: formatDate(cve.published) },
          { label: 'Last Modified', val: formatDate(cve.lastModified) },
          { label: 'Status', val: cve.vulnStatus ?? '—' },
          { label: 'Source', val: cve.sourceIdentifier ?? '—' },
        ].map(({ label, val }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '8px 12px' }}>
            <div style={S.label}>{label}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <div style={S.label}>Description</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '12px 14px' }}>
          {desc}
        </div>
      </div>

      {/* CVSS vector */}
      {cvss?.vector && (
        <div>
          <div style={S.label}>CVSS Vector</div>
          <div style={{ ...S.mono, fontSize: 11, color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '8px 12px', wordBreak: 'break-all' }}>
            {cvss.vector}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {cwes.length > 0 && (
        <div>
          <div style={S.label}>Weaknesses (CWE)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cwes.map(cwe => (
              <span
                key={cwe}
                onClick={() => window.open(`https://cwe.mitre.org/data/definitions/${cwe.replace('CWE-', '')}.html`, '_blank')}
                style={{ ...S.mono, fontSize: 11, padding: '3px 9px', background: 'rgba(187,136,255,0.1)', border: '1px solid rgba(187,136,255,0.25)', borderRadius: 4, color: '#bb88ff', cursor: 'pointer' }}
              >
                {cwe}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Affected products (CPE) */}
      {cpes.length > 0 && (
        <div>
          <div style={S.label}>Affected Products (first 10 CPEs)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {cpes.slice(0, 10).map((cpe, i) => (
              <div key={i} style={{ ...S.mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 5, padding: '5px 10px', wordBreak: 'break-all' }}>
                {cpe}
              </div>
            ))}
            {cpes.length > 10 && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>+{cpes.length - 10} more</div>}
          </div>
        </div>
      )}

      {/* References */}
      {refs.length > 0 && (
        <div>
          <div style={S.label}>References ({refs.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {refs.map((ref, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a
                  href="#"
                  onClick={e => { e.preventDefault(); window.open(ref.url, '_blank') }}
                  style={{ ...S.mono, fontSize: 11, color: ACCENT, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}
                >
                  {ref.url}
                </a>
                {ref.tags && ref.tags.length > 0 && (
                  <span style={{ fontSize: 9, padding: '1px 5px', background: 'rgba(255,255,255,0.07)', borderRadius: 3, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                    {ref.tags[0]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => String(CURRENT_YEAR - i))
const SEVERITY_OPTIONS = ['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

export default function CVEApp() {
  const [keyword, setKeyword] = useState('')
  const [cveId, setCveId] = useState('')
  const [severity, setSeverity] = useState('All')
  const [year, setYear] = useState('All')
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [results, setResults] = useState<NvdCveItem[]>([])
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<NvdCveItem | null>(null)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [leftTab, setLeftTab] = useState<'results' | 'bookmarks'>('results')
  const [bookmarkedCves, setBookmarkedCves] = useState<NvdCveItem[]>([])
  const [searched, setSearched] = useState(false)

  // Load bookmarks on mount
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await ipc?.settings?.get('cve.bookmarks')
        setBookmarks(raw ? JSON.parse(raw) : [])
      } catch { /* ignore */ }
    }
    load()
  }, [])

  const saveBookmarks = useCallback(async (ids: string[]) => {
    setBookmarks(ids)
    ipc?.settings?.set('cve.bookmarks', JSON.stringify(ids)).catch(() => {})
  }, [])

  const toggleBookmark = useCallback(async (cveItem: NvdCveItem) => {
    setBookmarks(prev => {
      const next = prev.includes(cveItem.id)
        ? prev.filter(id => id !== cveItem.id)
        : [...prev, cveItem.id]
      saveBookmarks(next)
      return next
    })
    // Also update bookmarkedCves list
    setBookmarkedCves(prev => {
      if (prev.find(c => c.id === cveItem.id)) return prev.filter(c => c.id !== cveItem.id)
      return [...prev, cveItem]
    })
  }, [saveBookmarks])

  const buildUrl = (q: string, idSearch: string, off: number) => {
    const base = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
    if (idSearch.trim()) return `${base}?cveId=${encodeURIComponent(idSearch.trim())}`
    const params = new URLSearchParams({ resultsPerPage: '20', startIndex: String(off) })
    if (q.trim()) params.set('keywordSearch', q.trim())
    if (severity !== 'All') params.set('cvssV3Severity', severity)
    if (year !== 'All') {
      params.set('pubStartDate', `${year}-01-01T00:00:00.000`)
      params.set('pubEndDate', `${year}-12-31T23:59:59.999`)
    }
    return `${base}?${params}`
  }

  const doSearch = useCallback(async (off = 0) => {
    setLoading(true)
    setError(null)
    setSearched(true)
    setOffset(off)
    try {
      const url = buildUrl(keyword, cveId, off)
      const res = await fetch(url)
      if (!res.ok) {
        if (res.status === 429) throw new Error('Rate limited by NVD API. Please wait and try again.')
        throw new Error(`HTTP ${res.status}`)
      }
      const json: NvdResponse = await res.json()
      const items = json.vulnerabilities?.map(v => v.cve) ?? []
      setResults(items)
      setTotal(json.totalResults ?? 0)
    } catch (e: any) {
      setError(e?.message ?? 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, cveId, severity, year])

  const selectCve = useCallback(async (cve: NvdCveItem) => {
    // If it's a summary item from search, fetch full detail
    setDetailLoading(true)
    setSelected(cve)
    try {
      const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${encodeURIComponent(cve.id)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: NvdResponse = await res.json()
      const full = json.vulnerabilities?.[0]?.cve
      if (full) setSelected(full)
    } catch {
      /* keep the summary version */
    } finally {
      setDetailLoading(false)
    }
  }, [])

  const loadBookmarkedCves = useCallback(async () => {
    if (bookmarkedCves.length > 0) return
    if (bookmarks.length === 0) return
    // Fetch first few bookmarked CVEs details
    const fetched: NvdCveItem[] = []
    for (const id of bookmarks.slice(0, 5)) {
      try {
        const res = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${encodeURIComponent(id)}`)
        if (res.ok) {
          const json: NvdResponse = await res.json()
          const c = json.vulnerabilities?.[0]?.cve
          if (c) fetched.push(c)
        }
      } catch { /* ignore */ }
    }
    setBookmarkedCves(fetched)
  }, [bookmarks, bookmarkedCves.length])

  useEffect(() => {
    if (leftTab === 'bookmarks') loadBookmarkedCves()
  }, [leftTab, loadBookmarkedCves])

  const PAGE_SIZE = 20
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1

  const displayList = leftTab === 'bookmarks' ? bookmarkedCves : results

  return (
    <div style={S.root}>
      {/* Search bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
        flexWrap: 'wrap',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <input
          style={{ ...S.input, flex: '2 1 140px', minWidth: 100 }}
          placeholder="Keyword (e.g. log4j, apache)"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
        />
        <input
          style={{ ...S.input, flex: '1 1 120px', minWidth: 100 }}
          placeholder="CVE-2024-1234"
          value={cveId}
          onChange={e => setCveId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
        />
        <select style={{ ...S.select, flex: '0 0 110px' }} value={severity} onChange={e => setSeverity(e.target.value)}>
          {SEVERITY_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Severities' : s}</option>)}
        </select>
        <select style={{ ...S.select, flex: '0 0 90px' }} value={year} onChange={e => setYear(e.target.value)}>
          <option value="All">All Years</option>
          {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button style={{ ...S.btn, flexShrink: 0 }} onClick={() => doSearch(0)} disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left panel */}
        <div style={{ width: 300, minWidth: 300, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          {/* Left tab bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}>
            {(['results', 'bookmarks'] as const).map(t => (
              <button
                key={t}
                onClick={() => setLeftTab(t)}
                style={{
                  flex: 1, background: 'none', border: 'none',
                  borderBottom: leftTab === t ? `2px solid ${ACCENT}` : '2px solid transparent',
                  color: leftTab === t ? ACCENT : 'rgba(255,255,255,0.4)',
                  padding: '9px 0', fontSize: 11, fontWeight: leftTab === t ? 600 : 400, cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
                }}
              >
                {t === 'bookmarks' ? `Bookmarks (${bookmarks.length})` : `Results ${total > 0 ? `(${total.toLocaleString()})` : ''}`}
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px 0' }}>
            {leftTab === 'results' && loading && <Spinner />}
            {leftTab === 'results' && error && (
              <div style={{ padding: '12px 8px', color: '#ff4466', fontSize: 11, lineHeight: 1.5 }}>{error}</div>
            )}
            {leftTab === 'results' && !loading && !error && !searched && (
              <div style={{ padding: '40px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, lineHeight: 2 }}>
                Search CVEs from the NVD database
              </div>
            )}
            {leftTab === 'results' && !loading && !error && searched && results.length === 0 && (
              <div style={{ padding: 30, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>No results found.</div>
            )}
            {leftTab === 'bookmarks' && bookmarks.length === 0 && (
              <div style={{ padding: 30, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, lineHeight: 2 }}>
                No bookmarks yet. Star a CVE to save it here.
              </div>
            )}
            {displayList.map(cve => (
              <CveListItem
                key={cve.id}
                cve={cve}
                selected={selected?.id === cve.id}
                onClick={() => selectCve(cve)}
              />
            ))}
          </div>

          {/* Pagination */}
          {leftTab === 'results' && totalPages > 1 && (
            <div style={{
              padding: '8px 10px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              flexShrink: 0,
              background: 'rgba(255,255,255,0.02)',
            }}>
              <button
                style={{ ...S.btnGhost, padding: '4px 10px', opacity: currentPage <= 1 ? 0.4 : 1 }}
                disabled={currentPage <= 1 || loading}
                onClick={() => doSearch(offset - PAGE_SIZE)}
              >
                ←
              </button>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{currentPage}/{totalPages}</span>
              <button
                style={{ ...S.btnGhost, padding: '4px 10px', opacity: currentPage >= totalPages ? 0.4 : 1 }}
                disabled={currentPage >= totalPages || loading}
                onClick={() => doSearch(offset + PAGE_SIZE)}
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Right detail panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {detailLoading && <Spinner />}
          {!detailLoading && !selected && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>CVE</div>
              <div style={{ fontSize: 13 }}>Select a CVE to view full details</div>
            </div>
          )}
          {!detailLoading && selected && (
            <CveDetail
              cve={selected}
              isBookmarked={bookmarks.includes(selected.id)}
              onBookmark={() => toggleBookmark(selected)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
