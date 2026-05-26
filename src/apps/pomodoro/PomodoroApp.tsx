import { useState, useEffect, useRef, useCallback } from 'react'

const s = {
  root: { display:'flex', flexDirection:'column' as const, height:'100%', background:'rgba(8,12,20,0.8)', color:'rgba(255,255,255,0.85)', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize:14, alignItems:'center', justifyContent:'center' },
  btn: (c:string,t:string='#000',disabled=false) => ({ padding:'8px 24px', borderRadius:8, border:'none', cursor:disabled?'not-allowed':'pointer', fontSize:13, fontWeight:700, background:disabled?'rgba(255,255,255,0.05)':c, color:disabled?'rgba(255,255,255,0.3)':t, opacity:disabled?0.5:1 }),
  small: (c:string,t:string='rgba(255,255,255,0.7)') => ({ padding:'5px 14px', borderRadius:6, border:'none', cursor:'pointer', fontSize:11, fontWeight:600, background:c, color:t }),
}

const MODES = [
  { key:'focus', label:'Focus', mins:25, color:'#ef4444' },
  { key:'short', label:'Short Break', mins:5, color:'#22c55e' },
  { key:'long', label:'Long Break', mins:15, color:'#00d4ff' },
]

interface Task { id:string; text:string; done:boolean; pomodoros:number }

export default function PomodoroApp() {
  const [modeKey, setModeKey] = useState('focus')
  const [secsLeft, setSecsLeft] = useState(25*60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [activeTask, setActiveTask] = useState<string|null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const mode = MODES.find(m => m.key === modeKey)!

  useEffect(() => {
    setSecsLeft(mode.mins * 60)
    setRunning(false)
    clearInterval(intervalRef.current)
  }, [modeKey])

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setSecsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          if (modeKey === 'focus') {
            setSessions(n => n + 1)
            if (activeTask) setTasks(t => t.map(t => t.id===activeTask ? {...t, pomodoros:t.pomodoros+1} : t))
            try { new Notification('Focus session complete! Take a break.') } catch {}
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, modeKey, activeTask])

  const mins = Math.floor(secsLeft / 60)
  const secs = secsLeft % 60
  const total = mode.mins * 60
  const progress = ((total - secsLeft) / total) * 100
  const circumference = 2 * Math.PI * 90
  const dash = circumference - (progress / 100) * circumference

  function addTask() {
    if (!newTask.trim()) return
    setTasks(t => [...t, { id:Date.now().toString(), text:newTask.trim(), done:false, pomodoros:0 }])
    setNewTask('')
  }

  return (
    <div style={s.root}>
      <div style={{ display:'flex', gap:8, marginBottom:32 }}>
        {MODES.map(m => (
          <button key={m.key} style={s.small(modeKey===m.key?m.color:'rgba(255,255,255,0.07)', modeKey===m.key?'#000':'rgba(255,255,255,0.7)')} onClick={() => setModeKey(m.key)}>{m.label}</button>
        ))}
      </div>
      <div style={{ position:'relative', width:200, height:200, marginBottom:32 }}>
        <svg width={200} height={200} style={{ position:'absolute', top:0, left:0, transform:'rotate(-90deg)' }}>
          <circle cx={100} cy={100} r={90} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
          <circle cx={100} cy={100} r={90} fill="none" stroke={mode.color} strokeWidth={8} strokeDasharray={circumference} strokeDashoffset={dash} strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.5s' }} />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:44, fontWeight:800, color:mode.color, lineHeight:1 }}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6 }}>{mode.label}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:32 }}>
        <button style={s.btn(running?'rgba(255,255,255,0.08)':'#ef4444', running?'rgba(255,255,255,0.7)':'#fff')} onClick={() => setRunning(r => !r)}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button style={s.btn('rgba(255,255,255,0.06)','rgba(255,255,255,0.6)')} onClick={() => { setSecsLeft(mode.mins*60); setRunning(false) }}>↺ Reset</button>
      </div>
      <div style={{ display:'flex', gap:20, marginBottom:32, fontSize:12, color:'rgba(255,255,255,0.4)' }}>
        <span>🍅 Sessions today: <strong style={{ color:'rgba(255,255,255,0.8)' }}>{sessions}</strong></span>
      </div>
      <div style={{ width:340 }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>TASKS</div>
        <div style={{ display:'flex', gap:6, marginBottom:10 }}>
          <input style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'5px 10px', color:'rgba(255,255,255,0.85)', fontSize:12, outline:'none' }} placeholder="Add a task…" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key==='Enter' && addTask()} />
          <button style={s.btn('var(--cryo-accent,#00d4ff)')} onClick={addTask}>+</button>
        </div>
        {tasks.map(t => (
          <div key={t.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
            <input type="checkbox" checked={t.done} onChange={() => setTasks(ts => ts.map(x => x.id===t.id ? {...x, done:!x.done} : x))} />
            <span style={{ flex:1, fontSize:12, textDecoration:t.done?'line-through':'none', color:t.done?'rgba(255,255,255,0.3)':'rgba(255,255,255,0.8)', cursor:'pointer' }} onClick={() => setActiveTask(activeTask===t.id?null:t.id)}>
              {activeTask===t.id && '▶ '}{t.text}
            </span>
            <span style={{ fontSize:10, color:'#ef4444' }}>{'🍅'.repeat(Math.min(t.pomodoros,5))}</span>
            <button style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', fontSize:12 }} onClick={() => setTasks(ts => ts.filter(x => x.id!==t.id))}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
