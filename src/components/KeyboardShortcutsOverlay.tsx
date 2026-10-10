import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  {
    title: 'System',
    shortcuts: [
      { keys: ['Ctrl', 'Space'], desc: 'Spotlight search' },
      { keys: ['Ctrl', 'Shift', 'V'], desc: 'Clipboard history' },
      { keys: ['Super', 'L'], desc: 'Lock screen' },
      { keys: ['Super', 'D'], desc: 'Show / hide desktop' },
      { keys: ['Super', 'M'], desc: 'Mission Control' },
      { keys: ['Ctrl', '/'], desc: 'Keyboard shortcuts' },
    ],
  },
  {
    title: 'Windows',
    shortcuts: [
      { keys: ['Alt', 'Tab'], desc: 'Switch app (forward)' },
      { keys: ['Alt', 'Shift', 'Tab'], desc: 'Switch app (backward)' },
      { keys: ['Ctrl', 'W'], desc: 'Close focused window' },
      { keys: ['Ctrl', 'Alt', 'T'], desc: 'Open Terminal' },
      { keys: ['Super', '1–4'], desc: 'Switch workspace' },
    ],
  },
  {
    title: 'Window Snapping',
    shortcuts: [
      { keys: ['Super', '←'], desc: 'Snap to left half' },
      { keys: ['Super', '→'], desc: 'Snap to right half' },
      { keys: ['Super', '↑'], desc: 'Maximize / restore' },
      { keys: ['Drag to left edge'], desc: 'Snap left half' },
      { keys: ['Drag to right edge'], desc: 'Snap right half' },
      { keys: ['Drag to top edge'], desc: 'Maximize' },
    ],
  },
  {
    title: 'Apps',
    shortcuts: [
      { keys: ['Ctrl', 'S'], desc: 'Save (Markdown Editor)' },
      { keys: ['Ctrl', '⌘', '↵'], desc: 'Run query (SQLite)' },
      { keys: ['Ctrl', 'W'], desc: 'Close focused window' },
    ],
  },
]

interface Props { open: boolean; onClose: () => void }

export function KeyboardShortcutsOverlay({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="kb-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 99990, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
            style={{ background: 'rgba(12,16,26,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px 32px', width: 640, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Keyboard Shortcuts</div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px 10px', fontSize: 12 }}>Esc</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {SECTIONS.map(section => (
                <div key={section.title}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--cryo-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{section.title}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {section.shortcuts.map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{s.desc}</span>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          {s.keys.map((k, ki) => (
                            <kbd key={ki} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{k}</kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
              Press <kbd style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '1px 5px', fontSize: 10 }}>Ctrl</kbd> + <kbd style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '1px 5px', fontSize: 10 }}>/</kbd> to toggle this panel
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
