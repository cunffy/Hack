"use strict";
const electron = require("electron");
const path = require("path");
const child_process = require("child_process");
const utils = require("@electron-toolkit/utils");
const pty = require("node-pty");
const os = require("os");
const axios = require("axios");
const Database = require("better-sqlite3");
const Store = require("electron-store");
const crypto = require("crypto");
const promises = require("fs/promises");
const util = require("util");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const pty__namespace = /* @__PURE__ */ _interopNamespaceDefault(pty);
const sessions = /* @__PURE__ */ new Map();
function registerTerminalHandlers() {
  electron.ipcMain.handle("terminal:create", (event, id, cols, rows) => {
    const shell = os.platform() === "win32" ? "powershell.exe" : process.env.SHELL || "/bin/bash";
    const proc = pty__namespace.spawn(shell, [], {
      name: "xterm-256color",
      cols,
      rows,
      cwd: process.env.HOME || process.cwd(),
      env: { ...process.env, TERM: "xterm-256color" }
    });
    sessions.set(id, proc);
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    proc.onData((data) => {
      win?.webContents.send(`terminal:data:${id}`, data);
    });
    proc.onExit(() => {
      sessions.delete(id);
      win?.webContents.send(`terminal:data:${id}`, "\r\n[Process exited]\r\n");
    });
    return { pid: proc.pid };
  });
  electron.ipcMain.on("terminal:write", (_, id, data) => {
    sessions.get(id)?.write(data);
  });
  electron.ipcMain.on("terminal:resize", (_, id, cols, rows) => {
    sessions.get(id)?.resize(cols, rows);
  });
  electron.ipcMain.on("terminal:destroy", (_, id) => {
    sessions.get(id)?.kill();
    sessions.delete(id);
  });
}
const activeJobs = /* @__PURE__ */ new Map();
function registerPasswordTesterHandlers() {
  electron.ipcMain.handle("pt:runCrack", (event, opts) => {
    return new Promise((resolve, reject) => {
      const jobId = `crack_${Date.now()}`;
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      const scriptsDir = path.join(electron.app.getAppPath(), "scripts");
      const proc = child_process.spawn("python3", [
        path.join(scriptsDir, "password_tester.py"),
        JSON.stringify({ ...opts, jobId })
      ]);
      activeJobs.set(jobId, proc);
      let stdout = "";
      let stderr = "";
      proc.stdout.on("data", (data) => {
        const text = data.toString();
        stdout += text;
        try {
          const lines = text.trim().split("\n");
          for (const line of lines) {
            if (line.startsWith("PROGRESS:")) {
              win?.webContents.send("pt:progress", { jobId, ...JSON.parse(line.slice(9)) });
            }
          }
        } catch {
        }
      });
      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      proc.on("close", (code) => {
        activeJobs.delete(jobId);
        if (code === 0) {
          try {
            const lastLine = stdout.trim().split("\n").filter((l) => !l.startsWith("PROGRESS:")).pop() || "{}";
            resolve({ jobId, ...JSON.parse(lastLine) });
          } catch {
            resolve({ jobId, found: false, attempts: 0, elapsed: 0, error: "Failed to parse result" });
          }
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`));
        }
      });
      proc.on("error", (err) => {
        activeJobs.delete(jobId);
        reject(err);
      });
    });
  });
  electron.ipcMain.handle("pt:runNetwork", (event, opts) => {
    return new Promise((resolve, reject) => {
      const jobId = `net_${Date.now()}`;
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      const scriptsDir = path.join(electron.app.getAppPath(), "scripts");
      const proc = child_process.spawn("python3", [
        path.join(scriptsDir, "network_tester.py"),
        JSON.stringify({ ...opts, jobId })
      ]);
      activeJobs.set(jobId, proc);
      let stdout = "";
      let stderr = "";
      proc.stdout.on("data", (data) => {
        const text = data.toString();
        stdout += text;
        try {
          const lines = text.trim().split("\n");
          for (const line of lines) {
            if (line.startsWith("PROGRESS:")) {
              win?.webContents.send("pt:progress", { jobId, ...JSON.parse(line.slice(9)) });
            }
          }
        } catch {
        }
      });
      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      proc.on("close", (code) => {
        activeJobs.delete(jobId);
        if (code === 0) {
          try {
            const lastLine = stdout.trim().split("\n").filter((l) => !l.startsWith("PROGRESS:")).pop() || "{}";
            resolve({ jobId, ...JSON.parse(lastLine) });
          } catch {
            resolve({ jobId, found: false, attempts: 0, elapsed: 0, error: "Failed to parse result" });
          }
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`));
        }
      });
      proc.on("error", (err) => {
        activeJobs.delete(jobId);
        reject(err);
      });
    });
  });
  electron.ipcMain.on("pt:cancel", (_, jobId) => {
    const proc = activeJobs.get(jobId);
    if (proc) {
      proc.kill("SIGTERM");
      activeJobs.delete(jobId);
    }
  });
}
const encryptionKey = crypto.createHash("sha256").update(`cryogram-v1:${electron.app.getPath("userData")}`).digest("hex");
const store = new Store({
  encryptionKey,
  defaults: {
    hibpApiKey: "",
    dehashedEmail: "",
    dehashedApiKey: "",
    workspace: "",
    ptDisclaimerAccepted: null,
    "theme.preset": "cyber",
    "theme.accent": "#00d4ff",
    "theme.accent2": "#00ff88",
    "theme.bg": "#070b11",
    "opticseo.email": "",
    "opticseo.password": "",
    "opticseo.autoLogin": true
  }
});
function registerSettingsHandlers() {
  electron.ipcMain.handle("settings:get", (_, key) => store.get(key));
  electron.ipcMain.handle("settings:set", (_, key, value) => {
    store.set(key, value);
  });
  electron.ipcMain.handle("settings:getAll", () => store.store);
}
function sendNotification(title, body) {
  if (electron.Notification.isSupported()) {
    new electron.Notification({ title, body }).show();
  }
  electron.BrowserWindow.getAllWindows()[0]?.webContents.send("notification", { title, body });
}
let db;
function getDb() {
  if (!db) {
    const dbPath = path.join(electron.app.getPath("userData"), "leaker.db");
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS targets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        value TEXT NOT NULL UNIQUE,
        label TEXT,
        added_at TEXT DEFAULT (datetime('now')),
        last_checked TEXT
      );
      CREATE TABLE IF NOT EXISTS breaches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        target_id INTEGER NOT NULL,
        source TEXT NOT NULL,
        breach_name TEXT,
        breach_date TEXT,
        data_classes TEXT,
        description TEXT,
        raw TEXT,
        discovered_at TEXT DEFAULT (datetime('now')),
        UNIQUE(target_id, source, breach_name)
      );
    `);
  }
  return db;
}
async function checkHIBP(email, targetId) {
  const key = store.get("hibpApiKey");
  if (!key) return 0;
  try {
    const res = await axios.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`,
      {
        headers: { "hibp-api-key": key, "User-Agent": "Cryogram-Security-Tool" },
        params: { truncateResponse: false },
        timeout: 1e4
      }
    );
    const database = getDb();
    let newCount = 0;
    for (const breach of res.data) {
      const insert = database.prepare(`
        INSERT OR IGNORE INTO breaches (target_id, source, breach_name, breach_date, data_classes, description, raw)
        VALUES (?, 'hibp', ?, ?, ?, ?, ?)
      `);
      const result = insert.run(
        targetId,
        breach.Name,
        breach.BreachDate,
        JSON.stringify(breach.DataClasses),
        breach.Description,
        JSON.stringify(breach)
      );
      if (result.changes > 0) {
        newCount++;
        sendNotification("New Breach Detected", `${email} found in ${breach.Name} breach`);
      }
    }
    return newCount;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return 0;
    throw err;
  }
}
async function checkDehashed(value, type, targetId) {
  const email = store.get("dehashedEmail");
  const key = store.get("dehashedApiKey");
  if (!email || !key) return 0;
  const queryMap = {
    email: "email",
    domain: "domain",
    username: "username"
  };
  const field = queryMap[type] || "email";
  try {
    const res = await axios.get("https://api.dehashed.com/search", {
      params: { query: `${field}:${value}`, size: 100 },
      auth: { username: email, password: key },
      headers: { Accept: "application/json" },
      timeout: 15e3
    });
    const database = getDb();
    let newCount = 0;
    const entries = res.data?.entries || [];
    for (const entry of entries) {
      const insert = database.prepare(`
        INSERT OR IGNORE INTO breaches (target_id, source, breach_name, data_classes, raw)
        VALUES (?, 'dehashed', ?, ?, ?)
      `);
      const result = insert.run(
        targetId,
        entry.database_name || "unknown",
        JSON.stringify(["email", "password", "username"].filter((k) => entry[k])),
        JSON.stringify(entry)
      );
      if (result.changes > 0) newCount++;
    }
    return newCount;
  } catch {
    return 0;
  }
}
function registerLeakerHandlers() {
  electron.ipcMain.handle("leaker:addTarget", (_, target) => {
    const database = getDb();
    const stmt = database.prepare(
      "INSERT OR IGNORE INTO targets (type, value, label) VALUES (?, ?, ?)"
    );
    const result = stmt.run(target.type, target.value, target.label || target.value);
    return {
      id: Number(result.lastInsertRowid),
      type: target.type,
      value: target.value,
      label: target.label || target.value,
      added_at: (/* @__PURE__ */ new Date()).toISOString(),
      last_checked: null
    };
  });
  electron.ipcMain.handle("leaker:removeTarget", (_, id) => {
    const database = getDb();
    database.prepare("DELETE FROM targets WHERE id = ?").run(id);
    database.prepare("DELETE FROM breaches WHERE target_id = ?").run(id);
    return true;
  });
  electron.ipcMain.handle("leaker:getTargets", () => {
    const database = getDb();
    return database.prepare("SELECT * FROM targets ORDER BY added_at DESC").all();
  });
  electron.ipcMain.handle("leaker:getBreaches", (_, targetId) => {
    const database = getDb();
    if (targetId !== void 0) {
      return database.prepare(
        "SELECT * FROM breaches WHERE target_id = ? ORDER BY discovered_at DESC"
      ).all(targetId);
    }
    return database.prepare("SELECT * FROM breaches ORDER BY discovered_at DESC").all();
  });
  electron.ipcMain.handle("leaker:forceRefresh", async (_, targetId) => {
    const database = getDb();
    const targets = targetId !== void 0 ? database.prepare("SELECT * FROM targets WHERE id = ?").all(targetId) : database.prepare("SELECT * FROM targets").all();
    let totalNew = 0;
    for (const target of targets) {
      try {
        if (target.type === "email") {
          totalNew += await checkHIBP(target.value, target.id);
        }
        totalNew += await checkDehashed(target.value, target.type, target.id);
        database.prepare("UPDATE targets SET last_checked = datetime('now') WHERE id = ?").run(target.id);
      } catch {
      }
    }
    return { checked: targets.length, newBreaches: totalNew };
  });
}
function getWorkspacePath() {
  const saved = store.get("workspace");
  return saved || path.join(electron.app.getPath("documents"), "Cryogram", "workspace");
}
async function safeResolve(requestedPath) {
  const workspace = getWorkspacePath();
  const resolved = path.join(workspace, requestedPath.replace(workspace, ""));
  if (!resolved.startsWith(workspace)) throw new Error("Path outside workspace");
  return resolved;
}
function safeHome(requestedPath) {
  const home = os.homedir();
  if (requestedPath.startsWith("/media/") || requestedPath.startsWith("/mnt/")) {
    return requestedPath;
  }
  if (requestedPath.startsWith(home)) return requestedPath;
  const resolved = path.join(home, requestedPath);
  if (!resolved.startsWith(home)) throw new Error("Path outside home");
  return resolved;
}
function registerEditorHandlers() {
  electron.ipcMain.handle("fs:getWorkspace", () => getWorkspacePath());
  electron.ipcMain.handle("fs:readDir", async (_, dirPath) => {
    const resolved = dirPath === "__workspace__" ? getWorkspacePath() : await safeResolve(dirPath);
    const entries = await promises.readdir(resolved, { withFileTypes: true });
    return Promise.all(
      entries.map(async (e) => ({
        name: e.name,
        path: path.join(resolved, e.name),
        isDir: e.isDirectory(),
        ext: path.extname(e.name).slice(1)
      }))
    );
  });
  electron.ipcMain.handle("fs:readFile", async (_, filePath) => {
    const resolved = await safeResolve(filePath);
    return promises.readFile(resolved, "utf-8");
  });
  electron.ipcMain.handle("fs:writeFile", async (_, filePath, content) => {
    const resolved = await safeResolve(filePath);
    await promises.writeFile(resolved, content, "utf-8");
    return true;
  });
  electron.ipcMain.handle("fs:openDialog", async () => {
    const result = await electron.dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Select Workspace Folder"
    });
    if (!result.canceled && result.filePaths[0]) {
      store.set("workspace", result.filePaths[0]);
      return result.filePaths[0];
    }
    return null;
  });
  electron.ipcMain.handle("files:getHome", () => os.homedir());
  electron.ipcMain.handle("files:getDrives", async () => {
    const drives = [];
    for (const base of ["/media", "/mnt"]) {
      try {
        const users = await promises.readdir(base, { withFileTypes: true });
        for (const u of users) {
          if (!u.isDirectory()) continue;
          const sub = path.join(base, u.name);
          try {
            const mounts = await promises.readdir(sub, { withFileTypes: true });
            for (const m of mounts.filter((e) => e.isDirectory())) {
              drives.push({ path: path.join(sub, m.name), name: m.name, mounted: true });
            }
          } catch {
            drives.push({ path: sub, name: u.name, mounted: true });
          }
        }
      } catch {
      }
    }
    return drives;
  });
  electron.ipcMain.handle("files:readDir", async (_, dirPath) => {
    const resolved = safeHome(dirPath);
    const entries = await promises.readdir(resolved, { withFileTypes: true });
    const results = await Promise.all(
      entries.filter((e) => !e.name.startsWith(".")).map(async (e) => {
        const fullPath = path.join(resolved, e.name);
        try {
          const info = await promises.stat(fullPath);
          return {
            name: e.name,
            path: fullPath,
            isDir: e.isDirectory(),
            ext: path.extname(e.name).slice(1).toLowerCase(),
            size: info.size,
            modified: info.mtime.toISOString()
          };
        } catch {
          return { name: e.name, path: fullPath, isDir: e.isDirectory(), ext: "", size: 0, modified: "" };
        }
      })
    );
    return results.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  });
  electron.ipcMain.handle("files:stat", async (_, filePath) => {
    const resolved = safeHome(filePath);
    const info = await promises.stat(resolved);
    return { size: info.size, modified: info.mtime.toISOString(), isDir: info.isDirectory() };
  });
  electron.ipcMain.handle("files:readFile", async (_, filePath) => {
    const resolved = safeHome(filePath);
    return promises.readFile(resolved, "utf-8");
  });
  electron.ipcMain.handle("files:writeFile", async (_, filePath, content) => {
    const resolved = safeHome(filePath);
    await promises.writeFile(resolved, content, "utf-8");
    return true;
  });
  electron.ipcMain.handle("files:copy", async (_, src, dest) => {
    await promises.copyFile(safeHome(src), safeHome(dest));
    return true;
  });
  electron.ipcMain.handle("files:move", async (_, src, dest) => {
    await promises.rename(safeHome(src), safeHome(dest));
    return true;
  });
  electron.ipcMain.handle("files:delete", async (_, filePath) => {
    await promises.rm(safeHome(filePath), { recursive: true, force: true });
    return true;
  });
  electron.ipcMain.handle("files:mkdir", async (_, dirPath) => {
    await promises.mkdir(safeHome(dirPath), { recursive: true });
    return true;
  });
  electron.ipcMain.handle("files:rename", async (_, oldPath, newName) => {
    const resolved = safeHome(oldPath);
    const newPath = path.join(path.dirname(resolved), newName);
    await promises.rename(resolved, newPath);
    return newPath;
  });
  electron.ipcMain.handle("files:openExternal", async (_, filePath) => {
    await electron.shell.openPath(safeHome(filePath));
    return true;
  });
  electron.ipcMain.handle("files:openDialog", async (_, mode = "open") => {
    const props = mode === "folder" ? ["openDirectory"] : ["openFile", "multiSelections"];
    const result = await electron.dialog.showOpenDialog({ properties: props });
    return result.canceled ? null : result.filePaths;
  });
}
const execAsync = util.promisify(child_process.exec);
function sh$1(cmd) {
  return execAsync(cmd).then((r) => r.stdout.trim()).catch(() => "");
}
function registerSystemHandlers() {
  electron.ipcMain.handle("system:getNetworks", async () => {
    const out = await sh$1("nmcli -t -f SSID,SIGNAL,SECURITY,IN-USE dev wifi list 2>/dev/null");
    const seen = /* @__PURE__ */ new Set();
    return out.split("\n").filter(Boolean).map((line) => {
      const parts = line.split(":");
      return {
        ssid: parts[0] || "Hidden Network",
        signal: parseInt(parts[1]) || 0,
        security: parts[2] || "",
        active: parts[3] === "*"
      };
    }).filter((n) => {
      if (!n.ssid || seen.has(n.ssid)) return false;
      seen.add(n.ssid);
      return true;
    }).sort((a, b) => b.signal - a.signal);
  });
  electron.ipcMain.handle("system:getWifiStatus", async () => {
    const out = await sh$1("nmcli -t -f IN-USE,SSID,SIGNAL dev wifi list 2>/dev/null");
    const active = out.split("\n").find((l) => l.startsWith("*:"));
    if (!active) return { connected: false, ssid: "", signal: 0 };
    const parts = active.split(":");
    const ssid = parts.slice(1, -1).join(":");
    const signal = parseInt(parts[parts.length - 1]) || 0;
    return { connected: true, ssid, signal };
  });
  electron.ipcMain.handle("system:connectNetwork", async (_, ssid, password) => {
    const dev = await sh$1("nmcli -t -f DEVICE,TYPE dev 2>/dev/null | grep ':wifi' | head -1 | cut -d: -f1");
    const ifarg = dev ? `ifname "${dev}"` : "";
    const escapedSsid = ssid.replace(/"/g, '\\"');
    const escapedPwd = password?.replace(/"/g, '\\"') ?? "";
    const cmd = password ? `nmcli dev wifi connect "${escapedSsid}" password "${escapedPwd}" ${ifarg} 2>&1` : `nmcli dev wifi connect "${escapedSsid}" ${ifarg} 2>&1`;
    try {
      const { stdout } = await execAsync(cmd);
      const out = stdout.trim();
      const success = out.toLowerCase().includes("successfully") || out.toLowerCase().includes("activated");
      return { success, message: success ? "" : out || "Connection failed" };
    } catch (err) {
      const msg = (err.stdout ?? err.message ?? "Connection failed").trim();
      const lower = msg.toLowerCase();
      if (lower.includes("secrets") || lower.includes("password") || lower.includes("802-11") || lower.includes("wrong"))
        return { success: false, message: "Wrong password — please try again" };
      if (lower.includes("timeout"))
        return { success: false, message: "Connection timed out — check password and try again" };
      if (lower.includes("not found") || lower.includes("no network"))
        return { success: false, message: "Network not found — try scanning again" };
      return { success: false, message: msg || "Connection failed" };
    }
  });
  electron.ipcMain.handle("system:disconnectNetwork", async () => {
    await sh$1("nmcli dev disconnect $(nmcli -t -f DEVICE,TYPE dev | grep wifi | cut -d: -f1 | head -1) 2>/dev/null");
    return true;
  });
  electron.ipcMain.handle("system:rescanNetworks", async () => {
    await sh$1("nmcli dev wifi rescan 2>/dev/null");
    return true;
  });
  electron.ipcMain.handle("system:getBattery", async () => {
    try {
      const base = "/sys/class/power_supply";
      const entries = await sh$1(`ls ${base} 2>/dev/null`);
      const bat = entries.split("\n").find((b) => b.startsWith("BAT"));
      if (!bat) return null;
      const [capacity, status] = await Promise.all([
        promises.readFile(`${base}/${bat}/capacity`, "utf8").then((s) => parseInt(s.trim())),
        promises.readFile(`${base}/${bat}/status`, "utf8").then((s) => s.trim())
      ]);
      return { level: capacity, charging: status === "Charging", full: status === "Full", status };
    } catch {
      return null;
    }
  });
  electron.ipcMain.handle("system:getVolume", async () => {
    const vol = await sh$1("pactl get-sink-volume @DEFAULT_SINK@ 2>/dev/null");
    const mute = await sh$1("pactl get-sink-mute @DEFAULT_SINK@ 2>/dev/null");
    const match = vol.match(/(\d+)%/);
    return { level: match ? parseInt(match[1]) : 100, muted: mute.includes("yes") };
  });
  electron.ipcMain.handle("system:setVolume", async (_, level) => {
    await sh$1(`pactl set-sink-volume @DEFAULT_SINK@ ${Math.max(0, Math.min(150, level))}% 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("system:toggleMute", async () => {
    await sh$1("pactl set-sink-mute @DEFAULT_SINK@ toggle 2>/dev/null");
    return true;
  });
  electron.ipcMain.handle("system:getBrightness", async () => {
    const cur = await sh$1("brightnessctl get 2>/dev/null");
    const max = await sh$1("brightnessctl max 2>/dev/null");
    const c = parseInt(cur) || 100;
    const m = parseInt(max) || 100;
    return Math.round(c * 100 / m);
  });
  electron.ipcMain.handle("system:setBrightness", async (_, pct) => {
    await sh$1(`brightnessctl set ${Math.max(5, Math.min(100, pct))}% 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("system:getBluetoothDevices", async () => {
    const out = await sh$1("bluetoothctl devices 2>/dev/null");
    const connected = await sh$1("bluetoothctl info 2>/dev/null");
    return out.split("\n").filter(Boolean).map((line) => {
      const parts = line.replace("Device ", "").split(" ");
      const address = parts[0];
      const name = parts.slice(1).join(" ");
      return { address, name, connected: connected.includes(address) };
    }).filter((d) => d.address);
  });
  electron.ipcMain.handle("system:bluetoothConnect", async (_, address) => {
    const out = await sh$1(`bluetoothctl connect ${address} 2>&1`);
    return out.toLowerCase().includes("successful");
  });
  electron.ipcMain.handle("system:bluetoothDisconnect", async (_, address) => {
    await sh$1(`bluetoothctl disconnect ${address} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("system:bluetoothScan", async () => {
    sh$1("bluetoothctl scan on 2>/dev/null &");
    await new Promise((r) => setTimeout(r, 5e3));
    await sh$1("bluetoothctl scan off 2>/dev/null");
    return true;
  });
  electron.ipcMain.handle("system:getInfo", async () => {
    try {
      const [hostname, kernel, uptime] = await Promise.all([
        sh$1("hostname"),
        sh$1("uname -r"),
        sh$1("uptime -p")
      ]);
      const cpuInfo = await promises.readFile("/proc/cpuinfo", "utf8").catch(() => "");
      const cpuLine = cpuInfo.split("\n").find((l) => l.startsWith("model name"));
      const cpu = cpuLine ? cpuLine.split(":")[1].trim() : "Unknown CPU";
      const memInfo = await promises.readFile("/proc/meminfo", "utf8").catch(() => "");
      const getKb = (key) => {
        const l = memInfo.split("\n").find((l2) => l2.startsWith(key));
        return l ? parseInt(l.split(/\s+/)[1]) : 0;
      };
      const ramTotal = Math.round(getKb("MemTotal:") / 1024);
      const ramFree = Math.round(getKb("MemAvailable:") / 1024);
      return {
        hostname,
        os: "Cryogram OS 1.0",
        kernel,
        cpu,
        ramTotal,
        ramUsed: ramTotal - ramFree,
        uptime
      };
    } catch {
      return { hostname: "cryogram", os: "Cryogram OS 1.0", kernel: "Linux", cpu: "Unknown", ramTotal: 0, ramUsed: 0, uptime: "" };
    }
  });
  electron.ipcMain.handle("system:shutdown", async () => {
    await sh$1("sudo systemctl poweroff");
  });
  electron.ipcMain.handle("system:reboot", async () => {
    await sh$1("sudo systemctl reboot");
  });
  electron.ipcMain.handle("system:lock", async () => {
    electron.BrowserWindow.getAllWindows()[0]?.webContents.send("screen:lock");
    return true;
  });
  electron.ipcMain.handle("system:verifyPin", async (_, pin) => {
    const hash = store.get("pin.hash");
    if (!hash) return true;
    return crypto.createHash("sha256").update(String(pin)).digest("hex") === hash;
  });
  electron.ipcMain.handle("system:setPin", async (_, newPin, currentPin) => {
    const existing = store.get("pin.hash");
    if (existing && currentPin !== void 0) {
      const chk = crypto.createHash("sha256").update(String(currentPin)).digest("hex");
      if (chk !== existing) return { success: false, error: "Incorrect current PIN" };
    }
    if (!/^[0-9]{4,8}$/.test(newPin)) return { success: false, error: "PIN must be 4–8 digits" };
    store.set("pin.hash", crypto.createHash("sha256").update(newPin).digest("hex"));
    store.set("pin.enabled", true);
    return { success: true };
  });
  electron.ipcMain.handle("system:removePin", async (_, currentPin) => {
    const existing = store.get("pin.hash");
    if (existing) {
      const chk = crypto.createHash("sha256").update(String(currentPin)).digest("hex");
      if (chk !== existing) return { success: false, error: "Incorrect PIN" };
    }
    store.delete("pin.hash");
    store.set("pin.enabled", false);
    return { success: true };
  });
  electron.ipcMain.handle("system:setPinEnabled", async (_, enabled) => {
    store.set("pin.enabled", enabled);
    return true;
  });
  electron.ipcMain.handle("system:pickWallpaper", async (event) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    const result = await electron.dialog.showOpenDialog(win, {
      title: "Choose Wallpaper",
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff"] }],
      properties: ["openFile"]
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });
  electron.ipcMain.handle("system:setWallpaper", async (_, path2) => {
    const safe = path2.replace(/'/g, "'\\''");
    await sh$1(`feh --bg-scale '${safe}' 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("wm:getWindows", async () => {
    const out = await sh$1("wmctrl -l 2>/dev/null");
    if (!out) return [];
    return out.split("\n").filter(Boolean).map((line) => {
      const match = line.match(/^(0x\w+)\s+(-?\d+)\s+(\S+)\s+(.+)$/);
      if (!match) return null;
      return { id: match[1], desktop: parseInt(match[2]), title: match[4] };
    }).filter(Boolean);
  });
  electron.ipcMain.handle("wm:focusWindow", async (_, id) => {
    await sh$1(`wmctrl -ia ${id} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("wm:closeWindow", async (_, id) => {
    await sh$1(`wmctrl -ic ${id} 2>/dev/null`);
    return true;
  });
}
const APP_DIRS = [
  "/usr/share/applications",
  "/usr/local/share/applications",
  path.join(os.homedir(), ".local/share/applications")
];
const CATEGORY_MAP = {
  Security: "Security",
  Network: "Security",
  System: "System",
  Settings: "System",
  Utility: "System",
  Game: "Gaming",
  Development: "Development",
  IDE: "Development",
  TextEditor: "Development",
  Graphics: "Media",
  Audio: "Media",
  Video: "Media",
  Office: "Office"
};
async function resolveIconPath(name) {
  if (!name) return "";
  if (name.startsWith("/")) {
    try {
      await promises.access(name);
      return `file://${name}`;
    } catch {
      return "";
    }
  }
  const candidates = [
    `/usr/share/icons/hicolor/256x256/apps/${name}.png`,
    `/usr/share/icons/hicolor/128x128/apps/${name}.png`,
    `/usr/share/icons/hicolor/64x64/apps/${name}.png`,
    `/usr/share/icons/hicolor/48x48/apps/${name}.png`,
    `/usr/share/icons/hicolor/scalable/apps/${name}.svg`,
    `/usr/share/pixmaps/${name}.png`,
    `/usr/share/pixmaps/${name}.svg`,
    `/usr/share/pixmaps/${name}.xpm`,
    `/usr/share/icons/hicolor/32x32/apps/${name}.png`,
    `/usr/share/icons/Adwaita/256x256/apps/${name}.png`,
    `/usr/share/icons/Adwaita/48x48/apps/${name}.png`
  ];
  for (const p of candidates) {
    try {
      await promises.access(p);
      return `file://${p}`;
    } catch {
    }
  }
  return "";
}
async function parseDesktopFile(filePath) {
  try {
    const content = await promises.readFile(filePath, "utf8");
    const section = content.split("\n");
    const get = (key) => {
      const line = section.find((l) => l.startsWith(`${key}=`));
      return line ? line.slice(key.length + 1).trim() : "";
    };
    const type = get("Type");
    const noDisplay = get("NoDisplay");
    const onlyShowIn = get("OnlyShowIn");
    const name = get("Name");
    const exec = get("Exec");
    if (type !== "Application") return null;
    if (noDisplay === "true") return null;
    if (!name || !exec) return null;
    const rawCats = get("Categories").split(";").filter(Boolean);
    const category = rawCats.map((c) => CATEGORY_MAP[c]).find(Boolean) ?? "Other";
    return {
      name,
      exec: exec.replace(/%[uUfFdDnNickvm]/g, "").trim(),
      icon: await resolveIconPath(get("Icon")),
      comment: get("Comment") || get("GenericName"),
      categories: rawCats,
      category,
      desktopFile: filePath,
      terminal: get("Terminal") === "true"
    };
  } catch {
    return null;
  }
}
const launchedPids = /* @__PURE__ */ new Set();
function killLaunchedApps() {
  for (const pid of launchedPids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
    }
  }
  launchedPids.clear();
}
function registerLauncherHandlers() {
  electron.ipcMain.handle("launcher:getApps", async () => {
    const results = [];
    for (const dir of APP_DIRS) {
      try {
        const files = await promises.readdir(dir);
        const entries = await Promise.all(
          files.filter((f) => f.endsWith(".desktop")).map((f) => parseDesktopFile(path.join(dir, f)))
        );
        results.push(...entries.filter((e) => e !== null));
      } catch {
      }
    }
    const seen = /* @__PURE__ */ new Set();
    return results.filter((a) => {
      if (seen.has(a.name)) return false;
      seen.add(a.name);
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  });
  electron.ipcMain.handle("launcher:launch", async (_, app) => {
    try {
      const cmd = app.terminal ? `xfce4-terminal -e "${app.exec}"` : app.exec;
      const parts = cmd.split(" ");
      const proc = child_process.spawn(parts[0], parts.slice(1), {
        detached: true,
        stdio: "ignore",
        env: { ...process.env }
      });
      if (proc.pid) {
        launchedPids.add(proc.pid);
        proc.on("exit", () => launchedPids.delete(proc.pid));
      }
      proc.unref();
      return true;
    } catch {
      return false;
    }
  });
}
const sh = util.promisify(child_process.exec);
let scrcpyProc = null;
async function adb(serial, ...args) {
  const { stdout } = await sh(`adb -s '${serial}' ${args.join(" ")} 2>/dev/null`);
  return stdout.trim();
}
async function adbGlobal(...args) {
  const { stdout } = await sh(`adb ${args.join(" ")} 2>/dev/null`);
  return stdout.trim();
}
function registerPhoneHandlers() {
  electron.ipcMain.handle("phone:getDevices", async () => {
    try {
      const out = await adbGlobal("devices", "-l");
      const lines = out.split("\n").slice(1).filter((l) => l.trim() && !l.startsWith("*") && !l.startsWith("List"));
      const devices = lines.map((line) => {
        const serial = line.trim().split(/\s+/)[0];
        const status = line.trim().split(/\s+/)[1];
        const model = (line.match(/model:(\S+)/)?.[1] ?? "Unknown").replace(/_/g, " ");
        const product = line.match(/product:(\S+)/)?.[1] ?? "";
        const transport = line.match(/transport_id:(\d+)/)?.[1] ?? "";
        const isWifi = serial.includes(":");
        return { serial, status, model, product, transport, isWifi };
      }).filter((d) => d.serial && d.status === "device");
      return { ok: true, devices };
    } catch (e) {
      return { ok: false, error: e.message, devices: [] };
    }
  });
  electron.ipcMain.handle("phone:getInfo", async (_, serial) => {
    const prop = async (key) => {
      try {
        return await adb(serial, `shell getprop ${key}`);
      } catch {
        return "";
      }
    };
    const [model, brand, android, sdk, cpuAbi, screenSize] = await Promise.all([
      prop("ro.product.model"),
      prop("ro.product.brand"),
      prop("ro.build.version.release"),
      prop("ro.build.version.sdk"),
      prop("ro.product.cpu.abi"),
      (async () => {
        try {
          const out = await adb(serial, "shell wm size");
          return out.match(/Physical size: (\S+)/)?.[1] ?? "";
        } catch {
          return "";
        }
      })()
    ]);
    return { model, brand, android, sdk, cpuAbi, screenSize };
  });
  electron.ipcMain.handle("phone:getBattery", async (_, serial) => {
    try {
      const out = await adb(serial, "shell dumpsys battery");
      const level = parseInt(out.match(/level: (\d+)/)?.[1] ?? "0");
      const status = out.match(/status: (\d+)/)?.[1];
      const voltage = parseInt(out.match(/voltage: (\d+)/)?.[1] ?? "0");
      const temp = parseInt(out.match(/temperature: (\d+)/)?.[1] ?? "0");
      const charging = status === "2" || status === "5";
      const plugged = out.match(/plugged: (\d+)/)?.[1] !== "0";
      return { level, charging, plugged, voltage: voltage / 1e3, temp: temp / 10 };
    } catch {
      return { level: 0, charging: false, plugged: false, voltage: 0, temp: 0 };
    }
  });
  electron.ipcMain.handle("phone:getStorage", async (_, serial) => {
    try {
      const out = await adb(serial, "shell df /storage/emulated/0");
      const row = out.trim().split("\n").pop()?.trim().split(/\s+/) ?? [];
      const total = parseInt(row[1] ?? "0") * 1024;
      const used = parseInt(row[2] ?? "0") * 1024;
      const free = parseInt(row[3] ?? "0") * 1024;
      return { total, used, free };
    } catch {
      return { total: 0, used: 0, free: 0 };
    }
  });
  electron.ipcMain.handle("phone:checkScrcpy", async () => {
    try {
      const { stdout } = await sh("scrcpy --version 2>&1");
      const version = stdout.match(/scrcpy\s+(\S+)/)?.[1] ?? "unknown";
      return { installed: true, version };
    } catch {
      return { installed: false, version: null };
    }
  });
  electron.ipcMain.handle("phone:installScrcpy", async () => {
    try {
      await sh("apt-get install -y scrcpy 2>&1 || snap install scrcpy 2>&1");
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
  electron.ipcMain.handle("phone:startMirror", async (_, serial) => {
    if (scrcpyProc) {
      scrcpyProc.kill();
      scrcpyProc = null;
    }
    try {
      scrcpyProc = child_process.spawn("scrcpy", [
        "-s",
        serial,
        "--video-bit-rate",
        "4M",
        "--max-fps",
        "60",
        "--window-title",
        "Phone — Cryogram",
        "--shortcut-mod",
        "lctrl,rctrl"
      ], { detached: false });
      scrcpyProc.on("exit", () => {
        scrcpyProc = null;
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
  electron.ipcMain.handle("phone:stopMirror", async () => {
    if (scrcpyProc) {
      scrcpyProc.kill();
      scrcpyProc = null;
    }
    return { ok: true };
  });
  electron.ipcMain.handle("phone:isMirroring", async () => ({ active: !!scrcpyProc }));
  electron.ipcMain.handle("phone:enableWireless", async (_, serial, port = 5555) => {
    try {
      const result = await sh(`adb -s '${serial}' tcpip ${port} 2>&1`);
      return { ok: true, message: result.stdout.trim() };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
  electron.ipcMain.handle("phone:connectWifi", async (_, ip, port = 5555) => {
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const { stdout } = await sh(`adb connect ${ip}:${port} 2>&1`);
      const ok = stdout.toLowerCase().includes("connected");
      return { ok, message: stdout.trim() };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
  electron.ipcMain.handle("phone:disconnect", async (_, address) => {
    try {
      const { stdout } = await sh(`adb disconnect '${address}' 2>&1`);
      return { ok: true, message: stdout.trim() };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
  electron.ipcMain.handle("phone:getDeviceIp", async (_, serial) => {
    try {
      const out = await adb(serial, "shell ip route show");
      const ip = out.match(/src\s+(\d+\.\d+\.\d+\.\d+)/)?.[1];
      if (ip) return { ok: true, ip };
      const wlan = await adb(serial, "shell ip addr show wlan0");
      const wlanIp = wlan.match(/inet (\d+\.\d+\.\d+\.\d+)/)?.[1];
      return { ok: !!wlanIp, ip: wlanIp ?? null };
    } catch (e) {
      return { ok: false, ip: null };
    }
  });
  electron.ipcMain.handle("phone:screenshot", async (_, serial) => {
    try {
      const dest = path.join(os.homedir(), `Pictures/phone-screenshot-${Date.now()}.png`);
      await sh(`adb -s '${serial}' exec-out screencap -p > '${dest}' 2>/dev/null`);
      return { ok: true, path: dest };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
}
let mainWindow = null;
function lockScreen() {
  if (!mainWindow) return;
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.focus();
  mainWindow.moveTop();
  mainWindow.webContents.send("screen:lock");
}
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#070b11",
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    },
    icon: path.join(__dirname, "../../resources/icon.png")
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.maximize();
    mainWindow.on("restore", () => mainWindow?.maximize());
    electron.globalShortcut.register("Super+D", () => {
    });
    electron.globalShortcut.register("Super+Tab", () => {
    });
    electron.globalShortcut.register("Super+L", () => {
      lockScreen();
    });
    electron.globalShortcut.register("CommandOrControl+Alt+T", () => {
      mainWindow?.webContents.send("open:app", "terminal");
    });
    let _vol = -1;
    const readVolAndSend = () => {
      child_process.exec("pactl get-sink-volume @DEFAULT_SINK@", (err, volOut) => {
        if (err || !volOut) return;
        const match = volOut.match(/(\d+)%/);
        if (!match) return;
        _vol = Math.min(100, parseInt(match[1]));
        child_process.exec("pactl get-sink-mute @DEFAULT_SINK@", (_, muteOut) => {
          mainWindow?.webContents.send("hud:volume", { level: _vol, muted: muteOut?.includes("yes") ?? false });
        });
      });
    };
    const sendVolOptimistic = (delta) => {
      if (_vol >= 0) {
        _vol = Math.max(0, Math.min(100, _vol + delta));
        mainWindow?.webContents.send("hud:volume", { level: _vol, muted: false });
      }
      setTimeout(readVolAndSend, 300);
    };
    electron.globalShortcut.register("VolumeUp", () => {
      child_process.exec("pactl set-sink-volume @DEFAULT_SINK@ +5%");
      sendVolOptimistic(5);
    });
    electron.globalShortcut.register("VolumeDown", () => {
      child_process.exec("pactl set-sink-volume @DEFAULT_SINK@ -5%");
      sendVolOptimistic(-5);
    });
    electron.globalShortcut.register("VolumeMute", () => {
      child_process.exec("pactl set-sink-mute @DEFAULT_SINK@ toggle");
      setTimeout(readVolAndSend, 300);
    });
    electron.globalShortcut.register("Alt+Tab", () => {
      mainWindow?.webContents.send("app:switcher", "next");
    });
    electron.globalShortcut.register("Alt+Shift+Tab", () => {
      mainWindow?.webContents.send("app:switcher", "prev");
    });
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    electron.shell.openExternal(url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.cryogram.app");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("window:minimize", () => mainWindow?.minimize());
  electron.ipcMain.on("window:maximize", () => {
    if (mainWindow?.isMaximized()) mainWindow.unmaximize();
    else mainWindow?.maximize();
  });
  electron.ipcMain.on("window:close", () => mainWindow?.close());
  electron.ipcMain.on("screen:unlock", () => {
    mainWindow?.setAlwaysOnTop(false);
  });
  registerTerminalHandlers();
  registerPasswordTesterHandlers();
  registerLeakerHandlers();
  registerEditorHandlers();
  registerSettingsHandlers();
  registerSystemHandlers();
  registerLauncherHandlers();
  registerPhoneHandlers();
  createWindow();
  electron.powerMonitor.on("resume", () => lockScreen());
  electron.powerMonitor.on("lock-screen", () => lockScreen());
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("before-quit", () => {
  electron.globalShortcut.unregisterAll();
  killLaunchedApps();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
