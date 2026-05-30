import { r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion, a as TutorialSlides, c as useThemeStore, T as THEME_PRESETS } from "./index-BxJJzso-.js";
const TABS = [
  { id: "appearance", label: "Appearance", icon: "🎨" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "network", label: "Network", icon: "📶" },
  { id: "bluetooth", label: "Bluetooth", icon: "🔵" },
  { id: "sound", label: "Sound", icon: "🔊" },
  { id: "display", label: "Display", icon: "🖥" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "apikeys", label: "API Keys", icon: "🔑" },
  { id: "update", label: "Update", icon: "🔄" },
  { id: "about", label: "About", icon: "ℹ️" },
  { id: "guide", label: "Guide", icon: "📖" }
];
function SettingsApp({ initialTab }) {
  const [tab, setTab] = reactExports.useState(initialTab ?? "appearance");
  reactExports.useEffect(() => {
    const h = (e) => setTab(e.detail);
    window.addEventListener("cryogram:openSettingsTab", h);
    return () => window.removeEventListener("cryogram:openSettingsTab", h);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden text-cryo-text", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 flex flex-col py-3",
        style: {
          width: 180,
          borderRight: "1px solid rgba(26,40,64,0.6)",
          background: "rgba(8,12,18,0.5)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 mb-2 text-cryo-muted text-xs uppercase tracking-widest", children: "Settings" }),
          TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setTab(t.id),
              className: "flex items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-white/5 text-left",
              style: {
                color: tab === t.id ? "var(--cryo-accent)" : "rgba(255,255,255,0.55)",
                background: tab === t.id ? "var(--cryo-a08)" : "transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 text-center text-sm", children: t.icon }),
                t.label
              ]
            },
            t.id
          ))
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: 8 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -8 },
        transition: { duration: 0.15 },
        className: "h-full",
        children: [
          tab === "appearance" && /* @__PURE__ */ jsxRuntimeExports.jsx(AppearancePanel, {}),
          tab === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfilePanel, {}),
          tab === "network" && /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkPanel, {}),
          tab === "bluetooth" && /* @__PURE__ */ jsxRuntimeExports.jsx(BluetoothPanel, {}),
          tab === "sound" && /* @__PURE__ */ jsxRuntimeExports.jsx(SoundPanel, {}),
          tab === "display" && /* @__PURE__ */ jsxRuntimeExports.jsx(DisplayPanel, {}),
          tab === "security" && /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityPanel, {}),
          tab === "apikeys" && /* @__PURE__ */ jsxRuntimeExports.jsx(ApiKeysPanel, {}),
          tab === "update" && /* @__PURE__ */ jsxRuntimeExports.jsx(UpdatePanel, {}),
          tab === "about" && /* @__PURE__ */ jsxRuntimeExports.jsx(AboutPanel, {}),
          tab === "guide" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TutorialSlides, { inline: true }) })
        ]
      },
      tab
    ) }) })
  ] });
}
function AppearancePanel() {
  const { preset: activePreset, accent, setPreset, setCustomAccent } = useThemeStore();
  const [hexInput, setHexInput] = reactExports.useState(accent);
  reactExports.useEffect(() => setHexInput(accent), [accent]);
  const handleHexCommit = (v) => {
    if (/^#[0-9a-fA-F]{6}$/.test(v)) setCustomAccent(v);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-cryo-text mb-1", children: "Appearance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted", children: "Customize the look and feel of Cryogram OS." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted uppercase tracking-wider font-bold", children: "Theme Preset" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: THEME_PRESETS.map((p) => {
        const active = activePreset === p.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setPreset(p.id),
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              borderRadius: 10,
              cursor: "pointer",
              border: active ? `1px solid ${p.accent}55` : "1px solid rgba(255,255,255,0.08)",
              background: active ? `${p.accent}12` : "rgba(255,255,255,0.04)",
              transition: "all 0.15s",
              boxShadow: active ? `0 0 12px ${p.accent}20` : "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    display: "inline-block",
                    background: p.accent,
                    boxShadow: active ? `0 0 8px ${p.accent}` : "none"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                fontSize: 12,
                fontFamily: "monospace",
                letterSpacing: "0.04em",
                color: active ? p.accent : "rgba(255,255,255,0.5)",
                transition: "color 0.15s"
              }, children: p.name })
            ]
          },
          p.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted uppercase tracking-wider font-bold", children: "Custom Accent Color" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            style: {
              position: "relative",
              width: 36,
              height: 36,
              borderRadius: 8,
              background: accent,
              cursor: "pointer",
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.15)",
              boxShadow: `0 0 12px ${accent}40`,
              flexShrink: 0
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: hexInput,
                onChange: (e) => {
                  setHexInput(e.target.value);
                  setCustomAccent(e.target.value);
                },
                style: { opacity: 0, position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "pointer" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            className: "w-28",
            value: hexInput,
            maxLength: 7,
            placeholder: "#00d4ff",
            onChange: (e) => setHexInput(e.target.value),
            onBlur: (e) => handleHexCommit(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") handleHexCommit(hexInput);
            },
            style: { fontFamily: "monospace", fontSize: 12, textTransform: "uppercase" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cryo-muted", children: "Overrides the preset accent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: ["#00d4ff", "#a855f7", "#10b981", "#f97316", "#ef4444", "#f59e0b", "#ec4899", "#94a3b8"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setHexInput(c);
            setCustomAccent(c);
          },
          title: c,
          style: {
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: c,
            cursor: "pointer",
            border: accent === c ? `2px solid white` : "2px solid transparent",
            boxShadow: accent === c ? `0 0 8px ${c}` : "none",
            transition: "all 0.15s"
          }
        },
        c
      )) })
    ] })
  ] });
}
function ProfilePanel() {
  const [name, setName] = reactExports.useState("Operator");
  const [email, setEmail] = reactExports.useState("");
  const [saved, setSaved] = reactExports.useState(false);
  reactExports.useEffect(() => {
    window.cryogram.settings.getAll().then((all) => {
      setName(all["profile.name"] || "Operator");
      setEmail(all["profile.email"] || "");
    }).catch(() => {
    });
  }, []);
  const save = async () => {
    await window.cryogram.settings.set("profile.name", name);
    await window.cryogram.settings.set("profile.email", email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  };
  const letter = name?.trim()?.[0]?.toUpperCase() || "O";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-cryo-text mb-1", children: "Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted", children: "Your operator identity on this system." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--cryo-a08)",
              border: "2px solid var(--cryo-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--cryo-accent)",
              flexShrink: 0
            },
            children: letter
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-cryo-text", children: name || "Operator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted", children: email || "No email set" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1", children: "Display Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full",
            placeholder: "Operator",
            value: name,
            onChange: (e) => setName(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full",
            type: "email",
            placeholder: "operator@cryogram.local",
            value: email,
            onChange: (e) => setEmail(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary w-fit", onClick: save, children: saved ? "✓ Saved" : "Save Profile" })
    ] })
  ] });
}
function NetworkPanel() {
  const [networks, setNetworks] = reactExports.useState([]);
  const [status, setStatus] = reactExports.useState(null);
  const [connecting, setConnecting] = reactExports.useState(null);
  const [pwdFor, setPwdFor] = reactExports.useState(null);
  const [pwd, setPwd] = reactExports.useState("");
  const [scanning, setScanning] = reactExports.useState(false);
  const [connectError, setConnectError] = reactExports.useState(null);
  const load = reactExports.useCallback(async () => {
    const [nets, s] = await Promise.all([
      window.cryogram.system.getNetworks(),
      window.cryogram.system.getWifiStatus()
    ]);
    setNetworks(nets);
    setStatus(s);
  }, []);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const connect = async (ssid, password) => {
    setConnecting(ssid);
    setConnectError(null);
    const result = await window.cryogram.system.connectNetwork(ssid, password);
    if (result?.success === false) {
      setConnectError(result.message || "Connection failed");
      setConnecting(null);
      return;
    }
    setPwdFor(null);
    setPwd("");
    await load();
    setConnecting(null);
  };
  const disconnect = async () => {
    await window.cryogram.system.disconnectNetwork();
    await load();
  };
  const rescan = async () => {
    setScanning(true);
    await window.cryogram.system.rescanNetworks();
    await load();
    setScanning(false);
  };
  const signalBars = (sig) => {
    const pct = Math.max(0, Math.min(100, sig));
    if (pct > 75) return "████";
    if (pct > 50) return "███░";
    if (pct > 25) return "██░░";
    return "█░░░";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Wi-Fi" }),
        status?.connected && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cryo-muted mt-0.5", children: [
          "Connected to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--cryo-accent)" }, children: status.ssid })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        status?.connected && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { onClick: disconnect, children: "Disconnect" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { onClick: rescan, disabled: scanning, children: scanning ? "Scanning…" : "Scan" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      networks.map((net) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors",
          style: {
            background: "rgba(13,20,33,0.5)",
            border: net.active ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(26,40,64,0.5)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", style: { color: net.active ? "var(--cryo-accent)" : "#4e5d6e" }, children: signalBars(net.signal) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: net.active ? "var(--cryo-accent)" : "#c9d1d9" }, children: net.ssid }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted", children: net.security || "Open" })
              ] })
            ] }),
            !net.active && /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingBtn,
              {
                onClick: () => net.security ? setPwdFor(net.ssid) : connect(net.ssid),
                disabled: connecting === net.ssid,
                children: connecting === net.ssid ? "Connecting…" : "Connect"
              }
            )
          ]
        },
        net.ssid
      )),
      networks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted text-center py-8", children: "No networks found — click Scan" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: pwdFor && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 8 },
        className: "fixed inset-0 flex items-center justify-center z-50",
        style: { background: "rgba(0,0,0,0.5)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-72 rounded-xl p-5",
            style: { background: "rgba(13,20,33,0.98)", border: "1px solid rgba(26,40,64,0.9)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm mb-1", children: [
                "Connect to ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--cryo-accent)" }, children: pwdFor })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted mb-3", children: "Enter Wi-Fi password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  autoFocus: true,
                  type: "password",
                  value: pwd,
                  onChange: (e) => {
                    setPwd(e.target.value);
                    setConnectError(null);
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Enter") connect(pwdFor, pwd);
                    if (e.key === "Escape") {
                      setPwdFor(null);
                      setPwd("");
                      setConnectError(null);
                    }
                  },
                  className: "w-full text-xs py-2 px-3 rounded-lg mb-2",
                  style: {
                    background: "rgba(8,12,18,0.6)",
                    border: connectError ? "1px solid rgba(255,68,102,0.6)" : "1px solid rgba(26,40,64,0.6)",
                    color: "#c9d1d9"
                  },
                  placeholder: "Password"
                }
              ),
              connectError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs mb-3", style: { color: "#ff4466" }, children: [
                "⚠ ",
                connectError
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { onClick: () => {
                  setPwdFor(null);
                  setPwd("");
                  setConnectError(null);
                }, children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { primary: true, onClick: () => connect(pwdFor, pwd), disabled: connecting === pwdFor, children: connecting === pwdFor ? "Connecting…" : "Connect" })
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}
function BluetoothPanel() {
  const [devices, setDevices] = reactExports.useState([]);
  const [scanning, setScanning] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(null);
  const load = async () => {
    const devs = await window.cryogram.system.getBluetoothDevices();
    setDevices(devs);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const scan = async () => {
    setScanning(true);
    await window.cryogram.system.bluetoothScan();
    await load();
    setScanning(false);
  };
  const toggle = async (dev) => {
    setBusy(dev.address);
    if (dev.connected) await window.cryogram.system.bluetoothDisconnect(dev.address);
    else await window.cryogram.system.bluetoothConnect(dev.address);
    await load();
    setBusy(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Bluetooth" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { onClick: scan, disabled: scanning, children: scanning ? "Scanning…" : "Scan for Devices" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      devices.map((dev) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-3 py-2.5 rounded-lg",
          style: {
            background: "rgba(13,20,33,0.5)",
            border: dev.connected ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(26,40,64,0.5)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: dev.connected ? "var(--cryo-accent)" : "#c9d1d9" }, children: dev.name || dev.address }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted", children: dev.address })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { onClick: () => toggle(dev), disabled: busy === dev.address, primary: dev.connected, children: busy === dev.address ? "…" : dev.connected ? "Disconnect" : "Connect" })
          ]
        },
        dev.address
      )),
      devices.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted text-center py-8", children: "No paired devices — click Scan" })
    ] })
  ] });
}
function SoundPanel() {
  const [vol, setVol] = reactExports.useState(null);
  const load = async () => {
    const v = await window.cryogram.system.getVolume();
    setVol(v);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const setVolume = async (level) => {
    setVol((v) => v ? { ...v, level } : v);
    await window.cryogram.system.setVolume(level);
  };
  const toggleMute = async () => {
    await window.cryogram.system.toggleMute();
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-4", children: "Sound" }),
    vol && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-4 rounded-xl",
        style: { background: "rgba(13,20,33,0.5)", border: "1px solid rgba(26,40,64,0.5)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cryo-muted", children: "Output Volume" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", style: { color: vol.muted ? "#6b7280" : "var(--cryo-accent)" }, children: vol.muted ? "Muted" : `${vol.level}%` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: 100,
              value: vol.level,
              onChange: (e) => setVolume(Number(e.target.value)),
              className: "w-full mb-3",
              disabled: vol.muted
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { onClick: toggleMute, primary: vol.muted, children: vol.muted ? "🔇 Unmute" : "🔊 Mute" })
        ]
      }
    )
  ] });
}
function DisplayPanel() {
  const [brightness, setBrightnessState] = reactExports.useState(null);
  const load = async () => {
    const b = await window.cryogram.system.getBrightness();
    setBrightnessState(b);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const setBrightness = async (pct) => {
    setBrightnessState(pct);
    await window.cryogram.system.setBrightness(pct);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-4", children: "Display" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-4 rounded-xl",
        style: { background: "rgba(13,20,33,0.5)", border: "1px solid rgba(26,40,64,0.5)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cryo-muted", children: "Brightness" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", style: { color: "var(--cryo-accent)" }, children: brightness !== null ? `${brightness}%` : "—" })
          ] }),
          brightness !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 5,
              max: 100,
              value: brightness,
              onChange: (e) => setBrightness(Number(e.target.value)),
              className: "w-full"
            }
          )
        ]
      }
    )
  ] });
}
function SecurityPanel() {
  const [pinEnabled, setPinEnabled] = reactExports.useState(false);
  const [pinSet, setPinSet] = reactExports.useState(false);
  const [pinMode, setPinMode] = reactExports.useState("none");
  const [newPin, setNewPin] = reactExports.useState("");
  const [confirmPin, setConfirmPin] = reactExports.useState("");
  const [currentPin, setCurrentPin] = reactExports.useState("");
  const [pinMsg, setPinMsg] = reactExports.useState(null);
  reactExports.useEffect(() => {
    window.cryogram.settings.getAll().then((all) => {
      setPinEnabled(!!all["pin.enabled"]);
      setPinSet(!!all["pin.hash"]);
    });
  }, []);
  const flash = (text, ok) => {
    setPinMsg({ text, ok });
    setTimeout(() => setPinMsg(null), 3e3);
  };
  const resetPinForm = () => {
    setNewPin("");
    setConfirmPin("");
    setCurrentPin("");
    setPinMode("none");
  };
  const handleTogglePinEnabled = async (checked) => {
    if (checked && !pinSet) {
      setPinMode("set");
      return;
    }
    await window.cryogram.system.setPinEnabled(checked);
    await window.cryogram.settings.set("pin.enabled", checked);
    setPinEnabled(checked);
    flash(checked ? "PIN lock enabled" : "PIN lock disabled", true);
  };
  const handleSetPin = async () => {
    if (newPin.length < 4) {
      flash("PIN must be at least 4 digits", false);
      return;
    }
    if (!/^[0-9]+$/.test(newPin)) {
      flash("PIN must contain only digits", false);
      return;
    }
    if (newPin !== confirmPin) {
      flash("PINs do not match", false);
      return;
    }
    const result = await window.cryogram.system.setPin(
      newPin,
      pinSet ? currentPin : void 0
    );
    if (result?.success) {
      setPinSet(true);
      setPinEnabled(true);
      await window.cryogram.settings.set("pin.enabled", true);
      flash(pinSet ? "PIN changed" : "PIN set — lock screen enabled", true);
      resetPinForm();
    } else {
      flash(result?.error || "Failed to set PIN", false);
    }
  };
  const handleRemovePin = async () => {
    const result = await window.cryogram.system.removePin(currentPin);
    if (result?.success) {
      setPinSet(false);
      setPinEnabled(false);
      flash("PIN removed — lock screen disabled", true);
      resetPinForm();
    } else {
      flash(result?.error || "Failed to remove PIN", false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-cryo-text mb-1", children: "Security & Lock Screen" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted", children: "Configure PIN lock for boot and resume." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted uppercase tracking-wider font-bold", children: "Security & Lock Screen" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-cryo-text", children: "PIN Lock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted", children: pinSet ? pinEnabled ? "Locks on boot, resume & manual lock" : "PIN is set but currently disabled" : "Set a PIN to enable the lock screen" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              className: "sr-only peer",
              checked: pinEnabled,
              onChange: (e) => handleTogglePinEnabled(e.target.checked)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-11 h-6 rounded-full peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:transition-all",
              style: {
                background: pinEnabled ? "var(--cryo-accent)" : "rgba(255,255,255,0.15)",
                transition: "background 0.2s"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all",
                  style: { transform: pinEnabled ? "translateX(20px)" : "translateX(0)", transition: "transform 0.2s" }
                }
              )
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full", style: { background: pinSet ? "#00ff88" : "rgba(255,255,255,0.2)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs",
              style: { color: pinSet ? "#00ff88" : "rgba(255,255,255,0.35)", fontFamily: '"JetBrains Mono", monospace' },
              children: pinSet ? "PIN is set" : "No PIN set"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 ml-auto", children: !pinSet ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn text-xs py-1 px-3", onClick: () => setPinMode("set"), children: "Set PIN" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn text-xs py-1 px-3", onClick: () => setPinMode("change"), children: "Change PIN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn text-xs py-1 px-3",
              style: { color: "#f87171", borderColor: "rgba(248,113,113,0.3)" },
              onClick: () => setPinMode("remove"),
              children: "Remove PIN"
            }
          )
        ] }) })
      ] }),
      pinMode !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl p-4 space-y-3",
          style: { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold", style: { color: "rgba(255,255,255,0.6)" }, children: pinMode === "set" ? "Set New PIN" : pinMode === "change" ? "Change PIN" : "Remove PIN" }),
            (pinMode === "change" || pinMode === "remove") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1", children: "Current PIN" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "password",
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 8,
                  className: "w-full",
                  placeholder: "Enter current PIN",
                  value: currentPin,
                  onChange: (e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 8))
                }
              )
            ] }),
            pinMode !== "remove" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs text-cryo-muted mb-1", children: [
                  "New PIN ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.3)" }, children: "(4–8 digits)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "password",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 8,
                    className: "w-full",
                    placeholder: "4–8 digit PIN",
                    value: newPin,
                    onChange: (e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1", children: "Confirm New PIN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "password",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 8,
                    className: "w-full",
                    placeholder: "Repeat PIN",
                    value: confirmPin,
                    onChange: (e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
              pinMode === "remove" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "btn text-xs py-1 px-3",
                  style: { color: "#f87171", borderColor: "rgba(248,113,113,0.3)" },
                  onClick: handleRemovePin,
                  children: "Confirm Remove"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary text-xs py-1 px-3", onClick: handleSetPin, children: pinMode === "set" ? "Set PIN" : "Change PIN" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn text-xs py-1 px-3", onClick: resetPinForm, children: "Cancel" })
            ] })
          ]
        }
      ),
      pinMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-xs py-1.5 px-3 rounded-lg",
          style: {
            background: pinMsg.ok ? "rgba(0,255,136,0.08)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${pinMsg.ok ? "rgba(0,255,136,0.2)" : "rgba(248,113,113,0.2)"}`,
            color: pinMsg.ok ? "#00ff88" : "#f87171",
            fontFamily: "-apple-system, sans-serif"
          },
          children: pinMsg.text
        }
      )
    ] })
  ] });
}
function ApiKeysPanel() {
  const [vals, setVals] = reactExports.useState({
    hibpApiKey: "",
    dehashedEmail: "",
    dehashedApiKey: "",
    workspace: ""
  });
  const [saved, setSaved] = reactExports.useState(false);
  reactExports.useEffect(() => {
    window.cryogram.settings.getAll().then((all) => {
      setVals({
        hibpApiKey: all.hibpApiKey || "",
        dehashedEmail: all.dehashedEmail || "",
        dehashedApiKey: all.dehashedApiKey || "",
        workspace: all.workspace || ""
      });
    });
  }, []);
  const save = async () => {
    for (const [key, value] of Object.entries(vals)) {
      await window.cryogram.settings.set(key, value);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  };
  const openWorkspace = async () => {
    const path = await window.cryogram.fs.openDialog();
    if (path) setVals((v) => ({ ...v, workspace: path }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-cryo-text mb-1", children: "API Keys" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted", children: "API keys are stored encrypted on your local machine." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted uppercase tracking-wider font-bold", children: "Have I Been Pwned (Leaker)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1", children: "API Key" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            className: "w-full",
            placeholder: "hibp-api-key",
            value: vals.hibpApiKey,
            onChange: (e) => setVals((v) => ({ ...v, hibpApiKey: e.target.value }))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted mt-1", children: "Required for email breach lookups" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted uppercase tracking-wider font-bold", children: "Dehashed (Leaker)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1", children: "Account Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full",
            placeholder: "your@email.com",
            value: vals.dehashedEmail,
            onChange: (e) => setVals((v) => ({ ...v, dehashedEmail: e.target.value }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1", children: "API Key" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            className: "w-full",
            placeholder: "dehashed-api-key",
            value: vals.dehashedApiKey,
            onChange: (e) => setVals((v) => ({ ...v, dehashedApiKey: e.target.value }))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted uppercase tracking-wider font-bold", children: "Code Editor Workspace" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "flex-1 text-cryo-muted",
            readOnly: true,
            value: vals.workspace || "Not set — defaults to ~/Documents/Cryogram/workspace"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: openWorkspace, children: "Browse" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary w-fit", onClick: save, children: saved ? "✓ Saved" : "Save Settings" })
  ] });
}
function UpdatePanel() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-cryo-text mb-1", children: "System Update" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted", children: "Check for and apply Cryogram OS updates." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(UpdateSection, {})
  ] });
}
function UpdateSection() {
  const [checking, setChecking] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState("idle");
  const [commitCount, setCount] = reactExports.useState(0);
  const [changes, setChanges] = reactExports.useState([]);
  const [errorMsg, setErrorMsg] = reactExports.useState("");
  const check = async () => {
    setChecking(true);
    setStatus("idle");
    setErrorMsg("");
    try {
      const result = await window.__cryogram_checkUpdate?.();
      if (result?.hasUpdate) {
        setStatus("available");
        setCount(result.commitCount ?? 1);
        setChanges(result.changes ?? []);
      } else if (result?.error) {
        setStatus("error");
        setErrorMsg(result.message ?? result.error);
      } else {
        setStatus("uptodate");
      }
    } catch (e) {
      setStatus("error");
      setErrorMsg(String(e?.message ?? e));
    }
    setChecking(false);
  };
  const startUpdate = () => {
    window.__cryogram_startUpdate?.();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted uppercase tracking-wider font-bold", children: "System Update" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "btn",
          onClick: check,
          disabled: checking,
          style: { opacity: checking ? 0.6 : 1 },
          children: checking ? "Checking…" : "Check for Updates"
        }
      ),
      status === "uptodate" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "#4ade80" }, children: "✓ Cryogram OS is up to date" }),
      status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#f87171", maxWidth: 360, lineHeight: 1.5 }, children: errorMsg || "Could not reach update server" })
    ] }),
    status === "available" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(0,212,255,0.06)",
      border: "1px solid rgba(0,212,255,0.18)",
      borderRadius: 10,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600 }, children: [
        commitCount,
        " update",
        commitCount !== 1 ? "s" : "",
        " available"
      ] }),
      changes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }, children: changes.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { style: { fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--cryo-accent)", opacity: 0.7 }, children: "›" }),
        c
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: startUpdate,
          style: {
            alignSelf: "flex-start",
            padding: "6px 18px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            background: "linear-gradient(135deg, var(--cryo-accent) 0%, #00ff88 100%)",
            border: "none",
            color: "#000",
            cursor: "pointer",
            boxShadow: "0 0 12px rgba(0,212,255,0.3)"
          },
          children: "Update & Reboot"
        }
      )
    ] })
  ] });
}
function AboutPanel() {
  const [info, setInfo] = reactExports.useState(null);
  reactExports.useEffect(() => {
    window.cryogram.system.getInfo().then(setInfo).catch(() => {
    });
  }, []);
  const Row = ({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start justify-between py-2.5",
      style: { borderBottom: "1px solid rgba(26,40,64,0.4)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cryo-muted", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-right ml-4", style: { color: "#c9d1d9", maxWidth: "60%" }, children: value })
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
          style: { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" },
          children: "🛡"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", style: { color: "var(--cryo-accent)" }, children: "Cryogram" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted", children: "Security Operations Platform" })
      ] })
    ] }),
    info && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl overflow-hidden",
        style: { background: "rgba(13,20,33,0.5)", border: "1px solid rgba(26,40,64,0.5)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Hostname", value: info.hostname }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "OS", value: info.os }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Kernel", value: info.kernel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "CPU", value: info.cpu }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "RAM", value: `${Math.round(info.ramUsed / 1024 / 1024)} MB / ${Math.round(info.ramTotal / 1024 / 1024)} MB` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Uptime", value: info.uptime })
        ] })
      }
    )
  ] });
}
function SettingBtn({
  children,
  onClick,
  disabled,
  primary
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      disabled,
      className: "text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40",
      style: {
        background: primary ? "rgba(0,212,255,0.15)" : "rgba(26,40,64,0.5)",
        border: primary ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(26,40,64,0.6)",
        color: primary ? "var(--cryo-accent)" : "#c9d1d9"
      },
      children
    }
  );
}
export {
  SettingsApp as default
};
