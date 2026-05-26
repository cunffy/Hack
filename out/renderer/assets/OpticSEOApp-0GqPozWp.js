import { r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./index-D1cCCGNU.js";
const TARGET_URL = "https://opticseoservices.com";
const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
function ToolbarBtn({ title, onClick, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      title,
      onClick,
      className: "flex items-center justify-center rounded-lg transition-colors",
      style: {
        width: 30,
        height: 30,
        background: "transparent",
        color: "rgba(255,255,255,0.55)",
        border: "none",
        cursor: "pointer"
      },
      onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)",
      onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
      children
    }
  );
}
function OpticSEOApp() {
  const wvRef = reactExports.useRef(null);
  const [url, setUrl] = reactExports.useState(TARGET_URL);
  const [displayUrl, setDisplayUrl] = reactExports.useState(TARGET_URL);
  const [loading, setLoading] = reactExports.useState(true);
  const [loadPct, setLoadPct] = reactExports.useState(0);
  const [canBack, setCanBack] = reactExports.useState(false);
  const [canFwd, setCanFwd] = reactExports.useState(false);
  const [creds, setCreds] = reactExports.useState(null);
  const [showCredsPanel, setShowCredsPanel] = reactExports.useState(false);
  const [credForm, setCredForm] = reactExports.useState({ email: "", password: "", autoLogin: true });
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    async function load() {
      try {
        const api = window.cryogram?.settings;
        if (!api) return;
        const email = await api.get("opticseo.email") ?? "";
        const password = await api.get("opticseo.password") ?? "";
        const autoLogin = await api.get("opticseo.autoLogin") ?? true;
        setCreds({ email, password, autoLogin });
        setCredForm({ email, password, autoLogin });
        if (!email || !password) setShowCredsPanel(true);
      } catch {
      }
    }
    load();
  }, []);
  const tryAutoLogin = reactExports.useCallback(async () => {
    const wv = wvRef.current;
    if (!wv || !creds?.autoLogin || !creds.email || !creds.password) return;
    try {
      await wv.executeJavaScript(`
        (function() {
          const emailField = document.querySelector('input[type="email"], input[name="email"], input[name="username"], input[id*="email"], input[id*="user"]');
          const passField  = document.querySelector('input[type="password"]');
          const btn        = document.querySelector('button[type="submit"], input[type="submit"], button.login, button.sign-in');
          if (emailField && passField) {
            emailField.value = ${JSON.stringify(creds.email)};
            passField.value  = ${JSON.stringify(creds.password)};
            emailField.dispatchEvent(new Event('input', { bubbles: true }));
            passField.dispatchEvent(new Event('input', { bubbles: true }));
            if (btn) { setTimeout(() => btn.click(), 150); }
            return true;
          }
          return false;
        })()
      `);
    } catch {
    }
  }, [creds]);
  reactExports.useEffect(() => {
    const wv = wvRef.current;
    if (!wv) return;
    const onStart = () => {
      setLoading(true);
      setLoadPct(20);
    };
    const onStop = () => {
      setLoading(false);
      setLoadPct(100);
      setTimeout(() => setLoadPct(0), 400);
    };
    const onNav = (e) => {
      setDisplayUrl(e.url ?? wv.getURL());
      setCanBack(wv.canGoBack());
      setCanFwd(wv.canGoForward());
    };
    const onDomReady = () => {
      setCanBack(wv.canGoBack());
      setCanFwd(wv.canGoForward());
      tryAutoLogin();
    };
    wv.addEventListener("did-start-loading", onStart);
    wv.addEventListener("did-stop-loading", onStop);
    wv.addEventListener("did-navigate", onNav);
    wv.addEventListener("did-navigate-in-page", onNav);
    wv.addEventListener("dom-ready", onDomReady);
    return () => {
      wv.removeEventListener("did-start-loading", onStart);
      wv.removeEventListener("did-stop-loading", onStop);
      wv.removeEventListener("did-navigate", onNav);
      wv.removeEventListener("did-navigate-in-page", onNav);
      wv.removeEventListener("dom-ready", onDomReady);
    };
  }, [tryAutoLogin]);
  reactExports.useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadPct((p) => Math.min(p + 3, 88)), 200);
    return () => clearInterval(t);
  }, [loading]);
  const navigate = (u) => {
    const full = u.startsWith("http") ? u : `https://${u}`;
    setUrl(full);
    setDisplayUrl(full);
    wvRef.current?.loadURL(full);
  };
  const saveCreds = async () => {
    setSaving(true);
    try {
      const api = window.cryogram?.settings;
      if (api) {
        await api.set("opticseo.email", credForm.email);
        await api.set("opticseo.password", credForm.password);
        await api.set("opticseo.autoLogin", credForm.autoLogin);
      }
      setCreds({ ...credForm });
      setShowCredsPanel(false);
    } catch {
    }
    setSaving(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col w-full h-full", style: { background: "rgba(8,12,18,0.98)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1 shrink-0 px-2",
        style: {
          height: 44,
          background: "rgba(12,18,28,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.07)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarBtn, { title: "Back", onClick: () => wvRef.current?.goBack(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", style: { opacity: canBack ? 1 : 0.3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarBtn, { title: "Forward", onClick: () => wvRef.current?.goForward(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", style: { opacity: canFwd ? 1 : 0.3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 18 15 12 9 6" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarBtn, { title: "Reload", onClick: () => wvRef.current?.reload(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "23 4 23 10 17 10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "form",
            {
              className: "flex-1 mx-2",
              onSubmit: (e) => {
                e.preventDefault();
                navigate(displayUrl);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: displayUrl,
                  onChange: (e) => setDisplayUrl(e.target.value),
                  spellCheck: false,
                  style: {
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.75)",
                    outline: "none",
                    fontFamily: "-apple-system, monospace"
                  },
                  onFocus: (e) => {
                    e.target.select();
                    e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)";
                  },
                  onBlur: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarBtn, { title: "Login settings", onClick: () => setShowCredsPanel((v) => !v), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "8", r: "4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 21a8 8 0 1 0-16 0" })
          ] }) })
        ]
      }
    ),
    loadPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-0.5 shrink-0", style: { background: "rgba(255,255,255,0.05)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute left-0 top-0 h-full",
        animate: { width: `${loadPct}%` },
        transition: { duration: 0.2 },
        style: { background: "linear-gradient(90deg,#10b981,#34d399)", boxShadow: "0 0 8px #10b981" }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showCredsPanel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { type: "spring", stiffness: 460, damping: 30 },
        className: "shrink-0 px-4 py-3 flex items-center gap-3 flex-wrap",
        style: {
          background: "rgba(16,24,36,0.97)",
          borderBottom: "1px solid rgba(16,185,129,0.25)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "#10b981", fontFamily: "-apple-system, sans-serif", fontWeight: 600 }, children: "OpticSEO Pro Credentials" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              placeholder: "Email / Username",
              value: credForm.email,
              onChange: (e) => setCredForm((f) => ({ ...f, email: e.target.value })),
              style: inputStyle
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              placeholder: "Password",
              value: credForm.password,
              onChange: (e) => setCredForm((f) => ({ ...f, password: e.target.value })),
              style: inputStyle
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.55)", cursor: "pointer" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: credForm.autoLogin,
                onChange: (e) => setCredForm((f) => ({ ...f, autoLogin: e.target.checked })),
                style: { accentColor: "#10b981" }
              }
            ),
            "Auto-login"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: saveCreds,
              disabled: saving,
              style: {
                padding: "4px 14px",
                borderRadius: 7,
                fontSize: 11,
                background: "#10b981",
                color: "#000",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                opacity: saving ? 0.6 : 1
              },
              children: saving ? "Saving…" : "Save"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setShowCredsPanel(false),
              style: { padding: "4px 10px", borderRadius: 7, fontSize: 11, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" },
              children: "Cancel"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "webview",
      {
        ref: wvRef,
        src: url,
        partition: "persist:opticseo",
        useragent: USER_AGENT,
        allowpopups: true,
        style: { width: "100%", height: "100%", display: "flex" }
      }
    ) })
  ] });
}
const inputStyle = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 7,
  padding: "4px 10px",
  fontSize: 11,
  color: "rgba(255,255,255,0.8)",
  outline: "none",
  width: 180,
  fontFamily: "-apple-system, sans-serif"
};
export {
  OpticSEOApp as default
};
