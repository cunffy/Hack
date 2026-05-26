import React, { useState, useEffect } from 'react'

interface RSSFeed { id: string; url: string; title: string; description: string; lastFetched: number }
interface RSSItem { id: string; feedId: string; title: string; link: string; description: string; pubDate: string; read: boolean }

const api = () => (window as any).cryogram?.rssReader

const STARTER_FEEDS = [
  { url: 'https://feeds.feedburner.com/TheHackersNews', label: 'The Hacker News' },
  { url: 'https://krebsonsecurity.com/feed/', label: 'Krebs on Security' },
  { url: 'https://www.schneier.com/feed/atom/', label: 'Schneier on Security' },
  { url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml', label: 'WSJ World News' },
]

export default function RSSReaderApp() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([])
  const [items, setItems] = useState<RSSItem[]>([])
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<RSSItem | null>(null)
  const [addUrl, setAddUrl] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function loadAll() {
    const [f, i] = await Promise.all([api()?.getFeeds(), api()?.getItems()])
    if (f) setFeeds(f)
    if (i) setItems(i)
  }

  useEffect(() => { loadAll() }, [])

  async function addFeed(url: string) {
    if (!url.trim()) return
    setLoading('add'); setError('')
    try {
      const res = await api()?.addFeed(url.trim())
      if (res) { await loadAll(); setAddUrl('') }
    } catch (e: any) { setError(e?.message || 'Failed to fetch feed') }
    finally { setLoading(null) }
  }

  async function removeFeed(id: string) {
    await api()?.removeFeed(id)
    if (selectedFeed === id) setSelectedFeed(null)
    await loadAll()
  }

  async function refresh(id: string) {
    setLoading(id)
    try {
      const newItems = await api()?.refresh(id)
      if (newItems) await loadAll()
    } catch {}
    finally { setLoading(null) }
  }

  async function markRead(itemId: string) {
    await api()?.markRead(itemId)
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, read: true } : i))
    if (selectedItem?.id === itemId) setSelectedItem(prev => prev ? { ...prev, read: true } : null)
  }

  async function markAllRead(feedId: string) {
    await api()?.markAllRead(feedId)
    setItems(prev => prev.map(i => i.feedId === feedId ? { ...i, read: true } : i))
  }

  const visibleItems = selectedFeed ? items.filter(i => i.feedId === selectedFeed) : items
  const unreadCount = (feedId: string) => items.filter(i => i.feedId === feedId && !i.read).length

  return (
    <div className="h-full flex bg-gray-950 text-gray-100 font-mono">
      {/* Feed sidebar */}
      <div className="w-56 flex flex-col border-r border-gray-800 shrink-0">
        <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-800">
          <span>📡</span>
          <span className="font-bold text-orange-400 text-sm">RSS Reader</span>
        </div>

        {/* Add feed */}
        <div className="px-2 py-2 border-b border-gray-800 space-y-1">
          <div className="flex gap-1">
            <input value={addUrl} onChange={e => setAddUrl(e.target.value)}
              placeholder="Feed URL…"
              className="flex-1 min-w-0 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
              onKeyDown={e => e.key === 'Enter' && addFeed(addUrl)} />
            <button onClick={() => addFeed(addUrl)} disabled={loading === 'add'}
              className="text-xs px-2 py-1 bg-orange-700 hover:bg-orange-600 text-white rounded disabled:opacity-50">
              {loading === 'add' ? '…' : '+'}
            </button>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {feeds.length === 0 && (
            <div className="space-y-1 mt-1">
              <p className="text-xs text-gray-600">Quick add:</p>
              {STARTER_FEEDS.map(f => (
                <button key={f.url} onClick={() => addFeed(f.url)}
                  className="block w-full text-left text-xs px-2 py-0.5 text-gray-500 hover:text-orange-400">
                  + {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Feed list */}
        <div className="flex-1 overflow-y-auto">
          <button onClick={() => setSelectedFeed(null)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 ${!selectedFeed ? 'bg-orange-950/30 text-orange-300' : 'text-gray-300'}`}>
            All Items
            {items.filter(i => !i.read).length > 0 && (
              <span className="ml-1 text-xs bg-orange-600 text-white rounded-full px-1.5">{items.filter(i => !i.read).length}</span>
            )}
          </button>
          {feeds.map(feed => (
            <div key={feed.id} className={`group flex items-center px-3 py-2 cursor-pointer hover:bg-gray-800 ${selectedFeed === feed.id ? 'bg-orange-950/30' : ''}`}
              onClick={() => setSelectedFeed(feed.id)}>
              <span className={`flex-1 text-xs truncate ${selectedFeed === feed.id ? 'text-orange-300' : 'text-gray-300'}`}>{feed.title}</span>
              {unreadCount(feed.id) > 0 && (
                <span className="text-xs bg-orange-600 text-white rounded-full px-1.5 ml-1">{unreadCount(feed.id)}</span>
              )}
              <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 ml-1">
                <button onClick={e => { e.stopPropagation(); refresh(feed.id) }}
                  className="text-xs text-gray-500 hover:text-blue-400 p-0.5"
                  title="Refresh">{loading === feed.id ? '…' : '↻'}</button>
                <button onClick={e => { e.stopPropagation(); removeFeed(feed.id) }}
                  className="text-xs text-gray-500 hover:text-red-400 p-0.5" title="Remove">×</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item list */}
      <div className="w-72 flex flex-col border-r border-gray-800 shrink-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
          <span className="text-xs text-gray-500">{visibleItems.length} items</span>
          {selectedFeed && (
            <button onClick={() => markAllRead(selectedFeed)} className="text-xs text-gray-500 hover:text-orange-400">Mark all read</button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {visibleItems.length === 0 && (
            <p className="text-center text-gray-600 text-xs mt-8 px-4">
              {feeds.length === 0 ? 'Add a feed to get started' : 'No items — click ↻ to refresh'}
            </p>
          )}
          {visibleItems.map(item => (
            <div key={item.id} onClick={() => { setSelectedItem(item); markRead(item.id) }}
              className={`px-3 py-2.5 border-b border-gray-800/60 cursor-pointer hover:bg-gray-900 ${selectedItem?.id === item.id ? 'bg-gray-900' : ''}`}>
              <p className={`text-xs leading-snug ${item.read ? 'text-gray-500' : 'text-gray-200 font-semibold'}`}>{item.title || 'Untitled'}</p>
              <p className="text-xs text-gray-600 mt-0.5">{feeds.find(f => f.id === item.feedId)?.title || ''}</p>
              {item.pubDate && <p className="text-xs text-gray-700 mt-0.5">{new Date(item.pubDate).toLocaleDateString()}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Article view */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedItem ? (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            <div className="text-center">
              <div className="text-4xl mb-3">📰</div>
              <p className="text-sm">Select an article to read</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="text-base font-semibold text-gray-100 leading-snug">{selectedItem.title}</h2>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-gray-500">{feeds.find(f => f.id === selectedItem.feedId)?.title}</span>
                {selectedItem.pubDate && <span className="text-xs text-gray-600">{new Date(selectedItem.pubDate).toLocaleString()}</span>}
                {selectedItem.link && (
                  <a href={selectedItem.link} target="_blank" rel="noreferrer"
                    className="text-xs text-orange-400 hover:text-orange-300 ml-auto">
                    Open in browser →
                  </a>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedItem.description || 'No preview available — open in browser to read the full article.'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
