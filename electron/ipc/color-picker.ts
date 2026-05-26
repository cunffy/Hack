import { ipcMain } from 'electron'
import { getSettingsStore } from './settings'

interface ColorPalette {
  id: string
  name: string
  colors: string[]
  createdAt: number
}

export function registerColorPickerHandlers() {
  const store = getSettingsStore()

  function getPalettes(): ColorPalette[] {
    return (store.get('color_palettes') as ColorPalette[] | undefined) ?? []
  }

  ipcMain.handle('colorPicker:getPalettes', () => getPalettes())

  ipcMain.handle('colorPicker:savePalette', (_, palette: Omit<ColorPalette, 'id' | 'createdAt'>) => {
    const palettes = getPalettes()
    const newPalette: ColorPalette = { ...palette, id: `pal-${Date.now()}`, createdAt: Date.now() }
    store.set('color_palettes', [...palettes, newPalette])
    return newPalette
  })

  ipcMain.handle('colorPicker:updatePalette', (_, id: string, patch: Partial<ColorPalette>) => {
    const updated = getPalettes().map(p => p.id === id ? { ...p, ...patch } : p)
    store.set('color_palettes', updated)
    return updated
  })

  ipcMain.handle('colorPicker:deletePalette', (_, id: string) => {
    const updated = getPalettes().filter(p => p.id !== id)
    store.set('color_palettes', updated)
    return updated
  })
}
