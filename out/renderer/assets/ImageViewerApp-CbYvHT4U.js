import { r as reactExports, j as jsxRuntimeExports } from "./index-HNqA6Mor.js";
const api = () => window.cryogram?.imageViewer;
function fmtSize(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}
function ImageViewerApp() {
  const [image, setImage] = reactExports.useState(null);
  const [zoom, setZoom] = reactExports.useState(1);
  const [pan, setPan] = reactExports.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = reactExports.useState(false);
  const dragStart = reactExports.useRef({ x: 0, y: 0, px: 0, py: 0 });
  const [fitMode, setFitMode] = reactExports.useState("fit");
  async function openFile() {
    const result = await api()?.open();
    if (result) {
      setImage(result);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }
  function onWheel(e) {
    e.preventDefault();
    setZoom((z) => Math.max(0.1, Math.min(10, z - e.deltaY * 1e-3)));
  }
  function onMouseDown(e) {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  }
  function onMouseMove(e) {
    if (!dragging) return;
    setPan({ x: dragStart.current.px + e.clientX - dragStart.current.x, y: dragStart.current.py + e.clientY - dragStart.current.y });
  }
  function onDragOver(e) {
    e.preventDefault();
  }
  async function onDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const result = await api()?.readFile(file.path || file.name);
    if (result) {
      setImage(result);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-full flex flex-col bg-gray-950 text-gray-100 font-mono select-none",
      onDragOver,
      onDrop,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 border-b border-gray-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🖼️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-400", children: "Image Viewer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: openFile, className: "ml-2 text-xs px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded", children: "Open" }),
          image && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400 ml-2 truncate max-w-xs", children: image.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-600", children: fmtSize(image.size) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setZoom((z) => Math.max(0.1, z - 0.1)), className: "text-sm px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded", children: "−" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400 w-12 text-center", children: [
                Math.round(zoom * 100),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setZoom((z) => Math.min(10, z + 0.1)), className: "text-sm px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded", children: "+" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }, className: "text-xs px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400", children: "1:1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
                setFitMode("fit");
              }, className: "text-xs px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400", children: "Fit" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 overflow-hidden relative bg-[#111] flex items-center justify-center",
            style: { backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #0e0e0e 0% 50%)", backgroundSize: "20px 20px", cursor: dragging ? "grabbing" : image ? "grab" : "default" },
            onWheel,
            onMouseDown,
            onMouseMove,
            onMouseUp: () => setDragging(false),
            onMouseLeave: () => setDragging(false),
            children: !image ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "🖼️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Click Open or drag & drop an image" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "PNG · JPG · GIF · WebP · SVG · BMP" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center",
              transition: dragging ? "none" : "transform 0.05s",
              cursor: dragging ? "grabbing" : "grab"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: image.dataUrl,
                alt: image.name,
                style: { maxWidth: fitMode === "fit" ? "80vw" : "none", maxHeight: fitMode === "fit" ? "70vh" : "none", display: "block", imageRendering: zoom > 3 ? "pixelated" : "auto" },
                draggable: false
              }
            ) })
          }
        ),
        image && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-4 py-1.5 border-t border-gray-800 text-xs text-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: image.path }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto", children: "Scroll to zoom · Drag to pan" })
        ] })
      ]
    }
  );
}
export {
  ImageViewerApp as default
};
