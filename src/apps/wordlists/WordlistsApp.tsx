import { useState, useEffect } from 'react'

const s = {
  root: { display:'flex', height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14 },
  sidebar: { width:260, borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column' as const, padding:12 },
  main: { flex:1, display:'flex', flexDirection:'column' as const, overflow:'hidden' },
  topBar: { display:'flex', gap:8, padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', alignItems:'center' },
  input: { flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'6px 10px', color:'rgba(255,255,255,0.85)', fontSize:13, outline:'none' },
  btn: (c:string,t:string='#000') => ({ padding:'6px 14px', borderRadius:6, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, background:c, color:t }),
  item: (sel:boolean) => ({ padding:'8px 10px', borderRadius:6, cursor:'pointer', marginBottom:4, background:sel?'rgba(0,212,255,0.12)':'transparent', border:`1px solid ${sel?'rgba(0,212,255,0.3)':'transparent'}` }),
  body: { flex:1, overflow:'auto', padding:16, fontFamily:'"JetBrains Mono",monospace', fontSize:12, lineHeight:1.6, whiteSpace:'pre-wrap' as const, color:'rgba(255,255,255,0.8)' },
  badge: { padding:'2px 7px', borderRadius:10, fontSize:10, fontWeight:700, background:'rgba(0,212,255,0.15)', color:'var(--cryo-accent,#00d4ff)', marginLeft:6 },
}

interface WL { name:string; path:string; lineCount:number; sizeKB:number }

export default function WordlistsApp() {
  const [lists, setLists] = useState<WL[]>([])
  const [selected, setSelected] = useState<WL|null>(null)
  const [preview, setPreview] = useState<string[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [genOpen, setGenOpen] = useState(false)
  const [genOpts, setGenOpts] = useState({ minLen:4, maxLen:8, charsets:['lowercase'], count:1000, prefix:'', suffix:'' })

  useEffect(() => { loadLists() }, [])

  async function loadLists() {
    try {
      const data = await (window as any).cryogram?.wordlists?.list()
      if (data) setLists(data)
    } catch {}
  }

  async function select(wl: WL) {
    setSelected(wl)
    setLoading(true)
    try {
      const lines = await (window as any).cryogram?.wordlists?.preview(wl.path, 200)
      setPreview(lines || [])
    } finally { setLoading(false) }
  }

  async function importFile() {
    try {
      await (window as any).cryogram?.wordlists?.import()
      loadLists()
    } catch {}
  }

  async function generate() {
    setLoading(true)
    try {
      await (window as any).cryogram?.wordlists?.generate(genOpts)
      setGenOpen(false)
      loadLists()
    } finally { setLoading(false) }
  }

  const filtered = lists.filter(l => l.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div style={s.root}>
      <div style={s.sidebar}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Wordlists</div>
        <input style={{ ...s.input, marginBottom:8 }} placeholder="Filter…" value={filter} onChange={e => setFilter(e.target.value)} />
        {filtered.map(wl => (
          <div key={wl.path} style={s.item(selected?.path===wl.path)} onClick={() => select(wl)}>
            <div style={{ fontWeight:600, fontSize:12 }}>{wl.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{wl.lineCount.toLocaleString()} lines · {wl.sizeKB}KB</div>
          </div>
        ))}
        {filtered.length===0 && <div style={{ color:'rgba(255,255,255,0.3)', fontSize:12, padding:8 }}>No wordlists found</div>}
        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:6 }}>
          <button style={s.btn('rgba(255,255,255,0.08)','rgba(255,255,255,0.8)')} onClick={importFile}>+ Import File</button>
          <button style={s.btn('var(--cryo-accent,#00d4ff)')} onClick={() => setGenOpen(true)}>⚡ Generate</button>
        </div>
      </div>
      <div style={s.main}>
        {!selected && !genOpen && (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
            <div>Select a wordlist to preview</div>
          </div>
        )}
        {genOpen && (
          <div style={{ padding:24, overflow:'auto', flex:1 }}>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Generate Wordlist</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[['Min Length','minLen'],['Max Length','maxLen'],['Count','count'],['Prefix','prefix'],['Suffix','suffix']].map(([label,key]) => (
                <div key={key}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{label}</div>
                  <input style={s.input} value={(genOpts as any)[key]} onChange={e => setGenOpts(o => ({...o, [key]: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)}))} />
                </div>
              ))}
            </div>
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Character Sets</div>
              <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
                {['lowercase','uppercase','digits','symbols'].map(cs => (
                  <button key={cs} style={{ ...s.btn(genOpts.charsets.includes(cs)?'var(--cryo-accent,#00d4ff)':'rgba(255,255,255,0.08)', genOpts.charsets.includes(cs)?'#000':'rgba(255,255,255,0.7)') }} onClick={() => setGenOpts(o => ({ ...o, charsets: o.charsets.includes(cs) ? o.charsets.filter(c=>c!==cs) : [...o.charsets, cs] }))}>
                    {cs}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:20 }}>
              <button style={s.btn('var(--cryo-accent,#00d4ff)')} onClick={generate}>Generate</button>
              <button style={s.btn('rgba(255,255,255,0.08)','rgba(255,255,255,0.7)')} onClick={() => setGenOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
        {selected && !genOpen && (
          <>
            <div style={s.topBar}>
              <span style={{ fontWeight:700 }}>{selected.name}</span>
              <span style={s.badge}>{selected.lineCount.toLocaleString()} lines</span>
              <span style={{ ...s.badge, marginLeft:4 }}>{selected.sizeKB}KB</span>
              <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
                <button style={s.btn('rgba(239,68,68,0.15)','#ef4444')} onClick={async () => { await (window as any).cryogram?.wordlists?.delete(selected.path); setSelected(null); loadLists() }}>Delete</button>
              </div>
            </div>
            <div style={s.body}>
              {loading ? 'Loading preview…' : preview.join('\n')}
              {!loading && preview.length===200 && '\n… (showing first 200 lines)'}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
