import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-BDc1ClbM.js";
const ACCENT = "#00d4ff";
const cryogram = () => window.cryogram;
function fmtRate(bytesPerSec) {
  if (bytesPerSec >= 1024 * 1024) return `${(bytesPerSec / 1024 / 1024).toFixed(2)} MB/s`;
  if (bytesPerSec >= 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  return `${bytesPerSec.toFixed(0)} B/s`;
}
function fmtBytes(bytes) {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}
function Sparkline({ data, color, width = 120, height = 28 }) {
  if (data.length < 2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width, height });
  }
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = i / (data.length - 1) * width;
    const y = height - v / max * (height - 2) - 1;
    return `${x},${y}`;
  }).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width, height, style: { overflow: "visible" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "polyline",
      {
        points: pts,
        fill: "none",
        stroke: color,
        strokeWidth: 1.5,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        opacity: 0.8
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `grad-${color.replace("#", "")}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: color, stopOpacity: "0.25" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: color, stopOpacity: "0.02" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "polygon",
      {
        points: `0,${height} ${pts} ${width},${height}`,
        fill: `url(#grad-${color.replace("#", "")})`
      }
    )
  ] });
}
function InterfaceCard({ iface }) {
  const rxHistory = iface.history.map((h) => h.rx);
  const txHistory = iface.history.map((h) => h.tx);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      style: {
        background: "rgba(8,12,18,0.5)",
        border: "1px solid rgba(255,255,255,0.055)",
        borderRadius: 10,
        padding: "12px 14px",
        minWidth: 220,
        flex: "1 1 220px"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, fontWeight: 600, color: "#c9d1d9", fontFamily: '"JetBrains Mono", monospace' }, children: iface.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.25)" }, children: fmtBytes(iface.rxTotal + iface.txTotal) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)" }, children: "RX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "#34d399", fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }, children: fmtRate(iface.rxRate) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkline, { data: rxHistory, color: "#34d399", width: 180, height: 24 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)" }, children: "TX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: ACCENT, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }, children: fmtRate(iface.txRate) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkline, { data: txHistory, color: ACCENT, width: 180, height: 24 })
        ] })
      ]
    }
  );
}
function ConnectionsTab() {
  const [connections, setConnections] = reactExports.useState([]);
  const [stateFilter, setStateFilter] = reactExports.useState("all");
  const [loading, setLoading] = reactExports.useState(true);
  const intervalRef = reactExports.useRef(null);
  const load = reactExports.useCallback(async () => {
    try {
      const conns = await cryogram().netmon.getConnections();
      setConnections(conns);
      setLoading(false);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    load();
    intervalRef.current = setInterval(load, 3e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);
  const filtered = connections.filter(
    (c) => stateFilter === "all" || c.state.toUpperCase() === stateFilter
  );
  const stateColor = (s) => {
    const u = s.toUpperCase();
    if (u === "ESTABLISHED") return "#34d399";
    if (u === "LISTEN") return ACCENT;
    if (u.includes("WAIT")) return "#fbbf24";
    if (u === "CLOSE") return "#f87171";
    return "rgba(255,255,255,0.35)";
  };
  const protoColor = (p) => {
    if (p === "tcp") return ACCENT;
    if (p === "udp") return "#fbbf24";
    return "rgba(255,255,255,0.35)";
  };
  const uniqueStates = ["all", "ESTABLISHED", "LISTEN", "TIME_WAIT", "CLOSE_WAIT"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }, children: [
      uniqueStates.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setStateFilter(s),
          style: {
            padding: "3px 9px",
            borderRadius: 4,
            border: `1px solid ${stateFilter === s ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.06)"}`,
            background: stateFilter === s ? "rgba(0,212,255,0.1)" : "transparent",
            color: stateFilter === s ? ACCENT : "rgba(255,255,255,0.4)",
            fontSize: 10,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.04em"
          },
          children: s === "all" ? "All" : s
        },
        s
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)" }, children: [
        filtered.length,
        " connections"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.span,
      {
        style: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
        animate: { opacity: [0.3, 1, 0.3] },
        transition: { duration: 1.4, repeat: Infinity },
        children: "Loading connections…"
      }
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: { position: "sticky", top: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { background: "rgba(10,14,22,0.94)", borderBottom: "1px solid rgba(255,255,255,0.055)" }, children: ["Proto", "Local", "Remote", "State", "Process"].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: {
        padding: "6px 10px",
        textAlign: "left",
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        color: "rgba(255,255,255,0.35)"
      }, children: col }, col)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        filtered.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            style: { borderBottom: "1px solid rgba(255,255,255,0.025)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                fontSize: 10,
                fontWeight: 700,
                color: protoColor(c.protocol),
                fontFamily: '"JetBrains Mono", monospace',
                textTransform: "uppercase"
              }, children: c.protocol }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 10px", fontFamily: '"JetBrains Mono", monospace', color: "#c9d1d9", fontSize: 11 }, children: c.local }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 10px", fontFamily: '"JetBrains Mono", monospace', color: "rgba(255,255,255,0.5)", fontSize: 11 }, children: c.remote || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                fontSize: 10,
                fontWeight: 600,
                color: stateColor(c.state),
                fontFamily: '"JetBrains Mono", monospace'
              }, children: c.state }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 10px", color: "rgba(255,255,255,0.4)", fontSize: 11 }, children: c.process ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#c9d1d9" }, children: c.process }),
                c.pid && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.25)", marginLeft: 4 }, children: [
                  "(",
                  c.pid,
                  ")"
                ] })
              ] }) : "—" })
            ]
          },
          i
        )),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, style: { padding: "24px", textAlign: "center", color: "rgba(255,255,255,0.2)" }, children: "No connections match the filter" }) })
      ] })
    ] }) })
  ] });
}
function BandwidthTab() {
  const [interfaces, setInterfaces] = reactExports.useState(/* @__PURE__ */ new Map());
  const streamStarted = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (streamStarted.current) return;
    streamStarted.current = true;
    cryogram().netmon.startStream().catch(() => {
    });
    const { ipcRenderer } = window.require?.("electron") ?? {};
    const onStats = (_, data) => {
      setInterfaces((prev) => {
        const next = new Map(prev);
        for (const iface of data.interfaces) {
          const existing = next.get(iface.name);
          const history = existing?.history ?? [];
          const newHistory = [...history, { rx: iface.rxRate, tx: iface.txRate }].slice(-30);
          next.set(iface.name, {
            ...iface,
            history: newHistory
          });
        }
        return next;
      });
    };
    if (ipcRenderer) {
      ipcRenderer.on("netmon:stats", onStats);
      return () => {
        ipcRenderer.removeListener("netmon:stats", onStats);
        cryogram().netmon.stopStream().catch(() => {
        });
        streamStarted.current = false;
      };
    }
    return () => {
      cryogram().netmon.stopStream().catch(() => {
      });
      streamStarted.current = false;
    };
  }, []);
  const ifaceList = Array.from(interfaces.values()).sort((a, b) => a.name.localeCompare(b.name));
  const totalRx = ifaceList.reduce((s, i) => s + i.rxRate, 0);
  const totalTx = ifaceList.reduce((s, i) => s + i.txRate, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "8px 14px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      display: "flex",
      gap: 24,
      alignItems: "center",
      flexShrink: 0,
      background: "rgba(8,12,18,0.3)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)" }, children: "Total RX" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "#34d399", fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }, children: fmtRate(totalRx) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)" }, children: "Total TX" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: ACCENT, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }, children: fmtRate(totalTx) })
      ] }),
      ifaceList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.span,
        {
          style: { fontSize: 11, color: "rgba(255,255,255,0.25)", marginLeft: "auto" },
          animate: { opacity: [0.3, 1, 0.3] },
          transition: { duration: 1.4, repeat: Infinity },
          children: "Waiting for data…"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      flex: 1,
      overflowY: "auto",
      padding: "12px",
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      alignContent: "flex-start"
    }, children: ifaceList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", textAlign: "center", paddingTop: 40, fontSize: 12, color: "rgba(255,255,255,0.2)" }, children: "No network interfaces detected" }) : ifaceList.map((iface) => /* @__PURE__ */ jsxRuntimeExports.jsx(InterfaceCard, { iface }, iface.name)) })
  ] });
}
function NetworkMonitorApp() {
  const [tab, setTab] = reactExports.useState("bandwidth");
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.055)",
          background: "rgba(8,12,18,0.5)",
          flexShrink: 0
        }, children: ["bandwidth", "connections"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setTab(t),
            style: {
              position: "relative",
              padding: "9px 20px",
              fontSize: 12,
              fontWeight: 500,
              color: tab === t ? ACCENT : "rgba(255,255,255,0.4)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textTransform: "capitalize",
              letterSpacing: "0.02em"
            },
            children: [
              t === "bandwidth" ? "Bandwidth" : "Connections",
              tab === t && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  layoutId: "netmon-tab",
                  style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: ACCENT, borderRadius: "2px 2px 0 0" },
                  transition: { type: "spring", stiffness: 400, damping: 30 }
                }
              )
            ]
          },
          t
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 4 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -4 },
            transition: { duration: 0.13 },
            style: { display: "flex", flex: 1, overflow: "hidden", flexDirection: "column" },
            children: [
              tab === "bandwidth" && /* @__PURE__ */ jsxRuntimeExports.jsx(BandwidthTab, {}),
              tab === "connections" && /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectionsTab, {})
            ]
          },
          tab
        ) })
      ]
    }
  );
}
export {
  NetworkMonitorApp as default
};
