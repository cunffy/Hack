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
      sleep(): Promise<void>
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
      getCurrentWorkspace(): Promise<number>
      switchWorkspace(n: number): Promise<boolean>
      getWorkspaceCount(): Promise<number>
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
    passwords: {
      getAll(): Promise<PasswordEntry[]>
      add(entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<PasswordEntry>
      update(id: string, patch: Partial<PasswordEntry>): Promise<boolean>
      delete(id: string): Promise<boolean>
      generate(opts: PasswordGenOpts): Promise<string>
    }
    ssh: {
      listKeys(): Promise<SshKey[]>
      generateKey(opts: SshKeyGenOpts): Promise<{ success: boolean; error?: string }>
      deleteKey(name: string): Promise<boolean>
      getPublicKey(name: string): Promise<string>
      listHosts(): Promise<SshHost[]>
      saveConfig(content: string): Promise<boolean>
    }
    firewall: {
      status(): Promise<FirewallStatus>
      enable(): Promise<{ success: boolean }>
      disable(): Promise<{ success: boolean }>
      addRule(rule: FirewallRuleInput): Promise<{ success: boolean; error?: string }>
      deleteRule(num: number): Promise<{ success: boolean }>
      reset(): Promise<{ success: boolean }>
    }
    processes: {
      list(): Promise<ProcessEntry[]>
      kill(pid: number, signal?: string): Promise<{ success: boolean; error?: string }>
      getSystemStats(): Promise<SystemStats>
    }
    logs: {
      getUnits(): Promise<string[]>
      query(opts: LogQueryOpts): Promise<{ lines: LogLine[] }>
      stream(opts: LogQueryOpts): Promise<void>
      stopStream(): Promise<void>
      onLine(cb: (line: string) => void): () => void
    }
    netmon: {
      getInterfaces(): Promise<InterfaceStats[]>
      getConnections(): Promise<NetworkConnection[]>
      startStream(): Promise<void>
      stopStream(): Promise<void>
      onStats(cb: (stats: NetmonStats) => void): () => void
    }
    screenshot: {
      capture(): Promise<{ dataUrl: string; width: number; height: number }>
      save(dataUrl: string, filename?: string): Promise<{ path: string }>
      copyToClipboard(dataUrl: string): Promise<boolean>
    }
    cert: {
      inspect(host: string, port?: number): Promise<CertInfo>
      parsePem(pem: string): Promise<CertInfo>
    }
    docker: {
      listContainers(): Promise<DockerContainer[]>
      listImages(): Promise<DockerImage[]>
      startContainer(id: string): Promise<boolean>
      stopContainer(id: string): Promise<boolean>
      restartContainer(id: string): Promise<boolean>
      removeContainer(id: string): Promise<boolean>
      getStats(): Promise<DockerStat[]>
      pullImage(name: string): Promise<boolean>
      removeImage(id: string): Promise<boolean>
      getLogs(id: string, lines?: number): Promise<string>
      onPullLine(cb: (line: string) => void): () => void
    }
    git: {
      isRepo(repoPath: string): Promise<boolean>
      status(repoPath: string): Promise<GitStatus>
      log(repoPath: string, limit?: number): Promise<GitCommit[]>
      diff(repoPath: string, file?: string, staged?: boolean): Promise<string>
      getBranches(repoPath: string): Promise<GitBranch[]>
      checkout(repoPath: string, branch: string): Promise<boolean>
      stage(repoPath: string, files: string[]): Promise<boolean>
      unstage(repoPath: string, files: string[]): Promise<boolean>
      commit(repoPath: string, message: string): Promise<boolean>
      push(repoPath: string): Promise<string>
      pull(repoPath: string): Promise<string>
      stash(repoPath: string): Promise<boolean>
      stashPop(repoPath: string): Promise<boolean>
      init(repoPath: string): Promise<boolean>
    }
    db: {
      open(filePath: string): Promise<{ sessionId: string } | { error: string }>
      close(sessionId: string): Promise<boolean>
      listTables(sessionId: string): Promise<{ name: string; type: string }[]>
      getSchema(sessionId: string, table: string): Promise<DbColumn[]>
      getTableRowCount(sessionId: string, table: string): Promise<number>
      query(sessionId: string, sql: string, page?: number, pageSize?: number): Promise<DbQueryResult>
    }
    trash: {
      list(): Promise<TrashItem[]>
      moveToTrash(path: string): Promise<boolean>
      restore(name: string): Promise<boolean>
      deletePermanent(name: string): Promise<boolean>
      empty(): Promise<boolean>
      getSize(): Promise<{ count: number; bytes: number }>
    }
    shodan: {
      search(query: string, page?: number): Promise<{ matches: ShodanHost[]; total: number; query: string }>
      host(ip: string): Promise<ShodanHost>
      count(query: string): Promise<{ total: number }>
      exploits(query: string): Promise<{ matches: unknown[]; total: number }>
    }
    osint: {
      lookup(tool: string, query: string): Promise<Record<string, unknown>>
    }
    cve: {
      search(query: string): Promise<CVEEntry[]>
      recent(count?: number): Promise<CVEEntry[]>
    }
    ai: {
      chat(messages: { role: string; content: string }[]): Promise<string>
    }
    packetSniffer: {
      start(iface: string, filter: string, cb: (pkt: PacketEntry) => void): Promise<(() => void) | null>
      stop(): Promise<void>
    }
    backup: {
      list(): Promise<BackupMeta[]>
      create(): Promise<BackupMeta>
      restore(id: string): Promise<boolean>
      delete(id: string): Promise<boolean>
      onProgress(cb: (msg: string, pct: number) => void): () => void
    }
    auditLog: {
      list(): Promise<AuditLogEntry[]>
      append(entry: Omit<AuditLogEntry, 'id' | 'ts'>): Promise<AuditLogEntry>
      clear(): Promise<boolean>
    }
    codeScanner: {
      browse(): Promise<string | null>
      scan(path: string, scanner: string): Promise<ScanResult>
      onProgress(cb: (pct: number) => void): () => void
    }
    totp: {
      list(): Promise<TOTPAccount[]>
      generate(secret: string): Promise<{ code: string; timeLeft: number }>
      add(account: Omit<TOTPAccount, 'id'>): Promise<TOTPAccount>
      remove(id: string): Promise<boolean>
    }
    wordlists: {
      list(): Promise<WordlistEntry2[]>
      preview(path: string, n?: number): Promise<string[]>
      import(): Promise<string | null>
      delete(path: string): Promise<boolean>
      generate(opts: WordlistGenOpts): Promise<string>
    }
    passwordHealth: {
      checkHIBP(password: string): Promise<{ breached: boolean; count: number }>
    }
    wallpaper: {
      listCustom(): Promise<{ id: string; name: string; path: string; type: string }[]>
      browse(): Promise<string | null>
    }
    clipboardHistory: {
      getAll(): Promise<ClipEntry[]>
      copy(id: string): Promise<void>
      pin(id: string): Promise<ClipEntry[]>
      delete(id: string): Promise<ClipEntry[]>
      clear(): Promise<ClipEntry[]>
      onChange(cb: (entry: ClipEntry) => void): () => void
    }
    colorPicker: {
      getPalettes(): Promise<ColorPalette[]>
      savePalette(p: Omit<ColorPalette, 'id' | 'createdAt'>): Promise<ColorPalette>
      updatePalette(id: string, patch: Partial<ColorPalette>): Promise<ColorPalette[]>
      deletePalette(id: string): Promise<ColorPalette[]>
    }
    imageViewer: {
      open(): Promise<ImageFile | null>
      readFile(path: string): Promise<ImageFile | null>
      browseDir(dir: string): Promise<string[]>
    }
    remoteDesktop: {
      checkDeps(): Promise<{ x11vnc: boolean; websockify: boolean; novnc: boolean }>
      installDeps(): Promise<{ ok: boolean; error?: string }>
      start(opts: { password?: string; viewOnly?: boolean; vncPort?: number }): Promise<{ ok: boolean; ip: string; url: string; vncPort: number; wsPort: number; httpPort: number }>
      stop(): Promise<{ ok: boolean }>
      status(): Promise<{ running: boolean; vncAlive: boolean; wsAlive: boolean }>
      getIP(): Promise<string>
      onLog(cb: (msg: string) => void): () => void
      onStopped(cb: () => void): () => void
    }
    rssReader: {
      getFeeds(): Promise<RSSFeed[]>
      getItems(feedId?: string): Promise<RSSItem[]>
      addFeed(url: string): Promise<{ feed: RSSFeed; items: RSSItem[] }>
      removeFeed(id: string): Promise<void>
      refresh(id: string): Promise<RSSItem[]>
      markRead(itemId: string): Promise<void>
      markAllRead(feedId: string): Promise<void>
    }
    notifyUnlock(): void
    onLock(cb: () => void): () => void
    onOpenApp(cb: (appId: string) => void): () => void
    onNotification(cb: (n: { title: string; body: string }) => void): () => void
    onHudVolume(cb: (v: { level: number; muted: boolean }) => void): () => void
    onHudBrightness(cb: (v: { level: number }) => void): () => void
    onAppSwitcher(cb: (dir: 'next' | 'prev') => void): () => void
    onSpotlight(cb: () => void): () => void
    onWorkspaceChanged(cb: (n: number) => void): () => void
  }

  interface ShodanHost {
    ip_str: string
    hostnames: string[]
    ports: number[]
    org?: string
    isp?: string
    country_code?: string
    country_name?: string
    os?: string | null
    timestamp: string
  }

  interface CVEEntry {
    id: string
    description: string
    severity: string
    score: number
    published: string
    references: string[]
  }

  interface PacketEntry {
    id: number
    time: string
    src: string
    dst: string
    proto: string
    len: number
    info: string
  }

  interface BackupMeta {
    id: string
    name: string
    size: string
    created: string
    status: string
    items: number
  }

  interface AuditLogEntry {
    id: string
    ts: string
    type: 'security' | 'warning' | 'info' | 'success'
    category: string
    message: string
    details?: string
    user?: string
  }

  interface ScanResult {
    findings: ScanFinding[]
    scanned: number
    duration: number
    scanner: string
  }

  interface ScanFinding {
    id: string
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
    rule: string
    file: string
    line: number
    code: string
    message: string
    fix?: string
  }

  interface TOTPAccount {
    id: string
    name: string
    issuer: string
    secret: string
  }

  interface WordlistEntry2 {
    name: string
    path: string
    lineCount: number
    sizeKB: number
  }

  interface WordlistGenOpts {
    minLen: number
    maxLen: number
    charsets: string[]
    count: number
    prefix: string
    suffix: string
  }

  // ── New app types ────────────────────────────────────────────────────────────

  interface PasswordEntry {
    id: string
    title: string
    username: string
    password: string
    url?: string
    notes?: string
    tags?: string[]
    createdAt: string
    updatedAt: string
  }

  interface PasswordGenOpts {
    length: number
    upper: boolean
    lower: boolean
    numbers: boolean
    symbols: boolean
  }

  interface SshKey {
    name: string
    type: string
    fingerprint: string
    publicKey: string
    hasPrivate: boolean
    path: string
  }

  interface SshKeyGenOpts {
    name: string
    type: 'ed25519' | 'rsa'
    bits?: number
    comment?: string
    passphrase?: string
  }

  interface SshHost {
    host: string
    hostname?: string
    user?: string
    port?: string
    identityFile?: string
  }

  interface FirewallStatus {
    active: boolean
    defaultIn: string
    defaultOut: string
    rules: FirewallRule[]
  }

  interface FirewallRule {
    number: number
    to: string
    action: string
    from: string
    v6: boolean
  }

  interface FirewallRuleInput {
    port?: string
    proto?: string
    from?: string
    action: 'allow' | 'deny'
  }

  interface ProcessEntry {
    pid: number
    name: string
    cpu: number
    memMb: number
    memPct: number
    status: string
    user: string
    command: string
  }

  interface SystemStats {
    cpuPct: number
    memTotal: number
    memUsed: number
    memPct: number
  }

  interface LogLine {
    timestamp: string
    unit: string
    level: string
    message: string
    raw: string
  }

  interface LogQueryOpts {
    unit?: string
    lines?: number
    since?: string
    priority?: string
    search?: string
  }

  interface InterfaceStats {
    name: string
    rxBytes: number
    txBytes: number
  }

  interface NetmonStats {
    interfaces: Array<{
      name: string
      rxRate: number
      txRate: number
      rxTotal: number
      txTotal: number
    }>
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

  // ── Cert Inspector types ──────────────────────────────────────────────────

  interface CertInfo {
    subject: Record<string, string>
    issuer: Record<string, string>
    validFrom: string
    validTo: string
    daysRemaining: number
    sans: string[]
    publicKey: { algorithm: string; bits?: number; curve?: string }
    fingerprints: { sha256: string; sha1?: string }
    serialNumber: string
    signatureAlgorithm: string
    isCA: boolean
  }

  // ── Docker types ──────────────────────────────────────────────────────────

  interface DockerContainer {
    ID: string
    Names: string
    Image: string
    Status: string
    State: string
    Ports: string
    Created: string
  }

  interface DockerImage {
    ID: string
    Repository: string
    Tag: string
    Size: string
    CreatedAt: string
  }

  interface DockerStat {
    ID: string
    Name: string
    CPUPerc: string
    MemUsage: string
    MemPerc: string
    NetIO: string
    BlockIO: string
  }

  // ── Git types ─────────────────────────────────────────────────────────────

  interface GitStatus {
    branch: string
    files: { status: string; path: string; staged: boolean }[]
    ahead: number
    behind: number
  }

  interface GitCommit {
    hash: string
    shortHash: string
    subject: string
    author: string
    email: string
    relDate: string
    date: string
  }

  interface GitBranch {
    name: string
    isCurrent: boolean
  }

  // ── Database types ────────────────────────────────────────────────────────

  interface DbColumn {
    cid: number
    name: string
    type: string
    notnull: number
    dflt_value: string | null
    pk: number
  }

  interface DbQueryResult {
    rows: Record<string, unknown>[]
    columns: string[]
    total: number
    changes?: number
    error: string | null
  }

  // ── Trash types ───────────────────────────────────────────────────────────

  interface TrashItem {
    name: string
    originalPath: string
    deletionDate: string
    size: number
  }

  interface ClipEntry {
    id: string
    text: string
    ts: number
    pinned: boolean
  }

  interface ColorPalette {
    id: string
    name: string
    colors: string[]
    createdAt: number
  }

  interface ImageFile {
    path: string
    dataUrl: string
    name: string
    size: number
  }

  interface RSSFeed {
    id: string
    url: string
    title: string
    description: string
    lastFetched: number
  }

  interface RSSItem {
    id: string
    feedId: string
    title: string
    link: string
    description: string
    pubDate: string
    read: boolean
  }
}

export {}
