import { r as reactExports, j as jsxRuntimeExports } from "./index-BD9ZsX0F.js";
const api = () => window.cryogram?.rssReader;
const STARTER_FEEDS = [
  { url: "https://feeds.feedburner.com/TheHackersNews", label: "The Hacker News" },
  { url: "https://krebsonsecurity.com/feed/", label: "Krebs on Security" },
  { url: "https://www.schneier.com/feed/atom/", label: "Schneier on Security" },
  { url: "https://feeds.a.dj.com/rss/RSSWorldNews.xml", label: "WSJ World News" }
];
function RSSReaderApp() {
  const [feeds, setFeeds] = reactExports.useState([]);
  const [items, setItems] = reactExports.useState([]);
  const [selectedFeed, setSelectedFeed] = reactExports.useState(null);
  const [selectedItem, setSelectedItem] = reactExports.useState(null);
  const [addUrl, setAddUrl] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(null);
  const [error, setError] = reactExports.useState("");
  async function loadAll() {
    const [f, i] = await Promise.all([api()?.getFeeds(), api()?.getItems()]);
    if (f) setFeeds(f);
    if (i) setItems(i);
  }
  reactExports.useEffect(() => {
    loadAll();
  }, []);
  async function addFeed(url) {
    if (!url.trim()) return;
    setLoading("add");
    setError("");
    try {
      const res = await api()?.addFeed(url.trim());
      if (res) {
        await loadAll();
        setAddUrl("");
      }
    } catch (e) {
      setError(e?.message || "Failed to fetch feed");
    } finally {
      setLoading(null);
    }
  }
  async function removeFeed(id) {
    await api()?.removeFeed(id);
    if (selectedFeed === id) setSelectedFeed(null);
    await loadAll();
  }
  async function refresh(id) {
    setLoading(id);
    try {
      const newItems = await api()?.refresh(id);
      if (newItems) await loadAll();
    } catch {
    } finally {
      setLoading(null);
    }
  }
  async function markRead(itemId) {
    await api()?.markRead(itemId);
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, read: true } : i));
    if (selectedItem?.id === itemId) setSelectedItem((prev) => prev ? { ...prev, read: true } : null);
  }
  async function markAllRead(feedId) {
    await api()?.markAllRead(feedId);
    setItems((prev) => prev.map((i) => i.feedId === feedId ? { ...i, read: true } : i));
  }
  const visibleItems = selectedFeed ? items.filter((i) => i.feedId === selectedFeed) : items;
  const unreadCount = (feedId) => items.filter((i) => i.feedId === feedId && !i.read).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex bg-gray-950 text-gray-100 font-mono", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-56 flex flex-col border-r border-gray-800 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-3 border-b border-gray-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📡" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-orange-400 text-sm", children: "RSS Reader" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2 py-2 border-b border-gray-800 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: addUrl,
              onChange: (e) => setAddUrl(e.target.value),
              placeholder: "Feed URL…",
              className: "flex-1 min-w-0 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-500",
              onKeyDown: (e) => e.key === "Enter" && addFeed(addUrl)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => addFeed(addUrl),
              disabled: loading === "add",
              className: "text-xs px-2 py-1 bg-orange-700 hover:bg-orange-600 text-white rounded disabled:opacity-50",
              children: loading === "add" ? "…" : "+"
            }
          )
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: error }),
        feeds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600", children: "Quick add:" }),
          STARTER_FEEDS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => addFeed(f.url),
              className: "block w-full text-left text-xs px-2 py-0.5 text-gray-500 hover:text-orange-400",
              children: [
                "+ ",
                f.label
              ]
            },
            f.url
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setSelectedFeed(null),
            className: `w-full text-left px-3 py-2 text-sm hover:bg-gray-800 ${!selectedFeed ? "bg-orange-950/30 text-orange-300" : "text-gray-300"}`,
            children: [
              "All Items",
              items.filter((i) => !i.read).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs bg-orange-600 text-white rounded-full px-1.5", children: items.filter((i) => !i.read).length })
            ]
          }
        ),
        feeds.map((feed) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `group flex items-center px-3 py-2 cursor-pointer hover:bg-gray-800 ${selectedFeed === feed.id ? "bg-orange-950/30" : ""}`,
            onClick: () => setSelectedFeed(feed.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex-1 text-xs truncate ${selectedFeed === feed.id ? "text-orange-300" : "text-gray-300"}`, children: feed.title }),
              unreadCount(feed.id) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-orange-600 text-white rounded-full px-1.5 ml-1", children: unreadCount(feed.id) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opacity-0 group-hover:opacity-100 flex gap-0.5 ml-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      refresh(feed.id);
                    },
                    className: "text-xs text-gray-500 hover:text-blue-400 p-0.5",
                    title: "Refresh",
                    children: loading === feed.id ? "…" : "↻"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      removeFeed(feed.id);
                    },
                    className: "text-xs text-gray-500 hover:text-red-400 p-0.5",
                    title: "Remove",
                    children: "×"
                  }
                )
              ] })
            ]
          },
          feed.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-72 flex flex-col border-r border-gray-800 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-gray-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500", children: [
          visibleItems.length,
          " items"
        ] }),
        selectedFeed && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => markAllRead(selectedFeed), className: "text-xs text-gray-500 hover:text-orange-400", children: "Mark all read" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
        visibleItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-gray-600 text-xs mt-8 px-4", children: feeds.length === 0 ? "Add a feed to get started" : "No items — click ↻ to refresh" }),
        visibleItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => {
              setSelectedItem(item);
              markRead(item.id);
            },
            className: `px-3 py-2.5 border-b border-gray-800/60 cursor-pointer hover:bg-gray-900 ${selectedItem?.id === item.id ? "bg-gray-900" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs leading-snug ${item.read ? "text-gray-500" : "text-gray-200 font-semibold"}`, children: item.title || "Untitled" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600 mt-0.5", children: feeds.find((f) => f.id === item.feedId)?.title || "" }),
              item.pubDate && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-700 mt-0.5", children: new Date(item.pubDate).toLocaleDateString() })
            ]
          },
          item.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col overflow-hidden", children: !selectedItem ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: "📰" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Select an article to read" })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-gray-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-gray-100 leading-snug", children: selectedItem.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500", children: feeds.find((f) => f.id === selectedItem.feedId)?.title }),
          selectedItem.pubDate && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-600", children: new Date(selectedItem.pubDate).toLocaleString() }),
          selectedItem.link && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: selectedItem.link,
              target: "_blank",
              rel: "noreferrer",
              className: "text-xs text-orange-400 hover:text-orange-300 ml-auto",
              children: "Open in browser →"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300 leading-relaxed whitespace-pre-wrap", children: selectedItem.description || "No preview available — open in browser to read the full article." }) })
    ] }) })
  ] });
}
export {
  RSSReaderApp as default
};
