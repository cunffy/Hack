import { useEffect, useRef, useCallback } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'

const SESSION_ID = () => `term_${Math.random().toString(36).slice(2)}`

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const sessionIdRef = useRef<string>(SESSION_ID())
  const cleanupRef = useRef<(() => void) | null>(null)
  const resizeCleanupRef = useRef<(() => void) | null>(null)

  const init = useCallback(async () => {
    if (!containerRef.current || termRef.current) return

    const term = new XTerm({
      theme: {
        background: '#0a0e14',
        foreground: '#c9d1d9',
        cursor: '#00d4ff',
        cursorAccent: '#0a0e14',
        black: '#0a0e14',
        brightBlack: '#6e7681',
        red: '#ff4466',
        brightRed: '#ff6688',
        green: '#00ff88',
        brightGreen: '#44ffaa',
        yellow: '#ffcc00',
        brightYellow: '#ffdd44',
        blue: '#00d4ff',
        brightBlue: '#44ddff',
        magenta: '#bb88ff',
        brightMagenta: '#cc99ff',
        cyan: '#00ffcc',
        brightCyan: '#44ffdd',
        white: '#c9d1d9',
        brightWhite: '#ffffff',
      },
      fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
      fontSize: 13,
      lineHeight: 1.4,
      cursorBlink: true,
      scrollback: 5000,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(containerRef.current)
    fitAddon.fit()

    termRef.current = term
    fitAddonRef.current = fitAddon

    const id = sessionIdRef.current
    const { cols, rows } = term
    await window.cyberden.terminal.create(id, cols, rows)

    term.onData((data) => window.cyberden.terminal.write(id, data))

    const removeListener = window.cyberden.terminal.onData(id, (data) => term.write(data))
    cleanupRef.current = removeListener

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit()
      const { cols, rows } = term
      window.cyberden.terminal.resize(id, cols, rows)
    })
    resizeObserver.observe(containerRef.current)
    resizeCleanupRef.current = () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    init()
    return () => {
      cleanupRef.current?.()
      resizeCleanupRef.current?.()
      const id = sessionIdRef.current
      window.cyberden.terminal.destroy(id)
      termRef.current?.dispose()
    }
  }, [init])

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full h-full p-1"
      style={{ background: '#0a0e14' }}
    />
  )
}
