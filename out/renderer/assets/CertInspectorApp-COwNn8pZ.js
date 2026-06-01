import { r as reactExports, j as jsxRuntimeExports } from "./index-BDc1ClbM.js";
const ACCENT = "#00d4ff";
const ipc = window.cryogram;
function formatDate(s) {
  try {
    return new Date(s).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return s;
  }
}
function validityColor(days) {
  if (days < 0) return "#ff4466";
  if (days <= 30) return "#ffaa00";
  return "#00ff88";
}
const S = {
  root: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "rgba(10,14,22,0.94)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 13 },
  input: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "7px 12px", color: "rgba(255,255,255,0.85)", fontSize: 12, outline: "none" },
  label: { fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 16px" }
};
function Field({ label, value, mono, accent, action }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: accent ? ACCENT : "rgba(255,255,255,0.8)", fontFamily: mono ? '"JetBrains Mono",monospace' : "inherit", wordBreak: "break-all" }, children: value }),
      action
    ] })
  ] });
}
function ValidityBar({ cert }) {
  const color = validityColor(cert.daysRemaining);
  const from = new Date(cert.validFrom).getTime();
  const to = new Date(cert.validTo).getTime();
  const now = Date.now();
  const pct = Math.max(0, Math.min(100, (now - from) / (to - from) * 100));
  const label = cert.daysRemaining < 0 ? "EXPIRED" : cert.daysRemaining <= 30 ? "EXPIRING SOON" : "VALID";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...S.card, display: "flex", flexDirection: "column", gap: 8 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 700, color, letterSpacing: "0.08em" }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color, fontFamily: '"JetBrains Mono",monospace' }, children: cert.daysRemaining < 0 ? `${Math.abs(cert.daysRemaining)} days ago` : `${cert.daysRemaining} days remaining` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", borderRadius: 3, background: color, width: `${pct}%`, boxShadow: `0 0 8px ${color}66`, transition: "width 0.5s ease" } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(cert.validFrom) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(cert.validTo) })
    ] })
  ] });
}
function SANChips({ sans }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: sans.map((san, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 4, padding: "2px 8px", fontSize: 11, color: ACCENT, fontFamily: '"JetBrains Mono",monospace' }, children: san }, i)) });
}
function CertResult({ cert }) {
  const copy = (s) => navigator.clipboard.writeText(s);
  const pkLabel = `${cert.publicKey?.algorithm}${cert.publicKey?.bits ? ` ${cert.publicKey.bits}-bit` : cert.publicKey?.curve ? ` (${cert.publicKey.curve})` : ""}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12, padding: "14px 16px", overflowY: "auto", flex: 1 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ValidityBar, { cert }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.card, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: ACCENT, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Common Name", value: cert.subject?.CN || "—" }),
          cert.subject?.O && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Organization", value: cert.subject.O }),
          cert.subject?.C && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Country", value: cert.subject.C })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.card, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#bb88ff", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Issuer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Common Name", value: cert.issuer?.CN || "—" }),
          cert.issuer?.O && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Organization", value: cert.issuer.O }),
          cert.issuer?.C && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Country", value: cert.issuer.C })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.card, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Technical Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Signature Algorithm", value: cert.signatureAlgorithm, mono: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Public Key", value: pkLabel, mono: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Serial Number", value: cert.serialNumber, mono: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Certificate Authority", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: cert.isCA ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${cert.isCA ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 4, padding: "1px 7px", fontSize: 11, color: cert.isCA ? ACCENT : "rgba(255,255,255,0.4)" }, children: cert.isCA ? "Yes" : "No" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.card, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Fingerprint SHA-256" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { style: { fontSize: 11, fontFamily: '"JetBrains Mono",monospace', color: "rgba(255,255,255,0.7)", wordBreak: "break-all", flex: 1 }, children: cert.fingerprints?.sha256 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => copy(cert.fingerprints?.sha256), style: { fontSize: 11, padding: "4px 10px", flexShrink: 0 }, children: "Copy" })
      ] }),
      cert.fingerprints?.sha1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: '"JetBrains Mono",monospace' }, children: [
        "SHA-1: ",
        cert.fingerprints.sha1
      ] })
    ] }),
    cert.sans?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.card, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }, children: [
        "Subject Alternative Names (",
        cert.sans.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SANChips, { sans: cert.sans })
    ] })
  ] });
}
function CertInspectorApp() {
  const [activeTab, setActiveTab] = reactExports.useState("domain");
  const [host, setHost] = reactExports.useState("");
  const [port, setPort] = reactExports.useState("443");
  const [pem, setPem] = reactExports.useState("");
  const [cert, setCert] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const inspect = reactExports.useCallback(async () => {
    if (!host.trim()) return;
    setLoading(true);
    setError(null);
    setCert(null);
    try {
      const res = await ipc?.cert?.inspect?.(host.trim(), parseInt(port) || 443);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setCert(res);
    } catch (e) {
      setError(e.message || "Inspection failed");
    } finally {
      setLoading(false);
    }
  }, [host, port]);
  const decodePem = reactExports.useCallback(async () => {
    if (!pem.trim()) return;
    setLoading(true);
    setError(null);
    setCert(null);
    try {
      const res = await ipc?.cert?.parsePem?.(pem.trim());
      if (res?.error) {
        setError(res.error);
        return;
      }
      setCert(res);
    } catch (e) {
      setError(e.message || "Decode failed");
    } finally {
      setLoading(false);
    }
  }, [pem]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 14px", display: "flex", gap: 2 }, children: ["domain", "pem"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab(t), style: { padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, color: activeTab === t ? ACCENT : "rgba(255,255,255,0.45)", borderBottom: activeTab === t ? `2px solid ${ACCENT}` : "2px solid transparent", transition: "all 0.15s" }, children: t === "domain" ? "Domain" : "PEM Paste" }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: [
      activeTab === "domain" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: host, onChange: (e) => setHost(e.target.value), onKeyDown: (e) => e.key === "Enter" && inspect(), placeholder: "example.com", style: { ...S.input, flex: 1 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: port, onChange: (e) => setPort(e.target.value), placeholder: "443", style: { ...S.input, width: 70 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: inspect, disabled: loading || !host.trim(), style: { fontSize: 12 }, children: loading ? "Inspecting..." : "Inspect" })
      ] }),
      activeTab === "pem" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: pem, onChange: (e) => setPem(e.target.value), placeholder: "-----BEGIN CERTIFICATE-----", style: { ...S.input, flex: 1, height: 80, resize: "none", fontFamily: '"JetBrains Mono",monospace', fontSize: 11, lineHeight: 1.5 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: decodePem, disabled: loading || !pem.trim(), style: { fontSize: 12, alignSelf: "flex-end" }, children: loading ? "Decoding..." : "Decode" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { margin: "14px 16px", padding: "12px 16px", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.25)", borderRadius: 8, color: "#ff6680", fontSize: 12, fontFamily: '"JetBrains Mono",monospace' }, children: error }),
    !cert && !error && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "rgba(255,255,255,0.25)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "44", height: "44", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13 }, children: "Enter a domain or paste a PEM certificate" })
    ] }),
    cert && /* @__PURE__ */ jsxRuntimeExports.jsx(CertResult, { cert })
  ] });
}
export {
  CertInspectorApp as default
};
