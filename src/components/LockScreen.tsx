import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLockStore } from '../store/lockStore'

const MIN_DIGITS = 4
const MAX_DIGITS = 8

export function LockScreen() {
  const { unlock, pinRequired } = useLockStore()
  const [pin, setPin]       = useState('')
  const [error, setError]   = useState('')
  const [shaking, setShaking] = useState(false)
  const [time, setTime]     = useState(new Date())
  const pinRef = useRef(pin)
  pinRef.current = pin

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const addDigit = useCallback((d: string) => {
    if (pinRef.current.length >= MAX_DIGITS) return
    setPin(p => p + d)
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

  const submit = useCallback(async () => {
    if (!pinRequired) { unlock(); return }
    const current = pinRef.current
    if (current.length < MIN_DIGITS) { shake(`Enter at least ${MIN_DIGITS} digits`); return }
    try {
      const ok: boolean = await (window.cryogram as any).system.verifyPin(current)
      if (ok) {
        unlock()
      } else {
        shake('Incorrect PIN — try again')
      }
    } catch {
      shake('Unable to verify PIN')
    }
  }, [pinRequired, unlock, shake])

  // Keyboard handler — swallowed here so nothing bleeds through
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation()
      if (!pinRequired) { if (e.key === 'Enter' || e.key === ' ') unlock(); return }
      if (e.key >= '0' && e.key <= '9') addDigit(e.key)
      else if (e.key === 'Backspace') del()
      else if (e.key === 'Enter') submit()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [pinRequired, unlock, addDigit, del, submit])

  const h  = time.getHours().toString().padStart(2, '0')
  const m  = time.getMinutes().toString().padStart(2, '0')
  const ds = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  // Number of dot indicators — always show max(4, typed) up to 8
  const dotCount = Math.min(MAX_DIGITS, Math.max(MIN_DIGITS, pin.length + (pin.length < MAX_DIGITS ? 1 : 0)))

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
      <div className="text-center mb-10 select-none">
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
            className="flex gap-3.5"
            animate={shaking ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: dotCount }).map((_, i) => {
              const filled = i < pin.length
              const isErr  = error && filled
              return (
                <motion.div
                  key={i}
                  className="rounded-full"
                  animate={{
                    scale: filled ? 1.15 : 1,
                    background: isErr ? '#f87171' : filled ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.18)',
                    boxShadow: filled && !isErr ? `0 0 10px var(--cryo-a50)` : 'none',
                  }}
                  transition={{ duration: 0.12 }}
                  style={{ width: 11, height: 11 }}
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

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2.5">
            {['1','2','3','4','5','6','7','8','9'].map(d => (
              <NumKey key={d} label={d} onClick={() => addDigit(d)} />
            ))}
            <div />
            <NumKey label="0" onClick={() => addDigit('0')} />
            <NumKey label="⌫" onClick={del} dim />
          </div>

          {/* Unlock */}
          <motion.button
            onClick={submit}
            whileTap={{ scale: 0.95 }}
            className="mt-1 px-10 py-2 rounded-lg text-sm font-medium"
            style={{
              background: pin.length >= MIN_DIGITS ? 'var(--cryo-a12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${pin.length >= MIN_DIGITS ? 'var(--cryo-a45)' : 'rgba(255,255,255,0.07)'}`,
              color: pin.length >= MIN_DIGITS ? 'var(--cryo-accent)' : 'rgba(255,255,255,0.25)',
              fontFamily: '-apple-system, sans-serif',
              cursor: pin.length >= MIN_DIGITS ? 'pointer' : 'default',
              transition: 'all 0.15s',
            }}
          >
            Unlock
          </motion.button>

          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', fontFamily: '-apple-system, sans-serif', marginTop: -8 }}>
            Type digits or use keypad · Enter to confirm
          </div>
        </div>
      ) : (
        // No PIN required — just press any key / click
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

// ── Number key button ─────────────────────────────────────────────────────────
function NumKey({ label, onClick, dim }: { label: string; onClick: () => void; dim?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.86 }}
      className="w-[68px] h-[68px] rounded-full flex items-center justify-center select-none"
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: dim ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.9)',
        fontSize: label === '⌫' ? 20 : 24,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        fontWeight: 300,
        cursor: 'pointer',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.13)' }}
    >
      {label}
    </motion.button>
  )
}
