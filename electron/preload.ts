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
    shutdown:             ()                              => ipcRenderer.invoke('system:shutdown'),
    reboot:               ()                              => ipcRenderer.invoke('system:reboot'),
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
    getWindows:  ()             => ipcRenderer.invoke('wm:getWindows'),
    focusWindow: (id: string)   => ipcRenderer.invoke('wm:focusWindow', id),
    closeWindow: (id: string)   => ipcRenderer.invoke('wm:closeWindow', id),
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
})

export type CryogramAPI = typeof import('./preload')
