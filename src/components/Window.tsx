import { useRef, useCallback, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { AppWindow as AppWindowType, useWindowStore } from '../store/windowStore'

const TerminalApp    = lazy(() => import('../apps/terminal/Terminal'))
const EditorApp      = lazy(() => import('../apps/editor/Editor'))
const PasswordTesterApp = lazy(() => import('../apps/password-tester/PasswordTester'))
const LeakerApp      = lazy(() => import('../apps/leaker/LeakerApp'))
const SettingsApp    = lazy(() => import('../apps/settings/SettingsApp'))
const FilesApp       = lazy(() => import('../apps/files/FilesApp'))
const LauncherApp    = lazy(() => import('../apps/launcher/LauncherApp'))
const SystemApp      = lazy(() => import('../apps/system/SystemApp'))

const APP_COLORS: Record<string, string> = {
  terminal:          '#00ff88',
  editor:            '#00d4ff',
  'password-tester': '#ffcc00',
  leaker:            '#ff4466',
  settings:          '#bb88ff',
  files:             '#f59e0b',
  launcher:          '#34d399',
  system:            '#818cf8',
}

function AppContent({ appId }: { appId: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="w-5 h-5 rounded-full border-2"
            style={{ borderColor: 'rgba(0,212,255,0.35)', borderTopColor: '#00d4ff' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      }
    >
      {appId === 'terminal'        && <TerminalApp />}
      {appId === 'editor'          && <EditorApp />}
      {appId === 'password-tester' && <PasswordTesterApp />}
      {appId === 'leaker'          && <LeakerApp />}
      {appId === 'settings'        && <SettingsApp />}
      {appId === 'files'           && <FilesApp />}
      {appId === 'launcher'        && <LauncherApp />}
      {appId === 'system'          && <SystemApp />}
    </Suspense>
  )
}

export function AppWindow({ window: win }: { window: AppWindowType }) {
  const { closeWindow, focusWindow, moveWindow, minimizeWindow, toggleMaximize } = useWindowStore()
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null)
  const accent = APP_COLORS[win.appId] ?? '#00d4ff'

  const onTitleBarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || win.maximized) return
      focusWindow(win.id)
      dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y }

      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return
        const dx = ev.clientX - dragRef.current.startX
        const dy = ev.clientY - dragRef.current.startY
        const newX = Math.max(-win.width + 120, Math.min(window.innerWidth - 120, dragRef.current.winX + dx))
        const newY = Math.max(0, Math.min(window.innerHeight - 40, dragRef.current.winY + dy))
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
    [win.id, win.x, win.y, win.maximized, focusWindow, moveWindow]
  )

  if (win.minimized) return null

  const radius = win.maximized ? 0 : 12

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
        borderRadius: radius,
        background: 'rgba(10,15,24,0.93)',
        backdropFilter: 'blur(24px)',
        border: win.maximized
          ? 'none'
          : win.focused
            ? `1px solid ${accent}44`
            : '1px solid rgba(26,40,64,0.7)',
        boxShadow: win.maximized
          ? 'none'
          : win.focused
            ? `0 0 0 1px ${accent}18, 0 24px 64px rgba(0,0,0,0.85)`
            : '0 8px 32px rgba(0,0,0,0.7)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{
        opacity: 1, scale: 1, y: 0,
        borderRadius: radius,
        left: win.x, top: win.y, width: win.width, height: win.height,
      }}
      exit={{ opacity: 0, scale: 0.92, y: 6 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Accent top line */}
      {!win.maximized && (
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background: win.focused
              ? `linear-gradient(90deg, transparent, ${accent}70, transparent)`
              : 'transparent',
            transition: 'background 0.25s',
          }}
        />
      )}

      {/* Title bar */}
      <div
        className="flex items-center h-10 px-3 shrink-0 select-none relative"
        style={{
          background: win.focused ? 'rgba(14,20,32,0.9)' : 'rgba(10,15,24,0.75)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          cursor: win.maximized ? 'default' : 'move',
        }}
        onMouseDown={onTitleBarMouseDown}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0" onMouseDown={e => e.stopPropagation()}>
          <TrafficLight color="#ff5f57" title="Close"    onClick={() => closeWindow(win.id)} />
          <TrafficLight color="#ffbd2e" title="Minimize" onClick={() => minimizeWindow(win.id)} />
          <TrafficLight
            color="#28c840"
            title={win.maximized ? 'Restore' : 'Maximize'}
            onClick={() => toggleMaximize(win.id)}
          />
        </div>

        {/* Centered title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-xs font-medium truncate max-w-[60%]"
            style={{
              color: win.focused ? 'rgba(255,255,255,0.48)' : 'rgba(255,255,255,0.22)',
              letterSpacing: '0.02em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            {win.title}
          </span>
        </div>

        {/* Right: accent dot */}
        <div className="ml-auto shrink-0">
          <div
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: accent,
              boxShadow: win.focused ? `0 0 6px ${accent}` : 'none',
              opacity: win.focused ? 1 : 0.22,
            }}
          />
        </div>
      </div>

      {/* App content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AppContent appId={win.appId} />
      </div>

      {/* Resize handle — bottom-right corner */}
      {!win.maximized && (
        <ResizeHandle winId={win.id} winWidth={win.width} winHeight={win.height} />
      )}
    </motion.div>
  )
}

function TrafficLight({ color, title, onClick }: { color: string; title: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      className="w-3 h-3 rounded-full"
      style={{ background: color, opacity: 0.85 }}
      whileHover={{ scale: 1.22, opacity: 1 }}
      whileTap={{ scale: 0.8 }}
    />
  )
}

function ResizeHandle({ winId, winWidth, winHeight }: { winId: string; winWidth: number; winHeight: number }) {
  const resizeWindow = useWindowStore(s => s.resizeWindow)
  const ref = useRef<{ sx: number; sy: number; w: number; h: number } | null>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    ref.current = { sx: e.clientX, sy: e.clientY, w: winWidth, h: winHeight }
    const onMove = (ev: MouseEvent) => {
      if (!ref.current) return
      resizeWindow(winId, Math.max(400, ref.current.w + ev.clientX - ref.current.sx), Math.max(300, ref.current.h + ev.clientY - ref.current.sy))
    }
    const onUp = () => { ref.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [winId, winWidth, winHeight, resizeWindow])

  return (
    <div
      className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
      onMouseDown={onMouseDown}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-1 right-1" style={{ opacity: 0.2 }}>
        <line x1="10" y1="2" x2="2" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="10" y1="6" x2="6" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}
