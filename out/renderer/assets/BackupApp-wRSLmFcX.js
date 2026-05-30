import { r as reactExports, j as jsxRuntimeExports } from "./index-BnqcYFX0.js";
const s = {
  root: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14 },
  topBar: { display: "flex", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", alignItems: "center" },
  body: { flex: 1, overflow: "auto", padding: 16 },
  btn: (c, t = "#000") => ({ padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: c, color: t }),
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 14, marginBottom: 10 },
  status: (s2) => ({ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: s2 === "complete" ? "rgba(34,197,94,0.15)" : s2 === "error" ? "rgba(239,68,68,0.15)" : "rgba(234,179,8,0.15)", color: s2 === "complete" ? "#4ade80" : s2 === "error" ? "#ef4444" : "#eab308", marginLeft: 8 }),
  progress: { height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", marginTop: 10, overflow: "hidden" },
  bar: (p) => ({ height: "100%", width: `${p}%`, background: "var(--cryo-accent,#00d4ff)", borderRadius: 2, transition: "width 0.3s" })
};
function BackupApp() {
  const [backups, setBackups] = reactExports.useState([]);
  const [running, setRunning] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [log, setLog] = reactExports.useState([]);
  reactExports.useEffect(() => {
    loadBackups();
  }, []);
  async function loadBackups() {
    try {
      const data = await window.cryogram?.backup?.list();
      if (data) setBackups(data);
    } catch {
    }
  }
  async function createBackup() {
    setRunning(true);
    setProgress(0);
    setLog([]);
    try {
      const unlisten = await window.cryogram?.backup?.onProgress?.((msg, pct) => {
        setLog((l) => [...l, msg]);
        setProgress(pct);
      });
      await window.cryogram?.backup?.create();
      unlisten?.();
      setProgress(100);
      setLog((l) => [...l, "✓ Backup complete"]);
      loadBackups();
    } catch (e) {
      setLog((l) => [...l, `✗ Error: ${e?.message || e}`]);
    } finally {
      setRunning(false);
    }
  }
  async function restore(id) {
    if (!confirm("Restore this backup? Current data will be overwritten.")) return;
    setRunning(true);
    try {
      await window.cryogram?.backup?.restore(id);
      setLog(["✓ Restore complete"]);
    } finally {
      setRunning(false);
    }
  }
  async function deleteBackup(id) {
    if (!confirm("Delete this backup?")) return;
    try {
      await window.cryogram?.backup?.delete(id);
      loadBackups();
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.topBar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, fontSize: 15 }, children: "System Backup" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { ...s.btn("var(--cryo-accent,#00d4ff)"), marginLeft: "auto" }, onClick: createBackup, disabled: running, children: running ? "⏳ Backing up…" : "💾 Create Backup" })
    ] }),
    running && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }, children: log[log.length - 1] || "Starting…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.progress, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.bar(progress) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.body, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }, children: [["Total Backups", String(backups.length), "#00d4ff"], ["Latest", backups[0]?.created || "—", "#4ade80"], ["Total Size", backups.reduce((a, b) => a, 0) + " items", "#a78bfa"]].map(([l, v, c]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: `rgba(255,255,255,0.04)`, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 14 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }, children: l }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 20, color: c }, children: v })
      ] }, l)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, marginBottom: 10 }, children: "Backup History" }),
      backups.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 40 }, children: "No backups yet. Create your first backup above." }),
      backups.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.card, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: b.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: s.status(b.status), children: b.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(0,212,255,0.1)", "var(--cryo-accent,#00d4ff)"), onClick: () => restore(b.id), children: "Restore" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(239,68,68,0.1)", "#ef4444"), onClick: () => deleteBackup(b.id), children: "Delete" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 20, marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.4)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "📅 ",
            b.created
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "📦 ",
            b.size
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "📁 ",
            b.items,
            " items"
          ] })
        ] })
      ] }, b.id)),
      log.length > 0 && !running && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, marginBottom: 8 }, children: "Log" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: "rgba(255,255,255,0.7)", maxHeight: 160, overflow: "auto" }, children: log.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: l }, i)) })
      ] })
    ] })
  ] });
}
export {
  BackupApp as default
};
