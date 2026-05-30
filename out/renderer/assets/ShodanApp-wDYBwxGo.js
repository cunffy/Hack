import { r as reactExports, j as jsxRuntimeExports } from "./index-2Exxxd5V.js";
const ACCENT = "#00d4ff";
const S = {
  root: {
    display: "flex",
    height: "100%",
    overflow: "hidden",
    background: "rgba(8,12,20,0.8)",
    color: "rgba(255,255,255,0.85)",
    fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
    fontSize: 13
  },
  sidebar: {
    width: 260,
    minWidth: 260,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)",
    overflow: "hidden"
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "7px 10px",
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    outline: "none",
    width: "100%",
    fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif'
  },
  btn: {
    background: ACCENT,
    border: "none",
    borderRadius: 6,
    padding: "7px 14px",
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
    padding: "5px 10px",
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    cursor: "pointer"
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8,
    padding: "12px 14px",
    cursor: "pointer"
  },
  label: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 4
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    padding: "10px 14px 6px",
    borderTop: "1px solid rgba(255,255,255,0.05)"
  },
  mono: {
    fontFamily: '"JetBrains Mono",monospace'
  }
};
const ipc = window.cryogram;
const COUNTRY_FLAGS = {
  US: "🇺🇸",
  GB: "🇬🇧",
  DE: "🇩🇪",
  FR: "🇫🇷",
  CN: "🇨🇳",
  RU: "🇷🇺",
  JP: "🇯🇵",
  IN: "🇮🇳",
  BR: "🇧🇷",
  CA: "🇨🇦",
  AU: "🇦🇺",
  NL: "🇳🇱",
  KR: "🇰🇷",
  SG: "🇸🇬",
  HK: "🇭🇰",
  SE: "🇸🇪",
  NO: "🇳🇴",
  CH: "🇨🇭",
  IT: "🇮🇹",
  ES: "🇪🇸",
  PL: "🇵🇱",
  UA: "🇺🇦",
  TR: "🇹🇷",
  IR: "🇮🇷",
  MX: "🇲🇽",
  ZA: "🇿🇦",
  AR: "🇦🇷",
  PK: "🇵🇰"
};
function countryFlag(code) {
  if (!code) return "🌐";
  return COUNTRY_FLAGS[code.toUpperCase()] ?? "🌐";
}
function portColor(port) {
  if ([22, 23, 3389].includes(port)) return "#ff4466";
  if ([80, 443, 8080, 8443].includes(port)) return "#00d4ff";
  if ([21, 25, 110, 143, 587, 993, 995].includes(port)) return "#ffaa00";
  if ([3306, 5432, 27017, 6379, 5984].includes(port)) return "#bb88ff";
  return "#4488bb";
}
function formatDate(s) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return s;
  }
}
function Spinner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.08)",
      borderTopColor: ACCENT,
      animation: "spin 0.7s linear infinite"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg) } }` })
  ] });
}
function NoApiKey() {
  const open = () => {
    window.dispatchEvent(new CustomEvent("cryogram:openSettingsTab", { detail: "apikeys" }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 12,
    padding: "36px 44px",
    textAlign: "center",
    maxWidth: 380
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 14 }, children: "🔑" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 8 }, children: "Shodan API Key Required" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 22 }, children: [
      "To search the Shodan database, you need a valid API key. Register at ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: ACCENT }, children: "shodan.io" }),
      " to get one."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: S.btn, onClick: open, children: "Configure in Settings" })
  ] }) });
}
function HostCard({ host, selected, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick,
      style: {
        ...S.card,
        marginBottom: 8,
        borderColor: selected ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.07)",
        background: selected ? "rgba(0,212,255,0.06)" : "rgba(255,255,255,0.04)",
        transition: "all 0.15s ease"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...S.mono, fontSize: 15, fontWeight: 700, color: ACCENT, letterSpacing: "-0.02em" }, children: host.ip_str }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16 }, title: host.country_name ?? host.country_code, children: countryFlag(host.country_code) })
        ] }),
        host.hostnames && host.hostnames.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6, wordBreak: "break-all" }, children: [
          host.hostnames.slice(0, 3).join(", "),
          host.hostnames.length > 3 ? ` +${host.hostnames.length - 3}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 7 }, children: [
          (host.ports ?? []).slice(0, 12).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            ...S.mono,
            fontSize: 10,
            padding: "1px 6px",
            borderRadius: 3,
            background: `${portColor(p)}18`,
            color: portColor(p),
            border: `1px solid ${portColor(p)}33`
          }, children: p }, p)),
          (host.ports ?? []).length > 12 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", alignSelf: "center" }, children: [
            "+",
            host.ports.length - 12
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", display: "flex", flexDirection: "column", gap: 2 }, children: [
          host.org && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: host.org }),
          host.os && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ffaa00" }, children: [
            "OS: ",
            host.os
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.25)" }, children: formatDate(host.last_update) })
        ] })
      ]
    }
  );
}
function HostDetail({ ip, onClose }) {
  const [host, setHost] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setLoading(true);
    setError(null);
    ipc?.shodan?.host(ip).then((data) => setHost(data)).catch((e) => setError(e?.message ?? "Failed to load host")).finally(() => setLoading(false));
  }, [ip]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#ff4466", fontSize: 13 }, children: error });
  if (!host) return null;
  const allVulns = Array.from(/* @__PURE__ */ new Set([
    ...host.vulns ?? [],
    ...(host.data ?? []).flatMap((d) => d.vulns ? Object.keys(d.vulns) : [])
  ]));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "14px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { ...S.btnGhost, padding: "4px 10px" }, children: "← Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...S.mono, fontSize: 18, fontWeight: 700, color: ACCENT }, children: host.ip_str }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20 }, children: countryFlag(host.country_code) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)" }, children: host.country_name }),
      host.org && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.5)" }, children: host.org })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }, children: [
        { label: "ISP", val: host.isp },
        { label: "ASN", val: host.asn },
        { label: "OS", val: host.os ?? "—" },
        { label: "City", val: host.city ?? "—" },
        { label: "Region", val: host.region_code ?? "—" },
        { label: "Coordinates", val: host.latitude != null ? `${host.latitude?.toFixed(4)}, ${host.longitude?.toFixed(4)}` : "—" }
      ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "8px 12px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.75)" }, children: val ?? "—" })
      ] }, label)) }),
      host.hostnames && host.hostnames.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: "Hostnames" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: host.hostnames.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...S.mono, fontSize: 11, padding: "3px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, color: "rgba(255,255,255,0.75)" }, children: h }, h)) })
      ] }),
      host.tags && host.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: "Tags" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: host.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, padding: "2px 8px", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 10, color: ACCENT }, children: t }, t)) })
      ] }),
      allVulns.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.label, children: [
          "Vulnerabilities (",
          allVulns.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 5 }, children: allVulns.map((cve) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            onClick: () => window.open(`https://nvd.nist.gov/vuln/detail/${cve}`, "_blank"),
            style: { ...S.mono, fontSize: 11, padding: "3px 8px", background: "rgba(255,68,102,0.12)", border: "1px solid rgba(255,68,102,0.3)", borderRadius: 4, color: "#ff4466", cursor: "pointer" },
            children: cve
          },
          cve
        )) })
      ] }),
      host.data && host.data.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.label, children: [
          "Open Ports (",
          host.data.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { background: "rgba(255,255,255,0.04)" }, children: ["Port", "Protocol", "Service", "Banner"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "8px 12px", textAlign: "left", fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: h }, h)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: host.data.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "7px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...S.mono, color: portColor(entry.port), fontWeight: 700 }, children: entry.port }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "7px 12px", color: "rgba(255,255,255,0.5)", ...S.mono, fontSize: 11 }, children: entry.transport ?? "tcp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "7px 12px", color: "rgba(255,255,255,0.75)" }, children: [entry.product, entry.version].filter(Boolean).join(" ") || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "7px 12px", color: "rgba(255,255,255,0.35)", ...S.mono, fontSize: 10, maxWidth: 200 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }, children: entry.banner ? entry.banner.slice(0, 80) : "—" }) })
          ] }, `${entry.port}-${i}`)) })
        ] }) })
      ] })
    ] })
  ] });
}
function ShodanApp() {
  const [apiKey, setApiKey] = reactExports.useState(null);
  const [keyChecked, setKeyChecked] = reactExports.useState(false);
  const [query, setQuery] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  const [total, setTotal] = reactExports.useState(0);
  const [page, setPage] = reactExports.useState(1);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [selectedIp, setSelectedIp] = reactExports.useState(null);
  const [recentSearches, setRecentSearches] = reactExports.useState([]);
  const [savedSearches, setSavedSearches] = reactExports.useState([]);
  const [currentQuery, setCurrentQuery] = reactExports.useState("");
  reactExports.useEffect(() => {
    const check = async () => {
      try {
        const key = await ipc?.settings?.get("shodan.apiKey");
        setApiKey(key ?? null);
      } catch {
        setApiKey(null);
      }
      setKeyChecked(true);
    };
    check();
    const loadStored = async () => {
      try {
        const r = await ipc?.settings?.get("shodan.recentSearches");
        setRecentSearches(r ? JSON.parse(r) : []);
        const s = await ipc?.settings?.get("shodan.savedSearches");
        setSavedSearches(s ? JSON.parse(s) : []);
      } catch {
      }
    };
    loadStored();
  }, []);
  const addRecentSearch = reactExports.useCallback(async (q) => {
    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, 10);
      ipc?.settings?.set("shodan.recentSearches", JSON.stringify(next)).catch(() => {
      });
      return next;
    });
  }, []);
  const doSearch = reactExports.useCallback(async (q, pg = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedIp(null);
    setPage(pg);
    setCurrentQuery(q);
    try {
      const res = await ipc?.shodan?.search(q, pg);
      setResults(res?.matches ?? []);
      setTotal(res?.total ?? 0);
      await addRecentSearch(q);
    } catch (e) {
      setError(e?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  }, [addRecentSearch]);
  const saveCurrentSearch = async () => {
    if (!currentQuery) return;
    setSavedSearches((prev) => {
      const next = [currentQuery, ...prev.filter((s) => s !== currentQuery)].slice(0, 20);
      ipc?.settings?.set("shodan.savedSearches", JSON.stringify(next)).catch(() => {
      });
      return next;
    });
  };
  const removeSaved = async (q) => {
    setSavedSearches((prev) => {
      const next = prev.filter((s) => s !== q);
      ipc?.settings?.set("shodan.savedSearches", JSON.stringify(next)).catch(() => {
      });
      return next;
    });
  };
  const totalPages = Math.ceil(total / 10);
  if (!keyChecked) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.root, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) });
  if (!apiKey) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.root, children: /* @__PURE__ */ jsxRuntimeExports.jsx(NoApiKey, {}) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.sidebar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 12px 8px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, marginBottom: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            style: S.input,
            placeholder: 'apache city:"Berlin"',
            value: query,
            onChange: (e) => setQuery(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && doSearch(query)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              style: { ...S.btn, flex: 1, padding: "7px 0" },
              onClick: () => doSearch(query),
              disabled: loading,
              children: loading ? "Searching…" : "Search"
            }
          ),
          currentQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: S.btnGhost, onClick: saveCurrentSearch, title: "Save this search", children: "☆" })
        ] })
      ] }),
      savedSearches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.sectionTitle, children: "Saved Searches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowY: "auto", maxHeight: 140, padding: "2px 8px" }, children: savedSearches.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", borderRadius: 5, cursor: "pointer", marginBottom: 2 },
            onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)",
            onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: { flex: 1, fontSize: 11, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
                  onClick: () => {
                    setQuery(s);
                    doSearch(s);
                  },
                  children: s
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: { fontSize: 11, color: "rgba(255,255,255,0.25)", cursor: "pointer", flexShrink: 0 },
                  onClick: () => removeSaved(s),
                  children: "✕"
                }
              )
            ]
          },
          s
        )) })
      ] }),
      recentSearches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.sectionTitle, children: "Recent Searches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowY: "auto", flex: 1, padding: "2px 8px" }, children: recentSearches.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { display: "flex", alignItems: "center", padding: "4px 6px", borderRadius: 5, cursor: "pointer", marginBottom: 2 },
            onClick: () => {
              setQuery(s);
              doSearch(s);
            },
            onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)",
            onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginRight: 6 }, children: "↩" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: s })
            ]
          },
          s
        )) })
      ] }),
      recentSearches.length === 0 && savedSearches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.5 }, children: "Search Shodan's database of internet-connected devices" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.main, children: selectedIp ? /* @__PURE__ */ jsxRuntimeExports.jsx(HostDetail, { ip: selectedIp, onClose: () => setSelectedIp(null) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "10px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
        fontSize: 12,
        color: "rgba(255,255,255,0.45)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.7)", fontWeight: 600 }, children: [
          total.toLocaleString(),
          " results"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "for" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { ...S.mono, fontSize: 11, color: ACCENT }, children: [
          '"',
          currentQuery,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              style: { ...S.btnGhost, opacity: page <= 1 ? 0.4 : 1 },
              disabled: page <= 1,
              onClick: () => doSearch(currentQuery, page - 1),
              children: "←"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Page ",
            page,
            " of ",
            totalPages || 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              style: { ...S.btnGhost, opacity: page >= totalPages ? 0.4 : 1 },
              disabled: page >= totalPages,
              onClick: () => doSearch(currentQuery, page + 1),
              children: "→"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: 16 }, children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#ff4466", padding: 40, fontSize: 13 }, children: error }),
        !loading && !error && results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: 60, color: "rgba(255,255,255,0.2)", fontSize: 13, lineHeight: 2 }, children: currentQuery ? "No results found." : "Enter a search query to find internet-connected devices." }),
        !loading && results.map((host) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          HostCard,
          {
            host,
            selected: selectedIp === host.ip_str,
            onClick: () => setSelectedIp(host.ip_str)
          },
          host.ip_str
        ))
      ] }),
      results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "10px 16px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            style: { ...S.btnGhost, opacity: page <= 1 ? 0.4 : 1 },
            disabled: page <= 1 || loading,
            onClick: () => doSearch(currentQuery, page - 1),
            children: "← Prev"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)" }, children: [
          page,
          " / ",
          totalPages || 1
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            style: { ...S.btnGhost, opacity: page >= totalPages ? 0.4 : 1 },
            disabled: page >= totalPages || loading,
            onClick: () => doSearch(currentQuery, page + 1),
            children: "Next →"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  ShodanApp as default
};
