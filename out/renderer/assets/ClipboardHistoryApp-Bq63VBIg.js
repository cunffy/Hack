import { r as reactExports, j as jsxRuntimeExports } from "./index-HNqA6Mor.js";
const api = () => window.cryogram?.clipboardHistory;
function ClipboardHistoryApp() {
  const [entries, setEntries] = reactExports.useState([]);
  const [search, setSearch] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(null);
  reactExports.useEffect(() => {
    api()?.getAll().then(setEntries);
    const off = api()?.onChange?.((entry) => setEntries((prev) => [entry, ...prev.filter((e) => e.text !== entry.text)].slice(0, 200)));
    return () => off?.();
  }, []);
  const filtered = entries.filter(
    (e) => !search || e.text.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.ts - a.ts);
  async function copy(id) {
    await api()?.copy(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }
  async function togglePin(id) {
    const updated = await api()?.pin(id);
    if (updated) setEntries(updated);
  }
  async function del(id) {
    const updated = await api()?.delete(id);
    if (updated) setEntries(updated);
  }
  async function clearAll() {
    const updated = await api()?.clear();
    if (updated) setEntries(updated);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-gray-950 text-gray-100 font-mono", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-gray-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "📋" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-purple-400", children: "Clipboard History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500 ml-auto", children: [
        entries.length,
        " items"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearAll, className: "text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-800 hover:border-red-600", children: "Clear unpinned" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 border-b border-gray-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: search,
        onChange: (e) => setSearch(e.target.value),
        placeholder: "Search clipboard history…",
        className: "w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-gray-500 text-sm mt-12", children: search ? "No matches" : "Copy something to start building history" }),
      filtered.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `group flex items-start gap-2 px-4 py-3 border-b border-gray-800/60 hover:bg-gray-900 ${entry.pinned ? "bg-purple-950/20" : ""}`, children: [
        entry.pinned && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-400 mt-0.5 shrink-0", children: "📌" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-200 truncate whitespace-pre-wrap line-clamp-3 break-all leading-relaxed", children: entry.text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600 mt-1", children: new Date(entry.ts).toLocaleTimeString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => copy(entry.id),
              className: `text-xs px-2 py-1 rounded ${copied === entry.id ? "bg-green-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"}`,
              children: copied === entry.id ? "✓" : "Copy"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => togglePin(entry.id),
              className: "text-xs px-2 py-1 rounded bg-gray-700 hover:bg-purple-700 text-gray-300",
              children: entry.pinned ? "Unpin" : "Pin"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => del(entry.id),
              className: "text-xs px-2 py-1 rounded bg-gray-700 hover:bg-red-700 text-gray-300",
              children: "✕"
            }
          )
        ] })
      ] }, entry.id))
    ] })
  ] });
}
export {
  ClipboardHistoryApp as default
};
