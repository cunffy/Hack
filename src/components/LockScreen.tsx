import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLockStore } from '../store/lockStore'

const MIN_DIGITS = 4
const MAX_DIGITS = 8

export function LockScreen() {
  const { unlock, pinRequired } = useLockStore()
  const [pin, setPin]         = useState('')
  const [error, setError]     = useState('')
  const [shaking, setShaking] = useState(false)
  const [time, setTime]       = useState(new Date())

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const addDigit = useCallback((d: string) => {
    setPin(p => p.length >= MAX_DIGITS ? p : p + d)
    setError('')
  }, [])

  const del = useCallback(() => {
    setPin(p => p.slice(0, -1))
    setError('')
  }, [])

  const shake = useCallback((msg: string) => {
    setError(msg)
    setShaking(true)
    setPin('')
    setTimeout(() => setShaking(false), 550)
  }, [])

  // Auto-submit: try verifyPin after each digit once MIN_DIGITS reached.
  // On success → unlock immediately. On failure below MAX_DIGITS → silently
  // accept more digits. At MAX_DIGITS with failure → shake.
  useEffect(() => {
    if (!pinRequired || pin.length < MIN_DIGITS) return
    let cancelled = false
    ;(async () => {
      try {
        const ok: boolean = await (window.cryogram as any).system.verifyPin(pin)
        if (cancelled) return
        if (ok) {
          unlock()
        } else if (pin.length >= MAX_DIGITS) {
          shake('Incorrect PIN — try again')
        }
      } catch {
        if (!cancelled && pin.length >= MAX_DIGITS) shake('Unable to verify PIN')
      }
    })()
    return () => { cancelled = true }
  }, [pin, pinRequired, unlock, shake])

  // Keyboard handler — swallowed here so nothing bleeds through to apps below
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation()
      if (!pinRequired) { if (e.key === 'Enter' || e.key === ' ') unlock(); return }
      if (e.key >= '0' && e.key <= '9') addDigit(e.key)
      else if (e.key === 'Backspace') del()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [pinRequired, unlock, addDigit, del])

  const h  = time.getHours().toString().padStart(2, '0')
  const m  = time.getMinutes().toString().padStart(2, '0')
  const ds = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  // Start with 1 dot; grow by 1 for each digit typed
  const dotCount = Math.max(1, pin.length)

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ zIndex: 99999, background: 'rgba(3,7,14,0.97)', backdropFilter: 'blur(48px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--cryo-a05) 0%, transparent 65%)' }} />
      </div>

      {/* Brand */}
      <div className="mb-10 text-center">
        <div
          className="tracking-[0.5em] uppercase text-xs mb-1"
          style={{ color: 'var(--cryo-a45)', fontFamily: '"JetBrains Mono", monospace' }}
        >
          CRYOGRAM OS
        </div>
        <div className="w-12 h-px mx-auto" style={{ background: 'var(--cryo-a20)' }} />
      </div>

      {/* Clock */}
      <div className="text-center mb-12 select-none">
        <BlinkingClock h={h} m={m} seconds={time.getSeconds()} />
        <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: '-apple-system, sans-serif', marginTop: 6 }}>
          {ds}
        </div>
      </div>

      {/* Unlock area */}
      {pinRequired ? (
        <div className="flex flex-col items-center gap-5">
          {/* PIN dots */}
          <motion.div
            className="flex gap-4"
            animate={shaking ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: dotCount }).map((_, i) => {
              const filled = i < pin.length
              const isErr  = !!(error && filled)
              return (
                <motion.div
                  key={i}
                  className="rounded-full"
                  initial={i > 0 ? { scale: 0, opacity: 0 } : false}
                  animate={{
                    scale: filled ? 1.2 : 1,
                    opacity: 1,
                    background: isErr
                      ? '#f87171'
                      : filled
                        ? 'var(--cryo-accent)'
                        : 'rgba(255,255,255,0.18)',
                    boxShadow: filled && !isErr ? `0 0 12px var(--cryo-a50)` : 'none',
                  }}
                  transition={{ duration: 0.15 }}
                  style={{ width: 12, height: 12 }}
                />
              )
            })}
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                key={error}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-center"
                style={{ color: '#f87171', fontFamily: '-apple-system, sans-serif' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', fontFamily: '-apple-system, sans-serif', marginTop: 4 }}>
            Type your PIN to unlock
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: '-apple-system, sans-serif' }}>
            Press any key or click to continue
          </div>
          <motion.button
            onClick={unlock}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: 'var(--cryo-a08)',
              border: '1px solid var(--cryo-a30)',
              color: 'var(--cryo-accent)',
              fontFamily: '-apple-system, sans-serif',
            }}
            whileHover={{ background: 'var(--cryo-a18)' }}
          >
            Unlock
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

// ── Blinking clock ────────────────────────────────────────────────────────────
function BlinkingClock({ h, m, seconds }: { h: string; m: string; seconds: number }) {
  return (
    <div
      className="tabular-nums font-extralight"
      style={{
        fontSize: '5.5rem',
        lineHeight: 1,
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        letterSpacing: '-0.03em',
        textShadow: '0 0 60px var(--cryo-a10)',
      }}
    >
      {h}
      <span style={{ opacity: seconds % 2 === 0 ? 1 : 0.25, transition: 'opacity 0.4s' }}>:</span>
      {m}
    </div>
  )
}
