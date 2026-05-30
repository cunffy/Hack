import { r as reactExports, j as jsxRuntimeExports } from "./index-BxJJzso-.js";
const s = {
  root: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14, alignItems: "center", justifyContent: "center" },
  btn: (c, t = "#000", disabled = false) => ({ padding: "8px 24px", borderRadius: 8, border: "none", cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, background: disabled ? "rgba(255,255,255,0.05)" : c, color: disabled ? "rgba(255,255,255,0.3)" : t, opacity: disabled ? 0.5 : 1 }),
  small: (c, t = "rgba(255,255,255,0.7)") => ({ padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: c, color: t })
};
const MODES = [
  { key: "focus", label: "Focus", mins: 25, color: "#ef4444" },
  { key: "short", label: "Short Break", mins: 5, color: "#22c55e" },
  { key: "long", label: "Long Break", mins: 15, color: "#00d4ff" }
];
function PomodoroApp() {
  const [modeKey, setModeKey] = reactExports.useState("focus");
  const [secsLeft, setSecsLeft] = reactExports.useState(25 * 60);
  const [running, setRunning] = reactExports.useState(false);
  const [sessions, setSessions] = reactExports.useState(0);
  const [tasks, setTasks] = reactExports.useState([]);
  const [newTask, setNewTask] = reactExports.useState("");
  const [activeTask, setActiveTask] = reactExports.useState(null);
  const intervalRef = reactExports.useRef();
  const mode = MODES.find((m) => m.key === modeKey);
  reactExports.useEffect(() => {
    setSecsLeft(mode.mins * 60);
    setRunning(false);
    clearInterval(intervalRef.current);
  }, [modeKey]);
  reactExports.useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecsLeft((s2) => {
        if (s2 <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          if (modeKey === "focus") {
            setSessions((n) => n + 1);
            if (activeTask) setTasks((t) => t.map((t2) => t2.id === activeTask ? { ...t2, pomodoros: t2.pomodoros + 1 } : t2));
            try {
              new Notification("Focus session complete! Take a break.");
            } catch {
            }
          }
          return 0;
        }
        return s2 - 1;
      });
    }, 1e3);
    return () => clearInterval(intervalRef.current);
  }, [running, modeKey, activeTask]);
  const mins = Math.floor(secsLeft / 60);
  const secs = secsLeft % 60;
  const total = mode.mins * 60;
  const progress = (total - secsLeft) / total * 100;
  const circumference = 2 * Math.PI * 90;
  const dash = circumference - progress / 100 * circumference;
  function addTask() {
    if (!newTask.trim()) return;
    setTasks((t) => [...t, { id: Date.now().toString(), text: newTask.trim(), done: false, pomodoros: 0 }]);
    setNewTask("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, marginBottom: 32 }, children: MODES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.small(modeKey === m.key ? m.color : "rgba(255,255,255,0.07)", modeKey === m.key ? "#000" : "rgba(255,255,255,0.7)"), onClick: () => setModeKey(m.key), children: m.label }, m.key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: 200, height: 200, marginBottom: 32 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 200, height: 200, style: { position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: 100, cy: 100, r: 90, fill: "none", stroke: "rgba(255,255,255,0.06)", strokeWidth: 8 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: 100, cy: 100, r: 90, fill: "none", stroke: mode.color, strokeWidth: 8, strokeDasharray: circumference, strokeDashoffset: dash, strokeLinecap: "round", style: { transition: "stroke-dashoffset 0.5s" } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 44, fontWeight: 800, color: mode.color, lineHeight: 1 }, children: [
          String(mins).padStart(2, "0"),
          ":",
          String(secs).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }, children: mode.label })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, marginBottom: 32 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn(running ? "rgba(255,255,255,0.08)" : "#ef4444", running ? "rgba(255,255,255,0.7)" : "#fff"), onClick: () => setRunning((r) => !r), children: running ? "⏸ Pause" : "▶ Start" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.06)", "rgba(255,255,255,0.6)"), onClick: () => {
        setSecsLeft(mode.mins * 60);
        setRunning(false);
      }, children: "↺ Reset" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 20, marginBottom: 32, fontSize: 12, color: "rgba(255,255,255,0.4)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      "🍅 Sessions today: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "rgba(255,255,255,0.8)" }, children: sessions })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 340 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }, children: "TASKS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginBottom: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 10px", color: "rgba(255,255,255,0.85)", fontSize: 12, outline: "none" }, placeholder: "Add a task…", value: newTask, onChange: (e) => setNewTask(e.target.value), onKeyDown: (e) => e.key === "Enter" && addTask() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("var(--cryo-accent,#00d4ff)"), onClick: addTask, children: "+" })
      ] }),
      tasks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: t.done, onChange: () => setTasks((ts) => ts.map((x) => x.id === t.id ? { ...x, done: !x.done } : x)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { flex: 1, fontSize: 12, textDecoration: t.done ? "line-through" : "none", color: t.done ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.8)", cursor: "pointer" }, onClick: () => setActiveTask(activeTask === t.id ? null : t.id), children: [
          activeTask === t.id && "▶ ",
          t.text
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#ef4444" }, children: "🍅".repeat(Math.min(t.pomodoros, 5)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 12 }, onClick: () => setTasks((ts) => ts.filter((x) => x.id !== t.id)), children: "×" })
      ] }, t.id))
    ] })
  ] });
}
export {
  PomodoroApp as default
};
