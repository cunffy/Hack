import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: number
  title: string
  body: string
}

let toastId = 0

export function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = (id: number) => setToasts((p) => p.filter((t) => t.id !== id))

  useEffect(() => {
    const handler = (e: Event) => {
      const { title, body } = (e as CustomEvent).detail
      const id = ++toastId
      setToasts((prev) => [...prev, { id, title, body }])
      setTimeout(() => dismiss(id), 5500)
    }
    window.addEventListener('cryogram:notification', handler)
    return () => window.removeEventListener('cryogram:notification', handler)
  }, [])

  return (
    <div className="fixed top-12 right-4 flex flex-col gap-2 z-[200] pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="pointer-events-auto w-72 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(13,20,33,0.95)',
              border: '1px solid rgba(0,212,255,0.3)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.1)',
            }}
          >
            {/* Accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-cryo-accent via-cryo-purple to-transparent" />

            <div className="p-3 flex items-start gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-cryo-accent text-xs font-bold truncate">{t.title}</div>
                <div className="text-cryo-text text-xs mt-0.5 leading-relaxed opacity-80">{t.body}</div>
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-cryo-muted hover:text-cryo-text transition-colors text-base leading-none shrink-0 mt-0.5"
              >
                ×
              </button>
            </div>

            {/* Auto-dismiss progress */}
            <motion.div
              className="h-px mx-3 mb-2 rounded-full bg-cryo-accent/40"
              initial={{ scaleX: 1, originX: 0 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5.5, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
