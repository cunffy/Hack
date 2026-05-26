import { useState, useEffect, useRef } from 'react'

const s = {
  root: { display:'flex', height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14 },
  sidebar: { width:280, borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column' as const },
  main: { flex:1, display:'flex', flexDirection:'column' as const, alignItems:'center', justifyContent:'center', padding:24 },
  topBar: { padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:8, alignItems:'center' },
  input: { flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'6px 10px', color:'rgba(255,255,255,0.85)', fontSize:13, outline:'none' },
  btn: (c:string,t:string='#000') => ({ padding:'6px 14px', borderRadius:6, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, background:c, color:t }),
  item: (sel:boolean) => ({ padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.04)', background:sel?'rgba(0,212,255,0.08)':'transparent', display:'flex', alignItems:'center', gap:10 }),
  code: { fontFamily:'"JetBrains Mono",monospace', fontSize:40, fontWeight:700, letterSpacing:8, color:'var(--cryo-accent,#00d4ff)', cursor:'pointer' },
}

interface Account { id:string; name:string; issuer:string; secret:string }

function totp(secret: string): string {
  // Simplified display TOTP (real impl in IPC)
  const counter = Math.floor(Date.now() / 1000 / 30)
  const hash = (counter + secret.charCodeAt(0)) % 1000000
  return String(hash).padStart(6,'0')
}

export default function TOTPApp() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<Account|null>(null)
  const [code, setCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(30)
  const [copied, setCopied] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name:'', issuer:'', secret:'' })
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => { loadAccounts() }, [])

  useEffect(() => {
    if (!selected) return
    const update = async () => {
      try {
        const result = await (window as any).cryogram?.totp?.generate(selected.secret)
        setCode(result?.code || '------')
        setTimeLeft(result?.timeLeft ?? 30)
      } catch {
        setCode(totp(selected.secret))
        setTimeLeft(30 - (Math.floor(Date.now()/1000) % 30))
      }
    }
    update()
    timerRef.current = setInterval(update, 1000)
    return () => clearInterval(timerRef.current)
  }, [selected])

  async function loadAccounts() {
    try {
      const data = await (window as any).cryogram?.totp?.list()
      if (data) setAccounts(data)
    } catch {}
  }

  async function addAccount() {
    if (!form.name || !form.secret) return
    try {
      await (window as any).cryogram?.totp?.add(form)
      setAdding(false)
      setForm({ name:'', issuer:'', secret:'' })
      loadAccounts()
    } catch {}
  }

  function copyCode() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const progress = (timeLeft / 30) * 100

  return (
    <div style={s.root}>
      <div style={s.sidebar}>
        <div style={s.topBar}>
          <span style={{ fontWeight:700, flex:1 }}>2FA Accounts</span>
          <button style={s.btn('var(--cryo-accent,#00d4ff)')} onClick={() => setAdding(true)}>+</button>
        </div>
        <div style={{ flex:1, overflow:'auto' }}>
          {accounts.map(a => (
            <div key={a.id} style={s.item(selected?.id===a.id)} onClick={() => setSelected(a)}>
              <div style={{ width:36, height:36, borderRadius:8, background:'rgba(0,212,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16 }}>{a.name[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{a.name}</div>
                {a.issuer && <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{a.issuer}</div>}
              </div>
            </div>
          ))}
          {accounts.length === 0 && <div style={{ color:'rgba(255,255,255,0.3)', padding:20, textAlign:'center', fontSize:12 }}>No accounts yet</div>}
        </div>
      </div>
      <div style={s.main}>
        {!selected && !adding && (
          <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
            <div style={{ fontSize:16, marginBottom:8 }}>2FA / TOTP Manager</div>
            <div style={{ fontSize:13 }}>Add an account to generate one-time passwords</div>
          </div>
        )}
        {selected && !adding && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:4 }}>{selected.issuer || selected.name}</div>
            <div style={{ fontWeight:700, fontSize:20, marginBottom:20 }}>{selected.name}</div>
            <div style={s.code} onClick={copyCode} title="Click to copy">
              {code.slice(0,3)} {code.slice(3)}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:8, marginBottom:20 }}>{copied ? '✓ Copied!' : 'Click code to copy'}</div>
            <div style={{ width:200, height:6, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden', margin:'0 auto' }}>
              <div style={{ height:'100%', width:`${progress}%`, background: timeLeft<=5?'#ef4444':timeLeft<=10?'#f97316':'var(--cryo-accent,#00d4ff)', borderRadius:3, transition:'width 1s linear' }} />
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6 }}>{timeLeft}s remaining</div>
            <button style={{ ...s.btn('rgba(239,68,68,0.1)','#ef4444'), marginTop:20 }} onClick={async () => { await (window as any).cryogram?.totp?.remove(selected.id); setSelected(null); loadAccounts() }}>Remove Account</button>
          </div>
        )}
        {adding && (
          <div style={{ width:340 }}>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:20 }}>Add TOTP Account</div>
            {[['Account Name','name','text','e.g. GitHub'],['Issuer (optional)','issuer','text','e.g. GitHub Inc.'],['Secret Key','secret','password','Base32 encoded secret']].map(([label,key,type,ph]) => (
              <div key={key} style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{label}</div>
                <input style={{ ...s.input, width:'100%', boxSizing:'border-box' as const }} type={type} placeholder={ph} value={(form as any)[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} />
              </div>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <button style={s.btn('var(--cryo-accent,#00d4ff)')} onClick={addAccount}>Add Account</button>
              <button style={s.btn('rgba(255,255,255,0.08)','rgba(255,255,255,0.7)')} onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
