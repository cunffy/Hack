import { r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./index-BInBQzhn.js";
const TABS = [
  { id: "network", label: "Network", icon: "📶" },
  { id: "bluetooth", label: "Bluetooth", icon: "🔵" },
  { id: "sound", label: "Sound", icon: "🔊" },
  { id: "display", label: "Display", icon: "🖥" },
  { id: "about", label: "About", icon: "ℹ️" }
];
function SystemApp() {
  const [tab, setTab] = reactExports.useState("network");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden text-cryo-text", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-44 shrink-0 flex flex-col py-3",
        style: { borderRight: "1px solid rgba(26,40,64,0.6)", background: "rgba(8,12,18,0.5)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 mb-2 text-cryo-muted text-xs uppercase tracking-widest", children: "Settings" }),
          TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setTab(t.id),
              className: "flex items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-white/5 text-left",
              style: { color: tab === t.id ? "#00d4ff" : "#c9d1d9" },
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
          tab === "network" && /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkPanel, {}),
          tab === "bluetooth" && /* @__PURE__ */ jsxRuntimeExports.jsx(BluetoothPanel, {}),
          tab === "sound" && /* @__PURE__ */ jsxRuntimeExports.jsx(SoundPanel, {}),
          tab === "display" && /* @__PURE__ */ jsxRuntimeExports.jsx(DisplayPanel, {}),
          tab === "about" && /* @__PURE__ */ jsxRuntimeExports.jsx(AboutPanel, {})
        ]
      },
      tab
    ) }) })
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00d4ff" }, children: status.ssid })
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
          style: { background: "rgba(13,20,33,0.5)", border: net.active ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(26,40,64,0.5)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", style: { color: net.active ? "#00d4ff" : "#4e5d6e" }, children: signalBars(net.signal) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: net.active ? "#00d4ff" : "#c9d1d9" }, children: net.ssid }),
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#00d4ff" }, children: pwdFor })
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
          style: { background: "rgba(13,20,33,0.5)", border: dev.connected ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(26,40,64,0.5)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: dev.connected ? "#00d4ff" : "#c9d1d9" }, children: dev.name || dev.address }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", style: { color: vol.muted ? "#6b7280" : "#00d4ff" }, children: vol.muted ? "Muted" : `${vol.level}%` })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", style: { color: "#00d4ff" }, children: brightness !== null ? `${brightness}%` : "—" })
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
function AboutPanel() {
  const [info, setInfo] = reactExports.useState(null);
  reactExports.useEffect(() => {
    window.cryogram.system.getInfo().then(setInfo).catch(() => {
    });
  }, []);
  const Row = ({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between py-2.5", style: { borderBottom: "1px solid rgba(26,40,64,0.4)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cryo-muted", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-right ml-4", style: { color: "#c9d1d9", maxWidth: "60%" }, children: value })
  ] });
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", style: { color: "#00d4ff" }, children: "Cryogram" }),
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
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { onClick: () => window.cryogram.system.lock(), children: "Lock Screen" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { onClick: () => window.cryogram.system.reboot(), children: "Reboot" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingBtn, { onClick: () => window.cryogram.system.shutdown(), primary: true, children: "Shut Down" })
    ] })
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
        color: primary ? "#00d4ff" : "#c9d1d9"
      },
      children
    }
  );
}
export {
  SystemApp as default
};
