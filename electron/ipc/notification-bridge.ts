import { BrowserWindow } from 'electron'
import { spawn, ChildProcess } from 'child_process'

let proc: ChildProcess | null = null

function sendToRenderer(title: string, body: string): void {
  const win = BrowserWindow.getAllWindows()[0]
  win?.webContents.send('notification', { title, body })
}

/**
 * Spawn dbus-monitor and parse Notify method calls.
 * Intercepts notifications from Brave, Discord, Telegram, Slack — any app
 * that uses libnotify/org.freedesktop.Notifications.
 */
export function startNotificationBridge(): void {
  try {
    proc = spawn('dbus-monitor', [
      '--session',
      "type='method_call',interface='org.freedesktop.Notifications',member='Notify'",
    ], { stdio: ['ignore', 'pipe', 'ignore'] })

    let buf = ''
    let inNotify = false
    let strings: string[] = []

    proc.stdout?.on('data', (chunk: Buffer) => {
      buf += chunk.toString()
      const lines = buf.split('\n')
      buf = lines.pop() ?? ''

      for (const line of lines) {
        // New Notify call starts
        if (line.includes('member=Notify')) {
          inNotify = true
          strings = []
          continue
        }
        if (!inNotify) continue

        // Notify signature: app_name, replaces_id (uint32), icon, summary, body, ...
        // Collect string values in order
        const m = line.match(/^\s{3}string "(.*)"/)
        if (m) {
          strings.push(m[1])
          continue
        }

        // Once we hit the actions array we have all leading strings
        if (line.trim().startsWith('array [')) {
          // strings[0] = app_name, strings[1] = app_icon, strings[2] = summary, strings[3] = body
          if (strings.length >= 3) {
            const app     = strings[0] || 'App'
            const summary = strings[2] || ''
            const body    = strings[3] || ''
            const skip    = !summary
              || app.toLowerCase().includes('electron')
              || app.toLowerCase().includes('cryogram')
            if (!skip) {
              sendToRenderer(summary, body)
            }
          }
          inNotify = false
          strings = []
        }
      }
    })

    proc.on('error', () => { proc = null })
    proc.on('exit',  () => { proc = null })
  } catch {
    proc = null
  }
}

export function stopNotificationBridge(): void {
  proc?.kill('SIGTERM')
  proc = null
}
