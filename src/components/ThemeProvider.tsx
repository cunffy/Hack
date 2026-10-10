import { useEffect } from 'react'
import { useThemeStore } from '../store/themeStore'

function hexAlpha(hex: string, pct: number): string {
  const h = Math.round(pct * 255).toString(16).padStart(2, '0')
  return hex + h
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { accent, accent2, bg, loadFromSettings } = useThemeStore()

  useEffect(() => { loadFromSettings() }, [])

  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--cryo-accent',  accent)
    r.setProperty('--cryo-accent2', accent2)
    r.setProperty('--cryo-bg',      bg)
    // Pre-computed alpha variants used in inline styles
    r.setProperty('--cryo-a05', hexAlpha(accent, 0.05))
    r.setProperty('--cryo-a08', hexAlpha(accent, 0.08))
    r.setProperty('--cryo-a10', hexAlpha(accent, 0.10))
    r.setProperty('--cryo-a12', hexAlpha(accent, 0.12))
    r.setProperty('--cryo-a18', hexAlpha(accent, 0.18))
    r.setProperty('--cryo-a20', hexAlpha(accent, 0.20))
    r.setProperty('--cryo-a25', hexAlpha(accent, 0.25))
    r.setProperty('--cryo-a30', hexAlpha(accent, 0.30))
    r.setProperty('--cryo-a35', hexAlpha(accent, 0.35))
    r.setProperty('--cryo-a40', hexAlpha(accent, 0.40))
    r.setProperty('--cryo-a45', hexAlpha(accent, 0.45))
    r.setProperty('--cryo-a50', hexAlpha(accent, 0.50))
  }, [accent, accent2, bg])

  return <>{children}</>
}
