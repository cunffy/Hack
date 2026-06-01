import { ipcMain, app } from 'electron'
import Store from 'electron-store'
import { createHash } from 'crypto'

// Lazy singleton — MUST NOT be initialized at module load time because ES
// module imports are hoisted before app.setPath('userData') runs in main.ts.
// Calling getStore() inside IPC handlers (after app.ready) guarantees the
// store file lands in the correct persistent userData directory.
let _store: InstanceType<typeof Store> | null = null

function getStore(): InstanceType<typeof Store> {
  if (!_store) {
    // Fixed key — must not depend on userData path (path changes break decryption)
    const encryptionKey = createHash('sha256').update('cryogram-v1-stable').digest('hex')
    _store = new Store({
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
    } as any)
  }
  return _store!
}

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:get',    (_, key: string)                => getStore().get(key))
  ipcMain.handle('settings:set',    (_, key: string, value: unknown) => { getStore().set(key, value) })
  ipcMain.handle('settings:getAll', () => {
    const raw = getStore().store as Record<string, unknown>
    const flat: Record<string, unknown> = {}
    const flatten = (obj: Record<string, unknown>, prefix = '') => {
      for (const key of Object.keys(obj)) {
        const full = prefix ? `${prefix}.${key}` : key
        const val = obj[key]
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
          flatten(val as Record<string, unknown>, full)
        } else {
          flat[full] = val
        }
      }
    }
    flatten(raw)
    return flat
  })
}

export function getSettingsStore() { return getStore() }
