import { ipcMain } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile } from 'fs/promises'

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
    const out = await sh('nmcli -t -f NAME,TYPE,STATE con show --active 2>/dev/null')
    const wifi = out.split('\n').find(l => l.includes(':wifi:activated'))
    if (!wifi) return { connected: false, ssid: '', signal: 0 }
    const ssid = wifi.split(':')[0]
    const sigOut = await sh(`nmcli -t -f IN-USE,SIGNAL dev wifi list 2>/dev/null | grep '^\\*' | head -1`)
    const signal = parseInt(sigOut.split(':')[1]) || 0
    return { connected: true, ssid, signal }
  })

  ipcMain.handle('system:connectNetwork', async (_, ssid: string, password?: string) => {
    const cmd = password
      ? `nmcli dev wifi connect "${ssid}" password "${password}"`
      : `nmcli dev wifi connect "${ssid}"`
    const out = await sh(`${cmd} 2>&1`)
    return out.toLowerCase().includes('successfully') || out.toLowerCase().includes('activated')
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

  ipcMain.handle('system:shutdown', async () => { await sh('systemctl poweroff') })
  ipcMain.handle('system:reboot',   async () => { await sh('systemctl reboot') })
  ipcMain.handle('system:lock',     async () => { await sh('i3lock -c 080c12 -e &') })
}
