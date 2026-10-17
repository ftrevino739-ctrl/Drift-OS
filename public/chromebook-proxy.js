/* ChromeOS + Windows UI: proxy fixes, taskbar/title hide, warning */
(function () {
  'use strict';

  function isChromeOS() {
    try {
      if (navigator.userAgentData && /Chrome OS|Chromium OS/i.test(navigator.userAgentData.platform || '')) return true;
    } catch (e) {}
    return /CrOS|Chromebook/i.test(navigator.userAgent || '');
  }

  function withTimeout(promise, ms, label) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var t = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error((label || 'Timeout') + ' after ' + ms + 'ms'));
      }, ms);
      Promise.resolve(promise).then(
        function (v) { if (!done) { done = true; clearTimeout(t); resolve(v); } },
        function (e) { if (!done) { done = true; clearTimeout(t); reject(e); } }
      );
    });
  }

  function loadScriptOnce(src) {
    if (document.querySelector('script[data-drift-src="' + src + '"]')) return Promise.resolve();
    return new Promise(function (ok, no) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.dataset.driftSrc = src;
      s.onload = ok;
      s.onerror = function () { no(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  function failBox(box, url, msg) {
    box.innerHTML =
      '<div class="ym" style="padding:16px;line-height:1.5">' +
      '<b>Proxy failed</b><br>' + esc(msg) +
      '<br><br><a href="' + esc(url) + '" target="_blank" rel="noopener" style="color:var(--acc)">Open in new tab</a>' +
      (isChromeOS()
        ? '<br><br><small>ChromeOS: wait 30s if Render is waking up, then retry. Keep this tab open.</small>'
        : '') +
      '</div>';
  }

  window.SJ = function SJ() { return true; };

  var cache = null;

  window.sjInit = function sjInitFast() {
    if (cache) return cache;
    cache = (async function () {
      var chromeos = isChromeOS();
      try {
        if (typeof scramjetAvailable === 'function' && !(await scramjetAvailable())) {
          throw new Error('Proxy offline (Render may be cold-starting). Wait 30–60s.');
        }
      } catch (e) {
        if (/offline|cold|Proxy/i.test(String(e.message || e))) throw e;
      }

      if (typeof $scramjetLoadController !== 'function') {
        await Promise.all([
          loadScriptOnce('/scram/scramjet.all.js'),
          loadScriptOnce('/baremux/index.js')
        ]).catch(function () {
          return Promise.all([
            loadScriptOnce('/scram/scramjet.all.js'),
            loadScriptOnce('/baremux/index.js')
          ]);
        });
      }
      if (typeof $scramjetLoadController !== 'function') {
        throw new Error('Scramjet scripts missing. Hard refresh (Ctrl+Shift+R).');
      }
      if (!navigator.serviceWorker) {
        throw new Error('Service Workers need HTTPS.');
      }

      var Ctrl = $scramjetLoadController().ScramjetController;
      var SJC = new Ctrl({
        files: {
          wasm: '/scram/scramjet.wasm.wasm',
          all: '/scram/scramjet.all.js',
          sync: '/scram/scramjet.sync.js'
        }
      });
      SJC.init();

      try {
        var swr = await fetch('/sw.js', { method: 'HEAD', cache: 'no-store' });
        if (swr.ok) {
          await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
          await withTimeout(navigator.serviceWorker.ready, chromeos ? 18000 : 10000, 'SW ready');
        }
      } catch (e) {
        console.warn('SW', e);
      }

      if (typeof BareMux === 'undefined') await loadScriptOnce('/baremux/index.js');
      if (typeof BareMux === 'undefined') throw new Error('BareMux no cargó');

      var wisp = (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host + '/wisp/';
      var lastErr = null;
      for (var attempt = 1; attempt <= 4; attempt++) {
        try {
          var c = new BareMux.BareMuxConnection('/baremux/worker.js');
          var transport = await withTimeout(c.getTransport(), chromeos ? 12000 : 6000, 'BareMux getTransport');
          if (transport !== '/libcurl/index.mjs') {
            await withTimeout(
              c.setTransport('/libcurl/index.mjs', [{ websocket: wisp }]),
              chromeos ? 16000 : 8000,
              'BareMux setTransport'
            );
          }
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
          console.warn('BareMux attempt ' + attempt, e);
          await new Promise(function (r) { setTimeout(r, 350 * attempt); });
        }
      }
      if (lastErr) {
        throw new Error(
          'BareMux no respondió. On Chromebook the Scramjet/Wisp socket may be blocked or the host is waking up. Detail: ' +
          String(lastErr.message || lastErr)
        );
      }

      window.SJC = SJC;
      return SJC;
    })();
    cache.catch(function () { cache = null; });
    return cache;
  };

  window.sjLoad = async function (box, url) {
    box.innerHTML = '<div class="ym">Starting proxy…</div>';
    try {
      await window.sjInit();
      var f = window.SJC.createFrame();
      f.frame.style.cssText = 'width:100%;height:100%;min-height:70vh;border:0;border-radius:12px;background:#fff';
      box.innerHTML = '';
      box.appendChild(f.frame);
      f.go(url);
      return f;
    } catch (e) {
      failBox(box, url, e && e.message || e);
      return null;
    }
  };

  function normalizeProxyUrl(url) {
    try {
      var u = new URL(url);
      var h = u.hostname.replace(/^www\./, '');
      if (h === 'tiktok.com') {
        u.hostname = 'www.tiktok.com';
        if (u.pathname === '/' || u.pathname === '') u.pathname = '/foryou';
        return u.toString();
      }
      if (h === 'gemini.google.com') return 'https://gemini.google.com/app';
      if (h === 'gimkit.com' || h === 'www.gimkit.com') {
        if (u.pathname === '/' || u.pathname === '') return 'https://www.gimkit.com/join';
      }
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  window.openProxied = async function openProxiedFast(url, box) {
    var target = normalizeProxyUrl(url);
    box.innerHTML = '<div class="ym">Loading…</div>';
    try {
      await window.sjInit();
      var f = window.SJC.createFrame();
      f.frame.style.cssText = 'width:100%;height:100%;border:0;background:#fff';
      box.innerHTML = '';
      box.appendChild(f.frame);
      try { f.go(target); } catch (e) {
        failBox(box, target, 'Could not navigate: ' + (e && e.message || e));
        return null;
      }
      return f;
    } catch (e) {
      failBox(box, target, e && e.message || e);
      return null;
    }
  };

  window.proxySite = function proxySiteFast(root, url, label) {
    var target = normalizeProxyUrl(url);
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0">' +
      '<div style="padding:6px 10px;font-size:11px;color:var(--mute);border-bottom:1px solid var(--line);display:flex;gap:8px;align-items:center;justify-content:space-between">' +
      '<span>' + esc(label || 'Site') + ' · proxy</span>' +
      '<span style="display:flex;gap:10px">' +
      '<button type="button" data-retry style="border:0;background:transparent;color:var(--acc);cursor:pointer;font-size:11px">Retry</button>' +
      '<a href="' + esc(target) + '" target="_blank" rel="noopener" style="color:var(--acc);font-size:11px">Open in new tab</a>' +
      '</span></div>' +
      '<div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
    var box = root.querySelector('.sjt');
    function go() { window.openProxied(target, box); }
    root.querySelector('[data-retry]').onclick = go;
    go();
  };

  window.ttApp = function (root) { window.proxySite(root, 'https://www.tiktok.com/foryou', 'TikTok'); };
  window.gemApp = function (root) {
    root.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;height:100%;min-height:0';
    root.appendChild(wrap);
    window.proxySite(wrap, 'https://gemini.google.com/app', 'Gemini');
  };

  window.gimkitApp = function gimkitAppFixed(root) {
    var CHEAT = 'https://raw.githubusercontent.com/TheLazySquid/GimkitCheat/main/build/bundle.user.js';
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0">' +
      '<div style="padding:8px 10px;border-bottom:1px solid var(--line);font-size:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between">' +
      '<span>Gimkit</span><span style="display:flex;gap:6px;align-items:center">' +
      '<input id="gk-code" placeholder="Join code" style="width:110px;padding:6px 8px;border-radius:8px;border:1px solid var(--line);background:var(--omni);color:var(--ink)"/>' +
      '<button type="button" id="gk-go" style="padding:6px 12px;border:0;border-radius:8px;background:var(--acc);color:#fff;cursor:pointer">Join</button>' +
      '<button type="button" id="gk-inj" style="padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--omni);color:inherit;cursor:pointer">Re-inject</button>' +
      '</span></div>' +
      '<div id="gk-status" style="padding:4px 10px;font-size:11px;opacity:.75">Loading Gimkit…</div>' +
      '<div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
    var box = root.querySelector('.sjt');
    var st = root.querySelector('#gk-status');
    var frameObj = null;
    var cheatSrc = null;
    var gm =
      "window.GM_getValue=function(k,d){try{var v=localStorage.getItem('GM_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}};" +
      "window.GM_setValue=function(k,v){try{localStorage.setItem('GM_'+k,JSON.stringify(v))}catch(e){}};" +
      "window.GM_deleteValue=function(k){try{localStorage.removeItem('GM_'+k)}catch(e){}};" +
      "window.GM_addStyle=function(css){var s=document.createElement('style');s.textContent=css;(document.head||document.documentElement).appendChild(s);return s};" +
      "window.GM_xmlhttpRequest=function(opts){fetch(opts.url,{method:(opts.method||'GET'),headers:opts.headers||{},body:opts.data,credentials:'include'}).then(function(r){return r.text().then(function(t){opts.onload&&opts.onload({status:r.status,responseText:t,response:t})})}).catch(function(e){opts.onerror&&opts.onerror(e)})};" +
      'window.unsafeWindow=window;';
    async function loadCheat() {
      if (cheatSrc) return cheatSrc;
      st.textContent = 'Downloading cheat…';
      var r = await fetch('/api/raw?u=' + encodeURIComponent(CHEAT), { cache: 'no-store' });
      if (!r.ok) r = await fetch(CHEAT, { cache: 'no-store' });
      if (!r.ok) throw new Error('Cheat download failed (' + r.status + ')');
      var t = await r.text();
      cheatSrc = t.replace(/^[\s\S]*?==\/UserScript==\s*/, '');
      return cheatSrc;
    }
    function inject() {
      if (!frameObj || !frameObj.frame) return;
      try {
        var w = frameObj.frame.contentWindow;
        var d = frameObj.frame.contentDocument || (w && w.document);
        if (!w || !d) throw new Error('Frame not ready');
        if (d.documentElement.getAttribute('data-gk-inj') === '1') { st.textContent = 'Cheat already injected'; return; }
        var s1 = d.createElement('script'); s1.textContent = gm; (d.head || d.documentElement).appendChild(s1);
        var s2 = d.createElement('script'); s2.textContent = cheatSrc + '\n//# sourceURL=gimkit-cheat.js'; (d.head || d.documentElement).appendChild(s2);
        d.documentElement.setAttribute('data-gk-inj', '1');
        st.textContent = 'Gimkit loaded · cheat injected';
      } catch (e) { st.textContent = 'Page loaded · inject later: ' + (e.message || e); }
    }
    async function openUrl(url) {
      st.textContent = 'Opening ' + url + '…';
      box.innerHTML = '<div class="ym">Loading Gimkit…</div>';
      try {
        await loadCheat().catch(function (e) { st.textContent = String(e.message || e); });
        frameObj = await window.openProxied(url, box);
        if (!frameObj) { st.textContent = 'Proxy failed'; return; }
        if (frameObj.frame) {
          frameObj.frame.addEventListener('load', function () {
            setTimeout(inject, 600); setTimeout(inject, 2000); setTimeout(inject, 4500);
          });
        }
        setTimeout(inject, 1500);
        st.textContent = 'Gimkit page loading…';
      } catch (e) {
        st.textContent = String(e.message || e);
        failBox(box, url, e && e.message || e);
      }
    }
    root.querySelector('#gk-go').onclick = function () {
      var code = (root.querySelector('#gk-code').value || '').trim();
      openUrl(code ? 'https://www.gimkit.com/join/' + encodeURIComponent(code) : 'https://www.gimkit.com/join');
    };
    root.querySelector('#gk-inj').onclick = function () {
      loadCheat().then(inject).catch(function (e) { st.textContent = String(e.message || e); });
    };
    openUrl('https://www.gimkit.com/join');
  };

  function wireApps() {
    try {
      var X = window.XAPPS;
      if (!X) return;
      X.tt = { n: 'TikTok', f: window.ttApp };
      X.gem = { n: 'Gemini', f: window.gemApp };
      X.gimkit = { n: 'Gimkit', f: window.gimkitApp };
      if (X.whatsapp) X.whatsapp.f = function (r) { window.proxySite(r, 'https://web.whatsapp.com/', 'WhatsApp'); };
      if (X.github) X.github.f = function (r) { window.proxySite(r, 'https://github.com', 'GitHub'); };
      if (window.APPS && !window.APPS.gem) window.APPS.gem = 'Gemini';
    } catch (e) { console.warn('wireApps', e); }
  }

  function guardYouTube() {
    try {
      if (typeof window.youtube !== 'function') return;
      var Y0 = window.youtube;
      if (Y0.__driftGuard) return;
      window.youtube = function (root) {
        try { if (root) root.innerHTML = ''; } catch (e) {}
        return Y0.apply(this, arguments);
      };
      window.youtube.__driftGuard = true;
    } catch (e) {}
  }

  function showChromeOSWarning() {
    if (!isChromeOS()) return;
    try { if (sessionStorage.getItem('drift:cros-warn') === '1') return; } catch (e) {}
    if (document.getElementById('drift-cros-warn')) return;
    var el = document.createElement('div');
    el.id = 'drift-cros-warn';
    el.setAttribute('role', 'alert');
    el.style.cssText =
      'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483646;' +
      'max-width:min(560px,92vw);background:#1a1a1f;color:#f5f5f7;border:1px solid #f5a524;' +
      'border-radius:14px;padding:14px 40px 14px 16px;box-shadow:0 12px 40px rgba(0,0,0,.45);' +
      'font:14px/1.45 system-ui,-apple-system,sans-serif';
    el.innerHTML =
      '<button type="button" aria-label="Close" style="position:absolute;top:8px;right:10px;border:0;background:transparent;color:#aaa;font-size:20px;cursor:pointer;line-height:1">×</button>' +
      '<div style="font-weight:700;color:#f5a524;margin-bottom:6px">WARNING</div>' +
      '<div>We detect you are using a Chromebook device (ChromeOS System). Some apps will not charge until you wait 3+ minutes so be patient — all is fine, just wait a while meanwhile we set up everything for you.</div>';
    el.querySelector('button').onclick = function () {
      el.remove();
      try { sessionStorage.setItem('drift:cros-warn', '1'); } catch (e) {}
    };
    document.body.appendChild(el);
  }

  function installChromeUI() {
    if (document.getElementById('drift-chrome-ui-style')) {
      /* still attach new windows */
    } else {
      var style = document.createElement('style');
      style.id = 'drift-chrome-ui-style';
      style.textContent =
        '#task.drift-hidden{transform:translateY(110%);opacity:0;pointer-events:none!important;transition:transform .25s ease,opacity .2s ease}' +
        '#task{transition:transform .25s ease,opacity .2s ease}' +
        'body.drift-tb-off .win.max{inset:0 0 0 0!important;top:0!important;bottom:0!important;height:auto!important}' +
        '.win.drift-title-off>.title{display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;pointer-events:none!important;padding:0!important;border:0!important}' +
        '.win.drift-title-off>.body{flex:1!important;min-height:0!important}' +
        '#drift-tb-hide{margin-left:4px;height:28px;min-width:28px;padding:0 8px;border:0;border-radius:8px;' +
        'background:rgba(255,255,255,.12);color:#fff;font-size:12px;cursor:pointer;flex:none;line-height:1}' +
        '#drift-tb-hide:hover{background:rgba(255,255,255,.22)}' +
        '#drift-tb-show,#drift-title-show{position:fixed;z-index:2147483645;display:none;align-items:center;justify-content:center;' +
        'background:rgba(20,20,28,.94);color:#fff;border:1px solid rgba(255,255,255,.2);font:11px/1 system-ui,sans-serif;' +
        'cursor:pointer;padding:0 10px;box-shadow:0 4px 16px rgba(0,0,0,.4)}' +
        '#drift-tb-show{left:0;bottom:0;height:32px;border-radius:0 10px 0 0;border-bottom:0;border-left:0}' +
        '#drift-title-show{left:0;top:0;height:32px;border-radius:0 0 10px 0;border-top:0;border-left:0}' +
        '#drift-tb-show.reveal,#drift-title-show.reveal,#drift-tb-show:hover,#drift-title-show:hover{display:flex!important}';
      document.head.appendChild(style);
    }

    var task = document.getElementById('task');
    if (task && task.dataset.driftTb !== '1') {
      task.dataset.driftTb = '1';
      var hideTb = document.createElement('button');
      hideTb.id = 'drift-tb-hide';
      hideTb.type = 'button';
      hideTb.title = 'Hide taskbar';
      hideTb.setAttribute('aria-label', 'Hide taskbar');
      hideTb.textContent = '▾';
      task.insertBefore(hideTb, task.firstChild);

      var showTb = document.createElement('button');
      showTb.id = 'drift-tb-show';
      showTb.type = 'button';
      showTb.textContent = 'Show Task Bar';
      showTb.setAttribute('aria-label', 'Show Task Bar');
      document.body.appendChild(showTb);

      function hideTaskbar() {
        task.classList.add('drift-hidden');
        document.body.classList.add('drift-tb-off');
        showTb.style.display = 'flex';
        try { localStorage.setItem('wos:tb-hidden', '1'); } catch (e) {}
      }
      function showTaskbar() {
        task.classList.remove('drift-hidden');
        document.body.classList.remove('drift-tb-off');
        showTb.style.display = 'none';
        showTb.classList.remove('reveal');
        try { localStorage.setItem('wos:tb-hidden', '0'); } catch (e) {}
      }
      hideTb.onclick = function (e) { e.stopPropagation(); hideTaskbar(); };
      showTb.onclick = function (e) { e.stopPropagation(); showTaskbar(); };

      window.addEventListener('mousemove', function (e) {
        if (!task.classList.contains('drift-hidden')) return;
        var near = e.clientX < 56 && e.clientY > (window.innerHeight - 56);
        if (near) {
          showTb.classList.add('reveal');
          showTb.style.display = 'flex';
        } else {
          showTb.classList.remove('reveal');
        }
      });

      try {
        if (localStorage.getItem('wos:tb-hidden') === '1') hideTaskbar();
      } catch (e) {}
    }

    function attachTitleHide(win) {
      if (!win || !win.classList || !win.classList.contains('win')) return;
      if (win.dataset.driftTitleCtl === '1') return;
      var title = win.querySelector(':scope > .title');
      if (!title) return;
      win.dataset.driftTitleCtl = '1';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'drift-title-hide-btn';
      btn.title = 'Hide title bar';
      btn.setAttribute('aria-label', 'Hide title bar');
      btn.textContent = '▴';
      btn.style.cssText =
        'height:26px;min-width:26px;padding:0 7px;margin-right:6px;border:0;border-radius:8px;' +
        'background:rgba(255,255,255,.12);color:inherit;font-size:12px;cursor:pointer;flex:none;order:-1';
      btn.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      btn.onclick = function (e) {
        e.stopPropagation();
        win.classList.add('drift-title-off');
        ensureTitleShow();
      };
      title.insertBefore(btn, title.firstChild);
    }

    function scanWindows() {
      document.querySelectorAll('.win').forEach(attachTitleHide);
    }

    var showTitle = document.getElementById('drift-title-show');
    function ensureTitleShow() {
      if (!showTitle) {
        showTitle = document.createElement('button');
        showTitle.id = 'drift-title-show';
        showTitle.type = 'button';
        showTitle.textContent = 'Show Title Bar';
        showTitle.setAttribute('aria-label', 'Show Title Bar');
        document.body.appendChild(showTitle);
        showTitle.onclick = function (e) {
          e.stopPropagation();
          document.querySelectorAll('.win.drift-title-off').forEach(function (w) {
            w.classList.remove('drift-title-off');
          });
          showTitle.style.display = 'none';
          showTitle.classList.remove('reveal');
        };
        window.addEventListener('mousemove', function (e) {
          var anyHidden = document.querySelector('.win.drift-title-off');
          if (!anyHidden) {
            showTitle.style.display = 'none';
            showTitle.classList.remove('reveal');
            return;
          }
          var near = e.clientX < 56 && e.clientY < 56;
          if (near) {
            showTitle.classList.add('reveal');
            showTitle.style.display = 'flex';
          } else {
            showTitle.classList.remove('reveal');
          }
        });
      }
      showTitle.style.display = 'flex';
    }

    scanWindows();
    try {
      if (!window.__driftWinObs) {
        window.__driftWinObs = true;
        var desk = document.getElementById('desk') || document.body;
        var mo = new MutationObserver(function () { scanWindows(); });
        mo.observe(desk, { childList: true, subtree: true });
      }
    } catch (e) {
      setInterval(scanWindows, 1500);
    }
  }

  function boot() {
    wireApps();
    guardYouTube();
    try { showChromeOSWarning(); } catch (e) {}
    try { installChromeUI(); } catch (e) {}
    setTimeout(wireApps, 300);
    setTimeout(function () { try { installChromeUI(); } catch (e) {} }, 800);
    setTimeout(wireApps, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  console.log('[Drift] proxy fixes loaded', isChromeOS() ? '(Chromebook)' : '(desktop)');
})();
