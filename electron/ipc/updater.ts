import { ipcMain } from 'electron'
import { execFile, spawn, exec } from 'child_process'
import { promisify } from 'util'
import { existsSync, readFileSync } from 'fs'

const execFileP = promisify(execFile)
const execP = promisify(exec)

const CA_BUNDLE = '/etc/ssl/certs/ca-certificates.crt'

// Return git env with SSL certs configured.
// If the system CA bundle is missing, fall back to GIT_SSL_NO_VERIFY so the
// check still works — the actual update script installs ca-certificates first.
function gitEnv(): NodeJS.ProcessEnv {
  const base = { ...process.env }
  if (existsSync(CA_BUNDLE)) {
    return { ...base, GIT_SSL_CAINFO: CA_BUNDLE, GIT_SSL_CAPATH: '/etc/ssl/certs' }
  }
  // CA bundle missing — disable SSL verification for the network check only.
  // The cryogram-update script installs ca-certificates before pulling code.
  return { ...base, GIT_SSL_NO_VERIFY: 'true' }
}

// Sync system clock before any SSL network operation — a wrong clock causes
// cert validation failures even when certs are installed.
async function syncClock(): Promise<void> {
  try { await execP('chronyc makestep 2>/dev/null || timedatectl set-ntp true 2>/dev/null || true', { timeout: 4000 }) } catch {}
}
const UPDATE_SCRIPT = '/usr/local/bin/cryogram-update'

// Possible locations where cryogram-update clones the source repo
const SRC_CANDIDATES = ['/opt/cryogram-src', '/opt/cryogram']

function findSrcDir(): string | null {
  for (const dir of SRC_CANDIDATES) {
    if (existsSync(`${dir}/.git`)) return dir
  }
  return null
}

function readConf(): { repoUrl: string; branch: string } {
  try {
    const conf = readFileSync('/etc/cryogram/update.conf', 'utf8')
    const repoUrl = conf.match(/REPO_URL="([^"]+)"/)?.[1] ?? ''
    const branch  = conf.match(/BRANCH="([^"]+)"/)?.[1]  ?? 'main'
    return { repoUrl, branch }
  } catch {
    return { repoUrl: '', branch: 'main' }
  }
}

function isRoot(): boolean {
  try { return process.getuid?.() === 0 } catch { return false }
}

export function registerUpdaterHandlers(): void {
  ipcMain.handle('updater:check', async () => {
    const srcDir = findSrcDir()
    if (!srcDir) {
      return {
        hasUpdate: false,
        error: 'no-source-dir',
        message: 'Source directory not found. Run sudo cryogram-update once from a terminal to set up automatic updates.',
      }
    }

    const { branch } = readConf()

    // Mark dirs safe so git doesn't refuse due to ownership mismatch
    // (repo cloned as root, Electron runs as desktop user)
    for (const dir of SRC_CANDIDATES) {
      await execFileP('git', ['config', '--global', '--add', 'safe.directory', dir]).catch(() => {})
    }

    try {
      // Sync clock before any SSL operation — a wrong clock causes cert failures.
      await syncClock()

      // Use ls-remote instead of fetch — it queries the remote over the network
      // without writing to .git/FETCH_HEAD, so it works even when the desktop
      // user doesn't have write permission to the root-owned .git directory.
      const { stdout: remoteOut } = await execFileP(
        'git', ['-C', srcDir, 'ls-remote', 'origin', `refs/heads/${branch}`],
        { timeout: 20000, env: gitEnv() }
      )
      const remoteSha = remoteOut.trim().split(/\s+/)[0]
      if (!remoteSha) {
        return { hasUpdate: false, error: 'fetch-failed', message: `Branch '${branch}' not found on remote.` }
      }

      const { stdout: localOut } = await execFileP('git', ['-C', srcDir, 'rev-parse', 'HEAD'], { env: gitEnv() })
      const localSha = localOut.trim()

      if (remoteSha === localSha) return { hasUpdate: false }

      return { hasUpdate: true, commitCount: 1, changes: ['New updates are available — click Update Now to install.'] }
    } catch (e) {
      const msg = (e as Error).message ?? ''
      const isSSL = msg.includes('certificate') || msg.includes('CAfile') || msg.includes('SSL') || msg.includes('ssl')
      return {
        hasUpdate: false,
        error: isSSL ? 'ssl-error' : 'fetch-failed',
        message: isSSL
          ? 'SSL certificates are not installed on this system. Click "Update Now" — the update script installs them automatically and then applies all pending updates.'
          : `Could not reach update server: ${msg}`,
      }
    }
  })

  ipcMain.handle('updater:isRoot', () => isRoot())

  ipcMain.handle('updater:run', (event, password?: string) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      if (!existsSync(UPDATE_SCRIPT)) {
        return reject(new Error('cryogram-update script not found. Run from the live OS.'))
      }

      // If already root, run directly. Otherwise use sudo -S which reads
      // the password from stdin — no pre-configuration needed.
      const cmd  = isRoot() ? 'bash' : 'sudo'
      const args = isRoot() ? [UPDATE_SCRIPT] : ['-S', UPDATE_SCRIPT]

      const proc = spawn(cmd, args, {
        env: { ...gitEnv(), TERM: 'xterm-color', FORCE_COLOR: '1' },
      })

      // Feed password to sudo via stdin
      if (!isRoot() && password) {
        proc.stdin?.write(password + '\n')
        proc.stdin?.end()
      }

      const send = (data: string) => {
        try { event.sender.send('updater:progress', data) } catch {}
      }

      proc.stdout.on('data', (d: Buffer) => send(d.toString()))
      proc.stderr.on('data', (d: Buffer) => {
        const s = d.toString()
        // Filter sudo's own prompts — don't show them in the update log
        if (!s.match(/^\[sudo\]|password for |Sorry, try again/)) send(s)
      })

      proc.on('close', (code) => {
        if (code === null || code === 0) {
          // Script finished — restart Electron itself cleanly.
          // resolve() first so the renderer sees "All done" and shows the countdown UI.
          // Then relaunch() + exit(0) after 2 s, which is more reliable than pkill
          // because it uses the actual binary path regardless of how the process was named.
          resolve({ success: true })
          const { app } = require('electron')
          app.relaunch()
          setTimeout(() => app.exit(0), 2000)
        } else if (!isRoot() && code === 1) {
          reject(new Error('wrong-password'))
        } else {
          reject(new Error(`Update exited with code ${code}`))
        }
      })
      proc.on('error', (err) => reject(err))
    })
  })
}
