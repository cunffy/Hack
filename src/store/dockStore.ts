import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppId } from './windowStore'

export const DEFAULT_DOCK: AppId[] = [
  'terminal', 'editor', 'mail', 'password-tester', 'leaker',
  'files', 'passwords', 'scanner', 'firewall', 'vpn',
  'task-manager', 'netmon', 'logs', 'launcher', 'settings',
  'calculator', 'crypto-tools', 'api-tester', 'cert-inspector',
  'docker', 'git', 'database', 'markdown', 'trash',
  'shodan', 'osint', 'cve', 'ai-assistant', 'wordlists',
  'json-explorer', 'totp', 'regex', 'encoding-chain', 'packet-sniffer',
  'backup', 'password-health', 'pomodoro', 'audit-log', 'code-scanner', 'wallpaper',
  'clipboard-history', 'color-picker', 'unit-converter', 'world-clock', 'image-viewer', 'rss-reader',
  'remote-desktop',
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
