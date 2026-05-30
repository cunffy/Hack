import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-fqRzwrz8.js";
const SCAN_TYPES = [
  { id: "ping", label: "Quick Ping", desc: "Host discovery only (-sn)" },
  { id: "ports", label: "Port Scan", desc: "Open ports + versions (-sV)" },
  { id: "service", label: "Service Detection", desc: "Ports + scripts (-sV -sC)" },
  { id: "full", label: "Full Scan", desc: "OS + traceroute + all (-A)" }
];
function parseNmapLines(lines) {
  const hosts = [];
  let current = null;
  for (const raw of lines) {
    const line = raw.trim();
    const reportMatch = line.match(/^Nmap scan report for (.+)$/);
    if (reportMatch) {
      if (current) hosts.push(current);
      current = { host: reportMatch[1], status: "unknown", openPorts: [], services: [] };
      continue;
    }
    if (!current) continue;
    if (/^Host is up/.test(line)) {
      current.status = "up";
      continue;
    }
    if (/^Host seems down/.test(line)) {
      current.status = "down";
      continue;
    }
    const portMatch = line.match(/^(\d+)\/(tcp|udp)\s+(open|filtered|closed)\s+(\S+)(?:\s+(.+))?$/);
    if (portMatch) {
      const [, port, proto, state, service, version] = portMatch;
      if (state === "open") {
        current.openPorts.push(`${port}/${proto}`);
        const svc = version ? `${service} (${version.trim()})` : service;
        current.services.push(svc);
      }
      continue;
    }
    if (/latency/.test(line)) {
      current.status = "up";
    }
  }
  if (current) hosts.push(current);
  return hosts;
}
function elapsed(ms) {
  if (ms < 1e3) return `${ms}ms`;
  if (ms < 6e4) return `${(ms / 1e3).toFixed(1)}s`;
  const m = Math.floor(ms / 6e4);
  const s = Math.floor(ms % 6e4 / 1e3);
  return `${m}m ${s}s`;
}
function formatTimestamp(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function LogLine({ text }) {
  const isPort = /^\d+\/tcp|^\d+\/udp/.test(text.trim());
  const isReport = /^Nmap scan report/.test(text.trim());
  const isStatus = /^Host is/.test(text.trim());
  const isNmapMeta = /^Starting Nmap|^Nmap done/.test(text.trim());
  let color = "rgba(140,160,180,0.75)";
  if (isPort) color = "var(--cryo-accent)";
  if (isReport) color = "#e0e8f0";
  if (isStatus) color = "rgba(0,255,136,0.8)";
  if (isNmapMeta) color = "rgba(200,180,100,0.7)";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 11,
    color,
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all"
  }, children: text });
}
function NetworkScannerApp() {
  const [nmapAvailable, setNmapAvailable] = reactExports.useState(null);
  const [target, setTarget] = reactExports.useState("");
  const [scanType, setScanType] = reactExports.useState("ports");
  const [portRange, setPortRange] = reactExports.useState("");
  const [scanning, setScanning] = reactExports.useState(false);
  const [logLines, setLogLines] = reactExports.useState([]);
  const [currentHosts, setCurrentHosts] = reactExports.useState([]);
  const [history, setHistory] = reactExports.useState([]);
  const [selectedHistory, setSelectedHistory] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("log");
  const [copied, setCopied] = reactExports.useState(false);
  const logRef = reactExports.useRef(null);
  const scanIdRef = reactExports.useRef(null);
  const startedRef = reactExports.useRef(0);
  const cleanupRef = reactExports.useRef(null);
  const linesRef = reactExports.useRef([]);
  reactExports.useEffect(() => {
    window.cryogram.scanner.check().then((res) => setNmapAvailable(res.available)).catch(() => setNmapAvailable(false));
  }, []);
  reactExports.useEffect(() => {
    const cleanup = window.cryogram.scanner.onProgress((line) => {
      linesRef.current = [...linesRef.current, line];
      setLogLines((prev) => [...prev, line]);
      setCurrentHosts(parseNmapLines(linesRef.current));
    });
    cleanupRef.current = cleanup;
    return cleanup;
  }, []);
  reactExports.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logLines]);
  const startScan = reactExports.useCallback(async () => {
    if (!target.trim()) {
      setError("Enter a target IP, range, or hostname");
      return;
    }
    setError(null);
    setScanning(true);
    setLogLines([]);
    setCurrentHosts([]);
    linesRef.current = [];
    setTab("log");
    startedRef.current = Date.now();
    scanIdRef.current = `scan_${Date.now()}`;
    try {
      await window.cryogram.scanner.run(target.trim(), scanType, portRange.trim() || void 0);
      const finalHosts = parseNmapLines(linesRef.current);
      setCurrentHosts(finalHosts);
      setTab("results");
      const result = {
        id: scanIdRef.current,
        target: target.trim(),
        type: scanType,
        portRange: portRange.trim(),
        startedAt: startedRef.current,
        finishedAt: Date.now(),
        hosts: finalHosts,
        rawLines: [...linesRef.current]
      };
      setHistory((prev) => [result, ...prev].slice(0, 5));
      setSelectedHistory(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }, [target, scanType, portRange]);
  const cancelScan = reactExports.useCallback(() => {
    window.cryogram.scanner.cancel();
    setScanning(false);
  }, []);
  const exportResults = reactExports.useCallback(() => {
    const active = selectedHistory ? history.find((h) => h.id === selectedHistory) : null;
    const lines = active ? active.rawLines : logLines;
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [selectedHistory, history, logLines]);
  const displayHosts = (() => {
    if (selectedHistory) {
      return history.find((h) => h.id === selectedHistory)?.hosts ?? currentHosts;
    }
    return currentHosts;
  })();
  const displayLines = (() => {
    if (selectedHistory) {
      return history.find((h) => h.id === selectedHistory)?.rawLines ?? logLines;
    }
    return logLines;
  })();
  if (nmapAvailable === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col flex-1 items-center justify-center gap-5 p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        style: {
          background: "rgba(8,12,20,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "32px 40px",
          textAlign: "center",
          maxWidth: 480
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 16 }, children: "📡" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 600, color: "#e0e8f0", marginBottom: 8 }, children: "nmap not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(140,160,180,0.8)", marginBottom: 20, lineHeight: 1.6 }, children: "The network scanner requires nmap to be installed on this system." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12,
            background: "rgba(0,212,255,0.06)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: 6,
            padding: "10px 16px",
            color: "var(--cryo-accent)"
          }, children: "sudo apt install nmap" })
        ]
      }
    ) });
  }
  if (nmapAvailable === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.span,
      {
        style: { fontSize: 12, color: "rgba(140,160,180,0.6)", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' },
        animate: { opacity: [0.4, 1, 0.4] },
        transition: { duration: 1.5, repeat: Infinity },
        children: "Checking for nmap…"
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col flex-1 overflow-hidden",
      style: { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 p-4 flex flex-col gap-3",
            style: { borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(8,12,20,0.6)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.7)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }, children: "Target" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: target,
                      onChange: (e) => setTarget(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && !scanning && startScan(),
                      placeholder: "192.168.1.1 · 192.168.1.0/24 · hostname",
                      disabled: scanning,
                      style: {
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 6,
                        padding: "7px 10px",
                        color: "#e0e8f0",
                        fontSize: 13,
                        fontFamily: '"JetBrains Mono", monospace',
                        outline: "none"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 180 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.7)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }, children: "Scan Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: scanType,
                      onChange: (e) => setScanType(e.target.value),
                      disabled: scanning,
                      style: {
                        width: "100%",
                        background: "rgba(8,12,20,0.9)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 6,
                        padding: "7px 10px",
                        color: "#e0e8f0",
                        fontSize: 12,
                        outline: "none"
                      },
                      children: SCAN_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.id, children: t.label }, t.id))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 130 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.7)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }, children: "Port Range" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: portRange,
                      onChange: (e) => setPortRange(e.target.value),
                      placeholder: "1-1000",
                      disabled: scanning || scanType === "ping",
                      style: {
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 6,
                        padding: "7px 10px",
                        color: "#e0e8f0",
                        fontSize: 12,
                        fontFamily: '"JetBrains Mono", monospace',
                        outline: "none",
                        opacity: scanType === "ping" ? 0.4 : 1
                      }
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    whileHover: !scanning ? { scale: 1.02 } : {},
                    whileTap: !scanning ? { scale: 0.97 } : {},
                    onClick: scanning ? cancelScan : startScan,
                    style: {
                      padding: "7px 20px",
                      background: scanning ? "rgba(255,68,102,0.15)" : "rgba(0,212,255,0.12)",
                      border: `1px solid ${scanning ? "rgba(255,68,102,0.4)" : "rgba(0,212,255,0.3)"}`,
                      borderRadius: 6,
                      color: scanning ? "#ff4466" : "var(--cryo-accent)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: "0.03em"
                    },
                    children: scanning ? "Cancel Scan" : "Start Scan"
                  }
                ),
                (displayHosts.length > 0 || displayLines.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.97 },
                    onClick: exportResults,
                    style: {
                      padding: "7px 14px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 6,
                      color: copied ? "rgba(0,255,136,0.8)" : "rgba(140,160,180,0.8)",
                      fontSize: 11,
                      cursor: "pointer"
                    },
                    children: copied ? "Copied!" : "Export"
                  }
                ),
                scanning && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    className: "flex items-center gap-2",
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.div,
                        {
                          style: { width: 6, height: 6, borderRadius: "50%", background: "var(--cryo-accent)" },
                          animate: { opacity: [1, 0.2, 1] },
                          transition: { duration: 0.9, repeat: Infinity }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(0,212,255,0.7)" }, children: "Scanning…" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(100,120,140,0.6)", marginLeft: "auto" }, children: SCAN_TYPES.find((t) => t.id === scanType)?.desc })
              ] }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#ff4466", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 5, padding: "6px 10px" }, children: error })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
          history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                width: 200,
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(8,12,20,0.4)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(140,160,180,0.5)", padding: "10px 12px 6px", textTransform: "uppercase", letterSpacing: "0.08em" }, children: "History" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowY: "auto", flex: 1 }, children: history.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => {
                      setSelectedHistory(h.id);
                      setTab("results");
                    },
                    style: {
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      background: selectedHistory === h.id ? "rgba(0,212,255,0.07)" : "transparent",
                      borderLeft: selectedHistory === h.id ? "2px solid var(--cryo-accent)" : "2px solid transparent",
                      cursor: "pointer",
                      borderTop: "none",
                      borderRight: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.04)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: selectedHistory === h.id ? "var(--cryo-accent)" : "#c9d1d9", fontFamily: '"JetBrains Mono", monospace', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: h.target }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(140,160,180,0.5)", marginTop: 2 }, children: [
                        SCAN_TYPES.find((t) => t.id === h.type)?.label,
                        " · ",
                        formatTimestamp(h.startedAt)
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(0,255,136,0.6)", marginTop: 1 }, children: [
                        h.hosts.filter((x) => x.status === "up").length,
                        " host",
                        h.hosts.filter((x) => x.status === "up").length !== 1 ? "s" : "",
                        " up"
                      ] })
                    ]
                  },
                  h.id
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,12,20,0.3)" }, children: ["log", "results"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setTab(t),
                style: {
                  position: "relative",
                  padding: "8px 18px",
                  fontSize: 11,
                  fontWeight: 500,
                  color: tab === t ? "var(--cryo-accent)" : "rgba(140,160,180,0.6)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textTransform: "capitalize"
                },
                children: [
                  t === "results" ? `Results${displayHosts.length > 0 ? ` (${displayHosts.length})` : ""}` : "Live Log",
                  tab === t && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      layoutId: "scanner-tab",
                      style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "var(--cryo-accent)" },
                      transition: { type: "spring", stiffness: 400, damping: 30 }
                    }
                  )
                ]
              },
              t
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "flex-1 overflow-hidden",
                initial: { opacity: 0, y: 4 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -4 },
                transition: { duration: 0.14 },
                style: { display: "flex", flexDirection: "column" },
                children: tab === "log" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    ref: logRef,
                    style: {
                      flex: 1,
                      overflowY: "auto",
                      padding: "12px 14px",
                      background: "rgba(4,8,14,0.7)"
                    },
                    children: displayLines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(100,120,140,0.4)", fontFamily: '"JetBrains Mono", monospace', paddingTop: 8 }, children: scanning ? "Waiting for output…" : "Run a scan to see output here" }) : displayLines.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(LogLine, { text: line }, i))
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto" }, children: [
                  displayHosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "20px 16px", fontSize: 11, color: "rgba(100,120,140,0.4)", fontFamily: '"JetBrains Mono", monospace' }, children: "No results yet — run a scan first" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { borderBottom: "1px solid rgba(255,255,255,0.06)" }, children: ["Host", "Status", "Open Ports", "Services"].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: {
                      textAlign: "left",
                      padding: "8px 14px",
                      fontSize: 10,
                      color: "rgba(140,160,180,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      fontWeight: 600,
                      background: "rgba(8,12,20,0.5)"
                    }, children: col }, col)) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: displayHosts.map((host, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.tr,
                      {
                        initial: { opacity: 0, x: -6 },
                        animate: { opacity: 1, x: 0 },
                        transition: { delay: i * 0.03 },
                        style: { borderBottom: "1px solid rgba(255,255,255,0.04)" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "9px 14px", fontFamily: '"JetBrains Mono", monospace', color: "#e0e8f0", fontSize: 12 }, children: host.host }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "9px 14px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: 4,
                            background: host.status === "up" ? "rgba(0,255,136,0.1)" : host.status === "down" ? "rgba(255,68,102,0.1)" : "rgba(255,255,255,0.05)",
                            color: host.status === "up" ? "rgba(0,255,136,0.9)" : host.status === "down" ? "#ff4466" : "rgba(140,160,180,0.6)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                          }, children: host.status }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "9px 14px", fontFamily: '"JetBrains Mono", monospace', color: "var(--cryo-accent)", fontSize: 11 }, children: host.openPorts.length > 0 ? host.openPorts.join(", ") : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(100,120,140,0.4)" }, children: "—" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "9px 14px", color: "rgba(180,200,220,0.7)", fontSize: 11, maxWidth: 300 }, children: host.services.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 1 }, children: host.services.map((s, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: s }, j)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(100,120,140,0.4)" }, children: "—" }) })
                        ]
                      },
                      `${host.host}-${i}`
                    )) })
                  ] }),
                  displayHosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 14px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 10, color: "rgba(100,120,140,0.5)", display: "flex", gap: 16 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      displayHosts.length,
                      " host",
                      displayHosts.length !== 1 ? "s" : "",
                      " scanned"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(0,255,136,0.6)" }, children: [
                      displayHosts.filter((h) => h.status === "up").length,
                      " up"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      displayHosts.reduce((s, h) => s + h.openPorts.length, 0),
                      " open ports"
                    ] }),
                    (() => {
                      const h = history.find((x) => x.id === selectedHistory);
                      if (!h?.finishedAt) return null;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "Duration: ",
                        elapsed(h.finishedAt - h.startedAt)
                      ] });
                    })()
                  ] })
                ] })
              },
              tab
            ) })
          ] })
        ] })
      ]
    }
  );
}
export {
  NetworkScannerApp as default
};
