import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-HNqA6Mor.js";
function genId() {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function autoTitle() {
  const now = /* @__PURE__ */ new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `Note ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
function wordCount(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}
function formatDate(ts) {
  const d = new Date(ts);
  const today = /* @__PURE__ */ new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
function NotesApp() {
  const [notes, setNotes] = reactExports.useState([]);
  const [activeId, setActiveId] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = reactExports.useState(null);
  const debounceRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    window.cryogram.settings.get("notes.list").then((raw) => {
      if (Array.isArray(raw)) {
        const loaded = raw;
        setNotes(loaded);
        if (loaded.length > 0) setActiveId(loaded[0].id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const persistNotes = reactExports.useCallback((updated) => {
    window.cryogram.settings.set("notes.list", updated);
  }, []);
  const createNote = reactExports.useCallback(() => {
    const note = {
      id: genId(),
      title: autoTitle(),
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setNotes((prev) => {
      const next = [note, ...prev];
      persistNotes(next);
      return next;
    });
    setActiveId(note.id);
    setSearch("");
  }, [persistNotes]);
  const updateContent = reactExports.useCallback((id, content) => {
    setNotes((prev) => {
      const next = prev.map((n) => n.id === id ? { ...n, content, updatedAt: Date.now() } : n);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => persistNotes(next), 500);
      return next;
    });
  }, [persistNotes]);
  const updateTitle = reactExports.useCallback((id, title) => {
    setNotes((prev) => {
      const next = prev.map((n) => n.id === id ? { ...n, title, updatedAt: Date.now() } : n);
      persistNotes(next);
      return next;
    });
  }, [persistNotes]);
  const deleteNote = reactExports.useCallback((id) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      persistNotes(next);
      if (activeId === id) {
        setActiveId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
    setConfirmDeleteId(null);
  }, [activeId, persistNotes]);
  const filteredNotes = search.trim() ? notes.filter(
    (n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
  ) : notes;
  const activeNote = notes.find((n) => n.id === activeId) ?? null;
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.span,
      {
        style: { fontSize: 12, color: "rgba(140,160,180,0.5)", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' },
        animate: { opacity: [0.4, 1, 0.4] },
        transition: { duration: 1.5, repeat: Infinity },
        children: "Loading notes…"
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-1 overflow-hidden",
      style: { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              width: 240,
              borderRight: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(8,12,20,0.55)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 10px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color: "rgba(140,160,180,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }, children: [
                    "Notes (",
                    notes.length,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.button,
                    {
                      whileHover: { scale: 1.08 },
                      whileTap: { scale: 0.93 },
                      onClick: createNote,
                      style: {
                        width: 22,
                        height: 22,
                        background: "rgba(0,212,255,0.1)",
                        border: "1px solid rgba(0,212,255,0.25)",
                        borderRadius: 5,
                        color: "var(--cryo-accent)",
                        fontSize: 15,
                        fontWeight: 300,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1
                      },
                      title: "New note",
                      children: "+"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: "Search notes…",
                    style: {
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 5,
                      padding: "5px 9px",
                      fontSize: 11,
                      color: "#c9d1d9",
                      outline: "none"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: filteredNotes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "14px 12px", fontSize: 11, color: "rgba(100,120,140,0.4)" }, children: search ? "No notes match your search." : "No notes yet — create one above." }) : filteredNotes.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                NoteListItem,
                {
                  note,
                  active: activeId === note.id,
                  onClick: () => {
                    setActiveId(note.id);
                    setSearch("");
                  },
                  searchQuery: search
                },
                note.id
              )) })
            ]
          }
        ),
        activeNote ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteEditor,
          {
            note: activeNote,
            onChangeContent: (c) => updateContent(activeNote.id, c),
            onChangeTitle: (t) => updateTitle(activeNote.id, t),
            onDelete: () => setConfirmDeleteId(activeNote.id),
            confirmingDelete: confirmDeleteId === activeNote.id,
            onConfirmDelete: () => deleteNote(activeNote.id),
            onCancelDelete: () => setConfirmDeleteId(null)
          },
          activeNote.id
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, opacity: 0.15 }, children: "📝" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "rgba(140,160,180,0.35)", fontWeight: 500 }, children: "No note selected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  whileHover: { scale: 1.03 },
                  whileTap: { scale: 0.97 },
                  onClick: createNote,
                  style: {
                    padding: "7px 18px",
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.25)",
                    borderRadius: 6,
                    color: "var(--cryo-accent)",
                    fontSize: 12,
                    cursor: "pointer",
                    marginTop: 4
                  },
                  children: "+ New Note"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function NoteListItem({ note, active, onClick, searchQuery }) {
  const snippet = (() => {
    if (!searchQuery.trim() || !note.content) return note.content.slice(0, 60);
    const lower = note.content.toLowerCase();
    const idx = lower.indexOf(searchQuery.toLowerCase());
    if (idx === -1) return note.content.slice(0, 60);
    const start = Math.max(0, idx - 15);
    const end = Math.min(note.content.length, idx + searchQuery.length + 30);
    return (start > 0 ? "…" : "") + note.content.slice(start, end) + (end < note.content.length ? "…" : "");
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      onClick,
      whileHover: { backgroundColor: "rgba(255,255,255,0.03)" },
      style: {
        width: "100%",
        textAlign: "left",
        padding: "9px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        borderLeft: active ? "2px solid var(--cryo-accent)" : "2px solid transparent",
        background: active ? "rgba(0,212,255,0.06)" : "transparent",
        cursor: "pointer",
        borderTop: "none",
        borderRight: "none"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 12,
          fontWeight: 500,
          color: active ? "var(--cryo-accent)" : "#c9d1d9",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: 3
        }, children: note.title }),
        snippet && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 10,
          color: "rgba(140,160,180,0.45)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: 1.4
        }, children: snippet }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(100,120,140,0.4)", marginTop: 3 }, children: formatDate(note.updatedAt) })
      ]
    }
  );
}
function NoteEditor({
  note,
  onChangeContent,
  onChangeTitle,
  onDelete,
  confirmingDelete,
  onConfirmDelete,
  onCancelDelete
}) {
  const [editingTitle, setEditingTitle] = reactExports.useState(false);
  const [titleDraft, setTitleDraft] = reactExports.useState(note.title);
  const titleInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setTitleDraft(note.title);
  }, [note.id, note.title]);
  reactExports.useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);
  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== note.title) onChangeTitle(trimmed);
    else setTitleDraft(note.title);
    setEditingTitle(false);
  };
  const words = wordCount(note.content);
  const chars = note.content.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "10px 16px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(8,12,20,0.4)",
      display: "flex",
      alignItems: "center",
      gap: 10
    }, children: [
      editingTitle ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: titleInputRef,
          value: titleDraft,
          onChange: (e) => setTitleDraft(e.target.value),
          onBlur: commitTitle,
          onKeyDown: (e) => {
            if (e.key === "Enter") commitTitle();
            if (e.key === "Escape") {
              setTitleDraft(note.title);
              setEditingTitle(false);
            }
          },
          style: {
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(0,212,255,0.3)",
            borderRadius: 5,
            padding: "4px 8px",
            fontSize: 14,
            fontWeight: 600,
            color: "#e0e8f0",
            outline: "none"
          }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setEditingTitle(true),
          title: "Click to edit title",
          style: {
            flex: 1,
            textAlign: "left",
            background: "transparent",
            border: "none",
            cursor: "text",
            fontSize: 14,
            fontWeight: 600,
            color: "#e0e8f0",
            padding: "4px 2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          },
          children: note.title
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: confirmingDelete ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          style: { display: "flex", gap: 5, alignItems: "center" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,68,102,0.7)" }, children: "Delete?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onConfirmDelete,
                style: { padding: "4px 9px", background: "rgba(255,68,102,0.15)", border: "1px solid rgba(255,68,102,0.4)", borderRadius: 5, color: "#ff4466", fontSize: 10, cursor: "pointer" },
                children: "Yes"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onCancelDelete,
                style: { padding: "4px 9px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5, color: "rgba(140,160,180,0.6)", fontSize: 10, cursor: "pointer" },
                children: "No"
              }
            )
          ]
        },
        "confirm"
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: onDelete,
          title: "Delete note",
          style: {
            padding: "4px 8px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 5,
            color: "rgba(140,160,180,0.35)",
            fontSize: 12,
            cursor: "pointer"
          },
          children: "🗑"
        },
        "delete"
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        value: note.content,
        onChange: (e) => onChangeContent(e.target.value),
        placeholder: "Start writing…",
        style: {
          flex: 1,
          background: "rgba(6,10,18,0.6)",
          border: "none",
          resize: "none",
          padding: "16px 18px",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 13,
          lineHeight: 1.75,
          color: "#c9d8e8",
          outline: "none",
          caretColor: "var(--cryo-accent)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "5px 16px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(8,12,20,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 10,
      color: "rgba(100,120,140,0.5)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        words,
        " word",
        words !== 1 ? "s" : "",
        " · ",
        chars,
        " character",
        chars !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Updated ",
        new Date(note.updatedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
      ] })
    ] })
  ] });
}
export {
  NotesApp as default
};
