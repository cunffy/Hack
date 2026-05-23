/**
 * Mock implementation of window.cyberden for browser-only development.
 * Installed automatically when the app runs outside of Electron.
 * Simulates all IPC calls with realistic fake data and delays.
 */

import type {} from '../types/global.d'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// In-memory settings store (backed by localStorage)
const settingsStore: Record<string, unknown> = (() => {
  try {
    return JSON.parse(localStorage.getItem('cyberden-mock-settings') || '{}')
  } catch {
    return {}
  }
})()

function saveMockSettings() {
  localStorage.setItem('cyberden-mock-settings', JSON.stringify(settingsStore))
}

// In-memory fs (workspace lives in memory during the session)
const mockFs: Record<string, string> = {
  '/workspace/hello.py': 'print("Hello from CyberDen!")\n',
  '/workspace/scan.js': 'const target = "192.168.1.1";\nconsole.log(`Scanning ${target}...`);\n',
  '/workspace/crack.sh': '#!/bin/bash\n# Example hash crack script\nhashcat -m 0 hash.txt wordlist.txt\n',
}

// Mock Shodan data
const MOCK_SHODAN_RESULTS: ShodanSearchResult = {
  total: 12482,
  page: 1,
  matches: [
    {
      ip_str: '93.184.216.34',
      port: 80,
      org: 'Edgecast Networks',
      hostnames: ['example.com'],
      location: { country_name: 'United States', city: 'Los Angeles' },
      data: 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nServer: EOS (lax004/54E9)\r\n',
      timestamp: '2024-03-15T08:23:11.000Z',
    },
    {
      ip_str: '8.8.8.8',
      port: 53,
      org: 'Google LLC',
      hostnames: ['dns.google'],
      location: { country_name: 'United States', city: 'Mountain View' },
      data: 'DNS/53 Google Public DNS',
      timestamp: '2024-03-14T11:45:00.000Z',
    },
    {
      ip_str: '104.21.30.22',
      port: 443,
      org: 'Cloudflare, Inc.',
      hostnames: ['cloudflare.com'],
      location: { country_name: 'United States', city: 'San Francisco' },
      data: 'TLS 1.3 Cloudflare CDN edge',
      timestamp: '2024-03-13T16:12:55.000Z',
      vulns: { 'CVE-2021-44228': { cvss: 10.0, summary: 'Log4Shell RCE vulnerability (mock data)' } },
    },
    {
      ip_str: '185.220.101.55',
      port: 9001,
      org: 'Tor Project',
      hostnames: [],
      location: { country_name: 'Germany', city: 'Frankfurt' },
      data: 'Tor relay node',
      timestamp: '2024-03-12T09:30:00.000Z',
    },
    {
      ip_str: '45.33.32.156',
      port: 22,
      org: 'Akamai Technologies',
      hostnames: ['scanme.nmap.org'],
      location: { country_name: 'United States', city: 'Atlanta' },
      data: 'SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.13\r\n',
      timestamp: '2024-03-11T14:20:00.000Z',
    },
  ],
}

const MOCK_HOST: ShodanHost = {
  ip_str: '45.33.32.156',
  hostnames: ['scanme.nmap.org'],
  org: 'Akamai Technologies',
  isp: 'Akamai Technologies',
  os: 'Linux 3.x',
  ports: [22, 80, 9929, 31337],
  country_name: 'United States',
  last_update: '2024-03-11T14:20:00.000Z',
  data: [
    { ip_str: '45.33.32.156', port: 22, data: 'SSH-2.0-OpenSSH_6.6.1p1 Ubuntu\r\nKey type: ssh-rsa' },
    { ip_str: '45.33.32.156', port: 80, data: 'HTTP/1.1 200 OK\r\nServer: Apache/2.4.7 (Ubuntu)\r\nContent-Type: text/html' },
    { ip_str: '45.33.32.156', port: 9929, data: 'Ncat: Version 6.40 (http://nmap.org/ncat)' },
    { ip_str: '45.33.32.156', port: 31337, data: 'EvilFTP service mock banner' },
  ],
  vulns: {
    'CVE-2021-41773': { cvss: 7.5, summary: 'Apache HTTP Server path traversal (mock)' },
    'CVE-2021-42013': { cvss: 9.8, summary: 'Apache HTTP Server RCE via path traversal (mock)' },
  },
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
  setTimeout(() => cb('\x1b[32mCyberDen Mock Terminal\x1b[0m — running in browser mode\r\n'), 100)
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

export function installMockCyberDen(): void {
  if (window.cyberden) return // Already installed (Electron)

  console.info('[CyberDen] Running in browser mock mode')

  window.cyberden = {
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
          const event = new CustomEvent('cyberden:pt-progress', {
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
        window.addEventListener('cyberden:pt-progress', handler)
        return () => window.removeEventListener('cyberden:pt-progress', handler)
      },
    },

    shodan: {
      search: async (query, _page = 1) => {
        await sleep(600)
        if (!(settingsStore.shodanApiKey as string)) throw new Error('NO_API_KEY')
        return { ...MOCK_SHODAN_RESULTS, query }
      },
      host: async (_ip) => {
        await sleep(500)
        return MOCK_HOST
      },
      count: async (_query) => {
        await sleep(300)
        return { count: 12482 }
      },
      myIp: async () => {
        await sleep(200)
        return '1.2.3.4'
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

    onNotification: (cb) => {
      notifListeners.push(cb)
      return () => {
        const idx = notifListeners.indexOf(cb)
        if (idx >= 0) notifListeners.splice(idx, 1)
      }
    },
  }
}
