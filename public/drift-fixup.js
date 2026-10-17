/* Drift fixup: switches, liquid glass, games, settings, oauth */
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
      name: 'Rylan Rude / Colin (GreasyFork)',
      url: 'https://update.greasyfork.org/scripts/526022.user.js'
    },
    scribd: {
      id: 'scribd',
      name: 'SCRIBD notes (doc only — not auto-injectable)',
      url: ''
    }
  };

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  function svg(inner) {
    return '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }
  function switchHTML(id, checked) {
    return (
      '<button type="button" role="switch" id="' +
      id +
      '" aria-checked="' +
      (checked ? 'true' : 'false') +
      '" data-on="' +
      (checked ? '1' : '0') +
      '" style="position:relative;width:46px;height:28px;border-radius:999px;border:0;cursor:pointer;flex:none;padding:0;' +
      'background:' +
      (checked ? '#34c759' : 'rgba(120,120,128,.32)') +
      ';transition:background .2s">' +
      '<span style="position:absolute;top:2px;left:' +
      (checked ? '20px' : '2px') +
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
  }

  function noahGamesApp(root) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0;background:#0a0a0f;color:#eee">' +
      '<div style="padding:12px 16px;display:flex;gap:10px;align-items:center;border-bottom:1px solid #1f1f28;flex:none">' +
      '<b style="font-size:15px">Games</b>' +
      '<input id="ng-q" placeholder="Search games…" style="flex:1;padding:10px 12px;border-radius:10px;border:1px solid #2a2a35;background:#14141c;color:#eee">' +
      '<span id="ng-count" style="font-size:12px;opacity:.6;white-space:nowrap"></span></div>' +
      '<div id="ng-grid" style="flex:1;overflow:auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;align-content:start"></div>' +
      '<div id="ng-play" style="display:none;flex:1;flex-direction:column;min-height:0">' +
      '<div style="padding:8px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #1f1f28;flex:none">' +
      '<button type="button" id="ng-back" style="padding:6px 12px;border-radius:8px;border:1px solid #333;background:#1a1a24;color:#fff;cursor:pointer">← Back</button>' +
      '<b id="ng-title" style="font-size:13px"></b></div>' +
      '<div id="ng-frame" style="flex:1;min-height:0;position:relative"></div></div></div>';

    var grid = root.querySelector('#ng-grid');
    var play = root.querySelector('#ng-play');
    var frameBox = root.querySelector('#ng-frame');
    var all = [];

    function card(g) {
      var el = document.createElement('button');
      el.type = 'button';
      el.style.cssText =
        'border:0;padding:0;margin:0;background:#12121a;border-radius:14px;overflow:hidden;cursor:pointer;text-align:left;color:#f3f3f5;' +
        'display:flex;flex-direction:column;width:100%;box-shadow:0 4px 14px rgba(0,0,0,.4)';
      var thumb = document.createElement('div');
      thumb.style.cssText =
        'width:100%;aspect-ratio:16/10;background:#1a1a24;overflow:hidden;flex:none;position:relative';
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = g.t || '';
      img.decoding = 'async';
      img.src = '/api/noah-asset?u=' + encodeURIComponent('https://noahstutoring.academy/' + g.i);
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
      img.onerror = function () {
        this.onerror = null;
        this.src = 'https://noahstutoring.academy/' + g.i;
      };
      thumb.appendChild(img);
      var cap = document.createElement('div');
      cap.style.cssText =
        'padding:10px 12px 12px;font-size:13px;font-weight:600;line-height:1.35;color:#f3f3f5;' +
        'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.7em';
      cap.textContent = g.t;
      el.appendChild(thumb);
      el.appendChild(cap);
      el.onclick = function () {
        openGame(g);
      };
      return el;
    }

    function render(list) {
      grid.innerHTML = '';
      var frag = document.createDocumentFragment();
      list.forEach(function (g) {
        frag.appendChild(card(g));
      });
      grid.appendChild(frag);
      root.querySelector('#ng-count').textContent = list.length + ' games';
    }

    async function openGame(g) {
      var url = g.u;
      if (!/^https?:/i.test(url)) url = 'https://noahstutoring.academy/' + url.replace(/^\//, '');
      grid.style.display = 'none';
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
        frameBox.innerHTML =
          '<div class="ym" style="padding:16px">' +
          String(e.message || e) +
          '<br><a href="' +
          url +
          '" target="_blank" rel="noopener">Open in new tab</a></div>';
      }
    }

    root.querySelector('#ng-back').onclick = function () {
      play.style.display = 'none';
      frameBox.innerHTML = '';
      grid.style.display = 'grid';
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

    grid.innerHTML = '<div class="ym" style="grid-column:1/-1;padding:24px">Loading catalog…</div>';
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
          '<div class="ym" style="grid-column:1/-1;padding:24px">' + String(e.message || e) + '</div>';
      });
  }

  function wireGames() {
    try {
      if (window.APPS) window.APPS.games = 'Games';
      if (window.XAPPS) window.XAPPS.games = { n: 'Games', f: noahGamesApp };
      applyBrandLogos();
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
        'body.drift-liquid #task{' +
        'background:rgba(255,255,255,.2)!important;backdrop-filter:saturate(180%) blur(28px)!important;' +
        '-webkit-backdrop-filter:saturate(180%) blur(28px)!important;border-top:1px solid rgba(255,255,255,.32)!important;' +
        'box-shadow:0 -8px 32px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.35)!important}' +
        'body.drift-liquid #task .tb,body.drift-liquid #task button,body.drift-liquid #drift-tb-hide,body.drift-liquid #drift-tb-show{' +
        'background:rgba(255,255,255,.16)!important;border:1px solid rgba(255,255,255,.2)!important;border-radius:12px!important;' +
        'backdrop-filter:blur(12px)!important}' +
        'body.drift-liquid #drift-tb-show,body.drift-liquid #drift-title-show{' +
        'background:rgba(30,30,36,.55)!important;backdrop-filter:blur(20px)!important;border:1px solid rgba(255,255,255,.22)!important}' +
        'body.drift-liquid .win{' +
        'background:rgba(28,28,34,.55)!important;backdrop-filter:blur(28px) saturate(160%)!important;' +
        '-webkit-backdrop-filter:blur(28px) saturate(160%);border:1px solid rgba(255,255,255,.16)!important;box-shadow:0 12px 40px rgba(0,0,0,.28)!important}' +
        'body.drift-liquid .win>.title{' +
        'background:rgba(255,255,255,.1)!important;backdrop-filter:blur(16px)!important;border-bottom:1px solid rgba(255,255,255,.08)!important}' +
        'body.drift-liquid .win .wb,body.drift-liquid .title button,body.drift-liquid .drift-title-hide-btn{' +
        'background:rgba(255,255,255,.14)!important;border-radius:999px!important;border:1px solid rgba(255,255,255,.12)!important}' +
        'body.drift-liquid #menu,.menu,body.drift-liquid .sheet,body.drift-liquid #sh,body.drift-liquid .card,' +
        'body.drift-liquid #drift-settings-panel,body.drift-liquid #drift-profile-nudge{' +
        'background:rgba(28,28,34,.62)!important;backdrop-filter:blur(24px) saturate(150%)!important;' +
        'border:1px solid rgba(255,255,255,.14)!important}' +
        'body.drift-liquid .ai-msg,body.drift-liquid #ain,body.drift-liquid [class*="ai-"] textarea,' +
        'body.drift-liquid .ai-tools,body.drift-liquid #ai-models,body.drift-liquid .models{' +
        'background:rgba(255,255,255,.08)!important;backdrop-filter:blur(12px)!important;border-color:rgba(255,255,255,.12)!important}';
    } else {
      document.body.classList.remove('drift-liquid');
      st.textContent = '';
    }
  }

  function styleCavemanAsSwitch() {
    var st = document.getElementById('drift-switch-style');
    if (!st) {
      st = document.createElement('style');
      st.id = 'drift-switch-style';
      document.head.appendChild(st);
      st.textContent =
        '#drift-cav{appearance:none;-webkit-appearance:none;width:46px;height:28px;border-radius:999px;background:rgba(120,120,128,.32);' +
        'position:relative;outline:none;cursor:pointer;vertical-align:middle;border:0;transition:background .2s}' +
        '#drift-cav:checked{background:#34c759}' +
        '#drift-cav::after{content:"";position:absolute;top:2px;left:2px;width:24px;height:24px;border-radius:50%;background:#fff;' +
        'box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .2s}' +
        '#drift-cav:checked::after{left:20px}';
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
      'position:fixed;right:16px;bottom:70px;z-index:2147483001;width:min(360px,94vw);max-height:min(70vh,520px);overflow:auto;' +
      'background:#1c1c24;color:#eee;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 16px;' +
      'box-shadow:0 12px 40px rgba(0,0,0,.45);font:13px/1.45 system-ui,sans-serif';
    var liquidOn = false;
    var gk = 'lazy';
    try {
      liquidOn = localStorage.getItem('wos:liquid-glass') === '1';
      gk = localStorage.getItem('wos:gimkit-injector') || 'lazy';
    } catch (e) {}

    var opts = '';
    Object.keys(GIMKIT_INJECTORS).forEach(function (k) {
      var it = GIMKIT_INJECTORS[k];
      opts +=
        '<label style="display:flex;gap:8px;align-items:flex-start;margin:6px 0;cursor:pointer">' +
        '<input type="radio" name="gk-inj" value="' +
        it.id +
        '"' +
        (gk === it.id ? ' checked' : '') +
        ' style="margin-top:3px"/>' +
        '<span><b>' +
        it.name +
        '</b>' +
        (it.url
          ? ''
          : '<div style="opacity:.65;font-size:11px">Scribd is a document link, not a .user.js — pick Lazy or GreasyFork for injection.</div>') +
        '</span></label>';
    });

    panel.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
      '<b>Settings</b><button type="button" data-x style="border:0;background:transparent;color:#aaa;font-size:18px;cursor:pointer">×</button></div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Enable Liquid Glass (experimental)</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Make Drift OS look like an iOS device with the new liquid glass UI applied on the task bar.</div></div>' +
      switchHTML('drift-liquid-sw', liquidOn) +
      '</div>' +
      '<div style="border-top:1px solid rgba(255,255,255,.08);padding-top:12px">' +
      '<b style="display:block;margin-bottom:8px">Gimkit injection default</b>' +
      opts +
      '<div style="opacity:.65;font-size:11px;margin-top:8px">Tip: host large injectors as Release assets (.js) for more stable loads.</div></div>';

    panel.querySelector('[data-x]').onclick = function () {
      panel.remove();
    };
    wireSwitch(panel.querySelector('#drift-liquid-sw'), function (on) {
      try {
        localStorage.setItem('wos:liquid-glass', on ? '1' : '0');
      } catch (e) {}
      installLiquidGlass();
    });
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
          '<div style="padding:8px 10px;border-bottom:1px solid var(--line);display:flex;gap:8px;align-items:center;flex-wrap:wrap;' +
          'background:var(--bar, rgba(255,255,255,.04));color:var(--ink, inherit)">' +
          '<span style="font-size:12px;opacity:.85">' +
          label +
          '</span>' +
          '<button type="button" data-popup style="padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:var(--omni, transparent);color:inherit;cursor:pointer;font-size:12px">Sign in (popup)</button>' +
          '<button type="button" data-retry style="padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:transparent;color:inherit;cursor:pointer;font-size:12px">Load in window</button>' +
          '<span style="font-size:11px;opacity:.6">Use popup on ChromeOS if login is blocked</span></div>' +
          '<div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
        var box = root.querySelector('.sjt');
        root.querySelector('[data-popup]').onclick = function () {
          var login =
            label === 'Gmail' || label === 'Classroom'
              ? 'https://accounts.google.com/ServiceLogin?continue=' + encodeURIComponent(url)
              : url;
          window.open(login, '_blank', 'noopener,noreferrer,width=980,height=720');
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

  function boot() {
    applyBrandLogos();
    wireGames();
    tightenCornerReveal();
    installLiquidGlass();
    styleCavemanAsSwitch();
    try {
      installSettingsButton();
    } catch (e) {}
    try {
      oauthFriendlyApps();
    } catch (e) {}
    if (typeof installChromeUI === 'function')
      try {
        installChromeUI();
      } catch (e) {}
    setTimeout(function () {
      applyBrandLogos();
      wireGames();
      installSettingsButton();
      oauthFriendlyApps();
      installLiquidGlass();
      styleCavemanAsSwitch();
      if (typeof installChromeUI === 'function')
        try {
          installChromeUI();
        } catch (e) {}
    }, 600);
    setTimeout(installSettingsButton, 1500);
  }

  onReady(boot);
  console.log('[Drift] fixup loaded');
})();
