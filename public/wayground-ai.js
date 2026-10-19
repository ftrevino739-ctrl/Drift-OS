/* Wayground: inject cheat with Drift worker AI (vision+reasoning), visible status */
(function () {
  'use strict';
  var CHEAT = 'https://raw.githubusercontent.com/ByOscarPINE/Wayground-Quizizz-Cheat/main/wayground.user.js';
  var DRIFT_AI = (function () {
    try {
      if (typeof EP === 'function') return EP().replace(/\/$/, '') + '/ai';
    } catch (e) {}
    try {
      var s = localStorage.getItem('wos:ddg');
      if (s) return JSON.parse(s).replace(/\/$/, '') + '/ai';
    } catch (e) {}
    return 'https://holy-firefly-982c.fert0480.workers.dev/ai';
  })();
  var DRIFT_MODEL = 'google/gemini-3.8-flash'; // Drift 2.1

  var GM_BOOT =
    "window.GM_getValue=function(k,d){try{var v=localStorage.getItem('GM_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}};" +
    "window.GM_setValue=function(k,v){try{localStorage.setItem('GM_'+k,JSON.stringify(v))}catch(e){}};" +
    "window.GM_deleteValue=function(k){try{localStorage.removeItem('GM_'+k)}catch(e){}};" +
    "window.GM_listValues=function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('GM_')===0)o.push(k.slice(3))}return o};" +
    "window.GM_addStyle=function(css){var s=document.createElement('style');s.textContent=css;(document.head||document.documentElement).appendChild(s);return s};" +
    'window.unsafeWindow=window;' +
    'window.driftPaintAnswer=function(v){var s=String(v==null?"":v);function esc(x){return String(x).replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">");}function inline(x){var h=esc(x);h=h.replace(/`([^`]+)`/g,"<code>$1</code>");h=h.replace(/\\*\\*([\\s\\S]+?)\\*\\*/g,"<strong>$1</strong>");h=h.replace(/(^|[\\s(])\\*([^*\\n]+)\\*/g,"$1<em>$2</em>");return h;}var html="";var re=/```(\\w*)\\n?([\\s\\S]*?)```/g,last=0,m;function blocks(chunk){var lines=String(chunk||"").split("\\n"),i=0,buf=[];function flush(){if(!buf.length)return;var j=buf.join("\\n").trim();buf=[];if(!j)return;if(/^(\\*{3,}|-{3,})$/.test(j)){html+="<hr>";return;}html+="<div style=\\"white-space:pre-wrap;margin:0 0 8px\\">"+inline(j)+"</div>";}while(i<lines.length){if(/^\\s*\\|/.test(lines[i])&&i+1<lines.length&&/[-:]/.test(lines[i+1])){flush();var rows=[];while(i<lines.length&&/^\\s*\\|/.test(lines[i])){if(!/^\\s*\\|?\\s*[-:| ]+\\|\\s*$/.test(lines[i]))rows.push(lines[i].split("|").slice(1,-1));i++;}if(rows.length){html+="<table style=\\"border-collapse:collapse;width:100%\\">";rows.forEach(function(r,ri){html+="<tr>";r.forEach(function(c){html+="<"+(ri?"td":"th")+" style=\\"border:1px solid #444;padding:4px 6px\\">"+inline(c.trim())+"</"+(ri?"td":"th")+">";});html+="</tr>";});html+="</table>";}continue;}if(/^#{1,3}\\s+/.test(lines[i])){flush();html+="<div style=\\"font-weight:700\\">"+inline(lines[i].replace(/^#+\\s+/,""))+"</div>";i++;continue;}buf.push(lines[i]);i++;}flush();}while((m=re.exec(s))){blocks(s.slice(last,m.index));last=m.index+m[0].length;html+="<div style=\\"font-size:11px;opacity:.7\\">"+(m[1]||"code")+"</div><pre style=\\"white-space:pre-wrap;background:#111;padding:8px;border-radius:8px\\">"+esc(m[2])+"</pre>";}blocks(s.slice(last));return "<div>Possible answer</div>"+html;};';

  var GM_AI =
    '(function(){var DRIFT_AI=' +
    JSON.stringify(DRIFT_AI) +
    ';var DRIFT_MODEL=' +
    JSON.stringify(DRIFT_MODEL) +
    ";var SYS='You are Drift Intelligence. Reply with raw JSON only. No markdown, no asterisks, no code fences. Shape: {\\\"answers\\\":{\\\"QUESTION_ID\\\":\\\"option id or plain text\\\"}}.';" +
    'window.GM_xmlhttpRequest=function(opts){var url=String(opts.url||\'\');' +
    'var isAI=/generativelanguage\\.googleapis\\.com|api\\.openai\\.com|openrouter\\.ai|api\\.xkiro\\.com/i.test(url);' +
    "if(!isAI){fetch(opts.url,{method:opts.method||'GET',headers:opts.headers||{},body:opts.data,credentials:'include'})" +
    '.then(function(r){return r.text().then(function(t){opts.onload&&opts.onload({status:r.status,responseText:t,response:t})})})' +
    '.catch(function(e){opts.onerror&&opts.onerror(e)});return;}' +
    "var userText='';try{var body=typeof opts.data==='string'?JSON.parse(opts.data):opts.data;" +
    "if(body){var sys='';if(body.systemInstruction&&body.systemInstruction.parts)sys=body.systemInstruction.parts.map(function(p){return p.text||''}).join('\\n');if(body.contents&&body.contents[0]&&body.contents[0].parts)userText=body.contents[0].parts.map(function(p){return p.text||(p.inline_data?'[image]':'')}).join('\\n');if(sys)userText=sys+'\\n'+userText;" +
    "else if(body.messages)userText=body.messages.filter(function(m){return m.role==='user'}).map(function(m){return typeof m.content==='string'?m.content:JSON.stringify(m.content)}).join('\\n');" +
    'else userText=JSON.stringify(body)}}catch(e){userText=String(opts.data||\'\')}' +
    "fetch(DRIFT_AI,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:DRIFT_MODEL,messages:[{role:'user',content:userText}],system:SYS})})" +
    ".then(function(r){return r.json().then(function(j){var text=((j.content||[]).map(function(x){return x.text||''}).join('')||j.text||'');" +
    "if(!text&&j.choices&&j.choices[0]&&j.choices[0].message)text=j.choices[0].message.content||'';" +
    "text=(function(t){t=String(t||'').trim();var f=t.match(/```(?:json)?\\s*([\\s\\S]*?)```/i);if(f)t=f[1].trim();t=t.replace(/^\\*\\*([\\s\\S]*)\\*\\*$/,'$1').trim();function walk(v){if(typeof v==='string')return v.replace(/\\*\\*([\\s\\S]*?)\\*\\*/g,'$1').replace(/(^|\\s)\\*([^*\\n]+)\\*(?=\\s|$)/g,'$1$2').replace(/`([^`]+)`/g,'$1').trim();if(Array.isArray(v))return v.map(walk);if(v&&typeof v==='object'){var o={};for(var k in v)o[k]=walk(v[k]);return o;}return v;}try{var o=walk(JSON.parse(t));return JSON.stringify(o);}catch(e){var plain=t.replace(/```[\\w]*\\n?/g,'').replace(/```/g,'').replace(/\\*\\*([\\s\\S]*?)\\*\\*/g,'$1');try{var box=document.getElementById('drift-md')||document.createElement('div');box.id='drift-md';box.style.cssText='position:fixed;right:12px;bottom:12px;z-index:2147483646;max-width:min(440px,92vw);max-height:50vh;overflow:auto;background:#111;color:#fff;padding:12px;border-radius:12px;font:13px/1.45 system-ui';box.innerHTML=window.driftPaintAnswer?window.driftPaintAnswer(t):plain;document.body.appendChild(box);}catch(err){}return JSON.stringify({answers:{}});}})(text);" +
    "var wrapped=JSON.stringify({candidates:[{content:{parts:[{text:text}]}}]});" +
    'opts.onload&&opts.onload({status:200,responseText:wrapped,response:wrapped})})})' +
    '.catch(function(e){opts.onerror&&opts.onerror(e)})}})();';

  function stripUserscript(src) {
    var s = String(src || '').replace(/^[\s\S]*?==\/UserScript==\s*/, '');
    s = s.replace('let OK = false;', 'let OK = true;');
    s = s.replace('let API_KEY = null;', 'let API_KEY = "drift-worker";');
    s = s.replace(/answerDiv\.textContent\s*=\s*`Possible answer: \$\{formattedAnswer\}`;/g,
      'answerDiv.innerHTML = (window.driftPaintAnswer ? window.driftPaintAnswer(formattedAnswer) : ("Possible answer: "+formattedAnswer));');
    return s;
  }

  async function loadCheat() {
    var r = await fetch('/api/raw?u=' + encodeURIComponent(CHEAT), { cache: 'no-store' });
    if (!r.ok) r = await fetch(CHEAT, { cache: 'no-store' });
    if (!r.ok) throw new Error('Cheat download failed (' + r.status + ')');
    return stripUserscript(await r.text());
  }

  function injectInto(doc, cheatSrc, statusEl) {
    if (!doc) return false;
    try {
      if (doc.documentElement.getAttribute('data-wg-inj') === '1') {
        if (statusEl) statusEl.textContent = 'Mod menu already injected';
        return true;
      }
      var s0 = doc.createElement('script');
      s0.textContent = GM_BOOT + GM_AI;
      (doc.head || doc.documentElement).appendChild(s0);
      var s1 = doc.createElement('script');
      s1.textContent = cheatSrc + '\n//# sourceURL=wayground-cheat.js';
      (doc.head || doc.documentElement).appendChild(s1);
      var hide = doc.createElement('script');
      hide.textContent = "(function(){function clip(root){if(!root||!root.querySelectorAll)return;var nodes=root.querySelectorAll('*');for(var i=0;i<nodes.length;i++){var sr=nodes[i].shadowRoot;if(!sr||sr.querySelector('#drift-wg-hide'))continue;if(!sr.querySelector('#toggle-ai-checkbox'))continue;var st=document.createElement('style');st.id='drift-wg-hide';st.textContent='#btn-apikey,#btn-apikeyconfig,#test-api-btn,#apikey-input,#api-provider,#apiProvider{display:none!important}.apikey_menu .settings-item:not(:has(#toggle-ai-checkbox)){display:none!important}';sr.appendChild(st);} }var n=0;var t=setInterval(function(){clip(document);if(++n>20)clearInterval(t);},500);})();";
      (doc.head || doc.documentElement).appendChild(hide);
      try {
        var badge = doc.createElement('div');
        badge.textContent = 'Drift Mod · Worker AI (vision)';
        badge.style.cssText =
          'position:fixed;top:12px;right:12px;z-index:2147483646;background:#111827;color:#fff;padding:8px 12px;border-radius:10px;font:12px system-ui;box-shadow:0 8px 24px rgba(0,0,0,.35)';
        (doc.body || doc.documentElement).appendChild(badge);
      } catch (e) {}
      doc.documentElement.setAttribute('data-wg-inj', '1');
      if (statusEl) statusEl.textContent = 'Mod menu injected · answers via Drift worker (vision)';
      return true;
    } catch (e) {
      if (statusEl) statusEl.textContent = 'Inject later: ' + (e.message || e);
      return false;
    }
  }

  window.waygroundApp = async function waygroundApp(root) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0;background:#11131a;color:#eee">' +
      '<div style="padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;flex-wrap:wrap;gap:8px;align-items:center">' +
      '<b>Wayground</b><span style="font-size:12px;opacity:.75">Drift Intelligence · no proxy</span>' +
      '<button type="button" data-inj style="margin-left:auto;padding:6px 12px;border-radius:8px;border:0;background:#7c5cff;color:#fff;cursor:pointer">Inject mod</button>' +
      '<button type="button" data-read style="padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.16);background:transparent;color:#fff;cursor:pointer">Read screen</button></div>' +
      '<div data-status style="padding:6px 10px;font-size:12px;opacity:.85">Opening Wayground inside the app…</div>' +
      '<div data-ans style="display:none;max-height:160px;overflow:auto;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.08)"></div>' +
      '<div style="flex:1;min-height:0;position:relative"><iframe data-frame referrerpolicy="no-referrer-when-downgrade" allow="fullscreen; clipboard-read; clipboard-write; camera; microphone" style="position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff"></iframe></div></div>';
    var st = root.querySelector('[data-status]');
    var ans = root.querySelector('[data-ans]');
    var frame = root.querySelector('[data-frame]');
    var cheatSrc = null;
    frame.src = 'https://wayground.com/';

    function showAnswer(text) {
      ans.style.display = 'block';
      if (typeof window.driftPaint === 'function') window.driftPaint(ans, text);
      else ans.textContent = text;
    }

    async function ensureCheat() {
      if (cheatSrc) return cheatSrc;
      st.textContent = 'Downloading mod menu…';
      cheatSrc = await loadCheat();
      return cheatSrc;
    }

    async function tryInject() {
      try {
        await ensureCheat();
        var doc = frame.contentDocument;
        if (doc && injectInto(doc, cheatSrc, st)) {
          st.textContent = 'Mod menu injected · Drift Intelligence';
          return;
        }
      } catch (e) {}
      st.textContent = 'Wayground is open in the app without the proxy. The browser blocked injecting into wayground.com. Read screen still uses Drift Intelligence.';
    }

    async function readScreen() {
      var stream;
      try { stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }); }
      catch (e) { st.textContent = 'Screen share was blocked. Allow it and press Read screen again.'; return; }
      var video = document.createElement('video');
      video.srcObject = stream; video.muted = true;
      try { await video.play(); } catch (e) {}
      await new Promise(function (res) { if (video.videoWidth) res(); else video.onloadeddata = res; setTimeout(res, 800); });
      var w = Math.min(1280, video.videoWidth || 1280);
      var h = Math.round(w * ((video.videoHeight || 720) / (video.videoWidth || 1280)));
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(video, 0, 0, w, h);
      stream.getTracks().forEach(function (t) { t.stop(); });
      var data = canvas.toDataURL('image/jpeg', 0.72).split(',')[1];
      st.textContent = 'Drift Intelligence is reading the screen…';
      try {
        var r = await fetch(DRIFT_AI, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: DRIFT_MODEL,
            max_tokens: 2048,
            messages: [{ role: 'user', content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: data } },
              { type: 'text', text: 'This is a screenshot of a quiz. If the answer is a list, use a markdown table. If it is code, use a fenced code block. Do not wrap the answer in asterisks. Then one short reason.' }
            ]}],
            system: 'You are Drift Intelligence. Render real markdown tables and fenced code. Never answer with only asterisks.'
          })
        });
        var j = await r.json();
        var text = ((j.content || []).map(function (x) { return x.text || ''; }).join('')) || (j.error && (j.error.message || j.error)) || 'No answer.';
        showAnswer(text);
        st.textContent = 'Answer from Drift Intelligence';
      } catch (e) {
        st.textContent = String(e.message || e);
      }
    }

    frame.addEventListener('load', function () { setTimeout(tryInject, 600); });
    root.querySelector('[data-inj]').onclick = function () { tryInject(); };
    root.querySelector('[data-read]').onclick = function () { readScreen(); };
    setTimeout(tryInject, 1800);
  };

  function wire() {
    try {
      if (window.XAPPS) window.XAPPS.wayground = { n: 'Wayground', f: window.waygroundApp };
    } catch (e) {}
  }
  wire();
  setTimeout(wire, 500);
  setTimeout(wire, 1500);
  console.log('[Drift] wayground-ai loaded');
})();
