import { r as reactExports, j as jsxRuntimeExports } from "./index-COsLCXam.js";
const api = () => window.cryogram?.colorPicker;
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hexToCmyk(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return { c: Math.round((1 - rn - k) / (1 - k) * 100), m: Math.round((1 - gn - k) / (1 - k) * 100), y: Math.round((1 - bn - k) / (1 - k) * 100), k: Math.round(k * 100) };
}
function ColorPickerApp() {
  const [color, setColor] = reactExports.useState("#3b82f6");
  const [palettes, setPalettes] = reactExports.useState([]);
  const [newPalName, setNewPalName] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("picker");
  reactExports.useEffect(() => {
    api()?.getPalettes().then(setPalettes);
  }, []);
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = hexToCmyk(color);
  function copyVal(val) {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(""), 1200);
  }
  async function createPalette() {
    if (!newPalName.trim()) return;
    const p = await api()?.savePalette({ name: newPalName.trim(), colors: [color] });
    if (p) {
      setPalettes((prev) => [...prev, p]);
      setNewPalName("");
    }
  }
  async function addToPalette(id) {
    const pal = palettes.find((p) => p.id === id);
    if (pal.colors.includes(color)) return;
    const updated = await api()?.updatePalette(id, { colors: [...pal.colors, color] });
    if (updated) setPalettes(updated);
  }
  async function removeColor(palId, colorHex) {
    const pal = palettes.find((p) => p.id === palId);
    const updated = await api()?.updatePalette(palId, { colors: pal.colors.filter((c) => c !== colorHex) });
    if (updated) setPalettes(updated);
  }
  async function deletePalette(id) {
    const updated = await api()?.deletePalette(id);
    if (updated) setPalettes(updated);
  }
  const CopyBtn = ({ val }) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => copyVal(val), className: `text-xs px-2 py-0.5 rounded ml-2 ${copied === val ? "bg-green-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-400"}`, children: copied === val ? "✓" : "Copy" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-gray-950 text-gray-100 font-mono", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-gray-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🎨" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-pink-400", children: "Color Picker" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex gap-2", children: ["picker", "palettes"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setActiveTab(t),
          className: `text-xs px-3 py-1 rounded capitalize ${activeTab === t ? "bg-pink-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`,
          children: t
        },
        t
      )) })
    ] }),
    activeTab === "picker" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-lg border-2 border-gray-700 shrink-0", style: { background: color } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "color",
              value: color,
              onChange: (e) => setColor(e.target.value),
              className: "w-full h-10 rounded cursor-pointer border border-gray-700 bg-transparent"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: color,
              onChange: (e) => {
                if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColor(e.target.value);
              },
              className: "w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-pink-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-900 rounded-lg border border-gray-800 divide-y divide-gray-800", children: [
        { label: "HEX", val: color },
        { label: "RGB", val: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
        { label: "HSL", val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        { label: "CMYK", val: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` }
      ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center px-4 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 w-12", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-200 flex-1", children: val }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CopyBtn, { val })
      ] }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider", children: "Save to palette" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: newPalName,
              onChange: (e) => setNewPalName(e.target.value),
              placeholder: "New palette name…",
              className: "flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-pink-500",
              onKeyDown: (e) => e.key === "Enter" && createPalette()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: createPalette, className: "px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-sm rounded", children: "Create" })
        ] }),
        palettes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: palettes.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => addToPalette(p.id),
            className: "text-xs px-3 py-1 rounded border border-gray-700 hover:border-pink-500 text-gray-300 hover:text-pink-300",
            children: [
              "+ ",
              p.name
            ]
          },
          p.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
      palettes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-gray-500 text-sm mt-8", children: "No palettes yet — create one in the Picker tab" }),
      palettes.map((pal) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 rounded-lg border border-gray-800 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-200", children: pal.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deletePalette(pal.id), className: "text-xs text-red-400 hover:text-red-300", children: "Delete" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pal.colors.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-10 h-10 rounded border border-gray-700 cursor-pointer hover:scale-110 transition-transform",
              style: { background: c },
              onClick: () => {
                setColor(c);
                setActiveTab("picker");
              },
              title: c
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => removeColor(pal.id, c),
              className: "absolute -top-1 -right-1 w-4 h-4 bg-red-700 text-white text-xs rounded-full hidden group-hover:flex items-center justify-center leading-none",
              children: "×"
            }
          )
        ] }, c)) })
      ] }, pal.id))
    ] })
  ] });
}
export {
  ColorPickerApp as default
};
