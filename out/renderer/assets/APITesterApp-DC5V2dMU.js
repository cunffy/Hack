import { r as reactExports, j as jsxRuntimeExports } from "./index-fqRzwrz8.js";
const ACCENT = "#00d4ff";
const ipc = window.cryogram;
const METHOD_COLORS = {
  GET: "#00ff88",
  POST: "#00d4ff",
  PUT: "#ffaa00",
  PATCH: "#bb88ff",
  DELETE: "#ff4466"
};
function genId() {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}
function statusColor(s) {
  if (s < 300) return "#00ff88";
  if (s < 400) return "#00d4ff";
  if (s < 500) return "#ffaa00";
  return "#ff4466";
}
function tryPretty(body) {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}
const S = {
  root: { display: "flex", height: "100%", overflow: "hidden", background: "rgba(10,14,22,0.94)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 13 },
  sidebar: { width: 200, minWidth: 200, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", overflow: "hidden" },
  center: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  bottom: { height: 280, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" },
  input: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 10px", color: "rgba(255,255,255,0.85)", fontSize: 12, outline: "none", width: "100%" }
};
function tabStyle(active) {
  return { padding: "6px 12px", cursor: "pointer", fontSize: 12, color: active ? ACCENT : "rgba(255,255,255,0.45)", background: "none", border: "none", borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent" };
}
function KVGrid({ rows, onChange }) {
  const update = (i, f, v) => {
    const next = rows.map((r, idx) => idx === i ? { ...r, [f]: v } : r);
    onChange(next);
  };
  const addRow = () => onChange([...rows, { key: "", value: "", enabled: true }]);
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 12px", flex: 1, overflowY: "auto" }, children: [
    rows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: row.enabled, onChange: (e) => update(i, "enabled", e.target.checked), style: { width: 14, height: 14, accentColor: ACCENT, flexShrink: 0 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Key", value: row.key, onChange: (e) => update(i, "key", e.target.value), style: { ...S.input, flex: 1, fontFamily: '"JetBrains Mono",monospace', fontSize: 11 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Value", value: row.value, onChange: (e) => update(i, "value", e.target.value), style: { ...S.input, flex: 1, fontFamily: '"JetBrains Mono",monospace', fontSize: 11 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(i), style: { background: "none", border: "none", color: "#ff4466", cursor: "pointer", padding: "0 4px", fontSize: 14 }, children: "✕" })
    ] }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: addRow, style: { fontSize: 11, padding: "4px 10px" }, children: "+ Add Row" })
  ] });
}
function APITesterApp() {
  const [collections, setCollections] = reactExports.useState([]);
  const [method, setMethod] = reactExports.useState("GET");
  const [url, setUrl] = reactExports.useState("");
  const [params, setParams] = reactExports.useState([{ key: "", value: "", enabled: true }]);
  const [headers, setHeaders] = reactExports.useState([{ key: "Content-Type", value: "application/json", enabled: true }]);
  const [body, setBody] = reactExports.useState("");
  const [contentType, setContentType] = reactExports.useState("application/json");
  const [authType, setAuthType] = reactExports.useState("none");
  const [bearerToken, setBearerToken] = reactExports.useState("");
  const [basicUser, setBasicUser] = reactExports.useState("");
  const [basicPass, setBasicPass] = reactExports.useState("");
  const [reqTab, setReqTab] = reactExports.useState("params");
  const [resTab, setResTab] = reactExports.useState("body");
  const [response, setResponse] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [saveModal, setSaveModal] = reactExports.useState(false);
  const [saveName, setSaveName] = reactExports.useState("");
  const [saveCollection, setSaveCollection] = reactExports.useState("");
  const abortRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const raw = ipc?.settings?.get?.("apitester.collections");
    if (raw) try {
      setCollections(JSON.parse(raw));
    } catch {
    }
  }, []);
  const persistCollections = (cols) => {
    setCollections(cols);
    ipc?.settings?.set?.("apitester.collections", JSON.stringify(cols));
  };
  const loadRequest = (req) => {
    setMethod(req.method);
    setUrl(req.url);
    setParams(req.params);
    setHeaders(req.headers);
    setBody(req.body);
    setContentType(req.contentType);
    setAuthType(req.authType);
    setBearerToken(req.bearerToken);
    setBasicUser(req.basicUser);
    setBasicPass(req.basicPass);
  };
  const sendRequest = reactExports.useCallback(async () => {
    if (!url) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setTimeout(() => ctrl.abort(), 3e4);
    setLoading(true);
    setResponse(null);
    const t0 = performance.now();
    try {
      const hdrs = {};
      headers.filter((h) => h.enabled && h.key).forEach((h) => {
        hdrs[h.key] = h.value;
      });
      if (authType === "bearer" && bearerToken) hdrs["Authorization"] = `Bearer ${bearerToken}`;
      if (authType === "basic" && basicUser) hdrs["Authorization"] = `Basic ${btoa(`${basicUser}:${basicPass}`)}`;
      let queryUrl = url;
      const enabledParams = params.filter((p) => p.enabled && p.key);
      if (enabledParams.length) {
        const qs = new URLSearchParams(enabledParams.map((p) => [p.key, p.value])).toString();
        queryUrl += (url.includes("?") ? "&" : "?") + qs;
      }
      const opts = { method, headers: hdrs, signal: ctrl.signal };
      if (!["GET", "HEAD"].includes(method) && body) opts.body = body;
      const res = await fetch(queryUrl, opts);
      const elapsed = Math.round(performance.now() - t0);
      const text = await res.text();
      const resHeaders = {};
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });
      setResponse({ status: res.status, statusText: res.statusText, time: elapsed, size: new TextEncoder().encode(text).length, body: text, headers: resHeaders });
    } catch (e) {
      const elapsed = Math.round(performance.now() - t0);
      setResponse({ status: 0, statusText: "Error", time: elapsed, size: 0, body: "", headers: {}, error: e.message });
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, params, body, authType, bearerToken, basicUser, basicPass]);
  const saveRequest = () => {
    if (!saveName) return;
    const req = { id: genId(), name: saveName, method, url, params, headers, body, contentType, authType, bearerToken, basicUser, basicPass };
    let cols = [...collections];
    let col = cols.find((c) => c.name === saveCollection);
    if (!col) {
      col = { id: genId(), name: saveCollection || "Default", requests: [] };
      cols.push(col);
    }
    col.requests = [...col.requests, req];
    persistCollections(cols);
    setSaveModal(false);
    setSaveName("");
    setSaveCollection("");
  };
  const copyBody = () => {
    if (response?.body) navigator.clipboard.writeText(tryPretty(response.body));
  };
  const REQ_TABS = ["params", "headers", "body", "auth"];
  const RES_TABS = ["body", "headers", "info"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.sidebar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", style: { width: "100%", fontSize: 11 }, onClick: () => {
        setMethod("GET");
        setUrl("");
        setParams([{ key: "", value: "", enabled: true }]);
        setHeaders([{ key: "", value: "", enabled: true }]);
        setBody("");
      }, children: "+ New Request" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "8px 0" }, children: [
        collections.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "12px 14px", color: "rgba(255,255,255,0.3)", fontSize: 11 }, children: "No collections yet" }),
        collections.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "6px 14px", fontSize: 11, color: ACCENT, fontWeight: 600, letterSpacing: "0.05em" }, children: col.name }),
          col.requests.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => loadRequest(req), style: { padding: "5px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, fontWeight: 700, color: METHOD_COLORS[req.method] || "#fff", minWidth: 36 }, children: req.method }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: req.name })
          ] }, req.id))
        ] }, col.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.center, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: method, onChange: (e) => setMethod(e.target.value), style: { ...S.input, width: 90, color: METHOD_COLORS[method] || "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }, children: ["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: m }, m)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: url, onChange: (e) => setUrl(e.target.value), onKeyDown: (e) => e.key === "Enter" && sendRequest(), placeholder: "https://api.example.com/endpoint", style: { ...S.input, fontFamily: '"JetBrains Mono",monospace', fontSize: 12, flex: 1 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: sendRequest, disabled: loading, style: { minWidth: 70, fontSize: 12 }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "inline-block", width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#080c12", borderRadius: "50%", animation: "spin 0.7s linear infinite" } }) : "Send" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => setSaveModal(true), style: { fontSize: 12 }, children: "Save" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", padding: "0 14px" }, children: REQ_TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReqTab(t), style: tabStyle(reqTab === t), children: t.charAt(0).toUpperCase() + t.slice(1) }, t)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }, children: [
        reqTab === "params" && /* @__PURE__ */ jsxRuntimeExports.jsx(KVGrid, { rows: params, onChange: setParams }),
        reqTab === "headers" && /* @__PURE__ */ jsxRuntimeExports.jsx(KVGrid, { rows: headers, onChange: setHeaders }),
        reqTab === "body" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)" }, children: "Content-Type:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contentType, onChange: (e) => setContentType(e.target.value), style: { ...S.input, width: 220, fontSize: 11 } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), placeholder: "Request body...", style: { ...S.input, flex: 1, resize: "none", fontFamily: '"JetBrains Mono",monospace', fontSize: 11, lineHeight: 1.6 } })
        ] }),
        reqTab === "auth" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 10 }, children: ["none", "bearer", "basic"].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: authType === a ? ACCENT : "rgba(255,255,255,0.6)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", checked: authType === a, onChange: () => setAuthType(a), style: { accentColor: ACCENT } }),
            a === "none" ? "None" : a === "bearer" ? "Bearer Token" : "Basic Auth"
          ] }, a)) }),
          authType === "bearer" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: bearerToken, onChange: (e) => setBearerToken(e.target.value), placeholder: "Token", style: { ...S.input, fontFamily: '"JetBrains Mono",monospace', fontSize: 11 } }),
          authType === "basic" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: basicUser, onChange: (e) => setBasicUser(e.target.value), placeholder: "Username", style: { ...S.input, flex: 1 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: basicPass, onChange: (e) => setBasicPass(e.target.value), placeholder: "Password", style: { ...S.input, flex: 1 } })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: S.bottom, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.45)" }, children: "Response" }),
          response && !response.error && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 12, fontWeight: 700, color: statusColor(response.status) }, children: [
              response.status,
              " ",
              response.statusText
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)" }, children: [
              response.time,
              "ms"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)" }, children: formatSize(response.size) })
          ] }),
          response?.error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "#ff4466" }, children: response.error }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
          RES_TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setResTab(t), style: tabStyle(resTab === t), children: t.charAt(0).toUpperCase() + t.slice(1) }, t)),
          response?.body && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: copyBody, style: { fontSize: 11, padding: "4px 10px" }, children: "Copy" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "8px 12px" }, children: [
          !response && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.25)", fontSize: 12, padding: 8 }, children: "Send a request to see the response" }),
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: ACCENT, fontSize: 12, padding: 8 }, children: "Loading..." }),
          response && resTab === "body" && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: "rgba(255,255,255,0.8)", whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: tryPretty(response.body) || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.3)" }, children: "(empty body)" }) }),
          response && resTab === "headers" && /* @__PURE__ */ jsxRuntimeExports.jsx("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: '"JetBrains Mono",monospace' }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: Object.entries(response.headers).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid rgba(255,255,255,0.05)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "4px 8px", color: ACCENT, width: "35%" }, children: k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "4px 8px", color: "rgba(255,255,255,0.7)", wordBreak: "break-all" }, children: v })
          ] }, k)) }) }),
          response && resTab === "info" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", fontSize: 12 }, children: [["Method", method], ["URL", url], ["Status", `${response.status} ${response.statusText}`], ["Time", `${response.time}ms`], ["Size", formatSize(response.size)]].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.45)" }, children: k }, `k-${k}`),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.8)", fontFamily: '"JetBrains Mono",monospace' }, children: v }, `v-${k}`)
          ] })) })
        ] })
      ] })
    ] }),
    saveModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", style: { width: 340, padding: 20, display: "flex", flexDirection: "column", gap: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 600 }, children: "Save Request" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Request name", value: saveName, onChange: (e) => setSaveName(e.target.value), style: S.input }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Collection name (default: Default)", value: saveCollection, onChange: (e) => setSaveCollection(e.target.value), style: S.input }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => setSaveModal(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: saveRequest, children: "Save" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })
  ] });
}
export {
  APITesterApp as default
};
