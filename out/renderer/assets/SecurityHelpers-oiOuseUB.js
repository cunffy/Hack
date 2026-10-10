import { r as reactExports, j as jsxRuntimeExports } from "./index-C2o2k6pL.js";
const ACCENT = "#00d4ff";
const DEFAULT_WORDLIST = "/usr/share/wordlists/rockyou.txt";
function BrowseButton({
  onPick,
  mode = "open",
  label = "Browse…",
  title = "Choose a file"
}) {
  const [busy, setBusy] = reactExports.useState(false);
  const browse = async () => {
    setBusy(true);
    try {
      const res = await window.cryogram?.files?.openDialog?.(mode);
      const path = Array.isArray(res) ? res[0] : typeof res === "string" ? res : null;
      if (path) onPick(path);
    } catch {
    }
    setBusy(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: browse,
      disabled: busy,
      title,
      style: {
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "0 12px",
        height: 34,
        background: "rgba(0,212,255,0.1)",
        border: `1px solid ${ACCENT}44`,
        borderRadius: 6,
        color: ACCENT,
        fontSize: 12,
        fontWeight: 600,
        cursor: busy ? "default" : "pointer",
        whiteSpace: "nowrap"
      },
      onMouseEnter: (e) => {
        if (!busy) e.currentTarget.style.background = "rgba(0,212,255,0.18)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "rgba(0,212,255,0.1)";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" }) }),
        label
      ]
    }
  );
}
function FilePathInput({
  value,
  onChange,
  placeholder,
  mode = "open",
  inputClassName
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "stretch" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: inputClassName,
        style: inputClassName ? { flex: 1 } : {
          flex: 1,
          height: 34,
          padding: "0 10px",
          background: "rgba(8,12,18,0.6)",
          border: "1px solid rgba(26,40,64,0.6)",
          borderRadius: 6,
          color: "#c9d1d9",
          fontSize: 13,
          outline: "none"
        },
        placeholder,
        value,
        onChange: (e) => onChange(e.target.value)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrowseButton, { onPick: onChange, mode })
  ] });
}
function HelpBox({
  title = "How to use this tool",
  children,
  defaultOpen = true,
  storageKey
}) {
  const initial = (() => {
    if (!storageKey) return defaultOpen;
    try {
      const v = localStorage.getItem(`cryo-help-${storageKey}`);
      return v === null ? defaultOpen : v === "1";
    } catch {
      return defaultOpen;
    }
  })();
  const [open, setOpen] = reactExports.useState(initial);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (storageKey) {
      try {
        localStorage.setItem(`cryo-help-${storageKey}`, next ? "1" : "0");
      } catch {
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "rgba(0,212,255,0.05)",
    border: `1px solid ${ACCENT}26`,
    borderRadius: 8,
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: toggle,
        style: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: ACCENT,
          fontSize: 12,
          fontWeight: 700,
          textAlign: "left"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              style: { transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", opacity: 0.7 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "6 9 12 15 18 9" })
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      padding: "2px 14px 12px 14px",
      color: "rgba(255,255,255,0.72)",
      fontSize: 12,
      lineHeight: 1.6
    }, children })
  ] });
}
function FieldHelp({ name, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 4 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: ACCENT, fontWeight: 600 }, children: name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.4)" }, children: " — " }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children })
  ] });
}
export {
  DEFAULT_WORDLIST as D,
  FieldHelp as F,
  HelpBox as H,
  FilePathInput as a
};
