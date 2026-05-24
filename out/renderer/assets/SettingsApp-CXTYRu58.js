import { r as reactExports, j as jsxRuntimeExports } from "./index-BwSSccsZ.js";
function SettingsApp() {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-auto p-5 gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-cryo-text mb-1", children: "Settings" }),
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
export {
  SettingsApp as default
};
