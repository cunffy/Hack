import { useEffect } from 'react'
import { Desktop } from './components/Desktop'
import { WindowManager } from './components/WindowManager'
import { Taskbar } from './components/Taskbar'
import { TitleBar } from './components/TitleBar'
import { NotificationToast } from './components/NotificationToast'

export default function App() {
  useEffect(() => {
    const cleanup = window.cyberden.onNotification((n) => {
      // Notifications handled by NotificationToast
      const event = new CustomEvent('cyberden:notification', { detail: n })
      window.dispatchEvent(event)
    })
    return cleanup
  }, [])

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-den-bg">
      <TitleBar />
      <div className="flex-1 relative overflow-hidden">
        <Desktop />
        <WindowManager />
      </div>
      <Taskbar />
      <NotificationToast />
    </div>
  )
}
