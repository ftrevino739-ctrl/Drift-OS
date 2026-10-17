/* Wayground → Drift worker AI (or-gemini: fast + vision + reasoning prompt) */
(function () {
  'use strict';
  var CHEAT = 'https://raw.githubusercontent.com/ByOscarPINE/Wayground-Quizizz-Cheat/main/wayground.user.js';
  var GM = [
    "window.GM_getValue=function(k,d){try{var v=localStorage.getItem('GM_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}};",
    "window.GM_setValue=function(k,v){try{localStorage.setItem('GM_'+k,JSON.stringify(v))}catch(e){}};",
    "window.GM_deleteValue=function(k){try{localStorage.removeItem('GM_'+k)}catch(e){}};",
    "window.GM_addStyle=function(css){var s=document.createElement('style');s.textContent=css;(document.head||document.documentElement).appendChild(s);return s};",
    "window.unsafeWindow=window;",
    "(function(){var DRIFT_AI=(function(){try{var p=window.parent;if(p&&p.EP)return p.EP()+'/ai'}catch(e){}try{var s=localStorage.getItem('wos:ddg');if(s)return JSON.parse(s).replace(/\\/$/,'')+'/ai'}catch(e){}return 'https://holy-firefly-982c.fert0480.workers.dev/ai'})();var DRIFT_MODEL='or-gemini';var QUIZ_SYS='You are an expert quiz-solving assistant with vision and careful reasoning. You receive JSON questions with type, question, options, optional answerLength. Rules: MCQ=single option id string; MSQ=array of option ids; BLANK/OPEN=plain text matching answerLength if given. Respond ONLY JSON: {\"answers\":{\"QUESTION_ID\":\"ID_or_text_or_[ids]\"}}. Think carefully, then answer.';window.GM_xmlhttpRequest=function(opts){var url=String(opts.url||'');var isGemini=/generativelanguage\\.googleapis\\.com/i.test(url);var isOpenAI=/api\\.openai\\.com/i.test(url);if(isGemini||isOpenAI){var userText='';try{var body=typeof opts.data==='string'?JSON.parse(opts.data):opts.data;if(body){if(body.contents&&body.contents[0]&&body.contents[0].parts)userText=body.contents[0].parts.map(function(p){return p.text||''}).join('\\n');else if(body.messages){var u=body.messages.filter(function(m){return m.role==='user'});userText=u.map(function(m){return typeof m.content==='string'?m.content:JSON.stringify(m.content)}).join('\\n')}}}catch(e){userText=String(opts.data||'')}fetch(DRIFT_AI,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:DRIFT_MODEL,messages:[{role:'user',content:userText||'Solve quiz'}],system:QUIZ_SYS})}).then(function(r){return r.json().then(function(j){var text=((j.content||[]).map(function(x){return x.text||''}).join('')||j.text||'');text=String(text).replace(/^```json\\s*/i,'').replace(/^```\\s*/i,'').replace(/```$/,'').trim();var shaped;if(isOpenAI){shaped={choices:[{message:{role:'assistant',content:text}}]}}else{shaped={candidates:[{content:{parts:[{text:text}]}}]}}var out=JSON.stringify(shaped);opts.onload&&opts.onload({status:200,responseText:out,response:out})})}).catch(function(e){opts.onerror&&opts.onerror(e)});return}fetch(url,{method:(opts.method||'GET'),headers:opts.headers||{},body:opts.data,credentials:'include'}).then(function(r){return r.text().then(function(t){opts.onload&&opts.onload({status:r.status,responseText:t,response:t})})}).catch(function(e){opts.onerror&&opts.onerror(e)})};try{GM_setValue('apiKeyGemini','drift-worker');GM_setValue('apiKeyGpt','drift-worker');GM_setValue('apiProvider','gemini');GM_setValue('aiAssistance',true)}catch(e){}})();"
  ].join('\\n');

  function waygroundApp(root) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0">' +
      '<div style="padding:8px 10px;border-bottom:1px solid var(--line);font-size:12px;display:flex;justify-content:space-between;gap:8px;align-items:center">' +
      '<span>Wayground · Drift AI (or-gemini)</span>' +
      '<button type="button" id="reinj" style="padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:var(--omni);color:inherit;cursor:pointer">Re-inject</button></div>' +
      '<div id="st" style="padding:4px 10px;font-size:11px;opacity:.7">Starting…</div>' +
      '<div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
    var box = root.querySelector('.sjt');
    var st = root.querySelector('#st');
    var frameObj = null;
    var src = null;
    async function loadSrc() {
      if (src) return src;
      st.textContent = 'Downloading script…';
      var r = await fetch('/api/raw?u=' + encodeURIComponent(CHEAT));
      if (!r.ok) throw new Error('Script download failed');
      src = await r.text();
      return src;
    }
    async function inject() {
      if (!frameObj) return;
      try {
        var code = await loadSrc();
        var w = frameObj.frame && frameObj.frame.contentWindow;
        if (!w) throw new Error('Frame not ready');
        var s = w.document.createElement('script');
        s.textContent = GM + '\\n' + code;
        (w.document.head || w.document.documentElement).appendChild(s);
        try {
          var boot = w.document.createElement('script');
          boot.textContent = "try{if(typeof GM_setValue==='function'){GM_setValue('apiKeyGemini','drift-worker');GM_setValue('apiKeyGpt','drift-worker');GM_setValue('apiProvider','gemini');GM_setValue('aiAssistance',true);}if(typeof API_KEY!=='undefined'){API_KEY='drift-worker';}if(typeof OK!=='undefined'){OK=true;}}catch(e){}";
          (w.document.head || w.document.documentElement).appendChild(boot);
        } catch (e2) {}
        st.textContent = 'Injected · Drift AI (or-gemini: fast + vision)';
      } catch (e) {
        st.textContent = 'Inject failed: ' + (e.message || e);
      }
    }
    async function open() {
      try {
        if (typeof sjInit !== 'function') throw new Error('Scramjet missing');
        st.textContent = 'Loading proxy…';
        await sjInit();
        box.innerHTML = '';
        frameObj = (window.SJC || SJC).createFrame();
        frameObj.frame.style.cssText = 'width:100%;height:100%;border:0;background:#111';
        box.appendChild(frameObj.frame);
        frameObj.frame.addEventListener('load', function () { setTimeout(inject, 800); setTimeout(inject, 2500); });
        await frameObj.go('https://wayground.com');
        st.textContent = 'Opened wayground.com';
      } catch (e) {
        st.textContent = String(e.message || e);
        if (typeof proxySite === 'function') proxySite(box, 'https://wayground.com', 'Wayground');
      }
    }
    root.querySelector('#reinj').onclick = inject;
    open();
  }

  function wire() {
    try {
      if (window.XAPPS) window.XAPPS.wayground = { n: 'Wayground', f: waygroundApp };
      if (window.APPS) window.APPS.wayground = 'Wayground';
    } catch (e) {}
  }
  wire();
  setTimeout(wire, 400);
  setTimeout(wire, 1500);
  console.log('[Drift] Wayground AI bridge ready (or-gemini)');
})();
