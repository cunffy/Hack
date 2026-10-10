import { ThemeProvider } from './ThemeProvider'
import { AppContent } from './Window'

const APP_TITLES: Record<string, string> = {
  terminal: 'Terminal', editor: 'Code Editor', 'password-tester': 'Password Tester',
  leaker: 'Leaker — Breach Monitor', settings: 'Settings', system: 'Settings',
  files: 'Files', launcher: 'App Launcher', opticseo: 'OpticSEO Pro', phone: 'Phone',
  scanner: 'Network Scanner', vpn: 'VPN Manager', notes: 'Notes', mail: 'Gmail',
  passwords: 'Password Manager', 'ssh-keys': 'SSH Key Manager', firewall: 'Firewall',
  'task-manager': 'Task Manager', logs: 'Log Viewer', netmon: 'Network Monitor',
  screenshot: 'Screenshot', calculator: 'Calculator', 'crypto-tools': 'Crypto Tools',
  'api-tester': 'API Tester', 'cert-inspector': 'Cert Inspector', docker: 'Docker',
  git: 'Git Client', database: 'SQLite Browser', markdown: 'Markdown Editor',
  trash: 'Trash', shodan: 'Shodan Explorer', osint: 'OSINT Dashboard',
  cve: 'CVE Database', 'ai-assistant': 'AI Assistant', wordlists: 'Wordlist Manager',
  'json-explorer': 'JSON / YAML Explorer', totp: '2FA / TOTP Manager',
  regex: 'Regex Tester', 'encoding-chain': 'Encoding Chain',
  'packet-sniffer': 'Packet Sniffer', backup: 'System Backup',
  'password-health': 'Password Health', pomodoro: 'Pomodoro Timer',
  'audit-log': 'Audit Log', 'code-scanner': 'Code Scanner', wallpaper: 'Wallpaper',
  'clipboard-history': 'Clipboard History', 'color-picker': 'Color Picker',
  'unit-converter': 'Unit Converter', 'world-clock': 'World Clock',
  'image-viewer': 'Image Viewer', 'rss-reader': 'RSS Reader',
  'remote-desktop': 'Remote Desktop',
}

function Titlebar({ appId }: { appId: string }) {
  const ctrl = (action: 'close' | 'minimize' | 'maximize') =>
    (window as any).cryogram?.shell?.winCtrl?.(action)

  return (
    <div
      className="flex items-center h-9 px-3 flex-shrink-0 select-none"
      style={{
        WebkitAppRegion: 'drag',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      } as React.CSSProperties}
    >
      <span className="text-white/70 text-[13px] font-medium flex-1 truncate">
        {APP_TITLES[appId] || appId}
      </span>
      <div
        className="flex gap-2 items-center"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={() => ctrl('minimize')}
          className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-300 transition-colors"
          title="Minimize"
        />
        <button
          onClick={() => ctrl('maximize')}
          className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors"
          title="Maximize"
        />
        <button
          onClick={() => ctrl('close')}
          className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors"
          title="Close"
        />
      </div>
    </div>
  )
}

export function StandaloneApp({ appId }: { appId: string }) {
  return (
    <ThemeProvider>
      <div
        className="h-screen w-screen flex flex-col overflow-hidden"
        style={{ background: 'var(--cryo-bg, #070b11)' }}
      >
        <Titlebar appId={appId} />
        <div className="flex-1 overflow-hidden">
          <AppContent appId={appId} />
        </div>
      </div>
    </ThemeProvider>
  )
}
