import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface UpdateInfo {
  commitCount: number
  changes: string[]
}

interface Props {
  info: UpdateInfo
  onUpdate: () => void
  onDismiss: () => void
}

export function UpdateNotification({ info, onUpdate, onDismiss }: Props) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      style={{
        position: 'fixed',
        bottom: 90,
        right: 20,
        width: 340,
        zIndex: 99000,
        background: 'rgba(10,16,26,0.97)',
        border: '1px solid rgba(0,212,255,0.25)',
        borderRadius: 18,
        boxShadow: '0 0 0 1px rgba(0,212,255,0.08), 0 24px 64px rgba(0,0,0,0.85), 0 0 40px rgba(0,212,255,0.06)',
        backdropFilter: 'blur(40px)',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >
      {/* Top glow line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--cryo-accent) 40%, #00ff88 60%, transparent)', opacity: 0.7 }} />

      <div style={{ padding: '14px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cryo-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>
              Update Available
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
              {info.commitCount} new {info.commitCount === 1 ? 'change' : 'changes'} ready to install
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4, borderRadius: 6 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Changes list */}
        {info.changes.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <AnimatePresence>
              {(expanded ? info.changes : info.changes.slice(0, 2)).map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 4 }}
                >
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--cryo-accent)', marginTop: 5, flexShrink: 0, opacity: 0.7 }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{c}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {info.changes.length > 2 && (
              <button
                onClick={() => setExpanded(v => !v)}
                style={{ background: 'none', border: 'none', color: 'var(--cryo-accent)', fontSize: 11, cursor: 'pointer', padding: 0, opacity: 0.75 }}
              >
                {expanded ? 'Show less' : `+${info.changes.length - 2} more changes`}
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onUpdate}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 12, fontWeight: 700,
              background: 'linear-gradient(135deg, var(--cryo-accent) 0%, #00ff88 100%)',
              border: 'none', color: '#000', cursor: 'pointer',
              boxShadow: '0 0 16px rgba(0,212,255,0.3)',
            }}
          >
            Update Now
          </button>
          <button
            onClick={onDismiss}
            style={{
              padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            Not Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}
