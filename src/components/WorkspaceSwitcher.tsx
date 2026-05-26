import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────

interface WorkspaceInfo {
  index:     number   // 0-based
  count:     number   // windows on this workspace
}

const NUM_WORKSPACES = 4

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildWorkspaces(windows: WmWindow[]): WorkspaceInfo[] {
  const counts: Record<number, number> = {}
  for (const w of windows) {
    const d = w.desktop ?? 0
    counts[d] = (counts[d] ?? 0) + 1
  }
  return Array.from({ length: NUM_WORKSPACES }, (_, i) => ({
    index: i,
    count: counts[i] ?? 0,
  }))
}

// ── Tooltip ────────────────────────────────────────────────────────────────────

function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  const [vis, setVis] = useState(false)
  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVis(true)}
      onMouseLeave={() => setVis(false)}
    >
      {children}
      <AnimatePresence>
        {vis && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.93 }}
            transition={{ duration: 0.12 }}
            style={{
              position:   'absolute',
              top:        '100%',
              left:       '50%',
              transform:  'translateX(-50%)',
              marginTop:  6,
              background: 'rgba(12,16,26,0.97)',
              border:     '1px solid rgba(255,255,255,0.1)',
              borderRadius: 7,
              padding:    '4px 9px',
              fontSize:   10,
              fontWeight: 500,
              color:      'rgba(255,255,255,0.75)',
              whiteSpace: 'nowrap',
              zIndex:     99999,
              pointerEvents: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              boxShadow:  '0 6px 20px rgba(0,0,0,0.6)',
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Workspace dot ──────────────────────────────────────────────────────────────

function WorkspaceDot({
  ws, active, onClick,
}: {
  ws:      WorkspaceInfo
  active:  boolean
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  const label = `Workspace ${ws.index + 1} · Super+${ws.index + 1}${ws.count > 0 ? ` · ${ws.count} window${ws.count !== 1 ? 's' : ''}` : ''}`

  return (
    <Tooltip label={label}>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position:       'relative',
          width:          26,
          height:         22,
          borderRadius:   7,
          border:         active
            ? '1px solid var(--cryo-a35)'
            : hov
              ? '1px solid rgba(255,255,255,0.12)'
              : '1px solid rgba(255,255,255,0.06)',
          background:     active
            ? 'var(--cryo-a18)'
            : hov
              ? 'rgba(255,255,255,0.07)'
              : 'rgba(255,255,255,0.03)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          transition:     'background 0.12s, border-color 0.12s',
          flexShrink:     0,
        }}
      >
        {/* Workspace number */}
        <span style={{
          fontSize:   9,
          fontWeight: active ? 700 : 500,
          color:      active ? 'var(--cryo-accent)' : hov ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
          fontFamily: '"JetBrains Mono", monospace',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {ws.index + 1}
        </span>

        {/* Window count badge */}
        {ws.count > 0 && !active && (
          <div style={{
            position:   'absolute',
            top:        2,
            right:      2,
            width:      5,
            height:     5,
            borderRadius: '50%',
            background: hov ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.22)',
            transition: 'background 0.12s',
          }} />
        )}
        {ws.count > 0 && active && (
          <div style={{
            position:   'absolute',
            top:        2,
            right:      2,
            width:      5,
            height:     5,
            borderRadius: '50%',
            background: 'var(--cryo-accent)',
            opacity:    0.7,
          }} />
        )}
      </motion.button>
    </Tooltip>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function WorkspaceSwitcher() {
  const [current,    setCurrent]    = useState(0)   // 0-based
  const [workspaces, setWorkspaces] = useState<WorkspaceInfo[]>(
    Array.from({ length: NUM_WORKSPACES }, (_, i) => ({ index: i, count: 0 }))
  )
  const [available, setAvailable] = useState(false)

  // Sliding accent indicator position
  const prevCurrent = useRef(current)

  // Poll windows every 2s
  useEffect(() => {
    const wm = (window.cryogram as any).wm
    if (!wm?.getWindows) {
      setAvailable(false)
      return
    }
    setAvailable(true)

    const loadWindows = async () => {
      try {
        const wins: WmWindow[] = await wm.getWindows()
        setWorkspaces(buildWorkspaces(wins))
      } catch {}
    }

    loadWindows()
    const t = setInterval(loadWindows, 2000)
    return () => clearInterval(t)
  }, [])

  // Poll current workspace every 1s
  useEffect(() => {
    const wm = (window.cryogram as any).wm
    if (!wm?.getCurrentWorkspace) return

    const loadCurrent = async () => {
      try {
        const idx = await wm.getCurrentWorkspace()
        if (typeof idx === 'number') {
          prevCurrent.current = current
          setCurrent(idx)
        }
      } catch {}
    }

    loadCurrent()
    const t = setInterval(loadCurrent, 1000)
    return () => clearInterval(t)
  }, [current])

  const switchTo = async (idx: number) => {
    if (idx === current) return
    prevCurrent.current = current
    setCurrent(idx)
    try {
      const wm = (window.cryogram as any).wm
      await wm?.switchWorkspace?.(idx)
    } catch {}
  }

  // Render a minimal placeholder if wmctrl unavailable
  if (!available) {
    return (
      <div
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        3,
          padding:    '0 4px',
        }}
      >
        {Array.from({ length: NUM_WORKSPACES }, (_, i) => (
          <div
            key={i}
            style={{
              width:        i === 0 ? 20 : 6,
              height:       i === 0 ? 14 : 6,
              borderRadius: i === 0 ? 4 : '50%',
              background:   i === 0 ? 'var(--cryo-a18)' : 'rgba(255,255,255,0.1)',
              border:       i === 0 ? '1px solid var(--cryo-a35)' : '1px solid rgba(255,255,255,0.06)',
              transition:   'all 0.15s',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        3,
        padding:    '0 2px',
        position:   'relative',
      }}
    >
      {/* Sliding accent background */}
      <motion.div
        layoutId="ws-indicator"
        animate={{
          x: current * (26 + 3),  // dot width + gap
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }}
        style={{
          position:   'absolute',
          left:       0,
          top:        0,
          width:      26,
          height:     22,
          borderRadius: 7,
          background: 'var(--cryo-a18)',
          border:     '1px solid var(--cryo-a35)',
          pointerEvents: 'none',
          zIndex:     0,
        }}
      />

      {workspaces.map(ws => (
        <WorkspaceDot
          key={ws.index}
          ws={ws}
          active={ws.index === current}
          onClick={() => switchTo(ws.index)}
        />
      ))}
    </div>
  )
}
