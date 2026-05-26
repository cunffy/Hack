import { useState, useEffect, useRef } from 'react'

const s = {
  root: { display:'flex', flexDirection:'column' as const, height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14 },
  topBar: { display:'flex', gap:8, padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', alignItems:'center', flexWrap:'wrap' as const },
  input: { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'5px 10px', color:'rgba(255,255,255,0.85)', fontSize:12, outline:'none', fontFamily:'"JetBrains Mono",monospace' },
  btn: (c:string,t:string='#000') => ({ padding:'5px 14px', borderRadius:6, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, background:c, color:t }),
  table: { width:'100%', borderCollapse:'collapse' as const, fontFamily:'"JetBrains Mono",monospace', fontSize:11 },
  th: { padding:'6px 10px', textAlign:'left' as const, fontSize:10, color:'rgba(255,255,255,0.4)', borderBottom:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' as const },
  td: { padding:'5px 10px', borderBottom:'1px solid rgba(255,255,255,0.04)', whiteSpace:'nowrap' as const },
  row: (sel:boolean) => ({ background:sel?'rgba(0,212,255,0.08)':'transparent', cursor:'pointer' }),
  proto: (p:string) => {
    const m: any = { TCP:'#00d4ff', UDP:'#a78bfa', ICMP:'#4ade80', HTTP:'#fb923c', HTTPS:'#22c55e', DNS:'#eab308', ARP:'#f472b6' }
    return { padding:'1px 6px', borderRadius:4, fontSize:9, fontWeight:700, background:`${m[p]||'#6b7280'}22`, color:m[p]||'#6b7280' }
  },
}

interface Packet { id:number; time:string; src:string; dst:string; proto:string; len:number; info:string }

const IFACES = ['eth0','wlan0','lo','any']

export default function PacketSnifferApp() {
  const [iface, setIface] = useState('any')
  const [filter, setFilter] = useState('')
  const [running, setRunning] = useState(false)
  const [packets, setPackets] = useState<Packet[]>([])
  const [selected, setSelected] = useState<Packet|null>(null)
  const [search, setSearch] = useState('')
  const tableRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void)|null>(null)

  async function start() {
    setRunning(true)
    setPackets([])
    try {
      const cleanup = await (window as any).cryogram?.packetSniffer?.start(iface, filter, (pkt: Packet) => {
        setPackets(p => [...p.slice(-999), pkt])
      })
      cleanupRef.current = cleanup
    } catch { setRunning(false) }
  }

  async function stop() {
    cleanupRef.current?.()
    await (window as any).cryogram?.packetSniffer?.stop()
    setRunning(false)
  }

  useEffect(() => () => { cleanupRef.current?.() }, [])

  const filtered = packets.filter(p =>
    !search || p.src.includes(search) || p.dst.includes(search) || p.proto.includes(search.toUpperCase()) || p.info.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={s.root}>
      <div style={s.topBar}>
        <span style={{ fontWeight:700, fontSize:14 }}>Packet Sniffer</span>
        <select style={{ ...s.input, width:100 }} value={iface} onChange={e => setIface(e.target.value)} disabled={running}>
          {IFACES.map(i => <option key={i}>{i}</option>)}
        </select>
        <input style={{ ...s.input, width:160 }} placeholder="BPF filter (e.g. tcp port 80)" value={filter} onChange={e => setFilter(e.target.value)} disabled={running} />
        {!running ? (
          <button style={s.btn('#4ade80')} onClick={start}>▶ Start</button>
        ) : (
          <button style={s.btn('#ef4444','#fff')} onClick={stop}>⏹ Stop</button>
        )}
        <button style={s.btn('rgba(255,255,255,0.07)','rgba(255,255,255,0.6)')} onClick={() => setPackets([])} disabled={running}>Clear</button>
        <input style={{ ...s.input, width:160, marginLeft:'auto' }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{filtered.length} packets</span>
      </div>
      {running && <div style={{ height:2, background:'linear-gradient(90deg,var(--cryo-accent,#00d4ff),transparent)', animation:'none' }} />}
      <div style={{ flex:1, overflow:'auto' }} ref={tableRef}>
        <table style={s.table}>
          <thead style={{ position:'sticky' as const, top:0, background:'rgba(8,12,20,0.95)', zIndex:1 }}>
            <tr>
              {['#','Time','Source','Destination','Protocol','Length','Info'].map(h => <th key={h} style={s.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={s.row(selected?.id===p.id)} onClick={() => setSelected(p)}>
                <td style={{ ...s.td, color:'rgba(255,255,255,0.3)' }}>{p.id}</td>
                <td style={{ ...s.td, color:'rgba(255,255,255,0.5)' }}>{p.time}</td>
                <td style={s.td}>{p.src}</td>
                <td style={s.td}>{p.dst}</td>
                <td style={s.td}><span style={s.proto(p.proto)}>{p.proto}</span></td>
                <td style={{ ...s.td, color:'rgba(255,255,255,0.5)' }}>{p.len}</td>
                <td style={{ ...s.td, color:'rgba(255,255,255,0.6)', maxWidth:300, overflow:'hidden', textOverflow:'ellipsis' }}>{p.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {packets.length === 0 && (
          <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', padding:40 }}>
            {running ? 'Capturing packets…' : 'Press Start to begin capture. Requires tshark/tcpdump and appropriate permissions.'}
          </div>
        )}
      </div>
      {selected && (
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', padding:12, background:'rgba(0,0,0,0.3)', maxHeight:140, overflow:'auto' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>PACKET DETAIL — #{selected.id}</div>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:11, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {[['Time',selected.time],['Source',selected.src],['Destination',selected.dst],['Protocol',selected.proto],['Length',String(selected.len)+'b'],['Info',selected.info]].map(([k,v]) => (
              <div key={k}><span style={{ color:'rgba(255,255,255,0.4)' }}>{k}: </span><span>{v}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
