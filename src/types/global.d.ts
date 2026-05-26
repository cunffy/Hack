declare global {
  // ── Window API (set by Electron context bridge) ───────────────────────────

  interface Window {
    cryogram: CryogramAPI
  }

  interface CryogramAPI {
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
    files: {
      getHome(): Promise<string>
      getDrives(): Promise<DriveEntry[]>
      readDir(path: string): Promise<FileItem[]>
      stat(path: string): Promise<{ size: number; modified: string; isDir: boolean }>
      readFile(path: string): Promise<string>
      writeFile(path: string, content: string): Promise<boolean>
      copy(src: string, dest: string): Promise<boolean>
      move(src: string, dest: string): Promise<boolean>
      delete(path: string): Promise<boolean>
      mkdir(path: string): Promise<boolean>
      rename(path: string, newName: string): Promise<string>
      openExternal(path: string): Promise<boolean>
      openDialog(mode?: 'open' | 'save' | 'folder'): Promise<string[] | null>
    }
    passwordTester: {
      runCrack(opts: CrackOptions): Promise<CrackResult>
      runNetwork(opts: NetworkTestOptions): Promise<NetworkTestResult>
      cancel(jobId: string): void
      onProgress(cb: (data: ProgressData) => void): () => void
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
    system: {
      getNetworks(): Promise<WifiNetwork[]>
      getWifiStatus(): Promise<WifiStatus>
      connectNetwork(ssid: string, password?: string): Promise<boolean>
      disconnectNetwork(): Promise<boolean>
      rescanNetworks(): Promise<boolean>
      getBattery(): Promise<BatteryInfo | null>
      getVolume(): Promise<VolumeInfo>
      setVolume(level: number): Promise<boolean>
      toggleMute(): Promise<boolean>
      getBrightness(): Promise<number>
      setBrightness(pct: number): Promise<boolean>
      getBluetoothDevices(): Promise<BtDevice[]>
      bluetoothConnect(address: string): Promise<boolean>
      bluetoothDisconnect(address: string): Promise<boolean>
      bluetoothScan(): Promise<boolean>
      getInfo(): Promise<SystemInfo>
      syncTime(): Promise<{ success: boolean }>
      shutdown(): Promise<void>
      reboot(): Promise<void>
      lock(): Promise<void>
      pickWallpaper(): Promise<string | null>
      setWallpaper(path: string): Promise<boolean>
      verifyPin(pin: string): Promise<boolean>
      setPin(pin: string, cur?: string): Promise<{ success: boolean; error?: string }>
      removePin(cur: string): Promise<{ success: boolean; error?: string }>
      setPinEnabled(on: boolean): Promise<boolean>
    }
    launcher: {
      getApps(): Promise<AppEntry[]>
      launch(app: AppEntry): Promise<boolean>
    }
    wm: {
      getWindows(): Promise<WmWindow[]>
      focusWindow(id: string): Promise<boolean>
      closeWindow(id: string): Promise<boolean>
      hideShell(): Promise<boolean>
    }
    phone: {
      getDevices(): Promise<PhoneDevice[]>
      getInfo(serial: string): Promise<PhoneInfo>
      getBattery(serial: string): Promise<PhoneBattery>
      getStorage(serial: string): Promise<PhoneStorage>
      checkScrcpy(): Promise<boolean>
      installScrcpy(): Promise<boolean>
      startMirror(serial: string): Promise<boolean>
      stopMirror(): Promise<boolean>
      isMirroring(): Promise<boolean>
      enableWireless(serial: string, port?: number): Promise<string>
      connectWifi(ip: string, port?: number): Promise<boolean>
      disconnect(address: string): Promise<boolean>
      getDeviceIp(serial: string): Promise<string>
      screenshot(serial: string): Promise<string>
    }
    scanner: {
      check(): Promise<{ available: boolean }>
      run(target: string, type: string, ports?: string): Promise<void>
      cancel(): void
      onProgress(cb: (line: string) => void): () => void
    }
    vpn: {
      getStatus(): Promise<VpnStatus>
      connect(profile: VpnProfile): Promise<{ success: boolean; error?: string }>
      disconnect(): Promise<{ success: boolean }>
    }
    updater: {
      check(): Promise<{ hasUpdate: boolean; commitCount?: number; changes?: string[] }>
      run(password?: string): Promise<{ success: boolean }>
      onProgress(cb: (line: string) => void): () => void
    }
    notifyUnlock(): void
    onLock(cb: () => void): () => void
    onOpenApp(cb: (appId: string) => void): () => void
    onNotification(cb: (n: { title: string; body: string }) => void): () => void
    onHudVolume(cb: (v: { level: number; muted: boolean }) => void): () => void
    onHudBrightness(cb: (v: { level: number }) => void): () => void
    onAppSwitcher(cb: (dir: 'next' | 'prev') => void): () => void
    onSpotlight(cb: () => void): () => void
  }

  interface WmWindow {
    id: string
    desktop: number
    title: string
    host?: string
  }

  interface PhoneDevice { serial: string; model: string; status: string }
  interface PhoneInfo { model: string; android: string; serial: string }
  interface PhoneBattery { level: number; status: string }
  interface PhoneStorage { total: number; used: number; free: number }

  interface VpnStatus {
    connected: boolean
    interface?: string
    ip?: string
    connectedSince?: number
  }

  interface VpnProfile {
    id: string
    name: string
    type: 'openvpn' | 'wireguard'
    config?: string
    configPath: string
  }

  // ── File system types ─────────────────────────────────────────────────────

  interface FileEntry {
    name: string
    path: string
    isDir: boolean
    ext: string
  }

  interface FileItem {
    name: string
    path: string
    isDir: boolean
    ext: string
    size: number
    modified: string
  }

  interface DriveEntry {
    path: string
    name: string
    mounted: boolean
  }

  // ── Password tester types ─────────────────────────────────────────────────

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
    error?: string
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

  // ── Leaker types ──────────────────────────────────────────────────────────

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

  // ── System types ──────────────────────────────────────────────────────────

  interface WifiNetwork {
    ssid: string
    signal: number
    security: string
    active: boolean
  }

  interface WifiStatus {
    connected: boolean
    ssid: string
    signal: number
  }

  interface BatteryInfo {
    level: number
    charging: boolean
    full: boolean
    status: string
  }

  interface VolumeInfo {
    level: number
    muted: boolean
  }

  interface BtDevice {
    address: string
    name: string
    connected: boolean
  }

  interface SystemInfo {
    hostname: string
    os: string
    kernel: string
    cpu: string
    ramTotal: number
    ramUsed: number
    uptime: string
  }

  // ── Launcher types ────────────────────────────────────────────────────────

  interface AppEntry {
    name: string
    exec: string
    icon: string
    comment: string
    categories: string[]
    category: string
    desktopFile: string
    terminal: boolean
  }
}

export {}
