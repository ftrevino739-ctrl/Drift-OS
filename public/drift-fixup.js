/* Drift fixup */
(function () {
  'use strict';
  window.DRIFT_BEST_MODEL = window.DRIFT_BEST_MODEL || 'mistralai/mistral-large-4-0';
  window.DRIFT_CODE_MODEL = window.DRIFT_CODE_MODEL || 'qwen/qwen3-coder-plus:free';

  var GIMKIT_INJECTORS = {
    lazy: {
      id: 'lazy',
      name: 'TheLazySquid (default)',
      url: 'https://raw.githubusercontent.com/TheLazySquid/GimkitCheat/main/build/bundle.user.js'
    },
    rylan: {
      id: 'rylan',
      name: 'Rylan Rude',
      url: 'https://github.com/ftrevino739-ctrl/Drift-OS/releases/download/gimkit/rylanrude.js'
    },
    colin: {
      id: 'colin',
      name: 'Colin',
      url: 'https://github.com/ftrevino739-ctrl/Drift-OS/releases/download/gimkit/colin.js'
    },
    scribd: { id: 'scribd', name: 'SCRIBD notes (doc only)', url: '' }
  };

  var EDU_APPS = { classroom: 1, canva: 1, gimkit: 1, wayground: 1, browser: 1, calc: 1, gmail: 1, games: 1 };

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  function svg(inner) {
    return '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }
  function switchHTML(id, checked) {
    return (
      '<button type="button" role="switch" id="' + id + '" aria-checked="' + (checked ? 'true' : 'false') +
      '" data-on="' + (checked ? '1' : '0') +
      '" style="position:relative;width:46px;height:28px;border-radius:999px;border:0;cursor:pointer;flex:none;padding:0;background:' +
      (checked ? '#34c759' : 'rgba(120,120,128,.32)') + ';transition:background .2s">' +
      '<span style="position:absolute;top:2px;left:' + (checked ? '20px' : '2px') +
      ';width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .2s"></span></button>'
    );
  }
  function wireSwitch(btn, onChange) {
    if (!btn) return;
    btn.onclick = function () {
      var on = btn.getAttribute('data-on') !== '1';
      btn.setAttribute('data-on', on ? '1' : '0');
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      btn.style.background = on ? '#34c759' : 'rgba(120,120,128,.32)';
      var knob = btn.querySelector('span');
      if (knob) knob.style.left = on ? '20px' : '2px';
      onChange(on);
    };
  }

  function applyBrandLogos() {
    var IC = window.IC;
    if (!IC) return;
    var rays = '';
    for (var i = 0; i < 12; i++) {
      var a = (i * Math.PI) / 6, r = i % 2 ? 11 : 15;
      rays += '<line x1="' + (24 + 4 * Math.cos(a)) + '" y1="' + (24 + 4 * Math.sin(a)) +
        '" x2="' + (24 + r * Math.cos(a)) + '" y2="' + (24 + r * Math.sin(a)) + '"/>';
    }
    IC.ai =
      '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="11" fill="#d97757"/><g stroke="#faf6f0" stroke-width="3.4" stroke-linecap="round">' +
      rays + '</g></svg>';
    IC.gem = svg(
      '<defs><linearGradient id="gemi" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1BA1E3"/><stop offset="35%" stop-color="#8E48CD"/><stop offset="70%" stop-color="#D62546"/><stop offset="100%" stop-color="#F9AB00"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="#0b0b0f"/><path d="M24 8c2.5 6.5 7.5 11.5 14 14-6.5 2.5-11.5 7.5-14 14-2.5-6.5-7.5-11.5-14-14 6.5-2.5 11.5-7.5 14-14z" fill="url(#gemi)"/>'
    );
    IC.discord = svg(
      '<rect width="48" height="48" rx="11" fill="#5865F2"/>' +
      '<path fill="#fff" d="M17.2 15.5c-1.3 0-2.4 1.1-2.4 2.5v11c0 1.4 1.1 2.5 2.4 2.5h1l.4 1.5c.2.6.8.8 1.3.5l2.5-1.5h5.2c1.3 0 2.4-1.1 2.4-2.5v-11c0-1.4-1.1-2.5-2.4-2.5H17.2zm2.2 3.9c.7 0 1.3.6 1.3 1.4s-.6 1.4-1.3 1.4-1.3-.6-1.3-1.4.6-1.4 1.3-1.4zm5.8 0c.7 0 1.3.6 1.3 1.4s-.6 1.4-1.3 1.4-1.3-.6-1.3-1.4.6-1.4 1.3-1.4z"/>'
    );
    IC.canva =
      '<div style="width:100%;height:100%;border-radius:11px;background:linear-gradient(135deg,#00d4aa 0%,#3b8bff 45%,#9b5cff 100%);display:grid;place-items:center"><span style="font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:15px;color:#fff">Canva</span></div>';
    IC.classroom = svg(
      '<rect width="48" height="48" rx="6" fill="#FABB05"/><rect x="6" y="6" width="36" height="36" rx="3" fill="#0F9D58"/><circle cx="24" cy="20" r="5" fill="#fff"/><circle cx="14" cy="22" r="3.5" fill="#c8e6c9"/><circle cx="34" cy="22" r="3.5" fill="#c8e6c9"/><path d="M12 34c0-4 5-6 12-6s12 2 12 6" fill="#fff"/>'
    );
    IC.roblox = svg(
      '<rect width="48" height="48" rx="8" fill="#0089EF"/><g transform="translate(24 24) rotate(-18)"><rect x="-12" y="-12" width="24" height="24" fill="#fff"/><rect x="-5" y="-5" width="10" height="10" fill="#0089EF"/></g>'
    );
    IC.gimkit = svg(
      '<rect width="48" height="48" rx="11" fill="#6D28D9"/><text x="24" y="34" text-anchor="middle" font-size="32" font-weight="800" fill="#fff" font-family="Arial">G</text>'
    );
    IC.games = svg(
      '<rect width="48" height="48" rx="11" fill="#111827"/><rect x="8" y="14" width="14" height="10" rx="2" fill="#34d399"/><rect x="26" y="14" width="14" height="10" rx="2" fill="#60a5fa"/><rect x="8" y="28" width="14" height="10" rx="2" fill="#f472b6"/><rect x="26" y="28" width="14" height="10" rx="2" fill="#fbbf24"/>'
    );
  }

  function styleSettingsBtn() {
    var btn = document.getElementById('drift-settings-btn');
    if (!btn) return;
    btn.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="48" height="48" rx="12" fill="#9B95B0"/>' +
      '<path fill="#EDEAF3" d="M24 13.5c-1.2 0-2.3.3-3.3.8l-1-1.7-2.2 1.3 1 1.7c-1.1.8-2 1.9-2.5 3.1l-1.9-.5-.7 2.4 1.9.5c-.1 1.2 0 2.4.3 3.5l-1.8.9 1 2.3 1.8-.9c.7 1.1 1.6 2 2.7 2.6l-.7 1.9 2.3.9.7-1.9c1.1.2 2.2.2 3.3 0l.7 1.9 2.3-.9-.7-1.9c1.1-.6 2-1.5 2.7-2.6l1.8.9 1-2.3-1.8-.9c.3-1.1.4-2.3.3-3.5l1.9-.5-.7-2.4-1.9.5c-.5-1.2-1.4-2.3-2.5-3.1l1-1.7-2.2-1.3-1 1.7c-1-.5-2.1-.8-3.3-.8zm0 7c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/>' +
      '</svg>';
    btn.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;min-width:40px;padding:6px;margin-left:6px;border:0;border-radius:10px;background:transparent;cursor:pointer';
  }

  function noahGamesApp(root) {
    root.innerHTML = '';
    root.style.cssText = 'display:flex;flex-direction:column;height:100%;min-height:0;background:#0a0a0f;color:#eee';
    var bar = document.createElement('div');
    bar.style.cssText = 'padding:12px 16px;display:flex;gap:10px;align-items:center;border-bottom:1px solid #1f1f28;flex:none';
    bar.innerHTML =
      '<b style="font-size:15px">Games</b>' +
      '<input id="ng-q" placeholder="Search games…" style="flex:1;padding:10px 12px;border-radius:10px;border:1px solid #2a2a35;background:#14141c;color:#eee">' +
      '<span id="ng-count" style="font-size:12px;opacity:.6;white-space:nowrap"></span>';
    var grid = document.createElement('div');
    grid.id = 'ng-grid';
    grid.style.cssText =
      'flex:1;overflow:auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));' +
      'grid-auto-rows:minmax(168px,auto);gap:14px;align-content:start';
    var play = document.createElement('div');
    play.id = 'ng-play';
    play.style.cssText = 'display:none;flex:1;flex-direction:column;min-height:0';
    play.innerHTML =
      '<div style="padding:8px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #1f1f28;flex:none">' +
      '<button type="button" id="ng-back" style="padding:6px 12px;border-radius:8px;border:1px solid #333;background:#1a1a24;color:#fff;cursor:pointer">← Back</button>' +
      '<b id="ng-title" style="font-size:13px"></b>' +
      '<button type="button" id="ng-out" style="margin-left:auto;padding:6px 10px;border-radius:8px;border:1px solid #333;background:#1a1a24;color:#fff;cursor:pointer;font-size:11px">Open outside proxy (Unity)</button></div>' +
      '<div id="ng-frame" style="flex:1;min-height:0;position:relative"></div>';
    root.appendChild(bar);
    root.appendChild(grid);
    root.appendChild(play);
    var frameBox = play.querySelector('#ng-frame');
    var all = [];
    var currentUrl = '';

    function card(g) {
      var el = document.createElement('button');
      el.type = 'button';
      el.style.cssText =
        'all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;width:100%;min-height:168px;' +
        'background:#12121a;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.4);color:#f3f3f5';
      var thumb = document.createElement('div');
      thumb.style.cssText = 'width:100%;height:112px;min-height:112px;background:#1c1c28;overflow:hidden;flex:none';
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = g.t || 'game';
      img.style.cssText = 'width:100%;height:112px;object-fit:cover;display:block;border:0';
      if (!g.i || g.i === 'null') { img.style.display = 'none'; }
      else img.src = '/api/noah-asset?u=' + encodeURIComponent('https://noahstutoring.academy/' + String(g.i).replace(/^\//, ''));
      img.onerror = function () {
        if (img.dataset.fb) {
          img.style.display = 'none';
          thumb.style.background = 'linear-gradient(135deg,#2a2a40,#111)';
          return;
        }
        img.dataset.fb = '1';
        img.src = 'https://noahstutoring.academy/' + g.i;
      };
      thumb.appendChild(img);
      var cap = document.createElement('div');
      cap.style.cssText =
        'padding:10px 12px;font:600 13px/1.35 system-ui,sans-serif;color:#f3f3f5;flex:1;' +
        'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden';
      cap.textContent = g.t || 'Game';
      el.appendChild(thumb);
      el.appendChild(cap);
      el.onclick = function () { openGame(g); };
      return el;
    }

    function render(list) {
      grid.innerHTML = '';
      var frag = document.createDocumentFragment();
      list.forEach(function (g) { frag.appendChild(card(g)); });
      grid.appendChild(frag);
      bar.querySelector('#ng-count').textContent = list.length + ' games';
    }

    async function openGame(g) {
      var path = g && g.u != null ? String(g.u) : '';
      if (!path || path === 'null' || path === 'undefined') { alert('This game has no valid URL.'); return; }
      var url = /^https?:/i.test(path) ? path : 'https://noahstutoring.academy/' + path.replace(/^\//, '');
      currentUrl = url;
      grid.style.display = 'none';
      bar.style.display = 'none';
      play.style.display = 'flex';
      play.querySelector('#ng-title').textContent = g.t;
      frameBox.innerHTML = '<div class="ym" style="padding:16px">Loading…</div>';
      try {
        if (typeof window.openProxied === 'function') await window.openProxied(url, frameBox);
        else if (typeof proxySite === 'function') proxySite(frameBox, url, g.t);
        else
          frameBox.innerHTML =
            '<iframe src="' + url.replace(/"/g, '') + '" style="width:100%;height:100%;border:0;background:#000" allowfullscreen></iframe>';
      } catch (e) {
        frameBox.innerHTML = '<div class="ym" style="padding:16px">' + String(e.message || e) +
          '<br><button type="button" id="ng-retry" style="margin-top:8px;padding:8px 12px;border:0;border-radius:8px;background:#5865F2;color:#fff;cursor:pointer">Open outside proxy</button></div>';
        var b = frameBox.querySelector('#ng-retry');
        if (b) b.onclick = function () { window.open(url, '_blank', 'noopener'); };
      }
    }

    play.querySelector('#ng-out').onclick = function () { if (currentUrl) window.open(currentUrl, '_blank', 'noopener'); };
    play.querySelector('#ng-back').onclick = function () {
      play.style.display = 'none';
      frameBox.innerHTML = '';
      grid.style.display = 'grid';
      bar.style.display = 'flex';
    };
    bar.querySelector('#ng-q').oninput = function () {
      var q = (bar.querySelector('#ng-q').value || '').toLowerCase().trim();
      render(!q ? all : all.filter(function (g) { return (g.t + ' ' + (g.d || '')).toLowerCase().indexOf(q) >= 0; }));
    };

    grid.innerHTML = '<div class="ym" style="grid-column:1/-1;padding:24px">Loading catalog…</div>';
    try {
      var cached = sessionStorage.getItem('wos:noah-games');
      if (cached) { all = JSON.parse(cached); if (all && all.length) render(all); }
    } catch (e) {}
    fetch('/api/noah-games', { cache: 'force-cache' })
      .then(function (r) { if (!r.ok) throw new Error('catalog ' + r.status); return r.json(); })
      .then(function (list) {
        all = (Array.isArray(list) ? list : []).filter(function (g) { return g && g.u && String(g.u) !== 'null' && String(g.u) !== 'undefined'; });
        try { sessionStorage.setItem('wos:noah-games', JSON.stringify(all)); } catch (e) {}
        render(all);
      })
      .catch(function (e) {
        grid.innerHTML = '<div class="ym" style="grid-column:1/-1;padding:24px">' + String(e.message || e) + '</div>';
      });
  }

  function wireGames() {
    try {
      if (window.APPS) window.APPS.games = 'Games';
      window.noahGamesApp = noahGamesApp;
      if (window.XAPPS) window.XAPPS.games = { n: 'Games', f: noahGamesApp };
      applyBrandLogos();
    } catch (e) {}
  }

  function injectXkiroModels() {
    try {
      if (typeof MODELS === 'undefined' || !Array.isArray(MODELS)) return;
      if (MODELS.some(function (m) { return m && (m[1] === 'Drift 2.0' || m[0] === 'mistralai/mistral-large-4-0'); })) return;
      MODELS.unshift(['mistralai/mistral-large-4-0', 'Drift 2.0', 'Recommended · xKiro free · best', 'default', 'Mistral Large 4 via xKiro.', { code: 1, vision: 1, files: 0, think: 1, fast: 0 }]);
      MODELS.splice(1, 0, ['qwen/qwen3-coder-plus:free', 'Drift Code', 'Recommended · coding · VS Code', 'default', 'Best free coding model for VS Code & JS Injector.', { code: 1, vision: 1, files: 0, think: 1, fast: 1 }]);
      MODELS.splice(2, 0, ['mistralai/codestral-2508', 'Codestral', 'xKiro free · code', 'default', 'Mistral Codestral free on xKiro.', { code: 1, vision: 0, files: 0, think: 0, fast: 1 }]);
      MODELS.splice(3, 0, ['cohere/command-a-plus', 'Command A+', 'xKiro free', 'default', 'Cohere Command A+ free.', { code: 1, vision: 1, files: 0, think: 1, fast: 0 }]);
      MODELS.splice(4, 0, ['mistralai/mistral-medium-3.5', 'Mistral Medium 3.5', 'xKiro free', 'default', 'Mistral Medium 3.5 free.', { code: 1, vision: 1, files: 0, think: 1, fast: 1 }]);
      MODELS.splice(5, 0, ['qwen/qwen3.8-max:free', 'Qwen3.8 Max', 'xKiro free', 'default', 'Qwen3.8 Max free on xKiro.', { code: 1, vision: 1, files: 0, think: 1, fast: 0 }]);
    } catch (e) {}
  }

  function installLiquidGlass() {
    var on = false;
    try { on = localStorage.getItem('wos:liquid-glass') === '1'; } catch (e) {}
    var st = document.getElementById('drift-liquid-style');
    if (!st) { st = document.createElement('style'); st.id = 'drift-liquid-style'; document.head.appendChild(st); }
    if (on) {
      document.body.classList.add('drift-liquid');
      st.textContent =
        'body.drift-liquid #task,body.drift-liquid .win,body.drift-liquid .win>.title,body.drift-liquid #menu,body.drift-liquid .sheet,body.drift-liquid .card,body.drift-liquid #drift-settings-panel,body.drift-liquid .ai-msg,body.drift-liquid #ain,body.drift-liquid .omni,body.drift-liquid #drift-tb-show,body.drift-liquid #drift-title-show,body.drift-liquid #drift-tb-hide,body.drift-liquid .drift-title-hide-btn{' +
        'background:rgba(28,28,36,.42)!important;backdrop-filter:saturate(180%) blur(28px)!important;-webkit-backdrop-filter:saturate(180%) blur(28px)!important;border-color:rgba(255,255,255,.18)!important}' +
        'body.drift-liquid #task{box-shadow:0 -8px 32px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.35)!important}' +
        'body.drift-liquid .win{box-shadow:0 16px 48px rgba(0,0,0,.28)!important}' +
        'body.drift-liquid #task button,body.drift-liquid .win .wb,body.drift-liquid .title button{background:rgba(255,255,255,.16)!important;border-radius:999px!important}';
    } else {
      document.body.classList.remove('drift-liquid');
      st.textContent = '';
    }
  }

  function styleCavemanAsSwitch() {
    if (document.getElementById('drift-switch-style')) return;
    var st = document.createElement('style');
    st.id = 'drift-switch-style';
    st.textContent =
      '#drift-cav{appearance:none;-webkit-appearance:none;width:46px;height:28px;border-radius:999px;background:rgba(120,120,128,.32);position:relative;cursor:pointer;border:0}' +
      '#drift-cav:checked{background:#34c759}' +
      '#drift-cav::after{content:"";position:absolute;top:2px;left:2px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .2s}' +
      '#drift-cav:checked::after{left:20px}' +
      'body.drift-edu [data-app="ai"],body.drift-edu [data-app="code"],body.drift-edu [data-app="injector"],' +
      'body.drift-edu [data-app="discord"],body.drift-edu [data-app="yt"],body.drift-edu [data-app="ig"],' +
      'body.drift-edu [data-app="tt"],body.drift-edu [data-app="movies"],body.drift-edu [data-app="mus"],' +
      'body.drift-edu [data-app="cam"],body.drift-edu [data-app="github"],body.drift-edu [data-app="whatsapp"],' +
      'body.drift-edu [data-app="chat"],body.drift-edu [data-app="roblox"]{display:none!important}';
    document.head.appendChild(st);
  }

  function setEducationMode(on) {
    try { localStorage.setItem('wos:edu-mode', on ? '1' : '0'); } catch (e) {}
    document.body.classList.toggle('drift-edu', !!on);
    try {
      if (window.S && window.S.d && Array.isArray(window.S.d.desk)) {
        if (on) {
          if (!window.__driftDeskBackup) window.__driftDeskBackup = window.S.d.desk.slice();
          window.S.d.desk = window.S.d.desk.filter(function (id) { return EDU_APPS[id]; });
        } else if (window.__driftDeskBackup) {
          window.S.d.desk = window.__driftDeskBackup.slice();
        }
        if (typeof tiles === 'function') tiles();
        if (typeof rend === 'function') rend();
      }
    } catch (e) {}
  }

  function matchCombo(e, combo) {
    if (!combo) return false;
    var parts = String(combo).split('+').map(function (s) { return s.trim().toLowerCase(); });
    var nc = parts.indexOf('ctrl') >= 0, na = parts.indexOf('alt') >= 0, ns = parts.indexOf('shift') >= 0, nm = parts.indexOf('meta') >= 0;
    if (!!e.ctrlKey !== nc || !!e.altKey !== na || !!e.shiftKey !== ns || !!e.metaKey !== nm) return false;
    var key = parts.filter(function (p) { return ['ctrl','alt','shift','meta'].indexOf(p) < 0; })[0] || '';
    var k = e.key === ' ' ? 'space' : String(e.key).toLowerCase();
    return k === key || String(e.code).toLowerCase() === key;
  }
  function wireKeyCapture(input, storageKey, fallback) {
    if (!input || input.dataset.cap === '1') return;
    input.dataset.cap = '1';
    input.readOnly = true;
    input.placeholder = 'Click, then press a key';
    input.style.cursor = 'pointer';
    input.addEventListener('focus', function () { input.value = 'Press a key…'; input.style.borderColor = '#34c759'; });
    input.addEventListener('keydown', function (e) {
      e.preventDefault(); e.stopPropagation();
      var parts = [];
      if (e.ctrlKey) parts.push('Ctrl');
      if (e.altKey) parts.push('Alt');
      if (e.shiftKey) parts.push('Shift');
      if (e.metaKey) parts.push('Meta');
      var k = e.key === ' ' ? 'Space' : e.key;
      if (!/^(Control|Alt|Shift|Meta)$/i.test(k)) parts.push(k.length === 1 ? k.toUpperCase() : k);
      input.value = parts.join('+') || e.code || fallback || '';
      input.style.borderColor = '#333';
      try { localStorage.setItem(storageKey, input.value); } catch (err) {}
      input.blur();
    });
  }
  function bindCustomKeybinds() {
    if (window.__driftKbBound) return;
    window.__driftKbBound = true;
    document.addEventListener('keydown', function (e) {
      if (e.target && e.target.id && String(e.target.id).indexOf('kb-') === 0) return;
      var hideKey = 'F9', classKey = 'F10', disc = '', aleks = '', docs = '';
      try {
        hideKey = localStorage.getItem('wos:kb-hide') || 'F9';
        classKey = localStorage.getItem('wos:kb-class') || 'F10';
        disc = localStorage.getItem('wos:kb-disc') || '';
        aleks = localStorage.getItem('wos:kb-aleks') || '';
        docs = localStorage.getItem('wos:kb-docs') || '';
      } catch (err) {}
      if (matchCombo(e, hideKey) || e.key.toUpperCase() === String(hideKey).toUpperCase()) {
        e.preventDefault();
        setEducationMode(!document.body.classList.contains('drift-edu'));
      } else if (matchCombo(e, classKey) || e.key.toUpperCase() === String(classKey).toUpperCase()) {
        e.preventDefault();
        window.location.href = 'https://classroom.google.com/';
      } else if (disc && matchCombo(e, disc)) {
        e.preventDefault();
        window.location.href = 'https://www.discoveryeducation.com/';
      } else if (aleks && matchCombo(e, aleks)) {
        e.preventDefault();
        window.location.href = 'https://www.aleks.com/';
      } else if (docs && matchCombo(e, docs)) {
        e.preventDefault();
        window.location.href = 'https://docs.google.com/';
      }
    }, true);
  }

  function setChromeOSAdapt(on) {
    try { localStorage.setItem('wos:cros-adapt', on ? '1' : '0'); } catch (e) {}
    document.body.classList.toggle('drift-cros', !!on);
    var st = document.getElementById('drift-cros-style');
    if (!st) { st = document.createElement('style'); st.id = 'drift-cros-style'; document.head.appendChild(st); }
    st.textContent = on
      ? 'body.drift-cros #task{height:44px!important;min-height:44px!important;padding:2px 6px!important}body.drift-cros .win>.title{height:32px!important;min-height:32px!important;font-size:12px!important}body.drift-cros .win:not(.max){max-width:96vw!important;max-height:88vh!important}'
      : '';
  }
  function setNoDev(on) {
    try { localStorage.setItem('wos:no-dev', on ? '1' : '0'); } catch (e) {}
    document.body.classList.toggle('drift-nodev', !!on);
    if (!document.getElementById('drift-nodev-style')) {
      var s = document.createElement('style');
      s.id = 'drift-nodev-style';
      s.textContent = 'body.drift-nodev [data-app="code"],body.drift-nodev [data-app="injector"],body.drift-nodev [data-app="github"]{display:none!important}';
      document.head.appendChild(s);
    }
  }
  function deleteCreatedApps() {
    try {
      var apps = window.APPS || {}, x = window.XAPPS || {};
      Object.keys(apps).forEach(function (id) {
        if (/^us_/.test(id) || id.indexOf('custom') === 0) { delete apps[id]; delete x[id]; }
      });
      if (window.S && window.S.d) {
        if (Array.isArray(window.S.d.desk)) window.S.d.desk = window.S.d.desk.filter(function (id) { return !/^us_/.test(id); });
        if (Array.isArray(window.S.d.pins)) window.S.d.pins = window.S.d.pins.filter(function (id) { return !/^us_/.test(id); });
      }
      if (typeof tiles === 'function') tiles();
      if (typeof rend === 'function') rend();
    } catch (e) {}
  }
  function installCustomAppContextMenu() {
    if (window.__driftCtx) return;
    window.__driftCtx = true;
    document.addEventListener('contextmenu', function (e) {
      var el = e.target.closest && e.target.closest('[data-app]');
      if (!el) return;
      var id = el.getAttribute('data-app');
      if (!id || !/^us_/.test(id)) return;
      e.preventDefault();
      if (!confirm('Do you want to delete this app?')) return;
      try {
        if (window.APPS) delete window.APPS[id];
        if (window.XAPPS) delete window.XAPPS[id];
        if (window.S && window.S.d) {
          if (Array.isArray(window.S.d.desk)) window.S.d.desk = window.S.d.desk.filter(function (x) { return x !== id; });
          if (Array.isArray(window.S.d.pins)) window.S.d.pins = window.S.d.pins.filter(function (x) { return x !== id; });
        }
        if (typeof tiles === 'function') tiles();
        if (typeof rend === 'function') rend();
      } catch (err) {}
    });
  }
  function loginShell(label, url, storageKey) {
    return function (root) {
      var signed = false;
      try { signed = localStorage.getItem(storageKey) === '1'; } catch (e) {}
      root.innerHTML =
        '<div style="display:flex;flex-direction:column;height:100%;min-height:0">' +
        '<div style="padding:8px 10px;border-bottom:1px solid var(--line);display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:var(--bar,rgba(255,255,255,.04))">' +
        '<span style="font-size:12px;opacity:.9">' + label + ' login</span>' +
        '<button type="button" data-popup style="padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:var(--omni,transparent);color:inherit;cursor:pointer;font-size:12px">Sign in (popup)</button>' +
        '<button type="button" data-retry style="padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:transparent;color:inherit;cursor:pointer;font-size:12px">Load in window</button>' +
        '<label style="font-size:11px;opacity:.75;margin-left:auto;display:flex;gap:6px;align-items:center"><input type="checkbox" data-signed' + (signed ? ' checked' : '') + '/> I signed in</label>' +
        '<span style="font-size:11px;opacity:.6;width:100%">If the robot check fails inside Drift, use Sign in (popup). This bar stays until you mark signed in.</span></div>' +
        '<div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
      var box = root.querySelector('.sjt');
      root.querySelector('[data-popup]').onclick = function () {
        var login = /Gmail|Classroom|Canva/i.test(label)
          ? 'https://accounts.google.com/ServiceLogin?continue=' + encodeURIComponent(url)
          : url;
        window.open(login, '_blank', 'noopener,noreferrer,width=980,height=760');
      };
      root.querySelector('[data-signed]').onchange = function () {
        try { localStorage.setItem(storageKey, this.checked ? '1' : '0'); } catch (e) {}
      };
      root.querySelector('[data-retry]').onclick = function () {
        if (typeof window.proxySite === 'function') window.proxySite(box, url, label);
        else if (typeof window.openProxied === 'function') window.openProxied(url, box);
      };
      root.querySelector('[data-retry]').click();
    };
  }
  function wireLoginApps() {
    try {
      if (!window.XAPPS) return;
      window.XAPPS.gmail = { n: 'Gmail', f: loginShell('Gmail', 'https://mail.google.com', 'wos:in:gmail') };
      window.XAPPS.classroom = { n: 'Classroom', f: loginShell('Classroom', 'https://classroom.google.com', 'wos:in:classroom') };
      window.XAPPS.canva = { n: 'Canva', f: loginShell('Canva', 'https://www.canva.com', 'wos:in:canva') };
      if (window.XAPPS.roblox) window.XAPPS.roblox = { n: 'Roblox', f: loginShell('Roblox', 'https://www.roblox.com/login', 'wos:in:roblox') };
      if (window.XAPPS.discord) window.XAPPS.discord = { n: 'Discord', f: loginShell('Discord', 'https://discord.com/login', 'wos:in:discord') };
    } catch (e) {}
  }
  function openSettingsPanel() {
    var old = document.getElementById('drift-settings-panel');
    if (old) { old.remove(); return; }
    var panel = document.createElement('div');
    panel.id = 'drift-settings-panel';
    panel.style.cssText =
      'position:fixed;right:16px;bottom:70px;z-index:2147483001;width:min(380px,94vw);max-height:min(75vh,560px);overflow:auto;' +
      'background:#1c1c24;color:#eee;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 16px;' +
      'box-shadow:0 12px 40px rgba(0,0,0,.45);font:13px/1.45 system-ui,sans-serif';
    var liquidOn = false, eduOn = false, gk = 'lazy', kbHide = 'F9', kbClass = 'F10';
    try {
      liquidOn = localStorage.getItem('wos:liquid-glass') === '1';
      eduOn = localStorage.getItem('wos:edu-mode') === '1';
      gk = localStorage.getItem('wos:gimkit-injector') || 'lazy';
      kbHide = localStorage.getItem('wos:kb-hide') || 'F9';
      kbClass = localStorage.getItem('wos:kb-class') || 'F10';
    } catch (e) {}
    var opts = '';
    Object.keys(GIMKIT_INJECTORS).forEach(function (k) {
      var it = GIMKIT_INJECTORS[k];
      opts +=
        '<label style="display:flex;gap:8px;align-items:flex-start;margin:6px 0;cursor:pointer">' +
        '<input type="radio" name="gk-inj" value="' + it.id + '"' + (gk === it.id ? ' checked' : '') +
        ' style="margin-top:3px"/><span><b>' + it.name + '</b></span></label>';
    });
    panel.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
      '<b>Settings</b><button type="button" data-x style="border:0;background:transparent;color:#aaa;font-size:18px;cursor:pointer">×</button></div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Enable Liquid Glass (experimental)</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Make Drift OS look like an iOS device with the new liquid glass UI applied on the task bar.</div></div>' +
      switchHTML('drift-liquid-sw', liquidOn) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Adapt Drift OS for ChromeOS</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Adapts all apps and minimizes task bar and apps so you have space and settings so Drift OS on Chromebook doesnt Lag.</div></div>' +
      switchHTML('drift-cros-sw', localStorage.getItem('wos:cros-adapt') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>NO dev apps</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">This deletes VS Code, JS Injector and GitHub.</div></div>' +
      switchHTML('drift-nodev-sw', localStorage.getItem('wos:no-dev') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Delete all created apps</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Removes every app you added with Create your app.</div></div>' +
      switchHTML('drift-delapps-sw', false) + '</div>' +
      '<div style="border-top:1px solid rgba(255,255,255,.08);padding-top:12px;margin-bottom:12px">' +
      '<b style="display:block;margin-bottom:8px">Gimkit injection default</b>' + opts + '</div>' +
      '<div style="border-top:1px solid rgba(255,255,255,.08);padding-top:12px">' +
      '<b style="display:block;margin-bottom:8px">Custom Keybinds</b>' +
      '<div style="opacity:.8;font-size:12px;margin-bottom:10px">Hide all non-educational apps (includes AI and VS Code). Instant full-page Classroom leaves Drift (changes to classroom.google.com).</div>' +
      '<label style="display:block;margin:8px 0">Hide non-edu apps key' +
      '<input id="kb-hide" value="' + kbHide.replace(/"/g, '') + '" style="display:block;width:100%;margin-top:4px;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee;box-sizing:border-box"/></label>' +
      '<label style="display:block;margin:8px 0">Open Classroom (full site) key' +
      '<input id="kb-class" value="' + kbClass.replace(/"/g, '') + '" style="display:block;width:100%;margin-top:4px;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee;box-sizing:border-box"/></label>' +
      '<label style="display:block;margin:8px 0">Discovery Education' +
      '<input id="kb-disc" value="' + (localStorage.getItem('wos:kb-disc') || '').replace(/"/g, '') + '" style="display:block;width:100%;margin-top:4px;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee;box-sizing:border-box"/></label>' +
      '<label style="display:block;margin:8px 0">ALEKS' +
      '<input id="kb-aleks" value="' + (localStorage.getItem('wos:kb-aleks') || '').replace(/"/g, '') + '" style="display:block;width:100%;margin-top:4px;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee;box-sizing:border-box"/></label>' +
      '<label style="display:block;margin:8px 0">Google Docs' +
      '<input id="kb-docs" value="' + (localStorage.getItem('wos:kb-docs') || '').replace(/"/g, '') + '" style="display:block;width:100%;margin-top:4px;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee;box-sizing:border-box"/></label>' +
      '<div style="opacity:.75;font-size:12px;margin:6px 0 10px">Click a field, then press any key combo. It is saved when you release.</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:10px">' +
      '<div style="flex:1"><b>Education mode now</b><div style="opacity:.7;font-size:11px">Hides non-edu icons immediately</div></div>' +
      switchHTML('drift-edu-sw', eduOn) + '</div>' +
      '<button type="button" id="kb-class-go" style="margin-top:12px;width:100%;padding:10px;border:0;border-radius:10px;background:#1a73e8;color:#fff;font-weight:600;cursor:pointer">Open Classroom full page now</button></div>';
    panel.querySelector('[data-x]').onclick = function () { panel.remove(); };
    wireSwitch(panel.querySelector('#drift-liquid-sw'), function (on) {
      try { localStorage.setItem('wos:liquid-glass', on ? '1' : '0'); } catch (e) {}
      installLiquidGlass();
    });
    wireSwitch(panel.querySelector('#drift-edu-sw'), function (on) { setEducationMode(on); });
    wireSwitch(panel.querySelector('#drift-cros-sw'), function (on) { setChromeOSAdapt(on); });
    wireSwitch(panel.querySelector('#drift-nodev-sw'), function (on) { setNoDev(on); });
    wireSwitch(panel.querySelector('#drift-delapps-sw'), function (on) {
      if (on && confirm('Delete all created apps?')) deleteCreatedApps();
      var b = panel.querySelector('#drift-delapps-sw');
      if (b) { b.setAttribute('data-on', '0'); b.setAttribute('aria-checked', 'false'); b.style.background = 'rgba(120,120,128,.32)'; var k = b.querySelector('span'); if (k) k.style.left = '2px'; }
    });
    wireKeyCapture(panel.querySelector('#kb-hide'), 'wos:kb-hide', 'F9');
    wireKeyCapture(panel.querySelector('#kb-class'), 'wos:kb-class', 'F10');
    wireKeyCapture(panel.querySelector('#kb-disc'), 'wos:kb-disc', '');
    wireKeyCapture(panel.querySelector('#kb-aleks'), 'wos:kb-aleks', '');
    wireKeyCapture(panel.querySelector('#kb-docs'), 'wos:kb-docs', '');
    panel.querySelector('#kb-class-go').onclick = function () {
      window.location.href = 'https://classroom.google.com/';
    };
    panel.querySelectorAll('input[name="gk-inj"]').forEach(function (r) {
      r.onchange = function () {
        if (!r.checked) return;
        try {
          localStorage.setItem('wos:gimkit-injector', r.value);
          var src = (GIMKIT_INJECTORS[r.value] && GIMKIT_INJECTORS[r.value].url) || GIMKIT_INJECTORS.lazy.url;
          if (src) localStorage.setItem('wos:gimkit-cheat-url', src);
        } catch (e) {}
      };
    });
    document.body.appendChild(panel);
  }

  function installSettingsButton() {
    if (document.getElementById('drift-settings-btn')) { styleSettingsBtn(); return; }
    var create = document.getElementById('create-app');
    if (!create || !create.parentNode) return;
    var btn = document.createElement('button');
    btn.id = 'drift-settings-btn';
    btn.type = 'button';
    btn.title = 'Settings';
    create.parentNode.insertBefore(btn, create.nextSibling);
    styleSettingsBtn();
    btn.onclick = function (e) { e.stopPropagation(); openSettingsPanel(); };
  }

  function boot() {
    applyBrandLogos();
    injectXkiroModels();
    wireGames();
    wireLoginApps();
    installLiquidGlass();
    styleCavemanAsSwitch();
    bindCustomKeybinds();
    installCustomAppContextMenu();
    try {
      if (localStorage.getItem('wos:edu-mode') === '1') setEducationMode(true);
      if (localStorage.getItem('wos:cros-adapt') === '1') setChromeOSAdapt(true);
      if (localStorage.getItem('wos:no-dev') === '1') setNoDev(true);
    } catch (e) {}
    try { installSettingsButton(); } catch (e) {}
    if (typeof installChromeUI === 'function') try { installChromeUI(); } catch (e) {}
    setTimeout(function () {
      applyBrandLogos();
      injectXkiroModels();
      wireGames();
      wireLoginApps();
      installSettingsButton();
      installLiquidGlass();
      styleCavemanAsSwitch();
    }, 500);
    setTimeout(function () { wireGames(); wireLoginApps(); installSettingsButton(); injectXkiroModels(); }, 1500);
  }

  onReady(boot);
  console.log('[Drift] fixup loaded');
})();
