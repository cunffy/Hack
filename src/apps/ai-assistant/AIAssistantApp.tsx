import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CodeBlockProps {
  code: string;
  lang?: string;
}

function CodeBlock({ code, lang }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{
      position: 'relative',
      margin: '8px 0',
      borderRadius: 6,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      {lang && (
        <div style={{
          padding: '2px 10px',
          background: 'rgba(255,255,255,0.06)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: '"JetBrains Mono", monospace',
          letterSpacing: '0.5px',
        }}>{lang}</div>
      )}
      <pre style={{
        margin: 0,
        padding: '10px 12px',
        background: 'rgba(0,0,0,0.4)',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 12,
        lineHeight: '1.6',
        color: 'rgba(255,255,255,0.85)',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>{code}</pre>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: 6,
          right: 8,
          padding: '2px 8px',
          background: copied ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4,
          color: copied ? 'var(--cryo-accent, #00d4ff)' : 'rgba(255,255,255,0.6)',
          fontSize: 11,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >{copied ? 'Copied!' : 'Copy'}</button>
    </div>
  );
}

function renderMessageContent(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Split on fenced code blocks first
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...renderInlineMarkdown(content.slice(lastIndex, match.index), keyCounter));
      keyCounter += 100;
    }
    parts.push(<CodeBlock key={`cb-${match.index}`} code={match[2].trim()} lang={match[1] || undefined} />);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push(...renderInlineMarkdown(content.slice(lastIndex), keyCounter));
  }
  return parts;
}

function renderInlineMarkdown(text: string, baseKey: number): React.ReactNode[] {
  // Handle newlines, bold, inline code
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  lines.forEach((line, li) => {
    if (li > 0) result.push(<br key={`br-${baseKey}-${li}`} />);
    // Process bold and inline code inline
    const segments: React.ReactNode[] = [];
    const inlineRegex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = inlineRegex.exec(line)) !== null) {
      if (m.index > last) {
        segments.push(<span key={`t-${baseKey}-${li}-${last}`}>{line.slice(last, m.index)}</span>);
      }
      if (m[2] !== undefined) {
        segments.push(<strong key={`b-${baseKey}-${li}-${m.index}`} style={{ color: 'rgba(255,255,255,0.95)' }}>{m[2]}</strong>);
      } else if (m[3] !== undefined) {
        segments.push(
          <code key={`ic-${baseKey}-${li}-${m.index}`} style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.88em',
            background: 'rgba(0,0,0,0.35)',
            padding: '1px 5px',
            borderRadius: 3,
            color: 'var(--cryo-accent, #00d4ff)',
          }}>{m[3]}</code>
        );
      }
      last = m.index + m[0].length;
    }
    if (last < line.length) {
      segments.push(<span key={`t-end-${baseKey}-${li}`}>{line.slice(last)}</span>);
    }
    result.push(...segments);
  });
  return result;
}

const PROMPT_CHIPS = [
  'Explain this CVE: CVE-',
  'Analyze this log for anomalies',
  'Write a Python script to...',
  'What does this regex do?',
  'Review this code for security issues',
  'Decode this obfuscated string',
];

export default function AIAssistantApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKeySet, setApiKeySet] = useState<boolean | null>(null);
  const [showInjectMenu, setShowInjectMenu] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const injectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const key = await (window as any).cryogram?.settings?.get('ai.apiKey');
      setApiKeySet(!!key);
      if (key) {
        const history = await (window as any).cryogram?.settings?.get('ai.history');
        if (Array.isArray(history)) {
          setMessages(history.slice(-50));
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (injectRef.current && !injectRef.current.contains(e.target as Node)) {
        setShowInjectMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const saveHistory = useCallback((msgs: Message[]) => {
    (window as any).cryogram?.settings?.set('ai.history', msgs.slice(-50));
  }, []);

  const sendMessage = useCallback(async (overrideInput?: string) => {
    const text = (overrideInput ?? input).trim();
    if (!text || loading) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    try {
      const response = await (window as any).cryogram?.ai?.chat(newMessages);
      const assistantMsg: Message = { role: 'assistant', content: response ?? '(no response)' };
      const updated = [...newMessages, assistantMsg];
      setMessages(updated);
      saveHistory(updated);
    } catch (err: any) {
      const errMsg: Message = { role: 'assistant', content: `Error: ${err?.message ?? 'Unknown error'}` };
      const updated = [...newMessages, errMsg];
      setMessages(updated);
      saveHistory(updated);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, saveHistory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    const maxH = parseInt(getComputedStyle(ta).lineHeight || '20') * 5 + 24;
    ta.style.height = Math.min(ta.scrollHeight, maxH) + 'px';
  };

  const clearChat = () => {
    setMessages([]);
    saveHistory([]);
  };

  const injectContent = (type: 'code' | 'logs' | 'hash') => {
    const labels: Record<string, string> = {
      code: '```\n// Paste your code here\n```',
      logs: '```log\n# Paste your logs here\n```',
      hash: '```\n# Paste hash here\n```',
    };
    setInput(prev => prev + (prev ? '\n' : '') + labels[type]);
    setShowInjectMenu(false);
    textareaRef.current?.focus();
  };

  if (apiKeySet === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'rgba(8,12,20,0.8)' }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--cryo-accent, #00d4ff)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (apiKeySet === false) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', background: 'rgba(8,12,20,0.8)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '40px 48px',
          textAlign: 'center',
          maxWidth: 360,
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔑</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>
            Claude API Key Required
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24, lineHeight: '1.6' }}>
            Configure your Anthropic API key to start using the AI Assistant.
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('cryogram:openSettingsTab', { detail: 'apikeys' }))}
            style={{
              padding: '10px 24px',
              background: 'rgba(0,212,255,0.15)',
              border: '1px solid var(--cryo-accent, #00d4ff)',
              borderRadius: 8,
              color: 'var(--cryo-accent, #00d4ff)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.15)')}
          >Configure in Settings</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'rgba(8,12,20,0.8)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      color: 'rgba(255,255,255,0.85)',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>AI Assistant</div>
        <div style={{
          padding: '2px 8px', borderRadius: 4,
          background: 'rgba(0,212,255,0.08)',
          border: '1px solid rgba(0,212,255,0.2)',
          fontSize: 11, color: 'var(--cryo-accent, #00d4ff)',
          fontFamily: '"JetBrains Mono", monospace',
        }}>claude-sonnet-4-6</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: 'rgba(255,255,255,0.4)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#00ff88', display: 'inline-block',
          }} />
          API Key Active
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={clearChat}
          style={{
            padding: '5px 12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 6, color: 'rgba(255,255,255,0.5)',
            fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.1)'; e.currentTarget.style.color = '#ff5050'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >Clear Chat</button>
      </div>

      {/* Message thread */}
      <div ref={threadRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Ask anything security-related</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 520 }}>
              {PROMPT_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => { setInput(chip); textareaRef.current?.focus(); }}
                  style={{
                    padding: '7px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 20, color: 'rgba(255,255,255,0.6)',
                    fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.color = 'var(--cryo-accent, #00d4ff)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >{chip}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background: msg.role === 'user' ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
              fontSize: 13,
              lineHeight: '1.65',
              color: 'rgba(255,255,255,0.85)',
            }}>
              {renderMessageContent(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: '12px 12px 12px 4px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <span style={{ display: 'inline-flex', gap: 4 }}>
                {[0, 1, 2].map(n => (
                  <span key={n} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--cryo-accent, #00d4ff)',
                    animation: `pulse 1.2s ease-in-out ${n * 0.2}s infinite`,
                    display: 'inline-block',
                  }} />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', gap: 8, alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        {/* Inject button */}
        <div ref={injectRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setShowInjectMenu(v => !v)}
            title="Inject context"
            style={{
              width: 36, height: 36,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              color: 'rgba(255,255,255,0.5)',
              fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; e.currentTarget.style.color = 'var(--cryo-accent, #00d4ff)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >+</button>
          {showInjectMenu && (
            <div style={{
              position: 'absolute', bottom: '42px', left: 0,
              background: 'rgba(12,18,30,0.98)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              minWidth: 160, zIndex: 100,
            }}>
              {([['code', 'Paste Code'], ['logs', 'Paste Logs'], ['hash', 'Paste Hash']] as [string, string][]).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => injectContent(type as any)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '9px 14px', background: 'transparent',
                    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.75)', fontSize: 13, cursor: 'pointer',
                    transition: 'background 0.1s',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >{label}</button>
              ))}
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about CVEs, analyze logs, review code..."
          rows={1}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            color: 'rgba(255,255,255,0.85)',
            fontSize: 13,
            lineHeight: '1.5',
            resize: 'none',
            outline: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            transition: 'border-color 0.15s',
            overflowY: 'auto',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.3)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
        />

        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            width: 36, height: 36, flexShrink: 0,
            background: input.trim() && !loading ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${input.trim() && !loading ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 8,
            color: input.trim() && !loading ? 'var(--cryo-accent, #00d4ff)' : 'rgba(255,255,255,0.2)',
            fontSize: 16, cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >↑</button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
