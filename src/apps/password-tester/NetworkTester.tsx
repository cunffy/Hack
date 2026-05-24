import { useState, useEffect, useRef } from 'react'

type Protocol = 'ssh' | 'http' | 'ftp' | 'smtp'
type Mode = 'bruteforce' | 'dictionary' | 'spraying'

export function NetworkTester() {
  const [mode, setMode] = useState<Mode>('dictionary')
  const [protocol, setProtocol] = useState<Protocol>('ssh')
  const [target, setTarget] = useState('')
  const [port, setPort] = useState('')
  const [username, setUsername] = useState('')
  const [usernames, setUsernames] = useState('')
  const [password, setPassword] = useState('')
  const [wordlistPath, setWordlistPath] = useState('')
  const [rateLimit, setRateLimit] = useState(5)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<NetworkTestResult | null>(null)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const jobIdRef = useRef<string | null>(null)

  useEffect(() => {
    const cleanup = window.cryogram.passwordTester.onProgress((data) => {
      if (data.jobId === jobIdRef.current) setProgress(data)
    })
    return cleanup
  }, [])

  const run = async () => {
    if (!target.trim()) { setError('Enter a target host'); return }
    setRunning(true)
    setResult(null)
    setError(null)
    setProgress(null)

    const opts: NetworkTestOptions = {
      mode,
      protocol,
      target: target.trim(),
      port: port ? Number(port) : undefined,
      username: mode !== 'spraying' ? username : undefined,
      usernames: mode === 'spraying' ? usernames.split('\n').filter(Boolean) : undefined,
      password: mode === 'spraying' ? password : undefined,
      wordlistPath: mode !== 'spraying' ? wordlistPath : undefined,
      rateLimit,
    }

    try {
      const res = await window.cryogram.passwordTester.runNetwork(opts)
      jobIdRef.current = res.jobId
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network test failed')
    } finally {
      setRunning(false)
    }
  }

  const cancel = () => {
    if (jobIdRef.current) window.cryogram.passwordTester.cancel(jobIdRef.current)
    setRunning(false)
  }

  return (
    <div className="flex flex-col gap-4 p-4 overflow-auto flex-1">
      <div className="panel p-3 text-xs text-cryo-yellow border-cryo-yellow/30 flex items-start gap-2">
        <span>⚠</span>
        <span>Only test systems you own or have explicit written authorization to test. Unauthorized access testing is illegal.</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="w-full">
            <option value="dictionary">Dictionary</option>
            <option value="bruteforce">Brute Force</option>
            <option value="spraying">Password Spray</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Protocol</label>
          <select value={protocol} onChange={(e) => setProtocol(e.target.value as Protocol)} className="w-full">
            <option value="ssh">SSH</option>
            <option value="http">HTTP Basic</option>
            <option value="ftp">FTP</option>
            <option value="smtp">SMTP Auth</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Rate Limit (req/s)</label>
          <input
            type="number"
            min={1}
            max={50}
            value={rateLimit}
            onChange={(e) => setRateLimit(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Target Host</label>
          <input
            className="w-full"
            placeholder="192.168.1.1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        <div className="w-24">
          <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Port</label>
          <input
            className="w-full"
            placeholder="auto"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
        </div>
      </div>

      {mode !== 'spraying' && (
        <div>
          <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Username</label>
          <input
            className="w-full"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      )}

      {mode !== 'spraying' && (
        <div>
          <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Password Wordlist</label>
          <input
            className="w-full"
            placeholder="/path/to/wordlist.txt"
            value={wordlistPath}
            onChange={(e) => setWordlistPath(e.target.value)}
          />
        </div>
      )}

      {mode === 'spraying' && (
        <>
          <div>
            <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Password to Spray</label>
            <input
              className="w-full"
              placeholder="Password123!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Usernames (one per line)</label>
            <textarea
              className="w-full h-24 resize-none"
              placeholder={"user1\nuser2\nadmin"}
              value={usernames}
              onChange={(e) => setUsernames(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="flex gap-2">
        <button className="btn btn-primary flex-1 justify-center" onClick={run} disabled={running}>
          {running ? 'Testing...' : 'Start Test'}
        </button>
        {running && (
          <button className="btn btn-danger" onClick={cancel}>Cancel</button>
        )}
      </div>

      {running && progress && (
        <div className="panel p-3 text-xs space-y-1">
          <div className="flex justify-between text-cryo-muted">
            <span>Attempts: <span className="text-cryo-text">{progress.attempts.toLocaleString()}</span></span>
            <span>Rate: <span className="text-cryo-text">{progress.rate.toFixed(1)}/s</span></span>
            <span>Elapsed: <span className="text-cryo-text">{progress.elapsed.toFixed(1)}s</span></span>
          </div>
          {progress.currentWord && (
            <div className="text-cryo-muted">Trying: <span className="text-cryo-accent font-mono">{progress.currentWord}</span></div>
          )}
        </div>
      )}

      {result && (
        <div className={`panel p-4`} style={{ borderColor: result.found ? 'rgba(0,255,136,0.5)' : 'rgba(255,68,102,0.5)' }}>
          {result.found && result.credentials ? (
            <>
              <div className="text-cryo-green font-bold mb-3">Credentials Found!</div>
              {result.credentials.map((c: { username: string; password: string }, i: number) => (
                <div key={i} className="font-mono text-sm mb-1">
                  <span className="text-cryo-muted">user: </span><span className="text-cryo-accent">{c.username}</span>
                  <span className="text-cryo-muted">  pass: </span><span className="text-cryo-green">{c.password}</span>
                </div>
              ))}
              <div className="text-xs text-cryo-muted mt-2">
                {result.attempts.toLocaleString()} attempts · {result.elapsed.toFixed(2)}s
              </div>
            </>
          ) : (
            <>
              <div className="text-cryo-red font-bold">No valid credentials found</div>
              <div className="text-xs text-cryo-muted mt-1">
                {result.attempts.toLocaleString()} attempts · {result.elapsed.toFixed(2)}s
              </div>
            </>
          )}
        </div>
      )}

      {error && <div className="panel p-3 text-xs text-cryo-red">{error}</div>}
    </div>
  )
}
