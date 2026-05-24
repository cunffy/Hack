import { useState, useEffect, useCallback } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { FileTree } from './FileTree'

const LANG_MAP: Record<string, string> = {
  js: 'javascript', ts: 'typescript', jsx: 'javascript', tsx: 'typescript',
  py: 'python', c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp',
  rs: 'rust', go: 'go', json: 'json', md: 'markdown',
  sh: 'shell', bash: 'shell', yaml: 'yaml', yml: 'yaml',
  toml: 'toml', css: 'css', html: 'html', sql: 'sql',
}

const RUN_COMMANDS: Record<string, string> = {
  python: 'python3 "{file}"',
  javascript: 'node "{file}"',
  typescript: 'npx ts-node "{file}"',
  c: 'gcc "{file}" -o /tmp/cryogram_c_out && /tmp/cryogram_c_out',
  cpp: 'g++ "{file}" -o /tmp/cryogram_cpp_out && /tmp/cryogram_cpp_out',
  rust: 'rustc "{file}" -o /tmp/cryogram_rs_out && /tmp/cryogram_rs_out',
  go: 'go run "{file}"',
  shell: 'bash "{file}"',
}

interface OpenFile {
  path: string
  name: string
  content: string
  lang: string
  dirty: boolean
}

export default function Editor() {
  const [workspace, setWorkspace] = useState<string | null>(null)
  const [files, setFiles] = useState<OpenFile[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    window.cryogram.fs.getWorkspace().then(setWorkspace)
  }, [])

  const openFile = useCallback(async (filePath: string, fileName: string) => {
    const existing = files.findIndex((f) => f.path === filePath)
    if (existing >= 0) { setActiveIdx(existing); return }
    try {
      const content = await window.cryogram.fs.readFile(filePath)
      const ext = fileName.split('.').pop() || ''
      const lang = LANG_MAP[ext] || 'plaintext'
      setFiles((prev) => {
        const next = [...prev, { path: filePath, name: fileName, content, lang, dirty: false }]
        setActiveIdx(next.length - 1)
        return next
      })
    } catch (err) {
      console.error('Failed to open file', err)
    }
  }, [])

  const saveFile = useCallback(async () => {
    const file = files[activeIdx]
    if (!file) return
    await window.cryogram.fs.writeFile(file.path, file.content)
    setFiles((prev) => prev.map((f, i) => i === activeIdx ? { ...f, dirty: false } : f))
  }, [files, activeIdx])

  const closeTab = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
    setActiveIdx((prev) => Math.max(0, prev > idx ? prev - 1 : prev))
  }, [])

  const runFile = useCallback(async () => {
    const file = files[activeIdx]
    if (!file) return
    setRunning(true)
    setOutput('Running...\n')
    // Save first
    await window.cryogram.fs.writeFile(file.path, file.content)
    const cmd = RUN_COMMANDS[file.lang]
    if (!cmd) { setOutput(`No runner configured for ${file.lang}`); setRunning(false); return }
    // Fire via terminal IPC would require a new terminal session;
    // for simplicity we show the command to run
    setOutput(`$ ${cmd.replace('{file}', file.path)}\n\nOpen the Terminal app and run the command above to execute this file.`)
    setRunning(false)
  }, [files, activeIdx])

  const activeFile = files[activeIdx]

  if (!workspace) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
        <div className="text-cryo-muted text-sm">No workspace selected</div>
        <button
          className="btn btn-primary"
          onClick={async () => {
            const path = await window.cryogram.fs.openDialog()
            if (path) setWorkspace(path)
          }}
        >
          Open Workspace Folder
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* File tree sidebar */}
      <div className="w-48 shrink-0 border-r border-cryo-border overflow-auto">
        <FileTree workspace={workspace} onOpenFile={openFile} />
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center border-b border-cryo-border bg-cryo-surface overflow-x-auto shrink-0">
          {files.map((f, idx) => (
            <div
              key={f.path}
              onClick={() => setActiveIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-r border-cryo-border cursor-pointer shrink-0 text-xs transition-colors ${
                idx === activeIdx ? 'bg-cryo-bg text-cryo-text' : 'text-cryo-muted hover:text-cryo-text'
              }`}
            >
              <span className="max-w-28 truncate">{f.name}{f.dirty ? ' •' : ''}</span>
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(idx) }}
                className="text-cryo-muted hover:text-cryo-red w-3.5 h-3.5 flex items-center justify-center rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {activeFile ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-cryo-border bg-cryo-surface shrink-0">
              <span className="text-xs text-cryo-muted flex-1 truncate">{activeFile.path}</span>
              <span className="badge text-cryo-muted" style={{ background: '#1e2d40' }}>{activeFile.lang}</span>
              <button className="btn text-xs py-1 px-2" onClick={saveFile}>Save</button>
              <button
                className="btn btn-success text-xs py-1 px-2"
                onClick={runFile}
                disabled={running}
              >
                Run
              </button>
            </div>

            <MonacoEditor
              height={output ? '65%' : '100%'}
              language={activeFile.lang}
              value={activeFile.content}
              theme="vs-dark"
              options={{
                fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                fontSize: 13,
                lineHeight: 1.6,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                renderLineHighlight: 'gutter',
                padding: { top: 8, bottom: 8 },
              }}
              onChange={(val) => {
                if (val === undefined) return
                setFiles((prev) =>
                  prev.map((f, i) => i === activeIdx ? { ...f, content: val, dirty: true } : f)
                )
              }}
            />

            {output && (
              <div className="border-t border-cryo-border bg-cryo-bg p-3 overflow-auto font-mono text-xs text-cryo-green whitespace-pre" style={{ height: '35%' }}>
                {output}
                <button className="btn text-xs mt-2" onClick={() => setOutput(null)}>Clear</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-cryo-muted text-sm">
            Double-click a file to open it
          </div>
        )}
      </div>
    </div>
  )
}
