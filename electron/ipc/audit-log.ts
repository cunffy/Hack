import { ipcMain } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

const LOG_PATH = path.join(os.homedir(), '.cryogram', 'audit.log.jsonl')

interface LogEntry {
  id: string
  ts: string
  type: 'security' | 'warning' | 'info' | 'success'
  category: string
  message: string
  details?: string
  user?: string
}

async function appendEntry(entry: LogEntry) {
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true })
  await fs.appendFile(LOG_PATH, JSON.stringify(entry) + '\n', 'utf-8')
}

export function registerAuditLogHandlers() {
  ipcMain.handle('auditLog:list', async () => {
    try {
      const raw = await fs.readFile(LOG_PATH, 'utf-8')
      const entries = raw.trim().split('\n')
        .filter(l => l.trim())
        .map(l => { try { return JSON.parse(l) } catch { return null } })
        .filter(Boolean) as LogEntry[]
      return entries.reverse().slice(0, 1000)
    } catch {
      return []
    }
  })

  ipcMain.handle('auditLog:append', async (_, entry: Omit<LogEntry, 'id' | 'ts'>) => {
    const full: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      ts: new Date().toISOString().replace('T',' ').slice(0,19),
      ...entry,
    }
    await appendEntry(full)
    return full
  })

  ipcMain.handle('auditLog:clear', async () => {
    await fs.writeFile(LOG_PATH, '', 'utf-8')
    return true
  })
}

// Export for use in other handlers
export { appendEntry }
