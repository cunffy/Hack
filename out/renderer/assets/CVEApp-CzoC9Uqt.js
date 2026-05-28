import { r as reactExports, j as jsxRuntimeExports } from "./index-wTcdmNuH.js";
const ACCENT = "#00d4ff";
const ipc = window.cryogram;
const SEVERITY_COLORS = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
  NONE: "#6b7280"
};
function severityColor(s) {
  return SEVERITY_COLORS[s?.toUpperCase()] ?? "#6b7280";
}
function getCvss(cve) {
  const m31 = cve.metrics?.cvssMetricV31?.[0];
  if (m31) return { score: m31.cvssData.baseScore, severity: m31.cvssData.baseSeverity, vector: m31.cvssData.vectorString };
  const m30 = cve.metrics?.cvssMetricV30?.[0];
  if (m30) return { score: m30.cvssData.baseScore, severity: m30.cvssData.baseSeverity, vector: m30.cvssData.vectorString };
  const m2 = cve.metrics?.cvssMetricV2?.[0];
  if (m2) return { score: m2.cvssData.baseScore, severity: m2.baseSeverity ?? "NONE" };
  return null;
}
function getDescription(cve) {
  return cve.descriptions.find((d) => d.lang === "en")?.value ?? cve.descriptions[0]?.value ?? "—";
}
function formatDate(s) {
  try {
    return new Date(s).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return s;
  }
}
function extractCpes(cve) {
  const cpes = [];
  const walk = (obj) => {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      obj.forEach(walk);
      return;
    }
    if (obj.criteria && obj.vulnerable !== false) cpes.push(obj.criteria);
    Object.values(obj).forEach(walk);
  };
  walk(cve.configurations);
  return [...new Set(cpes)];
}
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
    padding: "7px 16px",
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
    color: "rgba(255,255,255,0.65)",
    fontSize: 11,
    cursor: "pointer"
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8,
    padding: "11px 13px",
    cursor: "pointer",
    marginBottom: 7
  },
  label: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 5
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
  }
};
function Spinner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }, children: [
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
function CvssBadge({ score, severity, large }) {
  const color = severityColor(severity);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: large ? "4px 10px" : "2px 7px",
    borderRadius: large ? 6 : 4,
    background: `${color}18`,
    border: `1px solid ${color}40`,
    color,
    fontSize: large ? 13 : 10,
    fontWeight: 700,
    ...S.mono,
    flexShrink: 0
  }, children: [
    severity,
    " ",
    score.toFixed(1)
  ] });
}
function CveListItem({ cve, selected, onClick }) {
  const cvss = getCvss(cve);
  const desc = getDescription(cve);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick,
      style: {
        ...S.card,
        borderColor: selected ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.07)",
        background: selected ? "rgba(0,212,255,0.06)" : "rgba(255,255,255,0.04)",
        transition: "all 0.12s ease"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...S.mono, fontSize: 12, fontWeight: 700, color: ACCENT, flexShrink: 0 }, children: cve.id }),
          cvss && /* @__PURE__ */ jsxRuntimeExports.jsx(CvssBadge, { score: cvss.score, severity: cvss.severity })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 11,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          marginBottom: 5
        }, children: desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.25)" }, children: formatDate(cve.published) })
      ]
    }
  );
}
function CveDetail({ cve, onBookmark, isBookmarked }) {
  const [copied, setCopied] = reactExports.useState(false);
  const cvss = getCvss(cve);
  const desc = getDescription(cve);
  const cpes = extractCpes(cve);
  const cwes = (cve.weaknesses ?? []).flatMap((w) => w.description.filter((d) => d.lang === "en").map((d) => d.value));
  const refs = cve.references ?? [];
  const copy = () => {
    navigator.clipboard.writeText(cve.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...S.mono, fontSize: 20, fontWeight: 800, color: ACCENT, letterSpacing: "-0.02em", marginBottom: 6 }, children: cve.id }),
        cvss && /* @__PURE__ */ jsxRuntimeExports.jsx(CvssBadge, { score: cvss.score, severity: cvss.severity, large: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 7, flexShrink: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: S.btnGhost, onClick: copy, children: copied ? "✓ Copied" : "Copy ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            style: { ...S.btnGhost, color: isBookmarked ? "#ffaa00" : void 0, borderColor: isBookmarked ? "rgba(255,170,0,0.3)" : void 0, background: isBookmarked ? "rgba(255,170,0,0.08)" : void 0 },
            onClick: onBookmark,
            children: isBookmarked ? "★ Saved" : "☆ Bookmark"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }, children: [
      { label: "Published", val: formatDate(cve.published) },
      { label: "Last Modified", val: formatDate(cve.lastModified) },
      { label: "Status", val: cve.vulnStatus ?? "—" },
      { label: "Source", val: cve.sourceIdentifier ?? "—" }
    ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "8px 12px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.75)" }, children: val })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "12px 14px" }, children: desc })
    ] }),
    cvss?.vector && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: "CVSS Vector" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...S.mono, fontSize: 11, color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "8px 12px", wordBreak: "break-all" }, children: cvss.vector })
    ] }),
    cwes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: "Weaknesses (CWE)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: cwes.map((cwe) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          onClick: () => window.open(`https://cwe.mitre.org/data/definitions/${cwe.replace("CWE-", "")}.html`, "_blank"),
          style: { ...S.mono, fontSize: 11, padding: "3px 9px", background: "rgba(187,136,255,0.1)", border: "1px solid rgba(187,136,255,0.25)", borderRadius: 4, color: "#bb88ff", cursor: "pointer" },
          children: cwe
        },
        cwe
      )) })
    ] }),
    cpes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: S.label, children: "Affected Products (first 10 CPEs)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
        cpes.slice(0, 10).map((cpe, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...S.mono, fontSize: 10, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 5, padding: "5px 10px", wordBreak: "break-all" }, children: cpe }, i)),
        cpes.length > 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.3)" }, children: [
          "+",
          cpes.length - 10,
          " more"
        ] })
      ] })
    ] }),
    refs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.label, children: [
        "References (",
        refs.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 5 }, children: refs.map((ref, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              window.open(ref.url, "_blank");
            },
            style: { ...S.mono, fontSize: 11, color: ACCENT, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 },
            children: ref.url
          }
        ),
        ref.tags && ref.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, padding: "1px 5px", background: "rgba(255,255,255,0.07)", borderRadius: 3, color: "rgba(255,255,255,0.4)", flexShrink: 0 }, children: ref.tags[0] })
      ] }, i)) })
    ] })
  ] });
}
const CURRENT_YEAR = (/* @__PURE__ */ new Date()).getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => String(CURRENT_YEAR - i));
const SEVERITY_OPTIONS = ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
function CVEApp() {
  const [keyword, setKeyword] = reactExports.useState("");
  const [cveId, setCveId] = reactExports.useState("");
  const [severity, setSeverity] = reactExports.useState("All");
  const [year, setYear] = reactExports.useState("All");
  const [offset, setOffset] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [results, setResults] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [detailLoading, setDetailLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState(null);
  const [bookmarks, setBookmarks] = reactExports.useState([]);
  const [leftTab, setLeftTab] = reactExports.useState("results");
  const [bookmarkedCves, setBookmarkedCves] = reactExports.useState([]);
  const [searched, setSearched] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const load = async () => {
      try {
        const raw = await ipc?.settings?.get("cve.bookmarks");
        setBookmarks(raw ? JSON.parse(raw) : []);
      } catch {
      }
    };
    load();
  }, []);
  const saveBookmarks = reactExports.useCallback(async (ids) => {
    setBookmarks(ids);
    ipc?.settings?.set("cve.bookmarks", JSON.stringify(ids)).catch(() => {
    });
  }, []);
  const toggleBookmark = reactExports.useCallback(async (cveItem) => {
    setBookmarks((prev) => {
      const next = prev.includes(cveItem.id) ? prev.filter((id) => id !== cveItem.id) : [...prev, cveItem.id];
      saveBookmarks(next);
      return next;
    });
    setBookmarkedCves((prev) => {
      if (prev.find((c) => c.id === cveItem.id)) return prev.filter((c) => c.id !== cveItem.id);
      return [...prev, cveItem];
    });
  }, [saveBookmarks]);
  const buildUrl = (q, idSearch, off) => {
    const base = "https://services.nvd.nist.gov/rest/json/cves/2.0";
    if (idSearch.trim()) return `${base}?cveId=${encodeURIComponent(idSearch.trim())}`;
    const params = new URLSearchParams({ resultsPerPage: "20", startIndex: String(off) });
    if (q.trim()) params.set("keywordSearch", q.trim());
    if (severity !== "All") params.set("cvssV3Severity", severity);
    if (year !== "All") {
      params.set("pubStartDate", `${year}-01-01T00:00:00.000`);
      params.set("pubEndDate", `${year}-12-31T23:59:59.999`);
    }
    return `${base}?${params}`;
  };
  const doSearch = reactExports.useCallback(async (off = 0) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setOffset(off);
    try {
      const url = buildUrl(keyword, cveId, off);
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limited by NVD API. Please wait and try again.");
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      const items = json.vulnerabilities?.map((v) => v.cve) ?? [];
      setResults(items);
      setTotal(json.totalResults ?? 0);
    } catch (e) {
      setError(e?.message ?? "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, cveId, severity, year]);
  const selectCve = reactExports.useCallback(async (cve) => {
    setDetailLoading(true);
    setSelected(cve);
    try {
      const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${encodeURIComponent(cve.id)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const full = json.vulnerabilities?.[0]?.cve;
      if (full) setSelected(full);
    } catch {
    } finally {
      setDetailLoading(false);
    }
  }, []);
  const loadBookmarkedCves = reactExports.useCallback(async () => {
    if (bookmarkedCves.length > 0) return;
    if (bookmarks.length === 0) return;
    const fetched = [];
    for (const id of bookmarks.slice(0, 5)) {
      try {
        const res = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${encodeURIComponent(id)}`);
        if (res.ok) {
          const json = await res.json();
          const c = json.vulnerabilities?.[0]?.cve;
          if (c) fetched.push(c);
        }
      } catch {
      }
    }
    setBookmarkedCves(fetched);
  }, [bookmarks, bookmarkedCves.length]);
  reactExports.useEffect(() => {
    if (leftTab === "bookmarks") loadBookmarkedCves();
  }, [leftTab, loadBookmarkedCves]);
  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const displayList = leftTab === "bookmarks" ? bookmarkedCves : results;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      gap: 8,
      padding: "10px 14px",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      flexShrink: 0,
      flexWrap: "wrap",
      alignItems: "center",
      background: "rgba(255,255,255,0.02)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          style: { ...S.input, flex: "2 1 140px", minWidth: 100 },
          placeholder: "Keyword (e.g. log4j, apache)",
          value: keyword,
          onChange: (e) => setKeyword(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && doSearch()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          style: { ...S.input, flex: "1 1 120px", minWidth: 100 },
          placeholder: "CVE-2024-1234",
          value: cveId,
          onChange: (e) => setCveId(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && doSearch()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { style: { ...S.select, flex: "0 0 110px" }, value: severity, onChange: (e) => setSeverity(e.target.value), children: SEVERITY_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s === "All" ? "All Severities" : s }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { style: { ...S.select, flex: "0 0 90px" }, value: year, onChange: (e) => setYear(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All", children: "All Years" }),
        YEAR_OPTIONS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, children: y }, y))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { ...S.btn, flexShrink: 0 }, onClick: () => doSearch(0), disabled: loading, children: loading ? "Searching…" : "Search" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 300, minWidth: 300, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, background: "rgba(255,255,255,0.02)" }, children: ["results", "bookmarks"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setLeftTab(t),
            style: {
              flex: 1,
              background: "none",
              border: "none",
              borderBottom: leftTab === t ? `2px solid ${ACCENT}` : "2px solid transparent",
              color: leftTab === t ? ACCENT : "rgba(255,255,255,0.4)",
              padding: "9px 0",
              fontSize: 11,
              fontWeight: leftTab === t ? 600 : 400,
              cursor: "pointer",
              textTransform: "capitalize",
              fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif'
            },
            children: t === "bookmarks" ? `Bookmarks (${bookmarks.length})` : `Results ${total > 0 ? `(${total.toLocaleString()})` : ""}`
          },
          t
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "10px 10px 0" }, children: [
          leftTab === "results" && loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
          leftTab === "results" && error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "12px 8px", color: "#ff4466", fontSize: 11, lineHeight: 1.5 }, children: error }),
          leftTab === "results" && !loading && !error && !searched && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "40px 12px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, lineHeight: 2 }, children: "Search CVEs from the NVD database" }),
          leftTab === "results" && !loading && !error && searched && results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 30, textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12 }, children: "No results found." }),
          leftTab === "bookmarks" && bookmarks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 30, textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, lineHeight: 2 }, children: "No bookmarks yet. Star a CVE to save it here." }),
          displayList.map((cve) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CveListItem,
            {
              cve,
              selected: selected?.id === cve.id,
              onClick: () => selectCve(cve)
            },
            cve.id
          ))
        ] }),
        leftTab === "results" && totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "8px 10px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          flexShrink: 0,
          background: "rgba(255,255,255,0.02)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              style: { ...S.btnGhost, padding: "4px 10px", opacity: currentPage <= 1 ? 0.4 : 1 },
              disabled: currentPage <= 1 || loading,
              onClick: () => doSearch(offset - PAGE_SIZE),
              children: "←"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: [
            currentPage,
            "/",
            totalPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              style: { ...S.btnGhost, padding: "4px 10px", opacity: currentPage >= totalPages ? 0.4 : 1 },
              disabled: currentPage >= totalPages || loading,
              onClick: () => doSearch(offset + PAGE_SIZE),
              children: "→"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
        detailLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
        !detailLoading && !selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 12, opacity: 0.4 }, children: "CVE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13 }, children: "Select a CVE to view full details" })
        ] }),
        !detailLoading && selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          CveDetail,
          {
            cve: selected,
            isBookmarked: bookmarks.includes(selected.id),
            onBookmark: () => toggleBookmark(selected)
          }
        )
      ] })
    ] })
  ] });
}
export {
  CVEApp as default
};
