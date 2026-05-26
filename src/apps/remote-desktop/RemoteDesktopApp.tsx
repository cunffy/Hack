import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const api = () => (window as any).cryogram?.remoteDesktop

interface Deps { x11vnc: boolean; websockify: boolean; novnc: boolean }
interface Session { ip: string; url: string; vncPort: number; wsPort: number; httpPort: number }

function UrlRow({ label, url, color = 'green' }: { label: string; url: string; color?: 'green' | 'purple' }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const accent = color === 'purple' ? 'text-purple-300' : 'text-green-300'
  return (
    <div className="bg-gray-900 rounded-lg px-3 py-2 space-y-1">
      <p className={`text-xs font-semibold uppercase tracking-wider ${color === 'purple' ? 'text-purple-400' : 'text-green-500'}`}>{label}</p>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold flex-1 truncate ${accent}`}>{url}</span>
        <button onClick={copy}
          className={`text-xs px-2 py-0.5 rounded shrink-0 ${copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
          {copied ? '✓' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default function RemoteDesktopApp() {
  const [deps, setDeps]             = useState<Deps | null>(null)
  const [session, setSession]       = useState<Session | null>(null)
  const [running, setRunning]       = useState(false)
  const [loading, setLoading]       = useState<string | null>(null)
  const [logs, setLogs]             = useState<string[]>([])
  const [password, setPassword]     = useState('')
  const [viewOnly, setViewOnly]     = useState(false)
  const [tsStatus, setTsStatus]     = useState<TailscaleStatus | null>(null)
  const [tsLoading, setTsLoading]   = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-80), msg])
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50)
  }, [])

  const refreshTailscale = useCallback(async () => {
    const s = await api()?.tailscaleStatus()
    if (s) setTsStatus(s)
  }, [])

  useEffect(() => {
    api()?.checkDeps().then(setDeps)
    api()?.status().then((s: any) => setRunning(s?.running ?? false))
    refreshTailscale()

    const offLog     = api()?.onLog?.((msg: string) => addLog(msg))
    const offStopped = api()?.onStopped?.(() => { setRunning(false); setSession(null); addLog('Session ended.') })
    return () => { offLog?.(); offStopped?.() }
  }, [addLog, refreshTailscale])

  async function installDeps() {
    setLoading('install')
    addLog('Running: sudo apt-get install x11vnc novnc…')
    try {
      const res = await api()?.installDeps()
      if (res?.ok) {
        addLog('Installation complete.')
        const d = await api()?.checkDeps()
        setDeps(d)
      } else {
        addLog(`Failed: ${res?.error || 'unknown error'}`)
      }
    } catch (e: any) { addLog(`Error: ${e.message}`) }
    setLoading(null)
  }

  async function startSession() {
    setLoading('start')
    setLogs([])
    try {
      const res = await api()?.start({ password: password || undefined, viewOnly })
      if (res?.ok) {
        setSession(res)
        setRunning(true)
        addLog(`Session started — ${res.url}`)
      } else {
        addLog('Failed to start session.')
      }
    } catch (e: any) { addLog(`Error: ${e.message}`) }
    setLoading(null)
  }

  async function stopSession() {
    setLoading('stop')
    try {
      await api()?.stop()
      setRunning(false)
      setSession(null)
      addLog('Session stopped.')
    } catch {}
    setLoading(null)
  }

  async function installTailscale() {
    setTsLoading('install')
    addLog('Installing Tailscale…')
    try {
      const res = await api()?.installTailscale()
      if (res?.ok) { addLog('Tailscale installed.'); await refreshTailscale() }
      else addLog(`Failed: ${res?.error ?? 'unknown error'}`)
    } catch (e: any) { addLog(`Error: ${e.message}`) }
    setTsLoading(null)
  }

  async function connectTailscale() {
    setTsLoading('up')
    addLog('Connecting Tailscale (check browser for auth URL)…')
    try {
      await api()?.tailscaleUp()
      await refreshTailscale()
    } catch (e: any) { addLog(`Error: ${e.message}`) }
    setTsLoading(null)
  }

  const missingDeps = deps && (!deps.x11vnc || !deps.websockify)
  const tsUrl = running && session && tsStatus?.running && tsStatus.ip
    ? `http://${tsStatus.ip}:${session.httpPort}`
    : null

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-100 font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <div className={`w-2.5 h-2.5 rounded-full ${running ? 'bg-green-400 shadow-[0_0_6px_#4ade80]' : 'bg-gray-600'}`} />
        <span className="font-bold text-green-400">Remote Desktop</span>
        <span className="text-xs text-gray-500 ml-1">{running ? 'Session active' : 'Stopped'}</span>
        {tsStatus?.running && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-purple-400">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_#a78bfa]" />
            Tailscale connected
          </span>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — controls */}
        <div className="w-72 flex flex-col gap-4 p-4 border-r border-gray-800 overflow-y-auto shrink-0">

          {/* Deps check */}
          {deps && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-3 space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Dependencies</p>
              {[
                { name: 'x11vnc', ok: deps.x11vnc, hint: 'VNC server' },
                { name: 'websockify', ok: deps.websockify, hint: 'WebSocket proxy' },
                { name: 'novnc', ok: deps.novnc, hint: 'Web client (optional)' },
              ].map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className={`text-xs ${d.ok ? 'text-green-400' : 'text-red-400'}`}>{d.ok ? '✓' : '✗'}</span>
                  <span className="text-xs text-gray-300">{d.name}</span>
                  <span className="text-xs text-gray-600 ml-auto">{d.hint}</span>
                </div>
              ))}
              {missingDeps && (
                <button onClick={installDeps} disabled={loading === 'install'}
                  className="w-full mt-2 text-xs px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-black font-semibold rounded">
                  {loading === 'install' ? 'Installing…' : 'Install Missing'}
                </button>
              )}
            </div>
          )}

          {/* Tailscale section */}
          {tsStatus !== null && (
            <div className="bg-gray-900 rounded-lg border border-purple-900/40 p-3 space-y-2">
              <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">Tailscale (Remote Access)</p>
              {!tsStatus.installed ? (
                <>
                  <p className="text-xs text-gray-400">Not installed. Install Tailscale to access this machine from anywhere — no VPN or port-forwarding needed.</p>
                  <button onClick={installTailscale} disabled={tsLoading === 'install'}
                    className="w-full text-xs px-3 py-1.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold rounded">
                    {tsLoading === 'install' ? 'Installing…' : 'Install Tailscale'}
                  </button>
                </>
              ) : !tsStatus.running ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-yellow-400">✗</span>
                    <span className="text-xs text-gray-300">Tailscale not connected</span>
                  </div>
                  <button onClick={connectTailscale} disabled={tsLoading === 'up'}
                    className="w-full text-xs px-3 py-1.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold rounded">
                    {tsLoading === 'up' ? 'Connecting…' : 'Connect Tailscale'}
                  </button>
                  <p className="text-xs text-gray-500">A browser tab will open for authentication.</p>
                </>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">✓</span>
                    <span className="text-xs text-gray-300">Connected</span>
                    {tsStatus.hostname && <span className="text-xs text-gray-500 ml-auto">{tsStatus.hostname}</span>}
                  </div>
                  {tsStatus.ip && (
                    <div className="text-xs text-purple-300 font-mono">{tsStatus.ip}</div>
                  )}
                  {running && tsUrl && (
                    <p className="text-xs text-gray-400 pt-1">Use the Tailscale URL below to connect from any device on your Tailscale network.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Options */}
          {!running && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-3 space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Options</p>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Session Password (optional)</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Leave blank for no password"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-green-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={viewOnly} onChange={e => setViewOnly(e.target.checked)}
                  className="accent-green-500" />
                <span className="text-xs text-gray-400">View only (no control)</span>
              </label>
            </div>
          )}

          {/* Start / Stop */}
          <button
            onClick={running ? stopSession : startSession}
            disabled={!!loading || !!(deps && missingDeps && !running)}
            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-40 ${
              running
                ? 'bg-red-700 hover:bg-red-600 text-white'
                : 'bg-green-600 hover:bg-green-500 text-black'
            }`}>
            {loading === 'start' ? 'Starting…' : loading === 'stop' ? 'Stopping…' : running ? '⏹ Stop Session' : '▶ Start Session'}
          </button>

          {/* Active session info */}
          <AnimatePresence>
            {running && session && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-green-950/30 border border-green-800/50 rounded-lg p-4 space-y-3">
                <p className="text-xs text-green-400 font-semibold uppercase tracking-wider">Connect from your phone</p>

                <UrlRow label="Local Network (same Wi-Fi)" url={session.url} color="green" />

                {tsUrl && (
                  <UrlRow label="Tailscale (anywhere)" url={tsUrl} color="purple" />
                )}

                {/* Instructions */}
                <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                  {tsUrl
                    ? <>
                        <li>Use the <strong className="text-purple-300">Tailscale URL</strong> to connect from <em>any</em> device on your Tailscale network</li>
                        <li>Use the <strong className="text-green-300">Local URL</strong> when on the same Wi-Fi</li>
                      </>
                    : <li>Make sure phone is on the <strong className="text-gray-300">same Wi-Fi network</strong></li>
                  }
                  <li>Open the URL in your phone browser (Safari, Chrome, Firefox)</li>
                  <li>Tap <strong className="text-gray-300">Connect</strong> in the noVNC panel</li>
                  {password && <li>Enter the session password</li>}
                  <li>You now have full control</li>
                </ol>

                <div className="text-xs text-gray-600 pt-1 border-t border-gray-800">
                  VNC :{session.vncPort} · WS :{session.wsPort} · HTTP :{session.httpPort}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel — log */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Session Log</span>
            <button onClick={() => setLogs([])} className="text-xs text-gray-600 hover:text-gray-400">Clear</button>
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs">
            {logs.length === 0 && (
              <p className="text-gray-600">Start a session to see logs…</p>
            )}
            {logs.map((l, i) => (
              <p key={i} className="text-gray-400 leading-relaxed">{l}</p>
            ))}
          </div>

          {/* Usage tips */}
          {!running && (
            <div className="border-t border-gray-800 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">How it works</p>
              <div className="grid grid-cols-4 gap-3 text-xs text-gray-500">
                <div className="bg-gray-900 rounded p-3">
                  <p className="text-gray-300 font-semibold mb-1">1. Start Session</p>
                  <p>x11vnc captures your screen. websockify opens a WebSocket tunnel.</p>
                </div>
                <div className="bg-gray-900 rounded p-3">
                  <p className="text-gray-300 font-semibold mb-1">2. Same Network</p>
                  <p>Open the Local URL in your phone's browser while on the same Wi-Fi.</p>
                </div>
                <div className="bg-gray-900 rounded p-3">
                  <p className="text-gray-300 font-semibold mb-1 text-purple-300">3. Anywhere</p>
                  <p>Connect Tailscale for remote access from any device, over any network.</p>
                </div>
                <div className="bg-gray-900 rounded p-3">
                  <p className="text-gray-300 font-semibold mb-1">4. Full Control</p>
                  <p>Touch = mouse click. Drag = move. On-screen keyboard for typing.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
