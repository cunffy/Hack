import { r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./index-9eb3LhaV.js";
const SIDEBAR_LOCS = [
  { label: "Home", icon: "⌂", key: "home" },
  { label: "Desktop", icon: "🖥", key: "desktop" },
  { label: "Documents", icon: "📄", key: "documents" },
  { label: "Downloads", icon: "↓", key: "downloads" },
  { label: "Pictures", icon: "🖼", key: "pictures" },
  { label: "Music", icon: "♪", key: "music" },
  { label: "Videos", icon: "▶", key: "videos" }
];
const EXT_COLORS = {
  py: "#3572A5",
  js: "#f7df1e",
  ts: "#3178c6",
  tsx: "#3178c6",
  jsx: "#61dafb",
  rs: "#dea584",
  go: "#00acd7",
  c: "#555555",
  cpp: "#f34b7d",
  sh: "#89e051",
  json: "#cbcb41",
  md: "#083fa1",
  html: "#e34c26",
  css: "#563d7c",
  png: "#a78bfa",
  jpg: "#a78bfa",
  jpeg: "#a78bfa",
  gif: "#a78bfa",
  svg: "#a78bfa",
  mp4: "#ef4444",
  mp3: "#f97316",
  pdf: "#ef4444",
  zip: "#eab308",
  tar: "#eab308",
  txt: "#c9d1d9",
  log: "#6b7280"
};
function fileColor(ext) {
  return EXT_COLORS[ext.toLowerCase()] || "#4e5d6e";
}
function formatSize(bytes) {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}
function FilesApp() {
  const [home, setHome] = reactExports.useState("");
  const [cwd, setCwd] = reactExports.useState("");
  const [items, setItems] = reactExports.useState([]);
  const [history, setHistory] = reactExports.useState([]);
  const [histIdx, setHistIdx] = reactExports.useState(-1);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [search, setSearch] = reactExports.useState("");
  const [drives, setDrives] = reactExports.useState([]);
  const [renaming, setRenaming] = reactExports.useState(null);
  const [renameVal, setRenameVal] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [ctx, setCtx] = reactExports.useState(null);
  reactExports.useEffect(() => {
    window.cryogram.files.getHome().then((h) => {
      setHome(h);
      navigate(h);
    });
    window.cryogram.files.getDrives().then(setDrives);
  }, []);
  const navigate = reactExports.useCallback(async (path, addHistory = true) => {
    setLoading(true);
    setSelected(/* @__PURE__ */ new Set());
    setSearch("");
    try {
      const entries = await window.cryogram.files.readDir(path);
      setCwd(path);
      setItems(entries);
      if (addHistory) {
        setHistory((h) => [...h.slice(0, histIdx + 1), path]);
        setHistIdx((i) => i + 1);
      }
    } catch (e) {
      console.error("readDir failed", e);
    } finally {
      setLoading(false);
    }
  }, [histIdx]);
  const goBack = () => {
    if (histIdx > 0) {
      setHistIdx((i) => i - 1);
      navigate(history[histIdx - 1], false);
    }
  };
  const goForward = () => {
    if (histIdx < history.length - 1) {
      setHistIdx((i) => i + 1);
      navigate(history[histIdx + 1], false);
    }
  };
  const goUp = () => {
    const parent = cwd.split("/").slice(0, -1).join("/") || "/";
    if (parent !== cwd) navigate(parent);
  };
  const openItem = async (item) => {
    if (item.isDir) {
      navigate(item.path);
    } else {
      await window.cryogram.files.openExternal(item.path);
    }
  };
  const deleteSelected = async () => {
    for (const path of selected) {
      await window.cryogram.files.delete(path);
    }
    navigate(cwd, false);
    setCtx(null);
  };
  const startRename = (item) => {
    setRenaming(item.path);
    setRenameVal(item.name);
    setCtx(null);
  };
  const commitRename = async () => {
    if (renaming && renameVal.trim()) {
      await window.cryogram.files.rename(renaming, renameVal.trim());
      navigate(cwd, false);
    }
    setRenaming(null);
  };
  const newFolder = async () => {
    let name = "New Folder";
    let i = 1;
    const names = items.map((x) => x.name);
    while (names.includes(name)) name = `New Folder ${++i}`;
    await window.cryogram.files.mkdir(`${cwd}/${name}`);
    navigate(cwd, false);
  };
  const sidebarPath = (key) => {
    if (key === "home") return home;
    return `${home}/${key.charAt(0).toUpperCase() + key.slice(1)}`;
  };
  const filtered = items.filter(
    (i) => !search || i.name.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-1 overflow-hidden text-cryo-text",
      onContextMenu: (e) => {
        e.preventDefault();
        setCtx({ x: e.clientX, y: e.clientY, item: null });
      },
      onClick: () => {
        setCtx(null);
        setSelected(/* @__PURE__ */ new Set());
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-44 shrink-0 flex flex-col py-3 overflow-auto",
            style: { borderRight: "1px solid rgba(26,40,64,0.6)", background: "rgba(8,12,18,0.5)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 mb-1 text-cryo-muted text-xs uppercase tracking-widest", children: "Locations" }),
              SIDEBAR_LOCS.map((loc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => navigate(sidebarPath(loc.key)),
                  className: "flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-white/5 text-left",
                  style: { color: cwd === sidebarPath(loc.key) ? "#00d4ff" : "#c9d1d9" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm w-5 text-center", children: loc.icon }),
                    loc.label
                  ]
                },
                loc.key
              )),
              drives.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 mt-3 mb-1 text-cryo-muted text-xs uppercase tracking-widest", children: "Drives" }),
                drives.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => navigate(d.path),
                    className: "flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-white/5 text-left",
                    style: { color: cwd === d.path ? "#00d4ff" : "#c9d1d9" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm w-5 text-center", children: "💾" }),
                      d.name
                    ]
                  },
                  d.path
                ))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1.5 px-3 py-2 shrink-0",
              style: { borderBottom: "1px solid rgba(26,40,64,0.6)", background: "rgba(13,20,33,0.4)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(NavBtn, { onClick: goBack, disabled: histIdx <= 0, children: "←" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(NavBtn, { onClick: goForward, disabled: histIdx >= history.length - 1, children: "→" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(NavBtn, { onClick: goUp, disabled: !cwd || cwd === "/", children: "↑" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex-1 mx-2 px-2.5 py-1 rounded-md text-xs truncate text-cryo-muted",
                    style: { background: "rgba(8,12,18,0.6)", border: "1px solid rgba(26,40,64,0.6)" },
                    title: cwd,
                    children: cwd
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "w-36 text-xs py-1 px-2",
                    placeholder: "Search…",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    onClick: (e) => e.stopPropagation()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(NavBtn, { onClick: newFolder, title: "New Folder", children: "+" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-cryo-muted text-xs", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-cryo-muted text-xs", children: search ? "No results" : "Empty folder" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", style: { gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))" }, children: filtered.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onDoubleClick: () => openItem(item),
              onClick: (e) => {
                e.stopPropagation();
                setSelected(/* @__PURE__ */ new Set([item.path]));
              },
              onContextMenu: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setCtx({ x: e.clientX, y: e.clientY, item });
              },
              className: "flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-default transition-colors",
              style: {
                background: selected.has(item.path) ? "rgba(0,212,255,0.12)" : "transparent",
                border: selected.has(item.path) ? "1px solid rgba(0,212,255,0.3)" : "1px solid transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold",
                    style: {
                      background: item.isDir ? "rgba(0,212,255,0.1)" : `${fileColor(item.ext)}18`,
                      border: `1px solid ${item.isDir ? "rgba(0,212,255,0.2)" : fileColor(item.ext) + "33"}`,
                      color: item.isDir ? "#00d4ff" : fileColor(item.ext),
                      fontSize: item.isDir ? 24 : 11,
                      fontFamily: '"JetBrains Mono", monospace'
                    },
                    children: item.isDir ? "📁" : item.ext ? `.${item.ext}` : "?"
                  }
                ),
                renaming === item.path ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    autoFocus: true,
                    value: renameVal,
                    onChange: (e) => setRenameVal(e.target.value),
                    onBlur: commitRename,
                    onKeyDown: (e) => {
                      if (e.key === "Enter") commitRename();
                      if (e.key === "Escape") setRenaming(null);
                    },
                    className: "text-xs w-full text-center px-1 py-0.5 rounded",
                    onClick: (e) => e.stopPropagation()
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-center leading-tight line-clamp-2 max-w-full break-all", children: item.name }),
                !item.isDir && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cryo-muted", children: formatSize(item.size) })
              ]
            },
            item.path
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-1 text-xs text-cryo-muted shrink-0",
              style: { borderTop: "1px solid rgba(26,40,64,0.4)" },
              children: [
                filtered.length,
                " item",
                filtered.length !== 1 ? "s" : "",
                selected.size > 0 && ` · ${selected.size} selected`
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ctx && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
            transition: { duration: 0.1 },
            className: "fixed z-50 py-1 rounded-lg overflow-hidden",
            style: {
              left: ctx.x,
              top: ctx.y,
              background: "rgba(13,20,33,0.97)",
              border: "1px solid rgba(26,40,64,0.9)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              minWidth: 180
            },
            onClick: (e) => e.stopPropagation(),
            children: ctx.item ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CtxItem, { label: ctx.item.isDir ? "Open" : "Open", onClick: () => {
                openItem(ctx.item);
                setCtx(null);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CtxItem, { label: "Rename", onClick: () => startRename(ctx.item) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CtxDivider, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CtxItem, { label: "Delete", onClick: deleteSelected, danger: true })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CtxItem, { label: "New Folder", onClick: () => {
                newFolder();
                setCtx(null);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CtxItem, { label: "Refresh", onClick: () => {
                navigate(cwd, false);
                setCtx(null);
              } })
            ] })
          }
        ) })
      ]
    }
  );
}
function NavBtn({ onClick, disabled, children, title }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      disabled,
      title,
      className: "w-7 h-7 flex items-center justify-center rounded text-cryo-muted hover:text-cryo-text hover:bg-white/5 transition-colors text-sm disabled:opacity-30",
      children
    }
  );
}
function CtxItem({ label, onClick, danger }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      className: "w-full text-left px-4 py-1.5 text-xs transition-colors hover:bg-white/5",
      style: { color: danger ? "#ff4466" : "#c9d1d9" },
      children: label
    }
  );
}
function CtxDivider() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1 mx-2", style: { height: 1, background: "rgba(26,40,64,0.8)" } });
}
export {
  FilesApp as default
};
