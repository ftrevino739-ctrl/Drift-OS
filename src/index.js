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

	// Gate OFF (only DRIFT_ACCESS, not comments)
	html = html.replace(
		/window\.DRIFT_ACCESS\s*=\s*\{[\s\S]*?enabled\s*:\s*true/,
		"window.DRIFT_ACCESS={enabled:false"
	);
	html = html.replace(/passwordHash\s*:\s*['"][a-fA-F0-9]{64}['"]/g, "passwordHash:'" + TEMP_PASS_HASH + "'");

	// Remove Orbit Lab blocks if present
	html = html.replace(
		/<div id="gate-stars"><\/div>\s*<div class="gate-ui">\s*<h1>Orbit Lab<\/h1>[\s\S]*?ORBIT LAB[\s\S]*?<\/div>\s*<\/div>/,
		""
	);
	html = html.replace(/<h1>Orbit Lab<\/h1>[\s\S]*?<div class="gate-foot">ORBIT LAB[\s\S]*?<\/div>/, "");

	// CSS hide gate — inject at LAST </head> only
	const forceCss =
		"<style id=\"drift-force-desk\">#gate,.gate-ui,.gate-access,#gate-nebula,#gate-stars{display:none!important;pointer-events:none!important}#desk{display:block!important;min-height:100vh}</style>";
	html = insertBeforeLast(html, "</head>", forceCss);

	// Expand APPS + desktop defaults
	html = html.replace(
		"const APPS={calc:'Calculator',browser:'Browser',ai:'AI',yt:'YouTube'};",
		"const APPS={calc:'Calculator',browser:'Browser',ai:'AI',yt:'YouTube',cam:'Camera',mus:'Music',movies:'Movies',code:'VS Code',discord:'Discord',gmail:'Gmail',ig:'Instagram',tt:'TikTok',classroom:'Classroom',canva:'Canva',roblox:'Roblox',gimkit:'Gimkit',games:'Games',chat:'Chat',github:'GitHub',whatsapp:'WhatsApp',wayground:'Wayground',injector:'JS Injector'};"
	);
	html = html.replace(
		"const defD=()=>({pins:['calc','browser','ai','yt'],desk:['calc','browser','ai','yt'],chats:[]});",
		"const defD=()=>({pins:['calc','browser','ai','yt','gmail','gimkit'],desk:['browser','ai','yt','gmail','gimkit','movies','github','whatsapp'],chats:[]});"
	);

	// Fix undefined classroomApp/canvaApp/robloxApp (crashes script)
	const xapps =
		"const XAPPS={cam:{n:'Camera',f:camera},mus:{n:'Music',f:music},movies:{n:'Movies',f:movies},code:{n:'VS Code',f:vscode},discord:{n:'Discord',f:discordApp},gmail:{n:'Gmail',f:gmailApp},ig:{n:'Instagram',f:igApp},tt:{n:'TikTok',f:ttApp}," +
		"classroom:{n:'Classroom',f:function(r){proxySite(r,'https://classroom.google.com','Classroom')}}," +
		"canva:{n:'Canva',f:function(r){proxySite(r,'https://www.canva.com','Canva')}}," +
		"roblox:{n:'Roblox',f:function(r){proxySite(r,'https://www.roblox.com/login','Roblox')}}," +
		"gimkit:{n:'Gimkit',f:gimkitApp},games:{n:'Games',f:gamesHub},chat:{n:'Chat',f:noahChat}};";
	html = html.replace(
		/const XAPPS=\{cam:\{n:'Camera',f:camera\}[\s\S]*?roblox:\{n:'Roblox',f:robloxApp\}\};/,
		xapps
	);

	// DO NOT touch OPEN_APP string (previous replace risked breaking templates)

	// Boot + extras: ONLY before the FINAL </body> (never the one inside JS strings)
	const tag =
		'<script src="/drift-extras.js" defer></script>' +
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
	const opens = (html.match(/<script/g) || []).length;
	const closes = (html.match(/<\/script>/g) || []).length;
	return {
		ok: true,
		scriptTagsBalanced: opens === closes,
		scriptOpens: opens,
		scriptCloses: closes,
		fullApps: !!(html && html.includes("gimkit:'Gimkit'")),
		scramjet: !!scramjetPath,
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
console.log("Drift listening", port, "| script-safe inject | full menu");
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
