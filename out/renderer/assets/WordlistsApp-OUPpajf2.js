import { r as reactExports, j as jsxRuntimeExports } from "./index-BDc1ClbM.js";
const s = {
  root: { display: "flex", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14 },
  sidebar: { width: 260, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", padding: 12 },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topBar: { display: "flex", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", alignItems: "center" },
  input: { flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 10px", color: "rgba(255,255,255,0.85)", fontSize: 13, outline: "none" },
  btn: (c, t = "#000") => ({ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: c, color: t }),
  item: (sel) => ({ padding: "8px 10px", borderRadius: 6, cursor: "pointer", marginBottom: 4, background: sel ? "rgba(0,212,255,0.12)" : "transparent", border: `1px solid ${sel ? "rgba(0,212,255,0.3)" : "transparent"}` }),
  body: { flex: 1, overflow: "auto", padding: 16, fontFamily: '"JetBrains Mono",monospace', fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.8)" },
  badge: { padding: "2px 7px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: "rgba(0,212,255,0.15)", color: "var(--cryo-accent,#00d4ff)", marginLeft: 6 }
};
function WordlistsApp() {
  const [lists, setLists] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(null);
  const [preview, setPreview] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [genOpen, setGenOpen] = reactExports.useState(false);
  const [genOpts, setGenOpts] = reactExports.useState({ minLen: 4, maxLen: 8, charsets: ["lowercase"], count: 1e3, prefix: "", suffix: "" });
  reactExports.useEffect(() => {
    loadLists();
  }, []);
  async function loadLists() {
    try {
      const data = await window.cryogram?.wordlists?.list();
      if (data) setLists(data);
    } catch {
    }
  }
  async function select(wl) {
    setSelected(wl);
    setLoading(true);
    try {
      const lines = await window.cryogram?.wordlists?.preview(wl.path, 200);
      setPreview(lines || []);
    } finally {
      setLoading(false);
    }
  }
  async function importFile() {
    try {
      await window.cryogram?.wordlists?.import();
      loadLists();
    } catch {
    }
  }
  async function generate() {
    setLoading(true);
    try {
      await window.cryogram?.wordlists?.generate(genOpts);
      setGenOpen(false);
      loadLists();
    } finally {
      setLoading(false);
    }
  }
  const filtered = lists.filter((l) => l.name.toLowerCase().includes(filter.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.sidebar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 14, marginBottom: 12 }, children: "Wordlists" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { ...s.input, marginBottom: 8 }, placeholder: "Filter…", value: filter, onChange: (e) => setFilter(e.target.value) }),
      filtered.map((wl) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.item(selected?.path === wl.path), onClick: () => select(wl), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, fontSize: 12 }, children: wl.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }, children: [
          wl.lineCount.toLocaleString(),
          " lines · ",
          wl.sizeKB,
          "KB"
        ] })
      ] }, wl.path)),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.3)", fontSize: 12, padding: 8 }, children: "No wordlists found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.08)", "rgba(255,255,255,0.8)"), onClick: importFile, children: "+ Import File" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("var(--cryo-accent,#00d4ff)"), onClick: () => setGenOpen(true), children: "⚡ Generate" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.main, children: [
      !selected && !genOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "rgba(255,255,255,0.3)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: "📋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Select a wordlist to preview" })
      ] }),
      genOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 24, overflow: "auto", flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 16, marginBottom: 16 }, children: "Generate Wordlist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [["Min Length", "minLen"], ["Max Length", "maxLen"], ["Count", "count"], ["Prefix", "prefix"], ["Suffix", "suffix"]].map(([label, key]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: s.input, value: genOpts[key], onChange: (e) => setGenOpts((o) => ({ ...o, [key]: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) })) })
        ] }, key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }, children: "Character Sets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: ["lowercase", "uppercase", "digits", "symbols"].map((cs) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { ...s.btn(genOpts.charsets.includes(cs) ? "var(--cryo-accent,#00d4ff)" : "rgba(255,255,255,0.08)", genOpts.charsets.includes(cs) ? "#000" : "rgba(255,255,255,0.7)") }, onClick: () => setGenOpts((o) => ({ ...o, charsets: o.charsets.includes(cs) ? o.charsets.filter((c) => c !== cs) : [...o.charsets, cs] })), children: cs }, cs)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 20 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("var(--cryo-accent,#00d4ff)"), onClick: generate, children: "Generate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.08)", "rgba(255,255,255,0.7)"), onClick: () => setGenOpen(false), children: "Cancel" })
        ] })
      ] }),
      selected && !genOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.topBar, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700 }, children: selected.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: s.badge, children: [
            selected.lineCount.toLocaleString(),
            " lines"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { ...s.badge, marginLeft: 4 }, children: [
            selected.sizeKB,
            "KB"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginLeft: "auto", display: "flex", gap: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(239,68,68,0.15)", "#ef4444"), onClick: async () => {
            await window.cryogram?.wordlists?.delete(selected.path);
            setSelected(null);
            loadLists();
          }, children: "Delete" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.body, children: [
          loading ? "Loading preview…" : preview.join("\n"),
          !loading && preview.length === 200 && "\n… (showing first 200 lines)"
        ] })
      ] })
    ] })
  ] });
}
export {
  WordlistsApp as default
};
