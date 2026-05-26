import { ipcMain } from 'electron'

let Database: any = null
try { Database = require('better-sqlite3') } catch {}

const sessions = new Map<string, any>()

export function registerDatabaseHandlers(): void {
  ipcMain.handle('db:open', async (_, filePath: string) => {
    if (!Database) return { error: 'better-sqlite3 not installed. Run: npm install better-sqlite3' }
    try {
      const sessionId = `db_${Date.now()}_${Math.random().toString(36).slice(2)}`
      const db = Database(filePath, { readonly: true })
      sessions.set(sessionId, db)
      return { sessionId }
    } catch (e: any) { return { error: e.message } }
  })

  ipcMain.handle('db:close', async (_, sessionId: string) => {
    sessions.get(sessionId)?.close()
    sessions.delete(sessionId)
    return true
  })

  ipcMain.handle('db:listTables', async (_, sessionId: string) => {
    const db = sessions.get(sessionId)
    if (!db) return []
    return db.prepare("SELECT name, type FROM sqlite_master WHERE type IN ('table','view') ORDER BY name").all()
  })

  ipcMain.handle('db:getSchema', async (_, sessionId: string, tableName: string) => {
    const db = sessions.get(sessionId)
    if (!db) return []
    return db.prepare(`PRAGMA table_info("${tableName.replace(/"/g, '')}")`).all()
  })

  ipcMain.handle('db:getTableRowCount', async (_, sessionId: string, tableName: string) => {
    const db = sessions.get(sessionId)
    if (!db) return 0
    try {
      const r = db.prepare(`SELECT COUNT(*) as n FROM "${tableName.replace(/"/g, '')}"` ).get() as any
      return r?.n ?? 0
    } catch { return 0 }
  })

  ipcMain.handle('db:query', async (_, sessionId: string, sql: string, page = 0, pageSize = 100) => {
    const db = sessions.get(sessionId)
    if (!db) return { rows: [], columns: [], total: 0, error: 'No database open' }
    try {
      const trimmed = sql.trim().toLowerCase()
      if (trimmed.startsWith('select') || trimmed.startsWith('with') || trimmed.startsWith('pragma')) {
        const rows    = db.prepare(`${sql} LIMIT ${pageSize} OFFSET ${page * pageSize}`).all()
        const columns = rows.length > 0 ? Object.keys(rows[0]) : []
        let total = 0
        try {
          const r = db.prepare(`SELECT COUNT(*) as n FROM (${sql})`).get() as any
          total = r?.n ?? rows.length
        } catch {}
        return { rows, columns, total, error: null }
      } else {
        const info = db.prepare(sql).run()
        return { rows: [], columns: [], total: 0, changes: info.changes, error: null }
      }
    } catch (e: any) { return { rows: [], columns: [], total: 0, error: e.message } }
  })
}
