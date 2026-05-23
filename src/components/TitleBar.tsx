export function TitleBar() {
  return (
    <div
      className="flex items-center justify-between h-9 px-4 bg-den-surface border-b border-den-border select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <span className="text-den-accent font-bold text-sm tracking-widest glow-cyan">
          CYBERDEN
        </span>
        <span className="text-den-muted text-xs">| Security Operations Platform</span>
      </div>

      <div
        className="flex items-center gap-1"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={() => window.cyberden.window.minimize()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-den-border text-den-muted hover:text-den-text transition-colors"
          title="Minimize"
        >
          <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
            <rect width="10" height="2" rx="1"/>
          </svg>
        </button>
        <button
          onClick={() => window.cyberden.window.maximize()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-den-border text-den-muted hover:text-den-text transition-colors"
          title="Maximize"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="8" height="8" rx="1"/>
          </svg>
        </button>
        <button
          onClick={() => window.cyberden.window.close()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-den-red text-den-muted hover:text-white transition-colors"
          title="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5">
            <line x1="1" y1="1" x2="9" y2="9"/>
            <line x1="9" y1="1" x2="1" y2="9"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
