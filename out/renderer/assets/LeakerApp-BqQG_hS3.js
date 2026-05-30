import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-BLdhfVO6.js";
function MonitorDashboard({ targets, breaches, onAdd, onRemove }) {
  const [type, setType] = reactExports.useState("email");
  const [value, setValue] = reactExports.useState("");
  const [label, setLabel] = reactExports.useState("");
  const [adding, setAdding] = reactExports.useState(false);
  const add = async () => {
    if (!value.trim()) return;
    setAdding(true);
    try {
      await onAdd(type, value.trim(), label.trim() || void 0);
      setValue("");
      setLabel("");
    } finally {
      setAdding(false);
    }
  };
  const breachCountFor = (targetId) => breaches.filter((b) => b.target_id === targetId).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4 overflow-auto flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted uppercase tracking-wider mb-3", children: "Add Target to Monitor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: type,
            onChange: (e) => setType(e.target.value),
            className: "w-28",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "email", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "domain", children: "Domain" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "username", children: "Username" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "flex-1 min-w-40",
            placeholder: type === "email" ? "user@company.com" : type === "domain" ? "company.com" : "username",
            value,
            onChange: (e) => setValue(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && add()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-36",
            placeholder: "Label (optional)",
            value: label,
            onChange: (e) => setLabel(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: add, disabled: !value.trim() || adding, children: adding ? "Adding..." : "Add" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cryo-muted uppercase tracking-wider mb-2", children: [
        "Monitored Targets (",
        targets.length,
        ")"
      ] }),
      targets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel p-4 text-center text-xs text-cryo-muted", children: "No targets yet. Add emails, domains, or usernames to monitor for breaches." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: targets.map((t) => {
        const count = breachCountFor(t.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge text-xs ${t.type === "email" ? "bg-cryo-accent/10 text-cryo-accent" : t.type === "domain" ? "bg-cryo-purple/10 text-cryo-purple" : "bg-cryo-green/10 text-cryo-green"}`, children: t.type }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-cryo-text", children: t.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted font-mono", children: t.value })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            count > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge bg-cryo-red/20 text-cryo-red", children: [
              count,
              " breaches"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge bg-cryo-green/10 text-cryo-green", children: "Clean" }),
            t.last_checked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cryo-muted mt-0.5", children: [
              "Checked: ",
              new Date(t.last_checked).toLocaleDateString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => onRemove(t.id),
              className: "text-cryo-muted hover:text-cryo-red transition-colors text-xs ml-1",
              children: "Remove"
            }
          )
        ] }, t.id);
      }) })
    ] }),
    targets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
      { label: "Monitored", value: targets.length, color: "#00d4ff" },
      { label: "Total Breaches", value: breaches.length, color: "#ff4466" },
      { label: "Clean Targets", value: targets.filter((t) => breachCountFor(t.id) === 0).length, color: "#00ff88" }
    ].map(({ label: label2, value: value2, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-3 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold font-mono", style: { color }, children: value2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted mt-1", children: label2 })
    ] }, label2)) })
  ] });
}
function BreachList({ breaches, targets }) {
  const [filter, setFilter] = reactExports.useState("");
  const targetMap = Object.fromEntries(targets.map((t) => [t.id, t]));
  const filtered = breaches.filter((b) => {
    if (!filter) return true;
    const target = targetMap[b.target_id];
    return b.breach_name?.toLowerCase().includes(filter.toLowerCase()) || target?.value.toLowerCase().includes(filter.toLowerCase()) || b.source?.toLowerCase().includes(filter.toLowerCase());
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-b border-cryo-border shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "w-full",
        placeholder: "Filter by breach name, target, source...",
        value: filter,
        onChange: (e) => setFilter(e.target.value)
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-cryo-muted text-xs", children: breaches.length === 0 ? "No breaches found yet — run a refresh to check" : "No results match filter" }) : filtered.map((b) => {
      const target = targetMap[b.target_id];
      let dataClasses = [];
      try {
        dataClasses = b.data_classes ? JSON.parse(b.data_classes) : [];
      } catch {
      }
      const hoursAgo = (Date.now() - new Date(b.discovered_at).getTime()) / 36e5;
      const isNew = hoursAgo < 24;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "p-3 border-b border-cryo-border hover:bg-cryo-surface/50 transition-colors",
          style: isNew ? { borderLeft: "2px solid #ff4466" } : {},
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                isNew && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge bg-cryo-red/20 text-cryo-red text-xs", children: "NEW" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-text font-medium text-sm", children: b.breach_name || "Unknown Breach" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge bg-cryo-surface text-cryo-muted text-xs", children: b.source }),
                b.breach_date && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cryo-muted", children: b.breach_date })
              ] })
            ] }),
            target && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cryo-muted mb-1.5", children: [
              "Target: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-accent font-mono", children: target.value })
            ] }),
            dataClasses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mb-1.5", children: dataClasses.map((dc) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge bg-cryo-yellow/10 text-cryo-yellow text-xs", children: dc }, dc)) }),
            b.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted line-clamp-2", children: b.description.replace(/<[^>]+>/g, "") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cryo-muted mt-1.5", children: [
              "Discovered: ",
              new Date(b.discovered_at).toLocaleString()
            ] })
          ]
        },
        b.id
      );
    }) })
  ] });
}
const TABS = [
  { id: "dashboard", label: "Monitor" },
  { id: "breaches", label: "Breach Feed" }
];
function LeakerApp() {
  const [tab, setTab] = reactExports.useState("dashboard");
  const [targets, setTargets] = reactExports.useState([]);
  const [breaches, setBreaches] = reactExports.useState([]);
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const [lastRefresh, setLastRefresh] = reactExports.useState(null);
  const loadData = reactExports.useCallback(async () => {
    const [t, b] = await Promise.all([
      window.cryogram.leaker.getTargets(),
      window.cryogram.leaker.getBreaches()
    ]);
    setTargets(t);
    setBreaches(b);
  }, []);
  reactExports.useEffect(() => {
    loadData();
  }, [loadData]);
  const refresh = async () => {
    setRefreshing(true);
    try {
      await window.cryogram.leaker.forceRefresh();
      await loadData();
      setLastRefresh(/* @__PURE__ */ new Date());
    } finally {
      setRefreshing(false);
    }
  };
  const addTarget = async (type, value, label) => {
    await window.cryogram.leaker.addTarget({ type, value, label });
    await loadData();
  };
  const removeTarget = async (id) => {
    await window.cryogram.leaker.removeTarget(id);
    await loadData();
  };
  const newBreaches = breaches.filter((b) => {
    const hours = (Date.now() - new Date(b.discovered_at).getTime()) / 36e5;
    return hours < 24;
  }).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-4 py-2.5 shrink-0",
        style: { borderBottom: "1px solid rgba(26,40,64,0.7)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "w-2 h-2 rounded-full bg-cryo-red",
                animate: { opacity: [1, 0.3, 1], scale: [1, 1.3, 1] },
                transition: { duration: 2, repeat: Infinity },
                style: { boxShadow: "0 0 6px rgba(255,68,102,0.7)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-cryo-muted", children: [
              targets.length,
              " monitored · ",
              breaches.length,
              " total breaches",
              newBreaches > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.span,
                {
                  initial: { scale: 0.8 },
                  animate: { scale: 1 },
                  className: "text-cryo-red ml-2 font-bold",
                  children: [
                    newBreaches,
                    " new"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            lastRefresh && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-cryo-muted", children: [
              "Last: ",
              lastRefresh.toLocaleTimeString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn text-xs py-1", onClick: refresh, disabled: refreshing, children: refreshing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.span,
                {
                  animate: { rotate: 360 },
                  transition: { duration: 0.9, repeat: Infinity, ease: "linear" },
                  className: "inline-block",
                  children: "⟳"
                }
              ),
              "Checking…"
            ] }) : "Refresh Now" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex shrink-0 relative",
        style: { borderBottom: "1px solid rgba(26,40,64,0.7)" },
        children: TABS.map(({ id, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setTab(id),
            className: "relative px-5 py-2.5 text-xs font-medium transition-colors",
            style: { color: tab === id ? "#ff4466" : "#4e5d6e" },
            children: [
              label,
              id === "breaches" && newBreaches > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.span,
                {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  className: "ml-1.5 badge bg-cryo-red/20 text-cryo-red",
                  children: newBreaches
                }
              ),
              tab === id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  layoutId: "leaker-tab-indicator",
                  className: "absolute bottom-0 left-0 right-0 h-px",
                  style: { background: "#ff4466", boxShadow: "0 0 6px rgba(255,68,102,0.6)" },
                  transition: { type: "spring", stiffness: 400, damping: 30 }
                }
              )
            ]
          },
          id
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute inset-0",
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.18, ease: "easeOut" },
        children: tab === "dashboard" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          MonitorDashboard,
          {
            targets,
            breaches,
            onAdd: addTarget,
            onRemove: removeTarget
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(BreachList, { breaches, targets })
      },
      tab
    ) }) })
  ] });
}
export {
  LeakerApp as default
};
