import { u as useDesktopStore, r as reactExports, j as jsxRuntimeExports } from "./index-B_05y53C.js";
const s = {
  root: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14 },
  topBar: { padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8, alignItems: "center" },
  btn: (c, t = "#000") => ({ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: c, color: t }),
  body: { flex: 1, overflow: "auto", padding: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 },
  thumb: (sel) => ({ borderRadius: 8, overflow: "hidden", cursor: "pointer", border: `2px solid ${sel ? "var(--cryo-accent,#00d4ff)" : "transparent"}`, position: "relative", aspectRatio: "16/9" }),
  label: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px 8px", background: "linear-gradient(transparent,rgba(0,0,0,0.7))", fontSize: 11, color: "#fff" }
};
const GRADIENT_WALLPAPERS = [
  { id: "grad-1", name: "Cyber Dusk", colors: ["#0a0e1a", "#0d2640"], type: "gradient" },
  { id: "grad-2", name: "Neon Night", colors: ["#050a0f", "#1a0a2e"], type: "gradient" },
  { id: "grad-3", name: "Arctic Blue", colors: ["#030d1a", "#0a2a3d"], type: "gradient" },
  { id: "grad-4", name: "Crimson Dark", colors: ["#0a0808", "#2a0808"], type: "gradient" },
  { id: "grad-5", name: "Forest Dark", colors: ["#040a06", "#0a1e0c"], type: "gradient" }
];
function WallpaperApp() {
  const { wallpaper, setWallpaper } = useDesktopStore();
  const [custom, setCustom] = reactExports.useState([]);
  const [tab, setTab] = reactExports.useState("builtin");
  reactExports.useEffect(() => {
    loadCustom();
  }, []);
  async function loadCustom() {
    try {
      const data = await window.cryogram?.wallpaper?.listCustom();
      if (data) setCustom(data);
    } catch {
    }
  }
  async function importWallpaper() {
    try {
      const path = await window.cryogram?.wallpaper?.browse();
      if (path) {
        setWallpaper(path);
        loadCustom();
      }
    } catch {
    }
  }
  function applyWallpaper(path) {
    setWallpaper(path || "");
    try {
      window.cryogram?.settings?.set("wallpaper", path || "");
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.topBar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, fontSize: 14 }, children: "Wallpaper" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4, marginLeft: 8 }, children: ["builtin", "custom"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn(tab === t ? "var(--cryo-accent,#00d4ff)" : "rgba(255,255,255,0.07)", tab === t ? "#000" : "rgba(255,255,255,0.6)"), onClick: () => setTab(t), children: t.charAt(0).toUpperCase() + t.slice(1) }, t)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { ...s.btn("rgba(255,255,255,0.08)", "rgba(255,255,255,0.7)"), marginLeft: "auto" }, onClick: importWallpaper, children: "+ Import Image" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.body, children: [
      tab === "builtin" && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10 }, children: "GRADIENT THEMES" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.grid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.thumb(!wallpaper), onClick: () => applyWallpaper(""), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", background: "linear-gradient(135deg,#070b11,#0d1829)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 24 }, children: "✨" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.label, children: "Animated (Default)" }),
            !wallpaper && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 6, right: 6, background: "var(--cryo-accent,#00d4ff)", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#000", fontWeight: 700 }, children: "✓" })
          ] }),
          GRADIENT_WALLPAPERS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.thumb(wallpaper === g.id), onClick: () => applyWallpaper(g.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", background: `linear-gradient(135deg,${g.colors[0]},${g.colors[1]})` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.label, children: g.name })
          ] }, g.id))
        ] })
      ] }) }),
      tab === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        custom.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.3)", marginTop: 60 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: "🖼" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "No custom wallpapers imported" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { ...s.btn("var(--cryo-accent,#00d4ff)"), marginTop: 16 }, onClick: importWallpaper, children: "Import Image" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.grid, children: custom.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.thumb(wallpaper === w.path), onClick: () => applyWallpaper(w.path), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: w.thumb || w.path, alt: w.name, style: { width: "100%", height: "100%", objectFit: "cover" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.label, children: w.name }),
          wallpaper === w.path && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 6, right: 6, background: "var(--cryo-accent,#00d4ff)", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#000", fontWeight: 700 }, children: "✓" })
        ] }, w.id)) })
      ] })
    ] })
  ] });
}
export {
  WallpaperApp as default
};
