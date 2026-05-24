import { useState, useEffect, useRef } from 'react'

type Mode = 'bruteforce' | 'dictionary' | 'hybrid' | 'rainbow'
type Algorithm = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'ntlm' | 'bcrypt'

const ALGORITHMS: Algorithm[] = ['md5', 'sha1', 'sha256', 'sha512', 'ntlm', 'bcrypt']
const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: 'bruteforce', label: 'Brute Force', desc: 'Try all charset combinations up to N chars' },
  { id: 'dictionary', label: 'Dictionary', desc: 'Test words from a wordlist file' },
  { id: 'hybrid', label: 'Hybrid', desc: 'Dictionary + numeric/symbol rules' },
  { id: 'rainbow', label: 'Rainbow Table', desc: 'Lookup in pre-computed table' },
]

export function HashCracker() {
  const [mode, setMode] = useState<Mode>('dictionary')
  const [algorithm, setAlgorithm] = useState<Algorithm>('md5')
  const [hash, setHash] = useState('')
  const [wordlistPath, setWordlistPath] = useState('')
  const [maxLength, setMaxLength] = useState(6)
  const [charsets, setCharsets] = useState<string[]>(['lowercase', 'digits'])
  const [rainbowPath, setRainbowPath] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<CrackResult | null>(null)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const jobIdRef = useRef<string | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const cleanup = window.cryogram.passwordTester.onProgress((data) => {
      if (data.jobId === jobIdRef.current) setProgress(data)
    })
    cleanupRef.current = cleanup
    return cleanup
  }, [])

  const run = async () => {
    if (!hash.trim()) { setError('Enter a hash to crack'); return }
    setRunning(true)
    setResult(null)
    setError(null)
    setProgress(null)

    const opts: CrackOptions = {
      mode,
      hash: hash.trim(),
      algorithm,
      wordlistPath: (mode === 'dictionary' || mode === 'hybrid') ? wordlistPath : undefined,
      maxLength: mode === 'bruteforce' ? maxLength : undefined,
      charsets: mode === 'bruteforce' ? charsets : undefined,
      rainbowTablePath: mode === 'rainbow' ? rainbowPath : undefined,
    }

    try {
      const res = await window.cryogram.passwordTester.runCrack(opts)
      jobIdRef.current = res.jobId
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Crack job failed')
    } finally {
      setRunning(false)
    }
  }

  const cancel = () => {
    if (jobIdRef.current) window.cryogram.passwordTester.cancel(jobIdRef.current)
    setRunning(false)
  }

  const toggleCharset = (c: string) => {
    setCharsets((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
  }

  return (
    <div className="flex flex-col gap-4 p-4 overflow-auto flex-1">
      <div className="grid grid-cols-2 gap-4">
        {/* Mode */}
        <div>
          <label className="block text-xs text-cryo-muted mb-2 uppercase tracking-wider">Mode</label>
          <div className="space-y-1">
            {MODES.map((m) => (
              <label key={m.id} className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="mode"
                  value={m.id}
                  checked={mode === m.id}
                  onChange={() => setMode(m.id)}
                  className="mt-0.5 accent-cryo-accent"
                />
                <div>
                  <div className="text-xs text-cryo-text">{m.label}</div>
                  <div className="text-xs text-cryo-muted">{m.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Algorithm */}
        <div>
          <label className="block text-xs text-cryo-muted mb-2 uppercase tracking-wider">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="w-full"
          >
            {ALGORITHMS.map((a) => (
              <option key={a} value={a}>{a.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hash input */}
      <div>
        <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Hash</label>
        <input
          className="w-full font-mono"
          placeholder="Paste hash here..."
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />
      </div>

      {/* Mode-specific options */}
      {(mode === 'dictionary' || mode === 'hybrid') && (
        <div>
          <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Wordlist Path</label>
          <input
            className="w-full"
            placeholder="/path/to/rockyou.txt"
            value={wordlistPath}
            onChange={(e) => setWordlistPath(e.target.value)}
          />
        </div>
      )}

      {mode === 'bruteforce' && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Max Length</label>
            <input
              type="number"
              min={1}
              max={12}
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Charsets</label>
            <div className="flex flex-wrap gap-2">
              {['lowercase', 'uppercase', 'digits', 'symbols'].map((c) => (
                <label key={c} className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={charsets.includes(c)}
                    onChange={() => toggleCharset(c)}
                    className="accent-cryo-accent"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'rainbow' && (
        <div>
          <label className="block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider">Rainbow Table Path</label>
          <input
            className="w-full"
            placeholder="/path/to/table.rt"
            value={rainbowPath}
            onChange={(e) => setRainbowPath(e.target.value)}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="btn btn-primary flex-1 justify-center"
          onClick={run}
          disabled={running}
        >
          {running ? 'Cracking...' : 'Start Crack'}
        </button>
        {running && (
          <button className="btn btn-danger" onClick={cancel}>Cancel</button>
        )}
      </div>

      {/* Progress */}
      {running && progress && (
        <div className="panel p-3 text-xs space-y-1">
          <div className="flex justify-between text-cryo-muted">
            <span>Attempts: <span className="text-cryo-text">{progress.attempts.toLocaleString()}</span></span>
            <span>Rate: <span className="text-cryo-text">{progress.rate.toLocaleString()}/s</span></span>
            <span>Elapsed: <span className="text-cryo-text">{progress.elapsed.toFixed(1)}s</span></span>
          </div>
          {progress.currentWord && (
            <div className="text-cryo-muted">Current: <span className="text-cryo-accent font-mono">{progress.currentWord}</span></div>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`panel p-4 ${result.found ? 'border-cryo-green/50' : 'border-cryo-red/50'}`} style={{ borderColor: result.found ? 'rgba(0,255,136,0.5)' : 'rgba(255,68,102,0.5)' }}>
          {result.found ? (
            <>
              <div className="text-cryo-green font-bold mb-2">Password Found!</div>
              <div className="font-mono text-cryo-accent text-lg">{result.password}</div>
              <div className="text-xs text-cryo-muted mt-2">
                {result.attempts.toLocaleString()} attempts · {result.elapsed.toFixed(2)}s
              </div>
            </>
          ) : (
            <>
              <div className="text-cryo-red font-bold">Not Found</div>
              <div className="text-xs text-cryo-muted mt-1">
                Exhausted {result.attempts.toLocaleString()} attempts in {result.elapsed.toFixed(2)}s
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="panel p-3 text-xs text-cryo-red border-cryo-red/30">
          Error: {error}
        </div>
      )}
    </div>
  )
}
