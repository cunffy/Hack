import { ipcMain, BrowserWindow, app } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import { join } from 'path'

const activeJobs = new Map<string, ChildProcess>()

export function registerPasswordTesterHandlers(): void {
  ipcMain.handle('pt:runCrack', (event, opts: unknown) => {
    return new Promise((resolve, reject) => {
      const jobId = `crack_${Date.now()}`
      const win = BrowserWindow.fromWebContents(event.sender)
      const scriptsDir = join(app.getAppPath(), 'scripts')

      const proc = spawn('python3', [
        join(scriptsDir, 'password_tester.py'),
        JSON.stringify({ ...opts as object, jobId }),
      ])

      activeJobs.set(jobId, proc)

      let stdout = ''
      let stderr = ''

      proc.stdout.on('data', (data: Buffer) => {
        const text = data.toString()
        stdout += text
        // Stream progress updates
        try {
          const lines = text.trim().split('\n')
          for (const line of lines) {
            if (line.startsWith('PROGRESS:')) {
              win?.webContents.send('pt:progress', { jobId, ...JSON.parse(line.slice(9)) })
            }
          }
        } catch {}
      })

      proc.stderr.on('data', (data: Buffer) => {
        stderr += data.toString()
      })

      proc.on('close', (code) => {
        activeJobs.delete(jobId)
        if (code === 0) {
          try {
            const lastLine = stdout.trim().split('\n').filter(l => !l.startsWith('PROGRESS:')).pop() || '{}'
            resolve({ jobId, ...JSON.parse(lastLine) })
          } catch {
            resolve({ jobId, found: false, attempts: 0, elapsed: 0, error: 'Failed to parse result' })
          }
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`))
        }
      })

      proc.on('error', (err) => {
        activeJobs.delete(jobId)
        reject(err)
      })
    })
  })

  ipcMain.handle('pt:runNetwork', (event, opts: unknown) => {
    return new Promise((resolve, reject) => {
      const jobId = `net_${Date.now()}`
      const win = BrowserWindow.fromWebContents(event.sender)
      const scriptsDir = join(app.getAppPath(), 'scripts')

      const proc = spawn('python3', [
        join(scriptsDir, 'network_tester.py'),
        JSON.stringify({ ...opts as object, jobId }),
      ])

      activeJobs.set(jobId, proc)

      let stdout = ''
      let stderr = ''

      proc.stdout.on('data', (data: Buffer) => {
        const text = data.toString()
        stdout += text
        try {
          const lines = text.trim().split('\n')
          for (const line of lines) {
            if (line.startsWith('PROGRESS:')) {
              win?.webContents.send('pt:progress', { jobId, ...JSON.parse(line.slice(9)) })
            }
          }
        } catch {}
      })

      proc.stderr.on('data', (data: Buffer) => {
        stderr += data.toString()
      })

      proc.on('close', (code) => {
        activeJobs.delete(jobId)
        if (code === 0) {
          try {
            const lastLine = stdout.trim().split('\n').filter(l => !l.startsWith('PROGRESS:')).pop() || '{}'
            resolve({ jobId, ...JSON.parse(lastLine) })
          } catch {
            resolve({ jobId, found: false, attempts: 0, elapsed: 0, error: 'Failed to parse result' })
          }
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`))
        }
      })

      proc.on('error', (err) => {
        activeJobs.delete(jobId)
        reject(err)
      })
    })
  })

  ipcMain.on('pt:cancel', (_, jobId: string) => {
    const proc = activeJobs.get(jobId)
    if (proc) {
      proc.kill('SIGTERM')
      activeJobs.delete(jobId)
    }
  })
}
