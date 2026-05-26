import { ipcMain, BrowserWindow, dialog } from 'electron'
import { spawn } from 'child_process'
import { promises as fs, statSync } from 'fs'
import path from 'path'

interface Finding {
  id: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  rule: string
  file: string
  line: number
  code: string
  message: string
  fix?: string
}

// Built-in pattern-based scanner (no external tools required)
const PATTERNS: Array<{ regex: RegExp; rule: string; severity: Finding['severity']; message: string; fix?: string }> = [
  { regex: /eval\s*\(/g, rule: 'NO_EVAL', severity: 'HIGH', message: 'eval() can execute arbitrary code — use JSON.parse or Function constructor alternatives', fix: 'Replace eval() with safer alternatives like JSON.parse() for data' },
  { regex: /exec\s*\(\s*['"`].*\+/g, rule: 'CMD_INJECTION', severity: 'CRITICAL', message: 'Potential command injection via string concatenation in exec()', fix: 'Use execFile() with an args array instead of string concatenation' },
  { regex: /password\s*=\s*['"`][^'"` ]{6,}/gi, rule: 'HARDCODED_CREDENTIAL', severity: 'CRITICAL', message: 'Hardcoded password detected', fix: 'Use environment variables or a secrets manager' },
  { regex: /api[_-]?key\s*=\s*['"`][A-Za-z0-9_\-]{16,}/gi, rule: 'HARDCODED_API_KEY', severity: 'CRITICAL', message: 'Hardcoded API key detected', fix: 'Load secrets from environment variables' },
  { regex: /md5\s*\(/gi, rule: 'WEAK_HASH', severity: 'MEDIUM', message: 'MD5 is cryptographically broken — do not use for security purposes', fix: 'Use SHA-256 or bcrypt/argon2 for passwords' },
  { regex: /sha1\s*\(/gi, rule: 'WEAK_HASH_SHA1', severity: 'MEDIUM', message: 'SHA1 is weak for cryptographic use', fix: 'Use SHA-256 or stronger' },
  { regex: /innerHTML\s*=/g, rule: 'XSS_RISK', severity: 'HIGH', message: 'innerHTML assignment can lead to XSS if content is user-controlled', fix: 'Use textContent or DOMPurify to sanitize HTML' },
  { regex: /document\.write\s*\(/g, rule: 'XSS_DOCUMENT_WRITE', severity: 'HIGH', message: 'document.write() is dangerous and deprecated', fix: 'Use DOM manipulation methods instead' },
  { regex: /dangerouslySetInnerHTML/g, rule: 'REACT_XSS', severity: 'MEDIUM', message: 'dangerouslySetInnerHTML can lead to XSS — ensure content is sanitized', fix: 'Sanitize content with DOMPurify before use' },
  { regex: /Math\.random\s*\(\s*\)/g, rule: 'WEAK_RANDOM', severity: 'LOW', message: 'Math.random() is not cryptographically secure', fix: 'Use crypto.getRandomValues() for security-sensitive randomness' },
  { regex: /require\s*\(['"`]child_process['"`]\)/g, rule: 'CHILD_PROCESS', severity: 'INFO', message: 'child_process usage — ensure inputs are validated and sanitized' },
  { regex: /console\.log\s*\(.*password/gi, rule: 'LOG_SENSITIVE', severity: 'MEDIUM', message: 'Sensitive data may be logged to console', fix: 'Remove logging of sensitive information' },
]

async function patternScan(targetPath: string, event: Electron.IpcMainInvokeEvent): Promise<Finding[]> {
  const win = BrowserWindow.fromWebContents(event.sender)
  const findings: Finding[] = []
  const exts = ['.js', '.ts', '.jsx', '.tsx', '.py', '.rb', '.php', '.go', '.java', '.cs', '.cpp', '.c']
  let scanned = 0

  async function scanFile(filePath: string) {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const lines = content.split('\n')
      for (const { regex, rule, severity, message, fix } of PATTERNS) {
        regex.lastIndex = 0
        let match: RegExpExecArray | null
        const linesSeen = new Set<number>()
        while ((match = regex.exec(content)) !== null) {
          const lineNum = content.slice(0, match.index).split('\n').length
          if (linesSeen.has(lineNum)) continue
          linesSeen.add(lineNum)
          findings.push({
            id: `${rule}-${filePath}-${lineNum}`,
            severity, rule,
            file: filePath,
            line: lineNum,
            code: lines[lineNum - 1]?.trim() || match[0],
            message, fix,
          })
        }
      }
      scanned++
    } catch {}
  }

  async function walk(dir: string, depth = 0): Promise<void> {
    if (depth > 8) return
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      for (const e of entries) {
        if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '.git') continue
        const full = path.join(dir, e.name)
        if (e.isDirectory()) await walk(full, depth + 1)
        else if (exts.includes(path.extname(e.name))) await scanFile(full)
      }
    } catch {}
  }

  const stat = await fs.stat(targetPath)
  if (stat.isDirectory()) {
    win?.webContents.send('codeScanner:progress', 15)
    await walk(targetPath)
  } else {
    await scanFile(targetPath)
  }

  win?.webContents.send('codeScanner:progress', 80)
  return findings
}

export function registerCodeScannerHandlers() {
  ipcMain.handle('codeScanner:browse', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openDirectory', 'openFile'],
      title: 'Select project to scan',
    })
    return result.filePaths[0] || null
  })

  ipcMain.handle('codeScanner:scan', async (event, targetPath: string, scannerPref: string) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const start = Date.now()
    win?.webContents.send('codeScanner:progress', 5)

    let findings: Finding[] = []
    let scanner = 'Pattern-based'

    if (scannerPref === 'semgrep') {
      try {
        findings = await runSemgrep(targetPath)
        scanner = 'semgrep'
      } catch {
        findings = await patternScan(targetPath, event)
      }
    } else if (scannerPref === 'bandit (Python)') {
      try {
        findings = await runBandit(targetPath)
        scanner = 'bandit'
      } catch {
        findings = await patternScan(targetPath, event)
      }
    } else if (scannerPref === 'npm audit') {
      try {
        findings = await runNpmAudit(targetPath)
        scanner = 'npm audit'
      } catch {
        findings = await patternScan(targetPath, event)
      }
    } else if (scannerPref === 'eslint-security') {
      // Try project's own eslint + security plugin; fall back to pattern scan
      try {
        findings = await runEslintSecurity(targetPath)
        scanner = 'eslint-security'
      } catch {
        findings = await patternScan(targetPath, event)
      }
    } else if (scannerPref === 'Pattern-based') {
      findings = await patternScan(targetPath, event)
    } else {
      // Auto-detect: try semgrep → bandit (if .py files) → npm audit (if package.json) → pattern
      let detected = false
      try {
        findings = await runSemgrep(targetPath)
        scanner = 'semgrep'
        detected = true
      } catch {}

      if (!detected) {
        try {
          const hasPy = await hasPythonFiles(targetPath)
          if (hasPy) {
            findings = await runBandit(targetPath)
            scanner = 'bandit'
            detected = true
          }
        } catch {}
      }

      if (!detected) {
        try {
          const hasPkg = await hasPackageJson(targetPath)
          if (hasPkg) {
            findings = await runNpmAudit(targetPath)
            scanner = 'npm audit'
            detected = true
          }
        } catch {}
      }

      if (!detected) {
        findings = await patternScan(targetPath, event)
      }
    }

    // Count scanned files
    let scanned = 0
    try {
      const stat = await fs.stat(targetPath)
      if (stat.isDirectory()) {
        const count = { n: 0 }
        await countFiles(targetPath, count)
        scanned = count.n
      } else { scanned = 1 }
    } catch {}

    win?.webContents.send('codeScanner:progress', 100)
    return { findings, scanned, duration: Date.now() - start, scanner }
  })
}

async function runSemgrep(targetPath: string): Promise<Finding[]> {
  return new Promise((resolve, reject) => {
    const proc = spawn('semgrep', ['--config=auto', '--json', targetPath], { timeout: 60000 })
    let out = ''
    proc.stdout.on('data', (d: Buffer) => out += d)
    proc.on('close', (code) => {
      if (code !== 0) { reject(new Error('semgrep failed')); return }
      try {
        const data = JSON.parse(out)
        resolve((data.results || []).map((r: any, i: number) => ({
          id: `semgrep-${i}`,
          severity: (r.extra?.severity || 'INFO').toUpperCase() as Finding['severity'],
          rule: r.check_id || 'semgrep',
          file: r.path,
          line: r.start?.line || 0,
          code: r.extra?.lines || '',
          message: r.extra?.message || '',
          fix: r.extra?.fix,
        })))
      } catch { reject(new Error('Failed to parse semgrep output')) }
    })
    proc.on('error', reject)
  })
}

async function runBandit(targetPath: string): Promise<Finding[]> {
  return new Promise((resolve, reject) => {
    const args = ['-r', targetPath, '-f', 'json', '-q']
    const proc = spawn('bandit', args, { timeout: 60000 })
    let out = ''
    let err = ''
    proc.stdout.on('data', (d: Buffer) => out += d)
    proc.stderr.on('data', (d: Buffer) => err += d)
    proc.on('close', () => {
      // bandit exits non-zero when issues found — parse output regardless
      try {
        const data = JSON.parse(out || err)
        const results: any[] = data.results || []
        resolve(results.map((r: any, i: number) => ({
          id: `bandit-${i}`,
          severity: mapBanditSeverity(r.issue_severity),
          rule: r.test_id || r.test_name || 'bandit',
          file: r.filename,
          line: r.line_number || 0,
          code: r.code?.trim() || '',
          message: r.issue_text || '',
          fix: r.more_info ? `See: ${r.more_info}` : undefined,
        })))
      } catch { reject(new Error('Failed to parse bandit output')) }
    })
    proc.on('error', reject)
  })
}

function mapBanditSeverity(s: string): Finding['severity'] {
  const u = (s || '').toUpperCase()
  if (u === 'HIGH') return 'HIGH'
  if (u === 'MEDIUM') return 'MEDIUM'
  if (u === 'LOW') return 'LOW'
  return 'INFO'
}

async function runNpmAudit(targetPath: string): Promise<Finding[]> {
  return new Promise((resolve, reject) => {
    const cwd = (await_stat_isDirectory(targetPath)) ? targetPath : path.dirname(targetPath)
    const proc = spawn('npm', ['audit', '--json'], { cwd, timeout: 60000 })
    let out = ''
    proc.stdout.on('data', (d: Buffer) => out += d)
    proc.on('close', () => {
      try {
        const data = JSON.parse(out)
        const vulns: any = data.vulnerabilities || {}
        const findings: Finding[] = []
        let idx = 0
        for (const [name, v] of Object.entries<any>(vulns)) {
          const severity = mapNpmSeverity(v.severity)
          const vias: any[] = Array.isArray(v.via) ? v.via.filter((x: any) => typeof x === 'object') : []
          const msg = vias.length > 0 ? vias.map((x: any) => x.title || x.url || '').join('; ') : `Vulnerability in ${name}`
          findings.push({
            id: `npm-audit-${idx++}`,
            severity,
            rule: `NPM:${name}`,
            file: 'package.json',
            line: 0,
            code: `"${name}": "${v.range || v.version || 'unknown'}"`,
            message: msg,
            fix: v.fixAvailable ? `Run: npm audit fix` : 'No automatic fix available — update manually',
          })
        }
        resolve(findings)
      } catch { reject(new Error('Failed to parse npm audit output')) }
    })
    proc.on('error', reject)
  })
}

async function runEslintSecurity(targetPath: string): Promise<Finding[]> {
  return new Promise((resolve, reject) => {
    const cwd = await_stat_isDirectory(targetPath) ? targetPath : path.dirname(targetPath)
    const proc = spawn('npx', ['eslint', '--format', 'json', await_stat_isDirectory(targetPath) ? '.' : targetPath], {
      cwd, timeout: 60000,
    })
    let out = ''
    proc.stdout.on('data', (d: Buffer) => out += d)
    proc.on('close', () => {
      try {
        const data: any[] = JSON.parse(out)
        const findings: Finding[] = []
        let idx = 0
        for (const file of data) {
          for (const msg of (file.messages || [])) {
            if (msg.severity === 0) continue
            findings.push({
              id: `eslint-${idx++}`,
              severity: msg.severity >= 2 ? 'HIGH' : 'MEDIUM',
              rule: msg.ruleId || 'eslint',
              file: file.filePath,
              line: msg.line || 0,
              code: msg.source || '',
              message: msg.message || '',
            })
          }
        }
        resolve(findings)
      } catch { reject(new Error('Failed to parse eslint output')) }
    })
    proc.on('error', reject)
  })
}

function await_stat_isDirectory(p: string): boolean {
  try { return statSync(p).isDirectory() } catch { return false }
}

function mapNpmSeverity(s: string): Finding['severity'] {
  const u = (s || '').toUpperCase()
  if (u === 'CRITICAL') return 'CRITICAL'
  if (u === 'HIGH') return 'HIGH'
  if (u === 'MODERATE' || u === 'MEDIUM') return 'MEDIUM'
  if (u === 'LOW') return 'LOW'
  return 'INFO'
}

async function hasPythonFiles(targetPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(targetPath)
    if (!stat.isDirectory()) return path.extname(targetPath) === '.py'
    const entries = await fs.readdir(targetPath, { withFileTypes: true })
    for (const e of entries) {
      if (!e.isDirectory() && e.name.endsWith('.py')) return true
    }
    return false
  } catch { return false }
}

async function hasPackageJson(targetPath: string): Promise<boolean> {
  try {
    const check = path.isAbsolute(targetPath) ? targetPath : path.resolve(targetPath)
    const stat = await fs.stat(check)
    const dir = stat.isDirectory() ? check : path.dirname(check)
    await fs.access(path.join(dir, 'package.json'))
    return true
  } catch { return false }
}

async function countFiles(dir: string, count: { n: number }, depth = 0): Promise<void> {
  if (depth > 8) return
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === '.git') continue
      const full = path.join(dir, e.name)
      if (e.isDirectory()) await countFiles(full, count, depth + 1)
      else count.n++
    }
  } catch {}
}
