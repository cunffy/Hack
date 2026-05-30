"use strict";
const electron = require("electron");
const path = require("path");
const child_process = require("child_process");
const fs$1 = require("fs");
const utils = require("@electron-toolkit/utils");
const pty = require("node-pty");
const os = require("os");
const axios = require("axios");
const Database$1 = require("better-sqlite3");
const Store = require("electron-store");
const crypto = require("crypto");
const fs = require("fs/promises");
const util = require("util");
const tls = require("tls");
const http = require("http");
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
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const pty__namespace = /* @__PURE__ */ _interopNamespaceDefault(pty);
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
const crypto__namespace = /* @__PURE__ */ _interopNamespaceDefault(crypto);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const tls__namespace = /* @__PURE__ */ _interopNamespaceDefault(tls);
const sessions$1 = /* @__PURE__ */ new Map();
function registerTerminalHandlers() {
  electron.ipcMain.handle("terminal:create", (event, id, cols, rows) => {
    const shell = os.platform() === "win32" ? "powershell.exe" : process.env.SHELL || "/bin/bash";
    const proc2 = pty__namespace.spawn(shell, [], {
      name: "xterm-256color",
      cols,
      rows,
      cwd: process.env.HOME || process.cwd(),
      env: { ...process.env, TERM: "xterm-256color" }
    });
    sessions$1.set(id, proc2);
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    proc2.onData((data) => {
      win?.webContents.send(`terminal:data:${id}`, data);
    });
    proc2.onExit(() => {
      sessions$1.delete(id);
      win?.webContents.send(`terminal:data:${id}`, "\r\n[Process exited]\r\n");
    });
    return { pid: proc2.pid };
  });
  electron.ipcMain.on("terminal:write", (_, id, data) => {
    sessions$1.get(id)?.write(data);
  });
  electron.ipcMain.on("terminal:resize", (_, id, cols, rows) => {
    sessions$1.get(id)?.resize(cols, rows);
  });
  electron.ipcMain.on("terminal:destroy", (_, id) => {
    sessions$1.get(id)?.kill();
    sessions$1.delete(id);
  });
}
const activeJobs = /* @__PURE__ */ new Map();
function registerPasswordTesterHandlers() {
  electron.ipcMain.handle("pt:runCrack", (event, opts) => {
    return new Promise((resolve, reject) => {
      const jobId = `crack_${Date.now()}`;
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      const scriptsDir = path.join(electron.app.getAppPath(), "scripts");
      const proc2 = child_process.spawn("python3", [
        path.join(scriptsDir, "password_tester.py"),
        JSON.stringify({ ...opts, jobId })
      ]);
      activeJobs.set(jobId, proc2);
      let stdout = "";
      let stderr = "";
      proc2.stdout.on("data", (data) => {
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
      proc2.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      proc2.on("close", (code) => {
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
      proc2.on("error", (err) => {
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
      const proc2 = child_process.spawn("python3", [
        path.join(scriptsDir, "network_tester.py"),
        JSON.stringify({ ...opts, jobId })
      ]);
      activeJobs.set(jobId, proc2);
      let stdout = "";
      let stderr = "";
      proc2.stdout.on("data", (data) => {
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
      proc2.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      proc2.on("close", (code) => {
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
      proc2.on("error", (err) => {
        activeJobs.delete(jobId);
        reject(err);
      });
    });
  });
  electron.ipcMain.on("pt:cancel", (_, jobId) => {
    const proc2 = activeJobs.get(jobId);
    if (proc2) {
      proc2.kill("SIGTERM");
      activeJobs.delete(jobId);
    }
  });
}
let _store = null;
function getStore() {
  if (!_store) {
    const encryptionKey = crypto.createHash("sha256").update("cryogram-v1-stable").digest("hex");
    _store = new Store({
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
  }
  return _store;
}
function registerSettingsHandlers() {
  electron.ipcMain.handle("settings:get", (_, key) => getStore().get(key));
  electron.ipcMain.handle("settings:set", (_, key, value) => {
    getStore().set(key, value);
  });
  electron.ipcMain.handle("settings:getAll", () => getStore().store);
}
function getSettingsStore() {
  return getStore();
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
    db = new Database$1(dbPath);
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
  const key = getSettingsStore().get("hibpApiKey");
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
  const email = getSettingsStore().get("dehashedEmail");
  const key = getSettingsStore().get("dehashedApiKey");
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
  const saved = getSettingsStore().get("workspace");
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
    const entries = await fs.readdir(resolved, { withFileTypes: true });
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
    return fs.readFile(resolved, "utf-8");
  });
  electron.ipcMain.handle("fs:writeFile", async (_, filePath, content) => {
    const resolved = await safeResolve(filePath);
    await fs.writeFile(resolved, content, "utf-8");
    return true;
  });
  electron.ipcMain.handle("fs:openDialog", async () => {
    const result = await electron.dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Select Workspace Folder"
    });
    if (!result.canceled && result.filePaths[0]) {
      getSettingsStore().set("workspace", result.filePaths[0]);
      return result.filePaths[0];
    }
    return null;
  });
  electron.ipcMain.handle("files:getHome", () => os.homedir());
  electron.ipcMain.handle("files:getDrives", async () => {
    const drives = [];
    for (const base of ["/media", "/mnt"]) {
      try {
        const users = await fs.readdir(base, { withFileTypes: true });
        for (const u of users) {
          if (!u.isDirectory()) continue;
          const sub = path.join(base, u.name);
          try {
            const mounts = await fs.readdir(sub, { withFileTypes: true });
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
    const entries = await fs.readdir(resolved, { withFileTypes: true });
    const results = await Promise.all(
      entries.filter((e) => !e.name.startsWith(".")).map(async (e) => {
        const fullPath = path.join(resolved, e.name);
        try {
          const info = await fs.stat(fullPath);
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
    const info = await fs.stat(resolved);
    return { size: info.size, modified: info.mtime.toISOString(), isDir: info.isDirectory() };
  });
  electron.ipcMain.handle("files:readFile", async (_, filePath) => {
    const resolved = safeHome(filePath);
    return fs.readFile(resolved, "utf-8");
  });
  electron.ipcMain.handle("files:writeFile", async (_, filePath, content) => {
    const resolved = safeHome(filePath);
    await fs.writeFile(resolved, content, "utf-8");
    return true;
  });
  electron.ipcMain.handle("files:copy", async (_, src, dest) => {
    await fs.copyFile(safeHome(src), safeHome(dest));
    return true;
  });
  electron.ipcMain.handle("files:move", async (_, src, dest) => {
    await fs.rename(safeHome(src), safeHome(dest));
    return true;
  });
  electron.ipcMain.handle("files:delete", async (_, filePath) => {
    await fs.rm(safeHome(filePath), { recursive: true, force: true });
    return true;
  });
  electron.ipcMain.handle("files:mkdir", async (_, dirPath) => {
    await fs.mkdir(safeHome(dirPath), { recursive: true });
    return true;
  });
  electron.ipcMain.handle("files:rename", async (_, oldPath, newName) => {
    const resolved = safeHome(oldPath);
    const newPath = path.join(path.dirname(resolved), newName);
    await fs.rename(resolved, newPath);
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
const execAsync$8 = util.promisify(child_process.exec);
function sh$6(cmd) {
  return execAsync$8(cmd).then((r) => r.stdout.trim()).catch(() => "");
}
function registerSystemHandlers() {
  electron.ipcMain.handle("system:getNetworks", async () => {
    const out = await sh$6("nmcli -t -f SSID,SIGNAL,SECURITY,IN-USE dev wifi list 2>/dev/null");
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
    const out = await sh$6("nmcli -t -f IN-USE,SSID,SIGNAL dev wifi list 2>/dev/null");
    const active = out.split("\n").find((l) => l.startsWith("*:"));
    if (!active) return { connected: false, ssid: "", signal: 0 };
    const parts = active.split(":");
    const ssid = parts.slice(1, -1).join(":");
    const signal = parseInt(parts[parts.length - 1]) || 0;
    return { connected: true, ssid, signal };
  });
  electron.ipcMain.handle("system:connectNetwork", async (_, ssid, password) => {
    const dev = await sh$6("nmcli -t -f DEVICE,TYPE dev 2>/dev/null | grep ':wifi' | head -1 | cut -d: -f1");
    const ifarg = dev ? `ifname "${dev}"` : "";
    const escapedSsid = ssid.replace(/"/g, '\\"');
    const escapedPwd = password?.replace(/"/g, '\\"') ?? "";
    const cmd = password ? `nmcli dev wifi connect "${escapedSsid}" password "${escapedPwd}" ${ifarg} 2>&1` : `nmcli dev wifi connect "${escapedSsid}" ${ifarg} 2>&1`;
    try {
      const { stdout } = await execAsync$8(cmd);
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
    await sh$6("nmcli dev disconnect $(nmcli -t -f DEVICE,TYPE dev | grep wifi | cut -d: -f1 | head -1) 2>/dev/null");
    return true;
  });
  electron.ipcMain.handle("system:rescanNetworks", async () => {
    await sh$6("nmcli dev wifi rescan 2>/dev/null");
    return true;
  });
  electron.ipcMain.handle("system:getBattery", async () => {
    try {
      const base = "/sys/class/power_supply";
      const entries = await sh$6(`ls ${base} 2>/dev/null`);
      const bat = entries.split("\n").find((b) => b.startsWith("BAT"));
      if (!bat) return null;
      const [capacity, status] = await Promise.all([
        fs.readFile(`${base}/${bat}/capacity`, "utf8").then((s) => parseInt(s.trim())),
        fs.readFile(`${base}/${bat}/status`, "utf8").then((s) => s.trim())
      ]);
      return { level: capacity, charging: status === "Charging", full: status === "Full", status };
    } catch {
      return null;
    }
  });
  electron.ipcMain.handle("system:getVolume", async () => {
    const vol = await sh$6("pactl get-sink-volume @DEFAULT_SINK@ 2>/dev/null");
    const mute = await sh$6("pactl get-sink-mute @DEFAULT_SINK@ 2>/dev/null");
    const match = vol.match(/(\d+)%/);
    return { level: match ? parseInt(match[1]) : 100, muted: mute.includes("yes") };
  });
  electron.ipcMain.handle("system:setVolume", async (_, level) => {
    await sh$6(`pactl set-sink-volume @DEFAULT_SINK@ ${Math.max(0, Math.min(150, level))}% 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("system:toggleMute", async () => {
    await sh$6("pactl set-sink-mute @DEFAULT_SINK@ toggle 2>/dev/null");
    return true;
  });
  electron.ipcMain.handle("system:getBrightness", async () => {
    const cur = await sh$6("brightnessctl get 2>/dev/null");
    const max = await sh$6("brightnessctl max 2>/dev/null");
    const c = parseInt(cur) || 100;
    const m = parseInt(max) || 100;
    return Math.round(c * 100 / m);
  });
  electron.ipcMain.handle("system:setBrightness", async (_, pct) => {
    await sh$6(`brightnessctl set ${Math.max(5, Math.min(100, pct))}% 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("system:getBluetoothDevices", async () => {
    const out = await sh$6("bluetoothctl devices 2>/dev/null");
    const connected = await sh$6("bluetoothctl info 2>/dev/null");
    return out.split("\n").filter(Boolean).map((line) => {
      const parts = line.replace("Device ", "").split(" ");
      const address = parts[0];
      const name = parts.slice(1).join(" ");
      return { address, name, connected: connected.includes(address) };
    }).filter((d) => d.address);
  });
  electron.ipcMain.handle("system:bluetoothConnect", async (_, address) => {
    const out = await sh$6(`bluetoothctl connect ${address} 2>&1`);
    return out.toLowerCase().includes("successful");
  });
  electron.ipcMain.handle("system:bluetoothDisconnect", async (_, address) => {
    await sh$6(`bluetoothctl disconnect ${address} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("system:bluetoothScan", async () => {
    sh$6("bluetoothctl scan on 2>/dev/null &");
    await new Promise((r) => setTimeout(r, 5e3));
    await sh$6("bluetoothctl scan off 2>/dev/null");
    return true;
  });
  electron.ipcMain.handle("system:getInfo", async () => {
    try {
      const [hostname, kernel, uptime] = await Promise.all([
        sh$6("hostname"),
        sh$6("uname -r"),
        sh$6("uptime -p")
      ]);
      const cpuInfo = await fs.readFile("/proc/cpuinfo", "utf8").catch(() => "");
      const cpuLine = cpuInfo.split("\n").find((l) => l.startsWith("model name"));
      const cpu = cpuLine ? cpuLine.split(":")[1].trim() : "Unknown CPU";
      const memInfo = await fs.readFile("/proc/meminfo", "utf8").catch(() => "");
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
  electron.ipcMain.handle("system:syncTime", async () => {
    try {
      await sh$6("chronyc makestep 2>/dev/null || timedatectl set-ntp true");
      return { success: true };
    } catch {
      return { success: false };
    }
  });
  electron.ipcMain.handle("system:shutdown", async () => {
    await sh$6("sudo systemctl poweroff");
  });
  electron.ipcMain.handle("system:reboot", async () => {
    await sh$6("sudo systemctl reboot");
  });
  electron.ipcMain.handle("system:sleep", async () => {
    await sh$6("sudo systemctl suspend");
  });
  electron.ipcMain.handle("system:lock", async () => {
    electron.BrowserWindow.getAllWindows()[0]?.webContents.send("screen:lock");
    return true;
  });
  electron.ipcMain.handle("system:verifyPin", async (_, pin) => {
    const hash = getSettingsStore().get("pin.hash");
    if (!hash) return true;
    return crypto.createHash("sha256").update(String(pin)).digest("hex") === hash;
  });
  electron.ipcMain.handle("system:setPin", async (_, newPin, currentPin) => {
    const existing = getSettingsStore().get("pin.hash");
    if (existing && currentPin !== void 0) {
      const chk = crypto.createHash("sha256").update(String(currentPin)).digest("hex");
      if (chk !== existing) return { success: false, error: "Incorrect current PIN" };
    }
    if (!/^[0-9]{4,8}$/.test(newPin)) return { success: false, error: "PIN must be 4–8 digits" };
    getSettingsStore().set("pin.hash", crypto.createHash("sha256").update(newPin).digest("hex"));
    getSettingsStore().set("pin.enabled", true);
    return { success: true };
  });
  electron.ipcMain.handle("system:removePin", async (_, currentPin) => {
    const existing = getSettingsStore().get("pin.hash");
    if (existing) {
      const chk = crypto.createHash("sha256").update(String(currentPin)).digest("hex");
      if (chk !== existing) return { success: false, error: "Incorrect PIN" };
    }
    getSettingsStore().delete("pin.hash");
    getSettingsStore().set("pin.enabled", false);
    return { success: true };
  });
  electron.ipcMain.handle("system:setPinEnabled", async (_, enabled) => {
    getSettingsStore().set("pin.enabled", enabled);
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
    await sh$6(`feh --bg-scale '${safe}' 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("wm:getWindows", async () => {
    const out = await sh$6("wmctrl -l 2>/dev/null");
    if (!out) return [];
    return out.split("\n").filter(Boolean).map((line) => {
      const match = line.match(/^(0x\w+)\s+(-?\d+)\s+(\S+)\s+(.+)$/);
      if (!match) return null;
      return { id: match[1], desktop: parseInt(match[2]), title: match[4] };
    }).filter(Boolean);
  });
  electron.ipcMain.handle("wm:focusWindow", async (_, id) => {
    await sh$6(`wmctrl -ia ${id} 2>/dev/null`);
    await sh$6(`xdotool getactivewindow windowraise 2>/dev/null || true`);
    const electronId = await sh$6(`xdotool search --name "Cryogram" 2>/dev/null | head -1`);
    if (electronId.trim()) await sh$6(`xdotool windowlower ${electronId.trim()} 2>/dev/null || true`);
    return true;
  });
  electron.ipcMain.handle("wm:closeWindow", async (_, id) => {
    await sh$6(`wmctrl -ic ${id} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("wm:getCurrentWorkspace", async () => {
    const out = await sh$6("wmctrl -d 2>/dev/null");
    const active = out.split("\n").find((l) => l.includes("*"));
    return active ? parseInt(active.split(/\s+/)[0]) : 0;
  });
  electron.ipcMain.handle("wm:switchWorkspace", async (_, n) => {
    await sh$6(`wmctrl -s ${n} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("wm:getWorkspaceCount", async () => {
    const out = await sh$6("wmctrl -d 2>/dev/null");
    return out.split("\n").filter(Boolean).length || 1;
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
      await fs.access(name);
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
      await fs.access(p);
      return `file://${p}`;
    } catch {
    }
  }
  return "";
}
async function parseDesktopFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
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
        const files = await fs.readdir(dir);
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
      const desktopId = app.desktopFile.split("/").pop()?.replace(/\.desktop$/, "") ?? "";
      let proc2 = null;
      if (desktopId) {
        proc2 = child_process.spawn("gtk-launch", [desktopId], {
          detached: true,
          stdio: "ignore",
          env: { ...process.env, DISPLAY: process.env["DISPLAY"] || ":0" }
        });
      } else if (app.terminal) {
        const terms = ["x-terminal-emulator", "xfce4-terminal", "gnome-terminal", "konsole", "xterm"];
        const term = terms[0];
        proc2 = child_process.spawn(term, ["-e", app.exec], {
          detached: true,
          stdio: "ignore",
          env: { ...process.env, DISPLAY: process.env["DISPLAY"] || ":0" }
        });
      } else {
        const parts = app.exec.split(" ");
        proc2 = child_process.spawn(parts[0], parts.slice(1), {
          detached: true,
          stdio: "ignore",
          env: { ...process.env, DISPLAY: process.env["DISPLAY"] || ":0" }
        });
      }
      if (proc2?.pid) {
        launchedPids.add(proc2.pid);
        proc2.on("exit", () => launchedPids.delete(proc2.pid));
      }
      proc2?.unref();
      return true;
    } catch {
      return false;
    }
  });
}
const sh$5 = util.promisify(child_process.exec);
let scrcpyProc = null;
async function adb(serial, ...args) {
  const { stdout } = await sh$5(`adb -s ${JSON.stringify(serial)} ${args.join(" ")} 2>/dev/null`);
  return stdout.trim();
}
async function adbGlobal(...args) {
  const { stdout } = await sh$5(`adb ${args.join(" ")} 2>/dev/null`);
  return stdout.trim();
}
function registerPhoneHandlers() {
  electron.ipcMain.handle("phone:getDevices", async () => {
    try {
      const out = await adbGlobal("devices", "-l");
      const lines = out.split("\n").slice(1).filter((l) => l.trim() && !l.startsWith("*") && !l.startsWith("List"));
      const devices = lines.map((line) => {
        const parts = line.trim().split(/\s+/);
        const serial = parts[0];
        const status = parts[1];
        const model = (line.match(/model:(\S+)/)?.[1] ?? "Unknown").replace(/_/g, " ");
        const isWifi = serial.includes(":");
        return { serial, status, model, transport: isWifi ? "wifi" : "usb" };
      }).filter((d) => d.serial && d.status === "device");
      return devices;
    } catch {
      return [];
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
    const [model, brand, androidVersion, sdk, cpu, screenSize] = await Promise.all([
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
    return { model, brand, androidVersion, sdk, cpu, screenSize };
  });
  electron.ipcMain.handle("phone:getBattery", async (_, serial) => {
    try {
      const out = await adb(serial, "shell dumpsys battery");
      const level = parseInt(out.match(/level: (\d+)/)?.[1] ?? "0");
      const status = out.match(/status: (\d+)/)?.[1];
      const voltage = parseInt(out.match(/voltage: (\d+)/)?.[1] ?? "0");
      const rawTemp = parseInt(out.match(/temperature: (\d+)/)?.[1] ?? "0");
      const charging = status === "2" || status === "5";
      const plugged = out.match(/plugged: (\d+)/)?.[1] !== "0";
      return { level, charging, plugged, voltage: voltage / 1e3, temperature: rawTemp / 10 };
    } catch {
      return { level: 0, charging: false, plugged: false, voltage: 0, temperature: 0 };
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
      const { stdout } = await sh$5("scrcpy --version 2>&1");
      const version = stdout.match(/scrcpy\s+(\S+)/)?.[1] ?? "unknown";
      return { installed: true, version };
    } catch {
      return { installed: false, version: null };
    }
  });
  electron.ipcMain.handle("phone:installScrcpy", async () => {
    try {
      await sh$5("apt-get install -y scrcpy 2>&1 || snap install scrcpy 2>&1");
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
        "Phone — CyberDen",
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
  electron.ipcMain.handle("phone:isMirroring", async () => !!scrcpyProc);
  electron.ipcMain.handle("phone:enableWireless", async (_, serial, port = 5555) => {
    try {
      await sh$5(`adb -s ${JSON.stringify(serial)} tcpip ${port} 2>&1`);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
  electron.ipcMain.handle("phone:connectWifi", async (_, ip, port = 5555) => {
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const { stdout } = await sh$5(`adb connect ${ip}:${port} 2>&1`);
      const ok = stdout.toLowerCase().includes("connected");
      return { ok, message: stdout.trim() };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  });
  electron.ipcMain.handle("phone:disconnect", async (_, address) => {
    try {
      const { stdout } = await sh$5(`adb disconnect ${JSON.stringify(address)} 2>&1`);
      return { ok: true, message: stdout.trim() };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  });
  electron.ipcMain.handle("phone:getDeviceIp", async (_, serial) => {
    try {
      const out = await adb(serial, "shell ip route show");
      const ip = out.match(/src\s+(\d+\.\d+\.\d+\.\d+)/)?.[1];
      if (ip) return ip;
      const wlan = await adb(serial, "shell ip addr show wlan0");
      return wlan.match(/inet (\d+\.\d+\.\d+\.\d+)/)?.[1] ?? null;
    } catch {
      return null;
    }
  });
  electron.ipcMain.handle("phone:screenshot", async (_, serial) => {
    try {
      const dest = path.join(os.homedir(), `Pictures/phone-screenshot-${Date.now()}.png`);
      await sh$5(`adb -s ${JSON.stringify(serial)} exec-out screencap -p > ${JSON.stringify(dest)} 2>/dev/null`);
      return { ok: true, path: dest };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
}
const execFileP = util.promisify(child_process.execFile);
const UPDATE_SCRIPT = "/usr/local/bin/cryogram-update";
const SRC_CANDIDATES = ["/opt/cryogram-src", "/opt/cryogram"];
function findSrcDir() {
  for (const dir of SRC_CANDIDATES) {
    if (fs$1.existsSync(`${dir}/.git`)) return dir;
  }
  return null;
}
function readConf() {
  try {
    const conf = fs$1.readFileSync("/etc/cryogram/update.conf", "utf8");
    const repoUrl = conf.match(/REPO_URL="([^"]+)"/)?.[1] ?? "";
    const branch = conf.match(/BRANCH="([^"]+)"/)?.[1] ?? "main";
    return { repoUrl, branch };
  } catch {
    return { repoUrl: "", branch: "main" };
  }
}
function isRoot() {
  try {
    return process.getuid?.() === 0;
  } catch {
    return false;
  }
}
function registerUpdaterHandlers() {
  electron.ipcMain.handle("updater:check", async () => {
    const srcDir = findSrcDir();
    if (!srcDir) {
      return {
        hasUpdate: false,
        error: "no-source-dir",
        message: "Source directory not found. Run sudo cryogram-update once from a terminal to set up automatic updates."
      };
    }
    const { branch } = readConf();
    for (const dir of SRC_CANDIDATES) {
      await execFileP("git", ["config", "--global", "--add", "safe.directory", dir]).catch(() => {
      });
    }
    try {
      const { stdout: remoteOut } = await execFileP(
        "git",
        ["-C", srcDir, "ls-remote", "origin", `refs/heads/${branch}`],
        { timeout: 16e3 }
      );
      const remoteSha = remoteOut.trim().split(/\s+/)[0];
      if (!remoteSha) {
        return { hasUpdate: false, error: "fetch-failed", message: `Branch '${branch}' not found on remote.` };
      }
      const { stdout: localOut } = await execFileP("git", ["-C", srcDir, "rev-parse", "HEAD"]);
      const localSha = localOut.trim();
      if (remoteSha === localSha) return { hasUpdate: false };
      return { hasUpdate: true, commitCount: 1, changes: ["New updates are available — click Update Now to install."] };
    } catch (e) {
      return {
        hasUpdate: false,
        error: "fetch-failed",
        message: `Could not reach update server: ${e.message}`
      };
    }
  });
  electron.ipcMain.handle("updater:run", (event, password) => {
    return new Promise((resolve, reject) => {
      if (!fs$1.existsSync(UPDATE_SCRIPT)) {
        return reject(new Error("cryogram-update script not found. Run from the live OS."));
      }
      const cmd = isRoot() ? "bash" : "sudo";
      const args = isRoot() ? [UPDATE_SCRIPT] : ["-S", UPDATE_SCRIPT];
      const proc2 = child_process.spawn(cmd, args, {
        env: { ...process.env, TERM: "xterm-color", FORCE_COLOR: "1" }
      });
      if (!isRoot() && password) {
        proc2.stdin?.write(password + "\n");
        proc2.stdin?.end();
      }
      const send = (data) => {
        try {
          event.sender.send("updater:progress", data);
        } catch {
        }
      };
      proc2.stdout.on("data", (d) => send(d.toString()));
      proc2.stderr.on("data", (d) => {
        const s = d.toString();
        if (!s.match(/^\[sudo\]|password for |Sorry, try again/)) send(s);
      });
      proc2.on("close", (code) => {
        if (code === null) {
          resolve({ success: true });
        } else if (code === 0) {
          const { exec: execRaw } = require("child_process");
          execRaw("shutdown -r now || reboot");
          resolve({ success: true });
        } else if (!isRoot() && code === 1) {
          reject(new Error("wrong-password"));
        } else {
          reject(new Error(`Update exited with code ${code}`));
        }
      });
      proc2.on("error", (err) => reject(err));
    });
  });
}
const execFileAsync = util.promisify(child_process.execFile);
let activeNmapProc = null;
function registerNetworkScannerHandlers() {
  electron.ipcMain.handle("scanner:check", async () => {
    try {
      await execFileAsync("which", ["nmap"]);
      return { available: true };
    } catch {
      try {
        await execFileAsync("nmap", ["--version"]);
        return { available: true };
      } catch {
        return { available: false };
      }
    }
  });
  electron.ipcMain.handle("scanner:run", (event, target, type, portRange) => {
    return new Promise((resolve, reject) => {
      if (!target?.trim()) {
        reject(new Error("No target specified"));
        return;
      }
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      let args;
      switch (type) {
        case "ping":
          args = ["-sn", target];
          break;
        case "ports":
          args = ["-sV", "--open", "-p", portRange?.trim() || "1-1000", target];
          break;
        case "service":
          args = ["-sV", "-sC", "--open", "-p", portRange?.trim() || "1-1000", target];
          break;
        case "full":
          args = ["-A", "--open", "-p", portRange?.trim() || "-", target];
          break;
        default:
          args = ["-sV", "--open", "-p", portRange?.trim() || "1-1000", target];
      }
      if (activeNmapProc) {
        try {
          activeNmapProc.kill("SIGTERM");
        } catch {
        }
        activeNmapProc = null;
      }
      const proc2 = child_process.spawn("nmap", args, { stdio: ["ignore", "pipe", "pipe"] });
      activeNmapProc = proc2;
      let lineBuffer = "";
      const sendLine = (line) => {
        if (win && !win.isDestroyed()) {
          win.webContents.send("scanner:progress", line);
        }
      };
      const flushBuffer = (chunk) => {
        lineBuffer += chunk;
        const parts = lineBuffer.split("\n");
        lineBuffer = parts.pop() ?? "";
        for (const part of parts) {
          const trimmed = part.trimEnd();
          if (trimmed) sendLine(trimmed);
        }
      };
      proc2.stdout?.on("data", (data) => {
        flushBuffer(data.toString());
      });
      proc2.stderr?.on("data", (data) => {
        const text = data.toString().trim();
        if (text) {
          for (const line of text.split("\n")) {
            const l = line.trimEnd();
            if (l) sendLine(l);
          }
        }
      });
      proc2.on("close", (code) => {
        if (lineBuffer.trim()) sendLine(lineBuffer.trim());
        lineBuffer = "";
        if (activeNmapProc === proc2) activeNmapProc = null;
        if (code === 0 || code === null) {
          resolve();
        } else {
          reject(new Error(`nmap exited with code ${code}`));
        }
      });
      proc2.on("error", (err) => {
        if (activeNmapProc === proc2) activeNmapProc = null;
        reject(new Error(`Failed to start nmap: ${err.message}`));
      });
    });
  });
  electron.ipcMain.on("scanner:cancel", () => {
    if (activeNmapProc) {
      try {
        activeNmapProc.kill("SIGTERM");
      } catch {
      }
      const proc2 = activeNmapProc;
      setTimeout(() => {
        try {
          proc2.kill("SIGKILL");
        } catch {
        }
      }, 2e3);
      activeNmapProc = null;
    }
  });
}
const execAsync$7 = util.promisify(child_process.exec);
function parseWgInterface(routeOutput) {
  const match = routeOutput.match(/dev\s+(wg\w+)/);
  return match?.[1];
}
async function getInterfaceIp(iface) {
  try {
    const { stdout } = await execAsync$7(`ip addr show ${iface} 2>/dev/null`);
    const match = stdout.match(/inet\s+(\d+\.\d+\.\d+\.\d+)/);
    return match?.[1];
  } catch {
    return void 0;
  }
}
let connectedSince;
function registerVpnHandlers() {
  electron.ipcMain.handle("vpn:getStatus", async () => {
    try {
      try {
        const { stdout: wgRoutes } = await execAsync$7("ip route show table 220 2>/dev/null");
        if (wgRoutes.trim()) {
          const iface = parseWgInterface(wgRoutes);
          const ip = iface ? await getInterfaceIp(iface) : void 0;
          return {
            connected: true,
            interface: iface,
            ip,
            connectedSince
          };
        }
      } catch {
      }
      try {
        const { stdout: linkOut } = await execAsync$7("ip link show type tun 2>/dev/null || ip link show 2>/dev/null");
        const tunMatch = linkOut.match(/\d+:\s+(tun\w+|tap\w+):\s+<.*UP/);
        if (tunMatch) {
          const iface = tunMatch[1];
          const ip = await getInterfaceIp(iface);
          return {
            connected: true,
            interface: iface,
            ip,
            connectedSince
          };
        }
      } catch {
      }
      try {
        const { stdout: nmOut } = await execAsync$7("nmcli -t -f TYPE,STATE,DEVICE connection show --active 2>/dev/null");
        const lines = nmOut.split("\n").filter(Boolean);
        for (const line of lines) {
          const [type, state, device] = line.split(":");
          if ((type === "vpn" || type === "wireguard") && state === "activated") {
            const ip = device ? await getInterfaceIp(device) : void 0;
            return {
              connected: true,
              interface: device || void 0,
              ip,
              connectedSince
            };
          }
        }
      } catch {
      }
      connectedSince = void 0;
      return { connected: false };
    } catch {
      return { connected: false };
    }
  });
  electron.ipcMain.handle("vpn:connect", async (_, profile) => {
    if (!profile.configPath) {
      return { success: false, message: "No config path provided" };
    }
    try {
      if (profile.type === "wireguard") {
        const arg = profile.configPath.endsWith(".conf") ? profile.configPath : profile.configPath;
        await new Promise((resolve, reject) => {
          const proc2 = child_process.spawn("sudo", ["wg-quick", "up", arg], { stdio: ["ignore", "pipe", "pipe"] });
          let stderr = "";
          proc2.stderr?.on("data", (d) => {
            stderr += d.toString();
          });
          proc2.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(stderr.trim() || `wg-quick exited with code ${code}`));
          });
          proc2.on("error", reject);
        });
      } else {
        await new Promise((resolve, reject) => {
          const proc2 = child_process.spawn("sudo", [
            "openvpn",
            "--config",
            profile.configPath,
            "--daemon",
            `cryogram-${profile.name}`,
            "--log",
            "/tmp/cryogram-openvpn.log"
          ], { stdio: ["ignore", "pipe", "pipe"] });
          let stderr = "";
          proc2.stderr?.on("data", (d) => {
            stderr += d.toString();
          });
          proc2.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(stderr.trim() || `openvpn exited with code ${code}`));
          });
          proc2.on("error", reject);
        });
      }
      connectedSince = Date.now();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, message };
    }
  });
  electron.ipcMain.handle("vpn:disconnect", async () => {
    const errors = [];
    try {
      await execAsync$7("sudo killall -SIGTERM openvpn 2>/dev/null || true");
    } catch (err) {
      errors.push(`openvpn: ${err instanceof Error ? err.message : String(err)}`);
    }
    try {
      const { stdout: linkOut } = await execAsync$7("ip link show 2>/dev/null");
      const wgIfaces = [...linkOut.matchAll(/\d+:\s+(wg\w+):/g)].map((m) => m[1]);
      for (const iface of wgIfaces) {
        try {
          await new Promise((resolve, reject) => {
            const proc2 = child_process.spawn("sudo", ["wg-quick", "down", iface], { stdio: ["ignore", "pipe", "pipe"] });
            proc2.on("close", (code) => code === 0 ? resolve() : reject(new Error(`wg-quick down ${iface} failed`)));
            proc2.on("error", reject);
          });
        } catch (err) {
          errors.push(`wg-quick down ${iface}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    } catch {
    }
    try {
      await execAsync$7('nmcli connection down $(nmcli -t -f TYPE,NAME connection show --active | grep "^vpn" | cut -d: -f2) 2>/dev/null || true');
    } catch {
    }
    connectedSince = void 0;
    if (errors.length > 0) {
      return { success: false, message: errors.join("; ") };
    }
    return { success: true };
  });
}
let proc = null;
function sendToRenderer(title, body) {
  const win = electron.BrowserWindow.getAllWindows()[0];
  win?.webContents.send("notification", { title, body });
}
function startNotificationBridge() {
  try {
    proc = child_process.spawn("dbus-monitor", [
      "--session",
      "type='method_call',interface='org.freedesktop.Notifications',member='Notify'"
    ], { stdio: ["ignore", "pipe", "ignore"] });
    let buf = "";
    let inNotify = false;
    let strings = [];
    proc.stdout?.on("data", (chunk) => {
      buf += chunk.toString();
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (line.includes("member=Notify")) {
          inNotify = true;
          strings = [];
          continue;
        }
        if (!inNotify) continue;
        const m = line.match(/^\s{3}string "(.*)"/);
        if (m) {
          strings.push(m[1]);
          continue;
        }
        if (line.trim().startsWith("array [")) {
          if (strings.length >= 3) {
            const app = strings[0] || "App";
            const summary = strings[2] || "";
            const body = strings[3] || "";
            const skip = !summary || app.toLowerCase().includes("electron") || app.toLowerCase().includes("cryogram");
            if (!skip) {
              sendToRenderer(summary, body);
            }
          }
          inNotify = false;
          strings = [];
        }
      }
    });
    proc.on("error", () => {
      proc = null;
    });
    proc.on("exit", () => {
      proc = null;
    });
  } catch {
    proc = null;
  }
}
function stopNotificationBridge() {
  proc?.kill("SIGTERM");
  proc = null;
}
function genId() {
  return `pw_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}
function loadEntries() {
  const raw = getSettingsStore().get("vault.passwords");
  return Array.isArray(raw) ? raw : [];
}
function saveEntries(entries) {
  getSettingsStore().set("vault.passwords", entries);
}
function generatePassword(opts) {
  const { length, upper, lower, numbers, symbols } = opts;
  let charset = "";
  if (upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) charset += "0123456789";
  if (symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";
  const clampedLength = Math.max(8, Math.min(64, length));
  const bytes = crypto.randomBytes(clampedLength * 2);
  let result = "";
  for (let i = 0; i < bytes.length && result.length < clampedLength; i++) {
    const idx = bytes[i] % charset.length;
    result += charset[idx];
  }
  return result;
}
function registerPasswordManagerHandlers() {
  electron.ipcMain.handle("passwords:getAll", () => {
    return loadEntries();
  });
  electron.ipcMain.handle(
    "passwords:add",
    (_, entry) => {
      const now = Date.now();
      const newEntry = {
        ...entry,
        id: genId(),
        createdAt: now,
        updatedAt: now
      };
      const entries = loadEntries();
      entries.push(newEntry);
      saveEntries(entries);
      return newEntry;
    }
  );
  electron.ipcMain.handle(
    "passwords:update",
    (_, id, patch) => {
      const entries = loadEntries();
      const idx = entries.findIndex((e) => e.id === id);
      if (idx === -1) return false;
      entries[idx] = { ...entries[idx], ...patch, id, updatedAt: Date.now() };
      saveEntries(entries);
      return true;
    }
  );
  electron.ipcMain.handle("passwords:delete", (_, id) => {
    const entries = loadEntries();
    const next = entries.filter((e) => e.id !== id);
    if (next.length === entries.length) return false;
    saveEntries(next);
    return true;
  });
  electron.ipcMain.handle("passwords:generate", (_, opts) => {
    return generatePassword(opts);
  });
}
const execAsync$6 = util.promisify(child_process.exec);
const SSH_DIR = path.join(os.homedir(), ".ssh");
async function getFingerprint(pubKeyPath) {
  try {
    const { stdout } = await execAsync$6(`ssh-keygen -l -f "${pubKeyPath}" 2>/dev/null`);
    return stdout.trim();
  } catch {
    return "unknown";
  }
}
function parseKeyType(publicKey) {
  const prefix = publicKey.trim().split(" ")[0] ?? "";
  if (prefix === "ssh-ed25519") return "ED25519";
  if (prefix === "ssh-rsa") return "RSA";
  if (prefix === "ecdsa-sha2-nistp256" || prefix.startsWith("ecdsa")) return "ECDSA";
  if (prefix === "ssh-dss") return "DSA";
  return prefix.replace("ssh-", "").toUpperCase() || "UNKNOWN";
}
function parseSshConfig(content) {
  const hosts = [];
  let current = null;
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const hostMatch = line.match(/^Host\s+(.+)$/i);
    if (hostMatch) {
      if (current) hosts.push(current);
      current = { host: hostMatch[1].trim() };
      continue;
    }
    if (!current) continue;
    const kvMatch = line.match(/^(\S+)\s+(.+)$/);
    if (!kvMatch) continue;
    const [, key, value] = kvMatch;
    switch (key.toLowerCase()) {
      case "hostname":
        current.hostname = value.trim();
        break;
      case "user":
        current.user = value.trim();
        break;
      case "port":
        current.port = value.trim();
        break;
      case "identityfile":
        current.identityFile = value.trim();
        break;
    }
  }
  if (current) hosts.push(current);
  return hosts.filter((h) => h.host !== "*");
}
function registerSSHKeyHandlers() {
  electron.ipcMain.handle("ssh:listKeys", async () => {
    try {
      const files = await fs.readdir(SSH_DIR);
      const pubFiles = files.filter((f) => f.endsWith(".pub"));
      const keys = [];
      for (const pubFile of pubFiles) {
        const pubPath = path.join(SSH_DIR, pubFile);
        const name = pubFile.replace(/\.pub$/, "");
        const privPath = path.join(SSH_DIR, name);
        try {
          const publicKey = await fs.readFile(pubPath, "utf8");
          const fingerprint = await getFingerprint(pubPath);
          keys.push({
            name,
            type: parseKeyType(publicKey),
            fingerprint,
            publicKey: publicKey.trim(),
            hasPrivate: fs$1.existsSync(privPath),
            path: pubPath
          });
        } catch {
        }
      }
      return keys;
    } catch {
      return [];
    }
  });
  electron.ipcMain.handle(
    "ssh:generateKey",
    async (_, opts) => {
      try {
        const destPath = path.join(SSH_DIR, opts.name);
        if (fs$1.existsSync(destPath)) {
          return { success: false, error: `Key "${opts.name}" already exists` };
        }
        const parts = ["ssh-keygen", "-t", opts.type];
        if (opts.type === "rsa" && opts.bits) {
          parts.push("-b", String(opts.bits));
        }
        if (opts.comment) {
          parts.push("-C", `"${opts.comment.replace(/"/g, '\\"')}"`);
        }
        const passphrase = opts.passphrase ?? "";
        parts.push("-N", `"${passphrase}"`);
        parts.push("-f", `"${destPath}"`);
        await execAsync$6(parts.join(" "));
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : String(err)
        };
      }
    }
  );
  electron.ipcMain.handle("ssh:deleteKey", async (_, name) => {
    try {
      const privPath = path.join(SSH_DIR, name);
      const pubPath = path.join(SSH_DIR, `${name}.pub`);
      if (fs$1.existsSync(privPath)) await fs.unlink(privPath);
      if (fs$1.existsSync(pubPath)) await fs.unlink(pubPath);
      return true;
    } catch {
      return false;
    }
  });
  electron.ipcMain.handle("ssh:getPublicKey", async (_, name) => {
    try {
      const pubPath = path.join(SSH_DIR, `${name}.pub`);
      return await fs.readFile(pubPath, "utf8");
    } catch {
      return "";
    }
  });
  electron.ipcMain.handle("ssh:listHosts", async () => {
    try {
      const configPath = path.join(SSH_DIR, "config");
      if (!fs$1.existsSync(configPath)) return [];
      const content = await fs.readFile(configPath, "utf8");
      return parseSshConfig(content);
    } catch {
      return [];
    }
  });
  electron.ipcMain.handle("ssh:saveConfig", async (_, content) => {
    try {
      const configPath = path.join(SSH_DIR, "config");
      await fs.writeFile(configPath, content, { mode: 384 });
      return true;
    } catch {
      return false;
    }
  });
}
const execAsync$5 = util.promisify(child_process.exec);
function parseUfwStatus(output) {
  const lines = output.split("\n");
  const active = /Status:\s*active/i.test(output);
  let defaultIn = "deny";
  let defaultOut = "allow";
  for (const line of lines) {
    const defMatch = line.match(/^Default:\s*(.+)/i);
    if (defMatch) {
      const parts = defMatch[1];
      const inMatch = parts.match(/(\w+)\s*\(incoming\)/i);
      const outMatch = parts.match(/(\w+)\s*\(outgoing\)/i);
      if (inMatch) defaultIn = inMatch[1].toLowerCase();
      if (outMatch) defaultOut = outMatch[1].toLowerCase();
    }
  }
  const rules = [];
  const ruleRe = /^\s*(?:\[\s*(\d+)\]\s+)?(\S+(?:\s+\S+)?)\s+(ALLOW|DENY|REJECT|LIMIT)(?:\s+IN|\s+OUT|FWD)?\s+(.+?)(\s+\(v6\))?\s*$/i;
  let ruleNum = 0;
  for (const line of lines) {
    const m = line.match(ruleRe);
    if (!m) continue;
    if (/^-+/.test(m[2])) continue;
    ruleNum++;
    const num = m[1] ? parseInt(m[1], 10) : ruleNum;
    const to = m[2].trim();
    const action = m[3].toUpperCase();
    const from = m[4].trim();
    const v6 = !!m[5] || /\(v6\)/i.test(to) || /\(v6\)/i.test(from);
    rules.push({ number: num, to, action, from, v6 });
  }
  return { active, defaultIn, defaultOut, rules };
}
function registerFirewallHandlers() {
  electron.ipcMain.handle("firewall:status", async () => {
    try {
      const { stdout } = await execAsync$5("sudo ufw status verbose 2>/dev/null");
      return parseUfwStatus(stdout);
    } catch {
      return { active: false, defaultIn: "deny", defaultOut: "allow", rules: [] };
    }
  });
  electron.ipcMain.handle("firewall:enable", async () => {
    try {
      await execAsync$5("sudo ufw --force enable 2>&1");
      return { success: true };
    } catch {
      return { success: false };
    }
  });
  electron.ipcMain.handle("firewall:disable", async () => {
    try {
      await execAsync$5("sudo ufw disable 2>&1");
      return { success: true };
    } catch {
      return { success: false };
    }
  });
  electron.ipcMain.handle(
    "firewall:addRule",
    async (_, rule) => {
      try {
        const parts = ["sudo", "ufw", rule.action];
        if (rule.from && rule.from.toLowerCase() !== "any") {
          parts.push("from", rule.from);
        }
        if (rule.port) {
          const protoSuffix = rule.proto && rule.proto !== "any" ? `/${rule.proto}` : "";
          parts.push("to", "any", "port", `${rule.port}${protoSuffix}`);
        }
        const cmd = parts.join(" ");
        await execAsync$5(cmd);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : String(err)
        };
      }
    }
  );
  electron.ipcMain.handle("firewall:deleteRule", async (_, number) => {
    try {
      await execAsync$5(`sudo ufw --force delete ${number} 2>&1`);
      return { success: true };
    } catch {
      return { success: false };
    }
  });
  electron.ipcMain.handle("firewall:reset", async () => {
    try {
      await execAsync$5("sudo ufw --force reset 2>&1");
      return { success: true };
    } catch {
      return { success: false };
    }
  });
}
const execAsync$4 = util.promisify(child_process.exec);
function sh$4(cmd) {
  return execAsync$4(cmd).then((r) => r.stdout.trim()).catch(() => "");
}
function registerProcessHandlers() {
  electron.ipcMain.handle("processes:list", async () => {
    const out = await sh$4("ps aux --no-headers 2>/dev/null");
    if (!out) return [];
    return out.split("\n").filter(Boolean).map((line) => {
      const parts = line.trimStart().split(/\s+/);
      const user = parts[0] ?? "";
      const pid = parseInt(parts[1]) || 0;
      const cpu = parseFloat(parts[2]) || 0;
      const memPct = parseFloat(parts[3]) || 0;
      const rssKb = parseInt(parts[5]) || 0;
      const stat = parts[7] ?? "";
      const command = parts.slice(10).join(" ") || parts[0];
      let status = "running";
      if (stat.startsWith("S")) status = "sleeping";
      else if (stat.startsWith("D")) status = "disk-wait";
      else if (stat.startsWith("Z")) status = "zombie";
      else if (stat.startsWith("T")) status = "stopped";
      else if (stat.startsWith("R")) status = "running";
      else if (stat.startsWith("I")) status = "idle";
      const cmdParts = command.replace(/^[\[\]]/g, "").split(/[\s/]/);
      const name = cmdParts[cmdParts.length - 1]?.replace(/[[\]]/g, "") || command.slice(0, 20);
      return {
        pid,
        name,
        cpu,
        memMb: Math.round(rssKb / 1024 * 10) / 10,
        memPct,
        status,
        user,
        command
      };
    }).filter((p) => p.pid > 0);
  });
  electron.ipcMain.handle("processes:kill", async (_, pid, signal) => {
    try {
      const sig = signal || "SIGTERM";
      process.kill(pid, sig);
      return { success: true };
    } catch (err) {
      return { success: false, error: err?.message ?? "Failed to kill process" };
    }
  });
  electron.ipcMain.handle("processes:getSystemStats", async () => {
    try {
      const readCpu = async () => {
        const stat = await fs.readFile("/proc/stat", "utf8").catch(() => "");
        const line = stat.split("\n").find((l) => l.startsWith("cpu "));
        if (!line) return null;
        const nums = line.split(/\s+/).slice(1).map(Number);
        const idle = (nums[3] ?? 0) + (nums[4] ?? 0);
        const total = nums.reduce((a2, b2) => a2 + b2, 0);
        return { idle, total };
      };
      const [a] = await Promise.all([readCpu()]);
      await new Promise((r) => setTimeout(r, 200));
      const b = await readCpu();
      let cpuPct = 0;
      if (a && b) {
        const totalDelta = b.total - a.total;
        const idleDelta = b.idle - a.idle;
        if (totalDelta > 0) cpuPct = Math.max(0, Math.min(100, (totalDelta - idleDelta) / totalDelta * 100));
      }
      const memInfo = await fs.readFile("/proc/meminfo", "utf8").catch(() => "");
      const getKb = (key) => {
        const l = memInfo.split("\n").find((l2) => l2.startsWith(key));
        return l ? parseInt(l.split(/\s+/)[1]) || 0 : 0;
      };
      const memTotal = getKb("MemTotal:");
      const memAvail = getKb("MemAvailable:");
      const memUsed = memTotal - memAvail;
      const memPct = memTotal > 0 ? memUsed / memTotal * 100 : 0;
      return {
        cpuPct: Math.round(cpuPct * 10) / 10,
        memTotal: Math.round(memTotal / 1024),
        // MB
        memUsed: Math.round(memUsed / 1024),
        // MB
        memPct: Math.round(memPct * 10) / 10
      };
    } catch {
      return { cpuPct: 0, memTotal: 0, memUsed: 0, memPct: 0 };
    }
  });
}
const execAsync$3 = util.promisify(child_process.exec);
function sh$3(cmd) {
  return execAsync$3(cmd, { maxBuffer: 10 * 1024 * 1024 }).then((r) => r.stdout.trim()).catch(() => "");
}
let tailProc = null;
function parseLine(raw) {
  const detectLevel = (msg, unit) => {
    const m2 = msg.toLowerCase();
    const u = unit.toLowerCase();
    if (m2.includes("emerg") || m2.includes("panic")) return "emerg";
    if (m2.includes("alert")) return "alert";
    if (m2.includes("crit")) return "crit";
    if (m2.includes("error") || m2.includes("err:") || m2.includes("failed") || m2.includes("failure"))
      return "err";
    if (m2.includes("warn")) return "warning";
    if (m2.includes("notice")) return "notice";
    if (m2.includes("debug") || m2.includes("trace")) return "debug";
    if (u === "kernel") return "info";
    return "info";
  };
  const m = raw.match(/^(\w{3}\s+\d+\s+[\d:.]+)\s+\S+\s+([^\[:]+)(?:\[\d+\])?\s*:\s*(.*)$/);
  if (m) {
    const [, ts, unit, message] = m;
    return {
      timestamp: ts.trim(),
      unit: unit.trim(),
      level: detectLevel(message, unit.trim()),
      message: message.trim(),
      raw
    };
  }
  return {
    timestamp: "",
    unit: "",
    level: "info",
    message: raw,
    raw
  };
}
function registerLogHandlers() {
  electron.ipcMain.handle("logs:getUnits", async () => {
    const out = await sh$3(
      "systemctl list-units --type=service --state=loaded -q --no-legend --no-pager 2>/dev/null"
    );
    const units = out.split("\n").filter(Boolean).map((line) => {
      const name = line.trim().split(/\s+/)[0] ?? "";
      return name.replace(/\.service$/, "");
    }).filter(Boolean).sort();
    return ["all", "kernel", ...units];
  });
  electron.ipcMain.handle("logs:query", async (_, opts) => {
    const { unit = "all", lines = 100, since, priority, search } = opts;
    const args = ["--no-pager", "--output", "short-precise", "-n", String(lines)];
    if (unit && unit !== "all") {
      if (unit === "kernel") {
        args.push("-k");
      } else {
        args.push("-u", `${unit}.service`);
      }
    }
    if (since) {
      args.push("--since", since);
    }
    if (priority && priority !== "all") {
      args.push("-p", priority);
    }
    const cmd = `journalctl ${args.map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(" ")} 2>/dev/null`;
    let out = await sh$3(cmd);
    if (search) {
      const lower = search.toLowerCase();
      out = out.split("\n").filter((l) => l.toLowerCase().includes(lower)).join("\n");
    }
    const parsed = out.split("\n").filter(Boolean).map(parseLine);
    return { lines: parsed };
  });
  electron.ipcMain.handle("logs:stream", async (event, opts) => {
    if (tailProc) {
      try {
        tailProc.kill("SIGTERM");
      } catch {
      }
      tailProc = null;
    }
    const { unit = "all" } = opts;
    const args = ["-f", "--no-pager", "--output", "short-precise"];
    if (unit && unit !== "all") {
      if (unit === "kernel") {
        args.push("-k");
      } else {
        args.push("-u", `${unit}.service`);
      }
    }
    const proc2 = child_process.spawn("journalctl", args, { stdio: ["ignore", "pipe", "ignore"] });
    tailProc = proc2;
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    let buf = "";
    proc2.stdout?.on("data", (data) => {
      buf += data.toString();
      const parts = buf.split("\n");
      buf = parts.pop() ?? "";
      for (const line of parts) {
        const trimmed = line.trimEnd();
        if (trimmed && win && !win.isDestroyed()) {
          win.webContents.send("logs:line", parseLine(trimmed));
        }
      }
    });
    proc2.on("close", () => {
      if (tailProc === proc2) tailProc = null;
    });
  });
  electron.ipcMain.handle("logs:stopStream", async () => {
    if (tailProc) {
      try {
        tailProc.kill("SIGTERM");
      } catch {
      }
      tailProc = null;
    }
  });
}
const execAsync$2 = util.promisify(child_process.exec);
function sh$2(cmd) {
  return execAsync$2(cmd).then((r) => r.stdout.trim()).catch(() => "");
}
async function readNetDev() {
  const map = /* @__PURE__ */ new Map();
  try {
    const content = await fs.readFile("/proc/net/dev", "utf8");
    for (const line of content.split("\n").slice(2)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx < 0) continue;
      const name = trimmed.slice(0, colonIdx).trim();
      const cols = trimmed.slice(colonIdx + 1).trim().split(/\s+/);
      const rx = parseInt(cols[0]) || 0;
      const tx = parseInt(cols[8]) || 0;
      map.set(name, { rx, tx });
    }
  } catch {
  }
  return map;
}
let streamInterval = null;
let prevSnapshot = null;
function registerNetmonHandlers() {
  electron.ipcMain.handle("netmon:getInterfaces", async () => {
    const snap = await readNetDev();
    const results = [];
    for (const [name, vals] of snap) {
      if (name === "lo") continue;
      results.push({ name, rxBytes: vals.rx, txBytes: vals.tx });
    }
    return results.sort((a, b) => a.name.localeCompare(b.name));
  });
  electron.ipcMain.handle("netmon:getConnections", async () => {
    const out = await sh$2("ss -tunap 2>/dev/null");
    if (!out) return [];
    const connections = [];
    for (const line of out.split("\n").slice(1)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(/\s+/);
      if (parts.length < 6) continue;
      const protocol = (parts[0] ?? "").toLowerCase();
      const state = parts[1] ?? "";
      const local = parts[4] ?? "";
      const remote = parts[5] ?? "";
      if (local.startsWith("127.") || remote.startsWith("127.")) continue;
      if (local.startsWith("[::1]") || remote.startsWith("[::1]")) continue;
      const procRaw = parts.slice(6).join(" ");
      let pid = "";
      let processName = "";
      const pidMatch = procRaw.match(/pid=(\d+)/);
      const nameMatch = procRaw.match(/"([^"]+)"/);
      if (pidMatch) pid = pidMatch[1];
      if (nameMatch) processName = nameMatch[1];
      connections.push({ protocol, local, remote, state, pid, process: processName });
    }
    return connections;
  });
  electron.ipcMain.handle("netmon:startStream", async (event) => {
    if (streamInterval !== null) {
      clearInterval(streamInterval);
      streamInterval = null;
    }
    prevSnapshot = await readNetDev();
    streamInterval = setInterval(async () => {
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      if (!win || win.isDestroyed()) {
        clearInterval(streamInterval);
        streamInterval = null;
        return;
      }
      const current = await readNetDev();
      const prev = prevSnapshot ?? current;
      const interfaces = [];
      for (const [name, cur] of current) {
        if (name === "lo") continue;
        const p = prev.get(name) ?? cur;
        interfaces.push({
          name,
          rxRate: Math.max(0, cur.rx - p.rx),
          // bytes/sec (1s interval)
          txRate: Math.max(0, cur.tx - p.tx),
          rxTotal: cur.rx,
          txTotal: cur.tx
        });
      }
      prevSnapshot = current;
      win.webContents.send("netmon:stats", { interfaces });
    }, 1e3);
  });
  electron.ipcMain.handle("netmon:stopStream", async () => {
    if (streamInterval !== null) {
      clearInterval(streamInterval);
      streamInterval = null;
    }
    prevSnapshot = null;
  });
}
function defaultFilename() {
  const now = /* @__PURE__ */ new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `Screenshot-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.png`;
}
function registerScreenshotHandlers() {
  electron.ipcMain.handle("screenshot:capture", async () => {
    const sources = await electron.desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    const src = sources[0];
    if (!src) throw new Error("No screen source found");
    const dataUrl = src.thumbnail.toDataURL();
    const size = src.thumbnail.getSize();
    return { dataUrl, width: size.width, height: size.height };
  });
  electron.ipcMain.handle("screenshot:save", async (_, dataUrl, filename) => {
    const screenshotsDir = path.join(os.homedir(), "Screenshots");
    if (!fs$1.existsSync(screenshotsDir)) {
      fs$1.mkdirSync(screenshotsDir, { recursive: true });
    }
    const name = filename ?? defaultFilename();
    const filePath = path.join(screenshotsDir, name);
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    await fs.writeFile(filePath, buffer);
    return { path: filePath };
  });
  electron.ipcMain.handle("screenshot:copyToClipboard", async (_, dataUrl) => {
    try {
      const image = electron.nativeImage.createFromDataURL(dataUrl);
      electron.clipboard.writeImage(image);
      return true;
    } catch {
      return false;
    }
  });
}
function parseDN(dn) {
  const result = {};
  if (!dn) return result;
  dn.split(/\n|,\s*/).forEach((part) => {
    const eq = part.indexOf("=");
    if (eq > 0) result[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
  });
  return result;
}
function certFromDetailedPeer(cert) {
  const now = Date.now();
  const validTo = new Date(cert.valid_to);
  const validFrom = new Date(cert.valid_from);
  const sha256 = cert.raw ? crypto__namespace.createHash("sha256").update(cert.raw).digest("hex").match(/.{2}/g).join(":") : "";
  const sha1 = cert.raw ? crypto__namespace.createHash("sha1").update(cert.raw).digest("hex").match(/.{2}/g).join(":") : "";
  const sans = [];
  if (cert.subjectaltname) {
    cert.subjectaltname.split(", ").forEach((s) => {
      sans.push(s.replace(/^(DNS|IP Address):/i, "").trim());
    });
  }
  return {
    subject: cert.subject ?? {},
    issuer: cert.issuer ?? {},
    validFrom: validFrom.toISOString(),
    validTo: validTo.toISOString(),
    daysRemaining: Math.floor((validTo.getTime() - now) / 864e5),
    sans,
    publicKey: { algorithm: "RSA", size: 0 },
    fingerprints: { sha256, sha1 },
    serialNumber: cert.serialNumber ?? "",
    signatureAlgorithm: "SHA256withRSA",
    isCA: !!cert.ca
  };
}
function certFromX509(cert) {
  const now = Date.now();
  const validTo = new Date(cert.validTo);
  const validFrom = new Date(cert.validFrom);
  return {
    subject: parseDN(cert.subject),
    issuer: parseDN(cert.issuer),
    validFrom: validFrom.toISOString(),
    validTo: validTo.toISOString(),
    daysRemaining: Math.floor((validTo.getTime() - now) / 864e5),
    sans: cert.subjectAltName ? cert.subjectAltName.split(", ").map((s) => s.replace(/^(DNS|IP Address):/i, "").trim()) : [],
    publicKey: {
      algorithm: cert.publicKey?.asymmetricKeyType?.toUpperCase() ?? "Unknown",
      size: cert.publicKey?.asymmetricKeyDetails?.modulusLength ?? 0
    },
    fingerprints: { sha256: cert.fingerprint256, sha1: cert.fingerprint },
    serialNumber: cert.serialNumber,
    signatureAlgorithm: "Unknown",
    isCA: cert.ca
  };
}
function registerCertHandlers() {
  electron.ipcMain.handle(
    "cert:inspect",
    (_evt, host, port = 443) => new Promise((resolve, reject) => {
      const socket = tls__namespace.connect(
        { host, port, rejectUnauthorized: false, servername: host },
        () => {
          try {
            const cert = socket.getPeerCertificate(true);
            socket.destroy();
            resolve(certFromDetailedPeer(cert));
          } catch (e) {
            socket.destroy();
            reject(e);
          }
        }
      );
      socket.on("error", reject);
      socket.setTimeout(12e3, () => {
        socket.destroy();
        reject(new Error("Connection timed out"));
      });
    })
  );
  electron.ipcMain.handle("cert:parsePem", (_evt, pem) => {
    try {
      const x509 = new crypto__namespace.X509Certificate(pem);
      return certFromX509(x509);
    } catch (e) {
      throw new Error(e.message);
    }
  });
}
const execAsync$1 = util.promisify(child_process.exec);
const sh$1 = (cmd) => execAsync$1(cmd, { maxBuffer: 5 * 1024 * 1024 }).then((r) => r.stdout.trim()).catch(() => "");
function parseJsonLines(out) {
  return out.split("\n").filter(Boolean).map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  }).filter(Boolean);
}
function registerDockerHandlers() {
  electron.ipcMain.handle("docker:listContainers", async () => {
    const out = await sh$1('docker ps -a --format "{{json .}}" 2>/dev/null');
    return parseJsonLines(out).map((c) => ({
      id: c.ID,
      name: c.Names,
      image: c.Image,
      status: c.Status,
      state: c.State,
      ports: c.Ports,
      created: c.CreatedAt
    }));
  });
  electron.ipcMain.handle("docker:startContainer", async (_, id) => {
    await sh$1(`docker start ${id} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("docker:stopContainer", async (_, id) => {
    await sh$1(`docker stop ${id} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("docker:restartContainer", async (_, id) => {
    await sh$1(`docker restart ${id} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("docker:removeContainer", async (_, id) => {
    await sh$1(`docker rm -f ${id} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle(
    "docker:getLogs",
    async (_, id, lines = 200) => sh$1(`docker logs --tail ${lines} ${id} 2>&1`)
  );
  electron.ipcMain.handle("docker:listImages", async () => {
    const out = await sh$1('docker images --format "{{json .}}" 2>/dev/null');
    return parseJsonLines(out).map((img) => ({
      id: img.ID,
      repository: img.Repository,
      tag: img.Tag,
      size: img.Size,
      created: img.CreatedAt
    }));
  });
  electron.ipcMain.handle("docker:removeImage", async (_, id) => {
    await sh$1(`docker rmi ${id} 2>/dev/null`);
    return true;
  });
  electron.ipcMain.handle("docker:pullImage", async (_, name) => {
    const win = electron.BrowserWindow.getAllWindows()[0];
    return new Promise((resolve) => {
      const proc2 = child_process.spawn("docker", ["pull", name], { env: { ...process.env } });
      proc2.stdout.on("data", (d) => win?.webContents.send("docker:pullLine", d.toString()));
      proc2.stderr.on("data", (d) => win?.webContents.send("docker:pullLine", d.toString()));
      proc2.on("close", () => resolve());
    });
  });
  electron.ipcMain.handle("docker:getStats", async () => {
    const out = await sh$1('docker stats --no-stream --format "{{json .}}" 2>/dev/null');
    return parseJsonLines(out).map((s) => ({
      id: s.ID,
      name: s.Name,
      cpuPct: s.CPUPerc,
      memUsage: s.MemUsage,
      memPct: s.MemPerc,
      netIO: s.NetIO,
      blockIO: s.BlockIO
    }));
  });
}
const execAsync = util.promisify(child_process.exec);
function git(repoPath, cmd) {
  return execAsync(`git -C "${repoPath}" --no-pager ${cmd}`, { maxBuffer: 20 * 1024 * 1024 }).then((r) => r.stdout.trim()).catch((e) => {
    throw new Error(e.stderr?.trim() || e.message);
  });
}
function registerGitHandlers() {
  electron.ipcMain.handle(
    "git:isRepo",
    async (_, repoPath) => fs$1.existsSync(path__namespace.join(repoPath, ".git"))
  );
  electron.ipcMain.handle("git:status", async (_, repoPath) => {
    const raw = await git(repoPath, "status --porcelain=v1").catch(() => "");
    const branch = await git(repoPath, "rev-parse --abbrev-ref HEAD").catch(() => "HEAD");
    const ahead = parseInt(await git(repoPath, "rev-list --count @{u}..HEAD 2>/dev/null").catch(() => "0")) || 0;
    const behind = parseInt(await git(repoPath, "rev-list --count HEAD..@{u} 2>/dev/null").catch(() => "0")) || 0;
    const files = raw.split("\n").filter(Boolean).map((line) => ({
      status: line.slice(0, 2).trim(),
      path: line.slice(3),
      staged: line[0] !== " " && line[0] !== "?"
    }));
    return { branch, files, ahead, behind };
  });
  electron.ipcMain.handle("git:log", async (_, repoPath, limit = 30) => {
    const out = await git(repoPath, `log --pretty=format:"%H|%h|%s|%an|%ae|%ar|%ad" --date=short -${limit}`).catch(() => "");
    return out.split("\n").filter(Boolean).map((line) => {
      const [hash, shortHash, subject, author, email, relDate, date] = line.split("|");
      return { hash, shortHash, subject, author, email, relDate, date };
    });
  });
  electron.ipcMain.handle("git:diff", async (_, repoPath, filePath, staged = false) => {
    const flag = staged ? "--cached" : "";
    const file = filePath ? `-- "${filePath}"` : "";
    return git(repoPath, `diff ${flag} ${file}`).catch(() => "");
  });
  electron.ipcMain.handle("git:getBranches", async (_, repoPath) => {
    const out = await git(repoPath, "branch -a --format=%(refname:short)|%(HEAD)").catch(() => "");
    return out.split("\n").filter(Boolean).map((line) => {
      const [name, head] = line.split("|");
      return { name: name.trim(), isCurrent: head?.trim() === "*" };
    });
  });
  electron.ipcMain.handle("git:checkout", async (_, repoPath, branch) => {
    await git(repoPath, `checkout "${branch}"`);
    return true;
  });
  electron.ipcMain.handle("git:stage", async (_, repoPath, files) => {
    const paths = files.map((f) => `"${f}"`).join(" ");
    await git(repoPath, `add ${paths}`);
    return true;
  });
  electron.ipcMain.handle("git:unstage", async (_, repoPath, files) => {
    const paths = files.map((f) => `"${f}"`).join(" ");
    await git(repoPath, `restore --staged ${paths}`);
    return true;
  });
  electron.ipcMain.handle("git:commit", async (_, repoPath, message) => {
    await git(repoPath, `commit -m "${message.replace(/"/g, '\\"')}"`);
    return true;
  });
  electron.ipcMain.handle("git:push", async (_, repoPath) => git(repoPath, "push"));
  electron.ipcMain.handle("git:pull", async (_, repoPath) => git(repoPath, "pull"));
  electron.ipcMain.handle("git:stash", async (_, repoPath) => {
    await git(repoPath, "stash");
    return true;
  });
  electron.ipcMain.handle("git:stashPop", async (_, repoPath) => {
    await git(repoPath, "stash pop");
    return true;
  });
  electron.ipcMain.handle("git:init", async (_, repoPath) => {
    await git(repoPath, "init");
    return true;
  });
}
let Database = null;
try {
  Database = require("better-sqlite3");
} catch {
}
const sessions = /* @__PURE__ */ new Map();
function registerDatabaseHandlers() {
  electron.ipcMain.handle("db:open", async (_, filePath) => {
    if (!Database) return { error: "better-sqlite3 not installed. Run: npm install better-sqlite3" };
    try {
      const sessionId = `db_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const db2 = Database(filePath, { readonly: true });
      sessions.set(sessionId, db2);
      return { sessionId };
    } catch (e) {
      return { error: e.message };
    }
  });
  electron.ipcMain.handle("db:close", async (_, sessionId) => {
    sessions.get(sessionId)?.close();
    sessions.delete(sessionId);
    return true;
  });
  electron.ipcMain.handle("db:listTables", async (_, sessionId) => {
    const db2 = sessions.get(sessionId);
    if (!db2) return [];
    return db2.prepare("SELECT name, type FROM sqlite_master WHERE type IN ('table','view') ORDER BY name").all();
  });
  electron.ipcMain.handle("db:getSchema", async (_, sessionId, tableName) => {
    const db2 = sessions.get(sessionId);
    if (!db2) return [];
    return db2.prepare(`PRAGMA table_info("${tableName.replace(/"/g, "")}")`).all();
  });
  electron.ipcMain.handle("db:getTableRowCount", async (_, sessionId, tableName) => {
    const db2 = sessions.get(sessionId);
    if (!db2) return 0;
    try {
      const r = db2.prepare(`SELECT COUNT(*) as n FROM "${tableName.replace(/"/g, "")}"`).get();
      return r?.n ?? 0;
    } catch {
      return 0;
    }
  });
  electron.ipcMain.handle("db:query", async (_, sessionId, sql, page = 0, pageSize = 100) => {
    const db2 = sessions.get(sessionId);
    if (!db2) return { rows: [], columns: [], total: 0, error: "No database open" };
    try {
      const trimmed = sql.trim().toLowerCase();
      if (trimmed.startsWith("select") || trimmed.startsWith("with") || trimmed.startsWith("pragma")) {
        const rows = db2.prepare(`${sql} LIMIT ${pageSize} OFFSET ${page * pageSize}`).all();
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        let total = 0;
        try {
          const r = db2.prepare(`SELECT COUNT(*) as n FROM (${sql})`).get();
          total = r?.n ?? rows.length;
        } catch {
        }
        return { rows, columns, total, error: null };
      } else {
        const info = db2.prepare(sql).run();
        return { rows: [], columns: [], total: 0, changes: info.changes, error: null };
      }
    } catch (e) {
      return { rows: [], columns: [], total: 0, error: e.message };
    }
  });
}
const TRASH_FILES = path__namespace.join(os__namespace.homedir(), ".local/share/Trash/files");
const TRASH_INFO = path__namespace.join(os__namespace.homedir(), ".local/share/Trash/info");
async function ensureDirs() {
  await fs__namespace.mkdir(TRASH_FILES, { recursive: true });
  await fs__namespace.mkdir(TRASH_INFO, { recursive: true });
}
function trashInfoContent(originalPath) {
  return `[Trash Info]
Path=${originalPath}
DeletionDate=${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19)}
`;
}
function registerTrashHandlers() {
  electron.ipcMain.handle("trash:list", async () => {
    await ensureDirs();
    try {
      const infos = (await fs__namespace.readdir(TRASH_INFO)).filter((f) => f.endsWith(".trashinfo"));
      return Promise.all(infos.map(async (info) => {
        const base = info.slice(0, -10);
        const content = await fs__namespace.readFile(path__namespace.join(TRASH_INFO, info), "utf8").catch(() => "");
        const originalPath = content.match(/Path=(.+)/)?.[1]?.trim() ?? "";
        const deletionDate = content.match(/DeletionDate=(.+)/)?.[1]?.trim() ?? "";
        let size = 0;
        try {
          const s = await fs__namespace.stat(path__namespace.join(TRASH_FILES, base));
          size = s.size;
        } catch {
        }
        return { name: base, originalPath, deletionDate, size };
      }));
    } catch {
      return [];
    }
  });
  electron.ipcMain.handle("trash:moveToTrash", async (_, filePath) => {
    await ensureDirs();
    const name = path__namespace.basename(filePath);
    await fs__namespace.rename(filePath, path__namespace.join(TRASH_FILES, name));
    await fs__namespace.writeFile(path__namespace.join(TRASH_INFO, `${name}.trashinfo`), trashInfoContent(filePath));
    return true;
  });
  electron.ipcMain.handle("trash:restore", async (_, name) => {
    const content = await fs__namespace.readFile(path__namespace.join(TRASH_INFO, `${name}.trashinfo`), "utf8");
    const orig = content.match(/Path=(.+)/)?.[1]?.trim();
    if (!orig) throw new Error("Original path unknown");
    await fs__namespace.rename(path__namespace.join(TRASH_FILES, name), orig);
    await fs__namespace.unlink(path__namespace.join(TRASH_INFO, `${name}.trashinfo`)).catch(() => {
    });
    return true;
  });
  electron.ipcMain.handle("trash:deletePermanent", async (_, name) => {
    await fs__namespace.rm(path__namespace.join(TRASH_FILES, name), { recursive: true, force: true });
    await fs__namespace.unlink(path__namespace.join(TRASH_INFO, `${name}.trashinfo`)).catch(() => {
    });
    return true;
  });
  electron.ipcMain.handle("trash:empty", async () => {
    await ensureDirs();
    const files = await fs__namespace.readdir(TRASH_FILES).catch(() => []);
    const infos = await fs__namespace.readdir(TRASH_INFO).catch(() => []);
    await Promise.all([
      ...files.map((f) => fs__namespace.rm(path__namespace.join(TRASH_FILES, f), { recursive: true, force: true })),
      ...infos.map((f) => fs__namespace.unlink(path__namespace.join(TRASH_INFO, f)).catch(() => {
      }))
    ]);
    return true;
  });
  electron.ipcMain.handle("trash:getSize", async () => {
    await ensureDirs();
    const files = await fs__namespace.readdir(TRASH_FILES).catch(() => []);
    let bytes = 0;
    for (const f of files) {
      try {
        const s = await fs__namespace.stat(path__namespace.join(TRASH_FILES, f));
        bytes += s.size;
      } catch {
      }
    }
    return { count: files.length, bytes };
  });
}
function getKey() {
  const store = getSettingsStore();
  return store.get("shodan.apiKey", "");
}
async function shodanFetch(path2) {
  const key = getKey();
  if (!key) throw new Error("NO_API_KEY");
  const res = await fetch(`https://api.shodan.io${path2}?key=${key}`);
  if (!res.ok) throw new Error(`Shodan API error: ${res.status}`);
  return res.json();
}
function registerShodanHandlers() {
  electron.ipcMain.handle("shodan:search", async (_, query, page = 1) => {
    return shodanFetch(`/shodan/host/search?query=${encodeURIComponent(query)}&page=${page}`);
  });
  electron.ipcMain.handle("shodan:host", async (_, ip) => {
    return shodanFetch(`/shodan/host/${ip}`);
  });
  electron.ipcMain.handle("shodan:count", async (_, query) => {
    return shodanFetch(`/shodan/host/count?query=${encodeURIComponent(query)}`);
  });
  electron.ipcMain.handle("shodan:exploits", async (_, query) => {
    return shodanFetch(`/shodan/exploits/search?query=${encodeURIComponent(query)}`);
  });
}
function registerOSINTHandlers() {
  electron.ipcMain.handle("osint:lookup", async (_, tool, query) => {
    try {
      switch (tool) {
        case "IP Lookup": {
          const res = await fetch(`https://ipapi.co/${query}/json/`);
          const data = await res.json();
          return {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country_name,
            org: data.org,
            isp: data.org,
            timezone: data.timezone,
            latitude: data.latitude,
            longitude: data.longitude,
            asn: data.asn,
            currency: data.currency
          };
        }
        case "WHOIS": {
          const res = await fetch(`https://rdap.org/domain/${query}`);
          const data = await res.json();
          return {
            domain: data.ldhName,
            status: (data.status || []).join(", "),
            registered: data.events?.find((e) => e.eventAction === "registration")?.eventDate || "—",
            expiry: data.events?.find((e) => e.eventAction === "expiration")?.eventDate || "—",
            registrar: data.entities?.[0]?.vcardArray?.[1]?.find((v) => v[0] === "fn")?.[3] || "—"
          };
        }
        case "DNS Records": {
          const types = ["A", "AAAA", "MX", "NS", "TXT", "CNAME"];
          const results = {};
          await Promise.all(types.map(async (type) => {
            try {
              const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${query}&type=${type}`, { headers: { Accept: "application/dns-json" } });
              const data = await res.json();
              if (data.Answer) results[type] = data.Answer.map((r) => r.data).join(", ");
            } catch {
            }
          }));
          return results;
        }
        case "Email Lookup":
          return { email: query, note: "Email validation requires a paid API key. Domain portion available via DNS lookup." };
        case "Username Search":
          return { username: query, note: "Username enumeration check. Try using the API Tester app to query social APIs directly." };
        case "Domain Recon": {
          const [rdap, dns] = await Promise.all([
            fetch(`https://rdap.org/domain/${query}`).then((r) => r.json()).catch(() => ({})),
            fetch(`https://cloudflare-dns.com/dns-query?name=${query}&type=A`, { headers: { Accept: "application/dns-json" } }).then((r) => r.json()).catch(() => ({ Answer: [] }))
          ]);
          return {
            domain: query,
            registered: rdap.events?.find((e) => e.eventAction === "registration")?.eventDate || "—",
            ip: dns.Answer?.[0]?.data || "—",
            nameservers: rdap.nameservers?.map((ns) => ns.ldhName).join(", ") || "—"
          };
        }
        default:
          return { error: "Unknown tool" };
      }
    } catch (e) {
      return { error: e.message };
    }
  });
}
const NVD_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0";
function mapCVE(item) {
  const cve = item.cve;
  const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV30?.[0] || cve.metrics?.cvssMetricV2?.[0];
  const score = metrics?.cvssData?.baseScore ?? 0;
  const severity = metrics?.cvssData?.baseSeverity ?? (score >= 9 ? "CRITICAL" : score >= 7 ? "HIGH" : score >= 4 ? "MEDIUM" : score > 0 ? "LOW" : "NONE");
  return {
    id: cve.id,
    description: cve.descriptions?.find((d) => d.lang === "en")?.value || "",
    severity: severity.toUpperCase(),
    score,
    published: cve.published?.slice(0, 10) || "",
    references: (cve.references || []).slice(0, 5).map((r) => r.url)
  };
}
function registerCVEHandlers() {
  electron.ipcMain.handle("cve:search", async (_, query) => {
    try {
      if (/^CVE-\d{4}-\d+$/i.test(query.trim())) {
        const res2 = await fetch(`${NVD_BASE}?cveId=${query.trim().toUpperCase()}`);
        const data2 = await res2.json();
        return (data2.vulnerabilities || []).map((v) => mapCVE(v));
      }
      const res = await fetch(`${NVD_BASE}?keywordSearch=${encodeURIComponent(query)}&resultsPerPage=20`);
      const data = await res.json();
      return (data.vulnerabilities || []).map((v) => mapCVE(v));
    } catch (e) {
      return [];
    }
  });
  electron.ipcMain.handle("cve:recent", async (_, count = 10) => {
    try {
      const res = await fetch(`${NVD_BASE}?resultsPerPage=${count}&startIndex=0`);
      const data = await res.json();
      return (data.vulnerabilities || []).map((v) => mapCVE(v));
    } catch {
      return [];
    }
  });
}
function registerAIHandlers() {
  electron.ipcMain.handle("ai:chat", async (_, messages) => {
    const store = getSettingsStore();
    const apiKey = store.get("ai.apiKey", "");
    if (!apiKey) throw new Error("NO_API_KEY");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: "You are a cybersecurity expert assistant embedded in CryoGram OS, a security operations desktop. Help with penetration testing concepts, security analysis, code review, vulnerability assessment, and security tool usage. Always remind users to only test systems they have explicit authorization to test.",
        messages
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API error ${res.status}: ${err}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text || "";
  });
}
let captureProc = null;
let packetId = 0;
function registerPacketSnifferHandlers() {
  electron.ipcMain.handle("packetSniffer:start", async (event, iface, filter) => {
    if (captureProc) {
      captureProc.kill();
      captureProc = null;
    }
    packetId = 0;
    const hasTshark = await commandExists("tshark");
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    if (hasTshark) {
      const args = [
        "-i",
        iface,
        "-T",
        "fields",
        "-e",
        "frame.number",
        "-e",
        "frame.time_relative",
        "-e",
        "ip.src",
        "-e",
        "ip.dst",
        "-e",
        "ip.proto",
        "-e",
        "frame.len",
        "-e",
        "_ws.col.Info",
        "-E",
        "separator=|",
        "-l"
      ];
      if (filter) args.push("-f", filter);
      captureProc = child_process.spawn("tshark", args);
    } else {
      const args = ["-i", iface, "-l", "-n", "-tt"];
      if (filter) args.push(filter);
      captureProc = child_process.spawn("tcpdump", args);
    }
    captureProc.stdout?.on("data", (chunk) => {
      const lines = chunk.toString().trim().split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split("|");
        const pkt = {
          id: ++packetId,
          time: parts[1] ? parseFloat(parts[1]).toFixed(6) : (/* @__PURE__ */ new Date()).toISOString().slice(11, 23),
          src: parts[2] || "?",
          dst: parts[3] || "?",
          proto: protoName(parts[4] || ""),
          len: parseInt(parts[5]) || 0,
          info: parts[6] || line.slice(0, 80)
        };
        win?.webContents.send("packetSniffer:packet", pkt);
      }
    });
    captureProc.on("error", () => {
    });
    return null;
  });
  electron.ipcMain.handle("packetSniffer:stop", async () => {
    if (captureProc) {
      captureProc.kill();
      captureProc = null;
    }
  });
}
function protoName(proto) {
  const map = { "6": "TCP", "17": "UDP", "1": "ICMP", "58": "ICMPv6", "89": "OSPF" };
  return map[proto] || proto || "OTHER";
}
async function commandExists(cmd) {
  return new Promise((res) => {
    const p = child_process.spawn("which", [cmd]);
    p.on("close", (code) => res(code === 0));
    p.on("error", () => res(false));
  });
}
const BACKUP_DIR = path.join(os.homedir(), ".cryogram", "backups");
const CONFIG_DIR = path.join(os.homedir(), ".cryogram");
function registerBackupHandlers() {
  electron.ipcMain.handle("backup:list", async () => {
    try {
      await fs$1.promises.mkdir(BACKUP_DIR, { recursive: true });
      const entries = await fs$1.promises.readdir(BACKUP_DIR);
      const metas = [];
      for (const e of entries) {
        if (!e.endsWith(".json")) continue;
        try {
          const raw = await fs$1.promises.readFile(path.join(BACKUP_DIR, e), "utf-8");
          metas.push(JSON.parse(raw));
        } catch {
        }
      }
      return metas.sort((a, b) => b.created.localeCompare(a.created));
    } catch {
      return [];
    }
  });
  electron.ipcMain.handle("backup:create", async (event) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    await fs$1.promises.mkdir(BACKUP_DIR, { recursive: true });
    const id = Date.now().toString();
    const name = `Backup ${(/* @__PURE__ */ new Date()).toLocaleString()}`;
    const dest = path.join(BACKUP_DIR, id);
    await fs$1.promises.mkdir(dest, { recursive: true });
    const sources = [CONFIG_DIR];
    let items = 0;
    win?.webContents.send("backup:progress", "Scanning files…", 10);
    for (const src of sources) {
      try {
        const files = await walkDir(src);
        const total = files.length;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const rel = path.relative(src, file);
          const out = path.join(dest, rel);
          await fs$1.promises.mkdir(path.dirname(out), { recursive: true });
          await fs$1.promises.copyFile(file, out);
          items++;
          win?.webContents.send("backup:progress", `Backing up: ${rel}`, 10 + Math.round(i / total * 80));
        }
      } catch {
      }
    }
    const stat = await fs$1.promises.stat(dest).catch(() => ({ size: 0 }));
    const meta = { id, name, size: formatSize(stat.size), created: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " "), status: "complete", items };
    await fs$1.promises.writeFile(path.join(BACKUP_DIR, `${id}.json`), JSON.stringify(meta));
    win?.webContents.send("backup:progress", "Complete", 100);
    return meta;
  });
  electron.ipcMain.handle("backup:restore", async (_, id) => {
    const src = path.join(BACKUP_DIR, id);
    const files = await walkDir(src);
    for (const file of files) {
      const rel = path.relative(src, file);
      const dest = path.join(CONFIG_DIR, rel);
      await fs$1.promises.mkdir(path.dirname(dest), { recursive: true });
      await fs$1.promises.copyFile(file, dest);
    }
    return true;
  });
  electron.ipcMain.handle("backup:delete", async (_, id) => {
    await fs$1.promises.rm(path.join(BACKUP_DIR, id), { recursive: true, force: true });
    await fs$1.promises.rm(path.join(BACKUP_DIR, `${id}.json`), { force: true });
    return true;
  });
}
async function walkDir(dir) {
  const files = [];
  try {
    const entries = await fs$1.promises.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) files.push(...await walkDir(full));
      else files.push(full);
    }
  } catch {
  }
  return files;
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
const LOG_PATH = path.join(os.homedir(), ".cryogram", "audit.log.jsonl");
async function appendEntry(entry) {
  await fs$1.promises.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs$1.promises.appendFile(LOG_PATH, JSON.stringify(entry) + "\n", "utf-8");
}
function registerAuditLogHandlers() {
  electron.ipcMain.handle("auditLog:list", async () => {
    try {
      const raw = await fs$1.promises.readFile(LOG_PATH, "utf-8");
      const entries = raw.trim().split("\n").filter((l) => l.trim()).map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      }).filter(Boolean);
      return entries.reverse().slice(0, 1e3);
    } catch {
      return [];
    }
  });
  electron.ipcMain.handle("auditLog:append", async (_, entry) => {
    const full = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").slice(0, 19),
      ...entry
    };
    await appendEntry(full);
    return full;
  });
  electron.ipcMain.handle("auditLog:clear", async () => {
    await fs$1.promises.writeFile(LOG_PATH, "", "utf-8");
    return true;
  });
}
const PATTERNS = [
  { regex: /eval\s*\(/g, rule: "NO_EVAL", severity: "HIGH", message: "eval() can execute arbitrary code — use JSON.parse or Function constructor alternatives", fix: "Replace eval() with safer alternatives like JSON.parse() for data" },
  { regex: /exec\s*\(\s*['"`].*\+/g, rule: "CMD_INJECTION", severity: "CRITICAL", message: "Potential command injection via string concatenation in exec()", fix: "Use execFile() with an args array instead of string concatenation" },
  { regex: /password\s*=\s*['"`][^'"` ]{6,}/gi, rule: "HARDCODED_CREDENTIAL", severity: "CRITICAL", message: "Hardcoded password detected", fix: "Use environment variables or a secrets manager" },
  { regex: /api[_-]?key\s*=\s*['"`][A-Za-z0-9_\-]{16,}/gi, rule: "HARDCODED_API_KEY", severity: "CRITICAL", message: "Hardcoded API key detected", fix: "Load secrets from environment variables" },
  { regex: /md5\s*\(/gi, rule: "WEAK_HASH", severity: "MEDIUM", message: "MD5 is cryptographically broken — do not use for security purposes", fix: "Use SHA-256 or bcrypt/argon2 for passwords" },
  { regex: /sha1\s*\(/gi, rule: "WEAK_HASH_SHA1", severity: "MEDIUM", message: "SHA1 is weak for cryptographic use", fix: "Use SHA-256 or stronger" },
  { regex: /innerHTML\s*=/g, rule: "XSS_RISK", severity: "HIGH", message: "innerHTML assignment can lead to XSS if content is user-controlled", fix: "Use textContent or DOMPurify to sanitize HTML" },
  { regex: /document\.write\s*\(/g, rule: "XSS_DOCUMENT_WRITE", severity: "HIGH", message: "document.write() is dangerous and deprecated", fix: "Use DOM manipulation methods instead" },
  { regex: /dangerouslySetInnerHTML/g, rule: "REACT_XSS", severity: "MEDIUM", message: "dangerouslySetInnerHTML can lead to XSS — ensure content is sanitized", fix: "Sanitize content with DOMPurify before use" },
  { regex: /Math\.random\s*\(\s*\)/g, rule: "WEAK_RANDOM", severity: "LOW", message: "Math.random() is not cryptographically secure", fix: "Use crypto.getRandomValues() for security-sensitive randomness" },
  { regex: /require\s*\(['"`]child_process['"`]\)/g, rule: "CHILD_PROCESS", severity: "INFO", message: "child_process usage — ensure inputs are validated and sanitized" },
  { regex: /console\.log\s*\(.*password/gi, rule: "LOG_SENSITIVE", severity: "MEDIUM", message: "Sensitive data may be logged to console", fix: "Remove logging of sensitive information" }
];
async function patternScan(targetPath, event) {
  const win = electron.BrowserWindow.fromWebContents(event.sender);
  const findings = [];
  const exts = [".js", ".ts", ".jsx", ".tsx", ".py", ".rb", ".php", ".go", ".java", ".cs", ".cpp", ".c"];
  let scanned = 0;
  async function scanFile(filePath) {
    try {
      const content = await fs$1.promises.readFile(filePath, "utf-8");
      const lines = content.split("\n");
      for (const { regex, rule, severity, message, fix } of PATTERNS) {
        regex.lastIndex = 0;
        let match;
        const linesSeen = /* @__PURE__ */ new Set();
        while ((match = regex.exec(content)) !== null) {
          const lineNum = content.slice(0, match.index).split("\n").length;
          if (linesSeen.has(lineNum)) continue;
          linesSeen.add(lineNum);
          findings.push({
            id: `${rule}-${filePath}-${lineNum}`,
            severity,
            rule,
            file: filePath,
            line: lineNum,
            code: lines[lineNum - 1]?.trim() || match[0],
            message,
            fix
          });
        }
      }
      scanned++;
    } catch {
    }
  }
  async function walk(dir, depth = 0) {
    if (depth > 8) return;
    try {
      const entries = await fs$1.promises.readdir(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.name.startsWith(".") || e.name === "node_modules" || e.name === ".git") continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) await walk(full, depth + 1);
        else if (exts.includes(path.extname(e.name))) await scanFile(full);
      }
    } catch {
    }
  }
  const stat = await fs$1.promises.stat(targetPath);
  if (stat.isDirectory()) {
    win?.webContents.send("codeScanner:progress", 15);
    await walk(targetPath);
  } else {
    await scanFile(targetPath);
  }
  win?.webContents.send("codeScanner:progress", 80);
  return findings;
}
function registerCodeScannerHandlers() {
  electron.ipcMain.handle("codeScanner:browse", async (event) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    const result = await electron.dialog.showOpenDialog(win, {
      properties: ["openDirectory", "openFile"],
      title: "Select project to scan"
    });
    return result.filePaths[0] || null;
  });
  electron.ipcMain.handle("codeScanner:scan", async (event, targetPath, scannerPref) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    const start = Date.now();
    win?.webContents.send("codeScanner:progress", 5);
    let findings = [];
    let scanner = "Pattern-based";
    if (scannerPref === "semgrep") {
      try {
        findings = await runSemgrep(targetPath);
        scanner = "semgrep";
      } catch {
        findings = await patternScan(targetPath, event);
      }
    } else if (scannerPref === "bandit (Python)") {
      try {
        findings = await runBandit(targetPath);
        scanner = "bandit";
      } catch {
        findings = await patternScan(targetPath, event);
      }
    } else if (scannerPref === "npm audit") {
      try {
        findings = await runNpmAudit(targetPath);
        scanner = "npm audit";
      } catch {
        findings = await patternScan(targetPath, event);
      }
    } else if (scannerPref === "eslint-security") {
      try {
        findings = await runEslintSecurity(targetPath);
        scanner = "eslint-security";
      } catch {
        findings = await patternScan(targetPath, event);
      }
    } else if (scannerPref === "Pattern-based") {
      findings = await patternScan(targetPath, event);
    } else {
      let detected = false;
      try {
        findings = await runSemgrep(targetPath);
        scanner = "semgrep";
        detected = true;
      } catch {
      }
      if (!detected) {
        try {
          const hasPy = await hasPythonFiles(targetPath);
          if (hasPy) {
            findings = await runBandit(targetPath);
            scanner = "bandit";
            detected = true;
          }
        } catch {
        }
      }
      if (!detected) {
        try {
          const hasPkg = await hasPackageJson(targetPath);
          if (hasPkg) {
            findings = await runNpmAudit(targetPath);
            scanner = "npm audit";
            detected = true;
          }
        } catch {
        }
      }
      if (!detected) {
        findings = await patternScan(targetPath, event);
      }
    }
    let scanned = 0;
    try {
      const stat = await fs$1.promises.stat(targetPath);
      if (stat.isDirectory()) {
        const count = { n: 0 };
        await countFiles(targetPath, count);
        scanned = count.n;
      } else {
        scanned = 1;
      }
    } catch {
    }
    win?.webContents.send("codeScanner:progress", 100);
    return { findings, scanned, duration: Date.now() - start, scanner };
  });
}
async function runSemgrep(targetPath) {
  return new Promise((resolve, reject) => {
    const proc2 = child_process.spawn("semgrep", ["--config=auto", "--json", targetPath], { timeout: 6e4 });
    let out = "";
    proc2.stdout.on("data", (d) => out += d);
    proc2.on("close", (code) => {
      if (code !== 0) {
        reject(new Error("semgrep failed"));
        return;
      }
      try {
        const data = JSON.parse(out);
        resolve((data.results || []).map((r, i) => ({
          id: `semgrep-${i}`,
          severity: (r.extra?.severity || "INFO").toUpperCase(),
          rule: r.check_id || "semgrep",
          file: r.path,
          line: r.start?.line || 0,
          code: r.extra?.lines || "",
          message: r.extra?.message || "",
          fix: r.extra?.fix
        })));
      } catch {
        reject(new Error("Failed to parse semgrep output"));
      }
    });
    proc2.on("error", reject);
  });
}
async function runBandit(targetPath) {
  return new Promise((resolve, reject) => {
    const args = ["-r", targetPath, "-f", "json", "-q"];
    const proc2 = child_process.spawn("bandit", args, { timeout: 6e4 });
    let out = "";
    let err = "";
    proc2.stdout.on("data", (d) => out += d);
    proc2.stderr.on("data", (d) => err += d);
    proc2.on("close", () => {
      try {
        const data = JSON.parse(out || err);
        const results = data.results || [];
        resolve(results.map((r, i) => ({
          id: `bandit-${i}`,
          severity: mapBanditSeverity(r.issue_severity),
          rule: r.test_id || r.test_name || "bandit",
          file: r.filename,
          line: r.line_number || 0,
          code: r.code?.trim() || "",
          message: r.issue_text || "",
          fix: r.more_info ? `See: ${r.more_info}` : void 0
        })));
      } catch {
        reject(new Error("Failed to parse bandit output"));
      }
    });
    proc2.on("error", reject);
  });
}
function mapBanditSeverity(s) {
  const u = (s || "").toUpperCase();
  if (u === "HIGH") return "HIGH";
  if (u === "MEDIUM") return "MEDIUM";
  if (u === "LOW") return "LOW";
  return "INFO";
}
async function runNpmAudit(targetPath) {
  return new Promise((resolve, reject) => {
    const cwd = await_stat_isDirectory(targetPath) ? targetPath : path.dirname(targetPath);
    const proc2 = child_process.spawn("npm", ["audit", "--json"], { cwd, timeout: 6e4 });
    let out = "";
    proc2.stdout.on("data", (d) => out += d);
    proc2.on("close", () => {
      try {
        const data = JSON.parse(out);
        const vulns = data.vulnerabilities || {};
        const findings = [];
        let idx = 0;
        for (const [name, v] of Object.entries(vulns)) {
          const severity = mapNpmSeverity(v.severity);
          const vias = Array.isArray(v.via) ? v.via.filter((x) => typeof x === "object") : [];
          const msg = vias.length > 0 ? vias.map((x) => x.title || x.url || "").join("; ") : `Vulnerability in ${name}`;
          findings.push({
            id: `npm-audit-${idx++}`,
            severity,
            rule: `NPM:${name}`,
            file: "package.json",
            line: 0,
            code: `"${name}": "${v.range || v.version || "unknown"}"`,
            message: msg,
            fix: v.fixAvailable ? `Run: npm audit fix` : "No automatic fix available — update manually"
          });
        }
        resolve(findings);
      } catch {
        reject(new Error("Failed to parse npm audit output"));
      }
    });
    proc2.on("error", reject);
  });
}
async function runEslintSecurity(targetPath) {
  return new Promise((resolve, reject) => {
    const cwd = await_stat_isDirectory(targetPath) ? targetPath : path.dirname(targetPath);
    const proc2 = child_process.spawn("npx", ["eslint", "--format", "json", await_stat_isDirectory(targetPath) ? "." : targetPath], {
      cwd,
      timeout: 6e4
    });
    let out = "";
    proc2.stdout.on("data", (d) => out += d);
    proc2.on("close", () => {
      try {
        const data = JSON.parse(out);
        const findings = [];
        let idx = 0;
        for (const file of data) {
          for (const msg of file.messages || []) {
            if (msg.severity === 0) continue;
            findings.push({
              id: `eslint-${idx++}`,
              severity: msg.severity >= 2 ? "HIGH" : "MEDIUM",
              rule: msg.ruleId || "eslint",
              file: file.filePath,
              line: msg.line || 0,
              code: msg.source || "",
              message: msg.message || ""
            });
          }
        }
        resolve(findings);
      } catch {
        reject(new Error("Failed to parse eslint output"));
      }
    });
    proc2.on("error", reject);
  });
}
function await_stat_isDirectory(p) {
  try {
    return fs$1.statSync(p).isDirectory();
  } catch {
    return false;
  }
}
function mapNpmSeverity(s) {
  const u = (s || "").toUpperCase();
  if (u === "CRITICAL") return "CRITICAL";
  if (u === "HIGH") return "HIGH";
  if (u === "MODERATE" || u === "MEDIUM") return "MEDIUM";
  if (u === "LOW") return "LOW";
  return "INFO";
}
async function hasPythonFiles(targetPath) {
  try {
    const stat = await fs$1.promises.stat(targetPath);
    if (!stat.isDirectory()) return path.extname(targetPath) === ".py";
    const entries = await fs$1.promises.readdir(targetPath, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory() && e.name.endsWith(".py")) return true;
    }
    return false;
  } catch {
    return false;
  }
}
async function hasPackageJson(targetPath) {
  try {
    const check = path.isAbsolute(targetPath) ? targetPath : path.resolve(targetPath);
    const stat = await fs$1.promises.stat(check);
    const dir = stat.isDirectory() ? check : path.dirname(check);
    await fs$1.promises.access(path.join(dir, "package.json"));
    return true;
  } catch {
    return false;
  }
}
async function countFiles(dir, count, depth = 0) {
  if (depth > 8) return;
  try {
    const entries = await fs$1.promises.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await countFiles(full, count, depth + 1);
      else count.n++;
    }
  } catch {
  }
}
function base32Decode(str) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  str = str.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const output = [];
  for (const char of str) {
    value = value << 5 | alphabet.indexOf(char);
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      output.push(value >> bits & 255);
    }
  }
  return Buffer.from(output);
}
function generateTOTP(secret) {
  const timeLeft = 30 - Math.floor(Date.now() / 1e3) % 30;
  const counter = Math.floor(Math.floor(Date.now() / 1e3) / 30);
  try {
    const key = base32Decode(secret.replace(/\s/g, ""));
    const buf = Buffer.alloc(8);
    buf.writeUInt32BE(Math.floor(counter / 2 ** 32), 0);
    buf.writeUInt32BE(counter >>> 0, 4);
    const hmac = crypto.createHmac("sha1", key).update(buf).digest();
    const offset = hmac[hmac.length - 1] & 15;
    const code = ((hmac[offset] & 127) << 24 | hmac[offset + 1] << 16 | hmac[offset + 2] << 8 | hmac[offset + 3]) % 1e6;
    return { code: String(code).padStart(6, "0"), timeLeft };
  } catch {
    return { code: "------", timeLeft };
  }
}
function registerTOTPHandlers() {
  function getAccounts() {
    const store = getSettingsStore();
    return store.get("totp.accounts", []);
  }
  function saveAccounts(accounts) {
    const store = getSettingsStore();
    store.set("totp.accounts", accounts);
  }
  electron.ipcMain.handle("totp:list", async () => getAccounts());
  electron.ipcMain.handle("totp:generate", async (_, secret) => generateTOTP(secret));
  electron.ipcMain.handle("totp:add", async (_, account) => {
    const accounts = getAccounts();
    const newAccount = { ...account, id: `totp-${Date.now()}` };
    saveAccounts([...accounts, newAccount]);
    return newAccount;
  });
  electron.ipcMain.handle("totp:remove", async (_, id) => {
    saveAccounts(getAccounts().filter((a) => a.id !== id));
    return true;
  });
}
const WORDLISTS_DIR = path.join(os.homedir(), ".cryogram", "wordlists");
function registerWordlistsHandlers() {
  electron.ipcMain.handle("wordlists:list", async () => {
    await fs$1.promises.mkdir(WORDLISTS_DIR, { recursive: true });
    const entries = await fs$1.promises.readdir(WORDLISTS_DIR).catch(() => []);
    const lists = [];
    for (const e of entries) {
      try {
        const fp = path.join(WORDLISTS_DIR, e);
        const stat = await fs$1.promises.stat(fp);
        const content = await fs$1.promises.readFile(fp, "utf-8");
        lists.push({ name: e, path: fp, lineCount: content.split("\n").filter((l) => l.trim()).length, sizeKB: Math.round(stat.size / 1024) });
      } catch {
      }
    }
    return lists;
  });
  electron.ipcMain.handle("wordlists:preview", async (_, filePath, count = 200) => {
    const content = await fs$1.promises.readFile(filePath, "utf-8");
    return content.split("\n").filter((l) => l.trim()).slice(0, count);
  });
  electron.ipcMain.handle("wordlists:import", async (event) => {
    const result = await electron.dialog.showOpenDialog({ properties: ["openFile"], filters: [{ name: "Text files", extensions: ["txt", "lst", "wordlist"] }] });
    if (result.filePaths[0]) {
      await fs$1.promises.mkdir(WORDLISTS_DIR, { recursive: true });
      const dest = path.join(WORDLISTS_DIR, path.basename(result.filePaths[0]));
      await fs$1.promises.copyFile(result.filePaths[0], dest);
      return dest;
    }
    return null;
  });
  electron.ipcMain.handle("wordlists:delete", async (_, filePath) => {
    await fs$1.promises.rm(filePath, { force: true });
    return true;
  });
  electron.ipcMain.handle("wordlists:generate", async (_, opts) => {
    await fs$1.promises.mkdir(WORDLISTS_DIR, { recursive: true });
    let charset = "";
    if (opts.charsets.includes("lowercase")) charset += "abcdefghijklmnopqrstuvwxyz";
    if (opts.charsets.includes("uppercase")) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (opts.charsets.includes("digits")) charset += "0123456789";
    if (opts.charsets.includes("symbols")) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";
    const words = [];
    for (let i = 0; i < Math.min(opts.count, 1e5); i++) {
      const len = opts.minLen + Math.floor(Math.random() * (opts.maxLen - opts.minLen + 1));
      let word = opts.prefix || "";
      for (let j = 0; j < len; j++) word += charset[Math.floor(Math.random() * charset.length)];
      word += opts.suffix || "";
      words.push(word);
    }
    const name = `generated-${Date.now()}.txt`;
    await fs$1.promises.writeFile(path.join(WORDLISTS_DIR, name), words.join("\n") + "\n", "utf-8");
    return name;
  });
}
function registerPasswordHealthHandlers() {
  electron.ipcMain.handle("passwordHealth:checkHIBP", async (_, password) => {
    const hash = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" }
    });
    if (!res.ok) return { breached: false, count: 0 };
    const text = await res.text();
    const lines = text.split("\n");
    for (const line of lines) {
      const [hashSuffix, countStr] = line.trim().split(":");
      if (hashSuffix === suffix) {
        return { breached: true, count: parseInt(countStr, 10) };
      }
    }
    return { breached: false, count: 0 };
  });
}
const WALLPAPER_DIR = path.join(os.homedir(), ".cryogram", "wallpapers");
function registerWallpaperHandlers() {
  electron.ipcMain.handle("wallpaper:listCustom", async () => {
    await fs$1.promises.mkdir(WALLPAPER_DIR, { recursive: true });
    const entries = await fs$1.promises.readdir(WALLPAPER_DIR).catch(() => []);
    const imgExts = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"];
    return entries.filter((e) => imgExts.includes(path.extname(e).toLowerCase())).map((e) => ({
      id: e,
      name: path.basename(e, path.extname(e)),
      path: path.join(WALLPAPER_DIR, e),
      type: "custom"
    }));
  });
  electron.ipcMain.handle("wallpaper:browse", async (event) => {
    const result = await electron.dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "webp", "gif", "bmp"] }],
      title: "Select wallpaper image"
    });
    if (!result.filePaths[0]) return null;
    await fs$1.promises.mkdir(WALLPAPER_DIR, { recursive: true });
    const dest = path.join(WALLPAPER_DIR, path.basename(result.filePaths[0]));
    await fs$1.promises.copyFile(result.filePaths[0], dest);
    return dest;
  });
}
const MAX_HISTORY = 200;
let history = [];
let lastText = "";
function poll() {
  try {
    const text = electron.clipboard.readText();
    if (text && text !== lastText && text.trim().length > 0) {
      lastText = text;
      const entry = { id: `clip-${Date.now()}`, text, ts: Date.now(), pinned: false };
      history = [entry, ...history.filter((e) => e.text !== text)].slice(0, MAX_HISTORY);
      electron.BrowserWindow.getAllWindows().forEach(
        (w) => w.webContents.send("clipboard:change", entry)
      );
    }
  } catch {
  }
}
function registerClipboardHistoryHandlers() {
  setInterval(poll, 600);
  electron.ipcMain.handle("clipboard:getAll", () => history);
  electron.ipcMain.handle("clipboard:copy", (_, id) => {
    const entry = history.find((e) => e.id === id);
    if (entry) {
      electron.clipboard.writeText(entry.text);
      lastText = entry.text;
    }
  });
  electron.ipcMain.handle("clipboard:pin", (_, id) => {
    history = history.map((e) => e.id === id ? { ...e, pinned: !e.pinned } : e);
    return history;
  });
  electron.ipcMain.handle("clipboard:delete", (_, id) => {
    history = history.filter((e) => e.id !== id);
    return history;
  });
  electron.ipcMain.handle("clipboard:clear", () => {
    history = history.filter((e) => e.pinned);
    return history;
  });
}
function registerColorPickerHandlers() {
  const store = getSettingsStore();
  function getPalettes() {
    return store.get("color_palettes") ?? [];
  }
  electron.ipcMain.handle("colorPicker:getPalettes", () => getPalettes());
  electron.ipcMain.handle("colorPicker:savePalette", (_, palette) => {
    const palettes = getPalettes();
    const newPalette = { ...palette, id: `pal-${Date.now()}`, createdAt: Date.now() };
    store.set("color_palettes", [...palettes, newPalette]);
    return newPalette;
  });
  electron.ipcMain.handle("colorPicker:updatePalette", (_, id, patch) => {
    const updated = getPalettes().map((p) => p.id === id ? { ...p, ...patch } : p);
    store.set("color_palettes", updated);
    return updated;
  });
  electron.ipcMain.handle("colorPicker:deletePalette", (_, id) => {
    const updated = getPalettes().filter((p) => p.id !== id);
    store.set("color_palettes", updated);
    return updated;
  });
}
const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg", ".ico", ".tiff", ".avif"];
function registerImageViewerHandlers() {
  electron.ipcMain.handle("imageViewer:open", async (event) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    const result = await electron.dialog.showOpenDialog(win, {
      title: "Open Image",
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "ico", "tiff", "avif"] }],
      properties: ["openFile"]
    });
    const filePath = result.filePaths[0];
    if (!filePath) return null;
    return readImageFile(filePath);
  });
  electron.ipcMain.handle("imageViewer:readFile", async (_, filePath) => {
    return readImageFile(filePath);
  });
  electron.ipcMain.handle("imageViewer:browseDir", async (event, dirPath) => {
    try {
      const entries = await fs$1.promises.readdir(dirPath, { withFileTypes: true });
      const images = entries.filter((e) => !e.isDirectory() && IMAGE_EXTS.includes(path.extname(e.name).toLowerCase())).map((e) => path.join(dirPath, e.name));
      return images;
    } catch {
      return [];
    }
  });
}
async function readImageFile(filePath) {
  try {
    const buf = await fs$1.promises.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase().slice(1);
    const mime = ext === "svg" ? "image/svg+xml" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
    const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
    const stat = await fs$1.promises.stat(filePath);
    return { path: filePath, dataUrl, name: path.basename(filePath), size: stat.size };
  } catch {
    return null;
  }
}
function extractText(xml, tag) {
  const cdataMatch = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i").exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(xml);
  return match ? match[1].replace(/<[^>]+>/g, "").trim() : "";
}
function parseRSS(xml, feedId) {
  const feedTitle = extractText(xml.split("<item")[0], "title") || extractText(xml.split("<entry")[0], "title");
  const feedDesc = extractText(xml.split("<item")[0], "description") || extractText(xml.split("<entry")[0], "subtitle");
  const isAtom = xml.includes("<feed");
  const itemTag = isAtom ? "entry" : "item";
  const parts = xml.split(`<${itemTag}`);
  const items = [];
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const title = extractText(chunk, "title");
    const link = isAtom ? /<link[^>]+href="([^"]+)"/.exec(chunk)?.[1] ?? extractText(chunk, "link") : extractText(chunk, "link");
    const desc = extractText(chunk, isAtom ? "summary" : "description") || extractText(chunk, "content");
    const date = extractText(chunk, isAtom ? "updated" : "pubDate");
    if (title || link) {
      items.push({ id: `${feedId}-${i}`, feedId, title, link, description: desc.slice(0, 400), pubDate: date, read: false });
    }
  }
  return { feed: { title: feedTitle, description: feedDesc }, items: items.slice(0, 50) };
}
async function fetchFeed(url) {
  const res = await fetch(url, { headers: { "User-Agent": "CyberDen RSS Reader/1.0" }, signal: AbortSignal.timeout(15e3) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}
function registerRSSReaderHandlers() {
  const store = getSettingsStore();
  function getFeeds() {
    return store.get("rss_feeds") ?? [];
  }
  function getItems() {
    return store.get("rss_items") ?? [];
  }
  function saveFeeds(feeds) {
    store.set("rss_feeds", feeds);
  }
  function saveItems(items) {
    store.set("rss_items", items.slice(0, 500));
  }
  electron.ipcMain.handle("rss:getFeeds", () => getFeeds());
  electron.ipcMain.handle("rss:getItems", (_, feedId) => {
    const items = getItems();
    return feedId ? items.filter((i) => i.feedId === feedId) : items;
  });
  electron.ipcMain.handle("rss:addFeed", async (_, url) => {
    const feeds = getFeeds();
    if (feeds.find((f) => f.url === url)) throw new Error("Feed already added");
    const xml = await fetchFeed(url);
    const { feed, items } = parseRSS(xml, `feed-${Date.now()}`);
    const newFeed = {
      id: `feed-${Date.now()}`,
      url,
      title: feed.title || url,
      description: feed.description || "",
      lastFetched: Date.now()
    };
    saveFeeds([...feeds, newFeed]);
    const existing = getItems();
    saveItems([...items.map((i) => ({ ...i, feedId: newFeed.id })), ...existing]);
    return { feed: newFeed, items };
  });
  electron.ipcMain.handle("rss:removeFeed", (_, id) => {
    saveFeeds(getFeeds().filter((f) => f.id !== id));
    saveItems(getItems().filter((i) => i.feedId !== id));
  });
  electron.ipcMain.handle("rss:refresh", async (_, id) => {
    const feeds = getFeeds();
    const feed = feeds.find((f) => f.id === id);
    if (!feed) throw new Error("Feed not found");
    const xml = await fetchFeed(feed.url);
    const { feed: meta, items } = parseRSS(xml, id);
    const updated = feeds.map((f) => f.id === id ? { ...f, title: meta.title || f.title, lastFetched: Date.now() } : f);
    saveFeeds(updated);
    const existing = getItems().filter((i) => i.feedId !== id);
    saveItems([...items, ...existing]);
    return items;
  });
  electron.ipcMain.handle("rss:markRead", (_, itemId) => {
    saveItems(getItems().map((i) => i.id === itemId ? { ...i, read: true } : i));
  });
  electron.ipcMain.handle("rss:markAllRead", (_, feedId) => {
    saveItems(getItems().map((i) => i.feedId === feedId ? { ...i, read: true } : i));
  });
}
const sh = util.promisify(child_process.exec);
const VNC_PORT = 5900;
const WS_PORT = 6080;
const HTTP_PORT = 6081;
let vncProc = null;
let wsProc = null;
let httpServer = null;
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "127.0.0.1";
}
async function novncDir() {
  const candidates = [
    "/usr/share/novnc",
    "/usr/share/noVNC",
    "/opt/novnc"
  ];
  for (const dir of candidates) {
    try {
      await fs.access(path.join(dir, "vnc.html"));
      return dir;
    } catch {
    }
    try {
      await fs.access(path.join(dir, "vnc_lite.html"));
      return dir;
    } catch {
    }
    try {
      await fs.access(path.join(dir, "core/rfb.js"));
      return dir;
    } catch {
    }
  }
  return null;
}
function startHTTPServer(webRoot) {
  if (httpServer) {
    httpServer.close();
    httpServer = null;
  }
  httpServer = http.createServer(async (req, res) => {
    if (!webRoot) {
      const ip = getLocalIP();
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CyberDen Remote Desktop</title>
<style>body{font-family:system-ui,sans-serif;background:#0a0a0a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:16px}
h2{color:#10b981;margin:0}p{color:#64748b;margin:0;font-size:14px}a{display:inline-block;padding:12px 24px;background:#10b981;color:#000;text-decoration:none;border-radius:8px;font-weight:600;margin-top:8px}</style>
</head><body>
<h2>CyberDen Remote Desktop</h2>
<p>Loading remote desktop client…</p>
<a href="https://novnc.com/noVNC/vnc.html?host=${ip}&port=${WS_PORT}&autoconnect=1&resize=remote">Launch Remote Desktop</a>
<p style="margin-top:16px;font-size:12px">Or install novnc on the host: <code>sudo apt install novnc</code></p>
</body></html>`;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }
    let urlPath = req.url?.split("?")[0] ?? "/";
    if (urlPath === "/" || urlPath === "/index.html") {
      const candidates = ["vnc.html", "vnc_lite.html"];
      let served = false;
      for (const f of candidates) {
        try {
          const content = await fs.readFile(path.join(webRoot, f));
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content);
          served = true;
          break;
        } catch {
        }
      }
      if (!served) {
        res.writeHead(404);
        res.end("Not found");
      }
      return;
    }
    const ext = path.extname(urlPath);
    const mimeMap = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".ico": "image/x-icon",
      ".wasm": "application/wasm"
    };
    try {
      const content = await fs.readFile(path.join(webRoot, urlPath));
      res.writeHead(200, { "Content-Type": mimeMap[ext] ?? "application/octet-stream" });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
  httpServer.listen(HTTP_PORT);
}
function registerRemoteDesktopHandlers() {
  electron.ipcMain.handle("remoteDesktop:checkDeps", async () => {
    const [x11vnc, websockify, novnc] = await Promise.all([
      sh("which x11vnc").then(() => true).catch(() => false),
      sh("which websockify || which websockify3").then(() => true).catch(() => false),
      novncDir().then((d) => !!d)
    ]);
    return { x11vnc, websockify, novnc };
  });
  electron.ipcMain.handle("remoteDesktop:installDeps", async (event) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    const send = (msg) => win?.webContents.send("remoteDesktop:log", msg);
    try {
      send("Installing x11vnc and novnc…");
      await sh("apt-get install -y x11vnc novnc 2>&1");
      send("Done.");
      return { ok: true };
    } catch (e) {
      send(`Error: ${e.message}`);
      return { ok: false, error: e.message };
    }
  });
  electron.ipcMain.handle("remoteDesktop:start", async (event, opts) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    const send = (msg) => win?.webContents.send("remoteDesktop:log", msg);
    if (vncProc) {
      vncProc.kill();
      vncProc = null;
    }
    if (wsProc) {
      wsProc.kill();
      wsProc = null;
    }
    try {
      await sh("pkill -f x11vnc 2>/dev/null");
    } catch {
    }
    const vncPort = opts.vncPort ?? VNC_PORT;
    const vncArgs = ["-display", ":0", "-rfbport", String(vncPort), "-forever", "-shared"];
    if (opts.password) vncArgs.push("-passwd", opts.password);
    else vncArgs.push("-nopw");
    if (opts.viewOnly) vncArgs.push("-viewonly");
    send("Starting VNC server…");
    vncProc = child_process.spawn("x11vnc", vncArgs, { detached: false });
    vncProc.stderr?.on("data", (d) => send(d.toString().trim()));
    vncProc.on("exit", (code) => {
      vncProc = null;
      send(`VNC server exited (code ${code})`);
      electron.BrowserWindow.getAllWindows().forEach((w) => w.webContents.send("remoteDesktop:stopped"));
    });
    await new Promise((r) => setTimeout(r, 1200));
    let wsBin = "websockify";
    try {
      await sh("which websockify");
    } catch {
      try {
        await sh("which websockify3");
        wsBin = "websockify3";
      } catch {
      }
    }
    send("Starting WebSocket proxy…");
    wsProc = child_process.spawn(wsBin, [String(WS_PORT), `localhost:${vncPort}`], { detached: false });
    wsProc.stderr?.on("data", (d) => send(d.toString().trim()));
    wsProc.on("exit", () => {
      wsProc = null;
    });
    const webRoot = await novncDir();
    send(webRoot ? `Serving noVNC from ${webRoot}` : "noVNC not found locally — using CDN fallback");
    startHTTPServer(webRoot);
    const ip = getLocalIP();
    const url = `http://${ip}:${HTTP_PORT}`;
    send(`Ready — connect from: ${url}`);
    return { ok: true, ip, vncPort, wsPort: WS_PORT, httpPort: HTTP_PORT, url };
  });
  electron.ipcMain.handle("remoteDesktop:stop", async () => {
    if (vncProc) {
      vncProc.kill("SIGTERM");
      vncProc = null;
    }
    if (wsProc) {
      wsProc.kill("SIGTERM");
      wsProc = null;
    }
    if (httpServer) {
      httpServer.close();
      httpServer = null;
    }
    try {
      await sh("pkill -f x11vnc 2>/dev/null");
    } catch {
    }
    return { ok: true };
  });
  electron.ipcMain.handle("remoteDesktop:status", async () => ({
    running: !!(vncProc && wsProc),
    vncAlive: !!vncProc,
    wsAlive: !!wsProc
  }));
  electron.ipcMain.handle("remoteDesktop:getIP", async () => getLocalIP());
  electron.ipcMain.handle("remoteDesktop:tailscaleStatus", async () => {
    try {
      const { stdout } = await sh("tailscale status --json 2>/dev/null");
      const data = JSON.parse(stdout);
      const self = data?.Self;
      const ip = self?.TailscaleIPs?.[0] ?? "";
      const hostname = self?.HostName ?? "";
      const running = data?.BackendState === "Running";
      return { installed: true, running, ip, hostname };
    } catch {
      try {
        await sh("which tailscale");
        return { installed: true, running: false, ip: "", hostname: "" };
      } catch {
        return { installed: false, running: false, ip: "", hostname: "" };
      }
    }
  });
  electron.ipcMain.handle("remoteDesktop:installTailscale", async (event) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    const send = (msg) => win?.webContents.send("remoteDesktop:log", msg);
    try {
      send("Downloading Tailscale installer…");
      await sh("curl -fsSL https://tailscale.com/install.sh | sh 2>&1");
      send('Tailscale installed. Run "tailscale up" to authenticate.');
      return { ok: true };
    } catch (e) {
      send(`Install failed: ${e.message}`);
      return { ok: false, error: e.message };
    }
  });
  electron.ipcMain.handle("remoteDesktop:tailscaleUp", async (event) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    const send = (msg) => win?.webContents.send("remoteDesktop:log", msg);
    send("Running: tailscale up…");
    return new Promise((resolve) => {
      const proc2 = child_process.spawn("tailscale", ["up", "--accept-routes"], { detached: false });
      proc2.stdout?.on("data", (d) => {
        const line = d.toString().trim();
        send(line);
        const urlMatch = line.match(/https:\/\/login\.tailscale\.com\/\S+/);
        if (urlMatch) electron.shell.openExternal(urlMatch[0]);
      });
      proc2.stderr?.on("data", (d) => {
        const line = d.toString().trim();
        send(line);
        const urlMatch = line.match(/https:\/\/login\.tailscale\.com\/\S+/);
        if (urlMatch) electron.shell.openExternal(urlMatch[0]);
      });
      proc2.on("close", (code) => {
        send(code === 0 ? "Tailscale connected." : `tailscale up exited (code ${code})`);
        resolve({ ok: code === 0 });
      });
    });
  });
}
if (!utils.is.dev) {
  try {
    const PERSISTENT_USERDATA = "/opt/cryogram-data";
    const defaultPath = electron.app.getPath("userData");
    if (!fs$1.existsSync(PERSISTENT_USERDATA)) {
      fs$1.mkdirSync(PERSISTENT_USERDATA, { recursive: true, mode: 493 });
      if (fs$1.existsSync(defaultPath) && defaultPath !== PERSISTENT_USERDATA) {
        try {
          child_process.execFileSync("cp", ["-rp", defaultPath + "/.", PERSISTENT_USERDATA]);
        } catch {
        }
      }
    }
    electron.app.setPath("userData", PERSISTENT_USERDATA);
  } catch {
  }
}
let mainWindow = null;
let screenLocked = false;
function lockScreen() {
  if (!mainWindow) return;
  screenLocked = true;
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
      if (screenLocked) return;
      if (mainWindow?.isMinimized() || !mainWindow?.isVisible()) {
        mainWindow?.show();
        mainWindow?.maximize();
        mainWindow?.focus();
      } else {
        mainWindow?.minimize();
      }
    });
    electron.globalShortcut.register("Super+Tab", () => {
    });
    [1, 2, 3, 4].forEach((n) => {
      electron.globalShortcut.register(`Super+${n}`, () => {
        if (screenLocked) return;
        const { exec: exec2 } = require("child_process");
        exec2(`wmctrl -s ${n - 1} 2>/dev/null`);
        mainWindow?.webContents.send("workspace:changed", n - 1);
      });
    });
    electron.globalShortcut.register("Super+L", () => lockScreen());
    electron.globalShortcut.register("CommandOrControl+Alt+T", () => {
      if (screenLocked) return;
      mainWindow?.webContents.send("open:app", "terminal");
    });
    electron.globalShortcut.register("CommandOrControl+Space", () => {
      if (screenLocked) return;
      mainWindow?.webContents.send("open:spotlight");
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
      if (screenLocked) return;
      mainWindow?.webContents.send("app:switcher", "next");
    });
    electron.globalShortcut.register("Alt+Shift+Tab", () => {
      if (screenLocked) return;
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
  electron.ipcMain.handle("wm:hideShell", () => {
    mainWindow?.minimize();
    return true;
  });
  electron.ipcMain.on("screen:unlock", () => {
    screenLocked = false;
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
  registerUpdaterHandlers();
  registerNetworkScannerHandlers();
  registerVpnHandlers();
  registerPasswordManagerHandlers();
  registerSSHKeyHandlers();
  registerFirewallHandlers();
  registerProcessHandlers();
  registerLogHandlers();
  registerNetmonHandlers();
  registerScreenshotHandlers();
  registerCertHandlers();
  registerDockerHandlers();
  registerGitHandlers();
  registerDatabaseHandlers();
  registerTrashHandlers();
  registerShodanHandlers();
  registerOSINTHandlers();
  registerCVEHandlers();
  registerAIHandlers();
  registerPacketSnifferHandlers();
  registerBackupHandlers();
  registerAuditLogHandlers();
  registerCodeScannerHandlers();
  registerTOTPHandlers();
  registerWordlistsHandlers();
  registerPasswordHealthHandlers();
  registerWallpaperHandlers();
  registerClipboardHistoryHandlers();
  registerColorPickerHandlers();
  registerImageViewerHandlers();
  registerRSSReaderHandlers();
  registerRemoteDesktopHandlers();
  createWindow();
  startNotificationBridge();
  electron.powerMonitor.on("resume", () => lockScreen());
  electron.powerMonitor.on("lock-screen", () => lockScreen());
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("before-quit", () => {
  electron.globalShortcut.unregisterAll();
  killLaunchedApps();
  stopNotificationBridge();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
