import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGIN_URL     = 'https://opticseoservices.com/login'
const DASHBOARD_URL = 'https://opticseoservices.com/dashboard'
const USER_AGENT    = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

// Robust auto-login: works with React/Vue controlled inputs AND plain HTML forms
const buildLoginScript = (email: string, pass: string) => `
(function() {
  function setNativeVal(el, val) {
    var desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    if (desc && desc.set) {
      desc.set.call(el, val);
    } else {
      el.value = val;
    }
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  var emailSelectors = [
    'input[type="email"]', 'input[name="email"]', 'input[name="username"]',
    'input[name="login"]', 'input[id="email"]', 'input[id="username"]',
    'input[id="login"]', 'input[autocomplete="email"]', 'input[autocomplete="username"]',
    'input[placeholder*="email" i]', 'input[placeholder*="username" i]',
  ];
  var passSelectors = [
    'input[type="password"]', 'input[name="password"]', 'input[id="password"]',
  ];
  var btnSelectors = [
    'button[type="submit"]', 'input[type="submit"]', 'button.login-btn',
    'button.btn-login', 'button.sign-in', '[data-action="login"]',
    'form button:last-of-type', 'button:last-of-type',
  ];

  var emailEl = null, passEl = null;
  for (var i = 0; i < emailSelectors.length; i++) {
    emailEl = document.querySelector(emailSelectors[i]);
    if (emailEl) break;
  }
  for (var i = 0; i < passSelectors.length; i++) {
    passEl = document.querySelector(passSelectors[i]);
    if (passEl) break;
  }
  if (!emailEl || !passEl) return false;

  emailEl.focus();
  setNativeVal(emailEl, ${JSON.stringify(email)});
  passEl.focus();
  setNativeVal(passEl, ${JSON.stringify(pass)});
  emailEl.blur();
  passEl.blur();

  setTimeout(function() {
    var btn = null;
    for (var i = 0; i < btnSelectors.length; i++) {
      btn = document.querySelector(btnSelectors[i]);
      if (btn) break;
    }
    if (btn) { btn.click(); }
    else {
      var form = passEl.closest('form');
      if (form) form.submit();
    }
  }, 300);
  return true;
})()
`

interface Creds { email: string; password: string; autoLogin: boolean }

function ToolbarBtn({ title, onClick, children, disabled }: {
  title: string; onClick: () => void; children: React.ReactNode; disabled?: boolean
}) {
  return (
    <button
      title={title} onClick={onClick} disabled={disabled}
      className="flex items-center justify-center rounded-lg transition-colors"
      style={{ width: 30, height: 30, background: 'transparent', border: 'none',
        color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.55)',
        cursor: disabled ? 'default' : 'pointer' }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  )
}

export default function OpticSEOApp() {
  const wvRef = useRef<Electron.WebviewTag | null>(null)
  const [url, setUrl]               = useState(LOGIN_URL)
  const [displayUrl, setDisplayUrl] = useState(LOGIN_URL)
  const [loading, setLoading]       = useState(true)
  const [loadPct, setLoadPct]       = useState(0)
  const [canBack, setCanBack]       = useState(false)
  const [canFwd, setCanFwd]         = useState(false)
  const [creds, setCreds]           = useState<Creds | null>(null)
  const [showCredsPanel, setShowCredsPanel] = useState(false)
  const [credForm, setCredForm]     = useState({ email: '', password: '', autoLogin: true })
  const [saving, setSaving]         = useState(false)
  const [loginStatus, setLoginStatus] = useState<'idle' | 'injecting' | 'done'>('idle')

  // Load stored credentials on mount
  useEffect(() => {
    async function load() {
      try {
        const api = (window as any).cryogram?.settings
        if (!api) return
        const email     = (await api.get('opticseo.email'))     as string  ?? ''
        const password  = (await api.get('opticseo.password'))  as string  ?? ''
        const autoLogin = (await api.get('opticseo.autoLogin')) as boolean ?? true
        setCreds({ email, password, autoLogin })
        setCredForm({ email, password, autoLogin })
        if (!email || !password) setShowCredsPanel(true)
      } catch {}
    }
    load()
  }, [])

  const tryAutoLogin = useCallback(async (currentUrl?: string) => {
    const wv = wvRef.current
    if (!wv || !creds?.autoLogin || !creds.email || !creds.password) return
    const pageUrl = currentUrl ?? wv.getURL()
    // Only inject on login/signin pages — never on dashboard or other pages
    if (!pageUrl.includes('/login') && !pageUrl.includes('/signin') && !pageUrl.includes('/sign-in')) return
    setLoginStatus('injecting')
    try {
      const result = await wv.executeJavaScript(buildLoginScript(creds.email, creds.password))
      setLoginStatus(result ? 'done' : 'idle')
    } catch {
      setLoginStatus('idle')
    }
    setTimeout(() => setLoginStatus('idle'), 3000)
  }, [creds])

  // Webview event wiring
  useEffect(() => {
    const wv = wvRef.current
    if (!wv) return
    const onStart    = () => { setLoading(true); setLoadPct(20) }
    const onStop     = () => { setLoading(false); setLoadPct(100); setTimeout(() => setLoadPct(0), 400) }
    const onNav      = (e: any) => {
      const u = e.url ?? wv.getURL()
      setDisplayUrl(u)
      setCanBack(wv.canGoBack())
      setCanFwd(wv.canGoForward())
    }
    const onDomReady = () => {
      setCanBack(wv.canGoBack())
      setCanFwd(wv.canGoForward())
      tryAutoLogin(wv.getURL())
    }
    wv.addEventListener('did-start-loading',    onStart)
    wv.addEventListener('did-stop-loading',     onStop)
    wv.addEventListener('did-navigate',         onNav)
    wv.addEventListener('did-navigate-in-page', onNav)
    wv.addEventListener('dom-ready',            onDomReady)
    return () => {
      wv.removeEventListener('did-start-loading',    onStart)
      wv.removeEventListener('did-stop-loading',     onStop)
      wv.removeEventListener('did-navigate',         onNav)
      wv.removeEventListener('did-navigate-in-page', onNav)
      wv.removeEventListener('dom-ready',            onDomReady)
    }
  }, [tryAutoLogin])

  // Fake progress pulse
  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setLoadPct(p => Math.min(p + 3, 88)), 200)
    return () => clearInterval(t)
  }, [loading])

  const navigate = (u: string) => {
    const full = u.startsWith('http') ? u : `https://${u}`
    setUrl(full); setDisplayUrl(full)
    wvRef.current?.loadURL(full)
  }

  const saveCreds = async () => {
    setSaving(true)
    try {
      const api = (window as any).cryogram?.settings
      if (api) {
        await api.set('opticseo.email',     credForm.email)
        await api.set('opticseo.password',  credForm.password)
        await api.set('opticseo.autoLogin', credForm.autoLogin)
      }
      setCreds({ ...credForm })
      setShowCredsPanel(false)
      navigate(LOGIN_URL)
    } catch {}
    setSaving(false)
  }

  const isOnLoginPage = displayUrl.includes('/login') || displayUrl.includes('/signin')

  return (
    <div className="flex flex-col w-full h-full" style={{ background: 'rgba(8,12,18,0.98)' }}>

      {/* Toolbar */}
      <div className="flex items-center gap-1 shrink-0 px-2"
        style={{ height: 44, background: 'rgba(12,18,28,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <ToolbarBtn title="Back"    disabled={!canBack} onClick={() => wvRef.current?.goBack()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Forward" disabled={!canFwd} onClick={() => wvRef.current?.goForward()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Reload" onClick={() => wvRef.current?.reload()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Go to Dashboard" onClick={() => navigate(DASHBOARD_URL)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </ToolbarBtn>

        {/* URL bar */}
        <form className="flex-1 mx-2" onSubmit={e => { e.preventDefault(); navigate(displayUrl) }}>
          <input
            value={displayUrl} onChange={e => setDisplayUrl(e.target.value)} spellCheck={false}
            style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '4px 10px', fontSize: 12, color: 'rgba(255,255,255,0.75)',
              outline: 'none', fontFamily: '-apple-system, monospace' }}
            onFocus={e => { e.target.select(); e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)' }}
            onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </form>

        {/* Manual login inject — visible only on login page when creds saved */}
        {isOnLoginPage && creds?.email && (
          <ToolbarBtn title="Inject credentials now" onClick={() => tryAutoLogin()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke={loginStatus === 'done' ? '#10b981' : 'currentColor'}
              strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </ToolbarBtn>
        )}

        <ToolbarBtn title="Credentials" onClick={() => setShowCredsPanel(v => !v)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
        </ToolbarBtn>
      </div>

      {/* Progress bar */}
      {loadPct > 0 && (
        <div className="relative h-0.5 shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div className="absolute left-0 top-0 h-full"
            animate={{ width: `${loadPct}%` }} transition={{ duration: 0.2 }}
            style={{ background: 'linear-gradient(90deg,#10b981,#34d399)', boxShadow: '0 0 8px #10b981' }} />
        </div>
      )}

      {/* Auto-login status pill */}
      <AnimatePresence>
        {loginStatus === 'injecting' && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full text-xs font-semibold pointer-events-none"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981' }}>
            Filling credentials…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Credentials panel */}
      <AnimatePresence>
        {showCredsPanel && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 460, damping: 30 }}
            className="shrink-0 px-4 py-3 flex items-center gap-3 flex-wrap"
            style={{ background: 'rgba(16,24,36,0.97)', borderBottom: '1px solid rgba(16,185,129,0.25)' }}>
            <span style={{ fontSize: 11, color: '#10b981', fontFamily: '-apple-system, sans-serif', fontWeight: 600 }}>
              OpticSEO Pro — Login Credentials
            </span>
            <input type="email" placeholder="Email / Username" value={credForm.email}
              onChange={e => setCredForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
            <input type="password" placeholder="Password" value={credForm.password}
              onChange={e => setCredForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.55)', cursor: 'pointer' }}>
              <input type="checkbox" checked={credForm.autoLogin}
                onChange={e => setCredForm(f => ({ ...f, autoLogin: e.target.checked }))}
                style={{ accentColor: '#10b981' }} />
              Auto-login
            </label>
            <button onClick={saveCreds} disabled={saving}
              style={{ padding: '4px 14px', borderRadius: 7, fontSize: 11, background: '#10b981', color: '#000',
                fontWeight: 600, border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : 'Save & Login'}
            </button>
            <button onClick={() => setShowCredsPanel(false)}
              style={{ padding: '4px 10px', borderRadius: 7, fontSize: 11,
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Webview */}
      <div className="flex-1 relative overflow-hidden">
        {/* @ts-ignore — Electron webview element */}
        <webview
          ref={wvRef as any}
          src={url}
          partition="persist:opticseo"
          useragent={USER_AGENT}
          allowpopups
          style={{ width: '100%', height: '100%', display: 'flex' }}
        />
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 7, padding: '4px 10px', fontSize: 11, color: 'rgba(255,255,255,0.8)',
  outline: 'none', width: 180, fontFamily: '-apple-system, sans-serif',
}
