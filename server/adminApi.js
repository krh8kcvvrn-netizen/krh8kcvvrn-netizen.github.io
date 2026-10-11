import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cleanWalletAddress, isBitcoinAddress, isUsdtAddress } from "../src/lib/addresses.js";
import { contentProblems, readContent, submittedContent } from "../src/lib/content.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storePath = path.join(root, "data", "admin.json");
const qrBytesLimit = 1_500_000;
const qrTypes = {
  "image/png": (bytes) => bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47,
  "image/jpeg": (bytes) => bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/webp": (bytes) => bytes.length > 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP",
};
const cookieName = "open_relief_admin";
const sessionMs = 12 * 60 * 60 * 1000;
const sessions = new Map();
const loginAttempts = new Map();

const donationPosts = new Map();
const donationCap = 2000;

function parseReportedAmount(value) {
  const text = String(value ?? "").trim();
  if (!/^\d*\.?\d{0,2}$/.test(text) || text === "" || text === ".") return 0;
  const amount = Number(text);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000000000) return 0;
  return Math.round(amount * 100) / 100;
}

function readDonations(list) {
  if (!Array.isArray(list)) return [];
  const clean = [];
  for (const item of list) {
    const amount = Number(item?.amount);
    const asset = item?.asset === "usdt" ? "usdt" : item?.asset === "btc" ? "btc" : "";
    const at = typeof item?.at === "string" ? item.at : "";
    if (!asset || !at || Number.isNaN(Date.parse(at)) || !Number.isFinite(amount) || amount <= 0) continue;
    clean.push({ at, amount: Math.round(amount * 100) / 100, asset });
  }
  return clean.slice(-donationCap);
}

function donationLimited(ip) {
  const row = donationPosts.get(ip);
  if (!row || row.reset < Date.now()) return false;
  return row.count >= 20;
}

function markDonationPost(ip) {
  const row = donationPosts.get(ip);
  if (!row || row.reset < Date.now()) {
    donationPosts.set(ip, { count: 1, reset: Date.now() + 60_000 });
    return;
  }
  row.count += 1;
}

function qrRecord(value) {
  const type = value?.type;
  const rev = Number(value?.rev);
  if (!qrTypes[type] || !Number.isInteger(rev) || rev < 1) return null;
  return { type, rev };
}

function readWallets(raw) {
  return {
    btc: cleanWalletAddress(raw?.btc),
    usdt: cleanWalletAddress(raw?.usdt),
    qr: {
      btc: qrRecord(raw?.qr?.btc),
      usdt: qrRecord(raw?.qr?.usdt),
    },
  };
}

function qrPath(asset) {
  return path.join(root, "data", `qr-${asset}`);
}

function publicWallets(store) {
  function qrUrl(asset) {
    const record = store.wallets.qr[asset];
    if (!record || !fs.existsSync(qrPath(asset))) return "";
    return `/api/wallets/qr/${asset}?v=${record.rev}`;
  }
  return {
    btc: store.wallets.btc,
    usdt: store.wallets.usdt,
    btcQr: qrUrl("btc"),
    usdtQr: qrUrl("usdt"),
  };
}

function parseQrUpload(value, label) {
  if (value == null) return { keep: true };
  if (value === "") return { remove: true };
  const match = typeof value === "string"
    ? /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(value)
    : null;
  const bytes = match ? Buffer.from(match[2].replace(/\s/g, ""), "base64") : null;
  if (!match || !bytes?.length || bytes.length > qrBytesLimit || !qrTypes[match[1]](bytes)) {
    return { error: `Use a PNG, JPEG, or WebP image under 1.5 MB for the ${label} QR code.` };
  }
  return { type: match[1], buffer: bytes };
}

function writeQrFile(asset, bytes) {
  const dest = qrPath(asset);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const tmp = `${dest}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, bytes);
  try {
    fs.renameSync(tmp, dest);
  } catch {
    fs.writeFileSync(dest, bytes);
    fs.rmSync(tmp, { force: true });
  }
}

function emptyStore() {
  return { password: null, wallets: readWallets(null), content: readContent(null), donations: [] };
}

function readStore() {
  try {
    const raw = JSON.parse(fs.readFileSync(storePath, "utf8"));
    return {
      password: raw.password?.salt && raw.password?.hash
        ? { salt: String(raw.password.salt), hash: String(raw.password.hash) }
        : null,
      wallets: readWallets(raw.wallets),
      content: readContent(raw.content),
      donations: readDonations(raw.donations),
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(data) {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  const contents = JSON.stringify(
    {
      password: data.password ? { salt: data.password.salt, hash: data.password.hash } : null,
      wallets: readWallets(data.wallets),
      content: readContent(data.content),
      donations: readDonations(data.donations),
    },
    null,
    2,
  );
  const tmp = `${storePath}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, contents);
  try {
    fs.renameSync(tmp, storePath);
  } catch {
    fs.writeFileSync(storePath, contents);
    fs.rmSync(tmp, { force: true });
  }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 32).toString("hex");
  return { salt, hash };
}

function passwordMatches(password, record) {
  if (!record?.salt || !record?.hash) return false;
  const actual = crypto.scryptSync(String(password), record.salt, 32);
  const expected = Buffer.from(record.hash, "hex");
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

function readBody(req, limit = 100_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error("too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("bad json"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function send(res, status, data, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  for (const [key, value] of Object.entries(extraHeaders)) res.setHeader(key, value);
  res.end(JSON.stringify(data));
}

function cookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  for (const part of header.split(";")) {
    const text = part.trim();
    if (!text) continue;
    const eq = text.indexOf("=");
    if (eq === -1) continue;
    out[text.slice(0, eq)] = decodeURIComponent(text.slice(eq + 1));
  }
  return out;
}

const publicSite = "https://krh8kcvvrn-netizen.github.io";

function clientIp(req) {
  const cloudflare = req.headers["cf-connecting-ip"];
  if (typeof cloudflare === "string" && cloudflare.trim()) return cloudflare.trim();
  return req.socket?.remoteAddress || "local";
}

function isPublicApi(pathname) {
  return pathname === "/api/wallets"
    || pathname === "/api/content"
    || pathname === "/api/donations"
    || /^\/api\/wallets\/qr\/(btc|usdt)$/.test(pathname);
}

function allowPublicSite(req, res) {
  if (req.headers.origin !== publicSite) return;
  res.setHeader("Access-Control-Allow-Origin", publicSite);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function locked(ip) {
  const row = loginAttempts.get(ip);
  return Boolean(row && row.lockUntil > Date.now());
}

function markFailure(ip) {
  const row = loginAttempts.get(ip) || { count: 0, lockUntil: 0 };
  row.count += 1;
  if (row.count >= 8) {
    row.count = 0;
    row.lockUntil = Date.now() + 60_000;
  }
  loginAttempts.set(ip, row);
}

function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + sessionMs);
  return token;
}

function sessionToken(req) {
  const token = cookies(req)[cookieName];
  if (!token || !sessions.has(token)) return "";
  if (sessions.get(token) < Date.now()) {
    sessions.delete(token);
    return "";
  }
  return token;
}

function sessionCookie(token) {
  return `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionMs / 1000}`;
}

function clearCookie() {
  return `${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}

function walletError(btc, usdt) {
  if (!isBitcoinAddress(btc)) return { field: "btc", error: "Enter a Bitcoin address, or leave the field blank." };
  if (!isUsdtAddress(usdt)) return { field: "usdt", error: "Enter a USDT (ERC-20) Ethereum address, or leave the field blank." };
  return null;
}

async function handle(req, res, next) {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  if (!url.pathname.startsWith("/api/")) {
    next();
    return;
  }

  try {
    const method = req.method || "GET";
    if (isPublicApi(url.pathname)) {
      allowPublicSite(req, res);
      if (method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
      }
    }
    const store = readStore();
    const signedIn = Boolean(store.password && sessionToken(req));

    if (method === "GET" && url.pathname === "/api/wallets") {
      send(res, 200, publicWallets(store));
      return;
    }

    const qrRoute = url.pathname.match(/^\/api\/wallets\/qr\/(btc|usdt)$/);
    if (method === "GET" && qrRoute) {
      const asset = qrRoute[1];
      const record = store.wallets.qr[asset];
      const file = qrPath(asset);
      if (!record || !fs.existsSync(file)) {
        send(res, 404, { error: "No QR code is published." });
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", record.type);
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.end(fs.readFileSync(file));
      return;
    }

    if (method === "GET" && url.pathname === "/api/content") {
      send(res, 200, store.content);
      return;
    }

    if (method === "POST" && url.pathname === "/api/donations") {
      const ip = clientIp(req);
      if (donationLimited(ip)) {
        send(res, 429, { error: "Wait a moment and try again." });
        return;
      }
      const body = await readBody(req);
      const amount = parseReportedAmount(body.amount);
      const asset = body.asset === "usdt" ? "usdt" : body.asset === "btc" ? "btc" : "";
      if (!amount) {
        send(res, 400, { error: "Enter an amount greater than zero." });
        return;
      }
      if (!asset) {
        send(res, 400, { error: "Choose Bitcoin or USDT." });
        return;
      }
      markDonationPost(ip);
      const fresh = readStore();
      const donations = readDonations([
        ...fresh.donations,
        { at: new Date().toISOString(), amount, asset },
      ]);
      writeStore({ ...fresh, donations });
      send(res, 200, { ok: true });
      return;
    }

    if (method === "GET" && url.pathname === "/api/admin/donations") {
      if (!signedIn) {
        send(res, 401, { error: "Log in again." });
        return;
      }
      const total = store.donations.reduce((sum, item) => sum + item.amount, 0);
      send(res, 200, {
        donations: [...store.donations].reverse(),
        total: Math.round(total * 100) / 100,
      });
      return;
    }

    if (method === "GET" && url.pathname === "/api/admin/status") {
      send(res, 200, { needsSetup: !store.password, signedIn });
      return;
    }

    if (method === "POST" && url.pathname === "/api/admin/setup") {
      if (store.password) {
        send(res, 409, { error: "A password is already set." });
        return;
      }
      const body = await readBody(req);
      const password = String(body.password ?? "");
      const confirm = String(body.confirm ?? "");
      if (password.length < 8 || password.length > 200) {
        send(res, 400, { error: "Use at least 8 characters." });
        return;
      }
      if (password !== confirm) {
        send(res, 400, { error: "Those passwords do not match." });
        return;
      }
      writeStore({ ...store, password: hashPassword(password) });
      const token = createSession();
      send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(token) });
      return;
    }

    if (method === "POST" && url.pathname === "/api/admin/login") {
      const ip = clientIp(req);
      if (locked(ip)) {
        send(res, 429, { error: "Try again in a minute." });
        return;
      }
      if (!store.password) {
        send(res, 409, { error: "Create a password first." });
        return;
      }
      const body = await readBody(req);
      if (!passwordMatches(body.password, store.password)) {
        markFailure(ip);
        send(res, 401, { error: "That password is not correct." });
        return;
      }
      loginAttempts.delete(ip);
      const token = createSession();
      send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(token) });
      return;
    }

    if (method === "POST" && url.pathname === "/api/admin/logout") {
      const token = sessionToken(req);
      if (token) sessions.delete(token);
      send(res, 200, { ok: true }, { "Set-Cookie": clearCookie() });
      return;
    }

    if (method === "PUT" && url.pathname === "/api/admin/wallets") {
      if (!signedIn) {
        send(res, 401, { error: "Log in again." });
        return;
      }
      const body = await readBody(req, 4_500_000);
      const current = readStore();
      const wallets = {
        btc: cleanWalletAddress(body.btc),
        usdt: cleanWalletAddress(body.usdt),
        qr: {
          btc: current.wallets.qr.btc,
          usdt: current.wallets.qr.usdt,
        },
      };
      const problem = walletError(wallets.btc, wallets.usdt);
      if (problem) {
        send(res, 400, problem);
        return;
      }
      const btcQr = parseQrUpload(body.btcQr, "Bitcoin");
      const usdtQr = parseQrUpload(body.usdtQr, "USDT");
      if (btcQr.error || usdtQr.error) {
        send(res, 400, { error: btcQr.error || usdtQr.error });
        return;
      }
      if (btcQr.remove) {
        fs.rmSync(qrPath("btc"), { force: true });
        wallets.qr.btc = null;
      } else if (btcQr.buffer) {
        writeQrFile("btc", btcQr.buffer);
        wallets.qr.btc = { type: btcQr.type, rev: (current.wallets.qr.btc?.rev || 0) + 1 };
      }
      if (usdtQr.remove) {
        fs.rmSync(qrPath("usdt"), { force: true });
        wallets.qr.usdt = null;
      } else if (usdtQr.buffer) {
        writeQrFile("usdt", usdtQr.buffer);
        wallets.qr.usdt = { type: usdtQr.type, rev: (current.wallets.qr.usdt?.rev || 0) + 1 };
      }
      writeStore({ ...current, wallets });
      send(res, 200, publicWallets(readStore()));
      return;
    }

    if (method === "PUT" && url.pathname === "/api/admin/content") {
      if (!signedIn) {
        send(res, 401, { error: "Log in again." });
        return;
      }
      const body = await readBody(req);
      const content = submittedContent(body);
      const problem = contentProblems(content);
      if (problem) {
        send(res, 400, { error: problem });
        return;
      }
      writeStore({ ...readStore(), content });
      send(res, 200, content);
      return;
    }

    send(res, 404, { error: "Not found." });
  } catch (error) {
    const status = error.status || 500;
    const message = status === 400
      ? "That request could not be read."
      : status === 413
        ? "That image is too large."
        : "Something went wrong.";
    send(res, status, { error: message });
  }
}

export function adminApi() {
  return {
    name: "open-relief-admin",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}
