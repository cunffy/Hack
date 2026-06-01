import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-BDc1ClbM.js";
const ACCENT = "#a855f7";
const cryogram = () => window.cryogram;
const LEVEL_STYLES = {
  emerg: { bg: "rgba(248,113,113,0.2)", color: "#f87171", label: "EMERG" },
  alert: { bg: "rgba(248,113,113,0.15)", color: "#fca5a5", label: "ALERT" },
  crit: { bg: "rgba(248,113,113,0.12)", color: "#f87171", label: "CRIT" },
  err: { bg: "rgba(248,113,113,0.1)", color: "#f87171", label: "ERR" },
  warning: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", label: "WARN" },
  notice: { bg: "rgba(99,102,241,0.1)", color: "#818cf8", label: "NOTICE" },
  info: { bg: "rgba(34,211,238,0.1)", color: "#22d3ee", label: "INFO" },
  debug: { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", label: "DBG" }
};
function levelStyle(level) {
  return LEVEL_STYLES[level] ?? LEVEL_STYLES.info;
}
function ToolSelect({
  value,
  onChange,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "select",
    {
      value,
      onChange: (e) => onChange(e.target.value),
      style: {
        background: "rgba(8,12,18,0.8)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 5,
        padding: "4px 8px",
        color: "#c9d1d9",
        fontSize: 11,
        outline: "none",
        cursor: "pointer"
      },
      children
    }
  );
}
function LogRow({ line, expanded, onClick }) {
  const lvlStyle = levelStyle(line.level);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick,
      style: {
        padding: "3px 10px",
        cursor: "pointer",
        background: expanded ? "rgba(168,85,247,0.06)" : "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.025)",
        transition: "background 0.1s"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 7, flexWrap: "nowrap", overflow: "hidden" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            fontSize: 9,
            fontWeight: 700,
            padding: "1px 5px",
            borderRadius: 3,
            background: lvlStyle.bg,
            color: lvlStyle.color,
            flexShrink: 0,
            letterSpacing: "0.05em",
            fontFamily: '"JetBrains Mono", monospace'
          }, children: lvlStyle.label }),
          line.timestamp && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.25)", flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }, children: line.timestamp }),
          line.unit && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: ACCENT, opacity: 0.7, flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }, children: line.unit }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            fontSize: 11,
            color: lvlStyle.color === "#f87171" ? "#fca5a5" : "#c9d1d9",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: '"JetBrains Mono", monospace',
            flex: 1,
            minWidth: 0
          }, children: line.message || line.raw })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.14 },
            style: { overflow: "hidden" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              marginTop: 4,
              padding: "6px 8px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 4,
              fontSize: 10,
              color: "rgba(255,255,255,0.5)",
              fontFamily: '"JetBrains Mono", monospace',
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              lineHeight: 1.6
            }, children: line.raw })
          }
        ) })
      ]
    }
  );
}
function LogViewerApp() {
  const [units, setUnits] = reactExports.useState(["all"]);
  const [unit, setUnit] = reactExports.useState("all");
  const [lineCount, setLineCount] = reactExports.useState(100);
  const [priority, setPriority] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [liveTail, setLiveTail] = reactExports.useState(false);
  const [lines, setLines] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [expandedIdx, setExpandedIdx] = reactExports.useState(null);
  const listRef = reactExports.useRef(null);
  const userScrolledUp = reactExports.useRef(false);
  const liveCleanupRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    cryogram().logs.getUnits().then((u) => setUnits(u)).catch(() => {
    });
  }, []);
  const query = reactExports.useCallback(async () => {
    if (liveTail) return;
    setLoading(true);
    setExpandedIdx(null);
    try {
      const result = await cryogram().logs.query({
        unit,
        lines: lineCount,
        priority: priority === "all" ? void 0 : priority,
        search: search || void 0
      });
      setLines(result.lines);
    } catch {
    }
    setLoading(false);
  }, [unit, lineCount, priority, search, liveTail]);
  reactExports.useEffect(() => {
    query();
  }, [query]);
  reactExports.useEffect(() => {
    if (liveTail) {
      setLines([]);
      userScrolledUp.current = false;
      cryogram().logs.stream({ unit }).catch(() => {
      });
      const listener = (_, line) => {
        setLines((prev) => [...prev.slice(-2e3), line]);
      };
      const { ipcRenderer } = window.require?.("electron") ?? {};
      if (ipcRenderer) {
        ipcRenderer.on("logs:line", listener);
        liveCleanupRef.current = () => ipcRenderer.removeListener("logs:line", listener);
      } else {
        const cleanup = window.cryogram?.logs?.onLine?.((line) => {
          setLines((prev) => [...prev.slice(-2e3), line]);
        });
        liveCleanupRef.current = cleanup ?? null;
      }
    } else {
      cryogram().logs.stopStream().catch(() => {
      });
      liveCleanupRef.current?.();
      liveCleanupRef.current = null;
    }
    return () => {
      cryogram().logs.stopStream().catch(() => {
      });
      liveCleanupRef.current?.();
      liveCleanupRef.current = null;
    };
  }, [liveTail, unit]);
  reactExports.useEffect(() => {
    if (!liveTail || userScrolledUp.current) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, liveTail]);
  const handleListScroll = () => {
    const el = listRef.current;
    if (!el || !liveTail) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    userScrolledUp.current = !isAtBottom;
  };
  const clearLogs = () => {
    setLines([]);
    setExpandedIdx(null);
  };
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
              padding: "8px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.055)",
              background: "rgba(8,12,18,0.5)",
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ToolSelect, { value: unit, onChange: (v) => {
                setUnit(v);
                setExpandedIdx(null);
              }, children: units.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: u, children: u }, u)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(ToolSelect, { value: String(lineCount), onChange: (v) => setLineCount(Number(v)), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "100", children: "100 lines" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "500", children: "500 lines" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "1000", children: "1000 lines" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(ToolSelect, { value: priority, onChange: (v) => setPriority(v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All levels" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "err", children: "Errors" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "warning", children: "Warnings+" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "notice", children: "Notice+" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "info", children: "Info+" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "debug", children: "Debug" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search…",
                  style: {
                    flex: 1,
                    minWidth: 100,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 5,
                    padding: "4px 9px",
                    color: "#c9d1d9",
                    fontSize: 11,
                    outline: "none"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  whileTap: { scale: 0.93 },
                  onClick: () => setLiveTail((l) => !l),
                  style: {
                    padding: "4px 10px",
                    background: liveTail ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${liveTail ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 5,
                    color: liveTail ? ACCENT : "rgba(255,255,255,0.5)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    flexShrink: 0
                  },
                  children: [
                    liveTail && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.span,
                      {
                        style: { width: 6, height: 6, borderRadius: "50%", background: ACCENT, display: "inline-block" },
                        animate: { opacity: [1, 0.2, 1] },
                        transition: { duration: 0.8, repeat: Infinity }
                      }
                    ),
                    "Live"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: clearLogs,
                  style: {
                    padding: "4px 8px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 5,
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 11,
                    cursor: "pointer",
                    flexShrink: 0
                  },
                  children: "Clear"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.2)", flexShrink: 0 }, children: [
                lines.length,
                " lines"
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
            children: "Loading logs…"
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: listRef,
            onScroll: handleListScroll,
            style: { flex: 1, overflowY: "auto", paddingBottom: 8 },
            children: lines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "28px", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)" }, children: liveTail ? "Waiting for log entries…" : "No log entries found" }) : lines.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              LogRow,
              {
                line,
                expanded: expandedIdx === i,
                onClick: () => setExpandedIdx(expandedIdx === i ? null : i)
              },
              i
            ))
          }
        )
      ]
    }
  );
}
export {
  LogViewerApp as default
};
