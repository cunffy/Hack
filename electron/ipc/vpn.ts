import { ipcMain } from 'electron'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse a WireGuard interface name from 'ip route show table 220' output. */
function parseWgInterface(routeOutput: string): string | undefined {
  // "default via ... dev wg0 proto kernel ..."
  const match = routeOutput.match(/dev\s+(wg\w+)/)
  return match?.[1]
}

/** Parse an OpenVPN tunnel interface from ip-link or ip-route output. */
function parseOvpnInterface(routeOutput: string): string | undefined {
  const match = routeOutput.match(/dev\s+(tun\w+|tap\w+)/)
  return match?.[1]
}

/** Get the current IP address of a given network interface. */
async function getInterfaceIp(iface: string): Promise<string | undefined> {
  try {
    const { stdout } = await execAsync(`ip addr show ${iface} 2>/dev/null`)
    const match = stdout.match(/inet\s+(\d+\.\d+\.\d+\.\d+)/)
    return match?.[1]
  } catch {
    return undefined
  }
}

// ── Track connection state ─────────────────────────────────────────────────────

let connectedSince: number | undefined

export function registerVpnHandlers(): void {

  // ── Get current VPN status ─────────────────────────────────────────────────
  ipcMain.handle('vpn:getStatus', async () => {
    try {
      // Strategy 1: check WireGuard routing table (table 220 is the WG default)
      try {
        const { stdout: wgRoutes } = await execAsync('ip route show table 220 2>/dev/null')
        if (wgRoutes.trim()) {
          const iface = parseWgInterface(wgRoutes)
          const ip = iface ? await getInterfaceIp(iface) : undefined
          return {
            connected: true,
            interface: iface,
            ip,
            connectedSince,
          }
        }
      } catch { /* no WG routes — continue */ }

      // Strategy 2: check for active tun/tap interfaces (OpenVPN)
      try {
        const { stdout: linkOut } = await execAsync('ip link show type tun 2>/dev/null || ip link show 2>/dev/null')
        const tunMatch = linkOut.match(/\d+:\s+(tun\w+|tap\w+):\s+<.*UP/)
        if (tunMatch) {
          const iface = tunMatch[1]
          const ip = await getInterfaceIp(iface)
          return {
            connected: true,
            interface: iface,
            ip,
            connectedSince,
          }
        }
      } catch { /* no tun interfaces */ }

      // Strategy 3: nmcli — check active VPN connections (NetworkManager)
      try {
        const { stdout: nmOut } = await execAsync('nmcli -t -f TYPE,STATE,DEVICE connection show --active 2>/dev/null')
        const lines = nmOut.split('\n').filter(Boolean)
        for (const line of lines) {
          const [type, state, device] = line.split(':')
          if ((type === 'vpn' || type === 'wireguard') && state === 'activated') {
            const ip = device ? await getInterfaceIp(device) : undefined
            return {
              connected: true,
              interface: device || undefined,
              ip,
              connectedSince,
            }
          }
        }
      } catch { /* nmcli not available */ }

      // No VPN detected
      connectedSince = undefined
      return { connected: false }

    } catch {
      return { connected: false }
    }
  })

  // ── Connect ────────────────────────────────────────────────────────────────
  ipcMain.handle('vpn:connect', async (_, profile: { name: string; type: string; configPath: string }) => {
    if (!profile.configPath) {
      return { success: false, message: 'No config path provided' }
    }

    try {
      if (profile.type === 'wireguard') {
        // WireGuard: wg-quick up <config>
        // configPath can be a full path (/etc/wireguard/wg0.conf) or just the interface name
        const arg = profile.configPath.endsWith('.conf') ? profile.configPath : profile.configPath
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('sudo', ['wg-quick', 'up', arg], { stdio: ['ignore', 'pipe', 'pipe'] })
          let stderr = ''
          proc.stderr?.on('data', (d: Buffer) => { stderr += d.toString() })
          proc.on('close', (code) => {
            if (code === 0) resolve()
            else reject(new Error(stderr.trim() || `wg-quick exited with code ${code}`))
          })
          proc.on('error', reject)
        })

      } else {
        // OpenVPN: openvpn --config <path> --daemon
        await new Promise<void>((resolve, reject) => {
          // --daemon makes openvpn fork to background; it exits 0 quickly after fork
          const proc = spawn('sudo', [
            'openvpn',
            '--config', profile.configPath,
            '--daemon', `cryogram-${profile.name}`,
            '--log', '/tmp/cryogram-openvpn.log',
          ], { stdio: ['ignore', 'pipe', 'pipe'] })
          let stderr = ''
          proc.stderr?.on('data', (d: Buffer) => { stderr += d.toString() })
          proc.on('close', (code) => {
            if (code === 0) resolve()
            else reject(new Error(stderr.trim() || `openvpn exited with code ${code}`))
          })
          proc.on('error', reject)
        })
      }

      connectedSince = Date.now()
      return { success: true }

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, message }
    }
  })

  // ── Disconnect ─────────────────────────────────────────────────────────────
  ipcMain.handle('vpn:disconnect', async () => {
    const errors: string[] = []

    // Kill OpenVPN daemon processes
    try {
      await execAsync('sudo killall -SIGTERM openvpn 2>/dev/null || true')
    } catch (err) {
      errors.push(`openvpn: ${err instanceof Error ? err.message : String(err)}`)
    }

    // Bring down any WireGuard interfaces
    try {
      const { stdout: linkOut } = await execAsync('ip link show 2>/dev/null')
      const wgIfaces = [...linkOut.matchAll(/\d+:\s+(wg\w+):/g)].map(m => m[1])
      for (const iface of wgIfaces) {
        try {
          await new Promise<void>((resolve, reject) => {
            const proc = spawn('sudo', ['wg-quick', 'down', iface], { stdio: ['ignore', 'pipe', 'pipe'] })
            proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`wg-quick down ${iface} failed`))))
            proc.on('error', reject)
          })
        } catch (err) {
          errors.push(`wg-quick down ${iface}: ${err instanceof Error ? err.message : String(err)}`)
        }
      }
    } catch { /* couldn't list interfaces */ }

    // Also handle NetworkManager-managed VPN connections
    try {
      await execAsync('nmcli connection down $(nmcli -t -f TYPE,NAME connection show --active | grep "^vpn" | cut -d: -f2) 2>/dev/null || true')
    } catch { /* NM not present or no active vpn */ }

    connectedSince = undefined

    if (errors.length > 0) {
      return { success: false, message: errors.join('; ') }
    }
    return { success: true }
  })
}
