import { r as reactExports, e as useWindowStore, u as useDesktopStore, c as usePinnedStore, A as APP_META, j as jsxRuntimeExports, a as AnimatePresence, m as motion } from "./index-kDXlqBWm.js";
const CATEGORY_ICONS = {
  Cryogram: "✦",
  Security: "🔐",
  Development: "💻",
  Gaming: "🎮",
  Internet: "🌐",
  Multimedia: "🎵",
  Media: "🎵",
  Graphics: "🎨",
  Office: "📄",
  System: "⚙️",
  Utilities: "🔧",
  Other: "📦"
};
const CATEGORY_ORDER = [
  "Cryogram",
  "Security",
  "Development",
  "Internet",
  "System",
  "Utilities",
  "Multimedia",
  "Media",
  "Graphics",
  "Office",
  "Gaming",
  "Other"
];
const BUILTIN_CAT = {
  terminal: "Development",
  editor: "Development",
  git: "Development",
  docker: "Development",
  database: "Development",
  "api-tester": "Development",
  "json-explorer": "Development",
  regex: "Development",
  "encoding-chain": "Development",
  markdown: "Development",
  "password-tester": "Security",
  leaker: "Security",
  firewall: "Security",
  "ssh-keys": "Security",
  vpn: "Security",
  shodan: "Security",
  osint: "Security",
  cve: "Security",
  "packet-sniffer": "Security",
  netmon: "Security",
  scanner: "Security",
  "cert-inspector": "Security",
  wordlists: "Security",
  "password-health": "Security",
  totp: "Security",
  "crypto-tools": "Security",
  passwords: "Security",
  "audit-log": "Security",
  "code-scanner": "Security",
  settings: "System",
  "task-manager": "System",
  logs: "System",
  backup: "System",
  trash: "System",
  files: "System",
  wallpaper: "System",
  "clipboard-history": "System",
  calculator: "Utilities",
  "color-picker": "Utilities",
  "unit-converter": "Utilities",
  "world-clock": "Utilities",
  pomodoro: "Utilities",
  screenshot: "Utilities",
  "image-viewer": "Utilities",
  "remote-desktop": "Utilities",
  mail: "Internet",
  "rss-reader": "Internet",
  opticseo: "Internet",
  phone: "Internet",
  "ai-assistant": "Internet",
  notes: "Utilities",
  launcher: "System"
};
function LauncherApp() {
  const [native, setNative] = reactExports.useState([]);
  const [search, setSearch] = reactExports.useState("");
  const [activeCategory, setActiveCategory] = reactExports.useState("All");
  const [launching, setLaunching] = reactExports.useState(null);
  const [selIdx, setSelIdx] = reactExports.useState(0);
  const [cols, setCols] = reactExports.useState(1);
  const [ctxMenu, setCtxMenu] = reactExports.useState(null);
  const gridRef = reactExports.useRef(null);
  const searchRef = reactExports.useRef(null);
  const openApp = useWindowStore((s) => s.openApp);
  const addDesktopIcon = useDesktopStore((s) => s.addIcon);
  const { taskbar: pinnedTaskbar, desktop: pinnedDesktop, pinToTaskbar, pinToDesktop, unpinTaskbar, unpinDesktop } = usePinnedStore();
  reactExports.useEffect(() => {
    window.cryogram.launcher.getApps().then(setNative).catch(() => setNative([]));
  }, []);
  const allItems = reactExports.useMemo(() => {
    const builtins = Object.keys(APP_META).filter((id) => id !== "system" && id !== "brave").map((id) => ({
      kind: "builtin",
      key: `builtin-${id}`,
      appId: id,
      name: APP_META[id].label,
      category: BUILTIN_CAT[id] ?? "Cryogram",
      color: APP_META[id].color,
      icon: APP_META[id].icon
    })).sort((a, b) => a.name.localeCompare(b.name));
    const natives = native.map((app) => ({
      kind: "native",
      key: `native-${app.desktopFile}`,
      name: app.name,
      category: app.category,
      comment: app.comment,
      icon: app.icon,
      app
    }));
    return [...builtins, ...natives];
  }, [native]);
  const categories = reactExports.useMemo(() => {
    const cats = new Set(allItems.map((a) => a.category));
    const ordered = CATEGORY_ORDER.filter((c) => cats.has(c));
    const extra = [...cats].filter((c) => !CATEGORY_ORDER.includes(c)).sort();
    return ["All", ...ordered, ...extra];
  }, [allItems]);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return allItems.filter((a) => {
      const matchCat = activeCategory === "All" || a.category === activeCategory;
      const comment = a.kind === "native" ? a.comment : "";
      const matchSearch = !q || a.name.toLowerCase().includes(q) || comment.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [allItems, search, activeCategory]);
  reactExports.useEffect(() => {
    setSelIdx((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);
  reactExports.useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el);
      const n = cs.gridTemplateColumns.split(" ").filter(Boolean).length;
      setCols(Math.max(1, n));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [filtered.length]);
  const launch = reactExports.useCallback(async (item) => {
    if (item.kind === "builtin") {
      openApp(item.appId);
      return;
    }
    setLaunching(item.key);
    try {
      await window.cryogram.launcher.launch(item.app);
    } catch {
    }
    setTimeout(() => setLaunching(null), 1500);
  }, [openApp]);
  const onKeyDown = reactExports.useCallback((e) => {
    const n = filtered.length;
    if (n === 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setSelIdx((i) => Math.min(n - 1, i + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSelIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelIdx((i) => Math.min(n - 1, i + cols));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelIdx((i) => Math.max(0, i - cols));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selIdx]) launch(filtered[selIdx]);
    } else if (e.key === "Escape") {
      if (search) {
        e.preventDefault();
        setSearch("");
      }
    }
  }, [filtered, cols, selIdx, search, launch]);
  reactExports.useEffect(() => {
    const el = gridRef.current?.querySelector(`[data-idx="${selIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selIdx]);
  const toPinned = (app) => ({
    id: app.desktopFile,
    name: app.name,
    exec: app.exec,
    icon: app.icon,
    category: app.category,
    desktopFile: app.desktopFile
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden text-cryo-text", onKeyDown, tabIndex: -1, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-48 shrink-0 flex flex-col py-3 overflow-auto",
        style: { borderRight: "1px solid rgba(26,40,64,0.6)", background: "rgba(8,12,18,0.5)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 mb-2 text-cryo-muted text-[11px] uppercase tracking-widest font-semibold", children: "Categories" }),
          categories.map((cat) => {
            const count = cat === "All" ? allItems.length : allItems.filter((a) => a.category === cat).length;
            const active = activeCategory === cat;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setActiveCategory(cat);
                  setSelIdx(0);
                },
                className: "flex items-center gap-2.5 mx-2 px-2.5 py-2 text-[13px] rounded-lg transition-colors text-left",
                style: {
                  color: active ? "#00d4ff" : "#c9d1d9",
                  background: active ? "rgba(0,212,255,0.12)" : "transparent"
                },
                onMouseEnter: (e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                },
                onMouseLeave: (e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 text-center text-base", children: cat === "All" ? "✦" : CATEGORY_ICONS[cat] || "📦" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: cat }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: active ? "#00d4ff" : "rgba(255,255,255,0.3)", fontVariantNumeric: "tabular-nums" }, children: count })
                ]
              },
              cat
            );
          })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-4 py-3 shrink-0 flex items-center gap-2",
          style: { borderBottom: "1px solid rgba(26,40,64,0.6)", background: "rgba(13,20,33,0.4)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none", width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.35)", strokeWidth: "2", strokeLinecap: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "7" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: searchRef,
                autoFocus: true,
                className: "w-full text-sm py-2 pl-9 pr-3 rounded-lg outline-none",
                style: { background: "rgba(8,12,18,0.6)", border: "1px solid rgba(26,40,64,0.6)", color: "#c9d1d9" },
                placeholder: "Search applications…  (type to filter, ↵ to launch)",
                value: search,
                onChange: (e) => {
                  setSearch(e.target.value);
                  setSelIdx(0);
                },
                onKeyDown
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-4", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-cryo-muted gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 34 }, children: "🔍" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "No applications found" }),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs mt-1", style: { color: "#00d4ff" }, onClick: () => setSearch(""), children: "Clear search" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: gridRef,
          className: "grid gap-3",
          style: { gridTemplateColumns: "repeat(auto-fill, minmax(116px, 1fr))" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: filtered.map((item, i) => {
            const pinnedTb = item.kind === "native" && pinnedTaskbar.some((p) => p.id === item.app.desktopFile);
            const pinnedDt = item.kind === "native" && pinnedDesktop.some((p) => p.id === item.app.desktopFile);
            const selected = i === selIdx;
            const isLaunching = item.kind === "native" && launching === item.key;
            const accent = item.kind === "builtin" ? item.color : "#00d4ff";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                "data-idx": i,
                layout: true,
                initial: { opacity: 0, scale: 0.92 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.92 },
                transition: { duration: 0.12, delay: Math.min(i * 8e-3, 0.2) },
                onClick: () => {
                  setSelIdx(i);
                  launch(item);
                },
                onMouseEnter: () => setSelIdx(i),
                onContextMenu: (e) => {
                  e.preventDefault();
                  setSelIdx(i);
                  setCtxMenu({ x: e.clientX, y: e.clientY, item });
                },
                title: item.kind === "native" ? item.comment || item.name : item.name,
                className: "flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors relative",
                style: {
                  background: isLaunching ? "rgba(0,212,255,0.15)" : selected ? "rgba(255,255,255,0.07)" : "rgba(13,20,33,0.4)",
                  border: `1px solid ${selected || isLaunching ? `${accent}66` : "rgba(26,40,64,0.5)"}`,
                  boxShadow: selected ? `0 0 18px ${accent}22` : "none"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden",
                      style: {
                        background: item.kind === "builtin" ? `radial-gradient(ellipse at 38% 28%, ${item.color}2e, rgba(10,15,24,0.9) 72%)` : "rgba(0,212,255,0.07)",
                        border: `1px solid ${item.kind === "builtin" ? `${item.color}33` : "rgba(0,212,255,0.15)"}`
                      },
                      children: item.kind === "builtin" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: item.color, transform: "scale(1.25)" }, children: item.icon }) : /* @__PURE__ */ jsxRuntimeExports.jsx(NativeIcon, { icon: item.icon, fallback: CATEGORY_ICONS[item.category] || "📦" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-center leading-tight line-clamp-2 max-w-full", style: { color: selected ? "#fff" : "#c9d1d9" }, children: item.name }),
                  isLaunching && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", style: { color: "#00d4ff" }, children: "Launching…" }),
                  (pinnedTb || pinnedDt) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-1.5 right-1.5 flex gap-0.5", children: [
                    pinnedTb && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "Pinned to Taskbar", style: { fontSize: 8, color: "#00d4ff" }, children: "▬" }),
                    pinnedDt && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "Pinned to Desktop", style: { fontSize: 8, color: "#34d399" }, children: "⬛" })
                  ] })
                ]
              },
              item.key
            );
          }) })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "px-4 py-1.5 text-[11px] text-cryo-muted shrink-0 flex items-center gap-3",
          style: { borderTop: "1px solid rgba(26,40,64,0.4)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              filtered.length,
              " app",
              filtered.length !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.5 }, children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Click to launch" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.5 }, children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "↑↓←→ to navigate · ↵ to open" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.5 }, children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Right-click to pin" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ctxMenu && (() => {
      const it = ctxMenu.item;
      const nat = it.kind === "native" ? it.app : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        LauncherCtxMenu,
        {
          x: ctxMenu.x,
          y: ctxMenu.y,
          item: it,
          isPinnedTaskbar: !!nat && pinnedTaskbar.some((p) => p.id === nat.desktopFile),
          isPinnedDesktop: !!nat && pinnedDesktop.some((p) => p.id === nat.desktopFile),
          onLaunch: () => {
            launch(it);
            setCtxMenu(null);
          },
          onAddBuiltinDesktop: () => {
            if (it.kind === "builtin") addDesktopIcon(it.appId);
            setCtxMenu(null);
          },
          onPinTaskbar: () => {
            if (nat) pinToTaskbar(toPinned(nat));
            setCtxMenu(null);
          },
          onUnpinTaskbar: () => {
            if (nat) unpinTaskbar(nat.desktopFile);
            setCtxMenu(null);
          },
          onPinDesktop: () => {
            if (nat) pinToDesktop(toPinned(nat));
            setCtxMenu(null);
          },
          onUnpinDesktop: () => {
            if (nat) unpinDesktop(nat.desktopFile);
            setCtxMenu(null);
          },
          onClose: () => setCtxMenu(null)
        }
      );
    })() })
  ] });
}
function NativeIcon({ icon, fallback }) {
  const [failed, setFailed] = reactExports.useState(false);
  if (!icon || failed) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 26 }, children: fallback });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: icon,
      alt: "",
      className: "w-10 h-10 object-contain",
      onError: () => setFailed(true)
    }
  );
}
function LauncherCtxMenu({ x, y, item, isPinnedTaskbar, isPinnedDesktop, onLaunch, onAddBuiltinDesktop, onPinTaskbar, onUnpinTaskbar, onPinDesktop, onUnpinDesktop, onClose }) {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  const left = Math.min(x, window.innerWidth - 210);
  const top = Math.min(y, window.innerHeight - 200);
  const items = item.kind === "builtin" ? [
    { label: `Open ${item.name}`, action: onLaunch, icon: "▶" },
    null,
    { label: "Add to Desktop", action: onAddBuiltinDesktop, icon: "⬛" }
  ] : [
    { label: `Launch ${item.name}`, action: onLaunch, icon: "▶" },
    null,
    isPinnedTaskbar ? { label: "Unpin from Taskbar", action: onUnpinTaskbar, icon: "▬" } : { label: "Pin to Taskbar", action: onPinTaskbar, icon: "▬" },
    isPinnedDesktop ? { label: "Remove from Desktop", action: onUnpinDesktop, icon: "⬛" } : { label: "Add to Desktop", action: onPinDesktop, icon: "⬛" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      ref,
      initial: { opacity: 0, scale: 0.93, y: 4 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.93, y: 4 },
      transition: { duration: 0.1 },
      onContextMenu: (e) => e.preventDefault(),
      style: {
        position: "fixed",
        left,
        top,
        background: "rgba(13,20,33,0.99)",
        border: "1px solid rgba(0,212,255,0.2)",
        borderRadius: 10,
        padding: 4,
        zIndex: 99999,
        minWidth: 200,
        boxShadow: "0 8px 32px rgba(0,0,0,0.7)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1.5 text-xs font-semibold", style: { color: "#00d4ff", fontFamily: "monospace", borderBottom: "1px solid rgba(0,212,255,0.1)", marginBottom: 2 }, children: item.name }),
        items.map(
          (it, i) => it === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "rgba(0,212,255,0.08)", margin: "3px 8px" } }, i) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: it.action,
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                textAlign: "left",
                padding: "7px 12px",
                borderRadius: 6,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "monospace",
                color: "#c9d1d9"
              },
              onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,212,255,0.08)",
              onMouseLeave: (e) => e.currentTarget.style.background = "none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, textAlign: "center", fontSize: 10, color: "#00d4ff" }, children: it.icon }),
                it.label
              ]
            },
            it.label
          )
        )
      ]
    }
  );
}
export {
  LauncherApp as default
};
