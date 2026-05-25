import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppId } from './windowStore'

export const DEFAULT_DOCK: AppId[] = [
  'terminal', 'editor', 'password-tester', 'leaker',
  'files', 'launcher', 'settings', 'system',
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
    { name: 'cryogram-dock-order' },
  ),
)
