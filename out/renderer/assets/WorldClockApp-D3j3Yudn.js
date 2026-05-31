import { r as reactExports, j as jsxRuntimeExports } from "./index-BD9ZsX0F.js";
const PRESETS = [
  { tz: "America/New_York", label: "New York" },
  { tz: "America/Los_Angeles", label: "Los Angeles" },
  { tz: "America/Chicago", label: "Chicago" },
  { tz: "Europe/London", label: "London" },
  { tz: "Europe/Paris", label: "Paris" },
  { tz: "Europe/Berlin", label: "Berlin" },
  { tz: "Asia/Dubai", label: "Dubai" },
  { tz: "Asia/Kolkata", label: "Mumbai" },
  { tz: "Asia/Singapore", label: "Singapore" },
  { tz: "Asia/Tokyo", label: "Tokyo" },
  { tz: "Asia/Shanghai", label: "Shanghai" },
  { tz: "Australia/Sydney", label: "Sydney" },
  { tz: "Pacific/Auckland", label: "Auckland" },
  { tz: "America/Sao_Paulo", label: "São Paulo" },
  { tz: "Africa/Johannesburg", label: "Johannesburg" }
];
function getTime(tz) {
  try {
    const now = /* @__PURE__ */ new Date();
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      weekday: "short",
      month: "short",
      day: "numeric"
    });
    const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
    const offset = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? "";
    return { time: `${parts.hour}:${parts.minute}:${parts.second}`, date: `${parts.weekday}, ${parts.month} ${parts.day}`, offset };
  } catch {
    return { time: "--:--:--", date: "---", offset: "" };
  }
}
function isDaytime(tz) {
  try {
    const h = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hour12: false }).format(/* @__PURE__ */ new Date()));
    return h >= 6 && h < 20;
  } catch {
    return true;
  }
}
const LS_KEY = "cryogram-world-clock-zones";
function loadZones() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveZones(z) {
  localStorage.setItem(LS_KEY, JSON.stringify(z));
}
function WorldClockApp() {
  const [zones, setZones] = reactExports.useState(
    () => loadZones().length > 0 ? loadZones() : [
      { id: "1", tz: "America/New_York", label: "New York" },
      { id: "2", tz: "Europe/London", label: "London" },
      { id: "3", tz: "Asia/Tokyo", label: "Tokyo" }
    ]
  );
  const [tick, setTick] = reactExports.useState(0);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  reactExports.useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1e3);
    return () => clearInterval(t);
  }, []);
  function add(preset) {
    if (zones.find((z) => z.tz === preset.tz)) return;
    const updated = [...zones, { id: `z-${Date.now()}`, ...preset }];
    setZones(updated);
    saveZones(updated);
    setShowAdd(false);
    setSearch("");
  }
  function remove(id) {
    const updated = zones.filter((z) => z.id !== id);
    setZones(updated);
    saveZones(updated);
  }
  const filtered = PRESETS.filter(
    (p) => !zones.find((z) => z.tz === p.tz) && (!search || p.label.toLowerCase().includes(search.toLowerCase()) || p.tz.toLowerCase().includes(search.toLowerCase()))
  );
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-gray-950 text-gray-100 font-mono", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-gray-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🌍" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-400", children: "World Clock" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500 ml-2", children: [
        "Local: ",
        localTz
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowAdd(!showAdd),
          className: "ml-auto text-xs px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded",
          children: "+ Add City"
        }
      )
    ] }),
    showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-gray-800 px-4 py-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search city…",
          className: "w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 max-h-32 overflow-y-auto", children: filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => add(p),
          className: "text-xs px-3 py-1 rounded bg-gray-800 hover:bg-blue-700 text-gray-300 hover:text-white border border-gray-700 hover:border-blue-600",
          children: p.label
        },
        p.tz
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start", children: zones.map((zone) => {
      const { time, date, offset } = getTime(zone.tz);
      const day = isDaytime(zone.tz);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `group relative rounded-xl border p-4 ${day ? "bg-blue-950/20 border-blue-900/40" : "bg-gray-900/60 border-gray-700/60"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => remove(zone.id),
            className: "absolute top-2 right-2 text-xs text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100",
            children: "×"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: day ? "☀️" : "🌙" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-200 text-sm", children: zone.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-300 tabular-nums", children: time }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mt-1", children: date }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 mt-0.5", children: [
          offset,
          " · ",
          zone.tz
        ] })
      ] }, zone.id);
    }) })
  ] });
}
export {
  WorldClockApp as default
};
