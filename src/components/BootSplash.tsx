import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  { text: 'Initializing secure kernel modules', delay: 0 },
  { text: 'Mounting encrypted workspace', delay: 320 },
  { text: 'Starting PTY subsystem', delay: 600 },
  { text: 'Loading breach intelligence engine', delay: 880 },
  { text: 'Calibrating network interfaces', delay: 1120 },
  { text: 'All systems nominal — welcome back', delay: 1380 },
]

interface Props {
  onDone: () => void
}

export function BootSplash({ onDone }: Props) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines(i + 1)
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100))
      }, BOOT_LINES[i].delay))
    })

    const lastDelay = BOOT_LINES[BOOT_LINES.length - 1].delay
    timers.push(setTimeout(() => {
      setExiting(true)
      setTimeout(onDone, 700)
    }, lastDelay + 700))

    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#080c12' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Background grid glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,255,0.06) 0%, transparent 70%)',
            }}
          />
          {/* Corner accents */}
          {[
            'top-0 left-0 border-t border-l',
            'top-0 right-0 border-t border-r',
            'bottom-0 left-0 border-b border-l',
            'bottom-0 right-0 border-b border-r',
          ].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute w-8 h-8 ${pos}`}
              style={{ borderColor: 'rgba(0,212,255,0.3)' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            />
          ))}

          {/* Shield / logo mark */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-6 relative"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl relative"
              style={{
                background: 'rgba(0,212,255,0.07)',
                border: '1px solid rgba(0,212,255,0.25)',
                boxShadow: '0 0 40px rgba(0,212,255,0.12), inset 0 0 20px rgba(0,212,255,0.04)',
              }}
            >
              🛡
              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: '1px solid rgba(0,212,255,0.4)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-center mb-8"
          >
            <div
              className="text-5xl font-black tracking-[0.3em] mb-2"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                color: '#00d4ff',
                textShadow: '0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)',
                letterSpacing: '0.3em',
              }}
            >
              CRYOGRAM
            </div>
            <motion.div
              className="text-xs tracking-[0.45em] uppercase"
              style={{ color: 'rgba(0,212,255,0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Security Operations Platform
            </motion.div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="w-80 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="h-px rounded-full overflow-hidden"
              style={{ background: 'rgba(26,40,64,0.8)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #00d4ff, #bb88ff, #00d4ff)', backgroundSize: '200%' }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.25 }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.4)' }}>
                BOOT
              </span>
              <span className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.4)' }}>
                {progress}%
              </span>
            </div>
          </motion.div>

          {/* Boot log */}
          <div className="w-80 space-y-1 min-h-[120px]">
            {BOOT_LINES.slice(0, visibleLines).map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 font-mono text-xs"
              >
                <span style={{ color: '#00ff88' }}>✓</span>
                <span style={{ color: idx === visibleLines - 1 ? 'rgba(201,209,217,0.7)' : 'rgba(78,93,110,0.7)' }}>
                  {line.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
