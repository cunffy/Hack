import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { text: 'Initializing secure kernel modules…',  ms: 0 },
  { text: 'Mounting encrypted workspace…',        ms: 320 },
  { text: 'Starting PTY subsystem…',             ms: 600 },
  { text: 'Loading breach intelligence engine…', ms: 860 },
  { text: 'Calibrating network interfaces…',     ms: 1100 },
  { text: 'All systems nominal — welcome back.', ms: 1320 },
]

interface Props { onDone: () => void }

export function BootSplash({ onDone }: Props) {
  const [phase, setPhase]          = useState<'scan' | 'logo' | 'boot' | 'exit'>('scan')
  const [visibleSteps, setVisible] = useState(0)
  const [progress, setProgress]    = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  // Subtle matrix rain
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const cols  = Math.floor(canvas.width / 22)
    const drops = Array(cols).fill(1).map(() => Math.random() * -canvas.height / 22)
    const chars = '01アイウエオカキクケコサシスセソ'

    const draw = () => {
      ctx.fillStyle = 'rgba(6,10,16,0.22)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '12px "JetBrains Mono", monospace'

      drops.forEach((y, i) => {
        const ch    = chars[Math.floor(Math.random() * chars.length)]
        const alpha = Math.random() > 0.93 ? 0.65 : 0.1
        ctx.fillStyle = `rgba(0,212,255,${alpha})`
        ctx.fillText(ch, i * 22, y * 22)
        if (y * 22 > canvas.height && Math.random() > 0.977) drops[i] = 0
        else drops[i] = y + 1
      })

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'), 500)
    const t2 = setTimeout(() => setPhase('boot'), 1100)

    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setVisible(i + 1)
        setProgress(Math.round(((i + 1) / STEPS.length) * 100))
      }, 1100 + step.ms)
    })

    const lastMs = STEPS[STEPS.length - 1].ms
    const t3 = setTimeout(() => setPhase('exit'), 1100 + lastMs + 500)
    const t4 = setTimeout(onDone, 1100 + lastMs + 1100)

    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#060a10' }}
      animate={phase === 'exit' ? { opacity: 0, scale: 1.03 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.38 }} />

      {/* Center radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 52%, rgba(0,212,255,0.055) 0%, transparent 70%)' }}
      />

      {/* Scan sweep */}
      <AnimatePresence>
        {phase === 'scan' && (
          <motion.div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              height: 1.5,
              background: 'linear-gradient(90deg, transparent 8%, rgba(0,212,255,0.9) 38%, rgba(0,255,136,1) 50%, rgba(0,212,255,0.9) 62%, transparent 92%)',
              boxShadow: '0 0 20px rgba(0,212,255,0.7)',
            }}
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.48, ease: 'linear' }}
          />
        )}
      </AnimatePresence>

      {/* Corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner, i) => (
        <motion.div
          key={corner}
          className="absolute w-8 h-8 pointer-events-none"
          style={{
            top:    corner.startsWith('t') ? 28 : undefined,
            bottom: corner.startsWith('b') ? 28 : undefined,
            left:   corner.endsWith('l')   ? 28 : undefined,
            right:  corner.endsWith('r')   ? 28 : undefined,
            borderTop:    corner.startsWith('t') ? '1px solid rgba(0,212,255,0.28)' : undefined,
            borderBottom: corner.startsWith('b') ? '1px solid rgba(0,212,255,0.28)' : undefined,
            borderLeft:   corner.endsWith('l')   ? '1px solid rgba(0,212,255,0.28)' : undefined,
            borderRight:  corner.endsWith('r')   ? '1px solid rgba(0,212,255,0.28)' : undefined,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 + i * 0.05, duration: 0.3, ease: [0.34, 1.4, 0.64, 1] }}
        />
      ))}

      {/* Logo + wordmark */}
      <AnimatePresence>
        {(phase === 'logo' || phase === 'boot' || phase === 'exit') && (
          <motion.div
            className="flex flex-col items-center mb-10"
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.3, 0.64, 1] }}
          >
            {/* Shield icon */}
            <div className="relative mb-6">
              <motion.div
                className="w-[88px] h-[88px] flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at 38% 32%, rgba(0,212,255,0.12) 0%, rgba(0,212,255,0.03) 60%, transparent 100%)',
                  border: '1px solid rgba(0,212,255,0.28)',
                  borderRadius: 24,
                  boxShadow: '0 0 48px rgba(0,212,255,0.08), inset 0 1px 0 rgba(0,212,255,0.15)',
                }}
                animate={{ boxShadow: ['0 0 30px rgba(0,212,255,0.08)', '0 0 55px rgba(0,212,255,0.16)', '0 0 30px rgba(0,212,255,0.08)'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div
                  className="absolute inset-0 rounded-[23px] pointer-events-none"
                  style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 60%)' }}
                />
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </motion.div>

              {[1, 1.35].map((scale, ri) => (
                <motion.div
                  key={ri}
                  className="absolute inset-0 rounded-[24px] pointer-events-none"
                  style={{ border: '1px solid rgba(0,212,255,0.35)' }}
                  animate={{ scale: [1, scale], opacity: [0.4, 0] }}
                  transition={{ duration: 2.2, delay: ri * 0.7, repeat: Infinity, ease: 'easeOut' }}
                />
              ))}
            </div>

            {/* Staggered letters */}
            <div className="flex mb-2" style={{ gap: 2 }}>
              {'CRYOGRAM'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.048, duration: 0.32, ease: [0.2, 0, 0, 1] }}
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 44,
                    fontWeight: 900,
                    color: 'var(--cryo-accent, #00d4ff)',
                    textShadow: '0 0 22px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.14)',
                    letterSpacing: '0.18em',
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
              transition={{ delay: 0.55, duration: 0.5 }}
              style={{
                fontSize: 11,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: 'rgba(0,212,255,0.36)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              Security Operations Platform
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boot log + progress */}
      <AnimatePresence>
        {(phase === 'boot' || phase === 'exit') && (
          <motion.div
            className="flex flex-col items-center gap-4 w-72"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="w-full">
              <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(0,212,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full relative"
                  style={{ background: 'linear-gradient(90deg, #00d4ff 0%, #00ff88 100%)', boxShadow: '0 0 10px rgba(0,212,255,0.9)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.28 }}
                >
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
                    style={{ width: 6, height: 6, background: '#00d4ff', boxShadow: '0 0 10px 4px rgba(0,212,255,0.8)' }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between mt-1.5">
                <span style={{ fontSize: 9, fontFamily: '"JetBrains Mono", monospace', color: 'rgba(0,212,255,0.3)', letterSpacing: '0.1em' }}>BOOT</span>
                <span style={{ fontSize: 9, fontFamily: '"JetBrains Mono", monospace', color: progress === 100 ? '#00ff88' : 'rgba(0,212,255,0.38)' }}>{progress}%</span>
              </div>
            </div>

            <div className="w-full space-y-1.5">
              {STEPS.slice(0, visibleSteps).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2.5"
                  style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10 }}
                >
                  <span style={{ color: i === visibleSteps - 1 ? '#00ff88' : '#00ff8855' }}>✓</span>
                  <span style={{ color: i === visibleSteps - 1 ? 'rgba(200,210,220,0.8)' : 'rgba(80,95,115,0.5)' }}>
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
