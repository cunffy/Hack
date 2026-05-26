import { ipcMain, BrowserWindow } from 'electron'
import { spawn, ChildProcess } from 'child_process'

let captureProc: ChildProcess | null = null
let packetId = 0

export function registerPacketSnifferHandlers() {
  ipcMain.handle('packetSniffer:start', async (event, iface: string, filter: string) => {
    if (captureProc) { captureProc.kill(); captureProc = null }
    packetId = 0

    // Try tshark first, fall back to tcpdump
    const hasTshark = await commandExists('tshark')
    const win = BrowserWindow.fromWebContents(event.sender)

    if (hasTshark) {
      const args = ['-i', iface, '-T', 'fields',
        '-e', 'frame.number', '-e', 'frame.time_relative',
        '-e', 'ip.src', '-e', 'ip.dst', '-e', 'ip.proto',
        '-e', 'frame.len', '-e', '_ws.col.Info',
        '-E', 'separator=|', '-l']
      if (filter) args.push('-f', filter)

      captureProc = spawn('tshark', args)
    } else {
      const args = ['-i', iface, '-l', '-n', '-tt']
      if (filter) args.push(filter)
      captureProc = spawn('tcpdump', args)
    }

    captureProc.stdout?.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().trim().split('\n')
      for (const line of lines) {
        if (!line.trim()) continue
        const parts = line.split('|')
        const pkt = {
          id: ++packetId,
          time: parts[1] ? parseFloat(parts[1]).toFixed(6) : new Date().toISOString().slice(11,23),
          src: parts[2] || '?',
          dst: parts[3] || '?',
          proto: protoName(parts[4] || ''),
          len: parseInt(parts[5]) || 0,
          info: parts[6] || line.slice(0, 80),
        }
        win?.webContents.send('packetSniffer:packet', pkt)
      }
    })

    captureProc.on('error', () => { /* tshark/tcpdump not available */ })
    return null
  })

  ipcMain.handle('packetSniffer:stop', async () => {
    if (captureProc) { captureProc.kill(); captureProc = null }
  })
}

function protoName(proto: string): string {
  const map: Record<string, string> = { '6': 'TCP', '17': 'UDP', '1': 'ICMP', '58': 'ICMPv6', '89': 'OSPF' }
  return map[proto] || proto || 'OTHER'
}

async function commandExists(cmd: string): Promise<boolean> {
  return new Promise(res => {
    const p = spawn('which', [cmd])
    p.on('close', code => res(code === 0))
    p.on('error', () => res(false))
  })
}
