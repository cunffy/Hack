import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SystemTray from './SystemTray'
import { useWindowStore } from '../store/windowStore'

export function TitleBar() {
  const isMock = !window.cryogram?.window?.close
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const focusedWindow = useWindowStore(s => s.windows.find(w => w.focused && !w.minimized))

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="flex items-center h-7 px-3 shrink-0 select-none relative"
      style={{
        background: 'rgba(6,9,15,0.88)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
        WebkitAppRegion: 'drag',
      } as React.CSSProperties}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.5) 30%, rgba(187,136,255,0.3) 70%, transparent 100%)',
        }}
      />

      {/* Left: traffic lights + brand */}
      <div
        className="flex items-center gap-3 flex-1 min-w-0"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* macOS-style traffic lights */}
        <div className="flex items-center gap-1.5">
          <TrafficLight color="#ff5f57" title="Close"    onClick={() => !isMock && window.cryogram.window.close()} />
          <TrafficLight color="#ffbd2e" title="Minimize" onClick={() => !isMock && window.cryogram.window.minimize()} />
          <TrafficLight color="#28c840" title="Maximize" onClick={() => !isMock && window.cryogram.window.maximize()} />
        </div>

        {/* Divider */}
        <div className="w-px h-3.5 shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <motion.div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: '#00d4ff', boxShadow: '0 0 6px rgba(0,212,255,0.9)' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="text-xs font-bold shrink-0"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: '#00d4ff',
              letterSpacing: '0.2em',
              textShadow: '0 0 10px rgba(0,212,255,0.35)',
            }}
          >
            CRYOGRAM
          </span>
          {focusedWindow && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>›</span>
              <span
                className="text-xs truncate"
                style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em' }}
              >
                {focusedWindow.title}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Centre: system tray */}
      <div
        className="flex items-center shrink-0"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <SystemTray />
      </div>

      {/* Right: date + time */}
      <div
        className="flex items-center gap-2 flex-1 justify-end text-xs"
        style={{ color: 'rgba(255,255,255,0.45)', WebkitAppRegion: 'no-drag', letterSpacing: '0.02em' } as React.CSSProperties}
      >
        <span>{date}</span>
        <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{time}</span>
      </div>
    </div>
  )
}

function TrafficLight({ color, title, onClick }: { color: string; title: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.button
      onClick={onClick}
      title={title}
      className="w-3 h-3 rounded-full flex items-center justify-center relative"
      style={{ background: color, opacity: hov ? 1 : 0.82 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.82 }}
    >
      {hov && (
        <svg
          width="6" height="6" viewBox="0 0 6 6"
          fill="rgba(0,0,0,0.6)"
          style={{ position: 'absolute' }}
        >
          {title === 'Close' && (
            <><line x1="1" y1="1" x2="5" y2="5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="5" y1="1" x2="1" y2="5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round" /></>
          )}
          {title === 'Minimize' && (
            <line x1="1" y1="3" x2="5" y2="3" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round" />
          )}
          {title === 'Maximize' && (
            <><line x1="3" y1="1" x2="3" y2="5" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1" y1="3" x2="5" y2="3" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" strokeLinecap="round" /></>
          )}
        </svg>
      )}
    </motion.button>
  )
}
