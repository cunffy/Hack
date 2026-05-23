import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('cyberden', {
  // Window controls
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
  },

  // Terminal (PTY)
  terminal: {
    create: (id: string, cols: number, rows: number) =>
      ipcRenderer.invoke('terminal:create', id, cols, rows),
    write: (id: string, data: string) =>
      ipcRenderer.send('terminal:write', id, data),
    resize: (id: string, cols: number, rows: number) =>
      ipcRenderer.send('terminal:resize', id, cols, rows),
    destroy: (id: string) => ipcRenderer.send('terminal:destroy', id),
    onData: (id: string, cb: (data: string) => void) => {
      const channel = `terminal:data:${id}`
      const listener = (_: unknown, data: string) => cb(data)
      ipcRenderer.on(channel, listener)
      return () => ipcRenderer.removeListener(channel, listener)
    },
  },

  // File system (scoped to workspace)
  fs: {
    readDir: (path: string) => ipcRenderer.invoke('fs:readDir', path),
    readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
    writeFile: (path: string, content: string) =>
      ipcRenderer.invoke('fs:writeFile', path, content),
    getWorkspace: () => ipcRenderer.invoke('fs:getWorkspace'),
    openDialog: () => ipcRenderer.invoke('fs:openDialog'),
  },

  // Password tester
  passwordTester: {
    runCrack: (opts: unknown) => ipcRenderer.invoke('pt:runCrack', opts),
    runNetwork: (opts: unknown) => ipcRenderer.invoke('pt:runNetwork', opts),
    cancel: (jobId: string) => ipcRenderer.send('pt:cancel', jobId),
    onProgress: (cb: (data: unknown) => void) => {
      const listener = (_: unknown, data: unknown) => cb(data)
      ipcRenderer.on('pt:progress', listener)
      return () => ipcRenderer.removeListener('pt:progress', listener)
    },
  },

  // Leaker (breach monitoring)
  leaker: {
    addTarget: (target: unknown) => ipcRenderer.invoke('leaker:addTarget', target),
    removeTarget: (id: number) => ipcRenderer.invoke('leaker:removeTarget', id),
    getTargets: () => ipcRenderer.invoke('leaker:getTargets'),
    getBreaches: (targetId?: number) =>
      ipcRenderer.invoke('leaker:getBreaches', targetId),
    forceRefresh: (targetId?: number) =>
      ipcRenderer.invoke('leaker:forceRefresh', targetId),
  },

  // Settings
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: unknown) =>
      ipcRenderer.invoke('settings:set', key, value),
    getAll: () => ipcRenderer.invoke('settings:getAll'),
  },

  // Notifications from main
  onNotification: (cb: (n: { title: string; body: string }) => void) => {
    const listener = (_: unknown, n: unknown) => cb(n as { title: string; body: string })
    ipcRenderer.on('notification', listener)
    return () => ipcRenderer.removeListener('notification', listener)
  },
})

export type CyberDenAPI = typeof import('./preload')
