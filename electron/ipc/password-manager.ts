import { ipcMain } from 'electron'
import { randomBytes } from 'crypto'
import { getSettingsStore } from './settings'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PasswordEntry {
  id: string
  title: string
  username: string
  password: string
  url?: string
  notes?: string
  tags?: string[]
  createdAt: number
  updatedAt: number
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function genId(): string {
  return `pw_${Date.now()}_${randomBytes(4).toString('hex')}`
}

function loadEntries(): PasswordEntry[] {
  const raw = getSettingsStore().get('vault.passwords')
  return Array.isArray(raw) ? (raw as PasswordEntry[]) : []
}

function saveEntries(entries: PasswordEntry[]): void {
  getSettingsStore().set('vault.passwords', entries)
}

// ── Generator ─────────────────────────────────────────────────────────────────

interface GenerateOpts {
  length: number
  upper: boolean
  lower: boolean
  numbers: boolean
  symbols: boolean
}

function generatePassword(opts: GenerateOpts): string {
  const { length, upper, lower, numbers, symbols } = opts
  let charset = ''
  if (upper)   charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lower)   charset += 'abcdefghijklmnopqrstuvwxyz'
  if (numbers) charset += '0123456789'
  if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz'

  const clampedLength = Math.max(8, Math.min(64, length))
  const bytes = randomBytes(clampedLength * 2)
  let result = ''
  for (let i = 0; i < bytes.length && result.length < clampedLength; i++) {
    const idx = bytes[i] % charset.length
    result += charset[idx]
  }
  return result
}

// ── Handler registration ───────────────────────────────────────────────────────

export function registerPasswordManagerHandlers(): void {

  // Get all entries
  ipcMain.handle('passwords:getAll', (): PasswordEntry[] => {
    return loadEntries()
  })

  // Add a new entry
  ipcMain.handle(
    'passwords:add',
    (_, entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>): PasswordEntry => {
      const now = Date.now()
      const newEntry: PasswordEntry = {
        ...entry,
        id: genId(),
        createdAt: now,
        updatedAt: now,
      }
      const entries = loadEntries()
      entries.push(newEntry)
      saveEntries(entries)
      return newEntry
    }
  )

  // Update an existing entry
  ipcMain.handle(
    'passwords:update',
    (_, id: string, patch: Partial<PasswordEntry>): boolean => {
      const entries = loadEntries()
      const idx = entries.findIndex(e => e.id === id)
      if (idx === -1) return false
      entries[idx] = { ...entries[idx], ...patch, id, updatedAt: Date.now() }
      saveEntries(entries)
      return true
    }
  )

  // Delete an entry
  ipcMain.handle('passwords:delete', (_, id: string): boolean => {
    const entries = loadEntries()
    const next = entries.filter(e => e.id !== id)
    if (next.length === entries.length) return false
    saveEntries(next)
    return true
  })

  // Generate a password
  ipcMain.handle('passwords:generate', (_, opts: GenerateOpts): string => {
    return generatePassword(opts)
  })
}
