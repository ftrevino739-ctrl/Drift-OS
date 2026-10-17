/* Drift fixup */
(function () {
  'use strict';
  window.DRIFT_BEST_MODEL = window.DRIFT_BEST_MODEL || 'mistralai/mistral-large-4-0';
  window.DRIFT_CODE_MODEL = window.DRIFT_CODE_MODEL || 'qwen/qwen3-coder-plus:free';
  window.DRIFT_BEST_NAME = 'Drift 2.0';

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  function svg(inner) {
    return '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }

  function applyBrandLogos() {
    var IC = window.IC;
    if (!IC) return;
    var rays = '';
    for (var i = 0; i < 12; i++) {
      var a = (i * Math.PI) / 6,
        r = i % 2 ? 11 : 15;
      rays +=
        '<line x1="' +
        (24 + 4 * Math.cos(a)) +
        '" y1="' +
        (24 + 4 * Math.sin(a)) +
        '" x2="' +
        (24 + r * Math.cos(a)) +
        '" y2="' +
        (24 + r * Math.sin(a)) +
        '"/>';
    }
    IC.ai =
      '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="11" fill="#d97757"/><g stroke="#faf6f0" stroke-width="3.4" stroke-linecap="round">' +
      rays +
      '</g></svg>';
    IC.gem = svg(
      '<defs><linearGradient id="gemi" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1BA1E3"/><stop offset="35%" stop-color="#8E48CD"/><stop offset="70%" stop-color="#D62546"/><stop offset="100%" stop-color="#F9AB00"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="#0b0b0f"/><path d="M24 8c2.5 6.5 7.5 11.5 14 14-6.5 2.5-11.5 7.5-14 14-2.5-6.5-7.5-11.5-14-14 6.5-2.5 11.5-7.5 14-14z" fill="url(#gemi)"/>'
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
    IC.injector = svg(
      '<rect width="48" height="48" rx="11" fill="#0F172A"/><path d="M14 16h20v3H14zm0 7h14v3H14zm0 7h9v3h-9z" fill="#38BDF8"/><path d="M30 30l7 4-7 4z" fill="#FBBF24"/>'
    );
  }

  function fixInjectorDupes() {
    try {
      var apps = window.APPS,
        x = window.XAPPS;
      if (!apps) return;
      Object.keys(apps).forEach(function (id) {
        if (id === 'injector') return;
        if (/^us_/.test(id) && String(apps[id]).toLowerCase().indexOf('injector') >= 0) {
          delete apps[id];
          if (x) delete x[id];
        }
        if (apps[id] == null || apps[id] === 'undefined') {
          delete apps[id];
          if (x) delete x[id];
        }
      });
      if (typeof tiles === 'function') tiles();
      if (typeof rend === 'function') rend();
    } catch (e) {}
  }

  function noahGamesApp(root) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0;background:#0b0b12;color:#eee">' +
      '<div style="padding:10px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #222">' +
      '<b>Games</b><input id="ng-q" placeholder="Search games…" style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid #333;background:#15151f;color:#eee">' +
      '<span id="ng-count" style="font-size:11px;opacity:.6"></span></div>' +
      '<div id="ng-grid" style="flex:1;overflow:auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px"></div>' +
      '<div id="ng-play" style="display:none;flex:1;flex-direction:column;min-height:0">' +
      '<div style="padding:8px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #222">' +
      '<button type="button" id="ng-back" style="padding:6px 12px;border-radius:8px;border:1px solid #333;background:#1a1a24;color:#fff;cursor:pointer">← Back</button>' +
      '<b id="ng-title" style="font-size:13px"></b></div><div id="ng-frame" style="flex:1;min-height:0;position:relative"></div></div></div>';
    var grid = root.querySelector('#ng-grid'),
      play = root.querySelector('#ng-play'),
      frameBox = root.querySelector('#ng-frame'),
      all = [];
    function card(g) {
      var el = document.createElement('button');
      el.type = 'button';
      el.style.cssText =
        'border:0;padding:0;background:#14141c;border-radius:16px;overflow:hidden;cursor:pointer;text-align:left;color:#f3f3f5;display:flex;flex-direction:column;box-shadow:0 4px 16px rgba(0,0,0,.35)';
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = g.t || '';
      img.src = '/api/noah-asset?u=' + encodeURIComponent('https://noahstutoring.academy/' + g.i);
      img.style.cssText =
        'width:100%;aspect-ratio:16/10;object-fit:cover;background:#1a1a22;display:block;min-height:120px';
      img.onerror = function () {
        this.onerror = null;
        this.src = 'https://noahstutoring.academy/' + g.i;
      };
      var cap = document.createElement('div');
      cap.style.cssText =
        'padding:12px 14px 14px;font-size:13px;font-weight:600;line-height:1.35;min-height:52px;color:#f3f3f5';
      cap.textContent = g.t;
      el.appendChild(img);
      el.appendChild(cap);
      el.onclick = function () {
        openGame(g);
      };
      return el;
    }
    function render(list) {
      grid.innerHTML = '';
      list.forEach(function (g) {
        grid.appendChild(card(g));
      });
      root.querySelector('#ng-count').textContent = list.length + ' games';
    }
    async function openGame(g) {
      var url = g.u;
      if (!/^https?:/i.test(url)) url = 'https://noahstutoring.academy/' + url.replace(/^\//, '');
      root.querySelector('#ng-grid').style.display = 'none';
      root.querySelector('#ng-q').parentElement.style.display = 'none';
      play.style.display = 'flex';
      root.querySelector('#ng-title').textContent = g.t;
      frameBox.innerHTML = '<div class="ym" style="padding:16px">Loading…</div>';
      try {
        if (typeof window.openProxied === 'function') await window.openProxied(url, frameBox);
        else if (typeof proxySite === 'function') proxySite(frameBox, url, g.t);
        else
          frameBox.innerHTML =
            '<iframe src="' +
            url.replace(/"/g, '') +
            '" style="width:100%;height:100%;border:0;background:#000" allowfullscreen></iframe>';
      } catch (e) {
        frameBox.innerHTML = '<div class="ym" style="padding:16px">' + String(e.message || e) + '</div>';
      }
    }
    root.querySelector('#ng-back').onclick = function () {
      play.style.display = 'none';
      frameBox.innerHTML = '';
      root.querySelector('#ng-grid').style.display = 'grid';
      root.querySelector('#ng-q').parentElement.style.display = 'flex';
    };
    root.querySelector('#ng-q').oninput = function () {
      var q = (root.querySelector('#ng-q').value || '').toLowerCase().trim();
      render(
        !q
          ? all
          : all.filter(function (g) {
              return (g.t + ' ' + (g.d || '')).toLowerCase().indexOf(q) >= 0;
            })
      );
    };
    grid.innerHTML = '<div class="ym" style="grid-column:1/-1;padding:20px">Loading catalog…</div>';
    fetch('/api/noah-games')
      .then(function (r) {
        if (!r.ok) throw new Error('catalog ' + r.status);
        return r.json();
      })
      .then(function (list) {
        all = Array.isArray(list) ? list : [];
        render(all);
      })
      .catch(function (e) {
        grid.innerHTML =
          '<div class="ym" style="grid-column:1/-1;padding:20px">' + String(e.message || e) + '</div>';
      });
  }

  function wireGames() {
    try {
      if (window.APPS) window.APPS.games = 'Games';
      if (window.XAPPS) window.XAPPS.games = { n: 'Games', f: noahGamesApp };
      applyBrandLogos();
    } catch (e) {}
  }

  function injectXkiroModels() {
    try {
      if (typeof MODELS === 'undefined' || !Array.isArray(MODELS)) return;
      if (MODELS.some(function (m) { return m && m[1] === 'Drift 2.0'; })) return;
      MODELS.unshift([
        'mistralai/mistral-large-4-0',
        'Drift 2.0',
        'Recommended · xKiro free · best',
        'default',
        'Mistral Large 4 via xKiro.',
        { code: 1, vision: 1, files: 0, think: 1, fast: 0 }
      ]);
      MODELS.splice(1, 0, [
        'qwen/qwen3-coder-plus:free',
        'Drift Code',
        'Recommended · coding · VS Code',
        'default',
        'Best free coding model for VS Code & JS Injector.',
        { code: 1, vision: 1, files: 0, think: 1, fast: 1 }
      ]);
    } catch (e) {}
  }

  function installLiquidGlass() {
    var on = false;
    try {
      on = localStorage.getItem('wos:liquid-glass') === '1';
    } catch (e) {}
    var st = document.getElementById('drift-liquid-style');
    if (!st) {
      st = document.createElement('style');
      st.id = 'drift-liquid-style';
      document.head.appendChild(st);
    }
    if (on) {
      document.body.classList.add('drift-liquid');
      st.textContent =
        'body.drift-liquid #task{background:rgba(255,255,255,.22)!important;backdrop-filter:saturate(180%) blur(28px)!important;-webkit-backdrop-filter:saturate(180%) blur(28px)!important;border-top:1px solid rgba(255,255,255,.35)!important;box-shadow:0 -8px 32px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.4)!important}' +
        'body.drift-liquid #task .tb,body.drift-liquid #task button{background:rgba(255,255,255,.14)!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:12px!important}' +
        'body.drift-liquid .win{background:rgba(30,30,36,.55)!important;backdrop-filter:blur(24px) saturate(160%)!important;border:1px solid rgba(255,255,255,.16)!important}' +
        'body.drift-liquid .win>.title{background:rgba(255,255,255,.08)!important}';
    } else {
      document.body.classList.remove('drift-liquid');
      st.textContent = '';
    }
  }

  function openSettingsPanel() {
    var old = document.getElementById('drift-settings-panel');
    if (old) {
      old.remove();
      return;
    }
    var panel = document.createElement('div');
    panel.id = 'drift-settings-panel';
    panel.style.cssText =
      'position:fixed;right:16px;bottom:70px;z-index:2147483001;width:min(340px,92vw);background:#1c1c24;color:#eee;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 16px;box-shadow:0 12px 40px rgba(0,0,0,.45);font:13px/1.45 system-ui,sans-serif';
    var on = false;
    try {
      on = localStorage.getItem('wos:liquid-glass') === '1';
    } catch (e) {}
    panel.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><b>Settings</b><button type="button" data-x style="border:0;background:transparent;color:#aaa;font-size:18px;cursor:pointer">×</button></div>' +
      '<label style="display:flex;gap:12px;align-items:flex-start;cursor:pointer">' +
      '<input id="drift-liquid-tog" type="checkbox" style="margin-top:3px"' +
      (on ? ' checked' : '') +
      '/>' +
      '<span><b>Enable Liquid Glass (experimental)</b><div style="opacity:.75;font-size:12px;margin-top:4px">Make Drift OS look like an iOS device with the new liquid glass UI applied on the task bar.</div></span></label>';
    panel.querySelector('[data-x]').onclick = function () {
      panel.remove();
    };
    panel.querySelector('#drift-liquid-tog').onchange = function () {
      try {
        localStorage.setItem('wos:liquid-glass', this.checked ? '1' : '0');
      } catch (e) {}
      installLiquidGlass();
    };
    document.body.appendChild(panel);
  }

  function installSettingsButton() {
    if (document.getElementById('drift-settings-btn')) return;
    var create = document.getElementById('create-app');
    if (!create || !create.parentNode) return;
    var btn = document.createElement('button');
    btn.id = 'drift-settings-btn';
    btn.type = 'button';
    btn.title = 'Settings';
    btn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
    btn.style.cssText =
      (create.style.cssText || '') +
      ';display:inline-flex;align-items:center;justify-content:center;min-width:40px;padding:8px;margin-left:6px';
    create.parentNode.insertBefore(btn, create.nextSibling);
    btn.onclick = function (e) {
      e.stopPropagation();
      openSettingsPanel();
    };
  }

  function oauthFriendlyApps() {
    function enhance(label, url) {
      return function (root) {
        root.innerHTML =
          '<div style="display:flex;flex-direction:column;height:100%;min-height:0">' +
          '<div style="padding:8px 10px;border-bottom:1px solid var(--line);display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          '<span style="font-size:12px;opacity:.8">' +
          label +
          '</span>' +
          '<button type="button" data-popup style="padding:6px 10px;border-radius:8px;border:0;background:var(--acc);color:#fff;cursor:pointer;font-size:12px">Sign in (popup)</button>' +
          '<button type="button" data-retry style="padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:transparent;color:inherit;cursor:pointer;font-size:12px">Load in window</button>' +
          '<span style="font-size:11px;opacity:.65">Popup reduces Chrome phishing warnings on ChromeOS</span></div>' +
          '<div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
        var box = root.querySelector('.sjt');
        root.querySelector('[data-popup]').onclick = function () {
          window.open(url, '_blank', 'noopener,noreferrer,width=980,height=720');
        };
        root.querySelector('[data-retry]').onclick = function () {
          if (typeof window.proxySite === 'function') window.proxySite(box, url, label);
          else if (typeof window.openProxied === 'function') window.openProxied(url, box);
        };
        root.querySelector('[data-retry]').click();
      };
    }
    try {
      if (window.XAPPS) {
        if (window.XAPPS.gmail) window.XAPPS.gmail.f = enhance('Gmail', 'https://mail.google.com');
        if (window.XAPPS.discord) window.XAPPS.discord.f = enhance('Discord', 'https://discord.com/login');
        if (window.XAPPS.classroom)
          window.XAPPS.classroom.f = enhance('Classroom', 'https://classroom.google.com');
      }
    } catch (e) {}
  }

  function tightenCornerReveal() {
    if (document.getElementById('drift-corner-style')) return;
    var s = document.createElement('style');
    s.id = 'drift-corner-style';
    s.textContent =
      '#drift-tb-show{display:none!important;opacity:0;pointer-events:none}' +
      '#drift-tb-show.reveal{display:flex!important;opacity:1;pointer-events:auto}' +
      '#drift-title-show{display:none!important;opacity:0;pointer-events:none}' +
      '#drift-title-show.reveal{display:flex!important;opacity:1;pointer-events:auto}';
    document.head.appendChild(s);
  }

  function installProfileNudge() {
    if (document.getElementById('drift-profile-nudge')) return;
    try {
      if (localStorage.getItem('wos:acct-nudge') === '1') return;
    } catch (e) {}
    var box = document.createElement('div');
    box.id = 'drift-profile-nudge';
    box.style.cssText =
      'position:fixed;right:16px;bottom:64px;z-index:2147483000;max-width:320px;background:#1c1c24;color:#eee;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 16px;box-shadow:0 12px 40px rgba(0,0,0,.45);font:13px/1.45 system-ui,sans-serif';
    box.innerHTML =
      '<b style="display:block;margin-bottom:4px">Save your progress</b>' +
      '<div style="opacity:.8;font-size:12px;margin-bottom:12px">Make an account to track playtime and get on the leaderboard. Same account for games and chat.</div>' +
      '<div style="display:flex;gap:8px">' +
      '<button type="button" data-create style="border:0;border-radius:999px;background:#ff7a00;color:#111;font-weight:700;padding:8px 14px;cursor:pointer">Create account</button>' +
      '<button type="button" data-later style="border:1px solid rgba(255,255,255,.15);border-radius:999px;background:transparent;color:#ddd;padding:8px 14px;cursor:pointer">Maybe later</button></div>';
    box.querySelector('[data-later]').onclick = function () {
      box.remove();
      try {
        localStorage.setItem('wos:acct-nudge', '1');
      } catch (e) {}
    };
    box.querySelector('[data-create]').onclick = function () {
      try {
        var p = document.getElementById('prof');
        if (p) p.click();
      } catch (e) {}
      box.remove();
    };
    document.body.appendChild(box);
  }

  function boot() {
    applyBrandLogos();
    injectXkiroModels();
    fixInjectorDupes();
    wireGames();
    tightenCornerReveal();
    installLiquidGlass();
    try { installSettingsButton(); } catch (e) {}
    try { oauthFriendlyApps(); } catch (e) {}
    try { installProfileNudge(); } catch (e) {}
    if (typeof installChromeUI === 'function') try { installChromeUI(); } catch (e) {}
    setTimeout(function () {
      applyBrandLogos();
      wireGames();
      installSettingsButton();
      oauthFriendlyApps();
      installLiquidGlass();
      if (typeof installChromeUI === 'function') try { installChromeUI(); } catch (e) {}
    }, 600);
    setTimeout(installSettingsButton, 1500);
  }

  onReady(boot);
  console.log('[Drift] fixup loaded');
})();
