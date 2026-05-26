import { ipcMain, dialog } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

const WORDLISTS_DIR = path.join(os.homedir(), '.cryogram', 'wordlists')

export function registerWordlistsHandlers() {
  ipcMain.handle('wordlists:list', async () => {
    await fs.mkdir(WORDLISTS_DIR, { recursive: true })
    const entries = await fs.readdir(WORDLISTS_DIR).catch(() => [] as string[])
    const lists = []
    for (const e of entries) {
      try {
        const fp = path.join(WORDLISTS_DIR, e)
        const stat = await fs.stat(fp)
        const content = await fs.readFile(fp, 'utf-8')
        lists.push({ name: e, path: fp, lineCount: content.split('\n').filter(l=>l.trim()).length, sizeKB: Math.round(stat.size / 1024) })
      } catch {}
    }
    return lists
  })

  ipcMain.handle('wordlists:preview', async (_, filePath: string, count = 200) => {
    const content = await fs.readFile(filePath, 'utf-8')
    return content.split('\n').filter(l=>l.trim()).slice(0, count)
  })

  ipcMain.handle('wordlists:import', async (event) => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Text files', extensions: ['txt','lst','wordlist'] }] })
    if (result.filePaths[0]) {
      await fs.mkdir(WORDLISTS_DIR, { recursive: true })
      const dest = path.join(WORDLISTS_DIR, path.basename(result.filePaths[0]))
      await fs.copyFile(result.filePaths[0], dest)
      return dest
    }
    return null
  })

  ipcMain.handle('wordlists:delete', async (_, filePath: string) => {
    await fs.rm(filePath, { force: true })
    return true
  })

  ipcMain.handle('wordlists:generate', async (_, opts: { minLen:number; maxLen:number; charsets:string[]; count:number; prefix:string; suffix:string }) => {
    await fs.mkdir(WORDLISTS_DIR, { recursive: true })
    let charset = ''
    if (opts.charsets.includes('lowercase')) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (opts.charsets.includes('uppercase')) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (opts.charsets.includes('digits')) charset += '0123456789'
    if (opts.charsets.includes('symbols')) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz'

    const words: string[] = []
    for (let i = 0; i < Math.min(opts.count, 100000); i++) {
      const len = opts.minLen + Math.floor(Math.random() * (opts.maxLen - opts.minLen + 1))
      let word = opts.prefix || ''
      for (let j = 0; j < len; j++) word += charset[Math.floor(Math.random() * charset.length)]
      word += opts.suffix || ''
      words.push(word)
    }

    const name = `generated-${Date.now()}.txt`
    await fs.writeFile(path.join(WORDLISTS_DIR, name), words.join('\n') + '\n', 'utf-8')
    return name
  })
}
