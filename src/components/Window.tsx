import { useRef, useCallback, lazy, Suspense, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AppWindow as AppWindowType, useWindowStore } from '../store/windowStore'
import { AppCrashBoundary } from './AppCrashBoundary'

const TerminalApp        = lazy(() => import('../apps/terminal/Terminal'))
const EditorApp          = lazy(() => import('../apps/editor/Editor'))
const PasswordTesterApp  = lazy(() => import('../apps/password-tester/PasswordTester'))
const LeakerApp          = lazy(() => import('../apps/leaker/LeakerApp'))
const SettingsApp        = lazy(() => import('../apps/settings/SettingsApp'))
const FilesApp           = lazy(() => import('../apps/files/FilesApp'))
const LauncherApp        = lazy(() => import('../apps/launcher/LauncherApp'))
const OpticSEOApp        = lazy(() => import('../apps/opticseo/OpticSEOApp'))
const PhoneApp           = lazy(() => import('../apps/phone/PhoneApp'))
const NetworkScannerApp  = lazy(() => import('../apps/network-scanner/NetworkScannerApp'))
const VPNApp             = lazy(() => import('../apps/vpn/VPNApp'))
const NotesApp           = lazy(() => import('../apps/notes/NotesApp'))
const MailApp            = lazy(() => import('../apps/mail/MailApp'))
const PasswordManagerApp = lazy(() => import('../apps/password-manager/PasswordManagerApp'))
const SSHKeyManagerApp   = lazy(() => import('../apps/ssh-keys/SSHKeyManagerApp'))
const FirewallApp        = lazy(() => import('../apps/firewall/FirewallApp'))
const TaskManagerApp     = lazy(() => import('../apps/task-manager/TaskManagerApp'))
const LogViewerApp       = lazy(() => import('../apps/logs/LogViewerApp'))
const NetworkMonitorApp  = lazy(() => import('../apps/netmon/NetworkMonitorApp'))
const ScreenshotApp      = lazy(() => import('../apps/screenshot/ScreenshotApp'))
const CalculatorApp      = lazy(() => import('../apps/calculator/CalculatorApp'))
const CryptoToolsApp     = lazy(() => import('../apps/crypto-tools/CryptoToolsApp'))
const APITesterApp       = lazy(() => import('../apps/api-tester/APITesterApp'))
const CertInspectorApp   = lazy(() => import('../apps/cert-inspector/CertInspectorApp'))
const DockerApp          = lazy(() => import('../apps/docker/DockerApp'))
const GitApp             = lazy(() => import('../apps/git/GitApp'))
const DatabaseApp        = lazy(() => import('../apps/database/DatabaseApp'))
const MarkdownEditorApp  = lazy(() => import('../apps/markdown/MarkdownEditorApp'))
const TrashApp           = lazy(() => import('../apps/trash/TrashApp'))
const ShodanApp          = lazy(() => import('../apps/shodan/ShodanApp'))
const OSINTApp           = lazy(() => import('../apps/osint/OSINTApp'))
const CVEApp             = lazy(() => import('../apps/cve/CVEApp'))
const AIAssistantApp     = lazy(() => import('../apps/ai-assistant/AIAssistantApp'))
const WordlistsApp       = lazy(() => import('../apps/wordlists/WordlistsApp'))
const JSONExplorerApp    = lazy(() => import('../apps/json-explorer/JSONExplorerApp'))
const TOTPApp            = lazy(() => import('../apps/totp/TOTPApp'))
const RegexApp           = lazy(() => import('../apps/regex/RegexApp'))
const EncodingChainApp   = lazy(() => import('../apps/encoding-chain/EncodingChainApp'))
const PacketSnifferApp   = lazy(() => import('../apps/packet-sniffer/PacketSnifferApp'))
const BackupApp          = lazy(() => import('../apps/backup/BackupApp'))
const PasswordHealthApp  = lazy(() => import('../apps/password-health/PasswordHealthApp'))
const PomodoroApp        = lazy(() => import('../apps/pomodoro/PomodoroApp'))
const AuditLogApp        = lazy(() => import('../apps/audit-log/AuditLogApp'))
const CodeScannerApp     = lazy(() => import('../apps/code-scanner/CodeScannerApp'))
const WallpaperApp        = lazy(() => import('../apps/wallpaper/WallpaperApp'))
const ClipboardHistoryApp = lazy(() => import('../apps/clipboard-history/ClipboardHistoryApp'))
const ColorPickerApp      = lazy(() => import('../apps/color-picker/ColorPickerApp'))
const UnitConverterApp    = lazy(() => import('../apps/unit-converter/UnitConverterApp'))
const WorldClockApp       = lazy(() => import('../apps/world-clock/WorldClockApp'))
const ImageViewerApp      = lazy(() => import('../apps/image-viewer/ImageViewerApp'))
const RSSReaderApp        = lazy(() => import('../apps/rss-reader/RSSReaderApp'))

const APP_COLORS: Record<string, string> = {
  terminal:          '#00ff88',
  editor:            '#00d4ff',
  'password-tester': '#ffcc00',
  leaker:            '#ff4466',
  settings:          '#bb88ff',
  files:             '#f59e0b',
  launcher:          '#34d399',
  system:            '#818cf8',
  opticseo:          '#10b981',
  phone:             '#a855f7',
  scanner:           '#00ff88',
  vpn:               '#a78bfa',
  notes:             '#fbbf24',
  mail:              '#ea4335',
  passwords:         '#ffcc00',
  'ssh-keys':        '#00d4ff',
  firewall:          '#ff4466',
  'task-manager':    '#818cf8',
  logs:              '#a855f7',
  netmon:            '#00d4ff',
  screenshot:        '#34d399',
  calculator:        '#facc15',
  'crypto-tools':    '#00d4ff',
  'api-tester':      '#fb923c',
  'cert-inspector':  '#4ade80',
  docker:            '#2496ed',
  git:               '#f05033',
  database:          '#a855f7',
  markdown:          '#818cf8',
  trash:             '#94a3b8',
  shodan:            '#ef4444',
  osint:             '#fb923c',
  cve:               '#f97316',
  'ai-assistant':    '#a78bfa',
  wordlists:         '#4ade80',
  'json-explorer':   '#fbbf24',
  totp:              '#00d4ff',
  regex:             '#818cf8',
  'encoding-chain':  '#34d399',
  'packet-sniffer':  '#22c55e',
  backup:            '#4ade80',
  'password-health': '#f472b6',
  pomodoro:          '#ef4444',
  'audit-log':       '#94a3b8',
  'code-scanner':    '#ff4466',
  wallpaper:           '#818cf8',
  'clipboard-history': '#a78bfa',
  'color-picker':      '#f472b6',
  'unit-converter':    '#22d3ee',
  'world-clock':       '#60a5fa',
  'image-viewer':      '#34d399',
  'rss-reader':        '#fb923c',
}

function AppContent({ appId }: { appId: string }) {
  return (
    <AppCrashBoundary appId={appId}>
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="w-5 h-5 rounded-full border-2"
            style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: 'var(--cryo-accent)' }}
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
      {(appId === 'settings' || appId === 'system') && <SettingsApp />}
      {appId === 'files'           && <FilesApp />}
      {appId === 'launcher'        && <LauncherApp />}
      {appId === 'opticseo'        && <OpticSEOApp />}
      {appId === 'phone'           && <PhoneApp />}
      {appId === 'scanner'         && <NetworkScannerApp />}
      {appId === 'vpn'             && <VPNApp />}
      {appId === 'notes'           && <NotesApp />}
      {appId === 'mail'            && <MailApp />}
      {appId === 'passwords'       && <PasswordManagerApp />}
      {appId === 'ssh-keys'        && <SSHKeyManagerApp />}
      {appId === 'firewall'        && <FirewallApp />}
      {appId === 'task-manager'    && <TaskManagerApp />}
      {appId === 'logs'            && <LogViewerApp />}
      {appId === 'netmon'          && <NetworkMonitorApp />}
      {appId === 'screenshot'      && <ScreenshotApp />}
      {appId === 'calculator'      && <CalculatorApp />}
      {appId === 'crypto-tools'    && <CryptoToolsApp />}
      {appId === 'api-tester'      && <APITesterApp />}
      {appId === 'cert-inspector'  && <CertInspectorApp />}
      {appId === 'docker'          && <DockerApp />}
      {appId === 'git'             && <GitApp />}
      {appId === 'database'        && <DatabaseApp />}
      {appId === 'markdown'        && <MarkdownEditorApp />}
      {appId === 'trash'           && <TrashApp />}
      {appId === 'shodan'          && <ShodanApp />}
      {appId === 'osint'           && <OSINTApp />}
      {appId === 'cve'             && <CVEApp />}
      {appId === 'ai-assistant'    && <AIAssistantApp />}
      {appId === 'wordlists'       && <WordlistsApp />}
      {appId === 'json-explorer'   && <JSONExplorerApp />}
      {appId === 'totp'            && <TOTPApp />}
      {appId === 'regex'           && <RegexApp />}
      {appId === 'encoding-chain'  && <EncodingChainApp />}
      {appId === 'packet-sniffer'  && <PacketSnifferApp />}
      {appId === 'backup'          && <BackupApp />}
      {appId === 'password-health' && <PasswordHealthApp />}
      {appId === 'pomodoro'        && <PomodoroApp />}
      {appId === 'audit-log'       && <AuditLogApp />}
      {appId === 'code-scanner'    && <CodeScannerApp />}
      {appId === 'wallpaper'           && <WallpaperApp />}
      {appId === 'clipboard-history'   && <ClipboardHistoryApp />}
      {appId === 'color-picker'        && <ColorPickerApp />}
      {appId === 'unit-converter'      && <UnitConverterApp />}
      {appId === 'world-clock'         && <WorldClockApp />}
      {appId === 'image-viewer'        && <ImageViewerApp />}
      {appId === 'rss-reader'          && <RSSReaderApp />}
    </Suspense>
    </AppCrashBoundary>
  )
}

type SnapZone = 'left' | 'right' | 'top' | null

// Snap preview overlay rendered into document.body via portal
function SnapPreview({ zone }: { zone: SnapZone }) {
  if (!zone) return null

  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 99998,
    pointerEvents: 'none',
    background: 'var(--cryo-accent, #00d4ff)',
    opacity: 0.08,
    border: '1px solid var(--cryo-accent, #00d4ff)',
    borderRadius: 8,
    top: zone === 'top' ? 0 : 36,
    ...(zone === 'left'  && { left: 0,                        width: '50vw', bottom: 72 }),
    ...(zone === 'right' && { left: '50vw',                   width: '50vw', bottom: 72 }),
    ...(zone === 'top'   && { left: 0, right: 0, top: 0, bottom: 0, borderRadius: 0 }),
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={zone}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        style={style}
      />
    </AnimatePresence>,
    document.body
  )
}

export function AppWindow({ window: win }: { window: AppWindowType }) {
  const { closeWindow, focusWindow, moveWindow, minimizeWindow, toggleMaximize, resizeWindow } = useWindowStore()
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null)
  const snapZoneRef = useRef<SnapZone>(null)
  const [titleHovered, setTitleHovered] = useState(false)
  const [snapOverlay, setSnapOverlay] = useState<SnapZone>(null)
  const accent = APP_COLORS[win.appId] ?? 'var(--cryo-accent)'

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

        // Snap zone detection
        let zone: SnapZone = null
        if (ev.clientX < 80) zone = 'left'
        else if (ev.clientX > window.innerWidth - 80) zone = 'right'
        else if (ev.clientY < 10) zone = 'top'

        if (zone !== snapZoneRef.current) {
          snapZoneRef.current = zone
          setSnapOverlay(zone)
        }
      }

      const onUp = () => {
        const zone = snapZoneRef.current
        if (zone === 'left') {
          moveWindow(win.id, 0, 36)
          resizeWindow(win.id, window.innerWidth / 2, window.innerHeight - 36 - 72)
        } else if (zone === 'right') {
          moveWindow(win.id, window.innerWidth / 2, 36)
          resizeWindow(win.id, window.innerWidth / 2, window.innerHeight - 36 - 72)
        } else if (zone === 'top') {
          toggleMaximize(win.id)
        }
        snapZoneRef.current = null
        setSnapOverlay(null)
        dragRef.current = null
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [win.id, win.x, win.y, win.maximized, focusWindow, moveWindow, resizeWindow, toggleMaximize]
  )

  const radius = win.maximized ? 0 : 12

  // Keep minimized windows in the tree so we can animate them away smoothly.
  // pointerEvents prevents interaction while invisible.
  const minimizeAnim = win.minimized
    ? { opacity: 0, scale: 0.55, y: 140, filter: 'blur(8px)' }
    : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }

  return (
    <>
      {/* Snap preview overlay — only shown while dragging near an edge */}
      <SnapPreview zone={snapOverlay} />

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
          background: 'rgba(10,14,22,0.94)',
          backdropFilter: 'blur(32px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
          border: win.maximized
            ? 'none'
            : win.focused
            ? `1px solid ${accent}50`
            : '1px solid rgba(255,255,255,0.07)',
          boxShadow: win.maximized
            ? 'none'
            : win.focused
            ? `0 0 0 1px ${accent}14, 0 28px 72px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.5)`
            : '0 8px 40px rgba(0,0,0,0.7)',
          pointerEvents: win.minimized ? 'none' : undefined,
          transition: 'border-color 0.15s, box-shadow 0.2s',
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(4px)' }}
        animate={{
          ...minimizeAnim,
          borderRadius: radius,
          left: win.x,
          top: win.y,
          width: win.width,
          height: win.height,
        }}
        exit={{ opacity: 0, scale: 0.86, y: -12, filter: 'blur(6px)' }}
        transition={
          win.minimized
            ? { type: 'spring', stiffness: 340, damping: 26 }
            : { type: 'spring', stiffness: 420, damping: 24 }
        }
        onMouseDown={() => focusWindow(win.id)}
      >
        {/* Accent top glow line */}
        {!win.maximized && (
          <div
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            style={{
              background: win.focused
                ? `linear-gradient(90deg, transparent 5%, ${accent}80 40%, ${accent}80 60%, transparent 95%)`
                : 'transparent',
              transition: 'background 0.3s',
            }}
          />
        )}

        {/* Title bar */}
        <div
          className="flex items-center h-10 px-3 shrink-0 select-none relative"
          style={{
            background: win.focused
              ? 'rgba(16,22,34,0.92)'
              : 'rgba(11,16,26,0.8)',
            borderBottom: '1px solid rgba(255,255,255,0.055)',
            cursor: win.maximized ? 'default' : 'move',
          }}
          onMouseDown={onTitleBarMouseDown}
          onDoubleClick={() => toggleMaximize(win.id)}
          onMouseEnter={() => setTitleHovered(true)}
          onMouseLeave={() => setTitleHovered(false)}
        >
          {/* Traffic lights */}
          <div
            className="flex items-center gap-1.5 shrink-0 z-10"
            onMouseDown={e => e.stopPropagation()}
          >
            <TrafficLight
              color="#ff5f57"
              hoverColor="#ff3b30"
              symbol="✕"
              shown={titleHovered}
              title="Close"
              onClick={() => closeWindow(win.id)}
            />
            <TrafficLight
              color="#ffbd2e"
              hoverColor="#ff9500"
              symbol="–"
              shown={titleHovered}
              title="Minimize"
              onClick={() => minimizeWindow(win.id)}
            />
            <TrafficLight
              color="#28c840"
              hoverColor="#34c759"
              symbol={win.maximized ? '⤡' : '⤢'}
              shown={titleHovered}
              title={win.maximized ? 'Restore' : 'Maximize'}
              onClick={() => toggleMaximize(win.id)}
            />
          </div>

          {/* Centered title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-xs font-medium truncate max-w-[55%]"
              style={{
                color: win.focused ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.22)',
                letterSpacing: '0.02em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              {win.title}
            </span>
          </div>

          {/* Right accent dot */}
          <div className="ml-auto shrink-0 z-10">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                background: accent,
                boxShadow: win.focused ? `0 0 8px ${accent}` : 'none',
                opacity: win.focused ? 1 : 0.2,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        {/* App content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AppContent appId={win.appId} />
        </div>

        {/* Resize handle */}
        {!win.maximized && (
          <ResizeHandle winId={win.id} winWidth={win.width} winHeight={win.height} />
        )}
      </motion.div>
    </>
  )
}

function TrafficLight({
  color, hoverColor, symbol, shown, title, onClick,
}: {
  color: string
  hoverColor: string
  symbol: string
  shown: boolean
  title: string
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <motion.button
      onClick={onClick}
      title={title}
      className="w-3 h-3 rounded-full flex items-center justify-center"
      style={{ background: hov ? hoverColor : color }}
      animate={{ scale: hov ? 1.15 : 1 }}
      transition={{ type: 'spring', stiffness: 600, damping: 24 }}
      whileTap={{ scale: 0.78 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <motion.span
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.12 }}
        style={{
          fontSize: 7,
          lineHeight: 1,
          color: 'rgba(0,0,0,0.75)',
          fontWeight: 700,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {symbol}
      </motion.span>
    </motion.button>
  )
}

function ResizeHandle({
  winId,
  winWidth,
  winHeight,
}: {
  winId: string
  winWidth: number
  winHeight: number
}) {
  const resizeWindow = useWindowStore(s => s.resizeWindow)
  const ref = useRef<{ sx: number; sy: number; w: number; h: number } | null>(null)

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      ref.current = { sx: e.clientX, sy: e.clientY, w: winWidth, h: winHeight }
      const onMove = (ev: MouseEvent) => {
        if (!ref.current) return
        resizeWindow(
          winId,
          Math.max(400, ref.current.w + ev.clientX - ref.current.sx),
          Math.max(300, ref.current.h + ev.clientY - ref.current.sy)
        )
      }
      const onUp = () => {
        ref.current = null
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [winId, winWidth, winHeight, resizeWindow]
  )

  return (
    <div
      className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
      onMouseDown={onMouseDown}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        className="absolute bottom-1 right-1"
        style={{ opacity: 0.18 }}
      >
        <line x1="10" y1="2" x2="2" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="10" y1="6" x2="6" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}
