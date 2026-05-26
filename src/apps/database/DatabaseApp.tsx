import { useState } from 'react'

interface TableInfo { name: string; type: string }

const ipc = (window as any).cryogram?.db

export default function DatabaseApp() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [pathInput, setPathInput] = useState('')
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [rowCount, setRowCount] = useState(0)
  const [rows, setRows] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [sql, setSql] = useState('')
  const [queryResult, setQueryResult] = useState<{ rows: any[]; columns: string[]; error: string|null }|null>(null)
  const [tab, setTab] = useState<'browse'|'query'>('browse')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const PAGE_SIZE = 100

  const openDb = async () => {
    const path = pathInput.trim()
    if (!path || !ipc) return
    setLoading(true); setError('')
    try {
      const res = await ipc.open(path)
      if (res.error) { setError(res.error); return }
      setSessionId(res.sessionId)
      const t = await ipc.listTables(res.sessionId)
      setTables(t); setSelectedTable(null); setRows([])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const closeDb = async () => {
    if (sessionId && ipc) await ipc.close(sessionId)
    setSessionId(null); setTables([]); setSelectedTable(null); setRows([])
  }

  const selectTable = async (name: string) => {
    if (!sessionId || !ipc) return
    setSelectedTable(name); setLoading(true)
    try {
      const rc = await ipc.getTableRowCount(sessionId, name)
      setRowCount(rc)
      const res = await ipc.query(sessionId, `SELECT * FROM "${name}"`, 0, PAGE_SIZE)
      setRows(res.rows); setColumns(res.columns); setTotal(res.total); setPage(0)
    } finally { setLoading(false) }
  }

  const loadRows = async (pg: number) => {
    if (!sessionId || !ipc || !selectedTable) return
    const res = await ipc.query(sessionId, `SELECT * FROM "${selectedTable}"`, pg, PAGE_SIZE)
    setRows(res.rows); setColumns(res.columns); setPage(pg)
  }

  const runQuery = async () => {
    if (!sessionId || !ipc || !sql.trim()) return
    setLoading(true)
    try { setQueryResult(await ipc.query(sessionId, sql)) }
    finally { setLoading(false) }
  }

  const fmt = (v: any) => {
    if (v===null||v===undefined) return <span style={{ color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>NULL</span>
    if (typeof v==='object') return JSON.stringify(v)
    return String(v)
  }

  if (!sessionId) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:16, background:'rgba(8,12,20,0.8)' }}>
        <div style={{ fontSize:36 }}>🗄️</div>
        <div style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.85)' }}>SQLite Browser</div>
        <div style={{ display:'flex', gap:8, width:440 }}>
          <input value={pathInput} onChange={e=>setPathInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&openDb()} placeholder="/path/to/database.db"
            style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, padding:'8px 12px', color:'#fff', fontFamily:'monospace', fontSize:13 }} />
          <button onClick={openDb} disabled={loading} style={{ padding:'8px 18px', background:'var(--cryo-accent)', color:'#000', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer' }}>
            {loading?'…':'Open'}
          </button>
        </div>
        {error && <div style={{ color:'#f87171', fontSize:12, maxWidth:440, textAlign:'center' }}>{error}</div>}
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)' }}>Opens SQLite databases in read-only mode</div>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', height:'100%', background:'rgba(8,12,20,0.8)', fontFamily:'-apple-system,sans-serif' }}>
      <div style={{ width:200, borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'10px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>TABLES</span>
          <button onClick={closeDb} style={{ fontSize:10, padding:'2px 6px', background:'rgba(248,113,113,0.15)', border:'none', borderRadius:4, color:'#f87171', cursor:'pointer' }}>Close</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'6px 8px' }}>
          {tables.map(t=>(
            <button key={t.name} onClick={()=>selectTable(t.name)}
              style={{ width:'100%', textAlign:'left', padding:'6px 8px', borderRadius:6, border:'none', cursor:'pointer', marginBottom:2, display:'flex', alignItems:'center', gap:6,
                background:selectedTable===t.name?'rgba(0,212,255,0.12)':'transparent', color:selectedTable===t.name?'var(--cryo-accent)':'rgba(255,255,255,0.65)' }}>
              <span style={{ fontSize:10 }}>{t.type==='view'?'👁':'📋'}</span>
              <span style={{ fontSize:11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 14px', alignItems:'center' }}>
          {(['browse','query'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ padding:'9px 16px', fontSize:12, fontWeight:600, border:'none', cursor:'pointer', background:'transparent', textTransform:'capitalize',
                color:tab===t?'var(--cryo-accent)':'rgba(255,255,255,0.4)',
                borderBottom:tab===t?'2px solid var(--cryo-accent)':'2px solid transparent', marginBottom:-1 }}>{t}</button>
          ))}
          {selectedTable&&tab==='browse'&&(
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10, fontSize:11, color:'rgba(255,255,255,0.35)' }}>
              <span>{selectedTable} · {rowCount.toLocaleString()} rows</span>
              <button onClick={()=>page>0&&loadRows(page-1)} disabled={page===0} style={{ padding:'2px 8px', background:'rgba(255,255,255,0.07)', border:'none', borderRadius:4, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>‹</button>
              <span>{page*PAGE_SIZE+1}–{Math.min((page+1)*PAGE_SIZE,total)}</span>
              <button onClick={()=>(page+1)*PAGE_SIZE<total&&loadRows(page+1)} style={{ padding:'2px 8px', background:'rgba(255,255,255,0.07)', border:'none', borderRadius:4, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>›</button>
            </div>
          )}
        </div>

        {tab==='browse'&&(
          <div style={{ flex:1, overflow:'auto' }}>
            {loading?<div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'rgba(255,255,255,0.3)' }}>Loading…</div>
            :!selectedTable?<div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'rgba(255,255,255,0.2)', fontSize:13 }}>Select a table</div>
            :rows.length===0?<div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'rgba(255,255,255,0.2)' }}>No rows</div>
            :(
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11, fontFamily:'JetBrains Mono,monospace' }}>
                <thead><tr>{columns.map(c=><th key={c} style={{ textAlign:'left', padding:'8px 12px', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.07)', color:'var(--cryo-accent)', fontSize:10, fontWeight:700, letterSpacing:'0.05em', whiteSpace:'nowrap', position:'sticky', top:0 }}>{c}</th>)}</tr></thead>
                <tbody>{rows.map((row,ri)=><tr key={ri} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{columns.map(c=><td key={c} style={{ padding:'6px 12px', color:'rgba(255,255,255,0.72)', maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{fmt(row[c])}</td>)}</tr>)}</tbody>
              </table>
            )}
          </div>
        )}

        {tab==='query'&&(
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', padding:14, gap:10 }}>
            <div style={{ display:'flex', gap:8 }}>
              <textarea value={sql} onChange={e=>setSql(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey))runQuery()}}
                placeholder="SELECT * FROM table_name LIMIT 100" rows={4}
                style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'8px 12px', color:'#fff', fontSize:12, fontFamily:'JetBrains Mono,monospace', resize:'none' }} />
              <button onClick={runQuery} disabled={loading} style={{ padding:'8px 18px', background:'var(--cryo-accent)', color:'#000', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', alignSelf:'flex-start', whiteSpace:'nowrap' }}>
                {loading?'…':'Run (⌘↵)'}
              </button>
            </div>
            {queryResult&&(
              queryResult.error
                ?<div style={{ color:'#f87171', fontSize:12, fontFamily:'monospace', background:'rgba(248,113,113,0.08)', padding:10, borderRadius:8 }}>{queryResult.error}</div>
                :<div style={{ flex:1, overflow:'auto' }}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:8 }}>{queryResult.rows.length} row{queryResult.rows.length!==1?'s':''}</div>
                  {queryResult.rows.length>0&&(
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11, fontFamily:'JetBrains Mono,monospace' }}>
                      <thead><tr>{queryResult.columns.map(c=><th key={c} style={{ textAlign:'left', padding:'7px 10px', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.07)', color:'var(--cryo-accent)', fontSize:10, fontWeight:700, whiteSpace:'nowrap', position:'sticky', top:0 }}>{c}</th>)}</tr></thead>
                      <tbody>{queryResult.rows.map((row,ri)=><tr key={ri} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{queryResult.columns.map(c=><td key={c} style={{ padding:'5px 10px', color:'rgba(255,255,255,0.72)', maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{fmt(row[c])}</td>)}</tr>)}</tbody>
                    </table>
                  )}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
