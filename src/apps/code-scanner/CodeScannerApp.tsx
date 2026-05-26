import { useState } from 'react'

const s = {
  root: { display:'flex', height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14 },
  sidebar: { width:280, borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column' as const, padding:14 },
  main: { flex:1, display:'flex', flexDirection:'column' as const, overflow:'hidden' },
  topBar: { padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:8, alignItems:'center' },
  btn: (c:string,t:string='#000',d=false) => ({ padding:'6px 16px', borderRadius:6, border:'none', cursor:d?'not-allowed':'pointer', fontSize:12, fontWeight:600, background:d?'rgba(255,255,255,0.05)':c, color:d?'rgba(255,255,255,0.3)':t, opacity:d?0.6:1 }),
  input: { width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'6px 10px', color:'rgba(255,255,255,0.85)', fontSize:12, outline:'none', boxSizing:'border-box' as const },
  card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:12, marginBottom:8, cursor:'pointer' as const },
  sev: (s:string) => {
    const c: any = { CRITICAL:'#ef4444', HIGH:'#f97316', MEDIUM:'#eab308', LOW:'#22c55e', INFO:'#00d4ff' }
    return { display:'inline-block', padding:'1px 7px', borderRadius:10, fontSize:10, fontWeight:700, background:`${c[s]||'#6b7280'}22`, color:c[s]||'#6b7280', marginRight:6 }
  },
  progress: { height:3, borderRadius:2, background:'rgba(255,255,255,0.07)', overflow:'hidden' as const },
  bar: (p:number) => ({ height:'100%', width:`${p}%`, background:'var(--cryo-accent,#00d4ff)', transition:'width 0.3s' }),
}

interface Finding { id:string; severity:'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'|'INFO'; rule:string; file:string; line:number; code:string; message:string; fix?:string }
interface ScanResult { findings: Finding[]; scanned: number; duration: number; scanner: string }

const SCANNERS = ['Auto-detect','semgrep','bandit (Python)','npm audit','eslint-security','Pattern-based']

export default function CodeScannerApp() {
  const [path, setPath] = useState('')
  const [scanner, setScanner] = useState('Auto-detect')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ScanResult|null>(null)
  const [selected, setSelected] = useState<Finding|null>(null)
  const [filter, setFilter] = useState('All')

  async function browse() {
    try {
      const p = await (window as any).cryogram?.codeScanner?.browse()
      if (p) setPath(p)
    } catch {}
  }

  async function scan() {
    if (!path) return
    setScanning(true)
    setProgress(0)
    setResult(null)
    setSelected(null)
    try {
      const progressCleanup = (window as any).cryogram?.codeScanner?.onProgress?.((pct: number) => setProgress(pct))
      const res = await (window as any).cryogram?.codeScanner?.scan(path, scanner)
      progressCleanup?.()
      if (res) setResult(res)
    } finally {
      setScanning(false)
      setProgress(100)
    }
  }

  const findings = result?.findings || []
  const filtered = filter==='All' ? findings : findings.filter(f => f.severity===filter)
  const counts: any = {}
  findings.forEach(f => { counts[f.severity] = (counts[f.severity]||0)+1 })

  return (
    <div style={s.root}>
      <div style={s.sidebar}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Code Scanner</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>TARGET PATH</div>
        <div style={{ display:'flex', gap:6, marginBottom:12 }}>
          <input style={s.input} placeholder="/path/to/project" value={path} onChange={e => setPath(e.target.value)} />
          <button style={s.btn('rgba(255,255,255,0.08)','rgba(255,255,255,0.7)')} onClick={browse}>…</button>
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>SCANNER</div>
        <select style={{ ...s.input, marginBottom:16 }} value={scanner} onChange={e => setScanner(e.target.value)}>
          {SCANNERS.map(s => <option key={s}>{s}</option>)}
        </select>
        <button style={s.btn(scanning?'rgba(255,255,255,0.05)':'var(--cryo-accent,#00d4ff)',scanning?'rgba(255,255,255,0.3)':'#000',scanning||!path)} onClick={scan} disabled={scanning||!path}>
          {scanning ? '🔍 Scanning…' : '🔍 Scan for Vulnerabilities'}
        </button>
        {scanning && <div style={{ marginTop:10 }}><div style={s.progress}><div style={s.bar(progress)} /></div><div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4 }}>Analyzing code…</div></div>}
        {result && (
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>RESULTS</div>
            <div style={{ fontSize:12, marginBottom:4 }}>Scanner: <span style={{ color:'var(--cryo-accent,#00d4ff)' }}>{result.scanner}</span></div>
            <div style={{ fontSize:12, marginBottom:4 }}>Scanned: <span style={{ color:'rgba(255,255,255,0.7)' }}>{result.scanned} files</span></div>
            <div style={{ fontSize:12, marginBottom:12 }}>Duration: <span style={{ color:'rgba(255,255,255,0.7)' }}>{result.duration}ms</span></div>
            {(['CRITICAL','HIGH','MEDIUM','LOW','INFO'] as const).filter(s=>counts[s]).map(sev => (
              <div key={sev} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <span style={s.sev(sev)}>{sev}</span>
                <div style={{ flex:1, height:4, borderRadius:2, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${(counts[sev]/findings.length)*100}%`, background: sev==='CRITICAL'?'#ef4444':sev==='HIGH'?'#f97316':sev==='MEDIUM'?'#eab308':'#22c55e' }} />
                </div>
                <span style={{ fontSize:12, fontWeight:700 }}>{counts[sev]}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop:'auto', fontSize:11, color:'rgba(255,255,255,0.3)', lineHeight:1.5 }}>
          Scans for OWASP Top 10, injection flaws, hardcoded secrets, insecure deps, and more.
        </div>
      </div>
      <div style={s.main}>
        {result && (
          <div style={s.topBar}>
            <span style={{ fontWeight:600 }}>{findings.length} findings</span>
            <div style={{ display:'flex', gap:4, marginLeft:12 }}>
              {['All','CRITICAL','HIGH','MEDIUM','LOW','INFO'].map(f => (
                <button key={f} style={s.btn(filter===f?'var(--cryo-accent,#00d4ff)':'rgba(255,255,255,0.07)',filter===f?'#000':'rgba(255,255,255,0.6)')} onClick={() => setFilter(f)}>{f}{f!=='All'&&counts[f]?` (${counts[f]})`:''}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ flex:1, overflow:'auto', padding:14 }}>
          {!result && !scanning && (
            <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', marginTop:80 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔐</div>
              <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Vulnerability Scanner</div>
              <div style={{ fontSize:13 }}>Select a project directory and run a scan to find security issues</div>
              <div style={{ marginTop:20, fontSize:12, color:'rgba(255,255,255,0.2)' }}>Detects: SQL injection, XSS, hardcoded secrets,<br/>insecure dependencies, OWASP Top 10, and more</div>
            </div>
          )}
          {filtered.map(f => (
            <div key={f.id} style={{ ...s.card, borderColor:selected?.id===f.id?'var(--cryo-accent,#00d4ff)':'rgba(255,255,255,0.07)' }} onClick={() => setSelected(selected?.id===f.id?null:f)}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <span style={s.sev(f.severity)}>{f.severity}</span>
                <span style={{ fontWeight:600, fontSize:13 }}>{f.rule}</span>
              </div>
              <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>{f.file}:{f.line}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>{f.message}</div>
              {selected?.id===f.id && (
                <div style={{ marginTop:10 }}>
                  <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:11, background:'rgba(239,68,68,0.08)', borderRadius:4, padding:8, color:'#ef4444', marginBottom:8 }}>{f.code}</div>
                  {f.fix && <div style={{ fontSize:11, color:'#4ade80', background:'rgba(34,197,94,0.08)', borderRadius:4, padding:8 }}>💡 Fix: {f.fix}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
