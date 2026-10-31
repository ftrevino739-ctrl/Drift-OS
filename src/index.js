import { createServer } from "node:http";
import { fileURLToPath } from "url";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { handleMod } from "./mod-desk.js";

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
		'<style id="drift-force-desk">#gate,.gate-ui,.gate-access,#gate-nebula,#gate-stars{display:none!important;visibility:hidden!important;pointer-events:none!important}#desk{display:block!important;min-height:100vh}.win>.body{position:relative!important;flex:1;min-height:0;overflow:hidden}.win>.title{position:relative;z-index:30;flex:none}</style>';
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
		"const XAPPS={cam:{n:'Camera',f:camera},mus:{n:'Music',f:music},movies:{n:'Movies',f:movies},code:{n:'VS Code',f:vscode},discord:{n:'Discord',f:discordApp},gmail:{n:'Gmail',f:function(r){r.replaceChildren();r.style.cssText='position:relative;height:100%;min-height:0;background:#fff';var fr=document.createElement('iframe');fr.setAttribute('credentialless','');fr.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff';fr.src='/api/opera?u='+encodeURIComponent('https://mail.google.com/mail/u/0/#inbox')+'&b=firefox';r.appendChild(fr)}},ig:{n:'Instagram',f:igApp},tt:{n:'TikTok',f:ttApp}," +
		"classroom:{n:'Classroom',f:function(r){proxySite(r,'https://classroom.google.com','Classroom')}}," +
		"canva:{n:'Canva',f:function(r){proxySite(r,'https://www.canva.com','Canva')}}," +
		"roblox:{n:'Roblox',f:function(r){r.replaceChildren();r.style.cssText='position:relative;height:100%;min-height:0;background:#fff';var fr=document.createElement('iframe');fr.setAttribute('referrerpolicy','no-referrer');fr.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff';fr.src='/api/opera?u='+encodeURIComponent('https://www.roblox.com/')+'&b=edge';r.appendChild(fr)}}," +
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
		"if(typeof window.driftAct==='function'){var __a=window.driftAct('',txt);if(typeof __a==='string')txt=__a}"
	);
	html = html.replace(
		"const openm=txt.match(/OPEN_APP:([a-z0-9_]+)/i);\n      if(openm){const __u=(mine.filter(m=>m.role==='user').pop()||{}).content||'';const __ok=/\\b(open|abre|abrir|launch|start)\\b/i.test(__u);if(__ok){try{openApp(openm[1].toLowerCase())}catch(e){}txt=txt.replace(openm[0],'').trim()||('Opened '+openm[1])}else{txt=txt.replace(openm[0],'').trim()}}",
		"if(typeof window.driftAct==='function'){var __a=window.driftAct('',txt);if(typeof __a==='string')txt=__a}"
	);
	html = html.replace(
		"When the user asks you to open an app",
		"When the user wants an app, the taskbar, or a setting changed, in any wording"
	);
	html = html.replace(
		"reply with a single line exactly: OPEN_APP:<id>",
		"reply with OPEN_APP, TASKBAR, SIZE, or SET lines"
	);
	html = html.replace(
		"and only then, reply with a single line exactly: OPEN_APP:<id>. Never emit OPEN_APP for weather, facts, homework, or normal chat",
		"reply with OPEN_APP, TASKBAR, SIZE, or SET lines. Do not emit those lines for ordinary questions"
	);

	const tag =
		'<script src="/drift-extras.js?v=20261030-ide" defer></script>' +
		'<script src="/chromebook-proxy.js?v=20261020f" defer></script>' +
		'<script src="/wayground-ai.js?v=20261024a" defer></script>' +
		'<script src="/drift-fixup.js?v=20261030-ide" defer></script>' +
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
				res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
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

fastify.get("/", async (_req, reply) => {
	const edu = path.join(publicPath, "edu.html");
	if (!fs.existsSync(edu)) return sendIndex(_req, reply);
	reply.header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
	return reply.type("text/html; charset=utf-8").send(fs.readFileSync(edu, "utf8"));
});
fastify.get("/os", sendIndex);
fastify.get("/index.html", sendIndex);
function openDesk(req, reply, pathname) {
	const raw = req.raw;
	raw._json = req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body) ? req.body : {};
	if (pathname) raw.url = pathname;
	reply.hijack();
	handleMod(raw, reply.raw);
}
fastify.post("/api/ask", async (req, reply) => openDesk(req, reply));
fastify.post("/api/redeem", async (req, reply) => openDesk(req, reply));
fastify.post("/api/pulse", async (req, reply) => openDesk(req, reply));
fastify.post("/api/login", async (req, reply) => openDesk(req, reply));
fastify.post("/api/logout", async (req, reply) => openDesk(req, reply));
fastify.get("/api/requests", async (req, reply) => openDesk(req, reply));
fastify.post("/api/requests/:id/:action", async (req, reply) => openDesk(req, reply));
fastify.get("/api/sessions", async (req, reply) => openDesk(req, reply));
fastify.post("/api/sessions/:id/revoke", async (req, reply) => openDesk(req, reply));
fastify.get("/api/universal", async (req, reply) => openDesk(req, reply));
fastify.post("/api/universal", async (req, reply) => openDesk(req, reply));
fastify.get("/api/usage", async (req, reply) => openDesk(req, reply));
fastify.get("/mod", async (_req, reply) => {
	reply.header("Cache-Control", "no-store");
	return reply.type("text/html; charset=utf-8").send(fs.readFileSync(path.join(publicPath, "desk.html"), "utf8"));
});

fastify.post("/api/gemini", { bodyLimit: 6 * 1024 * 1024 }, async (req, reply) => {
	const key = process.env.GEMINI_API_KEY || "";
	if (!key) return reply.code(404).send({ error: "no-key" });
	const models = ["gemini-3.8-flash", "gemini-2.5-flash"];
	const busyText = JSON.stringify({ error: { code: 503, message: "Gemini is busy right now. Ask again in a moment.", status: "UNAVAILABLE" } });
	function sendJson(status, text) {
		reply.code(status);
		reply.header("content-type", "application/json; charset=utf-8");
		reply.header("cache-control", "no-store");
		return reply.send(text);
	}
	let lastStatus = 503;
	let lastText = busyText;
	try {
		const body = req.body || {};
		for (let mi = 0; mi < models.length; mi++) {
			const model = models[mi];
			const tries = 1;
			for (let attempt = 0; attempt < tries; attempt++) {
				let status = 503;
				let text = busyText;
				try {
					const r = await fetch(
						"https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(key),
						{
							method: "POST",
							headers: { "content-type": "application/json" },
							body: JSON.stringify(body),
							signal: AbortSignal.timeout(55000),
						}
					);
					status = r.status;
					text = await r.text();
				} catch {
					status = 503;
					text = busyText;
				}
				lastStatus = status;
				lastText = text || busyText;
				if (status >= 200 && status < 300) return sendJson(status, lastText);
				const busy = status === 503 || status === 429 || status === 500;
				if (status === 404 || (status === 400 && mi > 0)) break;
				if (!busy) return sendJson(status, lastText);
				if (attempt + 1 < tries) await new Promise((res) => setTimeout(res, 400));
			}
		}
		return sendJson(lastStatus || 503, lastText);
	} catch {
		return reply.code(502).send({ error: "Gemini did not answer." });
	}
});

function decodeSearchHref(href) {
	const raw = String(href || "").replace(/&/g, "&").trim();
	if (!raw) return "";
	try {
		const abs = new URL(raw, "https://duckduckgo.com/");
		const uddg = abs.searchParams.get("uddg");
		if (uddg) return decodeURIComponent(uddg);
		if (abs.pathname === "/url" || abs.pathname === "/url/") {
			const q = abs.searchParams.get("q") || abs.searchParams.get("url");
			if (q) return q;
		}
		if (/^https?:$/i.test(abs.protocol) && !/duckduckgo\.com$/i.test(abs.hostname)) return abs.toString();
	} catch {}
	return /^https?:\/\//i.test(raw) ? raw : "";
}
function cleanSearchText(s) {
	return String(s || "")
		.replace(/<[^>]+>/g, "")
		.replace(/&/g, "&")
		.replace(/"/g, '"')
		.replace(/&#39;|'/g, "'")
		.replace(/</g, "<")
		.replace(/>/g, ">")
		.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
		.replace(/\s+/g, " ")
		.trim();
}
function searchBlocked(html) {
	return /unusual traffic|detected unusual|our systems have detected|g-recaptcha|\/sorry\/|captcha-form|enable javascript to view/i.test(String(html || ""));
}
function pushResult(out, title, url) {
	if (!url || !/^https?:\/\//i.test(url)) return;
	if (/duckduckgo\.com|google\.(com|es)\/search|bing\.com\/search|googleadservices|gstatic\.com/i.test(url)) return;
	const t = title || url;
	if (out.some((x) => x.url === url)) return;
	out.push({ title: t.slice(0, 180), url });
}
function parseDdg(html) {
	const out = [];
	const re = /<a\b[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
	let m;
	while ((m = re.exec(html)) && out.length < 12) pushResult(out, cleanSearchText(m[2]), decodeSearchHref(m[1]));
	return out;
}
function parseBingRss(xml) {
	const out = [];
	const re = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>/gi;
	let m;
	while ((m = re.exec(xml)) && out.length < 12) {
		const title = cleanSearchText(m[1].replace(/<!\[CDATA\[|\]\]>/g, ""));
		const url = cleanSearchText(m[2].replace(/<!\[CDATA\[|\]\]>/g, ""));
		pushResult(out, title, url);
	}
	return out;
}
function parseGoogle(html) {
	const out = [];
	const re = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
	let m;
	while ((m = re.exec(html)) && out.length < 20) {
		let href = m[1].replace(/&/g, "&");
		if (href.startsWith("/url?") || href.startsWith("https://www.google.com/url?")) href = decodeSearchHref(href.startsWith("/") ? "https://www.google.com" + href : href);
		else if (!/^https?:/i.test(href)) continue;
		pushResult(out, cleanSearchText(m[2]), href);
		if (out.length >= 12) break;
	}
	return out;
}
const SEARCH_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
async function searchDdg(q) {
	const r = await fetch("https://html.duckduckgo.com/html/?q=" + encodeURIComponent(q), {
		headers: { "user-agent": SEARCH_UA, accept: "text/html", "accept-language": "en-US,en;q=0.9" },
	});
	return parseDdg(await r.text());
}
fastify.get("/api/search", async (req, reply) => {
	const q = String((req.query && req.query.q) || "").trim().slice(0, 240);
	const engine = String((req.query && req.query.engine) || "duckduckgo").toLowerCase();
	reply.header("cache-control", "no-store");
	if (!q) return reply.send({ results: [], engine: "duckduckgo" });
	let results = [];
	let used = "duckduckgo";
	try {
		if (engine === "bing") {
			const r = await fetch("https://www.bing.com/search?q=" + encodeURIComponent(q) + "&format=rss", {
				headers: { "user-agent": SEARCH_UA, accept: "application/rss+xml,text/xml,text/html" },
			});
			const xml = await r.text();
			if (!searchBlocked(xml)) results = parseBingRss(xml);
			if (results.length) used = "bing";
		} else if (engine === "google") {
			const r = await fetch("https://www.google.com/search?q=" + encodeURIComponent(q) + "&gbv=1&hl=en&num=10", {
				headers: { "user-agent": SEARCH_UA, accept: "text/html", "accept-language": "en-US,en;q=0.9" },
			});
			const html = await r.text();
			if (!searchBlocked(html)) results = parseGoogle(html);
			if (results.length) used = "google";
		}
	} catch {}
	if (!results.length) {
		try { results = await searchDdg(q); } catch {}
		used = "duckduckgo";
	}
	if (!results.length) {
		try {
			const wr = await fetch("https://holy-firefly-982c.fert0480.workers.dev/search?q=" + encodeURIComponent(q) + "&engine=duckduckgo", {
				headers: { accept: "application/json" },
			});
			if (wr.ok) {
				const wj = await wr.json();
				const rows = wj.results || wj.organic_results || [];
				for (const row of rows) {
					const url = row && (row.url || row.link);
					const title = row && (row.title || url);
					pushResult(results, title, url);
				}
				if (results.length) used = "duckduckgo";
			}
		} catch {}
	}
	return reply.send({ results, engine: used });
});

const TMDB_TOKEN = process.env.TMDB_TOKEN || process.env.TMDB_KEY || "";
const tmdbCache = new Map();
function tmdbTokens() {
	const list = [];
	for (const v of [process.env.TMDB_KEY, process.env.TMDB_TOKEN, TMDB_TOKEN]) {
		const t = String(v || "").trim();
		if (t && !list.includes(t)) list.push(t);
	}
	list.sort((a, b) => (a.startsWith("eyJ") ? 1 : 0) - (b.startsWith("eyJ") ? 1 : 0));
	return list;
}
async function tmdbFetch(path) {
	const base = "https://api.themoviedb.org/3/" + path + (path.includes("?") ? "&" : "?") + "language=es-MX";
	let last = { ok: false, status: 401, data: { status_message: "Invalid API key" } };
	for (const token of tmdbTokens()) {
		const jwt = token.startsWith("eyJ") && token.split(".").length === 3;
		const url = jwt ? base : base + "&api_key=" + encodeURIComponent(token);
		const headers = { accept: "application/json" };
		if (jwt) headers.Authorization = "Bearer " + token;
		const r = await fetch(url, { headers });
		const data = await r.json().catch(() => ({ error: "bad response" }));
		last = { ok: r.ok, status: r.status, data };
		if (r.ok) return last;
	}
	return last;
}
fastify.get("/api/tmdb", async (req, reply) => {
	const path = String((req.query && req.query.path) || "").replace(/^\/+/, "");
	if (!path || path.includes("..") || !/^[\w./?=&%+\-]+$/.test(path)) return reply.code(400).send({ error: "bad path" });
	if (!tmdbTokens().length) return reply.code(503).send({ error: "no-key" });
	const hit = tmdbCache.get(path);
	if (hit && Date.now() - hit.at < 10 * 60 * 1000) {
		reply.header("cache-control", "public, max-age=300");
		return reply.send(hit.data);
	}
	const got = await tmdbFetch(path);
	if (got.ok) tmdbCache.set(path, { at: Date.now(), data: got.data });
	reply.header("cache-control", got.ok ? "public, max-age=300" : "no-store");
	return reply.code(got.ok ? 200 : got.status).send(got.data);
});
fastify.get("/api/tmdb-img", async (req, reply) => {
	const p = String((req.query && req.query.p) || "");
	if (!/^\/[A-Za-z0-9_./-]+$/.test(p)) return reply.code(400).send("bad");
	const r = await fetch("https://image.tmdb.org/t/p/w185" + p);
	if (!r.ok) return reply.code(r.status).send("image");
	reply.header("content-type", r.headers.get("content-type") || "image/jpeg");
	reply.header("cache-control", "public, max-age=86400");
	reply.header("cross-origin-resource-policy", "same-origin");
	return reply.send(Buffer.from(await r.arrayBuffer()));
});

fastify.post("/api/use", async (req, reply) => openDesk(req, reply, "/api/usage"));

const BROWSER_PROFILES = {
	edge: {
		ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
		ch: "\"Microsoft Edge\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
	},
	firefox: {
		ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
		ch: "",
	},
	chrome: {
		ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
		ch: "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
	},
	opera: {
		ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0",
		ch: "\"Opera\";v=\"116\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
	},
	brave: {
		ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
		ch: "\"Brave\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
	},
};
function browserName(raw) {
	const name = String(raw || "edge").toLowerCase();
	return BROWSER_PROFILES[name] ? name : "edge";
}
const operaJars = new Map();
function operaHostOk(host) {
	host = String(host || "").toLowerCase();
	return (
		host === "google.com" || host.endsWith(".google.com") ||
		host === "gstatic.com" || host.endsWith(".gstatic.com") ||
		host === "googleusercontent.com" || host.endsWith(".googleusercontent.com") ||
		host === "googleapis.com" || host.endsWith(".googleapis.com") ||
		host === "canva.com" || host.endsWith(".canva.com") ||
		host === "accounts.youtube.com" ||
		host === "roblox.com" || host.endsWith(".roblox.com") ||
		host === "rbxcdn.com" || host.endsWith(".rbxcdn.com") ||
		host === "arkoselabs.com" || host.endsWith(".arkoselabs.com")
	);
}
function operaJar(req, reply) {
	const raw = String(req.headers.cookie || "");
	const m = raw.match(/(?:^|;\s*)drift_op=([a-f0-9]{24})/);
	let sid = m && operaJars.has(m[1]) ? m[1] : "";
	if (!sid) {
		sid = crypto.randomBytes(12).toString("hex");
		if (operaJars.size > 300) operaJars.delete(operaJars.keys().next().value);
		operaJars.set(sid, new Map());
		reply.header("set-cookie", "drift_op=" + sid + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200");
	}
	return operaJars.get(sid);
}
function operaStore(jar, url, response) {
	let host = "";
	try { host = new URL(url).hostname.toLowerCase(); } catch { return; }
	const lines = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
	for (const line of lines) {
		const segs = line.split(";").map((s) => s.trim());
		const eq = segs[0].indexOf("=");
		if (eq < 1) continue;
		const name = segs[0].slice(0, eq);
		const value = segs[0].slice(eq + 1);
		let domain = host;
		let cpath = "/";
		for (const seg of segs.slice(1)) {
			const i = seg.indexOf("=");
			const k = (i === -1 ? seg : seg.slice(0, i)).trim().toLowerCase();
			const v = i === -1 ? "" : seg.slice(i + 1).trim();
			if (k === "domain" && v) domain = v.replace(/^\./, "").toLowerCase();
			if (k === "path" && v) cpath = v;
		}
		if (!operaHostOk(domain)) continue;
		const list = (jar.get(domain) || []).filter((c) => c.name !== name);
		list.push({ name, value, path: cpath });
		jar.set(domain, list);
	}
}
function operaCookie(jar, url) {
	let u;
	try { u = new URL(url); } catch { return ""; }
	const host = u.hostname.toLowerCase();
	const bits = [];
	for (const [domain, list] of jar) {
		if (host !== domain && !host.endsWith("." + domain)) continue;
		for (const c of list) {
			if (u.pathname.startsWith(c.path || "/")) bits.push(c.name + "=" + c.value);
		}
	}
	return bits.join("; ");
}
function operaBoot(browser) {
	const name = browserName(browser);
	const profile = BROWSER_PROFILES[name];
	return `(function(){
  var ua = ${JSON.stringify(profile.ua)};
  var BROWSER = ${JSON.stringify(name)};
  try { Object.defineProperty(navigator, "userAgent", { get: function(){ return ua; } }); } catch (e) {}
  function abs(u){ try { return new URL(u, document.baseURI).href; } catch (e) { return ""; } }
  function ours(path){ return location.origin + path; }
  function googleHost(u){
    try {
      var h = new URL(u).hostname;
      return /(^|\\.)((google|gstatic|googleapis|googleusercontent|youtube|roblox|rbxcdn)\\.com)$/i.test(h) || /(^|\\.)arkoselabs\\.com$/i.test(h);
    }
    catch (e) { return false; }
  }
  var armed = false;
  var hops = 0;
  function hop(u){
    if (navigator.onLine === false) return false;
    if (hops > 2) return false;
    u = abs(u);
    if (!armed || !/^https?:/i.test(u) || u.indexOf("/api/opera?u=") !== -1) return false;
    var cur = "";
    try { cur = new URL(document.baseURI).href.replace(/\\/$/, ""); } catch (e) {}
    if (u.replace(/\\/$/, "") === cur) return false;
    var now = Date.now();
    try {
      var prev = sessionStorage.getItem("drift_hop") || "";
      var bits = prev.split("|");
      if (bits[0] === u && now - Number(bits[1] || 0) < 2500) return false;
      sessionStorage.setItem("drift_hop", u + "|" + now);
    } catch (e) {}
    hops++;
    location.href = ours("/api/opera?u=" + encodeURIComponent(u) + "&b=" + encodeURIComponent(BROWSER));
    return true;
  }
  function bodyText(body){
    if (body == null) return Promise.resolve("");
    if (typeof body === "string") return Promise.resolve(body);
    if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) return Promise.resolve(body.toString());
    if (typeof body.text === "function") return body.text().catch(function(){ return ""; });
    return Promise.resolve("");
  }
  function proxy(u, method, body, headers){
    return bodyText(body).then(function(form){
      return fetch(ours("/api/opera"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ u: u, method: method || "GET", form: form, raw: true, b: BROWSER, headers: headers || {} })
      });
    });
  }
  try {
    var origFetch = window.fetch;
    window.fetch = function(input, init){
      var rawU = typeof input === "string" ? input : (input && input.url) || "";
      var u = abs(rawU);
      if (!googleHost(u) || u.indexOf("/api/opera") !== -1) return origFetch.apply(this, arguments);
      init = init || {};
      var headers = {};
      try { new Headers(init.headers || (input && input.headers) || {}).forEach(function(v, k){ headers[k] = v; }); } catch (e) {}
      return proxy(u, (init.method || (input && input.method) || "GET").toUpperCase(), init.body, headers);
    };
  } catch (e) {}
  try {
    var XO = XMLHttpRequest.prototype.open;
    var XS = XMLHttpRequest.prototype.send;
    var XH = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.open = function(m, u){ this.__m = m; this.__u = abs(u); this.__h = {}; return XO.apply(this, arguments); };
    XMLHttpRequest.prototype.setRequestHeader = function(k, v){ try { this.__h[k] = v; } catch (e) {} return XH.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function(body){
      var u = this.__u || "";
      if (!googleHost(u)) return XS.apply(this, arguments);
      var self = this;
      proxy(u, String(self.__m || "GET").toUpperCase(), body, self.__h || {}).then(function(r){
        return r.text().then(function(t){
          var status = r.status || 200;
          try {
            Object.defineProperty(self, "readyState", { configurable: true, get: function(){ return 4; } });
            Object.defineProperty(self, "status", { configurable: true, get: function(){ return status; } });
            Object.defineProperty(self, "responseText", { configurable: true, get: function(){ return t; } });
            Object.defineProperty(self, "response", { configurable: true, get: function(){ return t; } });
            Object.defineProperty(self, "responseURL", { configurable: true, get: function(){ return u; } });
          } catch (e) {}
          try { self.dispatchEvent(new Event("readystatechange")); } catch (e) {}
          try { if (typeof self.onreadystatechange === "function") self.onreadystatechange(); } catch (e) {}
          try { self.dispatchEvent(new Event("load")); } catch (e) {}
          try { if (typeof self.onload === "function") self.onload(); } catch (e) {}
        });
      }).catch(function(){});
    };
  } catch (e) {}
  try {
    var desc = Object.getOwnPropertyDescriptor(Location.prototype, "href");
    if (desc && desc.set && desc.get) {
      Object.defineProperty(Location.prototype, "href", {
        configurable: true,
        get: function(){ return desc.get.call(this); },
        set: function(v){ if (!hop(v)) desc.set.call(this, v); }
      });
    }
  } catch (e) {}
  try {
    if (window.top && window.top !== window) {
      var topWin = window.top;
      var tLoc = topWin.location;
      var tProto = topWin.Location && topWin.Location.prototype;
      var td = tProto && Object.getOwnPropertyDescriptor(tProto, "href");
      if (td && td.set && td.get) {
        Object.defineProperty(tProto, "href", {
          configurable: true,
          get: function(){ return td.get.call(this); },
          set: function(v){
            if (this === tLoc && document.documentElement && document.documentElement.isConnected) {
              if (hops > 2) return;
              armed = true; hop(v); return;
            }
            td.set.call(this, v);
          }
        });
      }
      try {
        topWin.location.assign = function(v){ if (hops > 2) return; if (document.documentElement && document.documentElement.isConnected) { armed = true; hop(v); return; } };
        topWin.location.replace = function(v){ if (hops > 2) return; if (document.documentElement && document.documentElement.isConnected) { armed = true; hop(v); return; } };
      } catch (e2) {}
    }
  } catch (e) {}
  try { window.open = function(u){ armed = true; hop(u || ""); return null; }; } catch (e) {}
  document.addEventListener("click", function(e){
    armed = true;
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var u = abs(a.getAttribute("href"));
    if (/^https?:/i.test(u)) { e.preventDefault(); hop(u); }
  }, true);
  document.addEventListener("keydown", function(){ armed = true; }, true);
  document.addEventListener("submit", function(e){
    armed = true;
    var f = e.target;
    if (!f || !f.action) return;
    e.preventDefault();
    var body = new URLSearchParams();
    try { new FormData(f).forEach(function(v, k){ if (typeof v === "string") body.append(k, v); }); } catch (err) {}
    var emailEl = document.querySelector("#identifierId, input[name='identifier'], input[type='email']");
    if (emailEl && emailEl.value && !body.get("identifier")) body.set("identifier", emailEl.value);
    proxy(abs(f.action), (f.method || "POST").toUpperCase(), body.toString(), {}).then(function(r){ return r.text(); }).then(function(t){
      if (!t || t.length < 80) return;
      var cur = "";
      try { cur = document.documentElement ? document.documentElement.outerHTML : ""; } catch (e) {}
      function flat(s){ return String(s || "").replace(/\\s+/g, "").slice(0, 2500); }
      if (cur && flat(t) === flat(cur)) return;
      document.open(); document.write(t); document.close();
    }).catch(function(){ if (navigator.onLine !== false) hop(f.action); });
  }, true);
})();`;
}
function operaInject(html, pageUrl, browser) {
	const boot = "<base href=\"" + String(pageUrl).replace(/"/g, "") + "\"><script>" + operaBoot(browser) + "<" + "/script>";
	html = String(html).replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");
	html = html.replace(/<meta[^>]+http-equiv=["']refresh["'][^>]*>/gi, "");
	if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (m) => m + boot);
	return boot + html;
}
async function operaFetch(target, method, form, jar, contentType, extraHeaders, browser) {
	const profile = BROWSER_PROFILES[browserName(browser)];
	let current = target;
	let verb = String(method || "GET").toUpperCase() === "POST" ? "POST" : "GET";
	let body = form || "";
	for (let i = 0; i < 6; i++) {
		let u;
		try { u = new URL(current); } catch { return null; }
		if (u.protocol !== "https:" || !operaHostOk(u.hostname)) return { blocked: true, final: current };
		const headers = {
			"user-agent": profile.ua,
			accept: "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,*/*;q=0.8",
			"accept-language": "en-US,en;q=0.9",
			origin: u.origin,
			referer: current,
		};
		if (profile.ch) {
			headers["sec-ch-ua"] = profile.ch;
			headers["sec-ch-ua-mobile"] = "?0";
			headers["sec-ch-ua-platform"] = "\"Windows\"";
		}
		if (extraHeaders && typeof extraHeaders === "object") {
			for (const [k, v] of Object.entries(extraHeaders)) {
				const key = String(k || "").toLowerCase();
				if (!key || v == null) continue;
				if (/^(host|cookie|origin|referer|content-length|connection|user-agent|accept-encoding|content-type)$/.test(key)) continue;
				headers[key] = String(v).replace(/[\r\n]/g, "").slice(0, 500);
			}
		}
		const cookie = operaCookie(jar, current);
		if (cookie) headers.cookie = cookie;
		if (verb === "POST") headers["content-type"] = contentType || "application/x-www-form-urlencoded";
		const r = await fetch(current, {
			method: verb,
			headers,
			body: verb === "POST" ? body : undefined,
			redirect: "manual",
		});
		operaStore(jar, current, r);
		if (r.status >= 300 && r.status < 400) {
			const loc = r.headers.get("location");
			if (!loc) return { response: r, final: current };
			let next = new URL(loc, current).toString();
			if (/classroom\.google\.com/i.test(current) && /edu\.google\.com/i.test(next)) {
				next = "https://accounts.google.com/ServiceLogin?service=classroom&continue=" + encodeURIComponent("https://classroom.google.com/");
			}
			current = next;
			verb = "GET";
			body = "";
			continue;
		}
		return { response: r, final: current };
	}
	return null;
}
async function operaReply(req, reply, target, method, form, raw, contentType, extraHeaders) {
	const browser = browserName((req.query && req.query.b) || (req.body && req.body.b) || "edge");
	let u;
	try { u = new URL(target); } catch { return reply.code(400).send("bad url"); }
	if (u.protocol !== "https:" || !operaHostOk(u.hostname)) return reply.code(400).send("blocked");
	const jar = operaJar(req, reply);
	const got = await operaFetch(u.toString(), method, form, jar, contentType, extraHeaders, browser);
	if (!got) return reply.code(502).send("The page did not load.");
	if (got.blocked) return reply.code(400).send("blocked");
	const ct = got.response.headers.get("content-type") || "application/octet-stream";
	reply.header("cache-control", "no-store");
	if (!raw && /text\/html|application\/xhtml/i.test(ct)) {
		const html = await got.response.text();
		reply.header("content-security-policy", "default-src * data: blob: 'unsafe-inline' 'unsafe-eval'; script-src * data: blob: 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline' data: blob:; img-src * data: blob:; connect-src *; frame-src *; media-src *");
		reply.type("text/html; charset=utf-8");
		return reply.send(operaInject(html, got.final, browser));
	}
	const status = got.response.status >= 300 && got.response.status < 400 ? 200 : (got.response.status || 200);
	reply.code(status);
	reply.header("content-type", ct.split(";")[0] || ct);
	return reply.send(Buffer.from(await got.response.arrayBuffer()));
}
fastify.get("/api/opera", async (req, reply) => {
	return operaReply(req, reply, String((req.query && req.query.u) || ""), "GET", "", false, "");
});
fastify.post("/api/opera", { bodyLimit: 8 * 1024 * 1024 }, async (req, reply) => {
	const b = req.body || {};
	const headers = b.headers && typeof b.headers === "object" ? b.headers : {};
	const ct = headers["content-type"] || headers["Content-Type"] || "";
	return operaReply(req, reply, String(b.u || ""), String(b.method || "POST"), String(b.form || ""), !!b.raw, String(ct).slice(0, 160), headers);
});

function chatFile() {
	const preferred = process.env.DATA_DIR ? path.join(process.env.DATA_DIR, "chat.json") : path.join(rootPath, "data", "chat.json");
	const candidates = [preferred, path.join(rootPath, "data", "chat.json"), "/tmp/drift-chat.json"];
	for (const file of candidates) {
		try {
			fs.mkdirSync(path.dirname(file), { recursive: true });
			const probe = file + ".probe";
			fs.writeFileSync(probe, "ok");
			fs.unlinkSync(probe);
			return file;
		} catch {}
	}
	return "/tmp/drift-chat.json";
}
const CHAT_FILE = chatFile();
function chatRead() {
	try { return JSON.parse(fs.readFileSync(CHAT_FILE, "utf8")); }
	catch { return { users: [], servers: [], messages: [] }; }
}
function chatWrite(db) {
	const tmp = CHAT_FILE + ".tmp";
	fs.writeFileSync(tmp, JSON.stringify(db));
	fs.renameSync(tmp, CHAT_FILE);
}
function chatHash(s) { return crypto.createHash("sha256").update(String(s)).digest("hex"); }
function chatUser(req, db) {
	const tok = String(req.headers["x-drift-chat"] || "");
	if (!tok) return null;
	return db.users.find((u) => u.token === tok) || null;
}
function publicUser(u) {
	return { id: u.id, username: u.username, displayName: u.displayName || u.username, avatar: u.avatar || "" };
}
function ensureChat(db) {
	let dirty = false;
	if (!Array.isArray(db.users)) { db.users = []; dirty = true; }
	if (!Array.isArray(db.servers)) { db.servers = []; dirty = true; }
	if (!Array.isArray(db.messages)) { db.messages = []; dirty = true; }
	if (!Array.isArray(db.friends)) { db.friends = []; dirty = true; }
	if (!Array.isArray(db.dms)) { db.dms = []; dirty = true; }
	if (!Array.isArray(db.dmMessages)) { db.dmMessages = []; dirty = true; }
	if (!Array.isArray(db.voice)) { db.voice = []; dirty = true; }
	const now = Date.now();
	const voice = db.voice.filter((v) => now - (v.at || 0) < 25000);
	if (voice.length !== db.voice.length) { db.voice = voice; dirty = true; }
	for (const u of db.users) {
		if (!u.displayName) { u.displayName = u.username; dirty = true; }
		if (!u.settings) {
			u.settings = { desktop: true, sounds: true, badges: true, whoFriends: "everyone", whoDMs: "everyone" };
			dirty = true;
		}
		if (!u.mutes) { u.mutes = {}; dirty = true; }
	}
	for (const s of db.servers) {
		if (!Array.isArray(s.members)) { s.members = []; dirty = true; }
		const raw = s.channels;
		const needs = !raw || !raw.length || typeof raw[0] === "string" || !raw.some((c) => c && c.type === "voice");
		if (needs) {
			const base = !raw || !raw.length ? ["general"] : raw;
			s.channels = base.map((c) => (typeof c === "string" ? { id: c, name: c, type: "text" } : { id: c.id || c.name, name: c.name, type: c.type || "text" }));
			if (!s.channels.some((c) => c.type === "voice")) s.channels.push({ id: "voice", name: "Voice", type: "voice" });
			dirty = true;
		}
	}
	if (dirty) chatWrite(db);
	return db;
}
function areFriends(db, a, b) {
	return db.friends.some((f) => f.status === "accepted" && ((f.from === a && f.to === b) || (f.from === b && f.to === a)));
}
function friendsOf(db, user) {
	return db.friends.filter((f) => f.from === user.id || f.to === user.id).map((f) => {
		const other = db.users.find((u) => u.id === (f.from === user.id ? f.to : f.from));
		if (!other) return null;
		return { id: f.id, status: f.status, incoming: f.to === user.id && f.status === "pending", user: publicUser(other) };
	}).filter(Boolean);
}
function chatState(db, user) {
	const servers = db.servers.filter((s) => s.members.includes(user.id)).map((s) => ({
		id: s.id,
		name: s.name,
		owner: s.owner === user.id,
		channels: s.channels,
		members: s.members.map((id) => db.users.find((u) => u.id === id)).filter(Boolean).map(publicUser),
		mute: user.mutes[s.id] || { mute: false, mentionsOnly: false },
	}));
	const dms = db.dms.filter((d) => (d.users || []).includes(user.id) && !(d.closed || []).includes(user.id)).map((d) => {
		const otherId = d.users.find((id) => id !== user.id);
		const other = db.users.find((u) => u.id === otherId);
		const last = [...db.dmMessages].reverse().find((m) => m.dm === d.id);
		const request = !areFriends(db, user.id, otherId) && d.from !== user.id && !(d.ok || []).includes(user.id);
		return { id: d.id, request, with: other ? publicUser(other) : { id: otherId, username: "unknown", displayName: "unknown", avatar: "" }, last: last ? last.text : "" };
	});
	return {
		user: Object.assign(publicUser(user), { settings: user.settings }),
		servers,
		friends: friendsOf(db, user),
		dms,
		voice: db.voice.map((v) => ({ server: v.server, channel: v.channel, user: v.user, username: v.username })),
	};
}
function decorateMessages(db, list) {
	return list.map((m) => {
		const u = db.users.find((x) => x.id === m.user);
		return Object.assign({}, m, { displayName: (u && (u.displayName || u.username)) || m.username, avatar: (u && u.avatar) || "" });
	});
}
fastify.post("/api/chat/register", async (req, reply) => {
	const b = req.body || {};
	const username = String(b.username || "").trim().slice(0, 32);
	const password = String(b.password || "");
	if (username.length < 2 || password.length < 4) return reply.code(400).send({ error: "Username and a password of 4 or more characters." });
	const db = ensureChat(chatRead());
	if (db.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) return reply.code(400).send({ error: "That username is taken." });
	const user = {
		id: crypto.randomBytes(8).toString("hex"), username, displayName: username, avatar: "",
		pass: chatHash(password), token: crypto.randomBytes(24).toString("hex"),
		settings: { desktop: true, sounds: true, badges: true, whoFriends: "everyone", whoDMs: "everyone" }, mutes: {},
	};
	db.users.push(user);
	chatWrite(db);
	return { token: user.token, user: publicUser(user) };
});
fastify.post("/api/chat/login", async (req, reply) => {
	const b = req.body || {};
	const username = String(b.username || "").trim();
	const password = String(b.password || "");
	const db = ensureChat(chatRead());
	const user = db.users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.pass === chatHash(password));
	if (!user) return reply.code(401).send({ error: "Wrong username or password." });
	user.token = crypto.randomBytes(24).toString("hex");
	chatWrite(db);
	return { token: user.token, user: publicUser(user) };
});
fastify.get("/api/chat/me", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	return chatState(db, user);
});
fastify.post("/api/chat/profile", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const b = req.body || {};
	if (b.displayName != null) {
		const name = String(b.displayName || "").trim().slice(0, 32);
		if (name.length < 1) return reply.code(400).send({ error: "Display name cannot be empty." });
		user.displayName = name;
	}
	if (b.avatar != null) {
		const avatar = String(b.avatar || "");
		if (avatar && !/^data:image\//.test(avatar)) return reply.code(400).send({ error: "Avatar must be an image." });
		if (avatar.length > 140000) return reply.code(400).send({ error: "That image is too large." });
		user.avatar = avatar;
	}
	if (b.settings && typeof b.settings === "object") {
		const s = user.settings;
		if (typeof b.settings.desktop === "boolean") s.desktop = b.settings.desktop;
		if (typeof b.settings.sounds === "boolean") s.sounds = b.settings.sounds;
		if (typeof b.settings.badges === "boolean") s.badges = b.settings.badges;
		if (b.settings.whoFriends === "everyone" || b.settings.whoFriends === "nobody") s.whoFriends = b.settings.whoFriends;
		if (b.settings.whoDMs === "everyone" || b.settings.whoDMs === "friends") s.whoDMs = b.settings.whoDMs;
	}
	chatWrite(db);
	return chatState(db, user);
});
fastify.get("/api/chat/users", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const q = String(req.query.q || "").trim().toLowerCase();
	const users = db.users.filter((u) => u.id !== user.id && (!q || u.username.toLowerCase().includes(q) || (u.displayName || "").toLowerCase().includes(q))).slice(0, 20).map(publicUser);
	return { users };
});
fastify.post("/api/chat/friends", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const username = String((req.body || {}).username || "").trim();
	const other = db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
	if (!other || other.id === user.id) return reply.code(404).send({ error: "No account with that username." });
	if ((other.settings || {}).whoFriends === "nobody") return reply.code(400).send({ error: "That person is not accepting friend requests." });
	const row = db.friends.find((f) => (f.from === user.id && f.to === other.id) || (f.from === other.id && f.to === user.id));
	if (row && row.status === "accepted") return reply.code(400).send({ error: "You are already friends." });
	if (row && row.status === "pending") return reply.code(400).send({ error: "That request is already pending." });
	db.friends.push({ id: crypto.randomBytes(6).toString("hex"), from: user.id, to: other.id, status: "pending" });
	chatWrite(db);
	return chatState(db, user);
});
fastify.post("/api/chat/friends/:id/accept", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const row = db.friends.find((f) => f.id === req.params.id && f.to === user.id && f.status === "pending");
	if (!row) return reply.code(404).send({ error: "Request not found." });
	row.status = "accepted";
	chatWrite(db);
	return { ok: true };
});
fastify.post("/api/chat/friends/:id/decline", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const i = db.friends.findIndex((f) => f.id === req.params.id && (f.to === user.id || f.from === user.id));
	if (i < 0) return reply.code(404).send({ error: "Request not found." });
	db.friends.splice(i, 1);
	chatWrite(db);
	return { ok: true };
});
fastify.post("/api/chat/dms", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const username = String((req.body || {}).username || "").trim();
	const other = db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
	if (!other || other.id === user.id) return reply.code(404).send({ error: "No account with that username." });
	if ((other.settings || {}).whoDMs === "friends" && !areFriends(db, user.id, other.id)) return reply.code(400).send({ error: "That person only accepts messages from friends." });
	let dm = db.dms.find((d) => d.users.includes(user.id) && d.users.includes(other.id));
	if (!dm) {
		dm = { id: crypto.randomBytes(8).toString("hex"), users: [user.id, other.id], from: user.id, ok: [user.id], closed: [] };
		db.dms.unshift(dm);
	} else {
		dm.closed = (dm.closed || []).filter((id) => id !== user.id);
	}
	chatWrite(db);
	return { dm: { id: dm.id } };
});
fastify.post("/api/chat/dms/:id/accept", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const dm = db.dms.find((d) => d.id === req.params.id && (d.users || []).includes(user.id));
	if (!dm) return reply.code(404).send({ error: "Conversation not found." });
	dm.ok = dm.ok || [];
	if (!dm.ok.includes(user.id)) dm.ok.push(user.id);
	chatWrite(db);
	return { ok: true };
});
fastify.post("/api/chat/dms/:id/close", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const dm = db.dms.find((d) => d.id === req.params.id && (d.users || []).includes(user.id));
	if (!dm) return reply.code(404).send({ error: "Conversation not found." });
	dm.closed = dm.closed || [];
	if (!dm.closed.includes(user.id)) dm.closed.push(user.id);
	chatWrite(db);
	return { ok: true };
});
fastify.get("/api/chat/dms/:id/messages", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const dm = db.dms.find((d) => d.id === req.params.id && (d.users || []).includes(user.id));
	if (!dm) return reply.code(404).send({ error: "Conversation not found." });
	return { messages: decorateMessages(db, db.dmMessages.filter((m) => m.dm === dm.id).slice(-200)) };
});
fastify.post("/api/chat/dms/:id/messages", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const dm = db.dms.find((d) => d.id === req.params.id && (d.users || []).includes(user.id));
	if (!dm) return reply.code(404).send({ error: "Conversation not found." });
	const text = String((req.body || {}).text || "").trim().slice(0, 2000);
	if (!text) return reply.code(400).send({ error: "Empty message." });
	db.dmMessages.push({ id: crypto.randomBytes(6).toString("hex"), dm: dm.id, user: user.id, username: user.username, text, time: new Date().toISOString() });
	db.dmMessages = db.dmMessages.slice(-4000);
	chatWrite(db);
	return { ok: true };
});
fastify.get("/api/chat/servers", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const q = String(req.query.q || "").trim().toLowerCase();
	const servers = db.servers
		.filter((s) => !q || s.name.toLowerCase().includes(q) || s.id === q)
		.slice(0, 30)
		.map((s) => ({ id: s.id, name: s.name, joined: s.members.includes(user.id) }));
	return { servers };
});
fastify.post("/api/chat/servers", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const name = String((req.body || {}).name || "").trim().slice(0, 48);
	if (name.length < 2) return reply.code(400).send({ error: "Name the server." });
	const server = {
		id: crypto.randomBytes(8).toString("hex"), name, owner: user.id, members: [user.id],
		channels: [{ id: "general", name: "general", type: "text" }, { id: "voice", name: "Voice", type: "voice" }],
	};
	db.servers.unshift(server);
	chatWrite(db);
	return { server: { id: server.id, name: server.name } };
});
fastify.post("/api/chat/servers/:id/join", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const server = db.servers.find((s) => s.id === req.params.id);
	if (!server) return reply.code(404).send({ error: "Server not found." });
	if (!server.members.includes(user.id)) server.members.push(user.id);
	chatWrite(db);
	return { ok: true };
});
fastify.post("/api/chat/servers/:id/leave", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const server = db.servers.find((s) => s.id === req.params.id);
	if (!server || !server.members.includes(user.id)) return reply.code(404).send({ error: "Server not found." });
	server.members = server.members.filter((id) => id !== user.id);
	db.voice = db.voice.filter((v) => !(v.server === server.id && v.user === user.id));
	if (!server.members.length) db.servers = db.servers.filter((s) => s.id !== server.id);
	else if (server.owner === user.id) server.owner = server.members[0];
	chatWrite(db);
	return { ok: true };
});
fastify.post("/api/chat/servers/:id/channels", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const server = db.servers.find((s) => s.id === req.params.id);
	if (!server || !server.members.includes(user.id)) return reply.code(404).send({ error: "Server not found." });
	const name = String((req.body || {}).name || "").trim().replace(/^#/, "").slice(0, 32);
	const type = (req.body || {}).type === "voice" ? "voice" : "text";
	if (name.length < 1) return reply.code(400).send({ error: "Name the channel." });
	const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || crypto.randomBytes(3).toString("hex");
	if (server.channels.some((c) => c.id === id)) return reply.code(400).send({ error: "That channel already exists." });
	server.channels.push({ id, name, type });
	chatWrite(db);
	return { channel: { id, name, type } };
});
fastify.post("/api/chat/servers/:id/notify", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const server = db.servers.find((s) => s.id === req.params.id);
	if (!server || !server.members.includes(user.id)) return reply.code(404).send({ error: "Server not found." });
	const prev = user.mutes[server.id] || { mute: false, mentionsOnly: false };
	const b = req.body || {};
	user.mutes[server.id] = { mute: typeof b.mute === "boolean" ? b.mute : !!prev.mute, mentionsOnly: typeof b.mentionsOnly === "boolean" ? b.mentionsOnly : !!prev.mentionsOnly };
	chatWrite(db);
	return { ok: true };
});
fastify.post("/api/chat/servers/:id/voice", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const server = db.servers.find((s) => s.id === req.params.id);
	if (!server || !server.members.includes(user.id)) return reply.code(404).send({ error: "Server not found." });
	const action = String((req.body || {}).action || "");
	db.voice = db.voice.filter((v) => v.user !== user.id);
	if (action === "join") {
		const channel = String((req.body || {}).channel || "");
		const row = server.channels.find((c) => c.id === channel && c.type === "voice");
		if (!row) return reply.code(404).send({ error: "Voice channel not found." });
		db.voice.push({ server: server.id, channel, user: user.id, username: user.displayName || user.username, at: Date.now() });
	}
	chatWrite(db);
	return { ok: true };
});
fastify.get("/api/chat/servers/:id/messages", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const server = db.servers.find((s) => s.id === req.params.id);
	if (!server || !server.members.includes(user.id)) return reply.code(404).send({ error: "Server not found." });
	const channel = String(req.query.channel || "general");
	const messages = decorateMessages(db, db.messages.filter((m) => m.server === server.id && m.channel === channel).slice(-200));
	return { messages };
});
fastify.post("/api/chat/servers/:id/messages", async (req, reply) => {
	const db = ensureChat(chatRead());
	const user = chatUser(req, db);
	if (!user) return reply.code(401).send({ error: "Log in." });
	const server = db.servers.find((s) => s.id === req.params.id);
	if (!server || !server.members.includes(user.id)) return reply.code(404).send({ error: "Server not found." });
	const text = String((req.body || {}).text || "").trim().slice(0, 2000);
	if (!text) return reply.code(400).send({ error: "Empty message." });
	const channel = String((req.body || {}).channel || "general").slice(0, 32) || "general";
	const ch = server.channels.find((c) => c.id === channel);
	if (!ch || ch.type !== "text") return reply.code(400).send({ error: "That is not a text channel." });
	const message = { id: crypto.randomBytes(6).toString("hex"), server: server.id, channel, user: user.id, username: user.username, text, time: new Date().toISOString() };
	db.messages.push(message);
	db.messages = db.messages.slice(-4000);
	chatWrite(db);
	return { message };
});

fastify.get("/api/yt-list", async (req, reply) => {
	const key = process.env.YT_KEY || "AIzaSyCcwFsoTOMku6Lh1lsCB1sUJCngP0sYcY4";
	const q = String((req.query && req.query.q) || "").trim().slice(0, 180);
	const base = "https://www.googleapis.com/youtube/v3/";
	const url = q
		? base + "search?part=snippet&type=video&maxResults=20&safeSearch=moderate&q=" + encodeURIComponent(q) + "&key=" + key
		: base + "videos?part=snippet,statistics&chart=mostPopular&regionCode=MX&maxResults=24&key=" + key;
	try {
		const r = await fetch(url, { headers: { accept: "application/json" } });
		const j = await r.json();
		reply.header("cache-control", "no-store");
		if (j.error) return reply.code(502).send({ error: (j.error && j.error.message) || "YouTube" });
		return j;
	} catch (err) {
		return reply.code(502).send({ error: "YouTube no respondió." });
	}
});

fastify.get("/api/yt-play", async (req, reply) => {
	const id = String(req.query.id || "").replace(/[^a-zA-Z0-9_-]/g, "");
	if (!id || id.length > 16) return reply.code(400).send({ error: "missing id" });
	const hosts = [
		"https://api.piped.private.coffee/streams/",
		"https://pipedapi.kavin.rocks/streams/",
		"https://invidious.f5.si/api/v1/videos/",
	];
	const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
	const candidates = [];
	for (const host of hosts) {
		try {
			const r = await fetch(host + id, { headers: { "user-agent": UA, accept: "application/json" } });
			if (!r.ok) continue;
			const j = await r.json();
			const list = [].concat(j.formatStreams || [], j.videoStreams || []);
			for (const s of list) {
				if (!s || !s.url || s.videoOnly) continue;
				const mime = String(s.mimeType || s.mime || s.type || s.container || "");
				if (/mpegurl|m3u8/i.test(mime)) continue;
				if (!/mp4/i.test(mime)) continue;
				let hostName = "";
				try { hostName = new URL(s.url).hostname; } catch { continue; }
				if (!mediaHostOk(hostName, "yt")) continue;
				const goog = /googlevideo\.com$/i.test(hostName) || hostName.endsWith(".googlevideo.com");
				candidates.push({ url: s.url, title: j.title || "", score: (goog ? 50 : 0) + (/720/.test(String(s.quality || s.qualityLabel || "")) ? 20 : 0) + (/360|480/.test(String(s.quality || s.qualityLabel || "")) ? 12 : 0) });
			}
		} catch {}
	}
	candidates.sort((a, b) => b.score - a.score);
	const pick = candidates[0];
	if (pick) {
		reply.header("cache-control", "no-store");
		return { url: "/api/yt-file?u=" + encodeURIComponent(pick.url), title: pick.title || "" };
	}
	return reply.code(502).send({ error: "no stream" });
});

function mediaHostOk(host, kind) {
	host = String(host || "").toLowerCase();
	if (kind === "yt") {
		return host === "googlevideo.com" || host.endsWith(".googlevideo.com")
			|| host === "proxy.piped.private.coffee" || host === "api.piped.private.coffee" || host.endsWith(".piped.private.coffee")
			|| host === "odycdn.com" || host.endsWith(".odycdn.com");
	}
	return /(^|\.)tiktokcdn(-[a-z0-9]+)?\.com$/.test(host) || host.endsWith(".muscdn.com") || host.endsWith(".tiktokv.com");
}
async function proxyMedia(req, reply, kind, referer) {
	let current = "";
	try { current = new URL(String(req.query.u || "")).toString(); } catch { return reply.code(400).send("bad url"); }
	const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
	let r = null;
	for (let i = 0; i < 3; i++) {
		let u;
		try { u = new URL(current); } catch { return reply.code(400).send("bad url"); }
		if (u.protocol !== "https:" || !mediaHostOk(u.hostname, kind)) return reply.code(400).send("blocked");
		const headers = { "user-agent": UA, referer, accept: "*/*" };
		if (req.headers.range) headers.range = String(req.headers.range).slice(0, 80);
		r = await fetch(current, { headers, redirect: "manual" });
		if (r.status >= 300 && r.status < 400) {
			const loc = r.headers.get("location");
			if (!loc) break;
			current = new URL(loc, current).toString();
			continue;
		}
		break;
	}
	if (!r || !r.body) return reply.code(502).send("no video");
	reply.code(r.status === 206 ? 206 : (r.ok ? 200 : r.status));
	const ct = r.headers.get("content-type");
	if (ct) reply.header("content-type", ct.split(";")[0]);
	const cr = r.headers.get("content-range");
	if (cr) reply.header("content-range", cr);
	const cl = r.headers.get("content-length");
	if (cl) reply.header("content-length", cl);
	reply.header("accept-ranges", "bytes");
	reply.header("cache-control", "no-store");
	return reply.send(Readable.fromWeb(r.body));
}
fastify.get("/api/yt-file", async (req, reply) => proxyMedia(req, reply, "yt", "https://www.youtube.com/"));
fastify.get("/api/tt-file", async (req, reply) => proxyMedia(req, reply, "tt", "https://www.tiktok.com/"));
fastify.get("/api/tt-feed", async (req, reply) => {
	const cursor = String(req.query.cursor || "0").replace(/[^0-9]/g, "").slice(0, 8) || "0";
	const r = await fetch("https://www.tikwm.com/api/feed/list?region=US&count=8&cursor=" + cursor, {
		headers: { "user-agent": "Mozilla/5.0", accept: "application/json" },
	});
	const j = await r.json();
	const items = [];
	for (const it of (Array.isArray(j.data) ? j.data : [])) {
		if (!it || it.is_ad || typeof it.play !== "string" || !it.play.startsWith("https://")) continue;
		let host = "";
		try { host = new URL(it.play).hostname; } catch { continue; }
		if (!mediaHostOk(host, "tt")) continue;
		const author = it.author && (it.author.unique_id || it.author.nickname) || "";
		items.push({
			id: String(it.video_id || ""),
			title: String(it.title || "").slice(0, 180),
			author: String(author).slice(0, 80),
			play: "/api/tt-file?u=" + encodeURIComponent(it.play),
		});
	}
	reply.header("cache-control", "no-store");
	return { items, cursor: String(Number(cursor) + (Array.isArray(j.data) ? j.data.length : 0)) };
});

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
	reply.header("Cross-Origin-Resource-Policy", "same-origin");
	reply.header("Cache-Control", "public, max-age=600");
	return reply.send(data);
});

fastify.setNotFoundHandler((_req, reply) => {
	try {
		if (fs.existsSync(path.join(publicPath, "404.html")))
			return reply.code(404).type("text/html").sendFile("404.html");
	} catch {}
	return reply.code(404).send("Not found");
});

let port = parseInt(process.env.APP_PORT || process.env.SERVER_PORT || process.env.PORT || "", 10);
if (Number.isNaN(port) || port <= 0) port = 8080;
console.log("Drift port", { APP_PORT: process.env.APP_PORT || "", SERVER_PORT: process.env.SERVER_PORT || "", PORT: process.env.PORT || "", using: port });
try {
	await fastify.listen({ port, host: "0.0.0.0" });
	console.log("Drift listening", port);
} catch (err) {
	console.error("Drift failed to listen", err && err.stack ? err.stack : err);
	process.exit(1);
}
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
