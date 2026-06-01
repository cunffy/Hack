import { r as reactExports, j as jsxRuntimeExports } from "./index-DQeT4wwp.js";
const ipc = window.cryogram?.db;
function DatabaseApp() {
  const [sessionId, setSessionId] = reactExports.useState(null);
  const [pathInput, setPathInput] = reactExports.useState("");
  const [tables, setTables] = reactExports.useState([]);
  const [selectedTable, setSelectedTable] = reactExports.useState(null);
  const [rowCount, setRowCount] = reactExports.useState(0);
  const [rows, setRows] = reactExports.useState([]);
  const [columns, setColumns] = reactExports.useState([]);
  const [page, setPage] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [sql, setSql] = reactExports.useState("");
  const [queryResult, setQueryResult] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("browse");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const PAGE_SIZE = 100;
  const openDb = async () => {
    const path = pathInput.trim();
    if (!path || !ipc) return;
    setLoading(true);
    setError("");
    try {
      const res = await ipc.open(path);
      if (res.error) {
        setError(res.error);
        return;
      }
      setSessionId(res.sessionId);
      const t = await ipc.listTables(res.sessionId);
      setTables(t);
      setSelectedTable(null);
      setRows([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const closeDb = async () => {
    if (sessionId && ipc) await ipc.close(sessionId);
    setSessionId(null);
    setTables([]);
    setSelectedTable(null);
    setRows([]);
  };
  const selectTable = async (name) => {
    if (!sessionId || !ipc) return;
    setSelectedTable(name);
    setLoading(true);
    try {
      const rc = await ipc.getTableRowCount(sessionId, name);
      setRowCount(rc);
      const res = await ipc.query(sessionId, `SELECT * FROM "${name}"`, 0, PAGE_SIZE);
      setRows(res.rows);
      setColumns(res.columns);
      setTotal(res.total);
      setPage(0);
    } finally {
      setLoading(false);
    }
  };
  const loadRows = async (pg) => {
    if (!sessionId || !ipc || !selectedTable) return;
    const res = await ipc.query(sessionId, `SELECT * FROM "${selectedTable}"`, pg, PAGE_SIZE);
    setRows(res.rows);
    setColumns(res.columns);
    setPage(pg);
  };
  const runQuery = async () => {
    if (!sessionId || !ipc || !sql.trim()) return;
    setLoading(true);
    try {
      setQueryResult(await ipc.query(sessionId, sql));
    } finally {
      setLoading(false);
    }
  };
  const fmt = (v) => {
    if (v === null || v === void 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.2)", fontStyle: "italic" }, children: "NULL" });
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };
  if (!sessionId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, background: "rgba(8,12,20,0.8)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36 }, children: "🗄️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.85)" }, children: "SQLite Browser" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, width: 440 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: pathInput,
            onChange: (e) => setPathInput(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && openDb(),
            placeholder: "/path/to/database.db",
            style: { flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#fff", fontFamily: "monospace", fontSize: 13 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: openDb, disabled: loading, style: { padding: "8px 18px", background: "var(--cryo-accent)", color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }, children: loading ? "…" : "Open" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#f87171", fontSize: 12, maxWidth: 440, textAlign: "center" }, children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.25)" }, children: "Opens SQLite databases in read-only mode" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", height: "100%", background: "rgba(8,12,20,0.8)", fontFamily: "-apple-system,sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 200, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)" }, children: "TABLES" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: closeDb, style: { fontSize: 10, padding: "2px 6px", background: "rgba(248,113,113,0.15)", border: "none", borderRadius: 4, color: "#f87171", cursor: "pointer" }, children: "Close" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: "6px 8px" }, children: tables.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => selectTable(t.name),
          style: {
            width: "100%",
            textAlign: "left",
            padding: "6px 8px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: selectedTable === t.name ? "rgba(0,212,255,0.12)" : "transparent",
            color: selectedTable === t.name ? "var(--cryo-accent)" : "rgba(255,255,255,0.65)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: t.type === "view" ? "👁" : "📋" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t.name })
          ]
        },
        t.name
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 14px", alignItems: "center" }, children: [
        ["browse", "query"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setTab(t),
            style: {
              padding: "9px 16px",
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: "transparent",
              textTransform: "capitalize",
              color: tab === t ? "var(--cryo-accent)" : "rgba(255,255,255,0.4)",
              borderBottom: tab === t ? "2px solid var(--cryo-accent)" : "2px solid transparent",
              marginBottom: -1
            },
            children: t
          },
          t
        )),
        selectedTable && tab === "browse" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "rgba(255,255,255,0.35)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            selectedTable,
            " · ",
            rowCount.toLocaleString(),
            " rows"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => page > 0 && loadRows(page - 1), disabled: page === 0, style: { padding: "2px 8px", background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 4, color: "rgba(255,255,255,0.5)", cursor: "pointer" }, children: "‹" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            page * PAGE_SIZE + 1,
            "–",
            Math.min((page + 1) * PAGE_SIZE, total)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => (page + 1) * PAGE_SIZE < total && loadRows(page + 1), style: { padding: "2px 8px", background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 4, color: "rgba(255,255,255,0.5)", cursor: "pointer" }, children: "›" })
        ] })
      ] }),
      tab === "browse" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflow: "auto" }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.3)" }, children: "Loading…" }) : !selectedTable ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.2)", fontSize: 13 }, children: "Select a table" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.2)" }, children: "No rows" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "JetBrains Mono,monospace" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "left", padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", color: "var(--cryo-accent)", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap", position: "sticky", top: 0 }, children: c }, c)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "6px 12px", color: "rgba(255,255,255,0.72)", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: fmt(row[c]) }, c)) }, ri)) })
      ] }) }),
      tab === "query" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: 14, gap: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: sql,
              onChange: (e) => setSql(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) runQuery();
              },
              placeholder: "SELECT * FROM table_name LIMIT 100",
              rows: 4,
              style: { flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 12, fontFamily: "JetBrains Mono,monospace", resize: "none" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: runQuery, disabled: loading, style: { padding: "8px 18px", background: "var(--cryo-accent)", color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", alignSelf: "flex-start", whiteSpace: "nowrap" }, children: loading ? "…" : "Run (⌘↵)" })
        ] }),
        queryResult && (queryResult.error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#f87171", fontSize: 12, fontFamily: "monospace", background: "rgba(248,113,113,0.08)", padding: 10, borderRadius: 8 }, children: queryResult.error }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8 }, children: [
            queryResult.rows.length,
            " row",
            queryResult.rows.length !== 1 ? "s" : ""
          ] }),
          queryResult.rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "JetBrains Mono,monospace" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: queryResult.columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "left", padding: "7px 10px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", color: "var(--cryo-accent)", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", position: "sticky", top: 0 }, children: c }, c)) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: queryResult.rows.map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: queryResult.columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 10px", color: "rgba(255,255,255,0.72)", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: fmt(row[c]) }, c)) }, ri)) })
          ] })
        ] }))
      ] })
    ] })
  ] });
}
export {
  DatabaseApp as default
};
