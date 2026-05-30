import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-fqRzwrz8.js";
const ACCENT = "#ff4466";
const ipc = window.cryogram;
function StatusBadge({ active }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        style: {
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: active ? "rgba(0,255,136,0.9)" : "rgba(255,68,102,0.8)",
          boxShadow: active ? "0 0 8px rgba(0,255,136,0.6)" : "0 0 6px rgba(255,68,102,0.5)"
        },
        animate: active ? { opacity: [1, 0.5, 1], scale: [1, 1.2, 1] } : { opacity: 1, scale: 1 },
        transition: active ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      fontSize: 13,
      fontWeight: 700,
      color: active ? "rgba(0,255,136,0.9)" : "rgba(255,68,102,0.85)",
      letterSpacing: "0.03em"
    }, children: active ? "Active" : "Inactive" })
  ] });
}
function PolicyBadge({ policy }) {
  const isDeny = policy === "deny" || policy === "reject";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
    fontSize: 10,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 4,
    background: isDeny ? "rgba(255,68,102,0.1)" : "rgba(0,255,136,0.1)",
    border: `1px solid ${isDeny ? "rgba(255,68,102,0.3)" : "rgba(0,255,136,0.25)"}`,
    color: isDeny ? "#ff4466" : "rgba(0,255,136,0.85)",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  }, children: policy });
}
function ActionBadge({ action }) {
  const isAllow = action.toUpperCase().includes("ALLOW");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 4,
    background: isAllow ? "rgba(0,255,136,0.08)" : "rgba(255,68,102,0.1)",
    border: `1px solid ${isAllow ? "rgba(0,255,136,0.2)" : "rgba(255,68,102,0.3)"}`,
    color: isAllow ? "rgba(0,255,136,0.85)" : "#ff4466",
    letterSpacing: "0.04em",
    fontFamily: "monospace"
  }, children: action });
}
function AddRuleForm({ onAdded }) {
  const [port, setPort] = reactExports.useState("");
  const [proto, setProto] = reactExports.useState("tcp");
  const [from, setFrom] = reactExports.useState("any");
  const [action, setAction] = reactExports.useState("allow");
  const [adding, setAdding] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(false);
  const fieldStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "7px 10px",
    color: "#e0e8f0",
    fontSize: 12,
    outline: "none",
    width: "100%",
    boxSizing: "border-box"
  };
  const submit = async () => {
    if (!port.trim() && !from.trim()) {
      setError("Specify at least a port or source address");
      return;
    }
    setError(null);
    setAdding(true);
    try {
      const result = await ipc.firewall.addRule({
        port: port.trim() || void 0,
        proto: proto !== "any" ? proto : void 0,
        from: from.trim() || void 0,
        action
      });
      if (result.success) {
        setSuccess(true);
        setPort("");
        setFrom("any");
        onAdded();
        setTimeout(() => setSuccess(false), 2e3);
      } else {
        setError(result.error ?? "Failed to add rule");
      }
    } finally {
      setAdding(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 14px", background: "rgba(255,68,102,0.02)", borderTop: "1px solid rgba(255,255,255,0.055)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 600, color: ACCENT, marginBottom: 12 }, children: "Add Rule" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 100px 1fr 100px", gap: 10, marginBottom: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Port" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: port, onChange: (e) => setPort(e.target.value), placeholder: "22, 80, 443…", style: fieldStyle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Protocol" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: proto, onChange: (e) => setProto(e.target.value), style: { ...fieldStyle, background: "rgba(8,12,20,0.9)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "tcp", children: "TCP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "udp", children: "UDP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "any", children: "Any" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: from, onChange: (e) => setFrom(e.target.value), placeholder: "any, 192.168.1.0/24…", style: { ...fieldStyle, fontFamily: "monospace" } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: action, onChange: (e) => setAction(e.target.value), style: { ...fieldStyle, background: "rgba(8,12,20,0.9)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "allow", children: "Allow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "deny", children: "Deny" })
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#ff4466", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 5, padding: "5px 9px", marginBottom: 8 }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick: submit,
        disabled: adding,
        style: {
          padding: "7px 18px",
          background: success ? "rgba(0,255,136,0.1)" : "rgba(255,68,102,0.1)",
          border: `1px solid ${success ? "rgba(0,255,136,0.3)" : "rgba(255,68,102,0.25)"}`,
          borderRadius: 6,
          color: success ? "rgba(0,255,136,0.9)" : ACCENT,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer"
        },
        children: adding ? "Adding…" : success ? "Rule Added!" : "Add Rule"
      }
    )
  ] });
}
function FirewallApp() {
  const [status, setStatus] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [toggling, setToggling] = reactExports.useState(false);
  const [notInstalled, setNotInstalled] = reactExports.useState(false);
  const [confirmReset, setConfirmReset] = reactExports.useState(false);
  const [resetting, setResetting] = reactExports.useState(false);
  const loadStatus = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      const s = await ipc.firewall.status();
      setStatus(s);
      setNotInstalled(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("not found") || msg.includes("ENOENT") || msg.includes("ufw")) {
        setNotInstalled(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    loadStatus();
  }, [loadStatus]);
  const toggle = reactExports.useCallback(async () => {
    if (!status || toggling) return;
    setToggling(true);
    try {
      if (status.active) {
        await ipc.firewall.disable();
      } else {
        await ipc.firewall.enable();
      }
      await loadStatus();
    } finally {
      setToggling(false);
    }
  }, [status, toggling, loadStatus]);
  const deleteRule = reactExports.useCallback(async (number) => {
    await ipc.firewall.deleteRule(number);
    await loadStatus();
  }, [loadStatus]);
  const reset = reactExports.useCallback(async () => {
    setResetting(true);
    try {
      await ipc.firewall.reset();
      setConfirmReset(false);
      await loadStatus();
    } finally {
      setResetting(false);
    }
  }, [loadStatus]);
  if (notInstalled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        style: {
          background: "rgba(10,14,22,0.94)",
          border: "1px solid rgba(255,255,255,0.055)",
          borderRadius: 12,
          padding: "32px 40px",
          textAlign: "center",
          maxWidth: 420
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40, marginBottom: 16 }, children: "🛡️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 600, color: "#e0e8f0", marginBottom: 8 }, children: "UFW not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(140,160,180,0.7)", marginBottom: 20, lineHeight: 1.6 }, children: "This app requires UFW (Uncomplicated Firewall) to be installed on the system." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: '"JetBrains Mono", monospace', fontSize: 12, background: "rgba(255,68,102,0.06)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 6, padding: "10px 16px", color: ACCENT }, children: "sudo apt install ufw" })
        ]
      }
    ) });
  }
  if (loading && !status) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.span,
      {
        style: { fontSize: 12, color: "rgba(140,160,180,0.5)", fontFamily: "monospace" },
        animate: { opacity: [0.4, 1, 0.4] },
        transition: { duration: 1.4, repeat: Infinity },
        children: "Loading firewall status…"
      }
    ) });
  }
  const rules = status?.rules ?? [];
  const nonV6Rules = rules.filter((r) => !r.v6);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "14px 16px",
      borderBottom: "1px solid rgba(255,255,255,0.055)",
      background: "rgba(10,14,22,0.94)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { active: status?.active ?? false }),
        status && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(140,160,180,0.5)", textTransform: "uppercase", letterSpacing: "0.07em" }, children: "IN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PolicyBadge, { policy: status.defaultIn })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(140,160,180,0.5)", textTransform: "uppercase", letterSpacing: "0.07em" }, children: "OUT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PolicyBadge, { policy: status.defaultOut })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            whileHover: { scale: 1.04 },
            whileTap: { scale: 0.96 },
            onClick: () => loadStatus(),
            disabled: loading,
            style: { padding: "5px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, color: "rgba(140,160,180,0.6)", fontSize: 11, cursor: "pointer" },
            children: loading ? "…" : "Refresh"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            whileHover: { scale: 1.04 },
            whileTap: { scale: 0.96 },
            onClick: toggle,
            disabled: toggling,
            style: {
              padding: "7px 16px",
              background: status?.active ? "rgba(255,68,102,0.1)" : "rgba(0,255,136,0.1)",
              border: `1px solid ${status?.active ? "rgba(255,68,102,0.3)" : "rgba(0,255,136,0.25)"}`,
              borderRadius: 6,
              color: status?.active ? ACCENT : "rgba(0,255,136,0.85)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer"
            },
            children: toggling ? "…" : status?.active ? "Disable Firewall" : "Enable Firewall"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: nonV6Rules.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "32px 16px", textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 12 }, children: "📋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "rgba(180,200,220,0.5)" }, children: "No rules configured" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(120,140,160,0.4)", marginTop: 6 }, children: "Add a rule below to get started" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,12,20,0.5)" }, children: ["#", "To / Port", "Action", "From", ""].map((col, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: {
          textAlign: "left",
          padding: "8px 14px",
          fontSize: 10,
          color: "rgba(140,160,180,0.45)",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          fontWeight: 600
        }, children: col }, col + i)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: nonV6Rules.map((rule, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(RuleRow, { rule, index: i, onDelete: () => deleteRule(rule.number) }, `${rule.number}-${rule.to}-${rule.from}`)) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddRuleForm, { onAdded: loadStatus }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "flex-end", background: "rgba(8,12,20,0.3)", flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: confirmReset ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 10 },
          style: { display: "flex", gap: 8, alignItems: "center" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(200,100,100,0.8)" }, children: "Reset all rules to defaults?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: reset,
                disabled: resetting,
                style: { padding: "5px 12px", background: "rgba(255,68,102,0.15)", border: "1px solid rgba(255,68,102,0.4)", borderRadius: 5, color: ACCENT, fontSize: 11, cursor: "pointer", fontWeight: 600 },
                children: resetting ? "Resetting…" : "Confirm Reset"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setConfirmReset(false),
                style: { padding: "5px 10px", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, color: "rgba(140,160,180,0.5)", fontSize: 11, cursor: "pointer" },
                children: "Cancel"
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
          whileHover: { scale: 1.03 },
          whileTap: { scale: 0.97 },
          onClick: () => setConfirmReset(true),
          style: { padding: "5px 12px", background: "transparent", border: "1px solid rgba(255,68,102,0.15)", borderRadius: 5, color: "rgba(200,80,80,0.5)", fontSize: 11, cursor: "pointer" },
          children: "Reset to Defaults"
        },
        "reset-btn"
      ) }) })
    ] })
  ] });
}
function RuleRow({ rule, index, onDelete }) {
  const [confirmDel, setConfirmDel] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0, x: -6 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, height: 0 },
      transition: { delay: index * 0.03 },
      style: { borderBottom: "1px solid rgba(255,255,255,0.04)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "9px 14px", fontFamily: "monospace", color: "rgba(140,160,180,0.45)", fontSize: 11 }, children: rule.number }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "9px 14px", fontFamily: '"JetBrains Mono", monospace', color: "#c9d1d9", fontSize: 12 }, children: rule.to }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "9px 14px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBadge, { action: rule.action }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "9px 14px", fontFamily: '"JetBrains Mono", monospace', color: "rgba(180,200,220,0.65)", fontSize: 12 }, children: rule.from }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "9px 14px", textAlign: "right" }, children: confirmDel ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, justifyContent: "flex-end" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, style: { padding: "3px 8px", background: "rgba(255,68,102,0.15)", border: "1px solid rgba(255,68,102,0.35)", borderRadius: 4, color: ACCENT, fontSize: 10, cursor: "pointer" }, children: "Delete" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmDel(false), style: { padding: "3px 7px", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, color: "rgba(140,160,180,0.5)", fontSize: 10, cursor: "pointer" }, children: "Cancel" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setConfirmDel(true),
            style: { padding: "3px 8px", background: "transparent", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4, color: "rgba(200,80,80,0.45)", fontSize: 10, cursor: "pointer" },
            children: "✕"
          }
        ) })
      ]
    }
  );
}
export {
  FirewallApp as default
};
