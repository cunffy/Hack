import { ipcMain } from 'electron'
import { getSettingsStore } from './settings'

interface RSSFeed {
  id: string
  url: string
  title: string
  description: string
  lastFetched: number
}

interface RSSItem {
  id: string
  feedId: string
  title: string
  link: string
  description: string
  pubDate: string
  read: boolean
}

function extractText(xml: string, tag: string): string {
  const cdataMatch = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i').exec(xml)
  if (cdataMatch) return cdataMatch[1].trim()
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml)
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : ''
}

function parseRSS(xml: string, feedId: string): { feed: Partial<RSSFeed>; items: RSSItem[] } {
  const feedTitle = extractText(xml.split('<item')[0], 'title') || extractText(xml.split('<entry')[0], 'title')
  const feedDesc  = extractText(xml.split('<item')[0], 'description') || extractText(xml.split('<entry')[0], 'subtitle')

  const isAtom = xml.includes('<feed')
  const itemTag = isAtom ? 'entry' : 'item'
  const parts = xml.split(`<${itemTag}`)
  const items: RSSItem[] = []

  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i]
    const title = extractText(chunk, 'title')
    const link  = isAtom
      ? (/<link[^>]+href="([^"]+)"/.exec(chunk)?.[1] ?? extractText(chunk, 'link'))
      : extractText(chunk, 'link')
    const desc  = extractText(chunk, isAtom ? 'summary' : 'description') || extractText(chunk, 'content')
    const date  = extractText(chunk, isAtom ? 'updated' : 'pubDate')
    if (title || link) {
      items.push({ id: `${feedId}-${i}`, feedId, title, link, description: desc.slice(0, 400), pubDate: date, read: false })
    }
  }

  return { feed: { title: feedTitle, description: feedDesc }, items: items.slice(0, 50) }
}

async function fetchFeed(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'CyberDen RSS Reader/1.0' }, signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

export function registerRSSReaderHandlers() {
  const store = getSettingsStore()

  function getFeeds(): RSSFeed[] {
    return (store.get('rss_feeds') as RSSFeed[] | undefined) ?? []
  }
  function getItems(): RSSItem[] {
    return (store.get('rss_items') as RSSItem[] | undefined) ?? []
  }
  function saveFeeds(feeds: RSSFeed[]) { store.set('rss_feeds', feeds) }
  function saveItems(items: RSSItem[]) {
    // Keep only last 500 items across all feeds
    store.set('rss_items', items.slice(0, 500))
  }

  ipcMain.handle('rss:getFeeds', () => getFeeds())
  ipcMain.handle('rss:getItems', (_, feedId?: string) => {
    const items = getItems()
    return feedId ? items.filter(i => i.feedId === feedId) : items
  })

  ipcMain.handle('rss:addFeed', async (_, url: string) => {
    const feeds = getFeeds()
    if (feeds.find(f => f.url === url)) throw new Error('Feed already added')
    const xml = await fetchFeed(url)
    const { feed, items } = parseRSS(xml, `feed-${Date.now()}`)
    const newFeed: RSSFeed = {
      id: `feed-${Date.now()}`,
      url,
      title: feed.title || url,
      description: feed.description || '',
      lastFetched: Date.now(),
    }
    saveFeeds([...feeds, newFeed])
    const existing = getItems()
    saveItems([...items.map(i => ({ ...i, feedId: newFeed.id })), ...existing])
    return { feed: newFeed, items }
  })

  ipcMain.handle('rss:removeFeed', (_, id: string) => {
    saveFeeds(getFeeds().filter(f => f.id !== id))
    saveItems(getItems().filter(i => i.feedId !== id))
  })

  ipcMain.handle('rss:refresh', async (_, id: string) => {
    const feeds = getFeeds()
    const feed = feeds.find(f => f.id === id)
    if (!feed) throw new Error('Feed not found')
    const xml = await fetchFeed(feed.url)
    const { feed: meta, items } = parseRSS(xml, id)
    const updated = feeds.map(f => f.id === id ? { ...f, title: meta.title || f.title, lastFetched: Date.now() } : f)
    saveFeeds(updated)
    const existing = getItems().filter(i => i.feedId !== id)
    saveItems([...items, ...existing])
    return items
  })

  ipcMain.handle('rss:markRead', (_, itemId: string) => {
    saveItems(getItems().map(i => i.id === itemId ? { ...i, read: true } : i))
  })

  ipcMain.handle('rss:markAllRead', (_, feedId: string) => {
    saveItems(getItems().map(i => i.feedId === feedId ? { ...i, read: true } : i))
  })
}
