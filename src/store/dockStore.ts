import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppId } from './windowStore'

export const DEFAULT_DOCK: AppId[] = [
  'launcher', 'settings', 'files', 'ai-assistant', 'terminal',
]

interface DockStore {
  order: AppId[]
  setOrder: (order: AppId[]) => void
  addApp: (id: AppId) => void
  removeApp: (id: AppId) => void
}

export const useDockStore = create<DockStore>()(
  persist(
    (set) => ({
      order: DEFAULT_DOCK,
      setOrder: (order) => set({ order }),
      addApp:   (id) => set(s => ({ order: s.order.includes(id) ? s.order : [...s.order, id] })),
      removeApp:(id) => set(s => ({ order: s.order.filter(a => a !== id) })),
    }),
    {
      name: 'cryogram-dock-order',
      version: 2,
      migrate: (_state: any, _fromVersion: number) => ({ order: DEFAULT_DOCK }),
      merge: (persisted: any, current) => {
        const stored: AppId[] = persisted?.order ?? current.order
        // Reset to defaults if stored dock has more apps than expected (stale large list)
        if (stored.length > DEFAULT_DOCK.length + 4) return { ...current, order: DEFAULT_DOCK }
        const merged = [...stored]
        for (const id of DEFAULT_DOCK) {
          if (!merged.includes(id)) merged.push(id)
        }
        return { ...current, order: merged }
      },
    },
  ),
)
