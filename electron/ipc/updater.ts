import { ipcMain } from 'electron'
import { execFile, spawn } from 'child_process'
import { promisify } from 'util'
import { existsSync, readFileSync } from 'fs'

const execFileP = promisify(execFile)
const SRC_DIR = '/opt/cryogram-src'
const UPDATE_SCRIPT = '/usr/local/bin/cryogram-update'

function readBranch(): string {
  try {
    const conf = readFileSync('/etc/cryogram/update.conf', 'utf8')
    const m = conf.match(/BRANCH="([^"]+)"/)
    return m ? m[1] : 'main'
  } catch {
    return 'main'
  }
}

export function registerUpdaterHandlers(): void {
  ipcMain.handle('updater:check', async () => {
    try {
      if (!existsSync(`${SRC_DIR}/.git`)) return { hasUpdate: false }
      const branch = readBranch()
      await execFileP('git', ['-C', SRC_DIR, 'fetch', 'origin', '--quiet'], { timeout: 14000 }).catch(() => {})
      const { stdout: countOut } = await execFileP('git', ['-C', SRC_DIR, 'rev-list', `HEAD..origin/${branch}`, '--count'])
      const count = parseInt(countOut.trim(), 10) || 0
      if (count <= 0) return { hasUpdate: false }
      const { stdout: logOut } = await execFileP('git', ['-C', SRC_DIR, 'log', `HEAD..origin/${branch}`, '--pretty=format:%s', '-8'])
      const changes = logOut.trim().split('\n').filter(Boolean)
      return { hasUpdate: true, commitCount: count, changes }
    } catch {
      return { hasUpdate: false }
    }
  })

  ipcMain.handle('updater:run', (event) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      if (!existsSync(UPDATE_SCRIPT)) {
        return reject(new Error('Update script not found — run from the live OS.'))
      }
      const proc = spawn('sudo', ['-n', UPDATE_SCRIPT], {
        env: { ...process.env, TERM: 'xterm-color', FORCE_COLOR: '1' },
      })
      const send = (data: string) => {
        try { event.sender.send('updater:progress', data) } catch {}
      }
      proc.stdout.on('data', (d: Buffer) => send(d.toString()))
      proc.stderr.on('data', (d: Buffer) => send(d.toString()))
      proc.on('close', (code) => {
        // null = killed by the OS-level reboot — that's success
        if (code === 0 || code === null) resolve({ success: true })
        else reject(new Error(`Update exited with code ${code}`))
      })
      proc.on('error', (err) => reject(err))
    })
  })
}
