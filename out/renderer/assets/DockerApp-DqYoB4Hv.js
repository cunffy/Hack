import { r as reactExports, j as jsxRuntimeExports } from "./index-CkoTmMxG.js";
const ACCENT = "#00d4ff";
const ipc = window.cryogram;
function formatBytes(b) {
  if (!b) return "0 B";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1073741824) return `${(b / 1048576).toFixed(1)} MB`;
  return `${(b / 1073741824).toFixed(2)} GB`;
}
function relDate(ts) {
  const s = Math.floor(Date.now() / 1e3 - ts);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
const S = {
  root: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "rgba(10,14,22,0.94)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 13 },
  tabBar: { display: "flex", gap: 2, padding: "10px 14px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  body: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" },
  input: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 10px", color: "rgba(255,255,255,0.85)", fontSize: 12, outline: "none" }
};
function Tab({ id, active, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, style: { padding: "7px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, color: active ? ACCENT : "rgba(255,255,255,0.45)", borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent", transition: "all 0.15s" }, children: id.charAt(0).toUpperCase() + id.slice(1) });
}
function StatusDot({ state }) {
  const running = state === "running";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: running ? "#00ff88" : "rgba(255,255,255,0.25)", boxShadow: running ? "0 0 6px rgba(0,255,136,0.6)" : "none", flexShrink: 0 } });
}
function ProgressBar({ value, max, color = ACCENT }) {
  const pct = max > 0 ? Math.min(100, value / max * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 8, overflow: "hidden", flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", borderRadius: 4, background: color, width: `${pct}%`, transition: "width 0.4s ease", boxShadow: `0 0 8px ${color}44` } }) });
}
function EmptyState({ msg }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,0.3)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "2", width: "20", height: "8", rx: "2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "14", width: "20", height: "8", rx: "2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "6", x2: "6.01", y2: "6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "18", x2: "6.01", y2: "18" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13 }, children: msg })
  ] });
}
function ContainersTab() {
  const [containers, setContainers] = reactExports.useState([]);
  const [logs, setLogs] = reactExports.useState({});
  const [openLogs, setOpenLogs] = reactExports.useState(/* @__PURE__ */ new Set());
  const [acting, setActing] = reactExports.useState(null);
  const load = reactExports.useCallback(async () => {
    try {
      const r = await ipc?.docker?.listContainers?.();
      if (Array.isArray(r)) setContainers(r);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    load();
    const t = setInterval(load, 5e3);
    return () => clearInterval(t);
  }, [load]);
  const act = async (id, fn) => {
    setActing(id);
    try {
      await fn();
      await load();
    } catch {
    } finally {
      setActing(null);
    }
  };
  const toggleLogs = async (id) => {
    const next = new Set(openLogs);
    if (next.has(id)) {
      next.delete(id);
      setOpenLogs(next);
      return;
    }
    next.add(id);
    setOpenLogs(next);
    try {
      const l = await ipc?.docker?.containerLogs?.(id, 150);
      setLogs((prev) => ({ ...prev, [id]: l || "" }));
    } catch {
    }
  };
  if (containers.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { msg: "Docker not installed or not running" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }, children: containers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", style: { padding: "10px 14px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { state: c.state }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,0.9)" }, children: c.name.replace(/^\//, "") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }, children: [
          c.image,
          " · ",
          c.status,
          c.ports?.length > 0 && ` · ${c.ports.join(", ")}`
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, flexShrink: 0 }, children: [
        c.state !== "running" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", style: { fontSize: 11, padding: "4px 10px", color: "#00ff88" }, onClick: () => act(c.id, () => ipc?.docker?.startContainer?.(c.id)), disabled: acting === c.id, children: "Start" }),
        c.state === "running" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", style: { fontSize: 11, padding: "4px 10px" }, onClick: () => act(c.id, () => ipc?.docker?.stopContainer?.(c.id)), disabled: acting === c.id, children: "Stop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", style: { fontSize: 11, padding: "4px 10px" }, onClick: () => act(c.id, () => ipc?.docker?.restartContainer?.(c.id)), disabled: acting === c.id, children: "Restart" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", style: { fontSize: 11, padding: "4px 10px" }, onClick: () => toggleLogs(c.id), children: "Logs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", style: { fontSize: 11, padding: "4px 10px" }, onClick: () => {
          if (confirm(`Remove container ${c.name}?`)) act(c.id, () => ipc?.docker?.removeContainer?.(c.id));
        }, disabled: acting === c.id, children: "Remove" })
      ] })
    ] }),
    openLogs.has(c.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 10, background: "rgba(0,0,0,0.4)", borderRadius: 6, padding: "8px 10px", maxHeight: 180, overflowY: "auto", fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: "#00ff88", whiteSpace: "pre-wrap", lineHeight: 1.5 }, children: logs[c.id] || "Loading logs..." })
  ] }, c.id)) });
}
function ImagesTab() {
  const [images, setImages] = reactExports.useState([]);
  const [pullName, setPullName] = reactExports.useState("");
  const [pulling, setPulling] = reactExports.useState(false);
  const load = reactExports.useCallback(async () => {
    try {
      const r = await ipc?.docker?.listImages?.();
      if (Array.isArray(r)) setImages(r);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const pull = async () => {
    if (!pullName) return;
    setPulling(true);
    try {
      await ipc?.docker?.pullImage?.(pullName);
      await load();
    } catch {
    } finally {
      setPulling(false);
    }
  };
  const remove = async (id) => {
    if (!confirm("Remove this image?")) return;
    try {
      await ipc?.docker?.removeImage?.(id);
      await load();
    } catch {
    }
  };
  if (images.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { msg: "No images found" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: pullName, onChange: (e) => setPullName(e.target.value), onKeyDown: (e) => e.key === "Enter" && pull(), placeholder: "ubuntu:22.04", style: { ...S.input, flex: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: pull, disabled: pulling, style: { fontSize: 12 }, children: pulling ? "Pulling…" : "Pull" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: "8px 14px", display: "flex", flexDirection: "column", gap: 6 }, children: images.map((img) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", style: { padding: "8px 14px", display: "flex", alignItems: "center", gap: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }, children: [
          img.repository,
          ":",
          img.tag
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2, fontFamily: '"JetBrains Mono",monospace' }, children: [
          img.id?.slice(7, 19),
          " · ",
          formatBytes(img.size),
          " · ",
          relDate(img.created)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", style: { fontSize: 11, padding: "4px 10px" }, onClick: () => remove(img.id), children: "Remove" })
    ] }, img.id)) })
  ] });
}
function StatsTab() {
  const [stats, setStats] = reactExports.useState([]);
  const load = reactExports.useCallback(async () => {
    try {
      const r = await ipc?.docker?.getStats?.();
      if (Array.isArray(r)) setStats(r);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    load();
    const t = setInterval(load, 3e3);
    return () => clearInterval(t);
  }, [load]);
  if (stats.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { msg: "No running containers" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }, children: stats.map((s) => {
    const memPct = s.memLimit > 0 ? Math.round(s.memUsage / s.memLimit * 100) : 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", style: { padding: "12px 16px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, marginBottom: 10, fontSize: 13 }, children: s.name?.replace(/^\//, "") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", width: 40 }, children: "CPU" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: s.cpuPercent, max: 100, color: s.cpuPercent > 80 ? "#ff4466" : ACCENT }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: ACCENT, width: 44, textAlign: "right", fontFamily: '"JetBrains Mono",monospace' }, children: [
            s.cpuPercent?.toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", width: 40 }, children: "MEM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: s.memUsage, max: s.memLimit, color: memPct > 80 ? "#ffaa00" : "#bb88ff" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "#bb88ff", width: 44, textAlign: "right", fontFamily: '"JetBrains Mono",monospace' }, children: [
            memPct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "right" }, children: [
          formatBytes(s.memUsage),
          " / ",
          formatBytes(s.memLimit)
        ] })
      ] })
    ] }, s.id);
  }) });
}
function DockerApp() {
  const [tab, setTab] = reactExports.useState("containers");
  const TABS = ["containers", "images", "stats"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.tabBar, children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tab, { id: t, active: tab === t, onClick: () => setTab(t) }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.body, children: [
      tab === "containers" && /* @__PURE__ */ jsxRuntimeExports.jsx(ContainersTab, {}),
      tab === "images" && /* @__PURE__ */ jsxRuntimeExports.jsx(ImagesTab, {}),
      tab === "stats" && /* @__PURE__ */ jsxRuntimeExports.jsx(StatsTab, {})
    ] })
  ] });
}
export {
  DockerApp as default
};
