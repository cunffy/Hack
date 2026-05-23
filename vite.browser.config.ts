import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Standalone Vite config for browser-only development (no Electron).
// Run: npm run browser
// Opens the full UI at http://localhost:5173 with mock IPC.
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    rollupOptions: {
      input: { index: resolve(__dirname, 'index.html') },
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  server: {
    port: 5173,
    open: true,
  },
})
