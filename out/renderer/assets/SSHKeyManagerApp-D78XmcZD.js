import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-BLdhfVO6.js";
const ACCENT = "#00d4ff";
const ipc = window.cryogram;
function fieldStyle(extra) {
  return {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "7px 10px",
    color: "#e0e8f0",
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box",
    ...extra
  };
}
function FieldLabel({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", fontSize: 10, color: "rgba(140,160,180,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }, children });
}
function TypeBadge({ type }) {
  const color = type === "ED25519" ? "#00ff88" : type === "RSA" ? ACCENT : "rgba(200,180,100,0.8)";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
    fontSize: 9,
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: 4,
    background: `${color}18`,
    border: `1px solid ${color}44`,
    color,
    letterSpacing: "0.06em",
    fontFamily: "monospace"
  }, children: type });
}
function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = reactExports.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.button,
    {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      onClick: copy,
      style: {
        padding: "4px 10px",
        background: copied ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${copied ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 5,
        color: copied ? "rgba(0,255,136,0.9)" : "rgba(180,200,220,0.7)",
        fontSize: 10,
        cursor: "pointer",
        whiteSpace: "nowrap"
      },
      children: copied ? "Copied!" : label
    }
  );
}
function KeyRow({ sshKey, onDelete }) {
  const [confirmDel, setConfirmDel] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: -4 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -4 },
      style: { borderBottom: "1px solid rgba(255,255,255,0.05)", background: expanded ? "rgba(0,212,255,0.02)" : "transparent" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
            onClick: () => setExpanded((v) => !v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(140,160,180,0.4)", flexShrink: 0 }, children: expanded ? "▾" : "▸" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, fontWeight: 500, color: "#c9d1d9", fontFamily: '"JetBrains Mono", monospace', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: sshKey.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: sshKey.type }),
                  !sshKey.hasPrivate && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, color: "rgba(255,200,0,0.7)", background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.2)", borderRadius: 3, padding: "1px 5px" }, children: "pub only" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontFamily: '"JetBrains Mono", monospace', color: "rgba(140,160,180,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: sshKey.fingerprint })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, flexShrink: 0 }, onClick: (e) => e.stopPropagation(), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: sshKey.publicKey, label: "Copy Key" }),
                confirmDel ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                    onDelete();
                    setConfirmDel(false);
                  }, style: { padding: "4px 8px", background: "rgba(255,68,102,0.15)", border: "1px solid rgba(255,68,102,0.35)", borderRadius: 5, color: "#ff4466", fontSize: 10, cursor: "pointer" }, children: "Confirm" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmDel(false), style: { padding: "4px 8px", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, color: "rgba(140,160,180,0.5)", fontSize: 10, cursor: "pointer" }, children: "Cancel" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmDel(true), style: { padding: "4px 8px", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 5, color: "rgba(200,80,80,0.5)", fontSize: 10, cursor: "pointer" }, children: "Delete" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            style: { overflow: "hidden" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 14px 12px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: "rgba(140,200,180,0.7)",
                background: "rgba(4,8,14,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 5,
                padding: "8px 10px",
                wordBreak: "break-all",
                lineHeight: 1.6
              }, children: sshKey.publicKey }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(100,120,140,0.4)", marginTop: 5 }, children: sshKey.path })
            ] })
          }
        ) })
      ]
    }
  );
}
function GenerateKeyForm({ onGenerated }) {
  const [name, setName] = reactExports.useState("");
  const [keyType, setKeyType] = reactExports.useState("ed25519");
  const [comment, setComment] = reactExports.useState("");
  const [passphrase, setPassphrase] = reactExports.useState("");
  const [generating, setGenerating] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(false);
  const generate = async () => {
    if (!name.trim()) {
      setError("Key name is required");
      return;
    }
    if (!/^[a-zA-Z0-9_\-]+$/.test(name.trim())) {
      setError("Name must be alphanumeric (a-z, 0-9, _ or -)");
      return;
    }
    setError(null);
    setGenerating(true);
    try {
      const result = await ipc.ssh.generateKey({ name: name.trim(), type: keyType, comment: comment.trim() || void 0, passphrase: passphrase || void 0 });
      if (result.success) {
        setSuccess(true);
        setName("");
        setComment("");
        setPassphrase("");
        onGenerated();
        setTimeout(() => setSuccess(false), 2500);
      } else {
        setError(result.error ?? "Generation failed");
      }
    } finally {
      setGenerating(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,212,255,0.02)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 600, color: ACCENT, marginBottom: 12 }, children: "Generate New Key" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 120px", gap: 10, marginBottom: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Key Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "id_ed25519_work", style: fieldStyle() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: keyType, onChange: (e) => setKeyType(e.target.value), style: { ...fieldStyle(), background: "rgba(8,12,20,0.9)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ed25519", children: "ED25519" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rsa", children: "RSA 4096" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Comment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "you@hostname", style: fieldStyle() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { children: "Passphrase (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: passphrase, onChange: (e) => setPassphrase(e.target.value), placeholder: "Leave blank for none", style: fieldStyle() })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#ff4466", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 5, padding: "5px 9px", marginBottom: 8 }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick: generate,
        disabled: generating,
        style: {
          padding: "7px 18px",
          background: success ? "rgba(0,255,136,0.12)" : "rgba(0,212,255,0.1)",
          border: `1px solid ${success ? "rgba(0,255,136,0.3)" : "rgba(0,212,255,0.25)"}`,
          borderRadius: 6,
          color: success ? "rgba(0,255,136,0.9)" : ACCENT,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer"
        },
        children: generating ? "Generating…" : success ? "Key Generated!" : "Generate Key"
      }
    )
  ] });
}
function HostCard({ host }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.055)",
    borderRadius: 8,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 600, color: ACCENT, fontFamily: "monospace" }, children: host.host }),
    host.hostname && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(180,200,220,0.7)", fontFamily: "monospace" }, children: [
      host.hostname,
      host.port && host.port !== "22" ? `:${host.port}` : ""
    ] }),
    host.user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(140,160,180,0.5)" }, children: [
      "User: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(180,200,220,0.7)", fontFamily: "monospace" }, children: host.user })
    ] }),
    host.identityFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(140,160,180,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
      "Identity: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(180,200,220,0.5)", fontFamily: "monospace" }, children: host.identityFile })
    ] })
  ] });
}
function SSHKeyManagerApp() {
  const [tab, setTab] = reactExports.useState("keys");
  const [keys, setKeys] = reactExports.useState([]);
  const [hosts, setHosts] = reactExports.useState([]);
  const [configText, setConfigText] = reactExports.useState("");
  const [loadingKeys, setLoadingKeys] = reactExports.useState(true);
  const [savingConfig, setSavingConfig] = reactExports.useState(false);
  const [saveMsg, setSaveMsg] = reactExports.useState(null);
  const loadKeys = reactExports.useCallback(async () => {
    setLoadingKeys(true);
    try {
      const k = await ipc.ssh.listKeys();
      setKeys(k);
    } finally {
      setLoadingKeys(false);
    }
  }, []);
  const loadConfig = reactExports.useCallback(async () => {
    try {
      const h = await ipc.ssh.listHosts();
      setHosts(h);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    loadKeys();
  }, [loadKeys]);
  reactExports.useEffect(() => {
    if (tab === "config") {
      loadConfig();
      ipc.ssh.listHosts().then((h) => {
        setHosts(h);
      }).catch(() => {
      });
    }
  }, [tab, loadConfig, configText]);
  const handleDelete = reactExports.useCallback(async (name) => {
    await ipc.ssh.deleteKey(name);
    setKeys((prev) => prev.filter((k) => k.name !== name));
  }, []);
  const saveConfig = async () => {
    setSavingConfig(true);
    try {
      const ok = await ipc.ssh.saveConfig(configText);
      setSaveMsg(ok ? "Saved!" : "Save failed");
      if (ok) await loadConfig();
    } finally {
      setSavingConfig(false);
      setTimeout(() => setSaveMsg(null), 2e3);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,12,20,0.5)", flexShrink: 0 }, children: ["keys", "config"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setTab(t),
        style: {
          position: "relative",
          padding: "10px 20px",
          fontSize: 12,
          fontWeight: 500,
          color: tab === t ? ACCENT : "rgba(140,160,180,0.6)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textTransform: "capitalize"
        },
        children: [
          t === "keys" ? `Keys${keys.length > 0 ? ` (${keys.length})` : ""}` : "SSH Config",
          tab === t && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              layoutId: "ssh-tab",
              style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: ACCENT, borderRadius: "2px 2px 0 0" },
              transition: { type: "spring", stiffness: 400, damping: 30 }
            }
          )
        ]
      },
      t
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: tab === "keys" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12 },
        style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: loadingKeys ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              style: { padding: "24px 16px", fontSize: 12, color: "rgba(140,160,180,0.5)", fontFamily: "monospace" },
              animate: { opacity: [0.4, 1, 0.4] },
              transition: { duration: 1.4, repeat: Infinity },
              children: "Scanning ~/.ssh…"
            }
          ) : keys.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "32px 16px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 12 }, children: "🔑" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "rgba(180,200,220,0.6)" }, children: "No SSH keys found in ~/.ssh" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(120,140,160,0.45)", marginTop: 6 }, children: "Generate a key below to get started" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: keys.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRow, { sshKey: k, onDelete: () => handleDelete(k.name) }, k.name)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(GenerateKeyForm, { onGenerated: loadKeys })
        ]
      },
      "keys"
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12 },
        style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.055)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(140,160,180,0.6)", fontFamily: "monospace" }, children: "~/.ssh/config" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
              saveMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.span,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  style: { fontSize: 11, color: saveMsg === "Saved!" ? "rgba(0,255,136,0.8)" : "#ff4466" },
                  children: saveMsg
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  whileHover: { scale: 1.03 },
                  whileTap: { scale: 0.97 },
                  onClick: saveConfig,
                  disabled: savingConfig,
                  style: { padding: "6px 14px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", borderRadius: 6, color: ACCENT, fontSize: 11, fontWeight: 600, cursor: "pointer" },
                  children: savingConfig ? "Saving…" : "Save Config"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: configText,
              onChange: (e) => setConfigText(e.target.value),
              placeholder: `# ~/.ssh/config
# Example:
Host myserver
  HostName 192.168.1.100
  User ubuntu
  Port 22
  IdentityFile ~/.ssh/id_ed25519`,
              spellCheck: false,
              style: {
                ...fieldStyle({
                  borderRadius: 0,
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.055)",
                  resize: "none",
                  flex: "none",
                  height: 220,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  lineHeight: 1.7,
                  padding: "12px 14px",
                  color: "#c9d1d9"
                })
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "12px 14px" }, children: [
            hosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(140,160,180,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }, children: [
                "Parsed Hosts (",
                hosts.length,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }, children: hosts.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(HostCard, { host: h }, h.host)) })
            ] }),
            hosts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(100,120,140,0.4)", fontFamily: "monospace", paddingTop: 8 }, children: "No hosts defined in config yet" })
          ] })
        ]
      },
      "config"
    ) })
  ] });
}
export {
  SSHKeyManagerApp as default
};
