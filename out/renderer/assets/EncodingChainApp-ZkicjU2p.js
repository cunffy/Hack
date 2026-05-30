import { r as reactExports, j as jsxRuntimeExports } from "./index-COsLCXam.js";
const OPS = ["Base64", "Base32", "URL", "HTML Entities", "Hex", "Binary", "ROT13", "Caesar", "MD5 Hash", "SHA1 Hash", "SHA256 Hash", "AES-256 (ECB)", "Reverse", "Uppercase", "Lowercase"];
const s = {
  root: { display: "flex", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14 },
  left: { width: 320, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" },
  right: { flex: 1, display: "flex", flexDirection: "column", overflow: "auto", padding: 16 },
  topBar: { padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontWeight: 700, fontSize: 14 },
  btn: (c, t = "#000") => ({ padding: "5px 12px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: c, color: t }),
  textarea: { flex: 1, background: "rgba(255,255,255,0.03)", border: "none", outline: "none", color: "rgba(255,255,255,0.85)", fontFamily: '"JetBrains Mono",monospace', fontSize: 12, resize: "none", padding: 12, lineHeight: 1.6 },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 12, marginBottom: 12 },
  step: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 10, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }
};
function applyOp(input, op) {
  try {
    if (op.type === "Base64") return op.direction === "encode" ? btoa(input) : atob(input);
    if (op.type === "URL") return op.direction === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    if (op.type === "HTML Entities") return op.direction === "encode" ? input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : input.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
    if (op.type === "Hex") return op.direction === "encode" ? Array.from(input).map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join("") : input.replace(/([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
    if (op.type === "Binary") return op.direction === "encode" ? Array.from(input).map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ") : input.split(" ").map((b) => String.fromCharCode(parseInt(b, 2))).join("");
    if (op.type === "ROT13") return input.replace(/[a-zA-Z]/g, (c) => String.fromCharCode((c.toLowerCase() < "n" ? 1 : -1) * 13 + c.charCodeAt(0)));
    if (op.type === "Reverse") return input.split("").reverse().join("");
    if (op.type === "Uppercase") return input.toUpperCase();
    if (op.type === "Lowercase") return input.toLowerCase();
    if (op.type === "Caesar") {
      const shift = op.direction === "encode" ? 13 : -13;
      return input.replace(/[a-zA-Z]/g, (c) => {
        const b = c < "a" ? 65 : 97;
        return String.fromCharCode((c.charCodeAt(0) - b + shift + 26) % 26 + b);
      });
    }
    return input + ` [${op.type} not available in browser]`;
  } catch (e) {
    return `[Error: ${e.message}]`;
  }
}
function EncodingChainApp() {
  const [input, setInput] = reactExports.useState("");
  const [chain, setChain] = reactExports.useState([]);
  const [adding, setAdding] = reactExports.useState(false);
  const [newOp, setNewOp] = reactExports.useState({ type: "Base64", direction: "encode" });
  const steps = reactExports.useMemo(() => {
    const results = [input];
    for (const op of chain) {
      results.push(applyOp(results[results.length - 1], op));
    }
    return results;
  }, [input, chain]);
  function addOp() {
    setChain((c) => [...c, { id: Math.random().toString(36).slice(2), ...newOp }]);
    setAdding(false);
  }
  function removeOp(id) {
    setChain((c) => c.filter((o) => o.id !== id));
  }
  function moveUp(idx) {
    if (idx === 0) return;
    setChain((c) => {
      const n = [...c];
      [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]];
      return n;
    });
  }
  function moveDown(idx) {
    if (idx === chain.length - 1) return;
    setChain((c) => {
      const n = [...c];
      [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]];
      return n;
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.left, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.topBar, children: "Encoding Chain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto", padding: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }, children: "INPUT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { style: { ...s.textarea, height: 100, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, marginBottom: 12, flex: "none" }, value: input, onChange: (e) => setInput(e.target.value), placeholder: "Enter text to encode/decode…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: [
            "PIPELINE (",
            chain.length,
            " steps)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("var(--cryo-accent,#00d4ff)"), onClick: () => setAdding(true), children: "+ Add Step" })
        ] }),
        chain.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center", padding: 20 }, children: [
          "No operations yet.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Add steps to build your chain."
        ] }),
        chain.map((op, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.step, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)", width: 16, textAlign: "center" }, children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, fontSize: 12 }, children: op.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: op.direction === "encode" ? "var(--cryo-accent,#00d4ff)" : "#f97316" }, children: op.direction })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.06)", "rgba(255,255,255,0.5)"), onClick: () => moveUp(i), children: "↑" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.06)", "rgba(255,255,255,0.5)"), onClick: () => moveDown(i), children: "↓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(239,68,68,0.1)", "#ef4444"), onClick: () => removeOp(op.id), children: "×" })
        ] }, op.id)),
        adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, padding: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }, children: "OPERATION" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { style: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, padding: "5px 8px", color: "rgba(255,255,255,0.85)", marginBottom: 8 }, value: newOp.type, onChange: (e) => setNewOp((o) => ({ ...o, type: e.target.value })), children: OPS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, marginBottom: 8 }, children: ["encode", "decode"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn(newOp.direction === d ? "var(--cryo-accent,#00d4ff)" : "rgba(255,255,255,0.07)", newOp.direction === d ? "#000" : "rgba(255,255,255,0.6)"), onClick: () => setNewOp((o) => ({ ...o, direction: d })), children: d }, d)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("var(--cryo-accent,#00d4ff)"), onClick: addOp, children: "Add" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.07)", "rgba(255,255,255,0.6)"), onClick: () => setAdding(false), children: "Cancel" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.right, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 14, marginBottom: 16 }, children: "Pipeline Output" }),
      steps.slice(1).map((val, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.card, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: [
            "Step ",
            i + 1,
            ": ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: chain[i]?.direction === "encode" ? "var(--cryo-accent,#00d4ff)" : "#f97316" }, children: [
              chain[i]?.type,
              " (",
              chain[i]?.direction,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.06)", "rgba(255,255,255,0.5)"), onClick: () => navigator.clipboard.writeText(val), children: "Copy" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 12, wordBreak: "break-all", color: "rgba(255,255,255,0.85)", maxHeight: 80, overflow: "auto" }, children: val })
      ] }, i)),
      chain.length > 0 && steps.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...s.card, borderColor: "var(--cryo-accent,#00d4ff)", background: "rgba(0,212,255,0.05)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "var(--cryo-accent,#00d4ff)", fontWeight: 700 }, children: "FINAL OUTPUT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("var(--cryo-accent,#00d4ff)"), onClick: () => navigator.clipboard.writeText(steps[steps.length - 1]), children: "Copy" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 12, wordBreak: "break-all", color: "rgba(255,255,255,0.85)" }, children: steps[steps.length - 1] })
      ] }),
      chain.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.3)", marginTop: 60 }, children: "Add operations to the pipeline to see results" })
    ] })
  ] });
}
export {
  EncodingChainApp as default
};
