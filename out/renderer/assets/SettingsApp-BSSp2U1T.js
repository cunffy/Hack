import { r as reactExports, j as jsxRuntimeExports } from "./index-BInBQzhn.js";
function SettingsApp() {
  const [vals, setVals] = reactExports.useState({
    hibpApiKey: "",
    dehashedEmail: "",
    dehashedApiKey: "",
    workspace: ""
  });
  const [saved, setSaved] = reactExports.useState(false);
  const [pinEnabled, setPinEnabled] = reactExports.useState(false);
  const [pinSet, setPinSet] = reactExports.useState(false);
  const [pinMode, setPinMode] = reactExports.useState("none");
  const [newPin, setNewPin] = reactExports.useState("");
  const [confirmPin, setConfirmPin] = reactExports.useState("");
  const [currentPin, setCurrentPin] = reactExports.useState("");
  const [pinMsg, setPinMsg] = reactExports.useState(null);
  reactExports.useEffect(() => {
    window.cryogram.settings.getAll().then((all) => {
      setVals({
        hibpApiKey: all.hibpApiKey || "",
        dehashedEmail: all.dehashedEmail || "",
        dehashedApiKey: all.dehashedApiKey || "",
        workspace: all.workspace || ""
      });
      setPinEnabled(!!all["pin.enabled"]);
      setPinSet(!!all["pin.hash"]);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-auto p-5 gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-cryo-text mb-1", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cryo-muted", children: "API keys are stored encrypted on your local machine." })
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
                background: pinEnabled ? "#00d4ff" : "rgba(255,255,255,0.15)",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: pinSet ? "#00ff88" : "rgba(255,255,255,0.35)", fontFamily: '"JetBrains Mono", monospace' }, children: pinSet ? "PIN is set" : "No PIN set" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 ml-auto", children: !pinSet ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn text-xs py-1 px-3", onClick: () => setPinMode("set"), children: "Set PIN" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn text-xs py-1 px-3", onClick: () => setPinMode("change"), children: "Change PIN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn text-xs py-1 px-3", style: { color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }, onClick: () => setPinMode("remove"), children: "Remove PIN" })
        ] }) })
      ] }),
      pinMode !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl p-4 space-y-3", style: { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.07)" }, children: [
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
      ] }),
      pinMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs py-1.5 px-3 rounded-lg", style: {
        background: pinMsg.ok ? "rgba(0,255,136,0.08)" : "rgba(248,113,113,0.1)",
        border: `1px solid ${pinMsg.ok ? "rgba(0,255,136,0.2)" : "rgba(248,113,113,0.2)"}`,
        color: pinMsg.ok ? "#00ff88" : "#f87171",
        fontFamily: "-apple-system, sans-serif"
      }, children: pinMsg.text })
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
export {
  SettingsApp as default
};
