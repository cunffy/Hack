import { useRef, useCallback, lazy, Suspense } from 'react'
import { AppWindow as AppWindowType, useWindowStore } from '../store/windowStore'

const TerminalApp = lazy(() => import('../apps/terminal/Terminal'))
const EditorApp = lazy(() => import('../apps/editor/Editor'))
const PasswordTesterApp = lazy(() => import('../apps/password-tester/PasswordTester'))
const LeakerApp = lazy(() => import('../apps/leaker/LeakerApp'))
const SettingsApp = lazy(() => import('../apps/settings/SettingsApp'))

function AppContent({ appId }: { appId: string }) {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-den-muted">Loading...</div>}>
      {appId === 'terminal' && <TerminalApp />}
      {appId === 'editor' && <EditorApp />}
      {appId === 'password-tester' && <PasswordTesterApp />}
      {appId === 'leaker' && <LeakerApp />}
      {appId === 'settings' && <SettingsApp />}
    </Suspense>
  )
}

export function AppWindow({ window: win }: { window: AppWindowType }) {
  const { closeWindow, focusWindow, moveWindow } = useWindowStore()
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null)

  const onTitleBarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      focusWindow(win.id)
      dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y }

      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return
        const dx = ev.clientX - dragRef.current.startX
        const dy = ev.clientY - dragRef.current.startY
        moveWindow(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy)
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
    <div
      className="absolute flex flex-col rounded-lg border border-den-border overflow-hidden shadow-2xl pointer-events-auto"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        background: '#0f1520',
        boxShadow: win.focused
          ? '0 0 0 1px rgba(0,212,255,0.3), 0 20px 60px rgba(0,0,0,0.8)'
          : '0 8px 32px rgba(0,0,0,0.6)',
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between h-8 px-3 bg-den-surface border-b border-den-border shrink-0 cursor-default"
        onMouseDown={onTitleBarMouseDown}
      >
        <span className="text-xs text-den-muted font-medium tracking-wide select-none">
          {win.title}
        </span>
        <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => useWindowStore.getState().minimizeWindow(win.id)}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-den-border text-den-muted hover:text-den-yellow transition-colors"
          >
            <svg width="8" height="2" viewBox="0 0 8 2" fill="currentColor"><rect width="8" height="2" rx="1"/></svg>
          </button>
          <button
            onClick={() => closeWindow(win.id)}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-den-red text-den-muted hover:text-white transition-colors"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" stroke="currentColor" strokeWidth="1.5">
              <line x1="1" y1="1" x2="7" y2="7"/>
              <line x1="7" y1="1" x2="1" y2="7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* App content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AppContent appId={win.appId} />
      </div>
    </div>
  )
}
