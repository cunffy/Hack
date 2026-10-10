import { useState, ReactNode } from 'react'

// Shared building blocks for the security tools: a file/folder picker button and
// a collapsible "how to use" instructions panel. Inline-styled so they drop into
// any app regardless of whether it uses Tailwind or inline styles.

const ACCENT = '#00d4ff'

// Standard location of the rockyou wordlist, extracted from the Debian
// `wordlists` package during the OS build. Preselected in dictionary attacks.
export const DEFAULT_WORDLIST = '/usr/share/wordlists/rockyou.txt'

/**
 * A "Browse…" button that opens the native file/folder picker and returns the
 * chosen path. Pair it next to a path <input> so users don't have to type paths.
 */
export function BrowseButton({
  onPick,
  mode = 'open',
  label = 'Browse…',
  title = 'Choose a file',
}: {
  onPick: (path: string) => void
  mode?: 'open' | 'folder'
  label?: string
  title?: string
}) {
  const [busy, setBusy] = useState(false)
  const browse = async () => {
    setBusy(true)
    try {
      const res = await (window as any).cryogram?.files?.openDialog?.(mode)
      const path = Array.isArray(res) ? res[0] : (typeof res === 'string' ? res : null)
      if (path) onPick(path)
    } catch {}
    setBusy(false)
  }
  return (
    <button
      type="button"
      onClick={browse}
      disabled={busy}
      title={title}
      style={{
        flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '0 12px', height: 34,
        background: 'rgba(0,212,255,0.1)',
        border: `1px solid ${ACCENT}44`,
        borderRadius: 6, color: ACCENT,
        fontSize: 12, fontWeight: 600, cursor: busy ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!busy) e.currentTarget.style.background = 'rgba(0,212,255,0.18)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)' }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" />
      </svg>
      {label}
    </button>
  )
}

/** A path <input> with a Browse button already attached. */
export function FilePathInput({
  value, onChange, placeholder, mode = 'open', inputClassName,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  mode?: 'open' | 'folder'
  inputClassName?: string
}) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
      <input
        className={inputClassName}
        style={inputClassName ? { flex: 1 } : {
          flex: 1, height: 34, padding: '0 10px',
          background: 'rgba(8,12,18,0.6)', border: '1px solid rgba(26,40,64,0.6)',
          borderRadius: 6, color: '#c9d1d9', fontSize: 13, outline: 'none',
        }}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <BrowseButton onPick={onChange} mode={mode} />
    </div>
  )
}

/**
 * Collapsible instructions panel. Use at the top of a tool to explain what it
 * does and what each field is for. Remembers open/closed per `storageKey`.
 */
export function HelpBox({
  title = 'How to use this tool',
  children,
  defaultOpen = true,
  storageKey,
}: {
  title?: string
  children: ReactNode
  defaultOpen?: boolean
  storageKey?: string
}) {
  const initial = (() => {
    if (!storageKey) return defaultOpen
    try {
      const v = localStorage.getItem(`cryo-help-${storageKey}`)
      return v === null ? defaultOpen : v === '1'
    } catch { return defaultOpen }
  })()
  const [open, setOpen] = useState(initial)
  const toggle = () => {
    const next = !open
    setOpen(next)
    if (storageKey) { try { localStorage.setItem(`cryo-help-${storageKey}`, next ? '1' : '0') } catch {} }
  }
  return (
    <div style={{
      background: 'rgba(0,212,255,0.05)',
      border: `1px solid ${ACCENT}26`,
      borderRadius: 8, overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={toggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer',
          color: ACCENT, fontSize: 12, fontWeight: 700, textAlign: 'left',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span style={{ flex: 1 }}>{title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', opacity: 0.7 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{
          padding: '2px 14px 12px 14px',
          color: 'rgba(255,255,255,0.72)', fontSize: 12, lineHeight: 1.6,
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

/** A single labelled "what this field is for" row, for use inside <HelpBox>. */
export function FieldHelp({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: 4 }}>
      <span style={{ color: ACCENT, fontWeight: 600 }}>{name}</span>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}> — </span>
      <span>{children}</span>
    </div>
  )
}
