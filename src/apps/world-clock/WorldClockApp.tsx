import React, { useState, useEffect } from 'react'

interface SavedZone { id: string; tz: string; label: string }

const PRESETS = [
  { tz: 'America/New_York',    label: 'New York' },
  { tz: 'America/Los_Angeles', label: 'Los Angeles' },
  { tz: 'America/Chicago',     label: 'Chicago' },
  { tz: 'Europe/London',       label: 'London' },
  { tz: 'Europe/Paris',        label: 'Paris' },
  { tz: 'Europe/Berlin',       label: 'Berlin' },
  { tz: 'Asia/Dubai',          label: 'Dubai' },
  { tz: 'Asia/Kolkata',        label: 'Mumbai' },
  { tz: 'Asia/Singapore',      label: 'Singapore' },
  { tz: 'Asia/Tokyo',          label: 'Tokyo' },
  { tz: 'Asia/Shanghai',       label: 'Shanghai' },
  { tz: 'Australia/Sydney',    label: 'Sydney' },
  { tz: 'Pacific/Auckland',    label: 'Auckland' },
  { tz: 'America/Sao_Paulo',   label: 'São Paulo' },
  { tz: 'Africa/Johannesburg', label: 'Johannesburg' },
]

function getTime(tz: string) {
  try {
    const now = new Date()
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, weekday: 'short', month: 'short', day: 'numeric',
    })
    const parts = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]))
    const offset = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
      .formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? ''
    return { time: `${parts.hour}:${parts.minute}:${parts.second}`, date: `${parts.weekday}, ${parts.month} ${parts.day}`, offset }
  } catch { return { time: '--:--:--', date: '---', offset: '' } }
}

function isDaytime(tz: string): boolean {
  try {
    const h = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(new Date()))
    return h >= 6 && h < 20
  } catch { return true }
}

const LS_KEY = 'cryogram-world-clock-zones'
function loadZones(): SavedZone[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function saveZones(z: SavedZone[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(z))
}

export default function WorldClockApp() {
  const [zones, setZones] = useState<SavedZone[]>(() =>
    loadZones().length > 0 ? loadZones() : [
      { id: '1', tz: 'America/New_York', label: 'New York' },
      { id: '2', tz: 'Europe/London', label: 'London' },
      { id: '3', tz: 'Asia/Tokyo', label: 'Tokyo' },
    ]
  )
  const [tick, setTick] = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  function add(preset: { tz: string; label: string }) {
    if (zones.find(z => z.tz === preset.tz)) return
    const updated = [...zones, { id: `z-${Date.now()}`, ...preset }]
    setZones(updated); saveZones(updated); setShowAdd(false); setSearch('')
  }

  function remove(id: string) {
    const updated = zones.filter(z => z.id !== id)
    setZones(updated); saveZones(updated)
  }

  const filtered = PRESETS.filter(p =>
    !zones.find(z => z.tz === p.tz) &&
    (!search || p.label.toLowerCase().includes(search.toLowerCase()) || p.tz.toLowerCase().includes(search.toLowerCase()))
  )

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-100 font-mono">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <span className="text-lg">🌍</span>
        <span className="font-bold text-blue-400">World Clock</span>
        <span className="text-xs text-gray-500 ml-2">Local: {localTz}</span>
        <button onClick={() => setShowAdd(!showAdd)}
          className="ml-auto text-xs px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded">
          + Add City
        </button>
      </div>

      {showAdd && (
        <div className="border-b border-gray-800 px-4 py-3 space-y-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search city…"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" autoFocus />
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {filtered.map(p => (
              <button key={p.tz} onClick={() => add(p)}
                className="text-xs px-3 py-1 rounded bg-gray-800 hover:bg-blue-700 text-gray-300 hover:text-white border border-gray-700 hover:border-blue-600">
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
        {zones.map(zone => {
          const { time, date, offset } = getTime(zone.tz)
          const day = isDaytime(zone.tz)
          return (
            <div key={zone.id} className={`group relative rounded-xl border p-4 ${day ? 'bg-blue-950/20 border-blue-900/40' : 'bg-gray-900/60 border-gray-700/60'}`}>
              <button onClick={() => remove(zone.id)}
                className="absolute top-2 right-2 text-xs text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100">×</button>
              <div className="flex items-center gap-2 mb-2">
                <span>{day ? '☀️' : '🌙'}</span>
                <span className="font-semibold text-gray-200 text-sm">{zone.label}</span>
              </div>
              <div className="text-2xl font-bold text-blue-300 tabular-nums">{time}</div>
              <div className="text-xs text-gray-500 mt-1">{date}</div>
              <div className="text-xs text-gray-600 mt-0.5">{offset} · {zone.tz}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
