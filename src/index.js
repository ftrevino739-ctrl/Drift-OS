import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { hostname } from "node:os";
import fs from "node:fs";
import path from "node:path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const rootPath = fileURLToPath(new URL("../", import.meta.url));
const publicPath = fileURLToPath(new URL("../public/", import.meta.url));
const rootIndexPath = path.join(rootPath, "index.html");
const pubIndexPath = path.join(publicPath, "index.html");

// SHA-256 of password "1"
const TEMP_PASS_HASH = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";

function loadAndPatchIndex() {
	let file = null;
	try {
		if (fs.existsSync(rootIndexPath) && fs.statSync(rootIndexPath).size > 50000) file = rootIndexPath;
		else if (fs.existsSync(pubIndexPath) && fs.statSync(pubIndexPath).size > 50000) file = pubIndexPath;
	} catch {}
	if (!file) return null;
	let html = fs.readFileSync(file, "utf8");

	// Scrollable gate
	html = html.split("overflow:hidden;display:flex;flex-direction:column}").join(
		"overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;display:block}"
	);
	html = html.split("margin:auto;padding:28px 22px 40px;text-align:center}").join(
		"margin:0 auto;padding:28px 22px 100px;text-align:center}"
	);

	// Force password hash = "1"
	html = html.replace(/passwordHash\s*:\s*['"][a-fA-F0-9]{64}['"]/g, "passwordHash:'" + TEMP_PASS_HASH + "'");

	// Remove DUPLICATE Orbit Lab form (second id=gate-code breaks unlock)
	html = html.replace(
		/<div class="gate-access">\s*<label for="gate-code">Access code<\/label>[\s\S]*?<div class="gate-foot">ORBIT LAB[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
		""
	);

	// Clear localStorage override
	html = html.replace(
		/try\{const ph=localStorage\.getItem\('drift:ph'\);if\(ph&&ph\.length===64\)A\.passwordHash=ph\}catch\(e\)\{\}/g,
		"try{localStorage.removeItem('drift:ph')}catch(e){} if(window.DRIFT_ACCESS){window.DRIFT_ACCESS.passwordHash='" +
			TEMP_PASS_HASH +
			"';}"
	);

	// Inject fix: one password field, password "1" works, all apps kept
	const boot =
		"<script>(function(){" +
		"try{localStorage.removeItem('drift:ph');sessionStorage.removeItem('drift:gate')}catch(e){}" +
		"window.__DRIFT_FORCE_HASH='" +
		TEMP_PASS_HASH +
		"';" +
		"document.addEventListener('DOMContentLoaded',function(){" +
		"  var A=window.DRIFT_ACCESS; if(A){A.passwordHash=window.__DRIFT_FORCE_HASH;A.hardwareId='1';}" +
		"  var codes=document.querySelectorAll('#gate-code');" +
		"  var gos=document.querySelectorAll('#gate-go');" +
		"  var errs=document.querySelectorAll('#gate-err');" +
		"  function doUnlock(){try{sessionStorage.setItem('drift:gate','1')}catch(e){} var g=document.getElementById('gate'); if(g) g.classList.add('gone');}" +
		"  async function tryPass(pass){" +
		"    pass=(pass||'').trim(); if(!pass) return false;" +
		"    if(pass==='1' || pass==='HDW1'){ doUnlock(); return true; }" +
		"    if(!window.crypto||!crypto.subtle) return false;" +
		"    var buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pass));" +
		"    var h=[].map.call(new Uint8Array(buf),function(b){return b.toString(16).padStart(2,'0')}).join('');" +
		"    if(h===(window.__DRIFT_FORCE_HASH||'').toLowerCase()){ doUnlock(); return true; }" +
		"    return false;" +
		"  }" +
		"  function wire(btn, input, errEl){" +
		"    if(!btn||!input) return;" +
		"    btn.onclick=async function(){ if(errEl) errEl.textContent=''; var ok=await tryPass(input.value); if(!ok&&errEl) errEl.textContent='Invalid password. Use: 1'; };" +
		"    input.onkeydown=function(e){ if(e.key==='Enter') btn.click(); };" +
		"  }" +
		"  for(var i=0;i<gos.length;i++) wire(gos[i], codes[i]||codes[0], errs[i]||errs[0]);" +
		"});" +
		"})();</script>";
	if (html.includes("</head>")) html = html.replace("</head>", boot + "</head>");
	else html = boot + html;

	return html;
}

let wisp = null;
let scramjetPath = null;
let libcurlPath = null;
let baremuxPath = null;

try {
	const wispMod = await import("@mercuryworkshop/wisp-js/server");
	wisp = wispMod.server;
	if (wispMod.logging) wispMod.logging.set_level(wispMod.logging.NONE);
	Object.assign(wisp.options, {
		allow_udp_streams: false,
		hostname_blacklist: [/example\.com/],
		dns_servers: ["1.1.1.3", "1.0.0.3"],
	});
} catch (e) {
	console.warn("Wisp not loaded:", e && e.message);
}

try {
	scramjetPath = (await import("@mercuryworkshop/scramjet/path")).scramjetPath;
} catch (e) {
	console.warn("Scramjet path not loaded:", e && e.message);
}
try {
	libcurlPath = (await import("@mercuryworkshop/libcurl-transport")).libcurlPath;
} catch (e) {
	console.warn("libcurl path not loaded:", e && e.message);
}
try {
	baremuxPath = (await import("@mercuryworkshop/bare-mux/node")).baremuxPath;
} catch (e) {
	console.warn("baremux path not loaded:", e && e.message);
}

const fastify = Fastify({
	serverFactory: (handler) => {
		return createServer()
			.on("request", (req, res) => {
				res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
				res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
				handler(req, res);
			})
			.on("upgrade", (req, socket, head) => {
				if (wisp && req.url && req.url.endsWith("/wisp/")) {
					try {
						wisp.routeRequest(req, socket, head);
					} catch {
						socket.end();
					}
				} else {
					socket.end();
				}
			});
	},
});

const sendIndex = async (_req, reply) => {
	const html = loadAndPatchIndex();
	if (!html) {
		return reply.code(500).type("text/plain").send("Missing full index.html at repo root (need >50KB).");
	}
	return reply.type("text/html; charset=utf-8").send(html);
};

fastify.get("/", sendIndex);
fastify.get("/index.html", sendIndex);

fastify.get("/health", async () => {
	const rootSize = fs.existsSync(rootIndexPath) ? fs.statSync(rootIndexPath).size : 0;
	const pubSize = fs.existsSync(pubIndexPath) ? fs.statSync(pubIndexPath).size : 0;
	const html = loadAndPatchIndex();
	return {
		ok: true,
		rootIndexBytes: rootSize,
		publicIndexBytes: pubSize,
		servedBytes: html ? html.length : 0,
		passwordIs1: !!(html && html.includes(TEMP_PASS_HASH)),
		hwid: "1",
		scramjet: !!scramjetPath,
		wisp: !!wisp,
	};
});

await fastify.register(fastifyStatic, {
	root: publicPath,
	decorateReply: true,
	index: false,
});

if (scramjetPath) {
	await fastify.register(fastifyStatic, { root: scramjetPath, prefix: "/scram/", decorateReply: false });
}
if (libcurlPath) {
	await fastify.register(fastifyStatic, { root: libcurlPath, prefix: "/libcurl/", decorateReply: false });
}
if (baremuxPath) {
	await fastify.register(fastifyStatic, { root: baremuxPath, prefix: "/baremux/", decorateReply: false });
}

fastify.setNotFoundHandler((_req, reply) => {
	try {
		if (fs.existsSync(path.join(publicPath, "404.html"))) {
			return reply.code(404).type("text/html").sendFile("404.html");
		}
	} catch {}
	return reply.code(404).send("Not found");
});

let port = parseInt(process.env.PORT || "", 10);
if (Number.isNaN(port)) port = 8080;

try {
	await fastify.listen({ port, host: "0.0.0.0" });
	const address = fastify.server.address();
	const html = loadAndPatchIndex();
	console.log("Listening on:");
	console.log(`\thttp://localhost:${address.port}`);
	console.log(`Index bytes: ${html ? html.length : 0}`);
	console.log("Gate password: 1 | HWID: 1 | apps preserved");
} catch (err) {
	console.error("Failed to start:", err);
	process.exit(1);
}

function shutdown() {
	fastify.close().then(() => process.exit(0)).catch(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
