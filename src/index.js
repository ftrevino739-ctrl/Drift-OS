import { createServer } from "node:http";
import { fileURLToPath } from "url";
import fs from "node:fs";
import path from "node:path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const rootPath = fileURLToPath(new URL("../", import.meta.url));
const publicPath = fileURLToPath(new URL("../public/", import.meta.url));
const rootIndexPath = path.join(rootPath, "index.html");
const pubIndexPath = path.join(publicPath, "index.html");

const TEMP_PASS_HASH = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";

function loadAndPatchIndex() {
	let file = null;
	try {
		if (fs.existsSync(rootIndexPath) && fs.statSync(rootIndexPath).size > 50000) file = rootIndexPath;
		else if (fs.existsSync(pubIndexPath) && fs.statSync(pubIndexPath).size > 50000) file = pubIndexPath;
	} catch {}
	if (!file) return null;
	let html = fs.readFileSync(file, "utf8");

	// Gate config OFF
	html = html.replace(
		/window\.DRIFT_ACCESS\s*=\s*\{[\s\S]*?enabled\s*:\s*true/,
		"window.DRIFT_ACCESS={enabled:false"
	);
	html = html.replace(
		/(DRIFT_ACCESS\s*=\s*\{[\s\n\r]*enabled\s*:\s*)true/,
		"$1false"
	);
	html = html.replace(/passwordHash\s*:\s*['"][a-fA-F0-9]{64}['"]/g, "passwordHash:'" + TEMP_PASS_HASH + "'");

	// REMOVE Orbit Lab leftover panel (was outside #gate → stuck on screen)
	html = html.replace(
		/<div id="gate-stars"><\/div>\s*<div class="gate-ui">\s*<h1>Orbit Lab<\/h1>[\s\S]*?ORBIT LAB[\s\S]*?<\/div>\s*<\/div>/,
		""
	);
	html = html.replace(
		/<h1>Orbit Lab<\/h1>[\s\S]*?<div class="gate-foot">ORBIT LAB[\s\S]*?<\/div>/,
		""
	);
	// Extra safety: hide any residual gate UI chrome
	const forceCss =
		"<style id=\"drift-force-desk\">" +
		"#gate,.gate-ui,.gate-access,.gate-card,#gate-nebula,#gate-stars{display:none!important;visibility:hidden!important;pointer-events:none!important}" +
		"#desk{display:block!important;min-height:100vh}" +
		"</style>";
	if (html.includes("</head>")) html = html.replace("</head>", forceCss + "</head>");

	// Full apps
	html = html.replace(
		"const APPS={calc:'Calculator',browser:'Browser',ai:'AI',yt:'YouTube'};",
		"const APPS={calc:'Calculator',browser:'Browser',ai:'AI',yt:'YouTube',cam:'Camera',mus:'Music',movies:'Movies',code:'VS Code',discord:'Discord',gmail:'Gmail',ig:'Instagram',tt:'TikTok',classroom:'Classroom',canva:'Canva',roblox:'Roblox',gimkit:'Gimkit',games:'Games',chat:'Chat'};"
	);
	html = html.replace(
		"const defD=()=>({pins:['calc','browser','ai','yt'],desk:['calc','browser','ai','yt'],chats:[]});",
		"const defD=()=>({pins:['calc','browser','ai','yt','gmail','gimkit'],desk:['browser','ai','yt','gmail','gimkit','movies','cam','chat'],chats:[]});"
	);

	// XAPPS + Roblox login panel
	const xapps =
		"const XAPPS={cam:{n:'Camera',f:camera},mus:{n:'Music',f:music},movies:{n:'Movies',f:movies},code:{n:'VS Code',f:vscode},discord:{n:'Discord',f:discordApp},gmail:{n:'Gmail',f:gmailApp},ig:{n:'Instagram',f:igApp},tt:{n:'TikTok',f:ttApp}," +
		"classroom:{n:'Classroom',f:function(r){proxySite(r,'https://classroom.google.com','Classroom')}}," +
		"canva:{n:'Canva',f:function(r){proxySite(r,'https://www.canva.com','Canva')}}," +
		"roblox:{n:'Roblox',f:function(r){" +
		"r.innerHTML='<div style=\"height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#1a1a1a,#2b2b2b);padding:20px\">" +
		"<div style=\"width:min(360px,100%);background:#232527;border-radius:12px;padding:28px 24px;box-shadow:0 12px 40px rgba(0,0,0,.45);color:#fff;font-family:system-ui,sans-serif\">" +
		"<div style=\"text-align:center;margin-bottom:18px\"><div style=\"width:56px;height:56px;margin:0 auto 10px;background:#e2231a;border-radius:12px;display:grid;place-items:center;font-weight:800;font-size:22px\">R</div>" +
		"<div style=\"font-size:20px;font-weight:700\">Roblox</div><div style=\"font-size:12px;color:#9ca3af;margin-top:4px\">Sign in to continue</div></div>" +
		"<label style=\"font-size:12px;color:#c4c4c4\">Username</label>" +
		"<input id=\"rbx-user\" autocomplete=\"username\" style=\"width:100%;margin:6px 0 12px;padding:10px 12px;border-radius:8px;border:1px solid #3d3d3d;background:#111;color:#fff;box-sizing:border-box\"/>" +
		"<label style=\"font-size:12px;color:#c4c4c4\">Password</label>" +
		"<input id=\"rbx-pass\" type=\"password\" autocomplete=\"current-password\" style=\"width:100%;margin:6px 0 16px;padding:10px 12px;border-radius:8px;border:1px solid #3d3d3d;background:#111;color:#fff;box-sizing:border-box\"/>" +
		"<button id=\"rbx-go\" style=\"width:100%;padding:12px;border:0;border-radius:8px;background:#e2231a;color:#fff;font-weight:700;cursor:pointer\">Log In</button>" +
		"<button id=\"rbx-guest\" style=\"width:100%;margin-top:10px;padding:10px;border:1px solid #444;border-radius:8px;background:transparent;color:#ddd;cursor:pointer\">Continue as Guest</button>" +
		"<p style=\"font-size:11px;color:#888;margin-top:14px;line-height:1.4\">Opens Roblox login in the proxy browser so you can sign in with your account.</p>" +
		"</div></div>';" +
		"var go=function(){proxySite(r,'https://www.roblox.com/login','Roblox')};" +
		"r.querySelector('#rbx-go').onclick=go; r.querySelector('#rbx-guest').onclick=function(){proxySite(r,'https://www.roblox.com','Roblox')};" +
		"}}," +
		"gimkit:{n:'Gimkit',f:gimkitApp},games:{n:'Games',f:gamesHub},chat:{n:'Chat',f:noahChat}};";
	html = html.replace(
		/const XAPPS=\{cam:\{n:'Camera',f:camera\}[\s\S]*?roblox:\{n:'Roblox',f:robloxApp\}\};/,
		xapps
	);
	// If already patched once, replace roblox entry
	html = html.replace(
		/roblox:\{n:'Roblox',f:function\(r\)\{proxySite\(r,'https:\/\/www\.roblox\.com','Roblox'\)\}\}/,
		"roblox:{n:'Roblox',f:" + xapps.split("roblox:{n:'Roblox',f:")[1].split(",gimkit:")[0]
	);

	// Better logos
	const extraIC =
		";(function(){" +
		// Chat — speech bubbles
		"IC.chat='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#5865F2\"/>" +
		"<path d=\"M14 16h14a4 4 0 014 4v8a4 4 0 01-4 4H22l-5 4v-4h-3a4 4 0 01-4-4v-8a4 4 0 014-4z\" fill=\"#fff\" opacity=\".95\"/>" +
		"<circle cx=\"20\" cy=\"24\" r=\"1.6\" fill=\"#5865F2\"/><circle cx=\"25\" cy=\"24\" r=\"1.6\" fill=\"#5865F2\"/><circle cx=\"30\" cy=\"24\" r=\"1.6\" fill=\"#5865F2\"/></svg>';" +
		// Gimkit — quiz/teal mark
		"IC.gimkit='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#0D9488\"/>" +
		"<rect x=\"10\" y=\"12\" width=\"28\" height=\"24\" rx=\"4\" fill=\"#fff\"/>" +
		"<path d=\"M16 20h16M16 25h12M16 30h8\" stroke=\"#0D9488\" stroke-width=\"2.4\" stroke-linecap=\"round\"/>" +
		"<circle cx=\"34\" cy=\"34\" r=\"7\" fill=\"#F59E0B\"/><path d=\"M34 31v4l3 2\" stroke=\"#fff\" stroke-width=\"1.6\" fill=\"none\" stroke-linecap=\"round\"/></svg>';" +
		// Canva — official-ish purple/teal C
		"IC.canva='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#7D2AE7\"/>" +
		"<circle cx=\"24\" cy=\"24\" r=\"12\" fill=\"none\" stroke=\"#00C4CC\" stroke-width=\"5\"/>" +
		"<path d=\"M30 16.5a12 12 0 00-12 0\" stroke=\"#7D2AE7\" stroke-width=\"6\" stroke-linecap=\"round\"/>" +
		"<text x=\"24\" y=\"28\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"800\" fill=\"#fff\" font-family=\"Arial,sans-serif\">C</text></svg>';" +
		// Classroom — green chalkboard + book
		"IC.classroom='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#0F9D58\"/>" +
		"<rect x=\"10\" y=\"12\" width=\"28\" height=\"20\" rx=\"2\" fill=\"#0B7A44\"/>" +
		"<rect x=\"12\" y=\"14\" width=\"24\" height=\"16\" rx=\"1\" fill=\"#137333\"/>" +
		"<path d=\"M16 20h16M16 24h12\" stroke=\"#A7F3D0\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>" +
		"<rect x=\"18\" y=\"34\" width=\"12\" height=\"3\" rx=\"1\" fill=\"#F1F3F4\"/></svg>';" +
		"IC.cam='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#111\"/><rect x=\"9\" y=\"15\" width=\"24\" height=\"18\" rx=\"3\" fill=\"#333\"/><circle cx=\"21\" cy=\"24\" r=\"6\" fill=\"#111\" stroke=\"#9ca3af\" stroke-width=\"2\"/><path d=\"M33 20l7-3v14l-7-3z\" fill=\"#555\"/></svg>';" +
		"IC.mus='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#1DB954\"/><circle cx=\"18\" cy=\"32\" r=\"5\" fill=\"#fff\"/><circle cx=\"32\" cy=\"28\" r=\"5\" fill=\"#fff\"/><path d=\"M23 32V14l14-3v14\" stroke=\"#fff\" stroke-width=\"3\" fill=\"none\"/></svg>';" +
		"IC.movies='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#E50914\"/><rect x=\"10\" y=\"12\" width=\"28\" height=\"24\" rx=\"3\" fill=\"#fff\"/><path d=\"M20 18l10 6-10 6z\" fill=\"#E50914\"/></svg>';" +
		"IC.code='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#007ACC\"/><path d=\"M18 16l-8 8 8 8M30 16l8 8-8 8M26 14l-4 20\" stroke=\"#fff\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/></svg>';" +
		"IC.discord='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#5865F2\"/><path d=\"M16 18c4-2 12-2 16 0l1 4c-2-1-5-2-9-2s-7 1-9 2l1-4zm-1 8c1 4 5 6 9 6s8-2 9-6c-2 1-5 2-9 2s-7-1-9-2z\" fill=\"#fff\"/><circle cx=\"20\" cy=\"26\" r=\"2\" fill=\"#5865F2\"/><circle cx=\"28\" cy=\"26\" r=\"2\" fill=\"#5865F2\"/></svg>';" +
		"IC.gmail='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#fff\"/><path d=\"M8 14l16 12L40 14v20a2 2 0 01-2 2H10a2 2 0 01-2-2V14z\" fill=\"#EA4335\"/><path d=\"M8 14l16 12L40 14\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/></svg>';" +
		"IC.ig='<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"ig\" x1=\"0\" y1=\"48\" x2=\"48\" y2=\"0\"><stop stop-color=\"#f58529\"/><stop offset=\"0.5\" stop-color=\"#dd2a7b\"/><stop offset=\"1\" stop-color=\"#8134af\"/></linearGradient></defs>" +
		"<rect width=\"48\" height=\"48\" rx=\"11\" fill=\"url(#ig)\"/><rect x=\"12\" y=\"12\" width=\"24\" height=\"24\" rx=\"7\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\"/>" +
		"<circle cx=\"24\" cy=\"24\" r=\"6\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\"/><circle cx=\"32\" cy=\"16\" r=\"1.8\" fill=\"#fff\"/></svg>';" +
		"IC.tt='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#010101\"/>" +
		"<path d=\"M28 12v16a6 6 0 11-4-5.6V18c2.2 1.2 4 2 6 2V12h-2z\" fill=\"#25F4EE\" transform=\"translate(-1,1)\"/>" +
		"<path d=\"M28 12v16a6 6 0 11-4-5.6V18c2.2 1.2 4 2 6 2V12h-2z\" fill=\"#FE2C55\" transform=\"translate(1,-1)\"/>" +
		"<path d=\"M28 12v16a6 6 0 11-4-5.6V18c2.2 1.2 4 2 6 2V12h-2z\" fill=\"#fff\"/></svg>';" +
		"IC.roblox='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#1a1a1a\"/>" +
		"<path d=\"M14 28L20 12h10l-6 16H14zm10 0l6-16h8L32 28H24z\" fill=\"#fff\"/><circle cx=\"24\" cy=\"34\" r=\"3\" fill=\"#e2231a\"/></svg>';" +
		"IC.games='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#F59E0B\"/>" +
		"<rect x=\"10\" y=\"18\" width=\"28\" height=\"14\" rx=\"7\" fill=\"#111\"/>" +
		"<circle cx=\"18\" cy=\"25\" r=\"2\" fill=\"#fff\"/><circle cx=\"30\" cy=\"23\" r=\"1.5\" fill=\"#ef4444\"/><circle cx=\"33\" cy=\"26\" r=\"1.5\" fill=\"#22c55e\"/></svg>';" +
		"})();";
	html = html.replace(
		"IC.yt='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#fff\"/><rect x=\"6\" y=\"12\" width=\"36\" height=\"24\" rx=\"8\" fill=\"#ff0033\"/><path d=\"M20 18l10 6-10 6z\" fill=\"#fff\"/></svg>';",
		"IC.yt='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#fff\"/><rect x=\"6\" y=\"12\" width=\"36\" height=\"24\" rx=\"8\" fill=\"#ff0033\"/><path d=\"M20 18l10 6-10 6z\" fill=\"#fff\"/></svg>';" + extraIC
	);

	html = html.replace(
		/try\{const ph=localStorage\.getItem\('drift:ph'\);if\(ph&&ph\.length===64\)A\.passwordHash=ph\}catch\(e\)\{\}/g,
		"try{localStorage.removeItem('drift:ph')}catch(e){}"
	);

	const boot =
		"<script>(function(){" +
		"try{sessionStorage.setItem('drift:gate','1');localStorage.removeItem('drift:ph');}catch(e){}" +
		"function forceDesk(){" +
		"  var g=document.getElementById('gate'); if(g){g.classList.add('gone');g.style.display='none';}" +
		"  document.querySelectorAll('.gate-ui,.gate-access,#gate-stars,#gate-nebula').forEach(function(el){el.style.display='none';});" +
		"  if(window.DRIFT_ACCESS) window.DRIFT_ACCESS.enabled=false;" +
		"}" +
		"if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',forceDesk); else forceDesk();" +
		"setTimeout(forceDesk,50);setTimeout(forceDesk,400);" +
		"})();</script>";
	if (html.includes("</head>")) html = html.replace("</head>", boot + "</head>");

	return html;
}

let wisp = null, scramjetPath = null, libcurlPath = null, baremuxPath = null;
try {
	const wispMod = await import("@mercuryworkshop/wisp-js/server");
	wisp = wispMod.server;
	if (wispMod.logging) wispMod.logging.set_level(wispMod.logging.NONE);
	Object.assign(wisp.options, { allow_udp_streams: false, hostname_blacklist: [/example\.com/], dns_servers: ["1.1.1.3", "1.0.0.3"] });
} catch (e) {
	console.warn("Wisp:", e && e.message);
}
try { scramjetPath = (await import("@mercuryworkshop/scramjet/path")).scramjetPath; } catch (e) {}
try { libcurlPath = (await import("@mercuryworkshop/libcurl-transport")).libcurlPath; } catch (e) {}
try { baremuxPath = (await import("@mercuryworkshop/bare-mux/node")).baremuxPath; } catch (e) {}

const fastify = Fastify({
	serverFactory: (handler) =>
		createServer()
			.on("request", (req, res) => {
				res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
				res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
				handler(req, res);
			})
			.on("upgrade", (req, socket, head) => {
				if (wisp && req.url && req.url.endsWith("/wisp/")) {
					try { wisp.routeRequest(req, socket, head); } catch { socket.end(); }
				} else socket.end();
			}),
});

const sendIndex = async (_req, reply) => {
	const html = loadAndPatchIndex();
	if (!html) return reply.code(500).send("Missing index.html");
	return reply.type("text/html; charset=utf-8").send(html);
};

fastify.get("/", sendIndex);
fastify.get("/index.html", sendIndex);
fastify.get("/health", async () => {
	const html = loadAndPatchIndex();
	return {
		ok: true,
		servedBytes: html ? html.length : 0,
		gateReallyOff: !!(html && /DRIFT_ACCESS\s*=\s*\{\s*enabled\s*:\s*false/.test(html)),
		orbitRemoved: !(html && html.includes("<h1>Orbit Lab</h1>")),
		fullApps: !!(html && html.includes("gimkit:'Gimkit'")),
		scramjet: !!scramjetPath,
	};
});

await fastify.register(fastifyStatic, { root: publicPath, decorateReply: true, index: false });
if (scramjetPath) await fastify.register(fastifyStatic, { root: scramjetPath, prefix: "/scram/", decorateReply: false });
if (libcurlPath) await fastify.register(fastifyStatic, { root: libcurlPath, prefix: "/libcurl/", decorateReply: false });
if (baremuxPath) await fastify.register(fastifyStatic, { root: baremuxPath, prefix: "/baremux/", decorateReply: false });

fastify.setNotFoundHandler((_req, reply) => {
	try {
		if (fs.existsSync(path.join(publicPath, "404.html"))) return reply.code(404).type("text/html").sendFile("404.html");
	} catch {}
	return reply.code(404).send("Not found");
});

let port = parseInt(process.env.PORT || "", 10);
if (Number.isNaN(port)) port = 8080;
await fastify.listen({ port, host: "0.0.0.0" });
console.log("Drift listening", port, "| no Orbit panel | logos + Roblox login");
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
