import { useState, useEffect, useRef, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

interface Container {
  id: string; name: string; image: string; status: string
  state: string; ports: string[]; created: number
}
interface DockerImage {
  id: string; repository: string; tag: string; size: number; created: number
}
interface ContainerStat {
  id: string; name: string; cpuPercent: number; memUsage: number; memLimit: number
}

type TabId = 'containers' | 'images' | 'stats'

// ── Helpers ───────────────────────────────────────────────────────────────────

const ACCENT = '#00d4ff'
const ipc = (window as any).cryogram

function formatBytes(b: number): string {
  if (!b) return '0 B'
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  if (b < 1073741824) return `${(b / 1048576).toFixed(1)} MB`
  return `${(b / 1073741824).toFixed(2)} GB`
}

function relDate(ts: number): string {
  const s = Math.floor((Date.now() / 1000) - ts)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'rgba(10,14,22,0.94)', color: 'rgba(255,255,255,0.85)', fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 13 },
  tabBar: { display: 'flex', gap: 2, padding: '10px 14px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  body: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  input: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '6px 10px', color: 'rgba(255,255,255,0.85)', fontSize: 12, outline: 'none' } as React.CSSProperties,
}

function Tab({ id, active, onClick }: { id: TabId; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: '7px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: active ? ACCENT : 'rgba(255,255,255,0.45)', borderBottom: active ? `2px solid ${ACCENT}` : '2px solid transparent', transition: 'all 0.15s' }}>
      {id.charAt(0).toUpperCase() + id.slice(1)}
    </button>
  )
}

function StatusDot({ state }: { state: string }) {
  const running = state === 'running'
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: running ? '#00ff88' : 'rgba(255,255,255,0.25)', boxShadow: running ? '0 0 6px rgba(0,255,136,0.6)' : 'none', flexShrink: 0 }} />
}

function ProgressBar({ value, max, color = ACCENT }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 8, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', borderRadius: 4, background: color, width: `${pct}%`, transition: 'width 0.4s ease', boxShadow: `0 0 8px ${color}44` }} />
    </div>
  )
}

// ── EmptyState ─────────────────────────────────────────────────────────────────

function EmptyState({ msg }: { msg: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'rgba(255,255,255,0.3)' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
      <span style={{ fontSize: 13 }}>{msg}</span>
    </div>
  )
}

// ── Containers Tab ─────────────────────────────────────────────────────────────

function ContainersTab() {
  const [containers, setContainers] = useState<Container[]>([])
  const [logs, setLogs] = useState<Record<string, string>>({})
  const [openLogs, setOpenLogs] = useState<Set<string>>(new Set())
  const [acting, setActing] = useState<string | null>(null)

  const load = useCallback(async () => {
    try { const r = await ipc?.docker?.listContainers?.(); if (Array.isArray(r)) setContainers(r) } catch {}
  }, [])

  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t) }, [load])

  const act = async (id: string, fn: () => Promise<any>) => {
    setActing(id); try { await fn(); await load() } catch {} finally { setActing(null) }
  }

  const toggleLogs = async (id: string) => {
    const next = new Set(openLogs)
    if (next.has(id)) { next.delete(id); setOpenLogs(next); return }
    next.add(id); setOpenLogs(next)
    try { const l = await ipc?.docker?.containerLogs?.(id, 150); setLogs(prev => ({ ...prev, [id]: l || '' })) } catch {}
  }

  if (containers.length === 0) return <EmptyState msg="Docker not installed or not running" />

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {containers.map(c => (
        <div key={c.id} className="panel" style={{ padding: '10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusDot state={c.state} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{c.name.replace(/^\//, '')}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                {c.image} · {c.status}
                {c.ports?.length > 0 && ` · ${c.ports.join(', ')}`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {c.state !== 'running' && <button className="btn" style={{ fontSize: 11, padding: '4px 10px', color: '#00ff88' }} onClick={() => act(c.id, () => ipc?.docker?.startContainer?.(c.id))} disabled={acting === c.id}>Start</button>}
              {c.state === 'running' && <button className="btn" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => act(c.id, () => ipc?.docker?.stopContainer?.(c.id))} disabled={acting === c.id}>Stop</button>}
              <button className="btn" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => act(c.id, () => ipc?.docker?.restartContainer?.(c.id))} disabled={acting === c.id}>Restart</button>
              <button className="btn" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => toggleLogs(c.id)}>Logs</button>
              <button className="btn btn-danger" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => { if (confirm(`Remove container ${c.name}?`)) act(c.id, () => ipc?.docker?.removeContainer?.(c.id)) }} disabled={acting === c.id}>Remove</button>
            </div>
          </div>
          {openLogs.has(c.id) && (
            <div style={{ marginTop: 10, background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: '8px 10px', maxHeight: 180, overflowY: 'auto', fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: '#00ff88', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {logs[c.id] || 'Loading logs...'}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Images Tab ─────────────────────────────────────────────────────────────────

function ImagesTab() {
  const [images, setImages] = useState<DockerImage[]>([])
  const [pullName, setPullName] = useState('')
  const [pulling, setPulling] = useState(false)

  const load = useCallback(async () => {
    try { const r = await ipc?.docker?.listImages?.(); if (Array.isArray(r)) setImages(r) } catch {}
  }, [])

  useEffect(() => { load() }, [load])

  const pull = async () => {
    if (!pullName) return
    setPulling(true)
    try { await ipc?.docker?.pullImage?.(pullName); await load() } catch {} finally { setPulling(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this image?')) return
    try { await ipc?.docker?.removeImage?.(id); await load() } catch {}
  }

  if (images.length === 0) return <EmptyState msg="No images found" />

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8 }}>
        <input value={pullName} onChange={e => setPullName(e.target.value)} onKeyDown={e => e.key === 'Enter' && pull()} placeholder="ubuntu:22.04" style={{ ...S.input, flex: 1 }} />
        <button className="btn btn-primary" onClick={pull} disabled={pulling} style={{ fontSize: 12 }}>{pulling ? 'Pulling…' : 'Pull'}</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {images.map(img => (
          <div key={img.id} className="panel" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{img.repository}:{img.tag}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontFamily: '"JetBrains Mono",monospace' }}>
                {img.id?.slice(7, 19)} · {formatBytes(img.size)} · {relDate(img.created)}
              </div>
            </div>
            <button className="btn btn-danger" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => remove(img.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stats Tab ──────────────────────────────────────────────────────────────────

function StatsTab() {
  const [stats, setStats] = useState<ContainerStat[]>([])

  const load = useCallback(async () => {
    try { const r = await ipc?.docker?.getStats?.(); if (Array.isArray(r)) setStats(r) } catch {}
  }, [])

  useEffect(() => { load(); const t = setInterval(load, 3000); return () => clearInterval(t) }, [load])

  if (stats.length === 0) return <EmptyState msg="No running containers" />

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {stats.map(s => {
        const memPct = s.memLimit > 0 ? Math.round((s.memUsage / s.memLimit) * 100) : 0
        return (
          <div key={s.id} className="panel" style={{ padding: '12px 16px' }}>
            <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>{s.name?.replace(/^\//, '')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', width: 40 }}>CPU</span>
                <ProgressBar value={s.cpuPercent} max={100} color={s.cpuPercent > 80 ? '#ff4466' : ACCENT} />
                <span style={{ fontSize: 11, color: ACCENT, width: 44, textAlign: 'right', fontFamily: '"JetBrains Mono",monospace' }}>{s.cpuPercent?.toFixed(1)}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', width: 40 }}>MEM</span>
                <ProgressBar value={s.memUsage} max={s.memLimit} color={memPct > 80 ? '#ffaa00' : '#bb88ff'} />
                <span style={{ fontSize: 11, color: '#bb88ff', width: 44, textAlign: 'right', fontFamily: '"JetBrains Mono",monospace' }}>{memPct}%</span>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
                {formatBytes(s.memUsage)} / {formatBytes(s.memLimit)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function DockerApp() {
  const [tab, setTab] = useState<TabId>('containers')
  const TABS: TabId[] = ['containers', 'images', 'stats']

  return (
    <div style={S.root}>
      <div style={S.tabBar}>
        {TABS.map(t => <Tab key={t} id={t} active={tab === t} onClick={() => setTab(t)} />)}
      </div>
      <div style={S.body}>
        {tab === 'containers' && <ContainersTab />}
        {tab === 'images' && <ImagesTab />}
        {tab === 'stats' && <StatsTab />}
      </div>
    </div>
  )
}
