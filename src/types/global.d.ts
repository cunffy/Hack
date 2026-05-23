interface CyberDenAPI {
  window: {
    minimize(): void
    maximize(): void
    close(): void
  }
  terminal: {
    create(id: string, cols: number, rows: number): Promise<{ pid: number }>
    write(id: string, data: string): void
    resize(id: string, cols: number, rows: number): void
    destroy(id: string): void
    onData(id: string, cb: (data: string) => void): () => void
  }
  fs: {
    readDir(path: string): Promise<FileEntry[]>
    readFile(path: string): Promise<string>
    writeFile(path: string, content: string): Promise<boolean>
    getWorkspace(): Promise<string>
    openDialog(): Promise<string | null>
  }
  passwordTester: {
    runCrack(opts: CrackOptions): Promise<CrackResult>
    runNetwork(opts: NetworkTestOptions): Promise<NetworkTestResult>
    cancel(jobId: string): void
    onProgress(cb: (data: ProgressData) => void): () => void
  }
  shodan: {
    search(query: string, page?: number): Promise<ShodanSearchResult>
    host(ip: string): Promise<ShodanHost>
    count(query: string): Promise<{ count: number }>
    myIp(): Promise<string>
  }
  leaker: {
    addTarget(target: { type: string; value: string; label?: string }): Promise<LeakerTarget>
    removeTarget(id: number): Promise<boolean>
    getTargets(): Promise<LeakerTarget[]>
    getBreaches(targetId?: number): Promise<Breach[]>
    forceRefresh(targetId?: number): Promise<{ checked: number; newBreaches: number }>
  }
  settings: {
    get(key: string): Promise<unknown>
    set(key: string, value: unknown): Promise<void>
    getAll(): Promise<Record<string, unknown>>
  }
  onNotification(cb: (n: { title: string; body: string }) => void): () => void
}

interface FileEntry {
  name: string
  path: string
  isDir: boolean
  ext: string
}

interface CrackOptions {
  mode: 'bruteforce' | 'dictionary' | 'hybrid' | 'rainbow'
  hash: string
  algorithm: string
  wordlistPath?: string
  charsets?: string[]
  maxLength?: number
  rainbowTablePath?: string
  rules?: string[]
}

interface CrackResult {
  jobId: string
  found: boolean
  password?: string
  attempts: number
  elapsed: number
}

interface NetworkTestOptions {
  mode: 'bruteforce' | 'dictionary' | 'spraying'
  target: string
  port?: number
  protocol: 'ssh' | 'http' | 'ftp' | 'smtp'
  username?: string
  usernames?: string[]
  password?: string
  wordlistPath?: string
  rateLimit?: number
}

interface NetworkTestResult {
  jobId: string
  found: boolean
  credentials?: { username: string; password: string }[]
  attempts: number
  elapsed: number
}

interface ProgressData {
  jobId: string
  attempts: number
  rate: number
  elapsed: number
  currentWord?: string
}

interface ShodanSearchResult {
  matches: ShodanMatch[]
  total: number
  page: number
}

interface ShodanMatch {
  ip_str: string
  port: number
  org?: string
  hostnames?: string[]
  location?: { country_name?: string; city?: string }
  data?: string
  timestamp?: string
  vulns?: Record<string, unknown>
}

interface ShodanHost {
  ip_str: string
  hostnames: string[]
  org?: string
  isp?: string
  os?: string
  ports: number[]
  data: ShodanMatch[]
  vulns?: Record<string, { cvss: number; summary: string }>
  last_update?: string
  country_name?: string
}

interface LeakerTarget {
  id: number
  type: 'email' | 'domain' | 'username'
  value: string
  label: string
  added_at: string
  last_checked: string | null
}

interface Breach {
  id: number
  target_id: number
  source: string
  breach_name: string | null
  breach_date: string | null
  data_classes: string | null
  description: string | null
  raw: string
  discovered_at: string
}

declare global {
  interface Window {
    cyberden: CyberDenAPI
  }
}

export {}
