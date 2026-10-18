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

function insertBeforeLast(html, marker, insertion) {
	const idx = html.lastIndexOf(marker);
	if (idx === -1) return html + insertion;
	return html.slice(0, idx) + insertion + html.slice(idx);
}

function parseNoahGames(src) {
	const games = [];
	const re =
		/\{\s*title:\s*"((?:\\.|[^"\\])*)"\s*,\s*desc:\s*"((?:\\.|[^"\\])*)"\s*,\s*url:\s*"([^"]+)"\s*,\s*image:\s*"([^"]+)"\s*\}/g;
	let m;
	while ((m = re.exec(src))) {
		games.push({
			t: m[1].replace(/\\"/g, '"'),
			d: m[2].replace(/\\"/g, '"').slice(0, 160),
			u: m[3],
			i: m[4],
		});
	}
	return games;
}

let noahCache = { at: 0, data: null };

function loadAndPatchIndex() {
	let file = null;
	try {
		if (fs.existsSync(rootIndexPath) && fs.statSync(rootIndexPath).size > 50000) file = rootIndexPath;
		else if (fs.existsSync(pubIndexPath) && fs.statSync(pubIndexPath).size > 50000) file = pubIndexPath;
	} catch {}
	if (!file) return null;
	let html = fs.readFileSync(file, "utf8");

	html = html.replace(
		/window\.DRIFT_ACCESS\s*=\s*\{[\s\S]*?enabled\s*:\s*true/,
		"window.DRIFT_ACCESS={enabled:false"
	);
	html = html.replace(/passwordHash\s*:\s*['"][a-fA-F0-9]{64}['"]/g, "passwordHash:'" + TEMP_PASS_HASH + "'");

	html = html.replace(
		/<div id="gate-stars"><\/div>\s*<div class="gate-ui">\s*<h1>Orbit Lab<\/h1>[\s\S]*?ORBIT LAB[\s\S]*?<\/div>\s*<\/div>/,
		""
	);
	html = html.replace(/<h1>Orbit Lab<\/h1>[\s\S]*?<div class="gate-foot">ORBIT LAB[\s\S]*?<\/div>/, "");

	const forceCss =
		'<style id="drift-force-desk">#gate,.gate-ui,.gate-access,#gate-nebula,#gate-stars{display:none!important;pointer-events:none!important}#desk{display:block!important;min-height:100vh}.ai-tools{display:none!important}.win>.body{position:relative!important;flex:1;min-height:0;overflow:hidden}.win>.title{position:relative;z-index:30;flex:none}</style>';
	html = insertBeforeLast(html, "</head>", forceCss);

	html = html.replace(
		"const APPS={calc:'Calculator',browser:'Browser',ai:'AI',yt:'YouTube'};",
		"const APPS={calc:'Calculator',browser:'Browser',ai:'AI',yt:'YouTube',cam:'Camera',mus:'Music',movies:'Movies',code:'VS Code',discord:'Discord',gmail:'Gmail',ig:'Instagram',tt:'TikTok',classroom:'Classroom',canva:'Canva',roblox:'Roblox',gimkit:'Gimkit',games:'Games',chat:'Chat',github:'GitHub',whatsapp:'WhatsApp',wayground:'Wayground',injector:'JS Injector'};"
	);
	html = html.replace(
		"const defD=()=>({pins:['calc','browser','ai','yt'],desk:['calc','browser','ai','yt'],chats:[]});",
		"const defD=()=>({pins:['calc','browser','ai','yt','gmail','gimkit'],desk:['browser','ai','yt','gmail','gimkit','movies','github','whatsapp','games'],chats:[]});"
	);

	const xapps =
		"const XAPPS={cam:{n:'Camera',f:camera},mus:{n:'Music',f:music},movies:{n:'Movies',f:movies},code:{n:'VS Code',f:vscode},discord:{n:'Discord',f:discordApp},gmail:{n:'Gmail',f:gmailApp},ig:{n:'Instagram',f:igApp},tt:{n:'TikTok',f:ttApp}," +
		"classroom:{n:'Classroom',f:function(r){proxySite(r,'https://classroom.google.com','Classroom')}}," +
		"canva:{n:'Canva',f:function(r){proxySite(r,'https://www.canva.com','Canva')}}," +
		"roblox:{n:'Roblox',f:function(r){proxySite(r,'https://www.roblox.com/login','Roblox')}}," +
		"gimkit:{n:'Gimkit',f:gimkitApp},games:{n:'Games',f:function(r){return (window.noahGamesApp||gamesHub)(r)}},chat:{n:'Chat',f:noahChat}};" +
		"window.XAPPS=XAPPS;window.APPS=APPS;try{window.IC=IC}catch(e){}try{window.proxySite=proxySite}catch(e){}try{window.vscode=vscode}catch(e){}try{window.S=S}catch(e){}try{window.discordApp=discordApp}catch(e){};";
	html = html.replace(
		/const XAPPS=\{cam:\{n:'Camera',f:camera\}[\s\S]*?roblox:\{n:'Roblox',f:robloxApp\}\};/,
		xapps
	);

	html = html.replace(
		"sh.classList.add('show');\n  sh.querySelectorAll('[data-tip]').forEach(btn=>{",
		"if(!sh.querySelector('#drift-modes')){const card=document.createElement('div');card.className='card';card.id='drift-modes';card.innerHTML='<div style=\"display:flex;align-items:center;justify-content:space-between;padding:10px 12px\"><b>Caveman</b><input id=\"drift-cav\" type=\"checkbox\"></div><div style=\"padding:0 12px 12px\"><div style=\"font-size:12px;font-weight:600;margin-bottom:6px\">Custom instructions</div><textarea id=\"drift-ins\" placeholder=\"How Drift should respond\" style=\"width:100%;min-height:84px;box-sizing:border-box;border-radius:8px;border:1px solid var(--line);background:var(--omni);color:var(--ink);padding:8px\"></textarea></div>';sh.appendChild(card);}var cav=sh.querySelector('#drift-cav'),ins=sh.querySelector('#drift-ins');if(cav){cav.checked=!!caveman;cav.onchange=function(){caveman=cav.checked};}if(ins){ins.value=customInstr||'';ins.oninput=function(){customInstr=ins.value;try{LS.set('wos:cinst',customInstr)}catch(e){}};}sh.classList.add('show');\n  sh.querySelectorAll('[data-tip]').forEach(btn=>{"
	);

	html = html.replace(
		"const openm=txt.match(/OPEN_APP:([a-z0-9_]+)/i);\n      if(openm){try{openApp(openm[1].toLowerCase())}catch(e){}txt=txt.replace(openm[0],'').trim()||('Opened '+openm[1])}",
		"const openm=txt.match(/OPEN_APP:([a-z0-9_]+)/i);\n      if(openm){const __u=(mine.filter(m=>m.role==='user').pop()||{}).content||'';const __ok=/\\b(open|abre|abrir|launch|start)\\b/i.test(__u);if(__ok){try{openApp(openm[1].toLowerCase())}catch(e){}txt=txt.replace(openm[0],'').trim()||('Opened '+openm[1])}else{txt=txt.replace(openm[0],'').trim()}}"
	);
	html = html.replace(
		"When the user asks you to open an app",
		"Only when the user explicitly asks to open/launch an app by name"
	);
	html = html.replace(
		"reply with a single line exactly: OPEN_APP:<id>",
		"and only then, reply with a single line exactly: OPEN_APP:<id>. Never emit OPEN_APP for weather, facts, homework, or normal chat"
	);

	const tag =
		'<script src="/drift-extras.js?v=20261018e" defer></script>' +
		'<script src="/chromebook-proxy.js?v=20261018e" defer></script>' +
		'<script src="/wayground-ai.js?v=20261018e" defer></script>' +
		'<script src="/drift-fixup.js?v=20261018e" defer></script>' +
		"<script>(function(){try{sessionStorage.setItem('drift:gate','1')}catch(e){}" +
		"function h(){var g=document.getElementById('gate');if(g){g.style.display='none';g.classList.add('gone')}" +
		"document.querySelectorAll('.gate-ui,.gate-access,#gate-stars,#gate-nebula').forEach(function(el){el.style.display='none'});}" +
		"h();setTimeout(h,100);setTimeout(h,600);})();</script>";
	html = insertBeforeLast(html, "</body>", tag);

	return html;
}

let wisp = null, scramjetPath = null, libcurlPath = null, baremuxPath = null;
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
	console.warn("Wisp:", e && e.message);
}
try {
	scramjetPath = (await import("@mercuryworkshop/scramjet/path")).scramjetPath;
} catch (e) {}
try {
	libcurlPath = (await import("@mercuryworkshop/libcurl-transport")).libcurlPath;
} catch (e) {}
try {
	baremuxPath = (await import("@mercuryworkshop/bare-mux/node")).baremuxPath;
} catch (e) {}

const fastify = Fastify({
	serverFactory: (handler) =>
		createServer()
			.on("request", (req, res) => {
				res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
				res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
				res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
				handler(req, res);
			})
			.on("upgrade", (req, socket, head) => {
				if (wisp && req.url && req.url.endsWith("/wisp/")) {
					try {
						wisp.routeRequest(req, socket, head);
					} catch {
						socket.end();
					}
				} else socket.end();
			}),
});

const sendIndex = async (_req, reply) => {
	const html = loadAndPatchIndex();
	if (!html) return reply.code(500).send("Missing index.html");
	reply.header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
	reply.header("Pragma", "no-cache");
	return reply.type("text/html; charset=utf-8").send(html);
};

fastify.get("/", sendIndex);
fastify.get("/index.html", sendIndex);
fastify.get("/health", async () => ({
	ok: true,
	scramjet: !!scramjetPath,
	noahGames: true,
	noahAsset: true,
}));

await fastify.register(fastifyStatic, {
	root: publicPath,
	decorateReply: true,
	index: false,
});
if (scramjetPath)
	await fastify.register(fastifyStatic, {
		root: scramjetPath,
		prefix: "/scram/",
		decorateReply: false,
	});
if (libcurlPath)
	await fastify.register(fastifyStatic, {
		root: libcurlPath,
		prefix: "/libcurl/",
		decorateReply: false,
	});
if (baremuxPath)
	await fastify.register(fastifyStatic, {
		root: baremuxPath,
		prefix: "/baremux/",
		decorateReply: false,
	});

fastify.get("/api/itunes", async (req, reply) => {
	const term = String((req.query && req.query.term) || "").slice(0, 120);
	const r = await fetch(
		"https://itunes.apple.com/search?media=music&entity=song&limit=40&term=" + encodeURIComponent(term)
	);
	const j = await r.json();
	return reply.header("Cross-Origin-Resource-Policy", "same-origin").send(j);
});

fastify.get("/api/media", async (req, reply) => {
	const u = String((req.query && req.query.u) || "");
	let host = "";
	try {
		host = new URL(u).hostname;
	} catch {
		return reply.code(400).send("bad url");
	}
	const ok =
		host === "audio-ssl.itunes.apple.com" ||
		host.endsWith(".mzstatic.com") ||
		host === "is1-ssl.mzstatic.com";
	if (!ok || !u.startsWith("https://")) return reply.code(400).send("blocked");
	const r = await fetch(u);
	reply.header("Cross-Origin-Resource-Policy", "cross-origin");
	reply.header("Content-Type", r.headers.get("content-type") || "application/octet-stream");
	reply.header("Cache-Control", "public, max-age=3600");
	return reply.send(Buffer.from(await r.arrayBuffer()));
});

fastify.get("/api/raw", async (req, reply) => {
	const u = String((req.query && req.query.u) || "");
	let host = "";
	try {
		host = new URL(u).hostname;
	} catch {
		return reply.code(400).send("bad url");
	}
	const allow =
		host === "raw.githubusercontent.com" ||
		host === "update.greasyfork.org" ||
		host === "greasyfork.org" ||
		host.endsWith(".greasyfork.org") ||
		host === "github.com" ||
		host === "objects.githubusercontent.com" ||
		host === "release-assets.githubusercontent.com" ||
		host.endsWith(".githubusercontent.com");
	if (!allow || !u.startsWith("https://")) return reply.code(400).send("blocked");
	const r = await fetch(u, { headers: { "User-Agent": "Drift-OS" }, redirect: "follow" });
	if (!r.ok) return reply.code(r.status).send("upstream");
	reply.header("Content-Type", "text/javascript; charset=utf-8");
	reply.header("Cross-Origin-Resource-Policy", "same-origin");
	return reply.send(await r.text());
});

fastify.get("/api/noah-asset", async (req, reply) => {
	const u = String((req.query && req.query.u) || "");
	let host = "";
	try {
		host = new URL(u).hostname;
	} catch {
		return reply.code(400).send("bad url");
	}
	if (host !== "noahstutoring.academy" && !host.endsWith(".noahstutoring.academy")) {
		return reply.code(400).send("blocked");
	}
	if (!u.startsWith("https://")) return reply.code(400).send("blocked");
	const r = await fetch(u, { headers: { "User-Agent": "Drift-OS" } });
	if (!r.ok) return reply.code(r.status).send("upstream");
	reply.header("Cross-Origin-Resource-Policy", "same-origin");
	reply.header("Content-Type", r.headers.get("content-type") || "image/jpeg");
	reply.header("Cache-Control", "public, max-age=86400");
	return reply.send(Buffer.from(await r.arrayBuffer()));
});

fastify.get("/api/noah-games", async (_req, reply) => {
	const now = Date.now();
	if (noahCache.data && now - noahCache.at < 10 * 60 * 1000) {
		return reply.header("Cross-Origin-Resource-Policy", "same-origin").send(noahCache.data);
	}
	const r = await fetch("https://noahstutoring.academy/js/games.js?v=194", {
		headers: { "User-Agent": "Drift-OS" },
	});
	if (!r.ok) return reply.code(502).send({ error: "upstream" });
	const src = await r.text();
	const data = parseNoahGames(src);
	noahCache = { at: now, data };
	return reply.header("Cross-Origin-Resource-Policy", "same-origin").send(data);
});

fastify.setNotFoundHandler((_req, reply) => {
	try {
		if (fs.existsSync(path.join(publicPath, "404.html")))
			return reply.code(404).type("text/html").sendFile("404.html");
	} catch {}
	return reply.code(404).send("Not found");
});

let port = parseInt(process.env.PORT || "", 10);
if (Number.isNaN(port)) port = 8080;
await fastify.listen({ port, host: "0.0.0.0" });
console.log("Drift listening", port);
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
