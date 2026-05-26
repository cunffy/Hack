import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PinnedApp {
  id: string
  name: string
  exec: string
  icon: string
  category: string
  desktopFile: string
}

interface PinnedStore {
  taskbar: PinnedApp[]
  desktop: PinnedApp[]
  pinToTaskbar:  (app: PinnedApp) => void
  unpinTaskbar:  (id: string) => void
  pinToDesktop:  (app: PinnedApp) => void
  unpinDesktop:  (id: string) => void
}

export const usePinnedStore = create<PinnedStore>()(
  persist(
    (set) => ({
      taskbar: [],
      desktop: [],

      pinToTaskbar: (app) => set(s => ({
        taskbar: s.taskbar.find(a => a.id === app.id) ? s.taskbar : [...s.taskbar, app],
      })),
      unpinTaskbar: (id) => set(s => ({ taskbar: s.taskbar.filter(a => a.id !== id) })),

      pinToDesktop: (app) => set(s => ({
        desktop: s.desktop.find(a => a.id === app.id) ? s.desktop : [...s.desktop, app],
      })),
      unpinDesktop: (id) => set(s => ({ desktop: s.desktop.filter(a => a.id !== id) })),
    }),
    { name: 'cryogram-pinned-apps' },
  ),
)
