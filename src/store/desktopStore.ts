import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppId } from './windowStore'

export interface DesktopIcon {
  id: string
  appId: AppId
  x: number
  y: number
}

interface DesktopStore {
  icons: DesktopIcon[]
  wallpaper: string   // file:// path or '' for default animated bg
  addIcon: (appId: AppId) => void
  removeIcon: (id: string) => void
  moveIcon: (id: string, x: number, y: number) => void
  setWallpaper: (path: string) => void
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set) => ({
      icons: [],
      wallpaper: '',

      addIcon: (appId) => set(s => {
        if (s.icons.find(i => i.appId === appId)) return s
        const col = s.icons.length % 4
        const row = Math.floor(s.icons.length / 4)
        return {
          icons: [...s.icons, {
            id: `di-${appId}-${Date.now()}`,
            appId,
            x: 24 + col * 104,
            y: 36 + row * 110,
          }],
        }
      }),

      removeIcon: (id) => set(s => ({ icons: s.icons.filter(i => i.id !== id) })),

      moveIcon: (id, x, y) =>
        set(s => ({ icons: s.icons.map(i => i.id === id ? { ...i, x, y } : i) })),

      setWallpaper: (path) => set({ wallpaper: path }),
    }),
    { name: 'cryogram-desktop' },
  ),
)
