import { useState, useMemo } from 'react'

type Op = { id:string; type:string; direction:'encode'|'decode' }

const OPS = ['Base64','Base32','URL','HTML Entities','Hex','Binary','ROT13','Caesar','MD5 Hash','SHA1 Hash','SHA256 Hash','AES-256 (ECB)','Reverse','Uppercase','Lowercase']

const s = {
  root: { display:'flex', height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14 },
  left: { width:320, borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column' as const },
  right: { flex:1, display:'flex', flexDirection:'column' as const, overflow:'auto', padding:16 },
  topBar: { padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontWeight:700, fontSize:14 },
  btn: (c:string,t:string='#000') => ({ padding:'5px 12px', borderRadius:5, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, background:c, color:t }),
  textarea: { flex:1, background:'rgba(255,255,255,0.03)', border:'none', outline:'none', color:'rgba(255,255,255,0.85)', fontFamily:'"JetBrains Mono",monospace', fontSize:12, resize:'none' as const, padding:12, lineHeight:1.6 },
  card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:12, marginBottom:12 },
  step: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:10, marginBottom:8, display:'flex', alignItems:'center', gap:8 },
}

function applyOp(input: string, op: Op): string {
  try {
    if (op.type === 'Base64') return op.direction==='encode' ? btoa(input) : atob(input)
    if (op.type === 'URL') return op.direction==='encode' ? encodeURIComponent(input) : decodeURIComponent(input)
    if (op.type === 'HTML Entities') return op.direction==='encode' ? input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : input.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"')
    if (op.type === 'Hex') return op.direction==='encode' ? Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2,'0')).join('') : input.replace(/([0-9a-f]{2})/gi,(_,h)=>String.fromCharCode(parseInt(h,16)))
    if (op.type === 'Binary') return op.direction==='encode' ? Array.from(input).map(c => c.charCodeAt(0).toString(2).padStart(8,'0')).join(' ') : input.split(' ').map(b => String.fromCharCode(parseInt(b,2))).join('')
    if (op.type === 'ROT13') return input.replace(/[a-zA-Z]/g, c => String.fromCharCode((c.toLowerCase()<'n'?1:-1)*13+c.charCodeAt(0)))
    if (op.type === 'Reverse') return input.split('').reverse().join('')
    if (op.type === 'Uppercase') return input.toUpperCase()
    if (op.type === 'Lowercase') return input.toLowerCase()
    if (op.type === 'Caesar') { const shift = op.direction==='encode'?13:-13; return input.replace(/[a-zA-Z]/g, c => { const b = c<'a'?65:97; return String.fromCharCode(((c.charCodeAt(0)-b+shift+26)%26)+b) }) }
    return input + ` [${op.type} not available in browser]`
  } catch(e: any) { return `[Error: ${e.message}]` }
}

export default function EncodingChainApp() {
  const [input, setInput] = useState('')
  const [chain, setChain] = useState<Op[]>([])
  const [adding, setAdding] = useState(false)
  const [newOp, setNewOp] = useState({ type:'Base64', direction:'encode' as 'encode'|'decode' })

  const steps = useMemo(() => {
    const results: string[] = [input]
    for (const op of chain) {
      results.push(applyOp(results[results.length-1], op))
    }
    return results
  }, [input, chain])

  function addOp() {
    setChain(c => [...c, { id: Math.random().toString(36).slice(2), ...newOp }])
    setAdding(false)
  }

  function removeOp(id: string) { setChain(c => c.filter(o => o.id !== id)) }
  function moveUp(idx: number) { if (idx===0) return; setChain(c => { const n=[...c]; [n[idx-1],n[idx]]=[n[idx],n[idx-1]]; return n }) }
  function moveDown(idx: number) { if (idx===chain.length-1) return; setChain(c => { const n=[...c]; [n[idx],n[idx+1]]=[n[idx+1],n[idx]]; return n }) }

  return (
    <div style={s.root}>
      <div style={s.left}>
        <div style={s.topBar}>Encoding Chain</div>
        <div style={{ flex:1, overflow:'auto', padding:12 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>INPUT</div>
          <textarea style={{ ...s.textarea, height:100, border:'1px solid rgba(255,255,255,0.07)', borderRadius:6, marginBottom:12, flex:'none' }} value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to encode/decode…" />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>PIPELINE ({chain.length} steps)</div>
            <button style={s.btn('var(--cryo-accent,#00d4ff)')} onClick={() => setAdding(true)}>+ Add Step</button>
          </div>
          {chain.length === 0 && <div style={{ color:'rgba(255,255,255,0.3)', fontSize:12, textAlign:'center', padding:20 }}>No operations yet.<br/>Add steps to build your chain.</div>}
          {chain.map((op,i) => (
            <div key={op.id} style={s.step}>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', width:16, textAlign:'center' }}>{i+1}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:12 }}>{op.type}</div>
                <div style={{ fontSize:10, color:op.direction==='encode'?'var(--cryo-accent,#00d4ff)':'#f97316' }}>{op.direction}</div>
              </div>
              <button style={s.btn('rgba(255,255,255,0.06)','rgba(255,255,255,0.5)')} onClick={() => moveUp(i)}>↑</button>
              <button style={s.btn('rgba(255,255,255,0.06)','rgba(255,255,255,0.5)')} onClick={() => moveDown(i)}>↓</button>
              <button style={s.btn('rgba(239,68,68,0.1)','#ef4444')} onClick={() => removeOp(op.id)}>×</button>
            </div>
          ))}
          {adding && (
            <div style={{ background:'rgba(0,212,255,0.05)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:8, padding:12 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>OPERATION</div>
              <select style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:5, padding:'5px 8px', color:'rgba(255,255,255,0.85)', marginBottom:8 }} value={newOp.type} onChange={e => setNewOp(o => ({...o, type:e.target.value}))}>
                {OPS.map(o => <option key={o}>{o}</option>)}
              </select>
              <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                {(['encode','decode'] as const).map(d => (
                  <button key={d} style={s.btn(newOp.direction===d?'var(--cryo-accent,#00d4ff)':'rgba(255,255,255,0.07)', newOp.direction===d?'#000':'rgba(255,255,255,0.6)')} onClick={() => setNewOp(o => ({...o, direction:d}))}>{d}</button>
                ))}
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button style={s.btn('var(--cryo-accent,#00d4ff)')} onClick={addOp}>Add</button>
                <button style={s.btn('rgba(255,255,255,0.07)','rgba(255,255,255,0.6)')} onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={s.right}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Pipeline Output</div>
        {steps.slice(1).map((val,i) => (
          <div key={i} style={s.card}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Step {i+1}: <span style={{ color:chain[i]?.direction==='encode'?'var(--cryo-accent,#00d4ff)':'#f97316' }}>{chain[i]?.type} ({chain[i]?.direction})</span></div>
              <button style={s.btn('rgba(255,255,255,0.06)','rgba(255,255,255,0.5)')} onClick={() => navigator.clipboard.writeText(val)}>Copy</button>
            </div>
            <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:12, wordBreak:'break-all' as const, color:'rgba(255,255,255,0.85)', maxHeight:80, overflow:'auto' }}>{val}</div>
          </div>
        ))}
        {chain.length > 0 && steps.length > 1 && (
          <div style={{ ...s.card, borderColor:'var(--cryo-accent,#00d4ff)', background:'rgba(0,212,255,0.05)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ fontSize:11, color:'var(--cryo-accent,#00d4ff)', fontWeight:700 }}>FINAL OUTPUT</div>
              <button style={s.btn('var(--cryo-accent,#00d4ff)')} onClick={() => navigator.clipboard.writeText(steps[steps.length-1])}>Copy</button>
            </div>
            <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:12, wordBreak:'break-all' as const, color:'rgba(255,255,255,0.85)' }}>{steps[steps.length-1]}</div>
          </div>
        )}
        {chain.length === 0 && <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', marginTop:60 }}>Add operations to the pipeline to see results</div>}
      </div>
    </div>
  )
}
