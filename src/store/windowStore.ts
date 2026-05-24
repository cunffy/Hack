import { create } from 'zustand'

export type AppId = 'terminal' | 'editor' | 'password-tester' | 'leaker' | 'settings' | 'files' | 'launcher' | 'system'

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
  launcher:         { title: 'App Launcher',        width: 760, height: 560 },
  system:           { title: 'System',              width: 680, height: 520 },
}

let instanceCounter = 0

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZ: 10,

  openApp(appId) {
    // For launcher, only allow one instance
    if (appId === 'launcher') {
      const existing = get().windows.find(w => w.appId === 'launcher')
      if (existing) { get().focusWindow(existing.id); return }
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
    // Content area: full width, full height minus menubar (28px) and dock clearance (88px)
    const W = typeof window !== 'undefined' ? window.innerWidth : 1440
    const H = typeof window !== 'undefined' ? window.innerHeight - 28 : 872
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
