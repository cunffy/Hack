import { useState, useEffect } from 'react'

interface Props {
  ip: string
  onClose: () => void
}

export function HostDetail({ ip, onClose }: Props) {
  const [host, setHost] = useState<ShodanHost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    window.cyberden.shodan.host(ip)
      .then(setHost)
      .catch((err) => setError(err.message || 'Failed to fetch host'))
      .finally(() => setLoading(false))
  }, [ip])

  if (loading) return <div className="flex-1 flex items-center justify-center text-den-muted">Loading {ip}...</div>
  if (error) return <div className="flex-1 flex items-center justify-center text-den-red text-xs">{error}</div>
  if (!host) return null

  const vulnCount = Object.keys(host.vulns || {}).length

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-den-border shrink-0">
        <div>
          <div className="text-den-accent font-mono font-bold">{host.ip_str}</div>
          {host.org && <div className="text-xs text-den-muted mt-0.5">{host.org}</div>}
        </div>
        <button onClick={onClose} className="text-den-muted hover:text-den-text">×</button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Meta */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ['Country', host.country_name],
            ['ISP', host.isp],
            ['OS', host.os],
            ['Last Updated', host.last_update?.slice(0, 10)],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="panel p-2">
              <div className="text-den-muted mb-0.5">{k}</div>
              <div className="text-den-text">{v}</div>
            </div>
          ))}
        </div>

        {/* Ports */}
        <div>
          <div className="text-xs text-den-muted uppercase tracking-wider mb-2">Open Ports</div>
          <div className="flex flex-wrap gap-1.5">
            {host.ports.map((p) => (
              <span key={p} className="badge bg-den-accent/10 text-den-accent border border-den-accent/30">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Hostnames */}
        {host.hostnames.length > 0 && (
          <div>
            <div className="text-xs text-den-muted uppercase tracking-wider mb-2">Hostnames</div>
            <div className="space-y-0.5">
              {host.hostnames.map((h) => (
                <div key={h} className="text-xs font-mono text-den-text">{h}</div>
              ))}
            </div>
          </div>
        )}

        {/* Vulnerabilities */}
        {vulnCount > 0 && (
          <div>
            <div className="text-xs text-den-red uppercase tracking-wider mb-2 font-bold">
              ⚠ {vulnCount} Vulnerabilities
            </div>
            <div className="space-y-2">
              {Object.entries(host.vulns!).map(([cve, info]) => (
                <div key={cve} className="panel p-2 border-den-red/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge bg-den-red/20 text-den-red">{cve}</span>
                    <span className="text-xs text-den-muted">CVSS: {(info as { cvss: number }).cvss}</span>
                  </div>
                  <div className="text-xs text-den-muted line-clamp-2">{(info as { summary: string }).summary}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service banners */}
        <div>
          <div className="text-xs text-den-muted uppercase tracking-wider mb-2">Service Banners</div>
          <div className="space-y-2">
            {host.data.slice(0, 5).map((svc, i) => (
              <div key={i} className="panel p-2">
                <div className="text-xs text-den-yellow mb-1">Port {svc.port}</div>
                <pre className="text-xs text-den-muted whitespace-pre-wrap break-all line-clamp-4">
                  {svc.data}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
