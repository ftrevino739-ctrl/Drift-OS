import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";
const PASSWORD = process.env.DRIFT_MOD_PASSWORD || "drift-on-top";
const DRIFT_URL = process.env.DRIFT_URL || "/os";
function pickDir() {
  const preferred = process.env.DATA_DIR || path.join(__dirname, "data");
  const candidates = [preferred, path.join(__dirname, "data"), "/tmp/drift-mod-data"];
  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      const probe = path.join(dir, ".write-test");
      fs.writeFileSync(probe, "ok");
      fs.unlinkSync(probe);
      return dir;
    } catch {
      /* try the next place that this machine can actually write */
    }
  }
  return "/tmp/drift-mod-data";
}
const DATA_DIR = pickDir();
const STORE = path.join(DATA_DIR, "store.json");

function load() {
  try {
    const db = JSON.parse(fs.readFileSync(STORE, "utf8"));
    if (!Array.isArray(db.requests)) db.requests = [];
    if (!db.sessions || typeof db.sessions !== "object") db.sessions = {};
    if (!Array.isArray(db.live)) db.live = [];
    if (!db.asks || typeof db.asks !== "object") db.asks = {};
    if (!db.usage || typeof db.usage !== "object") db.usage = { month: "", apps: {} };
    if (typeof db.universal !== "string") db.universal = "";
    const before = db.requests.length;
    db.requests = db.requests.filter((r) => r.status !== "denied");
    if (db.requests.length !== before) save(db);
    return db;
  } catch {
    return { requests: [], sessions: {}, live: [], asks: {}, usage: { month: "", apps: {} }, universal: "" };
  }
}
function save(db) {
  const tmp = STORE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, STORE);
}
function hash(s) {
  return crypto.createHash("sha256").update(String(s)).digest("hex");
}
function passOk(given) {
  const a = Buffer.from(hash(given));
  const b = Buffer.from(hash(PASSWORD));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function cookies(req) {
  const out = {};
  String(req.headers.cookie || "").split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
function sessionUser(req, db) {
  const tok = cookies(req).dm;
  if (!tok || !db.sessions[tok]) return null;
  if (db.sessions[tok] < Date.now()) {
    delete db.sessions[tok];
    save(db);
    return null;
  }
  return tok;
}
function readBody(req) {
  if (Object.prototype.hasOwnProperty.call(req, "_json")) return Promise.resolve(req._json || {});
  return new Promise((resolve, reject) => {
    const chunks = [];
    let n = 0;
    req.on("data", (c) => {
      n += c.length;
      if (n > 100000) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error("bad json")); }
    });
    req.on("error", reject);
  });
}
function send(res, code, obj, extra) {
  const body = JSON.stringify(obj);
  const headers = Object.assign({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
  }, extra || {});
  res.writeHead(code, headers);
  res.end(body);
}
function publicRequest(r) {
  return {
    id: r.id,
    time: r.time,
    username: r.username,
    os: r.os,
    device: r.device,
    status: r.status,
    used: !!r.used,
    uses: r.uses || 0,
    maxUses: r.maxUses || 1,
    hwidLimit: r.hwidLimit || 1,
    hwids: (r.hwids || []).length,
    expiresAt: r.expiresAt || null,
    revoked: !!r.revoked,
    lines: r.status === "accepted" ? r.lines || null : null,
  };
}
function addTime(amount, unit) {
  const n = Math.min(7, Math.max(1, Math.floor(Number(amount) || 1)));
  const u = unit === "days" || unit === "months" ? unit : "hours";
  const d = new Date();
  if (u === "days") d.setDate(d.getDate() + n);
  else if (u === "months") d.setMonth(d.getMonth() + n);
  else d.setHours(d.getHours() + n);
  return { amount: n, unit: u, expiresAt: d.toISOString() };
}
function codeDead(row) {
  if (!row || row.revoked) return true;
  if (row.expiresAt && Date.now() > Date.parse(row.expiresAt)) return true;
  return false;
}
function kickRequest(db, requestId) {
  for (const s of db.live || []) if (s.requestId === requestId) s.revoked = true;
}
function makeLines() {
  const raw = crypto.randomBytes(24).toString("base64url");
  const digest = hash(raw);
  const b64 = Buffer.from(raw, "utf8").toString("base64");
  const tag = digest.slice(0, 6);
  return {
    hash: digest,
    lines: [
      `const _0x${tag}=atob("${b64}");`,
      `void function(k){return k&&k.length}(_0x${tag});`,
    ],
  };
}
function extractRaw(code) {
  const m = String(code || "").match(/atob\("([A-Za-z0-9+/=]+)"\)/);
  if (!m) return null;
  try { return Buffer.from(m[1], "base64").toString("utf8"); } catch { return null; }
}

const MIME = { ".html": "text/html; charset=utf-8", ".png": "image/png", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" };

export function handleMod(req, res) {
  const done = async () => {
  const url = new URL(req.url || "/", "http://localhost");
  const db = load();
  try {
    if (req.method === "GET" && (url.pathname === "/healthz" || url.pathname === "/health")) {
      res.writeHead(200, { "content-type": "text/plain", "cache-control": "no-store" });
      res.end("ok");
      return;
    }
    if (req.method === "OPTIONS" && (url.pathname === "/api/ask" || url.pathname === "/api/redeem" || url.pathname === "/api/pulse" || url.pathname === "/api/usage")) {
      res.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "Content-Type",
      });
      res.end();
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/ask") {
      const b = await readBody(req);
      const username = String(b.username || "").trim().slice(0, 64);
      if (!username) return send(res, 400, { error: "Username is required." });
      const key = username.toLowerCase();
      const last = Number(db.asks[key] || 0);
      const left = 30000 - (Date.now() - last);
      if (left > 0) {
        const wait = Math.ceil(left / 1000);
        return send(res, 429, { error: "Wait " + wait + " seconds to ask for another code.", wait });
      }
      db.asks[key] = Date.now();
      const row = {
        id: crypto.randomBytes(8).toString("hex"),
        time: new Date().toISOString(),
        username,
        os: String(b.os || "Unknown").slice(0, 64),
        device: String(b.device || "Unknown").slice(0, 80),
        status: "pending",
        used: false,
        lines: null,
        hash: null,
      };
      db.requests.unshift(row);
      db.requests = db.requests.slice(0, 400);
      save(db);
      return send(res, 200, { ok: true });
    }
    if (req.method === "POST" && url.pathname === "/api/login") {
      const b = await readBody(req);
      if (!passOk(b.password || "")) return send(res, 401, { error: "Wrong access code." });
      const tok = crypto.randomBytes(24).toString("hex");
      db.sessions[tok] = Date.now() + 1000 * 60 * 60 * 12;
      save(db);
      return send(res, 200, { ok: true }, {
        "set-cookie": `dm=${tok}; HttpOnly; Path=/; SameSite=Lax; Max-Age=43200`,
      });
    }
    if (req.method === "POST" && url.pathname === "/api/logout") {
      const tok = cookies(req).dm;
      if (tok) delete db.sessions[tok];
      save(db);
      return send(res, 200, { ok: true }, { "set-cookie": "dm=; HttpOnly; Path=/; Max-Age=0" });
    }
    if (req.method === "GET" && url.pathname === "/api/requests") {
      if (!sessionUser(req, db)) return send(res, 401, { error: "Sign in." });
      return send(res, 200, { requests: db.requests.map(publicRequest) });
    }
    const accept = url.pathname.match(/^\/api\/requests\/([a-f0-9]+)\/(accept|deny|revoke|update)$/);
    if (req.method === "POST" && accept) {
      if (!sessionUser(req, db)) return send(res, 401, { error: "Sign in." });
      const idx = db.requests.findIndex((r) => r.id === accept[1]);
      const row = idx >= 0 ? db.requests[idx] : null;
      if (!row) return send(res, 404, { error: "Request not found." });
      if (accept[2] === "deny") {
        db.requests.splice(idx, 1);
        save(db);
        return send(res, 200, { ok: true });
      }
      if (accept[2] === "revoke") {
        row.revoked = true;
        row.lines = null;
        kickRequest(db, row.id);
        save(db);
        return send(res, 200, { ok: true, request: publicRequest(row) });
      }
      if (accept[2] === "update") {
        const b = await readBody(req);
        const maxUses = Math.min(100, Math.max(1, Math.floor(Number(b.maxUses) || row.maxUses || 1)));
        const hwidLimit = Math.min(20, Math.max(1, Math.floor(Number(b.hwidLimit) || row.hwidLimit || 1)));
        if (hwidLimit !== (row.hwidLimit || 1)) row.hwids = [];
        row.maxUses = maxUses;
        row.hwidLimit = hwidLimit;
        row.used = (row.uses || 0) >= maxUses;
        save(db);
        return send(res, 200, { ok: true, request: publicRequest(row) });
      }
      const b = await readBody(req);
      if (row.status === "accepted" && row.lines && !row.revoked) {
        save(db);
        return send(res, 200, { ok: true, request: publicRequest(row) });
      }
      const made = makeLines();
      const life = addTime(b.amount, b.unit);
      row.status = "accepted";
      row.hash = made.hash;
      row.lines = made.lines;
      row.used = false;
      row.uses = 0;
      row.maxUses = 1;
      row.hwidLimit = 1;
      row.hwids = [];
      row.revoked = false;
      row.amount = life.amount;
      row.unit = life.unit;
      row.expiresAt = life.expiresAt;
      save(db);
      return send(res, 200, { ok: true, request: publicRequest(row) });
    }
    if (req.method === "GET" && url.pathname === "/api/sessions") {
      if (!sessionUser(req, db)) return send(res, 401, { error: "Sign in." });
      const sessions = (db.live || []).filter((s) => !s.revoked).map((s) => ({
        id: s.id,
        username: s.username,
        os: s.os,
        device: s.device,
        started: s.started,
        lastSeen: s.lastSeen,
      }));
      return send(res, 200, { sessions });
    }
    const kick = url.pathname.match(/^\/api\/sessions\/([a-f0-9]+)\/revoke$/);
    if (req.method === "POST" && kick) {
      if (!sessionUser(req, db)) return send(res, 401, { error: "Sign in." });
      const s = (db.live || []).find((x) => x.id === kick[1]);
      if (!s) return send(res, 404, { error: "Session not found." });
      s.revoked = true;
      save(db);
      return send(res, 200, { ok: true });
    }
    if (req.method === "POST" && url.pathname === "/api/pulse") {
      const b = await readBody(req);
      const s = (db.live || []).find((x) => x.id === String(b.ticket || ""));
      if (!s || s.revoked) return send(res, 200, { ok: false, kick: true });
      if (s.requestId === "universal") {
        if (!String(db.universal || "").trim()) {
          s.revoked = true;
          save(db);
          return send(res, 200, { ok: false, kick: true });
        }
        s.lastSeen = new Date().toISOString();
        save(db);
        return send(res, 200, { ok: true });
      }
      const row = db.requests.find((r) => r.id === s.requestId);
      if (codeDead(row)) {
        s.revoked = true;
        save(db);
        return send(res, 200, { ok: false, kick: true });
      }
      s.lastSeen = new Date().toISOString();
      save(db);
      return send(res, 200, { ok: true });
    }
    if (req.method === "POST" && url.pathname === "/api/redeem") {
      const b = await readBody(req);
      const pasted = String(b.code || "").trim();
      const uni = String(db.universal || "").trim();
      if (uni && pasted === uni) {
        const hwid = String(b.hwid || "").trim().slice(0, 80) || "universal";
        const ticket = crypto.randomBytes(16).toString("hex");
        db.live.unshift({
          id: ticket,
          requestId: "universal",
          username: "Universal",
          hwid,
          os: "Universal",
          device: "Universal",
          started: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          revoked: false,
        });
        db.live = db.live.slice(0, 200);
        save(db);
        return send(res, 200, { ok: true, url: DRIFT_URL, ticket });
      }
      const raw = extractRaw(b.code);
      if (!raw) return send(res, 400, { error: "That is not a Drift code." });
      const digest = hash(raw);
      const row = db.requests.find((r) => r.hash && r.hash === digest && r.status === "accepted");
      if (!row) return send(res, 400, { error: "That code is not valid." });
      if (row.revoked) return send(res, 400, { error: "That code was revoked." });
      if (row.expiresAt && Date.now() > Date.parse(row.expiresAt)) return send(res, 400, { error: "That code has expired." });
      const maxUses = row.maxUses || 1;
      if ((row.uses || 0) >= maxUses) return send(res, 400, { error: "That code has no uses left." });
      const hwid = String(b.hwid || "").trim().slice(0, 80);
      if (!hwid) return send(res, 400, { error: "This device could not be identified." });
      row.hwids = row.hwids || [];
      if (!row.hwids.includes(hwid)) {
        if (row.hwids.length >= (row.hwidLimit || 1)) return send(res, 400, { error: "This code is locked to another device." });
        row.hwids.push(hwid);
      }
      row.uses = (row.uses || 0) + 1;
      row.used = row.uses >= maxUses;
      row.usedAt = new Date().toISOString();
      const ticket = crypto.randomBytes(16).toString("hex");
      db.live.unshift({
        id: ticket,
        requestId: row.id,
        username: row.username,
        hwid,
        os: row.os,
        device: row.device,
        started: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        revoked: false,
      });
      db.live = db.live.slice(0, 200);
      save(db);
      return send(res, 200, { ok: true, url: DRIFT_URL, ticket });
    }
    if (req.method === "GET" && url.pathname === "/api/universal") {
      if (!sessionUser(req, db)) return send(res, 401, { error: "Sign in." });
      return send(res, 200, { code: db.universal || "" });
    }
    if (req.method === "POST" && url.pathname === "/api/universal") {
      if (!sessionUser(req, db)) return send(res, 401, { error: "Sign in." });
      const b = await readBody(req);
      const code = String(b.code || "").trim().slice(0, 80);
      if (code && code.length < 2) return send(res, 400, { error: "Use at least 2 characters." });
      db.universal = code;
      save(db);
      return send(res, 200, { ok: true, code });
    }
    if (req.method === "POST" && url.pathname === "/api/usage") {
      const b = await readBody(req);
      const name = String(b.app || "").trim().slice(0, 48);
      if (!name) return send(res, 400, { error: "Missing app." });
      const now = new Date();
      const month = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
      if (!db.usage || db.usage.month !== month) db.usage = { month, apps: {} };
      const day = String(now.getDate());
      const apps = db.usage.apps;
      if (!apps[name] || typeof apps[name] !== "object") apps[name] = {};
      apps[name][day] = (Number(apps[name][day]) || 0) + 1;
      save(db);
      return send(res, 200, { ok: true });
    }
    if (req.method === "GET" && url.pathname === "/api/usage") {
      if (!sessionUser(req, db)) return send(res, 401, { error: "Sign in." });
      const now = new Date();
      const month = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
      if (!db.usage || db.usage.month !== month) {
        db.usage = { month, apps: {} };
        save(db);
      }
      return send(res, 200, { month: db.usage.month, apps: db.usage.apps || {} });
    }

    let file = (url.pathname === "/" || url.pathname === "/mod") ? "/index.html" : url.pathname;
    if (file.includes("..")) return send(res, 404, { error: "no" });
    const full = path.join(__dirname, "public", file);
    if (!full.startsWith(path.join(__dirname, "public"))) return send(res, 404, { error: "no" });
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[path.extname(full)] || "application/octet-stream", "cache-control": "no-store" });
    fs.createReadStream(full).pipe(res);
  } catch (err) {
    send(res, 400, { error: err.message || "Error" });
  }
}
  done().catch((err) => send(res, 400, { error: err.message || "Error" }));
}
