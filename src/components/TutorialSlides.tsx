import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Slide data ─────────────────────────────────────────────────────────────────

interface AppCard { icon: string; color: string; name: string; desc: string }
interface ShortcutRow { keys: string[]; desc: string }

interface Slide {
  id: string
  title: string
  subtitle: string
  accent: string
  content: React.ReactNode
}

function AppGrid({ apps }: { apps: AppCard[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {apps.map(a => (
        <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a.color}18`, border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>{a.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{a.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ShortcutList({ rows }: { rows: ShortcutRow[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{r.desc}</span>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {r.keys.map((k, ki) => (
              <kbd key={ki} style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: '"JetBrains Mono",monospace', color: 'rgba(255,255,255,0.75)' }}>{k}</kbd>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Tip({ text, accent }: { text: string; accent: string }) {
  return (
    <div style={{ padding: '10px 14px', background: `${accent}10`, border: `1px solid ${accent}28`, borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
      <span style={{ color: accent, fontWeight: 700, marginRight: 6 }}>Tip</span>{text}
    </div>
  )
}

const SLIDES: Slide[] = [
  // ── 1. Welcome ────────────────────────────────────────────────────────────
  {
    id: 'welcome',
    title: 'Welcome to CryoGram OS',
    subtitle: 'A purpose-built security operations desktop',
    accent: '#00d4ff',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
          CryoGram OS is a full-featured desktop environment designed for cybersecurity professionals.
          It runs as an Electron app on Linux and Windows, giving you a unified workspace for
          penetration testing, breach monitoring, development, and system management.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { icon: '🛡️', color: '#00d4ff', label: '25+ Built-in Apps' },
            { icon: '⚡', color: '#4ade80', label: 'Real PTY Terminal' },
            { icon: '🔒', color: '#facc15', label: 'Encrypted Vault' },
            { icon: '🌿', color: '#f05033', label: 'Git Client' },
            { icon: '🐳', color: '#2496ed', label: 'Docker Manager' },
            { icon: '🗄️', color: '#a855f7', label: 'SQLite Browser' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', padding: '14px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{item.label}</div>
            </div>
          ))}
        </div>
        <Tip text="Use this guide anytime from Settings → Guide to refresh your memory." accent="#00d4ff" />
      </div>
    ),
  },

  // ── 2. Navigation ─────────────────────────────────────────────────────────
  {
    id: 'navigation',
    title: 'Getting Around',
    subtitle: 'Titlebar, Dock, workspaces, and Mission Control',
    accent: '#bb88ff',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '📌', color: '#bb88ff', title: 'Titlebar', desc: 'Left: CryoGram menu. Centre: workspace switcher + clock. Right: notifications, quick settings gear, and your user avatar for weather, news & power controls.' },
            { icon: '⬡', color: '#00d4ff', title: 'Dock', desc: 'Hover to magnify icons. Click to open or focus an app. Right-click for context menu. Drag to reorder. New apps appear automatically.' },
            { icon: '🪟', color: '#4ade80', title: 'Windows', desc: 'Drag to any edge to snap (left/right half, or full-screen). Double-click titlebar to maximise. Middle-click or ✕ to close.' },
            { icon: '🔭', color: '#facc15', title: 'Mission Control', desc: 'Press Super+M (or ⊞+M) to see all open windows as tiles. Click any tile to jump to it.' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── 3. Security Tools ────────────────────────────────────────────────────
  {
    id: 'security',
    title: 'Security Tools',
    subtitle: 'Built-in offensive & defensive security suite',
    accent: '#ff4466',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, fontSize: 11, color: '#f87171', lineHeight: 1.5 }}>
          <strong>Authorization Required</strong> — All network testing tools display a legal disclaimer that must be accepted before use. Only test systems you own or have written permission to test.
        </div>
        <AppGrid apps={[
          { icon: '🔑', color: '#ffcc00', name: 'Password Tester', desc: 'Hash cracking (brute, dict, hybrid) + SSH/HTTP/FTP spraying' },
          { icon: '💧', color: '#ff4466', name: 'Leaker Monitor', desc: 'HIBP + Dehashed breach monitoring for emails & domains' },
          { icon: '🔍', color: '#00ff88', name: 'Network Scanner', desc: 'Nmap-powered port scanner with service detection' },
          { icon: '🔥', color: '#ff4466', name: 'Firewall', desc: 'UFW rule manager — add, remove, enable/disable rules' },
          { icon: '🌐', color: '#a78bfa', name: 'VPN Manager', desc: 'OpenVPN & WireGuard connection profiles' },
          { icon: '🔒', color: '#4ade80', name: 'Cert Inspector', desc: 'Inspect TLS certificates by hostname or pasted PEM' },
        ]} />
      </div>
    ),
  },

  // ── 4. Developer Tools ───────────────────────────────────────────────────
  {
    id: 'developer',
    title: 'Developer Tools',
    subtitle: 'Terminal, editor, Git, Docker, and more',
    accent: '#4ade80',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AppGrid apps={[
          { icon: '⬛', color: '#00ff88', name: 'Terminal', desc: 'Real PTY — runs bash, python, nmap, anything in your PATH' },
          { icon: '💻', color: '#00d4ff', name: 'Code Editor', desc: 'Monaco editor with file tree, syntax highlighting & run buttons' },
          { icon: '🌿', color: '#f05033', name: 'Git Client', desc: 'Stage, diff, commit, push/pull — visual branch + log view' },
          { icon: '🐳', color: '#2496ed', name: 'Docker', desc: 'Container & image management, live stats, log viewer, pull' },
          { icon: '🗄️', color: '#a855f7', name: 'SQLite Browser', desc: 'Read-only table browser + SQL query editor with pagination' },
          { icon: '🌐', color: '#fb923c', name: 'API Tester', desc: 'Postman-style HTTP client with saved collections' },
        ]} />
        <Tip text="The Terminal has full PTY access — run nmap, hashcat, sqlmap, or any installed tool directly." accent="#4ade80" />
      </div>
    ),
  },

  // ── 5. Productivity & Utilities ──────────────────────────────────────────
  {
    id: 'productivity',
    title: 'Productivity & Utilities',
    subtitle: 'Notes, calculator, files, markdown, and more',
    accent: '#facc15',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AppGrid apps={[
          { icon: '📝', color: '#fbbf24', name: 'Notes', desc: 'Quick notes with search — always available from the dock' },
          { icon: '🧮', color: '#facc15', name: 'Calculator', desc: 'Basic + scientific modes, keyboard support, calculation history' },
          { icon: '🔐', color: '#00d4ff', name: 'Crypto Tools', desc: 'Hash (MD5/SHA), encode/decode, JWT decoder, password entropy' },
          { icon: '📄', color: '#818cf8', name: 'Markdown Editor', desc: 'Split-pane editor with live preview and format toolbar' },
          { icon: '📁', color: '#f59e0b', name: 'Files', desc: 'Full file manager with copy, move, rename, and external open' },
          { icon: '🗑️', color: '#94a3b8', name: 'Trash', desc: 'Linux trash bin — restore files or permanently delete' },
        ]} />
        <AppGrid apps={[
          { icon: '📸', color: '#34d399', name: 'Screenshot', desc: 'Capture screen, copy to clipboard or save to file' },
          { icon: '📧', color: '#ea4335', name: 'Gmail', desc: 'Embedded Gmail web client in a native window' },
          { icon: '🔑', color: '#ffcc00', name: 'Passwords', desc: 'Encrypted local password vault with generator' },
          { icon: '🔐', color: '#00d4ff', name: 'SSH Keys', desc: 'Generate, manage, and copy SSH key pairs' },
        ]} />
      </div>
    ),
  },

  // ── 6. System & Monitoring ───────────────────────────────────────────────
  {
    id: 'system',
    title: 'System & Monitoring',
    subtitle: 'Task manager, logs, network, phone, and SEO',
    accent: '#818cf8',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AppGrid apps={[
          { icon: '⚙️', color: '#bb88ff', name: 'Settings', desc: '10 tabs: appearance, profile, network, Bluetooth, sound, display, security, API keys, updates, about' },
          { icon: '📊', color: '#818cf8', name: 'Task Manager', desc: 'Live CPU/memory per process, kill signal support' },
          { icon: '📋', color: '#a855f7', name: 'Log Viewer', desc: 'journalctl browser — filter by unit, priority, time range' },
          { icon: '📡', color: '#00d4ff', name: 'Network Monitor', desc: 'Interface stats, live bandwidth graph, active connections' },
          { icon: '📱', color: '#a855f7', name: 'Phone', desc: 'ADB device manager + scrcpy screen mirror over USB or Wi-Fi' },
          { icon: '📈', color: '#10b981', name: 'OpticSEO Pro', desc: 'SEO analysis, keyword tracking, competitor research' },
        ]} />
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { icon: '🌡️', label: 'Weather', desc: 'Live weather in User Panel' },
            { icon: '📰', label: 'News', desc: 'Hacker News feed in User Panel' },
            { icon: '🔔', label: 'Notifications', desc: 'History via bell icon' },
          ].map(i => (
            <div key={i.label} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{i.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>{i.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{i.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── 7. Keyboard Shortcuts ─────────────────────────────────────────────────
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    subtitle: 'Every shortcut at a glance',
    accent: '#00d4ff',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>System</div>
            <ShortcutList rows={[
              { keys: ['Ctrl', 'Space'], desc: 'Spotlight search' },
              { keys: ['Super', 'L'], desc: 'Lock screen' },
              { keys: ['Super', 'M'], desc: 'Mission Control' },
              { keys: ['Ctrl', '/'], desc: 'Keyboard shortcuts' },
              { keys: ['Ctrl', '⇧', 'V'], desc: 'Clipboard history' },
            ]} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#bb88ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Windows</div>
            <ShortcutList rows={[
              { keys: ['Alt', 'Tab'], desc: 'Switch app' },
              { keys: ['Ctrl', 'Alt', 'T'], desc: 'Open Terminal' },
              { keys: ['Super', 'D'], desc: 'Show desktop' },
              { keys: ['Super', '1–4'], desc: 'Switch workspace' },
            ]} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Snapping</div>
            <ShortcutList rows={[
              { keys: ['Drag → left'], desc: 'Snap left half' },
              { keys: ['Drag → right'], desc: 'Snap right half' },
              { keys: ['Drag → top'], desc: 'Maximise' },
            ]} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>In-App</div>
            <ShortcutList rows={[
              { keys: ['Ctrl', 'S'], desc: 'Save (Markdown)' },
              { keys: ['⌘', '↵'], desc: 'Run SQL query' },
              { keys: ['Esc'], desc: 'Close overlay' },
            ]} />
          </div>
        </div>
        <Tip text="Press Ctrl+/ anytime to show this shortcuts reference as a floating overlay." accent="#00d4ff" />
      </div>
    ),
  },
]

// ── Navigation dots ────────────────────────────────────────────────────────────

function NavDots({ total, current, accent, onGo }: { total: number; current: number; accent: string; onGo: (i: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onGo(i)} style={{
          padding: 0, border: 'none', cursor: 'pointer',
          width: i === current ? 20 : 7, height: 7, borderRadius: 99,
          background: i === current ? accent : 'rgba(255,255,255,0.2)',
          transition: 'all 0.25s ease',
        }} />
      ))}
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────

interface TutorialSlidesProps {
  /** When true, rendered full-height for embedding in Settings panel */
  inline?: boolean
  /** Optional callback when all slides are done (used in SetupWizard) */
  onDone?: () => void
  doneLabel?: string
}

export function TutorialSlides({ inline, onDone, doneLabel = 'Finish' }: TutorialSlidesProps) {
  const [page, setPage]   = useState(0)
  const [prev, setPrev]   = useState(0)
  const slide             = SLIDES[page]
  const direction         = page >= prev ? 1 : -1
  const isLast            = page === SLIDES.length - 1

  const goTo = (next: number) => {
    setPrev(page)
    setPage(Math.max(0, Math.min(SLIDES.length - 1, next)))
  }

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: inline ? '100%' : 'auto', minHeight: 0 }}>
      {/* Slide content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: inline ? '20px 24px 16px' : '0 0 16px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            {/* Slide header */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${slide.accent}14`, border: `1px solid ${slide.accent}28`, borderRadius: 20, padding: '3px 10px', marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: slide.accent }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: slide.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {page + 1} / {SLIDES.length}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>{slide.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{slide.subtitle}</div>
            </div>
            {/* Slide body */}
            {slide.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div style={{ flexShrink: 0, padding: inline ? '12px 24px 16px' : '12px 0 0', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: inline ? 'rgba(8,12,20,0.6)' : 'transparent' }}>
        <button
          onClick={() => goTo(page - 1)}
          disabled={page === 0}
          style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, background: page === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: page === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.65)', cursor: page === 0 ? 'default' : 'pointer' }}
        >
          ← Previous
        </button>

        <NavDots total={SLIDES.length} current={page} accent={slide.accent} onGo={goTo} />

        {isLast && onDone ? (
          <button
            onClick={onDone}
            style={{ padding: '7px 18px', fontSize: 12, fontWeight: 700, background: 'var(--cryo-accent)', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            {doneLabel}
          </button>
        ) : (
          <button
            onClick={() => goTo(page + 1)}
            disabled={isLast && !onDone}
            style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 8, color: isLast ? 'rgba(255,255,255,0.25)' : 'var(--cryo-accent)', cursor: isLast ? 'default' : 'pointer' }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
