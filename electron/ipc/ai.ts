import { ipcMain } from 'electron'
import { getSettingsStore } from './settings'

export function registerAIHandlers() {
  ipcMain.handle('ai:chat', async (_, messages: { role: string; content: string }[]) => {
    const store = getSettingsStore()
    const apiKey = store.get('ai.apiKey', '') as string
    if (!apiKey) throw new Error('NO_API_KEY')

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: 'You are a cybersecurity expert assistant embedded in CryoGram OS, a security operations desktop. Help with penetration testing concepts, security analysis, code review, vulnerability assessment, and security tool usage. Always remind users to only test systems they have explicit authorization to test.',
        messages,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`API error ${res.status}: ${err}`)
    }

    const data = await res.json()
    return data.content?.[0]?.text || ''
  })
}
