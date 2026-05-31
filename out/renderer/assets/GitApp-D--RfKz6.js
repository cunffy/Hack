import { r as reactExports, j as jsxRuntimeExports } from "./index-Cju5vuNp.js";
const ipc = window.cryogram?.git;
function GitApp() {
  const [repoPath, setRepoPath] = reactExports.useState("");
  const [pathInput, setPathInput] = reactExports.useState("");
  const [isRepo, setIsRepo] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("changes");
  const [status, setStatus] = reactExports.useState(null);
  const [commits, setCommits] = reactExports.useState([]);
  const [branches, setBranches] = reactExports.useState([]);
  const [diffText, setDiffText] = reactExports.useState("");
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [commitMsg, setCommitMsg] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState("");
  const flash = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3e3);
  };
  const load = reactExports.useCallback(async (path) => {
    if (!ipc) return;
    setLoading(true);
    try {
      const ok = await ipc.isRepo(path);
      setIsRepo(ok);
      if (ok) {
        const [s, c, b] = await Promise.all([ipc.status(path), ipc.log(path, 40), ipc.getBranches(path)]);
        setStatus(s);
        setCommits(c);
        setBranches(b);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  const open = async () => {
    const p = pathInput.trim();
    if (!p) return;
    setRepoPath(p);
    await load(p);
  };
  const refresh = () => {
    if (repoPath) load(repoPath);
  };
  const viewDiff = async (filePath, staged2 = false) => {
    if (!ipc || !repoPath) return;
    const diff = await ipc.diff(repoPath, filePath, staged2);
    setDiffText(diff);
    setSelectedFile(filePath ?? null);
  };
  const stage = async (files) => {
    if (!ipc) return;
    await ipc.stage(repoPath, files);
    refresh();
    flash("Staged");
  };
  const unstage = async (files) => {
    if (!ipc) return;
    await ipc.unstage(repoPath, files);
    refresh();
    flash("Unstaged");
  };
  const commit = async () => {
    if (!ipc || !commitMsg.trim()) return;
    try {
      await ipc.commit(repoPath, commitMsg.trim());
      setCommitMsg("");
      refresh();
      flash("Committed!");
    } catch (e) {
      flash("Error: " + e.message);
    }
  };
  const push = async () => {
    if (!ipc) return;
    setLoading(true);
    try {
      await ipc.push(repoPath);
      refresh();
      flash("Pushed!");
    } catch (e) {
      flash("Push error: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  const pull = async () => {
    if (!ipc) return;
    setLoading(true);
    try {
      await ipc.pull(repoPath);
      refresh();
      flash("Pulled!");
    } catch (e) {
      flash("Pull error: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  const checkout = async (branch) => {
    if (!ipc) return;
    await ipc.checkout(repoPath, branch);
    refresh();
    flash(`Switched to ${branch}`);
  };
  const staged = status?.files.filter((f) => f.staged) ?? [];
  const unstaged = status?.files.filter((f) => !f.staged) ?? [];
  const statusColor = (s) => s === "M" ? "#facc15" : s === "A" ? "#4ade80" : s === "D" ? "#f87171" : "#94a3b8";
  if (!repoPath || isRepo === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, background: "rgba(8,12,20,0.8)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36 }, children: "🌿" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.85)" }, children: "Git Repository" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, width: 400 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: pathInput,
            onChange: (e) => setPathInput(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && open(),
            placeholder: "/path/to/repo",
            style: { flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#fff", fontFamily: "monospace", fontSize: 13 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: open, style: { padding: "8px 18px", background: "var(--cryo-accent)", color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }, children: "Open" })
      ] }),
      isRepo === false && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#f87171", fontSize: 12 }, children: "Not a git repository" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", height: "100%", background: "rgba(8,12,20,0.8)", fontFamily: "-apple-system,sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 280, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#4ade80", fontSize: 13, fontWeight: 700, fontFamily: "monospace" }, children: [
            "⎇ ",
            status?.branch
          ] }),
          (status?.ahead ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color: "var(--cryo-accent)", background: "rgba(0,212,255,0.12)", padding: "1px 6px", borderRadius: 10 }, children: [
            "↑",
            status.ahead
          ] }),
          (status?.behind ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, color: "#facc15", background: "rgba(250,204,21,0.12)", padding: "1px 6px", borderRadius: 10 }, children: [
            "↓",
            status.behind
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4, marginTop: 8 }, children: ["changes", "log", "branches"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setTab(t),
            style: {
              flex: 1,
              fontSize: 10,
              padding: "4px 0",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              textTransform: "capitalize",
              background: tab === t ? "var(--cryo-accent)" : "rgba(255,255,255,0.06)",
              color: tab === t ? "#000" : "rgba(255,255,255,0.5)"
            },
            children: t
          },
          t
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "8px 10px" }, children: [
        tab === "changes" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          staged.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }, children: [
              "Staged (",
              staged.length,
              ")"
            ] }),
            staged.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => viewDiff(f.path, true),
                style: { display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", borderRadius: 6, cursor: "pointer", marginBottom: 2, background: selectedFile === f.path ? "rgba(255,255,255,0.06)" : "transparent" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: statusColor(f.status), fontFamily: "monospace", fontSize: 11, fontWeight: 700, width: 12 }, children: f.status }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }, children: f.path }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        unstage([f.path]);
                      },
                      style: { fontSize: 9, padding: "1px 5px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 4, color: "rgba(255,255,255,0.4)", cursor: "pointer" },
                      children: "−"
                    }
                  )
                ]
              },
              f.path
            ))
          ] }),
          unstaged.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 10, marginBottom: 4 }, children: [
              "Changes (",
              unstaged.length,
              ")"
            ] }),
            unstaged.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => viewDiff(f.path),
                style: { display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", borderRadius: 6, cursor: "pointer", marginBottom: 2, background: selectedFile === f.path ? "rgba(255,255,255,0.06)" : "transparent" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: statusColor(f.status), fontFamily: "monospace", fontSize: 11, fontWeight: 700, width: 12 }, children: f.status }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }, children: f.path }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        stage([f.path]);
                      },
                      style: { fontSize: 9, padding: "1px 5px", background: "rgba(0,212,255,0.15)", border: "none", borderRadius: 4, color: "var(--cryo-accent)", cursor: "pointer" },
                      children: "+"
                    }
                  )
                ]
              },
              f.path
            ))
          ] }),
          staged.length === 0 && unstaged.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 30 }, children: "Working tree clean" })
        ] }),
        tab === "log" && commits.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "6px 4px", borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { style: { fontSize: 10, color: "var(--cryo-accent)" }, children: c.shortHash }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)" }, children: c.relDate })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: c.subject }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }, children: c.author })
        ] }, c.hash)),
        tab === "branches" && branches.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, padding: "5px 6px", borderRadius: 6, marginBottom: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: b.isCurrent ? "#4ade80" : "rgba(255,255,255,0.4)", fontSize: 11 }, children: b.isCurrent ? "●" : "○" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: b.isCurrent ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)", flex: 1, overflow: "hidden", textOverflow: "ellipsis" }, children: b.name }),
          !b.isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => checkout(b.name), style: { fontSize: 9, padding: "2px 6px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 4, color: "rgba(255,255,255,0.5)", cursor: "pointer" }, children: "Checkout" })
        ] }, b.name))
      ] }),
      tab === "changes" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 10, borderTop: "1px solid rgba(255,255,255,0.07)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: commitMsg,
            onChange: (e) => setCommitMsg(e.target.value),
            placeholder: "Commit message…",
            rows: 2,
            style: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 8px", color: "#fff", fontSize: 11, resize: "none", fontFamily: "sans-serif", boxSizing: "border-box" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginTop: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => stage(unstaged.map((f) => f.path)), style: { flex: 1, fontSize: 10, padding: "5px 0", background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.6)", cursor: "pointer" }, children: "Stage All" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: commit, disabled: !commitMsg.trim(), style: { flex: 2, fontSize: 11, padding: "5px 0", background: commitMsg.trim() ? "var(--cryo-accent)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: 6, color: commitMsg.trim() ? "#000" : "rgba(255,255,255,0.3)", fontWeight: 700, cursor: "pointer" }, children: "Commit" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginTop: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: pull, style: { flex: 1, fontSize: 10, padding: "5px 0", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer" }, children: "↓ Pull" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: push, style: { flex: 1, fontSize: 10, padding: "5px 0", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer" }, children: "↑ Push" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: refresh, style: { flex: 1, fontSize: 10, padding: "5px 0", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer" }, children: "⟳" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "6px 14px", background: "rgba(0,212,255,0.12)", borderBottom: "1px solid rgba(0,212,255,0.2)", fontSize: 12, color: "var(--cryo-accent)" }, children: msg }),
      diffText ? /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { flex: 1, overflowY: "auto", margin: 0, padding: 14, fontSize: 11, fontFamily: "JetBrains Mono,monospace", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: diffText.split("\n").map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "block", color: line.startsWith("+") ? "#4ade80" : line.startsWith("-") ? "#f87171" : line.startsWith("@@") ? "#c084fc" : "rgba(255,255,255,0.6)", background: line.startsWith("+") ? "rgba(74,222,128,0.06)" : line.startsWith("-") ? "rgba(248,113,113,0.06)" : "transparent" }, children: line }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 13 }, children: loading ? "Loading…" : "Select a file to view diff" })
    ] })
  ] });
}
export {
  GitApp as default
};
