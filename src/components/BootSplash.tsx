import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { text: 'Initializing secure kernel modules…',   ms: 0 },
  { text: 'Mounting encrypted workspace…',         ms: 340 },
  { text: 'Starting PTY subsystem…',              ms: 640 },
  { text: 'Loading breach intelligence engine…',  ms: 920 },
  { text: 'Calibrating network interfaces…',      ms: 1180 },
  { text: 'All systems nominal — welcome back.',  ms: 1420 },
]

interface Props { onDone: () => void }

export function BootSplash({ onDone }: Props) {
  const [phase, setPhase] = useState<'scan' | 'logo' | 'boot' | 'exit'>('scan')
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  // Matrix rain canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cols = Math.floor(canvas.width / 18)
    const drops = Array(cols).fill(1).map(() => Math.random() * -canvas.height / 18)
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'

    let t = 0
    const draw = () => {
      t++
      ctx.fillStyle = 'rgba(7,11,17,0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '13px "JetBrains Mono", monospace'

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const alpha = Math.random() > 0.92 ? 0.9 : 0.18
        ctx.fillStyle = `rgba(0,212,255,${alpha})`
        ctx.fillText(char, i * 18, y * 18)
        if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0
        else drops[i] = y + 1
      })

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Sequencer
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'), 600)
    const t2 = setTimeout(() => setPhase('boot'), 1200)

    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setVisibleSteps(i + 1)
        setProgress(Math.round(((i + 1) / STEPS.length) * 100))
      }, 1200 + step.ms)
    })

    const lastMs = STEPS[STEPS.length - 1].ms
    const t3 = setTimeout(() => setPhase('exit'), 1200 + lastMs + 600)
    const t4 = setTimeout(onDone, 1200 + lastMs + 1200)

    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#070b11' }}
      animate={phase === 'exit' ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Matrix rain */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }} />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,212,255,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Scan line sweep */}
      <AnimatePresence>
        {phase === 'scan' && (
          <motion.div
            className="absolute left-0 right-0 pointer-events-none"
            style={{ height: 2, background: 'linear-gradient(90deg, transparent 5%, rgba(0,212,255,0.8) 40%, rgba(0,255,136,0.9) 50%, rgba(0,212,255,0.8) 60%, transparent 95%)' }}
            initial={{ top: 0, opacity: 0 }}
            animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.55, ease: 'linear' }}
          />
        )}
      </AnimatePresence>

      {/* Corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner, i) => (
        <motion.div
          key={corner}
          className="absolute w-10 h-10 pointer-events-none"
          style={{
            top: corner.startsWith('t') ? 24 : undefined,
            bottom: corner.startsWith('b') ? 24 : undefined,
            left: corner.endsWith('l') ? 24 : undefined,
            right: corner.endsWith('r') ? 24 : undefined,
            borderTop: corner.startsWith('t') ? '1.5px solid rgba(0,212,255,0.35)' : undefined,
            borderBottom: corner.startsWith('b') ? '1.5px solid rgba(0,212,255,0.35)' : undefined,
            borderLeft: corner.endsWith('l') ? '1.5px solid rgba(0,212,255,0.35)' : undefined,
            borderRight: corner.endsWith('r') ? '1.5px solid rgba(0,212,255,0.35)' : undefined,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.06, duration: 0.35 }}
        />
      ))}

      {/* Logo + wordmark */}
      <AnimatePresence>
        {(phase === 'logo' || phase === 'boot' || phase === 'exit') && (
          <motion.div
            className="flex flex-col items-center mb-10"
            initial={{ opacity: 0, y: 16, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.34, 1.4, 0.64, 1] }}
          >
            {/* Hex shield */}
            <div className="relative mb-5">
              <motion.div
                className="w-20 h-20 flex items-center justify-center"
                style={{
                  background: 'rgba(0,212,255,0.05)',
                  border: '1.5px solid rgba(0,212,255,0.3)',
                  borderRadius: 18,
                  boxShadow: '0 0 40px rgba(0,212,255,0.1), inset 0 0 20px rgba(0,212,255,0.04)',
                }}
              >
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </motion.div>
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-[18px]"
                style={{ border: '1px solid rgba(0,212,255,0.5)' }}
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* CRYOGRAM wordmark - letters stagger in */}
            <div className="flex overflow-hidden mb-1">
              {'CRYOGRAM'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.35, ease: [0.2, 0, 0, 1] }}
                  className="font-black"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 42,
                    color: '#00d4ff',
                    textShadow: '0 0 24px rgba(0,212,255,0.55), 0 0 60px rgba(0,212,255,0.18)',
                    letterSpacing: '0.22em',
                    lineHeight: 1,
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-xs tracking-[0.5em] uppercase"
              style={{ color: 'rgba(0,212,255,0.42)' }}
            >
              Security Operations Platform
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress + boot log */}
      <AnimatePresence>
        {(phase === 'boot' || phase === 'exit') && (
          <motion.div
            className="flex flex-col items-center gap-4 w-80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Progress bar */}
            <div className="w-full">
              <div
                className="h-0.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(26,40,64,0.7)' }}
              >
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: 'linear-gradient(90deg, #00d4ff, #bb88ff)',
                    boxShadow: '0 0 8px rgba(0,212,255,0.8)',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
                >
                  {/* Glowing tip */}
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{ background: '#00d4ff', boxShadow: '0 0 8px 3px rgba(0,212,255,0.7)' }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] font-mono" style={{ color: 'rgba(0,212,255,0.35)', letterSpacing: '0.1em' }}>BOOT</span>
                <span className="text-[10px] font-mono" style={{ color: 'rgba(0,212,255,0.35)' }}>{progress}%</span>
              </div>
            </div>

            {/* Log lines */}
            <div className="w-full space-y-1.5">
              {STEPS.slice(0, visibleSteps).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22 }}
                  className="flex items-center gap-2 font-mono text-[11px]"
                >
                  <span style={{ color: '#00ff88' }}>✓</span>
                  <span style={{ color: i === visibleSteps - 1 ? 'rgba(201,209,217,0.75)' : 'rgba(78,93,110,0.6)' }}>
                    {step.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
