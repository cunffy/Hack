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
      syncTime: async () => ({ success: true }),
      pickWallpaper: async () => null,
      setWallpaper: async () => true,
      verifyPin: async () => true,
      setPin: async () => ({ success: true }),
      removePin: async () => ({ success: true }),
      setPinEnabled: async () => true,
      shutdown: async () => { alert('[mock] Shutdown called') },
      reboot: async () => { alert('[mock] Reboot called') },
      sleep: async () => { alert('[mock] Sleep called') },
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

    wm: {
      getWindows: async () => [],
      focusWindow: async () => true,
      closeWindow: async () => true,
      hideShell: async () => true,
      getCurrentWorkspace: async () => 0,
      switchWorkspace: async () => true,
      getWorkspaceCount: async () => 4,
    },
    passwords: {
      getAll: async () => [],
      add: async (e: any) => ({ ...e, id: 'mock', createdAt: '', updatedAt: '' }),
      update: async () => true,
      delete: async () => true,
      generate: async () => 'MockPass123!',
    },
    ssh: {
      listKeys: async () => [],
      generateKey: async () => ({ success: false }),
      deleteKey: async () => false,
      getPublicKey: async () => '',
      listHosts: async () => [],
      saveConfig: async () => true,
    },
    firewall: {
      status: async () => ({ active: false, defaultIn: 'deny', defaultOut: 'allow', rules: [] }),
      enable: async () => ({ success: false }),
      disable: async () => ({ success: false }),
      addRule: async () => ({ success: false }),
      deleteRule: async () => ({ success: false }),
      reset: async () => ({ success: false }),
    },
    processes: {
      list: async () => [],
      kill: async () => ({ success: false }),
      getSystemStats: async () => ({ cpuPct: 0, memTotal: 0, memUsed: 0, memPct: 0 }),
    },
    logs: {
      getUnits: async () => ['all'],
      query: async () => ({ lines: [] }),
      stream: async () => {},
      stopStream: async () => {},
      onLine: (cb: any) => { void cb; return () => {} },
    },
    netmon: {
      getInterfaces: async () => [],
      getConnections: async () => [],
      startStream: async () => {},
      stopStream: async () => {},
      onStats: (cb: any) => { void cb; return () => {} },
    },
    screenshot: {
      capture: async () => ({ dataUrl: '', width: 0, height: 0 }),
      save: async () => ({ path: '' }),
      copyToClipboard: async () => false,
    },

    phone: {
      getDevices: async () => [],
      getInfo: async () => ({ model: 'Mock Phone', android: '14', serial: 'mock' }),
      getBattery: async () => ({ level: 80, status: 'charging' }),
      getStorage: async () => ({ total: 128, used: 40, free: 88 }),
      checkScrcpy: async () => false,
      installScrcpy: async () => false,
      startMirror: async () => false,
      stopMirror: async () => false,
      isMirroring: async () => false,
      enableWireless: async () => '',
      connectWifi: async () => false,
      disconnect: async () => false,
      getDeviceIp: async () => '',
      screenshot: async () => '',
    },

    scanner: {
      check: async () => ({ available: false }),
      run: async () => {},
      cancel: () => {},
      onProgress: (cb) => {
        void cb
        return () => {}
      },
    },

    vpn: {
      getStatus: async () => ({ connected: false }),
      connect: async () => ({ success: false, error: '[mock] VPN not available' }),
      disconnect: async () => ({ success: false }),
    },

    updater: {
      check: async () => ({ hasUpdate: false }),
      run: async () => ({ success: false }),
      onProgress: (cb) => { void cb; return () => {} },
    },

    cert: {
      inspect: async () => ({
        subject: { CN: 'example.com', O: 'Example Org', C: 'US' },
        issuer: { CN: "Let's Encrypt R3", O: "Let's Encrypt" },
        validFrom: new Date(Date.now() - 30 * 86400000).toISOString(),
        validTo: new Date(Date.now() + 60 * 86400000).toISOString(),
        daysRemaining: 60,
        sans: ['example.com', 'www.example.com'],
        publicKey: { algorithm: 'RSA', bits: 2048 },
        fingerprints: { sha256: 'AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99' },
        serialNumber: '0123456789ABCDEF',
        signatureAlgorithm: 'sha256WithRSAEncryption',
        isCA: false,
      }),
      parsePem: async () => ({
        subject: { CN: 'Parsed Cert' },
        issuer: { CN: 'Root CA' },
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 365 * 86400000).toISOString(),
        daysRemaining: 365,
        sans: [],
        publicKey: { algorithm: 'EC', curve: 'P-256' },
        fingerprints: { sha256: '00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF' },
        serialNumber: 'FEDCBA9876543210',
        signatureAlgorithm: 'ecdsa-with-SHA256',
        isCA: false,
      }),
    },
    docker: {
      listContainers: async () => [
        { ID: 'abc123', Names: '/mock-nginx', Image: 'nginx:latest', Status: 'Up 2 hours', State: 'running', Ports: '0.0.0.0:80->80/tcp', Created: '' },
        { ID: 'def456', Names: '/mock-postgres', Image: 'postgres:15', Status: 'Exited (0) 1 hour ago', State: 'exited', Ports: '', Created: '' },
      ],
      listImages: async () => [
        { ID: 'img1', Repository: 'nginx', Tag: 'latest', Size: '142MB', CreatedAt: '2024-01-01' },
        { ID: 'img2', Repository: 'postgres', Tag: '15', Size: '379MB', CreatedAt: '2024-01-01' },
      ],
      startContainer: async () => true,
      stopContainer: async () => true,
      restartContainer: async () => true,
      removeContainer: async () => true,
      getStats: async () => [
        { ID: 'abc123', Name: 'mock-nginx', CPUPerc: '0.5%', MemUsage: '12MiB / 8GiB', MemPerc: '0.14%', NetIO: '1kB / 2kB', BlockIO: '0B / 0B' },
      ],
      pullImage: async () => true,
      removeImage: async () => true,
      getLogs: async () => '[mock] Container log output\n[mock] Line 2\n[mock] Line 3',
      onPullLine: (cb: any) => { void cb; return () => {} },
    },
    git: {
      isRepo: async () => false,
      status: async () => ({ branch: 'main', files: [], ahead: 0, behind: 0 }),
      log: async () => [],
      diff: async () => '',
      getBranches: async () => [],
      checkout: async () => true,
      stage: async () => true,
      unstage: async () => true,
      commit: async () => true,
      push: async () => '',
      pull: async () => '',
      stash: async () => true,
      stashPop: async () => true,
      init: async () => true,
    },
    db: {
      open: async () => ({ error: '[mock] SQLite not available in browser' }),
      close: async () => true,
      listTables: async () => [],
      getSchema: async () => [],
      getTableRowCount: async () => 0,
      query: async () => ({ rows: [], columns: [], total: 0, error: null }),
    },
    trash: {
      list: async () => [
        { name: 'old-file.txt', originalPath: '/home/user/old-file.txt', deletionDate: new Date().toISOString().slice(0, 19), size: 1024 },
        { name: 'backup.zip', originalPath: '/home/user/backup.zip', deletionDate: new Date(Date.now() - 86400000).toISOString().slice(0, 19), size: 1024 * 1024 * 5 },
      ],
      moveToTrash: async () => true,
      restore: async () => true,
      deletePermanent: async () => true,
      empty: async () => true,
      getSize: async () => ({ count: 2, bytes: 1024 + 1024 * 1024 * 5 }),
    },
    shodan: {
      search: async (query: string) => ({
        matches: [
          { ip_str: '1.2.3.4', hostnames: ['example.com'], ports: [80, 443, 22], org: 'Acme Corp', isp: 'Acme ISP', country_code: 'US', country_name: 'United States', os: 'Linux', timestamp: new Date().toISOString() },
          { ip_str: '5.6.7.8', hostnames: [], ports: [3389, 8080], org: 'Test Org', isp: 'Test ISP', country_code: 'DE', country_name: 'Germany', os: null, timestamp: new Date().toISOString() },
        ],
        total: 2,
        query,
      }),
      host: async (ip: string) => ({ ip_str: ip, ports: [80, 443], org: 'Mock Org', country_name: 'United States', os: 'Linux', hostnames: ['mock.example.com'], timestamp: new Date().toISOString() }),
      count: async () => ({ total: 42 }),
      exploits: async () => ({ matches: [], total: 0 }),
    },
    osint: {
      lookup: async (tool: string, query: string) => {
        await sleep(800)
        if (tool === 'IP Lookup') return { ip: query, city: 'San Francisco', region: 'California', country: 'United States', org: 'AS13335 Cloudflare', timezone: 'America/Los_Angeles', latitude: 37.7749, longitude: -122.4194 }
        if (tool === 'WHOIS') return { domain: query, status: 'clientTransferProhibited', registered: '2010-03-15', expiry: '2025-03-15', registrar: 'GoDaddy' }
        if (tool === 'DNS Records') return { A: '1.2.3.4', MX: 'mail.example.com', NS: 'ns1.example.com, ns2.example.com', TXT: 'v=spf1 include:example.com ~all' }
        return { result: `[mock] ${tool} lookup for ${query}` }
      },
    },
    cve: {
      search: async () => {
        await sleep(600)
        return [
          { id: 'CVE-2024-1234', description: 'A critical SQL injection vulnerability in ExampleCMS allows remote attackers to execute arbitrary SQL commands via the search parameter.', severity: 'CRITICAL', score: 9.8, published: '2024-01-15', references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-1234'] },
          { id: 'CVE-2024-5678', description: 'Cross-site scripting (XSS) vulnerability in the admin dashboard of TestApp version 2.x.', severity: 'HIGH', score: 7.4, published: '2024-02-20', references: [] },
        ]
      },
      recent: async () => {
        await sleep(400)
        return [
          { id: 'CVE-2024-9999', description: 'Remote code execution vulnerability in popular open-source library.', severity: 'CRITICAL', score: 10.0, published: new Date().toISOString().slice(0, 10), references: [] },
          { id: 'CVE-2024-8888', description: 'Memory corruption vulnerability in kernel component.', severity: 'HIGH', score: 7.8, published: new Date().toISOString().slice(0, 10), references: [] },
        ]
      },
    },
    ai: {
      chat: async (messages: { role: string; content: string }[]) => {
        await sleep(1200)
        const last = messages[messages.length - 1]?.content || ''
        return `[Mock AI Response] You asked: "${last.slice(0, 100)}". In a real session, Claude would provide expert cybersecurity analysis here. Configure your Anthropic API key in Settings → API Keys to enable real AI responses.`
      },
    },
    packetSniffer: {
      start: async (_iface: string, _filter: string, cb: (pkt: PacketEntry) => void) => {
        let id = 0
        const protos = ['TCP', 'UDP', 'ICMP', 'HTTP', 'DNS', 'ARP']
        const interval = setInterval(() => {
          cb({ id: ++id, time: (id * 0.042).toFixed(6), src: `192.168.1.${Math.floor(Math.random()*254)+1}`, dst: `10.0.0.${Math.floor(Math.random()*254)+1}`, proto: protos[Math.floor(Math.random()*protos.length)], len: Math.floor(Math.random()*1400)+64, info: 'Mock packet data' })
        }, 300)
        return () => clearInterval(interval)
      },
      stop: async () => {},
    },
    backup: {
      list: async () => [
        { id: '1709000000000', name: 'Backup 2024-02-27 10:00', size: '2.1MB', created: '2024-02-27 10:00', status: 'complete', items: 142 },
      ],
      create: async () => ({ id: Date.now().toString(), name: `Backup ${new Date().toLocaleString()}`, size: '2.3MB', created: new Date().toISOString().slice(0,16).replace('T',' '), status: 'complete', items: 148 }),
      restore: async () => true,
      delete: async () => true,
      onProgress: (_cb: (msg: string, pct: number) => void) => () => {},
    },
    auditLog: {
      list: async () => [
        { id: '1', ts: new Date().toISOString().replace('T',' ').slice(0,19), type: 'security', category: 'Auth', message: 'Login successful', details: 'User logged in from 127.0.0.1' },
        { id: '2', ts: new Date(Date.now()-60000).toISOString().replace('T',' ').slice(0,19), type: 'info', category: 'App', message: 'Terminal opened' },
        { id: '3', ts: new Date(Date.now()-120000).toISOString().replace('T',' ').slice(0,19), type: 'warning', category: 'Network', message: 'Outbound connection to unknown host', details: 'Destination: 198.51.100.42:443' },
        { id: '4', ts: new Date(Date.now()-180000).toISOString().replace('T',' ').slice(0,19), type: 'success', category: 'System', message: 'Backup completed successfully' },
      ],
      append: async (entry: Omit<AuditLogEntry, 'id' | 'ts'>) => ({ id: Date.now().toString(), ts: new Date().toISOString().replace('T',' ').slice(0,19), ...entry }),
      clear: async () => true,
    },
    codeScanner: {
      browse: async () => '/home/user/projects/myapp',
      scan: async () => {
        await sleep(2000)
        return {
          findings: [
            { id: '1', severity: 'HIGH', rule: 'XSS_RISK', file: 'src/utils/render.js', line: 42, code: "element.innerHTML = userInput", message: 'innerHTML assignment with user data can cause XSS', fix: 'Use textContent or sanitize with DOMPurify' },
            { id: '2', severity: 'CRITICAL', rule: 'HARDCODED_CREDENTIAL', file: 'config/db.js', line: 8, code: 'const password = "admin123"', message: 'Hardcoded password detected', fix: 'Use environment variables' },
            { id: '3', severity: 'MEDIUM', rule: 'WEAK_HASH', file: 'src/auth.js', line: 15, code: 'const hash = md5(password)', message: 'MD5 is cryptographically broken', fix: 'Use bcrypt or argon2' },
          ],
          scanned: 23, duration: 1842, scanner: 'Pattern-based',
        }
      },
      onProgress: (_cb: (pct: number) => void) => () => {},
    },
    totp: {
      list: async () => [
        { id: 'totp-1', name: 'GitHub', issuer: 'GitHub Inc.', secret: 'JBSWY3DPEHPK3PXP' },
        { id: 'totp-2', name: 'Google', issuer: 'Google LLC', secret: 'JBSWY3DPEHPK3PXP' },
      ],
      generate: async (_secret: string) => ({ code: String(Math.floor(Math.random()*1000000)).padStart(6,'0'), timeLeft: 30 - (Math.floor(Date.now()/1000) % 30) }),
      add: async (account: Omit<TOTPAccount, 'id'>) => ({ id: `totp-${Date.now()}`, ...account }),
      remove: async () => true,
    },
    wordlists: {
      list: async () => [
        { name: 'rockyou-top1000.txt', path: '/mock/rockyou-top1000.txt', lineCount: 1000, sizeKB: 8 },
        { name: 'common-passwords.txt', path: '/mock/common-passwords.txt', lineCount: 500, sizeKB: 4 },
      ],
      preview: async () => ['password', '123456', 'admin', 'letmein', 'qwerty', 'monkey', 'dragon', 'master', 'hello', 'sunshine'],
      import: async () => null,
      delete: async () => true,
      generate: async () => 'generated.txt',
    },
    passwordHealth: {
      checkHIBP: async (_pw: string) => {
        await sleep(800)
        return { breached: false, count: 0 }
      },
    },
    wallpaper: {
      listCustom: async () => [],
      browse: async () => null,
    },

    clipboardHistory: {
      getAll: async () => [
        { id: '1', text: 'Hello, world!', ts: Date.now() - 60000, pinned: true },
        { id: '2', text: 'npm install && npm run dev', ts: Date.now() - 120000, pinned: false },
        { id: '3', text: 'https://example.com/very-long-url?param=value', ts: Date.now() - 300000, pinned: false },
      ] as ClipEntry[],
      copy: async () => {},
      pin: async (id: string) => [],
      delete: async (id: string) => [],
      clear: async () => [],
      onChange: (cb) => { void cb; return () => {} },
    },

    colorPicker: {
      getPalettes: async () => [
        { id: 'p1', name: 'Brand Colors', colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'], createdAt: Date.now() },
      ] as ColorPalette[],
      savePalette: async (p) => ({ ...p, id: `pal-${Date.now()}`, createdAt: Date.now() }),
      updatePalette: async () => [],
      deletePalette: async () => [],
    },

    imageViewer: {
      open: async () => null,
      readFile: async () => null,
      browseDir: async () => [],
    },

    remoteDesktop: {
      checkDeps: async () => ({ x11vnc: false, websockify: false, novnc: false }),
      installDeps: async () => ({ ok: true }),
      start: async () => ({ ok: true, ip: '192.168.1.100', url: 'http://192.168.1.100:6081', vncPort: 5900, wsPort: 6080, httpPort: 6081 }),
      stop: async () => ({ ok: true }),
      status: async () => ({ running: false, vncAlive: false, wsAlive: false }),
      getIP: async () => '192.168.1.100',
      onLog: (cb: (msg: string) => void) => { void cb; return () => {} },
      onStopped: (cb: () => void) => { void cb; return () => {} },
    },
    rssReader: {
      getFeeds: async () => [] as RSSFeed[],
      getItems: async () => [] as RSSItem[],
      addFeed: async (url: string) => ({ feed: { id: 'f1', url, title: url, description: '', lastFetched: Date.now() }, items: [] }),
      removeFeed: async () => {},
      refresh: async () => [] as RSSItem[],
      markRead: async () => {},
      markAllRead: async () => {},
    },

    notifyUnlock: () => {},
    onLock: (cb) => { void cb; return () => {} },
    onOpenApp: (cb) => { void cb; return () => {} },
    onHudVolume: (cb) => { void cb; return () => {} },
    onHudBrightness: (cb) => { void cb; return () => {} },
    onAppSwitcher: (cb) => { void cb; return () => {} },
    onSpotlight: (cb) => { void cb; return () => {} },
    onWorkspaceChanged: (cb) => { void cb; return () => {} },

    onNotification: (cb) => {
      notifListeners.push(cb)
      return () => {
        const idx = notifListeners.indexOf(cb)
        if (idx >= 0) notifListeners.splice(idx, 1)
      }
    },
  }
}
