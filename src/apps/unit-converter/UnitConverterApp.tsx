import React, { useState } from 'react'

type Category = keyof typeof UNITS

const UNITS = {
  Length: {
    Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001,
    Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254, 'Nautical Mile': 1852,
  },
  Weight: {
    Kilogram: 1, Gram: 0.001, Milligram: 0.000001, 'Metric Ton': 1000,
    Pound: 0.453592, Ounce: 0.0283495, Stone: 6.35029,
  },
  Temperature: { Celsius: 0, Fahrenheit: 0, Kelvin: 0 },
  'Data Size': {
    Byte: 1, Kilobyte: 1024, Megabyte: 1048576, Gigabyte: 1073741824,
    Terabyte: 1099511627776, Bit: 0.125, Kibibyte: 1024, Mebibyte: 1048576,
  },
  Speed: {
    'm/s': 1, 'km/h': 0.277778, mph: 0.44704, Knot: 0.514444, 'ft/s': 0.3048,
  },
  Area: {
    'm²': 1, 'km²': 1e6, 'cm²': 0.0001, Hectare: 10000, Acre: 4046.86,
    'ft²': 0.092903, 'mi²': 2589988,
  },
} as const

function convertTemp(val: number, from: string, to: string): number {
  let c = 0
  if (from === 'Celsius') c = val
  else if (from === 'Fahrenheit') c = (val - 32) * 5/9
  else c = val - 273.15
  if (to === 'Celsius') return c
  if (to === 'Fahrenheit') return c * 9/5 + 32
  return c + 273.15
}

function convert(val: number, from: string, to: string, cat: Category): number {
  if (cat === 'Temperature') return convertTemp(val, from, to)
  const units = UNITS[cat] as Record<string, number>
  return val * units[from] / units[to]
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 0.0001 && n !== 0)) return n.toExponential(6)
  return parseFloat(n.toPrecision(10)).toString()
}

const CATEGORY_ICONS: Record<string, string> = {
  Length: '📏', Weight: '⚖️', Temperature: '🌡️', 'Data Size': '💾', Speed: '🚀', Area: '📐',
}

export default function UnitConverterApp() {
  const [category, setCategory] = useState<Category>('Length')
  const [fromUnit, setFromUnit] = useState('Meter')
  const [toUnit, setToUnit] = useState('Foot')
  const [value, setValue] = useState('1')

  const cats = Object.keys(UNITS) as Category[]
  const units = Object.keys(UNITS[category])

  function setCategory2(cat: Category) {
    setCategory(cat)
    const u = Object.keys(UNITS[cat])
    setFromUnit(u[0])
    setToUnit(u[1] || u[0])
  }

  const numVal = parseFloat(value) || 0
  const result = (fromUnit && toUnit && fromUnit !== toUnit)
    ? convert(numVal, fromUnit, toUnit, category)
    : numVal

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-100 font-mono">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <span className="text-lg">🔢</span>
        <span className="font-bold text-cyan-400">Unit Converter</span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 px-3 py-2 border-b border-gray-800 overflow-x-auto">
        {cats.map(cat => (
          <button key={cat} onClick={() => setCategory2(cat)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded whitespace-nowrap ${category === cat ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <span>{CATEGORY_ICONS[cat]}</span>{cat}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-5">
        {/* From */}
        <div className="w-full max-w-sm space-y-2">
          <label className="text-xs text-gray-500 uppercase tracking-wider">From</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500">
            {units.map(u => <option key={u}>{u}</option>)}
          </select>
          <input type="number" value={value} onChange={e => setValue(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-lg focus:outline-none focus:border-cyan-500" />
        </div>

        {/* Swap */}
        <button onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit) }}
          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-cyan-800 rounded-full text-xl border border-gray-700 hover:border-cyan-600">
          ⇅
        </button>

        {/* To */}
        <div className="w-full max-w-sm space-y-2">
          <label className="text-xs text-gray-500 uppercase tracking-wider">To</label>
          <select value={toUnit} onChange={e => setToUnit(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500">
            {units.map(u => <option key={u}>{u}</option>)}
          </select>
          <div className="w-full bg-gray-900 border border-cyan-800 rounded px-3 py-2 text-lg text-cyan-300 font-bold select-all">
            {fmt(result)}
          </div>
        </div>

        {/* Formula */}
        <p className="text-xs text-gray-600 text-center">
          {fmt(numVal)} {fromUnit} = {fmt(result)} {toUnit}
        </p>
      </div>

      {/* Quick reference grid */}
      <div className="border-t border-gray-800 px-4 py-3">
        <p className="text-xs text-gray-500 mb-2">All conversions from {fmt(numVal)} {fromUnit}</p>
        <div className="grid grid-cols-3 gap-1.5">
          {units.filter(u => u !== fromUnit).slice(0, 9).map(u => (
            <div key={u} className="bg-gray-900 rounded px-2 py-1 text-xs cursor-pointer hover:bg-gray-800"
              onClick={() => setToUnit(u)}>
              <span className="text-gray-500">{u}: </span>
              <span className="text-gray-200">{fmt(convert(numVal, fromUnit, u, category))}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
