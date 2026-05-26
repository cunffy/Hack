import { ipcMain } from 'electron'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
import { homedir } from 'os'

const sh = promisify(exec)

let scrcpyProc: ReturnType<typeof spawn> | null = null

async function adb(serial: string, ...args: string[]): Promise<string> {
  const { stdout } = await sh(`adb -s ${JSON.stringify(serial)} ${args.join(' ')} 2>/dev/null`)
  return stdout.trim()
}

async function adbGlobal(...args: string[]): Promise<string> {
  const { stdout } = await sh(`adb ${args.join(' ')} 2>/dev/null`)
  return stdout.trim()
}

export function registerPhoneHandlers(): void {

  // ── List connected ADB devices ──────────────────────────────────────────────
  ipcMain.handle('phone:getDevices', async () => {
    try {
      const out = await adbGlobal('devices', '-l')
      const lines = out.split('\n').slice(1).filter(l => l.trim() && !l.startsWith('*') && !l.startsWith('List'))
      const devices = lines.map(line => {
        const parts   = line.trim().split(/\s+/)
        const serial  = parts[0]
        const status  = parts[1]
        const model   = (line.match(/model:(\S+)/)?.[1] ?? 'Unknown').replace(/_/g, ' ')
        const isWifi  = serial.includes(':')
        return { serial, status, model, transport: isWifi ? 'wifi' : 'usb' as 'wifi' | 'usb' }
      }).filter(d => d.serial && d.status === 'device')
      return devices
    } catch {
      return []
    }
  })

  // ── Device properties ────────────────────────────────────────────────────────
  ipcMain.handle('phone:getInfo', async (_, serial: string) => {
    const prop = async (key: string) => {
      try { return await adb(serial, `shell getprop ${key}`) } catch { return '' }
    }
    const [model, brand, androidVersion, sdk, cpu, screenSize] = await Promise.all([
      prop('ro.product.model'),
      prop('ro.product.brand'),
      prop('ro.build.version.release'),
      prop('ro.build.version.sdk'),
      prop('ro.product.cpu.abi'),
      (async () => {
        try {
          const out = await adb(serial, 'shell wm size')
          return out.match(/Physical size: (\S+)/)?.[1] ?? ''
        } catch { return '' }
      })(),
    ])
    return { model, brand, androidVersion, sdk, cpu, screenSize }
  })

  // ── Battery ──────────────────────────────────────────────────────────────────
  ipcMain.handle('phone:getBattery', async (_, serial: string) => {
    try {
      const out = await adb(serial, 'shell dumpsys battery')
      const level       = parseInt(out.match(/level: (\d+)/)?.[1]       ?? '0')
      const status      = out.match(/status: (\d+)/)?.[1]
      const voltage     = parseInt(out.match(/voltage: (\d+)/)?.[1]     ?? '0')
      const rawTemp     = parseInt(out.match(/temperature: (\d+)/)?.[1] ?? '0')
      const charging    = status === '2' || status === '5'
      const plugged     = out.match(/plugged: (\d+)/)?.[1] !== '0'
      return { level, charging, plugged, voltage: voltage / 1000, temperature: rawTemp / 10 }
    } catch {
      return { level: 0, charging: false, plugged: false, voltage: 0, temperature: 0 }
    }
  })

  // ── Storage ──────────────────────────────────────────────────────────────────
  ipcMain.handle('phone:getStorage', async (_, serial: string) => {
    try {
      const out = await adb(serial, 'shell df /storage/emulated/0')
      const row   = out.trim().split('\n').pop()?.trim().split(/\s+/) ?? []
      const total = parseInt(row[1] ?? '0') * 1024
      const used  = parseInt(row[2] ?? '0') * 1024
      const free  = parseInt(row[3] ?? '0') * 1024
      return { total, used, free }
    } catch {
      return { total: 0, used: 0, free: 0 }
    }
  })

  // ── Check / install scrcpy ───────────────────────────────────────────────────
  ipcMain.handle('phone:checkScrcpy', async () => {
    try {
      const { stdout } = await sh('scrcpy --version 2>&1')
      const version = stdout.match(/scrcpy\s+(\S+)/)?.[1] ?? 'unknown'
      return { installed: true, version }
    } catch {
      return { installed: false, version: null }
    }
  })

  ipcMain.handle('phone:installScrcpy', async () => {
    try {
      await sh('apt-get install -y scrcpy 2>&1 || snap install scrcpy 2>&1')
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e.message }
    }
  })

  // ── Screen mirror ────────────────────────────────────────────────────────────
  ipcMain.handle('phone:startMirror', async (_, serial: string) => {
    if (scrcpyProc) { scrcpyProc.kill(); scrcpyProc = null }
    try {
      scrcpyProc = spawn('scrcpy', [
        '-s', serial,
        '--video-bit-rate', '4M',
        '--max-fps', '60',
        '--window-title', 'Phone — CyberDen',
        '--shortcut-mod', 'lctrl,rctrl',
      ], { detached: false })
      scrcpyProc.on('exit', () => { scrcpyProc = null })
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e.message }
    }
  })

  ipcMain.handle('phone:stopMirror', async () => {
    if (scrcpyProc) { scrcpyProc.kill(); scrcpyProc = null }
    return { ok: true }
  })

  // Returns a plain boolean so the UI can use it directly
  ipcMain.handle('phone:isMirroring', async () => !!scrcpyProc)

  // ── Wireless ADB setup ───────────────────────────────────────────────────────
  ipcMain.handle('phone:enableWireless', async (_, serial: string, port = 5555) => {
    try {
      await sh(`adb -s ${JSON.stringify(serial)} tcpip ${port} 2>&1`)
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e.message }
    }
  })

  ipcMain.handle('phone:connectWifi', async (_, ip: string, port = 5555) => {
    try {
      await new Promise(r => setTimeout(r, 1200))
      const { stdout } = await sh(`adb connect ${ip}:${port} 2>&1`)
      const ok = stdout.toLowerCase().includes('connected')
      return { ok, message: stdout.trim() }
    } catch (e: any) {
      return { ok: false, message: e.message }
    }
  })

  ipcMain.handle('phone:disconnect', async (_, address: string) => {
    try {
      const { stdout } = await sh(`adb disconnect ${JSON.stringify(address)} 2>&1`)
      return { ok: true, message: stdout.trim() }
    } catch (e: any) {
      return { ok: false, message: e.message }
    }
  })

  // ── Get device IP ────────────────────────────────────────────────────────────
  ipcMain.handle('phone:getDeviceIp', async (_, serial: string) => {
    try {
      const out = await adb(serial, 'shell ip route show')
      const ip = out.match(/src\s+(\d+\.\d+\.\d+\.\d+)/)?.[1]
      if (ip) return ip
      const wlan = await adb(serial, 'shell ip addr show wlan0')
      return wlan.match(/inet (\d+\.\d+\.\d+\.\d+)/)?.[1] ?? null
    } catch {
      return null
    }
  })

  // ── Screenshot ───────────────────────────────────────────────────────────────
  ipcMain.handle('phone:screenshot', async (_, serial: string) => {
    try {
      const dest = join(homedir(), `Pictures/phone-screenshot-${Date.now()}.png`)
      await sh(`adb -s ${JSON.stringify(serial)} exec-out screencap -p > ${JSON.stringify(dest)} 2>/dev/null`)
      return { ok: true, path: dest }
    } catch (e: any) {
      return { ok: false, error: e.message }
    }
  })
}
