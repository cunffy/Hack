import { useState, useCallback } from 'react'

interface GitStatus {
  branch: string
  files: { status: string; path: string; staged: boolean }[]
  ahead: number
  behind: number
}

interface GitCommit {
  hash: string; shortHash: string; subject: string; author: string; relDate: string
}

interface Branch { name: string; isCurrent: boolean }

const ipc = (window as any).cryogram?.git

export default function GitApp() {
  const [repoPath, setRepoPath] = useState('')
  const [pathInput, setPathInput] = useState('')
  const [isRepo, setIsRepo] = useState<boolean | null>(null)
  const [tab, setTab] = useState<'changes'|'log'|'branches'>('changes')
  const [status, setStatus] = useState<GitStatus | null>(null)
  const [commits, setCommits] = useState<GitCommit[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [diffText, setDiffText] = useState('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [commitMsg, setCommitMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const load = useCallback(async (path: string) => {
    if (!ipc) return
    setLoading(true)
    try {
      const ok = await ipc.isRepo(path)
      setIsRepo(ok)
      if (ok) {
        const [s, c, b] = await Promise.all([ipc.status(path), ipc.log(path, 40), ipc.getBranches(path)])
        setStatus(s); setCommits(c); setBranches(b)
      }
    } finally { setLoading(false) }
  }, [])

  const open = async () => { const p = pathInput.trim(); if (!p) return; setRepoPath(p); await load(p) }
  const refresh = () => { if (repoPath) load(repoPath) }

  const viewDiff = async (filePath?: string, staged = false) => {
    if (!ipc || !repoPath) return
    const diff = await ipc.diff(repoPath, filePath, staged)
    setDiffText(diff); setSelectedFile(filePath ?? null)
  }

  const stage = async (files: string[]) => { if (!ipc) return; await ipc.stage(repoPath, files); refresh(); flash('Staged') }
  const unstage = async (files: string[]) => { if (!ipc) return; await ipc.unstage(repoPath, files); refresh(); flash('Unstaged') }

  const commit = async () => {
    if (!ipc || !commitMsg.trim()) return
    try { await ipc.commit(repoPath, commitMsg.trim()); setCommitMsg(''); refresh(); flash('Committed!') }
    catch (e: any) { flash('Error: ' + e.message) }
  }

  const push = async () => {
    if (!ipc) return; setLoading(true)
    try { await ipc.push(repoPath); refresh(); flash('Pushed!') }
    catch (e: any) { flash('Push error: ' + e.message) }
    finally { setLoading(false) }
  }

  const pull = async () => {
    if (!ipc) return; setLoading(true)
    try { await ipc.pull(repoPath); refresh(); flash('Pulled!') }
    catch (e: any) { flash('Pull error: ' + e.message) }
    finally { setLoading(false) }
  }

  const checkout = async (branch: string) => { if (!ipc) return; await ipc.checkout(repoPath, branch); refresh(); flash(`Switched to ${branch}`) }

  const staged   = status?.files.filter(f => f.staged) ?? []
  const unstaged = status?.files.filter(f => !f.staged) ?? []
  const statusColor = (s: string) => s === 'M' ? '#facc15' : s === 'A' ? '#4ade80' : s === 'D' ? '#f87171' : '#94a3b8'

  if (!repoPath || isRepo === false) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:16, background:'rgba(8,12,20,0.8)' }}>
        <div style={{ fontSize:36 }}>🌿</div>
        <div style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.85)' }}>Git Repository</div>
        <div style={{ display:'flex', gap:8, width:400 }}>
          <input value={pathInput} onChange={e=>setPathInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&open()} placeholder="/path/to/repo"
            style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, padding:'8px 12px', color:'#fff', fontFamily:'monospace', fontSize:13 }} />
          <button onClick={open} style={{ padding:'8px 18px', background:'var(--cryo-accent)', color:'#000', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer' }}>Open</button>
        </div>
        {isRepo===false && <div style={{ color:'#f87171', fontSize:12 }}>Not a git repository</div>}
      </div>
    )
  }

  return (
    <div style={{ display:'flex', height:'100%', background:'rgba(8,12,20,0.8)', fontFamily:'-apple-system,sans-serif' }}>
      <div style={{ width:280, borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span style={{ color:'#4ade80', fontSize:13, fontWeight:700, fontFamily:'monospace' }}>⎇ {status?.branch}</span>
            {(status?.ahead??0)>0 && <span style={{ fontSize:10, color:'var(--cryo-accent)', background:'rgba(0,212,255,0.12)', padding:'1px 6px', borderRadius:10 }}>↑{status!.ahead}</span>}
            {(status?.behind??0)>0 && <span style={{ fontSize:10, color:'#facc15', background:'rgba(250,204,21,0.12)', padding:'1px 6px', borderRadius:10 }}>↓{status!.behind}</span>}
          </div>
          <div style={{ display:'flex', gap:4, marginTop:8 }}>
            {(['changes','log','branches'] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{ flex:1, fontSize:10, padding:'4px 0', borderRadius:6, border:'none', cursor:'pointer', fontWeight:600, textTransform:'capitalize',
                  background:tab===t?'var(--cryo-accent)':'rgba(255,255,255,0.06)', color:tab===t?'#000':'rgba(255,255,255,0.5)' }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'8px 10px' }}>
          {tab==='changes' && <>
            {staged.length>0 && <>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Staged ({staged.length})</div>
              {staged.map(f=>(
                <div key={f.path} onClick={()=>viewDiff(f.path,true)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 6px', borderRadius:6, cursor:'pointer', marginBottom:2, background:selectedFile===f.path?'rgba(255,255,255,0.06)':'transparent' }}>
                  <span style={{ color:statusColor(f.status), fontFamily:'monospace', fontSize:11, fontWeight:700, width:12 }}>{f.status}</span>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{f.path}</span>
                  <button onClick={e=>{e.stopPropagation();unstage([f.path])}}
                    style={{ fontSize:9, padding:'1px 5px', background:'rgba(255,255,255,0.08)', border:'none', borderRadius:4, color:'rgba(255,255,255,0.4)', cursor:'pointer' }}>−</button>
                </div>
              ))}
            </>}
            {unstaged.length>0 && <>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em', marginTop:10, marginBottom:4 }}>Changes ({unstaged.length})</div>
              {unstaged.map(f=>(
                <div key={f.path} onClick={()=>viewDiff(f.path)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 6px', borderRadius:6, cursor:'pointer', marginBottom:2, background:selectedFile===f.path?'rgba(255,255,255,0.06)':'transparent' }}>
                  <span style={{ color:statusColor(f.status), fontFamily:'monospace', fontSize:11, fontWeight:700, width:12 }}>{f.status}</span>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{f.path}</span>
                  <button onClick={e=>{e.stopPropagation();stage([f.path])}}
                    style={{ fontSize:9, padding:'1px 5px', background:'rgba(0,212,255,0.15)', border:'none', borderRadius:4, color:'var(--cryo-accent)', cursor:'pointer' }}>+</button>
                </div>
              ))}
            </>}
            {staged.length===0&&unstaged.length===0&&<div style={{ textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:12, marginTop:30 }}>Working tree clean</div>}
          </>}
          {tab==='log' && commits.map(c=>(
            <div key={c.hash} style={{ padding:'6px 4px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <code style={{ fontSize:10, color:'var(--cryo-accent)' }}>{c.shortHash}</code>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>{c.relDate}</span>
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.8)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.subject}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{c.author}</div>
            </div>
          ))}
          {tab==='branches' && branches.map(b=>(
            <div key={b.name} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 6px', borderRadius:6, marginBottom:2 }}>
              <span style={{ color:b.isCurrent?'#4ade80':'rgba(255,255,255,0.4)', fontSize:11 }}>{b.isCurrent?'●':'○'}</span>
              <span style={{ fontSize:11, color:b.isCurrent?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.6)', flex:1, overflow:'hidden', textOverflow:'ellipsis' }}>{b.name}</span>
              {!b.isCurrent && <button onClick={()=>checkout(b.name)} style={{ fontSize:9, padding:'2px 6px', background:'rgba(255,255,255,0.08)', border:'none', borderRadius:4, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Checkout</button>}
            </div>
          ))}
        </div>

        {tab==='changes' && (
          <div style={{ padding:10, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <textarea value={commitMsg} onChange={e=>setCommitMsg(e.target.value)} placeholder="Commit message…" rows={2}
              style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'6px 8px', color:'#fff', fontSize:11, resize:'none', fontFamily:'sans-serif', boxSizing:'border-box' }} />
            <div style={{ display:'flex', gap:6, marginTop:6 }}>
              <button onClick={()=>stage(unstaged.map(f=>f.path))} style={{ flex:1, fontSize:10, padding:'5px 0', background:'rgba(255,255,255,0.07)', border:'none', borderRadius:6, color:'rgba(255,255,255,0.6)', cursor:'pointer' }}>Stage All</button>
              <button onClick={commit} disabled={!commitMsg.trim()} style={{ flex:2, fontSize:11, padding:'5px 0', background:commitMsg.trim()?'var(--cryo-accent)':'rgba(255,255,255,0.05)', border:'none', borderRadius:6, color:commitMsg.trim()?'#000':'rgba(255,255,255,0.3)', fontWeight:700, cursor:'pointer' }}>Commit</button>
            </div>
            <div style={{ display:'flex', gap:6, marginTop:6 }}>
              <button onClick={pull} style={{ flex:1, fontSize:10, padding:'5px 0', background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>↓ Pull</button>
              <button onClick={push} style={{ flex:1, fontSize:10, padding:'5px 0', background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>↑ Push</button>
              <button onClick={refresh} style={{ flex:1, fontSize:10, padding:'5px 0', background:'rgba(255,255,255,0.06)', border:'none', borderRadius:6, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>⟳</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {msg && <div style={{ padding:'6px 14px', background:'rgba(0,212,255,0.12)', borderBottom:'1px solid rgba(0,212,255,0.2)', fontSize:12, color:'var(--cryo-accent)' }}>{msg}</div>}
        {diffText ? (
          <pre style={{ flex:1, overflowY:'auto', margin:0, padding:14, fontSize:11, fontFamily:'JetBrains Mono,monospace', lineHeight:1.6, whiteSpace:'pre-wrap', wordBreak:'break-all' }}>
            {diffText.split('\n').map((line,i)=>(
              <span key={i} style={{ display:'block', color:line.startsWith('+')?'#4ade80':line.startsWith('-')?'#f87171':line.startsWith('@@')?'#c084fc':'rgba(255,255,255,0.6)', background:line.startsWith('+')?'rgba(74,222,128,0.06)':line.startsWith('-')?'rgba(248,113,113,0.06)':'transparent' }}>{line}</span>
            ))}
          </pre>
        ) : (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.2)', fontSize:13 }}>
            {loading?'Loading…':'Select a file to view diff'}
          </div>
        )}
      </div>
    </div>
  )
}
