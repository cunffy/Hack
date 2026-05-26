import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppId } from './windowStore'

export const DEFAULT_DOCK: AppId[] = [
  'terminal', 'editor', 'mail', 'password-tester', 'leaker',
  'files', 'passwords', 'scanner', 'firewall', 'vpn',
  'task-manager', 'netmon', 'logs', 'launcher', 'settings', 'system',
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
      merge: (persisted: any, current) => {
        const stored: AppId[] = persisted?.order ?? current.order
        const merged = [...stored]
        for (const id of DEFAULT_DOCK) {
          if (!merged.includes(id)) merged.push(id)
        }
        return { ...current, order: merged }
      },
    },
  ),
)
