import { ipcMain } from 'electron'
import { readdir, readFile, access } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'
import { spawn } from 'child_process'

interface AppEntry {
  name: string
  exec: string
  icon: string
  comment: string
  categories: string[]
  category: string
  desktopFile: string
  terminal: boolean
}

const APP_DIRS = [
  '/usr/share/applications',
  '/usr/local/share/applications',
  join(homedir(), '.local/share/applications'),
]

const CATEGORY_MAP: Record<string, string> = {
  Security:    'Security',
  Network:     'Security',
  System:      'System',
  Settings:    'System',
  Utility:     'System',
  Game:        'Gaming',
  Development: 'Development',
  IDE:         'Development',
  TextEditor:  'Development',
  Graphics:    'Media',
  Audio:       'Media',
  Video:       'Media',
  Office:      'Office',
}

async function resolveIconPath(name: string): Promise<string> {
  if (!name) return ''
  if (name.startsWith('/')) {
    try { await access(name); return `file://${name}` } catch { return '' }
  }
  const candidates = [
    `/usr/share/icons/hicolor/256x256/apps/${name}.png`,
    `/usr/share/icons/hicolor/128x128/apps/${name}.png`,
    `/usr/share/icons/hicolor/64x64/apps/${name}.png`,
    `/usr/share/icons/hicolor/48x48/apps/${name}.png`,
    `/usr/share/icons/hicolor/scalable/apps/${name}.svg`,
    `/usr/share/pixmaps/${name}.png`,
    `/usr/share/pixmaps/${name}.svg`,
    `/usr/share/pixmaps/${name}.xpm`,
    `/usr/share/icons/hicolor/32x32/apps/${name}.png`,
    `/usr/share/icons/Adwaita/256x256/apps/${name}.png`,
    `/usr/share/icons/Adwaita/48x48/apps/${name}.png`,
  ]
  for (const p of candidates) {
    try { await access(p); return `file://${p}` } catch {}
  }
  return ''
}

async function parseDesktopFile(filePath: string): Promise<AppEntry | null> {
  try {
    const content = await readFile(filePath, 'utf8')
    const section = content.split('\n')
    const get = (key: string) => {
      const line = section.find(l => l.startsWith(`${key}=`))
      return line ? line.slice(key.length + 1).trim() : ''
    }
    const type       = get('Type')
    const noDisplay  = get('NoDisplay')
    const onlyShowIn = get('OnlyShowIn')
    const name       = get('Name')
    const exec       = get('Exec')

    if (type !== 'Application') return null
    if (noDisplay === 'true')   return null
    if (!name || !exec)         return null

    const rawCats = get('Categories').split(';').filter(Boolean)
    const category = rawCats.map((c: string) => CATEGORY_MAP[c]).find(Boolean) ?? 'Other'

    return {
      name,
      exec: exec.replace(/%[uUfFdDnNickvm]/g, '').trim(),
      icon:       await resolveIconPath(get('Icon')),
      comment:    get('Comment') || get('GenericName'),
      categories: rawCats,
      category,
      desktopFile: filePath,
      terminal:   get('Terminal') === 'true',
    }
  } catch {
    return null
  }
}

export function registerLauncherHandlers(): void {
  ipcMain.handle('launcher:getApps', async () => {
    const results: AppEntry[] = []
    for (const dir of APP_DIRS) {
      try {
        const files = await readdir(dir)
        const entries = await Promise.all(
          files.filter(f => f.endsWith('.desktop'))
               .map(f => parseDesktopFile(join(dir, f)))
        )
        results.push(...entries.filter((e): e is AppEntry => e !== null))
      } catch {
        // dir doesn't exist, skip
      }
    }
    // Deduplicate by name
    const seen = new Set<string>()
    return results.filter(a => {
      if (seen.has(a.name)) return false
      seen.add(a.name)
      return true
    }).sort((a, b) => a.name.localeCompare(b.name))
  })

  ipcMain.handle('launcher:launch', async (_, app: AppEntry) => {
    try {
      const cmd = app.terminal
        ? `xfce4-terminal -e "${app.exec}"`
        : app.exec
      const parts = cmd.split(' ')
      const proc = spawn(parts[0], parts.slice(1), {
        detached: true,
        stdio: 'ignore',
        env: { ...process.env },
      })
      proc.unref()
      return true
    } catch {
      return false
    }
  })
}
