import { ipcMain, app } from 'electron'
import Store from 'electron-store'
import { createHash } from 'crypto'

// Derive a machine-specific key from the app's userData path so the store
// is tied to this installation and not trivially readable if the file is copied.
const encryptionKey = createHash('sha256')
  .update(`cryogram-v1:${app.getPath('userData')}`)
  .digest('hex')

const store = new Store({
  encryptionKey,
  defaults: {
    hibpApiKey: '',
    dehashedEmail: '',
    dehashedApiKey: '',
    workspace: '',
    ptDisclaimerAccepted: null as string | null,
    'theme.preset':  'cyber',
    'theme.accent':  '#00d4ff',
    'theme.accent2': '#00ff88',
    'theme.bg':      '#070b11',
    'opticseo.email':    '',
    'opticseo.password': '',
    'opticseo.autoLogin': true,
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
