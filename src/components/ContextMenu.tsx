import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export interface MenuItem {
  label?: string
  icon?: React.ReactNode
  action?: () => void
  danger?: boolean
  sep?: true
  shortcut?: string
  disabled?: boolean
}

interface Props {
  x: number
  y: number
  items: MenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(-1)

  const actionItems = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => !item.sep && !item.disabled)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocused(f => (f + 1) % actionItems.length)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocused(f => (f - 1 + actionItems.length) % actionItems.length)
      }
      if (e.key === 'Enter' && focused >= 0) {
        actionItems[focused]?.item.action?.()
        onClose()
      }
    }
    const t = setTimeout(() => document.addEventListener('mousedown', onDown), 60)
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, focused, actionItems])

  const menuW = 230
  const rows = items.filter(i => !i.sep).length
  const menuH = rows * 34 + items.filter(i => !!i.sep).length * 9 + 10
  const cx = Math.min(x, window.innerWidth - menuW - 10)
  const cy = Math.min(y, window.innerHeight - menuH - 10)

  let actionIdx = -1

  return (
    <motion.div
      ref={ref}
      className="fixed z-[9000]"
      style={{ left: cx, top: cy, minWidth: menuW }}
      initial={{ opacity: 0, scale: 0.88, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -8 }}
      transition={{ type: 'spring', stiffness: 520, damping: 30, mass: 0.5 }}
    >
      <div
        style={{
          background: 'rgba(18,24,36,0.96)',
          backdropFilter: 'blur(48px) saturate(2)',
          WebkitBackdropFilter: 'blur(48px) saturate(2)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 14,
          boxShadow:
            '0 24px 64px rgba(0,0,0,0.85), 0 0 0 0.5px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.06) inset',
          padding: '5px 0',
          overflow: 'hidden',
        }}
      >
        {items.map((item, i) => {
          if (item.sep) {
            return (
              <div
                key={i}
                style={{
                  height: 1,
                  margin: '4px 6px',
                  background: 'rgba(255,255,255,0.07)',
                }}
              />
            )
          }
          actionIdx++
          const myIdx = actionIdx
          const isFocused = focused === myIdx
          return (
            <ContextItem
              key={i}
              item={item}
              isFocused={isFocused}
              onHover={() => setFocused(myIdx)}
              onLeave={() => setFocused(-1)}
              onClose={onClose}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

function ContextItem({
  item,
  isFocused,
  onHover,
  onLeave,
  onClose,
}: {
  item: MenuItem
  isFocused: boolean
  onHover: () => void
  onLeave: () => void
  onClose: () => void
}) {
  return (
    <motion.button
      animate={{
        background: isFocused
          ? item.danger
            ? 'rgba(239,68,68,0.16)'
            : 'var(--cryo-a12)'
          : 'rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.08 }}
      onClick={() => {
        if (!item.disabled) {
          item.action?.()
          onClose()
        }
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      disabled={item.disabled}
      className="w-full flex items-center gap-2.5 px-3.5 text-sm text-left select-none"
      style={{
        height: 34,
        color: item.danger
          ? isFocused
            ? '#fca5a5'
            : '#f87171'
          : isFocused
          ? '#ffffff'
          : 'rgba(255,255,255,0.82)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        fontWeight: 400,
        cursor: item.disabled ? 'default' : 'pointer',
        opacity: item.disabled ? 0.35 : 1,
        transition: 'color 0.08s',
        border: 'none',
        borderRadius: 0,
      }}
    >
      {item.icon && (
        <span
          className="w-4 h-4 flex items-center justify-center shrink-0"
          style={{ opacity: 0.65 }}
        >
          {item.icon}
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.shortcut && (
        <span
          style={{
            fontSize: 11,
            opacity: 0.38,
            marginLeft: 8,
            fontFamily: '-apple-system, sans-serif',
          }}
        >
          {item.shortcut}
        </span>
      )}
    </motion.button>
  )
}
