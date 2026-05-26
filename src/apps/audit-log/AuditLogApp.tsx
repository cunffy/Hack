import { useState, useEffect } from 'react'

const s = {
  root: { display:'flex', flexDirection:'column' as const, height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14 },
  topBar: { display:'flex', gap:8, padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', alignItems:'center' },
  input: { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'5px 10px', color:'rgba(255,255,255,0.85)', fontSize:12, outline:'none' },
  btn: (c:string,t:string='#000') => ({ padding:'5px 14px', borderRadius:6, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, background:c, color:t }),
  body: { flex:1, overflow:'auto' },
  row: (type:string) => {
    const c: any = { security:'rgba(239,68,68,0.1)', warning:'rgba(234,179,8,0.1)', info:'rgba(0,212,255,0.06)', success:'rgba(34,197,94,0.08)' }
    return { padding:'8px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', gap:12, alignItems:'flex-start', background:c[type]||'transparent' }
  },
  dot: (type:string) => {
    const c: any = { security:'#ef4444', warning:'#eab308', info:'var(--cryo-accent,#00d4ff)', success:'#4ade80' }
    return { width:8, height:8, borderRadius:'50%', background:c[type]||'#6b7280', flexShrink:0, marginTop:4 }
  },
}

interface LogEntry { id:string; ts:string; type:'security'|'warning'|'info'|'success'; category:string; message:string; details?:string; user?:string }

const FILTERS = ['All','security','warning','info','success']
const CATEGORIES = ['All','Auth','File','Network','App','System']

export default function AuditLogApp() {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState('All')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string|null>(null)

  useEffect(() => { loadEntries() }, [])

  async function loadEntries() {
    try {
      const data = await (window as any).cryogram?.auditLog?.list()
      if (data) setEntries(data)
    } catch {}
  }

  async function clearLog() {
    if (!confirm('Clear all audit log entries?')) return
    await (window as any).cryogram?.auditLog?.clear()
    setEntries([])
  }

  const visible = entries.filter(e =>
    (filter==='All' || e.type===filter) &&
    (category==='All' || e.category===category) &&
    (!search || e.message.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()))
  )

  const counts: any = { security:0, warning:0, info:0, success:0 }
  entries.forEach(e => { if (e.type in counts) counts[e.type]++ })

  return (
    <div style={s.root}>
      <div style={s.topBar}>
        <span style={{ fontWeight:700, fontSize:14 }}>Activity & Audit Log</span>
        <input style={{ ...s.input, width:200 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...s.input, width:90 }} value={filter} onChange={e => setFilter(e.target.value)}>
          {FILTERS.map(f => <option key={f}>{f}</option>)}
        </select>
        <select style={{ ...s.input, width:100 }} value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button style={s.btn('rgba(255,255,255,0.07)','rgba(255,255,255,0.6)')} onClick={loadEntries}>Refresh</button>
        <button style={{ ...s.btn('rgba(239,68,68,0.1)','#ef4444'), marginLeft:'auto' }} onClick={clearLog}>Clear Log</button>
      </div>
      <div style={{ padding:'8px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:16 }}>
        {Object.entries(counts).map(([type, count]) => (
          <div key={type} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={s.dot(type)} />
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', textTransform:'capitalize' as const }}>{type}</span>
            <span style={{ fontSize:12, fontWeight:700 }}>{count as number}</span>
          </div>
        ))}
        <span style={{ marginLeft:'auto', fontSize:12, color:'rgba(255,255,255,0.4)' }}>{visible.length} entries</span>
      </div>
      <div style={s.body}>
        {visible.length === 0 && <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', marginTop:60 }}>No log entries found</div>}
        {visible.map(e => (
          <div key={e.id} style={s.row(e.type)} onClick={() => setExpanded(expanded===e.id?null:e.id)}>
            <div style={s.dot(e.type)} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:11, color:'rgba(255,255,255,0.4)', flexShrink:0 }}>{e.ts}</span>
                <span style={{ fontSize:10, padding:'1px 6px', borderRadius:4, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.5)' }}>{e.category}</span>
                <span style={{ fontSize:13 }}>{e.message}</span>
                {e.user && <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>by {e.user}</span>}
              </div>
              {expanded===e.id && e.details && (
                <div style={{ marginTop:6, fontFamily:'"JetBrains Mono",monospace', fontSize:11, color:'rgba(255,255,255,0.6)', background:'rgba(0,0,0,0.2)', borderRadius:4, padding:8 }}>{e.details}</div>
              )}
            </div>
            {e.details && <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>{expanded===e.id?'▲':'▼'}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
