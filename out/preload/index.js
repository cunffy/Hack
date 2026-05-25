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
    shutdown: () => electron.ipcRenderer.invoke("system:shutdown"),
    reboot: () => electron.ipcRenderer.invoke("system:reboot"),
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
    closeWindow: (id) => electron.ipcRenderer.invoke("wm:closeWindow", id)
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
  // Update checker + runner
  updater: {
    check: () => electron.ipcRenderer.invoke("updater:check"),
    run: () => electron.ipcRenderer.invoke("updater:run"),
    onProgress: (cb) => {
      const listener = (_, line) => cb(line);
      electron.ipcRenderer.on("updater:progress", listener);
      return () => electron.ipcRenderer.removeListener("updater:progress", listener);
    }
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
  }
});
