import { r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./index-8rF7n8W2.js";
const phone = () => window.cryogram?.phone;
function fmt(bytes) {
  const gb = bytes / 1073741824;
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1048576).toFixed(0)} MB`;
}
function StatBar({ value, color, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "-apple-system, sans-serif" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.8)" }, children: [
        value.toFixed(0),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { width: 0 },
        animate: { width: `${value}%` },
        transition: { type: "spring", stiffness: 160, damping: 22 },
        style: { height: "100%", borderRadius: 3, background: color, boxShadow: `0 0 8px ${color}80` }
      }
    ) })
  ] });
}
function Card({ children, style }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "14px 16px",
    ...style
  }, children });
}
function ActionBtn({ label, icon, color, onClick, disabled, loading }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      disabled: disabled || loading,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "12px 16px",
        borderRadius: 12,
        background: `${color}12`,
        border: `1px solid ${color}30`,
        color,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.15s",
        minWidth: 90
      },
      onMouseEnter: (e) => !disabled && !loading && (e.currentTarget.style.background = `${color}22`),
      onMouseLeave: (e) => e.currentTarget.style.background = `${color}12`,
      children: [
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { style: { width: 20, height: 20, borderRadius: "50%", border: `2px solid ${color}30`, borderTopColor: color }, animate: { rotate: 360 }, transition: { duration: 0.8, repeat: Infinity, ease: "linear" } }) : icon,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, fontFamily: "-apple-system, sans-serif", fontWeight: 600, whiteSpace: "nowrap" }, children: label })
      ]
    }
  );
}
function PhoneApp() {
  const [devices, setDevices] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(null);
  const [info, setInfo] = reactExports.useState(null);
  const [battery, setBattery] = reactExports.useState(null);
  const [storage, setStorage] = reactExports.useState(null);
  const [mirroring, setMirroring] = reactExports.useState(false);
  const [scrcpyOk, setScrcpyOk] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const [wifiStep, setWifiStep] = reactExports.useState("idle");
  const [wifiIp, setWifiIp] = reactExports.useState("");
  const [wifiInputIp, setWifiInputIp] = reactExports.useState("");
  const [noAdb, setNoAdb] = reactExports.useState(null);
  const showToast = reactExports.useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  }, []);
  const loadDevices = reactExports.useCallback(async () => {
    try {
      const devs = await phone().getDevices();
      setDevices(devs);
      setNoAdb(false);
      if (devs.length > 0 && !selected) setSelected(devs[0].serial);
    } catch (err) {
      if (String(err).includes("not found") || String(err).includes("ENOENT")) setNoAdb(true);
    }
  }, [selected]);
  reactExports.useEffect(() => {
    loadDevices();
    const t = setInterval(loadDevices, 3e3);
    return () => clearInterval(t);
  }, [loadDevices]);
  reactExports.useEffect(() => {
    if (!selected) {
      setInfo(null);
      setBattery(null);
      setStorage(null);
      return;
    }
    const load = async () => {
      try {
        setInfo(await phone().getInfo(selected));
      } catch {
      }
      try {
        setBattery(await phone().getBattery(selected));
      } catch {
      }
      try {
        setStorage(await phone().getStorage(selected));
      } catch {
      }
      try {
        setScrcpyOk(await phone().checkScrcpy());
      } catch {
      }
      try {
        setMirroring(await phone().isMirroring());
      } catch {
      }
    };
    load();
    const t = setInterval(load, 8e3);
    return () => clearInterval(t);
  }, [selected]);
  const handleMirror = async () => {
    if (!selected) return;
    if (mirroring) {
      await phone().stopMirror();
      setMirroring(false);
      showToast("Screen mirror stopped");
      return;
    }
    if (!scrcpyOk) {
      setLoading("scrcpy");
      try {
        await phone().installScrcpy();
        setScrcpyOk(true);
        showToast("scrcpy installed");
      } catch {
        showToast("Could not install scrcpy", false);
      }
      setLoading(null);
      return;
    }
    setLoading("mirror");
    try {
      await phone().startMirror(selected);
      setMirroring(true);
      showToast("Mirror started — scrcpy window opened");
    } catch (e) {
      showToast(String(e) || "Failed to start mirror", false);
    }
    setLoading(null);
  };
  const handleScreenshot = async () => {
    if (!selected) return;
    setLoading("screenshot");
    try {
      const path = await phone().screenshot(selected);
      showToast(`Screenshot saved: ${path}`);
    } catch {
      showToast("Screenshot failed", false);
    }
    setLoading(null);
  };
  const handleEnableWireless = async () => {
    if (!selected) return;
    setWifiStep("enabling");
    try {
      await phone().enableWireless(selected);
      const ip = await phone().getDeviceIp(selected);
      setWifiIp(ip);
      setWifiInputIp(ip);
      setWifiStep("connecting");
    } catch {
      showToast("Could not enable wireless ADB", false);
      setWifiStep("idle");
    }
  };
  const handleConnectWifi = async () => {
    setWifiStep("connecting");
    try {
      const result = await phone().connectWifi(wifiInputIp);
      showToast(result);
      setWifiStep("done");
      setTimeout(() => setWifiStep("idle"), 2e3);
      loadDevices();
    } catch (e) {
      showToast(String(e) || "Connection failed", false);
      setWifiStep("idle");
    }
  };
  const storageUsedPct = storage ? storage.used / storage.total * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col w-full h-full overflow-y-auto",
      style: {
        background: "rgba(8,12,18,0.98)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: toast && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: -12 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -12 },
            style: {
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              background: toast.ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${toast.ok ? "#10b98140" : "#ef444440"}`,
              borderRadius: 10,
              padding: "7px 16px",
              zIndex: 200,
              fontSize: 12,
              color: toast.ok ? "#10b981" : "#ef4444",
              backdropFilter: "blur(20px)",
              whiteSpace: "nowrap"
            },
            children: toast.msg
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14, minHeight: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", margin: 0 }, children: "Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }, children: "Android companion" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: loadDevices,
                style: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 12px", color: "rgba(255,255,255,0.6)", fontSize: 11, cursor: "pointer" },
                children: "Refresh"
              }
            )
          ] }),
          noAdb === null && devices.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "12px 0" }, children: "Checking for connected devices…" }) }),
          noAdb === true && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { style: { borderColor: "rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.05)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 12, color: "#fbbf24" }, children: "ADB not found. Install Android Debug Bridge:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { style: { fontSize: 11, color: "rgba(255,255,255,0.5)", display: "block", marginTop: 6 }, children: "sudo apt install adb" })
          ] }),
          noAdb === false && devices.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "12px 0" }, children: "No devices detected. Connect your phone via USB or set up wireless ADB below." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "8px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }, children: "Enable USB Debugging in Developer Options on your device." })
          ] }),
          devices.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Devices" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: devices.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setSelected(d.serial),
                style: {
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 11,
                  background: selected === d.serial ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${selected === d.serial ? "#a855f750" : "rgba(255,255,255,0.1)"}`,
                  color: selected === d.serial ? "#a855f7" : "rgba(255,255,255,0.6)",
                  cursor: "pointer"
                },
                children: [
                  d.model ?? d.serial,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.5 }, children: [
                    "(",
                    d.transport,
                    ")"
                  ] })
                ]
              },
              d.serial
            )) })
          ] }),
          selected && info && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 44, height: 44, borderRadius: 12, background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "#a855f7", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "2", width: "14", height: "20", rx: "2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "18", x2: "12.01", y2: "18" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: 0, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)" }, children: [
                  info.brand,
                  " ",
                  info.model
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)" }, children: [
                  "Android ",
                  info.androidVersion,
                  " · SDK ",
                  info.sdk,
                  " · ",
                  info.cpu
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: "auto", textAlign: "right" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)" }, children: devices.find((d) => d.serial === selected)?.transport === "wifi" ? "📶 WiFi" : "🔌 USB" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }, children: selected })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
              battery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 10px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Battery" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 28, fontWeight: 700, color: battery.level > 20 ? "#10b981" : "#ef4444" }, children: battery.level }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: "rgba(255,255,255,0.4)" }, children: "%" }),
                  battery.charging && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#fbbf24", marginLeft: 4 }, children: "⚡ Charging" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatBar, { value: battery.level, color: battery.level > 20 ? "#10b981" : "#ef4444", label: "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "8px 0 0", fontSize: 10, color: "rgba(255,255,255,0.35)" }, children: [
                  (battery.temperature / 10).toFixed(1),
                  "°C · ",
                  battery.voltage,
                  " mV"
                ] })
              ] }),
              storage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 10px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Storage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.9)" }, children: fmt(storage.used) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: [
                    "/ ",
                    fmt(storage.total)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatBar, { value: storageUsedPct, color: storageUsedPct > 80 ? "#f59e0b" : "#60a5fa", label: "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "8px 0 0", fontSize: 10, color: "rgba(255,255,255,0.35)" }, children: [
                  fmt(storage.free),
                  " free"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 12px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ActionBtn,
                  {
                    label: mirroring ? "Stop Mirror" : scrcpyOk === false ? "Install scrcpy" : "Mirror Screen",
                    color: "#a855f7",
                    loading: loading === "mirror" || loading === "scrcpy",
                    onClick: handleMirror,
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: mirroring ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" })
                    ] }) })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ActionBtn,
                  {
                    label: "Screenshot",
                    color: "#60a5fa",
                    loading: loading === "screenshot",
                    onClick: handleScreenshot,
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "13", r: "4" })
                    ] })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 10px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Wireless ADB" }),
              wifiStep === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)" }, children: "Set up wireless debugging so you can disconnect the USB cable." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleEnableWireless,
                    style: {
                      alignSelf: "flex-start",
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 11,
                      background: "rgba(168,85,247,0.15)",
                      border: "1px solid rgba(168,85,247,0.35)",
                      color: "#a855f7",
                      cursor: "pointer",
                      fontWeight: 600
                    },
                    children: "Enable Wireless ADB"
                  }
                )
              ] }),
              wifiStep === "enabling" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 11, color: "rgba(255,255,255,0.5)" }, children: "Enabling ADB over TCP/IP on port 5555…" }),
              wifiStep === "connecting" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: 0, fontSize: 11, color: "rgba(255,255,255,0.7)" }, children: [
                  "Device IP detected: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { style: { color: "#a855f7" }, children: wifiIp }),
                  ". You can now unplug USB."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: wifiInputIp,
                      onChange: (e) => setWifiInputIp(e.target.value),
                      placeholder: "IP address",
                      style: {
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 7,
                        padding: "5px 10px",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.8)",
                        outline: "none",
                        width: 140
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: handleConnectWifi,
                      style: {
                        padding: "5px 14px",
                        borderRadius: 7,
                        fontSize: 11,
                        fontWeight: 600,
                        background: "#a855f7",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer"
                      },
                      children: "Connect"
                    }
                  )
                ] })
              ] }),
              wifiStep === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 11, color: "#10b981" }, children: "Connected wirelessly!" })
            ] })
          ] }),
          noAdb === false && devices.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { style: { borderColor: "rgba(255,255,255,0.06)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Setup Guide" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { style: { margin: 0, paddingLeft: 16, fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "On your phone, go to ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Settings → About phone" }),
                " and tap ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Build number" }),
                " 7 times to enable Developer Options."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "Go to ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Developer Options" }),
                " and enable ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "USB Debugging" }),
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Plug in your phone via USB and accept the authorization prompt." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "Click ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "rgba(255,255,255,0.7)" }, children: "Refresh" }),
                " above."
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  PhoneApp as default
};
