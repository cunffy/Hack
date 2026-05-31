"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("cryogram", {
  // Window controls
  window: {
    minimize: () => electron.ipcRenderer.send("window:minimize"),
    maximize: () => electron.ipcRenderer.send("window:maximize"),
    close: () => electron.ipcRenderer.send("window:close")
  },
  // Terminal (PTY)
  terminal: {
    create: (id, cols, rows) => electron.ipcRenderer.invoke("terminal:create", id, cols, rows),
    write: (id, data) => electron.ipcRenderer.send("terminal:write", id, data),
    resize: (id, cols, rows) => electron.ipcRenderer.send("terminal:resize", id, cols, rows),
    destroy: (id) => electron.ipcRenderer.send("terminal:destroy", id),
    onData: (id, cb) => {
      const channel = `terminal:data:${id}`;
      const listener = (_, data) => cb(data);
      electron.ipcRenderer.on(channel, listener);
      return () => electron.ipcRenderer.removeListener(channel, listener);
    }
  },
  // File system — code editor (workspace-scoped)
  fs: {
    readDir: (path) => electron.ipcRenderer.invoke("fs:readDir", path),
    readFile: (path) => electron.ipcRenderer.invoke("fs:readFile", path),
    writeFile: (path, content) => electron.ipcRenderer.invoke("fs:writeFile", path, content),
    getWorkspace: () => electron.ipcRenderer.invoke("fs:getWorkspace"),
    openDialog: () => electron.ipcRenderer.invoke("fs:openDialog")
  },
  // File manager — home-scoped with full CRUD
  files: {
    getHome: () => electron.ipcRenderer.invoke("files:getHome"),
    getDrives: () => electron.ipcRenderer.invoke("files:getDrives"),
    readDir: (path) => electron.ipcRenderer.invoke("files:readDir", path),
    stat: (path) => electron.ipcRenderer.invoke("files:stat", path),
    readFile: (path) => electron.ipcRenderer.invoke("files:readFile", path),
    writeFile: (path, content) => electron.ipcRenderer.invoke("files:writeFile", path, content),
    copy: (src, dest) => electron.ipcRenderer.invoke("files:copy", src, dest),
    move: (src, dest) => electron.ipcRenderer.invoke("files:move", src, dest),
    delete: (path) => electron.ipcRenderer.invoke("files:delete", path),
    mkdir: (path) => electron.ipcRenderer.invoke("files:mkdir", path),
    rename: (path, newName) => electron.ipcRenderer.invoke("files:rename", path, newName),
    openExternal: (path) => electron.ipcRenderer.invoke("files:openExternal", path),
    openDialog: (mode) => electron.ipcRenderer.invoke("files:openDialog", mode)
  },
  // Password tester
  passwordTester: {
    runCrack: (opts) => electron.ipcRenderer.invoke("pt:runCrack", opts),
    runNetwork: (opts) => electron.ipcRenderer.invoke("pt:runNetwork", opts),
    cancel: (jobId) => electron.ipcRenderer.send("pt:cancel", jobId),
    onProgress: (cb) => {
      const listener = (_, data) => cb(data);
      electron.ipcRenderer.on("pt:progress", listener);
      return () => electron.ipcRenderer.removeListener("pt:progress", listener);
    }
  },
  // Leaker
  leaker: {
    addTarget: (target) => electron.ipcRenderer.invoke("leaker:addTarget", target),
    removeTarget: (id) => electron.ipcRenderer.invoke("leaker:removeTarget", id),
    getTargets: () => electron.ipcRenderer.invoke("leaker:getTargets"),
    getBreaches: (targetId) => electron.ipcRenderer.invoke("leaker:getBreaches", targetId),
    forceRefresh: (targetId) => electron.ipcRenderer.invoke("leaker:forceRefresh", targetId)
  },
  // Settings
  settings: {
    get: (key) => electron.ipcRenderer.invoke("settings:get", key),
    set: (key, value) => electron.ipcRenderer.invoke("settings:set", key, value),
    getAll: () => electron.ipcRenderer.invoke("settings:getAll")
  },
  // System — WiFi, battery, volume, brightness, Bluetooth, power
  system: {
    getNetworks: () => electron.ipcRenderer.invoke("system:getNetworks"),
    getWifiStatus: () => electron.ipcRenderer.invoke("system:getWifiStatus"),
    connectNetwork: (ssid, pw) => electron.ipcRenderer.invoke("system:connectNetwork", ssid, pw),
    disconnectNetwork: () => electron.ipcRenderer.invoke("system:disconnectNetwork"),
    rescanNetworks: () => electron.ipcRenderer.invoke("system:rescanNetworks"),
    getBattery: () => electron.ipcRenderer.invoke("system:getBattery"),
    getVolume: () => electron.ipcRenderer.invoke("system:getVolume"),
    setVolume: (level) => electron.ipcRenderer.invoke("system:setVolume", level),
    toggleMute: () => electron.ipcRenderer.invoke("system:toggleMute"),
    getBrightness: () => electron.ipcRenderer.invoke("system:getBrightness"),
    setBrightness: (pct) => electron.ipcRenderer.invoke("system:setBrightness", pct),
    getBluetoothDevices: () => electron.ipcRenderer.invoke("system:getBluetoothDevices"),
    bluetoothConnect: (address) => electron.ipcRenderer.invoke("system:bluetoothConnect", address),
    bluetoothDisconnect: (address) => electron.ipcRenderer.invoke("system:bluetoothDisconnect", address),
    bluetoothScan: () => electron.ipcRenderer.invoke("system:bluetoothScan"),
    getInfo: () => electron.ipcRenderer.invoke("system:getInfo"),
    syncTime: () => electron.ipcRenderer.invoke("system:syncTime"),
    shutdown: () => electron.ipcRenderer.invoke("system:shutdown"),
    reboot: () => electron.ipcRenderer.invoke("system:reboot"),
    sleep: () => electron.ipcRenderer.invoke("system:sleep"),
    lock: () => electron.ipcRenderer.invoke("system:lock"),
    pickWallpaper: () => electron.ipcRenderer.invoke("system:pickWallpaper"),
    setWallpaper: (path) => electron.ipcRenderer.invoke("system:setWallpaper", path),
    verifyPin: (pin) => electron.ipcRenderer.invoke("system:verifyPin", pin),
    setPin: (pin, cur) => electron.ipcRenderer.invoke("system:setPin", pin, cur),
    removePin: (cur) => electron.ipcRenderer.invoke("system:removePin", cur),
    setPinEnabled: (on) => electron.ipcRenderer.invoke("system:setPinEnabled", on)
  },
  // App launcher
  launcher: {
    getApps: () => electron.ipcRenderer.invoke("launcher:getApps"),
    launch: (app) => electron.ipcRenderer.invoke("launcher:launch", app)
  },
  // X11 window manager (wmctrl) — tracks ALL open apps including external ones
  wm: {
    getWindows: () => electron.ipcRenderer.invoke("wm:getWindows"),
    focusWindow: (id) => electron.ipcRenderer.invoke("wm:focusWindow", id),
    closeWindow: (id) => electron.ipcRenderer.invoke("wm:closeWindow", id),
    hideShell: () => electron.ipcRenderer.invoke("wm:hideShell"),
    getCurrentWorkspace: () => electron.ipcRenderer.invoke("wm:getCurrentWorkspace"),
    switchWorkspace: (n) => electron.ipcRenderer.invoke("wm:switchWorkspace", n),
    getWorkspaceCount: () => electron.ipcRenderer.invoke("wm:getWorkspaceCount")
  },
  // Phone companion (ADB + scrcpy)
  phone: {
    getDevices: () => electron.ipcRenderer.invoke("phone:getDevices"),
    getInfo: (serial) => electron.ipcRenderer.invoke("phone:getInfo", serial),
    getBattery: (serial) => electron.ipcRenderer.invoke("phone:getBattery", serial),
    getStorage: (serial) => electron.ipcRenderer.invoke("phone:getStorage", serial),
    checkScrcpy: () => electron.ipcRenderer.invoke("phone:checkScrcpy"),
    installScrcpy: () => electron.ipcRenderer.invoke("phone:installScrcpy"),
    startMirror: (serial) => electron.ipcRenderer.invoke("phone:startMirror", serial),
    stopMirror: () => electron.ipcRenderer.invoke("phone:stopMirror"),
    isMirroring: () => electron.ipcRenderer.invoke("phone:isMirroring"),
    enableWireless: (serial, port) => electron.ipcRenderer.invoke("phone:enableWireless", serial, port),
    connectWifi: (ip, port) => electron.ipcRenderer.invoke("phone:connectWifi", ip, port),
    disconnect: (address) => electron.ipcRenderer.invoke("phone:disconnect", address),
    getDeviceIp: (serial) => electron.ipcRenderer.invoke("phone:getDeviceIp", serial),
    screenshot: (serial) => electron.ipcRenderer.invoke("phone:screenshot", serial)
  },
  // Network scanner
  scanner: {
    check: () => electron.ipcRenderer.invoke("scanner:check"),
    run: (target, type, ports) => electron.ipcRenderer.invoke("scanner:run", target, type, ports),
    cancel: () => electron.ipcRenderer.send("scanner:cancel"),
    onProgress: (cb) => {
      const listener = (_, line) => cb(line);
      electron.ipcRenderer.on("scanner:progress", listener);
      return () => electron.ipcRenderer.removeListener("scanner:progress", listener);
    }
  },
  // VPN manager
  vpn: {
    getStatus: () => electron.ipcRenderer.invoke("vpn:getStatus"),
    connect: (profile) => electron.ipcRenderer.invoke("vpn:connect", profile),
    disconnect: () => electron.ipcRenderer.invoke("vpn:disconnect")
  },
  // Password manager (encrypted vault)
  passwords: {
    getAll: () => electron.ipcRenderer.invoke("passwords:getAll"),
    add: (entry) => electron.ipcRenderer.invoke("passwords:add", entry),
    update: (id, patch) => electron.ipcRenderer.invoke("passwords:update", id, patch),
    delete: (id) => electron.ipcRenderer.invoke("passwords:delete", id),
    generate: (opts) => electron.ipcRenderer.invoke("passwords:generate", opts)
  },
  // SSH key manager
  ssh: {
    listKeys: () => electron.ipcRenderer.invoke("ssh:listKeys"),
    generateKey: (opts) => electron.ipcRenderer.invoke("ssh:generateKey", opts),
    deleteKey: (name) => electron.ipcRenderer.invoke("ssh:deleteKey", name),
    getPublicKey: (name) => electron.ipcRenderer.invoke("ssh:getPublicKey", name),
    listHosts: () => electron.ipcRenderer.invoke("ssh:listHosts"),
    saveConfig: (content) => electron.ipcRenderer.invoke("ssh:saveConfig", content)
  },
  // Firewall manager (UFW)
  firewall: {
    status: () => electron.ipcRenderer.invoke("firewall:status"),
    enable: () => electron.ipcRenderer.invoke("firewall:enable"),
    disable: () => electron.ipcRenderer.invoke("firewall:disable"),
    addRule: (rule) => electron.ipcRenderer.invoke("firewall:addRule", rule),
    deleteRule: (num) => electron.ipcRenderer.invoke("firewall:deleteRule", num),
    reset: () => electron.ipcRenderer.invoke("firewall:reset")
  },
  // Process / task manager
  processes: {
    list: () => electron.ipcRenderer.invoke("processes:list"),
    kill: (pid, sig) => electron.ipcRenderer.invoke("processes:kill", pid, sig),
    getSystemStats: () => electron.ipcRenderer.invoke("processes:getSystemStats")
  },
  // Log viewer (journalctl)
  logs: {
    getUnits: () => electron.ipcRenderer.invoke("logs:getUnits"),
    query: (opts) => electron.ipcRenderer.invoke("logs:query", opts),
    stream: (opts) => electron.ipcRenderer.invoke("logs:stream", opts),
    stopStream: () => electron.ipcRenderer.invoke("logs:stopStream"),
    onLine: (cb) => {
      const listener = (_, line) => cb(line);
      electron.ipcRenderer.on("logs:line", listener);
      return () => electron.ipcRenderer.removeListener("logs:line", listener);
    }
  },
  // Network monitor
  netmon: {
    getInterfaces: () => electron.ipcRenderer.invoke("netmon:getInterfaces"),
    getConnections: () => electron.ipcRenderer.invoke("netmon:getConnections"),
    startStream: () => electron.ipcRenderer.invoke("netmon:startStream"),
    stopStream: () => electron.ipcRenderer.invoke("netmon:stopStream"),
    onStats: (cb) => {
      const listener = (_, stats) => cb(stats);
      electron.ipcRenderer.on("netmon:stats", listener);
      return () => electron.ipcRenderer.removeListener("netmon:stats", listener);
    }
  },
  // Screenshot
  screenshot: {
    capture: () => electron.ipcRenderer.invoke("screenshot:capture"),
    save: (dataUrl, name) => electron.ipcRenderer.invoke("screenshot:save", dataUrl, name),
    copyToClipboard: (dataUrl) => electron.ipcRenderer.invoke("screenshot:copyToClipboard", dataUrl)
  },
  // Shell layer control — raise/sink Electron relative to X11 apps
  shell: {
    sink: () => electron.ipcRenderer.send("shell:sink"),
    unpin: () => electron.ipcRenderer.send("shell:unpin")
  },
  // Update checker + runner
  updater: {
    check: () => electron.ipcRenderer.invoke("updater:check"),
    run: (password) => electron.ipcRenderer.invoke("updater:run", password),
    isRoot: () => electron.ipcRenderer.invoke("updater:isRoot"),
    onProgress: (cb) => {
      const listener = (_, line) => cb(line);
      electron.ipcRenderer.on("updater:progress", listener);
      return () => electron.ipcRenderer.removeListener("updater:progress", listener);
    }
  },
  // TLS cert inspector
  cert: {
    inspect: (host, port) => electron.ipcRenderer.invoke("cert:inspect", host, port),
    parsePem: (pem) => electron.ipcRenderer.invoke("cert:parsePem", pem)
  },
  // Docker
  docker: {
    listContainers: () => electron.ipcRenderer.invoke("docker:listContainers"),
    listImages: () => electron.ipcRenderer.invoke("docker:listImages"),
    startContainer: (id) => electron.ipcRenderer.invoke("docker:startContainer", id),
    stopContainer: (id) => electron.ipcRenderer.invoke("docker:stopContainer", id),
    restartContainer: (id) => electron.ipcRenderer.invoke("docker:restartContainer", id),
    removeContainer: (id) => electron.ipcRenderer.invoke("docker:removeContainer", id),
    getStats: () => electron.ipcRenderer.invoke("docker:getStats"),
    pullImage: (name) => electron.ipcRenderer.invoke("docker:pullImage", name),
    removeImage: (id) => electron.ipcRenderer.invoke("docker:removeImage", id),
    getLogs: (id, lines) => electron.ipcRenderer.invoke("docker:getLogs", id, lines),
    onPullLine: (cb) => {
      const listener = (_, line) => cb(line);
      electron.ipcRenderer.on("docker:pullLine", listener);
      return () => electron.ipcRenderer.removeListener("docker:pullLine", listener);
    }
  },
  // Git
  git: {
    isRepo: (repoPath) => electron.ipcRenderer.invoke("git:isRepo", repoPath),
    status: (repoPath) => electron.ipcRenderer.invoke("git:status", repoPath),
    log: (repoPath, limit) => electron.ipcRenderer.invoke("git:log", repoPath, limit),
    diff: (repoPath, file, staged) => electron.ipcRenderer.invoke("git:diff", repoPath, file, staged),
    getBranches: (repoPath) => electron.ipcRenderer.invoke("git:getBranches", repoPath),
    checkout: (repoPath, branch) => electron.ipcRenderer.invoke("git:checkout", repoPath, branch),
    stage: (repoPath, files) => electron.ipcRenderer.invoke("git:stage", repoPath, files),
    unstage: (repoPath, files) => electron.ipcRenderer.invoke("git:unstage", repoPath, files),
    commit: (repoPath, message) => electron.ipcRenderer.invoke("git:commit", repoPath, message),
    push: (repoPath) => electron.ipcRenderer.invoke("git:push", repoPath),
    pull: (repoPath) => electron.ipcRenderer.invoke("git:pull", repoPath),
    stash: (repoPath) => electron.ipcRenderer.invoke("git:stash", repoPath),
    stashPop: (repoPath) => electron.ipcRenderer.invoke("git:stashPop", repoPath),
    init: (repoPath) => electron.ipcRenderer.invoke("git:init", repoPath)
  },
  // SQLite browser
  db: {
    open: (filePath) => electron.ipcRenderer.invoke("db:open", filePath),
    close: (sessionId) => electron.ipcRenderer.invoke("db:close", sessionId),
    listTables: (sessionId) => electron.ipcRenderer.invoke("db:listTables", sessionId),
    getSchema: (sessionId, table) => electron.ipcRenderer.invoke("db:getSchema", sessionId, table),
    getTableRowCount: (sessionId, table) => electron.ipcRenderer.invoke("db:getTableRowCount", sessionId, table),
    query: (sessionId, sql, page, pageSize) => electron.ipcRenderer.invoke("db:query", sessionId, sql, page, pageSize)
  },
  // Trash
  trash: {
    list: () => electron.ipcRenderer.invoke("trash:list"),
    moveToTrash: (path) => electron.ipcRenderer.invoke("trash:moveToTrash", path),
    restore: (name) => electron.ipcRenderer.invoke("trash:restore", name),
    deletePermanent: (name) => electron.ipcRenderer.invoke("trash:deletePermanent", name),
    empty: () => electron.ipcRenderer.invoke("trash:empty"),
    getSize: () => electron.ipcRenderer.invoke("trash:getSize")
  },
  // Tell main process the lock screen was dismissed so it clears alwaysOnTop
  notifyUnlock: () => electron.ipcRenderer.send("screen:unlock"),
  // Lock screen events from main (system resume, manual lock)
  onLock: (cb) => {
    const listener = () => cb();
    electron.ipcRenderer.on("screen:lock", listener);
    return () => electron.ipcRenderer.removeListener("screen:lock", listener);
  },
  // Global shortcut → open a named app (e.g. Ctrl+Alt+T → terminal)
  onOpenApp: (cb) => {
    const listener = (_, appId) => cb(appId);
    electron.ipcRenderer.on("open:app", listener);
    return () => electron.ipcRenderer.removeListener("open:app", listener);
  },
  // Notifications from main
  onNotification: (cb) => {
    const listener = (_, n) => cb(n);
    electron.ipcRenderer.on("notification", listener);
    return () => electron.ipcRenderer.removeListener("notification", listener);
  },
  // Volume HUD — fired by keyboard media keys
  onHudVolume: (cb) => {
    const listener = (_, v) => cb(v);
    electron.ipcRenderer.on("hud:volume", listener);
    return () => electron.ipcRenderer.removeListener("hud:volume", listener);
  },
  // Brightness HUD — fired by keyboard brightness keys
  onHudBrightness: (cb) => {
    const listener = (_, v) => cb(v);
    electron.ipcRenderer.on("hud:brightness", listener);
    return () => electron.ipcRenderer.removeListener("hud:brightness", listener);
  },
  // Alt+Tab app switcher direction
  onAppSwitcher: (cb) => {
    const listener = (_, dir) => cb(dir);
    electron.ipcRenderer.on("app:switcher", listener);
    return () => electron.ipcRenderer.removeListener("app:switcher", listener);
  },
  // Ctrl+Space spotlight shortcut from main
  onSpotlight: (cb) => {
    const listener = () => cb();
    electron.ipcRenderer.on("open:spotlight", listener);
    return () => electron.ipcRenderer.removeListener("open:spotlight", listener);
  },
  // Super+1/2/3/4 workspace switch from main
  onWorkspaceChanged: (cb) => {
    const listener = (_, n) => cb(n);
    electron.ipcRenderer.on("workspace:changed", listener);
    return () => electron.ipcRenderer.removeListener("workspace:changed", listener);
  },
  // Super+Left/Right/Up window snapping
  onSnap: (cb) => {
    const listener = (_, side) => cb(side);
    electron.ipcRenderer.on("window:snap", listener);
    return () => electron.ipcRenderer.removeListener("window:snap", listener);
  },
  // Shodan
  shodan: {
    search: (query, page) => electron.ipcRenderer.invoke("shodan:search", query, page),
    host: (ip) => electron.ipcRenderer.invoke("shodan:host", ip),
    count: (query) => electron.ipcRenderer.invoke("shodan:count", query),
    exploits: (query) => electron.ipcRenderer.invoke("shodan:exploits", query)
  },
  // OSINT
  osint: {
    lookup: (tool, query) => electron.ipcRenderer.invoke("osint:lookup", tool, query)
  },
  // CVE Database
  cve: {
    search: (query) => electron.ipcRenderer.invoke("cve:search", query),
    recent: (count) => electron.ipcRenderer.invoke("cve:recent", count)
  },
  // AI Assistant
  ai: {
    chat: (messages) => electron.ipcRenderer.invoke("ai:chat", messages)
  },
  // Packet Sniffer
  packetSniffer: {
    start: (iface, filter, cb) => {
      const listener = (_, pkt) => cb(pkt);
      electron.ipcRenderer.on("packetSniffer:packet", listener);
      electron.ipcRenderer.invoke("packetSniffer:start", iface, filter);
      return () => electron.ipcRenderer.removeListener("packetSniffer:packet", listener);
    },
    stop: () => electron.ipcRenderer.invoke("packetSniffer:stop")
  },
  // System Backup
  backup: {
    list: () => electron.ipcRenderer.invoke("backup:list"),
    create: () => electron.ipcRenderer.invoke("backup:create"),
    restore: (id) => electron.ipcRenderer.invoke("backup:restore", id),
    delete: (id) => electron.ipcRenderer.invoke("backup:delete", id),
    onProgress: (cb) => {
      const listener = (_, msg, pct) => cb(msg, pct);
      electron.ipcRenderer.on("backup:progress", listener);
      return () => electron.ipcRenderer.removeListener("backup:progress", listener);
    }
  },
  // Audit Log
  auditLog: {
    list: () => electron.ipcRenderer.invoke("auditLog:list"),
    append: (entry) => electron.ipcRenderer.invoke("auditLog:append", entry),
    clear: () => electron.ipcRenderer.invoke("auditLog:clear")
  },
  // Code Scanner
  codeScanner: {
    browse: () => electron.ipcRenderer.invoke("codeScanner:browse"),
    scan: (path, scanner) => electron.ipcRenderer.invoke("codeScanner:scan", path, scanner),
    onProgress: (cb) => {
      const listener = (_, pct) => cb(pct);
      electron.ipcRenderer.on("codeScanner:progress", listener);
      return () => electron.ipcRenderer.removeListener("codeScanner:progress", listener);
    }
  },
  // TOTP / 2FA
  totp: {
    list: () => electron.ipcRenderer.invoke("totp:list"),
    generate: (secret) => electron.ipcRenderer.invoke("totp:generate", secret),
    add: (account) => electron.ipcRenderer.invoke("totp:add", account),
    remove: (id) => electron.ipcRenderer.invoke("totp:remove", id)
  },
  // Wordlists
  wordlists: {
    list: () => electron.ipcRenderer.invoke("wordlists:list"),
    preview: (path, n) => electron.ipcRenderer.invoke("wordlists:preview", path, n),
    import: () => electron.ipcRenderer.invoke("wordlists:import"),
    delete: (path) => electron.ipcRenderer.invoke("wordlists:delete", path),
    generate: (opts) => electron.ipcRenderer.invoke("wordlists:generate", opts)
  },
  // Password Health
  passwordHealth: {
    checkHIBP: (password) => electron.ipcRenderer.invoke("passwordHealth:checkHIBP", password)
  },
  // Wallpaper
  wallpaper: {
    listCustom: () => electron.ipcRenderer.invoke("wallpaper:listCustom"),
    browse: () => electron.ipcRenderer.invoke("wallpaper:browse")
  },
  // Clipboard History
  clipboardHistory: {
    getAll: () => electron.ipcRenderer.invoke("clipboard:getAll"),
    copy: (id) => electron.ipcRenderer.invoke("clipboard:copy", id),
    pin: (id) => electron.ipcRenderer.invoke("clipboard:pin", id),
    delete: (id) => electron.ipcRenderer.invoke("clipboard:delete", id),
    clear: () => electron.ipcRenderer.invoke("clipboard:clear"),
    onChange: (cb) => {
      const listener = (_, entry) => cb(entry);
      electron.ipcRenderer.on("clipboard:change", listener);
      return () => electron.ipcRenderer.removeListener("clipboard:change", listener);
    }
  },
  // Color Picker
  colorPicker: {
    getPalettes: () => electron.ipcRenderer.invoke("colorPicker:getPalettes"),
    savePalette: (p) => electron.ipcRenderer.invoke("colorPicker:savePalette", p),
    updatePalette: (id, patch) => electron.ipcRenderer.invoke("colorPicker:updatePalette", id, patch),
    deletePalette: (id) => electron.ipcRenderer.invoke("colorPicker:deletePalette", id)
  },
  // Image Viewer
  imageViewer: {
    open: () => electron.ipcRenderer.invoke("imageViewer:open"),
    readFile: (path) => electron.ipcRenderer.invoke("imageViewer:readFile", path),
    browseDir: (dir) => electron.ipcRenderer.invoke("imageViewer:browseDir", dir)
  },
  // RSS Reader
  rssReader: {
    getFeeds: () => electron.ipcRenderer.invoke("rss:getFeeds"),
    getItems: (feedId) => electron.ipcRenderer.invoke("rss:getItems", feedId),
    addFeed: (url) => electron.ipcRenderer.invoke("rss:addFeed", url),
    removeFeed: (id) => electron.ipcRenderer.invoke("rss:removeFeed", id),
    refresh: (id) => electron.ipcRenderer.invoke("rss:refresh", id),
    markRead: (itemId) => electron.ipcRenderer.invoke("rss:markRead", itemId),
    markAllRead: (feedId) => electron.ipcRenderer.invoke("rss:markAllRead", feedId)
  },
  // Remote Desktop
  remoteDesktop: {
    checkDeps: () => electron.ipcRenderer.invoke("remoteDesktop:checkDeps"),
    installDeps: () => electron.ipcRenderer.invoke("remoteDesktop:installDeps"),
    start: (opts) => electron.ipcRenderer.invoke("remoteDesktop:start", opts),
    stop: () => electron.ipcRenderer.invoke("remoteDesktop:stop"),
    status: () => electron.ipcRenderer.invoke("remoteDesktop:status"),
    getIP: () => electron.ipcRenderer.invoke("remoteDesktop:getIP"),
    tailscaleStatus: () => electron.ipcRenderer.invoke("remoteDesktop:tailscaleStatus"),
    installTailscale: () => electron.ipcRenderer.invoke("remoteDesktop:installTailscale"),
    tailscaleUp: () => electron.ipcRenderer.invoke("remoteDesktop:tailscaleUp"),
    onLog: (cb) => {
      const listener = (_, msg) => cb(msg);
      electron.ipcRenderer.on("remoteDesktop:log", listener);
      return () => electron.ipcRenderer.removeListener("remoteDesktop:log", listener);
    },
    onStopped: (cb) => {
      const listener = () => cb();
      electron.ipcRenderer.on("remoteDesktop:stopped", listener);
      return () => electron.ipcRenderer.removeListener("remoteDesktop:stopped", listener);
    }
  }
});
