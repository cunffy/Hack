import { ipcMain } from 'electron'
import axios from 'axios'
import { store } from './settings'

const BASE = 'https://api.shodan.io'

function apiKey(): string {
  return (store.get('shodanApiKey') as string) || ''
}

export function registerShodanHandlers(): void {
  ipcMain.handle('shodan:search', async (_, query: string, page = 1) => {
    const key = apiKey()
    if (!key) throw new Error('NO_API_KEY')
    const res = await axios.get(`${BASE}/shodan/host/search`, {
      params: { key, query, page },
      timeout: 15000,
    })
    return res.data
  })

  ipcMain.handle('shodan:host', async (_, ip: string) => {
    const key = apiKey()
    if (!key) throw new Error('NO_API_KEY')
    const res = await axios.get(`${BASE}/shodan/host/${ip}`, {
      params: { key },
      timeout: 15000,
    })
    return res.data
  })

  ipcMain.handle('shodan:count', async (_, query: string) => {
    const key = apiKey()
    if (!key) throw new Error('NO_API_KEY')
    const res = await axios.get(`${BASE}/shodan/host/count`, {
      params: { key, query },
      timeout: 10000,
    })
    return res.data
  })

  ipcMain.handle('shodan:myIp', async () => {
    const key = apiKey()
    if (!key) throw new Error('NO_API_KEY')
    const res = await axios.get(`${BASE}/tools/myip`, {
      params: { key },
      timeout: 10000,
    })
    return res.data
  })
}
