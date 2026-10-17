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
		"const defD=()=>({pins:['calc','browser','ai','yt','gmail','gimkit'],desk:['browser','ai','yt','gmail','gimkit','movies','github','whatsapp'],chats:[]});"
	);

	const xapps =
		"const XAPPS={cam:{n:'Camera',f:camera},mus:{n:'Music',f:music},movies:{n:'Movies',f:movies},code:{n:'VS Code',f:vscode},discord:{n:'Discord',f:discordApp},gmail:{n:'Gmail',f:gmailApp},ig:{n:'Instagram',f:igApp},tt:{n:'TikTok',f:ttApp}," +
		"classroom:{n:'Classroom',f:function(r){proxySite(r,'https://classroom.google.com','Classroom')}}," +
		"canva:{n:'Canva',f:function(r){proxySite(r,'https://www.canva.com','Canva')}}," +
		"roblox:{n:'Roblox',f:function(r){proxySite(r,'https://www.roblox.com/login','Roblox')}}," +
		"gimkit:{n:'Gimkit',f:gimkitApp},games:{n:'Games',f:gamesHub},chat:{n:'Chat',f:noahChat}};" +
		"window.XAPPS=XAPPS;window.APPS=APPS;try{window.IC=IC}catch(e){}try{window.proxySite=proxySite}catch(e){}try{window.vscode=vscode}catch(e){}try{window.S=S}catch(e){}try{window.discordApp=discordApp}catch(e){};";
	html = html.replace(
		/const XAPPS=\{cam:\{n:'Camera',f:camera\}[\s\S]*?roblox:\{n:'Roblox',f:robloxApp\}\};/,
		xapps
	);

	html = html.replace(
		"sh.classList.add('show');\n  sh.querySelectorAll('[data-tip]').forEach(btn=>{",
		"if(!sh.querySelector('#drift-modes')){const card=document.createElement('div');card.className='card';card.id='drift-modes';card.innerHTML='<div style=\"display:flex;align-items:center;justify-content:space-between;padding:10px 12px\"><b>Caveman</b><input id=\"drift-cav\" type=\"checkbox\"></div><div style=\"padding:0 12px 12px\"><div style=\"font-size:12px;font-weight:600;margin-bottom:6px\">Custom instructions</div><textarea id=\"drift-ins\" placeholder=\"How Drift should respond\" style=\"width:100%;min-height:84px;box-sizing:border-box;border-radius:8px;border:1px solid var(--line);background:var(--omni);color:var(--ink);padding:8px\"></textarea></div>';sh.appendChild(card);}var cav=sh.querySelector('#drift-cav'),ins=sh.querySelector('#drift-ins');if(cav){cav.checked=!!caveman;cav.onchange=function(){caveman=cav.checked};}if(ins){ins.value=customInstr||'';ins.oninput=function(){customInstr=ins.value;try{LS.set('wos:cinst',customInstr)}catch(e){}};}sh.classList.add('show');\n  sh.querySelectorAll('[data-tip]').forEach(btn=>{"
	);

	const tag =
		'<script src="/drift-extras.js" defer></script><script src="/chromebook-proxy.js" defer></script>' +
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
	return reply.type("text/html; charset=utf-8").send(html);
};

fastify.get("/", sendIndex);
fastify.get("/index.html", sendIndex);
fastify.get("/health", async () => {
	const html = loadAndPatchIndex();
	return {
		ok: true,
		fullApps: !!(html && html.includes("gimkit:'Gimkit'")),
		scramjet: !!scramjetPath,
		extras: true,
		apis: true,
		chromebook: true,
	};
});

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
	if (!u.startsWith("https://raw.githubusercontent.com/")) return reply.code(400).send("blocked");
	const r = await fetch(u);
	if (!r.ok) return reply.code(r.status).send("upstream");
	reply.header("Content-Type", "text/javascript; charset=utf-8");
	reply.header("Cross-Origin-Resource-Policy", "same-origin");
	return reply.send(await r.text());
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
console.log("Drift listening", port, "| CORP + ChromeOS BareMux");
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
