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

    // Git refuses to operate on repos owned by a different user unless we
    // explicitly mark them safe. This happens when cryogram-update cloned
    // the repo as root but Electron runs as the desktop user (or vice-versa).
    for (const dir of SRC_CANDIDATES) {
      await execFileP('git', ['config', '--global', '--add', 'safe.directory', dir]).catch(() => {})
    }

    try {
      // Fetch silently — if this fails we still try the local compare
      await execFileP('git', ['-C', srcDir, 'fetch', 'origin', '--quiet'], { timeout: 16000 })
    } catch (e) {
      return {
        hasUpdate: false,
        error: 'fetch-failed',
        message: `Could not reach update server: ${(e as Error).message}`,
      }
    }

    try {
      const { stdout: countOut } = await execFileP('git', ['-C', srcDir, 'rev-list', `HEAD..origin/${branch}`, '--count'])
      const count = parseInt(countOut.trim(), 10) || 0
      if (count <= 0) return { hasUpdate: false }

      const { stdout: logOut } = await execFileP('git', ['-C', srcDir, 'log', `HEAD..origin/${branch}`, '--pretty=format:%s', '-8'])
      const changes = logOut.trim().split('\n').filter(Boolean)
      return { hasUpdate: true, commitCount: count, changes }
    } catch (e) {
      return {
        hasUpdate: false,
        error: 'compare-failed',
        message: `Branch compare failed (branch: ${branch}): ${(e as Error).message}`,
      }
    }
  })

  ipcMain.handle('updater:run', (event) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      if (!existsSync(UPDATE_SCRIPT)) {
        return reject(new Error('cryogram-update script not found. Run from the live OS.'))
      }

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
