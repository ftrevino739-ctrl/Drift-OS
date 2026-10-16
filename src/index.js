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

const TEMP_PASS_HASH = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";

// Injected after main scripts — wires every app that already exists in the HTML
const APPS_PATCH = String.raw`
<script>
(function(){
  function ico(bg, letter, color){
    color = color || '#fff';
    return '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="'+bg+'"/><text x="24" y="31" text-anchor="middle" font-size="18" font-weight="700" fill="'+color+'" font-family="system-ui,sans-serif">'+letter+'</text></svg>';
  }
  var EXTRA = {
    yt: IC.yt || ico('#ff0033','YT'),
    youtube: IC.yt || ico('#ff0033','YT'),
    camera: ico('#111','Cam'),
    music: ico('#1db954','♪'),
    movies: ico('#e50914','N'),
    vscode: ico('#007acc','VS'),
    chat: ico('#5865f2','C'),
    noah: ico('#5865f2','N'),
    games: ico('#f59e0b','G'),
    gimkit: ico('#00c2a8','Gk'),
    discord: ico('#5865f2','D'),
    gmail: ico('#ea4335','M'),
    instagram: ico('#e1306c','IG'),
    tiktok: ico('#010101','TT'),
    classroom: ico('#0f9d58','Cl'),
    canva: ico('#00c4cc','Ca'),
    roblox: ico('#e2231a','R'),
    proxy: ico('#6366f1','Pr')
  };
  Object.keys(EXTRA).forEach(function(k){ if(!IC[k]) IC[k]=EXTRA[k]; });

  var NAMES = {
    calc:'Calculator', browser:'Browser', ai:'AI', yt:'YouTube', youtube:'YouTube',
    camera:'Camera', music:'Music', movies:'Movies', vscode:'VS Code',
    chat:'Chat', noah:'Chat', games:'Games', gimkit:'Gimkit',
    discord:'Discord', gmail:'Gmail', instagram:'Instagram', tiktok:'TikTok',
    classroom:'Classroom', canva:'Canva', roblox:'Roblox', proxy:'Proxy Browser'
  };

  var MENU = [
    ['calc','Calculator'],['browser','Browser'],['ai','AI'],['yt','YouTube'],
    ['camera','Camera'],['music','Music'],['movies','Movies'],['vscode','VS Code'],
    ['chat','Chat'],['games','Games'],['gimkit','Gimkit'],['discord','Discord'],
    ['gmail','Gmail'],['instagram','Instagram'],['tiktok','TikTok'],
    ['classroom','Classroom'],['canva','Canva'],['roblox','Roblox']
  ];

  function launch(app, root){
    var map = {
      calc: typeof calc==='function'?calc:null,
      browser: typeof browser==='function'?browser:null,
      ai: typeof ai==='function'?ai:null,
      yt: typeof youtube==='function'?youtube:null,
      youtube: typeof youtube==='function'?youtube:null,
      camera: typeof camera==='function'?camera:null,
      music: typeof music==='function'?music:null,
      movies: typeof movies==='function'?movies:null,
      vscode: typeof vscode==='function'?vscode:null,
      chat: typeof noahChat==='function'?noahChat:null,
      noah: typeof noahChat==='function'?noahChat:null,
      games: typeof gamesHub==='function'?gamesHub:null,
      gimkit: typeof gimkitApp==='function'?gimkitApp:null,
      discord: typeof discordApp==='function'?discordApp:null,
      gmail: typeof gmailApp==='function'?gmailApp:null,
      instagram: typeof igApp==='function'?igApp:null,
      tiktok: typeof ttApp==='function'?ttApp:null,
      classroom: function(r){
        if(typeof proxySite==='function') return proxySite(r,'https://classroom.google.com','Classroom');
        if(typeof sjBrowser==='function') return sjBrowser(r,'https://classroom.google.com');
        r.innerHTML='<div class="ym" style="padding:20px">Open <a href="https://classroom.google.com" target="_blank">Classroom</a></div>';
      },
      canva: function(r){
        if(typeof proxySite==='function') return proxySite(r,'https://www.canva.com','Canva');
        if(typeof sjBrowser==='function') return sjBrowser(r,'https://www.canva.com');
        r.innerHTML='<div class="ym" style="padding:20px">Open <a href="https://www.canva.com" target="_blank">Canva</a></div>';
      },
      roblox: function(r){
        if(typeof proxySite==='function') return proxySite(r,'https://www.roblox.com','Roblox');
        if(typeof sjBrowser==='function') return sjBrowser(r,'https://www.roblox.com');
        r.innerHTML='<div class="ym" style="padding:20px">Open <a href="https://www.roblox.com" target="_blank">Roblox</a></div>';
      },
      proxy: typeof sjBrowser==='function'?function(r){sjBrowser(r,'https://example.com')}:null
    };
    var fn = map[app];
    if(fn) try{ fn(root); }catch(e){ root.innerHTML='<div style="padding:16px;color:#f66">App error: '+(e&&e.message||e)+'</div>'; console.error(e); }
    else root.innerHTML='<div style="padding:16px">App "'+app+'" is not available in this build.</div>';
  }

  window.openApp = function(app){
    app = (app==='youtube') ? 'yt' : app;
    var id='w'+(++n), w=document.createElement('div');
    w.className='win'; w.id=id;
    var W=Math.min(innerWidth-20, app==='calc'?340:920);
    var H=Math.min(innerHeight-90, app==='calc'?640:600);
    w.style.cssText='width:'+W+'px;height:'+H+'px;left:'+Math.max(10,(innerWidth-W)/2+n*14-30)+'px;top:'+(40+n*14)+'px;z-index:'+(++z);
    var label = NAMES[app]||app;
    var icon = IC[app]||IC.browser||'';
    var name='<span class="mi">'+icon+'</span> '+label;
    w.innerHTML='<div class="title"><b style="display:flex;align-items:center;gap:8px">'+name+'</b><button class="wb" data-a="min" aria-label="Minimize">–</button><button class="wb" data-a="max" aria-label="Maximize">▢</button><button class="wb x" data-a="x" aria-label="Close">✕</button></div><div class="body"></div>';
    desk.appendChild(w);
    var tb=document.createElement('button'); tb.className='tb'; tb.innerHTML=name; tbs.appendChild(tb);
    wins[id]={w:w,tb:tb};
    if(typeof small==='function' && small()) w.classList.add('max');
    tb.onclick=function(){
      if(w.classList.contains('min')){ w.classList.remove('min'); focus(id); }
      else if(w.style.zIndex==z){ w.classList.add('min'); tb.classList.remove('on'); }
      else focus(id);
    };
    w.addEventListener('pointerdown', function(){ focus(id); });
    w.querySelector('.title').addEventListener('click', function(e){
      var a=e.target.dataset.a; if(!a) return;
      if(a==='x'){ w.remove(); tb.remove(); delete wins[id]; }
      if(a==='min'){ w.classList.add('min'); tb.classList.remove('on'); }
      if(a==='max') w.classList.toggle('max');
    });
    if(typeof drag==='function') drag(w);
    launch(app, w.querySelector('.body'));
    focus(id);
  };

  function rebuildMenu(){
    var box=document.getElementById('apps');
    if(!box) return;
    box.innerHTML='';
    MENU.forEach(function(pair){
      var id=pair[0], title=pair[1];
      var b=document.createElement('button');
      b.setAttribute('data-app', id);
      b.innerHTML='<span class="mi">'+(IC[id]||'')+'</span>'+title;
      box.appendChild(b);
    });
  }

  function rebuildDesk(){
    var icons=document.querySelector('.icons') || document.getElementById('icons');
    if(!icons) return;
    var deskApps=[['browser','Browser'],['ai','AI'],['yt','YouTube'],['gimkit','Gimkit'],['gmail','Gmail'],['movies','Movies'],['chat','Chat'],['games','Games']];
    icons.innerHTML='';
    deskApps.forEach(function(pair){
      var b=document.createElement('button');
      b.className='ico';
      b.setAttribute('data-app', pair[0]);
      b.innerHTML='<i class="mi">'+(IC[pair[0]]||'')+'</i>'+pair[1];
      icons.appendChild(b);
    });
  }

  function bootApps(){
    rebuildMenu();
    rebuildDesk();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bootApps);
  else bootApps();
  // Also after unlock when gate hides
  setTimeout(bootApps, 500);
  setTimeout(bootApps, 1500);
})();
</script>
`;

function loadAndPatchIndex() {
	let file = null;
	try {
		if (fs.existsSync(rootIndexPath) && fs.statSync(rootIndexPath).size > 50000) file = rootIndexPath;
		else if (fs.existsSync(pubIndexPath) && fs.statSync(pubIndexPath).size > 50000) file = pubIndexPath;
	} catch {}
	if (!file) return null;
	let html = fs.readFileSync(file, "utf8");

	html = html.split("overflow:hidden;display:flex;flex-direction:column}").join(
		"overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;display:block}"
	);
	html = html.split("margin:auto;padding:28px 22px 40px;text-align:center}").join(
		"margin:0 auto;padding:28px 22px 100px;text-align:center}"
	);

	html = html.replace(/passwordHash\s*:\s*['"][a-fA-F0-9]{64}['"]/g, "passwordHash:'" + TEMP_PASS_HASH + "'");

	html = html.replace(
		/<div class="gate-access">\s*<label for="gate-code">Access code<\/label>[\s\S]*?<div class="gate-foot">ORBIT LAB[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
		""
	);

	html = html.replace(
		/try\{const ph=localStorage\.getItem\('drift:ph'\);if\(ph&&ph\.length===64\)A\.passwordHash=ph\}catch\(e\)\{\}/g,
		"try{localStorage.removeItem('drift:ph')}catch(e){} if(window.DRIFT_ACCESS){window.DRIFT_ACCESS.passwordHash='" +
			TEMP_PASS_HASH +
			"';}"
	);

	const boot =
		"<script>(function(){" +
		"try{localStorage.removeItem('drift:ph')}catch(e){}" +
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

	// Full apps menu patch at end of body (after app functions exist)
	if (html.includes("</body>")) html = html.replace("</body>", APPS_PATCH + "</body>");
	else html += APPS_PATCH;

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
				} else socket.end();
			});
	},
});

const sendIndex = async (_req, reply) => {
	const html = loadAndPatchIndex();
	if (!html) return reply.code(500).type("text/plain").send("Missing full index.html at repo root.");
	return reply.type("text/html; charset=utf-8").send(html);
};

fastify.get("/", sendIndex);
fastify.get("/index.html", sendIndex);
fastify.get("/health", async () => {
	const html = loadAndPatchIndex();
	return {
		ok: true,
		rootIndexBytes: fs.existsSync(rootIndexPath) ? fs.statSync(rootIndexPath).size : 0,
		servedBytes: html ? html.length : 0,
		passwordIs1: !!(html && html.includes(TEMP_PASS_HASH)),
		fullApps: !!(html && html.includes("gimkit") && html.includes("rebuildMenu")),
		hwid: "1",
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

try {
	await fastify.listen({ port, host: "0.0.0.0" });
	console.log("Listening", port, "| password 1 | full apps menu");
} catch (err) {
	console.error("Failed to start:", err);
	process.exit(1);
}

function shutdown() {
	fastify.close().then(() => process.exit(0)).catch(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
