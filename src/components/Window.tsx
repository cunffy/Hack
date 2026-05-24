import { useRef, useCallback, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { AppWindow as AppWindowType, useWindowStore } from '../store/windowStore'

const TerminalApp = lazy(() => import('../apps/terminal/Terminal'))
const EditorApp = lazy(() => import('../apps/editor/Editor'))
const PasswordTesterApp = lazy(() => import('../apps/password-tester/PasswordTester'))
const LeakerApp = lazy(() => import('../apps/leaker/LeakerApp'))
const SettingsApp = lazy(() => import('../apps/settings/SettingsApp'))
const FilesApp = lazy(() => import('../apps/files/FilesApp'))
const LauncherApp = lazy(() => import('../apps/launcher/LauncherApp'))
const SystemApp = lazy(() => import('../apps/system/SystemApp'))

const APP_COLORS: Record<string, string> = {
  terminal: '#00ff88',
  editor: '#00d4ff',
  'password-tester': '#ffcc00',
  leaker: '#ff4466',
  settings: '#bb88ff',
  files: '#f59e0b',
  launcher: '#34d399',
  system: '#818cf8',
}

function AppContent({ appId }: { appId: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-cryo-muted text-xs">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              ⟳
            </motion.span>
            Loading…
          </div>
        </div>
      }
    >
      {appId === 'terminal' && <TerminalApp />}
      {appId === 'editor' && <EditorApp />}
      {appId === 'password-tester' && <PasswordTesterApp />}
      {appId === 'leaker' && <LeakerApp />}
      {appId === 'settings' && <SettingsApp />}
      {appId === 'files' && <FilesApp />}
      {appId === 'launcher' && <LauncherApp />}
      {appId === 'system' && <SystemApp />}
    </Suspense>
  )
}

export function AppWindow({ window: win }: { window: AppWindowType }) {
  const { closeWindow, focusWindow, moveWindow } = useWindowStore()
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null)
  const accent = APP_COLORS[win.appId] ?? '#00d4ff'

  const onTitleBarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      focusWindow(win.id)
      dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y }

      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return
        const dx = ev.clientX - dragRef.current.startX
        const dy = ev.clientY - dragRef.current.startY
        const TITLE_H = 36
        const newX = Math.max(-win.width + 80, Math.min(window.innerWidth - 80, dragRef.current.winX + dx))
        const newY = Math.max(0, Math.min(window.innerHeight - TITLE_H, dragRef.current.winY + dy))
        moveWindow(win.id, newX, newY)
      }
      const onUp = () => {
        dragRef.current = null
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [win.id, win.x, win.y, focusWindow, moveWindow]
  )

  if (win.minimized) return null

  return (
    <motion.div
      key={win.id}
      className="absolute flex flex-col overflow-hidden pointer-events-auto"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        borderRadius: 12,
        background: 'rgba(10,15,24,0.92)',
        backdropFilter: 'blur(24px)',
        border: win.focused
          ? `1px solid ${accent}44`
          : '1px solid rgba(26,40,64,0.7)',
        boxShadow: win.focused
          ? `0 0 0 1px ${accent}22, 0 24px 64px rgba(0,0,0,0.85), 0 0 40px ${accent}0a`
          : '0 8px 32px rgba(0,0,0,0.7)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Accent top border */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-xl"
        style={{
          background: win.focused
            ? `linear-gradient(90deg, transparent, ${accent}88, transparent)`
            : 'transparent',
          transition: 'background 0.3s',
        }}
      />

      {/* Title bar */}
      <div
        className="flex items-center justify-between h-9 px-3 shrink-0 cursor-default select-none"
        style={{
          background: 'rgba(13,20,33,0.7)',
          borderBottom: '1px solid rgba(26,40,64,0.6)',
        }}
        onMouseDown={onTitleBarMouseDown}
      >
        {/* Traffic lights */}
        <div
          className="flex items-center gap-1.5"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <TrafficBtn
            color="#ff5f57"
            hoverTitle="Close"
            onClick={() => closeWindow(win.id)}
          />
          <TrafficBtn
            color="#ffbd2e"
            hoverTitle="Minimize"
            onClick={() => useWindowStore.getState().minimizeWindow(win.id)}
          />
          <TrafficBtn
            color="#28c840"
            hoverTitle="Expand"
            onClick={() => {}}
          />
        </div>

        {/* Title */}
        <span className="text-cryo-muted text-xs tracking-wide absolute left-1/2 -translate-x-1/2">
          {win.title}
        </span>

        {/* Accent dot */}
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
            opacity: win.focused ? 1 : 0.3,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AppContent appId={win.appId} />
      </div>
    </motion.div>
  )
}

function TrafficBtn({
  color,
  hoverTitle,
  onClick,
}: {
  color: string
  hoverTitle: string
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      title={hoverTitle}
      className="w-3 h-3 rounded-full flex items-center justify-center"
      style={{ background: color, opacity: 0.85 }}
      whileHover={{ scale: 1.2, opacity: 1 }}
      whileTap={{ scale: 0.85 }}
    />
  )
}
