import { r as reactExports, j as jsxRuntimeExports } from "./index-fqRzwrz8.js";
const btn = (label, type) => ({ label, type });
const BASIC_BTNS = [
  [btn("C", "clear"), btn("±", "fn"), btn("%", "fn"), btn("÷", "op")],
  [btn("7", "digit"), btn("8", "digit"), btn("9", "digit"), btn("×", "op")],
  [btn("4", "digit"), btn("5", "digit"), btn("6", "digit"), btn("−", "op")],
  [btn("1", "digit"), btn("2", "digit"), btn("3", "digit"), btn("+", "op")],
  [btn("0", "digit"), btn(".", "digit"), btn("⌫", "fn"), btn("=", "eq")]
];
const SCI_ROW = [
  [btn("sin", "fn"), btn("cos", "fn"), btn("tan", "fn"), btn("π", "fn"), btn("e", "fn")],
  [btn("asin", "fn"), btn("acos", "fn"), btn("atan", "fn"), btn("log", "fn"), btn("ln", "fn")],
  [btn("x²", "fn"), btn("xʸ", "fn"), btn("√", "fn"), btn("(", "fn"), btn(")", "fn")]
];
function evaluate(expr) {
  try {
    const clean = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/π/g, String(Math.PI)).replace(/e(?!\d)/g, String(Math.E)).replace(/sin\(/g, "Math.sin(").replace(/cos\(/g, "Math.cos(").replace(/tan\(/g, "Math.tan(").replace(/asin\(/g, "Math.asin(").replace(/acos\(/g, "Math.acos(").replace(/atan\(/g, "Math.atan(").replace(/log\(/g, "Math.log10(").replace(/ln\(/g, "Math.log(").replace(/√\(/g, "Math.sqrt(").replace(/\^/g, "**");
    const result = Function(`"use strict"; return (${clean})`)();
    if (!isFinite(result)) return "Error";
    const r = parseFloat(result.toPrecision(12));
    return String(r);
  } catch {
    return "Error";
  }
}
function CalculatorApp() {
  const [display, setDisplay] = reactExports.useState("0");
  const [expr, setExpr] = reactExports.useState("");
  const [history, setHistory] = reactExports.useState([]);
  const [mode, setMode] = reactExports.useState("basic");
  const [parens, setParens] = reactExports.useState(0);
  const pushHistory = (e, r) => setHistory((h) => [{ expr: e, result: r }, ...h].slice(0, 12));
  const handleInput = reactExports.useCallback((label) => {
    setDisplay((prev) => {
      if (label === "C") {
        setExpr("");
        setParens(0);
        return "0";
      }
      if (label === "⌫") {
        const next2 = prev.length > 1 ? prev.slice(0, -1) : "0";
        setExpr((e) => e.slice(0, -1));
        return next2;
      }
      if (label === "=") {
        const full = expr + (prev === "0" ? "" : prev);
        const result = evaluate(full || prev);
        pushHistory(full || prev, result);
        setExpr("");
        setParens(0);
        return result;
      }
      if (label === "±") return prev.startsWith("-") ? prev.slice(1) : prev === "0" ? "0" : "-" + prev;
      if (label === "%") return String(parseFloat(prev) / 100);
      if (label === "π") {
        setExpr((e) => e + prev + "π");
        return "π";
      }
      if (label === "e") {
        setExpr((e) => e + prev + "e");
        return "e";
      }
      if (label === "x²") {
        setExpr((e) => e + prev + "^2");
        return prev + "²";
      }
      if (label === "xʸ") {
        setExpr((e) => e + prev + "^");
        return prev + "^";
      }
      if (label === "(") {
        setParens((p) => p + 1);
        setExpr((e) => e + prev + "(");
        return "(";
      }
      if (label === ")") {
        if (parens === 0) return prev;
        setParens((p) => p - 1);
        setExpr((e) => e + prev + ")");
        return ")";
      }
      const fns = ["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "√"];
      if (fns.includes(label)) {
        setParens((p) => p + 1);
        const sym = label + "(";
        setExpr((e) => e + sym);
        return sym;
      }
      const ops = ["+", "−", "×", "÷"];
      if (ops.includes(label)) {
        setExpr((e) => e + prev + label);
        return "0";
      }
      if (label === ".") {
        if (prev.includes(".")) return prev;
        return prev + ".";
      }
      const next = prev === "0" || prev === "Error" ? label : prev + label;
      return next;
    });
  }, [expr, parens]);
  reactExports.useEffect(() => {
    const h = (e) => {
      const k = e.key;
      if (/\d/.test(k)) handleInput(k);
      else if (k === "+") handleInput("+");
      else if (k === "-") handleInput("−");
      else if (k === "*") handleInput("×");
      else if (k === "/") {
        e.preventDefault();
        handleInput("÷");
      } else if (k === "Enter" || k === "=") handleInput("=");
      else if (k === "Escape") handleInput("C");
      else if (k === "Backspace") handleInput("⌫");
      else if (k === ".") handleInput(".");
      else if (k === "(") handleInput("(");
      else if (k === ")") handleInput(")");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleInput]);
  const isErr = display === "Error" || display === "Infinity";
  const typeColor = {
    digit: "rgba(255,255,255,0.07)",
    op: "rgba(0,212,255,0.14)",
    fn: "rgba(255,255,255,0.05)",
    eq: "var(--cryo-accent)",
    clear: "rgba(239,68,68,0.18)",
    mem: "rgba(187,136,255,0.14)"
  };
  const renderGrid = (rows) => rows.map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6 }, children: row.map(({ label, type }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: () => handleInput(label),
      style: {
        flex: 1,
        height: 48,
        borderRadius: 10,
        fontSize: type === "fn" ? 11 : 16,
        fontWeight: 600,
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.07)",
        background: type === "eq" ? "linear-gradient(135deg, var(--cryo-accent), #00ff88)" : typeColor[type],
        color: type === "eq" ? "#000" : type === "clear" ? "#f87171" : type === "op" ? "var(--cryo-accent)" : "rgba(255,255,255,0.85)",
        fontFamily: '"JetBrains Mono", monospace',
        transition: "all 0.1s"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.filter = "brightness(1.25)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.filter = "brightness(1)";
      },
      children: label
    },
    label
  )) }, ri));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", height: "100%", background: "rgba(8,12,20,0.6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", width: mode === "scientific" ? 320 : 280, padding: 16, gap: 6, flexShrink: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setMode((m) => m === "basic" ? "scientific" : "basic"),
          style: { fontSize: 10, padding: "3px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", cursor: "pointer" },
          children: mode === "basic" ? "Scientific" : "Basic"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", minHeight: 16, wordBreak: "break-all" }, children: expr || " " }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        textAlign: "right",
        fontSize: display.length > 12 ? 20 : display.length > 8 ? 28 : 38,
        fontWeight: 700,
        color: isErr ? "#f87171" : "#f0f4f8",
        fontFamily: '"JetBrains Mono", monospace',
        letterSpacing: "-0.02em",
        padding: "6px 4px",
        wordBreak: "break-all",
        lineHeight: 1.1
      }, children: display }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        mode === "scientific" && renderGrid(SCI_ROW),
        renderGrid(BASIC_BTNS)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, borderLeft: "1px solid rgba(255,255,255,0.06)", padding: "14px 12px", overflowY: "auto" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }, children: "History" }),
      history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 40 }, children: "No calculations yet" }) : history.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setDisplay(h.result),
          style: { width: "100%", textAlign: "right", padding: "8px 6px", borderRadius: 8, marginBottom: 4, background: "transparent", border: "1px solid transparent", cursor: "pointer" },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "transparent";
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", marginBottom: 2 }, children: h.expr }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--cryo-accent)", fontFamily: "monospace" }, children: h.result })
          ]
        },
        i
      ))
    ] })
  ] });
}
export {
  CalculatorApp as default
};
