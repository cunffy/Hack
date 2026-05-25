import { create } from 'zustand'

export interface ThemePreset {
  id: string
  name: string
  accent: string
  accent2: string
  bg: string
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'cyber',   name: 'Cyber',   accent: '#00d4ff', accent2: '#00ff88', bg: '#070b11' },
  { id: 'phantom', name: 'Phantom', accent: '#a855f7', accent2: '#ec4899', bg: '#09070f' },
  { id: 'emerald', name: 'Emerald', accent: '#10b981', accent2: '#06b6d4', bg: '#060d0a' },
  { id: 'fire',    name: 'Fire',    accent: '#f97316', accent2: '#ef4444', bg: '#0e0805' },
  { id: 'slate',   name: 'Slate',   accent: '#94a3b8', accent2: '#e2e8f0', bg: '#0a0c10' },
]

interface ThemeStore {
  preset: string
  accent: string
  accent2: string
  bg: string
  setPreset(id: string): void
  setCustomAccent(accent: string): void
  loadFromSettings(): Promise<void>
}

const DEFAULT = THEME_PRESETS[0]

export const useThemeStore = create<ThemeStore>((set) => ({
  preset:  DEFAULT.id,
  accent:  DEFAULT.accent,
  accent2: DEFAULT.accent2,
  bg:      DEFAULT.bg,

  setPreset(id) {
    const p = THEME_PRESETS.find(t => t.id === id) ?? DEFAULT
    set({ preset: p.id, accent: p.accent, accent2: p.accent2, bg: p.bg })
    const api = (window as any).cryogram
    api?.settings?.set('theme.preset',  p.id)
    api?.settings?.set('theme.accent',  p.accent)
    api?.settings?.set('theme.accent2', p.accent2)
    api?.settings?.set('theme.bg',      p.bg)
  },

  setCustomAccent(accent) {
    set({ preset: 'custom', accent })
    const api = (window as any).cryogram
    api?.settings?.set('theme.preset', 'custom')
    api?.settings?.set('theme.accent', accent)
  },

  async loadFromSettings() {
    try {
      const api = (window as any).cryogram
      if (!api?.settings) return
      const all = await api.settings.getAll()
      const id      = all['theme.preset']  as string | undefined
      const accent  = all['theme.accent']  as string | undefined
      const accent2 = all['theme.accent2'] as string | undefined
      const bg      = all['theme.bg']      as string | undefined

      if (id && id !== 'custom') {
        const p = THEME_PRESETS.find(t => t.id === id)
        if (p) { set({ preset: p.id, accent: p.accent, accent2: p.accent2, bg: p.bg }); return }
      }
      if (accent) {
        set({
          preset:  id ?? 'custom',
          accent,
          accent2: accent2 ?? DEFAULT.accent2,
          bg:      bg      ?? DEFAULT.bg,
        })
      }
    } catch {}
  },
}))
