import { useState } from 'react'

const SAVED_QUERIES = [
  'port:22 product:OpenSSH',
  'port:3389 has_screenshot:true',
  'port:80,443 http.title:"Login"',
  'vuln:CVE-2021-44228',
  'product:MongoDB port:27017',
  'country:US port:445',
  'net:192.168.0.0/16',
]

interface Props {
  onSelectHost: (ip: string) => void
}

export function SearchView({ onSelectHost }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ShodanSearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const search = async (q?: string, p = 1) => {
    const searchQuery = q ?? query
    if (!searchQuery.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await window.cyberden.shodan.search(searchQuery, p)
      setResults(res)
      setPage(p)
    } catch (err) {
      if (err instanceof Error && err.message === 'NO_API_KEY') {
        setError('API key not configured')
      } else {
        setError(err instanceof Error ? err.message : 'Search failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search bar */}
      <div className="p-3 border-b border-den-border shrink-0">
        <div className="flex gap-2">
          <input
            className="flex-1"
            placeholder='port:22 country:"US"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <button className="btn btn-primary" onClick={() => search()} disabled={loading}>
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SAVED_QUERIES.slice(0, 4).map((q) => (
            <button
              key={q}
              onClick={() => { setQuery(q); search(q) }}
              className="text-xs text-den-muted hover:text-den-accent border border-den-border hover:border-den-accent/50 px-2 py-0.5 rounded transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto">
        {error && <div className="p-4 text-den-red text-xs">{error}</div>}
        {results && (
          <>
            <div className="px-3 py-2 text-xs text-den-muted border-b border-den-border">
              {results.total.toLocaleString()} results — page {page}
            </div>
            {results.matches.map((m, i) => (
              <div
                key={i}
                onClick={() => onSelectHost(m.ip_str)}
                className="px-3 py-2.5 border-b border-den-border hover:bg-den-surface cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-den-accent font-mono text-sm group-hover:glow-cyan">{m.ip_str}</span>
                  <span className="text-xs text-den-muted">{m.timestamp?.slice(0, 10)}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-den-muted">
                  <span className="text-den-yellow">:{m.port}</span>
                  {m.org && <span>{m.org}</span>}
                  {m.location?.country_name && <span>{m.location.country_name}</span>}
                  {m.location?.city && <span>{m.location.city}</span>}
                </div>
                {m.data && (
                  <div className="mt-1 text-xs text-den-muted font-mono truncate">
                    {m.data.slice(0, 120)}
                  </div>
                )}
                {m.vulns && Object.keys(m.vulns).length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {Object.keys(m.vulns).slice(0, 3).map((cve) => (
                      <span key={cve} className="badge bg-den-red/20 text-den-red">{cve}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center gap-2 p-3">
              {page > 1 && (
                <button className="btn" onClick={() => search(query, page - 1)}>← Prev</button>
              )}
              {results.matches.length === 100 && (
                <button className="btn" onClick={() => search(query, page + 1)}>Next →</button>
              )}
            </div>
          </>
        )}
        {!results && !error && !loading && (
          <div className="flex flex-col gap-2 p-4">
            <div className="text-xs text-den-muted mb-1">Saved queries:</div>
            {SAVED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => { setQuery(q); search(q) }}
                className="text-left text-xs text-den-text hover:text-den-accent font-mono px-2 py-1 hover:bg-den-surface rounded transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
