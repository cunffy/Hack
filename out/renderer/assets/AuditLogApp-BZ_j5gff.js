import { r as reactExports, j as jsxRuntimeExports } from "./index-Cju5vuNp.js";
const s = {
  root: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14 },
  topBar: { display: "flex", gap: 8, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", alignItems: "center" },
  input: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 10px", color: "rgba(255,255,255,0.85)", fontSize: 12, outline: "none" },
  btn: (c, t = "#000") => ({ padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: c, color: t }),
  body: { flex: 1, overflow: "auto" },
  row: (type) => {
    const c = { security: "rgba(239,68,68,0.1)", warning: "rgba(234,179,8,0.1)", info: "rgba(0,212,255,0.06)", success: "rgba(34,197,94,0.08)" };
    return { padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 12, alignItems: "flex-start", background: c[type] || "transparent" };
  },
  dot: (type) => {
    const c = { security: "#ef4444", warning: "#eab308", info: "var(--cryo-accent,#00d4ff)", success: "#4ade80" };
    return { width: 8, height: 8, borderRadius: "50%", background: c[type] || "#6b7280", flexShrink: 0, marginTop: 4 };
  }
};
const FILTERS = ["All", "security", "warning", "info", "success"];
const CATEGORIES = ["All", "Auth", "File", "Network", "App", "System"];
function AuditLogApp() {
  const [entries, setEntries] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("All");
  const [category, setCategory] = reactExports.useState("All");
  const [search, setSearch] = reactExports.useState("");
  const [expanded, setExpanded] = reactExports.useState(null);
  reactExports.useEffect(() => {
    loadEntries();
  }, []);
  async function loadEntries() {
    try {
      const data = await window.cryogram?.auditLog?.list();
      if (data) setEntries(data);
    } catch {
    }
  }
  async function clearLog() {
    if (!confirm("Clear all audit log entries?")) return;
    await window.cryogram?.auditLog?.clear();
    setEntries([]);
  }
  const visible = entries.filter(
    (e) => (filter === "All" || e.type === filter) && (category === "All" || e.category === category) && (!search || e.message.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()))
  );
  const counts = { security: 0, warning: 0, info: 0, success: 0 };
  entries.forEach((e) => {
    if (e.type in counts) counts[e.type]++;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.topBar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, fontSize: 14 }, children: "Activity & Audit Log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { ...s.input, width: 200 }, placeholder: "Search…", value: search, onChange: (e) => setSearch(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { style: { ...s.input, width: 90 }, value: filter, onChange: (e) => setFilter(e.target.value), children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: f }, f)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { style: { ...s.input, width: 100 }, value: category, onChange: (e) => setCategory(e.target.value), children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.07)", "rgba(255,255,255,0.6)"), onClick: loadEntries, children: "Refresh" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { ...s.btn("rgba(239,68,68,0.1)", "#ef4444"), marginLeft: "auto" }, onClick: clearLog, children: "Clear Log" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 16 }, children: [
      Object.entries(counts).map(([type, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.dot(type) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }, children: type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700 }, children: count })
      ] }, type)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.4)" }, children: [
        visible.length,
        " entries"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.body, children: [
      visible.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.3)", marginTop: 60 }, children: "No log entries found" }),
      visible.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.row(e.type), onClick: () => setExpanded(expanded === e.id ? null : e.id), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.dot(e.type) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: "rgba(255,255,255,0.4)", flexShrink: 0 }, children: e.ts }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }, children: e.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13 }, children: e.message }),
            e.user && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: [
              "by ",
              e.user
            ] })
          ] }),
          expanded === e.id && e.details && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 6, fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: "rgba(255,255,255,0.6)", background: "rgba(0,0,0,0.2)", borderRadius: 4, padding: 8 }, children: e.details })
        ] }),
        e.details && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)" }, children: expanded === e.id ? "▲" : "▼" })
      ] }, e.id))
    ] })
  ] });
}
export {
  AuditLogApp as default
};
