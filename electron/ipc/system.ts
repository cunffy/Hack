import { ipcMain, dialog, BrowserWindow } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile } from 'fs/promises'
import { createHash } from 'crypto'
import { getSettingsStore } from './settings'

const execAsync = promisify(exec)

function sh(cmd: string): Promise<string> {
  return execAsync(cmd).then(r => r.stdout.trim()).catch(() => '')
}

export function registerSystemHandlers(): void {

  // ── WiFi ──────────────────────────────────────────────────────────────────

  ipcMain.handle('system:getNetworks', async () => {
    const out = await sh('nmcli -t -f SSID,SIGNAL,SECURITY,IN-USE dev wifi list 2>/dev/null')
    const seen = new Set<string>()
    return out.split('\n').filter(Boolean).map(line => {
      const parts = line.split(':')
      return {
        ssid: parts[0] || 'Hidden Network',
        signal: parseInt(parts[1]) || 0,
        security: parts[2] || '',
        active: parts[3] === '*',
      }
    }).filter(n => {
      if (!n.ssid || seen.has(n.ssid)) return false
      seen.add(n.ssid)
      return true
    }).sort((a, b) => b.signal - a.signal)
  })

  ipcMain.handle('system:getWifiStatus', async () => {
    // Use dev wifi which gives actual SSID (not connection profile name)
    const out = await sh('nmcli -t -f IN-USE,SSID,SIGNAL dev wifi list 2>/dev/null')
    const active = out.split('\n').find(l => l.startsWith('*:'))
    if (!active) return { connected: false, ssid: '', signal: 0 }
    const parts = active.split(':')
    const ssid   = parts.slice(1, -1).join(':')  // handle SSIDs with colons
    const signal = parseInt(parts[parts.length - 1]) || 0
    return { connected: true, ssid, signal }
  })

  ipcMain.handle('system:connectNetwork', async (_, ssid: string, password?: string) => {
    const dev = await sh("nmcli -t -f DEVICE,TYPE dev 2>/dev/null | grep ':wifi' | head -1 | cut -d: -f1")
    const ifarg = dev ? `ifname "${dev}"` : ''
    const escapedSsid = ssid.replace(/"/g, '\\"')
    const escapedPwd  = password?.replace(/"/g, '\\"') ?? ''
    const cmd = password
      ? `nmcli dev wifi connect "${escapedSsid}" password "${escapedPwd}" ${ifarg} 2>&1`
      : `nmcli dev wifi connect "${escapedSsid}" ${ifarg} 2>&1`
    try {
      const { stdout } = await execAsync(cmd)
      const out = stdout.trim()
      const success = out.toLowerCase().includes('successfully') || out.toLowerCase().includes('activated')
      return { success, message: success ? '' : (out || 'Connection failed') }
    } catch (err: any) {
      const msg: string = (err.stdout ?? err.message ?? 'Connection failed').trim()
      const lower = msg.toLowerCase()
      if (lower.includes('secrets') || lower.includes('password') || lower.includes('802-11') || lower.includes('wrong'))
        return { success: false, message: 'Wrong password — please try again' }
      if (lower.includes('timeout'))
        return { success: false, message: 'Connection timed out — check password and try again' }
      if (lower.includes('not found') || lower.includes('no network'))
        return { success: false, message: 'Network not found — try scanning again' }
      return { success: false, message: msg || 'Connection failed' }
    }
  })

  ipcMain.handle('system:disconnectNetwork', async () => {
    await sh('nmcli dev disconnect $(nmcli -t -f DEVICE,TYPE dev | grep wifi | cut -d: -f1 | head -1) 2>/dev/null')
    return true
  })

  ipcMain.handle('system:rescanNetworks', async () => {
    await sh('nmcli dev wifi rescan 2>/dev/null')
    return true
  })

  // ── Battery ───────────────────────────────────────────────────────────────

  ipcMain.handle('system:getBattery', async () => {
    try {
      const base = '/sys/class/power_supply'
      const entries = await sh(`ls ${base} 2>/dev/null`)
      const bat = entries.split('\n').find(b => b.startsWith('BAT'))
      if (!bat) return null
      const [capacity, status] = await Promise.all([
        readFile(`${base}/${bat}/capacity`, 'utf8').then(s => parseInt(s.trim())),
        readFile(`${base}/${bat}/status`, 'utf8').then(s => s.trim()),
      ])
      return { level: capacity, charging: status === 'Charging', full: status === 'Full', status }
    } catch {
      return null
    }
  })

  // ── Volume ────────────────────────────────────────────────────────────────

  ipcMain.handle('system:getVolume', async () => {
    const vol = await sh('pactl get-sink-volume @DEFAULT_SINK@ 2>/dev/null')
    const mute = await sh('pactl get-sink-mute @DEFAULT_SINK@ 2>/dev/null')
    const match = vol.match(/(\d+)%/)
    return { level: match ? parseInt(match[1]) : 100, muted: mute.includes('yes') }
  })

  ipcMain.handle('system:setVolume', async (_, level: number) => {
    await sh(`pactl set-sink-volume @DEFAULT_SINK@ ${Math.max(0, Math.min(150, level))}% 2>/dev/null`)
    return true
  })

  ipcMain.handle('system:toggleMute', async () => {
    await sh('pactl set-sink-mute @DEFAULT_SINK@ toggle 2>/dev/null')
    return true
  })

  // ── Brightness ────────────────────────────────────────────────────────────

  ipcMain.handle('system:getBrightness', async () => {
    const cur = await sh('brightnessctl get 2>/dev/null')
    const max = await sh('brightnessctl max 2>/dev/null')
    const c = parseInt(cur) || 100
    const m = parseInt(max) || 100
    return Math.round(c * 100 / m)
  })

  ipcMain.handle('system:setBrightness', async (_, pct: number) => {
    await sh(`brightnessctl set ${Math.max(5, Math.min(100, pct))}% 2>/dev/null`)
    return true
  })

  // ── Bluetooth ─────────────────────────────────────────────────────────────

  ipcMain.handle('system:getBluetoothDevices', async () => {
    const out = await sh('bluetoothctl devices 2>/dev/null')
    const connected = await sh('bluetoothctl info 2>/dev/null')
    return out.split('\n').filter(Boolean).map(line => {
      const parts = line.replace('Device ', '').split(' ')
      const address = parts[0]
      const name = parts.slice(1).join(' ')
      return { address, name, connected: connected.includes(address) }
    }).filter(d => d.address)
  })

  ipcMain.handle('system:bluetoothConnect', async (_, address: string) => {
    const out = await sh(`bluetoothctl connect ${address} 2>&1`)
    return out.toLowerCase().includes('successful')
  })

  ipcMain.handle('system:bluetoothDisconnect', async (_, address: string) => {
    await sh(`bluetoothctl disconnect ${address} 2>/dev/null`)
    return true
  })

  ipcMain.handle('system:bluetoothScan', async () => {
    sh('bluetoothctl scan on 2>/dev/null &')
    await new Promise(r => setTimeout(r, 5000))
    await sh('bluetoothctl scan off 2>/dev/null')
    return true
  })

  // ── System info ───────────────────────────────────────────────────────────

  ipcMain.handle('system:getInfo', async () => {
    try {
      const [hostname, kernel, uptime] = await Promise.all([
        sh('hostname'),
        sh('uname -r'),
        sh('uptime -p'),
      ])
      const cpuInfo = await readFile('/proc/cpuinfo', 'utf8').catch(() => '')
      const cpuLine = cpuInfo.split('\n').find(l => l.startsWith('model name'))
      const cpu = cpuLine ? cpuLine.split(':')[1].trim() : 'Unknown CPU'
      const memInfo = await readFile('/proc/meminfo', 'utf8').catch(() => '')
      const getKb = (key: string) => {
        const l = memInfo.split('\n').find(l => l.startsWith(key))
        return l ? parseInt(l.split(/\s+/)[1]) : 0
      }
      const ramTotal = Math.round(getKb('MemTotal:') / 1024)
      const ramFree = Math.round(getKb('MemAvailable:') / 1024)
      return {
        hostname,
        os: 'Cryogram OS 1.0',
        kernel,
        cpu,
        ramTotal,
        ramUsed: ramTotal - ramFree,
        uptime,
      }
    } catch {
      return { hostname: 'cryogram', os: 'Cryogram OS 1.0', kernel: 'Linux', cpu: 'Unknown', ramTotal: 0, ramUsed: 0, uptime: '' }
    }
  })

  // ── Power actions ─────────────────────────────────────────────────────────

  // Sync system clock with NTP — run after network connects so time is always accurate.
  ipcMain.handle('system:syncTime', async () => {
    try {
      // Try chronyc first (most live OS distros), fall back to timedatectl
      await sh('chronyc makestep 2>/dev/null || timedatectl set-ntp true')
      return { success: true }
    } catch { return { success: false } }
  })

  // Use sudo so polkit allows power commands from the cryogram non-root user.
  // The sudoers rule in /etc/sudoers.d/cryogram-power grants NOPASSWD for these.
  ipcMain.handle('system:shutdown', async () => { await sh('sudo systemctl poweroff') })
  ipcMain.handle('system:reboot',   async () => { await sh('sudo systemctl reboot') })
  ipcMain.handle('system:sleep',    async () => { await sh('sudo systemctl suspend') })
  ipcMain.handle('system:lock', async () => {
    // Tell renderer to show in-app lock screen
    BrowserWindow.getAllWindows()[0]?.webContents.send('screen:lock')
    return true
  })

  // ── PIN management ────────────────────────────────────────────────────────

  ipcMain.handle('system:verifyPin', async (_, pin: string) => {
    const hash = getSettingsStore().get('pin.hash') as string | undefined
    if (!hash) return true
    return createHash('sha256').update(String(pin)).digest('hex') === hash
  })

  ipcMain.handle('system:setPin', async (_, newPin: string, currentPin?: string) => {
    // If a PIN already exists, verify current first
    const existing = getSettingsStore().get('pin.hash') as string | undefined
    if (existing && currentPin !== undefined) {
      const chk = createHash('sha256').update(String(currentPin)).digest('hex')
      if (chk !== existing) return { success: false, error: 'Incorrect current PIN' }
    }
    if (!/^[0-9]{4,8}$/.test(newPin)) return { success: false, error: 'PIN must be 4–8 digits' }
    getSettingsStore().set('pin.hash', createHash('sha256').update(newPin).digest('hex'))
    getSettingsStore().set('pin.enabled', true)
    return { success: true }
  })

  ipcMain.handle('system:removePin', async (_, currentPin: string) => {
    const existing = getSettingsStore().get('pin.hash') as string | undefined
    if (existing) {
      const chk = createHash('sha256').update(String(currentPin)).digest('hex')
      if (chk !== existing) return { success: false, error: 'Incorrect PIN' }
    }
    getSettingsStore().delete('pin.hash' as any)
    getSettingsStore().set('pin.enabled', false)
    return { success: true }
  })

  ipcMain.handle('system:setPinEnabled', async (_, enabled: boolean) => {
    getSettingsStore().set('pin.enabled', enabled)
    return true
  })

  // ── Wallpaper ─────────────────────────────────────────────────────────────

  ipcMain.handle('system:pickWallpaper', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog.showOpenDialog(win!, {
      title: 'Choose Wallpaper',
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'] }],
      properties: ['openFile'],
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle('system:setWallpaper', async (_, path: string) => {
    const safe = path.replace(/'/g, "'\\''") 
    await sh(`feh --bg-scale '${safe}' 2>/dev/null`)
    return true
  })

  // ── X11 window management (wmctrl) ────────────────────────────────────────
  // Lets the Dock track ALL open apps — not just internal Cryogram windows.

  ipcMain.handle('wm:getWindows', async () => {
    const out = await sh('wmctrl -l 2>/dev/null')
    if (!out) return []
    return out.split('\n').filter(Boolean).map(line => {
      const match = line.match(/^(0x\w+)\s+(-?\d+)\s+(\S+)\s+(.+)$/)
      if (!match) return null
      return { id: match[1], desktop: parseInt(match[2]), title: match[4] }
    }).filter(Boolean)
  })

  ipcMain.handle('wm:focusWindow', async (_, id: string) => {
    await sh(`wmctrl -ia ${id} 2>/dev/null`)
    return true
  })

  ipcMain.handle('wm:closeWindow', async (_, id: string) => {
    await sh(`wmctrl -ic ${id} 2>/dev/null`)
    return true
  })

  ipcMain.handle('wm:getCurrentWorkspace', async () => {
    const out = await sh('wmctrl -d 2>/dev/null')
    const active = out.split('\n').find(l => l.includes('*'))
    return active ? parseInt(active.split(/\s+/)[0]) : 0
  })

  ipcMain.handle('wm:switchWorkspace', async (_, n: number) => {
    await sh(`wmctrl -s ${n} 2>/dev/null`)
    return true
  })

  ipcMain.handle('wm:getWorkspaceCount', async () => {
    const out = await sh('wmctrl -d 2>/dev/null')
    return out.split('\n').filter(Boolean).length || 1
  })
}
