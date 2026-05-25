import { j as jsxRuntimeExports, r as reactExports, m as motion, A as AnimatePresence } from "./index-CtaS1aAT.js";
function AuthDisclaimer({ onAccept }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel max-w-lg w-full p-6 border-cryo-yellow/40", style: { borderColor: "rgba(255,204,0,0.4)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-yellow text-lg", children: "⚠" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-cryo-yellow font-bold text-sm tracking-wide uppercase", children: "Authorized Use Only" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-xs text-cryo-text leading-relaxed mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The Password Testing Suite is an offensive security tool intended exclusively for authorized penetration testing and security assessments." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "By proceeding, you confirm that:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 space-y-1.5 text-cryo-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "You have ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-cryo-text", children: "explicit written authorization" }),
          " from the system/account owner before testing any live system or network target."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Hash cracking is only performed on hashes you are authorized to test." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "You understand that unauthorized use may violate the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-cryo-text", children: "Computer Fraud and Abuse Act (CFAA)" }),
          ", the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-cryo-text", children: "Computer Misuse Act" }),
          ", or equivalent laws in your jurisdiction."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "This tool is for ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-cryo-text", children: "defensive and authorized red team purposes only" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cryo-muted", children: "This confirmation expires every 90 days as a reminder of your obligations." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary w-full justify-center", onClick: onAccept, children: "I have written authorization — Proceed" })
  ] }) });
}
const ALGORITHMS = ["md5", "sha1", "sha256", "sha512", "ntlm", "bcrypt"];
const MODES = [
  { id: "bruteforce", label: "Brute Force", desc: "Try all charset combinations up to N chars" },
  { id: "dictionary", label: "Dictionary", desc: "Test words from a wordlist file" },
  { id: "hybrid", label: "Hybrid", desc: "Dictionary + numeric/symbol rules" },
  { id: "rainbow", label: "Rainbow Table", desc: "Lookup in pre-computed table" }
];
function HashCracker() {
  const [mode, setMode] = reactExports.useState("dictionary");
  const [algorithm, setAlgorithm] = reactExports.useState("md5");
  const [hash, setHash] = reactExports.useState("");
  const [wordlistPath, setWordlistPath] = reactExports.useState("");
  const [maxLength, setMaxLength] = reactExports.useState(6);
  const [charsets, setCharsets] = reactExports.useState(["lowercase", "digits"]);
  const [rainbowPath, setRainbowPath] = reactExports.useState("");
  const [running, setRunning] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const jobIdRef = reactExports.useRef(null);
  const cleanupRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const cleanup = window.cryogram.passwordTester.onProgress((data) => {
      if (data.jobId === jobIdRef.current) setProgress(data);
    });
    cleanupRef.current = cleanup;
    return cleanup;
  }, []);
  const run = async () => {
    if (!hash.trim()) {
      setError("Enter a hash to crack");
      return;
    }
    setRunning(true);
    setResult(null);
    setError(null);
    setProgress(null);
    const opts = {
      mode,
      hash: hash.trim(),
      algorithm,
      wordlistPath: mode === "dictionary" || mode === "hybrid" ? wordlistPath : void 0,
      maxLength: mode === "bruteforce" ? maxLength : void 0,
      charsets: mode === "bruteforce" ? charsets : void 0,
      rainbowTablePath: mode === "rainbow" ? rainbowPath : void 0
    };
    try {
      const res = await window.cryogram.passwordTester.runCrack(opts);
      jobIdRef.current = res.jobId;
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Crack job failed");
    } finally {
      setRunning(false);
    }
  };
  const cancel = () => {
    if (jobIdRef.current) window.cryogram.passwordTester.cancel(jobIdRef.current);
    setRunning(false);
  };
  const toggleCharset = (c) => {
    setCharsets((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4 overflow-auto flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-2 uppercase tracking-wider", children: "Mode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: MODES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 cursor-pointer group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "radio",
              name: "mode",
              value: m.id,
              checked: mode === m.id,
              onChange: () => setMode(m.id),
              className: "mt-0.5 accent-cryo-accent"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-text", children: m.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cryo-muted", children: m.desc })
          ] })
        ] }, m.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-2 uppercase tracking-wider", children: "Algorithm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: algorithm,
            onChange: (e) => setAlgorithm(e.target.value),
            className: "w-full",
            children: ALGORITHMS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a, children: a.toUpperCase() }, a))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Hash" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "w-full font-mono",
          placeholder: "Paste hash here...",
          value: hash,
          onChange: (e) => setHash(e.target.value)
        }
      )
    ] }),
    (mode === "dictionary" || mode === "hybrid") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Wordlist Path" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "w-full",
          placeholder: "/path/to/rockyou.txt",
          value: wordlistPath,
          onChange: (e) => setWordlistPath(e.target.value)
        }
      )
    ] }),
    mode === "bruteforce" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Max Length" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: 1,
            max: 12,
            value: maxLength,
            onChange: (e) => setMaxLength(Number(e.target.value)),
            className: "w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Charsets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["lowercase", "uppercase", "digits", "symbols"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 cursor-pointer text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: charsets.includes(c),
              onChange: () => toggleCharset(c),
              className: "accent-cryo-accent"
            }
          ),
          c
        ] }, c)) })
      ] })
    ] }),
    mode === "rainbow" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Rainbow Table Path" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "w-full",
          placeholder: "/path/to/table.rt",
          value: rainbowPath,
          onChange: (e) => setRainbowPath(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "btn btn-primary flex-1 justify-center",
          onClick: run,
          disabled: running,
          children: running ? "Cracking..." : "Start Crack"
        }
      ),
      running && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", onClick: cancel, children: "Cancel" })
    ] }),
    running && progress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-3 text-xs space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-cryo-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Attempts: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-text", children: progress.attempts.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Rate: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cryo-text", children: [
            progress.rate.toLocaleString(),
            "/s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Elapsed: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cryo-text", children: [
            progress.elapsed.toFixed(1),
            "s"
          ] })
        ] })
      ] }),
      progress.currentWord && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-cryo-muted", children: [
        "Current: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-accent font-mono", children: progress.currentWord })
      ] })
    ] }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `panel p-4 ${result.found ? "border-cryo-green/50" : "border-cryo-red/50"}`, style: { borderColor: result.found ? "rgba(0,255,136,0.5)" : "rgba(255,68,102,0.5)" }, children: result.found ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cryo-green font-bold mb-2", children: "Password Found!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-cryo-accent text-lg", children: result.password }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cryo-muted mt-2", children: [
        result.attempts.toLocaleString(),
        " attempts · ",
        result.elapsed.toFixed(2),
        "s"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cryo-red font-bold", children: "Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cryo-muted mt-1", children: [
        "Exhausted ",
        result.attempts.toLocaleString(),
        " attempts in ",
        result.elapsed.toFixed(2),
        "s"
      ] })
    ] }) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-3 text-xs text-cryo-red border-cryo-red/30", children: [
      "Error: ",
      error
    ] })
  ] });
}
function NetworkTester() {
  const [mode, setMode] = reactExports.useState("dictionary");
  const [protocol, setProtocol] = reactExports.useState("ssh");
  const [target, setTarget] = reactExports.useState("");
  const [port, setPort] = reactExports.useState("");
  const [username, setUsername] = reactExports.useState("");
  const [usernames, setUsernames] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [wordlistPath, setWordlistPath] = reactExports.useState("");
  const [rateLimit, setRateLimit] = reactExports.useState(5);
  const [running, setRunning] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const jobIdRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const cleanup = window.cryogram.passwordTester.onProgress((data) => {
      if (data.jobId === jobIdRef.current) setProgress(data);
    });
    return cleanup;
  }, []);
  const run = async () => {
    if (!target.trim()) {
      setError("Enter a target host");
      return;
    }
    setRunning(true);
    setResult(null);
    setError(null);
    setProgress(null);
    const opts = {
      mode,
      protocol,
      target: target.trim(),
      port: port ? Number(port) : void 0,
      username: mode !== "spraying" ? username : void 0,
      usernames: mode === "spraying" ? usernames.split("\n").filter(Boolean) : void 0,
      password: mode === "spraying" ? password : void 0,
      wordlistPath: mode !== "spraying" ? wordlistPath : void 0,
      rateLimit
    };
    try {
      const res = await window.cryogram.passwordTester.runNetwork(opts);
      jobIdRef.current = res.jobId;
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network test failed");
    } finally {
      setRunning(false);
    }
  };
  const cancel = () => {
    if (jobIdRef.current) window.cryogram.passwordTester.cancel(jobIdRef.current);
    setRunning(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4 overflow-auto flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-3 text-xs text-cryo-yellow border-cryo-yellow/30 flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Only test systems you own or have explicit written authorization to test. Unauthorized access testing is illegal." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Mode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: mode, onChange: (e) => setMode(e.target.value), className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "dictionary", children: "Dictionary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bruteforce", children: "Brute Force" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "spraying", children: "Password Spray" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Protocol" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: protocol, onChange: (e) => setProtocol(e.target.value), className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ssh", children: "SSH" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "http", children: "HTTP Basic" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ftp", children: "FTP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "smtp", children: "SMTP Auth" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Rate Limit (req/s)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: 1,
            max: 50,
            value: rateLimit,
            onChange: (e) => setRateLimit(Number(e.target.value)),
            className: "w-full"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Target Host" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full",
            placeholder: "192.168.1.1",
            value: target,
            onChange: (e) => setTarget(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Port" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full",
            placeholder: "auto",
            value: port,
            onChange: (e) => setPort(e.target.value)
          }
        )
      ] })
    ] }),
    mode !== "spraying" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Username" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "w-full",
          placeholder: "admin",
          value: username,
          onChange: (e) => setUsername(e.target.value)
        }
      )
    ] }),
    mode !== "spraying" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Password Wordlist" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "w-full",
          placeholder: "/path/to/wordlist.txt",
          value: wordlistPath,
          onChange: (e) => setWordlistPath(e.target.value)
        }
      )
    ] }),
    mode === "spraying" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Password to Spray" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full",
            placeholder: "Password123!",
            value: password,
            onChange: (e) => setPassword(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-cryo-muted mb-1.5 uppercase tracking-wider", children: "Usernames (one per line)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            className: "w-full h-24 resize-none",
            placeholder: "user1\nuser2\nadmin",
            value: usernames,
            onChange: (e) => setUsernames(e.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary flex-1 justify-center", onClick: run, disabled: running, children: running ? "Testing..." : "Start Test" }),
      running && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", onClick: cancel, children: "Cancel" })
    ] }),
    running && progress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel p-3 text-xs space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-cryo-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Attempts: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-text", children: progress.attempts.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Rate: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cryo-text", children: [
            progress.rate.toFixed(1),
            "/s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Elapsed: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cryo-text", children: [
            progress.elapsed.toFixed(1),
            "s"
          ] })
        ] })
      ] }),
      progress.currentWord && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-cryo-muted", children: [
        "Trying: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-accent font-mono", children: progress.currentWord })
      ] })
    ] }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `panel p-4`, style: { borderColor: result.found ? "rgba(0,255,136,0.5)" : "rgba(255,68,102,0.5)" }, children: result.found && result.credentials ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cryo-green font-bold mb-3", children: "Credentials Found!" }),
      result.credentials.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-muted", children: "user: " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-accent", children: c.username }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-muted", children: "  pass: " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cryo-green", children: c.password })
      ] }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cryo-muted mt-2", children: [
        result.attempts.toLocaleString(),
        " attempts · ",
        result.elapsed.toFixed(2),
        "s"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cryo-red font-bold", children: "No valid credentials found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cryo-muted mt-1", children: [
        result.attempts.toLocaleString(),
        " attempts · ",
        result.elapsed.toFixed(2),
        "s"
      ] })
    ] }) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel p-3 text-xs text-cryo-red", children: error })
  ] });
}
const TABS = [
  { id: "hash", label: "Hash Cracker" },
  { id: "network", label: "Network Tester" }
];
function PasswordTester() {
  const [accepted, setAccepted] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("hash");
  reactExports.useEffect(() => {
    window.cryogram.settings.get("ptDisclaimerAccepted").then((val) => {
      if (!val) {
        setAccepted(false);
        return;
      }
      const acceptedDate = new Date(val);
      const daysSince = (Date.now() - acceptedDate.getTime()) / (1e3 * 60 * 60 * 24);
      setAccepted(daysSince < 90);
    });
  }, []);
  const onAccept = async () => {
    await window.cryogram.settings.set("ptDisclaimerAccepted", (/* @__PURE__ */ new Date()).toISOString());
    setAccepted(true);
  };
  if (accepted === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center text-cryo-muted text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { animate: { opacity: [0.4, 1, 0.4] }, transition: { duration: 1.5, repeat: Infinity }, children: "Loading…" }) });
  }
  if (!accepted) return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthDisclaimer, { onAccept });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex shrink-0 relative",
        style: { borderBottom: "1px solid rgba(26,40,64,0.7)" },
        children: TABS.map(({ id, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setTab(id),
            className: "relative px-5 py-2.5 text-xs font-medium transition-colors",
            style: { color: tab === id ? "#ffcc00" : "#4e5d6e" },
            children: [
              label,
              tab === id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  layoutId: "pt-tab-indicator",
                  className: "absolute bottom-0 left-0 right-0 h-px",
                  style: { background: "#ffcc00", boxShadow: "0 0 6px rgba(255,204,0,0.6)" },
                  transition: { type: "spring", stiffness: 400, damping: 30 }
                }
              )
            ]
          },
          id
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute inset-0",
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.18, ease: "easeOut" },
        children: tab === "hash" ? /* @__PURE__ */ jsxRuntimeExports.jsx(HashCracker, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkTester, {})
      },
      tab
    ) }) })
  ] });
}
export {
  PasswordTester as default
};
