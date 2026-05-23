import { useState, useEffect } from 'react'

interface Toast {
  id: number
  title: string
  body: string
}

let toastId = 0

export function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const { title, body } = (e as CustomEvent).detail
      const id = ++toastId
      setToasts((prev) => [...prev, { id, title, body }])
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000)
    }
    window.addEventListener('cyberden:notification', handler)
    return () => window.removeEventListener('cyberden:notification', handler)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-12 right-4 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="panel p-3 min-w-64 max-w-80 shadow-2xl border-den-accent/40 pointer-events-auto"
          style={{ borderColor: 'rgba(0,212,255,0.4)' }}
        >
          <div className="flex items-start gap-2">
            <span className="text-den-accent text-xs font-bold shrink-0 mt-0.5">⚡</span>
            <div>
              <div className="text-den-accent text-xs font-bold">{t.title}</div>
              <div className="text-den-text text-xs mt-0.5">{t.body}</div>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="ml-auto text-den-muted hover:text-den-text shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
