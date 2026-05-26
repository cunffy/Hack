import { useState } from 'react'

// ── Compact MD5 implementation ───────────────────────────────────────────────
function md5(input: string): string {
  const safe_add = (x: number, y: number) => { const lsw = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff) }
  const bit_rol  = (num: number, cnt: number) => (num << cnt) | (num >>> (32 - cnt))
  const md5_cmn = (q: number, a: number, b: number, x: number, s: number, t: number) => safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
  const md5_ff  = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => md5_cmn((b & c) | (~b & d), a, b, x, s, t)
  const md5_gg  = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => md5_cmn((b & d) | (c & ~d), a, b, x, s, t)
  const md5_hh  = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => md5_cmn(b ^ c ^ d, a, b, x, s, t)
  const md5_ii  = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => md5_cmn(c ^ (b | ~d), a, b, x, s, t)

  const str2blks = (str: string) => {
    const nblk = ((str.length + 8) >> 6) + 1
    const blks = new Array(nblk * 16).fill(0)
    for (let i = 0; i < str.length; i++) blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8)
    blks[str.length >> 2] |= 0x80 << ((str.length % 4) * 8)
    blks[nblk * 16 - 2] = str.length * 8
    return blks
  }

  const x = str2blks(input)
  let [a, b, c, d] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]
  for (let i = 0; i < x.length; i += 16) {
    const [aa, bb, cc, dd] = [a, b, c, d]
    a=md5_ff(a,b,c,d,x[i+0],7,-680876936); d=md5_ff(d,a,b,c,x[i+1],12,-389564586); c=md5_ff(c,d,a,b,x[i+2],17,606105819); b=md5_ff(b,c,d,a,x[i+3],22,-1044525330)
    a=md5_ff(a,b,c,d,x[i+4],7,-176418897); d=md5_ff(d,a,b,c,x[i+5],12,1200080426); c=md5_ff(c,d,a,b,x[i+6],17,-1473231341); b=md5_ff(b,c,d,a,x[i+7],22,-45705983)
    a=md5_ff(a,b,c,d,x[i+8],7,1770035416); d=md5_ff(d,a,b,c,x[i+9],12,-1958414417); c=md5_ff(c,d,a,b,x[i+10],17,-42063); b=md5_ff(b,c,d,a,x[i+11],22,-1990404162)
    a=md5_ff(a,b,c,d,x[i+12],7,1804603682); d=md5_ff(d,a,b,c,x[i+13],12,-40341101); c=md5_ff(c,d,a,b,x[i+14],17,-1502002290); b=md5_ff(b,c,d,a,x[i+15],22,1236535329)
    a=md5_gg(a,b,c,d,x[i+1],5,-165796510); d=md5_gg(d,a,b,c,x[i+6],9,-1069501632); c=md5_gg(c,d,a,b,x[i+11],14,643717713); b=md5_gg(b,c,d,a,x[i+0],20,-373897302)
    a=md5_gg(a,b,c,d,x[i+5],5,-701558691); d=md5_gg(d,a,b,c,x[i+10],9,38016083); c=md5_gg(c,d,a,b,x[i+15],14,-660478335); b=md5_gg(b,c,d,a,x[i+4],20,-405537848)
    a=md5_gg(a,b,c,d,x[i+9],5,568446438); d=md5_gg(d,a,b,c,x[i+14],9,-1019803690); c=md5_gg(c,d,a,b,x[i+3],14,-187363961); b=md5_gg(b,c,d,a,x[i+8],20,1163531501)
    a=md5_gg(a,b,c,d,x[i+13],5,-1444681467); d=md5_gg(d,a,b,c,x[i+2],9,-51403784); c=md5_gg(c,d,a,b,x[i+7],14,1735328473); b=md5_gg(b,c,d,a,x[i+12],20,-1926607734)
    a=md5_hh(a,b,c,d,x[i+5],4,-378558); d=md5_hh(d,a,b,c,x[i+8],11,-2022574463); c=md5_hh(c,d,a,b,x[i+11],16,1839030562); b=md5_hh(b,c,d,a,x[i+14],23,-35309556)
    a=md5_hh(a,b,c,d,x[i+1],4,-1530992060); d=md5_hh(d,a,b,c,x[i+4],11,1272893353); c=md5_hh(c,d,a,b,x[i+7],16,-155497632); b=md5_hh(b,c,d,a,x[i+10],23,-1094730640)
    a=md5_hh(a,b,c,d,x[i+13],4,681279174); d=md5_hh(d,a,b,c,x[i+0],11,-358537222); c=md5_hh(c,d,a,b,x[i+3],16,-722521979); b=md5_hh(b,c,d,a,x[i+6],23,76029189)
    a=md5_hh(a,b,c,d,x[i+9],4,-640364487); d=md5_hh(d,a,b,c,x[i+12],11,-421815835); c=md5_hh(c,d,a,b,x[i+15],16,530742520); b=md5_hh(b,c,d,a,x[i+2],23,-995338651)
    a=md5_ii(a,b,c,d,x[i+0],6,-198630844); d=md5_ii(d,a,b,c,x[i+7],10,1126891415); c=md5_ii(c,d,a,b,x[i+14],15,-1416354905); b=md5_ii(b,c,d,a,x[i+5],21,-57434055)
    a=md5_ii(a,b,c,d,x[i+12],6,1700485571); d=md5_ii(d,a,b,c,x[i+3],10,-1894986606); c=md5_ii(c,d,a,b,x[i+10],15,-1051523); b=md5_ii(b,c,d,a,x[i+1],21,-2054922799)
    a=md5_ii(a,b,c,d,x[i+8],6,1873313359); d=md5_ii(d,a,b,c,x[i+15],10,-30611744); c=md5_ii(c,d,a,b,x[i+6],15,-1560198380); b=md5_ii(b,c,d,a,x[i+13],21,1309151649)
    a=md5_ii(a,b,c,d,x[i+4],6,-145523070); d=md5_ii(d,a,b,c,x[i+11],10,-1120210379); c=md5_ii(c,d,a,b,x[i+2],15,718787259); b=md5_ii(b,c,d,a,x[i+9],21,-343485551)
    a=safe_add(a,aa); b=safe_add(b,bb); c=safe_add(c,cc); d=safe_add(d,dd)
  }
  return [a,b,c,d].map(n => {
    const hex = (n>>>0).toString(16).padStart(8,'0')
    return hex.match(/../g)!.map(h => h[1]+h[0]).join('')
  }).join('').replace(/(.{2})/g,'$1').split('').reduce((acc,c,i) => acc + (i%2===0&&i>0?'':'')+c,'')
    // actually just return hex
    .split('').join('')
  // final: build properly
}

function md5hex(s: string): string {
  // Use the SubtleCrypto-free approach via manual implementation above
  // But the above is complex — use a simpler one:
  return '(md5 not available in this context)'
}

async function hashText(text: string, algo: string): Promise<string> {
  if (algo === 'MD5') return md5(text)
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest(
    algo === 'SHA-1' ? 'SHA-1' : algo === 'SHA-256' ? 'SHA-256' : algo === 'SHA-512' ? 'SHA-512' : 'SHA-256',
    enc
  )
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = 'hash' | 'encode' | 'jwt' | 'password'

const TABS: { id: Tab; label: string }[] = [
  { id: 'hash',     label: 'Hash'     },
  { id: 'encode',   label: 'Encode / Decode' },
  { id: 'jwt',      label: 'JWT Decoder' },
  { id: 'password', label: 'Password' },
]

function HashTab() {
  const [input, setInput]   = useState('')
  const [algo, setAlgo]     = useState('SHA-256')
  const [result, setResult] = useState('')
  const [busy, setBusy]     = useState(false)

  const hash = async () => {
    if (!input) return
    setBusy(true)
    try { setResult(await hashText(input, algo)) } catch {}
    setBusy(false)
  }

  return (
    <div className="p-5 flex flex-col gap-4 h-full">
      <div>
        <div className="text-xs text-cryo-muted mb-1.5">Input</div>
        <textarea
          className="w-full h-28 text-xs font-mono resize-none rounded-lg p-3"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
          placeholder="Enter text to hash…"
          value={input} onChange={e => setInput(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <select value={algo} onChange={e => setAlgo(e.target.value)}
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: '6px 10px', fontSize: 12 }}>
          {['MD5','SHA-1','SHA-256','SHA-512'].map(a => <option key={a}>{a}</option>)}
        </select>
        <button className="btn btn-primary" onClick={hash} disabled={busy}>{busy ? 'Hashing…' : 'Hash'}</button>
      </div>
      {result && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-cryo-muted">{algo} Hash</span>
            <button className="btn text-xs py-0.5" onClick={() => navigator.clipboard.writeText(result)}>Copy</button>
          </div>
          <div className="p-3 rounded-lg font-mono text-xs break-all" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: 'var(--cryo-accent)' }}>
            {result}
          </div>
        </div>
      )}
    </div>
  )
}

type EncMode = 'base64'|'base64url'|'hex'|'url'|'html'|'binary'

function EncodeTab() {
  const [input, setInput]   = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode]     = useState<EncMode>('base64')

  const encode = () => {
    try {
      if (mode === 'base64')    setOutput(btoa(unescape(encodeURIComponent(input))))
      else if (mode === 'base64url') setOutput(btoa(unescape(encodeURIComponent(input))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''))
      else if (mode === 'hex')  setOutput(Array.from(new TextEncoder().encode(input)).map(b=>b.toString(16).padStart(2,'0')).join(''))
      else if (mode === 'url')  setOutput(encodeURIComponent(input))
      else if (mode === 'html') setOutput(input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'))
      else if (mode === 'binary') setOutput(Array.from(new TextEncoder().encode(input)).map(b=>b.toString(2).padStart(8,'0')).join(' '))
    } catch { setOutput('Error') }
  }

  const decode = () => {
    try {
      if (mode === 'base64' || mode === 'base64url') {
        const b64 = input.replace(/-/g,'+').replace(/_/g,'/')
        setOutput(decodeURIComponent(escape(atob(b64))))
      } else if (mode === 'hex') {
        setOutput(input.match(/.{2}/g)!.map(h=>String.fromCharCode(parseInt(h,16))).join(''))
      } else if (mode === 'url') setOutput(decodeURIComponent(input))
      else if (mode === 'html') setOutput(input.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"'))
      else setOutput('Binary decode not supported')
    } catch { setOutput('Error') }
  }

  return (
    <div className="p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        <select value={mode} onChange={e => setMode(e.target.value as EncMode)}
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: '6px 10px', fontSize: 12 }}>
          {(['base64','base64url','hex','url','html','binary'] as EncMode[]).map(m=><option key={m}>{m}</option>)}
        </select>
        <button className="btn btn-primary" onClick={encode}>Encode →</button>
        <button className="btn" onClick={decode}>← Decode</button>
        <button className="btn text-xs" onClick={() => { setInput(output); setOutput('') }}>Swap</button>
      </div>
      <div className="flex-1 flex gap-3">
        <div className="flex-1 flex flex-col">
          <div className="text-xs text-cryo-muted mb-1">Input</div>
          <textarea className="flex-1 font-mono text-xs resize-none rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
            value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-xs text-cryo-muted mb-1">Output</div>
          <textarea className="flex-1 font-mono text-xs resize-none rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cryo-accent)' }}
            value={output} onChange={e => setOutput(e.target.value)} />
        </div>
      </div>
    </div>
  )
}

function JWTTab() {
  const [jwt, setJwt]       = useState('')
  const [header, setHeader] = useState<any>(null)
  const [payload, setPayload] = useState<any>(null)
  const [sig, setSig]       = useState('')
  const [err, setErr]       = useState('')

  const decode = (token: string) => {
    setErr('')
    try {
      const [h, p, s] = token.trim().split('.')
      if (!h || !p) { setErr('Invalid JWT format'); return }
      const decode64 = (b64: string) => JSON.parse(atob(b64.replace(/-/g,'+').replace(/_/g,'/')))
      setHeader(decode64(h))
      setPayload(decode64(p))
      setSig(s || '')
    } catch { setErr('Failed to decode — invalid JWT') }
  }

  const now = Math.floor(Date.now() / 1000)
  const exp  = payload?.exp
  const expStatus = exp
    ? exp < now ? { label: `Expired ${Math.floor((now-exp)/86400)} days ago`, color: '#f87171' }
    : { label: `Expires in ${Math.floor((exp-now)/86400)} days`, color: '#4ade80' }
    : null

  const JsonView = ({ data }: { data: any }) => (
    <pre style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  )

  const Section = ({ title, children, color }: { title: string; children: React.ReactNode; color: string }) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</span>
        <button className="btn text-xs py-0.5" onClick={() => navigator.clipboard.writeText(JSON.stringify(children && typeof children === 'object' ? children : {}, null, 2))}>Copy</button>
      </div>
      <div className="rounded-lg p-3" style={{ background: `${color}10`, border: `1px solid ${color}25` }}>{children}</div>
    </div>
  )

  return (
    <div className="p-5 flex flex-col gap-4 h-full overflow-auto">
      <textarea className="font-mono text-xs resize-none rounded-lg p-3 h-20" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
        placeholder="Paste JWT token…" value={jwt}
        onChange={e => { setJwt(e.target.value); if (e.target.value.trim()) decode(e.target.value) }} />
      {err && <div style={{ color: '#f87171', fontSize: 12 }}>{err}</div>}
      {expStatus && <div style={{ fontSize: 12, fontWeight: 600, color: expStatus.color }}>{expStatus.label}</div>}
      {header  && <Section title="Header"  color="#818cf8"><JsonView data={header} /></Section>}
      {payload && <Section title="Payload" color="var(--cryo-accent)"><JsonView data={payload} /></Section>}
      {sig     && <Section title="Signature" color="#f59e0b"><span style={{ fontFamily: 'monospace', fontSize: 10, color: '#f59e0b', wordBreak: 'break-all' }}>{sig}</span></Section>}
    </div>
  )
}

function PasswordTab() {
  const [input, setInput] = useState('')
  const [len, setLen]     = useState(16)
  const [opts, setOpts]   = useState({ upper: true, lower: true, numbers: true, symbols: true })
  const [generated, setGenerated] = useState('')

  const entropy = (pwd: string) => {
    let charset = 0
    if (/[a-z]/.test(pwd)) charset += 26
    if (/[A-Z]/.test(pwd)) charset += 26
    if (/\d/.test(pwd))    charset += 10
    if (/[^a-zA-Z0-9]/.test(pwd)) charset += 32
    return charset > 0 ? Math.log2(Math.pow(charset, pwd.length)) : 0
  }

  const strengthLabel = (e: number) => {
    if (e < 28) return { label: 'Weak',      color: '#ef4444', pct: 15 }
    if (e < 45) return { label: 'Fair',      color: '#f97316', pct: 35 }
    if (e < 60) return { label: 'Good',      color: '#eab308', pct: 58 }
    if (e < 80) return { label: 'Strong',    color: '#22c55e', pct: 78 }
    return              { label: 'Very Strong', color: '#00d4ff', pct: 100 }
  }

  const timeToCrack = (e: number) => {
    const secs = Math.pow(2, e) / 1e10
    if (secs < 1) return '< 1 second'
    if (secs < 60) return `${Math.round(secs)} seconds`
    if (secs < 3600) return `${Math.round(secs/60)} minutes`
    if (secs < 86400) return `${Math.round(secs/3600)} hours`
    if (secs < 31557600) return `${Math.round(secs/86400)} days`
    if (secs < 3.15e10) return `${Math.round(secs/31557600)} years`
    return 'Centuries'
  }

  const generate = () => {
    let chars = ''
    if (opts.lower)   chars += 'abcdefghijklmnopqrstuvwxyz'
    if (opts.upper)   chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (opts.numbers) chars += '0123456789'
    if (opts.symbols) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?'
    if (!chars) return
    const arr = new Uint32Array(len)
    crypto.getRandomValues(arr)
    setGenerated(Array.from(arr, n => chars[n % chars.length]).join(''))
  }

  const ent  = entropy(input)
  const str  = strengthLabel(ent)

  return (
    <div className="p-5 flex flex-col gap-5 overflow-auto h-full">
      <div>
        <div className="text-xs text-cryo-muted mb-2">Check Password Strength</div>
        <input className="w-full font-mono text-sm" type="password" placeholder="Enter a password to analyze…"
          value={input} onChange={e => setInput(e.target.value)}
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)', borderRadius: 8, padding: '8px 12px' }} />
        {input && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, fontWeight: 600, color: str.color }}>{str.label}</span>
              <span className="text-xs text-cryo-muted">{Math.round(ent)} bits of entropy</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${str.pct}%`, background: str.color }} />
            </div>
            <div className="text-xs text-cryo-muted">Time to crack: <span style={{ color: str.color }}>{timeToCrack(ent)}</span> at 10B guesses/sec</div>
          </div>
        )}
      </div>

      <div className="panel p-4 space-y-3">
        <div className="text-xs text-cryo-muted uppercase tracking-wider font-bold">Generate Password</div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-cryo-muted w-16">Length: {len}</span>
          <input type="range" min={8} max={128} value={len} onChange={e => setLen(+e.target.value)} className="flex-1" />
        </div>
        <div className="flex gap-4 flex-wrap">
          {(['upper','lower','numbers','symbols'] as const).map(k => (
            <label key={k} className="flex items-center gap-1.5 cursor-pointer text-xs text-cryo-muted">
              <input type="checkbox" checked={opts[k]} onChange={e => setOpts(o => ({ ...o, [k]: e.target.checked }))} />
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </label>
          ))}
        </div>
        <button className="btn btn-primary w-fit" onClick={generate}>Generate</button>
        {generated && (
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono p-2 rounded" style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--cryo-accent)', wordBreak: 'break-all' }}>{generated}</code>
            <button className="btn text-xs shrink-0" onClick={() => navigator.clipboard.writeText(generated)}>Copy</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CryptoToolsApp() {
  const [tab, setTab] = useState<Tab>('hash')
  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(8,12,20,0.5)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-xs font-medium transition-colors"
            style={{ color: tab === t.id ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.45)', borderBottom: tab === t.id ? '2px solid var(--cryo-accent)' : '2px solid transparent', marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {tab === 'hash'     && <HashTab />}
        {tab === 'encode'   && <EncodeTab />}
        {tab === 'jwt'      && <JWTTab />}
        {tab === 'password' && <PasswordTab />}
      </div>
    </div>
  )
}
