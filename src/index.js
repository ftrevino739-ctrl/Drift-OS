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

	// Gate OFF for now (re-enable later with enabled:true + password 1)
	html = html.replace(/enabled\s*:\s*true/, "enabled:false");
	html = html.replace(/passwordHash\s*:\s*['"][a-fA-F0-9]{64}['"]/g, "passwordHash:'" + TEMP_PASS_HASH + "'");

	// Full app list in start menu
	html = html.replace(
		"const APPS={calc:'Calculator',browser:'Browser',ai:'AI',yt:'YouTube'};",
		"const APPS={calc:'Calculator',browser:'Browser',ai:'AI',yt:'YouTube',cam:'Camera',mus:'Music',movies:'Movies',code:'VS Code',discord:'Discord',gmail:'Gmail',ig:'Instagram',tt:'TikTok',classroom:'Classroom',canva:'Canva',roblox:'Roblox',gimkit:'Gimkit',games:'Games',chat:'Chat'};"
	);

	// Desktop defaults
	html = html.replace(
		"const defD=()=>({pins:['calc','browser','ai','yt'],desk:['calc','browser','ai','yt'],chats:[]});",
		"const defD=()=>({pins:['calc','browser','ai','yt','gmail','gimkit'],desk:['browser','ai','yt','gmail','gimkit','movies','cam','chat'],chats:[]});"
	);

	// XAPPS referenced undefined classroomApp/canvaApp/robloxApp → crashed entire OS
	const xapps =
		"const XAPPS={cam:{n:'Camera',f:camera},mus:{n:'Music',f:music},movies:{n:'Movies',f:movies},code:{n:'VS Code',f:vscode},discord:{n:'Discord',f:discordApp},gmail:{n:'Gmail',f:gmailApp},ig:{n:'Instagram',f:igApp},tt:{n:'TikTok',f:ttApp}," +
		"classroom:{n:'Classroom',f:function(r){proxySite(r,'https://classroom.google.com','Classroom')}}," +
		"canva:{n:'Canva',f:function(r){proxySite(r,'https://www.canva.com','Canva')}}," +
		"roblox:{n:'Roblox',f:function(r){proxySite(r,'https://www.roblox.com','Roblox')}}," +
		"gimkit:{n:'Gimkit',f:gimkitApp},games:{n:'Games',f:gamesHub},chat:{n:'Chat',f:noahChat}};";
	html = html.replace(
		/const XAPPS=\{cam:\{n:'Camera',f:camera\}[\s\S]*?roblox:\{n:'Roblox',f:robloxApp\}\};/,
		xapps
	);

	// Extra icons after IC.yt
	const extraIC =
		";(function(){function L(b,t){return '<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"'+b+'\"/><text x=\"24\" y=\"31\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#fff\" font-family=\"system-ui,sans-serif\">'+t+'</text></svg>'}" +
		"IC.cam=L('#0f172a','Cam');IC.mus=L('#1db954','Mu');IC.movies=L('#e50914','N');IC.code=L('#007acc','VS');" +
		"IC.discord=L('#5865f2','D');IC.gmail=L('#ea4335','M');IC.ig=L('#e1306c','IG');IC.tt=L('#111','TT');" +
		"IC.classroom=L('#0f9d58','Cl');IC.canva=L('#00c4cc','Ca');IC.roblox=L('#e2231a','R');" +
		"IC.gimkit=L('#00c2a8','Gk');IC.games=L('#f59e0b','G');IC.chat=L('#5865f2','Ch');})();";
	html = html.replace(
		"IC.yt='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#fff\"/><rect x=\"6\" y=\"12\" width=\"36\" height=\"24\" rx=\"8\" fill=\"#ff0033\"/><path d=\"M20 18l10 6-10 6z\" fill=\"#fff\"/></svg>';",
		"IC.yt='<svg viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"11\" fill=\"#fff\"/><rect x=\"6\" y=\"12\" width=\"36\" height=\"24\" rx=\"8\" fill=\"#ff0033\"/><path d=\"M20 18l10 6-10 6z\" fill=\"#fff\"/></svg>';" + extraIC
	);

	html = html.replace(
		/try\{const ph=localStorage\.getItem\('drift:ph'\);if\(ph&&ph\.length===64\)A\.passwordHash=ph\}catch\(e\)\{\}/g,
		"try{localStorage.removeItem('drift:ph')}catch(e){}"
	);

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
		gateDisabled: !!(html && /enabled\s*:\s*false/.test(html)),
		fullApps: !!(html && html.includes("gimkit:'Gimkit'")),
		xappsFixed: !!(html && html.includes("gimkit:{n:'Gimkit'")),
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
console.log("Drift listening", port, "| gate OFF | full apps + scramjet");
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
