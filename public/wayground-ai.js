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
  var DRIFT_MODEL = 'or-gemini';

  var GM_BOOT =
    "window.GM_getValue=function(k,d){try{var v=localStorage.getItem('GM_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}};" +
    "window.GM_setValue=function(k,v){try{localStorage.setItem('GM_'+k,JSON.stringify(v))}catch(e){}};" +
    "window.GM_deleteValue=function(k){try{localStorage.removeItem('GM_'+k)}catch(e){}};" +
    "window.GM_listValues=function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('GM_')===0)o.push(k.slice(3))}return o};" +
    "window.GM_addStyle=function(css){var s=document.createElement('style');s.textContent=css;(document.head||document.documentElement).appendChild(s);return s};" +
    'window.unsafeWindow=window;';

  var GM_AI =
    '(function(){var DRIFT_AI=' +
    JSON.stringify(DRIFT_AI) +
    ';var DRIFT_MODEL=' +
    JSON.stringify(DRIFT_MODEL) +
    ";var SYS='You are an expert quiz assistant with vision and careful reasoning. Reply ONLY JSON {\\\"answers\\\":{\\\"QUESTION_ID\\\":\\\"optionId|text|[ids]\\\"}}.';" +
    'window.GM_xmlhttpRequest=function(opts){var url=String(opts.url||\'\');' +
    'var isAI=/generativelanguage\\.googleapis\\.com|api\\.openai\\.com|openrouter\\.ai|api\\.xkiro\\.com/i.test(url);' +
    "if(!isAI){fetch(opts.url,{method:opts.method||'GET',headers:opts.headers||{},body:opts.data,credentials:'include'})" +
    '.then(function(r){return r.text().then(function(t){opts.onload&&opts.onload({status:r.status,responseText:t,response:t})})})' +
    '.catch(function(e){opts.onerror&&opts.onerror(e)});return;}' +
    "var userText='';try{var body=typeof opts.data==='string'?JSON.parse(opts.data):opts.data;" +
    "if(body){if(body.contents&&body.contents[0]&&body.contents[0].parts)userText=body.contents[0].parts.map(function(p){return p.text||''}).join('\\n');" +
    "else if(body.messages)userText=body.messages.filter(function(m){return m.role==='user'}).map(function(m){return typeof m.content==='string'?m.content:JSON.stringify(m.content)}).join('\\n');" +
    'else userText=JSON.stringify(body)}}catch(e){userText=String(opts.data||\'\')}' +
    "fetch(DRIFT_AI,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:DRIFT_MODEL,messages:[{role:'user',content:userText}],system:SYS})})" +
    ".then(function(r){return r.json().then(function(j){var text=((j.content||[]).map(function(x){return x.text||''}).join('')||j.text||'');" +
    "if(!text&&j.choices&&j.choices[0]&&j.choices[0].message)text=j.choices[0].message.content||'';" +
    'opts.onload&&opts.onload({status:200,responseText:text,response:text})})})' +
    '.catch(function(e){opts.onerror&&opts.onerror(e)})}})();';

  function stripUserscript(src) {
    return String(src || '').replace(/^[\s\S]*?==\/UserScript==\s*/, '');
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
      try {
        var badge = doc.createElement('div');
        badge.textContent = 'Drift Mod · Worker AI';
        badge.style.cssText =
          'position:fixed;top:12px;right:12px;z-index:2147483646;background:#111827;color:#fff;padding:8px 12px;border-radius:10px;font:12px system-ui;box-shadow:0 8px 24px rgba(0,0,0,.35)';
        (doc.body || doc.documentElement).appendChild(badge);
      } catch (e) {}
      doc.documentElement.setAttribute('data-wg-inj', '1');
      if (statusEl) statusEl.textContent = 'Mod menu injected · answers via Drift worker';
      return true;
    } catch (e) {
      if (statusEl) statusEl.textContent = 'Inject later: ' + (e.message || e);
      return false;
    }
  }

  window.waygroundApp = async function waygroundApp(root) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0">' +
      '<div style="padding:8px 10px;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between">' +
      '<span style="font-weight:600">Wayground</span>' +
      '<span style="display:flex;gap:6px;align-items:center">' +
      '<button type="button" id="wg-inj" style="padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:var(--omni);color:inherit;cursor:pointer">Re-inject mod</button>' +
      '</span></div>' +
      '<div id="wg-status" style="padding:6px 10px;font-size:12px;background:rgba(255,255,255,.04);border-bottom:1px solid var(--line)">Loading Wayground + mod menu…</div>' +
      '<div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
    var box = root.querySelector('.sjt');
    var st = root.querySelector('#wg-status');
    var frameObj = null;
    var cheatSrc = null;

    async function ensureCheat() {
      if (cheatSrc) return cheatSrc;
      st.textContent = 'Downloading Wayground cheat…';
      cheatSrc = await loadCheat();
      return cheatSrc;
    }

    function tryInject() {
      if (!frameObj || !frameObj.frame) return;
      try {
        var w = frameObj.frame.contentWindow;
        var d = frameObj.frame.contentDocument || (w && w.document);
        if (d) injectInto(d, cheatSrc, st);
      } catch (e) {
        st.textContent = 'Page loaded · use Re-inject when ready: ' + (e.message || e);
      }
    }

    async function go() {
      try {
        await ensureCheat();
        st.textContent = 'Opening wayground.com…';
        if (typeof window.openProxied === 'function') {
          frameObj = await window.openProxied('https://wayground.com', box);
        } else if (typeof window.proxySite === 'function') {
          window.proxySite(box, 'https://wayground.com', 'Wayground');
        } else {
          box.innerHTML =
            '<iframe src="https://wayground.com" style="width:100%;height:100%;border:0"></iframe>';
        }
        if (frameObj && frameObj.frame) {
          frameObj.frame.addEventListener('load', function () {
            setTimeout(tryInject, 800);
            setTimeout(tryInject, 2500);
            setTimeout(tryInject, 5000);
          });
        }
        setTimeout(tryInject, 2000);
      } catch (e) {
        st.textContent = String(e.message || e);
      }
    }

    root.querySelector('#wg-inj').onclick = function () {
      ensureCheat()
        .then(function () {
          tryInject();
        })
        .catch(function (e) {
          st.textContent = String(e.message || e);
        });
    };

    go();
  };

  function wire() {
    try {
      if (window.XAPPS) {
        window.XAPPS.wayground = { n: 'Wayground', f: window.waygroundApp };
      }
    } catch (e) {}
  }
  wire();
  setTimeout(wire, 500);
  setTimeout(wire, 1500);
  console.log('[Drift] wayground-ai loaded');
})();
