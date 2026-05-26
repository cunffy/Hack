import { ipcMain } from 'electron'
import { getSettingsStore } from './settings'

function getKey(): string {
  const store = getSettingsStore()
  return store.get('shodan.apiKey', '') as string
}

async function shodanFetch(path: string): Promise<any> {
  const key = getKey()
  if (!key) throw new Error('NO_API_KEY')
  const res = await fetch(`https://api.shodan.io${path}?key=${key}`)
  if (!res.ok) throw new Error(`Shodan API error: ${res.status}`)
  return res.json()
}

export function registerShodanHandlers() {
  ipcMain.handle('shodan:search', async (_, query: string, page = 1) => {
    return shodanFetch(`/shodan/host/search?query=${encodeURIComponent(query)}&page=${page}`)
  })

  ipcMain.handle('shodan:host', async (_, ip: string) => {
    return shodanFetch(`/shodan/host/${ip}`)
  })

  ipcMain.handle('shodan:count', async (_, query: string) => {
    return shodanFetch(`/shodan/host/count?query=${encodeURIComponent(query)}`)
  })

  ipcMain.handle('shodan:exploits', async (_, query: string) => {
    return shodanFetch(`/shodan/exploits/search?query=${encodeURIComponent(query)}`)
  })
}
