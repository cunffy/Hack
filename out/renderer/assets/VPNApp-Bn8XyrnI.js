import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-DQeT4wwp.js";
function formatDuration(ms) {
  const s = Math.floor(ms / 1e3);
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}
function genId() {
  return `vpn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function nowLog(level, message) {
  return { ts: Date.now(), level, message };
}
const TYPE_LABELS = {
  openvpn: "OpenVPN",
  wireguard: "WireGuard"
};
function StatusDot({ connected }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      style: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: connected ? "rgba(0,255,136,0.9)" : "rgba(255,68,102,0.8)",
        boxShadow: connected ? "0 0 8px rgba(0,255,136,0.6)" : "0 0 8px rgba(255,68,102,0.5)",
        flexShrink: 0
      },
      animate: connected ? {
        opacity: [1, 0.5, 1],
        scale: [1, 1.2, 1]
      } : { opacity: 1, scale: 1 },
      transition: connected ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}
    }
  );
}
function VPNApp() {
  const [status, setStatus] = reactExports.useState({ connected: false });
  const [profiles, setProfiles] = reactExports.useState([]);
  const [connectingId, setConnectingId] = reactExports.useState(null);
  const [disconnecting, setDisconnecting] = reactExports.useState(false);
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  const [logs, setLogs] = reactExports.useState([]);
  const [tick, setTick] = reactExports.useState(0);
  const logRef = reactExports.useRef(null);
  const pollRef = reactExports.useRef(null);
  const addLog = reactExports.useCallback((level, message) => {
    setLogs((prev) => [...prev.slice(-199), nowLog(level, message)]);
  }, []);
  reactExports.useEffect(() => {
    window.cryogram.settings.get("vpn.profiles").then((raw) => {
      if (Array.isArray(raw)) setProfiles(raw);
    });
  }, []);
  reactExports.useEffect(() => {
    const poll = async () => {
      try {
        const s = await window.cryogram.vpn.getStatus();
        setStatus((prev) => {
          if (prev.connected !== s.connected) {
            addLog(
              s.connected ? "success" : "warn",
              s.connected ? `VPN connected via ${s.interface ?? "tun0"} — IP: ${s.ip ?? "unknown"}` : "VPN disconnected"
            );
          }
          return s;
        });
      } catch {
      }
    };
    poll();
    pollRef.current = setInterval(poll, 3e3);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [addLog]);
  reactExports.useEffect(() => {
    if (!status.connected || !status.connectedSince) return;
    const id = setInterval(() => setTick((t) => t + 1), 1e3);
    return () => clearInterval(id);
  }, [status.connected, status.connectedSince]);
  reactExports.useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);
  const persistProfiles = reactExports.useCallback((p) => {
    window.cryogram.settings.set("vpn.profiles", p);
  }, []);
  const connect = reactExports.useCallback(async (profile) => {
    if (status.connected || connectingId) return;
    setConnectingId(profile.id);
    addLog("info", `Connecting to "${profile.name}" (${TYPE_LABELS[profile.type]})…`);
    try {
      const res = await window.cryogram.vpn.connect(profile);
      if (res.success) {
        addLog("success", `Connected to "${profile.name}"`);
      } else {
        addLog("error", `Failed to connect: ${res.message ?? "Unknown error"}`);
      }
    } catch (err) {
      addLog("error", `Connection error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setConnectingId(null);
    }
  }, [status.connected, connectingId, addLog]);
  const disconnect = reactExports.useCallback(async () => {
    if (!status.connected || disconnecting) return;
    setDisconnecting(true);
    addLog("info", "Disconnecting VPN…");
    try {
      const res = await window.cryogram.vpn.disconnect();
      if (res.success) {
        addLog("warn", "VPN disconnected");
      } else {
        addLog("error", "Failed to disconnect");
      }
    } catch (err) {
      addLog("error", `Disconnect error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDisconnecting(false);
    }
  }, [status.connected, disconnecting, addLog]);
  const removeProfile = reactExports.useCallback((id) => {
    setProfiles((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persistProfiles(next);
      return next;
    });
    addLog("info", "Profile removed");
  }, [persistProfiles, addLog]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col flex-1 overflow-hidden",
      style: { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "14px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(8,12,20,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { connected: status.connected }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 600, color: status.connected ? "rgba(0,255,136,0.9)" : "rgba(255,68,102,0.8)" }, children: status.connected ? "Connected" : "Disconnected" }),
                  status.connected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(140,160,180,0.65)", marginTop: 1 }, children: [
                    status.ip && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginRight: 10 }, children: [
                      "IP: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--cryo-accent)", fontFamily: '"JetBrains Mono", monospace' }, children: status.ip })
                    ] }),
                    status.interface && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginRight: 10 }, children: [
                      "via ",
                      status.interface
                    ] }),
                    status.connectedSince && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tick >= 0 && formatDuration(Date.now() - status.connectedSince) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
                status.connected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    whileHover: { scale: 1.03 },
                    whileTap: { scale: 0.97 },
                    onClick: disconnect,
                    disabled: disconnecting,
                    style: {
                      padding: "6px 14px",
                      background: "rgba(255,68,102,0.12)",
                      border: "1px solid rgba(255,68,102,0.35)",
                      borderRadius: 6,
                      color: "#ff4466",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer"
                    },
                    children: disconnecting ? "Disconnecting…" : "Disconnect"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    whileHover: { scale: 1.03 },
                    whileTap: { scale: 0.97 },
                    onClick: () => setShowAddForm((v) => !v),
                    style: {
                      padding: "6px 14px",
                      background: showAddForm ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${showAddForm ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 6,
                      color: showAddForm ? "var(--cryo-accent)" : "rgba(180,200,220,0.7)",
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer"
                    },
                    children: showAddForm ? "Cancel" : "+ Add Profile"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.2 },
            style: { overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.08)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AddProfileForm,
              {
                onAdd: (profile) => {
                  const next = [...profiles, profile];
                  setProfiles(next);
                  persistProfiles(next);
                  setShowAddForm(false);
                  addLog("info", `Profile "${profile.name}" added`);
                }
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                width: 260,
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(8,12,20,0.4)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(140,160,180,0.45)", padding: "10px 12px 5px", textTransform: "uppercase", letterSpacing: "0.08em" }, children: "VPN Profiles" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: profiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "12px", fontSize: 11, color: "rgba(100,120,140,0.4)" }, children: "No profiles configured — add one to get started." }) : profiles.map((profile) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProfileRow,
                  {
                    profile,
                    vpnStatus: status,
                    connecting: connectingId === profile.id,
                    onConnect: () => connect(profile),
                    onRemove: () => removeProfile(profile.id)
                  },
                  profile.id
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              fontSize: 10,
              color: "rgba(140,160,180,0.45)",
              padding: "10px 14px 5px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connection Log" }),
              logs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setLogs([]),
                  style: { fontSize: 10, color: "rgba(100,120,140,0.5)", background: "transparent", border: "none", cursor: "pointer", padding: "2px 4px" },
                  children: "Clear"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                ref: logRef,
                style: {
                  flex: 1,
                  overflowY: "auto",
                  padding: "8px 14px",
                  background: "rgba(4,8,14,0.5)",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11
                },
                children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(100,120,140,0.35)", paddingTop: 4 }, children: "Events will appear here…" }) : logs.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, lineHeight: "1.7", alignItems: "flex-start" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(100,120,140,0.4)", flexShrink: 0, fontSize: 10 }, children: new Date(entry.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    color: entry.level === "success" ? "rgba(0,255,136,0.8)" : entry.level === "error" ? "#ff4466" : entry.level === "warn" ? "rgba(255,200,0,0.7)" : "rgba(180,200,220,0.7)"
                  }, children: entry.message })
                ] }, i))
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ProfileRow({ profile, vpnStatus, connecting, onConnect, onRemove }) {
  const [confirmRemove, setConfirmRemove] = reactExports.useState(false);
  const isConnected = vpnStatus.connected;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        padding: "10px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 6
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 500, color: "#c9d1d9" }, children: profile.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(140,160,180,0.5)", marginTop: 1 }, children: TYPE_LABELS[profile.type] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 5 }, children: [
            !isConnected && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: onConnect,
                disabled: connecting || isConnected,
                style: {
                  padding: "4px 10px",
                  background: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  borderRadius: 5,
                  color: "var(--cryo-accent)",
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: "pointer"
                },
                children: connecting ? "…" : "Connect"
              }
            ),
            confirmRemove ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    onRemove();
                    setConfirmRemove(false);
                  },
                  style: { padding: "4px 8px", background: "rgba(255,68,102,0.15)", border: "1px solid rgba(255,68,102,0.35)", borderRadius: 5, color: "#ff4466", fontSize: 10, cursor: "pointer" },
                  children: "Confirm"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setConfirmRemove(false),
                  style: { padding: "4px 8px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5, color: "rgba(140,160,180,0.6)", fontSize: 10, cursor: "pointer" },
                  children: "Cancel"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setConfirmRemove(true),
                style: { padding: "4px 8px", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5, color: "rgba(140,160,180,0.4)", fontSize: 10, cursor: "pointer" },
                children: "✕"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          color: "rgba(100,120,140,0.55)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }, children: profile.configPath })
      ]
    }
  );
}
function AddProfileForm({ onAdd }) {
  const [name, setName] = reactExports.useState("");
  const [type, setType] = reactExports.useState("openvpn");
  const [configPath, setConfigPath] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const browse = async () => {
    try {
      const path = await window.cryogram.fs.openDialog();
      if (path) setConfigPath(path);
    } catch {
    }
  };
  const submit = () => {
    if (!name.trim()) {
      setError("Profile name is required");
      return;
    }
    if (!configPath.trim()) {
      setError("Config file path is required");
      return;
    }
    setError(null);
    onAdd({
      id: genId(),
      name: name.trim(),
      type,
      configPath: configPath.trim(),
      createdAt: Date.now()
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 16px", background: "rgba(0,212,255,0.03)", display: "flex", flexDirection: "column", gap: 10 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--cryo-accent)", marginBottom: 2 }, children: "Add VPN Profile" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 160px", gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "My VPN",
            style: {
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 5,
              padding: "6px 9px",
              color: "#e0e8f0",
              fontSize: 12,
              outline: "none"
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }, children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: type,
            onChange: (e) => setType(e.target.value),
            style: {
              width: "100%",
              background: "rgba(8,12,20,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 5,
              padding: "6px 9px",
              color: "#e0e8f0",
              fontSize: 12,
              outline: "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "openvpn", children: "OpenVPN" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "wireguard", children: "WireGuard" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }, children: [
        "Config File ",
        type === "openvpn" ? "(.ovpn)" : "(.conf)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: configPath,
            onChange: (e) => setConfigPath(e.target.value),
            placeholder: type === "openvpn" ? "/etc/openvpn/client.ovpn" : "/etc/wireguard/wg0.conf",
            style: {
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 5,
              padding: "6px 9px",
              color: "#e0e8f0",
              fontSize: 12,
              fontFamily: '"JetBrains Mono", monospace',
              outline: "none"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: browse,
            style: {
              padding: "6px 12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 5,
              color: "rgba(180,200,220,0.7)",
              fontSize: 11,
              cursor: "pointer",
              whiteSpace: "nowrap"
            },
            children: "Browse…"
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#ff4466", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 5, padding: "5px 9px" }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
        onClick: submit,
        style: {
          padding: "7px 18px",
          background: "rgba(0,212,255,0.12)",
          border: "1px solid rgba(0,212,255,0.3)",
          borderRadius: 6,
          color: "var(--cryo-accent)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer"
        },
        children: "Add Profile"
      }
    ) })
  ] });
}
export {
  VPNApp as default
};
