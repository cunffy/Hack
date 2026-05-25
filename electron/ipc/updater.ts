import { ipcMain } from 'electron'
import { execFile, spawn } from 'child_process'
import { promisify } from 'util'
import { existsSync, readFileSync } from 'fs'

const execFileP = promisify(execFile)
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
      // Use ls-remote instead of fetch — it queries the remote over the network
      // without writing to .git/FETCH_HEAD, so it works even when the desktop
      // user doesn't have write permission to the root-owned .git directory.
      const { stdout: remoteOut } = await execFileP(
        'git', ['-C', srcDir, 'ls-remote', 'origin', `refs/heads/${branch}`],
        { timeout: 16000 }
      )
      const remoteSha = remoteOut.trim().split(/\s+/)[0]
      if (!remoteSha) {
        return { hasUpdate: false, error: 'fetch-failed', message: `Branch '${branch}' not found on remote.` }
      }

      const { stdout: localOut } = await execFileP('git', ['-C', srcDir, 'rev-parse', 'HEAD'])
      const localSha = localOut.trim()

      if (remoteSha === localSha) return { hasUpdate: false }

      return { hasUpdate: true, commitCount: 1, changes: ['New updates are available — click Update Now to install.'] }
    } catch (e) {
      return {
        hasUpdate: false,
        error: 'fetch-failed',
        message: `Could not reach update server: ${(e as Error).message}`,
      }
    }
  })

  ipcMain.handle('updater:run', (event) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      if (!existsSync(UPDATE_SCRIPT)) {
        return reject(new Error('cryogram-update script not found. Run from the live OS.'))
      }

      // sudo -n runs the script without a password prompt (non-interactive).
      // Requires a NOPASSWD sudoers entry — the UI will guide the user to set
      // this up if missing.
      const cmd  = isRoot() ? 'bash' : 'sudo'
      const args = isRoot() ? [UPDATE_SCRIPT] : ['-n', UPDATE_SCRIPT]

      const proc = spawn(cmd, args, {
        env: { ...process.env, TERM: 'xterm-color', FORCE_COLOR: '1' },
      })

      const send = (data: string) => {
        try { event.sender.send('updater:progress', data) } catch {}
      }

      proc.stdout.on('data', (d: Buffer) => send(d.toString()))
      proc.stderr.on('data', (d: Buffer) => send(d.toString()))

      // null exit = OS killed us during reboot = success
      proc.on('close', (code) => {
        if (code === 0 || code === null) resolve({ success: true })
        else reject(new Error(`Update exited with code ${code}`))
      })
      proc.on('error', (err) => reject(err))
    })
  })
}
