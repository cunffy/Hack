import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-BnqcYFX0.js";
const ACCENT = "#ffcc00";
const ipc = window.cryogram;
async function loadEntries() {
  return ipc.passwords.getAll();
}
function fieldStyle(extra) {
  return {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "7px 10px",
    color: "#e0e8f0",
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box",
    ...extra
  };
}
function label(text) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: {
    display: "block",
    fontSize: 10,
    color: "rgba(140,160,180,0.6)",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.07em"
  }, children: text });
}
function CopyButton({ text, title }) {
  const [copied, setCopied] = reactExports.useState(false);
  const copy = reactExports.useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.button,
    {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      onClick: copy,
      title,
      style: {
        padding: "4px 10px",
        background: copied ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${copied ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 5,
        color: copied ? "rgba(0,255,136,0.9)" : "rgba(180,200,220,0.7)",
        fontSize: 10,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0
      },
      children: copied ? "Copied!" : "Copy"
    }
  );
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: 32 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", stiffness: 280, damping: 24 },
        style: { fontSize: 48, filter: `drop-shadow(0 0 18px ${ACCENT}44)` },
        children: "🔒"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 600, color: "rgba(200,210,220,0.7)" }, children: "No entries yet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(140,160,180,0.45)", textAlign: "center" }, children: 'Click "New Entry" to add your first password.' })
  ] });
}
function EntryForm({ initial, onSave, onCancel, saving }) {
  const [title, setTitle] = reactExports.useState(initial?.title ?? "");
  const [username, setUsername] = reactExports.useState(initial?.username ?? "");
  const [password, setPassword] = reactExports.useState(initial?.password ?? "");
  const [url, setUrl] = reactExports.useState(initial?.url ?? "");
  const [notes, setNotes] = reactExports.useState(initial?.notes ?? "");
  const [showPw, setShowPw] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const submit = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    setError(null);
    onSave({ title: title.trim(), username: username.trim(), password, url: url.trim(), notes: notes.trim() });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12, padding: "16px 16px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 2 }, children: initial?.title ? "Edit Entry" : "New Entry" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      label("Title"),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. GitHub", style: fieldStyle() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      label("Username / Email"),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: username, onChange: (e) => setUsername(e.target.value), placeholder: "you@example.com", style: fieldStyle() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      label("Password"),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: showPw ? "text" : "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: "••••••••",
            style: fieldStyle({ flex: 1, fontFamily: showPw ? "inherit" : "monospace" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPw((v) => !v), style: { padding: "6px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "rgba(180,200,220,0.7)", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }, children: showPw ? "Hide" : "Show" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      label("URL"),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: url, onChange: (e) => setUrl(e.target.value), placeholder: "https://example.com", style: fieldStyle() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      label("Notes"),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: notes,
          onChange: (e) => setNotes(e.target.value),
          rows: 3,
          placeholder: "Optional notes…",
          style: { ...fieldStyle(), resize: "vertical" }
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#ff4466", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 5, padding: "5px 9px" }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, style: { padding: "7px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "rgba(180,200,220,0.6)", fontSize: 11, cursor: "pointer" }, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          whileHover: { scale: 1.03 },
          whileTap: { scale: 0.97 },
          onClick: submit,
          disabled: saving,
          style: { padding: "7px 18px", background: `rgba(255,204,0,0.12)`, border: `1px solid rgba(255,204,0,0.3)`, borderRadius: 6, color: ACCENT, fontSize: 12, fontWeight: 600, cursor: "pointer" },
          children: saving ? "Saving…" : "Save"
        }
      )
    ] })
  ] });
}
function PasswordGenerator({ onUse }) {
  const [opts, setOpts] = reactExports.useState({ length: 20, upper: true, lower: true, numbers: true, symbols: true });
  const [generated, setGenerated] = reactExports.useState("");
  const [generating, setGenerating] = reactExports.useState(false);
  const [copiedGen, setCopiedGen] = reactExports.useState(false);
  const generate = reactExports.useCallback(async () => {
    setGenerating(true);
    try {
      const pw = await ipc.passwords.generate(opts);
      setGenerated(pw);
    } finally {
      setGenerating(false);
    }
  }, [opts]);
  const copyGen = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopiedGen(true);
      setTimeout(() => setCopiedGen(false), 1500);
    });
  };
  const toggle = (key) => setOpts((o) => ({ ...o, [key]: !o[key] }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,204,0,0.02)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 600, color: ACCENT, marginBottom: 10 }, children: "Password Generator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 }, children: [
        label("Length"),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: ACCENT, fontFamily: "monospace" }, children: opts.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min: 8,
          max: 64,
          value: opts.length,
          onChange: (e) => setOpts((o) => ({ ...o, length: parseInt(e.target.value) })),
          style: { width: "100%", accentColor: ACCENT }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }, children: [["upper", "A–Z"], ["lower", "a–z"], ["numbers", "0–9"], ["symbols", "!@#…"]].map(([key, lbl]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => toggle(key),
        style: {
          padding: "4px 10px",
          background: opts[key] ? `rgba(255,204,0,0.12)` : "rgba(255,255,255,0.04)",
          border: `1px solid ${opts[key] ? "rgba(255,204,0,0.3)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 5,
          color: opts[key] ? ACCENT : "rgba(140,160,180,0.5)",
          fontSize: 11,
          cursor: "pointer",
          fontFamily: "monospace"
        },
        children: lbl
      },
      key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        flex: 1,
        background: "rgba(4,8,14,0.6)",
        border: "1px solid rgba(255,204,0,0.15)",
        borderRadius: 6,
        padding: "7px 10px",
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 12,
        color: generated ? "#e0e8f0" : "rgba(100,120,140,0.4)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        minHeight: 32
      }, children: generated || "Click Generate…" }),
      generated && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          onClick: copyGen,
          style: { padding: "6px 10px", background: copiedGen ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${copiedGen ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 6, color: copiedGen ? "rgba(0,255,136,0.9)" : "rgba(180,200,220,0.7)", fontSize: 11, cursor: "pointer" },
          children: copiedGen ? "Copied!" : "Copy"
        }
      ),
      generated && onUse && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          onClick: () => onUse(generated),
          style: { padding: "6px 10px", background: `rgba(255,204,0,0.1)`, border: `1px solid rgba(255,204,0,0.25)`, borderRadius: 6, color: ACCENT, fontSize: 11, cursor: "pointer" },
          children: "Use"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick: generate,
        disabled: generating,
        style: { padding: "7px 18px", background: `rgba(255,204,0,0.1)`, border: `1px solid rgba(255,204,0,0.25)`, borderRadius: 6, color: ACCENT, fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%" },
        children: generating ? "Generating…" : "Generate Password"
      }
    )
  ] });
}
function EntryDetail({ entry, onEdit, onDelete }) {
  const [showPw, setShowPw] = reactExports.useState(false);
  const [confirmDel, setConfirmDel] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 12 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.18 },
      style: { display: "flex", flexDirection: "column", gap: 0, height: "100%", overflow: "hidden" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 600, color: "#e0e8f0" }, children: entry.title }),
            entry.url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(140,160,180,0.55)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }, children: entry.url })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.96 },
                onClick: onEdit,
                style: { padding: "5px 12px", background: `rgba(255,204,0,0.08)`, border: `1px solid rgba(255,204,0,0.2)`, borderRadius: 5, color: ACCENT, fontSize: 11, cursor: "pointer" },
                children: "Edit"
              }
            ),
            confirmDel ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, style: { padding: "5px 12px", background: "rgba(255,68,102,0.15)", border: "1px solid rgba(255,68,102,0.35)", borderRadius: 5, color: "#ff4466", fontSize: 11, cursor: "pointer" }, children: "Confirm Delete" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmDel(false), style: { padding: "5px 10px", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, color: "rgba(140,160,180,0.5)", fontSize: 11, cursor: "pointer" }, children: "Cancel" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmDel(true), style: { padding: "5px 10px", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, color: "rgba(200,80,80,0.6)", fontSize: 11, cursor: "pointer" }, children: "Delete" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "16px 16px", display: "flex", flexDirection: "column", gap: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            label("Username"),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...fieldStyle(), flex: 1, fontFamily: "monospace", color: "#c9d1d9" }, children: entry.username }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: entry.username, title: "Copy username" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            label("Password"),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...fieldStyle(), flex: 1, fontFamily: "monospace", letterSpacing: showPw ? "normal" : "0.1em", color: "#c9d1d9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: showPw ? entry.password : "•".repeat(Math.min(entry.password.length, 24)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setShowPw((v) => !v),
                  style: { padding: "6px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "rgba(180,200,220,0.7)", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" },
                  children: showPw ? "Hide" : "Show"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: entry.password, title: "Copy password" })
            ] })
          ] }),
          entry.url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            label("URL"),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...fieldStyle(), color: "rgba(140,200,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: entry.url })
          ] }),
          entry.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            label("Notes"),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...fieldStyle(), whiteSpace: "pre-wrap", lineHeight: 1.6, minHeight: 60, color: "rgba(180,200,220,0.8)" }, children: entry.notes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(100,120,140,0.4)", marginTop: 4 }, children: [
            "Created ",
            new Date(entry.createdAt).toLocaleDateString(),
            " · Updated ",
            new Date(entry.updatedAt).toLocaleDateString()
          ] })
        ] })
      ]
    },
    entry.id
  );
}
function PasswordManagerApp() {
  const [entries, setEntries] = reactExports.useState([]);
  const [search, setSearch] = reactExports.useState("");
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [mode, setMode] = reactExports.useState("list");
  const [saving, setSaving] = reactExports.useState(false);
  const [showGen, setShowGen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadEntries().then(setEntries).catch(() => {
    });
  }, []);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return entries.filter((e) => !q || e.title.toLowerCase().includes(q) || e.username.toLowerCase().includes(q) || (e.url ?? "").toLowerCase().includes(q)).sort((a, b) => a.title.localeCompare(b.title));
  }, [entries, search]);
  const selected = reactExports.useMemo(() => entries.find((e) => e.id === selectedId) ?? null, [entries, selectedId]);
  const handleAdd = reactExports.useCallback(async (entry) => {
    setSaving(true);
    try {
      const created = await ipc.passwords.add(entry);
      setEntries((prev) => [...prev, created]);
      setSelectedId(created.id);
      setMode("list");
    } finally {
      setSaving(false);
    }
  }, []);
  const handleUpdate = reactExports.useCallback(async (entry) => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await ipc.passwords.update(selectedId, { ...entry, updatedAt: Date.now() });
      setEntries((prev) => prev.map((e) => e.id === selectedId ? { ...e, ...entry, updatedAt: Date.now() } : e));
      setMode("list");
    } finally {
      setSaving(false);
    }
  }, [selectedId]);
  const handleDelete = reactExports.useCallback(async () => {
    if (!selectedId) return;
    await ipc.passwords.delete(selectedId);
    setEntries((prev) => prev.filter((e) => e.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 260, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.055)", background: "rgba(8,12,18,0.5)", overflow: "hidden", flexShrink: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 10px 8px", borderBottom: "1px solid rgba(255,255,255,0.055)", flexShrink: 0, display: "flex", gap: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search entries…",
            style: { ...fieldStyle(), flex: 1, fontSize: 12, padding: "6px 10px" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: () => {
              setMode("new");
              setSelectedId(null);
            },
            style: { padding: "6px 12px", background: `rgba(255,204,0,0.1)`, border: `1px solid rgba(255,204,0,0.25)`, borderRadius: 6, color: ACCENT, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
            children: "+ New"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "20px 14px", fontSize: 11, color: "rgba(100,120,140,0.4)" }, children: search ? "No matching entries" : "No saved passwords yet" }) : filtered.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.button,
        {
          layout: true,
          initial: { opacity: 0, y: -4 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -4 },
          onClick: () => {
            setSelectedId(entry.id);
            setMode("list");
          },
          style: {
            width: "100%",
            textAlign: "left",
            padding: "9px 12px",
            background: selectedId === entry.id ? `rgba(255,204,0,0.07)` : "transparent",
            borderLeft: `2px solid ${selectedId === entry.id ? ACCENT : "transparent"}`,
            borderTop: "none",
            borderRight: "none",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            cursor: "pointer",
            display: "block"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 500, color: selectedId === entry.id ? ACCENT : "#c9d1d9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: entry.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(140,160,180,0.5)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: entry.username })
          ]
        },
        entry.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { borderTop: "1px solid rgba(255,255,255,0.055)", flexShrink: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowGen((v) => !v),
            style: { width: "100%", padding: "9px 12px", background: showGen ? `rgba(255,204,0,0.06)` : "transparent", border: "none", color: showGen ? ACCENT : "rgba(140,160,180,0.5)", fontSize: 11, cursor: "pointer", textAlign: "left" },
            children: [
              showGen ? "▾" : "▸",
              " Password Generator"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showGen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            style: { overflow: "hidden" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordGenerator, {})
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: mode === "new" ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, style: { flex: 1, overflowY: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EntryForm,
      {
        onSave: handleAdd,
        onCancel: () => setMode("list"),
        saving
      }
    ) }, "new") : mode === "edit" && selected ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, style: { flex: 1, overflowY: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EntryForm,
      {
        initial: selected,
        onSave: handleUpdate,
        onCancel: () => setMode("list"),
        saving
      }
    ) }, "edit") : selected ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EntryDetail, { entry: selected, onEdit: () => setMode("edit"), onDelete: handleDelete }) }, selected.id) : /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, style: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) }, "empty") }) })
  ] }) });
}
export {
  PasswordManagerApp as default
};
