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

// Gradient wallpapers are stored as their full CSS `background` value, so the
// desktop can render them directly (crisp vector gradients — never grainy) and
// the same string round-trips through settings persistence.
interface Gradient { id:string; name:string; css:string }

const GRADIENT_WALLPAPERS: Gradient[] = [
  { id:'grad-cyber-dusk', name:'Cyber Dusk',  css:'radial-gradient(circle at 18% 22%, rgba(0,212,255,0.16), transparent 45%), radial-gradient(circle at 82% 78%, rgba(187,136,255,0.13), transparent 50%), linear-gradient(135deg, #070b14 0%, #0d1e33 100%)' },
  { id:'grad-neon-night', name:'Neon Night',  css:'radial-gradient(circle at 75% 25%, rgba(187,136,255,0.20), transparent 50%), radial-gradient(circle at 20% 80%, rgba(99,102,241,0.12), transparent 50%), linear-gradient(160deg, #0a0612 0%, #1a0a2e 75%)' },
  { id:'grad-arctic',     name:'Arctic Blue', css:'radial-gradient(circle at 30% 68%, rgba(0,180,255,0.18), transparent 50%), linear-gradient(135deg, #03101c 0%, #0a2a3d 100%)' },
  { id:'grad-crimson',    name:'Crimson Dark',css:'radial-gradient(circle at 72% 30%, rgba(255,70,90,0.15), transparent 50%), linear-gradient(140deg, #0c0708 0%, #2a0810 100%)' },
  { id:'grad-forest',     name:'Forest Dark', css:'radial-gradient(circle at 25% 28%, rgba(52,211,153,0.15), transparent 50%), linear-gradient(135deg, #040a06 0%, #0a2015 100%)' },
  { id:'grad-space',      name:'Deep Space',  css:'radial-gradient(ellipse at 50% -10%, rgba(80,120,255,0.14), transparent 55%), radial-gradient(circle at 85% 75%, rgba(187,136,255,0.11), transparent 45%), linear-gradient(180deg, #05070f 0%, #0a0a1a 100%)' },
  { id:'grad-ember',      name:'Ember',       css:'radial-gradient(circle at 70% 80%, rgba(251,146,60,0.16), transparent 50%), linear-gradient(140deg, #0a0806 0%, #2a160a 100%)' },
  { id:'grad-slate',      name:'Mono Slate',  css:'radial-gradient(circle at 50% 20%, rgba(148,163,184,0.10), transparent 55%), linear-gradient(135deg, #0a0d12 0%, #1a2130 100%)' },
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
                  <div key={g.id} style={s.thumb(wallpaper===g.css)} onClick={() => applyWallpaper(g.css)}>
                    <div style={{ width:'100%', height:'100%', background:g.css }} />
                    <div style={s.label}>{g.name}</div>
                    {wallpaper===g.css && <div style={{ position:'absolute', top:6, right:6, background:'var(--cryo-accent,#00d4ff)', borderRadius:'50%', width:16, height:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#000', fontWeight:700 }}>✓</div>}
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
