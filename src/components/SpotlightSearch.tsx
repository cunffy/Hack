import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore, AppId } from '../store/windowStore'
import { APP_META } from './Dock'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SearchResult {
  appId: AppId
  label: string
  color: string
  icon: React.ReactNode
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SpotlightSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery]       = useState('')
  const [selectedIdx, setIdx]   = useState(0)
  const openApp                 = useWindowStore(s => s.openApp)
  const inputRef                = useRef<HTMLInputElement>(null)

  // Build filtered results from APP_META
  const allResults: SearchResult[] = Object.entries(APP_META).map(([id, meta]) => ({
    appId:  id as AppId,
    label:  meta.label,
    color:  meta.color,
    icon:   meta.icon,
  }))

  const results: SearchResult[] = query.trim()
    ? allResults.filter(r => r.label.toLowerCase().includes(query.toLowerCase()))
    : allResults
  const shown = results.slice(0, 8)

  // Reset state whenever overlay opens / closes
  useEffect(() => {
    if (open) {
      setQuery('')
      setIdx(0)
      // Focus input after mount animation
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  // Clamp selectedIdx when results change
  useEffect(() => {
    setIdx(i => Math.min(i, Math.max(0, shown.length - 1)))
  }, [shown.length])

  const launch = useCallback((appId: AppId) => {
    openApp(appId)
    onClose()
  }, [openApp, onClose])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIdx(i => Math.min(i + 1, shown.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setIdx(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (shown[selectedIdx]) launch(shown[selectedIdx].appId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, shown, selectedIdx, launch, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position:        'fixed',
            inset:           0,
            zIndex:          90000,
            background:      'rgba(0,0,0,0.5)',
            backdropFilter:  'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display:         'flex',
            alignItems:      'flex-start',
            justifyContent:  'center',
            paddingTop:      '14vh',
          }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0, scale: 0.95,    y: -8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.7 }}
            style={{
              width:           600,
              borderRadius:    18,
              overflow:        'hidden',
              background:      'rgba(10,14,22,0.97)',
              border:          '1px solid rgba(255,255,255,0.1)',
              boxShadow:       '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,212,255,0.08)',
              fontFamily:      '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Search bar ─────────────────────────────────────────────────── */}
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          12,
              padding:      '14px 18px',
              borderBottom: shown.length > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              {/* Search icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>

              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setIdx(0) }}
                placeholder="Search apps…"
                style={{
                  flex:        1,
                  background:  'transparent',
                  border:      'none',
                  outline:     'none',
                  color:       'rgba(255,255,255,0.92)',
                  fontSize:    18,
                  fontFamily:  'inherit',
                  caretColor:  'var(--cryo-accent)',
                }}
              />

              {query && (
                <button
                  onClick={() => { setQuery(''); setIdx(0); inputRef.current?.focus() }}
                  style={{
                    background:  'rgba(255,255,255,0.08)',
                    border:      'none',
                    borderRadius: 6,
                    color:       'rgba(255,255,255,0.4)',
                    fontSize:    13,
                    cursor:      'pointer',
                    padding:     '2px 7px',
                    lineHeight:  1.4,
                  }}
                >
                  ✕
                </button>
              )}

              <kbd style={{
                background:    'rgba(255,255,255,0.07)',
                border:        '1px solid rgba(255,255,255,0.12)',
                borderRadius:  6,
                color:         'rgba(255,255,255,0.3)',
                fontSize:      11,
                padding:       '2px 7px',
                fontFamily:    'inherit',
                letterSpacing: '0.02em',
                whiteSpace:    'nowrap',
              }}>
                esc
              </kbd>
            </div>

            {/* ── Results list ───────────────────────────────────────────────── */}
            <AnimatePresence initial={false}>
              {shown.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '6px 8px 8px' }}>
                    {shown.map((result, i) => {
                      const isSelected = i === selectedIdx
                      return (
                        <motion.button
                          key={result.appId}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.14 }}
                          onClick={() => launch(result.appId)}
                          onMouseEnter={() => setIdx(i)}
                          style={{
                            display:        'flex',
                            alignItems:     'center',
                            gap:            12,
                            width:          '100%',
                            padding:        '9px 12px',
                            borderRadius:   11,
                            border:         isSelected
                              ? `1px solid ${result.color}50`
                              : '1px solid transparent',
                            background:     isSelected
                              ? `${result.color}12`
                              : 'transparent',
                            cursor:         'pointer',
                            textAlign:      'left',
                            transition:     'background 0.1s, border-color 0.1s',
                          }}
                        >
                          {/* App icon container */}
                          <div style={{
                            width:          38,
                            height:         38,
                            borderRadius:   10,
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            flexShrink:     0,
                            background:     `radial-gradient(ellipse at 40% 30%, ${result.color}25, rgba(8,12,20,0.9) 70%)`,
                            border:         `1px solid ${result.color}30`,
                            color:          result.color,
                          }}>
                            {result.icon}
                          </div>

                          {/* Color chip */}
                          <div style={{
                            width:       8,
                            height:      8,
                            borderRadius: '50%',
                            background:  result.color,
                            flexShrink:  0,
                            boxShadow:   `0 0 6px ${result.color}80`,
                          }} />

                          {/* Label */}
                          <span style={{
                            flex:       1,
                            color:      isSelected ? '#fff' : 'rgba(255,255,255,0.78)',
                            fontSize:   14,
                            fontWeight: isSelected ? 600 : 400,
                            transition: 'color 0.1s',
                          }}>
                            {result.label}
                          </span>

                          {/* Open badge */}
                          <span style={{
                            background:  isSelected ? `${result.color}25` : 'rgba(255,255,255,0.06)',
                            border:      `1px solid ${isSelected ? `${result.color}50` : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: 6,
                            color:       isSelected ? result.color : 'rgba(255,255,255,0.35)',
                            fontSize:    11,
                            fontWeight:  600,
                            padding:     '2px 8px',
                            transition:  'all 0.1s',
                          }}>
                            Open
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Empty state ─────────────────────────────────────────────────── */}
            <AnimatePresence>
              {query.trim() !== '' && shown.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding:    '28px 0',
                    textAlign:  'center',
                    color:      'rgba(255,255,255,0.25)',
                    fontSize:   13,
                  }}
                >
                  No apps found for &ldquo;{query}&rdquo;
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom hint bar */}
            <div style={{
              padding:        '6px 18px 10px',
              display:        'flex',
              gap:            16,
              alignItems:     'center',
              borderTop:      shown.length > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              {[
                { key: '↑↓', desc: 'navigate' },
                { key: '↵',  desc: 'open'     },
                { key: 'esc', desc: 'close'    },
              ].map(({ key, desc }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <kbd style={{
                    background:   'rgba(255,255,255,0.07)',
                    border:       '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 5,
                    color:        'rgba(255,255,255,0.35)',
                    fontSize:     10,
                    padding:      '1px 5px',
                    fontFamily:   'inherit',
                  }}>
                    {key}
                  </kbd>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
