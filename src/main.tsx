import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import { installMockCryogram } from './mocks/cryogram-mock'

// In a plain browser (no Electron), install the mock API so all UI works for development
if (typeof window !== 'undefined' && !window.cryogram) {
  installMockCryogram()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
