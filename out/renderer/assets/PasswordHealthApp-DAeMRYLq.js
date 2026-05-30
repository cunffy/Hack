import { r as reactExports, j as jsxRuntimeExports } from "./index-fqRzwrz8.js";
function calcEntropy(password) {
  let charset = 0;
  if (/[a-z]/.test(password)) charset = 26;
  if (/[A-Z]/.test(password)) charset = charset === 0 ? 26 : 52;
  if (/[0-9]/.test(password)) charset = charset === 0 ? 10 : charset + 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset = 95;
  if (charset === 0) charset = 26;
  return password.length * Math.log2(charset);
}
async function sha1Hex(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function ScoreGauge({ score }) {
  const r = 52;
  const cx = 68, cy = 68;
  const circ = 2 * Math.PI * r;
  const filled = score / 100 * circ;
  const color = score < 40 ? "#ef4444" : score < 70 ? "#eab308" : "#4ade80";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 136, height: 136, viewBox: "0 0 136 136", style: { flexShrink: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r, fill: "none", stroke: "rgba(255,255,255,0.07)", strokeWidth: 10 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "circle",
      {
        cx,
        cy,
        r,
        fill: "none",
        stroke: color,
        strokeWidth: 10,
        strokeDasharray: `${filled} ${circ - filled}`,
        strokeLinecap: "round",
        transform: `rotate(-90 ${cx} ${cy})`,
        style: { transition: "stroke-dasharray 0.7s ease, stroke 0.4s" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: cx, y: cy - 4, textAnchor: "middle", fill: color, fontSize: 28, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', children: score }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: cx, y: cy + 14, textAnchor: "middle", fill: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', children: "out of 100" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: cx, y: cy + 28, textAnchor: "middle", fill: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', children: "Health Score" })
  ] });
}
function SectionCard({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10,
    padding: 16
  }, children });
}
function SectionTitle({ title, count, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, fontSize: 14 }, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      padding: "1px 8px",
      borderRadius: 10,
      background: count > 0 ? color + "22" : "rgba(255,255,255,0.04)",
      border: `1px solid ${count > 0 ? color + "55" : "rgba(255,255,255,0.07)"}`,
      fontSize: 11,
      color: count > 0 ? color : "rgba(255,255,255,0.3)",
      fontFamily: '"JetBrains Mono", monospace'
    }, children: count })
  ] });
}
function FixButton({ onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      style: {
        padding: "3px 9px",
        background: "rgba(0,212,255,0.08)",
        border: "1px solid rgba(0,212,255,0.2)",
        borderRadius: 5,
        color: "var(--cryo-accent, #00d4ff)",
        fontSize: 11,
        cursor: "pointer",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "background 0.12s"
      },
      onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,212,255,0.18)",
      onMouseLeave: (e) => e.currentTarget.style.background = "rgba(0,212,255,0.08)",
      children: "Open in Password Manager"
    }
  );
}
function EntropyBadge({ entropy }) {
  const color = entropy < 40 ? "#ef4444" : entropy < 60 ? "#eab308" : "#4ade80";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
    padding: "2px 7px",
    borderRadius: 4,
    background: color + "22",
    border: `1px solid ${color}55`,
    color,
    fontSize: 11,
    fontFamily: '"JetBrains Mono", monospace',
    flexShrink: 0
  }, children: [
    entropy.toFixed(0),
    " bits"
  ] });
}
function PasswordHealthApp() {
  const [vault, setVault] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [score, setScore] = reactExports.useState(100);
  const [weakEntries, setWeakEntries] = reactExports.useState([]);
  const [dupeGroups, setDupeGroups] = reactExports.useState([]);
  const [openDupe, setOpenDupe] = reactExports.useState(null);
  const [breachResults, setBreachResults] = reactExports.useState([]);
  const [breachChecking, setBreachChecking] = reactExports.useState(false);
  const [breachStarted, setBreachStarted] = reactExports.useState(false);
  const audit = reactExports.useCallback((entries) => {
    const weak = entries.map((e) => ({ entry: e, entropy: calcEntropy(e.password) })).filter((e) => e.entropy < 40);
    setWeakEntries(weak);
    const pwMap = {};
    entries.forEach((e) => {
      if (!pwMap[e.password]) pwMap[e.password] = [];
      pwMap[e.password].push(e);
    });
    const dupes = Object.values(pwMap).filter((g) => g.length >= 2).map((entries2) => ({ password: entries2[0].password, entries: entries2 }));
    setDupeGroups(dupes);
    if (entries.length === 0) {
      setScore(100);
      return;
    }
    const penWeak = weak.length / entries.length * 40;
    const penDupe = dupes.reduce((s, g) => s + g.entries.length, 0) / entries.length * 30;
    setScore(Math.max(0, Math.round(100 - penWeak - penDupe)));
  }, []);
  reactExports.useEffect(() => {
    (async () => {
      try {
        const data = await window.cryogram?.passwords?.getAll();
        const entries = Array.isArray(data) ? data : [];
        setVault(entries);
        audit(entries);
      } catch {
        setVault([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [audit]);
  const checkBreaches = async () => {
    setBreachStarted(true);
    setBreachChecking(true);
    setBreachResults(vault.map((e) => ({ entryId: e.id, status: "checking" })));
    for (const entry of vault) {
      try {
        const hash = await sha1Hex(entry.password);
        const prefix = hash.slice(0, 5);
        const suffix = hash.slice(5);
        const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const text = await res.text();
        let found = false, count = 0;
        for (const line of text.split("\n")) {
          const [s, c] = line.trim().split(":");
          if (s === suffix) {
            found = true;
            count = parseInt(c || "0", 10);
            break;
          }
        }
        setBreachResults((prev) => prev.map(
          (r) => r.entryId === entry.id ? { entryId: entry.id, status: found ? "breached" : "safe", count: found ? count : void 0 } : r
        ));
      } catch {
        setBreachResults((prev) => prev.map((r) => r.entryId === entry.id ? { ...r, status: "safe" } : r));
      }
    }
    setBreachChecking(false);
  };
  const openPasswords = () => window.dispatchEvent(new CustomEvent("cryogram:openApp", { detail: "passwords" }));
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "rgba(8,12,20,0.8)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 24, height: 24, border: "2px solid var(--cryo-accent,#00d4ff)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "rgba(8,12,20,0.8)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    color: "rgba(255,255,255,0.85)",
    overflowY: "auto"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 24,
      padding: "20px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreGauge, { score }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 20, fontWeight: 700, marginBottom: 4 }, children: "Password Health" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 14 }, children: [
          vault.length,
          " passwords audited"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 20 }, children: [
          { label: "Weak", value: weakEntries.length, color: "#ef4444" },
          { label: "Duplicate", value: dupeGroups.reduce((s, g) => s + g.entries.length, 0), color: "#eab308" },
          { label: "Breached", value: breachResults.filter((r) => r.status === "breached").length, color: "#ef4444" }
        ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontSize: 22,
            fontWeight: 700,
            color: value > 0 ? color : "#4ade80",
            fontFamily: '"JetBrains Mono", monospace'
          }, children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: label })
        ] }, label)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { title: "Weak Passwords", count: weakEntries.length, color: "#ef4444" }),
        weakEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#4ade80", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✓" }),
          " No weak passwords found"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: weakEntries.map(({ entry, entropy }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderRadius: 8,
          background: "rgba(239,68,68,0.05)",
          border: "1px solid rgba(239,68,68,0.15)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: entry.site }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: entry.username })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }, children: "●".repeat(Math.min(entry.password.length, 10)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(EntropyBadge, { entropy }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FixButton, { onClick: openPasswords })
        ] }, entry.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { title: "Duplicate Passwords", count: dupeGroups.length, color: "#eab308" }),
        dupeGroups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#4ade80", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✓" }),
          " No duplicate passwords found"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: dupeGroups.map((group, gi) => {
          const isOpen = openDupe === gi;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { borderRadius: 8, overflow: "hidden", border: "1px solid rgba(234,179,8,0.2)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setOpenDupe(isOpen ? null : gi),
                style: {
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  background: "rgba(234,179,8,0.06)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  color: "rgba(255,255,255,0.85)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#eab308", fontWeight: 600, fontSize: 13 }, children: [
                    group.entries.length,
                    " accounts affected"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)", flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: group.entries.map((e) => e.site).join(", ") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.35)", fontSize: 11 }, children: isOpen ? "▲" : "▼" })
                ]
              }
            ),
            isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "8px 12px 12px", background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", gap: 6 }, children: group.entries.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, fontSize: 13, fontWeight: 600 }, children: e.site }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: e.username }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FixButton, { onClick: openPasswords })
            ] }, e.id)) })
          ] }, gi);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { title: "Breach Check (HIBP)", count: breachResults.filter((r) => r.status === "breached").length, color: "#ef4444" }),
        !breachStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            padding: "10px 12px",
            borderRadius: 6,
            background: "rgba(0,212,255,0.05)",
            border: "1px solid rgba(0,212,255,0.15)",
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            lineHeight: "1.65"
          }, children: "We use k-anonymity — only the first 5 characters of each SHA-1 hash are sent. Your actual passwords never leave your device." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: checkBreaches,
              disabled: vault.length === 0,
              style: {
                alignSelf: "flex-start",
                padding: "8px 18px",
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.3)",
                borderRadius: 7,
                color: "var(--cryo-accent,#00d4ff)",
                fontSize: 13,
                fontWeight: 600,
                cursor: vault.length === 0 ? "default" : "pointer",
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                opacity: vault.length === 0 ? 0.4 : 1
              },
              children: "Check for Breaches"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
          breachChecking && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4 }, children: "Checking passwords against breach database..." }),
          vault.map((entry) => {
            const result = breachResults.find((r) => r.entryId === entry.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 7,
              background: result?.status === "breached" ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${result?.status === "breached" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)"}`
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, fontWeight: 600 }, children: entry.site }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 8 }, children: entry.username })
              ] }),
              !result || result.status === "checking" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "inline-block", width: 14, height: 14, border: "2px solid var(--cryo-accent,#00d4ff)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" } }) : result.status === "breached" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 12, color: "#ef4444", fontWeight: 600 }, children: [
                  "Found in ",
                  result.count?.toLocaleString(),
                  " breaches"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FixButton, { onClick: openPasswords })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "#4ade80", fontWeight: 600 }, children: "Not found" })
            ] }, entry.id);
          })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })
  ] });
}
export {
  PasswordHealthApp as default
};
