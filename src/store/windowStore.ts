import { create } from 'zustand'

export type AppId = 'terminal' | 'editor' | 'password-tester' | 'leaker' | 'settings' | 'files' | 'launcher' | 'system' | 'opticseo' | 'phone' | 'scanner' | 'vpn' | 'notes' | 'mail' | 'passwords' | 'ssh-keys' | 'firewall' | 'task-manager' | 'logs' | 'netmon' | 'screenshot' | 'calculator' | 'crypto-tools' | 'api-tester' | 'cert-inspector' | 'docker' | 'git' | 'database' | 'markdown' | 'trash' | 'shodan' | 'osint' | 'cve' | 'ai-assistant' | 'wordlists' | 'json-explorer' | 'totp' | 'regex' | 'encoding-chain' | 'packet-sniffer' | 'backup' | 'password-health' | 'pomodoro' | 'audit-log' | 'code-scanner' | 'wallpaper' | 'clipboard-history' | 'color-picker' | 'unit-converter' | 'world-clock' | 'image-viewer' | 'rss-reader' | 'remote-desktop' | 'brave'

export interface AppWindow {
  id: string
  appId: AppId
  title: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  focused: boolean
  zIndex: number
  prevBounds?: { x: number; y: number; width: number; height: number }
}

interface WindowStore {
  windows: AppWindow[]
  nextZ: number
  openApp(appId: AppId): void
  closeWindow(id: string): void
  focusWindow(id: string): void
  moveWindow(id: string, x: number, y: number): void
  resizeWindow(id: string, width: number, height: number): void
  minimizeWindow(id: string): void
  restoreWindow(id: string): void
  toggleMaximize(id: string): void
}

const APP_META: Record<AppId, { title: string; width: number; height: number }> = {
  terminal:         { title: 'Terminal',            width: 800, height: 500 },
  editor:           { title: 'Code Editor',         width: 900, height: 600 },
  'password-tester':{ title: 'Password Tester',     width: 820, height: 620 },
  leaker:           { title: 'Leaker — Breach Monitor', width: 860, height: 560 },
  settings:         { title: 'Settings',            width: 760, height: 560 },
  files:            { title: 'Files',               width: 860, height: 580 },
  launcher:         { title: 'App Launcher',        width: 760,  height: 560 },
  system:           { title: 'Settings',            width: 760,  height: 560 },
  opticseo:         { title: 'OpticSEO Pro',        width: 1280, height: 820 },
  phone:            { title: 'Phone',               width: 780,  height: 600 },
  scanner:          { title: 'Network Scanner',     width: 900,  height: 620 },
  vpn:              { title: 'VPN Manager',         width: 720,  height: 560 },
  notes:            { title: 'Notes',               width: 820,  height: 580 },
  mail:             { title: 'Gmail',               width: 1100, height: 780 },
  passwords:        { title: 'Password Manager',    width: 860,  height: 600 },
  'ssh-keys':       { title: 'SSH Key Manager',     width: 820,  height: 600 },
  firewall:         { title: 'Firewall',            width: 780,  height: 580 },
  'task-manager':   { title: 'Task Manager',        width: 900,  height: 600 },
  logs:             { title: 'Log Viewer',          width: 960,  height: 640 },
  netmon:           { title: 'Network Monitor',     width: 900,  height: 600 },
  screenshot:       { title: 'Screenshot',          width: 900,  height: 640 },
  calculator:       { title: 'Calculator',          width: 560,  height: 520 },
  'crypto-tools':   { title: 'Crypto Tools',        width: 720,  height: 580 },
  'api-tester':     { title: 'API Tester',          width: 1100, height: 720 },
  'cert-inspector': { title: 'Cert Inspector',      width: 780,  height: 580 },
  docker:           { title: 'Docker',              width: 960,  height: 640 },
  git:              { title: 'Git Client',          width: 980,  height: 640 },
  database:         { title: 'SQLite Browser',      width: 960,  height: 640 },
  markdown:         { title: 'Markdown Editor',     width: 1000, height: 680 },
  trash:            { title: 'Trash',               width: 820,  height: 560 },
  shodan:           { title: 'Shodan Explorer',      width: 1100, height: 720 },
  osint:            { title: 'OSINT Dashboard',      width: 1060, height: 700 },
  cve:              { title: 'CVE Database',         width: 1060, height: 700 },
  'ai-assistant':   { title: 'AI Assistant',         width: 820,  height: 640 },
  wordlists:        { title: 'Wordlist Manager',     width: 900,  height: 600 },
  'json-explorer':  { title: 'JSON / YAML Explorer', width: 1060, height: 680 },
  totp:             { title: '2FA / TOTP Manager',   width: 760,  height: 540 },
  regex:            { title: 'Regex Tester',         width: 900,  height: 640 },
  'encoding-chain': { title: 'Encoding Chain',       width: 980,  height: 640 },
  'packet-sniffer': { title: 'Packet Sniffer',       width: 1100, height: 680 },
  backup:           { title: 'System Backup',        width: 820,  height: 580 },
  'password-health':{ title: 'Password Health',      width: 760,  height: 580 },
  pomodoro:         { title: 'Pomodoro Timer',       width: 560,  height: 700 },
  'audit-log':      { title: 'Audit Log',            width: 980,  height: 640 },
  'code-scanner':   { title: 'Code Scanner',         width: 1060, height: 700 },
  wallpaper:           { title: 'Wallpaper',           width: 820,  height: 580 },
  'clipboard-history': { title: 'Clipboard History',   width: 720,  height: 580 },
  'color-picker':      { title: 'Color Picker',        width: 680,  height: 560 },
  'unit-converter':    { title: 'Unit Converter',      width: 680,  height: 520 },
  'world-clock':       { title: 'World Clock',         width: 780,  height: 520 },
  'image-viewer':      { title: 'Image Viewer',        width: 960,  height: 700 },
  'rss-reader':        { title: 'RSS Reader',          width: 1000, height: 680 },
  'remote-desktop':    { title: 'Remote Desktop',      width: 860,  height: 600 },
  brave:               { title: 'Brave Browser',       width: 0,    height: 0 },
}

let instanceCounter = 0

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZ: 10,

  openApp(appId) {
    // External apps — launch via OS rather than opening an internal window.
    if (appId === 'brave') {
      try {
        const api = (window as any).cryogram
        api?.launcher?.launch({ exec: 'brave-browser', name: 'Brave', icon: '', comment: '', categories: ['Network'], category: 'Other', desktopFile: '/usr/share/applications/brave-browser.desktop', terminal: false })
      } catch {}
      return
    }

    // Restore/focus existing window — never open a second instance of the same app.
    // This matches macOS/Windows behaviour: clicking the dock/taskbar icon brings
    // the window back rather than spawning a duplicate.
    const existing = get().windows.find(w => w.appId === appId)
    if (existing) {
      get().restoreWindow(existing.id)
      return
    }

    const meta = APP_META[appId]
    const id = `${appId}-${++instanceCounter}`
    const offset = (get().windows.length % 8) * 24
    const z = get().nextZ

    set((s) => ({
      nextZ: s.nextZ + 1,
      windows: [
        ...s.windows.map((w) => ({ ...w, focused: false })),
        {
          id,
          appId,
          title: meta.title,
          x: 60 + offset,
          y: 60 + offset,
          width: meta.width,
          height: meta.height,
          minimized: false,
          maximized: false,
          focused: true,
          zIndex: z,
        },
      ],
    }))
  },

  closeWindow(id) {
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) }))
  },

  focusWindow(id) {
    const z = get().nextZ
    set((s) => ({
      nextZ: s.nextZ + 1,
      windows: s.windows.map((w) => ({
        ...w,
        focused: w.id === id,
        minimized: w.id === id ? false : w.minimized,
        zIndex: w.id === id ? z : w.zIndex,
      })),
    }))
  },

  moveWindow(id, x, y) {
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)) }))
  },

  resizeWindow(id, width, height) {
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, width, height } : w)) }))
  },

  minimizeWindow(id) {
    set((s) => ({
      windows: s.windows.map((w) => w.id === id ? { ...w, minimized: true, focused: false } : w),
    }))
  },

  restoreWindow(id) {
    const z = get().nextZ
    set((s) => ({
      nextZ: s.nextZ + 1,
      windows: s.windows.map((w) => w.id === id ? { ...w, minimized: false, focused: true, zIndex: z } : w),
    }))
  },

  toggleMaximize(id) {
    const z = get().nextZ
    // Content area: full width, height minus TitleBar (28px) and Dock clearance (88px)
    const W = typeof window !== 'undefined' ? window.innerWidth : 1440
    const H = typeof window !== 'undefined' ? window.innerHeight - 28 - 88 : 784
    set((s) => ({
      nextZ: s.nextZ + 1,
      windows: s.windows.map((w) => {
        if (w.id !== id) return w
        if (w.maximized) {
          return { ...w, maximized: false, zIndex: z, ...(w.prevBounds ?? {}) }
        }
        return {
          ...w,
          maximized: true,
          zIndex: z,
          prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: W,
          height: H,
        }
      }),
    }))
  },
}))
