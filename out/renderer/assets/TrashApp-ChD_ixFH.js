import { r as reactExports, j as jsxRuntimeExports } from "./index-BXCeEECP.js";
const ipc = window.cryogram?.trash;
function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function TrashApp() {
  const [items, setItems] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [trashSize, setTrashSize] = reactExports.useState({ count: 0, bytes: 0 });
  const [loading, setLoading] = reactExports.useState(false);
  const [confirmEmpty, setConfirmEmpty] = reactExports.useState(false);
  const load = async () => {
    if (!ipc) return;
    setLoading(true);
    try {
      const [list, sz] = await Promise.all([ipc.list(), ipc.getSize()]);
      setItems(list);
      setTrashSize(sz);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const toggleSelect = (name) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };
  const restore = async (names) => {
    if (!ipc) return;
    await Promise.all(names.map((n) => ipc.restore(n)));
    setSelected(/* @__PURE__ */ new Set());
    await load();
  };
  const deletePermanent = async (names) => {
    if (!ipc) return;
    await Promise.all(names.map((n) => ipc.deletePermanent(n)));
    setSelected(/* @__PURE__ */ new Set());
    await load();
  };
  const emptyTrash = async () => {
    if (!ipc) return;
    await ipc.empty();
    setConfirmEmpty(false);
    setSelected(/* @__PURE__ */ new Set());
    await load();
  };
  const selArr = Array.from(selected);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,12,20,0.8)", fontFamily: "-apple-system,sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)" }, children: "🗑️ Trash" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }, children: [
          trashSize.count,
          " item",
          trashSize.count !== 1 ? "s" : "",
          " · ",
          formatSize(trashSize.bytes)
        ] })
      ] }),
      selArr.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: [
          selArr.length,
          " selected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => restore(selArr),
            style: { padding: "5px 12px", fontSize: 11, fontWeight: 600, background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 6, color: "#4ade80", cursor: "pointer" },
            children: "Restore"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => deletePermanent(selArr),
            style: { padding: "5px 12px", fontSize: 11, fontWeight: 600, background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 6, color: "#f87171", cursor: "pointer" },
            children: "Delete"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: load, style: { padding: "5px 10px", fontSize: 11, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer" }, children: "⟳" }),
      !confirmEmpty ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setConfirmEmpty(true),
          disabled: items.length === 0,
          style: { padding: "5px 14px", fontSize: 11, fontWeight: 600, background: "rgba(248,113,113,0.15)", border: "none", borderRadius: 6, color: items.length === 0 ? "rgba(255,255,255,0.2)" : "#f87171", cursor: items.length === 0 ? "default" : "pointer" },
          children: "Empty Trash"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "#f87171" }, children: "Permanently delete all?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: emptyTrash, style: { padding: "4px 10px", fontSize: 11, fontWeight: 700, background: "#f87171", border: "none", borderRadius: 6, color: "#000", cursor: "pointer" }, children: "Yes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmEmpty(false), style: { padding: "4px 10px", fontSize: 11, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer" }, children: "No" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: "8px 10px" }, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "rgba(255,255,255,0.3)" }, children: "Loading…" }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 10, color: "rgba(255,255,255,0.2)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 48 }, children: "🗑️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13 }, children: "Trash is empty" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "32px 1fr 200px 120px 100px", gap: "0 8px", padding: "0 6px", marginBottom: 4 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Original Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Deleted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Size" })
      ] }),
      items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "32px 1fr 200px 120px 100px",
            gap: "0 8px",
            padding: "7px 6px",
            borderRadius: 8,
            marginBottom: 2,
            cursor: "pointer",
            alignItems: "center",
            background: selected.has(item.name) ? "rgba(0,212,255,0.08)" : "transparent"
          },
          onClick: () => toggleSelect(item.name),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: selected.has(item.name),
                onChange: () => toggleSelect(item.name),
                onClick: (e) => e.stopPropagation(),
                style: { accentColor: "var(--cryo-accent)", width: 14, height: 14 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.82)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginRight: 6 }, children: item.name.includes(".") ? "📄" : "📁" }),
              item.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "JetBrains Mono,monospace" }, children: item.originalPath }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: item.deletionDate ? new Date(item.deletionDate).toLocaleDateString() : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono,monospace" }, children: formatSize(item.size) })
          ]
        },
        item.name
      ))
    ] }) }),
    items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelected(new Set(items.map((i) => i.name))),
          style: { fontSize: 11, padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer" },
          children: "Select All"
        }
      ),
      selArr.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelected(/* @__PURE__ */ new Set()),
          style: { fontSize: 11, padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer" },
          children: "Deselect All"
        }
      )
    ] })
  ] });
}
export {
  TrashApp as default
};
