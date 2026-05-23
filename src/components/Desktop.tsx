import { AppId, useWindowStore } from '../store/windowStore'

interface AppIcon {
  id: AppId
  label: string
  description: string
  icon: string
  color: string
}

const APPS: AppIcon[] = [
  {
    id: 'terminal',
    label: 'Terminal',
    description: 'System shell',
    icon: '>_',
    color: '#00ff88',
  },
  {
    id: 'editor',
    label: 'Code Editor',
    description: 'JS · Py · C · C++ · Rust · Go',
    icon: '</>',
    color: '#00d4ff',
  },
  {
    id: 'password-tester',
    label: 'Password Tester',
    description: 'Brute · Dict · Hybrid · Rainbow · Spray',
    icon: '🔑',
    color: '#ffcc00',
  },
  {
    id: 'shodan',
    label: 'Shodan',
    description: 'Internet intelligence',
    icon: '👁',
    color: '#bb88ff',
  },
  {
    id: 'leaker',
    label: 'Leaker',
    description: 'Breach & credential monitor',
    icon: '💧',
    color: '#ff4466',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'API keys & preferences',
    icon: '⚙',
    color: '#6e7681',
  },
]

export function Desktop() {
  const openApp = useWindowStore((s) => s.openApp)

  return (
    <div className="absolute inset-0 p-8 flex flex-col gap-6 pointer-events-none">
      {/* Grid of app icons */}
      <div className="pointer-events-auto flex flex-wrap gap-4">
        {APPS.map((app) => (
          <button
            key={app.id}
            onDoubleClick={() => openApp(app.id)}
            onClick={(e) => {
              if (e.detail === 2) return
            }}
            className="group flex flex-col items-center gap-2 p-3 w-24 rounded-lg border border-transparent hover:border-den-border hover:bg-den-surface/50 transition-all cursor-default"
            title={`Double-click to open ${app.label}`}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border border-den-border bg-den-surface transition-all group-hover:scale-105"
              style={{ boxShadow: `0 0 16px ${app.color}22` }}
            >
              {app.icon}
            </div>
            <span className="text-xs text-den-text font-medium text-center leading-tight">
              {app.label}
            </span>
          </button>
        ))}
      </div>

      {/* Status bar info */}
      <div className="absolute bottom-2 left-8 flex items-center gap-4 text-den-muted text-xs pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-den-green inline-block" />
          CyberDen Online
        </span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  )
}
