/**
 * Mock implementation of window.cryogram for browser-only development.
 * Installed automatically when the app runs outside of Electron.
 * Simulates all IPC calls with realistic fake data and delays.
 */

import type {} from '../types/global.d'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// In-memory settings store (backed by localStorage)
const settingsStore: Record<string, unknown> = (() => {
  try {
    return JSON.parse(localStorage.getItem('cryogram-mock-settings') || '{}')
  } catch {
    return {}
  }
})()

function saveMockSettings() {
  localStorage.setItem('cryogram-mock-settings', JSON.stringify(settingsStore))
}

// In-memory fs (workspace lives in memory during the session)
const mockFs: Record<string, string> = {
  '/workspace/hello.py': 'print("Hello from Cryogram!")\n',
  '/workspace/scan.js': 'const target = "192.168.1.1";\nconsole.log(`Scanning ${target}...`);\n',
  '/workspace/crack.sh': '#!/bin/bash\n# Example hash crack script\nhashcat -m 0 hash.txt wordlist.txt\n',
}

// Mock breach data
const mockTargets: LeakerTarget[] = [
  { id: 1, type: 'email', value: 'alice@example.com', label: 'alice@example.com', added_at: '2024-01-10T10:00:00', last_checked: '2024-03-14T08:00:00' },
  { id: 2, type: 'domain', value: 'example.com', label: 'example.com', added_at: '2024-01-10T10:00:00', last_checked: '2024-03-14T08:00:00' },
]

const mockBreaches: Breach[] = [
  {
    id: 1, target_id: 1, source: 'hibp', breach_name: 'Adobe',
    breach_date: '2013-10-04', data_classes: '["Email addresses","Password hints","Passwords","Usernames"]',
    description: 'In October 2013, 153 million Adobe accounts were breached.',
    raw: '{}', discovered_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 2, target_id: 1, source: 'hibp', breach_name: 'LinkedIn',
    breach_date: '2012-05-05', data_classes: '["Email addresses","Passwords"]',
    description: 'In May 2012, LinkedIn suffered a data breach exposing 164 million accounts.',
    raw: '{}', discovered_at: new Date(Date.now() - 26 * 3600000).toISOString(),
  },
  {
    id: 3, target_id: 2, source: 'dehashed', breach_name: 'Collection #1',
    breach_date: '2019-01-07', data_classes: '["Email addresses","Passwords"]',
    description: null, raw: '{}', discovered_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
]

let nextTargetId = 3
let targetList = [...mockTargets]
let breachList = [...mockBreaches]

// Mock terminal data channels
const termCallbacks: Record<string, (data: string) => void> = {}

function mockTerminalInit(id: string, cb: (data: string) => void) {
  termCallbacks[id] = cb
  setTimeout(() => cb('\x1b[32mCryogram Mock Terminal\x1b[0m — running in browser mode\r\n'), 100)
  setTimeout(() => cb('\x1b[33mNote:\x1b[0m Real PTY not available in browser. Run \x1b[36mnpm run dev\x1b[0m for a live shell.\r\n\r\n'), 300)
  setTimeout(() => cb('\x1b[34m$\x1b[0m '), 500)
}

function mockTerminalInput(id: string, data: string) {
  const cb = termCallbacks[id]
  if (!cb) return
  if (data === '\r') {
    cb('\r\n\x1b[33m[mock]\x1b[0m Command execution not available in browser mode.\r\n\x1b[34m$\x1b[0m ')
  } else if (data === '\x7f') {
    cb('\b \b')
  } else {
    cb(data)
  }
}

// Notification listeners
const notifListeners: Array<(n: { title: string; body: string }) => void> = []

export function installMockCryogram(): void {
  if (window.cryogram) return // Already installed (Electron)

  console.info('[Cryogram] Running in browser mock mode')

  window.cryogram = {
    window: {
      minimize: () => {},
      maximize: () => {},
      close: () => {},
    },

    terminal: {
      create: async (id, _cols, _rows) => {
        mockTerminalInit(id, () => {})
        return { pid: 9999 }
      },
      write: (id, data) => mockTerminalInput(id, data),
      resize: () => {},
      destroy: (id) => { delete termCallbacks[id] },
      onData: (id, cb) => {
        termCallbacks[id] = cb
        mockTerminalInit(id, cb)
        return () => { delete termCallbacks[id] }
      },
    },

    fs: {
      readDir: async (path) => {
        const prefix = path === '__workspace__' ? '/workspace/' : path + '/'
        const entries: FileEntry[] = Object.keys(mockFs)
          .filter((p) => p.startsWith(prefix) && !p.slice(prefix.length).includes('/'))
          .map((p) => ({
            path: p,
            name: p.split('/').pop()!,
            isDir: false,
            ext: p.split('.').pop() || '',
          }))
        return entries
      },
      readFile: async (path) => mockFs[path] ?? `# File not found: ${path}`,
      writeFile: async (path, content) => { mockFs[path] = content; return true },
      getWorkspace: async () => '/workspace',
      openDialog: async () => { alert('Directory picker not available in browser mode.'); return null },
    },

    passwordTester: {
      runCrack: async (opts) => {
        const jobId = `crack_${Date.now()}`
        // Simulate a crack with progress updates via onProgress event
        let attempts = 0
        const start = Date.now()
        for (let i = 0; i < 5; i++) {
          await sleep(400)
          attempts += 1200
          const event = new CustomEvent('cryogram:pt-progress', {
            detail: { jobId, attempts, rate: 3000, elapsed: (Date.now() - start) / 1000, currentWord: 'password' + i }
          })
          window.dispatchEvent(event)
        }
        // Simulate finding the password
        const elapsed = (Date.now() - start) / 1000
        return { jobId, found: true, password: 'hunter2', attempts: attempts + 42, elapsed }
      },
      runNetwork: async (opts) => {
        const jobId = `net_${Date.now()}`
        await sleep(1500)
        return { jobId, found: false, credentials: [], attempts: 150, elapsed: 1.5 }
      },
      cancel: (_jobId) => {},
      onProgress: (cb) => {
        const handler = (e: Event) => cb((e as CustomEvent).detail)
        window.addEventListener('cryogram:pt-progress', handler)
        return () => window.removeEventListener('cryogram:pt-progress', handler)
      },
    },

    leaker: {
      addTarget: async (target) => {
        const entry: LeakerTarget = {
          id: ++nextTargetId,
          type: target.type as LeakerTarget['type'],
          value: target.value,
          label: target.label || target.value,
          added_at: new Date().toISOString(),
          last_checked: null,
        }
        targetList = [...targetList, entry]
        return entry
      },
      removeTarget: async (id) => {
        targetList = targetList.filter((t) => t.id !== id)
        breachList = breachList.filter((b) => b.target_id !== id)
        return true
      },
      getTargets: async () => [...targetList],
      getBreaches: async (targetId) =>
        targetId !== undefined
          ? breachList.filter((b) => b.target_id === targetId)
          : [...breachList],
      forceRefresh: async () => {
        await sleep(1200)
        return { checked: targetList.length, newBreaches: 0 }
      },
    },

    settings: {
      get: async (key) => settingsStore[key] ?? null,
      set: async (key, value) => { settingsStore[key] = value; saveMockSettings() },
      getAll: async () => ({ ...settingsStore }),
    },

    files: {
      getHome: async () => '/home/user',
      getDrives: async () => [
        { path: '/', name: 'Root (/)', mounted: true },
        { path: '/media/usb0', name: 'USB Drive', mounted: true },
      ],
      readDir: async (path) => {
        const mockDirs: Record<string, FileItem[]> = {
          '/home/user': [
            { name: 'Desktop',   path: '/home/user/Desktop',   isDir: true,  ext: '', size: 0,     modified: new Date().toISOString() },
            { name: 'Documents', path: '/home/user/Documents', isDir: true,  ext: '', size: 0,     modified: new Date().toISOString() },
            { name: 'Downloads', path: '/home/user/Downloads', isDir: true,  ext: '', size: 0,     modified: new Date().toISOString() },
            { name: 'Pictures',  path: '/home/user/Pictures',  isDir: true,  ext: '', size: 0,     modified: new Date().toISOString() },
            { name: 'notes.md',  path: '/home/user/notes.md',  isDir: false, ext: 'md', size: 1420, modified: new Date().toISOString() },
            { name: 'scan.py',   path: '/home/user/scan.py',   isDir: false, ext: 'py', size: 890,  modified: new Date().toISOString() },
          ],
          '/home/user/Documents': [
            { name: 'pentest-report.pdf', path: '/home/user/Documents/pentest-report.pdf', isDir: false, ext: 'pdf', size: 245000, modified: new Date().toISOString() },
            { name: 'notes.txt',          path: '/home/user/Documents/notes.txt',          isDir: false, ext: 'txt', size: 1200,   modified: new Date().toISOString() },
          ],
          '/home/user/Downloads': [
            { name: 'rockyou.txt', path: '/home/user/Downloads/rockyou.txt', isDir: false, ext: 'txt', size: 134000000, modified: new Date().toISOString() },
            { name: 'nmap.tar.gz', path: '/home/user/Downloads/nmap.tar.gz', isDir: false, ext: 'gz',  size: 5800000,  modified: new Date().toISOString() },
          ],
        }
        await sleep(80)
        return mockDirs[path] ?? []
      },
      stat: async (path) => ({ size: 0, modified: new Date().toISOString(), isDir: false }),
      readFile: async (path) => `# Mock file: ${path}\n`,
      writeFile: async () => true,
      copy: async () => true,
      move: async () => true,
      delete: async () => true,
      mkdir: async () => true,
      rename: async (path, newName) => path.split('/').slice(0, -1).join('/') + '/' + newName,
      openExternal: async () => true,
      openDialog: async () => null,
    },

    system: {
      getNetworks: async () => [
        { ssid: 'CyberNet-5G',  signal: 90, security: 'WPA2', active: true },
        { ssid: 'Home-WiFi',    signal: 68, security: 'WPA2', active: false },
        { ssid: 'Guest',        signal: 42, security: '',     active: false },
        { ssid: 'Neighbor_2.4', signal: 22, security: 'WPA',  active: false },
      ],
      getWifiStatus: async () => ({ connected: true, ssid: 'CyberNet-5G', signal: 90 }),
      connectNetwork: async () => true,
      disconnectNetwork: async () => true,
      rescanNetworks: async () => true,
      getBattery: async () => ({ level: 72, charging: false, full: false, status: 'Discharging' }),
      getVolume: async () => ({ level: 65, muted: false }),
      setVolume: async () => true,
      toggleMute: async () => true,
      getBrightness: async () => 80,
      setBrightness: async () => true,
      getBluetoothDevices: async () => [
        { address: 'AA:BB:CC:DD:EE:FF', name: 'Sony WH-1000XM5', connected: true },
        { address: '11:22:33:44:55:66', name: 'Logitech MX Keys', connected: false },
      ],
      bluetoothConnect: async () => true,
      bluetoothDisconnect: async () => true,
      bluetoothScan: async () => { await sleep(1000); return true },
      getInfo: async () => ({
        hostname: 'cryogram',
        os: 'Cryogram Linux 1.0 (Debian-based)',
        kernel: '6.1.0-cryogram-amd64',
        cpu: 'Intel Core i7-12700H @ 2.30GHz',
        ramTotal: 16 * 1024 * 1024 * 1024,
        ramUsed: 4.2 * 1024 * 1024 * 1024,
        uptime: '3h 42m',
      }),
      shutdown: async () => { alert('[mock] Shutdown called') },
      reboot: async () => { alert('[mock] Reboot called') },
      lock: async () => { alert('[mock] Lock screen called') },
    },

    launcher: {
      getApps: async () => [
        { name: 'Firefox',     exec: 'firefox',    icon: '', comment: 'Web Browser',          categories: ['Internet'],  category: 'Internet',     desktopFile: 'firefox.desktop',     terminal: false },
        { name: 'VS Code',     exec: 'code',       icon: '', comment: 'Code Editor',           categories: ['Development'], category: 'Development', desktopFile: 'code.desktop',        terminal: false },
        { name: 'Nmap',        exec: 'nmap',       icon: '', comment: 'Network Scanner',       categories: ['Security'],  category: 'Security',     desktopFile: 'nmap.desktop',        terminal: true  },
        { name: 'Wireshark',   exec: 'wireshark',  icon: '', comment: 'Packet Analyzer',       categories: ['Security'],  category: 'Security',     desktopFile: 'wireshark.desktop',   terminal: false },
        { name: 'Metasploit',  exec: 'msfconsole', icon: '', comment: 'Penetration Testing',   categories: ['Security'],  category: 'Security',     desktopFile: 'msf.desktop',         terminal: true  },
        { name: 'Steam',       exec: 'steam',      icon: '', comment: 'Gaming Platform',       categories: ['Gaming'],    category: 'Gaming',       desktopFile: 'steam.desktop',       terminal: false },
        { name: 'Opera GX',    exec: 'opera',      icon: '', comment: 'Gaming Browser',        categories: ['Internet'],  category: 'Internet',     desktopFile: 'opera.desktop',       terminal: false },
        { name: 'Files',       exec: 'thunar',     icon: '', comment: 'File Manager',          categories: ['System'],    category: 'System',       desktopFile: 'thunar.desktop',      terminal: false },
        { name: 'VLC',         exec: 'vlc',        icon: '', comment: 'Media Player',          categories: ['Multimedia'], category: 'Multimedia',  desktopFile: 'vlc.desktop',         terminal: false },
        { name: 'GIMP',        exec: 'gimp',       icon: '', comment: 'Image Editor',          categories: ['Graphics'],  category: 'Graphics',     desktopFile: 'gimp.desktop',        terminal: false },
        { name: 'Burp Suite',  exec: 'burpsuite',  icon: '', comment: 'Web Security Testing',  categories: ['Security'],  category: 'Security',     desktopFile: 'burpsuite.desktop',   terminal: false },
        { name: 'Hashcat',     exec: 'hashcat',    icon: '', comment: 'Password Recovery',     categories: ['Security'],  category: 'Security',     desktopFile: 'hashcat.desktop',     terminal: true  },
      ],
      launch: async (app) => { alert(`[mock] Launching: ${app.name}`); return true },
    },

    onNotification: (cb) => {
      notifListeners.push(cb)
      return () => {
        const idx = notifListeners.indexOf(cb)
        if (idx >= 0) notifListeners.splice(idx, 1)
      }
    },
  }
}
