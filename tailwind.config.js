/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        den: {
          bg:        '#080c12',
          surface:   '#0d1421',
          surfaceHi: '#111b2e',
          border:    '#1a2840',
          borderHi:  '#243652',
          accent:    '#00d4ff',
          accentDim: '#0099bb',
          green:     '#00ff88',
          red:       '#ff4466',
          yellow:    '#ffcc00',
          purple:    '#bb88ff',
          orange:    '#ff8844',
          text:      '#c9d1d9',
          muted:     '#4e5d6e',
          faint:     '#1e2d40',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Fira Code', 'Consolas', 'monospace'],
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3' },
          '50%':       { opacity: '0.7' },
        },
        'scan-down': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'border-spin': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-5px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,212,255,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(0,212,255,0.7)' },
        },
        'boot-in': {
          '0%':   { opacity: '0', transform: 'scale(0.9) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'pulse-slow':  'pulse-slow 4s ease-in-out infinite',
        'scan-down':   'scan-down 10s linear infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'border-spin': 'border-spin 3s ease infinite',
        'float':       'float 5s ease-in-out infinite',
        'glow-pulse':  'glow-pulse 2s ease-in-out infinite',
        'boot-in':     'boot-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      backdropBlur: { xs: '2px' },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
