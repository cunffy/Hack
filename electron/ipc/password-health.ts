import { ipcMain } from 'electron'
import crypto from 'crypto'

export function registerPasswordHealthHandlers() {
  ipcMain.handle('passwordHealth:checkHIBP', async (_, password: string) => {
    // k-Anonymity model — only first 5 chars of SHA1 hash sent
    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase()
    const prefix = hash.slice(0, 5)
    const suffix = hash.slice(5)

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' }
    })

    if (!res.ok) return { breached: false, count: 0 }

    const text = await res.text()
    const lines = text.split('\n')
    for (const line of lines) {
      const [hashSuffix, countStr] = line.trim().split(':')
      if (hashSuffix === suffix) {
        return { breached: true, count: parseInt(countStr, 10) }
      }
    }
    return { breached: false, count: 0 }
  })
}
