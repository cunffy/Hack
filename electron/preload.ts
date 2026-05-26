import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('cryogram', {
  // Window controls
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close:    () => ipcRenderer.send('window:close'),
  },

  // Terminal (PTY)
  terminal: {
    create:  (id: string, cols: number, rows: number) => ipcRenderer.invoke('terminal:create', id, cols, rows),
    write:   (id: string, data: string)               => ipcRenderer.send('terminal:write', id, data),
    resize:  (id: string, cols: number, rows: number) => ipcRenderer.send('terminal:resize', id, cols, rows),
    destroy: (id: string)                             => ipcRenderer.send('terminal:destroy', id),
    onData:  (id: string, cb: (data: string) => void) => {
      const channel  = `terminal:data:${id}`
      const listener = (_: unknown, data: string) => cb(data)
      ipcRenderer.on(channel, listener)
      return () => ipcRenderer.removeListener(channel, listener)
    },
  },

  // File system — code editor (workspace-scoped)
  fs: {
    readDir:     (path: string)                  => ipcRenderer.invoke('fs:readDir', path),
    readFile:    (path: string)                  => ipcRenderer.invoke('fs:readFile', path),
    writeFile:   (path: string, content: string) => ipcRenderer.invoke('fs:writeFile', path, content),
    getWorkspace:()                              => ipcRenderer.invoke('fs:getWorkspace'),
    openDialog:  ()                              => ipcRenderer.invoke('fs:openDialog'),
  },

  // File manager — home-scoped with full CRUD
  files: {
    getHome:      ()                                   => ipcRenderer.invoke('files:getHome'),
    getDrives:    ()                                   => ipcRenderer.invoke('files:getDrives'),
    readDir:      (path: string)                       => ipcRenderer.invoke('files:readDir', path),
    stat:         (path: string)                       => ipcRenderer.invoke('files:stat', path),
    readFile:     (path: string)                       => ipcRenderer.invoke('files:readFile', path),
    writeFile:    (path: string, content: string)      => ipcRenderer.invoke('files:writeFile', path, content),
    copy:         (src: string, dest: string)          => ipcRenderer.invoke('files:copy', src, dest),
    move:         (src: string, dest: string)          => ipcRenderer.invoke('files:move', src, dest),
    delete:       (path: string)                       => ipcRenderer.invoke('files:delete', path),
    mkdir:        (path: string)                       => ipcRenderer.invoke('files:mkdir', path),
    rename:       (path: string, newName: string)      => ipcRenderer.invoke('files:rename', path, newName),
    openExternal: (path: string)                       => ipcRenderer.invoke('files:openExternal', path),
    openDialog:   (mode?: 'open' | 'save' | 'folder') => ipcRenderer.invoke('files:openDialog', mode),
  },

  // Password tester
  passwordTester: {
    runCrack:   (opts: unknown)   => ipcRenderer.invoke('pt:runCrack', opts),
    runNetwork: (opts: unknown)   => ipcRenderer.invoke('pt:runNetwork', opts),
    cancel:     (jobId: string)   => ipcRenderer.send('pt:cancel', jobId),
    onProgress: (cb: (data: unknown) => void) => {
      const listener = (_: unknown, data: unknown) => cb(data)
      ipcRenderer.on('pt:progress', listener)
      return () => ipcRenderer.removeListener('pt:progress', listener)
    },
  },

  // Leaker
  leaker: {
    addTarget:    (target: unknown)     => ipcRenderer.invoke('leaker:addTarget', target),
    removeTarget: (id: number)          => ipcRenderer.invoke('leaker:removeTarget', id),
    getTargets:   ()                    => ipcRenderer.invoke('leaker:getTargets'),
    getBreaches:  (targetId?: number)   => ipcRenderer.invoke('leaker:getBreaches', targetId),
    forceRefresh: (targetId?: number)   => ipcRenderer.invoke('leaker:forceRefresh', targetId),
  },

  // Settings
  settings: {
    get:    (key: string)                => ipcRenderer.invoke('settings:get', key),
    set:    (key: string, value: unknown)=> ipcRenderer.invoke('settings:set', key, value),
    getAll: ()                           => ipcRenderer.invoke('settings:getAll'),
  },

  // System — WiFi, battery, volume, brightness, Bluetooth, power
  system: {
    getNetworks:          ()                            => ipcRenderer.invoke('system:getNetworks'),
    getWifiStatus:        ()                            => ipcRenderer.invoke('system:getWifiStatus'),
    connectNetwork:       (ssid: string, pw?: string)   => ipcRenderer.invoke('system:connectNetwork', ssid, pw),
    disconnectNetwork:    ()                            => ipcRenderer.invoke('system:disconnectNetwork'),
    rescanNetworks:       ()                            => ipcRenderer.invoke('system:rescanNetworks'),
    getBattery:           ()                            => ipcRenderer.invoke('system:getBattery'),
    getVolume:            ()                            => ipcRenderer.invoke('system:getVolume'),
    setVolume:            (level: number)               => ipcRenderer.invoke('system:setVolume', level),
    toggleMute:           ()                            => ipcRenderer.invoke('system:toggleMute'),
    getBrightness:        ()                            => ipcRenderer.invoke('system:getBrightness'),
    setBrightness:        (pct: number)                 => ipcRenderer.invoke('system:setBrightness', pct),
    getBluetoothDevices:  ()                            => ipcRenderer.invoke('system:getBluetoothDevices'),
    bluetoothConnect:     (address: string)             => ipcRenderer.invoke('system:bluetoothConnect', address),
    bluetoothDisconnect:  (address: string)             => ipcRenderer.invoke('system:bluetoothDisconnect', address),
    bluetoothScan:        ()                            => ipcRenderer.invoke('system:bluetoothScan'),
    getInfo:              ()                            => ipcRenderer.invoke('system:getInfo'),
    syncTime:             ()                              => ipcRenderer.invoke('system:syncTime'),
    shutdown:             ()                              => ipcRenderer.invoke('system:shutdown'),
    reboot:               ()                              => ipcRenderer.invoke('system:reboot'),
    sleep:                ()                              => ipcRenderer.invoke('system:sleep'),
    lock:                 ()                              => ipcRenderer.invoke('system:lock'),
    pickWallpaper:        ()                              => ipcRenderer.invoke('system:pickWallpaper'),
    setWallpaper:         (path: string)                  => ipcRenderer.invoke('system:setWallpaper', path),
    verifyPin:            (pin: string)                   => ipcRenderer.invoke('system:verifyPin', pin),
    setPin:               (pin: string, cur?: string)     => ipcRenderer.invoke('system:setPin', pin, cur),
    removePin:            (cur: string)                   => ipcRenderer.invoke('system:removePin', cur),
    setPinEnabled:        (on: boolean)                   => ipcRenderer.invoke('system:setPinEnabled', on),
  },

  // App launcher
  launcher: {
    getApps: ()             => ipcRenderer.invoke('launcher:getApps'),
    launch:  (app: unknown) => ipcRenderer.invoke('launcher:launch', app),
  },

  // X11 window manager (wmctrl) — tracks ALL open apps including external ones
  wm: {
    getWindows:         ()           => ipcRenderer.invoke('wm:getWindows'),
    focusWindow:        (id: string) => ipcRenderer.invoke('wm:focusWindow', id),
    closeWindow:        (id: string) => ipcRenderer.invoke('wm:closeWindow', id),
    hideShell:          ()           => ipcRenderer.invoke('wm:hideShell'),
    getCurrentWorkspace:()           => ipcRenderer.invoke('wm:getCurrentWorkspace'),
    switchWorkspace:    (n: number)  => ipcRenderer.invoke('wm:switchWorkspace', n),
    getWorkspaceCount:  ()           => ipcRenderer.invoke('wm:getWorkspaceCount'),
  },

  // Phone companion (ADB + scrcpy)
  phone: {
    getDevices:     ()                               => ipcRenderer.invoke('phone:getDevices'),
    getInfo:        (serial: string)                 => ipcRenderer.invoke('phone:getInfo', serial),
    getBattery:     (serial: string)                 => ipcRenderer.invoke('phone:getBattery', serial),
    getStorage:     (serial: string)                 => ipcRenderer.invoke('phone:getStorage', serial),
    checkScrcpy:    ()                               => ipcRenderer.invoke('phone:checkScrcpy'),
    installScrcpy:  ()                               => ipcRenderer.invoke('phone:installScrcpy'),
    startMirror:    (serial: string)                 => ipcRenderer.invoke('phone:startMirror', serial),
    stopMirror:     ()                               => ipcRenderer.invoke('phone:stopMirror'),
    isMirroring:    ()                               => ipcRenderer.invoke('phone:isMirroring'),
    enableWireless: (serial: string, port?: number)  => ipcRenderer.invoke('phone:enableWireless', serial, port),
    connectWifi:    (ip: string, port?: number)      => ipcRenderer.invoke('phone:connectWifi', ip, port),
    disconnect:     (address: string)                => ipcRenderer.invoke('phone:disconnect', address),
    getDeviceIp:    (serial: string)                 => ipcRenderer.invoke('phone:getDeviceIp', serial),
    screenshot:     (serial: string)                 => ipcRenderer.invoke('phone:screenshot', serial),
  },

  // Network scanner
  scanner: {
    check:      ()                                             => ipcRenderer.invoke('scanner:check'),
    run:        (target: string, type: string, ports?: string) => ipcRenderer.invoke('scanner:run', target, type, ports),
    cancel:     ()                                             => ipcRenderer.send('scanner:cancel'),
    onProgress: (cb: (line: string) => void) => {
      const listener = (_: unknown, line: string) => cb(line)
      ipcRenderer.on('scanner:progress', listener)
      return () => ipcRenderer.removeListener('scanner:progress', listener)
    },
  },

  // VPN manager
  vpn: {
    getStatus:  ()                => ipcRenderer.invoke('vpn:getStatus'),
    connect:    (profile: unknown)=> ipcRenderer.invoke('vpn:connect', profile),
    disconnect: ()                => ipcRenderer.invoke('vpn:disconnect'),
  },

  // Password manager (encrypted vault)
  passwords: {
    getAll:    ()                              => ipcRenderer.invoke('passwords:getAll'),
    add:       (entry: unknown)                => ipcRenderer.invoke('passwords:add', entry),
    update:    (id: string, patch: unknown)    => ipcRenderer.invoke('passwords:update', id, patch),
    delete:    (id: string)                    => ipcRenderer.invoke('passwords:delete', id),
    generate:  (opts: unknown)                 => ipcRenderer.invoke('passwords:generate', opts),
  },

  // SSH key manager
  ssh: {
    listKeys:      ()                           => ipcRenderer.invoke('ssh:listKeys'),
    generateKey:   (opts: unknown)              => ipcRenderer.invoke('ssh:generateKey', opts),
    deleteKey:     (name: string)               => ipcRenderer.invoke('ssh:deleteKey', name),
    getPublicKey:  (name: string)               => ipcRenderer.invoke('ssh:getPublicKey', name),
    listHosts:     ()                           => ipcRenderer.invoke('ssh:listHosts'),
    saveConfig:    (content: string)            => ipcRenderer.invoke('ssh:saveConfig', content),
  },

  // Firewall manager (UFW)
  firewall: {
    status:     ()                              => ipcRenderer.invoke('firewall:status'),
    enable:     ()                              => ipcRenderer.invoke('firewall:enable'),
    disable:    ()                              => ipcRenderer.invoke('firewall:disable'),
    addRule:    (rule: unknown)                 => ipcRenderer.invoke('firewall:addRule', rule),
    deleteRule: (num: number)                   => ipcRenderer.invoke('firewall:deleteRule', num),
    reset:      ()                              => ipcRenderer.invoke('firewall:reset'),
  },

  // Process / task manager
  processes: {
    list:           ()                          => ipcRenderer.invoke('processes:list'),
    kill:           (pid: number, sig?: string) => ipcRenderer.invoke('processes:kill', pid, sig),
    getSystemStats: ()                          => ipcRenderer.invoke('processes:getSystemStats'),
  },

  // Log viewer (journalctl)
  logs: {
    getUnits:   ()              => ipcRenderer.invoke('logs:getUnits'),
    query:      (opts: unknown) => ipcRenderer.invoke('logs:query', opts),
    stream:     (opts: unknown) => ipcRenderer.invoke('logs:stream', opts),
    stopStream: ()              => ipcRenderer.invoke('logs:stopStream'),
    onLine: (cb: (line: string) => void) => {
      const listener = (_: unknown, line: string) => cb(line)
      ipcRenderer.on('logs:line', listener)
      return () => ipcRenderer.removeListener('logs:line', listener)
    },
  },

  // Network monitor
  netmon: {
    getInterfaces:  () => ipcRenderer.invoke('netmon:getInterfaces'),
    getConnections: () => ipcRenderer.invoke('netmon:getConnections'),
    startStream:    () => ipcRenderer.invoke('netmon:startStream'),
    stopStream:     () => ipcRenderer.invoke('netmon:stopStream'),
    onStats: (cb: (stats: unknown) => void) => {
      const listener = (_: unknown, stats: unknown) => cb(stats)
      ipcRenderer.on('netmon:stats', listener)
      return () => ipcRenderer.removeListener('netmon:stats', listener)
    },
  },

  // Screenshot
  screenshot: {
    capture:          ()                         => ipcRenderer.invoke('screenshot:capture'),
    save:             (dataUrl: string, name?: string) => ipcRenderer.invoke('screenshot:save', dataUrl, name),
    copyToClipboard:  (dataUrl: string)          => ipcRenderer.invoke('screenshot:copyToClipboard', dataUrl),
  },

  // Update checker + runner
  updater: {
    check:      () => ipcRenderer.invoke('updater:check'),
    run:        (password?: string) => ipcRenderer.invoke('updater:run', password),
    onProgress: (cb: (line: string) => void) => {
      const listener = (_: unknown, line: string) => cb(line)
      ipcRenderer.on('updater:progress', listener)
      return () => ipcRenderer.removeListener('updater:progress', listener)
    },
  },

  // TLS cert inspector
  cert: {
    inspect:  (host: string, port?: number) => ipcRenderer.invoke('cert:inspect', host, port),
    parsePem: (pem: string)                 => ipcRenderer.invoke('cert:parsePem', pem),
  },

  // Docker
  docker: {
    listContainers: ()                          => ipcRenderer.invoke('docker:listContainers'),
    listImages:     ()                          => ipcRenderer.invoke('docker:listImages'),
    startContainer: (id: string)                => ipcRenderer.invoke('docker:startContainer', id),
    stopContainer:  (id: string)                => ipcRenderer.invoke('docker:stopContainer', id),
    restartContainer:(id: string)               => ipcRenderer.invoke('docker:restartContainer', id),
    removeContainer: (id: string)               => ipcRenderer.invoke('docker:removeContainer', id),
    getStats:       ()                          => ipcRenderer.invoke('docker:getStats'),
    pullImage:      (name: string)              => ipcRenderer.invoke('docker:pullImage', name),
    removeImage:    (id: string)                => ipcRenderer.invoke('docker:removeImage', id),
    getLogs:        (id: string, lines?: number)=> ipcRenderer.invoke('docker:getLogs', id, lines),
    onPullLine: (cb: (line: string) => void) => {
      const listener = (_: unknown, line: string) => cb(line)
      ipcRenderer.on('docker:pullLine', listener)
      return () => ipcRenderer.removeListener('docker:pullLine', listener)
    },
  },

  // Git
  git: {
    isRepo:      (repoPath: string)                        => ipcRenderer.invoke('git:isRepo', repoPath),
    status:      (repoPath: string)                        => ipcRenderer.invoke('git:status', repoPath),
    log:         (repoPath: string, limit?: number)        => ipcRenderer.invoke('git:log', repoPath, limit),
    diff:        (repoPath: string, file?: string, staged?: boolean) => ipcRenderer.invoke('git:diff', repoPath, file, staged),
    getBranches: (repoPath: string)                        => ipcRenderer.invoke('git:getBranches', repoPath),
    checkout:    (repoPath: string, branch: string)        => ipcRenderer.invoke('git:checkout', repoPath, branch),
    stage:       (repoPath: string, files: string[])       => ipcRenderer.invoke('git:stage', repoPath, files),
    unstage:     (repoPath: string, files: string[])       => ipcRenderer.invoke('git:unstage', repoPath, files),
    commit:      (repoPath: string, message: string)       => ipcRenderer.invoke('git:commit', repoPath, message),
    push:        (repoPath: string)                        => ipcRenderer.invoke('git:push', repoPath),
    pull:        (repoPath: string)                        => ipcRenderer.invoke('git:pull', repoPath),
    stash:       (repoPath: string)                        => ipcRenderer.invoke('git:stash', repoPath),
    stashPop:    (repoPath: string)                        => ipcRenderer.invoke('git:stashPop', repoPath),
    init:        (repoPath: string)                        => ipcRenderer.invoke('git:init', repoPath),
  },

  // SQLite browser
  db: {
    open:             (filePath: string)                            => ipcRenderer.invoke('db:open', filePath),
    close:            (sessionId: string)                           => ipcRenderer.invoke('db:close', sessionId),
    listTables:       (sessionId: string)                           => ipcRenderer.invoke('db:listTables', sessionId),
    getSchema:        (sessionId: string, table: string)            => ipcRenderer.invoke('db:getSchema', sessionId, table),
    getTableRowCount: (sessionId: string, table: string)            => ipcRenderer.invoke('db:getTableRowCount', sessionId, table),
    query:            (sessionId: string, sql: string, page?: number, pageSize?: number) => ipcRenderer.invoke('db:query', sessionId, sql, page, pageSize),
  },

  // Trash
  trash: {
    list:            ()            => ipcRenderer.invoke('trash:list'),
    moveToTrash:     (path: string)=> ipcRenderer.invoke('trash:moveToTrash', path),
    restore:         (name: string)=> ipcRenderer.invoke('trash:restore', name),
    deletePermanent: (name: string)=> ipcRenderer.invoke('trash:deletePermanent', name),
    empty:           ()            => ipcRenderer.invoke('trash:empty'),
    getSize:         ()            => ipcRenderer.invoke('trash:getSize'),
  },

  // Tell main process the lock screen was dismissed so it clears alwaysOnTop
  notifyUnlock: () => ipcRenderer.send('screen:unlock'),

  // Lock screen events from main (system resume, manual lock)
  onLock: (cb: () => void) => {
    const listener = () => cb()
    ipcRenderer.on('screen:lock', listener)
    return () => ipcRenderer.removeListener('screen:lock', listener)
  },

  // Global shortcut → open a named app (e.g. Ctrl+Alt+T → terminal)
  onOpenApp: (cb: (appId: string) => void) => {
    const listener = (_: unknown, appId: string) => cb(appId)
    ipcRenderer.on('open:app', listener)
    return () => ipcRenderer.removeListener('open:app', listener)
  },

  // Notifications from main
  onNotification: (cb: (n: { title: string; body: string }) => void) => {
    const listener = (_: unknown, n: unknown) => cb(n as { title: string; body: string })
    ipcRenderer.on('notification', listener)
    return () => ipcRenderer.removeListener('notification', listener)
  },

  // Volume HUD — fired by keyboard media keys
  onHudVolume: (cb: (v: { level: number; muted: boolean }) => void) => {
    const listener = (_: unknown, v: unknown) => cb(v as { level: number; muted: boolean })
    ipcRenderer.on('hud:volume', listener)
    return () => ipcRenderer.removeListener('hud:volume', listener)
  },

  // Brightness HUD — fired by keyboard brightness keys
  onHudBrightness: (cb: (v: { level: number }) => void) => {
    const listener = (_: unknown, v: unknown) => cb(v as { level: number })
    ipcRenderer.on('hud:brightness', listener)
    return () => ipcRenderer.removeListener('hud:brightness', listener)
  },

  // Alt+Tab app switcher direction
  onAppSwitcher: (cb: (dir: 'next' | 'prev') => void) => {
    const listener = (_: unknown, dir: unknown) => cb(dir as 'next' | 'prev')
    ipcRenderer.on('app:switcher', listener)
    return () => ipcRenderer.removeListener('app:switcher', listener)
  },

  // Ctrl+Space spotlight shortcut from main
  onSpotlight: (cb: () => void) => {
    const listener = () => cb()
    ipcRenderer.on('open:spotlight', listener)
    return () => ipcRenderer.removeListener('open:spotlight', listener)
  },

  // Super+1/2/3/4 workspace switch from main
  onWorkspaceChanged: (cb: (n: number) => void) => {
    const listener = (_: unknown, n: unknown) => cb(n as number)
    ipcRenderer.on('workspace:changed', listener)
    return () => ipcRenderer.removeListener('workspace:changed', listener)
  },

  // Shodan
  shodan: {
    search:   (query: string, page?: number) => ipcRenderer.invoke('shodan:search', query, page),
    host:     (ip: string)                   => ipcRenderer.invoke('shodan:host', ip),
    count:    (query: string)                => ipcRenderer.invoke('shodan:count', query),
    exploits: (query: string)               => ipcRenderer.invoke('shodan:exploits', query),
  },

  // OSINT
  osint: {
    lookup: (tool: string, query: string) => ipcRenderer.invoke('osint:lookup', tool, query),
  },

  // CVE Database
  cve: {
    search: (query: string) => ipcRenderer.invoke('cve:search', query),
    recent: (count?: number) => ipcRenderer.invoke('cve:recent', count),
  },

  // AI Assistant
  ai: {
    chat: (messages: { role: string; content: string }[]) => ipcRenderer.invoke('ai:chat', messages),
  },

  // Packet Sniffer
  packetSniffer: {
    start: (iface: string, filter: string, cb: (pkt: unknown) => void) => {
      const listener = (_: unknown, pkt: unknown) => cb(pkt)
      ipcRenderer.on('packetSniffer:packet', listener)
      ipcRenderer.invoke('packetSniffer:start', iface, filter)
      return () => ipcRenderer.removeListener('packetSniffer:packet', listener)
    },
    stop: () => ipcRenderer.invoke('packetSniffer:stop'),
  },

  // System Backup
  backup: {
    list:    ()          => ipcRenderer.invoke('backup:list'),
    create:  ()          => ipcRenderer.invoke('backup:create'),
    restore: (id: string)=> ipcRenderer.invoke('backup:restore', id),
    delete:  (id: string)=> ipcRenderer.invoke('backup:delete', id),
    onProgress: (cb: (msg: string, pct: number) => void) => {
      const listener = (_: unknown, msg: unknown, pct: unknown) => cb(msg as string, pct as number)
      ipcRenderer.on('backup:progress', listener)
      return () => ipcRenderer.removeListener('backup:progress', listener)
    },
  },

  // Audit Log
  auditLog: {
    list:   ()                  => ipcRenderer.invoke('auditLog:list'),
    append: (entry: unknown)    => ipcRenderer.invoke('auditLog:append', entry),
    clear:  ()                  => ipcRenderer.invoke('auditLog:clear'),
  },

  // Code Scanner
  codeScanner: {
    browse: ()                                          => ipcRenderer.invoke('codeScanner:browse'),
    scan:   (path: string, scanner: string)             => ipcRenderer.invoke('codeScanner:scan', path, scanner),
    onProgress: (cb: (pct: number) => void) => {
      const listener = (_: unknown, pct: unknown) => cb(pct as number)
      ipcRenderer.on('codeScanner:progress', listener)
      return () => ipcRenderer.removeListener('codeScanner:progress', listener)
    },
  },

  // TOTP / 2FA
  totp: {
    list:     ()                    => ipcRenderer.invoke('totp:list'),
    generate: (secret: string)      => ipcRenderer.invoke('totp:generate', secret),
    add:      (account: unknown)    => ipcRenderer.invoke('totp:add', account),
    remove:   (id: string)          => ipcRenderer.invoke('totp:remove', id),
  },

  // Wordlists
  wordlists: {
    list:     ()                    => ipcRenderer.invoke('wordlists:list'),
    preview:  (path: string, n?: number) => ipcRenderer.invoke('wordlists:preview', path, n),
    import:   ()                    => ipcRenderer.invoke('wordlists:import'),
    delete:   (path: string)        => ipcRenderer.invoke('wordlists:delete', path),
    generate: (opts: unknown)       => ipcRenderer.invoke('wordlists:generate', opts),
  },

  // Password Health
  passwordHealth: {
    checkHIBP: (password: string) => ipcRenderer.invoke('passwordHealth:checkHIBP', password),
  },

  // Wallpaper
  wallpaper: {
    listCustom: ()           => ipcRenderer.invoke('wallpaper:listCustom'),
    browse:     ()           => ipcRenderer.invoke('wallpaper:browse'),
  },
})

export type CryogramAPI = typeof import('./preload')
