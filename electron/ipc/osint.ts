import { ipcMain } from 'electron'

// OSINT lookups using free public APIs (no key required)
export function registerOSINTHandlers() {
  ipcMain.handle('osint:lookup', async (_, tool: string, query: string) => {
    try {
      switch (tool) {
        case 'IP Lookup': {
          const res = await fetch(`https://ipapi.co/${query}/json/`)
          const data = await res.json()
          return { ip: data.ip, city: data.city, region: data.region, country: data.country_name,
            org: data.org, isp: data.org, timezone: data.timezone, latitude: data.latitude, longitude: data.longitude,
            asn: data.asn, currency: data.currency }
        }
        case 'WHOIS': {
          const res = await fetch(`https://rdap.org/domain/${query}`)
          const data = await res.json()
          return { domain: data.ldhName, status: (data.status||[]).join(', '),
            registered: data.events?.find((e:any)=>e.eventAction==='registration')?.eventDate || '—',
            expiry: data.events?.find((e:any)=>e.eventAction==='expiration')?.eventDate || '—',
            registrar: data.entities?.[0]?.vcardArray?.[1]?.find((v:any)=>v[0]==='fn')?.[3] || '—' }
        }
        case 'DNS Records': {
          const types = ['A','AAAA','MX','NS','TXT','CNAME']
          const results: any = {}
          await Promise.all(types.map(async type => {
            try {
              const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${query}&type=${type}`, { headers:{ Accept:'application/dns-json' } })
              const data = await res.json()
              if (data.Answer) results[type] = data.Answer.map((r:any)=>r.data).join(', ')
            } catch {}
          }))
          return results
        }
        case 'Email Lookup':
          return { email: query, note: 'Email validation requires a paid API key. Domain portion available via DNS lookup.' }
        case 'Username Search':
          return { username: query, note: 'Username enumeration check. Try using the API Tester app to query social APIs directly.' }
        case 'Domain Recon': {
          const [rdap, dns] = await Promise.all([
            fetch(`https://rdap.org/domain/${query}`).then(r=>r.json()).catch(()=>({})),
            fetch(`https://cloudflare-dns.com/dns-query?name=${query}&type=A`, { headers:{ Accept:'application/dns-json' } }).then(r=>r.json()).catch(()=>({Answer:[]}))
          ])
          return {
            domain: query,
            registered: rdap.events?.find((e:any)=>e.eventAction==='registration')?.eventDate || '—',
            ip: dns.Answer?.[0]?.data || '—',
            nameservers: rdap.nameservers?.map((ns:any)=>ns.ldhName).join(', ') || '—'
          }
        }
        default:
          return { error: 'Unknown tool' }
      }
    } catch (e: any) {
      return { error: e.message }
    }
  })
}
