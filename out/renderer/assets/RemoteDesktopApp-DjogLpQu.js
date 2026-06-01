import { r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./index-BXCeEECP.js";
const api = () => window.cryogram?.remoteDesktop;
function UrlRow({ label, url, color = "green" }) {
  const [copied, setCopied] = reactExports.useState(false);
  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  const accent = color === "purple" ? "text-purple-300" : "text-green-300";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 rounded-lg px-3 py-2 space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs font-semibold uppercase tracking-wider ${color === "purple" ? "text-purple-400" : "text-green-500"}`, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold flex-1 truncate ${accent}`, children: url }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: copy,
          className: `text-xs px-2 py-0.5 rounded shrink-0 ${copied ? "bg-green-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"}`,
          children: copied ? "✓" : "Copy"
        }
      )
    ] })
  ] });
}
function RemoteDesktopApp() {
  const [deps, setDeps] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [running, setRunning] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(null);
  const [logs, setLogs] = reactExports.useState([]);
  const [password, setPassword] = reactExports.useState("");
  const [viewOnly, setViewOnly] = reactExports.useState(false);
  const [tsStatus, setTsStatus] = reactExports.useState(null);
  const [tsLoading, setTsLoading] = reactExports.useState(null);
  const logRef = reactExports.useRef(null);
  const addLog = reactExports.useCallback((msg) => {
    setLogs((prev) => [...prev.slice(-80), msg]);
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50);
  }, []);
  const refreshTailscale = reactExports.useCallback(async () => {
    const s = await api()?.tailscaleStatus();
    if (s) setTsStatus(s);
  }, []);
  reactExports.useEffect(() => {
    api()?.checkDeps().then(setDeps);
    api()?.status().then((s) => setRunning(s?.running ?? false));
    refreshTailscale();
    const offLog = api()?.onLog?.((msg) => addLog(msg));
    const offStopped = api()?.onStopped?.(() => {
      setRunning(false);
      setSession(null);
      addLog("Session ended.");
    });
    return () => {
      offLog?.();
      offStopped?.();
    };
  }, [addLog, refreshTailscale]);
  async function installDeps() {
    setLoading("install");
    addLog("Running: sudo apt-get install x11vnc novnc…");
    try {
      const res = await api()?.installDeps();
      if (res?.ok) {
        addLog("Installation complete.");
        const d = await api()?.checkDeps();
        setDeps(d);
      } else {
        addLog(`Failed: ${res?.error || "unknown error"}`);
      }
    } catch (e) {
      addLog(`Error: ${e.message}`);
    }
    setLoading(null);
  }
  async function startSession() {
    setLoading("start");
    setLogs([]);
    try {
      const res = await api()?.start({ password: password || void 0, viewOnly });
      if (res?.ok) {
        setSession(res);
        setRunning(true);
        addLog(`Session started — ${res.url}`);
      } else {
        addLog("Failed to start session.");
      }
    } catch (e) {
      addLog(`Error: ${e.message}`);
    }
    setLoading(null);
  }
  async function stopSession() {
    setLoading("stop");
    try {
      await api()?.stop();
      setRunning(false);
      setSession(null);
      addLog("Session stopped.");
    } catch {
    }
    setLoading(null);
  }
  async function installTailscale() {
    setTsLoading("install");
    addLog("Installing Tailscale…");
    try {
      const res = await api()?.installTailscale();
      if (res?.ok) {
        addLog("Tailscale installed.");
        await refreshTailscale();
      } else addLog(`Failed: ${res?.error ?? "unknown error"}`);
    } catch (e) {
      addLog(`Error: ${e.message}`);
    }
    setTsLoading(null);
  }
  async function connectTailscale() {
    setTsLoading("up");
    addLog("Connecting Tailscale (check browser for auth URL)…");
    try {
      await api()?.tailscaleUp();
      await refreshTailscale();
    } catch (e) {
      addLog(`Error: ${e.message}`);
    }
    setTsLoading(null);
  }
  const missingDeps = deps && (!deps.x11vnc || !deps.websockify);
  const tsUrl = running && session && tsStatus?.running && tsStatus.ip ? `http://${tsStatus.ip}:${session.httpPort}` : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-gray-950 text-gray-100 font-mono", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-gray-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2.5 h-2.5 rounded-full ${running ? "bg-green-400 shadow-[0_0_6px_#4ade80]" : "bg-gray-600"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-green-400", children: "Remote Desktop" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 ml-1", children: running ? "Session active" : "Stopped" }),
      tsStatus?.running && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto flex items-center gap-1.5 text-xs text-purple-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_#a78bfa]" }),
        "Tailscale connected"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-72 flex flex-col gap-4 p-4 border-r border-gray-800 overflow-y-auto shrink-0", children: [
        deps && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 rounded-lg border border-gray-800 p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider mb-2", children: "Dependencies" }),
          [
            { name: "x11vnc", ok: deps.x11vnc, hint: "VNC server" },
            { name: "websockify", ok: deps.websockify, hint: "WebSocket proxy" },
            { name: "novnc", ok: deps.novnc, hint: "Web client (optional)" }
          ].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${d.ok ? "text-green-400" : "text-red-400"}`, children: d.ok ? "✓" : "✗" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-300", children: d.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-600 ml-auto", children: d.hint })
          ] }, d.name)),
          missingDeps && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: installDeps,
              disabled: loading === "install",
              className: "w-full mt-2 text-xs px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-black font-semibold rounded",
              children: loading === "install" ? "Installing…" : "Install Missing"
            }
          )
        ] }),
        tsStatus !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 rounded-lg border border-purple-900/40 p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-purple-400 uppercase tracking-wider mb-2", children: "Tailscale (Remote Access)" }),
          !tsStatus.installed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Not installed. Install Tailscale to access this machine from anywhere — no VPN or port-forwarding needed." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: installTailscale,
                disabled: tsLoading === "install",
                className: "w-full text-xs px-3 py-1.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold rounded",
                children: tsLoading === "install" ? "Installing…" : "Install Tailscale"
              }
            )
          ] }) : !tsStatus.running ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-yellow-400", children: "✗" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-300", children: "Tailscale not connected" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: connectTailscale,
                disabled: tsLoading === "up",
                className: "w-full text-xs px-3 py-1.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold rounded",
                children: tsLoading === "up" ? "Connecting…" : "Connect Tailscale"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "A browser tab will open for authentication." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-green-400", children: "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-300", children: "Connected" }),
              tsStatus.hostname && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 ml-auto", children: tsStatus.hostname })
            ] }),
            tsStatus.ip && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-purple-300 font-mono", children: tsStatus.ip }),
            running && tsUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 pt-1", children: "Use the Tailscale URL below to connect from any device on your Tailscale network." })
          ] })
        ] }),
        !running && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 rounded-lg border border-gray-800 p-3 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider", children: "Options" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-gray-400 block mb-1", children: "Session Password (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "Leave blank for no password",
                className: "w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: viewOnly,
                onChange: (e) => setViewOnly(e.target.checked),
                className: "accent-green-500"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "View only (no control)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: running ? stopSession : startSession,
            disabled: !!loading || !!(deps && missingDeps && !running),
            className: `w-full py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-40 ${running ? "bg-red-700 hover:bg-red-600 text-white" : "bg-green-600 hover:bg-green-500 text-black"}`,
            children: loading === "start" ? "Starting…" : loading === "stop" ? "Stopping…" : running ? "⏹ Stop Session" : "▶ Start Session"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: running && session && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: "bg-green-950/30 border border-green-800/50 rounded-lg p-4 space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-400 font-semibold uppercase tracking-wider", children: "Connect from your phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(UrlRow, { label: "Local Network (same Wi-Fi)", url: session.url, color: "green" }),
              tsUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(UrlRow, { label: "Tailscale (anywhere)", url: tsUrl, color: "purple" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "text-xs text-gray-400 space-y-1 list-decimal list-inside", children: [
                tsUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                    "Use the ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-purple-300", children: "Tailscale URL" }),
                    " to connect from ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "any" }),
                    " device on your Tailscale network"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                    "Use the ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-green-300", children: "Local URL" }),
                    " when on the same Wi-Fi"
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Make sure phone is on the ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-gray-300", children: "same Wi-Fi network" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Open the URL in your phone browser (Safari, Chrome, Firefox)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Tap ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-gray-300", children: "Connect" }),
                  " in the noVNC panel"
                ] }),
                password && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Enter the session password" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "You now have full control" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 pt-1 border-t border-gray-800", children: [
                "VNC :",
                session.vncPort,
                " · WS :",
                session.wsPort,
                " · HTTP :",
                session.httpPort
              ] })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-gray-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 uppercase tracking-wider", children: "Session Log" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLogs([]), className: "text-xs text-gray-600 hover:text-gray-400", children: "Clear" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: logRef, className: "flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs", children: [
          logs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Start a session to see logs…" }),
          logs.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 leading-relaxed", children: l }, i))
        ] }),
        !running && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-800 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider mb-3", children: "How it works" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-3 text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 rounded p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 font-semibold mb-1", children: "1. Start Session" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "x11vnc captures your screen. websockify opens a WebSocket tunnel." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 rounded p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 font-semibold mb-1", children: "2. Same Network" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Open the Local URL in your phone's browser while on the same Wi-Fi." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 rounded p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 font-semibold mb-1 text-purple-300", children: "3. Anywhere" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Connect Tailscale for remote access from any device, over any network." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 rounded p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 font-semibold mb-1", children: "4. Full Control" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Touch = mouse click. Drag = move. On-screen keyboard for typing." })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  RemoteDesktopApp as default
};
