import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  '[ OK ] Loaded Cryogram kernel modules',
  '[ OK ] Started security daemon',
  '[ OK ] Mounted encrypted workspace',
  '[ OK ] Initialized PTY subsystem',
  '[ OK ] Loaded breach monitor',
  '[ OK ] All systems nominal',
]

interface Props {
  onDone: () => void
}

export function BootSplash({ onDone }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]])
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setExiting(true)
          setTimeout(onDone, 600)
        }, 400)
      }
    }, 260)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#080c12' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-10 text-center"
          >
            <div
              className="text-5xl font-black tracking-[0.25em] text-cryo-accent glow-cyan mb-2"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              CRYOGRAM
            </div>
            <div className="text-cryo-muted text-xs tracking-[0.3em] uppercase">
              Security Operations Platform
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-72 mb-6">
            <div className="h-px bg-cryo-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #00d4ff, #bb88ff)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
              />
            </div>
          </div>

          {/* Boot log */}
          <div className="w-72 font-mono text-xs space-y-1">
            {lines.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="text-cryo-muted"
              >
                <span className="text-cryo-green mr-1">[</span>
                <span className="text-cryo-green"> OK </span>
                <span className="text-cryo-green mr-2">]</span>
                <span>{line.replace(/^\[ OK \] /, '')}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
