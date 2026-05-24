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
    lock: () => electron.ipcRenderer.invoke("system:lock")
  },
  // App launcher
  launcher: {
    getApps: () => electron.ipcRenderer.invoke("launcher:getApps"),
    launch: (app) => electron.ipcRenderer.invoke("launcher:launch", app)
  },
  // Notifications from main
  onNotification: (cb) => {
    const listener = (_, n) => cb(n);
    electron.ipcRenderer.on("notification", listener);
    return () => electron.ipcRenderer.removeListener("notification", listener);
  }
});
