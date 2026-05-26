import { ipcMain } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync } from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)
function git(repoPath: string, cmd: string): Promise<string> {
  return execAsync(`git -C "${repoPath}" --no-pager ${cmd}`, { maxBuffer: 20 * 1024 * 1024 })
    .then(r => r.stdout.trim())
    .catch(e => { throw new Error(e.stderr?.trim() || e.message) })
}

export function registerGitHandlers(): void {
  ipcMain.handle('git:isRepo', async (_, repoPath: string) =>
    existsSync(path.join(repoPath, '.git'))
  )

  ipcMain.handle('git:status', async (_, repoPath: string) => {
    const raw    = await git(repoPath, 'status --porcelain=v1').catch(() => '')
    const branch = await git(repoPath, 'rev-parse --abbrev-ref HEAD').catch(() => 'HEAD')
    const ahead  = parseInt(await git(repoPath, 'rev-list --count @{u}..HEAD 2>/dev/null').catch(() => '0')) || 0
    const behind = parseInt(await git(repoPath, 'rev-list --count HEAD..@{u} 2>/dev/null').catch(() => '0')) || 0
    const files  = raw.split('\n').filter(Boolean).map(line => ({
      status: line.slice(0, 2).trim(), path: line.slice(3),
      staged: line[0] !== ' ' && line[0] !== '?',
    }))
    return { branch, files, ahead, behind }
  })

  ipcMain.handle('git:log', async (_, repoPath: string, limit = 30) => {
    const out = await git(repoPath, `log --pretty=format:"%H|%h|%s|%an|%ae|%ar|%ad" --date=short -${limit}`).catch(() => '')
    return out.split('\n').filter(Boolean).map(line => {
      const [hash, shortHash, subject, author, email, relDate, date] = line.split('|')
      return { hash, shortHash, subject, author, email, relDate, date }
    })
  })

  ipcMain.handle('git:diff', async (_, repoPath: string, filePath?: string, staged = false) => {
    const flag = staged ? '--cached' : ''
    const file = filePath ? `-- "${filePath}"` : ''
    return git(repoPath, `diff ${flag} ${file}`).catch(() => '')
  })

  ipcMain.handle('git:getBranches', async (_, repoPath: string) => {
    const out = await git(repoPath, 'branch -a --format=%(refname:short)|%(HEAD)').catch(() => '')
    return out.split('\n').filter(Boolean).map(line => {
      const [name, head] = line.split('|')
      return { name: name.trim(), isCurrent: head?.trim() === '*' }
    })
  })

  ipcMain.handle('git:checkout', async (_, repoPath: string, branch: string) => {
    await git(repoPath, `checkout "${branch}"`)
    return true
  })

  ipcMain.handle('git:stage', async (_, repoPath: string, files: string[]) => {
    const paths = files.map(f => `"${f}"`).join(' ')
    await git(repoPath, `add ${paths}`)
    return true
  })

  ipcMain.handle('git:unstage', async (_, repoPath: string, files: string[]) => {
    const paths = files.map(f => `"${f}"`).join(' ')
    await git(repoPath, `restore --staged ${paths}`)
    return true
  })

  ipcMain.handle('git:commit', async (_, repoPath: string, message: string) => {
    await git(repoPath, `commit -m "${message.replace(/"/g, '\\"')}"`)
    return true
  })

  ipcMain.handle('git:push',     async (_, repoPath: string) => git(repoPath, 'push'))
  ipcMain.handle('git:pull',     async (_, repoPath: string) => git(repoPath, 'pull'))
  ipcMain.handle('git:stash',    async (_, repoPath: string) => { await git(repoPath, 'stash'); return true })
  ipcMain.handle('git:stashPop', async (_, repoPath: string) => { await git(repoPath, 'stash pop'); return true })
  ipcMain.handle('git:init',     async (_, repoPath: string) => { await git(repoPath, 'init'); return true })
}
