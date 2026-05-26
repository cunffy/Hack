import { useState, useEffect } from 'react'
import { useDesktopStore } from '../../store/desktopStore'

const s = {
  root: { display:'flex', flexDirection:'column' as const, height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14 },
  topBar: { padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:8, alignItems:'center' },
  btn: (c:string,t:string='#000') => ({ padding:'6px 14px', borderRadius:6, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, background:c, color:t }),
  body: { flex:1, overflow:'auto', padding:16 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 },
  thumb: (sel:boolean) => ({ borderRadius:8, overflow:'hidden', cursor:'pointer', border:`2px solid ${sel?'var(--cryo-accent,#00d4ff)':'transparent'}`, position:'relative' as const, aspectRatio:'16/9' }),
  label: { position:'absolute' as const, bottom:0, left:0, right:0, padding:'6px 8px', background:'linear-gradient(transparent,rgba(0,0,0,0.7))', fontSize:11, color:'#fff' },
}

interface WP { id:string; name:string; path:string; type:'builtin'|'custom'; thumb?:string }

const BUILTIN_WALLPAPERS: WP[] = [
  { id:'none', name:'Animated Background', path:'', type:'builtin' },
  { id:'dark-city', name:'Dark City', path:'/wallpapers/dark-city.jpg', type:'builtin' },
  { id:'cyber-grid', name:'Cyber Grid', path:'/wallpapers/cyber-grid.jpg', type:'builtin' },
  { id:'terminal-green', name:'Terminal Green', path:'/wallpapers/terminal-green.jpg', type:'builtin' },
  { id:'space', name:'Deep Space', path:'/wallpapers/space.jpg', type:'builtin' },
  { id:'abstract-dark', name:'Abstract Dark', path:'/wallpapers/abstract-dark.jpg', type:'builtin' },
  { id:'matrix', name:'Matrix Rain', path:'/wallpapers/matrix.jpg', type:'builtin' },
]

const GRADIENT_WALLPAPERS = [
  { id:'grad-1', name:'Cyber Dusk', colors:['#0a0e1a','#0d2640'], type:'gradient' },
  { id:'grad-2', name:'Neon Night', colors:['#050a0f','#1a0a2e'], type:'gradient' },
  { id:'grad-3', name:'Arctic Blue', colors:['#030d1a','#0a2a3d'], type:'gradient' },
  { id:'grad-4', name:'Crimson Dark', colors:['#0a0808','#2a0808'], type:'gradient' },
  { id:'grad-5', name:'Forest Dark', colors:['#040a06','#0a1e0c'], type:'gradient' },
]

export default function WallpaperApp() {
  const { wallpaper, setWallpaper } = useDesktopStore()
  const [custom, setCustom] = useState<WP[]>([])
  const [tab, setTab] = useState<'builtin'|'custom'>('builtin')

  useEffect(() => { loadCustom() }, [])

  async function loadCustom() {
    try {
      const data = await (window as any).cryogram?.wallpaper?.listCustom()
      if (data) setCustom(data)
    } catch {}
  }

  async function importWallpaper() {
    try {
      const path = await (window as any).cryogram?.wallpaper?.browse()
      if (path) {
        setWallpaper(path)
        loadCustom()
      }
    } catch {}
  }

  function applyWallpaper(path: string) {
    setWallpaper(path || '')
    try { (window as any).cryogram?.settings?.set('wallpaper', path || '') } catch {}
  }

  return (
    <div style={s.root}>
      <div style={s.topBar}>
        <span style={{ fontWeight:700, fontSize:14 }}>Wallpaper</span>
        <div style={{ display:'flex', gap:4, marginLeft:8 }}>
          {(['builtin','custom'] as const).map(t => (
            <button key={t} style={s.btn(tab===t?'var(--cryo-accent,#00d4ff)':'rgba(255,255,255,0.07)', tab===t?'#000':'rgba(255,255,255,0.6)')} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
        <button style={{ ...s.btn('rgba(255,255,255,0.08)','rgba(255,255,255,0.7)'), marginLeft:'auto' }} onClick={importWallpaper}>+ Import Image</button>
      </div>
      <div style={s.body}>
        {tab==='builtin' && (
          <>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:10 }}>GRADIENT THEMES</div>
              <div style={s.grid}>
                <div style={s.thumb(!wallpaper)} onClick={() => applyWallpaper('')}>
                  <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#070b11,#0d1829)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:24 }}>✨</span>
                  </div>
                  <div style={s.label}>Animated (Default)</div>
                  {!wallpaper && <div style={{ position:'absolute', top:6, right:6, background:'var(--cryo-accent,#00d4ff)', borderRadius:'50%', width:16, height:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#000', fontWeight:700 }}>✓</div>}
                </div>
                {GRADIENT_WALLPAPERS.map(g => (
                  <div key={g.id} style={s.thumb(wallpaper===g.id)} onClick={() => applyWallpaper(g.id)}>
                    <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${g.colors[0]},${g.colors[1]})` }} />
                    <div style={s.label}>{g.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {tab==='custom' && (
          <div>
            {custom.length === 0 && (
              <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', marginTop:60 }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🖼</div>
                <div>No custom wallpapers imported</div>
                <button style={{ ...s.btn('var(--cryo-accent,#00d4ff)'), marginTop:16 }} onClick={importWallpaper}>Import Image</button>
              </div>
            )}
            <div style={s.grid}>
              {custom.map(w => (
                <div key={w.id} style={s.thumb(wallpaper===w.path)} onClick={() => applyWallpaper(w.path)}>
                  <img src={w.thumb||w.path} alt={w.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <div style={s.label}>{w.name}</div>
                  {wallpaper===w.path && <div style={{ position:'absolute', top:6, right:6, background:'var(--cryo-accent,#00d4ff)', borderRadius:'50%', width:16, height:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#000', fontWeight:700 }}>✓</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
