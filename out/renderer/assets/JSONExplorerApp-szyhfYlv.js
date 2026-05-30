import { r as reactExports, j as jsxRuntimeExports } from "./index-BxJJzso-.js";
function parseYAML(text) {
  const lines = text.split("\n");
  function parseValue(raw) {
    const v = raw.trim();
    if (v === "null" || v === "~") return null;
    if (v === "true") return true;
    if (v === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    if (v.startsWith('"') && v.endsWith('"') || v.startsWith("'") && v.endsWith("'")) {
      return v.slice(1, -1);
    }
    return v;
  }
  function getIndent(line) {
    let i = 0;
    while (i < line.length && line[i] === " ") i++;
    return i;
  }
  function parseBlock(startIdx, baseIndent) {
    const result = {};
    const arr = [];
    let isArray = false;
    let i = startIdx;
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === "" || line.trim().startsWith("#")) {
        i++;
        continue;
      }
      const indent = getIndent(line);
      if (indent < baseIndent) break;
      const trimmed = line.trim();
      if (trimmed.startsWith("- ")) {
        isArray = true;
        const itemVal = trimmed.slice(2).trim();
        if (itemVal === "") {
          const [val2, next] = parseBlock(i + 1, indent + 2);
          arr.push(val2);
          i = next;
        } else {
          arr.push(parseValue(itemVal));
          i++;
        }
      } else if (trimmed.includes(":")) {
        const colonIdx = trimmed.indexOf(":");
        const key = trimmed.slice(0, colonIdx).trim();
        const rest = trimmed.slice(colonIdx + 1).trim();
        if (rest === "" || rest === "|" || rest === ">") {
          const [val2, next] = parseBlock(i + 1, indent + 2);
          result[key] = val2;
          i = next;
        } else {
          result[key] = parseValue(rest);
          i++;
        }
      } else {
        i++;
      }
    }
    return [isArray ? arr : result, i];
  }
  const [val] = parseBlock(0, 0);
  return val;
}
function xmlDomToJson(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").trim();
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node;
  const result = {};
  if (el.attributes.length > 0) {
    const attrs = {};
    Array.from(el.attributes).forEach((a) => {
      attrs[a.name] = a.value;
    });
    result["@attributes"] = attrs;
  }
  const children = Array.from(el.childNodes).filter(
    (c) => !(c.nodeType === Node.TEXT_NODE && (c.textContent ?? "").trim() === "")
  );
  if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
    const text = (children[0].textContent ?? "").trim();
    if (el.attributes.length === 0) return text;
    result["#text"] = text;
    return result;
  }
  const childMap = {};
  children.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const key = child.tagName;
      if (!childMap[key]) childMap[key] = [];
      childMap[key].push(xmlDomToJson(child));
    }
  });
  Object.entries(childMap).forEach(([key, vals]) => {
    result[key] = vals.length === 1 ? vals[0] : vals;
  });
  return result;
}
function matchesSearch(val, term) {
  if (!term) return false;
  const t = term.toLowerCase();
  if (typeof val === "string") return val.toLowerCase().includes(t);
  if (typeof val === "number" || typeof val === "boolean") return String(val).toLowerCase().includes(t);
  return false;
}
function TreeNode({ keyName, value, path, searchTerm, onSelectPath, depth, forceExpand }) {
  const [expanded, setExpanded] = reactExports.useState(depth < 2);
  const [copiedFlash, setCopiedFlash] = reactExports.useState(false);
  const [strExpanded, setStrExpanded] = reactExports.useState(false);
  const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;
  const isExpanded = forceExpand !== void 0 ? forceExpand : expanded;
  const isHighlighted = searchTerm ? (keyName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) || matchesSearch(value, searchTerm) : false;
  const copyValue = () => {
    const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFlash(true);
      setTimeout(() => setCopiedFlash(false), 1e3);
    });
  };
  const rowBase = {
    display: "flex",
    alignItems: "flex-start",
    gap: 2,
    padding: "1px 0",
    paddingLeft: depth * 16,
    borderRadius: 3,
    background: isHighlighted ? "rgba(0,212,255,0.07)" : "transparent",
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 12,
    lineHeight: "1.7"
  };
  const renderScalar = () => {
    if (value === null) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.3)", fontStyle: "italic" }, children: "null" });
    if (typeof value === "boolean") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffaa00" }, children: String(value) });
    if (typeof value === "number") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--cryo-accent, #00d4ff)" }, children: value });
    if (typeof value === "string") {
      const MAX = 80;
      if (value.length > MAX && !strExpanded) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#4ade80" }, children: [
          "“",
          value.slice(0, MAX),
          "…”",
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
            e.stopPropagation();
            setStrExpanded(true);
          }, style: {
            background: "none",
            border: "none",
            color: "rgba(0,212,255,0.7)",
            cursor: "pointer",
            fontSize: 10,
            padding: "0 4px",
            fontFamily: '"JetBrains Mono",monospace'
          }, children: "show" })
        ] });
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#4ade80" }, children: [
        "“",
        value,
        "”",
        value.length > MAX && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
          e.stopPropagation();
          setStrExpanded(false);
        }, style: {
          background: "none",
          border: "none",
          color: "rgba(0,212,255,0.7)",
          cursor: "pointer",
          fontSize: 10,
          padding: "0 4px",
          fontFamily: '"JetBrains Mono",monospace'
        }, children: "hide" })
      ] });
    }
    return null;
  };
  if (isExpandable) {
    const entries = isObject ? Object.entries(value) : value.map((v, i) => [String(i), v]);
    const count = entries.length;
    const open = isExpanded;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: { ...rowBase, cursor: "pointer" },
          onClick: () => forceExpand === void 0 && setExpanded((e) => !e),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.25)", fontSize: 10, paddingTop: 3, userSelect: "none", width: 12, flexShrink: 0 }, children: open ? "▾" : "▸" }),
            keyName !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                style: { color: "rgba(255,255,255,0.65)", marginRight: 4, cursor: "pointer" },
                onClick: (e) => {
                  e.stopPropagation();
                  onSelectPath(path);
                },
                onMouseEnter: (e) => e.currentTarget.style.color = "var(--cryo-accent,#00d4ff)",
                onMouseLeave: (e) => e.currentTarget.style.color = "rgba(255,255,255,0.65)",
                children: [
                  keyName,
                  ":"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.4)" }, children: isObject ? "{" : "[" }),
            !open && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.2)", fontSize: 11, marginLeft: 2 }, children: [
              count,
              " ",
              isObject ? count === 1 ? "key" : "keys" : count === 1 ? "item" : "items"
            ] }),
            !open && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.4)" }, children: isObject ? "}" : "]" })
          ]
        }
      ),
      open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        entries.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TreeNode,
          {
            keyName: isArray ? null : k,
            value: v,
            path: isArray ? `${path}[${k}]` : `${path}.${k}`,
            searchTerm,
            onSelectPath,
            depth: depth + 1,
            forceExpand
          },
          k
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          paddingLeft: depth * 16,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 12,
          color: "rgba(255,255,255,0.4)",
          lineHeight: "1.7"
        }, children: isObject ? "}" : "]" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: { ...rowBase, cursor: "pointer" },
      onClick: copyValue,
      title: "Click to copy",
      onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)",
      onMouseLeave: (e) => e.currentTarget.style.background = isHighlighted ? "rgba(0,212,255,0.07)" : "transparent",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 12, flexShrink: 0 } }),
        keyName !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            style: { color: "rgba(255,255,255,0.6)", marginRight: 4 },
            onClick: (e) => {
              e.stopPropagation();
              onSelectPath(path);
            },
            onMouseEnter: (e) => e.currentTarget.style.color = "var(--cryo-accent,#00d4ff)",
            onMouseLeave: (e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)",
            children: [
              keyName,
              ":"
            ]
          }
        ),
        renderScalar(),
        copiedFlash && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: 6, fontSize: 10, color: "#4ade80" }, children: "Copied!" })
      ]
    }
  );
}
function JSONExplorerApp() {
  const [format, setFormat] = reactExports.useState("JSON");
  const [rawInput, setRawInput] = reactExports.useState("");
  const [parsed, setParsed] = reactExports.useState(null);
  const [parseError, setParseError] = reactExports.useState(null);
  const [selectedPath, setSelectedPath] = reactExports.useState("$");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [forceExpand, setForceExpand] = reactExports.useState(void 0);
  const [treeRevision, setTreeRevision] = reactExports.useState(0);
  const doParse = reactExports.useCallback((text, fmt) => {
    if (!text.trim()) {
      setParsed(null);
      setParseError(null);
      return;
    }
    try {
      if (fmt === "JSON") {
        setParsed(JSON.parse(text));
      } else if (fmt === "YAML") {
        setParsed(parseYAML(text));
      } else {
        const dom = new DOMParser().parseFromString(text, "text/xml");
        const err = dom.querySelector("parsererror");
        if (err) throw new Error(err.textContent ?? "XML parse error");
        setParsed({ [dom.documentElement.tagName]: xmlDomToJson(dom.documentElement) });
      }
      setParseError(null);
    } catch (e) {
      setParsed(null);
      setParseError(e?.message ?? "Parse error");
    }
  }, []);
  const handleInput = (text) => {
    setRawInput(text);
    doParse(text, format);
  };
  const changeFormat = (f) => {
    setFormat(f);
    doParse(rawInput, f);
  };
  const formatPretty = () => {
    if (!parsed) return;
    setRawInput(JSON.stringify(parsed, null, 2));
  };
  const minify = () => {
    if (!parsed) return;
    setRawInput(JSON.stringify(parsed));
  };
  const copyAll = () => navigator.clipboard.writeText(rawInput);
  const openFile = async () => {
    try {
      const path = await window.cryogram?.files?.openDialog("open");
      if (!path) return;
      const content = await window.cryogram?.files?.readFile(path);
      if (typeof content === "string") handleInput(content);
    } catch (e) {
      console.error(e);
    }
  };
  const expandAll = () => {
    setForceExpand(true);
    setTreeRevision((r) => r + 1);
  };
  const collapseAll = () => {
    setForceExpand(false);
    setTreeRevision((r) => r + 1);
  };
  const btnStyle = (disabled) => ({
    padding: "5px 11px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 5,
    color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.65)",
    fontSize: 12,
    cursor: disabled ? "default" : "pointer",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    opacity: disabled ? 0.5 : 1,
    transition: "all 0.12s"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    display: "flex",
    height: "100%",
    background: "rgba(8,12,20,0.8)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    color: "rgba(255,255,255,0.85)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      width: 340,
      flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      flexDirection: "column"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }, children: ["JSON", "YAML", "XML"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => changeFormat(f),
          style: {
            flex: 1,
            padding: "10px 0",
            background: "transparent",
            border: "none",
            borderBottom: format === f ? "2px solid var(--cryo-accent,#00d4ff)" : "2px solid transparent",
            color: format === f ? "var(--cryo-accent,#00d4ff)" : "rgba(255,255,255,0.4)",
            fontSize: 13,
            fontWeight: format === f ? 700 : 400,
            cursor: "pointer",
            fontFamily: '"JetBrains Mono", monospace',
            transition: "all 0.15s"
          },
          children: f
        },
        f
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: rawInput,
          onChange: (e) => handleInput(e.target.value),
          placeholder: `Paste ${format} content here...

The tree renders as you type.`,
          spellCheck: false,
          style: {
            flex: 1,
            padding: 12,
            background: "rgba(0,0,0,0.2)",
            border: "none",
            outline: "none",
            color: "rgba(255,255,255,0.8)",
            fontSize: 12,
            fontFamily: '"JetBrains Mono", monospace',
            lineHeight: "1.6",
            resize: "none"
          }
        }
      ),
      parseError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "7px 12px",
        background: "rgba(239,68,68,0.1)",
        borderTop: "1px solid rgba(239,68,68,0.25)",
        fontSize: 12,
        color: "#ef4444",
        fontFamily: '"JetBrains Mono", monospace',
        lineHeight: "1.5"
      }, children: [
        "⚠ ",
        parseError
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "10px 12px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: openFile, style: btnStyle(), children: "Open File" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: formatPretty, disabled: !parsed, style: btnStyle(!parsed), children: "Format" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: minify, disabled: !parsed, style: btnStyle(!parsed), children: "Minify" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: copyAll, style: btnStyle(), children: "Copy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "8px 12px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 4 }, children: "Selected Path" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 12,
          color: "var(--cryo-accent, #00d4ff)",
          wordBreak: "break-all",
          lineHeight: "1.5"
        }, children: selectedPath || "$" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "10px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: "Search keys / values...",
            style: {
              flex: 1,
              padding: "6px 10px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 6,
              color: "rgba(255,255,255,0.8)",
              fontSize: 12,
              outline: "none",
              fontFamily: '"JetBrains Mono", monospace'
            },
            onFocus: (e) => e.target.style.borderColor = "rgba(0,212,255,0.3)",
            onBlur: (e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: expandAll, style: btnStyle(), children: "Expand All" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: collapseAll, style: btnStyle(), children: "Collapse All" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: "12px 16px" }, children: parsed === null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 12,
        color: "rgba(255,255,255,0.25)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, fontFamily: '"JetBrains Mono", monospace' }, children: "{}" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13 }, children: [
          "Paste ",
          format,
          " in the left pane to explore"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        TreeNode,
        {
          keyName: null,
          value: parsed,
          path: "$",
          searchTerm,
          onSelectPath: setSelectedPath,
          depth: 0,
          forceExpand
        },
        treeRevision
      ) })
    ] })
  ] });
}
export {
  JSONExplorerApp as default
};
