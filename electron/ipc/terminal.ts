import { ipcMain, BrowserWindow } from 'electron'
import * as pty from 'node-pty'
import { platform } from 'os'

const sessions = new Map<string, pty.IPty>()

export function registerTerminalHandlers(): void {
  ipcMain.handle('terminal:create', (event, id: string, cols: number, rows: number) => {
    const shell = platform() === 'win32' ? 'powershell.exe' : (process.env.SHELL || '/bin/bash')
    const proc = pty.spawn(shell, [], {
      name: 'xterm-256color',
      cols,
      rows,
      cwd: process.env.HOME || process.cwd(),
      env: { ...process.env, TERM: 'xterm-256color' },
    })

    sessions.set(id, proc)

    const win = BrowserWindow.fromWebContents(event.sender)
    proc.onData((data) => {
      win?.webContents.send(`terminal:data:${id}`, data)
    })

    proc.onExit(() => {
      sessions.delete(id)
      win?.webContents.send(`terminal:data:${id}`, '\r\n[Process exited]\r\n')
    })

    return { pid: proc.pid }
  })

  ipcMain.on('terminal:write', (_, id: string, data: string) => {
    sessions.get(id)?.write(data)
  })

  ipcMain.on('terminal:resize', (_, id: string, cols: number, rows: number) => {
    sessions.get(id)?.resize(cols, rows)
  })

  ipcMain.on('terminal:destroy', (_, id: string) => {
    sessions.get(id)?.kill()
    sessions.delete(id)
  })
}
