import { useState, useEffect } from 'react'
import { useWindowStore } from '../store/windowStore'

export function Taskbar() {
  const { windows, focusWindow, restoreWindow, minimizeWindow, openApp } = useWindowStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const visible = windows.filter((w) => !w.minimized)
  const minimized = windows.filter((w) => w.minimized)

  return (
    <div className="flex items-center justify-between h-10 px-3 bg-den-surface border-t border-den-border shrink-0">
      {/* App launcher button */}
      <button
        onClick={() => {}}
        className="flex items-center gap-1.5 px-3 h-7 rounded border border-den-border hover:border-den-accent text-den-accent text-xs font-bold tracking-widest transition-colors"
      >
        CYBERDEN
      </button>

      {/* Open windows */}
      <div className="flex items-center gap-1 flex-1 px-3 overflow-hidden">
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => {
              if (win.minimized) restoreWindow(win.id)
              else if (win.focused) minimizeWindow(win.id)
              else focusWindow(win.id)
            }}
            className={`flex items-center gap-1.5 px-2.5 h-7 rounded text-xs transition-all shrink-0 border ${
              win.focused && !win.minimized
                ? 'border-den-accent text-den-accent bg-den-accent/10'
                : win.minimized
                ? 'border-den-border text-den-muted opacity-50'
                : 'border-den-border text-den-text hover:border-den-border/80'
            }`}
          >
            <span className="max-w-28 truncate">{win.title}</span>
          </button>
        ))}
      </div>

      {/* Clock */}
      <div className="text-den-muted text-xs font-mono shrink-0">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
