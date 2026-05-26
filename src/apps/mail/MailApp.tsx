import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Electron webview element — typed enough for our usage
type WebviewEl = HTMLElement & {
  src: string
  reload(): void
  goBack(): void
  goForward(): void
  canGoBack(): boolean
  canGoForward(): boolean
  getURL(): string
  executeJavaScript(code: string): Promise<unknown>
  addEventListener(event: string, cb: (e: CustomEvent & Record<string, unknown>) => void): void
  removeEventListener(event: string, cb: (e: CustomEvent & Record<string, unknown>) => void): void
}

const GMAIL_URL  = 'https://mail.google.com'
// Spoof a real Chrome browser so Google allows sign-in
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

// Intercept window.Notification inside the webview and echo it out via
// console.log with a magic prefix so we can forward it to the OS notification center.
const NOTIF_INJECT = `(function() {
  if (window.Notification && !window.Notification.__cryo) {
    const _N = window.Notification;
    function N(title, opts) {
      try { console.log('__CRYO_NOTIF__' + JSON.stringify({ title: String(title), body: opts && opts.body ? String(opts.body) : '' })) } catch {}
      return new _N(title, opts);
    }
    N.permission = 'granted';
    N.requestPermission = () => Promise.resolve('granted');
    N.__cryo = true;
    Object.setPrototypeOf(N, _N);
    window.Notification = N;
  }
})()`

function NavBtn({ onClick, disabled, title, children }: {
  onClick: () => void
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-25"
      style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', fontSize: 16 }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
    >
      {children}
    </button>
  )
}

export default function MailApp() {
  const wvRef    = useRef<WebviewEl>(null)
  const [loading, setLoading] = useState(true)
  const [url,     setUrl]     = useState(GMAIL_URL)
  const [canBack, setCanBack] = useState(false)
  const [canFwd,  setCanFwd]  = useState(false)

  useEffect(() => {
    const wv = wvRef.current
    if (!wv) return

    const onStart = () => setLoading(true)

    const onLoad = () => {
      setLoading(false)
      try {
        setUrl(wv.getURL())
        setCanBack(wv.canGoBack())
        setCanFwd(wv.canGoForward())
      } catch {}

      // Inject notification interceptor
      wv.executeJavaScript(NOTIF_INJECT).catch(() => {})
    }

    const onFail = () => setLoading(false)

    // Forward webview console.log notifications → CryoGram notification center
    const onConsole = (e: any) => {
      const msg: string = e.message || ''
      if (!msg.startsWith('__CRYO_NOTIF__')) return
      try {
        const data = JSON.parse(msg.slice('__CRYO_NOTIF__'.length)) as { title: string; body: string }
        window.dispatchEvent(new CustomEvent('cryogram:notification', { detail: {
          title: `Gmail: ${data.title}`,
          body: data.body,
        }}))
      } catch {}
    }

    wv.addEventListener('did-start-loading', onStart as any)
    wv.addEventListener('did-finish-load',   onLoad as any)
    wv.addEventListener('did-fail-load',     onFail as any)
    wv.addEventListener('console-message',   onConsole)

    return () => {
      wv.removeEventListener('did-start-loading', onStart as any)
      wv.removeEventListener('did-finish-load',   onLoad as any)
      wv.removeEventListener('did-fail-load',     onFail as any)
      wv.removeEventListener('console-message',   onConsole)
    }
  }, [])

  const isGmail = url.startsWith('https://mail.google.com')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Browser toolbar */}
      <div
        className="flex items-center gap-1.5 px-2 py-1.5 shrink-0"
        style={{ background: 'rgba(8,12,20,0.97)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <NavBtn onClick={() => wvRef.current?.goBack()}    disabled={!canBack} title="Back">‹</NavBtn>
        <NavBtn onClick={() => wvRef.current?.goForward()} disabled={!canFwd}  title="Forward">›</NavBtn>
        <NavBtn onClick={() => wvRef.current?.reload()}    title="Reload">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </NavBtn>

        {/* URL bar */}
        <div
          className="flex-1 flex items-center gap-2 px-3 rounded-lg"
          style={{ height: 26, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {isGmail && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="#ea4335" strokeWidth="2"/>
              <path d="M2 7l10 7 10-7" stroke="#ea4335" strokeWidth="2"/>
            </svg>
          )}
          <span className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
            {url}
          </span>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <motion.div
            className="w-4 h-4 rounded-full shrink-0"
            style={{ border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#ea4335' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <div className="w-4 h-4 shrink-0" />
        )}
      </div>

      {/* Webview — partition keeps session persistent between opens */}
      {/* @ts-ignore — allowpopups is a string attribute in Electron's webview */}
      <webview
        ref={wvRef}
        src={GMAIL_URL}
        useragent={USER_AGENT}
        // @ts-ignore
        allowpopups="true"
        partition="persist:mail"
        style={{ flex: 1, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
