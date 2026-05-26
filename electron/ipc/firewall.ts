import { ipcMain } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// ── Types ──────────────────────────────────────────────────────────────────────

export interface FirewallRule {
  number: number
  to: string
  action: string
  from: string
  v6: boolean
}

export interface FirewallStatus {
  active: boolean
  defaultIn: string
  defaultOut: string
  rules: FirewallRule[]
}

// ── Parser ─────────────────────────────────────────────────────────────────────

/**
 * Parse `sudo ufw status verbose` output.
 *
 * Example:
 *   Status: active
 *   Default: deny (incoming), allow (outgoing), disabled (routed)
 *
 *      To                         Action      From
 *      --                         ------      ----
 *   [ 1] 22/tcp                     ALLOW IN    Anywhere
 *   [ 2] 22/tcp (v6)                ALLOW IN    Anywhere (v6)
 */
function parseUfwStatus(output: string): FirewallStatus {
  const lines = output.split('\n')

  const active = /Status:\s*active/i.test(output)

  let defaultIn  = 'deny'
  let defaultOut = 'allow'
  for (const line of lines) {
    const defMatch = line.match(/^Default:\s*(.+)/i)
    if (defMatch) {
      const parts = defMatch[1]
      const inMatch  = parts.match(/(\w+)\s*\(incoming\)/i)
      const outMatch = parts.match(/(\w+)\s*\(outgoing\)/i)
      if (inMatch)  defaultIn  = inMatch[1].toLowerCase()
      if (outMatch) defaultOut = outMatch[1].toLowerCase()
    }
  }

  const rules: FirewallRule[] = []
  // Numbered rule lines:  "[ 1] 22/tcp     ALLOW IN    Anywhere"
  // Unnumbered rule lines (older ufw): "22/tcp     ALLOW IN    Anywhere"
  const ruleRe = /^\s*(?:\[\s*(\d+)\]\s+)?(\S+(?:\s+\S+)?)\s+(ALLOW|DENY|REJECT|LIMIT)(?:\s+IN|\s+OUT|FWD)?\s+(.+?)(\s+\(v6\))?\s*$/i

  let ruleNum = 0
  for (const line of lines) {
    const m = line.match(ruleRe)
    if (!m) continue
    // skip header rows
    if (/^-+/.test(m[2])) continue
    ruleNum++
    const num    = m[1] ? parseInt(m[1], 10) : ruleNum
    const to     = m[2].trim()
    const action = m[3].toUpperCase()
    const from   = m[4].trim()
    const v6     = !!m[5] || /\(v6\)/i.test(to) || /\(v6\)/i.test(from)
    rules.push({ number: num, to, action, from, v6 })
  }

  return { active, defaultIn, defaultOut, rules }
}

// ── Handler registration ───────────────────────────────────────────────────────

export function registerFirewallHandlers(): void {

  // Get firewall status
  ipcMain.handle('firewall:status', async (): Promise<FirewallStatus> => {
    try {
      const { stdout } = await execAsync('sudo ufw status verbose 2>/dev/null')
      return parseUfwStatus(stdout)
    } catch {
      return { active: false, defaultIn: 'deny', defaultOut: 'allow', rules: [] }
    }
  })

  // Enable firewall
  ipcMain.handle('firewall:enable', async (): Promise<{ success: boolean }> => {
    try {
      await execAsync('sudo ufw --force enable 2>&1')
      return { success: true }
    } catch {
      return { success: false }
    }
  })

  // Disable firewall
  ipcMain.handle('firewall:disable', async (): Promise<{ success: boolean }> => {
    try {
      await execAsync('sudo ufw disable 2>&1')
      return { success: true }
    } catch {
      return { success: false }
    }
  })

  // Add a rule
  ipcMain.handle(
    'firewall:addRule',
    async (_, rule: {
      port?: string
      proto?: string
      from?: string
      action: 'allow' | 'deny'
    }): Promise<{ success: boolean; error?: string }> => {
      try {
        const parts: string[] = ['sudo', 'ufw', rule.action]

        if (rule.from && rule.from.toLowerCase() !== 'any') {
          parts.push('from', rule.from)
        }

        if (rule.port) {
          const protoSuffix = rule.proto && rule.proto !== 'any' ? `/${rule.proto}` : ''
          parts.push('to', 'any', 'port', `${rule.port}${protoSuffix}`)
        }

        const cmd = parts.join(' ')
        await execAsync(cmd)
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : String(err),
        }
      }
    }
  )

  // Delete a rule by number
  ipcMain.handle('firewall:deleteRule', async (_, number: number): Promise<{ success: boolean }> => {
    try {
      await execAsync(`sudo ufw --force delete ${number} 2>&1`)
      return { success: true }
    } catch {
      return { success: false }
    }
  })

  // Reset to defaults
  ipcMain.handle('firewall:reset', async (): Promise<{ success: boolean }> => {
    try {
      await execAsync('sudo ufw --force reset 2>&1')
      return { success: true }
    } catch {
      return { success: false }
    }
  })
}
