import { r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./index-CkoTmMxG.js";
const ACCENT = "#34d399";
const PRESET_COLORS = ["#ef4444", "#facc15", "#22d3ee", "#ffffff", "#000000"];
const STROKE_WIDTHS = { thin: 2, medium: 4, thick: 8 };
function genId() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function ScreenshotApp() {
  const [captured, setCaptured] = reactExports.useState(null);
  const [capturing, setCapturing] = reactExports.useState(false);
  const [toasts, setToasts] = reactExports.useState([]);
  const [tool, setTool] = reactExports.useState("pen");
  const [color, setColor] = reactExports.useState(PRESET_COLORS[0]);
  const [strokeKey, setStrokeKey] = reactExports.useState("medium");
  const [strokes, setStrokes] = reactExports.useState([]);
  const [drawing, setDrawing] = reactExports.useState(false);
  const [pendingStroke, setPending] = reactExports.useState(null);
  const [textPos, setTextPos] = reactExports.useState(null);
  const [textInput, setTextInput] = reactExports.useState("");
  const canvasRef = reactExports.useRef(null);
  const imgRef = reactExports.useRef(null);
  const textInpRef = reactExports.useRef(null);
  const pushToast = reactExports.useCallback((text) => {
    const id = genId();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);
  const capture = reactExports.useCallback(async () => {
    setCapturing(true);
    try {
      const result = await window.cryogram.screenshot.capture();
      setCaptured(result);
      setStrokes([]);
      setPending(null);
      setTextPos(null);
    } catch (err) {
      pushToast("Capture failed");
    } finally {
      setCapturing(false);
    }
  }, [pushToast]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "#") {
        e.preventDefault();
        if (!capturing) capture();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [capture, capturing]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        setStrokes((s) => s.slice(0, -1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const handleSave = reactExports.useCallback(async () => {
    if (!captured) return;
    const dataUrl = getFlattenedDataUrl();
    if (!dataUrl) return;
    try {
      const result = await window.cryogram.screenshot.save(dataUrl);
      pushToast(`Saved: ${result.path}`);
    } catch {
      pushToast("Save failed");
    }
  }, [captured, pushToast]);
  const handleCopy = reactExports.useCallback(async () => {
    if (!captured) return;
    const dataUrl = getFlattenedDataUrl();
    if (!dataUrl) return;
    try {
      await window.cryogram.screenshot.copyToClipboard(dataUrl);
      pushToast("Copied to clipboard!");
    } catch {
      pushToast("Copy failed");
    }
  }, [captured, pushToast]);
  function getFlattenedDataUrl() {
    if (!captured || !canvasRef.current) return captured?.dataUrl ?? null;
    const canvas = document.createElement("canvas");
    canvas.width = canvasRef.current.width;
    canvas.height = canvasRef.current.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const img = imgRef.current;
    if (img) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvasRef.current, 0, 0);
    return canvas.toDataURL("image/png");
  }
  const redrawCanvas = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const allStrokes = pendingStroke ? [...strokes, pendingStroke] : strokes;
    for (const stroke of allStrokes) {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (stroke.tool === "pen" && stroke.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }
      if (stroke.tool === "rect" && stroke.endPoint) {
        const [p0] = stroke.points;
        ctx.strokeRect(
          p0.x,
          p0.y,
          stroke.endPoint.x - p0.x,
          stroke.endPoint.y - p0.y
        );
      }
      if (stroke.tool === "arrow" && stroke.endPoint) {
        const [p0] = stroke.points;
        const p1 = stroke.endPoint;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const headLen = 14;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(
          p1.x - headLen * Math.cos(angle - Math.PI / 6),
          p1.y - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(
          p1.x - headLen * Math.cos(angle + Math.PI / 6),
          p1.y - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
      if (stroke.tool === "text" && stroke.text && stroke.points[0]) {
        ctx.fillStyle = stroke.color;
        ctx.font = `${stroke.lineWidth * 5 + 10}px -apple-system, sans-serif`;
        ctx.fillText(stroke.text, stroke.points[0].x, stroke.points[0].y);
      }
    }
  }, [strokes, pendingStroke]);
  reactExports.useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);
  function getCanvasPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }
  function onMouseDown(e) {
    if (tool === "text") {
      const pos2 = getCanvasPos(e);
      setTextPos(pos2);
      setTextInput("");
      setTimeout(() => textInpRef.current?.focus(), 40);
      return;
    }
    const pos = getCanvasPos(e);
    setDrawing(true);
    const stroke = {
      id: genId(),
      tool,
      color,
      lineWidth: STROKE_WIDTHS[strokeKey],
      points: [pos]
    };
    setPending(stroke);
  }
  function onMouseMove(e) {
    if (!drawing || !pendingStroke) return;
    const pos = getCanvasPos(e);
    if (pendingStroke.tool === "pen") {
      setPending((s) => s ? { ...s, points: [...s.points, pos] } : s);
    } else {
      setPending((s) => s ? { ...s, endPoint: pos } : s);
    }
  }
  function onMouseUp() {
    if (!drawing || !pendingStroke) return;
    setDrawing(false);
    setStrokes((s) => [...s, pendingStroke]);
    setPending(null);
  }
  function commitText() {
    if (!textPos || !textInput.trim()) {
      setTextPos(null);
      setTextInput("");
      return;
    }
    const stroke = {
      id: genId(),
      tool: "text",
      color,
      lineWidth: STROKE_WIDTHS[strokeKey],
      points: [textPos],
      text: textInput
    };
    setStrokes((s) => [...s, stroke]);
    setTextPos(null);
    setTextInput("");
  }
  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  const btnBase = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 7,
    color: "#c9d1d9",
    fontSize: 12,
    cursor: "pointer",
    padding: "5px 11px",
    fontFamily: font,
    display: "flex",
    alignItems: "center",
    gap: 5,
    transition: "background 0.15s"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "rgba(12,16,26,0.92)",
        backdropFilter: "blur(40px)",
        fontFamily: font,
        color: "#c9d1d9",
        overflow: "hidden",
        position: "relative"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: toasts.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12, scale: 0.94 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 8, scale: 0.94 },
            transition: { type: "spring", stiffness: 380, damping: 26 },
            style: {
              background: "rgba(20,26,38,0.97)",
              border: `1px solid ${ACCENT}40`,
              borderRadius: 9,
              padding: "8px 16px",
              fontSize: 12,
              color: ACCENT,
              boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px ${ACCENT}20`,
              maxWidth: 340,
              wordBreak: "break-all"
            },
            children: t.text
          },
          t.id
        )) }) }),
        !captured && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 52, opacity: 0.18 }, children: "📸" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 17, fontWeight: 600, color: "#e0e8f0" }, children: "Screenshot Tool" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.35)" }, children: "Capture your screen and annotate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              whileHover: { scale: 1.04 },
              whileTap: { scale: 0.96 },
              onClick: capture,
              disabled: capturing,
              style: {
                padding: "12px 32px",
                background: `linear-gradient(135deg, ${ACCENT}22, ${ACCENT}10)`,
                border: `1px solid ${ACCENT}60`,
                borderRadius: 10,
                color: ACCENT,
                fontSize: 14,
                fontWeight: 600,
                cursor: capturing ? "not-allowed" : "pointer",
                opacity: capturing ? 0.5 : 1,
                fontFamily: font,
                letterSpacing: "0.02em"
              },
              children: capturing ? "Capturing…" : "📸  Capture Screen"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.2)" }, children: [
            "or press ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { style: { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, padding: "1px 5px" }, children: "Ctrl+Shift+3" })
          ] })
        ] }),
        captured && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 10px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(8,12,20,0.6)",
            flexWrap: "wrap"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.95 },
                onClick: handleSave,
                style: { ...btnBase, color: ACCENT, borderColor: `${ACCENT}40` },
                children: "💾 Save"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.95 },
                onClick: handleCopy,
                style: btnBase,
                children: "📋 Copy"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.95 },
                onClick: capture,
                style: btnBase,
                children: "🔄 Recapture"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.95 },
                onClick: () => {
                  setCaptured(null);
                  setStrokes([]);
                },
                style: { ...btnBase, color: "rgba(255,68,102,0.8)" },
                children: "✕ Close"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" } }),
            ["pen", "rect", "arrow", "text"].map((t) => {
              const icons = { pen: "✏️", rect: "▭", arrow: "↗", text: "T" };
              const isActive = tool === t;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  whileHover: { scale: 1.04 },
                  whileTap: { scale: 0.95 },
                  onClick: () => setTool(t),
                  style: {
                    ...btnBase,
                    background: isActive ? `${ACCENT}22` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isActive ? ACCENT : "rgba(255,255,255,0.1)"}`,
                    color: isActive ? ACCENT : "#c9d1d9"
                  },
                  children: icons[t]
                },
                t
              );
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" } }),
            PRESET_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setColor(c),
                style: {
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: c,
                  border: color === c ? "2px solid #fff" : "2px solid transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                  outline: "none",
                  boxShadow: color === c ? `0 0 6px ${c}` : "none"
                }
              },
              c
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" } }),
            Object.keys(STROKE_WIDTHS).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.95 },
                onClick: () => setStrokeKey(k),
                style: {
                  ...btnBase,
                  background: strokeKey === k ? `${ACCENT}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${strokeKey === k ? ACCENT : "rgba(255,255,255,0.1)"}`,
                  color: strokeKey === k ? ACCENT : "#c9d1d9",
                  fontSize: 11,
                  padding: "4px 9px"
                },
                children: k
              },
              k
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.95 },
                onClick: () => setStrokes((s) => s.slice(0, -1)),
                disabled: strokes.length === 0,
                style: { ...btnBase, opacity: strokes.length === 0 ? 0.35 : 1 },
                children: "↩ Undo"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.95 },
                onClick: () => setStrokes([]),
                disabled: strokes.length === 0,
                style: { ...btnBase, opacity: strokes.length === 0 ? 0.35 : 1 },
                children: "🗑 Clear"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflow: "auto", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(6,10,18,0.7)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", display: "inline-block", lineHeight: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                ref: imgRef,
                src: captured.dataUrl,
                alt: "Screenshot",
                style: { display: "block", maxWidth: "100%", maxHeight: "calc(100vh - 200px)", userSelect: "none", pointerEvents: "none" },
                draggable: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "canvas",
              {
                ref: canvasRef,
                width: captured.width,
                height: captured.height,
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  cursor: tool === "text" ? "text" : "crosshair"
                },
                onMouseDown,
                onMouseMove,
                onMouseUp,
                onMouseLeave: onMouseUp
              }
            ),
            textPos && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: textInpRef,
                value: textInput,
                onChange: (e) => setTextInput(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitText();
                  }
                  if (e.key === "Escape") {
                    setTextPos(null);
                    setTextInput("");
                  }
                },
                onBlur: commitText,
                placeholder: "Type text…",
                style: {
                  position: "absolute",
                  left: `${textPos.x / captured.width * 100}%`,
                  top: `${textPos.y / captured.height * 100}%`,
                  transform: "translateY(-100%)",
                  background: "rgba(10,14,22,0.88)",
                  border: `1px solid ${color}`,
                  borderRadius: 5,
                  color,
                  fontSize: 13,
                  padding: "3px 7px",
                  outline: "none",
                  fontFamily: font,
                  minWidth: 120,
                  zIndex: 10
                }
              }
            )
          ] }) })
        ] })
      ]
    }
  );
}
export {
  ScreenshotApp as default
};
