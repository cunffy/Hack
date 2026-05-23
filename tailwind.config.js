/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        den: {
          bg: '#0a0e14',
          surface: '#0f1520',
          border: '#1e2d40',
          accent: '#00d4ff',
          accentDim: '#0099bb',
          green: '#00ff88',
          red: '#ff4466',
          yellow: '#ffcc00',
          purple: '#bb88ff',
          text: '#c9d1d9',
          muted: '#6e7681',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
