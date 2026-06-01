import { r as reactExports, j as jsxRuntimeExports } from "./index-CkoTmMxG.js";
const s = {
  root: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(8,12,20,0.8)", color: "rgba(255,255,255,0.85)", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif', fontSize: 14 },
  topBar: { display: "flex", gap: 8, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", alignItems: "center", flexWrap: "wrap" },
  input: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 10px", color: "rgba(255,255,255,0.85)", fontSize: 12, outline: "none", fontFamily: '"JetBrains Mono",monospace' },
  btn: (c, t = "#000") => ({ padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: c, color: t }),
  table: { width: "100%", borderCollapse: "collapse", fontFamily: '"JetBrains Mono",monospace', fontSize: 11 },
  th: { padding: "6px 10px", textAlign: "left", fontSize: 10, color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap" },
  td: { padding: "5px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" },
  row: (sel) => ({ background: sel ? "rgba(0,212,255,0.08)" : "transparent", cursor: "pointer" }),
  proto: (p) => {
    const m = { TCP: "#00d4ff", UDP: "#a78bfa", ICMP: "#4ade80", HTTP: "#fb923c", HTTPS: "#22c55e", DNS: "#eab308", ARP: "#f472b6" };
    return { padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: `${m[p] || "#6b7280"}22`, color: m[p] || "#6b7280" };
  }
};
const IFACES = ["eth0", "wlan0", "lo", "any"];
function PacketSnifferApp() {
  const [iface, setIface] = reactExports.useState("any");
  const [filter, setFilter] = reactExports.useState("");
  const [running, setRunning] = reactExports.useState(false);
  const [packets, setPackets] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const tableRef = reactExports.useRef(null);
  const cleanupRef = reactExports.useRef(null);
  async function start() {
    setRunning(true);
    setPackets([]);
    try {
      const cleanup = await window.cryogram?.packetSniffer?.start(iface, filter, (pkt) => {
        setPackets((p) => [...p.slice(-999), pkt]);
      });
      cleanupRef.current = cleanup;
    } catch {
      setRunning(false);
    }
  }
  async function stop() {
    cleanupRef.current?.();
    await window.cryogram?.packetSniffer?.stop();
    setRunning(false);
  }
  reactExports.useEffect(() => () => {
    cleanupRef.current?.();
  }, []);
  const filtered = packets.filter(
    (p) => !search || p.src.includes(search) || p.dst.includes(search) || p.proto.includes(search.toUpperCase()) || p.info.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.root, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: s.topBar, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, fontSize: 14 }, children: "Packet Sniffer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { style: { ...s.input, width: 100 }, value: iface, onChange: (e) => setIface(e.target.value), disabled: running, children: IFACES.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: i }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { ...s.input, width: 160 }, placeholder: "BPF filter (e.g. tcp port 80)", value: filter, onChange: (e) => setFilter(e.target.value), disabled: running }),
      !running ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("#4ade80"), onClick: start, children: "▶ Start" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("#ef4444", "#fff"), onClick: stop, children: "⏹ Stop" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: s.btn("rgba(255,255,255,0.07)", "rgba(255,255,255,0.6)"), onClick: () => setPackets([]), disabled: running, children: "Clear" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { ...s.input, width: 160, marginLeft: "auto" }, placeholder: "Search…", value: search, onChange: (e) => setSearch(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)" }, children: [
        filtered.length,
        " packets"
      ] })
    ] }),
    running && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 2, background: "linear-gradient(90deg,var(--cryo-accent,#00d4ff),transparent)", animation: "none" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto" }, ref: tableRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: s.table, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: { position: "sticky", top: 0, background: "rgba(8,12,20,0.95)", zIndex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["#", "Time", "Source", "Destination", "Protocol", "Length", "Info"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: s.th, children: h }, h)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: s.row(selected?.id === p.id), onClick: () => setSelected(p), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...s.td, color: "rgba(255,255,255,0.3)" }, children: p.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...s.td, color: "rgba(255,255,255,0.5)" }, children: p.time }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: s.td, children: p.src }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: s.td, children: p.dst }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: s.td, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: s.proto(p.proto), children: p.proto }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...s.td, color: "rgba(255,255,255,0.5)" }, children: p.len }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...s.td, color: "rgba(255,255,255,0.6)", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }, children: p.info })
        ] }, p.id)) })
      ] }),
      packets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }, children: running ? "Capturing packets…" : "Press Start to begin capture. Requires tshark/tcpdump and appropriate permissions." })
    ] }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { borderTop: "1px solid rgba(255,255,255,0.07)", padding: 12, background: "rgba(0,0,0,0.3)", maxHeight: 140, overflow: "auto" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }, children: [
        "PACKET DETAIL — #",
        selected.id
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: '"JetBrains Mono",monospace', fontSize: 11, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }, children: [["Time", selected.time], ["Source", selected.src], ["Destination", selected.dst], ["Protocol", selected.proto], ["Length", String(selected.len) + "b"], ["Info", selected.info]].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.4)" }, children: [
          k,
          ": "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: v })
      ] }, k)) })
    ] })
  ] });
}
export {
  PacketSnifferApp as default
};
