import { ipcMain } from 'electron'
import * as tls from 'tls'
import * as crypto from 'crypto'

function parseDN(dn: string): Record<string, string> {
  const result: Record<string, string> = {}
  if (!dn) return result
  dn.split(/\n|,\s*/).forEach(part => {
    const eq = part.indexOf('=')
    if (eq > 0) result[part.slice(0, eq).trim()] = part.slice(eq + 1).trim()
  })
  return result
}

function certFromDetailedPeer(cert: tls.DetailedPeerCertificate): any {
  const now = Date.now()
  const validTo   = new Date(cert.valid_to)
  const validFrom = new Date(cert.valid_from)
  const sha256 = cert.raw
    ? crypto.createHash('sha256').update(cert.raw).digest('hex').match(/.{2}/g)!.join(':')
    : ''
  const sha1 = cert.raw
    ? crypto.createHash('sha1').update(cert.raw).digest('hex').match(/.{2}/g)!.join(':')
    : ''
  const sans: string[] = []
  if ((cert as any).subjectaltname) {
    (cert as any).subjectaltname.split(', ').forEach((s: string) => {
      sans.push(s.replace(/^(DNS|IP Address):/i, '').trim())
    })
  }
  return {
    subject:            cert.subject ?? {},
    issuer:             cert.issuer  ?? {},
    validFrom:          validFrom.toISOString(),
    validTo:            validTo.toISOString(),
    daysRemaining:      Math.floor((validTo.getTime() - now) / 86_400_000),
    sans,
    publicKey:          { algorithm: 'RSA', size: 0 },
    fingerprints:       { sha256, sha1 },
    serialNumber:       (cert as any).serialNumber ?? '',
    signatureAlgorithm: 'SHA256withRSA',
    isCA:               !!(cert as any).ca,
  }
}

function certFromX509(cert: crypto.X509Certificate): any {
  const now       = Date.now()
  const validTo   = new Date(cert.validTo)
  const validFrom = new Date(cert.validFrom)
  return {
    subject:            parseDN(cert.subject),
    issuer:             parseDN(cert.issuer),
    validFrom:          validFrom.toISOString(),
    validTo:            validTo.toISOString(),
    daysRemaining:      Math.floor((validTo.getTime() - now) / 86_400_000),
    sans:               cert.subjectAltName
      ? cert.subjectAltName.split(', ').map((s: string) => s.replace(/^(DNS|IP Address):/i, '').trim())
      : [],
    publicKey:          {
      algorithm: cert.publicKey?.asymmetricKeyType?.toUpperCase() ?? 'Unknown',
      size:      (cert.publicKey as any)?.asymmetricKeyDetails?.modulusLength ?? 0,
    },
    fingerprints:       { sha256: cert.fingerprint256, sha1: cert.fingerprint },
    serialNumber:       cert.serialNumber,
    signatureAlgorithm: 'Unknown',
    isCA:               cert.ca,
  }
}

export function registerCertHandlers(): void {
  ipcMain.handle('cert:inspect', (_evt, host: string, port = 443) =>
    new Promise((resolve, reject) => {
      const socket = tls.connect(
        { host, port, rejectUnauthorized: false, servername: host },
        () => {
          try {
            const cert = socket.getPeerCertificate(true)
            socket.destroy()
            resolve(certFromDetailedPeer(cert))
          } catch (e) { socket.destroy(); reject(e) }
        }
      )
      socket.on('error', reject)
      socket.setTimeout(12_000, () => { socket.destroy(); reject(new Error('Connection timed out')) })
    })
  )

  ipcMain.handle('cert:parsePem', (_evt, pem: string) => {
    try {
      const x509 = new crypto.X509Certificate(pem)
      return certFromX509(x509)
    } catch (e: any) { throw new Error(e.message) }
  })
}
