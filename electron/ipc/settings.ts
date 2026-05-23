import { ipcMain } from 'electron'
import Store from 'electron-store'

const store = new Store({
  encryptionKey: 'cyberden-v1-key',
  defaults: {
    hibpApiKey: '',
    dehashedEmail: '',
    dehashedApiKey: '',
    workspace: '',
    ptDisclaimerAccepted: null as string | null,
    theme: 'dark',
  },
})

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:get', (_, key: string) => store.get(key))
  ipcMain.handle('settings:set', (_, key: string, value: unknown) => {
    store.set(key, value)
  })
  ipcMain.handle('settings:getAll', () => store.store)
}

export { store }
