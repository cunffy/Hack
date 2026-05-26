import React, { useState, useCallback } from 'react';

type FormatTab = 'JSON' | 'YAML' | 'XML';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// ─── Simple YAML Parser ────────────────────────────────────────────────────────
function parseYAML(text: string): JsonValue {
  const lines = text.split('\n');

  function parseValue(raw: string): JsonValue {
    const v = raw.trim();
    if (v === 'null' || v === '~') return null;
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      return v.slice(1, -1);
    }
    return v;
  }

  function getIndent(line: string): number {
    let i = 0;
    while (i < line.length && line[i] === ' ') i++;
    return i;
  }

  function parseBlock(startIdx: number, baseIndent: number): [JsonValue, number] {
    const result: Record<string, JsonValue> = {};
    const arr: JsonValue[] = [];
    let isArray = false;
    let i = startIdx;

    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === '' || line.trim().startsWith('#')) { i++; continue; }
      const indent = getIndent(line);
      if (indent < baseIndent) break;
      const trimmed = line.trim();

      if (trimmed.startsWith('- ')) {
        isArray = true;
        const itemVal = trimmed.slice(2).trim();
        if (itemVal === '') {
          const [val, next] = parseBlock(i + 1, indent + 2);
          arr.push(val);
          i = next;
        } else {
          arr.push(parseValue(itemVal));
          i++;
        }
      } else if (trimmed.includes(':')) {
        const colonIdx = trimmed.indexOf(':');
        const key = trimmed.slice(0, colonIdx).trim();
        const rest = trimmed.slice(colonIdx + 1).trim();
        if (rest === '' || rest === '|' || rest === '>') {
          const [val, next] = parseBlock(i + 1, indent + 2);
          result[key] = val;
          i = next;
        } else {
          result[key] = parseValue(rest);
          i++;
        }
      } else {
        i++;
      }
    }
    return [isArray ? arr : result, i];
  }

  const [val] = parseBlock(0, 0);
  return val;
}

// ─── XML → JsonValue ───────────────────────────────────────────────────────────
function xmlDomToJson(node: Node): JsonValue {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? '').trim();
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const result: Record<string, JsonValue> = {};

  if (el.attributes.length > 0) {
    const attrs: Record<string, JsonValue> = {};
    Array.from(el.attributes).forEach(a => { attrs[a.name] = a.value; });
    result['@attributes'] = attrs;
  }

  const children = Array.from(el.childNodes).filter(
    c => !(c.nodeType === Node.TEXT_NODE && (c.textContent ?? '').trim() === '')
  );

  if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
    const text = (children[0].textContent ?? '').trim();
    if (el.attributes.length === 0) return text;
    result['#text'] = text;
    return result;
  }

  const childMap: Record<string, JsonValue[]> = {};
  children.forEach(child => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const key = (child as Element).tagName;
      if (!childMap[key]) childMap[key] = [];
      childMap[key].push(xmlDomToJson(child));
    }
  });

  Object.entries(childMap).forEach(([key, vals]) => {
    result[key] = vals.length === 1 ? vals[0] : vals;
  });

  return result;
}

// ─── Tree Node ─────────────────────────────────────────────────────────────────
interface TreeNodeProps {
  keyName: string | null;
  value: JsonValue;
  path: string;
  searchTerm: string;
  onSelectPath: (path: string) => void;
  depth: number;
  forceExpand?: boolean;
}

function matchesSearch(val: JsonValue, term: string): boolean {
  if (!term) return false;
  const t = term.toLowerCase();
  if (typeof val === 'string') return val.toLowerCase().includes(t);
  if (typeof val === 'number' || typeof val === 'boolean') return String(val).toLowerCase().includes(t);
  return false;
}

function TreeNode({ keyName, value, path, searchTerm, onSelectPath, depth, forceExpand }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [copiedFlash, setCopiedFlash] = useState(false);
  const [strExpanded, setStrExpanded] = useState(false);

  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;

  const isExpanded = forceExpand !== undefined ? forceExpand : expanded;

  const isHighlighted = searchTerm
    ? (keyName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) || matchesSearch(value, searchTerm)
    : false;

  const copyValue = () => {
    const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFlash(true);
      setTimeout(() => setCopiedFlash(false), 1000);
    });
  };

  const rowBase: React.CSSProperties = {
    display: 'flex', alignItems: 'flex-start', gap: 2,
    padding: '1px 0', paddingLeft: depth * 16,
    borderRadius: 3,
    background: isHighlighted ? 'rgba(0,212,255,0.07)' : 'transparent',
    fontFamily: '"JetBrains Mono", monospace', fontSize: 12, lineHeight: '1.7',
  };

  const renderScalar = () => {
    if (value === null) return <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>null</span>;
    if (typeof value === 'boolean') return <span style={{ color: '#ffaa00' }}>{String(value)}</span>;
    if (typeof value === 'number') return <span style={{ color: 'var(--cryo-accent, #00d4ff)' }}>{value}</span>;
    if (typeof value === 'string') {
      const MAX = 80;
      if (value.length > MAX && !strExpanded) {
        return (
          <span style={{ color: '#4ade80' }}>
            &ldquo;{value.slice(0, MAX)}&hellip;&rdquo;
            <button onClick={e => { e.stopPropagation(); setStrExpanded(true); }} style={{
              background: 'none', border: 'none', color: 'rgba(0,212,255,0.7)', cursor: 'pointer',
              fontSize: 10, padding: '0 4px', fontFamily: '"JetBrains Mono",monospace',
            }}>show</button>
          </span>
        );
      }
      return (
        <span style={{ color: '#4ade80' }}>
          &ldquo;{value}&rdquo;
          {value.length > MAX && (
            <button onClick={e => { e.stopPropagation(); setStrExpanded(false); }} style={{
              background: 'none', border: 'none', color: 'rgba(0,212,255,0.7)', cursor: 'pointer',
              fontSize: 10, padding: '0 4px', fontFamily: '"JetBrains Mono",monospace',
            }}>hide</button>
          )}
        </span>
      );
    }
    return null;
  };

  if (isExpandable) {
    const entries: [string, JsonValue][] = isObject
      ? Object.entries(value as Record<string, JsonValue>)
      : (value as JsonValue[]).map((v, i) => [String(i), v]);
    const count = entries.length;
    const open = isExpanded;

    return (
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>
        <div
          style={{ ...rowBase, cursor: 'pointer' }}
          onClick={() => forceExpand === undefined && setExpanded(e => !e)}
        >
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, paddingTop: 3, userSelect: 'none', width: 12, flexShrink: 0 }}>
            {open ? '▾' : '▸'}
          </span>
          {keyName !== null && (
            <span
              style={{ color: 'rgba(255,255,255,0.65)', marginRight: 4, cursor: 'pointer' }}
              onClick={e => { e.stopPropagation(); onSelectPath(path); }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--cryo-accent,#00d4ff)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            >{keyName}:</span>
          )}
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{isObject ? '{' : '['}</span>
          {!open && (
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginLeft: 2 }}>
              {count} {isObject ? (count === 1 ? 'key' : 'keys') : (count === 1 ? 'item' : 'items')}
            </span>
          )}
          {!open && <span style={{ color: 'rgba(255,255,255,0.4)' }}>{isObject ? '}' : ']'}</span>}
        </div>
        {open && (
          <div>
            {entries.map(([k, v]) => (
              <TreeNode
                key={k}
                keyName={isArray ? null : k}
                value={v}
                path={isArray ? `${path}[${k}]` : `${path}.${k}`}
                searchTerm={searchTerm}
                onSelectPath={onSelectPath}
                depth={depth + 1}
                forceExpand={forceExpand}
              />
            ))}
            <div style={{
              paddingLeft: depth * 16,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
              color: 'rgba(255,255,255,0.4)', lineHeight: '1.7',
            }}>{isObject ? '}' : ']'}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{ ...rowBase, cursor: 'pointer' }}
      onClick={copyValue}
      title="Click to copy"
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
      onMouseLeave={e => (e.currentTarget.style.background = isHighlighted ? 'rgba(0,212,255,0.07)' : 'transparent')}
    >
      <span style={{ width: 12, flexShrink: 0 }} />
      {keyName !== null && (
        <span
          style={{ color: 'rgba(255,255,255,0.6)', marginRight: 4 }}
          onClick={e => { e.stopPropagation(); onSelectPath(path); }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--cryo-accent,#00d4ff)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
        >{keyName}:</span>
      )}
      {renderScalar()}
      {copiedFlash && (
        <span style={{ marginLeft: 6, fontSize: 10, color: '#4ade80' }}>Copied!</span>
      )}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function JSONExplorerApp() {
  const [format, setFormat] = useState<FormatTab>('JSON');
  const [rawInput, setRawInput] = useState('');
  const [parsed, setParsed] = useState<JsonValue | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState('$');
  const [searchTerm, setSearchTerm] = useState('');
  const [forceExpand, setForceExpand] = useState<boolean | undefined>(undefined);
  const [treeRevision, setTreeRevision] = useState(0);

  const doParse = useCallback((text: string, fmt: FormatTab) => {
    if (!text.trim()) { setParsed(null); setParseError(null); return; }
    try {
      if (fmt === 'JSON') {
        setParsed(JSON.parse(text));
      } else if (fmt === 'YAML') {
        setParsed(parseYAML(text));
      } else {
        const dom = new DOMParser().parseFromString(text, 'text/xml');
        const err = dom.querySelector('parsererror');
        if (err) throw new Error(err.textContent ?? 'XML parse error');
        setParsed({ [dom.documentElement.tagName]: xmlDomToJson(dom.documentElement) });
      }
      setParseError(null);
    } catch (e: any) {
      setParsed(null);
      setParseError(e?.message ?? 'Parse error');
    }
  }, []);

  const handleInput = (text: string) => {
    setRawInput(text);
    doParse(text, format);
  };

  const changeFormat = (f: FormatTab) => {
    setFormat(f);
    doParse(rawInput, f);
  };

  const formatPretty = () => {
    if (!parsed) return;
    setRawInput(JSON.stringify(parsed, null, 2));
  };

  const minify = () => {
    if (!parsed) return;
    setRawInput(JSON.stringify(parsed));
  };

  const copyAll = () => navigator.clipboard.writeText(rawInput);

  const openFile = async () => {
    try {
      const path = await (window as any).cryogram?.files?.openDialog('open');
      if (!path) return;
      const content = await (window as any).cryogram?.files?.readFile(path);
      if (typeof content === 'string') handleInput(content);
    } catch (e) { console.error(e); }
  };

  const expandAll = () => {
    setForceExpand(true);
    setTreeRevision(r => r + 1);
  };

  const collapseAll = () => {
    setForceExpand(false);
    setTreeRevision(r => r + 1);
  };

  const btnStyle = (disabled?: boolean): React.CSSProperties => ({
    padding: '5px 11px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 5,
    color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.65)',
    fontSize: 12, cursor: disabled ? 'default' : 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    opacity: disabled ? 0.5 : 1, transition: 'all 0.12s',
  });

  return (
    <div style={{
      display: 'flex', height: '100%',
      background: 'rgba(8,12,20,0.8)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      color: 'rgba(255,255,255,0.85)',
    }}>
      {/* Left pane */}
      <div style={{
        width: 340, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Format tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          {(['JSON', 'YAML', 'XML'] as FormatTab[]).map(f => (
            <button
              key={f}
              onClick={() => changeFormat(f)}
              style={{
                flex: 1, padding: '10px 0', background: 'transparent', border: 'none',
                borderBottom: format === f ? '2px solid var(--cryo-accent,#00d4ff)' : '2px solid transparent',
                color: format === f ? 'var(--cryo-accent,#00d4ff)' : 'rgba(255,255,255,0.4)',
                fontSize: 13, fontWeight: format === f ? 700 : 400,
                cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', transition: 'all 0.15s',
              }}
            >{f}</button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={rawInput}
          onChange={e => handleInput(e.target.value)}
          placeholder={`Paste ${format} content here...\n\nThe tree renders as you type.`}
          spellCheck={false}
          style={{
            flex: 1, padding: 12,
            background: 'rgba(0,0,0,0.2)', border: 'none', outline: 'none',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 12, fontFamily: '"JetBrains Mono", monospace',
            lineHeight: '1.6', resize: 'none',
          }}
        />

        {/* Error */}
        {parseError && (
          <div style={{
            padding: '7px 12px',
            background: 'rgba(239,68,68,0.1)',
            borderTop: '1px solid rgba(239,68,68,0.25)',
            fontSize: 12, color: '#ef4444',
            fontFamily: '"JetBrains Mono", monospace', lineHeight: '1.5',
          }}>&#9888; {parseError}</div>
        )}

        {/* Toolbar */}
        <div style={{
          padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0,
        }}>
          <button onClick={openFile} style={btnStyle()}>Open File</button>
          <button onClick={formatPretty} disabled={!parsed} style={btnStyle(!parsed)}>Format</button>
          <button onClick={minify} disabled={!parsed} style={btnStyle(!parsed)}>Minify</button>
          <button onClick={copyAll} style={btnStyle()}>Copy</button>
        </div>

        {/* Path display */}
        <div style={{
          padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 4 }}>Selected Path</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
            color: 'var(--cryo-accent, #00d4ff)', wordBreak: 'break-all', lineHeight: '1.5',
          }}>{selectedPath || '$'}</div>
        </div>
      </div>

      {/* Right pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        }}>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search keys / values..."
            style={{
              flex: 1, padding: '6px 10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 6, color: 'rgba(255,255,255,0.8)',
              fontSize: 12, outline: 'none',
              fontFamily: '"JetBrains Mono", monospace',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.3)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
          />
          <button onClick={expandAll} style={btnStyle()}>Expand All</button>
          <button onClick={collapseAll} style={btnStyle()}>Collapse All</button>
        </div>

        {/* Tree */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {parsed === null ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%', gap: 12,
              color: 'rgba(255,255,255,0.25)',
            }}>
              <div style={{ fontSize: 32, fontFamily: '"JetBrains Mono", monospace' }}>{'{}'}</div>
              <div style={{ fontSize: 13 }}>Paste {format} in the left pane to explore</div>
            </div>
          ) : (
            <TreeNode
              key={treeRevision}
              keyName={null}
              value={parsed}
              path="$"
              searchTerm={searchTerm}
              onSelectPath={setSelectedPath}
              depth={0}
              forceExpand={forceExpand}
            />
          )}
        </div>
      </div>
    </div>
  );
}
