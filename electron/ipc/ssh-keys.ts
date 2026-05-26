import { ipcMain } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readdir, readFile, writeFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const execAsync = promisify(exec)

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SshKey {
  name: string
  type: string
  fingerprint: string
  publicKey: string
  hasPrivate: boolean
  path: string
}

export interface SshHost {
  host: string
  hostname?: string
  user?: string
  port?: string
  identityFile?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const SSH_DIR = join(homedir(), '.ssh')

async function getFingerprint(pubKeyPath: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`ssh-keygen -l -f "${pubKeyPath}" 2>/dev/null`)
    return stdout.trim()
  } catch {
    return 'unknown'
  }
}

function parseKeyType(publicKey: string): string {
  const prefix = publicKey.trim().split(' ')[0] ?? ''
  if (prefix === 'ssh-ed25519') return 'ED25519'
  if (prefix === 'ssh-rsa')     return 'RSA'
  if (prefix === 'ecdsa-sha2-nistp256' || prefix.startsWith('ecdsa')) return 'ECDSA'
  if (prefix === 'ssh-dss')     return 'DSA'
  return prefix.replace('ssh-', '').toUpperCase() || 'UNKNOWN'
}

function parseSshConfig(content: string): SshHost[] {
  const hosts: SshHost[] = []
  let current: SshHost | null = null

  for (const raw of content.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue

    const hostMatch = line.match(/^Host\s+(.+)$/i)
    if (hostMatch) {
      if (current) hosts.push(current)
      current = { host: hostMatch[1].trim() }
      continue
    }

    if (!current) continue

    const kvMatch = line.match(/^(\S+)\s+(.+)$/)
    if (!kvMatch) continue
    const [, key, value] = kvMatch

    switch (key.toLowerCase()) {
      case 'hostname':     current.hostname     = value.trim(); break
      case 'user':         current.user         = value.trim(); break
      case 'port':         current.port         = value.trim(); break
      case 'identityfile': current.identityFile = value.trim(); break
    }
  }

  if (current) hosts.push(current)
  return hosts.filter(h => h.host !== '*')
}

// ── Handler registration ───────────────────────────────────────────────────────

export function registerSSHKeyHandlers(): void {

  // List all keys in ~/.ssh
  ipcMain.handle('ssh:listKeys', async (): Promise<SshKey[]> => {
    try {
      const files = await readdir(SSH_DIR)
      const pubFiles = files.filter(f => f.endsWith('.pub'))
      const keys: SshKey[] = []

      for (const pubFile of pubFiles) {
        const pubPath = join(SSH_DIR, pubFile)
        const name = pubFile.replace(/\.pub$/, '')
        const privPath = join(SSH_DIR, name)

        try {
          const publicKey = await readFile(pubPath, 'utf8')
          const fingerprint = await getFingerprint(pubPath)
          keys.push({
            name,
            type: parseKeyType(publicKey),
            fingerprint,
            publicKey: publicKey.trim(),
            hasPrivate: existsSync(privPath),
            path: pubPath,
          })
        } catch {
          // skip unreadable keys
        }
      }

      return keys
    } catch {
      return []
    }
  })

  // Generate a new key pair
  ipcMain.handle(
    'ssh:generateKey',
    async (_, opts: {
      name: string
      type: 'ed25519' | 'rsa'
      bits?: number
      comment?: string
      passphrase?: string
    }): Promise<{ success: boolean; error?: string }> => {
      try {
        const destPath = join(SSH_DIR, opts.name)
        if (existsSync(destPath)) {
          return { success: false, error: `Key "${opts.name}" already exists` }
        }

        const parts = ['ssh-keygen', '-t', opts.type]
        if (opts.type === 'rsa' && opts.bits) {
          parts.push('-b', String(opts.bits))
        }
        if (opts.comment) {
          parts.push('-C', `"${opts.comment.replace(/"/g, '\\"')}"`)
        }
        const passphrase = opts.passphrase ?? ''
        parts.push('-N', `"${passphrase}"`)
        parts.push('-f', `"${destPath}"`)

        await execAsync(parts.join(' '))
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : String(err),
        }
      }
    }
  )

  // Delete a key pair
  ipcMain.handle('ssh:deleteKey', async (_, name: string): Promise<boolean> => {
    try {
      const privPath = join(SSH_DIR, name)
      const pubPath  = join(SSH_DIR, `${name}.pub`)
      if (existsSync(privPath)) await unlink(privPath)
      if (existsSync(pubPath))  await unlink(pubPath)
      return true
    } catch {
      return false
    }
  })

  // Read public key content
  ipcMain.handle('ssh:getPublicKey', async (_, name: string): Promise<string> => {
    try {
      const pubPath = join(SSH_DIR, `${name}.pub`)
      return await readFile(pubPath, 'utf8')
    } catch {
      return ''
    }
  })

  // List parsed hosts from ~/.ssh/config
  ipcMain.handle('ssh:listHosts', async (): Promise<SshHost[]> => {
    try {
      const configPath = join(SSH_DIR, 'config')
      if (!existsSync(configPath)) return []
      const content = await readFile(configPath, 'utf8')
      return parseSshConfig(content)
    } catch {
      return []
    }
  })

  // Save ~/.ssh/config
  ipcMain.handle('ssh:saveConfig', async (_, content: string): Promise<boolean> => {
    try {
      const configPath = join(SSH_DIR, 'config')
      await writeFile(configPath, content, { mode: 0o600 })
      return true
    } catch {
      return false
    }
  })
}
