import { useState, useEffect } from 'react'

const s = {
  root: { display:'flex', flexDirection:'column' as const, height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14 },
  topBar: { display:'flex', gap:8, padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', alignItems:'center' },
  body: { flex:1, overflow:'auto', padding:16 },
  btn: (c:string,t:string='#000') => ({ padding:'7px 16px', borderRadius:6, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, background:c, color:t }),
  card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:14, marginBottom:10 },
  status: (s:string) => ({ padding:'2px 8px', borderRadius:10, fontSize:10, fontWeight:700, background: s==='complete'?'rgba(34,197,94,0.15)':s==='error'?'rgba(239,68,68,0.15)':'rgba(234,179,8,0.15)', color:s==='complete'?'#4ade80':s==='error'?'#ef4444':'#eab308', marginLeft:8 }),
  progress: { height:4, borderRadius:2, background:'rgba(255,255,255,0.08)', marginTop:10, overflow:'hidden' },
  bar: (p:number) => ({ height:'100%', width:`${p}%`, background:'var(--cryo-accent,#00d4ff)', borderRadius:2, transition:'width 0.3s' }),
}

interface Backup { id:string; name:string; size:string; created:string; status:'complete'|'error'|'pending'; items:number }

export default function BackupApp() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [log, setLog] = useState<string[]>([])

  useEffect(() => { loadBackups() }, [])

  async function loadBackups() {
    try {
      const data = await (window as any).cryogram?.backup?.list()
      if (data) setBackups(data)
    } catch {}
  }

  async function createBackup() {
    setRunning(true)
    setProgress(0)
    setLog([])
    try {
      const unlisten = await (window as any).cryogram?.backup?.onProgress?.((msg: string, pct: number) => {
        setLog(l => [...l, msg])
        setProgress(pct)
      })
      await (window as any).cryogram?.backup?.create()
      unlisten?.()
      setProgress(100)
      setLog(l => [...l, '✓ Backup complete'])
      loadBackups()
    } catch(e: any) {
      setLog(l => [...l, `✗ Error: ${e?.message || e}`])
    } finally {
      setRunning(false)
    }
  }

  async function restore(id: string) {
    if (!confirm('Restore this backup? Current data will be overwritten.')) return
    setRunning(true)
    try {
      await (window as any).cryogram?.backup?.restore(id)
      setLog(['✓ Restore complete'])
    } finally { setRunning(false) }
  }

  async function deleteBackup(id: string) {
    if (!confirm('Delete this backup?')) return
    try {
      await (window as any).cryogram?.backup?.delete(id)
      loadBackups()
    } catch {}
  }

  return (
    <div style={s.root}>
      <div style={s.topBar}>
        <span style={{ fontWeight:700, fontSize:15 }}>System Backup</span>
        <button style={{ ...s.btn('var(--cryo-accent,#00d4ff)'), marginLeft:'auto' }} onClick={createBackup} disabled={running}>
          {running ? '⏳ Backing up…' : '💾 Create Backup'}
        </button>
      </div>
      {running && (
        <div style={{ padding:'8px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:4 }}>{log[log.length-1] || 'Starting…'}</div>
          <div style={s.progress}><div style={s.bar(progress)} /></div>
        </div>
      )}
      <div style={s.body}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          {[['Total Backups', String(backups.length), '#00d4ff'], ['Latest', backups[0]?.created || '—', '#4ade80'], ['Total Size', backups.reduce((a,b)=>a,0) + ' items', '#a78bfa']].map(([l,v,c]) => (
            <div key={l} style={{ background:`rgba(255,255,255,0.04)`, border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:14 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{l}</div>
              <div style={{ fontWeight:700, fontSize:20, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontWeight:600, marginBottom:10 }}>Backup History</div>
        {backups.length === 0 && <div style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', marginTop:40 }}>No backups yet. Create your first backup above.</div>}
        {backups.map(b => (
          <div key={b.id} style={s.card}>
            <div style={{ display:'flex', alignItems:'center' }}>
              <span style={{ fontWeight:600 }}>{b.name}</span>
              <span style={s.status(b.status)}>{b.status}</span>
              <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
                <button style={s.btn('rgba(0,212,255,0.1)','var(--cryo-accent,#00d4ff)')} onClick={() => restore(b.id)}>Restore</button>
                <button style={s.btn('rgba(239,68,68,0.1)','#ef4444')} onClick={() => deleteBackup(b.id)}>Delete</button>
              </div>
            </div>
            <div style={{ display:'flex', gap:20, marginTop:8, fontSize:12, color:'rgba(255,255,255,0.4)' }}>
              <span>📅 {b.created}</span>
              <span>📦 {b.size}</span>
              <span>📁 {b.items} items</span>
            </div>
          </div>
        ))}
        {log.length > 0 && !running && (
          <div style={{ marginTop:20 }}>
            <div style={{ fontWeight:600, marginBottom:8 }}>Log</div>
            <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, padding:12, fontFamily:'"JetBrains Mono",monospace', fontSize:11, color:'rgba(255,255,255,0.7)', maxHeight:160, overflow:'auto' }}>
              {log.map((l,i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
