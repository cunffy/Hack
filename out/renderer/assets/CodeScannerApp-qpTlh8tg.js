import { r as reactExports, j as jsxRuntimeExports } from "./index-Cju5vuNp.js";
const s = {
  root: { display: "flex", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14 },
  sidebar: { width: 280, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", padding: 14 },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topBar: { padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8, alignItems: "center" },
  btn: (c, t = "#000", d = false) => ({ padding: "6px 16px", borderRadius: 6, border: "none", cursor: d ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600, background: d ? "rgba(255,255,255,0.05)" : c, color: d ? "rgba(255,255,255,0.3)" : t, opacity: d ? 0.6 : 1 }),
  input: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 10px", color: "rgba(255,255,255,0.85)", fontSize: 12, outline: "none", boxSizing: "border-box" },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 12, marginBottom: 8, cursor: "pointer" },
  sev: (s2) => {
    const c = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#eab308", LOW: "#22c55e", INFO: "#00d4ff" };
    return { display: "inline-block", padding: "1px 7px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: `${c[s2] || "#6b7280"}22`, color: c[s2] || "#6b7280", marginRight: 6 };
  },
  progress: { height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" },
  bar: (p) => ({ height: "100%", width: `${p}%`, background: "var(--cryo-accent,#00d4ff)", transition: "width 0.3s" })
};
const SCANNERS = ["Auto-detect", "semgrep", "bandit (Python)", "npm audit", "eslint-security", "Pattern-based"];
function CodeScannerApp() {
  const [path, setPath] = reactExports.useState("");
  const [scanner, setScanner] = reactExports.useState("Auto-detect");
  const [scanning, setScanning] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [result, setResult] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("All");
  async function browse() {
    try {
      const p = await window.cryogram?.codeScanner?.browse();
      if (p) setPath(p);
    } catch {
    }
  }
  async function scan() {
    if (!path) return;
    setScanning(true);
    setProgress(0);
    setResult(null);
    setSelected(null);
    try {
      const progressCleanup = window.cryogram?.codeScanner?.onProgress?.((pct) => setProgress(pct));
      const res = await window.cryogram?.codeScanner?.scan(path, scanner);
      progressCleanup?.();
      if (res) setResult(res);
    } finally {
      setScanning(false);
      setProgress(100);
    }
  }
  const findings = result?.findings || [];
  const filtered = filter === "All" ? findings : findings.filter((f) => f.severity === filter);
  const counts = {};
  findings.forEach((f) => {
    counts[f.severity] = (counts[f.severity] || 0) + 1;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.sidebar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 14, marginBottom: 14 }, children: "Code Scanner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }, children: "TARGET PATH" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginBottom: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: s.input, placeholder: "/path/to/project", value: path, onChange: (e) => setPath(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.08)", "rgba(255,255,255,0.7)"), onClick: browse, children: "…" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }, children: "SCANNER" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { style: { ...s.input, marginBottom: 16 }, value: scanner, onChange: (e) => setScanner(e.target.value), children: SCANNERS.map((s2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: s2 }, s2)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn(scanning ? "rgba(255,255,255,0.05)" : "var(--cryo-accent,#00d4ff)", scanning ? "rgba(255,255,255,0.3)" : "#000", scanning || !path), onClick: scan, disabled: scanning || !path, children: scanning ? "🔍 Scanning…" : "🔍 Scan for Vulnerabilities" }),
      scanning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.progress, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.bar(progress) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }, children: "Analyzing code…" })
      ] }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 16 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }, children: "RESULTS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, marginBottom: 4 }, children: [
          "Scanner: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--cryo-accent,#00d4ff)" }, children: result.scanner })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, marginBottom: 4 }, children: [
          "Scanned: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.7)" }, children: [
            result.scanned,
            " files"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, marginBottom: 12 }, children: [
          "Duration: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.7)" }, children: [
            result.duration,
            "ms"
          ] })
        ] }),
        ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"].filter((s2) => counts[s2]).map((sev) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: s.sev(sev), children: sev }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: `${counts[sev] / findings.length * 100}%`, background: sev === "CRITICAL" ? "#ef4444" : sev === "HIGH" ? "#f97316" : sev === "MEDIUM" ? "#eab308" : "#22c55e" } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 700 }, children: counts[sev] })
        ] }, sev))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "auto", fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }, children: "Scans for OWASP Top 10, injection flaws, hardcoded secrets, insecure deps, and more." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.main, children: [
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.topBar, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 600 }, children: [
          findings.length,
          " findings"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4, marginLeft: 12 }, children: ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { style: s.btn(filter === f ? "var(--cryo-accent,#00d4ff)" : "rgba(255,255,255,0.07)", filter === f ? "#000" : "rgba(255,255,255,0.6)"), onClick: () => setFilter(f), children: [
          f,
          f !== "All" && counts[f] ? ` (${counts[f]})` : ""
        ] }, f)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto", padding: 14 }, children: [
        !result && !scanning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.3)", marginTop: 80 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 16 }, children: "🔐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 600, marginBottom: 8 }, children: "Vulnerability Scanner" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13 }, children: "Select a project directory and run a scan to find security issues" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.2)" }, children: [
            "Detects: SQL injection, XSS, hardcoded secrets,",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "insecure dependencies, OWASP Top 10, and more"
          ] })
        ] }),
        filtered.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...s.card, borderColor: selected?.id === f.id ? "var(--cryo-accent,#00d4ff)" : "rgba(255,255,255,0.07)" }, onClick: () => setSelected(selected?.id === f.id ? null : f), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: s.sev(f.severity), children: f.severity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, fontSize: 13 }, children: f.rule })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }, children: [
            f.file,
            ":",
            f.line
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.7)" }, children: f.message }),
          selected?.id === f.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 11, background: "rgba(239,68,68,0.08)", borderRadius: 4, padding: 8, color: "#ef4444", marginBottom: 8 }, children: f.code }),
            f.fix && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#4ade80", background: "rgba(34,197,94,0.08)", borderRadius: 4, padding: 8 }, children: [
              "💡 Fix: ",
              f.fix
            ] })
          ] })
        ] }, f.id))
      ] })
    ] })
  ] });
}
export {
  CodeScannerApp as default
};
