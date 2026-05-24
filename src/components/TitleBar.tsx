import { motion } from 'framer-motion'
import SystemTray from './SystemTray'

export function TitleBar() {
  const isMock = !window.cryogram?.window?.close

  return (
    <div
      className="flex items-center h-9 px-3 shrink-0 select-none relative"
      style={{
        background: 'rgba(6,10,16,0.97)',
        borderBottom: '1px solid rgba(26,40,64,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitAppRegion: 'drag',
      } as React.CSSProperties}
    >
      {/* Brand accent line at top */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.55) 35%, rgba(187,136,255,0.35) 65%, transparent 100%)',
        }}
      />

      {/* Left: branding */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <motion.div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: '#00ff88', boxShadow: '0 0 7px rgba(0,255,136,0.9)' }}
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="text-cryo-accent font-black text-sm tracking-[0.22em] shrink-0"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            textShadow: '0 0 14px rgba(0,212,255,0.4)',
          }}
        >
          CRYOGRAM
        </span>
        <span className="text-xs hidden lg:block truncate" style={{ color: 'rgba(78,93,110,0.65)', letterSpacing: '0.05em' }}>
          Security Operations Platform
        </span>
      </div>

      {/* Centre: system tray */}
      <div
        className="flex items-center relative shrink-0"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <SystemTray />
      </div>

      {/* Right: window controls */}
      <div
        className="flex items-center gap-0.5 flex-1 justify-end"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <WinBtn title="Minimize" hoverColor="#ffcc00" onClick={() => !isMock && window.cryogram.window.minimize()}>
          <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor"><rect width="10" height="2" rx="1" /></svg>
        </WinBtn>
        <WinBtn title="Maximize" hoverColor="#00d4ff" onClick={() => !isMock && window.cryogram.window.maximize()}>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="0.75" y="0.75" width="7.5" height="7.5" rx="1.5" />
          </svg>
        </WinBtn>
        <WinBtn title="Close" hoverColor="#ff4466" hoverBg="rgba(255,68,102,0.15)" onClick={() => !isMock && window.cryogram.window.close()}>
          <svg width="9" height="9" viewBox="0 0 9 9" stroke="currentColor" strokeWidth="1.5">
            <line x1="1" y1="1" x2="8" y2="8" />
            <line x1="8" y1="1" x2="1" y2="8" />
          </svg>
        </WinBtn>
      </div>
    </div>
  )
}

function WinBtn({
  children, onClick, title, hoverColor, hoverBg,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  hoverColor: string
  hoverBg?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded text-cryo-muted transition-colors"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor
        e.currentTarget.style.background = hoverBg ?? 'rgba(255,255,255,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = ''
        e.currentTarget.style.background = ''
      }}
    >
      {children}
    </motion.button>
  )
}
