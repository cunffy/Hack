import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Hex grid background (same pattern as UpdateScreen) ────────────────────────

function HexGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    window.addEventListener('resize', resize)

    const SIZE = 32
    const W    = SIZE * 2
    const H    = Math.sqrt(3) * SIZE
    let frame  = 0

    const hexPath = (cx: number, cy: number, r: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        if (i === 0) { ctx.moveTo(x, y) } else { ctx.lineTo(x, y) }
      }
      ctx.closePath()
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++
      const cols = Math.ceil(canvas.width  / W) + 2
      const rows = Math.ceil(canvas.height / H) + 2

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx    = col * W + (row % 2 === 0 ? 0 : W / 2)
          const cy    = row * H
          const pulse = Math.sin(frame * 0.018 + col * 0.4 + row * 0.3) * 0.5 + 0.5
          const alpha = pulse * 0.10 + 0.02
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
          ctx.lineWidth   = 0.8
          hexPath(cx, cy, SIZE - 2)
          ctx.stroke()
        }
      }
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, opacity: 0.55, pointerEvents: 'none' }}
    />
  )
}

// ── Hex shield logo (animated) ────────────────────────────────────────────────

function HexShield({ color }: { color: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width:           72,
        height:          72,
        borderRadius:    18,
        background:      `radial-gradient(circle at 38% 30%, ${color}18, rgba(8,12,20,0.9) 70%)`,
        border:          `1.5px solid ${color}40`,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        boxShadow:       `0 0 32px ${color}25, inset 0 1px 0 ${color}20`,
        position:        'relative',
        overflow:        'hidden',
        flexShrink:      0,
      }}
    >
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 55%)',
        borderRadius: 18,
      }} />
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    </motion.div>
  )
}

// ── Progress dots ─────────────────────────────────────────────────────────────

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => {
        const done    = i < current
        const active  = i === current
        return (
          <motion.div
            key={i}
            animate={{
              width:      active ? 24 : 8,
              background: done
                ? 'var(--cryo-accent)'
                : active
                ? 'var(--cryo-accent)'
                : 'rgba(255,255,255,0.15)',
              opacity: done ? 0.7 : 1,
            }}
            transition={{ type: 'spring', stiffness: 440, damping: 28 }}
            style={{ height: 4, borderRadius: 99 }}
          />
        )
      })}
    </div>
  )
}

// ── Theme presets ─────────────────────────────────────────────────────────────

const THEMES = [
  { id: 'cyber',   label: 'Cyber',   color: '#00d4ff', desc: 'Cyan'   },
  { id: 'phantom', label: 'Phantom', color: '#a855f7', desc: 'Purple' },
  { id: 'emerald', label: 'Emerald', color: '#10b981', desc: 'Green'  },
  { id: 'fire',    label: 'Fire',    color: '#f97316', desc: 'Orange' },
  { id: 'slate',   label: 'Slate',   color: '#94a3b8', desc: 'Grey'   },
] as const

type ThemeId = typeof THEMES[number]['id']

// ── Shared input style ────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width:       '100%',
  padding:     '10px 14px',
  borderRadius: 10,
  background:  'rgba(0,0,0,0.35)',
  border:      '1px solid rgba(255,255,255,0.12)',
  color:       'rgba(255,255,255,0.88)',
  fontSize:    13,
  fontFamily:  '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  outline:     'none',
  boxSizing:   'border-box',
  caretColor:  'var(--cryo-accent)',
  transition:  'border-color 0.2s',
}

// ── Primary button ────────────────────────────────────────────────────────────

function PrimaryBtn({
  label,
  onClick,
  disabled,
  accentColor,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  accentColor?: string
}) {
  const [hov, setHov] = useState(false)
  const color = accentColor ?? 'var(--cryo-accent)'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:        '100%',
        padding:      '11px 0',
        borderRadius: 11,
        fontSize:     14,
        fontWeight:   700,
        fontFamily:   '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        border:       'none',
        cursor:       disabled ? 'default' : 'pointer',
        background:   disabled
          ? 'rgba(255,255,255,0.06)'
          : hov
          ? `linear-gradient(135deg, ${color}ee, ${color}bb)`
          : `linear-gradient(135deg, ${color}, ${color}aa)`,
        color:        disabled ? 'rgba(255,255,255,0.25)' : '#fff',
        boxShadow:    disabled ? 'none' : `0 0 20px ${color}40`,
        transition:   'all 0.18s',
      }}
    >
      {label}
    </button>
  )
}

function GhostBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background:  'none',
        border:      'none',
        color:       'rgba(255,255,255,0.35)',
        fontSize:    12,
        cursor:      'pointer',
        fontFamily:  '-apple-system, sans-serif',
        padding:     '4px 0',
        textDecoration: 'underline',
        textDecorationColor: 'rgba(255,255,255,0.15)',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
    >
      {label}
    </button>
  )
}

// ── Step 1: Welcome & Theme ───────────────────────────────────────────────────

function StepWelcome({
  selectedTheme,
  onSelectTheme,
  onNext,
}: {
  selectedTheme: ThemeId
  onSelectTheme: (id: ThemeId) => void
  onNext: () => void
}) {
  const theme = THEMES.find(t => t.id === selectedTheme) ?? THEMES[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      <HexShield color={theme.color} />

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize:    24,
          fontWeight:  700,
          color:       'rgba(255,255,255,0.94)',
          letterSpacing: '-0.02em',
          marginBottom: 6,
          fontFamily:  '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}>
          Welcome to CryoGram OS
        </div>
        <div style={{
          fontSize:  13,
          color:     'rgba(255,255,255,0.4)',
          fontFamily: '-apple-system, sans-serif',
          lineHeight: 1.55,
          maxWidth:  340,
        }}>
          Security Operations Platform — let's get you set up.
          <br />Choose your colour theme to start.
        </div>
      </div>

      {/* Theme tiles */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {THEMES.map(t => {
          const active = t.id === selectedTheme
          return (
            <motion.button
              key={t.id}
              onClick={() => onSelectTheme(t.id)}
              whileTap={{ scale: 0.92 }}
              style={{
                display:         'flex',
                flexDirection:   'column',
                alignItems:      'center',
                gap:             7,
                padding:         '12px 14px',
                borderRadius:    12,
                border:          active ? `1.5px solid ${t.color}` : '1.5px solid rgba(255,255,255,0.1)',
                background:      active ? `${t.color}15` : 'rgba(255,255,255,0.03)',
                cursor:          'pointer',
                transition:      'all 0.15s',
                boxShadow:       active ? `0 0 16px ${t.color}30` : 'none',
                minWidth:        72,
              }}
            >
              {/* Colour chip */}
              <div style={{
                width:        26,
                height:       26,
                borderRadius: '50%',
                background:   t.color,
                boxShadow:    active ? `0 0 12px ${t.color}80` : `0 0 6px ${t.color}30`,
              }} />
              <span style={{
                fontSize:  10,
                color:     active ? t.color : 'rgba(255,255,255,0.45)',
                fontFamily: '-apple-system, sans-serif',
                fontWeight: active ? 600 : 400,
                transition: 'color 0.15s',
              }}>
                {t.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div style={{ width: '100%' }}>
        <PrimaryBtn label="Next →" onClick={onNext} accentColor={theme.color} />
      </div>
    </div>
  )
}

// ── Step 2: Security PIN ──────────────────────────────────────────────────────

function StepPin({
  onNext,
  onSkip,
  accentColor,
}: {
  onNext: () => void
  onSkip: () => void
  accentColor: string
}) {
  const [digits, setDigits]     = useState(['', '', '', ''])
  const [saving, setSaving]     = useState(false)
  const refs                    = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const pin = digits.join('')

  const handleChange = useCallback((idx: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1)
    setDigits(prev => {
      const next = [...prev]
      next[idx] = d
      return next
    })
    if (d && idx < 3) {
      refs[idx + 1].current?.focus()
    }
  }, [])

  const handleKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs[idx - 1].current?.focus()
    }
  }, [digits])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (text.length === 4) {
      setDigits(text.split(''))
      refs[3].current?.focus()
    }
  }, [])

  const submit = async () => {
    if (pin.length < 4) return
    setSaving(true)
    try {
      await (window.cryogram.system as any).setPin?.(pin)
    } catch {}
    setSaving(false)
    onNext()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
      {/* Lock icon */}
      <div style={{
        width:          56,
        height:         56,
        borderRadius:   16,
        background:     `${accentColor}14`,
        border:         `1.5px solid ${accentColor}35`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize:   20,
          fontWeight: 700,
          color:      'rgba(255,255,255,0.92)',
          marginBottom: 5,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          letterSpacing: '-0.01em',
        }}>
          Set a Screen Lock PIN
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: '-apple-system, sans-serif' }}>
          Used to lock your screen — 4 digits
        </div>
      </div>

      {/* 4-digit PIN boxes */}
      <div style={{ display: 'flex', gap: 12 }} onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={d}
            autoFocus={i === 0}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            style={{
              width:        52,
              height:       60,
              borderRadius: 12,
              background:   d ? `${accentColor}14` : 'rgba(255,255,255,0.05)',
              border:       `1.5px solid ${d ? accentColor + '70' : 'rgba(255,255,255,0.12)'}`,
              color:        d ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)',
              fontSize:     22,
              fontWeight:   700,
              textAlign:    'center',
              outline:      'none',
              fontFamily:   '"JetBrains Mono", monospace',
              caretColor:   accentColor,
              transition:   'border-color 0.15s, background 0.15s',
            }}
          />
        ))}
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <PrimaryBtn
          label={saving ? 'Saving…' : 'Next →'}
          onClick={submit}
          disabled={pin.length < 4 || saving}
          accentColor={accentColor}
        />
        <GhostBtn label="Skip for now" onClick={onSkip} />
      </div>
    </div>
  )
}

// ── Step 3: API Keys ──────────────────────────────────────────────────────────

function StepApiKeys({
  onComplete,
  accentColor,
}: {
  onComplete: () => void
  accentColor: string
}) {
  const [hibp,            setHibp]            = useState('')
  const [shodan,          setShodan]          = useState('')
  const [dehashedEmail,   setDehashedEmail]   = useState('')
  const [dehashedKey,     setDehashedKey]     = useState('')
  const [saving,          setSaving]          = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await Promise.all([
        hibp          && window.cryogram.settings.set('api.hibp',            hibp),
        shodan        && window.cryogram.settings.set('api.shodan',          shodan),
        dehashedEmail && window.cryogram.settings.set('api.dehashed.email',  dehashedEmail),
        dehashedKey   && window.cryogram.settings.set('api.dehashed.key',    dehashedKey),
      ])
    } catch {}
    setSaving(false)
    onComplete()
  }

  const fieldStyle: React.CSSProperties = {
    ...inputStyle,
    display: 'block',
  }

  const labelStyle: React.CSSProperties = {
    fontSize:    11,
    color:       'rgba(255,255,255,0.4)',
    marginBottom: 5,
    fontFamily:  '-apple-system, sans-serif',
    fontWeight:  500,
    letterSpacing: '0.02em',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize:   20,
          fontWeight: 700,
          color:      'rgba(255,255,255,0.92)',
          marginBottom: 5,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          letterSpacing: '-0.01em',
        }}>
          Connect Intelligence Feeds
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: '-apple-system, sans-serif' }}>
          Optional — you can add these later in Settings
        </div>
      </div>

      {/* HIBP */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={labelStyle}>Have I Been Pwned API Key</span>
          <a
            href="https://haveibeenpwned.com/API/Key"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 10, color: accentColor, textDecoration: 'none', fontFamily: '-apple-system, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
          >
            Get a key →
          </a>
        </div>
        <input
          type="password"
          placeholder="hibp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={hibp}
          onChange={e => setHibp(e.target.value)}
          style={fieldStyle}
          onFocus={e => { e.currentTarget.style.borderColor = `${accentColor}60` }}
          onBlur={e =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        />
      </div>

      {/* Shodan */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={labelStyle}>Shodan API Key</span>
          <a
            href="https://account.shodan.io/"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 10, color: accentColor, textDecoration: 'none', fontFamily: '-apple-system, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
          >
            Get a key →
          </a>
        </div>
        <input
          type="password"
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={shodan}
          onChange={e => setShodan(e.target.value)}
          style={fieldStyle}
          onFocus={e => { e.currentTarget.style.borderColor = `${accentColor}60` }}
          onBlur={e =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        />
      </div>

      {/* Dehashed */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={labelStyle}>Dehashed Credentials</span>
          <a
            href="https://dehashed.com/profile"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 10, color: accentColor, textDecoration: 'none', fontFamily: '-apple-system, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
          >
            Get a key →
          </a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={dehashedEmail}
            onChange={e => setDehashedEmail(e.target.value)}
            style={fieldStyle}
            onFocus={e => { e.currentTarget.style.borderColor = `${accentColor}60` }}
            onBlur={e =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          />
          <input
            type="password"
            placeholder="API key"
            value={dehashedKey}
            onChange={e => setDehashedKey(e.target.value)}
            style={fieldStyle}
            onFocus={e => { e.currentTarget.style.borderColor = `${accentColor}60` }}
            onBlur={e =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', paddingTop: 4 }}>
        <PrimaryBtn
          label={saving ? 'Saving…' : 'Save & Launch →'}
          onClick={save}
          disabled={saving}
          accentColor={accentColor}
        />
        <GhostBtn label="Skip — set up later" onClick={onComplete} />
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function SetupWizard({ onComplete }: { onComplete: () => void }) {
  const [step,         setStep]         = useState(0)
  const [prevStep,     setPrevStep]     = useState(0)
  const [selectedTheme, setTheme]       = useState<ThemeId>('cyber')

  const TOTAL_STEPS = 3
  const direction   = step >= prevStep ? 1 : -1

  const goTo = (next: number) => {
    setPrevStep(step)
    setStep(next)
  }

  const handleSelectTheme = async (id: ThemeId) => {
    setTheme(id)
    try {
      await window.cryogram.settings.set('theme.preset', id)
    } catch {}
  }

  const accentColor = THEMES.find(t => t.id === selectedTheme)?.color ?? '#00d4ff'

  const variants = {
    enter:   (dir: number) => ({ x: dir > 0 ? 60  : -60,  opacity: 0, scale: 0.97 }),
    center:  { x: 0,  opacity: 1, scale: 1 },
    exit:    (dir: number) => ({ x: dir > 0 ? -60 :  60,  opacity: 0, scale: 0.97 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         200001,
        background:     'rgba(4,7,14,0.98)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontFamily:     '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        overflow:       'hidden',
      }}
    >
      {/* Animated hex grid background */}
      <HexGrid />

      {/* Radial glow tied to theme colour */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${accentColor}08, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'background 0.6s',
      }} />

      {/* Main card */}
      <div style={{
        position:   'relative',
        zIndex:     1,
        width:      '100%',
        maxWidth:   520,
        padding:    '0 20px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28, delay: 0.1 }}
          style={{
            background:           'rgba(10,14,22,0.97)',
            backdropFilter:       'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border:               `1px solid rgba(255,255,255,0.09)`,
            borderRadius:         20,
            padding:              '28px 32px 30px',
            boxShadow:            `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${accentColor}10`,
            position:             'relative',
            overflow:             'hidden',
          }}
        >
          {/* Top accent line */}
          <div style={{
            position:   'absolute',
            top:        0,
            left:       0,
            right:      0,
            height:     2,
            background: `linear-gradient(90deg, transparent, ${accentColor}80 40%, ${accentColor}80 60%, transparent)`,
            borderRadius: '20px 20px 0 0',
            transition: 'background 0.6s',
          }} />

          {/* Step counter */}
          <div style={{
            fontSize:      10,
            color:         'rgba(255,255,255,0.22)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily:    '"JetBrains Mono", monospace',
            textAlign:     'center',
            marginBottom:  12,
          }}>
            Step {step + 1} of {TOTAL_STEPS}
          </div>

          <StepProgress current={step} total={TOTAL_STEPS} />

          {/* Animated step content */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
              >
                {step === 0 && (
                  <StepWelcome
                    selectedTheme={selectedTheme}
                    onSelectTheme={handleSelectTheme}
                    onNext={() => goTo(1)}
                  />
                )}
                {step === 1 && (
                  <StepPin
                    accentColor={accentColor}
                    onNext={() => goTo(2)}
                    onSkip={() => goTo(2)}
                  />
                )}
                {step === 2 && (
                  <StepApiKeys
                    accentColor={accentColor}
                    onComplete={onComplete}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Global skip link */}
        {step < 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ textAlign: 'center', marginTop: 14 }}
          >
            <GhostBtn label="Skip setup — go straight to OS" onClick={onComplete} />
          </motion.div>
        )}
      </div>

      {/* Watermark */}
      <div style={{
        position:      'absolute',
        bottom:        24,
        fontSize:      9,
        letterSpacing: '0.3em',
        fontWeight:    700,
        color:         'rgba(255,255,255,0.1)',
        fontFamily:    '"JetBrains Mono", monospace',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}>
        CRYOGRAM OS
      </div>
    </motion.div>
  )
}
