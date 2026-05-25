import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface MenuItem {
  label?: string
  icon?: React.ReactNode
  action?: () => void
  danger?: boolean
  sep?: true
}

interface Props {
  x: number
  y: number
  items: MenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    // Small delay so the mousedown that opened the menu doesn't immediately close it
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 50)
    document.addEventListener('keydown', keyHandler)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [onClose])

  // Clamp to viewport
  const menuW = 200
  const menuH = items.length * 34
  const cx = Math.min(x, window.innerWidth - menuW - 8)
  const cy = Math.min(y, window.innerHeight - menuH - 8)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.93, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93, y: -4 }}
      transition={{ duration: 0.1 }}
      className="fixed z-[9000] rounded-xl overflow-hidden py-1.5"
      style={{
        left: cx,
        top: cy,
        minWidth: menuW,
        background: 'rgba(16,22,34,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(32px)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.75)',
      }}
    >
      {items.map((item, i) =>
        item.sep ? (
          <div key={i} className="my-1 mx-3 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        ) : (
          <button
            key={i}
            onClick={() => { item.action?.(); onClose() }}
            className="w-full flex items-center gap-2.5 px-3.5 py-1.5 text-sm text-left transition-colors"
            style={{
              color: item.danger ? '#f87171' : 'rgba(255,255,255,0.8)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = item.danger
                ? 'rgba(248,113,113,0.12)'
                : 'rgba(0,212,255,0.12)'
              e.currentTarget.style.color = item.danger ? '#fca5a5' : '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = item.danger ? '#f87171' : 'rgba(255,255,255,0.8)'
            }}
          >
            {item.icon && <span className="w-4 h-4 flex items-center justify-center opacity-60">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        )
      )}
    </motion.div>
  )
}
