import { ipcMain, BrowserWindow, dialog } from 'electron'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
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

    // Try semgrep if available and requested
    if (scannerPref === 'Auto-detect' || scannerPref === 'semgrep') {
      try {
        findings = await runSemgrep(targetPath)
        scanner = 'semgrep'
      } catch { /* fall through to pattern-based */ }
    }

    // Fall back to pattern scan
    if (findings.length === 0 || scanner !== 'semgrep') {
      findings = await patternScan(targetPath, event)
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
