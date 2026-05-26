import { ipcMain } from 'electron'

// Uses NVD (National Vulnerability Database) public API — no key required
const NVD_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0'

function mapCVE(item: any) {
  const cve = item.cve
  const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV30?.[0] || cve.metrics?.cvssMetricV2?.[0]
  const score = metrics?.cvssData?.baseScore ?? 0
  const severity = metrics?.cvssData?.baseSeverity ?? (score >= 9 ? 'CRITICAL' : score >= 7 ? 'HIGH' : score >= 4 ? 'MEDIUM' : score > 0 ? 'LOW' : 'NONE')
  return {
    id: cve.id,
    description: cve.descriptions?.find((d:any)=>d.lang==='en')?.value || '',
    severity: severity.toUpperCase(),
    score,
    published: cve.published?.slice(0,10) || '',
    references: (cve.references||[]).slice(0,5).map((r:any)=>r.url)
  }
}

export function registerCVEHandlers() {
  ipcMain.handle('cve:search', async (_, query: string) => {
    try {
      // If it looks like a CVE ID, fetch directly
      if (/^CVE-\d{4}-\d+$/i.test(query.trim())) {
        const res = await fetch(`${NVD_BASE}?cveId=${query.trim().toUpperCase()}`)
        const data = await res.json()
        return (data.vulnerabilities || []).map((v:any) => mapCVE(v))
      }
      const res = await fetch(`${NVD_BASE}?keywordSearch=${encodeURIComponent(query)}&resultsPerPage=20`)
      const data = await res.json()
      return (data.vulnerabilities || []).map((v:any) => mapCVE(v))
    } catch (e: any) {
      return []
    }
  })

  ipcMain.handle('cve:recent', async (_, count = 10) => {
    try {
      const res = await fetch(`${NVD_BASE}?resultsPerPage=${count}&startIndex=0`)
      const data = await res.json()
      return (data.vulnerabilities || []).map((v:any) => mapCVE(v))
    } catch {
      return []
    }
  })
}
