import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'starting' | 'updating' | 'countdown' | 'rebooting'

interface Props {
  onCancel?: () => void
}

// Animated hexagon grid background
function HexGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const SIZE = 32
    const W = SIZE * 2
    const H = Math.sqrt(3) * SIZE
    let frame = 0

    const hexPath = (cx: number, cy: number, r: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++
      const cols = Math.ceil(canvas.width / W) + 2
      const rows = Math.ceil(canvas.height / H) + 2

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * W + (row % 2 === 0 ? 0 : W / 2)
          const cy = row * H
          const pulse = Math.sin(frame * 0.018 + col * 0.4 + row * 0.3) * 0.5 + 0.5
          const alpha = pulse * 0.12 + 0.02
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
          ctx.lineWidth = 0.8
          hexPath(cx, cy, SIZE - 2)
          ctx.stroke()
        }
      }
      requestAnimationFrame(animate)
    }
    const animId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
}

// Circular spinning ring
function SpinRing({ size, color, speed = 2, gap = 0.25 }: { size: number; color: string; speed?: number; gap?: number }) {
  return (
    <motion.div
      style={{ width: size, height: size, borderRadius: '50%', position: 'absolute' }}
      animate={{ rotate: 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
    >
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        border: `2px solid transparent`,
        borderTopColor: color,
        borderRightColor: gap < 0.5 ? color : 'transparent',
        boxShadow: `0 0 12px ${color}60`,
      }} />
    </motion.div>
  )
}

// Clean log line - strips ANSI escape codes
function stripAnsi(s: string) {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1B\[[0-9;]*[mGKH]/g, '').replace(/\r/g, '')
}

export function UpdateScreen({ onCancel }: Props) {
  const [phase, setPhase]     = useState<Phase>('starting')
  const [log, setLog]         = useState<string[]>([])
  const [countdown, setCount] = useState(10)
  const [error, setError]     = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const appendLog = useCallback((raw: string) => {
    const lines = stripAnsi(raw).split('\n').filter(l => l.trim())
    setLog(prev => [...prev, ...lines].slice(-120))

    // Detect script entering reboot countdown
    if (raw.includes('Rebooting in') || raw.includes('Rebooting')) {
      setPhase('countdown')
    }
  }, [])

  // Auto-scroll log
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log])

  // Countdown timer - starts when phase = 'countdown'
  useEffect(() => {
    if (phase !== 'countdown') return
    setCount(10)
    countdownRef.current = setInterval(() => {
      setCount(n => {
        if (n <= 1) {
          clearInterval(countdownRef.current!)
          setPhase('rebooting')
          return 0
        }
        return n - 1
      })
    }, 1000)
    return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
  }, [phase])

  // Run the update
  useEffect(() => {
    setPhase('starting')
    setTimeout(() => {
      setPhase('updating')
      ;(async () => {
        try {
          const api = (window as any).cryogram?.updater
          if (!api) {
            setError('Updater API not available — run from the live OS.')
            return
          }

          // Subscribe to progress
          const unsub = api.onProgress((line: string) => appendLog(line))
          try {
            await api.run()
            // If we get here (script didn't reboot yet), move to countdown
            if (phase !== 'countdown' && phase !== 'rebooting') {
              setPhase('countdown')
            }
          } finally {
            unsub()
          }
        } catch (err: any) {
          const msg = String(err?.message ?? err)
          if (msg.includes('code null') || msg.includes('killed')) {
            // Killed by OS reboot — that's expected
            setPhase('rebooting')
          } else {
            setError(msg)
          }
        }
      })()
    }, 1200)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const phaseLabel: Record<Phase, string> = {
    starting:  'Preparing update…',
    updating:  'Installing update…',
    countdown: 'Update complete',
    rebooting: 'Rebooting…',
  }

  const phaseColor: Record<Phase, string> = {
    starting:  'var(--cryo-accent)',
    updating:  'var(--cryo-accent)',
    countdown: '#00ff88',
    rebooting: '#a855f7',
  }

  const color = error ? '#ef4444' : phaseColor[phase]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200000,
        background: 'rgba(4,7,14,0.98)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        overflow: 'hidden',
      }}
    >
      <HexGrid />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${color}08, transparent 70%)`,
        transition: 'background 1s',
      }} />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, width: '100%', maxWidth: 680, padding: '0 24px' }}>

        {/* Logo + spinner cluster */}
        <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SpinRing size={120} color={color} speed={3} gap={0.3} />
          <SpinRing size={96}  color={`${color}80`} speed={2.1} gap={0.5} />
          <SpinRing size={74}  color={`${color}40`} speed={1.5} gap={0.7} />

          {/* Center icon */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', width: 50, height: 50, borderRadius: 16,
              background: `${color}15`,
              border: `1.5px solid ${color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 24px ${color}40`,
            }}
          >
            <AnimatePresence mode="wait">
              {phase === 'countdown' || phase === 'rebooting' ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 24 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </motion.div>
              ) : (
                <motion.div key="arrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Phase label */}
        <div style={{ textAlign: 'center' }}>
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em' }}
          >
            {error ? 'Update Failed' : phaseLabel[phase]}
          </motion.div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginTop: 5 }}>
            {error
              ? 'Check log below for details'
              : phase === 'countdown' || phase === 'rebooting'
              ? 'Your laptop will fully restart'
              : 'Downloading code changes only — not a new OS'}
          </div>
        </div>

        {/* Countdown */}
        <AnimatePresence>
          {(phase === 'countdown' || phase === 'rebooting') && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                key={countdown}
                initial={{ opacity: 0, scale: 0.4, y: -12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.2, y: 8 }}
                transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                style={{
                  fontSize: 80, fontWeight: 900, lineHeight: 1,
                  color: color,
                  textShadow: `0 0 40px ${color}80, 0 0 80px ${color}40`,
                  letterSpacing: '-0.05em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {phase === 'rebooting' ? '↺' : countdown}
              </motion.div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                {phase === 'rebooting' ? 'Restarting system…' : `Rebooting in ${countdown} second${countdown !== 1 ? 's' : ''}…`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Log output */}
        {(phase === 'updating' || error) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%' }}
          >
            <div
              ref={logRef}
              style={{
                height: 200,
                overflowY: 'auto',
                background: 'rgba(0,0,0,0.55)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.25)' : 'rgba(0,212,255,0.12)'}`,
                borderRadius: 12,
                padding: '10px 14px',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 11,
                lineHeight: 1.65,
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.12) transparent',
              }}
            >
              {log.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.25)' }}>Starting update process…</div>
              ) : (
                log.map((line, i) => (
                  <div key={i} style={{
                    color: line.includes('FAIL') || line.includes('error') || line.includes('Error')
                      ? '#f87171'
                      : line.includes('OK') || line.includes('ok') || line.includes('✓')
                      ? '#4ade80'
                      : line.includes('──') || line.includes('WARN')
                      ? '#fbbf24'
                      : 'rgba(255,255,255,0.62)',
                  }}>
                    {line}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Error cancel */}
        {error && onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '8px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
              color: '#f87171', cursor: 'pointer',
            }}
          >
            Close
          </button>
        )}
      </div>

      {/* CRYOGRAM OS watermark */}
      <div style={{
        position: 'absolute', bottom: 28,
        fontSize: 10, letterSpacing: '0.3em', fontWeight: 700,
        color: 'rgba(255,255,255,0.12)',
        fontFamily: '"JetBrains Mono", monospace',
        textTransform: 'uppercase',
      }}>
        CRYOGRAM OS
      </div>
    </motion.div>
  )
}
