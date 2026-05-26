import { useState, useMemo } from 'react'

const s = {
  root: { display:'flex', flexDirection:'column' as const, height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14 },
  topBar: { padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:8, alignItems:'center' },
  input: { flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'6px 10px', color:'rgba(255,255,255,0.85)', fontSize:13, outline:'none', fontFamily:'"JetBrains Mono",monospace' },
  body: { flex:1, overflow:'auto', padding:16, display:'flex', flexDirection:'column' as const, gap:12 },
  card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:14 },
  label: { fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:6, textTransform:'uppercase' as const },
  textarea: { width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:6, padding:10, color:'rgba(255,255,255,0.85)', fontFamily:'"JetBrains Mono",monospace', fontSize:12, outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, lineHeight:1.6 },
  flag: (active:boolean) => ({ padding:'3px 10px', borderRadius:4, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, background:active?'var(--cryo-accent,#00d4ff)':'rgba(255,255,255,0.07)', color:active?'#000':'rgba(255,255,255,0.6)' }),
  badge: { padding:'2px 7px', borderRadius:10, fontSize:10, fontWeight:700, background:'rgba(0,212,255,0.15)', color:'var(--cryo-accent,#00d4ff)' },
}

const PATTERNS = [
  { label:'Email', pattern:'^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$', flags:'i' },
  { label:'IPv4', pattern:'^(\\d{1,3}\\.){3}\\d{1,3}$', flags:'' },
  { label:'URL', pattern:'https?:\\/\\/[\\w-]+(\\.[\\w-]+)+', flags:'g' },
  { label:'Phone', pattern:'\\+?[\\d\\s()-]{10,15}', flags:'g' },
  { label:'MD5', pattern:'[a-f0-9]{32}', flags:'gi' },
  { label:'SHA256', pattern:'[a-f0-9]{64}', flags:'gi' },
  { label:'JWT', pattern:'[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+', flags:'g' },
  { label:'CVE', pattern:'CVE-\\d{4}-\\d{4,}', flags:'gi' },
  { label:'IP:Port', pattern:'\\d{1,3}(?:\\.\\d{1,3}){3}:\\d{2,5}', flags:'g' },
]

export default function RegexApp() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState({ g:true, i:false, m:false, s:false })
  const [testStr, setTestStr] = useState('')
  const [replaceWith, setReplaceWith] = useState('')
  const [tab, setTab] = useState<'match'|'replace'>('match')

  const flagStr = Object.entries(flags).filter(([,v])=>v).map(([k])=>k).join('')

  const result = useMemo(() => {
    if (!pattern) return { error: null, matches: [] as RegExpExecArray[], highlighted: testStr }
    try {
      const re = new RegExp(pattern, flagStr || 'g')
      const matches: RegExpExecArray[] = []
      if (flags.g) {
        let m: RegExpExecArray | null
        let safeRe = new RegExp(pattern, flagStr)
        while ((m = safeRe.exec(testStr)) !== null) {
          matches.push(m)
          if (!flags.g) break
        }
      } else {
        const m = re.exec(testStr)
        if (m) matches.push(m)
      }
      // Build highlighted HTML
      let html = testStr
      let offset = 0
      const sorted = [...matches].sort((a,b)=>a.index-b.index)
      for (const m of sorted) {
        const start = m.index + offset
        const end = start + m[0].length
        const before = html.slice(0, start)
        const match = html.slice(start, end)
        const after = html.slice(end)
        const wrapped = `<mark style="background:rgba(0,212,255,0.3);border-radius:2px;color:inherit">${match}</mark>`
        html = before + wrapped + after
        offset += wrapped.length - match.length
      }
      return { error: null, matches, highlighted: html }
    } catch(e: any) {
      return { error: e.message, matches: [], highlighted: testStr }
    }
  }, [pattern, flagStr, testStr, flags.g])

  const replaced = useMemo(() => {
    if (!pattern || !replaceWith) return testStr
    try {
      return testStr.replace(new RegExp(pattern, flagStr), replaceWith)
    } catch { return testStr }
  }, [pattern, flagStr, testStr, replaceWith])

  return (
    <div style={s.root}>
      <div style={s.topBar}>
        <span style={{ fontFamily:'"JetBrains Mono",monospace', color:'rgba(255,255,255,0.4)', fontSize:16 }}>/</span>
        <input style={s.input} placeholder="Enter regex pattern…" value={pattern} onChange={e => setPattern(e.target.value)} spellCheck={false} />
        <span style={{ fontFamily:'"JetBrains Mono",monospace', color:'rgba(255,255,255,0.4)', fontSize:16 }}>/</span>
        {(['g','i','m','s'] as const).map(f => (
          <button key={f} style={s.flag(flags[f as keyof typeof flags])} onClick={() => setFlags(fl => ({...fl, [f]: !fl[f as keyof typeof fl]}))}>{f}</button>
        ))}
        {result.matches.length > 0 && <span style={s.badge}>{result.matches.length} match{result.matches.length!==1?'es':''}</span>}
      </div>
      <div style={{ padding:'6px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:6, flexWrap:'wrap' as const }}>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:'24px', marginRight:4 }}>Quick:</span>
        {PATTERNS.map(p => (
          <button key={p.label} style={{ padding:'2px 10px', borderRadius:4, border:'none', cursor:'pointer', fontSize:11, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)' }} onClick={() => { setPattern(p.pattern); setFlags({ g:p.flags.includes('g'), i:p.flags.includes('i'), m:p.flags.includes('m'), s:p.flags.includes('s') }) }}>{p.label}</button>
        ))}
      </div>
      <div style={s.body}>
        {result.error && <div style={{ padding:'6px 12px', background:'rgba(239,68,68,0.1)', borderRadius:6, color:'#ef4444', fontFamily:'"JetBrains Mono",monospace', fontSize:12 }}>⚠ {result.error}</div>}
        <div style={s.card}>
          <div style={s.label}>Test String</div>
          <textarea style={{ ...s.textarea, minHeight:100 }} value={testStr} onChange={e => setTestStr(e.target.value)} placeholder="Paste text to test against the regex…" spellCheck={false} />
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:4 }}>
          {(['match','replace'] as const).map(t => (
            <button key={t} style={{ padding:'5px 14px', borderRadius:5, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, background:tab===t?'var(--cryo-accent,#00d4ff)':'rgba(255,255,255,0.07)', color:tab===t?'#000':'rgba(255,255,255,0.6)' }} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
        {tab==='match' && (
          <div style={s.card}>
            <div style={s.label}>Highlighted Matches</div>
            <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:12, lineHeight:1.8, whiteSpace:'pre-wrap' as const }} dangerouslySetInnerHTML={{ __html: result.highlighted }} />
            {result.matches.length > 0 && (
              <div style={{ marginTop:10 }}>
                <div style={s.label}>Match Details</div>
                {result.matches.map((m,i) => (
                  <div key={i} style={{ marginBottom:6, fontSize:12 }}>
                    <span style={{ color:'rgba(255,255,255,0.4)', marginRight:8 }}>#{i+1}</span>
                    <span style={{ fontFamily:'"JetBrains Mono",monospace', background:'rgba(0,212,255,0.1)', padding:'1px 6px', borderRadius:3 }}>{m[0]}</span>
                    <span style={{ color:'rgba(255,255,255,0.4)', marginLeft:8 }}>at {m.index}</span>
                    {m.slice(1).map((g,gi) => g !== undefined && <span key={gi} style={{ marginLeft:8, color:'rgba(255,255,255,0.5)' }}>group{gi+1}: <span style={{ fontFamily:'"JetBrains Mono",monospace' }}>{g}</span></span>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab==='replace' && (
          <div style={s.card}>
            <div style={s.label}>Replace With</div>
            <input style={{ ...s.input, width:'100%', marginBottom:12, boxSizing:'border-box' as const }} placeholder="Replacement string (use $1, $2 for groups)…" value={replaceWith} onChange={e => setReplaceWith(e.target.value)} />
            <div style={s.label}>Result</div>
            <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:12, lineHeight:1.8, whiteSpace:'pre-wrap' as const, color:'#4ade80' }}>{replaced}</div>
          </div>
        )}
      </div>
    </div>
  )
}
