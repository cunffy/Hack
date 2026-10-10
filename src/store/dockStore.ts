import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppId } from './windowStore'

export const DEFAULT_DOCK: AppId[] = [
  'launcher', 'brave', 'settings', 'files', 'ai-assistant', 'terminal',
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
      version: 4,
      // v4: add Brave to dock; one-time merge of Brave into existing order.
      migrate: (state: any, _fromVersion: number) => {
        const order: AppId[] = state?.order ?? DEFAULT_DOCK
        return { order: order.includes('brave') ? order : ['launcher', 'brave', ...order.filter((id: AppId) => id !== 'launcher')] }
      },
      merge: (persisted: any, current) => {
        const stored: AppId[] = persisted?.order ?? current.order
        const merged = [...stored]
        // Ensure core apps are always present, but never reset user customizations
        for (const id of DEFAULT_DOCK) {
          if (!merged.includes(id)) merged.push(id)
        }
        return { ...current, order: merged }
      },
    },
  ),
)
