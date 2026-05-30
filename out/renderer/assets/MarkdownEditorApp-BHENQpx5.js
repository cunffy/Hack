import { r as reactExports, j as jsxRuntimeExports } from "./index-B_05y53C.js";
function renderMarkdown(md) {
  let html = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/^######\s+(.+)$/gm, "<h6>$1</h6>").replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>").replace(/^####\s+(.+)$/gm, "<h4>$1</h4>").replace(/^###\s+(.+)$/gm, "<h3>$1</h3>").replace(/^##\s+(.+)$/gm, "<h2>$1</h2>").replace(/^#\s+(.+)$/gm, "<h1>$1</h1>").replace(/```(\w*)\n?([\s\S]*?)```/g, "<pre><code>$2</code></pre>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/__([^_]+)__/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/_([^_]+)_/g, "<em>$1</em>").replace(/~~([^~]+)~~/g, "<del>$1</del>").replace(/^&gt;\s+(.+)$/gm, "<blockquote>$1</blockquote>").replace(/^---+$/gm, "<hr/>").replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>').replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%"/>').replace(/^\s*[-*+]\s+(.+)$/gm, "<li>$1</li>").replace(/(<li>[\s\S]*?<\/li>(\n|$))+/g, (m) => `<ul>${m}</ul>`).replace(/^\s*\d+\.\s+(.+)$/gm, "<li>$1</li>").replace(/\n\n+/g, "</p><p>");
  return `<p>${html}</p>`;
}
const INITIAL = `# Welcome to Markdown Editor

Write your document here. Preview updates **live** as you type.

## Features
- **Bold** and *italic* text
- \`inline code\` and code blocks
- [Links](https://example.com)
- Tables, lists, headings

\`\`\`javascript
console.log('Hello, World!')
\`\`\`

> Blockquotes look great too.

---

Start typing to replace this content.
`;
function MarkdownEditorApp() {
  const [source, setSource] = reactExports.useState(INITIAL);
  const [mode, setMode] = reactExports.useState("split");
  const [fileName, setFileName] = reactExports.useState("untitled.md");
  const [saved, setSaved] = reactExports.useState(true);
  const previewRef = reactExports.useRef(null);
  const textRef = reactExports.useRef(null);
  const wordCount = source.trim() ? source.trim().split(/\s+/).length : 0;
  const charCount = source.length;
  const lineCount = source.split("\n").length;
  reactExports.useEffect(() => {
    setSaved(false);
  }, [source]);
  const save = async () => {
    const settings = window.cryogram?.settings;
    if (settings) {
      await settings.set("markdown.lastDoc", source);
      await settings.set("markdown.lastFileName", fileName);
    }
    setSaved(true);
  };
  reactExports.useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  const insertAt = (before, after = "") => {
    const ta = textRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = source.slice(start, end);
    const newVal = source.slice(0, start) + before + sel + after + source.slice(end);
    setSource(newVal);
    setTimeout(() => {
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + sel.length;
      ta.focus();
    }, 0);
  };
  const toolbarBtns = [
    { label: "B", title: "Bold", action: () => insertAt("**", "**") },
    { label: "I", title: "Italic", action: () => insertAt("*", "*") },
    { label: "S̶", title: "Strikethrough", action: () => insertAt("~~", "~~") },
    { label: "H1", title: "Heading 1", action: () => insertAt("# ") },
    { label: "H2", title: "Heading 2", action: () => insertAt("## ") },
    { label: "`", title: "Inline Code", action: () => insertAt("`", "`") },
    { label: "```", title: "Code Block", action: () => insertAt("```\n", "\n```") },
    { label: ">", title: "Quote", action: () => insertAt("> ") },
    { label: "—", title: "Rule", action: () => insertAt("\n---\n") },
    { label: "[]", title: "Link", action: () => insertAt("[", "](url)") }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,12,20,0.8)", fontFamily: "-apple-system,sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: fileName,
          onChange: (e) => setFileName(e.target.value),
          style: { background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 12, outline: "none", width: 140 }
        }
      ),
      !saved && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#facc15" }, children: "●" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 16, background: "rgba(255,255,255,0.1)", margin: "0 6px" } }),
      toolbarBtns.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: b.action,
          title: b.title,
          style: { padding: "3px 7px", fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 4, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "JetBrains Mono,monospace" },
          children: b.label
        },
        b.label
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 4 }, children: [
        ["split", "edit", "preview"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setMode(m),
            style: { padding: "3px 10px", fontSize: 10, fontWeight: 600, textTransform: "capitalize", background: mode === m ? "var(--cryo-accent)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 4, color: mode === m ? "#000" : "rgba(255,255,255,0.5)", cursor: "pointer" },
            children: m
          },
          m
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, style: { padding: "3px 10px", fontSize: 10, fontWeight: 600, background: saved ? "rgba(255,255,255,0.06)" : "rgba(74,222,128,0.15)", border: "none", borderRadius: 4, color: saved ? "rgba(255,255,255,0.5)" : "#4ade80", cursor: "pointer" }, children: "Save" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", overflow: "hidden" }, children: [
      (mode === "split" || mode === "edit") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", flexDirection: "column", borderRight: mode === "split" ? "1px solid rgba(255,255,255,0.07)" : "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          ref: textRef,
          value: source,
          onChange: (e) => setSource(e.target.value),
          style: { flex: 1, background: "transparent", border: "none", outline: "none", padding: "16px 20px", color: "rgba(255,255,255,0.82)", fontSize: 13, fontFamily: "JetBrains Mono,monospace", lineHeight: 1.7, resize: "none" },
          spellCheck: false
        }
      ) }),
      (mode === "split" || mode === "preview") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: previewRef,
          style: { flex: 1, overflowY: "auto", padding: "16px 24px" },
          dangerouslySetInnerHTML: { __html: renderMarkdown(source) }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 16, padding: "4px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 10, color: "rgba(255,255,255,0.3)", flexShrink: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        lineCount,
        " lines"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        wordCount,
        " words"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        charCount,
        " chars"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: "auto" }, children: saved ? "Saved" : "Unsaved" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .markdown-preview h1,h2,h3,h4,h5,h6{color:rgba(255,255,255,0.9);margin:16px 0 8px}
        [dangerouslySetInnerHTML] h1{font-size:1.8em;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:6px}
        [dangerouslySetInnerHTML] h2{font-size:1.4em}
        [dangerouslySetInnerHTML] code{background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:0.9em;color:var(--cryo-accent)}
        [dangerouslySetInnerHTML] pre{background:rgba(0,0,0,0.4);padding:12px 16px;border-radius:8px;overflow-x:auto;border:1px solid rgba(255,255,255,0.06)}
        [dangerouslySetInnerHTML] pre code{background:transparent;padding:0;color:rgba(255,255,255,0.85)}
        [dangerouslySetInnerHTML] blockquote{border-left:3px solid var(--cryo-accent);margin:12px 0;padding:4px 16px;color:rgba(255,255,255,0.55)}
        [dangerouslySetInnerHTML] a{color:var(--cryo-accent)}
        [dangerouslySetInnerHTML] ul,[dangerouslySetInnerHTML] ol{padding-left:24px;margin:8px 0}
        [dangerouslySetInnerHTML] li{margin:4px 0;color:rgba(255,255,255,0.8)}
        [dangerouslySetInnerHTML] hr{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0}
        [dangerouslySetInnerHTML] p{color:rgba(255,255,255,0.78);line-height:1.7;margin:8px 0}
        [dangerouslySetInnerHTML] strong{color:rgba(255,255,255,0.95)}
        [dangerouslySetInnerHTML] del{color:rgba(255,255,255,0.4)}
      ` })
  ] });
}
export {
  MarkdownEditorApp as default
};
