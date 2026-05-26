import { useState, useEffect } from 'react'

interface TrashItem {
  name: string
  originalPath: string
  deletionDate: string
  size: number
}

const ipc = (window as any).cryogram?.trash

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function TrashApp() {
  const [items, setItems] = useState<TrashItem[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [trashSize, setTrashSize] = useState({ count: 0, bytes: 0 })
  const [loading, setLoading] = useState(false)
  const [confirmEmpty, setConfirmEmpty] = useState(false)

  const load = async () => {
    if (!ipc) return
    setLoading(true)
    try {
      const [list, sz] = await Promise.all([ipc.list(), ipc.getSize()])
      setItems(list)
      setTrashSize(sz)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const toggleSelect = (name: string) => {
    setSelected(s => {
      const next = new Set(s)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const restore = async (names: string[]) => {
    if (!ipc) return
    await Promise.all(names.map(n => ipc.restore(n)))
    setSelected(new Set())
    await load()
  }

  const deletePermanent = async (names: string[]) => {
    if (!ipc) return
    await Promise.all(names.map(n => ipc.deletePermanent(n)))
    setSelected(new Set())
    await load()
  }

  const emptyTrash = async () => {
    if (!ipc) return
    await ipc.empty()
    setConfirmEmpty(false)
    setSelected(new Set())
    await load()
  }

  const selArr = Array.from(selected)

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'rgba(8,12,20,0.8)', fontFamily:'-apple-system,sans-serif' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.85)' }}>🗑️ Trash</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>
            {trashSize.count} item{trashSize.count!==1?'s':''} · {formatSize(trashSize.bytes)}
          </div>
        </div>
        {selArr.length > 0 && (
          <>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{selArr.length} selected</span>
            <button onClick={()=>restore(selArr)}
              style={{ padding:'5px 12px', fontSize:11, fontWeight:600, background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.25)', borderRadius:6, color:'#4ade80', cursor:'pointer' }}>
              Restore
            </button>
            <button onClick={()=>deletePermanent(selArr)}
              style={{ padding:'5px 12px', fontSize:11, fontWeight:600, background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:6, color:'#f87171', cursor:'pointer' }}>
              Delete
            </button>
          </>
        )}
        <button onClick={load} style={{ padding:'5px 10px', fontSize:11, background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>⟳</button>
        {!confirmEmpty ? (
          <button onClick={()=>setConfirmEmpty(true)} disabled={items.length===0}
            style={{ padding:'5px 14px', fontSize:11, fontWeight:600, background:'rgba(248,113,113,0.15)', border:'none', borderRadius:6, color:items.length===0?'rgba(255,255,255,0.2)':'#f87171', cursor:items.length===0?'default':'pointer' }}>
            Empty Trash
          </button>
        ) : (
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ fontSize:11, color:'#f87171' }}>Permanently delete all?</span>
            <button onClick={emptyTrash} style={{ padding:'4px 10px', fontSize:11, fontWeight:700, background:'#f87171', border:'none', borderRadius:6, color:'#000', cursor:'pointer' }}>Yes</button>
            <button onClick={()=>setConfirmEmpty(false)} style={{ padding:'4px 10px', fontSize:11, background:'rgba(255,255,255,0.08)', border:'none', borderRadius:6, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>No</button>
          </div>
        )}
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px 10px' }}>
        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, color:'rgba(255,255,255,0.3)' }}>Loading…</div>
        ) : items.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:200, gap:10, color:'rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize:48 }}>🗑️</div>
            <div style={{ fontSize:13 }}>Trash is empty</div>
          </div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'32px 1fr 200px 120px 100px', gap:'0 8px', padding:'0 6px', marginBottom:4 }}>
              <div />
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Name</div>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Original Location</div>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Deleted</div>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Size</div>
            </div>
            {items.map(item => (
              <div key={item.name}
                style={{ display:'grid', gridTemplateColumns:'32px 1fr 200px 120px 100px', gap:'0 8px', padding:'7px 6px', borderRadius:8, marginBottom:2, cursor:'pointer', alignItems:'center',
                  background:selected.has(item.name)?'rgba(0,212,255,0.08)':'transparent' }}
                onClick={()=>toggleSelect(item.name)}>
                <input type="checkbox" checked={selected.has(item.name)} onChange={()=>toggleSelect(item.name)}
                  onClick={e=>e.stopPropagation()}
                  style={{ accentColor:'var(--cryo-accent)', width:14, height:14 }} />
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.82)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  <span style={{ marginRight:6 }}>{item.name.includes('.')?'📄':'📁'}</span>{item.name}
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'JetBrains Mono,monospace' }}>{item.originalPath}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{item.deletionDate ? new Date(item.deletionDate).toLocaleDateString() : '—'}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontFamily:'JetBrains Mono,monospace' }}>{formatSize(item.size)}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer actions */}
      {items.length > 0 && (
        <div style={{ padding:'8px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:8 }}>
          <button onClick={()=>setSelected(new Set(items.map(i=>i.name)))}
            style={{ fontSize:11, padding:'4px 10px', background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>
            Select All
          </button>
          {selArr.length > 0 && (
            <button onClick={()=>setSelected(new Set())}
              style={{ fontSize:11, padding:'4px 10px', background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>
              Deselect All
            </button>
          )}
        </div>
      )}
    </div>
  )
}
