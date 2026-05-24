import { motion } from 'framer-motion'
import { AppId, useWindowStore } from '../store/windowStore'

interface AppMeta {
  id: AppId
  label: string
  description: string
  icon: React.ReactNode
  color: string
  glow: string
}

const APPS: AppMeta[] = [
  {
    id: 'terminal',
    label: 'Terminal',
    description: 'System shell',
    icon: <TermIcon />,
    color: '#00ff88',
    glow: 'rgba(0,255,136,0.25)',
  },
  {
    id: 'editor',
    label: 'Code Editor',
    description: 'JS · Py · C · C++ · Rust · Go',
    icon: <EditorIcon />,
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.25)',
  },
  {
    id: 'password-tester',
    label: 'Password\nTester',
    description: 'Brute · Dict · Hybrid · Spray',
    icon: <LockIcon />,
    color: '#ffcc00',
    glow: 'rgba(255,204,0,0.22)',
  },
  {
    id: 'leaker',
    label: 'Leaker',
    description: 'Breach & credential monitor',
    icon: <LeakIcon />,
    color: '#ff4466',
    glow: 'rgba(255,68,102,0.22)',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'API keys & preferences',
    icon: <GearIcon />,
    color: '#bb88ff',
    glow: 'rgba(187,136,255,0.22)',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 22 } },
}

export function Desktop() {
  const openApp = useWindowStore((s) => s.openApp)

  return (
    <div className="absolute inset-0 p-10 flex flex-col">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-5"
      >
        {APPS.map((app) => (
          <motion.button
            key={app.id}
            variants={item}
            onClick={() => openApp(app.id)}
            whileHover={{ y: -4, scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="group flex flex-col items-center gap-2.5 p-4 w-[88px] rounded-2xl cursor-default relative outline-none"
            style={{
              background: 'rgba(13,20,33,0.55)',
              border: '1px solid rgba(26,40,64,0.7)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `1px solid ${app.color}55`
              e.currentTarget.style.boxShadow = `0 8px 32px ${app.glow}, 0 0 0 1px ${app.color}22`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '1px solid rgba(26,40,64,0.7)'
              e.currentTarget.style.boxShadow = ''
            }}
          >
            {/* Icon container */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: `radial-gradient(ellipse at 40% 35%, ${app.color}18, rgba(13,20,33,0.9))`,
                border: `1px solid ${app.color}30`,
              }}
            >
              <div style={{ color: app.color }}>{app.icon}</div>
            </div>

            {/* Label */}
            <span
              className="text-[11px] font-semibold text-center leading-tight text-den-text"
              style={{ whiteSpace: 'pre-line' }}
            >
              {app.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Bottom status */}
      <motion.div
        className="absolute bottom-3 left-10 flex items-center gap-4 text-den-muted text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <span className="flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-den-green inline-block"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{ boxShadow: '0 0 5px rgba(0,255,136,0.7)' }}
          />
          Systems online
        </span>
        <span className="text-den-faint">|</span>
        <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      </motion.div>
    </div>
  )
}

function TermIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}

function EditorIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function LeakIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 L12 12" />
      <path d="M12 12 C 12 12 6 16 6 19 a 6 6 0 0 0 12 0 C 18 16 12 12 12 12 Z" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
