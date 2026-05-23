import { useWindowStore } from '../store/windowStore'
import { AppWindow } from './Window'

export function WindowManager() {
  const windows = useWindowStore((s) => s.windows)

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {windows.map((win) => (
        <AppWindow key={win.id} window={win} />
      ))}
    </div>
  )
}
