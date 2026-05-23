import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import { installMockCyberDen } from './mocks/cyberden-mock'

// In a plain browser (no Electron), install the mock API so all UI works for development
if (typeof window !== 'undefined' && !window.cyberden) {
  installMockCyberDen()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
