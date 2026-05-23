import { BrowserWindow, Notification } from 'electron'

export function sendNotification(title: string, body: string): void {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show()
  }
  BrowserWindow.getAllWindows()[0]?.webContents.send('notification', { title, body })
}
