/* Drift extras — apps, logos, music, injector, custom apps */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function X() { return window.XAPPS; }
  function A() { return window.APPS; }
  function icons() { return window.IC; }

  function svg(inner) {
    return '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }

  function applyLogos() {
    var IC = icons();
    if (!IC) return;
    IC.gimkit = svg(
      '<rect width="48" height="48" rx="11" fill="#6D28D9"/>' +
      '<text x="24" y="34" text-anchor="middle" font-size="32" font-weight="800" fill="#fff" font-family="Arial,sans-serif">G</text>'
    );
    IC.wayground = svg(
      '<rect width="48" height="48" rx="11" fill="#3B0728"/>' +
      '<path fill="#FF2E8B" d="M8 30l4-14 2 0-3 14z"/>' +
      '<path fill="#FF2E8B" d="M17 16h7v4h-4l1 5h4l1 5h-10z"/>' +
      '<path fill="#FF2E8B" d="M30 14h8l-3 20h-7z"/>'
    );
    IC.whatsapp = svg(
      '<rect width="48" height="48" rx="11" fill="#25D366"/>' +
      '<path fill="#fff" d="M24 12c-6.4 0-11.6 5-11.6 11.2 0 2 .5 3.9 1.5 5.5L13 36l7.4-1.9c1.5.8 3.2 1.2 4.6 1.2 6.4 0 11.6-5 11.6-11.2S30.4 12 24 12zm6.2 15.6c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .2-1.7-.1-.4-.2-1-.3-1.7-.6-3-1.3-5-4.3-5.1-4.5-.2-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2 0 .4-.2.6l-.4.5c-.1.2-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1.9 2 1.2 2.3 1.3.3.1.4 0 .6-.2l.5-.6c.2-.2.3-.2.6-.1l2 .9c.2.1.4.2.5.3.1.3 0 .8-.2 1.4z"/>'
    );
    IC.github = svg(
      '<rect width="48" height="48" rx="11" fill="#24292F"/>' +
      '<path fill="#fff" d="M24 11c-7.2 0-13 5.8-13 13 0 5.7 3.7 10.6 8.8 12.3.6.1.9-.3.9-.6v-2.2c-3.6.8-4.3-1.5-4.3-1.5-.6-1.5-1.4-1.9-1.4-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.1 1.9 3 1.4 3.7 1 .1-.8.5-1.4.8-1.7-2.9-.3-5.9-1.4-5.9-6.4 0-1.4.5-2.6 1.3-3.5-.1-.3-.6-1.6.1-3.4 0 0 1.1-.3 3.6 1.3a12.4 12.4 0 016.5 0c2.5-1.6 3.6-1.3 3.6-1.3.7 1.8.2 3.1.1 3.4.8.9 1.3 2.1 1.3 3.5 0 5-3 6.1-5.9 6.4.5.4.9 1.2.9 2.4v3.5c0 .3.3.7.9.6C33.3 34.6 37 29.7 37 24c0-7.2-5.8-13-13-13z"/>'
    );
    IC.injector = svg(
      '<rect width="48" height="48" rx="11" fill="#0F172A"/>' +
      '<path d="M14 16h20v3H14zm0 7h14v3H14zm0 7h9v3h-9z" fill="#38BDF8"/>' +
      '<path d="M30 30l7 4-7 4z" fill="#FBBF24"/>'
    );
    IC.classdojo = '<img src="/classdojo.svg" alt="" style="width:100%;height:100%;object-fit:contain;background:#fff">';
  }

  function refreshUI() {
    try { if (typeof tiles === 'function') tiles(); } catch (e) {}
    try { if (typeof rend === 'function') rend(); } catch (e) {}
  }

  function healIcons() {
    var apps = A();
    if (!apps || !window.S || !window.S.d) return;
    var list = [];
    try { list = JSON.parse(localStorage.getItem('wos:myapps') || '[]'); } catch (e) {}
    list.forEach(function (app) {
      if (!app || !app.id || !apps[app.id]) return;
      if (Array.isArray(window.S.d.desk) && window.S.d.desk.indexOf(app.id) < 0) window.S.d.desk.push(app.id);
    });
    ['desk', 'pins'].forEach(function (k) {
      if (!Array.isArray(window.S.d[k])) return;
      window.S.d[k] = window.S.d[k].filter(function (id, i, arr) { return id && arr.indexOf(id) === i; });
    });
  }

  function keepLogos() {
    if (typeof rend !== 'function' || rend.__driftLogos) return;
    var orig = rend;
    var guard = false;
    function wrapped() {
      if (!guard) {
        guard = true;
        try { applyLogos(); } catch (e) {}
        guard = false;
      }
      return orig.apply(this, arguments);
    }
    wrapped.__driftLogos = true;
    try { window.rend = wrapped; rend = wrapped; } catch (e) {}
  }

  function media(u) {
    return '/api/media?u=' + encodeURIComponent(u);
  }

  function musicApp(root) {
    root.innerHTML =
      '<div class="yt" style="display:flex;flex-direction:column;height:100%">' +
      '<div class="yh"><input placeholder="Search songs or artists" aria-label="Search music"><button type="button" style="background:#fa243c">Search</button></div>' +
      '<div class="yb" style="flex:1;min-height:0;overflow:auto"><div class="ml"><div class="ym">Search a song or artist.</div></div></div>' +
      '<div class="mp hide" style="padding:8px;border-top:1px solid var(--line)"><b class="mt">—</b><br><audio controls playsinline style="width:100%;margin-top:6px"></audio></div>' +
      '</div>';
    var inp = root.querySelector('input');
    var btn = root.querySelector('button');
    var ml = root.querySelector('.ml');
    var au = root.querySelector('audio');
    var mt = root.querySelector('.mt');
    var mp = root.querySelector('.mp');
    var L = [];
    function play(i) {
      var s = L[i];
      if (!s) return;
      mp.classList.remove('hide');
      au.src = media(s.previewUrl);
      au.play().catch(function () {});
      mt.textContent = s.trackName + ' — ' + s.artistName;
    }
    async function go() {
      var q = (inp.value || '').trim();
      if (!q) return;
      ml.innerHTML = '<div class="ym">Searching…</div>';
      try {
        var r = await fetch('/api/itunes?term=' + encodeURIComponent(q));
        if (!r.ok) throw new Error('Search failed (' + r.status + ')');
        var d = await r.json();
        L = (d.results || []).filter(function (x) { return x.previewUrl; });
        if (!L.length) { ml.innerHTML = '<div class="ym">No previews found.</div>'; return; }
        ml.innerHTML = '';
        L.forEach(function (s, i) {
          var b = document.createElement('button');
          b.style.cssText = 'display:flex;gap:10px;align-items:center;width:100%;text-align:left;padding:8px;border:0;background:transparent;color:inherit;cursor:pointer';
          var im = document.createElement('img');
          im.width = 48; im.height = 48; im.alt = '';
          im.src = s.artworkUrl100 ? media(s.artworkUrl100) : '';
          im.style.cssText = 'border-radius:8px;background:#222';
          var t = document.createElement('span');
          t.innerHTML = '<b>' + s.trackName + '</b><br><small style="opacity:.7">' + s.artistName + '</small>';
          b.appendChild(im); b.appendChild(t);
          b.onclick = function () { play(i); };
          ml.appendChild(b);
        });
      } catch (e) {
        ml.innerHTML = '<div class="ym">' + (e.message || e) + '</div>';
      }
    }
    btn.onclick = go;
    inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };
  }

  var GM = [
    "window.GM_getValue=function(k,d){try{var v=localStorage.getItem('GM_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}};",
    "window.GM_setValue=function(k,v){try{localStorage.setItem('GM_'+k,JSON.stringify(v))}catch(e){}};",
    "window.GM_deleteValue=function(k){try{localStorage.removeItem('GM_'+k)}catch(e){}};",
    "window.GM_addStyle=function(css){var s=document.createElement('style');s.textContent=css;(document.head||document.documentElement).appendChild(s);return s};",
    "window.GM_xmlhttpRequest=function(opts){fetch(opts.url,{method:(opts.method||'GET'),headers:opts.headers||{},body:opts.data}).then(function(r){return r.text().then(function(t){opts.onload&&opts.onload({status:r.status,responseText:t,response:t})})}).catch(function(e){opts.onerror&&opts.onerror(e)})};",
    "window.unsafeWindow=window;"
  ].join('\n');

  function proxyInject(root, pageUrl, label, scriptUrl) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0">' +
      '<div style="padding:8px 10px;border-bottom:1px solid var(--line);font-size:12px;display:flex;justify-content:space-between;gap:8px;align-items:center">' +
      '<span>' + label + '</span><button type="button" id="reinj" style="padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:var(--omni);color:inherit;cursor:pointer">Re-inject</button></div>' +
      '<div id="st" style="padding:4px 10px;font-size:11px;opacity:.7">Starting…</div>' +
      '<div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
    var box = root.querySelector('.sjt');
    var st = root.querySelector('#st');
    var frameObj = null;
    var src = null;
    async function loadSrc() {
      if (src) return src;
      st.textContent = 'Downloading script…';
      var r = await fetch('/api/raw?u=' + encodeURIComponent(scriptUrl));
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
        s.textContent = GM + '\n' + code;
        (w.document.head || w.document.documentElement).appendChild(s);
        st.textContent = 'Injected into ' + label;
      } catch (e) {
        st.textContent = 'Inject failed: ' + (e.message || e) + ' (page may block it until it finishes loading)';
      }
    }
    async function open() {
      try {
        if (typeof sjInit !== 'function') throw new Error('Scramjet missing');
        st.textContent = 'Loading proxy…';
        await sjInit();
        box.innerHTML = '';
        frameObj = SJC.createFrame();
        frameObj.frame.style.cssText = 'width:100%;height:100%;border:0;background:#111';
        box.appendChild(frameObj.frame);
        frameObj.frame.addEventListener('load', function () { setTimeout(inject, 800); });
        await frameObj.go(pageUrl);
        st.textContent = 'Opened ' + pageUrl;
      } catch (e) {
        st.textContent = String(e.message || e);
        if (typeof proxySite === 'function') proxySite(box, pageUrl, label);
      }
    }
    root.querySelector('#reinj').onclick = inject;
    open();
  }

  function waygroundApp(root) {
    if (typeof window.waygroundApp === 'function') return window.waygroundApp(root);
    root.innerHTML = '<div style="padding:16px">Opening Wayground in Chrome…</div>';
    window.open('https://wayground.com/', 'drift-wayground', 'width=1200,height=800');
  }

  function whatsappApp(root) {
    root.innerHTML = '';
    root.style.cssText = 'height:100%;min-height:0;position:relative;background:#111b21';
    if (typeof openProxied === 'function') openProxied('https://web.whatsapp.com/', root);
    else root.textContent = 'WhatsApp needs Scramjet.';
  }

  function githubApp(root) {
    if (typeof proxySite === 'function') proxySite(root, 'https://github.com', 'GitHub');
  }

  function editorShell(root, title, storageKey) {
    root.innerHTML =
      '<div style="display:flex;height:100%;min-height:0;background:#1e1e1e;color:#d4d4d4;font-family:ui-sans-serif,system-ui,sans-serif">' +
      '<div style="flex:1;display:flex;flex-direction:column;min-width:0">' +
      '<div style="display:flex;gap:8px;align-items:center;padding:8px;border-bottom:1px solid #333">' +
      '<b style="font-size:13px">' + title + '</b>' +
      '<button type="button" data-check style="padding:6px 10px;border-radius:8px;border:1px solid #444;background:#333;color:#fff;cursor:pointer">Check</button>' +
      '<button type="button" data-run style="padding:6px 10px;border:0;border-radius:8px;background:#16825d;color:#fff;cursor:pointer">Run / Install</button>' +
      '<button type="button" data-clear style="margin-left:auto;padding:6px 10px;border-radius:8px;border:1px solid #7f1d1d;background:#3f1212;color:#fecaca;cursor:pointer">Clear all injections</button>' +
      '</div>' +
      '<div data-wrap style="flex:1;min-height:0;position:relative;background:#1e1e1e">' +
      '<div data-lens style="position:absolute;left:0;right:0;height:18.85px;background:rgba(255,80,80,.28);display:none;pointer-events:none;z-index:1"></div>' +
      '<textarea data-code spellcheck="false" style="position:absolute;inset:0;width:100%;height:100%;border:0;resize:none;background:transparent;color:#d4d4d4;padding:12px;font-family:ui-monospace,monospace;font-size:13px;line-height:1.45;outline:none;z-index:2" placeholder="// JavaScript"></textarea>' +
      '</div>' +
      '<pre data-err style="margin:0;padding:8px 12px;min-height:36px;background:#111;color:#f88;font-size:12px;white-space:pre-wrap"></pre>' +
      '</div>' +
      '<aside style="width:300px;flex:none;display:flex;flex-direction:column;border-left:1px solid #333;background:#252526">' +
      '<div style="padding:10px 12px;font-weight:700;font-size:13px">AI</div>' +
      '<div data-log style="flex:1;overflow:auto;padding:8px;display:flex;flex-direction:column;gap:8px"></div>' +
      '<textarea data-ai placeholder="Ask for the script…" style="margin:0 10px;min-height:72px;resize:none;border:1px solid #444;border-radius:10px;background:#1e1e1e;color:#eee;padding:8px"></textarea>' +
      '<button type="button" data-gen style="margin:10px;padding:8px;border:0;border-radius:8px;background:#007acc;color:#fff;cursor:pointer">Send</button>' +
      '<pre data-aiout style="margin:0 10px 10px;font-size:11px;white-space:pre-wrap;max-height:48px;overflow:auto;color:#9cdcfe"></pre>' +
      '</aside></div>';
    var code = root.querySelector('[data-code]');
    var err = root.querySelector('[data-err]');
    try { code.value = localStorage.getItem(storageKey) || ''; } catch (e) {}
    function placeLens(line) {
      var lens = root.querySelector('[data-lens]');
      if (!lens) return;
      if (!line) { lens.style.display = 'none'; code._line = 0; return; }
      var lh = 13 * 1.45;
      lens.style.display = 'block';
      lens.style.height = lh + 'px';
      lens.style.top = (12 + (line - 1) * lh - code.scrollTop) + 'px';
      code._line = line;
    }
    function check() {
      var src = code.value;
      try { localStorage.setItem(storageKey, src); } catch (e) {}
      var issue = (typeof window.driftJsIssue === 'function') ? window.driftJsIssue(src) : null;
      if (!issue) {
        try { new Function(src); }
        catch (e) { issue = { line: 1, message: (e && e.message) || String(e) }; }
      }
      if (!issue) {
        err.style.color = '#86efac';
        err.textContent = 'No syntax errors.';
        placeLens(0);
        return true;
      }
      err.style.color = '#ff8d8d';
      err.textContent = 'Line ' + issue.line + ': ' + issue.message;
      placeLens(issue.line);
      return false;
    }
    root.querySelector('[data-check]').onclick = check;
    root.querySelector('[data-clear]').onclick = function () {
      if (!confirm('Remove every injection you installed?')) return;
      var list = {};
      try { list = JSON.parse(localStorage.getItem('wos:userscripts') || '{}'); } catch (e) {}
      var apps = A();
      var x = X();
      Object.keys(list).forEach(function (id) {
        if (apps) delete apps[id];
        if (x) delete x[id];
      });
      try { localStorage.removeItem('wos:userscripts'); } catch (e) {}
      refreshUI();
      err.style.color = '#8ec5ff';
      err.textContent = 'All injections were removed.';
    };
    code.addEventListener('scroll', function () { if (code._line) placeLens(code._line); });
    code.addEventListener('input', function () {
      clearTimeout(code._t);
      code._t = setTimeout(check, 400);
    });
    root.querySelector('[data-run]').onclick = function () {
      if (!check()) return;
      try {
        var fn = new Function(code.value);
        var result = fn();
        installUserscript(title, code.value);
        err.style.color = '#86efac';
        err.textContent = 'Installed in the app menu. Return: ' + (result === undefined ? 'undefined' : String(result));
      } catch (e) {
        err.style.color = '#f88';
        err.textContent = 'Runtime: ' + (e.message || e);
      }
    };
    root.querySelector('[data-gen]').onclick = async function () {
      var q = root.querySelector('[data-ai]').value.trim();
      var out = root.querySelector('[data-aiout]');
      if (!q) return;
      out.textContent = 'Generating…';
      var log = root.querySelector('[data-log]');
      if (log) {
        var mine = document.createElement('div');
        mine.style.cssText = 'align-self:flex-end;max-width:94%;padding:8px 10px;border-radius:12px;background:#007acc;color:#fff;font-size:12px;white-space:pre-wrap';
        mine.textContent = q;
        log.appendChild(mine);
        log.scrollTop = log.scrollHeight;
      }
      try {
        var body = {
          systemInstruction: { parts: [{ text: 'You are Drift 2.1. Write only JavaScript for a browser userscript. Output code only, no markdown fences.' }] },
          contents: [{ role: 'user', parts: [{ text: q }] }],
          generationConfig: { maxOutputTokens: 8192, temperature: 0.3 }
        };
        var text = '';
        var ep = (typeof EP === 'function' ? EP() : (window.DDG0 || 'https://holy-firefly-982c.fert0480.workers.dev')).replace(/\/$/, '');
        try {
          var rc = await fetch(ep + '/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'qwen/qwen3-coder-plus:free', max_tokens: 32768, messages: [{ role: 'user', content: q }], system: body.systemInstruction.parts[0].text }) });
          var jc = await rc.json();
          text = ((jc.content || []).map(function (x) { return x.text || ''; }).join(''));
        } catch (errC) { text = ''; }
        if (!String(text || '').trim()) {
          var r = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          var j = await r.json();
          if (r.ok) text = ((((j.candidates || [])[0] || {}).content || {}).parts || []).filter(function (p) { return !p.thought; }).map(function (p) { return p.text || ''; }).join('');
          else throw new Error((j.error && (j.error.message || String(j.error))) || 'The code model did not answer.');
        }
        text = String(text).replace(/^```[a-z]*\n?/i, '').replace(/```$/, '');
        if (!text) throw new Error('Empty response');
        code.value = text;
        check();
        out.textContent = 'Inserted into the editor.';
      } catch (e) {
        out.textContent = String(e.message || e);
      }
    };
  }

  function installUserscript(name, src) {
    var apps = A();
    var x = X();
    if (!apps || !x) return;
    var id = 'us_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18);
    if (!id || id === 'us_') id = 'us_script';
    apps[id] = name;
    var IC = icons();
    if (IC && !IC[id]) IC[id] = IC.injector;
    x[id] = {
      n: name,
      f: function (root) {
        editorShell(root, name, 'wos:js:' + id);
        root.querySelector('[data-code]').value = src;
        try { new Function(src)(); } catch (e) {}
      }
    };
    try {
      var list = JSON.parse(localStorage.getItem('wos:userscripts') || '{}');
      list[id] = { name: name, src: src };
      localStorage.setItem('wos:userscripts', JSON.stringify(list));
    } catch (e) {}
    refreshUI();
  }

  function injectorApp(root) {
    editorShell(root, 'JS Injector', 'wos:js:injector');
  }

  function wrapVscode() {
    if (typeof vscode === 'function' && String(vscode).indexOf('vschat') >= 0) return;
    var orig = vscode;
    function wrapped(root) {
      var holder = document.createElement('div');
      holder.style.cssText = 'display:flex;height:100%;min-height:0';
      root.innerHTML = '';
      root.appendChild(holder);
      var side = document.createElement('div');
      side.style.cssText = 'width:260px;flex:none;display:flex;flex-direction:column;background:#252526;color:#ddd;border-right:1px solid #333';
      side.innerHTML =
        '<div style="padding:10px;font-weight:700">AI</div>' +
        '<textarea data-ai placeholder="Ask AI to write code…" style="flex:1;margin:0 8px 8px;border:1px solid #444;border-radius:8px;background:#1e1e1e;color:#eee;padding:8px"></textarea>' +
        '<button type="button" data-gen style="margin:0 8px 8px;padding:8px;border:0;border-radius:8px;background:#007acc;color:#fff;cursor:pointer">New file</button>' +
        '<pre data-out style="margin:0 8px 8px;font-size:11px;color:#9cdcfe;white-space:pre-wrap"></pre>';
      var main = document.createElement('div');
      main.style.cssText = 'flex:1;min-width:0;min-height:0;display:flex;flex-direction:column';
      holder.appendChild(side);
      holder.appendChild(main);
      orig(main);
      side.querySelector('[data-gen]').onclick = async function () {
        var q = side.querySelector('[data-ai]').value.trim();
        var out = side.querySelector('[data-out]');
        if (!q) return;
        out.textContent = 'Writing a new file…';
        try {
          var body = {
            systemInstruction: { parts: [{ text: 'You are Drift 2.1, the coding assistant inside Drift VS Code. When the user asks you to create something, reply with one or more new files. For each file use exactly:\nFILE: name.ext\n```\ncomplete code\n```\nPick the real extension (.py .json .js .ts .lua .luau .html .css .md .sql). Write the COMPLETE file. Never truncate, never say the rest continues.' }] },
            contents: [{ role: 'user', parts: [{ text: q }] }],
            generationConfig: { maxOutputTokens: 65536, temperature: 0.4 }
          };
          var r = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          var j = await r.json();
          var text = '';
          if (r.ok) {
            text = ((((j.candidates || [])[0] || {}).content || {}).parts || []).filter(function (p) { return !p.thought; }).map(function (p) { return p.text || ''; }).join('');
          } else if (r.status === 404 || /no-key/i.test(JSON.stringify(j.error || ''))) {
            var ep = (typeof EP === 'function' ? EP() : (window.DDG0 || 'https://holy-firefly-982c.fert0480.workers.dev')).replace(/\/$/, '');
            var r2 = await fetch(ep + '/ai', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'google/gemini-3.8-flash',
                max_tokens: 32768,
                messages: [{ role: 'user', content: q }],
                system: body.systemInstruction.parts[0].text
              })
            });
            var j2 = await r2.json();
            text = ((j2.content || []).map(function (x) { return x.text || ''; }).join('')) || (j2.error && (j2.error.message || String(j2.error))) || '';
          } else {
            text = (j.error && (j.error.message || String(j.error))) || 'Drift 2.1 did not answer.';
          }
          var re = /FILE:\s*([^\n]+)\n```[^\n]*\n([\s\S]*?)```/g, m, made = [], hit;
          while ((m = re.exec(text))) made.push([m[1].trim(), m[2].replace(/\s+$/, '')]);
          if (!made.length) {
            var fence = text.match(/```([a-z0-9.+#-]*)\n([\s\S]*?)```/i);
            var ext = 'js';
            if (fence) {
              var map = { python: 'py', py: 'py', javascript: 'js', js: 'js', typescript: 'ts', ts: 'ts', json: 'json', lua: 'lua', luau: 'lua', html: 'html', css: 'css', sql: 'sql', markdown: 'md', md: 'md', shell: 'sh', bash: 'sh' };
              ext = map[(fence[1] || '').toLowerCase()] || 'js';
              made.push(['ai-' + Date.now() + '.' + ext, fence[2].replace(/\s+$/, '')]);
            } else if (text) made.push(['ai-' + Date.now() + '.txt', text]);
          }
          if (window.DriftVS && made.length) {
            made.forEach(function (pair) { window.DriftVS.addFile(pair[0], pair[1]); });
            out.textContent = 'Created ' + made.map(function (p) { return p[0]; }).join(', ');
          } else out.textContent = text ? 'Editor not ready yet.' : 'No code returned.';
        } catch (e) {
          out.textContent = String(e.message || e);
        }
      };
    }
    wrapped.__drift = true;
    try { window.vscode = wrapped; } catch (e) {}
    var x = X();
    if (x && x.code) x.code.f = wrapped;
  }

  function loadCustomApps() {
    var apps = A();
    var x = X();
    var IC = icons();
    if (!apps || !x) return;
    var list = [];
    try { list = JSON.parse(localStorage.getItem('wos:myapps') || '[]'); } catch (e) {}
    list.forEach(function (app) {
      if (!app || !app.id || !app.url) return;
      apps[app.id] = app.name || app.id;
      if (IC) {
        IC[app.id] = app.logo
          ? '<img src="' + app.logo.replace(/"/g, '') + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:11px">'
          : (IC.browser || '');
      }
      x[app.id] = {
        n: app.name || 'App',
        f: function (root) {
          if (typeof proxySite === 'function') proxySite(root, app.url, app.name || 'App');
          else root.textContent = app.url;
        }
      };
    });
    try {
      var scripts = JSON.parse(localStorage.getItem('wos:userscripts') || '{}');
      Object.keys(scripts).forEach(function (id) {
        var s = scripts[id];
        apps[id] = s.name || id;
        if (IC && !IC[id]) IC[id] = IC.injector;
        x[id] = { n: s.name || id, f: function (root) { editorShell(root, s.name || id, 'wos:js:' + id); var c = root.querySelector('[data-code]'); if (c) c.value = s.src || ''; } };
      });
    } catch (e) {}
  }

  function classdojoApp(root) {
    var page = 'https://www.classdojo.com/dojo-islands/';
    var scriptUrl = 'https://raw.githubusercontent.com/appsandoranges/Class-Dojo-Plus/master/class-dojo-plus.js';
    root.innerHTML = '<div style="display:flex;flex-direction:column;height:100%;min-height:0"><div style="padding:8px 10px;border-bottom:1px solid var(--line);font-size:12px">ClassDojo · Dojo Islands</div><div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
    var box = root.querySelector('.sjt');
    var src = '';
    var seen = '';
    function inject() {
      var frame = box.querySelector('iframe');
      if (!frame || !src) return;
      try {
        var d = frame.contentDocument;
        var href = String(frame.contentWindow.location.href || '');
        if (!d || !d.documentElement) return;
        if (href !== seen) {
          seen = href;
          d.documentElement.removeAttribute('data-cdp');
        }
        if (d.documentElement.getAttribute('data-cdp') === '1') return;
        d.documentElement.setAttribute('data-cdp', '1');
        var s = d.createElement('script');
        s.textContent = src + '\n//# sourceURL=class-dojo-plus.js';
        (d.head || d.documentElement).appendChild(s);
      } catch (e) {}
    }
    fetch('/api/raw?u=' + encodeURIComponent(scriptUrl), { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('mod');
      return r.text();
    }).then(function (t) {
      src = String(t || '').replace(/^[\s\S]*?==\/UserScript==\s*/, '');
      inject();
    }).catch(function () {});
    if (typeof window.openProxied === 'function') {
      window.openProxied(page, box).then(function (frame) {
        if (frame && frame.frame) frame.frame.addEventListener('load', function () { setTimeout(inject, 400); });
        setTimeout(inject, 800);
      }).catch(function () {});
    } else if (typeof window.proxySite === 'function') {
      window.proxySite(box, page, 'ClassDojo');
    } else {
      box.textContent = page;
    }
  }

  function registerCore() {
    var apps = A();
    var x = X();
    if (!apps || !x) return;
    apps.github = 'GitHub';
    apps.whatsapp = 'WhatsApp';
    apps.wayground = 'Wayground';
    apps.injector = 'JS Injector';
    apps.classdojo = 'ClassDojo';
    x.whatsapp = { n: 'WhatsApp', f: whatsappApp };
    x.github = { n: 'GitHub', f: githubApp };
    x.wayground = { n: 'Wayground', f: waygroundApp };
    x.injector = { n: 'JS Injector', f: injectorApp };
    x.classdojo = { n: 'ClassDojo', f: classdojoApp };
    x.mus = { n: 'Música', f: musicApp };
    if (typeof discordApp === 'function') x.discord = { n: 'Discord', f: discordApp };
    loadCustomApps();
    wrapVscode();
    applyLogos();
    keepLogos();
    healIcons();
    refreshUI();
  }

  function createAppButton() {
    var bg = document.getElementById('bgbtn');
    if (!bg || document.getElementById('create-app')) return;
    var b = document.createElement('button');
    b.id = 'create-app';
    b.textContent = 'Create your app';
    bg.parentNode.insertBefore(b, bg.nextSibling);
    b.onclick = function (e) {
      e.stopPropagation();
      var name = prompt('App name');
      if (!name) return;
      var url = prompt('Link (opened with Scramjet)', 'https://');
      if (!url) return;
      var logo = prompt('Logo image URL (optional)', '') || '';
      var id = 'app_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 16);
      if (!id || id === 'app_') id = 'app_' + Date.now();
      var list = [];
      try { list = JSON.parse(localStorage.getItem('wos:myapps') || '[]'); } catch (err) {}
      list = list.filter(function (a) { return a.id !== id; });
      list.push({ id: id, name: name, url: url, logo: logo });
      localStorage.setItem('wos:myapps', JSON.stringify(list));
      registerCore();
      try { openApp(id); } catch (err) {}
    };
  }

  function fixChrome() {
    var s = document.getElementById('drift-chrome-fix');
    if (!s) {
      s = document.createElement('style');
      s.id = 'drift-chrome-fix';
      document.head.appendChild(s);
    }
    s.textContent = [
      '.ai-tools{display:none!important}',
      '.win{display:flex;flex-direction:column}',
      '.win>.title{position:relative;z-index:30;flex:none}',
      '.win>.body{position:relative!important;flex:1;min-height:0;overflow:hidden}',
      '.win>.body .sjt{position:absolute!important;inset:0!important}',
      '#create-app{margin-left:8px}'
    ].join('');
  }

  onReady(function () {
    fixChrome();
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (window.XAPPS && window.APPS) {
        registerCore();
        createAppButton();
        clearInterval(t);
      } else if (n > 40) clearInterval(t);
    }, 150);
  });
})();
