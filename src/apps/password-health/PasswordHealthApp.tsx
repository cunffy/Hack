import React, { useState, useEffect, useCallback } from 'react';

interface VaultEntry {
  id: string;
  site: string;
  username: string;
  password: string;
}

interface WeakEntry {
  entry: VaultEntry;
  entropy: number;
}

interface DupeGroup {
  password: string;
  entries: VaultEntry[];
}

type BreachStatus = 'checking' | 'safe' | 'breached';
interface BreachResult {
  entryId: string;
  status: BreachStatus;
  count?: number;
}

function calcEntropy(password: string): number {
  let charset = 0;
  if (/[a-z]/.test(password)) charset = 26;
  if (/[A-Z]/.test(password)) charset = charset === 0 ? 26 : 52;
  if (/[0-9]/.test(password)) charset = charset === 0 ? 10 : charset + 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset = 95;
  if (charset === 0) charset = 26;
  return password.length * Math.log2(charset);
}

async function sha1Hex(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-1', buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

function ScoreGauge({ score }: { score: number }) {
  const r = 52;
  const cx = 68, cy = 68;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score < 40 ? '#ef4444' : score < 70 ? '#eab308' : '#4ade80';
  return (
    <svg width={136} height={136} viewBox="0 0 136 136" style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={10} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.7s ease, stroke 0.4s' }}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize={28} fontWeight={700} fontFamily='"JetBrains Mono", monospace'>{score}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={10} fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'>out of 100</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={9} fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'>Health Score</text>
    </svg>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10, padding: 16,
    }}>{children}</div>
  );
}

function SectionTitle({ title, count, color }: { title: string; count: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
      <span style={{
        padding: '1px 8px', borderRadius: 10,
        background: count > 0 ? color + '22' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${count > 0 ? color + '55' : 'rgba(255,255,255,0.07)'}`,
        fontSize: 11, color: count > 0 ? color : 'rgba(255,255,255,0.3)',
        fontFamily: '"JetBrains Mono", monospace',
      }}>{count}</span>
    </div>
  );
}

function FixButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '3px 9px', background: 'rgba(0,212,255,0.08)',
        border: '1px solid rgba(0,212,255,0.2)', borderRadius: 5,
        color: 'var(--cryo-accent, #00d4ff)', fontSize: 11, cursor: 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.12s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.18)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.08)')}
    >Open in Password Manager</button>
  );
}

function EntropyBadge({ entropy }: { entropy: number }) {
  const color = entropy < 40 ? '#ef4444' : entropy < 60 ? '#eab308' : '#4ade80';
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 4,
      background: color + '22', border: `1px solid ${color}55`,
      color, fontSize: 11, fontFamily: '"JetBrains Mono", monospace', flexShrink: 0,
    }}>{entropy.toFixed(0)} bits</span>
  );
}

export default function PasswordHealthApp() {
  const [vault, setVault] = useState<VaultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(100);
  const [weakEntries, setWeakEntries] = useState<WeakEntry[]>([]);
  const [dupeGroups, setDupeGroups] = useState<DupeGroup[]>([]);
  const [openDupe, setOpenDupe] = useState<number | null>(null);
  const [breachResults, setBreachResults] = useState<BreachResult[]>([]);
  const [breachChecking, setBreachChecking] = useState(false);
  const [breachStarted, setBreachStarted] = useState(false);

  const audit = useCallback((entries: VaultEntry[]) => {
    const weak: WeakEntry[] = entries
      .map(e => ({ entry: e, entropy: calcEntropy(e.password) }))
      .filter(e => e.entropy < 40);
    setWeakEntries(weak);

    const pwMap: Record<string, VaultEntry[]> = {};
    entries.forEach(e => { if (!pwMap[e.password]) pwMap[e.password] = []; pwMap[e.password].push(e); });
    const dupes = Object.values(pwMap).filter(g => g.length >= 2).map(entries => ({ password: entries[0].password, entries }));
    setDupeGroups(dupes);

    if (entries.length === 0) { setScore(100); return; }
    const penWeak = (weak.length / entries.length) * 40;
    const penDupe = (dupes.reduce((s, g) => s + g.entries.length, 0) / entries.length) * 30;
    setScore(Math.max(0, Math.round(100 - penWeak - penDupe)));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await (window as any).cryogram?.passwords?.getAll();
        const entries: VaultEntry[] = Array.isArray(data) ? data : [];
        setVault(entries);
        audit(entries);
      } catch { setVault([]); }
      finally { setLoading(false); }
    })();
  }, [audit]);

  const checkBreaches = async () => {
    setBreachStarted(true);
    setBreachChecking(true);
    setBreachResults(vault.map(e => ({ entryId: e.id, status: 'checking' })));
    for (const entry of vault) {
      try {
        const hash = await sha1Hex(entry.password);
        const prefix = hash.slice(0, 5);
        const suffix = hash.slice(5);
        const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const text = await res.text();
        let found = false, count = 0;
        for (const line of text.split('\n')) {
          const [s, c] = line.trim().split(':');
          if (s === suffix) { found = true; count = parseInt(c || '0', 10); break; }
        }
        setBreachResults(prev => prev.map(r =>
          r.entryId === entry.id ? { entryId: entry.id, status: found ? 'breached' : 'safe', count: found ? count : undefined } : r
        ));
      } catch {
        setBreachResults(prev => prev.map(r => r.entryId === entry.id ? { ...r, status: 'safe' } : r));
      }
    }
    setBreachChecking(false);
  };

  const openPasswords = () => window.dispatchEvent(new CustomEvent('cryogram:openApp', { detail: 'passwords' }));

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'rgba(8,12,20,0.8)' }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--cryo-accent,#00d4ff)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'rgba(8,12,20,0.8)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      color: 'rgba(255,255,255,0.85)', overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24,
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <ScoreGauge score={score} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Password Health</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
            {vault.length} passwords audited
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Weak', value: weakEntries.length, color: '#ef4444' },
              { label: 'Duplicate', value: dupeGroups.reduce((s, g) => s + g.entries.length, 0), color: '#eab308' },
              { label: 'Breached', value: breachResults.filter(r => r.status === 'breached').length, color: '#ef4444' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 22, fontWeight: 700,
                  color: value > 0 ? color : '#4ade80',
                  fontFamily: '"JetBrains Mono", monospace',
                }}>{value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit sections */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Weak */}
        <SectionCard>
          <SectionTitle title="Weak Passwords" count={weakEntries.length} color="#ef4444" />
          {weakEntries.length === 0 ? (
            <div style={{ color: '#4ade80', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>&#10003;</span> No weak passwords found
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {weakEntries.map(({ entry, entropy }) => (
                <div key={entry.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.site}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{entry.username}</div>
                  </div>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 2 }}>
                    {'●'.repeat(Math.min(entry.password.length, 10))}
                  </span>
                  <EntropyBadge entropy={entropy} />
                  <FixButton onClick={openPasswords} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Duplicates */}
        <SectionCard>
          <SectionTitle title="Duplicate Passwords" count={dupeGroups.length} color="#eab308" />
          {dupeGroups.length === 0 ? (
            <div style={{ color: '#4ade80', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>&#10003;</span> No duplicate passwords found
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dupeGroups.map((group, gi) => {
                const isOpen = openDupe === gi;
                return (
                  <div key={gi} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(234,179,8,0.2)' }}>
                    <button
                      onClick={() => setOpenDupe(isOpen ? null : gi)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', background: 'rgba(234,179,8,0.06)',
                        border: 'none', cursor: 'pointer',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        color: 'rgba(255,255,255,0.85)',
                      }}
                    >
                      <span style={{ color: '#eab308', fontWeight: 600, fontSize: 13 }}>
                        {group.entries.length} accounts affected
                      </span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {group.entries.map(e => e.site).join(', ')}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '8px 12px 12px', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {group.entries.map(e => (
                          <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{e.site}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{e.username}</div>
                            <FixButton onClick={openPasswords} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* HIBP */}
        <SectionCard>
          <SectionTitle title="Breach Check (HIBP)" count={breachResults.filter(r => r.status === 'breached').length} color="#ef4444" />
          {!breachStarted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                padding: '10px 12px', borderRadius: 6,
                background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)',
                fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: '1.65',
              }}>
                We use k-anonymity &mdash; only the first 5 characters of each SHA-1 hash are sent.
                Your actual passwords never leave your device.
              </div>
              <button
                onClick={checkBreaches}
                disabled={vault.length === 0}
                style={{
                  alignSelf: 'flex-start', padding: '8px 18px',
                  background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                  borderRadius: 7, color: 'var(--cryo-accent,#00d4ff)',
                  fontSize: 13, fontWeight: 600, cursor: vault.length === 0 ? 'default' : 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  opacity: vault.length === 0 ? 0.4 : 1,
                }}
              >Check for Breaches</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {breachChecking && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                  Checking passwords against breach database...
                </div>
              )}
              {vault.map(entry => {
                const result = breachResults.find(r => r.entryId === entry.id);
                return (
                  <div key={entry.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7,
                    background: result?.status === 'breached' ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${result?.status === 'breached' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{entry.site}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>{entry.username}</span>
                    </div>
                    {!result || result.status === 'checking' ? (
                      <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid var(--cryo-accent,#00d4ff)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : result.status === 'breached' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Found in {result.count?.toLocaleString()} breaches</span>
                        <FixButton onClick={openPasswords} />
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Not found</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
