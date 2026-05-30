import { r as reactExports, j as jsxRuntimeExports } from "./index-BvGpDqej.js";
const s = {
  root: { display: "flex", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14 },
  sidebar: { width: 280, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" },
  main: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 },
  topBar: { padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8, alignItems: "center" },
  input: { flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 10px", color: "rgba(255,255,255,0.85)", fontSize: 13, outline: "none" },
  btn: (c, t = "#000") => ({ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: c, color: t }),
  item: (sel) => ({ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", background: sel ? "rgba(0,212,255,0.08)" : "transparent", display: "flex", alignItems: "center", gap: 10 }),
  code: { fontFamily: '"JetBrains Mono",monospace', fontSize: 40, fontWeight: 700, letterSpacing: 8, color: "var(--cryo-accent,#00d4ff)", cursor: "pointer" }
};
function totp(secret) {
  const counter = Math.floor(Date.now() / 1e3 / 30);
  const hash = (counter + secret.charCodeAt(0)) % 1e6;
  return String(hash).padStart(6, "0");
}
function TOTPApp() {
  const [accounts, setAccounts] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(null);
  const [code, setCode] = reactExports.useState("");
  const [timeLeft, setTimeLeft] = reactExports.useState(30);
  const [copied, setCopied] = reactExports.useState(false);
  const [adding, setAdding] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({ name: "", issuer: "", secret: "" });
  const timerRef = reactExports.useRef();
  reactExports.useEffect(() => {
    loadAccounts();
  }, []);
  reactExports.useEffect(() => {
    if (!selected) return;
    const update = async () => {
      try {
        const result = await window.cryogram?.totp?.generate(selected.secret);
        setCode(result?.code || "------");
        setTimeLeft(result?.timeLeft ?? 30);
      } catch {
        setCode(totp(selected.secret));
        setTimeLeft(30 - Math.floor(Date.now() / 1e3) % 30);
      }
    };
    update();
    timerRef.current = setInterval(update, 1e3);
    return () => clearInterval(timerRef.current);
  }, [selected]);
  async function loadAccounts() {
    try {
      const data = await window.cryogram?.totp?.list();
      if (data) setAccounts(data);
    } catch {
    }
  }
  async function addAccount() {
    if (!form.name || !form.secret) return;
    try {
      await window.cryogram?.totp?.add(form);
      setAdding(false);
      setForm({ name: "", issuer: "", secret: "" });
      loadAccounts();
    } catch {
    }
  }
  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  const progress = timeLeft / 30 * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.sidebar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.topBar, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, flex: 1 }, children: "2FA Accounts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("var(--cryo-accent,#00d4ff)"), onClick: () => setAdding(true), children: "+" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto" }, children: [
        accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.item(selected?.id === a.id), onClick: () => setSelected(a), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 36, height: 36, borderRadius: 8, background: "rgba(0,212,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }, children: a.name[0]?.toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, fontSize: 13 }, children: a.name }),
            a.issuer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: a.issuer })
          ] })
        ] }, a.id)),
        accounts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.3)", padding: 20, textAlign: "center", fontSize: 12 }, children: "No accounts yet" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.main, children: [
      !selected && !adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.3)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "🔐" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, marginBottom: 8 }, children: "2FA / TOTP Manager" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13 }, children: "Add an account to generate one-time passwords" })
      ] }),
      selected && !adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }, children: selected.issuer || selected.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 20, marginBottom: 20 }, children: selected.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.code, onClick: copyCode, title: "Click to copy", children: [
          code.slice(0, 3),
          " ",
          code.slice(3)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 8, marginBottom: 20 }, children: copied ? "✓ Copied!" : "Click code to copy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 200, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden", margin: "0 auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: `${progress}%`, background: timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f97316" : "var(--cryo-accent,#00d4ff)", borderRadius: 3, transition: "width 1s linear" } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }, children: [
          timeLeft,
          "s remaining"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { ...s.btn("rgba(239,68,68,0.1)", "#ef4444"), marginTop: 20 }, onClick: async () => {
          await window.cryogram?.totp?.remove(selected.id);
          setSelected(null);
          loadAccounts();
        }, children: "Remove Account" })
      ] }),
      adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 340 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 16, marginBottom: 20 }, children: "Add TOTP Account" }),
        [["Account Name", "name", "text", "e.g. GitHub"], ["Issuer (optional)", "issuer", "text", "e.g. GitHub Inc."], ["Secret Key", "secret", "password", "Base32 encoded secret"]].map(([label, key, type, ph]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { ...s.input, width: "100%", boxSizing: "border-box" }, type, placeholder: ph, value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) })
        ] }, key)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("var(--cryo-accent,#00d4ff)"), onClick: addAccount, children: "Add Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.08)", "rgba(255,255,255,0.7)"), onClick: () => setAdding(false), children: "Cancel" })
        ] })
      ] })
    ] })
  ] });
}
export {
  TOTPApp as default
};
