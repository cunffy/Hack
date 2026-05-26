import React, { useState, useEffect, useRef } from 'react';

type Category = 'All' | 'Passwords' | 'Usernames' | 'Fuzzing' | 'Custom';

interface WordlistEntry {
  id: string;
  name: string;
  path: string;
  lines: number;
  size: number;
  category: Exclude<Category, 'All'>;
}

interface DownloadPreset {
  name: string;
  description: string;
  url: string;
  category: Exclude<Category, 'All'>;
}

const PRESETS: DownloadPreset[] = [
  {
    name: 'rockyou.txt',
    description: '14M passwords — classic password cracking wordlist',
    url: 'https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt',
    category: 'Passwords',
  },
  {
    name: '100-common-passwords.txt',
    description: 'SecLists 100 most common passwords',
    url: 'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-100.txt',
    category: 'Passwords',
  },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const CATEGORIES: Category[] = ['All', 'Passwords', 'Usernames', 'Fuzzing', 'Custom'];

const CATEGORY_COLORS: Record<string, string> = {
  Passwords: '#ff6b6b',
  Usernames: '#00d4ff',
  Fuzzing: '#ffaa00',
  Custom: '#a78bfa',
};

interface DownloadProgress {
  id: string;
  loaded: number;
  total: number;
  done: boolean;
  error?: string;
}

export default function WordlistApp() {
  const [library, setLibrary] = useState<WordlistEntry[]>([]);
  const [selected, setSelected] = useState<WordlistEntry | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category>('All');
  const [previewLines, setPreviewLines] = useState<string[]>([]);
  const [previewSearch, setPreviewSearch] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<Exclude<Category, 'All'>>('Passwords');
  const [copied, setCopied] = useState(false);
  const [downloads, setDownloads] = useState<Record<string, DownloadProgress>>({});
  const abortRefs = useRef<Record<string, AbortController>>({});

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    const data = await (window as any).cryogram?.settings?.get('wordlists.library');
    if (Array.isArray(data)) setLibrary(data);
  };

  const saveLibrary = async (lib: WordlistEntry[]) => {
    setLibrary(lib);
    await (window as any).cryogram?.settings?.set('wordlists.library', lib);
  };

  const selectEntry = async (entry: WordlistEntry) => {
    setSelected(entry);
    setEditName(entry.name);
    setEditCategory(entry.category);
    setPreviewLines([]);
    setPreviewSearch('');
    setPreviewLoading(true);
    try {
      const content = await (window as any).cryogram?.files?.readFile(entry.path);
      if (typeof content === 'string') {
        setPreviewLines(content.split('\n').slice(0, 50));
      }
    } catch {
      setPreviewLines(['(Could not read file)']);
    } finally {
      setPreviewLoading(false);
    }
  };

  const addWordlist = async () => {
    const path = await (window as any).cryogram?.files?.openDialog('open');
    if (!path) return;
    try {
      const stat = await (window as any).cryogram?.files?.stat(path);
      const content = await (window as any).cryogram?.files?.readFile(path);
      const lines = typeof content === 'string' ? content.split('\n').length : 0;
      const name = path.split('/').pop() || path.split('\\').pop() || path;
      const entry: WordlistEntry = {
        id: Date.now().toString(),
        name,
        path,
        lines,
        size: stat?.size ?? 0,
        category: 'Custom',
      };
      const updated = [...library, entry];
      await saveLibrary(updated);
      selectEntry(entry);
    } catch (e) {
      console.error('Failed to add wordlist', e);
    }
  };

  const updateEntry = async () => {
    if (!selected) return;
    const updated = library.map(e =>
      e.id === selected.id ? { ...e, name: editName, category: editCategory } : e
    );
    await saveLibrary(updated);
    setSelected(prev => prev ? { ...prev, name: editName, category: editCategory } : prev);
  };

  const deleteEntry = async () => {
    if (!selected) return;
    const updated = library.filter(e => e.id !== selected.id);
    await saveLibrary(updated);
    setSelected(null);
  };

  const copyPath = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.path).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const downloadPreset = async (preset: DownloadPreset) => {
    const id = preset.name;
    const controller = new AbortController();
    abortRefs.current[id] = controller;
    setDownloads(prev => ({ ...prev, [id]: { id, loaded: 0, total: 0, done: false } }));

    try {
      const res = await fetch(preset.url, { signal: controller.signal });
      const total = parseInt(res.headers.get('content-length') || '0', 10);
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No body');

      const chunks: Uint8Array[] = [];
      let loaded = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        setDownloads(prev => ({ ...prev, [id]: { id, loaded, total, done: false } }));
      }

      const blob = new Blob(chunks as BlobPart[]);
      const text = await blob.text();
      const lines = text.split('\n');

      // Save via IPC (fall back to just saving metadata if no write IPC)
      const savePath = await (window as any).cryogram?.files?.saveDialog?.(preset.name) ?? `/tmp/${preset.name}`;
      await (window as any).cryogram?.files?.writeFile?.(savePath, text);

      const entry: WordlistEntry = {
        id: Date.now().toString(),
        name: preset.name,
        path: savePath,
        lines: lines.length,
        size: blob.size,
        category: preset.category,
      };
      const updated = [...library.filter(e => e.name !== preset.name), entry];
      await saveLibrary(updated);
      setDownloads(prev => ({ ...prev, [id]: { id, loaded: blob.size, total: blob.size, done: true } }));
      selectEntry(entry);
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        setDownloads(prev => ({ ...prev, [id]: { ...prev[id], done: true, error: e?.message ?? 'Download failed' } }));
      }
    }
  };

  const filteredLibrary = library.filter(e => categoryFilter === 'All' || e.category === categoryFilter);
  const filteredPreview = previewSearch
    ? previewLines.filter(l => l.toLowerCase().includes(previewSearch.toLowerCase()))
    : previewLines;

  return (
    <div style={{
      display: 'flex', height: '100%',
      background: 'rgba(8,12,20,0.8)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      color: 'rgba(255,255,255,0.85)',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Category filter */}
        <div style={{ padding: '12px 10px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>Category</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '3px 8px',
                  background: categoryFilter === cat ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${categoryFilter === cat ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 4,
                  color: categoryFilter === cat ? 'var(--cryo-accent, #00d4ff)' : 'rgba(255,255,255,0.5)',
                  fontSize: 11, cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  transition: 'all 0.12s',
                }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          {filteredLibrary.length === 0 ? (
            <div style={{ padding: '20px 10px', fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>No wordlists</div>
          ) : (
            filteredLibrary.map(entry => (
              <button
                key={entry.id}
                onClick={() => selectEntry(entry)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '8px 10px', borderRadius: 6,
                  background: selected?.id === entry.id ? 'rgba(0,212,255,0.1)' : 'transparent',
                  border: `1px solid ${selected?.id === entry.id ? 'rgba(0,212,255,0.2)' : 'transparent'}`,
                  marginBottom: 2, cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (selected?.id !== entry.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (selected?.id !== entry.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <span style={{
                    fontSize: 10, padding: '0 5px', borderRadius: 3,
                    background: (CATEGORY_COLORS[entry.category] ?? '#888') + '22',
                    color: CATEGORY_COLORS[entry.category] ?? '#888',
                  }}>{entry.category}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{entry.lines.toLocaleString()} lines</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Add + Download */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={addWordlist}
            style={{
              padding: '7px 12px',
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.25)',
              borderRadius: 7, color: 'var(--cryo-accent, #00d4ff)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >+ Add Wordlist</button>

          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: 4 }}>Quick Download</div>
          {PRESETS.map(preset => {
            const dl = downloads[preset.name];
            const pct = dl && dl.total > 0 ? Math.round((dl.loaded / dl.total) * 100) : 0;
            return (
              <button
                key={preset.name}
                onClick={() => !dl || dl.done ? downloadPreset(preset) : undefined}
                disabled={!!dl && !dl.done}
                style={{
                  padding: '6px 10px', textAlign: 'left',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 6, cursor: dl && !dl.done ? 'default' : 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  overflow: 'hidden', position: 'relative',
                }}
              >
                {dl && !dl.done && (
                  <div style={{
                    position: 'absolute', inset: 0, left: 0, top: 0,
                    width: `${pct}%`, background: 'rgba(0,212,255,0.08)',
                    transition: 'width 0.2s',
                  }} />
                )}
                <div style={{ fontSize: 11, fontWeight: 600, color: dl?.done ? '#00ff88' : 'rgba(255,255,255,0.7)', position: 'relative' }}>{preset.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', position: 'relative' }}>
                  {dl && !dl.done ? `${pct}%...` : dl?.done ? (dl.error ?? 'Downloaded') : preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main area */}
      {selected ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Metadata header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'flex-start', gap: 16, flexShrink: 0,
          }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={updateEntry}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 6, padding: '6px 10px',
                  color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 700,
                  outline: 'none', width: '100%',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.3)')}
              />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: '"JetBrains Mono", monospace', wordBreak: 'break-all' }}>{selected.path}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <StatPill label="Lines" value={selected.lines.toLocaleString()} />
                <StatPill label="Size" value={formatSize(selected.size)} />
                <select
                  value={editCategory}
                  onChange={e => { setEditCategory(e.target.value as any); setTimeout(updateEntry, 0); }}
                  style={{
                    padding: '3px 8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 5, color: 'rgba(255,255,255,0.7)',
                    fontSize: 12, outline: 'none', cursor: 'pointer',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  }}
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={copyPath} style={btnStyle(copied ? '#00ff88' : undefined)}>
                {copied ? '✓ Copied!' : 'Copy Path'}
              </button>
              <button
                onClick={deleteEntry}
                style={{
                  ...btnStyle(),
                  background: 'rgba(255,77,77,0.08)',
                  borderColor: 'rgba(255,77,77,0.2)',
                  color: '#ff5050',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,77,77,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,77,77,0.08)')}
              >Delete from Library</button>
            </div>
          </div>

          {/* Preview */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '12px 20px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Preview</div>
              <input
                value={previewSearch}
                onChange={e => setPreviewSearch(e.target.value)}
                placeholder="Search in wordlist..."
                style={{
                  flex: 1, padding: '5px 10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 6, color: 'rgba(255,255,255,0.8)',
                  fontSize: 12, outline: 'none',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.3)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
              />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                {previewSearch ? `${filteredPreview.length} matches` : 'First 50 lines'}
              </span>
            </div>

            {previewLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <div style={{ width: 20, height: 20, border: '2px solid var(--cryo-accent, #00d4ff)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : (
              <div style={{
                flex: 1, overflowY: 'auto',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '8px 0',
              }}>
                {filteredPreview.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center',
                      padding: '2px 12px',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.2)', width: 36, flexShrink: 0, textAlign: 'right', marginRight: 12, fontSize: 11 }}>{i + 1}</span>
                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyMainState onAdd={addWordlist} onDownload={downloadPreset} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: '3px 10px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 5, fontSize: 12,
    }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', marginRight: 5 }}>{label}:</span>
      <span style={{ color: 'rgba(255,255,255,0.8)', fontFamily: '"JetBrains Mono", monospace' }}>{value}</span>
    </div>
  );
}

function btnStyle(color?: string): React.CSSProperties {
  return {
    padding: '6px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    color: color ?? 'rgba(255,255,255,0.65)',
    fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    transition: 'all 0.12s',
  };
}

function EmptyMainState({ onAdd, onDownload }: { onAdd: () => void; onDownload: (p: DownloadPreset) => void }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      color: 'rgba(255,255,255,0.3)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      <div style={{ fontSize: 36 }}>📂</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>No wordlist selected</div>
      <div style={{ fontSize: 13, textAlign: 'center', maxWidth: 320, lineHeight: '1.7' }}>
        Add a wordlist from your filesystem, or download a popular one from the sidebar.
      </div>
      <button
        onClick={onAdd}
        style={{
          padding: '9px 22px',
          background: 'rgba(0,212,255,0.1)',
          border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: 8, color: 'var(--cryo-accent, #00d4ff)',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}
      >+ Add Wordlist</button>
    </div>
  );
}
