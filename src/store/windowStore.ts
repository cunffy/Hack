import { create } from 'zustand'

export type AppId = 'terminal' | 'editor' | 'password-tester' | 'leaker' | 'settings' | 'files' | 'launcher' | 'system' | 'opticseo' | 'phone' | 'scanner' | 'vpn' | 'notes' | 'mail' | 'passwords' | 'ssh-keys' | 'firewall' | 'task-manager' | 'logs' | 'netmon' | 'screenshot'

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
  settings:         { title: 'Settings',            width: 600, height: 480 },
  files:            { title: 'Files',               width: 860, height: 580 },
  launcher:         { title: 'App Launcher',        width: 760,  height: 560 },
  system:           { title: 'System',              width: 680,  height: 520 },
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
}

let instanceCounter = 0

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZ: 10,

  openApp(appId) {
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
