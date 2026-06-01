import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'

// ── WMO weather code → icon + label ─────────────────────────────────────────

const WMO: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Clear sky',        icon: '☀️'  },
  1:  { label: 'Mainly clear',     icon: '🌤'  },
  2:  { label: 'Partly cloudy',    icon: '⛅'  },
  3:  { label: 'Overcast',         icon: '☁️'  },
  45: { label: 'Foggy',            icon: '🌫'  },
  48: { label: 'Icy fog',          icon: '🌫'  },
  51: { label: 'Light drizzle',    icon: '🌦'  },
  53: { label: 'Drizzle',          icon: '🌦'  },
  55: { label: 'Heavy drizzle',    icon: '🌧'  },
  61: { label: 'Light rain',       icon: '🌧'  },
  63: { label: 'Rain',             icon: '🌧'  },
  65: { label: 'Heavy rain',       icon: '🌧'  },
  71: { label: 'Light snow',       icon: '🌨'  },
  73: { label: 'Snow',             icon: '❄️'  },
  75: { label: 'Heavy snow',       icon: '❄️'  },
  80: { label: 'Light showers',    icon: '🌦'  },
  81: { label: 'Showers',          icon: '🌧'  },
  82: { label: 'Heavy showers',    icon: '⛈'  },
  95: { label: 'Thunderstorm',     icon: '⛈'  },
  96: { label: 'Hail storm',       icon: '⛈'  },
  99: { label: 'Heavy hail storm', icon: '⛈'  },
}

function getWmo(code: number) {
  return WMO[code] ?? WMO[Math.floor(code / 10) * 10] ?? { label: 'Unknown', icon: '🌡' }
}

// ── Types ────────────────────────────────────────────────────────────────────

interface WeatherData {
  temp: number; feelsLike: number; code: number
  wind: number; city: string; country: string
}

interface NewsItem {
  id: number; title: string; url: string
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ActionBtn({
  icon, label, onClick,
}: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 5, padding: '10px 6px', borderRadius: 12, cursor: 'pointer',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.12s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'rgba(255,255,255,0.09)'
        el.style.borderColor = 'rgba(255,255,255,0.16)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'rgba(255,255,255,0.04)'
        el.style.borderColor = 'rgba(255,255,255,0.08)'
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{label}</span>
    </button>
  )
}

function PowerBtn({
  icon, label, color, onClick,
}: { icon: ReactNode; label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 5, padding: '10px 6px', borderRadius: 12, cursor: 'pointer',
        background: `${color}14`, border: `1px solid ${color}28`,
        transition: 'all 0.12s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = `${color}28`
        el.style.borderColor = `${color}55`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = `${color}14`
        el.style.borderColor = `${color}28`
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 16, width: 18, height: 18 }}>{icon}</span>
      <span style={{ fontSize: 10, color: `${color}cc`, fontWeight: 500 }}>{label}</span>
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface UserPanelProps {
  open: boolean
  onClose: () => void
}

export function UserPanel({ open, onClose }: UserPanelProps) {
  const openApp = useWindowStore(s => s.openApp)

  const [profile, setProfile] = useState({ name: 'Operator', email: '' })
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherFetched, setWeatherFetched] = useState(false)
  const [news, setNews] = useState<NewsItem[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsFetched, setNewsFetched] = useState(false)
  const [powerConfirm, setPowerConfirm] = useState<'sleep' | 'restart' | 'shutdown' | null>(null)

  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (!powerConfirm) onClose()
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open, onClose, powerConfirm])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (powerConfirm) setPowerConfirm(null)
        else onClose()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose, powerConfirm])

  // Load profile when opened
  useEffect(() => {
    if (!open) return
    window.cryogram.settings.getAll().then(all => {
      setProfile({
        name:  (all['profile.name']  as string) || 'Operator',
        email: (all['profile.email'] as string) || '',
      })
    }).catch(() => {})
  }, [open])

  // Fetch weather once per session open
  useEffect(() => {
    if (!open || weatherFetched) return
    setWeatherFetched(true)
    setWeatherLoading(true)
    const load = async () => {
      try {
        const geo = await fetch('https://ipapi.co/json/').then(r => r.json())
        const { latitude: lat, longitude: lon, city, country_name } = geo
        const w = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`
        ).then(r => r.json())
        setWeather({
          temp:      Math.round(w.current.temperature_2m),
          feelsLike: Math.round(w.current.apparent_temperature),
          code:      w.current.weather_code,
          wind:      Math.round(w.current.wind_speed_10m),
          city:      city || 'Unknown',
          country:   country_name || '',
        })
      } catch {}
      setWeatherLoading(false)
    }
    load()
  }, [open, weatherFetched])

  // Fetch Hacker News top stories once per session open
  useEffect(() => {
    if (!open || newsFetched) return
    setNewsFetched(true)
    setNewsLoading(true)
    const load = async () => {
      try {
        const ids: number[] = await fetch(
          'https://hacker-news.firebaseio.com/v1/topstories.json'
        ).then(r => r.json())
        const items = await Promise.all(
          ids.slice(0, 7).map(id =>
            fetch(`https://hacker-news.firebaseio.com/v1/item/${id}.json`).then(r => r.json())
          )
        )
        setNews(items.filter((s: any) => s?.title).map((s: any) => ({
          id: s.id, title: s.title, url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        })))
      } catch {}
      setNewsLoading(false)
    }
    load()
  }, [open, newsFetched])

  const wmo = weather ? getWmo(weather.code) : null
  const initial = profile.name.trim()[0]?.toUpperCase() || 'O'
  const isMock = !(window.cryogram as any)?.system?.sleep

  const executePower = (action: 'sleep' | 'restart' | 'shutdown') => {
    if (isMock) { setPowerConfirm(null); return }
    if (action === 'sleep')    (window.cryogram.system as any).sleep?.()
    else if (action === 'restart')  window.cryogram.system.reboot()
    else                            window.cryogram.system.shutdown()
    setPowerConfirm(null)
    onClose()
  }

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'

  const RestartIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74"/>
      <polyline points="3 3 3 9 9 9"/>
    </svg>
  )

  const openSettings = (tab?: string) => {
    if (tab) window.dispatchEvent(new CustomEvent('cryogram:openSettingsTab', { detail: tab }))
    openApp('settings')
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.55 }}
            style={{
              position: 'fixed',
              top: 42,
              right: 8,
              width: 340,
              zIndex: 99800,
              background: 'rgba(9,13,22,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 18,
              overflow: 'hidden',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.85), inset 0 0.5px 0 rgba(255,255,255,0.08)',
              fontFamily: font,
            }}
          >
            {/* ── User header ────────────────────────────────────────────── */}
            <div style={{
              padding: '16px 16px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--cryo-accent) 0%, #bb88ff 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 700, color: '#000',
                boxShadow: '0 0 18px var(--cryo-accent)44',
                fontFamily: font,
              }}>
                {initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f4f8', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  {profile.name}
                </div>
                {profile.email && (
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {profile.email}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, width: 24, height: 24, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
                  fontSize: 11, flexShrink: 0, lineHeight: 1,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)' }}
              >✕</button>
            </div>

            {/* ── Weather ──────────────────────────────────────────────── */}
            <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {weatherLoading ? (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', padding: '6px 0', textAlign: 'center' }}>
                  Fetching weather…
                </div>
              ) : weather && wmo ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{wmo.icon}</span>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#f0f4f8', letterSpacing: '-0.04em', lineHeight: 1 }}>
                        {weather.temp}°C
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                        {wmo.label}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.78)' }}>
                      {weather.city}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                      {weather.country}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
                      💨 {weather.wind} km/h · Feels {weather.feelsLike}°
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', padding: '2px 0' }}>
                  Weather unavailable
                </div>
              )}
            </div>

            {/* ── News ─────────────────────────────────────────────────── */}
            <div style={{ padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', maxHeight: 200, overflowY: 'auto' }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7,
              }}>
                Hacker News
              </div>
              {newsLoading ? (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', padding: '2px 0' }}>
                  Loading headlines…
                </div>
              ) : news.length === 0 ? (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', padding: '2px 0' }}>
                  News unavailable
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {news.slice(0, 6).map(item => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 7,
                        padding: '5px 6px', borderRadius: 7, textDecoration: 'none',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
                    >
                      <span style={{ color: 'var(--cryo-accent)', opacity: 0.6, fontSize: 10, marginTop: 2, flexShrink: 0 }}>›</span>
                      <span style={{
                        fontSize: 11, color: 'rgba(255,255,255,0.68)', lineHeight: 1.4,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {item.title}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* ── Quick actions ────────────────────────────────────────── */}
            <div style={{ padding: '12px 16px 6px', display: 'flex', gap: 8 }}>
              <ActionBtn icon="⚙️" label="Settings" onClick={() => openSettings()} />
              <ActionBtn icon="👤" label="Profile"  onClick={() => openSettings('profile')} />
            </div>

            {/* ── Power ────────────────────────────────────────────────── */}
            <div style={{ padding: '6px 16px 14px' }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
              }}>
                Power
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <PowerBtn icon="💤" label="Sleep"     color="#818cf8" onClick={() => setPowerConfirm('sleep')} />
                <PowerBtn icon={RestartIcon} label="Restart" color="var(--cryo-accent)" onClick={() => setPowerConfirm('restart')} />
                <PowerBtn icon="⏻"  label="Shut Down" color="#ef4444" onClick={() => setPowerConfirm('shutdown')} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Power confirmation modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {powerConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99900,
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: font,
            }}
            onClick={() => setPowerConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              style={{
                background: 'rgba(10,14,24,0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '28px 24px 22px',
                width: 290, textAlign: 'center',
                boxShadow: '0 32px 80px rgba(0,0,0,0.9)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 38, marginBottom: 12, lineHeight: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {powerConfirm === 'sleep' ? '💤' : powerConfirm === 'restart' ? (
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--cryo-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74"/>
                    <polyline points="3 3 3 9 9 9"/>
                  </svg>
                ) : '⏻'}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f4f8', marginBottom: 8 }}>
                {powerConfirm === 'sleep'    ? 'Put System to Sleep?'
                  : powerConfirm === 'restart'  ? 'Restart System?'
                  : 'Shut Down System?'}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 22, lineHeight: 1.55 }}>
                {powerConfirm === 'sleep'
                  ? 'The system will enter suspend mode.'
                  : powerConfirm === 'restart'
                  ? 'All running processes will be stopped.'
                  : 'Save your work before shutting down.'}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setPowerConfirm(null)}
                  style={{
                    flex: 1, padding: '9px', borderRadius: 11, fontSize: 13, fontWeight: 500,
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)' }}
                >Cancel</button>
                <button
                  autoFocus
                  onClick={() => executePower(powerConfirm)}
                  style={{
                    flex: 1, padding: '9px', borderRadius: 11, fontSize: 13, fontWeight: 600,
                    background: powerConfirm === 'shutdown' ? 'rgba(239,68,68,0.15)'
                      : powerConfirm === 'sleep' ? 'rgba(129,140,248,0.15)'
                      : 'rgba(0,212,255,0.12)',
                    border: `1px solid ${powerConfirm === 'shutdown' ? 'rgba(239,68,68,0.4)' : powerConfirm === 'sleep' ? 'rgba(129,140,248,0.4)' : 'rgba(0,212,255,0.3)'}`,
                    color: powerConfirm === 'shutdown' ? '#ef4444' : powerConfirm === 'sleep' ? '#818cf8' : 'var(--cryo-accent)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
                >
                  {powerConfirm === 'sleep' ? 'Sleep' : powerConfirm === 'restart' ? 'Restart' : 'Shut Down'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
