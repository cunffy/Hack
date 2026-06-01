import { r as reactExports, j as jsxRuntimeExports } from "./index-CkoTmMxG.js";
const s = {
  root: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14 },
  topBar: { padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8, alignItems: "center" },
  input: { flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 10px", color: "rgba(255,255,255,0.85)", fontSize: 13, outline: "none", fontFamily: '"JetBrains Mono",monospace' },
  body: { flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 14 },
  label: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase" },
  textarea: { width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: 10, color: "rgba(255,255,255,0.85)", fontFamily: '"JetBrains Mono",monospace', fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 },
  flag: (active) => ({ padding: "3px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: active ? "var(--cryo-accent,#00d4ff)" : "rgba(255,255,255,0.07)", color: active ? "#000" : "rgba(255,255,255,0.6)" }),
  badge: { padding: "2px 7px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: "rgba(0,212,255,0.15)", color: "var(--cryo-accent,#00d4ff)" }
};
const PATTERNS = [
  { label: "Email", pattern: "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$", flags: "i" },
  { label: "IPv4", pattern: "^(\\d{1,3}\\.){3}\\d{1,3}$", flags: "" },
  { label: "URL", pattern: "https?:\\/\\/[\\w-]+(\\.[\\w-]+)+", flags: "g" },
  { label: "Phone", pattern: "\\+?[\\d\\s()-]{10,15}", flags: "g" },
  { label: "MD5", pattern: "[a-f0-9]{32}", flags: "gi" },
  { label: "SHA256", pattern: "[a-f0-9]{64}", flags: "gi" },
  { label: "JWT", pattern: "[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+", flags: "g" },
  { label: "CVE", pattern: "CVE-\\d{4}-\\d{4,}", flags: "gi" },
  { label: "IP:Port", pattern: "\\d{1,3}(?:\\.\\d{1,3}){3}:\\d{2,5}", flags: "g" }
];
function RegexApp() {
  const [pattern, setPattern] = reactExports.useState("");
  const [flags, setFlags] = reactExports.useState({ g: true, i: false, m: false, s: false });
  const [testStr, setTestStr] = reactExports.useState("");
  const [replaceWith, setReplaceWith] = reactExports.useState("");
  const [tab, setTab] = reactExports.useState("match");
  const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");
  const result = reactExports.useMemo(() => {
    if (!pattern) return { error: null, matches: [], highlighted: testStr };
    try {
      const re = new RegExp(pattern, flagStr || "g");
      const matches = [];
      if (flags.g) {
        let m;
        let safeRe = new RegExp(pattern, flagStr);
        while ((m = safeRe.exec(testStr)) !== null) {
          matches.push(m);
          if (!flags.g) break;
        }
      } else {
        const m = re.exec(testStr);
        if (m) matches.push(m);
      }
      let html = testStr;
      let offset = 0;
      const sorted = [...matches].sort((a, b) => a.index - b.index);
      for (const m of sorted) {
        const start = m.index + offset;
        const end = start + m[0].length;
        const before = html.slice(0, start);
        const match = html.slice(start, end);
        const after = html.slice(end);
        const wrapped = `<mark style="background:rgba(0,212,255,0.3);border-radius:2px;color:inherit">${match}</mark>`;
        html = before + wrapped + after;
        offset += wrapped.length - match.length;
      }
      return { error: null, matches, highlighted: html };
    } catch (e) {
      return { error: e.message, matches: [], highlighted: testStr };
    }
  }, [pattern, flagStr, testStr, flags.g]);
  const replaced = reactExports.useMemo(() => {
    if (!pattern || !replaceWith) return testStr;
    try {
      return testStr.replace(new RegExp(pattern, flagStr), replaceWith);
    } catch {
      return testStr;
    }
  }, [pattern, flagStr, testStr, replaceWith]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.topBar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: '"JetBrains Mono",monospace', color: "rgba(255,255,255,0.4)", fontSize: 16 }, children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: s.input, placeholder: "Enter regex pattern…", value: pattern, onChange: (e) => setPattern(e.target.value), spellCheck: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: '"JetBrains Mono",monospace', color: "rgba(255,255,255,0.4)", fontSize: 16 }, children: "/" }),
      ["g", "i", "m", "s"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.flag(flags[f]), onClick: () => setFlags((fl) => ({ ...fl, [f]: !fl[f] })), children: f }, f)),
      result.matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: s.badge, children: [
        result.matches.length,
        " match",
        result.matches.length !== 1 ? "es" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 6, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: "24px", marginRight: 4 }, children: "Quick:" }),
      PATTERNS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { padding: "2px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }, onClick: () => {
        setPattern(p.pattern);
        setFlags({ g: p.flags.includes("g"), i: p.flags.includes("i"), m: p.flags.includes("m"), s: p.flags.includes("s") });
      }, children: p.label }, p.label))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.body, children: [
      result.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "6px 12px", background: "rgba(239,68,68,0.1)", borderRadius: 6, color: "#ef4444", fontFamily: '"JetBrains Mono",monospace', fontSize: 12 }, children: [
        "⚠ ",
        result.error
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.card, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.label, children: "Test String" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { style: { ...s.textarea, minHeight: 100 }, value: testStr, onChange: (e) => setTestStr(e.target.value), placeholder: "Paste text to test against the regex…", spellCheck: false })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, marginBottom: 4 }, children: ["match", "replace"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { padding: "5px 14px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: tab === t ? "var(--cryo-accent,#00d4ff)" : "rgba(255,255,255,0.07)", color: tab === t ? "#000" : "rgba(255,255,255,0.6)" }, onClick: () => setTab(t), children: t.charAt(0).toUpperCase() + t.slice(1) }, t)) }),
      tab === "match" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.card, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.label, children: "Highlighted Matches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap" }, dangerouslySetInnerHTML: { __html: result.highlighted } }),
        result.matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.label, children: "Match Details" }),
          result.matches.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 6, fontSize: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.4)", marginRight: 8 }, children: [
              "#",
              i + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: '"JetBrains Mono",monospace', background: "rgba(0,212,255,0.1)", padding: "1px 6px", borderRadius: 3 }, children: m[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.4)", marginLeft: 8 }, children: [
              "at ",
              m.index
            ] }),
            m.slice(1).map((g, gi) => g !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginLeft: 8, color: "rgba(255,255,255,0.5)" }, children: [
              "group",
              gi + 1,
              ": ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: '"JetBrains Mono",monospace' }, children: g })
            ] }, gi))
          ] }, i))
        ] })
      ] }),
      tab === "replace" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.card, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.label, children: "Replace With" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { ...s.input, width: "100%", marginBottom: 12, boxSizing: "border-box" }, placeholder: "Replacement string (use $1, $2 for groups)…", value: replaceWith, onChange: (e) => setReplaceWith(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: s.label, children: "Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "#4ade80" }, children: replaced })
      ] })
    ] })
  ] });
}
export {
  RegexApp as default
};
