import { ipcMain } from 'electron'
import { getSettingsStore } from './settings'
import crypto from 'crypto'

interface TOTPAccount { id: string; name: string; issuer: string; secret: string }

function base32Decode(str: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  str = str.replace(/=+$/, '').toUpperCase()
  let bits = 0
  let value = 0
  const output: number[] = []
  for (const char of str) {
    value = (value << 5) | alphabet.indexOf(char)
    bits += 5
    if (bits >= 8) { bits -= 8; output.push((value >> bits) & 0xff) }
  }
  return Buffer.from(output)
}

function generateTOTP(secret: string): { code: string; timeLeft: number } {
  const timeLeft = 30 - (Math.floor(Date.now() / 1000) % 30)
  const counter = Math.floor(Math.floor(Date.now() / 1000) / 30)
  try {
    const key = base32Decode(secret.replace(/\s/g, ''))
    const buf = Buffer.alloc(8)
    buf.writeUInt32BE(Math.floor(counter / 2**32), 0)
    buf.writeUInt32BE(counter >>> 0, 4)
    const hmac = crypto.createHmac('sha1', key).update(buf).digest()
    const offset = hmac[hmac.length - 1] & 0x0f
    const code = ((hmac[offset] & 0x7f) << 24 | hmac[offset+1] << 16 | hmac[offset+2] << 8 | hmac[offset+3]) % 1000000
    return { code: String(code).padStart(6, '0'), timeLeft }
  } catch {
    return { code: '------', timeLeft }
  }
}

export function registerTOTPHandlers() {
  function getAccounts(): TOTPAccount[] {
    const store = getSettingsStore()
    return store.get('totp.accounts', []) as TOTPAccount[]
  }

  function saveAccounts(accounts: TOTPAccount[]) {
    const store = getSettingsStore()
    store.set('totp.accounts', accounts)
  }

  ipcMain.handle('totp:list', async () => getAccounts())

  ipcMain.handle('totp:generate', async (_, secret: string) => generateTOTP(secret))

  ipcMain.handle('totp:add', async (_, account: Omit<TOTPAccount, 'id'>) => {
    const accounts = getAccounts()
    const newAccount = { ...account, id: `totp-${Date.now()}` }
    saveAccounts([...accounts, newAccount])
    return newAccount
  })

  ipcMain.handle('totp:remove', async (_, id: string) => {
    saveAccounts(getAccounts().filter(a => a.id !== id))
    return true
  })
}
