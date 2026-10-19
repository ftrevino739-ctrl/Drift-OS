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
    proxyInject(
      root,
      'https://wayground.com',
      'Wayground',
      'https://raw.githubusercontent.com/ByOscarPINE/Wayground-Quizizz-Cheat/main/wayground.user.js'
    );
  }

  function whatsappApp(root) {
    if (typeof proxySite === 'function') proxySite(root, 'https://web.whatsapp.com/', 'WhatsApp');
    else root.textContent = 'WhatsApp needs the proxy.';
  }

  function githubApp(root) {
    if (typeof proxySite === 'function') proxySite(root, 'https://github.com', 'GitHub');
  }

  function editorShell(root, title, storageKey) {
    root.innerHTML =
      '<div style="display:flex;height:100%;min-height:0;background:#1e1e1e;color:#d4d4d4;font-family:ui-sans-serif,system-ui,sans-serif">' +
      '<aside style="width:280px;flex:none;display:flex;flex-direction:column;border-right:1px solid #333;background:#252526">' +
      '<div style="padding:10px 12px;font-weight:700;font-size:13px">AI</div>' +
      '<textarea data-ai placeholder="Describe the code to generate…" style="flex:1;margin:0 10px;min-height:80px;resize:none;border:1px solid #444;border-radius:8px;background:#1e1e1e;color:#eee;padding:8px"></textarea>' +
      '<button type="button" data-gen style="margin:10px;padding:8px;border:0;border-radius:8px;background:#007acc;color:#fff;cursor:pointer">Generate</button>' +
      '<pre data-aiout style="margin:0 10px 10px;font-size:11px;white-space:pre-wrap;max-height:80px;overflow:auto;color:#9cdcfe"></pre>' +
      '</aside>' +
      '<div style="flex:1;display:flex;flex-direction:column;min-width:0">' +
      '<div style="display:flex;gap:8px;align-items:center;padding:8px;border-bottom:1px solid #333">' +
      '<b style="font-size:13px">' + title + '</b>' +
      '<button type="button" data-check style="padding:6px 10px;border-radius:8px;border:1px solid #444;background:#333;color:#fff;cursor:pointer">Check</button>' +
      '<button type="button" data-run style="padding:6px 10px;border:0;border-radius:8px;background:#16825d;color:#fff;cursor:pointer">Run / Install</button>' +
      '</div>' +
      '<textarea data-code spellcheck="false" style="flex:1;border:0;resize:none;background:#1e1e1e;color:#d4d4d4;padding:12px;font-family:ui-monospace,monospace;font-size:13px;line-height:1.45;outline:none" placeholder="// JavaScript"></textarea>' +
      '<pre data-err style="margin:0;padding:8px 12px;min-height:36px;background:#111;color:#f88;font-size:12px;white-space:pre-wrap"></pre>' +
      '</div></div>';
    var code = root.querySelector('[data-code]');
    var err = root.querySelector('[data-err]');
    try { code.value = localStorage.getItem(storageKey) || ''; } catch (e) {}
    function check() {
      var src = code.value;
      try { localStorage.setItem(storageKey, src); } catch (e) {}
      try {
        new Function(src);
        err.style.color = '#86efac';
        err.textContent = 'No syntax errors.';
        return true;
      } catch (e) {
        err.style.color = '#f88';
        err.textContent = 'Error: ' + (e && e.message ? e.message : e);
        return false;
      }
    }
    root.querySelector('[data-check]').onclick = check;
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
      try {
        var ep = (window.DDG0 || 'https://holy-firefly-982c.fert0480.workers.dev').replace(/\/$/, '');
        try {
          var saved = localStorage.getItem('wos:ddg');
          if (saved) ep = JSON.parse(saved).replace(/\/$/, '');
        } catch (e) {}
        var r = await fetch(ep + '/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'groq-llama',
            messages: [{ role: 'user', content: 'Write only JavaScript. No markdown fences.\n' + q }],
            system: 'You write JavaScript for a browser userscript. Output code only.'
          })
        });
        var j = await r.json();
        var text = ((j.content || []).map(function (x) { return x.text || ''; }).join('') || j.text || '');
        text = text.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '');
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
    if (typeof vscode !== 'function' || vscode.__drift) return;
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
        '<button type="button" data-gen style="margin:0 8px 8px;padding:8px;border:0;border-radius:8px;background:#007acc;color:#fff;cursor:pointer">Insert code</button>' +
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
        out.textContent = 'Generating…';
        try {
          var ep = (window.DDG0 || 'https://holy-firefly-982c.fert0480.workers.dev').replace(/\/$/, '');
          var r = await fetch(ep + '/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'groq-llama',
              messages: [{ role: 'user', content: 'Write code only, no markdown.\n' + q }],
              system: 'You are a coding assistant inside Drift VS Code.'
            })
          });
          var j = await r.json();
          var text = ((j.content || []).map(function (x) { return x.text || ''; }).join('') || '');
          var ta = main.querySelector('textarea');
          if (ta) ta.value = text.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '');
          out.textContent = ta ? 'Inserted.' : 'No editor field found.';
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

  function registerCore() {
    var apps = A();
    var x = X();
    if (!apps || !x) return;
    apps.github = 'GitHub';
    apps.whatsapp = 'WhatsApp';
    apps.wayground = 'Wayground';
    apps.injector = 'JS Injector';
    x.whatsapp = { n: 'WhatsApp', f: whatsappApp };
    x.github = { n: 'GitHub', f: githubApp };
    x.wayground = { n: 'Wayground', f: waygroundApp };
    x.injector = { n: 'JS Injector', f: injectorApp };
    x.mus = { n: 'Music', f: musicApp };
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
