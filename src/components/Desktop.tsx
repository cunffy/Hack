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
  {
    id: 'files',
    label: 'Files',
    description: 'File manager',
    icon: <FolderIcon />,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.22)',
  },
  {
    id: 'launcher',
    label: 'Launcher',
    description: 'Installed applications',
    icon: <GridIcon />,
    color: '#34d399',
    glow: 'rgba(52,211,153,0.22)',
  },
  {
    id: 'system',
    label: 'System',
    description: 'Network · Sound · Power',
    icon: <DisplayIcon />,
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.22)',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 22 } },
}

export function Desktop() {
  const openApp = useWindowStore((s) => s.openApp)

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ opacity: 0.018 }}
      >
        <div
          className="text-[22vw] font-black tracking-[0.15em]"
          style={{ fontFamily: '"JetBrains Mono", monospace', color: '#00d4ff' }}
        >
          CG
        </div>
      </div>

      {/* App grid */}
      <div className="p-8 pt-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-4"
        >
          {APPS.map((app) => (
            <motion.button
              key={app.id}
              variants={item}
              onClick={() => openApp(app.id)}
              whileHover={{ y: -5, scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="group flex flex-col items-center gap-2 p-3.5 w-24 rounded-2xl cursor-default relative outline-none transition-all"
              style={{
                background: 'rgba(13,20,33,0.5)',
                border: '1px solid rgba(26,40,64,0.65)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = `1px solid ${app.color}50`
                e.currentTarget.style.background = `rgba(13,20,33,0.75)`
                e.currentTarget.style.boxShadow = `0 12px 40px ${app.glow}, 0 0 0 1px ${app.color}18`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(26,40,64,0.65)'
                e.currentTarget.style.background = 'rgba(13,20,33,0.5)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative"
                style={{
                  background: `radial-gradient(ellipse at 35% 30%, ${app.color}22, rgba(8,12,18,0.95))`,
                  border: `1px solid ${app.color}28`,
                  boxShadow: `0 4px 20px ${app.color}10`,
                }}
              >
                <div style={{ color: app.color }}>{app.icon}</div>
                {/* Inner glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(ellipse at 50% 30%, ${app.color}15, transparent 70%)` }}
                />
              </div>

              {/* Label */}
              <span
                className="text-[11px] font-medium text-center leading-tight"
                style={{ color: '#c9d1d9', whiteSpace: 'pre-line' }}
              >
                {app.label}
              </span>

              {/* Description tooltip on hover */}
              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'rgba(13,20,33,0.95)',
                  border: '1px solid rgba(26,40,64,0.8)',
                  color: '#4e5d6e',
                }}
              >
                {app.description}
              </motion.div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Bottom status bar */}
      <motion.div
        className="absolute bottom-4 left-8 right-8 flex items-center justify-between"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="flex items-center gap-4 text-xs" style={{ color: '#4e5d6e' }}>
          <span className="flex items-center gap-1.5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: '#00ff88', boxShadow: '0 0 5px rgba(0,255,136,0.7)' }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            All systems operational
          </span>
          <span style={{ color: 'rgba(30,45,64,1)' }}>|</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(26,40,64,0.9)' }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.15em' }}>CRYOGRAM OS</span>
        </div>
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

function FolderIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function DisplayIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
