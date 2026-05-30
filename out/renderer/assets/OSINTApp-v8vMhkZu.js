import { r as reactExports, j as jsxRuntimeExports } from "./index-BvGpDqej.js";
const ACCENT = "#00d4ff";
const S = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    background: "rgba(8,12,20,0.8)",
    color: "rgba(255,255,255,0.85)",
    fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
    fontSize: 13
  },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "7px 12px",
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    outline: "none",
    fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif'
  },
  btn: {
    background: ACCENT,
    border: "none",
    borderRadius: 6,
    padding: "7px 18px",
    color: "#000",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
    letterSpacing: "0.03em"
  },
  btnGhost: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    padding: "5px 12px",
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    cursor: "pointer"
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8,
    padding: "14px 16px"
  },
  label: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 4
  },
  mono: {
    fontFamily: '"JetBrains Mono",monospace'
  },
  select: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "7px 10px",
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    outline: "none",
    cursor: "pointer"
  },
  textarea: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "10px 12px",
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    outline: "none",
    resize: "none",
    fontFamily: '"JetBrains Mono",monospace',
    lineHeight: 1.5
  }
};
function Spinner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: 26,
      height: 26,
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.07)",
      borderTopColor: ACCENT,
      animation: "spin 0.7s linear infinite"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg) } }` })
  ] });
}
function ErrorMsg({ msg }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "14px 16px", color: "#ff4466", fontSize: 12, background: "rgba(255,68,102,0.06)", border: "1px solid rgba(255,68,102,0.15)", borderRadius: 7 }, children: msg });
}
function EmptyState({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 48, textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, lineHeight: 2 }, children: text });
}
function CopyBtn({ text }) {
  const [copied, setCopied] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      style: { ...S.btnGhost, padding: "2px 8px", fontSize: 10 },
      onClick: () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      children: copied ? "✓" : "Copy"
    }
  );
}
function formatDate(s) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return s;
  }
}
function isIP(s) {
  return /^[\d.]+$/.test(s) || /^[0-9a-f:]+$/i.test(s);
}
function WhoisTab() {
  const [input, setInput] = reactExports.useState("");
  const [data, setData] = reactExports.useState(null);
  const [raw, setRaw] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const lookup = reactExports.useCallback(async () => {
    const q = input.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const url = isIP(q) ? `https://rdap.arin.net/registry/ip/${encodeURIComponent(q)}` : `https://rdap.verisign.com/com/v1/domain/${encodeURIComponent(q)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e?.message ?? "Lookup failed");
    } finally {
      setLoading(false);
    }
  }, [input]);
  const getEvent = (action) => data?.events?.find((e) => e.eventAction === action)?.eventDate ?? "—";
  const getEntityField = (role, fieldName) => {
    const ent = data?.entities?.find((e) => e.roles?.includes(role));
    if (!ent?.vcardArray) return "—";
    const fields = ent.vcardArray[1] ?? [];
    const f = fields.find(([name]) => name === fieldName);
    return f ? Array.isArray(f[3]) ? f[3].join(" ") : String(f[3]) : "—";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14, height: "100%", overflowY: "auto", padding: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          style: { ...S.input, flex: 1 },
          placeholder: "example.com or 8.8.8.8",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && lookup()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: S.btn, onClick: lookup, disabled: loading, children: "Lookup" })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMsg, { msg: error }),
    !loading && !error && !data && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "Enter a domain or IP address to retrieve WHOIS/RDAP registration data." }),
    data && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          style: { ...S.btnGhost, background: raw ? "rgba(0,212,255,0.1)" : void 0, color: raw ? ACCENT : void 0 },
          onClick: () => setRaw((r) => !r),
          children: raw ? "Parsed View" : "Raw JSON"
        }
      ) }),
      raw ? /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: {
        ...S.mono,
        fontSize: 11,
        padding: 14,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 7,
        overflowX: "auto",
        color: "rgba(255,255,255,0.7)",
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      }, children: JSON.stringify(data, null, 2) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.card, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 700, color: ACCENT, marginBottom: 12, ...S.mono }, children: data.ldhName ?? data.name ?? input }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }, children: [
            { label: "Handle", val: data.handle ?? "—" },
            { label: "Registrar", val: getEntityField("registrar", "fn") },
            { label: "Registrant", val: getEntityField("registrant", "fn") },
            { label: "Created", val: formatDate(getEvent("registration")) },
            { label: "Updated", val: formatDate(getEvent("last changed")) },
            { label: "Expires", val: formatDate(getEvent("expiration")) },
            { label: "Country", val: data.country ?? getEntityField("registrant", "adr") },
            { label: "Status", val: Array.isArray(data.status) ? data.status.join(", ") : data.status ?? "—" }
          ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.8)" }, children: val })
          ] }, label)) })
        ] }),
        data.nameservers && data.nameservers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.card, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: "Nameservers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }, children: data.nameservers.map((ns) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...S.mono, fontSize: 12, color: "rgba(255,255,255,0.75)" }, children: ns.ldhName }, ns.ldhName)) })
        ] })
      ] })
    ] })
  ] });
}
const DNS_TYPE_NAMES = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  12: "PTR",
  15: "MX",
  16: "TXT",
  28: "AAAA",
  33: "SRV"
};
function DnsTab() {
  const [domain, setDomain] = reactExports.useState("");
  const [type, setType] = reactExports.useState("A");
  const [records, setRecords] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [queried, setQueried] = reactExports.useState(false);
  const lookup = reactExports.useCallback(async () => {
    const q = domain.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setRecords([]);
    setQueried(true);
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.Status !== 0) throw new Error(`DNS error code ${json.Status}`);
      setRecords(json.Answer ?? json.Authority ?? []);
    } catch (e) {
      setError(e?.message ?? "DNS lookup failed");
    } finally {
      setLoading(false);
    }
  }, [domain, type]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14, height: "100%", overflowY: "auto", padding: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          style: { ...S.input, flex: 1 },
          placeholder: "domain.com",
          value: domain,
          onChange: (e) => setDomain(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && lookup()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { style: { ...S.select, minWidth: 80 }, value: type, onChange: (e) => setType(e.target.value), children: ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA", "PTR"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: S.btn, onClick: lookup, disabled: loading, children: "Resolve" })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMsg, { msg: error }),
    !loading && !error && !queried && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "Enter a domain name and select a record type to perform a DNS lookup." }),
    !loading && !error && queried && records.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "No records found." }),
    !loading && records.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { background: "rgba(255,255,255,0.04)" }, children: ["Name", "TTL", "Type", "Value"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "8px 14px", textAlign: "left", fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: records.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px 14px", ...S.mono, fontSize: 11, color: "rgba(255,255,255,0.6)" }, children: r.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { padding: "8px 14px", color: "rgba(255,255,255,0.4)", ...S.mono, fontSize: 11 }, children: [
          r.TTL,
          "s"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px 14px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, padding: "2px 6px", background: "rgba(0,212,255,0.1)", color: ACCENT, border: "1px solid rgba(0,212,255,0.2)", borderRadius: 4, ...S.mono }, children: DNS_TYPE_NAMES[r.type] ?? String(r.type) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px 14px", ...S.mono, fontSize: 11, color: "rgba(255,255,255,0.85)", wordBreak: "break-all" }, children: r.data })
      ] }, i)) })
    ] }) })
  ] });
}
function IpInfoTab() {
  const [input, setInput] = reactExports.useState("");
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const lookup = reactExports.useCallback(async () => {
    const q = input.trim() || "json";
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`https://ipapi.co/${encodeURIComponent(q)}/json/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.reason ?? "IP lookup failed");
      setData(json);
    } catch (e) {
      setError(e?.message ?? "Lookup failed");
    } finally {
      setLoading(false);
    }
  }, [input]);
  const fields = data ? [
    ["IP Address", data.ip],
    ["ASN", data.asn],
    ["Organization", data.org],
    ["City", data.city],
    ["Region", data.region ? `${data.region} (${data.region_code})` : void 0],
    ["Country", data.country_name ? `${data.country_name} (${data.country})` : void 0],
    ["Timezone", data.timezone],
    ["Latitude", data.latitude?.toString()],
    ["Longitude", data.longitude?.toString()],
    ["EU Member", data.is_eu != null ? String(data.is_eu) : void 0],
    ["Bogon/Reserved", data.bogon != null ? String(data.bogon) : void 0]
  ] : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14, height: "100%", overflowY: "auto", padding: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          style: { ...S.input, flex: 1 },
          placeholder: "IP address (leave blank for your IP)",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && lookup()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: S.btn, onClick: lookup, disabled: loading, children: "Lookup" })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMsg, { msg: error }),
    !loading && !error && !data && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "Enter an IP address to get geolocation, ASN, and network information." }),
    data && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.card, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: ACCENT, marginBottom: 14, ...S.mono }, children: data.ip }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }, children: fields.filter(([, v]) => v != null && v !== "undefined").map(([label, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: label === "Bogon/Reserved" && val === "true" ? "#ffaa00" : "rgba(255,255,255,0.8)" }, children: val })
        ] }, label)) })
      ] }),
      data.latitude != null && data.longitude != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: "Coordinates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { ...S.mono, fontSize: 12, color: "rgba(255,255,255,0.75)" }, children: [
            data.latitude.toFixed(6),
            ", ",
            data.longitude.toFixed(6)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            style: S.btnGhost,
            onClick: () => window.open(`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}&zoom=12`, "_blank"),
            children: "View on Map ↗"
          }
        )
      ] })
    ] })
  ] });
}
function SubdomainsTab() {
  const [domain, setDomain] = reactExports.useState("");
  const [subdomains, setSubdomains] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [searched, setSearched] = reactExports.useState(false);
  const find = reactExports.useCallback(async () => {
    const q = domain.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setSubdomains([]);
    setSearched(true);
    try {
      const res = await fetch(`https://crt.sh/?q=%25.${encodeURIComponent(q)}&output=json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const names = /* @__PURE__ */ new Set();
      for (const entry of json) {
        for (const name of entry.name_value.split("\n")) {
          const n = name.trim().toLowerCase();
          if (n && (n.endsWith(`.${q.toLowerCase()}`) || n === q.toLowerCase())) {
            if (!n.startsWith("*.")) names.add(n);
          }
        }
      }
      setSubdomains(Array.from(names).sort());
    } catch (e) {
      setError(e?.message ?? "crt.sh lookup failed");
    } finally {
      setLoading(false);
    }
  }, [domain]);
  const exportTxt = () => {
    const blob = new Blob([subdomains.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${domain}-subdomains.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14, height: "100%", overflow: "hidden", padding: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, flexShrink: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          style: { ...S.input, flex: 1 },
          placeholder: "example.com",
          value: domain,
          onChange: (e) => setDomain(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && find()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: S.btn, onClick: find, disabled: loading, children: "Find" })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMsg, { msg: error }),
    !loading && !error && !searched && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "Enumerate subdomains via certificate transparency logs (crt.sh)." }),
    !loading && !error && searched && subdomains.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { text: "No subdomains found in certificate transparency logs." }),
    !loading && subdomains.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)" }, children: [
          subdomains.length,
          " unique subdomain",
          subdomains.length !== 1 ? "s" : "",
          " found"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: S.btnGhost, onClick: exportTxt, children: "Export .txt" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", display: "flex", flexWrap: "wrap", gap: 7, alignContent: "flex-start" }, children: subdomains.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5, padding: "3px 4px 3px 9px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...S.mono, fontSize: 11, color: "rgba(255,255,255,0.75)" }, children: sub }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CopyBtn, { text: sub })
      ] }, sub)) })
    ] })
  ] });
}
function parseEmailHeaders(rawText) {
  const lines = rawText.replace(/\r\n/g, "\n").split("\n");
  const unfolded = [];
  for (const line of lines) {
    if (/^\s+/.test(line) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += " " + line.trim();
    } else {
      unfolded.push(line);
    }
  }
  const getHeader = (name) => {
    const re = new RegExp(`^${name}:\\s*(.+)$`, "i");
    const found = unfolded.find((l) => re.test(l));
    return found ? found.replace(re, "$1").trim() : void 0;
  };
  const hops = [];
  for (const line of unfolded) {
    if (/^Received:/i.test(line)) {
      const body = line.replace(/^Received:\s*/i, "");
      const byMatch = body.match(/from\s+([^\s;]+)/);
      const dateMatch = body.match(/;\s*(.+)$/);
      const server = byMatch?.[1] ?? body.slice(0, 40);
      const timestamp = dateMatch?.[1]?.trim() ?? "";
      const suspicious = /fail|reject|spam|blacklist/i.test(body);
      hops.push({ server, timestamp, raw: body, suspicious });
    }
  }
  const spfLine = unfolded.find((l) => /^Received-SPF:/i.test(l) || /spf=/i.test(l));
  const dkimLine = unfolded.find((l) => /DKIM-Signature/i.test(l) || /dkim=/i.test(l));
  const dmarcLine = unfolded.find((l) => /dmarc=/i.test(l));
  const extractResult = (line) => {
    if (!line) return void 0;
    const m = line.match(/\b(pass|fail|softfail|neutral|none|temperror|permerror)\b/i);
    return m?.[1]?.toUpperCase();
  };
  return {
    from: getHeader("From"),
    to: getHeader("To"),
    subject: getHeader("Subject"),
    messageId: getHeader("Message-ID"),
    originatingIp: getHeader("X-Originating-IP") ?? getHeader("X-Forwarded-For"),
    spf: extractResult(spfLine),
    dkim: extractResult(dkimLine),
    dmarc: extractResult(dmarcLine),
    hops: hops.reverse()
  };
}
function authBadge(label, val) {
  if (!val) return null;
  const pass = val === "PASS";
  const fail = ["FAIL", "SOFTFAIL"].includes(val);
  const color = pass ? "#00ff88" : fail ? "#ff4466" : "#ffaa00";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, padding: "2px 8px", borderRadius: 4, background: `${color}18`, color, border: `1px solid ${color}33`, fontWeight: 700, ...S.mono }, children: [
    label,
    ": ",
    val
  ] });
}
function EmailHeadersTab() {
  const [rawInput, setRawInput] = reactExports.useState("");
  const [parsed, setParsed] = reactExports.useState(null);
  const analyze = () => {
    if (!rawInput.trim()) return;
    setParsed(parseEmailHeaders(rawInput));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12, height: "100%", overflow: "hidden", padding: 16 }, children: !parsed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        style: { ...S.textarea, flex: 1, minHeight: 200 },
        placeholder: "Paste raw email headers here...\n\nReceived: from mail.example.com...\nFrom: sender@example.com\nTo: recipient@example.com\n...",
        value: rawInput,
        onChange: (e) => setRawInput(e.target.value)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { ...S.btn, alignSelf: "flex-start" }, onClick: analyze, disabled: !rawInput.trim(), children: "Analyze Headers" })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { ...S.btnGhost, alignSelf: "flex-start" }, onClick: () => setParsed(null), children: "← Paste New Headers" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.card, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 12 }, children: [
        ["From", parsed.from],
        ["To", parsed.to],
        ["Subject", parsed.subject],
        ["Message-ID", parsed.messageId],
        ["Originating IP", parsed.originatingIp]
      ].filter(([, v]) => v).map(([label, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.8)", ...S.mono, wordBreak: "break-all" }, children: val })
      ] }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
        authBadge("SPF", parsed.spf),
        authBadge("DKIM", parsed.dkim),
        authBadge("DMARC", parsed.dmarc)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...S.label, marginBottom: 10 }, children: [
        "Received Chain (",
        parsed.hops.length,
        " hops) — earliest first"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: parsed.hops.map((hop, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: 10,
            height: 10,
            borderRadius: "50%",
            flexShrink: 0,
            marginTop: 6,
            background: hop.suspicious ? "#ff4466" : i === parsed.hops.length - 1 ? ACCENT : "rgba(255,255,255,0.2)",
            boxShadow: hop.suspicious ? "0 0 6px rgba(255,68,102,0.5)" : i === parsed.hops.length - 1 ? `0 0 6px ${ACCENT}66` : void 0
          } }),
          i < parsed.hops.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, width: 1, background: "rgba(255,255,255,0.08)", marginTop: 2 } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          flex: 1,
          background: hop.suspicious ? "rgba(255,68,102,0.07)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${hop.suspicious ? "rgba(255,68,102,0.25)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 6,
          padding: "8px 12px",
          marginBottom: 8
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...S.mono, fontSize: 12, fontWeight: 600, color: hop.suspicious ? "#ff4466" : "rgba(255,255,255,0.85)" }, children: hop.server }),
            hop.suspicious && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#ff4466", fontWeight: 700, letterSpacing: "0.07em" }, children: "SUSPICIOUS" })
          ] }),
          hop.timestamp && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.35)", ...S.mono }, children: hop.timestamp })
        ] })
      ] }, i)) })
    ] })
  ] }) });
}
const TABS = [
  { id: "whois", label: "WHOIS" },
  { id: "dns", label: "DNS" },
  { id: "ipinfo", label: "IP Info" },
  { id: "subdomains", label: "Subdomains" },
  { id: "emailheaders", label: "Email Headers" }
];
function OSINTApp() {
  const [tab, setTab] = reactExports.useState("whois");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "flex",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(255,255,255,0.02)",
      flexShrink: 0,
      overflowX: "auto",
      scrollbarWidth: "none"
    }, children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setTab(t.id),
        style: {
          background: "none",
          border: "none",
          borderBottom: tab === t.id ? `2px solid ${ACCENT}` : "2px solid transparent",
          color: tab === t.id ? ACCENT : "rgba(255,255,255,0.45)",
          padding: "11px 18px",
          fontSize: 12,
          fontWeight: tab === t.id ? 600 : 400,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.15s ease",
          fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
          letterSpacing: "0.02em"
        },
        children: t.label
      },
      t.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }, children: [
      tab === "whois" && /* @__PURE__ */ jsxRuntimeExports.jsx(WhoisTab, {}),
      tab === "dns" && /* @__PURE__ */ jsxRuntimeExports.jsx(DnsTab, {}),
      tab === "ipinfo" && /* @__PURE__ */ jsxRuntimeExports.jsx(IpInfoTab, {}),
      tab === "subdomains" && /* @__PURE__ */ jsxRuntimeExports.jsx(SubdomainsTab, {}),
      tab === "emailheaders" && /* @__PURE__ */ jsxRuntimeExports.jsx(EmailHeadersTab, {})
    ] })
  ] });
}
export {
  OSINTApp as default
};
