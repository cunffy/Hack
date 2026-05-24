import { ipcMain, app } from 'electron'
import axios from 'axios'
import Database from 'better-sqlite3'
import { join } from 'path'
import { store } from './settings'
import { sendNotification } from './notify'

let db: Database.Database

function getDb(): Database.Database {
  if (!db) {
    const dbPath = join(app.getPath('userData'), 'leaker.db')
    db = new Database(dbPath)
    db.exec(`
      CREATE TABLE IF NOT EXISTS targets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        value TEXT NOT NULL UNIQUE,
        label TEXT,
        added_at TEXT DEFAULT (datetime('now')),
        last_checked TEXT
      );
      CREATE TABLE IF NOT EXISTS breaches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        target_id INTEGER NOT NULL,
        source TEXT NOT NULL,
        breach_name TEXT,
        breach_date TEXT,
        data_classes TEXT,
        description TEXT,
        raw TEXT,
        discovered_at TEXT DEFAULT (datetime('now')),
        UNIQUE(target_id, source, breach_name)
      );
    `)
  }
  return db
}

async function checkHIBP(email: string, targetId: number): Promise<number> {
  const key = store.get('hibpApiKey') as string
  if (!key) return 0

  try {
    const res = await axios.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`,
      {
        headers: { 'hibp-api-key': key, 'User-Agent': 'Cryogram-Security-Tool' },
        params: { truncateResponse: false },
        timeout: 10000,
      }
    )
    const database = getDb()
    let newCount = 0
    for (const breach of res.data) {
      const insert = database.prepare(`
        INSERT OR IGNORE INTO breaches (target_id, source, breach_name, breach_date, data_classes, description, raw)
        VALUES (?, 'hibp', ?, ?, ?, ?, ?)
      `)
      const result = insert.run(
        targetId,
        breach.Name,
        breach.BreachDate,
        JSON.stringify(breach.DataClasses),
        breach.Description,
        JSON.stringify(breach)
      )
      if (result.changes > 0) {
        newCount++
        sendNotification('New Breach Detected', `${email} found in ${breach.Name} breach`)
      }
    }
    return newCount
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return 0
    throw err
  }
}

async function checkDehashed(value: string, type: string, targetId: number): Promise<number> {
  const email = store.get('dehashedEmail') as string
  const key = store.get('dehashedApiKey') as string
  if (!email || !key) return 0

  const queryMap: Record<string, string> = {
    email: 'email',
    domain: 'domain',
    username: 'username',
  }

  const field = queryMap[type] || 'email'

  try {
    const res = await axios.get('https://api.dehashed.com/search', {
      params: { query: `${field}:${value}`, size: 100 },
      auth: { username: email, password: key },
      headers: { Accept: 'application/json' },
      timeout: 15000,
    })

    const database = getDb()
    let newCount = 0
    const entries = res.data?.entries || []
    for (const entry of entries) {
      const insert = database.prepare(`
        INSERT OR IGNORE INTO breaches (target_id, source, breach_name, data_classes, raw)
        VALUES (?, 'dehashed', ?, ?, ?)
      `)
      const result = insert.run(
        targetId,
        entry.database_name || 'unknown',
        JSON.stringify(['email', 'password', 'username'].filter(k => entry[k])),
        JSON.stringify(entry)
      )
      if (result.changes > 0) newCount++
    }
    return newCount
  } catch {
    return 0
  }
}

export function registerLeakerHandlers(): void {
  ipcMain.handle('leaker:addTarget', (_, target: { type: string; value: string; label?: string }) => {
    const database = getDb()
    const stmt = database.prepare(
      'INSERT OR IGNORE INTO targets (type, value, label) VALUES (?, ?, ?)'
    )
    const result = stmt.run(target.type, target.value, target.label || target.value)
    return {
      id: Number(result.lastInsertRowid),
      type: target.type as 'email' | 'domain' | 'username',
      value: target.value,
      label: target.label || target.value,
      added_at: new Date().toISOString(),
      last_checked: null,
    }
  })

  ipcMain.handle('leaker:removeTarget', (_, id: number) => {
    const database = getDb()
    database.prepare('DELETE FROM targets WHERE id = ?').run(id)
    database.prepare('DELETE FROM breaches WHERE target_id = ?').run(id)
    return true
  })

  ipcMain.handle('leaker:getTargets', () => {
    const database = getDb()
    return database.prepare('SELECT * FROM targets ORDER BY added_at DESC').all()
  })

  ipcMain.handle('leaker:getBreaches', (_, targetId?: number) => {
    const database = getDb()
    if (targetId !== undefined) {
      return database.prepare(
        'SELECT * FROM breaches WHERE target_id = ? ORDER BY discovered_at DESC'
      ).all(targetId)
    }
    return database.prepare('SELECT * FROM breaches ORDER BY discovered_at DESC').all()
  })

  ipcMain.handle('leaker:forceRefresh', async (_, targetId?: number) => {
    const database = getDb()
    const targets = targetId !== undefined
      ? database.prepare('SELECT * FROM targets WHERE id = ?').all(targetId)
      : database.prepare('SELECT * FROM targets').all()

    let totalNew = 0
    for (const target of targets as Array<{ id: number; type: string; value: string }>) {
      try {
        if (target.type === 'email') {
          totalNew += await checkHIBP(target.value, target.id)
        }
        totalNew += await checkDehashed(target.value, target.type, target.id)
        database.prepare("UPDATE targets SET last_checked = datetime('now') WHERE id = ?").run(target.id)
      } catch {
        // Continue checking other targets on error
      }
    }
    return { checked: targets.length, newBreaches: totalNew }
  })
}
