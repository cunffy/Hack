import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-BD9ZsX0F.js";
const ACCENT = "#818cf8";
const cryogram = () => window.cryogram;
function cpuColor(pct) {
  if (pct > 80) return "#f87171";
  if (pct > 50) return "#fbbf24";
  return "#c9d1d9";
}
function StatBar({ label, pct, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 160 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.4)", width: 32, textAlign: "right", flexShrink: 0 }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: { width: `${Math.min(100, pct)}%` },
        transition: { duration: 0.6, ease: "easeOut" },
        style: { height: "100%", background: color, borderRadius: 3 }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color, width: 34, flexShrink: 0 }, children: [
      pct.toFixed(1),
      "%"
    ] })
  ] });
}
function KillButton({ pid, name, onKilled }) {
  const [busy, setBusy] = reactExports.useState(false);
  const kill = async (e) => {
    e.stopPropagation();
    const signal = e.shiftKey ? "SIGKILL" : "SIGTERM";
    setBusy(true);
    try {
      const result = await cryogram().processes.kill(pid, signal);
      if (result.success) onKilled();
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: "Click: SIGTERM  |  Shift+Click: SIGKILL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.button,
    {
      whileHover: { scale: 1.08 },
      whileTap: { scale: 0.93 },
      onClick: kill,
      disabled: busy,
      style: {
        padding: "2px 10px",
        background: "rgba(248,113,113,0.12)",
        border: "1px solid rgba(248,113,113,0.35)",
        borderRadius: 4,
        color: busy ? "rgba(248,113,113,0.4)" : "#f87171",
        fontSize: 10,
        fontWeight: 600,
        cursor: busy ? "not-allowed" : "pointer",
        letterSpacing: "0.04em"
      },
      children: busy ? "…" : "Kill"
    }
  ) });
}
function ProcessRow({
  proc,
  onKilled
}) {
  const [hovered, setHovered] = reactExports.useState(false);
  const isCryogram = /electron|cryogram/i.test(proc.command);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: {
        background: hovered ? "rgba(129,140,248,0.06)" : isCryogram ? "rgba(129,140,248,0.025)" : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        transition: "background 0.12s"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 10px", maxWidth: 160, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            title: proc.command,
            style: {
              fontSize: 12,
              color: isCryogram ? "rgba(129,140,248,0.7)" : "#c9d1d9",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: '"JetBrains Mono", monospace'
            },
            children: proc.name
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: '"JetBrains Mono", monospace' }, children: proc.pid }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 8px", textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: cpuColor(proc.cpu), fontFamily: '"JetBrains Mono", monospace', fontWeight: proc.cpu > 50 ? 600 : 400 }, children: [
          proc.cpu.toFixed(1),
          "%"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 8px", textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "#c9d1d9", fontFamily: '"JetBrains Mono", monospace' }, children: proc.memMb < 1024 ? `${proc.memMb.toFixed(1)} MB` : `${(proc.memMb / 1024).toFixed(2)} GB` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          fontSize: 10,
          padding: "1px 6px",
          borderRadius: 3,
          background: proc.status === "running" ? "rgba(52,211,153,0.1)" : proc.status === "zombie" ? "rgba(248,113,113,0.1)" : "rgba(255,255,255,0.04)",
          color: proc.status === "running" ? "#34d399" : proc.status === "zombie" ? "#f87171" : "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontWeight: 600
        }, children: proc.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.35)" }, children: proc.user }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 10px", width: 70 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: hovered && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.85 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.85 },
            transition: { duration: 0.1 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(KillButton, { pid: proc.pid, name: proc.name, onKilled })
          }
        ) }) })
      ]
    }
  );
}
function ColHeader({
  label,
  sortKey,
  active,
  dir,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "th",
    {
      onClick: () => onClick(sortKey),
      style: {
        padding: "7px 8px",
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        color: active ? ACCENT : "rgba(255,255,255,0.35)",
        textAlign: sortKey === "cpu" || sortKey === "memMb" ? "right" : "left",
        cursor: "pointer",
        userSelect: "none",
        background: "rgba(10,14,22,0.94)",
        borderBottom: "1px solid rgba(255,255,255,0.055)",
        whiteSpace: "nowrap"
      },
      children: [
        label,
        active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: 4, fontSize: 9, opacity: 0.7 }, children: dir === "asc" ? "▲" : "▼" })
      ]
    }
  );
}
function TaskManagerApp() {
  const [processes, setProcesses] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState({ cpuPct: 0, memTotal: 0, memUsed: 0, memPct: 0 });
  const [search, setSearch] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("cpu");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [loading, setLoading] = reactExports.useState(true);
  const intervalRef = reactExports.useRef(null);
  const refresh = reactExports.useCallback(async () => {
    try {
      const [procs, sysStats] = await Promise.all([
        cryogram().processes.list(),
        cryogram().processes.getSystemStats()
      ]);
      setProcesses(procs);
      setStats(sysStats);
      setLoading(false);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, 2e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);
  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "cpu" || key === "memMb" ? "desc" : "asc");
    }
  };
  const filtered = processes.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.command.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * mul;
    return String(av).localeCompare(String(bv)) * mul;
  });
  const COLS = [
    { label: "Name", key: "name" },
    { label: "PID", key: "pid" },
    { label: "CPU%", key: "cpu" },
    { label: "Memory", key: "memMb" },
    { label: "Status", key: "status" },
    { label: "User", key: "user" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        background: "rgba(10,14,22,0.94)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "10px 14px 8px",
              borderBottom: "1px solid rgba(255,255,255,0.055)",
              background: "rgba(8,12,18,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 20, flexWrap: "wrap" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatBar, { label: "CPU", pct: stats.cpuPct, color: cpuColor(stats.cpuPct) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatBar, { label: "RAM", pct: stats.memPct, color: stats.memPct > 80 ? "#f87171" : stats.memPct > 60 ? "#fbbf24" : ACCENT }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.25)", alignSelf: "center", marginLeft: "auto" }, children: [
                  stats.memUsed,
                  " / ",
                  stats.memTotal,
                  " MB"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: "Filter by name or command…",
                    style: {
                      flex: 1,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 5,
                      padding: "5px 10px",
                      color: "#c9d1d9",
                      fontSize: 12,
                      outline: "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }, children: [
                  filtered.length,
                  " of ",
                  processes.length
                ] })
              ] })
            ]
          }
        ),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.span,
          {
            style: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
            animate: { opacity: [0.3, 1, 0.3] },
            transition: { duration: 1.4, repeat: Infinity },
            children: "Loading processes…"
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: { position: "sticky", top: 0, zIndex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            COLS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ColHeader,
              {
                label: c.label,
                sortKey: c.key,
                active: sortKey === c.key,
                dir: sortDir,
                onClick: handleSort
              },
              c.key
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: {
              padding: "7px 10px",
              background: "rgba(10,14,22,0.94)",
              borderBottom: "1px solid rgba(255,255,255,0.055)",
              width: 70
            } })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            filtered.map((proc) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProcessRow,
              {
                proc,
                onKilled: refresh
              },
              proc.pid
            )),
            filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, style: { padding: "24px", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)" }, children: "No processes match your filter" }) })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  TaskManagerApp as default
};
