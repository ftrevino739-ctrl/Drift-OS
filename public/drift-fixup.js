/* Drift fixup */
(function () {
  'use strict';
  window.__DRIFT_BUILD = '20261104-f';
  window.DRIFT_BEST_MODEL = window.DRIFT_BEST_MODEL || 'mistralai/mistral-large-4-0';
  window.DRIFT_CODE_MODEL = 'google/gemini-3.8-flash';

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

  var EDU_APPS = { classroom: 1, canva: 1, wayground: 1 };

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

  function driftIcons() {
    try {
      if (typeof IC !== 'undefined' && IC) { window.IC = IC; return IC; }
    } catch (e) {}
    window.IC = window.IC || {};
    return window.IC;
  }
  function applyBrandLogos() {
    var IC = driftIcons();
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
      '<path fill="#fff" transform="translate(6.5 7) scale(1.45)" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>'
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
    IC.cam = svg(
      '<rect width="48" height="48" rx="12" fill="#0f172a"/>' +
      '<path d="M16 16.5h3.2l1.6-2.5h6.4l1.6 2.5H32a3.5 3.5 0 013.5 3.5v11A3.5 3.5 0 0132 34.5H16a3.5 3.5 0 01-3.5-3.5v-11A3.5 3.5 0 0116 16.5z" fill="#1e293b" stroke="#e2e8f0" stroke-width="1.6"/>' +
      '<circle cx="24" cy="26" r="6" fill="none" stroke="#7dd3fc" stroke-width="2.2"/>' +
      '<circle cx="24" cy="26" r="2.5" fill="#38bdf8"/>' +
      '<circle cx="32.2" cy="20.2" r="1.15" fill="#fbbf24"/>'
    );
    IC.mus = svg(
      '<rect width="48" height="48" rx="11" fill="#fa243c"/>' +
      '<path d="M19 32V15l15-3v17" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="16" cy="32" r="4" fill="#fff"/>' +
      '<circle cx="31" cy="29" r="4" fill="#fff"/>'
    );
    IC.games = svg(
      '<rect width="48" height="48" rx="11" fill="#111827"/>' +
      '<rect x="8" y="14" width="14" height="10" rx="2" fill="#34d399"/>' +
      '<rect x="26" y="14" width="14" height="10" rx="2" fill="#60a5fa"/>' +
      '<rect x="8" y="28" width="14" height="10" rx="2" fill="#f472b6"/>' +
      '<rect x="26" y="28" width="14" height="10" rx="2" fill="#fbbf24"/>'
    );
    IC.chat = '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="12" fill="#34C759"/><path fill="#fff" d="M24 11.2c-7.2 0-13 4.8-13 10.8 0 3.4 1.8 6.4 4.6 8.4-.2 1.4-.8 3-1.6 4.1 0 0 2.1-.4 4.1-1.5 1.8.8 3.8 1.3 6 1.3 7.2 0 13-4.8 13-10.8s-5.8-10.8-13-10.8z"/></svg>';
    IC.espn = '<img alt="ESPN" src="/espn-logo.png" style="width:100%;height:100%;object-fit:contain;background:#fff;border-radius:8px">';
    IC.aleks = '<img alt="ALEKS" src="/aleks-logo.png" style="width:100%;height:100%;object-fit:cover;border-radius:11px">';
    IC.minecraft = '<img alt="Minecraft" src="/minecraft.png" style="width:100%;height:100%;object-fit:cover;border-radius:11px;image-rendering:pixelated">';
    IC.gbuild = '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="12" fill="#0f766e"/><rect x="8" y="22" width="13" height="13" rx="2.2" fill="#5eead4"/><rect x="17.5" y="12" width="13" height="13" rx="2.2" fill="#99f6e4"/><rect x="26" y="24" width="13" height="13" rx="2.2" fill="#ccfbf1"/><path d="M33.2 9.2l1.5 3.1 3.4.4-2.5 2.3.7 3.3-3.1-1.7-3.1 1.7.7-3.3-2.5-2.3 3.4-.4z" fill="#fde68a"/></svg>';
    IC.code = '<img alt="Visual Studio Code" src="/vscode-logo.svg" style="width:100%;height:100%;object-fit:contain;border-radius:11px;background:transparent">';
    IC.winemu = '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="16.5" height="16.5" rx="2" fill="#0078D4"/><rect x="26.5" y="5" width="16.5" height="16.5" rx="2" fill="#0078D4"/><rect x="5" y="26.5" width="16.5" height="16.5" rx="2" fill="#0078D4"/><rect x="26.5" y="26.5" width="16.5" height="16.5" rx="2" fill="#0078D4"/></svg>';
  }

  function styleSettingsBtn() {
    var btn = document.getElementById('drift-settings-btn');
    if (!btn) return;
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="3"/>' +
      '<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>' +
      '</svg>';
    btn.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;margin:0;padding:0;border:0;border-radius:8px;background:transparent;cursor:pointer;align-self:center;color:inherit';
    var lf = btn.closest && btn.closest('.lf');
    if (lf) lf.style.alignItems = 'center';
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

  function peakMoviesApp(root) {
    root.innerHTML = '';
    root.style.cssText = 'height:100%;min-height:0;position:relative;overflow:hidden;background:#000';
    function hideRail(frame) {
      try {
        var doc = frame.contentDocument;
        if (!doc || !doc.documentElement || doc.getElementById('drift-rail-hide')) return;
        var s = doc.createElement('style');
        s.id = 'drift-rail-hide';
        s.textContent = '.rail,aside.rail{display:none!important}body{margin-left:0!important;padding-left:0!important}';
        (doc.head || doc.documentElement).appendChild(s);
      } catch (e) {}
    }
    operaPage('https://racialequityleadership.com/movies.html', 'firefox')(root);
    var n = 0;
    var timer = setInterval(function () {
      if (!root.isConnected || ++n > 14) { clearInterval(timer); return; }
      var fr = root.querySelector('iframe');
      if (fr) hideRail(fr);
    }, 600);
  }

function driftSite(url) {
    return function (root) {
      root.innerHTML = '';
      root.style.cssText = 'height:100%;min-height:0;position:relative;background:#000';
      if (typeof window.openProxied === 'function') window.openProxied(url, root);
      else root.textContent = 'Scramjet is not ready.';
    };
  }
  function youtubeApp(root) {
    root.innerHTML = '';
    root.style.cssText = 'height:100%;min-height:0;display:flex;flex-direction:column;background:#0f0f0f;color:#f1f1f1;font:14px system-ui,sans-serif';
    var bar = document.createElement('form');
    bar.style.cssText = 'flex:none;display:flex;gap:8px;align-items:center;padding:8px 10px;background:#212121';
    bar.innerHTML = '<b style="font-size:14px">YouTube</b><input data-q placeholder="Busca o pega un enlace" style="flex:1;padding:8px 10px;border-radius:10px;border:0;background:#121212;color:#fff"><button type="submit" style="border:0;border-radius:10px;background:#ff0033;color:#fff;font-weight:700;padding:8px 12px;cursor:pointer">Ver</button><span data-st style="font-size:11px;opacity:.75">Firefox · dentro de la app</span>';
    var stage = document.createElement('div');
    stage.style.cssText = 'flex:1;min-height:0;display:flex;flex-direction:column';
    var video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.style.cssText = 'width:100%;max-height:58%;background:#000;flex:none';
    var list = document.createElement('div');
    list.style.cssText = 'flex:1;min-height:0;overflow:auto;padding:8px';
    stage.appendChild(video);
    stage.appendChild(list);
    root.appendChild(bar);
    root.appendChild(stage);
    var status = bar.querySelector('[data-st]');
    function videoId(raw) {
      var s = String(raw || '').trim();
      if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
      try {
        var u = new URL(s, 'https://www.youtube.com/');
        if (/youtu\.be$/i.test(u.hostname)) return (u.pathname.split('/').filter(Boolean)[0] || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 11);
        var v = u.searchParams.get('v');
        if (v) return v.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 11);
        var m = u.pathname.match(/\/(?:shorts|embed|live|v)\/([^/?#]+)/);
        return m ? m[1].replace(/[^A-Za-z0-9_-]/g, '').slice(0, 11) : '';
      } catch (e) { return ''; }
    }
    function play(id) {
      if (!id) { status.textContent = 'Pega un enlace de YouTube.'; return; }
      status.textContent = 'Cargando el video completo…';
      video.removeAttribute('src');
      video.load();
      fetch('/api/yt-play?id=' + encodeURIComponent(id))
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'YouTube'); return j; }); })
        .then(function (j) {
          video.src = j.url;
          video.play().catch(function () {});
          status.textContent = (j.quality ? j.quality + ' · ' : '') + (j.seconds ? Math.round(j.seconds) + 's · ' : '') + 'archivo completo, sin Chrome';
          if (j.title) document.title = j.title;
        })
        .catch(function (e) {
          status.textContent = String(e.message || e);
        });
    }
    function row(item) {
      var id = (item.id && (item.id.videoId || item.id)) || '';
      if (item.id && typeof item.id === 'object') id = item.id.videoId || '';
      var sn = item.snippet || {};
      var b = document.createElement('button');
      b.type = 'button';
      b.style.cssText = 'display:flex;gap:10px;width:100%;text-align:left;margin:0 0 8px;padding:8px;border:0;border-radius:10px;background:#1a1a1a;color:#fff;cursor:pointer';
      var thumb = (sn.thumbnails && (sn.thumbnails.medium || sn.thumbnails.default) || {}).url || '';
      b.innerHTML = (thumb ? '<img alt="" src="' + thumb + '" style="width:120px;height:68px;object-fit:cover;border-radius:8px;flex:none">' : '') + '<span><b style="display:block">' + String(sn.title || 'Video') + '</b><span style="opacity:.7;font-size:12px">' + String((sn.channelTitle || '')) + '</span></span>';
      b.onclick = function () { play(String(id).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 11)); };
      return b;
    }
    function catalog(q) {
      list.innerHTML = '<div style="opacity:.7;padding:8px">Buscando…</div>';
      fetch('/api/yt-list?q=' + encodeURIComponent(q || ''))
        .then(function (r) { if (!r.ok) throw new Error('lista'); return r.json(); })
        .then(function (j) {
          list.innerHTML = '';
          var items = j.items || [];
          if (!items.length) { list.innerHTML = '<div style="opacity:.7;padding:8px">Nada todavía. Pega un enlace arriba.</div>'; return; }
          items.forEach(function (it) { list.appendChild(row(it)); });
        })
        .catch(function () {
          list.innerHTML = '<div style="opacity:.75;padding:8px">Pega un enlace de YouTube y pulsa Ver. El video se reproduce entero aquí.</div>';
        });
    }
    bar.onsubmit = function (e) {
      e.preventDefault();
      var q = bar.querySelector('[data-q]').value.trim();
      var id = videoId(q);
      if (id) play(id);
      else catalog(q);
    };
    catalog('');
  }
  function espnBlocked(frame) {
    try {
      var text = frame.contentDocument && frame.contentDocument.body ? String(frame.contentDocument.body.innerText || '').slice(0, 900) : '';
      return /Request blocked|403 ERROR|Generated by cloudfront|We can't connect to the server|challenge-container|AwsWaf|verify that you're not a robot/i.test(text);
    } catch (e) { return false; }
  }
  function espnReal(frame) {
    try {
      var text = frame.contentDocument && frame.contentDocument.body ? String(frame.contentDocument.body.innerText || '').slice(0, 1200) : '';
      return text.length > 500 && !espnBlocked(frame) && /ESPN|Scores|Watch|NFL|NBA|Top Headlines/i.test(text);
    } catch (e) { return false; }
  }
  function espnBoard(box) {
    var leagues = [
      ['NFL', 'football/nfl'],
      ['NBA', 'basketball/nba'],
      ['MLB', 'baseball/mlb'],
      ['NHL', 'hockey/nhl'],
      ['Liga MX', 'soccer/mex.1'],
      ['Premier', 'soccer/eng.1']
    ];
    box.innerHTML = '<div style="height:100%;display:flex;flex-direction:column;background:#0e0e0e;color:#f4f4f4;font:14px system-ui,sans-serif">' +
      '<div style="flex:none;display:flex;align-items:center;gap:10px;padding:10px 12px;background:#c41230"><b style="font-size:18px;letter-spacing:.04em">ESPN</b><span style="opacity:.85;font-size:12px">Scores</span><span data-st style="margin-left:auto;font-size:12px;opacity:.85"></span></div>' +
      '<div data-tabs style="flex:none;display:flex;gap:6px;padding:8px 10px;overflow:auto;background:#161616"></div>' +
      '<div data-list style="flex:1;min-height:0;overflow:auto;padding:8px 10px"></div></div>';
    var tabs = box.querySelector('[data-tabs]');
    var list = box.querySelector('[data-list]');
    var st = box.querySelector('[data-st]');
    leagues.forEach(function (pair, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = pair[0];
      b.style.cssText = 'border:0;border-radius:999px;padding:6px 12px;cursor:pointer;font-weight:700;background:' + (i ? '#2a2a2a' : '#fff') + ';color:' + (i ? '#fff' : '#111');
      b.onclick = function () {
        tabs.querySelectorAll('button').forEach(function (n, j) {
          n.style.background = j === i ? '#fff' : '#2a2a2a';
          n.style.color = j === i ? '#111' : '#fff';
        });
        load(pair[1]);
      };
      tabs.appendChild(b);
    });
    function row(ev) {
      var comp = (ev.competitions && ev.competitions[0]) || {};
      var teams = comp.competitors || [];
      var status = (comp.status && comp.status.type && (comp.status.type.shortDetail || comp.status.type.description)) || '';
      var card = document.createElement('div');
      card.style.cssText = 'display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:10px 12px;margin:0 0 8px;border-radius:12px;background:#1b1b1b';
      var side = document.createElement('div');
      teams.slice().sort(function (a, b) { return a.homeAway === 'home' ? 1 : -1; }).forEach(function (c) {
        var line = document.createElement('div');
        line.style.cssText = 'display:flex;align-items:center;gap:8px;margin:3px 0';
        var logo = (c.team && c.team.logo) || '';
        line.innerHTML = (logo ? '<img alt="" src="' + logo + '" style="width:22px;height:22px;object-fit:contain">' : '') +
          '<span style="flex:1">' + String((c.team && (c.team.shortDisplayName || c.team.abbreviation)) || '') + '</span>' +
          '<b>' + String(c.score == null ? '' : c.score) + '</b>';
        side.appendChild(line);
      });
      var meta = document.createElement('div');
      meta.style.cssText = 'font-size:12px;opacity:.75;text-align:right;max-width:140px';
      meta.textContent = status;
      card.appendChild(side);
      card.appendChild(meta);
      return card;
    }
    function load(path) {
      list.innerHTML = '<div style="opacity:.7;padding:12px">Loading…</div>';
      st.textContent = '';
      fetch('https://site.web.api.espn.com/apis/site/v2/sports/' + path + '/scoreboard', { headers: { accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('ESPN ' + r.status); return r.json(); })
        .then(function (data) {
          var events = data.events || [];
          list.innerHTML = '';
          if (!events.length) { list.innerHTML = '<div style="opacity:.7;padding:12px">No games on the board right now.</div>'; return; }
          events.slice(0, 30).forEach(function (ev) { list.appendChild(row(ev)); });
          st.textContent = events.length + ' games';
        })
        .catch(function () {
          list.innerHTML = '<div style="padding:12px">ESPN did not answer. <button type="button" data-re style="margin-left:8px;padding:6px 10px;border:0;border-radius:8px;background:#c41230;color:#fff;cursor:pointer">Retry</button></div>';
          var b = list.querySelector('[data-re]');
          if (b) b.onclick = function () { load(path); };
        });
    }
    load(leagues[0][1]);
  }
  function espnApp(root) {
    root.innerHTML = '';
    root.style.cssText = 'height:100%;min-height:0;position:relative;background:#fff';
    var frame = document.createElement('iframe');
    frame.setAttribute('referrerpolicy', 'no-referrer');
    frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff';
    frame.src = '/api/opera?u=' + encodeURIComponent('https://www.espn.com/') + '&b=edge';
    root.appendChild(frame);
    var n = 0;
    var timer = setInterval(function () {
      if (!root.isConnected || ++n > 10) { clearInterval(timer); return; }
      var text = '';
      try { text = frame.contentDocument && frame.contentDocument.body ? String(frame.contentDocument.body.innerText || '').slice(0, 700) : ''; } catch (e) { text = ''; }
      if (/403 ERROR|Request blocked|Generated by cloudfront|We can't connect to the server/i.test(text)) {
        clearInterval(timer);
        espnBoard(root);
      }
    }, 700);
  }
  function directSite(url) {
    return function (root) {
      root.innerHTML = '';
      root.style.cssText = 'height:100%;min-height:0;position:relative;background:#000';
      var fr = document.createElement('iframe');
      fr.src = url;
      fr.setAttribute('allow', 'fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-read; clipboard-write');
      fr.setAttribute('allowfullscreen', '');
      fr.setAttribute('credentialless', '');
      fr.referrerPolicy = 'no-referrer';
      fr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#000';
      root.appendChild(fr);
    };
  }
  function loadPokiSdk(doc) {
    try {
      var d = doc || document;
      if (!d || !d.querySelector || d.querySelector('script[data-poki-sdk]')) return;
      var s = d.createElement('script');
      s.src = 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js';
      s.async = true;
      s.setAttribute('data-poki-sdk', '1');
      (d.head || d.documentElement).appendChild(s);
    } catch (e) {}
  }
  var GAME_LIBS = {
    poki: 'https://poki.com/',
    crazygames: 'https://www.crazygames.com/',
    tesana: 'https://tesana.com/play'
  };
  function externalGames(root, url, title) {
    root.innerHTML = '';
    root.style.cssText = 'height:100%;min-height:0;display:flex;flex-direction:column;background:#000';
    var bar = document.createElement('div');
    bar.style.cssText = 'flex:none;display:flex;gap:8px;align-items:center;padding:6px 10px;background:#0b0b10;color:#fff;font:12px system-ui,sans-serif;z-index:5';
    var back = document.createElement('button');
    back.type = 'button';
    back.textContent = '← Back';
    back.style.cssText = 'padding:6px 12px;border-radius:8px;border:1px solid #333;background:#1a1a24;color:#fff;cursor:pointer';
    var name = document.createElement('b');
    name.textContent = title || 'Games';
    bar.appendChild(back);
    bar.appendChild(name);
    var view = document.createElement('div');
    view.style.cssText = 'flex:1;min-height:0;position:relative;background:#000';
    root.appendChild(bar);
    root.appendChild(view);
    function go(u) {
      view.innerHTML = '';
      if (typeof window.openProxied === 'function') window.openProxied(u, view);
      else view.textContent = 'Scramjet is not ready.';
    }
    back.onclick = function () { go(url); };
    go(url);
  }
  function gamesApp(root) {
    var lib = 'noah';
    try { lib = localStorage.getItem('wos:games-lib') || 'noah'; } catch (e) {}
    if (lib === 'lagged' || lib === 'y8' || lib === 'kbh') lib = 'noah';
    if (GAME_LIBS[lib]) {
      if (lib === 'poki') loadPokiSdk(document);
      var titles = { tesana: 'Tesana', poki: 'Poki', crazygames: 'CrazyGames' };
      externalGames(root, GAME_LIBS[lib], titles[lib] || 'Games');
      if (lib === 'poki') {
        setTimeout(function () {
          try {
            var frame = root.querySelector('iframe');
            if (frame) loadPokiSdk(frame.contentDocument);
          } catch (e) {}
        }, 1200);
      }
      return;
    }
    return noahGamesApp(root);
  }
  function tmdbGet(path) {
    var ep = 'https://holy-firefly-982c.fert0480.workers.dev';
    try { if (typeof EP === 'function') ep = EP(); } catch (e) {}
    return fetch('/api/tmdb?path=' + encodeURIComponent(path), { headers: { accept: 'application/json' } })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (x) {
        if (x.status !== 503 && x.j && !x.j.error && !x.j.status_message && x.j.success !== false) return x.j;
        if (x.j && (x.j.results || x.j.title || x.j.name || x.j.id) && !x.j.status_message) return x.j;
        return fetch(ep.replace(/\/$/, '') + '/tmdb?path=' + encodeURIComponent(path), { headers: { accept: 'application/json' } })
          .then(function (r) { return r.json(); });
      });
  }
  function tmdbImg(path) {
    if (!path) return '';
    return '/api/tmdb-img?p=' + encodeURIComponent(path);
  }
  function tmdbMovies(root) {
    root.innerHTML = '';
    root.style.cssText = 'height:100%;min-height:0;display:flex;flex-direction:column;background:#0b0b10;color:#eee;font-family:system-ui,sans-serif';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;gap:8px;align-items:center;padding:10px;flex:none;border-bottom:1px solid #222';
    bar.innerHTML = '<b>Movies</b>' +
      '<button type="button" data-k="movie" style="padding:6px 10px;border:0;border-radius:8px;background:#e50914;color:#fff;cursor:pointer">Películas</button>' +
      '<button type="button" data-k="tv" style="padding:6px 10px;border:0;border-radius:8px;background:#222;color:#fff;cursor:pointer">Series</button>' +
      '<input data-q placeholder="Buscar" style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee">';
    var grid = document.createElement('div');
    grid.style.cssText = 'flex:1;overflow:auto;padding:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;align-content:start';
    root.appendChild(bar);
    root.appendChild(grid);
    var kind = 'movie';
    function card(item) {
      var b = document.createElement('button');
      b.type = 'button';
      b.style.cssText = 'all:unset;cursor:pointer;background:#14141c;border-radius:12px;overflow:hidden;display:flex;flex-direction:column';
      var img = tmdbImg(item.poster_path);
      b.innerHTML = (img ? '<img alt="" loading="lazy" decoding="async" src="' + img + '" style="width:100%;height:190px;object-fit:cover;background:#111">' : '<div style="height:190px;background:#222"></div>') +
        '<div style="padding:8px;font-size:12px;line-height:1.3"><b>' + String(item.title || item.name || '').replace(/[&<>]/g, '') + '</b></div>';
      b.onclick = function () { openItem(item); };
      return b;
    }
    function showList(list, err) {
      grid.innerHTML = '';
      grid.style.display = 'grid';
      if (err) { grid.textContent = err; return; }
      (list || []).forEach(function (item) { if (item && (item.poster_path || item.title || item.name)) grid.appendChild(card(item)); });
      if (!grid.childNodes.length) grid.textContent = 'Sin resultados.';
    }
    function loadList() {
      var q = (bar.querySelector('[data-q]').value || '').trim();
      var path = q
        ? ('/search/' + kind + '?query=' + encodeURIComponent(q))
        : ('/trending/' + kind + '/week');
      var cacheKey = q ? '' : ('wos:tmdb-' + kind);
      var painted = false;
      if (cacheKey) {
        try {
          var cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
          if (cached && cached.length) { showList(cached); painted = true; }
        } catch (e) {}
      }
      if (!painted) showList([], 'Cargando…');
      tmdbGet(path).then(function (j) {
        if (!j || j.error === 'no-key') { showList([], 'Falta la clave de TMDB. Pega el worker nuevo o pon TMDB_TOKEN en el host.'); return; }
        if (j.status_message && !j.results) { showList([], j.status_message); return; }
        var list = j.results || [];
        if (cacheKey && list.length) { try { sessionStorage.setItem(cacheKey, JSON.stringify(list.slice(0, 24))); } catch (e) {} }
        showList(list);
      }).catch(function () { if (!painted) showList([], 'No se pudo cargar el catálogo.'); });
    }
    function openItem(item) {
      var id = item.id;
      var path = kind === 'tv' ? ('/tv/' + id) : ('/movie/' + id);
      grid.innerHTML = 'Cargando…';
      tmdbGet(path).then(function (d) {
        grid.style.display = 'block';
        var title = d.title || d.name || item.title || item.name || '';
        var overview = d.overview || 'Sin descripción.';
        var when = (d.release_date || d.first_air_date || '').slice(0, 4);
        var html = '<button type="button" data-back style="margin:0 0 10px;padding:6px 10px;border:0;border-radius:8px;background:#222;color:#fff;cursor:pointer">← Volver</button>' +
          '<div style="display:flex;gap:14px;align-items:flex-start">' +
          (d.poster_path ? '<img alt="" src="' + tmdbImg(d.poster_path) + '" style="width:140px;border-radius:10px">' : '') +
          '<div><b style="font-size:18px">' + String(title).replace(/[&<>]/g, '') + '</b>' +
          '<div style="opacity:.7;margin:4px 0 8px">' + when + (d.vote_average ? ' · ' + Number(d.vote_average).toFixed(1) : '') + '</div>' +
          '<p style="margin:0;line-height:1.45;font-size:14px">' + String(overview).replace(/[&<>]/g, '') + '</p></div></div>';
        grid.innerHTML = html;
        grid.querySelector('[data-back]').onclick = loadList;
        if (kind === 'tv' && d.seasons && d.seasons.length) {
          var seasons = d.seasons.filter(function (s) { return s.season_number > 0; });
          if (!seasons.length) seasons = d.seasons;
          var pick = document.createElement('div');
          pick.style.cssText = 'margin-top:14px;display:flex;gap:6px;flex-wrap:wrap';
          var eps = document.createElement('div');
          eps.style.marginTop = '10px';
          seasons.forEach(function (s) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = s.name || ('Temporada ' + s.season_number);
            b.style.cssText = 'padding:6px 10px;border:0;border-radius:8px;background:#222;color:#fff;cursor:pointer';
            b.onclick = function () {
              eps.textContent = 'Cargando episodios…';
              tmdbGet('/tv/' + id + '/season/' + s.season_number).then(function (season) {
                eps.innerHTML = '';
                (season.episodes || []).forEach(function (ep) {
                  var row = document.createElement('div');
                  row.style.cssText = 'display:flex;gap:10px;padding:8px 0;border-top:1px solid #222';
                  var still = ep.still_path ? '<img alt="" src="' + tmdbImg(ep.still_path) + '" style="width:120px;height:68px;object-fit:cover;border-radius:6px">' : '';
                  row.innerHTML = still + '<div><b>' + ep.episode_number + '. ' + String(ep.name || '').replace(/[&<>]/g, '') + '</b>' +
                    '<div style="opacity:.8;font-size:13px;margin-top:4px">' + String(ep.overview || 'Sin descripción.').replace(/[&<>]/g, '') + '</div></div>';
                  eps.appendChild(row);
                });
                if (!eps.childNodes.length) eps.textContent = 'Esta temporada no tiene episodios.';
              });
            };
            pick.appendChild(b);
          });
          grid.appendChild(pick);
          grid.appendChild(eps);
          if (pick.firstChild) pick.firstChild.click();
        }
      }).catch(function () { grid.textContent = 'No se pudo abrir esta ficha.'; });
    }
    bar.querySelector('[data-k="movie"]').onclick = function () { kind = 'movie'; loadList(); };
    bar.querySelector('[data-k="tv"]').onclick = function () { kind = 'tv'; loadList(); };
    var qt;
    bar.querySelector('[data-q]').oninput = function () { clearTimeout(qt); qt = setTimeout(loadList, 350); };
    loadList();
  }
  function moviesApp(root) {
    if (!document.getElementById('drift-mv-css')) {
      var st = document.createElement('style');
      st.id = 'drift-mv-css';
      st.textContent = '#drift-mv{height:100%;overflow:auto;background:#0d0d0e;color:#f2f2f2;font-family:Inter,system-ui,sans-serif}'
        + '#drift-mv *{box-sizing:border-box}'
        + '#drift-mv .page-head{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 22px;background:rgba(13,13,14,.9);backdrop-filter:blur(14px)}'
        + '#drift-mv .page-title{font-size:17px;font-weight:650}'
        + '#drift-mv .search-btn{display:flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:#171718;color:rgba(242,242,242,.55);cursor:pointer}'
        + '#drift-mv .hero{position:relative;margin:0 22px;height:min(420px,52vh);min-height:240px;border-radius:26px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:#111}'
        + '#drift-mv .hero-bg{position:absolute;inset:0;background-size:cover;background-position:center 22%}'
        + '#drift-mv .hero-shade{position:absolute;inset:0;background:linear-gradient(to right,rgba(8,8,8,.9),transparent 70%),linear-gradient(to top,rgba(8,8,8,.88),transparent 50%)}'
        + '#drift-mv .hero-copy{position:absolute;left:0;bottom:0;z-index:2;padding:0 36px 32px;max-width:620px}'
        + '#drift-mv .hero-copy h2{margin:0 0 8px;font-size:clamp(26px,4vw,44px);letter-spacing:-.03em}'
        + '#drift-mv .hero-copy p{margin:0 0 16px;color:rgba(255,255,255,.78);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}'
        + '#drift-mv .play{height:44px;padding:0 22px;border:0;border-radius:999px;background:#fff;color:#111;font-weight:700;cursor:pointer}'
        + '#drift-mv .dots{position:absolute;right:18px;bottom:18px;z-index:3;display:flex;gap:6px}'
        + '#drift-mv .dots button{width:8px;height:4px;border:0;border-radius:99px;background:rgba(255,255,255,.35);cursor:pointer}'
        + '#drift-mv .dots button.on{width:26px;background:#fff}'
        + '#drift-mv .sec{padding:26px 0 4px}'
        + '#drift-mv .sec h3{margin:0 22px 12px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:rgba(242,242,242,.5);display:flex;justify-content:space-between;align-items:center;gap:10px}'
        + '#drift-mv .row{display:flex;gap:14px;overflow-x:auto;padding:6px 22px 14px;scrollbar-width:none}'
        + '#drift-mv .card{flex:none;width:250px;cursor:pointer;color:inherit}'
        + '#drift-mv .thumb{position:relative;aspect-ratio:16/9;border-radius:18px;overflow:hidden;background:#171718;border:1px solid rgba(255,255,255,.08)}'
        + '#drift-mv .thumb img{width:100%;height:100%;object-fit:cover;display:block}'
        + '#drift-mv .rank{position:absolute;left:8px;bottom:-6px;font-size:54px;font-weight:800;color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.35)}'
        + '#drift-mv .meta{display:flex;gap:8px;align-items:center;font-size:12px;color:rgba(242,242,242,.55);margin-top:4px}'
        + '#drift-mv .badge{font-size:10px;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;border-radius:99px;background:rgba(255,255,255,.1)}'
        + '#drift-mv .tog{display:flex;padding:3px;border-radius:99px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.08)}'
        + '#drift-mv .tog button{border:0;background:transparent;color:rgba(242,242,242,.55);border-radius:99px;padding:5px 12px;cursor:pointer}'
        + '#drift-mv .tog button.on{background:#fff;color:#111;font-weight:700}'
        + '#drift-mv .chips,#drift-mv .pills{display:flex;gap:8px;overflow-x:auto;padding:0 22px 10px}'
        + '#drift-mv .chip,#drift-mv .pill{flex:none;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:#171718;color:rgba(242,242,242,.7);cursor:pointer}'
        + '#drift-mv .chip{padding:12px 16px}'
        + '#drift-mv .chip.on,#drift-mv .pill.on{border-color:rgba(255,255,255,.7);color:#fff}'
        + '#drift-mv .pill{height:34px;padding:0 14px;border-radius:99px}'
        + '#drift-mv .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;padding:0 22px 24px}'
        + '#drift-mv .grid .card{width:auto}'
        + '#drift-mv .ov{position:absolute;inset:0;z-index:20;background:rgba(5,5,5,.82);display:flex;align-items:flex-start;justify-content:center;padding:24px 12px;overflow:auto}'
        + '#drift-mv .box{width:min(860px,100%);background:#111113;border:1px solid rgba(255,255,255,.16);border-radius:24px;overflow:hidden}'
        + '#drift-mv .ep{display:flex;gap:12px;padding:10px;border-radius:14px;cursor:pointer}'
        + '#drift-mv .ep:hover{background:rgba(255,255,255,.05)}'
        + '#drift-mv .ep img{width:140px;height:78px;object-fit:cover;border-radius:10px;background:#222}'
        + '#drift-mv .player{position:absolute;inset:0;z-index:30;background:#000;display:flex;flex-direction:column}'
        + '#drift-mv .player iframe{flex:1;border:0;width:100%;background:#000}';
      document.head.appendChild(st);
    }
    root.innerHTML = '';
    root.style.cssText = 'height:100%;min-height:0;position:relative;overflow:hidden;background:#0d0d0e';
    var host = document.createElement('div');
    host.id = 'drift-mv';
    root.appendChild(host);
    var PROVIDERS = [
      { id: 8, name: 'Netflix' }, { id: 9, name: 'Apple TV+' }, { id: 119, name: 'Prime' },
      { id: 15, name: 'Hulu' }, { id: 1899, name: 'Max' }, { id: 531, name: 'Paramount+' }, { id: 337, name: 'Disney+' }
    ];
    var heroItems = [], heroIdx = 0, heroTimer = null, prov = PROVIDERS[0], provType = 'movie', ratedType = 'movie', genreType = 'movie', genreId = null;
    function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&', '<': '<', '>': '>', '"': '"' }[c]; }); }
    function pic(path, size) { return path ? 'https://image.tmdb.org/t/p/' + size + path : ''; }
    function recent() { try { return JSON.parse(localStorage.getItem('wos:mv-recent') || '[]'); } catch (e) { return []; } }
    function remember(item, type) {
      var list = recent().filter(function (x) { return !(x.id === item.id && x.type === type); });
      list.unshift({ id: item.id, type: type, title: item.title || item.name, backdrop_path: item.backdrop_path, poster_path: item.poster_path });
      try { localStorage.setItem('wos:mv-recent', JSON.stringify(list.slice(0, 12))); } catch (e) {}
    }
    function card(item, type, rank) {
      var title = item.title || item.name || '';
      var year = (item.release_date || item.first_air_date || '').slice(0, 4);
      var vote = item.vote_average ? Number(item.vote_average).toFixed(1) : '';
      var el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = '<div class="thumb">' + (pic(item.backdrop_path || item.poster_path, 'w780') ? '<img alt="" src="' + pic(item.backdrop_path || item.poster_path, 'w780') + '">' : '') + (rank ? '<div class="rank">' + rank + '</div>' : '') + '</div><b>' + esc(title) + '</b><div class="meta"><span class="badge">' + (type === 'tv' ? 'Series' : 'Movie') + '</span>' + (year ? '<span>' + year + '</span>' : '') + (vote ? '<span>★ ' + vote + '</span>' : '') + '</div>';
      el.onclick = function () { if (type === 'tv') openSeasons(item); else play(item, 'movie'); };
      return el;
    }
    function fill(sel, items, type, ranked) {
      var el = host.querySelector(sel);
      el.innerHTML = '';
      (items || []).slice(0, ranked ? 10 : 14).forEach(function (item, i) { el.appendChild(card(item, type, ranked ? i + 1 : 0)); });
      if (!el.childNodes.length) el.textContent = 'No results';
    }
    function hero() {
      var item = heroItems[heroIdx];
      if (!item) return;
      var bg = host.querySelector('.hero-bg');
      bg.style.backgroundImage = item.backdrop_path ? 'url("' + pic(item.backdrop_path, 'w1280') + '")' : '';
      host.querySelector('.hero-copy h2').textContent = item.title || item.name || '';
      host.querySelector('.hero-copy p').textContent = item.overview || '';
      host.querySelector('.hero-copy .score').textContent = item.vote_average ? Math.round(item.vote_average * 10) + '%' : '';
      host.querySelector('.play').onclick = function () { play(item, 'movie'); };
      host.querySelectorAll('.dots button').forEach(function (b, i) { b.classList.toggle('on', i === heroIdx); });
    }
    function play(item, type, season, episode) {
      remember(item, type);
      var view = document.createElement('div');
      view.className = 'player';
      view.innerHTML = '<div style="display:flex;gap:10px;align-items:center;padding:10px 12px;background:#111"><button type="button" data-back style="border:0;border-radius:8px;padding:8px 12px;background:#222;color:#fff;cursor:pointer">Back</button><b></b></div><div data-slot style="flex:1;display:grid;place-items:center;color:#aaa">Loading…</div>';
      view.querySelector('b').textContent = (item.title || item.name || '') + (episode ? ' · S' + season + 'E' + episode : '');
      view.querySelector('[data-back]').onclick = function () { view.remove(); paintRecent(); };
      host.appendChild(view);
      var sources = type === 'tv'
        ? [
            ['Videasy', 'https://player.videasy.net/tv/' + item.id + '/' + (season || 1) + '/' + (episode || 1)],
            ['VidSrc', 'https://vidsrc.cc/v2/embed/tv/' + item.id + '/' + (season || 1) + '/' + (episode || 1)]
          ]
        : [
            ['Videasy', 'https://player.videasy.net/movie/' + item.id],
            ['VidSrc', 'https://vidsrc.cc/v2/embed/movie/' + item.id]
          ];
      var slot = view.querySelector('[data-slot]');
      function useSrc(i) {
        var src = sources[i];
        if (!src) return;
        var frame = document.createElement('iframe');
        frame.setAttribute('credentialless', '');
        frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
        frame.setAttribute('allowfullscreen', '');
        frame.setAttribute('data-slot', '');
        frame.src = src[1];
        var old = view.querySelector('[data-slot]');
        if (old) old.replaceWith(frame);
        else view.appendChild(frame);
      }
      var pick = document.createElement('div');
      pick.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;padding:8px 12px;background:#111';
      sources.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = s[0];
        b.style.cssText = 'border:0;border-radius:999px;padding:6px 10px;background:#222;color:#fff;cursor:pointer';
        b.onclick = function () { useSrc(i); };
        pick.appendChild(b);
      });
      if (slot) view.insertBefore(pick, slot);
      else view.appendChild(pick);
      useSrc(0);
      var watchPath = (type === 'tv' ? '/tv/' : '/movie/') + item.id + '/watch/providers';
      tmdbGet(watchPath).then(function (w) {
        var region = (w && w.results && (w.results.MX || w.results.US)) || {};
        var offers = (region.flatrate || []).concat(region.rent || []).concat(region.buy || []);
        var seen = {};
        var bar = document.createElement('div');
        bar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;padding:8px 12px;background:#111';
        offers.forEach(function (o) {
          if (!o || seen[o.provider_name]) return;
          seen[o.provider_name] = 1;
          var a = document.createElement('a');
          a.textContent = o.provider_name;
          a.href = region.link || 'https://www.themoviedb.org/' + (type === 'tv' ? 'tv' : 'movie') + '/' + item.id + '/watch';
          a.target = '_blank';
          a.rel = 'noopener';
          a.style.cssText = 'color:#fff;background:#222;border-radius:999px;padding:6px 10px;font-size:12px;text-decoration:none';
          bar.appendChild(a);
        });
        if (bar.childNodes.length) {
          var anchor = view.querySelector('[data-slot]') || view.querySelector('iframe');
          if (anchor) view.insertBefore(bar, anchor);
          else view.appendChild(bar);
        }
      }).catch(function () {});
    }
    function openSeasons(item) {
      var ov = document.createElement('div');
      ov.className = 'ov';
      ov.innerHTML = '<div class="box"><div style="height:140px;background:#171718 center/cover"></div><div style="padding:14px 16px;display:flex;justify-content:space-between;gap:10px;align-items:center"><b></b><select data-s style="height:36px;border-radius:99px;background:#111;color:#fff;border:1px solid #333;padding:0 10px"></select></div><div data-eps style="padding:0 8px 12px;max-height:46vh;overflow:auto"></div></div>';
      ov.querySelector('b').textContent = item.name || item.title || '';
      if (item.backdrop_path) ov.querySelector('.box > div').style.backgroundImage = 'url("' + pic(item.backdrop_path, 'w780') + '")';
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
      host.appendChild(ov);
      var sel = ov.querySelector('[data-s]'), eps = ov.querySelector('[data-eps]');
      function loadEps(n) {
        eps.textContent = 'Loading episodes…';
        tmdbGet('/tv/' + item.id + '/season/' + n).then(function (s) {
          eps.innerHTML = '';
          (s.episodes || []).forEach(function (ep) {
            var row = document.createElement('div');
            row.className = 'ep';
            row.innerHTML = (ep.still_path ? '<img alt="" src="' + pic(ep.still_path, 'w300') + '">' : '<img alt="">') + '<div><b>E' + ep.episode_number + ' ' + esc(ep.name || '') + '</b><div style="opacity:.7;font-size:13px;margin-top:4px">' + esc(ep.overview || '') + '</div></div>';
            row.onclick = function () { ov.remove(); play(item, 'tv', n, ep.episode_number); };
            eps.appendChild(row);
          });
          if (!eps.childNodes.length) eps.textContent = 'No episodes.';
        }).catch(function () { eps.textContent = 'Failed to load.'; });
      }
      tmdbGet('/tv/' + item.id).then(function (d) {
        var seasons = (d.seasons || []).filter(function (s) { return s.season_number > 0; });
        sel.innerHTML = seasons.map(function (s) { return '<option value="' + s.season_number + '">Season ' + s.season_number + '</option>'; }).join('');
        sel.onchange = function () { loadEps(sel.value); };
        if (seasons.length) loadEps(seasons[0].season_number);
      }).catch(function () { eps.textContent = 'Failed to load.'; });
    }
    function paintRecent() {
      var row = host.querySelector('[data-recent]');
      var sec = host.querySelector('[data-recent-sec]');
      var list = recent();
      sec.style.display = list.length ? '' : 'none';
      row.innerHTML = '';
      list.forEach(function (item) { row.appendChild(card(item, item.type || 'movie', 0)); });
    }
    function watchBase() {
      try { return (localStorage.getItem('wos:watch-worker') || '').replace(/\/$/, ''); } catch (e) { return ''; }
    }
    function mountSwitch(active) {
      var box = host.querySelector('[data-switch]');
      if (!box) return;
      var names = [['tmdb', 'TMDB'], ['watchmode', 'Watchmode'], ['motn', 'Dónde verla'], ['archive', 'Archive']];
      box.innerHTML = names.map(function (n) {
        return '<button type="button" data-p="' + n[0] + '" style="height:32px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.16);cursor:pointer;' + (n[0] === active ? 'background:#fff;color:#111' : 'background:transparent;color:#fff') + '">' + n[1] + '</button>';
      }).join('') + '<input data-worker placeholder="URL del worker nuevo" style="height:32px;min-width:180px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:#171718;color:#fff;padding:0 12px">';
      var inp = box.querySelector('[data-worker]');
      inp.value = watchBase();
      inp.onchange = function () { try { localStorage.setItem('wos:watch-worker', inp.value.trim()); } catch (e) {} };
      box.querySelectorAll('[data-p]').forEach(function (b) {
        b.onclick = function () { if (b.dataset.p === 'tmdb') bootTmdb(); else showCatalog(b.dataset.p); };
      });
    }
    function showCatalog(kind) {
      if (heroTimer) clearInterval(heroTimer);
      host.innerHTML = '<div class="page-head"><div class="page-title">Movies & Shows</div></div><div data-switch style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:8px 22px"></div><div class="grid" data-cat style="padding-top:12px"></div>';
      mountSwitch(kind);
      var cat = host.querySelector('[data-cat]');
      var base = watchBase();
      if (!base) { cat.textContent = 'Pega arriba la URL del worker nuevo y pulsa el proveedor otra vez.'; return; }
      cat.textContent = 'Loading…';
      var path = kind === 'watchmode' ? '/watchmode/list' : kind === 'motn' ? '/motn/list' : '/archive/list';
      fetch(base + path).then(function (r) { return r.json(); }).then(function (data) {
        cat.innerHTML = '';
        if (kind === 'archive') {
          fetch(base + '/archive/live').then(function (r) { return r.json(); }).then(function (live) {
            (live.items || []).forEach(function (ch) {
              var el = document.createElement('div');
              el.className = 'card';
              el.innerHTML = '<div class="thumb"></div><b>' + esc(ch.title) + '</b><div class="meta"><span class="badge">Live</span></div>';
              el.onclick = function () { playUrl(ch.title, ch.url); };
              cat.appendChild(el);
            });
          }).catch(function () {});
        }
        var items = kind === 'watchmode' ? (data.titles || []) : kind === 'motn' ? (Array.isArray(data) ? data : (data.shows || [])) : (data.items || []);
        if (data.error) { cat.textContent = data.error; return; }
        items.slice(0, 24).forEach(function (item) {
          var title = item.title || item.name || '';
          var el = document.createElement('div');
          el.className = 'card';
          var img = item.image_url || item.posterMedium || (item.imageSet && item.imageSet.verticalPoster && item.imageSet.verticalPoster.w360) || '';
          el.innerHTML = '<div class="thumb">' + (img ? '<img alt="" src="' + esc(img) + '">' : '') + '</div><b>' + esc(title) + '</b><div class="meta"><span class="badge">' + (kind === 'archive' ? 'Public domain' : 'Link') + '</span></div>';
          el.onclick = function () {
            if (kind === 'archive') {
              fetch(base + '/archive/file?id=' + encodeURIComponent(item.id)).then(function (r) { return r.json(); }).then(function (f) {
                if (f.url) playUrl(title, f.url); else cat.insertAdjacentHTML('afterbegin', '<div>No mp4</div>');
              });
              return;
            }
            if (kind === 'watchmode' && item.id) {
              fetch(base + '/watchmode/sources?id=' + encodeURIComponent(item.id)).then(function (r) { return r.json(); }).then(function (s) {
                var src = (Array.isArray(s) ? s : [])[0];
                if (src && src.web_url) window.open(src.web_url, '_blank');
                else cat.insertAdjacentHTML('afterbegin', '<div>Watchmode no dio un enlace.</div>');
              });
              return;
            }
            var link = (item.streamingOptions && item.streamingOptions.mx && item.streamingOptions.mx[0] && item.streamingOptions.mx[0].link) || item.streamingUrl || '';
            if (link) window.open(link, '_blank');
          };
          cat.appendChild(el);
        });
        if (!cat.childNodes.length) cat.textContent = 'Sin resultados.';
      }).catch(function () { cat.textContent = 'No se pudo cargar ese proveedor.'; });
    }
    function playUrl(title, url) {
      var view = document.createElement('div');
      view.className = 'player';
      view.innerHTML = '<div style="display:flex;gap:10px;align-items:center;padding:10px 12px;background:#111"><button type="button" data-back style="border:0;border-radius:8px;padding:8px 12px;background:#222;color:#fff;cursor:pointer">Back</button><b></b></div><video controls autoplay style="flex:1;width:100%;background:#000"></video>';
      view.querySelector('b').textContent = title;
      view.querySelector('video').src = url;
      view.querySelector('[data-back]').onclick = function () { view.remove(); };
      host.appendChild(view);
    }
    function shell() {
      host.innerHTML = '<div class="page-head"><div class="page-title">Movies & Shows</div><button type="button" class="search-btn">Search movies & shows</button></div>'
        + '<div data-switch style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:8px 22px"></div>'
        + '<div class="hero"><div class="hero-bg"></div><div class="hero-shade"></div><div class="hero-copy"><h2></h2><div class="score" style="margin-bottom:8px;font-size:13px"></div><p></p><button type="button" class="play">Play</button></div><div class="dots"></div></div>'
        + '<div class="sec" data-recent-sec style="display:none"><h3>Continue Watching</h3><div class="row" data-recent></div></div>'
        + '<div class="sec"><h3>Top 10 Movies</h3><div class="row" data-movies></div></div>'
        + '<div class="sec"><h3>Top 10 Shows</h3><div class="row" data-shows></div></div>'
        + '<div class="sec"><h3>Streaming Providers <span class="tog" data-prov-tog><button type="button" class="on" data-t="movie">Movies</button><button type="button" data-t="tv">TV Shows</button></span></h3><div class="chips" data-chips></div><div class="row" data-prov></div></div>'
        + '<div class="sec"><h3>Top Rated <span class="tog" data-rated-tog><button type="button" class="on" data-t="movie">Movies</button><button type="button" data-t="tv">TV Shows</button></span></h3><div class="row" data-rated></div></div>'
        + '<div class="sec"><h3>Browse by Genre <span class="tog" data-genre-tog><button type="button" class="on" data-t="movie">Movies</button><button type="button" data-t="tv">TV Shows</button></span></h3><div class="pills" data-pills></div><div class="grid" data-genre></div></div>';
      host.querySelector('.search-btn').onclick = openSearch;
      host.querySelector('[data-prov-tog]').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; provType = b.dataset.t; mark(host.querySelector('[data-prov-tog]'), b); loadProv(); };
      host.querySelector('[data-rated-tog]').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; ratedType = b.dataset.t; mark(host.querySelector('[data-rated-tog]'), b); loadRated(); };
      host.querySelector('[data-genre-tog]').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; genreType = b.dataset.t; genreId = null; mark(host.querySelector('[data-genre-tog]'), b); loadGenres(); };
      mountSwitch('tmdb');
    }
    function mark(wrap, btn) { wrap.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === btn); }); }
    function chips() {
      var el = host.querySelector('[data-chips]');
      el.innerHTML = '';
      PROVIDERS.forEach(function (p) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'chip' + (p.id === prov.id ? ' on' : ''); b.textContent = p.name;
        b.onclick = function () { prov = p; chips(); loadProv(); };
        el.appendChild(b);
      });
    }
    function loadProv() {
      host.querySelector('[data-prov]').textContent = 'Loading…';
      tmdbGet('/discover/' + provType + '?with_watch_providers=' + prov.id + '&watch_region=US&sort_by=popularity.desc').then(function (j) {
        fill('[data-prov]', j.results || [], provType, false);
      }).catch(function () { host.querySelector('[data-prov]').textContent = 'Failed to load'; });
    }
    function loadRated() {
      tmdbGet('/' + ratedType + '/top_rated').then(function (j) { fill('[data-rated]', j.results || [], ratedType, false); }).catch(function () {});
    }
    function loadGenres() {
      tmdbGet('/genre/' + genreType + '/list').then(function (j) {
        var pills = host.querySelector('[data-pills]');
        pills.innerHTML = '';
        (j.genres || []).forEach(function (g, i) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'pill' + ((!genreId && i === 0) || genreId === g.id ? ' on' : ''); b.textContent = g.name;
          b.onclick = function () { genreId = g.id; pills.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); loadGenreGrid(); };
          pills.appendChild(b);
          if (!genreId && i === 0) genreId = g.id;
        });
        loadGenreGrid();
      }).catch(function () {});
    }
    function loadGenreGrid() {
      if (!genreId) return;
      var grid = host.querySelector('[data-genre]');
      grid.textContent = 'Loading…';
      tmdbGet('/discover/' + genreType + '?with_genres=' + genreId + '&sort_by=popularity.desc').then(function (j) {
        grid.innerHTML = '';
        (j.results || []).slice(0, 12).forEach(function (item) { grid.appendChild(card(item, genreType, 0)); });
      }).catch(function () { grid.textContent = 'Failed to load'; });
    }
    function openSearch() {
      var ov = document.createElement('div');
      ov.className = 'ov';
      ov.innerHTML = '<div style="width:min(720px,100%)"><input data-q placeholder="Search movies & shows" style="width:100%;height:52px;border-radius:999px;border:1px solid rgba(255,255,255,.2);background:#171718;color:#fff;padding:0 18px;font-size:16px"><div class="grid" data-res style="padding-top:16px"></div></div>';
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
      var t;
      ov.querySelector('[data-q]').oninput = function (e) {
        clearTimeout(t);
        var q = e.target.value.trim();
        var res = ov.querySelector('[data-res]');
        if (!q) { res.innerHTML = ''; return; }
        t = setTimeout(function () {
          Promise.all([tmdbGet('/search/movie?query=' + encodeURIComponent(q)), tmdbGet('/search/tv?query=' + encodeURIComponent(q))]).then(function (both) {
            res.innerHTML = '';
            var items = (both[0].results || []).map(function (x) { x._t = 'movie'; return x; }).concat((both[1].results || []).map(function (x) { x._t = 'tv'; return x; }));
            items.sort(function (a, b) { return (b.popularity || 0) - (a.popularity || 0); });
            items.slice(0, 12).forEach(function (item) {
              var c = card(item, item._t, 0);
              var old = c.onclick;
              c.onclick = function () { ov.remove(); old(); };
              res.appendChild(c);
            });
          }).catch(function () { res.textContent = 'Search failed'; });
        }, 280);
      };
      host.appendChild(ov);
      ov.querySelector('[data-q]').focus();
    }
    function bootTmdb() {
      shell();
      paintRecent();
      chips();
      Promise.all([tmdbGet('/trending/movie/week'), tmdbGet('/trending/tv/week')]).then(function (both) {
        var movies = (both[0] && both[0].results) || [];
        var shows = (both[1] && both[1].results) || [];
        heroItems = movies.filter(function (m) { return m.backdrop_path; }).slice(0, 5);
        var dots = host.querySelector('.dots');
        dots.innerHTML = heroItems.map(function (_, i) { return '<button type="button"' + (i === 0 ? ' class="on"' : '') + '></button>'; }).join('');
        dots.querySelectorAll('button').forEach(function (b, i) { b.onclick = function () { heroIdx = i; hero(); clearInterval(heroTimer); heroTimer = setInterval(function () { heroIdx = (heroIdx + 1) % heroItems.length; hero(); }, 8000); }; });
        if (heroItems.length) { hero(); heroTimer = setInterval(function () { heroIdx = (heroIdx + 1) % heroItems.length; hero(); }, 8000); }
        fill('[data-movies]', movies, 'movie', true);
        fill('[data-shows]', shows, 'tv', true);
      }).catch(function () { host.querySelector('[data-movies]').textContent = 'No se pudo cargar TMDB.'; });
      loadProv();
      loadRated();
      loadGenres();
    }
    bootTmdb();
  }
  function windowsEmulator(root) {
    root.innerHTML = '';
    root.style.cssText = 'height:100%;min-height:0;display:flex;flex-direction:column;background:#0b0b0d;color:#eee';
    var bar = document.createElement('div');
    bar.style.cssText = 'flex:none;display:flex;gap:6px;align-items:center;padding:6px 8px;background:#1a1a1f;overflow:hidden;scrollbar-width:none;border-bottom:1px solid #2a2a32';
    var filesBox = document.createElement('div');
    filesBox.style.cssText = 'display:flex;gap:6px;align-items:center;min-width:0';
    bar.appendChild(filesBox);
    var stage = document.createElement('div');
    stage.style.cssText = 'flex:1;min-height:0;display:flex;flex-direction:column';
    var frameHost = document.createElement('div');
    frameHost.style.cssText = 'flex:1;min-height:0;position:relative;background:#000';
    var editor = document.createElement('div');
    editor.style.cssText = 'display:none;flex:none;height:38%;min-height:120px;border-top:1px solid #2a2a32;background:#1e1e1e;flex-direction:column';
    var edBar = document.createElement('div');
    edBar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 8px;font-size:12px;background:#252526';
    var edName = document.createElement('b');
    edName.style.flex = '1';
    var closeEd = document.createElement('button');
    closeEd.type = 'button';
    closeEd.textContent = '×';
    closeEd.style.cssText = 'border:0;background:transparent;color:#ccc;font-size:16px;cursor:pointer';
    edBar.appendChild(edName);
    edBar.appendChild(closeEd);
    var ta = document.createElement('textarea');
    ta.spellcheck = false;
    ta.style.cssText = 'flex:1;width:100%;border:0;resize:none;background:#1e1e1e;color:#d4d4d4;padding:8px;font:13px/1.45 ui-monospace,monospace;outline:none;min-height:0';
    editor.appendChild(edBar);
    editor.appendChild(ta);
    stage.appendChild(frameHost);
    stage.appendChild(editor);
    root.appendChild(bar);
    root.appendChild(stage);
    var KEY = 'wos:winjs';
    function load() {
      try {
        var a = JSON.parse(localStorage.getItem(KEY) || '[]');
        return Array.isArray(a) ? a.filter(function (f) { return f && /\.js$/i.test(String(f.name || '')); }) : [];
      } catch (e) { return []; }
    }
    function persist(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
    var files = load();
    var current = -1;
    function paint() {
      filesBox.innerHTML = '';
      files.forEach(function (f, i) {
        var wrap = document.createElement('span');
        wrap.style.cssText = 'display:inline-flex;align-items:center;gap:2px';
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = f.name;
        b.style.cssText = 'padding:4px 8px;border-radius:8px;border:1px solid #333;background:' + (i === current ? '#0078d4' : '#2a2a32') + ';color:#fff;cursor:pointer;font-size:12px';
        b.onclick = function () { openFile(i); };
        var x = document.createElement('button');
        x.type = 'button';
        x.textContent = '×';
        x.title = 'Delete';
        x.style.cssText = 'border:0;background:transparent;color:#bbb;cursor:pointer';
        x.onclick = function (e) {
          e.stopPropagation();
          if (current === i && files[current]) files[current].text = ta.value;
          files.splice(i, 1);
          if (current === i) { current = -1; editor.style.display = 'none'; }
          else if (current > i) current--;
          persist(files);
          paint();
        };
        wrap.appendChild(b);
        wrap.appendChild(x);
        filesBox.appendChild(wrap);
      });
    }
    function openFile(i) {
      if (current >= 0 && files[current]) files[current].text = ta.value;
      current = i;
      editor.style.display = 'flex';
      edName.textContent = files[i].name;
      ta.value = files[i].text || '';
      persist(files);
      paint();
    }
    ta.addEventListener('input', function () {
      if (current >= 0 && files[current]) { files[current].text = ta.value; persist(files); }
    });
    closeEd.onclick = function () {
      if (current >= 0 && files[current]) files[current].text = ta.value;
      persist(files);
      current = -1;
      editor.style.display = 'none';
      paint();
    };
    paint();
    root.querySelectorAll('button').forEach(function (b) {
      if (/^\+\s*\.?js$/i.test(String(b.textContent || '').trim())) b.remove();
    });
    if (typeof window.openProxied === 'function') window.openProxied('https://win11.blueedge.me/', frameHost);
    else {
      var fr = document.createElement('iframe');
      fr.setAttribute('credentialless', '');
      fr.src = 'https://win11.blueedge.me/';
      fr.setAttribute('allow', 'fullscreen; clipboard-read; clipboard-write');
      fr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#000';
      frameHost.appendChild(fr);
    }
  }
  function wireAskedApps() {
    if (!window.XAPPS || !window.APPS) return;
    var IC = window.IC || (window.IC = {});
    window.APPS.aleks = 'ALEKS';
    window.APPS.espn = 'ESPN';
    window.APPS.winemu = 'Windows emulator';
    window.APPS.gbuild = 'Game Builder';
    window.APPS.minecraft = 'Minecraft';
    window.APPS.gforms = 'Google Forms';
    IC.gforms = '<svg viewBox="0 0 48 48" width="100%" height="100%"><rect width="48" height="48" rx="10" fill="#673AB7"/><path fill="#fff" d="M14 12h14l8 8v16a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z"/><path fill="#D1C4E9" d="M28 12v8h8"/><path fill="#673AB7" d="M18 26h12v2H18zm0 5h12v2H18zm0 5h8v2h-8z"/></svg>';
    window.XAPPS.aleks = { n: 'ALEKS', f: driftSite('https://www.aleks.com/') };
    window.XAPPS.winemu = { n: 'Windows emulator', f: windowsEmulator };
    window.XAPPS.gbuild = { n: 'Game Builder', f: driftSite('https://tesana.com/create') };
    window.XAPPS.minecraft = { n: 'Minecraft', f: function (root) {
      var target = 'https://eaglercraft.com/mc/1.8.8/';
      var via = 'https://translate.google.com/translate?sl=auto&tl=es&u=' + encodeURIComponent(target);
      operaPage(via, 'firefox', true)(root);
    } };
    window.XAPPS.espn = { n: 'ESPN', f: espnApp };
    window.XAPPS.gforms = { n: 'Google Forms', f: function (root) {
      root.innerHTML = '<div style="height:100%;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;padding:24px;text-align:center;font:14px system-ui;background:#fff;color:#111"><b style="font-size:18px">Google Forms</b><div style="max-width:420px;opacity:.7">Pega el link del formulario. Se abre aquí, con Firefox.</div><input data-u placeholder="https://docs.google.com/forms/..." style="width:min(480px,100%);padding:10px;border-radius:10px;border:1px solid #ccc;box-sizing:border-box"><button data-go type="button" style="padding:10px 16px;border:0;border-radius:10px;background:#c5c8ce;color:#111;font-weight:700;cursor:pointer">Abrir</button></div>';
      var input = root.querySelector('[data-u]');
      try { input.value = localStorage.getItem('wos:gforms') || ''; } catch (e) {}
      root.querySelector('[data-go]').onclick = function () {
        var u = String(input.value || '').trim();
        if (!/^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/i.test(u)) {
          input.value = '';
          input.placeholder = 'Tiene que ser un link de Google Forms';
          return;
        }
        try { localStorage.setItem('wos:gforms', u); } catch (e) {}
        operaPage(u, 'firefox', true)(root);
      };
    } };
    window.XAPPS.yt = { n: 'YouTube', f: youtubeApp };
    window.XAPPS.tt = { n: 'TikTok', f: function (root) {
      root.innerHTML = '';
      root.style.cssText = 'height:100%;min-height:0;position:relative;background:#000;color:#fff;display:flex;flex-direction:column';
      var bar = document.createElement('div');
      bar.style.cssText = 'flex:none;display:flex;gap:8px;align-items:center;padding:8px 10px;font:12px system-ui;background:#111';
      bar.innerHTML = '<b>TikTok</b><span data-st style="opacity:.75">For You · proxy</span><button type="button" data-next style="margin-left:auto;border:0;border-radius:8px;background:#fe2c55;color:#fff;padding:6px 10px;cursor:pointer">Siguiente</button>';
      var video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.autoplay = true;
      video.style.cssText = 'flex:1;min-height:0;width:100%;background:#000;object-fit:contain';
      var cap = document.createElement('div');
      cap.style.cssText = 'flex:none;padding:8px 10px;font:13px/1.35 system-ui;max-height:72px;overflow:hidden';
      root.appendChild(bar);
      root.appendChild(video);
      root.appendChild(cap);
      var status = bar.querySelector('[data-st]');
      var queue = [];
      var cursor = '0';
      var idx = 0;
      function show(item) {
        if (!item) return;
        video.src = item.play;
        video.play().catch(function () {});
        cap.textContent = (item.author ? '@' + item.author + ' · ' : '') + (item.title || '');
        status.textContent = 'For You · proxy';
      }
      function more() {
        return fetch('/api/tt-feed?cursor=' + encodeURIComponent(cursor))
          .then(function (r) { if (!r.ok) throw new Error('feed ' + r.status); return r.json(); })
          .then(function (j) {
            var items = j.items || [];
            if (j.cursor) cursor = String(j.cursor);
            items.forEach(function (it) { if (it && it.play) queue.push(it); });
            return items.length;
          });
      }
      function site() {
        status.textContent = 'For You · proxy';
        video.remove();
        cap.remove();
        var frame = document.createElement('iframe');
        frame.title = 'TikTok';
        frame.setAttribute('referrerpolicy', 'no-referrer');
        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals allow-downloads allow-pointer-lock');
        frame.style.cssText = 'flex:1;min-height:0;width:100%;border:0;background:#000';
        frame.src = '/api/opera?u=' + encodeURIComponent('https://www.tiktok.com/foryou') + '&b=firefox';
        root.appendChild(frame);
        bar.querySelector('[data-next]').style.display = 'none';
      }
      function next() {
        if (idx < queue.length) { show(queue[idx++]); return; }
        status.textContent = 'Cargando el feed…';
        more().then(function (n) {
          if (idx < queue.length) { show(queue[idx++]); return; }
          if (!n) site();
        }).catch(function () { site(); });
      }
      bar.querySelector('[data-next]').onclick = next;
      video.addEventListener('ended', next);
      video.addEventListener('error', function () { status.textContent = 'Ese video falló. Siguiente.'; next(); });
      next();
    } };
    window.XAPPS.gem = { n: 'Gemini', f: driftSite('https://gemini.google.com/app') };
    window.XAPPS.movies = { n: 'Movies', f: function (root) {
      var prov = 'racial';
      try {
        if (localStorage.getItem('wos:movies-racial') !== '1') {
          localStorage.setItem('wos:movies', 'racial');
          localStorage.setItem('wos:movies-racial', '1');
        }
        prov = localStorage.getItem('wos:movies') || 'racial';
      } catch (e) {}
      if (prov !== 'onlyflix' && prov !== 'noah') {
        root.innerHTML = '';
        root.style.cssText = 'height:100%;min-height:0;position:relative;overflow:hidden;background:#000';
        var page = 'https://racialequityleadership.com/movies.html';
        if (typeof window.openProxied !== 'function') return moviesApp(root);
        Promise.resolve(window.openProxied(page, root)).then(function (f) {
          var timer = setInterval(function () {
            if (!root.isConnected) { clearInterval(timer); return; }
            var fr = (f && f.frame) || root.querySelector('iframe');
            if (!fr) return;
            try {
              var doc = fr.contentDocument;
              if (doc && !doc.getElementById('drift-racial-hide')) {
                var st = doc.createElement('style');
                st.id = 'drift-racial-hide';
                st.textContent = 'aside,nav,.sidebar,#sidebar,.side-bar,#side,.drawer,[class*="sidebar"],[class*="side-nav"],[id*="sidebar"]{display:none!important}body{margin-left:0!important;padding-left:0!important}';
                (doc.head || doc.documentElement).appendChild(st);
              }
              var href = '';
              try { href = String(fr.contentWindow.location.href || ''); } catch (e2) { href = ''; }
              try { if (window.SJC && window.SJC.decodeUrl) { var dec = window.SJC.decodeUrl(href); if (dec) href = dec; } } catch (e3) {}
              var home = false;
              if (href && /racialequityleadership\.com/i.test(href) && !/movies\.html/i.test(href)) {
                try {
                  var path = new URL(href).pathname.replace(/\/+$/, '') || '/';
                  home = path === '/' || path === '/index.html' || path === '/index' || path === '/home' || path === '/home.html';
                } catch (e4) { home = /racialequityleadership\.com\/?(?:\?|#|$)/i.test(href); }
              }
              if (home) fr.contentWindow.location.replace(page);
              var text = '';
              try { text = doc && doc.body ? String(doc.body.innerText || '').slice(0, 500) : ''; } catch (e5) { text = ''; }
              if (/refused to connect|Uh oh|403 ERROR|Access Denied|couldn.?t load this page/i.test(text)) {
                clearInterval(timer);
                moviesApp(root);
              }
            } catch (e) {}
          }, 700);
        }).catch(function () { moviesApp(root); });
        return;
      }
      var url = prov === 'noah' ? 'https://noahstutoring.academy/' : 'https://onlyflix.to/';
      root.innerHTML = '';
      root.style.cssText = 'height:100%;min-height:0;position:relative;overflow:hidden;background:#000';
      if (typeof window.openProxied !== 'function') return moviesApp(root);
      var gaveUp = false;
      function fallback() {
        if (gaveUp || !root.isConnected) return;
        gaveUp = true;
        moviesApp(root);
      }
      Promise.resolve(window.openProxied(url, root)).then(function (f) {
        var n = 0;
        var timer = setInterval(function () {
          if (!root.isConnected || gaveUp || ++n > 18) { clearInterval(timer); return; }
          var fr = (f && f.frame) || root.querySelector('iframe');
          if (!fr) return;
          var text = '';
          try { text = fr.contentDocument && fr.contentDocument.body ? String(fr.contentDocument.body.innerText || '').slice(0, 900) : ''; } catch (e) { text = ''; }
          if (/Request blocked|403 ERROR|Generated by cloudfront|refused to connect|Access Denied|Uh oh/i.test(text)) {
            clearInterval(timer);
            fallback();
            return;
          }
          if (prov === 'onlyflix') {
            try {
              if (!root.querySelector('#drift-movies-name')) {
                var brand = document.createElement('div');
                brand.id = 'drift-movies-name';
                brand.textContent = 'Drift Movies';
                brand.style.cssText = 'position:absolute;z-index:6;left:12px;top:10px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.22);color:#fff;font:700 13px system-ui;pointer-events:none;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.35)';
                root.appendChild(brand);
              }
              var doc = fr.contentDocument;
              if (doc && !doc.getElementById('drift-of-hide')) {
                var st = doc.createElement('style');
                st.id = 'drift-of-hide';
                st.textContent = '.intro,.splash,.loader,.loading,video.intro,#intro,.welcome,.ad,.ads,.popup,.modal,.overlay,[class*=ad-],[id*=ad-],[class*=pop],[class*=banner],.jw-ad,.ima-ad-container{display:none!important}body{overflow:auto!important;background:#000!important}';
                (doc.head || doc.documentElement).appendChild(st);
              }
              if (doc && doc.documentElement && !doc.documentElement.getAttribute('data-drift-movies')) {
                doc.documentElement.setAttribute('data-drift-movies', '1');
                try { doc.title = 'Drift Movies'; } catch (e3) {}
                try {
                  var walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
                  var node;
                  while ((node = walker.nextNode())) {
                    if (node.nodeValue && node.nodeValue.length < 48 && /onlyflix/i.test(node.nodeValue)) {
                      node.nodeValue = node.nodeValue.replace(/onlyflix/ig, 'Drift Movies');
                    }
                  }
                } catch (e4) {}
              }
            } catch (e2) {}
          }
        }, 400);
      }).catch(fallback);
    } };
    window.__driftInstagram = 1;
    window.XAPPS.ig = { n: 'Instagram', f: function (root) {
      root.innerHTML = '';
      root.style.cssText = 'height:100%;min-height:0;position:relative;background:#fff';
      operaPage('https://www.instagram.com/', 'firefox', true)(root);
    } };
    window.__driftWhatsApp = 1;
    window.XAPPS.whatsapp = { n: 'WhatsApp', f: function (root) {
      root.innerHTML = '';
      root.style.cssText = 'height:100%;min-height:0;position:relative;background:#111b21';
      operaPage('https://web.whatsapp.com/', 'firefox', true)(root);
    } };
    window.__driftGithub = 1;
    window.XAPPS.github = { n: 'GitHub', f: operaPage('https://github.com/login', 'firefox', true) };
    applyBrandLogos();
    try {
      var changed = false;
      if (window.S && window.S.d && !window.S.d.v14) {
        window.S.d.v14 = 1;
        changed = true;
        ['aleks', 'espn'].forEach(function (id) {
          if (window.S.d.desk.indexOf(id) < 0) window.S.d.desk.push(id);
        });
      }
      if (window.S && window.S.d && !window.S.d.v15) {
        window.S.d.v15 = 1;
        changed = true;
        if (window.S.d.desk.indexOf('winemu') < 0) window.S.d.desk.push('winemu');
      }
      if (window.S && window.S.d && !window.S.d.v16) {
        window.S.d.v16 = 1;
        changed = true;
        if (window.S.d.desk.indexOf('gbuild') < 0) window.S.d.desk.push('gbuild');
      }
      if (window.S && window.S.d && !window.S.d.v18) {
        window.S.d.v18 = 1;
        changed = true;
        window.S.d.desk = (window.S.d.desk || []).filter(function (id) { return id !== 'peak'; });
        if (window.S.d.pins) window.S.d.pins = window.S.d.pins.filter(function (id) { return id !== 'peak'; });
        try { localStorage.setItem('wos:games-lib', 'noah'); } catch (e) {}
      }
      if (window.S && window.S.d && !window.S.d.v19) {
        window.S.d.v19 = 1;
        changed = true;
        if (window.S.d.desk.indexOf('minecraft') < 0) window.S.d.desk.push('minecraft');
      }
      if (window.S && window.S.d && !window.S.d.v20) {
        window.S.d.v20 = 1;
        changed = true;
        if (window.S.d.desk.indexOf('gforms') < 0) window.S.d.desk.push('gforms');
      }
      if (window.S && window.S.d && !window.S.d.v21) {
        window.S.d.v21 = 1;
        changed = true;
        if (!window.S.d.pins) window.S.d.pins = [];
        ['movies', 'games', 'roblox', 'whatsapp', 'discord'].forEach(function (id) {
          if (window.S.d.pins.indexOf(id) < 0) window.S.d.pins.push(id);
        });
      }
      if (window.S && window.S.d && !window.S.d.v22) {
        window.S.d.v22 = 1;
        changed = true;
        ['pins', 'desk'].forEach(function (k) {
          if (Array.isArray(window.S.d[k])) window.S.d[k] = window.S.d[k].filter(function (id) { return id !== 'classroom'; });
        });
      }
      if (changed) {
        if (typeof save === 'function') save();
        if (typeof rend === 'function') rend();
      }
    } catch (e) {}
  }
  function wireGames() {
    try {
      if (window.APPS) window.APPS.games = 'Games';
      window.noahGamesApp = noahGamesApp;
      if (window.XAPPS) window.XAPPS.games = { n: 'Games', f: gamesApp };
      wireAskedApps();
      applyBrandLogos();
    } catch (e) {}
  }

  function injectXkiroModels() {
    try {
      if (typeof MODELS === 'undefined' || !Array.isArray(MODELS)) return;
      if (!MODELS.some(function (m) { return m && (m[1] === 'Drift 2.1' || m[0] === 'google/gemini-3.8-flash'); })) {
        MODELS.unshift(['google/gemini-3.8-flash', 'Drift 2.1', 'Recommended · Gemini', 'default', 'Gemini itself, shown in Drift as Drift 2.1. It writes the full script you ask for, including long Luau files.', { code: 1, vision: 1, files: 1, think: 1, fast: 1 }]);
        if (typeof AI_ABOUT === 'object' && AI_ABOUT) AI_ABOUT['google/gemini-3.8-flash'] = MODELS[0][4];
      }
      var i21 = MODELS.findIndex(function (m) { return m && m[0] === 'google/gemini-3.8-flash'; });
      if (i21 > 0) MODELS.unshift(MODELS.splice(i21, 1)[0]);
      var extra = [
        ['mistralai/mistral-large-2512', 'Drift 2.0', 'xKiro free · under Drift 2.1', 'default', 'Mistral Large 3, free on xKiro. Strong, but Drift 2.1 stays the default.', { code: 1, vision: 1, files: 0, think: 0, fast: 0 }],
        ['qwen/qwen3.8-omni-flash:free', 'Qwen3.8 Omni', 'xKiro free · vision', 'default', 'Free Qwen3.8 Omni. Sees images. Below Drift 2.1.', { code: 1, vision: 1, files: 0, think: 1, fast: 1 }],
        ['qwen/qwen3.8-max:free', 'Qwen3.8 Max', 'xKiro free', 'default', 'Free Qwen3.8 Max. Below Drift 2.1.', { code: 1, vision: 1, files: 0, think: 1, fast: 0 }],
        ['qwen/qwen3.6-plus:free', 'Qwen3.6 Plus', 'xKiro free', 'default', 'Free Qwen3.6 Plus. Below Drift 2.1.', { code: 1, vision: 1, files: 0, think: 1, fast: 0 }],
        ['qwen/qwen3.5-plus:free', 'Qwen3.5 Plus', 'xKiro free', 'default', 'Free Qwen3.5 Plus. Below Drift 2.1.', { code: 1, vision: 1, files: 0, think: 1, fast: 0 }],
        ['cohere/command-a-plus', 'Command A+', 'xKiro free', 'default', 'Cohere Command A+, free on xKiro. Below Drift 2.1.', { code: 1, vision: 1, files: 0, think: 1, fast: 0 }],
        ['cohere/command-a-reasoning', 'Command A Reasoning', 'xKiro free', 'default', 'Cohere reasoning model, free on xKiro. Below Drift 2.1.', { code: 1, vision: 0, files: 0, think: 1, fast: 0 }],
        ['mistralai/devstral-medium', 'Devstral', 'xKiro free · code', 'default', 'Mistral Devstral, free on xKiro. Below Drift 2.1.', { code: 1, vision: 0, files: 0, think: 0, fast: 1 }],
        ['mistralai/mistral-medium-3.5', 'Mistral Medium 3.5', 'xKiro free', 'default', 'Mistral Medium 3.5, free on xKiro. Below Drift 2.1.', { code: 1, vision: 1, files: 0, think: 1, fast: 1 }],
        ['mistralai/mistral-small-2603', 'Mistral Small', 'xKiro free', 'default', 'Mistral Small, free on xKiro. Below Drift 2.1.', { code: 1, vision: 1, files: 0, think: 1, fast: 1 }],
        ['mistralai/codestral-2508', 'Codestral', 'xKiro free · code', 'default', 'Codestral, free on xKiro. Below Drift 2.1.', { code: 1, vision: 0, files: 0, think: 0, fast: 1 }],
        ['qwen/qwen3-coder-plus:free', 'Qwen Coder', 'Slow · not used for replies', 'default', 'Kept in the list only. Drift 2.1 writes the code, because this one is slow.', { code: 1, vision: 1, files: 0, think: 1, fast: 0 }],
        ['qwen/qwen3.7-max:free', 'Qwen3.7 Max', 'xKiro free', 'default', 'Free Qwen3.7 Max. 1M context. Below Drift 2.1.', { code: 1, vision: 0, files: 0, think: 1, fast: 0 }],
        ['qwen/qwen3.7-plus:free', 'Qwen3.7 Plus', 'xKiro free · vision', 'default', 'Free Qwen3.7 Plus. Sees images. Below Drift 2.1.', { code: 1, vision: 1, files: 0, think: 1, fast: 1 }],
        ['qwen/qwen3.5-397b-a17b:free', 'Qwen3.5 397B', 'xKiro free', 'default', 'Free Qwen3.5 397B. Below Drift 2.1.', { code: 1, vision: 1, files: 0, think: 1, fast: 0 }],
        ['cohere/north-mini-code', 'North Mini Code', 'xKiro free · code', 'default', 'Cohere coding model, free on xKiro. Below Drift Code.', { code: 1, vision: 0, files: 0, think: 1, fast: 1 }]
      ];
      extra.forEach(function (m) {
        if (!MODELS.some(function (x) { return x && x[0] === m[0]; })) MODELS.push(m);
        if (typeof AI_ABOUT === 'object' && AI_ABOUT) AI_ABOUT[m[0]] = m[4];
      });
      i21 = MODELS.findIndex(function (m) { return m && m[0] === 'google/gemini-3.8-flash'; });
      if (i21 > 0) MODELS.unshift(MODELS.splice(i21, 1)[0]);
      var realName = {
        'google/gemini-3.8-flash': 'Gemini 3.8 Flash',
        'qwen/qwen3.7-flash:free': 'Qwen3.7 Flash',
        'duck:gpt-4o-mini': 'GPT-4o mini',
        'duck:llama': 'Llama',
        'duck:claude-haiku': 'Claude Haiku',
        'duck:mistral': 'Mistral',
        'qwen/qwen3-coder-plus:free': 'Qwen Coder',
        'qwen/qwen3.8-max:free': 'Qwen3.8 Max',
        'qwen/qwen3.6-plus:free': 'Qwen3.6 Plus',
        'qwen/qwen3.5-plus:free': 'Qwen3.5 Plus',
        'qwen/qwen3.8-omni-flash:free': 'Qwen3.8 Omni',
        'qwen/qwen3.7-max:free': 'Qwen3.7 Max',
        'qwen/qwen3.7-plus:free': 'Qwen3.7 Plus',
        'qwen/qwen3.5-397b-a17b:free': 'Qwen3.5 397B',
        'mistralai/mistral-large-2512': 'Mistral Large 3',
        'mistralai/mistral-large-4-0': 'Mistral Large',
        'mistralai/mistral-medium-3.5': 'Mistral Medium 3.5',
        'mistralai/mistral-small-2603': 'Mistral Small',
        'mistralai/devstral-medium': 'Devstral',
        'mistralai/codestral-2508': 'Codestral',
        'cohere/command-a-plus': 'Command A+',
        'cohere/command-a-reasoning': 'Command A Reasoning',
        'cohere/north-mini-code': 'North Mini Code'
      };
      MODELS.forEach(function (m) { if (m && realName[m[0]]) m[1] = realName[m[0]]; });
    } catch (e) {}
  }


  function installAppGlass() {
    var on = false;
    try { on = /^(1|true)$/.test(String(localStorage.getItem('wos:liquid-apps') || '').replace(/"/g, '')); } catch (e) {}
    var st = document.getElementById('drift-app-glass-style');
    if (!st) { st = document.createElement('style'); st.id = 'drift-app-glass-style'; document.head.appendChild(st); }
    if (on) {
      document.body.classList.add('drift-app-glass');
      st.textContent =
        'body.drift-app-glass .win{background:rgba(255,255,255,.22)!important;backdrop-filter:blur(24px) saturate(180%)!important;-webkit-backdrop-filter:blur(24px) saturate(180%)!important;border:1px solid rgba(255,255,255,.28)!important;box-shadow:0 12px 40px rgba(0,0,0,.18)!important}' +
        'body.drift-app-glass .win>.title{background:rgba(255,255,255,.16)!important}' +
        'body.drift-app-glass .win>.body{background:rgba(10,12,20,.28)!important}';
    } else {
      document.body.classList.remove('drift-app-glass');
      st.textContent = '';
    }
  }
  function speedDesk() {
    if (window.__driftSpeed) return;
    window.__driftSpeed = 1;
    try {
      if (typeof rend === 'function' && !rend.__driftFast) {
        var orig = rend;
        var fast = function () {
          var menu = document.getElementById('menu');
          var open = menu && menu.classList.contains('show');
          var tilesFn = window.tiles;
          var out;
          if (!open && typeof tilesFn === 'function') {
            window.tiles = function () {};
            try { out = orig(); } finally { window.tiles = tilesFn; }
          } else out = orig();
          try { fitWindowsName(); } catch (err) {}
          return out;
        };
        fast.__driftFast = 1;
        rend = fast;
      }
    } catch (e) {}
    function fitWindowsName() {
      document.querySelectorAll('.ico[data-app="winemu"], #pins [data-app="winemu"]').forEach(function (b) {
        b.style.width = '108px';
        b.style.maxWidth = 'none';
        b.style.overflow = 'visible';
        b.style.whiteSpace = 'normal';
        b.style.lineHeight = '1.15';
        b.style.fontSize = '11px';
      });
      document.querySelectorAll('#tbs .tb').forEach(function (b) {
        if (!/Windows emulator/i.test(b.textContent || '')) return;
        b.classList.add('drift-winemu');
      });
    }
    window.fitWindowsName = fitWindowsName;
    var prefetch = function () {
      try { if (typeof sjInit === 'function') sjInit(); } catch (e) {}
      try {
        if (!sessionStorage.getItem('wos:noah-games')) {
          fetch('/api/noah-games').then(function (r) { return r.json(); }).then(function (list) {
            if (Array.isArray(list) && list.length) sessionStorage.setItem('wos:noah-games', JSON.stringify(list));
          }).catch(function () {});
        }
      } catch (e) {}
      try {
        if (!sessionStorage.getItem('wos:tmdb-movie') && typeof tmdbGet === 'function') {
          tmdbGet('/trending/movie/week').then(function (j) {
            if (j && j.results && j.results.length) sessionStorage.setItem('wos:tmdb-movie', JSON.stringify(j.results.slice(0, 24)));
          }).catch(function () {});
        }
        if (!sessionStorage.getItem('wos:tmdb-tv') && typeof tmdbGet === 'function') {
          tmdbGet('/trending/tv/week').then(function (j) {
            if (j && j.results && j.results.length) sessionStorage.setItem('wos:tmdb-tv', JSON.stringify(j.results.slice(0, 24)));
          }).catch(function () {});
        }
      } catch (e) {}
    };
    if (window.requestIdleCallback) requestIdleCallback(prefetch, { timeout: 1200 });
    else setTimeout(prefetch, 300);
  }
  function installLiquidGlass() {
    var on = false;
    try { on = /^(1|true)$/.test(String(localStorage.getItem('wos:liquid-glass') || '').replace(/"/g, '')); } catch (e) {}
    var st = document.getElementById('drift-liquid-style');
    if (!st) { st = document.createElement('style'); st.id = 'drift-liquid-style'; document.head.appendChild(st); }
    if (on) {
      document.body.classList.add('drift-liquid');
      st.textContent =
        'body.drift-liquid #task,body.drift-liquid .win,body.drift-liquid .win>.title,body.drift-liquid #menu,body.drift-liquid .sheet,body.drift-liquid .card,body.drift-liquid #drift-settings-panel,body.drift-liquid .ai-msg,body.drift-liquid #ain,body.drift-liquid .omni,body.drift-liquid #drift-tb-show,body.drift-liquid #drift-title-show,body.drift-liquid #drift-tb-hide,body.drift-liquid .drift-title-hide-btn{' +
        'background:rgba(28,28,36,.42)!important;backdrop-filter:saturate(180%) blur(28px)!important;-webkit-backdrop-filter:saturate(180%) blur(28px)!important;border-color:rgba(255,255,255,.18)!important}' +
        'body.drift-liquid #task{box-shadow:0 -8px 32px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.35)!important}' +
        'body.drift-liquid #task{background:rgba(12,16,24,.08)!important;border-top:1px solid rgba(255,255,255,.28)!important;backdrop-filter:saturate(160%) blur(40px)!important;-webkit-backdrop-filter:saturate(160%) blur(40px)!important}' +
        'body.drift-liquid #drift-tb-show{background:rgba(255,255,255,.06)!important;color:#fff!important;border-color:rgba(255,255,255,.28)!important;backdrop-filter:blur(28px) saturate(160%)!important;-webkit-backdrop-filter:blur(28px) saturate(160%)!important}' +
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
      'body.drift-edu [data-app]:not([data-app="classroom"]):not([data-app="canva"]):not([data-app="wayground"]):not([data-app="classdojo"]){display:none!important}';
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

  var driftPressed = {};
  function keyName(e) {
    if (e.key === ' ') return 'Space';
    if (e.key === 'Control') return 'Ctrl';
    if (e.key === 'Alt') return 'Alt';
    if (e.key === 'Shift') return 'Shift';
    if (e.key === 'Meta') return 'Meta';
    return e.key.length === 1 ? e.key.toUpperCase() : e.key;
  }
  function comboParts(combo) {
    return String(combo || '').split('+').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
  }
  function downSet(e) {
    var down = {};
    Object.keys(driftPressed).forEach(function (k) { if (driftPressed[k]) down[k] = 1; });
    if (e) {
      if (e.ctrlKey) down.ctrl = 1;
      if (e.altKey) down.alt = 1;
      if (e.shiftKey) down.shift = 1;
      if (e.metaKey) down.meta = 1;
      var n = keyName(e).toLowerCase();
      if (n !== 'ctrl' && n !== 'alt' && n !== 'shift' && n !== 'meta') down[n] = 1;
    }
    return down;
  }
  function matchCombo(e, combo) {
    var parts = comboParts(combo);
    if (!parts.length) return false;
    var down = downSet(e);
    for (var i = 0; i < parts.length; i++) if (!down[parts[i]]) return false;
    return true;
  }
  function wireKeyCapture(input, storageKey, fallback) {
    if (!input || input.dataset.cap === '1') return;
    input.dataset.cap = '1';
    input.readOnly = true;
    input.placeholder = 'Click, then press keys (T+Y, up to 8)';
    input.style.cursor = 'pointer';
    input.addEventListener('focus', function () {
      input._keys = [];
      input.value = 'Press keys…';
      input.style.borderColor = '#34c759';
    });
    input.addEventListener('keydown', function (e) {
      e.preventDefault(); e.stopPropagation();
      if (!input._keys) input._keys = [];
      var name = keyName(e);
      if (input._keys.indexOf(name) < 0 && input._keys.length < 8) input._keys.push(name);
      input.value = input._keys.join('+') || fallback || '';
      clearTimeout(input._t);
      input._t = setTimeout(function () {
        try { localStorage.setItem(storageKey, input.value); } catch (err) {}
        input.style.borderColor = '#333';
        input._keys = [];
        input.blur();
      }, 750);
    });
  }
  function bindCustomKeybinds() {
    if (window.__driftKbBound) return;
    window.__driftKbBound = true;
    document.addEventListener('keydown', function (e) {
      var nk = keyName(e).toLowerCase();
      if (nk !== 'ctrl' && nk !== 'alt' && nk !== 'shift' && nk !== 'meta') driftPressed[nk] = 1;
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
        openTop('https://classroom.google.com/');
      } else if (disc && matchCombo(e, disc)) {
        e.preventDefault();
        openTop('https://www.discoveryeducation.com/');
      } else if (aleks && matchCombo(e, aleks)) {
        e.preventDefault();
        openTop('https://www.aleks.com/');
      } else if (docs && matchCombo(e, docs)) {
        e.preventDefault();
        openTop('https://docs.google.com/');
      }
    }, true);
    document.addEventListener('keyup', function (e) {
      var nk = keyName(e).toLowerCase();
      driftPressed[nk] = 0;
    }, true);
  }

  function openTop(url) {
    url = String(url || '');
    if (!/^https?:/i.test(url)) return;
    var w = null;
    try { w = window.open(url, '_blank', 'noopener'); } catch (e) { w = null; }
    if (w) return;
    try {
      if (window.top && window.top !== window) { window.top.location.href = url; return; }
    } catch (e2) {}
    try { location.replace(url); } catch (e3) { location.href = url; }
  }
  var SIZE_MAP = { xl: 3, lg: 2, sm: 1.7, xs: 1.5 };
  function readSize(key) {
    var v = 'lg';
    try { v = localStorage.getItem(key) || 'lg'; } catch (e) {}
    return SIZE_MAP[v] ? v : 'lg';
  }
  function applySize() {
    var app = SIZE_MAP[readSize('wos:size-apps')];
    var tb = SIZE_MAP[readSize('wos:size-tb')];
    if (document.body.classList.contains('drift-cros')) {
      tb *= 0.82;
      app *= 0.86;
    }
    if (document.body.classList.contains('drift-ipad')) {
      tb *= 0.9;
      app *= 0.92;
    }
    var tbh = Math.max(28, Math.round(38 * tb));
    document.documentElement.style.setProperty('--drift-app', String(Math.round(app * 1000) / 1000));
    document.documentElement.style.setProperty('--drift-tb', String(Math.round(tb * 1000) / 1000));
    document.documentElement.style.setProperty('--tbh', tbh + 'px');
    var st = document.getElementById('drift-size-style');
    if (!st) { st = document.createElement('style'); st.id = 'drift-size-style'; document.head.appendChild(st); }
    st.textContent =
      '.icons .ico{width:calc(38px * var(--drift-app, 2))!important;font-size:calc(6px * var(--drift-app, 2))!important;border-radius:14%!important}' +
      '.icons .ico i,.icons .ico i svg,.icons .ico img{width:calc(23px * var(--drift-app, 2))!important;height:calc(23px * var(--drift-app, 2))!important;border-radius:22%!important;overflow:hidden}' +
      '#task .tb{height:calc(25px * var(--drift-tb, 2))!important;font-size:calc(7px * var(--drift-tb, 2))!important;border-radius:calc(4px * var(--drift-tb, 1))!important}' +
      '#pins button{border-radius:18%!important}' +
      '#pins button .mi,.mi{border-radius:22%!important}' +
      '#pins button .mi{width:calc(18px * var(--drift-tb, 2));height:calc(18px * var(--drift-tb, 2))}';
    try { if (typeof layout === 'function') layout(); } catch (e) {}
  }
  function deviceKind() {
    var ua = navigator.userAgent || '';
    var plat = '';
    try { plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || ''; } catch (e) {}
    var touchMac = plat === 'MacIntel' && navigator.maxTouchPoints > 1;
    if (/iPad|iPhone|iPod/i.test(ua) || touchMac) return 'ipad';
    if (/CrOS/i.test(ua) || /Chrome OS|ChromeOS/i.test(plat)) return 'cros';
    if (/Win/i.test(plat) || /Windows/i.test(ua)) return 'win';
    if (/Android/i.test(ua)) return 'android';
    if (/Linux/i.test(plat) || /Linux/i.test(ua)) return 'linux';
    if (/Mac/i.test(plat)) return 'mac';
    return 'other';
  }
  function rejectAdapt(swId) {
    var sw = document.getElementById(swId);
    if (!sw) return;
    sw.setAttribute('data-on', '0');
    sw.setAttribute('aria-checked', 'false');
    sw.style.background = 'rgba(120,120,128,.32)';
    var knob = sw.querySelector('span');
    if (knob) knob.style.left = '2px';
  }
  function dynamicOn() {
    try { return localStorage.getItem('wos:dynamic-os') === '1'; } catch (e) { return false; }
  }
  function foreignBlocked(kind, swId, quiet) {
    if (!kind) return false;
    if (dynamicOn() || deviceKind() === kind) return false;
    var names = { cros: 'ChromeOS', ipad: 'iPad', mac: 'macOS', win: 'Windows', linux: 'Linux' };
    if (!quiet) alert('This adaptation is only for ' + (names[kind] || kind) + '. Turn on Dynamic OS in UI → Experimental to use it on this device.');
    rejectAdapt(swId);
    return true;
  }
  function setChromeOSAdapt(on, quiet) {
    if (on && foreignBlocked('cros', 'drift-cros-sw', quiet)) on = false;
    try { localStorage.setItem('wos:cros-adapt', on ? '1' : '0'); } catch (e) {}
    document.body.classList.toggle('drift-cros', !!on);
    var task = document.getElementById('task');
    var keep = false;
    try { keep = localStorage.getItem('wos:tb-hidden') === '1'; } catch (e) {}
    if (!keep) {
      document.body.classList.remove('drift-tb-off');
      if (task) task.classList.remove('drift-hidden');
    }
    var st = document.getElementById('drift-cros-style');
    if (st) st.textContent = '';
    applySize();
  }
  function setIpadAdapt(on, quiet) {
    if (on && foreignBlocked('ipad', 'drift-ipad-sw', quiet)) on = false;
    try { localStorage.setItem('wos:ipad-adapt', on ? '1' : '0'); } catch (e) {}
    document.body.classList.toggle('drift-ipad', !!on);
    if (!document.getElementById('drift-ipad-style')) {
      var s = document.createElement('style');
      s.id = 'drift-ipad-style';
      s.textContent = 'body.drift-ipad .win{max-width:100%}body.drift-ipad .icons{padding:8px 8px 28px}body.drift-ipad #task{padding-bottom:env(safe-area-inset-bottom)}';
      document.head.appendChild(s);
    }
    applySize();
  }
  function osLook() {
    if (document.getElementById('drift-osadapt-style')) return;
    var s = document.createElement('style');
    s.id = 'drift-osadapt-style';
    s.textContent = 'body.drift-mac #task{border-radius:18px 18px 0 0}body.drift-mac .win{border-radius:14px}'
      + 'body.drift-win .title{background:#1f1f1f;color:#fff}body.drift-win .wb{color:#fff}'
      + 'body.drift-linux #task{border-radius:0}body.drift-linux .win{border-radius:6px}';
    document.head.appendChild(s);
  }
  function setMacAdapt(on, quiet) {
    if (on && foreignBlocked('mac', 'drift-mac-sw', quiet)) on = false;
    try { localStorage.setItem('wos:mac-adapt', on ? '1' : '0'); } catch (e) {}
    osLook();
    document.body.classList.toggle('drift-mac', !!on);
  }
  function setWinAdapt(on, quiet) {
    if (on && foreignBlocked('win', 'drift-win-sw', quiet)) on = false;
    try { localStorage.setItem('wos:win-adapt', on ? '1' : '0'); } catch (e) {}
    osLook();
    document.body.classList.toggle('drift-win', !!on);
  }
  function setLinuxAdapt(on, quiet) {
    if (on && foreignBlocked('linux', 'drift-linux-sw', quiet)) on = false;
    try { localStorage.setItem('wos:linux-adapt', on ? '1' : '0'); } catch (e) {}
    osLook();
    document.body.classList.toggle('drift-linux', !!on);
  }
  function nativeAdaptKey() {
    var k = deviceKind();
    if (k === 'cros') return 'wos:cros-adapt';
    if (k === 'ipad') return 'wos:ipad-adapt';
    if (k === 'mac') return 'wos:mac-adapt';
    if (k === 'win') return 'wos:win-adapt';
    if (k === 'linux') return 'wos:linux-adapt';
    return '';
  }
  function applySavedAdapts(quiet) {
    var nk = nativeAdaptKey();
    try {
      if (nk && localStorage.getItem(nk) === null) localStorage.setItem(nk, '1');
    } catch (e) {}
    function on(key) { try { return localStorage.getItem(key) === '1'; } catch (e) { return false; } }
    setChromeOSAdapt(on('wos:cros-adapt'), quiet);
    setIpadAdapt(on('wos:ipad-adapt'), quiet);
    setMacAdapt(on('wos:mac-adapt'), quiet);
    setWinAdapt(on('wos:win-adapt'), quiet);
    setLinuxAdapt(on('wos:linux-adapt'), quiet);
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
  var DRIFT_DEFAULTS = { calc:1, browser:1, ai:1, yt:1, cam:1, mus:1, movies:1, code:1, discord:1, gmail:1, ig:1, tt:1, classroom:1, canva:1, roblox:1, gimkit:1, games:1, chat:1, github:1, whatsapp:1, wayground:1, injector:1, gem:1, classdojo:1, aleks:1, espn:1, winemu:1, gbuild:1 };
  function deleteCreatedApps() {
    try {
      var apps = window.APPS || {}, x = window.XAPPS || {}, IC = window.IC || {};
      Object.keys(apps).forEach(function (id) {
        if (!DRIFT_DEFAULTS[id]) { delete apps[id]; delete x[id]; delete IC[id]; }
      });
      var byName = {};
      Object.keys(apps).forEach(function (id) {
        var n = String(apps[id] || '');
        (byName[n] = byName[n] || []).push(id);
      });
      Object.keys(byName).forEach(function (n) {
        var ids = byName[n];
        if (ids.length < 2) return;
        var keep = null;
        ids.forEach(function (id) { if (DRIFT_DEFAULTS[id]) keep = id; });
        if (!keep) keep = ids[0];
        ids.forEach(function (id) {
          if (id === keep) return;
          delete apps[id]; delete x[id]; delete IC[id];
        });
      });
      if (window.S && window.S.d) {
        ['desk', 'pins'].forEach(function (k) {
          if (Array.isArray(window.S.d[k])) window.S.d[k] = window.S.d[k].filter(function (id) { return apps[id]; });
        });
      }
      try { localStorage.removeItem('wos:myapps'); localStorage.removeItem('wos:userscripts'); } catch (e) {}
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
      if (!id || DRIFT_DEFAULTS[id]) return;
      e.preventDefault();
      e.stopImmediatePropagation();
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
    }, true);
  }
  function isCros() {
    try {
      if (/CrOS/.test(navigator.userAgent)) return true;
      if (navigator.userAgentData && /Chrome OS|ChromeOS/i.test(navigator.userAgentData.platform || '')) return true;
    } catch (e) {}
    return false;
  }
  function loginShell(label, url, storageKey, okRe) {
    return function (root) {
      var signed = false;
      try { signed = localStorage.getItem(storageKey) === '1'; } catch (e) {}
      root.innerHTML =
        '<div style="display:flex;flex-direction:column;height:100%;min-height:0">' +
        '<div data-loginbar style="padding:8px 10px;border-bottom:1px solid var(--line);display:' + (signed ? 'none' : 'flex') + ';gap:8px;align-items:center;flex-wrap:wrap;background:var(--bar,rgba(255,255,255,.04))">' +
        '<span style="font-size:12px;font-weight:650">' + label + ' · Sign in</span>' +
        '<button type="button" data-popup style="padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:var(--omni,transparent);color:inherit;cursor:pointer;font-size:12px">Sign in</button>' +
        '<button type="button" data-retry style="padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:transparent;color:inherit;cursor:pointer;font-size:12px">Reload</button>' +
        '<label style="font-size:11px;opacity:.8;margin-left:auto;display:flex;gap:6px;align-items:center"><input type="checkbox" data-signed' + (signed ? ' checked' : '') + '/> I signed in</label>' +
        '<span style="font-size:11px;opacity:.65;width:100%">This sign-in tab stays until Drift sees that you are logged in. Closing the window, the browser tab, or reloading does not remove it.</span></div>' +
        '<div class="sjt" style="flex:1;min-height:0;position:relative"></div></div>';
      var box = root.querySelector('.sjt');
      var bar = root.querySelector('[data-loginbar]');
      function mark(on) {
        try { localStorage.setItem(storageKey, on ? '1' : '0'); } catch (e) {}
        if (bar) bar.style.display = on ? 'none' : 'flex';
        var cb = root.querySelector('[data-signed]');
        if (cb) cb.checked = !!on;
      }
      root.querySelector('[data-popup]').onclick = function () {
        var login = /Gmail|Classroom|Canva/i.test(label)
          ? 'https://accounts.google.com/ServiceLogin?continue=' + encodeURIComponent(url)
          : url;
        window.open(login, '_blank', 'width=980,height=760');
      };
      root.querySelector('[data-signed]').onchange = function () { mark(this.checked); };
      function load() {
        if (typeof window.proxySite === 'function') window.proxySite(box, url, label);
        else if (typeof window.openProxied === 'function') window.openProxied(url, box);
      }
      root.querySelector('[data-retry]').onclick = load;
      load();
      var ticks = 0;
      var timer = setInterval(function () {
        if (!root.isConnected || ++ticks > 90) { clearInterval(timer); return; }
        try {
          if (localStorage.getItem(storageKey) === '1') { if (bar) bar.style.display = 'none'; clearInterval(timer); return; }
        } catch (e) {}
        try {
          var frame = box.querySelector('iframe');
          if (!frame || !frame.contentWindow) return;
          var href = frame.contentWindow.location.href;
          var decoded = href;
          try { if (window.SJC && window.SJC.decodeUrl) decoded = window.SJC.decodeUrl(href) || href; } catch (e) {}
          if (okRe && okRe.test(decoded) && !/ServiceLogin|signin|InteractiveLogin|accounts\.google\.com/i.test(decoded)) mark(true);
        } catch (e) {}
      }, 1500);
    };
  }
  function robloxOs() {
    var ua = navigator.userAgent || '';
    var plat = '';
    try { plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || ''; } catch (e) {}
    var touchMac = false;
    try { touchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1; } catch (e2) {}
    if (/iPad|iPhone|iPod/i.test(ua) || /iPad|iPhone/i.test(plat) || touchMac) return 'ipad';
    if (/CrOS/i.test(ua) || /Chrome OS|ChromeOS/i.test(plat)) return 'cros';
    if (/Mac/i.test(plat) || /Macintosh|Mac OS X/i.test(ua)) return 'mac';
    return 'win';
  }
  function robloxShell(root) {
    operaPage('https://www.roblox.com/login', 'firefox', false)(root);
  }
  function inAppPage(url) {
    return function (root) {
      root.innerHTML = '<div class="sjt" style="height:100%;min-height:0;position:relative;background:#fff"></div>';
      var box = root.querySelector('.sjt');
      if (typeof window.openProxied === 'function') window.openProxied(url, box);
      else box.textContent = 'This page could not be opened inside the app.';
    };
  }
  function chromeLaunch(label, url) {
    return function (root) {
      root.innerHTML =
        '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center">' +
        '<b style="font-size:18px">' + label + '</b>' +
        '<div style="max-width:440px;opacity:.8;font-size:13px">Opened in Google Chrome. This app does not use the proxy, so Google will not show “This browser or app may not be secure.”</div>' +
        '<button type="button" data-open style="padding:10px 16px;border:0;border-radius:10px;background:#1a73e8;color:#fff;font-weight:650;cursor:pointer">Open in Chrome</button></div>';
      function open() {
        var w = window.open(url, 'drift-' + label.toLowerCase().replace(/[^a-z]+/g, ''), 'width=1200,height=800');
        if (!w) {
          var n = root.querySelector('[data-open]');
          if (n) n.textContent = 'Allow pop-ups, then press Open in Chrome';
        }
      }
      root.querySelector('[data-open]').onclick = open;
      open();
    };
  }
  function openInChrome(url) {
    return function (root) {
      root.innerHTML =
        '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center">' +
        '<b style="font-size:18px">Chrome</b>' +
        '<div style="max-width:440px;opacity:.8;font-size:13px">Opened in Chrome on this Chromebook, with the accounts already on this device.</div>' +
        '<button type="button" data-open style="padding:10px 16px;border:0;border-radius:10px;background:#1a73e8;color:#fff;font-weight:650;cursor:pointer">Open in Chrome</button></div>';
      function open() {
        var w = window.open(url, '_blank');
        if (!w) {
          var n = root.querySelector('[data-open]');
          if (n) n.textContent = 'Allow pop-ups, then press Open in Chrome';
        }
      }
      var btn = root.querySelector('[data-open]');
      if (btn) btn.onclick = open;
      open();
    };
  }

  function watchFor404(frame, reloadFn) {
    var n = 0;
    var t = setInterval(function () {
      if (!frame || !frame.isConnected || ++n > 12) { clearInterval(t); return; }
      var text = '';
      try { text = frame.contentDocument && frame.contentDocument.body ? String(frame.contentDocument.body.innerText || '').slice(0, 400) : ''; } catch (e) { text = ''; }
      if (/\b404\b|Not Found|Page not found|Uh oh/i.test(text)) {
        clearInterval(t);
        if (typeof reloadFn === 'function') setTimeout(reloadFn, 600);
      }
    }, 800);
  }

  function googleMenuHost(url) {
    try { return /(^|\.)google\.com$/i.test(new URL(url).hostname); } catch (e) { return false; }
  }
  function armGoogleMenu(frame) {
    function kick() {
      try {
        var doc = frame.contentDocument;
        if (!doc || !doc.documentElement || doc.documentElement.getAttribute('data-drift-menu') === '1') return;
        if (typeof window.__driftGoogleMenu !== 'function') return;
        doc.documentElement.setAttribute('data-drift-menu', '1');
        var s = doc.createElement('script');
        s.textContent = 'try{(' + window.__driftGoogleMenu.toString() + ')()}catch(e){}';
        doc.documentElement.appendChild(s);
      } catch (e) {}
    }
    frame.addEventListener('load', function () { setTimeout(kick, 60); });
  }
  function operaPage(url, browser, loose) {
    browser = browser || "firefox";
    return function (root) {
      root.innerHTML = '<div class="sjt" style="height:100%;min-height:0;position:relative;background:#fff"></div>';
      var box = root.querySelector(".sjt");
      function showOff() {
        box.innerHTML = '<div style="height:100%;display:grid;place-items:center;text-align:center;padding:24px;color:#111;font:14px system-ui"><div><b>No internet</b><p>Reconnect, then press Reload. This stays in the app. It does not open a search.</p><button type="button" data-reload style="margin-top:8px;padding:8px 14px;border:0;border-radius:8px;background:#1a73e8;color:#fff;cursor:pointer">Reload</button></div></div>';
        var b = box.querySelector("[data-reload]");
        if (b) b.onclick = load;
      }
      function load() {
        if (navigator.onLine === false) { showOff(); return; }
        box.innerHTML = "";
        var frame = document.createElement("iframe");
        frame.setAttribute("referrerpolicy", "no-referrer");
        if (!loose) frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-modals allow-downloads allow-pointer-lock");
        frame.setAttribute("allow", "camera; microphone; clipboard-read; clipboard-write; fullscreen");
        frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff";
        frame.src = "/api/opera?u=" + encodeURIComponent(url) + "&b=" + encodeURIComponent(browser);
        if (googleMenuHost(url)) armGoogleMenu(frame);
        box.appendChild(frame);
      }
      load();
      function onOff() {
        if (root.isConnected) showOff();
        else window.removeEventListener("offline", onOff);
      }
      window.addEventListener("offline", onOff);
    };
  }
  function classroomInside(root) {
    var tries = [
      "/api/opera?u=" + encodeURIComponent("https://classroom.google.com/") + "&b=edge",
      "/api/opera?u=" + encodeURIComponent("https://classroom.google.com/") + "&b=firefox",
      "/api/opera?u=" + encodeURIComponent("https://accounts.google.com/ServiceLogin?service=classroom&continue=" + encodeURIComponent("https://classroom.google.com/")) + "&b=firefox",
      "/api/opera?u=" + encodeURIComponent("https://classroom.google.com/u/0/") + "&b=opera"
    ];
    var i = 0;
    root.innerHTML = '<div class="sjt" style="height:100%;min-height:0;position:relative;background:#fff"></div>';
    var box = root.querySelector(".sjt");
    function direct() {
      box.innerHTML = '<div style="height:100%;display:grid;place-items:center;text-align:center;padding:24px;color:#111;font:14px system-ui"><div><b>Classroom</b><p>Open it in a new tab. It is not embedded here, so it will not say classroom.google.com refused to connect.</p><button type="button" data-go style="margin-top:8px;padding:8px 14px;border:0;border-radius:8px;background:#1a73e8;color:#fff;cursor:pointer">Open Classroom</button></div></div>';
      var b = box.querySelector('[data-go]');
      if (b) b.onclick = function () { openTop('https://classroom.google.com/'); };
    }
    function attempt() {
      if (i >= tries.length) { direct(); return; }
      var src = tries[i++];
      box.innerHTML = "";
      var frame = document.createElement("iframe");
      frame.setAttribute("referrerpolicy", "no-referrer");
      frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff";
      var settled = false;
      var timer = setTimeout(function () { if (!settled) { settled = true; attempt(); } }, 4500);
      frame.onload = function () {
        if (settled) return;
        var ok = false;
        try {
          var doc = frame.contentDocument;
          var text = doc && doc.body ? String(doc.body.innerText || "").slice(0, 900) : "";
          if (doc && doc.querySelector && doc.querySelector("#identifierId, input[type=email], input[name=identifier]")) ok = true;
          if (/Sign in|Classroom|identifier/i.test(text) && !/Classroom Management Tools|designing again soon|blocked this server|Just a moment/i.test(text)) ok = true;
        } catch (e) { ok = false; }
        settled = true;
        clearTimeout(timer);
        if (!ok) attempt();
      };
      frame.src = src;
      if (googleMenuHost(src) || /google\.com/i.test(src)) armGoogleMenu(frame);
      box.appendChild(frame);
    }
    attempt();
  }
  function classroomOauth(root) {
    var login = "https://accounts.google.com/ServiceLogin?service=classroom&continue=" + encodeURIComponent("https://classroom.google.com/") + "&passive=1209600";
    root.innerHTML = '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center">' +
      '<b style="font-size:18px">Classroom</b>' +
      '<div style="max-width:460px;opacity:.8;font-size:13px">Sign in on the other page with the account on this Chromebook. When you close it, Classroom opens here.</div>' +
      '<button type="button" data-back style="padding:10px 16px;border:0;border-radius:10px;background:#1a73e8;color:#fff;font-weight:650;cursor:pointer">I am back — open Classroom here</button></div>';
    var w = null;
    try { w = window.open(login, "_blank"); } catch (e) { w = null; }
    var btn = root.querySelector("[data-back]");
    function back() { classroomInside(root); }
    if (btn) btn.onclick = back;
    if (!w && btn) btn.textContent = "Allow pop-ups, then press the button";
    var timer = setInterval(function () {
      var closed = false;
      try { closed = !w || w.closed; } catch (e) { closed = false; }
      if (w && closed) { clearInterval(timer); back(); }
    }, 700);
  }
  function sessionChooser(url, loginUrl, oauthInChrome, loginInChrome, kind) {
    return function (root) {
      root.innerHTML =
        '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center">' +
        '<b style="font-size:18px">How do you want to inicialize sesión</b>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">' +
        '<button type="button" data-login style="min-width:140px;padding:12px 16px;border-radius:12px;border:1px solid var(--line);background:var(--omni);color:inherit;cursor:pointer"><b>Log in</b><div style="font-size:12px;opacity:.75;margin-top:4px">' + (kind === "classroom" ? "Edge, inside this app" : (loginInChrome ? "this Chromebook's Chrome" : "manual")) + '</div></button>' +
        '<button type="button" data-oauth style="min-width:200px;padding:12px 16px;border-radius:12px;border:0;background:#1a73e8;color:#fff;cursor:pointer"><b>Oauth</b><div style="font-size:12px;opacity:.9;margin-top:4px">' + (kind === "classroom" ? "another page, then here" : (oauthInChrome ? "this Chromebook's Chrome" : "inside this app")) + '</div></button>' +
        '</div></div>';
      root.querySelector('[data-login]').onclick = function () {
        if (kind === "classroom") operaPage(loginUrl, "firefox", true)(root);
        else if (loginInChrome) openInChrome(loginUrl)(root);
        else operaPage(loginUrl, "firefox", true)(root);
      };
      root.querySelector('[data-oauth]').onclick = function () {
        if (kind === "classroom") classroomOauth(root);
        else if (oauthInChrome) openInChrome(url)(root);
        else operaPage(url, "firefox", true)(root);
      };
    };
  }
  function backBar(root, homeUrl) {
    var bar = document.createElement('div');
    bar.style.cssText = 'position:absolute;top:8px;right:8px;z-index:20';
    bar.innerHTML = '<button type="button" style="padding:8px 12px;border:0;border-radius:8px;background:#1a73e8;color:#fff;cursor:pointer;font:600 12px system-ui">I am back — open it here</button>';
    root.style.position = 'relative';
    root.appendChild(bar);
    bar.querySelector('button').onclick = function () { operaPage(homeUrl, 'firefox')(root); };
  }
  function loginThenHome(root, loginUrl, homeUrl) {
    operaPage(loginUrl, 'firefox')(root);
    backBar(root, homeUrl);
  }
  function sessionInside(homeUrl, loginUrl, label) {
    return function (root) {
      root.innerHTML =
        '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center">' +
        '<b style="font-size:18px">' + label + '</b>' +
        '<div style="max-width:460px;opacity:.8;font-size:13px">Log in and OAuth stay in Firefox inside this app, so the session is still here when you come back.</div>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">' +
        '<button type="button" data-login style="min-width:140px;padding:12px 16px;border-radius:12px;border:1px solid var(--line);background:var(--omni);color:inherit;cursor:pointer"><b>Log in</b></button>' +
        '<button type="button" data-oauth style="min-width:140px;padding:12px 16px;border-radius:12px;border:0;background:#1a73e8;color:#fff;cursor:pointer"><b>OAuth</b></button>' +
        '</div></div>';
      root.querySelector('[data-login]').onclick = function () { loginThenHome(root, loginUrl, homeUrl); };
      root.querySelector('[data-oauth]').onclick = function () { loginThenHome(root, loginUrl, homeUrl); };
    };
  }
  function googleMethods(label, methods) {
    return function (root) {
      root.innerHTML = '<div style="height:100%;display:flex;flex-direction:column;min-height:0;background:#fff"><div style="flex:none;display:flex;gap:6px;align-items:center;padding:6px 8px;font:12px system-ui;overflow:auto"><span style="font-weight:700">' + label + '</span><span style="opacity:.7">Stays in this window.</span></div><div class="sjt" style="flex:1;min-height:0;position:relative;background:#fff"></div></div>';
      var bar = root.querySelector('div');
      var box = root.querySelector('.sjt');
      function show(item) {
        box.innerHTML = '';
        var frame = document.createElement('iframe');
        frame.setAttribute('referrerpolicy', 'no-referrer');
        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals allow-downloads allow-pointer-lock');
        frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff';
        frame.src = '/api/opera?u=' + encodeURIComponent(item[1]) + '&b=' + encodeURIComponent(item[2]);
        box.appendChild(frame);
      }
      methods.forEach(function (item, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = item[0];
        b.style.cssText = 'border:0;border-radius:8px;padding:6px 10px;cursor:pointer;font-weight:650;background:' + (i ? '#e8eaed' : '#1a73e8') + ';color:' + (i ? '#111' : '#fff');
        b.onclick = function () { show(item); };
        bar.appendChild(b);
      });
      show(methods[0]);
    };
  }
  function wireLoginApps() {
    try {
      if (!window.XAPPS) return;
      if (window.APPS) delete window.APPS.classroom;
      installGoogleApps();
      delete window.XAPPS.canva;
      if (window.APPS) delete window.APPS.canva;
      window.__driftRoblox = robloxShell;
      window.__driftGmail = googleAppsShell('https://mail.google.com/mail/u/0/');
      window.XAPPS.roblox = { n: 'Roblox', f: robloxShell };
    } catch (e) {}
  }
  function classAction(message) {
    var on = false;
    try { on = localStorage.getItem('wos:protector') === '1'; } catch (e) {}
    if (!on) return;
    var mode = 'alert';
    try { mode = localStorage.getItem('wos:prot-class') || 'alert'; } catch (e2) {}
    var text = message || 'Protector: you connected to a class.';
    try { alert(text); } catch (err) {}
    if (mode === 'classroom') {
      try { location.replace('https://classroom.google.com/'); } catch (err2) {}
    }
  }
  function protectorHit(why) {
    var on = false;
    try { on = localStorage.getItem('wos:protector') === '1'; } catch (e) {}
    if (!on) return;
    var now = Date.now();
    if (window.__driftProtAt && now - window.__driftProtAt < 2500) return;
    window.__driftProtAt = now;
    try { console.warn('[Drift Protector]', why); } catch (e) {}
    classAction('Protector: class connection (' + (why || 'signal') + ').');
  }
  function installProtector() {
    if (window.__driftProtHook) return;
    window.__driftProtHook = true;
    var strong = /StreamingClass|startStreamingClass|streaming[_ ]?(class|screen)|class started|clase iniciada|live view|teacher is viewing|viewing your screen|screen capture started|captureVisibleTab|screenshot|frame captured|lanschool|dyknow|impero|hapara|classwize|linewize|goguardian|securly|joined class|connected to class|teacher started|(?:127\.0\.0\.1|localhost).{0,80}(?:class|stream|monitor|screenshot|teacher|liveview)|(?:class|stream|monitor|screenshot|teacher).{0,40}(?:127\.0\.0\.1|localhost)/i;
    var toolRe = /classwize|linewize|goguardian|securly|lanschool|dyknow|impero|hapara|classlink|goguardian/i;
    function classUrl(u) {
      u = String(u || '');
      if (toolRe.test(u)) return true;
      return /localhost|127\.0\.0\.1/i.test(u) && /class|stream|monitor|screenshot|teacher|liveview|capture|frame/i.test(u);
    }
    function consider(text, why) {
      if (!text) return;
      if (strong.test(text)) protectorHit(why);
    }
    ['log', 'info', 'debug', 'warn', 'error'].forEach(function (m) {
      var orig = console[m];
      if (typeof orig !== 'function' || orig.__driftProt) return;
      var wrapped = function () {
        try { consider(Array.prototype.join.call(arguments, ' '), m); } catch (e) {}
        return orig.apply(console, arguments);
      };
      wrapped.__driftProt = true;
      console[m] = wrapped;
    });
    window.addEventListener('message', function (ev) {
      try {
        var text = typeof ev.data === 'string' ? ev.data : JSON.stringify(ev.data || '');
        consider(text, 'message');
      } catch (e) {}
    });
    try {
      var NativeWS = window.WebSocket;
      if (NativeWS && !NativeWS.__driftProt) {
        function WrappedWS(url, protocols) {
          var ws = protocols !== undefined ? new NativeWS(url, protocols) : new NativeWS(url);
          try {
            var u = String(url || '');
            if (classUrl(u)) protectorHit('websocket');
            ws.addEventListener('message', function (ev) {
              var text = '';
              try { text = typeof ev.data === 'string' ? ev.data : ''; } catch (e) {}
              consider(u + ' ' + text, 'websocket');
            });
          } catch (e) {}
          return ws;
        }
        WrappedWS.prototype = NativeWS.prototype;
        WrappedWS.__driftProt = true;
        window.WebSocket = WrappedWS;
      }
    } catch (e) {}
    try {
      var origFetch = window.fetch;
      if (typeof origFetch === 'function' && !origFetch.__driftProt) {
        var wrappedFetch = function (input, init) {
          try {
            var u = typeof input === 'string' ? input : (input && input.url) || '';
            if (classUrl(u)) consider(u, 'fetch');
          } catch (e) {}
          return origFetch.apply(this, arguments);
        };
        wrappedFetch.__driftProt = true;
        window.fetch = wrappedFetch;
      }
    } catch (e) {}
    try {
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (en) {
          var n = en.name || '';
          if (classUrl(n)) protectorHit('network');
        });
      });
      po.observe({ type: 'resource', buffered: true });
    } catch (e) {}
    var joinRe = /class started|clase iniciada|joined class|you(?:'ve| have) joined|now in class|connected to class|teacher started|en clase|sesi[oó]n iniciada|class is in session/i;
    function classBlob(node) {
      if (!node || node.nodeType !== 1) return '';
      if (node.closest && node.closest('#drift-settings-panel,#drift-docs,#drift-snow')) return '';
      var blob = '';
      try {
        blob += (node.id || '') + ' ' + (typeof node.className === 'string' ? node.className : '') + ' ';
        if (node.src) blob += node.src + ' ';
        if (node.getAttribute) blob += (node.getAttribute('src') || '') + ' ' + (node.getAttribute('title') || '') + ' ';
        var tx = node.childNodes && node.childNodes.length < 8 ? (node.innerText || '') : '';
        if (tx && tx.length < 240) blob += tx;
      } catch (err) {}
      return blob;
    }
    function sawClass(node) {
      var blob = classBlob(node);
      if (!blob || !joinRe.test(blob)) return;
      if (!toolRe.test(blob) && !/localhost|127\.0\.0\.1/i.test(blob)) return;
      if (window.__driftClassAt) return;
      window.__driftClassAt = Date.now();
      protectorHit('class');
    }
    function scanLinewize() {
      if (window.__driftClassAt) return;
      var nodes = document.querySelectorAll('iframe,div,span');
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (!node || (node.closest && node.closest('#desk,#menu,#task,.win,#drift-settings-panel,#drift-snow,#drift-docs'))) continue;
        var src = '';
        try { src = node.getAttribute ? (node.getAttribute('src') || '') : ''; } catch (e) {}
        var blob = (node.id || '') + ' ' + (typeof node.className === 'string' ? node.className : '') + ' ' + src;
        var text = '';
        try { if (node.childNodes && node.childNodes.length < 6) text = (node.innerText || '').slice(0, 180); } catch (e2) {}
        if (!toolRe.test(blob + ' ' + text) && !/localhost|127\.0\.0\.1/i.test(blob + ' ' + text)) continue;
        if (!/class started|clase iniciada|joined class|live view|viewing your screen|streaming|en clase ahora|class is in session/i.test(blob + ' ' + text)) continue;
        window.__driftClassAt = Date.now();
        var msg = text.replace(/\s+/g, ' ').trim().slice(0, 140);
        protectorHit('class');
        return;
      }
    }
    try {
      var classObs = new MutationObserver(function (list) {
        for (var i = 0; i < list.length; i++) {
          var rec = list[i];
          if (rec.target) sawClass(rec.target);
          var added = rec.addedNodes || [];
          for (var k = 0; k < added.length; k++) sawClass(added[k]);
        }
        scanLinewize();
      });
      classObs.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'class', 'id'] });
      setInterval(scanLinewize, 4000);
    } catch (e) {}
  }
  function openDriftDocs() {
    var old = document.getElementById('drift-docs');
    if (old) { old.remove(); return; }
    var el = document.createElement('div');
    el.id = 'drift-docs';
    el.style.cssText = 'position:fixed;inset:24px;z-index:2147483002;overflow:auto;background:#12121a;color:#eee;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:18px 20px;box-shadow:0 20px 60px rgba(0,0,0,.5);font:14px/1.5 system-ui';
    el.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><b style="font-size:18px">Drift docs</b><button type="button" data-x style="border:0;background:transparent;color:#aaa;font-size:22px;cursor:pointer">×</button></div>' +
      '<p style="opacity:.75;margin-top:0">Errors seen on ChromeOS and Windows, and what to do. After a deploy, hard refresh with Ctrl+Shift+R.</p>' +
      '<h3>ChromeOS</h3>' +
      '<p><b>BareMux no respondió / Scramjet server is down or blocked.</b> Render is waking up or the school network blocks the WebSocket. Wait 30–60 seconds, stay on the tab, then press Retry. Do not reload in a loop.</p>' +
      '<p><b>Some apps stay blank for a few minutes.</b> The proxy is still connecting. Wait. TikTok, Gemini and Gimkit need that first connection.</p>' +
      '<p><b>ServiceWorker script evaluation failed.</b> Hard refresh. If it stays, close the tab and open Drift again. Do not use an old bookmark to a Vercel preview.</p>' +
      '<p><b>Gmail and Classroom login.</b> Gmail stays inside the app as Firefox. Continue no longer reloads the email step. Classroom login stays as Edge. Classroom Oauth opens the sign-in on another page and, when you close it, Classroom loads here. Canva still opens in this Chromebook’s Chrome, because Canva blocks the server. Roblox opens in this same window as Microsoft Edge. It does not open a new window.</p>' +
      '<p><b>SharedWorker / cdn.jsdelivr.net/baremux.</b> Unity cannot use a worker from another site. Drift blocks that CDN and uses /baremux on the same origin. If the game still fails, use Open outside proxy (Unity).</p>' +
      '<h3>Windows</h3>' +
      '<p><b>Same proxy errors as ChromeOS</b> (BareMux, cold start, Service Worker). Same fix: wait, then Ctrl+Shift+R.</p>' +
      '<p><b>Games: Failed to fetch …/null or Ruffle movie null.</b> That game has no URL. Drift skips those. Pick another, or open a working one outside the proxy.</p>' +
      '<p><b>Unity: Failed to construct SharedWorker.</b> Same as ChromeOS. Use Open outside proxy (Unity).</p>' +
      '<p><b>Page looks like an old version after refresh or Wi-Fi drop.</b> The browser kept an old script. Ctrl+Shift+R. Drift sends the page with no-store so the next load is the current commit.</p>' +
      '<p><b>Task bar or title bar gone.</b> Move the mouse to the bottom-left corner (task bar) or top-left corner (title). The Show button only appears there and disappears after you click it.</p>' +
      '<h3>Both</h3>' +
      '<p><b>Wayground.</b> It opens inside the app with no proxy. Drift Intelligence injects the mod when the page allows it. Answers that arrive as markdown are shown as tables or code, not asterisks.</p>' +
      '<p><b>Protector did nothing.</b> Turn it on in Settings. A website cannot see the Linewize icon, the teacher popup, the ChromeOS camera dot, the fan, or the address-bar spinner. Drift can see Class started, Streaming screen, Heartbeat sent, and screenshot uploads only if they show up in this page (console, a request, or a socket). It does not leave just because the extension is installed.</p>';
    el.querySelector('[data-x]').onclick = function () { el.remove(); };
    document.body.appendChild(el);
  }
  function sizeRadios(name, current) {
    if (!SIZE_MAP[current]) current = 'lg';
    var items = [
      ['xl', 'Extra large (x3 larger than the normal apps)'],
      ['lg', 'Large (x2 larger than normal apps) (Default)'],
      ['sm', 'Small (x1.7)'],
      ['xs', 'Extra small (x1.5)']
    ];
    return items.map(function (it) {
      return '<label style="display:flex;gap:8px;align-items:flex-start;margin:4px 0;cursor:pointer"><input type="radio" name="' + name + '" value="' + it[0] + '"' + (current === it[0] ? ' checked' : '') + ' style="margin-top:3px"/> <span>' + it[1] + '</span></label>';
    }).join('');
  }
  function reloadOpenLibrary(label) {
    var fn = null;
    try {
      if (label === 'Movies' && window.XAPPS && window.XAPPS.movies) fn = window.XAPPS.movies.f;
      if (label === 'Games' && window.XAPPS && window.XAPPS.games) fn = window.XAPPS.games.f;
    } catch (e) {}
    if (typeof fn !== 'function') return;
    document.querySelectorAll('#desk > .win').forEach(function (w) {
      var b = w.querySelector(':scope > .title b');
      if (!b || (b.textContent || '').indexOf(label) < 0) return;
      var body = w.querySelector(':scope > .body');
      if (!body) return;
      body.innerHTML = '';
      try { fn(body, w); } catch (err) {}
    });
  }
    function googleMenuBody() {
      var old = document.getElementById('drift-gmenu');
      if (old) { old.remove(); var mk0 = document.getElementById('drift-gmark'); if (mk0) mk0.remove(); window.__driftGBar = null; return; }
      var css = document.getElementById('drift-gmenu-css');
      if (!css) {
        css = document.createElement('style');
        css.id = 'drift-gmenu-css';
        css.textContent = '#drift-gmark{position:fixed;left:14px;bottom:18px;z-index:2147483646;width:58px;height:58px;padding:0;border:0;border-radius:18px;overflow:hidden;cursor:pointer;background:linear-gradient(160deg,#7EC8FF,#0B1A36);box-shadow:0 10px 28px rgba(0,0,0,.28)}#drift-gmark svg{display:block;width:100%;height:100%}#drift-gmenu{position:fixed;left:14px;top:14px;bottom:14px;z-index:2147483646;display:flex;width:min(420px,calc(100vw - 28px));color:#111;border-radius:28px;overflow:hidden;font:13px/1.4 system-ui,sans-serif;background:rgba(255,255,255,.28);border:1px solid rgba(255,255,255,.5);box-shadow:0 18px 50px rgba(0,0,0,.22);backdrop-filter:blur(28px) saturate(1.7);-webkit-backdrop-filter:blur(28px) saturate(1.7)}#drift-gmenu[hidden]{display:none!important}#drift-gmenu [data-rail]{width:74px;flex:none;display:flex;flex-direction:column;gap:12px;align-items:center;padding:16px 0;background:rgba(8,12,24,.62)}#drift-gmenu [data-tab]{width:48px;height:48px;border:0;border-radius:16px;background:rgba(255,255,255,.14);color:#f4f7fb;display:grid;place-items:center;cursor:pointer;padding:0}#drift-gmenu [data-tab].on{background:#3b82f6;color:#fff;box-shadow:0 8px 18px rgba(37,99,235,.35)}#drift-gmenu [data-main]{flex:1;min-width:0;overflow:auto;padding:14px 14px 12px;scrollbar-width:none}#drift-gmenu input,#drift-gmenu select,#drift-gmenu textarea{width:100%;box-sizing:border-box;margin-top:4px;padding:8px;border-radius:14px;border:1px solid rgba(255,255,255,.55);background:rgba(255,255,255,.55);color:#111}#drift-gmenu button{border:0;border-radius:14px;background:#c5c8ce;color:#111;font-weight:700;padding:8px 10px;cursor:pointer}#drift-gmenu [data-tab]{font-weight:500;padding:0}#drift-gmenu input[type=checkbox]{appearance:none;-webkit-appearance:none;width:56px;height:32px;margin:0;padding:0;border:0;border-radius:999px;background:#8e8e93;box-shadow:inset 0 0 0 2px rgba(0,0,0,.35);position:relative;flex:none;cursor:pointer}#drift-gmenu input[type=checkbox]:after{content:"";position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.35);transition:left .15s}#drift-gmenu input[type=checkbox]:checked{background:#34c759}#drift-gmenu input[type=checkbox]:checked:after{left:27px}#drift-gmenu [data-log]{display:flex;flex-direction:column;gap:6px;min-height:80px;max-height:42vh;overflow:auto;scrollbar-width:none}#drift-gmenu .u{align-self:flex-end;max-width:86%;background:#1a73e8;color:#fff;border-radius:16px 16px 6px 16px;padding:6px 8px}#drift-gmenu .a{align-self:flex-start;max-width:92%;background:rgba(255,255,255,.78);color:#111;border-radius:16px 16px 16px 6px;padding:6px 8px}#drift-gmenu .drift-compose{margin-top:10px;background:rgba(255,255,255,.72);border:1px solid rgba(0,0,0,.06);border-radius:26px;padding:10px 12px 8px;box-shadow:0 8px 24px rgba(0,0,0,.06)}#drift-gmenu .drift-compose textarea{border:0;background:transparent;min-height:44px;padding:4px 2px;resize:none}#drift-gmenu .drift-row{display:flex;align-items:center;gap:8px;margin-top:4px}#drift-gmenu .drift-pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;border:1px solid rgba(0,0,0,.12);background:#fff;color:#111;font-weight:650;padding:6px 10px}#drift-gmenu .drift-pill.on,#drift-gmenu [data-mode].on{background:#111;color:#fff}#drift-gmenu .drift-ico{width:32px;height:32px;border-radius:50%;background:#fff;border:1px solid rgba(0,0,0,.1);display:grid;place-items:center;padding:0}#drift-gmenu [data-modes]{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}#drift-gmenu [data-mode]{border-radius:999px;background:rgba(255,255,255,.7);border:1px solid rgba(0,0,0,.1);padding:6px 10px}#drift-gmenu table{border-collapse:collapse;width:100%}';
        document.documentElement.appendChild(css);
      }
      var bar = document.createElement('div');
      bar.id = 'drift-gmenu';
      bar.innerHTML = '<nav data-rail><button type="button" data-tab="home" class="on" aria-label="Home"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M3.8 11.2 12 4.2l8.2 7v8.2a1.2 1.2 0 0 1-1.2 1.2h-4.4v-6.2H9.4V20.6H5a1.2 1.2 0 0 1-1.2-1.2z"/></svg></button><button type="button" data-tab="settings" aria-label="Settings"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M10.2 2.8h3.6l.4 2.1a7.2 7.2 0 0 1 1.7.7l1.9-1.1 2.5 2.5-1.1 1.9c.3.5.5 1.1.7 1.7l2.1.4v3.6l-2.1.4a7.2 7.2 0 0 1-.7 1.7l1.1 1.9-2.5 2.5-1.9-1.1a7.2 7.2 0 0 1-1.7.7l-.4 2.1h-3.6l-.4-2.1a7.2 7.2 0 0 1-1.7-.7l-1.9 1.1-2.5-2.5 1.1-1.9a7.2 7.2 0 0 1-.7-1.7l-2.1-.4V9.6l2.1-.4c.2-.6.4-1.2.7-1.7L3.5 5.6l2.5-2.5 1.9 1.1c.5-.3 1.1-.5 1.7-.7l.6-1.7zM12 9.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 9.2z"/></svg></button><button type="button" data-tab="ai" aria-label="AI"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2.4 13.7 8.3 19.6 10 13.7 11.7 12 17.6 10.3 11.7 4.4 10 10.3 8.3z"/><path fill="currentColor" d="M18.2 14.2 18.9 16.4 21.1 17.1 18.9 17.8 18.2 20 17.5 17.8 15.3 17.1 17.5 16.4z"/></svg></button></nav><div data-main><div data-view="home" data-settings><b>Home</b><div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><b>Protector</b><input type="checkbox" data-k="wos:protector" style="width:auto"></div><div style="margin-top:8px">When a class connects<select data-k="wos:prot-class"><option value="alert">Only alert</option><option value="classroom">Alert and open Classroom</option></select></div><div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(0,0,0,.12)"><b>custom keybinds</b><div data-kb-note style="opacity:.7;font-size:11px">Only 3 controls</div><label style="display:block;margin-top:8px">Hide non-edu apps<input data-kb="wos:kb-hide" readonly></label><label style="display:block;margin-top:8px">Classroom<input data-kb="wos:kb-class" readonly></label><label style="display:block;margin-top:8px">Discovery<input data-kb="wos:kb-disc" readonly></label><label style="display:block;margin-top:8px">ALEKS<input data-kb="wos:kb-aleks" readonly></label><label style="display:block;margin-top:8px">Google Docs<input data-kb="wos:kb-docs" readonly></label></div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><b>AI assistant</b><input type="checkbox" data-orb style="width:auto"></div><div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(0,0,0,.12)"><b>Clean search history</b><select data-clean-site><option value="docs">Google Docs</option><option value="discovery">Discovery Education</option><option value="classroom">Classroom</option><option value="canva">Canva</option><option value="other">Wikipedia</option></select><label style="display:block;margin-top:6px">Tabs (1 to 20)<input data-clean-n type="number" min="1" max="20" value="1"></label><div style="display:flex;gap:8px;margin-top:8px"><button type="button" data-clean-open style="flex:1">Open</button><button type="button" data-clean-random style="flex:1;background:transparent;border:1px solid rgba(0,0,0,.2)">Random</button></div></div></div><div data-view="settings" hidden><b>Settings</b></div><div data-view="ai" data-chat hidden><div data-log></div><div data-model style="opacity:.6;font-size:11px;margin-top:6px"></div><select data-pick aria-label="Modelo"><option value="">Auto</option></select><div data-modes><button type="button" data-mode="fast">Fast</button><button type="button" data-mode="think">Think</button><button type="button" data-mode="expert">Expert</button></div><div class="drift-compose"><textarea data-ai placeholder="Escribe o mantén presionado para hablar"></textarea><div class="drift-row"><button type="button" class="drift-pill" data-act="think"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><circle cx="12" cy="12" r="1.7" fill="currentColor"/><ellipse cx="12" cy="12" rx="8" ry="3.1" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="8" ry="3.1" transform="rotate(60 12 12)" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="8" ry="3.1" transform="rotate(120 12 12)" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>Pensar</button><button type="button" class="drift-pill" data-act="search"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="3.3" ry="8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4 12h16M6.3 7.6h11.4M6.3 16.4h11.4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>Buscar</button><span style="flex:1"></span><button type="button" class="drift-ico" data-plus aria-label="Adjuntar"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button><button type="button" class="drift-ico" data-mic aria-label="Hablar"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button></div></div><input data-file type="file" hidden><button type="button" data-ask hidden>Send</button></div></div>';
      var mark = document.getElementById('drift-gmark');
      if (!mark) {
        mark = document.createElement('button');
        mark.id = 'drift-gmark';
        mark.type = 'button';
        mark.setAttribute('aria-label', 'Drift');
        mark.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="url(#dg)"/><defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ad7ff"/><stop offset="1" stop-color="#12315f"/></linearGradient></defs><path d="M32 12 46 28 32 52 18 28z" fill="#fff" opacity=".95"/><path d="M32 20 40 30 32 44 24 30z" fill="#7EC8FF"/></svg>';
        document.documentElement.appendChild(mark);
      }
      mark.onclick = function () { bar.style.display = 'flex'; bar.hidden = !bar.hidden; };
      document.documentElement.appendChild(bar);
      window.__driftGBar = bar;
      var body = bar.querySelector('[data-body]');
      var settings = bar.querySelector('[data-settings]');
      var chat = bar.querySelector('[data-chat]');
      var toggle = bar.querySelector('[data-toggle]');
      var turns = [];
      var fileNote = '';
      var fileImage = '';
      try { localStorage.removeItem('wos:bar-box'); } catch (e) {}
      function saveBox() {
        try { localStorage.setItem('wos:bar-box', JSON.stringify({ l: bar.offsetLeft, t: bar.offsetTop, w: bar.offsetWidth, h: bar.offsetHeight })); } catch (e) {}
      }
      var dragBar = null;
      function bindDrag(handle) {
        if (!handle) return;
        handle.addEventListener('pointerdown', function (e) {
          if (e.target && e.target.closest && e.target.closest('button,input,textarea,select,a')) return;
          dragBar = { x: e.clientX, y: e.clientY, l: bar.offsetLeft, t: bar.offsetTop };
          bar.style.right = 'auto'; bar.style.bottom = 'auto';
          try { handle.setPointerCapture(e.pointerId); } catch (err) {}
        });
        handle.addEventListener('pointermove', function (e) {
          if (!dragBar) return;
          bar.style.left = (dragBar.l + e.clientX - dragBar.x) + 'px';
          bar.style.top = (dragBar.t + e.clientY - dragBar.y) + 'px';
        });
        handle.addEventListener('pointerup', function () { if (dragBar) { dragBar = null; saveBox(); } });
        handle.addEventListener('pointercancel', function () { if (dragBar) { dragBar = null; saveBox(); } });
      }
      bindDrag(bar.querySelector('[data-head]'));
      bindDrag(bar.querySelector('[data-foot]'));
      if (window.ResizeObserver) { try { new ResizeObserver(function () { if (bar.isConnected) saveBox(); }).observe(bar); } catch (e) {} }
      function mode(m) {
        try { localStorage.setItem('wos:pass-bar', m); } catch (e) {}
        var off = m === 'off';
        var open = m !== 'mini' && !off;
        bar.style.display = off ? 'none' : 'flex';
        if (body) body.hidden = !open;
        if (toggle) toggle.textContent = open ? 'Close' : 'Open';
        var peek = document.getElementById('drift-gmenu-peek');
        if (m !== 'off' && peek) peek.style.display = 'none';
        if (m === 'off' && !peek) {
          peek = document.createElement('button');
          peek.id = 'drift-gmenu-peek';
          peek.type = 'button';
          peek.textContent = 'Show';
          peek.style.cssText = 'display:none;position:fixed;right:10px;bottom:10px;z-index:2147483646;border:0;border-radius:999px;background:rgba(255,255,255,.8);color:#111;padding:8px 12px;font:700 12px system-ui;cursor:pointer';
          peek.onclick = function () { mode('full'); };
          document.documentElement.appendChild(peek);
          if (!window.__driftGPeek) {
            window.__driftGPeek = 1;
            window.addEventListener('pointermove', function (e) {
              var on = 'full';
              try { on = localStorage.getItem('wos:pass-bar') || 'full'; } catch (err) {}
              var p = document.getElementById('drift-gmenu-peek');
              if (!p) return;
              if (on !== 'off') { p.style.display = 'none'; return; }
              p.style.display = (e.clientX > innerWidth - 120 && e.clientY > innerHeight - 80) ? 'block' : 'none';
            });
          }
        }
      }
      var saved = 'full';
      try { saved = localStorage.getItem('wos:pass-bar') || 'full'; } catch (e) {}
      mode('full');
      bar.style.display = 'flex';
      bar.hidden = true;
      if (toggle) toggle.onclick = function () { mode(body.hidden ? 'full' : 'mini'); };
      var killBtn = bar.querySelector('[data-kill]');
      if (killBtn) killBtn.onclick = function () { mode('off'); };
      bar.querySelectorAll('[data-k]').forEach(function (el) {
        var k = el.getAttribute('data-k');
        try { if (el.type === 'checkbox') el.checked = localStorage.getItem(k) === '1'; else el.value = localStorage.getItem(k) || ''; } catch (e) {}
        el.onchange = function () { try { localStorage.setItem(k, el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value); } catch (e) {} };
      });
      function keyName(e) {
        if (e.key === ' ') return 'Space';
        if (e.key === 'Control') return 'Ctrl';
        if (e.key === 'Alt') return 'Alt';
        if (e.key === 'Shift') return 'Shift';
        if (e.key === 'Meta') return 'Meta';
        return e.key.length === 1 ? e.key.toUpperCase() : e.key;
      }
      function matchCombo(e, combo) {
        var parts = String(combo || '').split('+').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
        if (!parts.length) return false;
        var down = {};
        var pressed = window.__driftPressed || {};
        if (e.ctrlKey) down.ctrl = 1;
        if (e.altKey) down.alt = 1;
        if (e.shiftKey) down.shift = 1;
        if (e.metaKey) down.meta = 1;
        Object.keys(pressed).forEach(function (kk) { if (pressed[kk]) down[kk] = 1; });
        var n = keyName(e).toLowerCase();
        if (n !== 'ctrl' && n !== 'alt' && n !== 'shift' && n !== 'meta') down[n] = 1;
        for (var i = 0; i < parts.length; i++) if (!down[parts[i]]) return false;
        return true;
      }
      bar.querySelectorAll('[data-kb]').forEach(function (el) {
        var k = el.getAttribute('data-kb');
        var fb = k === 'wos:kb-hide' ? 'F9' : (k === 'wos:kb-class' ? 'F10' : '');
        var savedKb = '';
        try { savedKb = localStorage.getItem(k) || ''; } catch (e) {}
        el.value = savedKb || fb;
        el.addEventListener('focus', function () { el._keys = []; el._prev = el.value; });
        el.addEventListener('keydown', function (e) {
          e.preventDefault(); e.stopPropagation();
          if (!el._keys) el._keys = [];
          var name = keyName(e);
          if (el._keys.indexOf(name) < 0 && el._keys.length < 8) el._keys.push(name);
          el.value = el._keys.join('+');
          clearTimeout(el._t);
          el._t = setTimeout(function () {
            var next = String(el.value || '').trim();
            var was = String(el._prev || '').trim();
            var others = 0;
            bar.querySelectorAll('[data-kb]').forEach(function (x) { if (x !== el && String(x.value || '').trim()) others++; });
            if (next && !was && others >= 3) {
              el.value = was;
              var note = bar.querySelector('[data-kb-note]');
              if (note) note.textContent = 'Only 3 controls';
              el._keys = [];
              return;
            }
            try { localStorage.setItem(k, next); } catch (err) {}
            if (!next && fb) el.value = fb;
            el._keys = [];
            el.blur();
          }, 700);
        });
      });
      function pull(j) { return ((j && j.content) || []).map(function (x) { return x.text || ''; }).join('').trim(); }
      function driftCatalog() {
        return [
          { id: 'mistralai/mistral-small-2603', name: 'Mistral Small', fast: 5, think: 2, expert: 0, search: 0 },
          { id: 'google/gemini-3.8-flash', name: 'Gemini 3.8 Flash', fast: 4, think: 4, expert: 2, search: 5 },
          { id: 'mistralai/mistral-medium-3.5', name: 'Mistral Medium 3.5', fast: 3, think: 4, expert: 2, search: 1 },
          { id: 'mistralai/mistral-large-2512', name: 'Mistral Large 3', fast: 1, think: 3, expert: 4, search: 1 },
          { id: 'cohere/command-a-reasoning', name: 'Command A Reasoning', fast: 1, think: 3, expert: 5, search: 0 },
          { id: 'qwen/qwen3.7-flash:free', name: 'Qwen3.7 Flash', fast: 4, think: 2, expert: 1, search: 1 },
          { id: 'qwen/qwen3.8-max:free', name: 'Qwen3.8 Max', fast: 1, think: 3, expert: 3, search: 1 },
          { id: 'qwen/qwen3.6-plus:free', name: 'Qwen3.6 Plus', fast: 2, think: 3, expert: 2, search: 1 },
          { id: 'qwen/qwen3.5-plus:free', name: 'Qwen3.5 Plus', fast: 2, think: 3, expert: 2, search: 1 },
          { id: 'qwen/qwen3.8-omni-flash:free', name: 'Qwen3.8 Omni', fast: 3, think: 2, expert: 1, search: 1 },
          { id: 'qwen/qwen3.7-max:free', name: 'Qwen3.7 Max', fast: 1, think: 3, expert: 3, search: 1 },
          { id: 'qwen/qwen3.7-plus:free', name: 'Qwen3.7 Plus', fast: 3, think: 3, expert: 2, search: 1 },
          { id: 'qwen/qwen3.5-397b-a17b:free', name: 'Qwen3.5 397B', fast: 1, think: 3, expert: 4, search: 1 },
          { id: 'cohere/command-a-plus', name: 'Command A+', fast: 2, think: 3, expert: 3, search: 1 },
          { id: 'mistralai/devstral-medium', name: 'Devstral', fast: 2, think: 2, expert: 2, search: 0 },
          { id: 'mistralai/codestral-2508', name: 'Codestral', fast: 2, think: 2, expert: 2, search: 0 },
          { id: 'cohere/north-mini-code', name: 'North Mini Code', fast: 3, think: 2, expert: 2, search: 0 }
        ];
      }
      function driftPick() {
        if (bar.dataset.pin) {
          var pinned = null;
          driftCatalog().forEach(function (m) { if (m.id === bar.dataset.pin) pinned = m; });
          if (pinned) {
            bar._model = pinned;
            var pinnedLab = bar.querySelector('[data-model]');
            if (pinnedLab) pinnedLab.textContent = pinned.name;
            return pinned;
          }
        }
        var fast = bar.dataset.fast === '1';
        var think = bar.dataset.think === '1';
        var expert = bar.dataset.expert === '1';
        var w = { fast: 0, think: 0, expert: 0, search: 0 };
        if (fast) w.fast += 3;
        if (think) w.think += 3;
        if (expert) w.expert += 3;
        if (bar.dataset.searchOn === '1') w.search += 4;
        if (bar.dataset.smart === '1') w.expert += 4;
        if (!fast && !think && !expert && bar.dataset.searchOn !== '1' && bar.dataset.smart !== '1') w.think += 3;
        var best = driftCatalog()[1], score = -1;
        driftCatalog().forEach(function (m) {
          var s = m.fast * w.fast + m.think * w.think + m.expert * w.expert + m.search * w.search;
          if (s > score) { score = s; best = m; }
        });
        bar._model = best;
        var lab = bar.querySelector('[data-model]');
        if (lab) lab.textContent = best.name;
        return best;
      }
      async function driftCall(model, messages, tokens) {
        var r = await fetch('https://holy-firefly-982c.fert0480.workers.dev/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: model.id, max_tokens: tokens, messages: [{ role: 'system', content: 'You are ' + model.name + '. If asked which model you are, answer exactly ' + model.name + '. Do not say you are a different model.' }].concat(messages) }) });
        var j = await r.json();
        var text = pull(j);
        if (text) return text;
        throw new Error((j && j.error && (j.error.message || j.error)) || 'Try again.');
      }
      async function driftFast(messages) {
        var m = driftPick();
        return driftCall(m, messages, m.fast >= 4 ? 900 : 1400);
      }
      async function driftVision(data, ask) {
        var m = { id: 'google/gemini-3.8-flash', name: 'Gemini 3.8 Flash' };
        bar._model = m;
        var lab = bar.querySelector('[data-model]');
        if (lab) lab.textContent = m.name;
        var r = await fetch('https://holy-firefly-982c.fert0480.workers.dev/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: m.id, max_tokens: 700, messages: [{ role: 'system', content: 'You are Gemini 3.8 Flash.' }, { role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: data } }, { type: 'text', text: ask }] }] }) });
        var j = await r.json();
        var text = pull(j);
        if (!text) throw new Error('Try again.');
        return text;
      }
      function placeAns() {
        var n = document.getElementById('drift-ball-ans');
        var ball = document.getElementById('drift-gball');
        if (!n || !ball) return;
        var r = ball.getBoundingClientRect();
        var w = Math.min(320, window.innerWidth * 0.9);
        var left = r.left - w - 10;
        if (left < 8) left = Math.min(window.innerWidth - w - 8, r.right + 10);
        var top = Math.max(8, Math.min(window.innerHeight - 80, r.top));
        n.style.left = left + 'px';
        n.style.top = top + 'px';
        n.style.right = 'auto';
        n.style.bottom = 'auto';
      }
      function paintMd(el, text) {
        var s = String(text || '').replace(/\r\n/g, '\n');
        function esc(x) { return String(x).replace(/&/g, '&' + 'amp;').replace(/</g, '&' + 'lt;').replace(/>/g, '&' + 'gt;'); }
        function inline(x) {
          var h = esc(x);
          h = h.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
          h = h.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
          h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
          return h;
        }
        function isSep(line) {
          var t = String(line || '').trim();
          if (t.indexOf('|') < 0) return false;
          return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(t);
        }
        function cells(line) {
          var t = String(line || '').trim();
          if (t.charAt(0) === '|') t = t.slice(1);
          if (t.charAt(t.length - 1) === '|') t = t.slice(0, -1);
          return t.split('|').map(function (c) { return c.trim(); });
        }
        var lines = s.split('\n');
        var out = [];
        var i = 0;
        while (i < lines.length) {
          var line = lines[i];
          if (line.indexOf('|') !== -1 && i + 1 < lines.length && isSep(lines[i + 1])) {
            var head = cells(line);
            i += 2;
            var rows = [];
            while (i < lines.length && lines[i].indexOf('|') !== -1 && String(lines[i]).trim()) {
              rows.push(cells(lines[i]));
              i++;
            }
            var html = '<table style="border-collapse:collapse;width:100%;margin:6px 0;font-size:12px"><thead><tr>';
            head.forEach(function (c) { html += '<th style="border:1px solid rgba(0,0,0,.25);padding:4px 6px;text-align:left;background:rgba(255,255,255,.55)">' + inline(c) + '</th>'; });
            html += '</tr></thead><tbody>';
            rows.forEach(function (r) {
              html += '<tr>';
              head.forEach(function (_, k) { html += '<td style="border:1px solid rgba(0,0,0,.2);padding:4px 6px;vertical-align:top">' + inline(r[k] || '') + '</td>'; });
              html += '</tr>';
            });
            html += '</tbody></table>';
            out.push(html);
            continue;
          }
          if (/^### /.test(line)) out.push('<div style="font-weight:800;font-size:15px;margin:6px 0 2px">' + inline(line.slice(4)) + '</div>');
          else if (/^## /.test(line)) out.push('<div style="font-weight:800;font-size:16px;margin:6px 0 2px">' + inline(line.slice(3)) + '</div>');
          else if (/^# /.test(line)) out.push('<div style="font-weight:800;letter-spacing:.02em;margin:6px 0 2px">' + inline(line.slice(2)) + '</div>');
          else if (!String(line).trim()) out.push('<div style="height:6px"></div>');
          else out.push('<div>' + inline(line) + '</div>');
          i++;
        }
        el.style.whiteSpace = 'normal';
        el.innerHTML = out.join('');
      }
      function sayNear(text) {
        var n0 = document.getElementById('drift-ball-ans');
        if (n0) n0.remove();
        var n = document.createElement('div');
        n.id = 'drift-ball-ans';
        n.style.cssText = 'position:fixed;z-index:2147483646;width:min(320px,90vw);max-height:40vh;overflow:auto;background:rgba(255,255,255,.72);color:#111;border:1px solid rgba(255,255,255,.55);border-radius:18px;padding:10px 10px 10px 28px;font:13px/1.4 system-ui;box-shadow:0 12px 40px rgba(0,0,0,.18);backdrop-filter:blur(18px) saturate(1.5)';
        var x = document.createElement('button');
        x.type = 'button';
        x.textContent = '×';
        x.setAttribute('aria-label', 'Dismiss');
        x.style.cssText = 'position:absolute;left:6px;top:6px;width:22px;height:22px;border:0;border-radius:50%;background:transparent;color:#111;font-size:18px;line-height:1;cursor:pointer;padding:0';
        x.onclick = function (e) { e.stopPropagation(); n.remove(); };
        var body = document.createElement('div');
        paintMd(body, text);
        n.append(x, body);
        document.documentElement.appendChild(n);
        placeAns();
      }
      async function grab() {
        var stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        var video = document.createElement('video');
        video.srcObject = stream; video.muted = true;
        try { await video.play(); } catch (e) {}
        await new Promise(function (res) { setTimeout(res, 400); });
        var w = Math.min(960, video.videoWidth || 960);
        var h = Math.max(1, Math.round(w * ((video.videoHeight || 720) / (video.videoWidth || 1280))));
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(video, 0, 0, w, h);
        stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) {} });
        return canvas.toDataURL('image/jpeg', 0.62).split(',')[1];
      }
      async function screenAsk() {
        var data = '';
        try { data = await grab(); }
        catch (e) { sayNear('Allow the screen prompt, then tap the Drift ball again.'); return; }
        var q = prompt('What do you want to know about this screen?', 'What is on my screen?');
        if (!q) return;
        sayNear('…');
        var text = '';
        try { text = await driftVision(data, q); }
        catch (e1) { try { text = await driftVision(data, q); } catch (e2) { text = String((e2 && e2.message) || (e1 && e1.message) || ''); } }
        sayNear(text || 'Try again.');
      }
      function showBall(on) {
        try { localStorage.setItem('wos:ai-orb', on ? '1' : '0'); } catch (e) {}
        var ball = document.getElementById('drift-gball');
        if (!on) { if (ball) ball.remove(); return; }
        if (ball) return;
        ball = document.createElement('button');
        ball.id = 'drift-gball';
        ball.type = 'button';
        ball.style.cssText = 'position:fixed;right:18px;bottom:88px;z-index:2147483646;width:68px;height:68px;padding:0;border-radius:50%;border:2px solid rgba(255,255,255,.45);background:#071226;overflow:hidden;cursor:grab';
        ball.innerHTML = '<img alt="" referrerpolicy="no-referrer" src="https://drift.hostless.app/drift-mark.png" style="width:100%;height:100%;object-fit:cover;transform:scale(1.18);pointer-events:none">';
        var mark = ball.querySelector('img');
        if (mark) mark.onerror = function () { ball.style.background = 'radial-gradient(circle at 30% 30%, #7EC8FF, #0B1A36)'; this.remove(); };
        var drag = null;
        ball.addEventListener('pointerdown', function (e) {
          drag = { x: e.clientX, y: e.clientY, l: ball.offsetLeft, t: ball.offsetTop, moved: false };
          try { ball.setPointerCapture(e.pointerId); } catch (err) {}
        });
        ball.addEventListener('pointermove', function (e) {
          if (!drag) return;
          var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
          if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
          ball.style.left = (drag.l + dx) + 'px';
          ball.style.top = (drag.t + dy) + 'px';
          ball.style.right = 'auto'; ball.style.bottom = 'auto';
          placeAns();
        });
        ball.addEventListener('pointerup', function () { if (drag && !drag.moved) screenAsk(); drag = null; });
        document.documentElement.appendChild(ball);
      }
      var orb = bar.querySelector('[data-orb]');
      try { orb.checked = localStorage.getItem('wos:ai-orb') === '1'; } catch (e) {}
      showBall(orb.checked);
      orb.onchange = function () { showBall(orb.checked); };
      var sites = { docs: 'https://docs.google.com/', discovery: 'https://www.discoveryeducation.com/', classroom: 'https://classroom.google.com/', canva: 'https://www.canva.com/', other: 'https://en.wikipedia.org/' };
      function openClean(list) {
        var blocked = false;
        list.forEach(function (u) { var w = null; try { w = window.open(u, '_blank', 'popup,width=1100,height=760'); } catch (e) { w = null; } if (!w) blocked = true; });
        var btn = bar.querySelector('[data-clean-open]');
        if (blocked) { btn.hidden = false; btn.textContent = 'Allow pop-ups, then press Open'; }
        else btn.hidden = true;
      }
      bar.querySelector('[data-clean-open]').onclick = function () {
        var n = parseInt(bar.querySelector('[data-clean-n]').value, 10) || 1;
        if (n < 1) n = 1; if (n > 20) n = 20;
        var u = sites[bar.querySelector('[data-clean-site]').value] || sites.other;
        var list = []; for (var i = 0; i < n; i++) list.push(u); openClean(list);
      };
      bar.querySelector('[data-clean-random]').onclick = function () {
        var list = [sites.docs, sites.discovery, sites.classroom, sites.canva];
        for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = list[i]; list[i] = list[j]; list[j] = t; }
        openClean(list);
      };
      function bubble(kind, text) {
        var log = bar.querySelector('[data-log]');
        var d = document.createElement('div');
        d.className = kind === 'u' ? 'u' : 'a';
        if (kind === 'u') d.textContent = text;
        else paintMd(d, text);
        log.appendChild(d);
        log.scrollTop = log.scrollHeight;
        return d;
      }
      function usable(s) {
        if (!s) return '';
        var bad = 0, n = Math.min(s.length, 2000);
        for (var i = 0; i < n; i++) { var c = s.charCodeAt(i); if (c === 0 || c < 9) bad++; }
        if (bad > n * 0.05) return '';
        return s.slice(0, 14000);
      }
      var iaBtn = bar.querySelector('[data-ia]');
      if (iaBtn) iaBtn.onclick = function () {
        settings.hidden = true; chat.hidden = false; mode('full');
      };
      var backBtn = bar.querySelector('[data-back]');
      if (backBtn) backBtn.onclick = function () {
        settings.hidden = false; chat.hidden = true;
      };
      bar.querySelector('[data-file]').onchange = function () {
        var file = this.files && this.files[0];
        fileNote = ''; fileImage = '';
        if (!file) return;
        var reader = new FileReader();
        var img = /^image\//.test(file.type);
        reader.onload = function () {
          var raw = String(reader.result || '');
          if (img) fileImage = raw.split(',')[1] || '';
          else { var text = usable(raw); fileNote = text ? ('File ' + file.name + ':\n' + text) : ('File ' + file.name); }
        };
        if (img) reader.readAsDataURL(file); else reader.readAsText(file);
      };
      function stamp(el, text) {
        paintMd(el, text || 'Try again.');
        var name = bar._model && bar._model.name;
        if (!name) return;
        var tag = document.createElement('div');
        tag.textContent = name;
        tag.style.cssText = 'font-size:11px;font-weight:700;opacity:.6;margin-bottom:3px';
        el.insertBefore(tag, el.firstChild);
      }
      bar.querySelector('[data-ask]').onclick = function () {
        var box = bar.querySelector('[data-ai]');
        var q = box.value.trim();
        if (!q && !fileNote && !fileImage) return;
        box.value = '';
        bubble('u', q || (fileImage ? 'Image' : 'File'));
        var hold = bubble('a', '…');
        var note = fileNote, img = fileImage;
        fileNote = ''; fileImage = '';
        var input = bar.querySelector('[data-file]');
        if (input) input.value = '';
        var job = img ? driftVision(img, (q || 'What is in this image?') + (note ? '\n\n' + note : '')) : (function () {
          turns.push({ role: 'user', content: (q || 'Read the attached file.') + (note ? '\n\n' + note : '') });
          return driftFast(turns.slice(-8));
        })();
        Promise.resolve(job).then(function (text) {
          if (!img) turns.push({ role: 'assistant', content: text });
          stamp(hold, text || 'Try again.');
        }).catch(function () {
          var again = img ? driftVision(img, q || 'What is in this image?') : driftFast(turns.slice(-8));
          Promise.resolve(again).then(function (text) { stamp(hold, text || 'Try again.'); }).catch(function (err) { hold.textContent = String((err && err.message) || 'Try again.'); });
        });
      };
      function showTab(id) {
        bar.querySelectorAll('[data-view]').forEach(function (v) { v.hidden = v.getAttribute('data-view') !== id; });
        bar.querySelectorAll('[data-tab]').forEach(function (n) { n.classList.toggle('on', n.getAttribute('data-tab') === id); });
      }
      bar.querySelectorAll('[data-tab]').forEach(function (b) {
        b.onclick = function () { showTab(b.getAttribute('data-tab')); };
      });
      function clearPin() {
        bar.dataset.pin = '';
        var pick = bar.querySelector('[data-pick]');
        if (pick) pick.value = '';
      }
      var pick = bar.querySelector('[data-pick]');
      if (pick) {
        driftCatalog().forEach(function (m) {
          var o = document.createElement('option');
          o.value = m.id;
          o.textContent = m.name;
          pick.appendChild(o);
        });
        pick.onchange = function () {
          bar.dataset.pin = pick.value || '';
          driftPick();
        };
      }
      bar.querySelectorAll('[data-mode]').forEach(function (b) {
        b.onclick = function () {
          b.classList.toggle('on');
          bar.dataset[b.getAttribute('data-mode')] = b.classList.contains('on') ? '1' : '';
          clearPin();
          driftPick();
        };
      });
      bar.querySelectorAll('[data-act]').forEach(function (b) {
        b.onclick = function () {
          var on = b.classList.toggle('on');
          var kind = b.getAttribute('data-act');
          if (kind === 'search') bar.dataset.searchOn = on ? '1' : '';
          if (kind === 'think') bar.dataset.smart = on ? '1' : '';
          clearPin();
          driftPick();
          var box = bar.querySelector('[data-ai]');
          if (box && box.value.trim()) {
            var ask = bar.querySelector('[data-ask]');
            if (ask) ask.click();
          }
        };
      });
      var plus = bar.querySelector('[data-plus]');
      if (plus) plus.onclick = function () {
        var input = bar.querySelector('[data-file]');
        if (input) input.click();
      };
      var mic = bar.querySelector('[data-mic]');
      var rec = null;
      if (mic) {
        function stopMic() {
          mic.classList.remove('on');
          if (rec) { try { rec.stop(); } catch (e) {} }
        }
        mic.onpointerdown = function (e) {
          e.preventDefault();
          var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SR) return;
          if (!rec) {
            rec = new SR();
            rec.lang = 'es-MX';
            rec.interimResults = true;
            rec.onresult = function (ev) {
              var t = '';
              for (var i = ev.resultIndex; i < ev.results.length; i++) t += ev.results[i][0].transcript;
              var box = bar.querySelector('[data-ai]');
              if (box) box.value = t;
              if (ev.results[ev.results.length - 1].isFinal && box && box.value.trim()) {
                var ask = bar.querySelector('[data-ask]');
                if (ask) ask.click();
              }
            };
          }
          mic.classList.add('on');
          try { rec.start(); } catch (err) {}
        };
        mic.onpointerup = stopMic;
        mic.onpointercancel = stopMic;
      }
      var boxAi = bar.querySelector('[data-ai]');
      if (boxAi) boxAi.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          var ask = bar.querySelector('[data-ask]');
          if (ask) ask.click();
        }
      });
      driftPick();
      if (!window.__driftGKeys) {
        window.__driftGKeys = 1;
        window.__driftPressed = {};
        window.addEventListener('keydown', function (e) {
          var live = window.__driftGBar;
          var nm = (e.key === ' ' ? 'space' : String(e.key || '').toLowerCase());
          if (nm !== 'control' && nm !== 'alt' && nm !== 'shift' && nm !== 'meta') window.__driftPressed[nm] = 1;
          if (!live || !live.isConnected) return;
          if (e.target && e.target.closest && e.target.closest('#drift-gmenu')) return;
          if (e.target && /input|textarea|select/i.test(e.target.tagName || '')) return;
          function stored(key, fb) { var v = ''; try { v = localStorage.getItem(key) || ''; } catch (e2) {} return v || fb; }
          function hit(combo) {
            var parts = String(combo || '').split('+').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
            if (!parts.length) return false;
            var down = {};
            if (e.ctrlKey) down.ctrl = 1; if (e.altKey) down.alt = 1; if (e.shiftKey) down.shift = 1; if (e.metaKey) down.meta = 1;
            Object.keys(window.__driftPressed).forEach(function (kk) { if (window.__driftPressed[kk]) down[kk] = 1; });
            if (nm && nm !== 'control' && nm !== 'alt' && nm !== 'shift' && nm !== 'meta') down[nm] = 1;
            for (var i = 0; i < parts.length; i++) if (!down[parts[i]]) return false;
            return true;
          }
          var map = [
            ['wos:kb-hide', '', 'F9'],
            ['wos:kb-class', 'https://classroom.google.com/', 'F10'],
            ['wos:kb-docs', 'https://docs.google.com/document/u/0/', ''],
            ['wos:kb-disc', 'https://www.discoveryeducation.com/', ''],
            ['wos:kb-aleks', 'https://www.aleks.com/', '']
          ];
          for (var i = 0; i < map.length; i++) {
            if (!hit(stored(map[i][0], map[i][2]))) continue;
            if (!map[i][1]) {
              try { localStorage.setItem('wos:edu-mode', localStorage.getItem('wos:edu-mode') === '1' ? '0' : '1'); } catch (err3) {}
              return;
            }
            if (location.href.indexOf(map[i][1].split('/')[2]) !== -1) return;
            location.href = map[i][1];
            return;
          }
        }, true);
        window.addEventListener('keyup', function (e) {
          var nm = (e.key === ' ' ? 'space' : String(e.key || '').toLowerCase());
          if (window.__driftPressed) window.__driftPressed[nm] = 0;
        }, true);
      }
    }
  window.__driftGoogleMenu = googleMenuBody;
  function openSettingsPanel() {
    var old = document.getElementById('drift-settings-win') || document.getElementById('drift-settings-panel');
    if (old) { old.remove(); return; }
    var panel = document.createElement('div');
    panel.id = 'drift-settings-win';
    panel.className = 'win';
    var W = Math.min(860, window.innerWidth - 24);
    var H = Math.min(640, window.innerHeight - 110);
    panel.style.cssText = 'width:' + W + 'px;height:' + H + 'px;left:' + Math.max(8, (window.innerWidth - W) / 2) + 'px;top:40px;z-index:2147483001';
    if (document.body.classList.contains('drift-hub')) {
      panel.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:auto;width:min(980px,100%);height:100%;border-radius:0;z-index:2147483001';
    }
    var liquidOn = false, eduOn = false, gk = 'lazy', kbHide = 'F9', kbClass = 'F10', appSize = 'lg', tbSize = 'lg', orbOn = true, xmasOn = false;
    var dynOn = false, macOn = false, winOn = false, linOn = false, lensOn = false;
    function onFlag(key) {
      try { var v = String(localStorage.getItem(key) || '').replace(/"/g, ''); return v === '1' || v === 'true'; } catch (e) { return false; }
    }
    try {
      liquidOn = onFlag('wos:liquid-glass');
      eduOn = onFlag('wos:edu-mode');
      gk = (localStorage.getItem('wos:gimkit-injector') || 'lazy').replace(/"/g, '');
      kbHide = localStorage.getItem('wos:kb-hide') || 'F9';
      kbClass = localStorage.getItem('wos:kb-class') || 'F10';
      appSize = (localStorage.getItem('wos:size-apps') || 'lg').replace(/"/g, '');
      tbSize = (localStorage.getItem('wos:size-tb') || 'lg').replace(/"/g, '');
      orbOn = onFlag('wos:ai-orb');
      xmasOn = onFlag('wos:xmas');
      dynOn = onFlag('wos:dynamic-os');
      macOn = onFlag('wos:mac-adapt');
      winOn = onFlag('wos:win-adapt');
      linOn = onFlag('wos:linux-adapt');
      lensOn = onFlag('wos:lens-bypass');
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
      '<div class="title"><b>Settings</b><button class="wb x" type="button" data-x data-a="x" aria-label="Close">✕</button></div>' +
      '<div class="body" style="flex-direction:row;min-height:0;background:#1c1c24;color:#eee;font:13px/1.45 system-ui,sans-serif">' +
      '<nav style="width:176px;flex:none;display:flex;flex-direction:column;gap:4px;padding:10px;border-right:1px solid rgba(255,255,255,.1)">' +
      '<button type="button" data-nav="ui" style="text-align:left;border:0;border-radius:8px;background:rgba(255,255,255,.12);color:#fff;padding:8px 10px;cursor:pointer">UI</button>' +
      '<button type="button" data-nav="os" style="text-align:left;border:0;border-radius:8px;background:transparent;color:#fff;padding:8px 10px;cursor:pointer">OS Adapts</button>' +
      '<button type="button" data-nav="apps" style="text-align:left;border:0;border-radius:8px;background:transparent;color:#fff;padding:8px 10px;cursor:pointer">Apps Settings</button>' +
      '<button type="button" data-nav="tools" style="text-align:left;border:0;border-radius:8px;background:transparent;color:#fff;padding:8px 10px;cursor:pointer">Tools</button>' +
      '<button type="button" data-nav="bypass" style="text-align:left;border:0;border-radius:8px;background:transparent;color:#fff;padding:8px 10px;cursor:pointer">Bypass & protectors</button>' +
      '</nav><div id="drift-set-main" style="flex:1;min-width:0;overflow:auto;padding:14px 16px;scrollbar-width:none">' +
      '<section data-sec="ui">' +
      '<div style="margin-bottom:14px"><b>Home button</b>' +
      '<div style="opacity:.75;font-size:12px;margin:4px 0 8px">MacOS logo, Windows logo, or Drift logo (default).</div>' +
      '<div id="drift-home-opts" style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="home-logo" value="mac"/> macOS</label>' +
      '<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="home-logo" value="win"/> Windows</label>' +
      '<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="home-logo" value="drift"/> Drift logo</label>' +
      '</div></div>' +
      '<div style="margin-bottom:14px"><b>Customize Task Bar and Apps Size</b>' +
      '<div style="opacity:.75;font-size:12px;margin:4px 0 8px">Apps and the task bar are separate. Large is the normal Drift size.</div>' +
      '<div style="font-size:12px;font-weight:650;margin:6px 0">Apps</div>' + sizeRadios('size-apps', appSize) +
      '<div style="font-size:12px;font-weight:650;margin:8px 0 4px">Task bar</div>' + sizeRadios('size-tb', tbSize) + '</div>' +
      '<div style="margin:8px 0 10px;font-weight:700">Experimental</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Enable Liquid Glass</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Make Drift OS look like an iOS device with the new liquid glass UI applied on the task bar.</div></div>' +
      switchHTML('drift-liquid-sw', liquidOn) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Enable liquid glass to apps</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Makes the app windows transparent so the desktop shows through. Pages inside a site stay readable.</div></div>' +
      switchHTML('drift-app-glass-sw', onFlag('wos:liquid-apps') || document.body.classList.contains('drift-app-glass')) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Christmas mode</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Snow keeps falling until you turn this off. It fades once it covers part of the screen. It rests on open windows. Move or shake a window and the snow comes off.</div></div>' +
      switchHTML('drift-xmas-sw', xmasOn) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Dynamic OS</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Lets you adapt the screen as if this were another operating system. This is the only way past the OS Adapts restriction.</div></div>' +
      switchHTML('drift-dynamic-sw', dynOn) + '</div>' +
      '<div style="margin:16px 0 8px;font-weight:700">AI thinking style</div>' +
      '<div style="opacity:.75;font-size:12px;margin-bottom:8px">Choose how the AI looks while it thinks.</div>' +
      '<select id="drift-think-style" style="display:block;width:100%;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee">' +
      '<option value="default">Default</option>' +
      '<option value="claude">Claude (blinking logo)</option>' +
      '<option value="grok">Grok (orb)</option>' +
      '<option value="chatgpt">ChatGPT (thinking orb)</option>' +
      '<option value="deepseek">Deepseek</option>' +
      '<option value="gemini">Gemini (three dots)</option></select>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin:16px 0">' +
      '<div style="flex:1"><b>Hub mode</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Apps on the left like a dashboard (Noahs Tutoring style, Drift colors).</div></div>' +
      switchHTML('drift-hub-sw', localStorage.getItem('wos:hub') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Background clock</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Large clock in the middle of the desktop. Apps cannot be placed on it.</div></div>' +
      switchHTML('drift-clock-sw', localStorage.getItem('wos:bg-clock') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>macOS desktops</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Multiple desktops with page dots and jiggle mode (iOS style).</div></div>' +
      switchHTML('drift-macos-desk-sw', localStorage.getItem('wos:macos-desk') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Rounded taskbar</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">macOS-style rounded dock with blur.</div></div>' +
      switchHTML('drift-roundtb-sw', localStorage.getItem('wos:round-tb') === '1') + '</div></section>' +
      '<section data-sec="os" style="display:none">' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Adapt Drift for ChromeOS</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">On ChromeOS the apps and the task bar are a little smaller. The task bar stays on screen.</div></div>' +
      switchHTML('drift-cros-sw', localStorage.getItem('wos:cros-adapt') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Adapt Drift for iPad</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Fits Drift on iPad 10 and iPad 11. Apps and the task bar stay on screen.</div></div>' +
      switchHTML('drift-ipad-sw', localStorage.getItem('wos:ipad-adapt') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Adapt Drift for macOS</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Rounds the task bar and windows the way macOS does.</div></div>' +
      switchHTML('drift-mac-sw', macOn) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Adapt Drift for Windows</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Uses a darker window title, closer to Windows.</div></div>' +
      switchHTML('drift-win-sw', winOn) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Adapt Drift for Linux</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Flatter task bar and windows.</div></div>' +
      switchHTML('drift-linux-sw', linOn) + '</div></section>' +
      '<section data-sec="apps" style="display:none">' +
      '<div style="margin-bottom:14px"><b>Choose your Games</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Noah is the in-app catalog. Tesana, Poki and CrazyGames open in the app. If Games is open, it reloads with this library.</div>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="games-lib" value="noah"/> Noah (recommended)</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="games-lib" value="tesana"/> Tesana</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="games-lib" value="poki"/> Poki</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="games-lib" value="crazygames"/> CrazyGames</label></div>' +
      '<div style="margin:16px 0 14px"><b>Choose your Movies</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Racial is the in-app catalog (Racial styles) and plays here. Drift Movies and Noah open that library. If a site says blocked, Drift uses the in-app player.</div>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="movies-src" value="racial"/> Racial</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="movies-src" value="onlyflix"/> drift movies</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="movies-src" value="noah"/> Noah</label></div>' +
      '<div style="margin-bottom:12px"><b style="display:block;margin-bottom:8px">Gimkit injection default</b>' + opts + '</div></section>' +
      '<section data-sec="tools" style="display:none">' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>AI assistant</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Off until you turn this on. Then the Drift ball appears. Drag it anywhere. Each reply has an X to dismiss it.</div></div>' +
      switchHTML('drift-orb-sw', orbOn) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Ver razonamiento</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Apagado hasta que lo actives. Entonces el cuadro gris muestra el razonamiento, no solo una plantilla.</div></div>' +
      switchHTML('drift-think-sw', onFlag('wos:show-think')) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Support Drift</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Un aviso pequeño en el escritorio. Apagado hasta que lo actives.</div></div>' +
      switchHTML('drift-support-sw', onFlag('wos:support')) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>NO dev apps</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">This deletes VS Code, JS Injector and GitHub.</div></div>' +
      switchHTML('drift-nodev-sw', localStorage.getItem('wos:no-dev') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Delete all created apps</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Deletes every app that is not a Drift default. If two apps have the exact same name, only the Drift default is kept.</div></div>' +
      switchHTML('drift-delapps-sw', false) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Low-detail mode</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Uses fewer resources. Apps stay. Blur, extra animation and the snow drawing pause until you turn this off.</div></div>' +
      switchHTML('drift-low-sw', onFlag('wos:low-detail') || document.body.classList.contains('drift-low')) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Auto-block meanwhile setup</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Apps wait until Scramjet has finished starting, so a page does not open into a load error.</div></div>' +
      switchHTML('drift-autoblock-sw', onFlag('wos:autoblock')) + '</div>' +
      '<div style="margin:16px 0 8px"><b>Bypass URL</b>' +
      '<div style="opacity:.75;font-size:12px;margin:4px 0 8px">Type a site, like youtube.com. Drift gives you the bookmarklet that opens it in the Browser.</div>' +
      '<input id="drift-bypass-url" placeholder="youtube.com" style="display:block;width:100%;margin-top:4px;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee;box-sizing:border-box"/>' +
      '<button type="button" id="drift-bypass-make" style="margin-top:8px;padding:8px 12px;border:0;border-radius:8px;background:#1a73e8;color:#fff;cursor:pointer;font-weight:650">Make bookmarklet</button>' +
      '<textarea id="drift-bypass-out" readonly style="display:block;width:100%;min-height:72px;margin-top:8px;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee;box-sizing:border-box"></textarea>' +
      '<button type="button" id="drift-bypass-copy" style="margin-top:8px;padding:8px 12px;border:0;border-radius:8px;background:#333;color:#fff;cursor:pointer">Copy</button></div></section>' +
      '<section data-sec="bypass" style="display:none">' +
      '<div style="padding-top:4px;margin-bottom:12px">' +
      '<b style="display:block;margin-bottom:8px">Custom Keybinds</b>' +
      '<div style="opacity:.8;font-size:12px;margin-bottom:10px">Hide all non-educational apps (includes AI and VS Code). Classroom opens in a new tab, not inside this panel.</div>' +
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
      '<div style="opacity:.75;font-size:12px;margin:6px 0 10px">Click a field, then press keys together or in a row (example T+Y). Up to 8 keys. It saves when you pause.</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:10px">' +
      '<div style="flex:1"><b>Education mode now</b><div style="opacity:.7;font-size:11px">Hides non-edu icons immediately</div></div>' +
      switchHTML('drift-edu-sw', eduOn) + '</div>' +
      '<button type="button" id="kb-class-go" style="margin-top:12px;width:100%;padding:10px;border:0;border-radius:10px;background:#1a73e8;color:#fff;font-weight:600;cursor:pointer">Open Classroom in a new tab</button></div>' +
      '<div style="margin-top:16px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px">' +
      '<b>Clean search history Bypass</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Choose the tabs and the website you want open. They open as pop-up tabs in the browser on this computer, not in the Drift Browser.</div>' +
      '<label style="display:block;margin:8px 0">Website' +
      '<select id="drift-clean-site" style="display:block;width:100%;margin-top:4px;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee">' +
      '<option value="docs">Google Docs</option>' +
      '<option value="discovery">Discovery Education</option>' +
      '<option value="classroom">Classroom</option>' +
      '<option value="canva">Canva</option>' +
      '<option value="other">Other — Wikipedia</option></select></label>' +
      '<label style="display:block;margin:8px 0">How many tabs (1 to 20)' +
      '<input id="drift-clean-n" type="number" min="1" max="20" value="1" style="display:block;width:100%;margin-top:4px;padding:8px;border-radius:8px;border:1px solid #333;background:#14141c;color:#eee;box-sizing:border-box"/></label>' +
      '<div style="display:flex;gap:8px;margin-top:8px">' +
      '<button type="button" id="drift-clean-open" style="flex:1;padding:10px;border:0;border-radius:10px;background:#1a73e8;color:#fff;font-weight:600;cursor:pointer">Open</button>' +
      '<button type="button" id="drift-clean-random" style="flex:1;padding:10px;border:1px solid rgba(255,255,255,.16);border-radius:10px;background:transparent;color:#fff;font-weight:600;cursor:pointer">Random</button></div></div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:16px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px">' +
      '<div style="flex:1"><b>Protector</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Solo si hay una clase activa (live view, streaming o “class started”). Tener Linewize instalado no cuenta como clase.</div></div>' +
      switchHTML('drift-prot-sw', localStorage.getItem('wos:protector') === '1') + '</div>' +
      '<div style="margin:22px 0 14px;padding-left:2px"><div style="font-size:12px;font-weight:650;margin-bottom:6px">When a class connects</div>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:6px;cursor:pointer"><input type="radio" name="prot-class" value="alert"/> Only alert</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:6px;cursor:pointer"><input type="radio" name="prot-class" value="classroom"/> Alert and open Classroom</label></div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:16px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px">' +
      '<div style="flex:1"><b>Google Lens bypass</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Shows a Google Lens button, like the assistant. Press it to use Lens.</div></div>' +
      switchHTML('drift-lens-sw', lensOn) + '</div>' +
      '<div style="margin-top:16px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px"><b>Bookmarklets</b>' +
      '<div style="opacity:.75;font-size:12px;margin:4px 0 8px">Arrástralos a la barra de marcadores del navegador real. Pulsa el nombre para copiarlo.</div>' +
      '<div class="bm-card"><div><b>Full bypass (drift)</b><div style="opacity:.75;font-size:12px">La búsqueda se abre en DuckDuckGo en español (MX), en esta pestaña. No abre el escritorio.</div></div><a id="drift-bm-class" href="#" style="flex:none;padding:8px 12px;border-radius:10px;background:#c5c8ce;color:#111;text-decoration:none;font-weight:700">Copiar</a></div>' +
      '<div class="bm-card"><div><b>Full bypass</b><div style="opacity:.75;font-size:12px">El mismo marcador. Se queda en esta pestaña.</div></div><a id="drift-bm-guest" href="#" style="flex:none;padding:8px 12px;border-radius:10px;background:#c5c8ce;color:#111;text-decoration:none;font-weight:700">Copiar</a></div>' +
      '<div class="bm-card"><div><b>Mod de Google</b><div style="opacity:.75;font-size:12px">Función JavaScript. Cópiala y pégala como marcador. Abre el panel Liquid Glass: Home, Settings y AI.</div></div><a id="drift-bm-menu" href="#" style="flex:none;padding:8px 12px;border-radius:10px;background:#c5c8ce;color:#111;text-decoration:none;font-weight:700">Copiar</a></div></div>' +
      '<button type="button" id="drift-docs-btn" style="margin-top:12px;width:100%;padding:10px;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:transparent;color:#fff;font-weight:600;cursor:pointer">Drift docs</button></section></div></div>';
    panel.querySelector('[data-x]').onclick = function (e) { e.stopPropagation(); panel.remove(); };
    function showSec(id) {
      panel.querySelectorAll('[data-sec]').forEach(function (s) {
        s.style.display = s.getAttribute('data-sec') === id ? 'block' : 'none';
      });
      panel.querySelectorAll('[data-nav]').forEach(function (b) {
        b.style.background = b.getAttribute('data-nav') === id ? 'rgba(255,255,255,.12)' : 'transparent';
      });
    }
    panel.querySelectorAll('[data-nav]').forEach(function (b) {
      b.onclick = function () { showSec(b.getAttribute('data-nav')); };
    });
    showSec('ui');
    var bmClass = panel.querySelector('#drift-bm-class');
    var bmGuest = panel.querySelector('#drift-bm-guest');
    var bmMenu = panel.querySelector('#drift-bm-menu');
    function driftBypassBody() {
      function dec(s){try{return decodeURIComponent(String(s||'').replace(/\+/g,' '));}catch(e){return s;}}
      function junk(s){return String(s||'').replace(/[?#&](?:user|userid|user_id|device|deviceid|device_id|hardware|hardwareid|hwid|hw_id|token|session|sid|school|org|policy|reason|category)=[^&#]*/gi,'');}
      function real(){
        var href='';
        try{href=location.href;}catch(e){}
        var blob=href;
        try{blob+='\n'+decodeURIComponent(href);}catch(e){}
        try{blob+='\n'+decodeURIComponent(decodeURIComponent(href));}catch(e){}
        var found='',bits=String(blob).split(/https?:\/\//i),bi;
        for(bi=1;bi<bits.length;bi++){
          var u=('https://'+bits[bi].split(/[\s"'<>]/)[0]).replace(/[),.;]+$/,'');
          var host='';
          try{host=new URL(u).hostname;}catch(e){host=u;}
          if(/linewize|classwize|goguardian|securly/i.test(host)) continue;
          found=u; break;
        }
        href=junk(found||href);
        var q='';
        try{
          var uu=new URL(href);
          q=uu.searchParams.get('q')||uu.searchParams.get('query')||uu.searchParams.get('search_query')||uu.searchParams.get('search')||uu.searchParams.get('keyword')||uu.searchParams.get('p')||'';
        }catch(e){}
        if(!q){
          var qm=String(blob).match(/[?&](?:q|query|search_query|keyword)=([^&#]+)/i);
          if(qm) q=dec(qm[1]);
        }
        if(!q){
          try{
            var t=document.title||'';
            if(/linewize|blocked|restricted/i.test(location.href) && t && !/linewize|blocked|access denied|restricted/i.test(t) && t.length<140) q=t;
          }catch(e){}
        }
        q=String(q||'').replace(/\s+/g,' ').trim();
        if(q) return 'https://duckduckgo.com/?kl=mx-es&ia=web&q='+encodeURIComponent(q);
        if(/^https?:/i.test(href) && !/linewize|classwize|goguardian|securly/i.test(href)) return href;
        return 'https://duckduckgo.com/?kl=mx-es&ia=web';
      }
      location.href='https://drift.hostless.app/go?u='+encodeURIComponent(real());
    }
    var classJs = 'javascript:(' + driftBypassBody.toString() + ')();'.split('https://drift.hostless.app').join(location.origin);
    var guestJs = classJs;

    var menuJs = ('javascript:(' + googleMenuBody.toString() + ')();').split('https://drift.hostless.app').join(location.origin);
    function copyBm(text, title, how) {
      function done() {
        var old = document.getElementById('drift-copied');
        if (old) old.remove();
        var n = document.createElement('div');
        n.id = 'drift-copied';
        n.textContent = 'Copied to clipboard';
        n.style.cssText = 'position:fixed;z-index:2147483646;left:50%;bottom:24px;transform:translateX(-50%);background:#1a73e8;color:#fff;font:600 14px system-ui;padding:12px 16px;border-radius:12px;box-shadow:0 10px 28px rgba(0,0,0,.35)';
        document.body.appendChild(n);
        setTimeout(function () { if (n.parentNode) n.remove(); }, 2400);
        var oldT = document.getElementById('drift-bypass-help');
        if (oldT) oldT.remove();
        var help = document.createElement('div');
        help.id = 'drift-bypass-help';
        help.style.cssText = 'position:fixed;z-index:2147483646;left:50%;top:50%;transform:translate(-50%,-50%);width:min(460px,92vw);max-height:80vh;overflow:auto;background:#14141c;color:#eee;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:16px;font:14px/1.45 system-ui;box-shadow:0 16px 50px rgba(0,0,0,.45)';
        help.innerHTML = '<b style="display:block;font-size:16px;margin-bottom:8px">' + title + '</b>' +
          '<div>Setup in your real browser, not inside Drift:</div>' +
          '<ol style="margin:8px 0 8px 18px;padding:0"><li>Show the bookmarks bar. Chrome and ChromeOS: Ctrl+Shift+B. Mac: Shift+Command+B.</li><li>Right-click the bookmarks bar, then Add page or Add bookmark.</li><li>Name it ' + title + '.</li><li>Paste into the URL field. It is already copied.</li><li>Save.</li></ol>' +
          '<div>How to use it:</div>' +
          '<ol style="margin:8px 0 8px 18px;padding:0"><li>Open any site in that same real browser.</li><li>Search, or open the page you want.</li><li>Click the bookmark. ' + how + '</li></ol>' +
          '<button type="button" data-ok style="margin-top:6px;padding:8px 12px;border:0;border-radius:10px;background:#1a73e8;color:#fff;font-weight:650;cursor:pointer">OK</button>';
        document.body.appendChild(help);
        help.querySelector('[data-ok]').onclick = function () { help.remove(); };
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;left:-999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        ta.remove();
        done();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    }
    if (bmClass) {
      bmClass.setAttribute('href', '#');
      bmClass.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        copyBm(classJs, 'Full bypass (drift)', 'Full bypass (drift) loads that search on DuckDuckGo through Scramjet. A site that is not a search opens itself through Scramjet. It does not open the Drift desktop.');
      };
    }
    if (bmGuest) {
      bmGuest.setAttribute('href', '#');
      bmGuest.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        copyBm(guestJs, 'Full bypass', 'Full bypass loads that search on DuckDuckGo through Scramjet. It stays in this tab. It does not open the Drift desktop.');
      };
    }
    if (bmMenu) {
      bmMenu.setAttribute('href', '#');
      bmMenu.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        copyBm(menuJs, 'Mod de Google', 'Es una función JavaScript. En cualquier página abre el panel de Drift: Home, Settings y AI. No abre el escritorio.');
      };
    }
    var homeNow = 'drift';
    try { homeNow = localStorage.getItem('wos:home-btn') || 'drift'; } catch (e) {}
    panel.querySelectorAll('input[name="home-logo"]').forEach(function (r) {
      r.checked = r.value === homeNow;
      r.onchange = function () {
        if (!r.checked) return;
        try { localStorage.setItem('wos:home-btn', r.value); } catch (e) {}
        applyHomeLogo(r.value);
      };
    });
    wireSwitch(panel.querySelector('#drift-xmas-sw'), function (on) {
      try { localStorage.setItem('wos:xmas', on ? '1' : '0'); } catch (e) {}
      if (typeof window.driftSnow === 'function') window.driftSnow(!!on);
    });
    wireSwitch(panel.querySelector('#drift-liquid-sw'), function (on) {
      try { localStorage.setItem('wos:liquid-glass', on ? '1' : '0'); } catch (e) {}
      installLiquidGlass();
    });
    wireSwitch(panel.querySelector('#drift-app-glass-sw'), function (on) {
      try { localStorage.setItem('wos:liquid-apps', on ? '1' : '0'); } catch (e) {}
      installAppGlass();
    });
    var thinkStyle = panel.querySelector('#drift-think-style');
    if (thinkStyle) {
      try { thinkStyle.value = localStorage.getItem('wos:think-style') || 'default'; } catch (e) {}
      thinkStyle.onchange = function () {
        try { localStorage.setItem('wos:think-style', thinkStyle.value); } catch (e) {}
        document.body.dataset.thinkStyle = thinkStyle.value;
        if (typeof window.__driftSyncThink === 'function') window.__driftSyncThink();
      };
    }
    wireSwitch(panel.querySelector('#drift-hub-sw'), function (on) {
      try { localStorage.setItem('wos:hub', on ? '1' : '0'); } catch (e) {}
      document.body.classList.toggle('drift-hub', !!on);
      if (typeof rend === 'function') try { rend(); } catch (e) {}
    });
    wireSwitch(panel.querySelector('#drift-clock-sw'), function (on) {
      try { localStorage.setItem('wos:bg-clock', on ? '1' : '0'); } catch (e) {}
      document.body.classList.toggle('drift-bg-clock', !!on);
      installBgClock(!!on);
    });
    wireSwitch(panel.querySelector('#drift-macos-desk-sw'), function (on) {
      try { localStorage.setItem('wos:macos-desk', on ? '1' : '0'); } catch (e) {}
      document.body.classList.toggle('drift-macos-desk', !!on);
      if (on) installMacosDesks();
    });
    wireSwitch(panel.querySelector('#drift-roundtb-sw'), function (on) {
      try { localStorage.setItem('wos:round-tb', on ? '1' : '0'); } catch (e) {}
      document.body.classList.toggle('drift-round-tb', !!on);
    });
    wireSwitch(panel.querySelector('#drift-dynamic-sw'), function (on) {
      try { localStorage.setItem('wos:dynamic-os', on ? '1' : '0'); } catch (e) {}
      if (!on) applySavedAdapts(true);
    });
    wireSwitch(panel.querySelector('#drift-edu-sw'), function (on) { setEducationMode(on); });
    wireSwitch(panel.querySelector('#drift-cros-sw'), function (on) { setChromeOSAdapt(on, false); });
    wireSwitch(panel.querySelector('#drift-ipad-sw'), function (on) { setIpadAdapt(on, false); });
    wireSwitch(panel.querySelector('#drift-mac-sw'), function (on) { setMacAdapt(on, false); });
    wireSwitch(panel.querySelector('#drift-win-sw'), function (on) { setWinAdapt(on, false); });
    wireSwitch(panel.querySelector('#drift-linux-sw'), function (on) { setLinuxAdapt(on, false); });
    wireSwitch(panel.querySelector('#drift-lens-sw'), function (on) {
      try { localStorage.setItem('wos:lens-bypass', on ? '1' : '0'); } catch (e) {}
      try { installLensOrb(); } catch (e3) {}
      try { if (typeof tiles === 'function') tiles(); } catch (e2) {}
    });
    wireSwitch(panel.querySelector('#drift-low-sw'), function (on) {
      try { localStorage.setItem('wos:low-detail', on ? '1' : '0'); } catch (e) {}
      installLowDetail();
    });
    wireSwitch(panel.querySelector('#drift-autoblock-sw'), function (on) {
      try { localStorage.setItem('wos:autoblock', on ? '1' : '0'); } catch (e) {}
    });
    var makeBypass = panel.querySelector('#drift-bypass-make');
    if (makeBypass) makeBypass.onclick = function () {
      var raw = String((panel.querySelector('#drift-bypass-url') || {}).value || '').trim();
      if (!raw) return;
      var url = raw;
      if (!/^https?:/i.test(url)) url = 'https://' + url.replace(/^\/+/, '');
      var js = 'javascript:(function(){location.href=\'' + location.origin + '/go?u=\'+encodeURIComponent(\'' + url.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'') + '\');})();';
      var out = panel.querySelector('#drift-bypass-out');
      if (out) out.value = js;
    };
    var copyBypass = panel.querySelector('#drift-bypass-copy');
    if (copyBypass) copyBypass.onclick = function () {
      var out = panel.querySelector('#drift-bypass-out');
      var text = out ? out.value : '';
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(function () {});
      else { out.focus(); out.select(); try { document.execCommand('copy'); } catch (e) {} }
    };
    (function syncSwitches() {
      function savedOn(key) {
        try {
          var v = localStorage.getItem(key);
          if (v == null) return false;
          v = String(v).replace(/"/g, '');
          return v === '1' || v === 'true';
        } catch (e) { return false; }
      }
      function paintSaved(id, key, live) {
        var on = savedOn(key) || !!live;
        if (on && !savedOn(key)) { try { localStorage.setItem(key, '1'); } catch (e) {} }
        var b = panel.querySelector('#' + id);
        if (!b) return;
        b.setAttribute('data-on', on ? '1' : '0');
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.style.background = on ? '#34c759' : 'rgba(120,120,128,.32)';
        var knob = b.querySelector('span');
        if (knob) knob.style.left = on ? '20px' : '2px';
      }
      paintSaved('drift-liquid-sw', 'wos:liquid-glass', document.body.classList.contains('drift-liquid'));
      paintSaved('drift-app-glass-sw', 'wos:liquid-apps', document.body.classList.contains('drift-app-glass'));
      paintSaved('drift-xmas-sw', 'wos:xmas', !!document.getElementById('drift-snow'));
      paintSaved('drift-dynamic-sw', 'wos:dynamic-os', false);
      paintSaved('drift-cros-sw', 'wos:cros-adapt', document.body.classList.contains('drift-cros'));
      paintSaved('drift-ipad-sw', 'wos:ipad-adapt', document.body.classList.contains('drift-ipad'));
      paintSaved('drift-mac-sw', 'wos:mac-adapt', document.body.classList.contains('drift-mac'));
      paintSaved('drift-win-sw', 'wos:win-adapt', document.body.classList.contains('drift-win'));
      paintSaved('drift-linux-sw', 'wos:linux-adapt', document.body.classList.contains('drift-linux'));
      paintSaved('drift-orb-sw', 'wos:ai-orb', !!document.getElementById('drift-orb'));
      paintSaved('drift-nodev-sw', 'wos:no-dev', false);
      paintSaved('drift-edu-sw', 'wos:edu-mode', false);
      paintSaved('drift-prot-sw', 'wos:protector', false);
      paintSaved('drift-lens-sw', 'wos:lens-bypass', !!document.getElementById('drift-lens-orb'));
      paintSaved('drift-low-sw', 'wos:low-detail', document.body.classList.contains('drift-low'));
      paintSaved('drift-autoblock-sw', 'wos:autoblock', false);
    })();
    panel.querySelectorAll('input[name="size-apps"],input[name="size-tb"]').forEach(function (r) {
      r.onchange = function () {
        if (!r.checked) return;
        try { localStorage.setItem(r.name === 'size-apps' ? 'wos:size-apps' : 'wos:size-tb', r.value); } catch (e) {}
        applySize();
      };
    });
    wireSwitch(panel.querySelector('#drift-orb-sw'), function (on) {
      try { localStorage.setItem('wos:ai-orb', on ? '1' : '0'); } catch (e) {}
      installOrb();
    });
    wireSwitch(panel.querySelector('#drift-think-sw'), function (on) {
      try { localStorage.setItem('wos:show-think', on ? '1' : '0'); } catch (e) {}
    });
    wireSwitch(panel.querySelector('#drift-support-sw'), function (on) {
      try { localStorage.setItem('wos:support', on ? '1' : '0'); } catch (e) {}
      installSupport();
    });
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
    wireSwitch(panel.querySelector('#drift-prot-sw'), function (on) {
      try { localStorage.setItem('wos:protector', on ? '1' : '0'); } catch (e) {}
    });
    var classMode = 'alert';
    try { classMode = localStorage.getItem('wos:prot-class') || 'alert'; } catch (e) {}
    panel.querySelectorAll('input[name="prot-class"]').forEach(function (r) {
      r.checked = r.value === classMode;
      r.onchange = function () {
        if (!r.checked) return;
        try { localStorage.setItem('wos:prot-class', r.value); } catch (e) {}
      };
    });
    panel.querySelector('#drift-docs-btn').onclick = function () { openDriftDocs(); };
    if (!document.getElementById('drift-settings-scroll')) {
      var scrollCss = document.createElement('style');
      scrollCss.id = 'drift-settings-scroll';
      scrollCss.textContent = '#drift-settings-panel::-webkit-scrollbar{display:none;width:0;height:0}';
      document.head.appendChild(scrollCss);
    }
    var movieNow = 'noah', gameNow = 'noah';
    try {
      movieNow = localStorage.getItem('wos:movies') || 'racial';
      if (movieNow === 'serum') movieNow = 'noah';
      gameNow = localStorage.getItem('wos:games-lib') || 'noah';
    } catch (e) {}
    panel.querySelectorAll('input[name="movies-src"]').forEach(function (r) {
      r.checked = r.value === movieNow;
      r.onchange = function () {
        if (!r.checked) return;
        try { localStorage.setItem('wos:movies', r.value); } catch (e) {}
        reloadOpenLibrary('Movies');
      };
    });
    panel.querySelectorAll('input[name="games-lib"]').forEach(function (r) {
      r.checked = r.value === gameNow;
      r.onchange = function () {
        if (!r.checked) return;
        try { localStorage.setItem('wos:games-lib', r.value); } catch (e) {}
        if (r.value === 'poki') loadPokiSdk(document);
        reloadOpenLibrary('Games');
      };
    });
    var cleanSites = {
      docs: 'https://docs.google.com/',
      discovery: 'https://www.discoveryeducation.com/',
      classroom: 'https://classroom.google.com/',
      canva: 'https://www.canva.com/',
      other: 'https://en.wikipedia.org/'
    };
    var cleanNames = { docs: 'Google Docs', discovery: 'Discovery Education', classroom: 'Classroom', canva: 'Canva', other: 'Wikipedia' };
    function openClean(items) {
      var blocked = false;
      items.forEach(function (it) {
        var w = null;
        try { w = window.open(it.url, '_blank', 'popup,width=1100,height=760'); } catch (e) { w = null; }
        if (!w) blocked = true;
      });
      if (blocked) {
        var btn = panel.querySelector('#drift-clean-open');
        if (btn) btn.textContent = 'Allow pop-ups, then press Open';
      }
    }
    var cleanOpen = panel.querySelector('#drift-clean-open');
    if (cleanOpen) cleanOpen.onclick = function () {
      var siteEl = panel.querySelector('#drift-clean-site');
      var nEl = panel.querySelector('#drift-clean-n');
      var site = siteEl ? siteEl.value : 'docs';
      var n = nEl ? parseInt(nEl.value, 10) : 1;
      if (!n || n < 1) n = 1;
      if (n > 20) n = 20;
      var u = cleanSites[site] || cleanSites.other;
      var label = cleanNames[site] || 'Tab';
      var list = [];
      for (var i = 0; i < n; i++) list.push({ url: u, label: label });
      openClean(list);
    };
    var cleanRandom = panel.querySelector('#drift-clean-random');
    if (cleanRandom) cleanRandom.onclick = function () {
      var list = [
        { url: cleanSites.docs, label: cleanNames.docs },
        { url: cleanSites.discovery, label: cleanNames.discovery },
        { url: cleanSites.classroom, label: cleanNames.classroom },
        { url: cleanSites.canva, label: cleanNames.canva }
      ];
      for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
      }
      openClean(list);
    };
    panel.querySelector('#kb-class-go').onclick = function () {
      openTop('https://classroom.google.com/');
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
    var desk = document.getElementById('desk');
    if (desk) desk.appendChild(panel);
    else document.body.appendChild(panel);
    if (typeof drag === 'function') drag(panel);
    panel.addEventListener('pointerdown', function () { panel.style.zIndex = '2147483001'; });
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
    if (!document.getElementById('drift-menu-lift')) {
      var lift = document.createElement('style');
      lift.id = 'drift-menu-lift';
      lift.textContent = '#menu{bottom:calc(var(--tbh, 56px) + 28px + env(safe-area-inset-bottom,0px))!important}';
      document.head.appendChild(lift);
    }
    btn.onclick = function (e) { e.stopPropagation(); openSettingsPanel(); };
  }


  function applyHomeLogo(which) {
    var start = document.getElementById('start');
    if (!start) return;
    var mac = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8s-1.7-.8-2.8-.7c-1.4.1-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1.1 2.6-2.2c.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.8-2.3-3.2zM14.7 6.9c.6-.7 1-1.7.9-2.7-1 .1-2.1.6-2.7 1.4-.6.7-1.1 1.7-.9 2.6 1 .1 2-.5 2.7-1.3z"/></svg>';
    var win = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#3b9bff" d="M3 3h8.5v8.5H3zM12.5 3H21v8.5h-8.5zM3 12.5h8.5V21H3zM12.5 12.5H21V21h-8.5z"/></svg>';
    var drift = '<img src="/drift-mark.png" alt="" width="28" height="28" style="width:28px;height:28px;border-radius:7px;display:block;object-fit:cover">';
    start.innerHTML = which === 'mac' ? mac : which === 'win' ? win : drift;
  }
  function driftPaint(el, raw) {
    var text = String(raw || '');
    el.innerHTML = '';
    function esc(s) { return String(s).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>'); }
    function inline(s) {
      var h = esc(s);
      h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
      h = h.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
      h = h.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
      return h;
    }
    var re = /```(\w*)\n?([\s\S]*?)```/g, last = 0, m;
    function blocks(chunk) {
      var lines = String(chunk || '').split('\n'), i = 0, buf = [];
      function flush() {
        if (!buf.length) return;
        var joined = buf.join('\n').trim();
        buf = [];
        if (!joined) return;
        if (/^(\*{3,}|_{3,}|-{3,})$/.test(joined)) { var hr = document.createElement('hr'); hr.style.cssText = 'border:0;border-top:1px solid rgba(255,255,255,.2);margin:8px 0'; el.appendChild(hr); return; }
        var p = document.createElement('div');
        p.style.cssText = 'white-space:pre-wrap;margin:0 0 8px';
        p.innerHTML = inline(joined);
        el.appendChild(p);
      }
      while (i < lines.length) {
        if (/^\s*\|.+\|/.test(lines[i]) && i + 1 < lines.length && /^\s*\|?\s*[-:| ]+\|/.test(lines[i + 1])) {
          flush();
          var rows = [];
          while (i < lines.length && /^\s*\|/.test(lines[i])) {
            if (!/^\s*\|?\s*[-:| ]+\|\s*$/.test(lines[i])) rows.push(lines[i].split('|').slice(1, -1).map(function (c) { return c.trim(); }));
            i++;
          }
          if (rows.length) {
            var table = document.createElement('table');
            table.style.cssText = 'width:100%;border-collapse:collapse;margin:8px 0;font-size:12px';
            rows.forEach(function (r, ri) {
              var tr = document.createElement('tr');
              r.forEach(function (c) {
                var cell = document.createElement(ri === 0 ? 'th' : 'td');
                cell.style.cssText = 'border:1px solid rgba(255,255,255,.2);padding:6px 8px;text-align:left';
                cell.innerHTML = inline(c);
                tr.appendChild(cell);
              });
              table.appendChild(tr);
            });
            el.appendChild(table);
          }
          continue;
        }
        if (/^#{1,3}\s+/.test(lines[i])) {
          flush();
          var h = document.createElement('div');
          h.style.cssText = 'font-weight:700;margin:8px 0 4px';
          h.innerHTML = inline(lines[i].replace(/^#+\s+/, ''));
          el.appendChild(h);
          i++;
          continue;
        }
        if (/^\s*[-*]\s+/.test(lines[i])) {
          flush();
          var ul = document.createElement('ul');
          ul.style.cssText = 'margin:0 0 8px 18px;padding:0';
          while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
            var li = document.createElement('li');
            li.innerHTML = inline(lines[i].replace(/^\s*[-*]\s+/, ''));
            ul.appendChild(li);
            i++;
          }
          el.appendChild(ul);
          continue;
        }
        buf.push(lines[i]);
        i++;
      }
      flush();
    }
    while ((m = re.exec(text))) {
      blocks(text.slice(last, m.index));
      last = m.index + m[0].length;
      var cap = document.createElement('div');
      cap.style.cssText = 'font-size:11px;opacity:.65;margin-top:6px';
      cap.textContent = m[1] || 'code';
      var pre = document.createElement('pre');
      pre.style.cssText = 'background:#0d0d12;border-radius:8px;padding:8px;overflow:auto;font:12px/1.45 ui-monospace,monospace;margin:4px 0 8px';
      pre.textContent = (m[2] || '').replace(/\n$/, '');
      el.appendChild(cap);
      el.appendChild(pre);
    }
    blocks(text.slice(last));
  }
  function installLowDetail() {
    var on = false;
    try { on = /^(1|true)$/.test(String(localStorage.getItem('wos:low-detail') || '').replace(/"/g, '')); } catch (e) {}
    document.body.classList.toggle('drift-low', !!on);
    window.__driftLow = !!on;
    try {
      if (window.Snowhush) {
        var xmas = false;
        try { xmas = localStorage.getItem('wos:xmas') === '1'; } catch (e3) {}
        window.Snowhush.set(!on && xmas ? { quit: false, snowfall: 'steady', accumulate: true, melt: true, windows: true } : { quit: true, snowfall: 'off' });
      }
    } catch (e2) {}
    var st = document.getElementById('drift-low-style');
    if (!st) { st = document.createElement('style'); st.id = 'drift-low-style'; document.head.appendChild(st); }
    st.textContent = on
      ? 'body.drift-low *{animation:none!important;transition:none!important}body.drift-low #task,body.drift-low .win,body.drift-low #menu{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}body.drift-low #drift-snow{display:none!important}'
      : '';
  }
  function geminiLensSrc() {
    return '/api/opera?u=' + encodeURIComponent('https://gemini.google.com/app') + '&b=firefox';
  }
  function hideGeminiChrome(frame) {
    var doc = null;
    try { doc = frame.contentDocument; } catch (e) { doc = null; }
    if (!doc || !doc.documentElement) return;
    var st = doc.getElementById('drift-gem-hide');
    if (!st) {
      st = doc.createElement('style');
      st.id = 'drift-gem-hide';
      (doc.head || doc.documentElement).appendChild(st);
    }
    st.textContent = 'header,nav,[role="banner"],bard-sidenav,bard-sidenav-content,#gb,.gb_md,[class*="sidenav"],[class*="side-nav"],[class*="conversation-list"],[class*="boqOnegoogle"],[class*="top-bar"]{display:none!important}html,body{background:#fff!important;margin:0!important;height:100%!important}';
    try {
      var box = doc.querySelector('rich-textarea, textarea, [contenteditable="true"]');
      if (box && box.focus) box.focus();
    } catch (e2) {}
  }
  function prepGeminiLens() {
    var frame = document.getElementById('drift-gemini-preload');
    if (frame) return frame;
    frame = document.createElement('iframe');
    frame.id = 'drift-gemini-preload';
    frame.title = 'Gemini';
    frame.setAttribute('referrerpolicy', 'no-referrer');
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals allow-downloads allow-pointer-lock');
    frame.setAttribute('allow', 'clipboard-read; clipboard-write; microphone; camera');
    frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:480px;height:640px;border:0;opacity:0;pointer-events:none';
    frame.src = geminiLensSrc();
    frame.addEventListener('load', function () { hideGeminiChrome(frame); });
    document.documentElement.appendChild(frame);
    return frame;
  }
  function openLensAsk() {
    var prev = document.getElementById('drift-lens-panel');
    if (prev) {
      var parked = document.getElementById('drift-gemini-preload');
      if (parked) {
        parked.style.cssText = 'position:fixed;left:-9999px;top:0;width:480px;height:640px;border:0;opacity:0;pointer-events:none';
        document.documentElement.appendChild(parked);
      }
      prev.remove();
      return;
    }
    var frame = prepGeminiLens();
    var w = document.createElement('div');
    w.id = 'drift-lens-panel';
    w.style.cssText = 'position:fixed;z-index:2147483004;left:16px;top:16px;bottom:16px;width:min(560px,calc(100vw - 32px));display:flex;flex-direction:column;background:rgba(255,255,255,.9);color:#111;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.65);backdrop-filter:blur(18px);font:14px system-ui';
    var head = document.createElement('div');
    head.style.cssText = 'flex:none;display:flex;align-items:center;gap:8px;padding:10px 12px';
    var title = document.createElement('b');
    title.textContent = 'Lens';
    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', 'Cerrar');
    close.style.cssText = 'margin-left:auto;border:0;background:transparent;font-size:20px;line-height:1;cursor:pointer;color:#111';
    close.onclick = function () {
      frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:480px;height:640px;border:0;opacity:0;pointer-events:none';
      document.documentElement.appendChild(frame);
      w.remove();
    };
    head.append(title, close);
    frame.style.cssText = 'flex:1;width:100%;min-height:0;border:0;background:#fff;opacity:1;pointer-events:auto;position:relative;left:auto;top:auto';
    w.append(head, frame);
    document.body.appendChild(w);
    hideGeminiChrome(frame);
    var n = 0;
    var timer = setInterval(function () {
      if (!w.isConnected || ++n > 24) { clearInterval(timer); return; }
      hideGeminiChrome(frame);
    }, 350);
  }
  function openLensAskLegacy() {
    var old = document.getElementById('drift-lens-ask');
    if (old) old.remove();
    var veil = document.createElement('div');
    veil.id = 'drift-lens-ask';
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483004;background:rgba(0,0,0,.28);cursor:crosshair';
    var tip = document.createElement('div');
    tip.textContent = 'Arrastra para marcar. Luego puedes mover el cuadro.';
    tip.style.cssText = 'position:absolute;left:50%;top:18px;transform:translateX(-50%);background:#111;color:#fff;padding:8px 12px;border-radius:999px;font:13px system-ui;pointer-events:none';
    var box = document.createElement('div');
    box.style.cssText = 'position:absolute;border:2px solid #1a73e8;background:rgba(26,115,232,.18);display:none;cursor:move;touch-action:none';
    var ask = document.createElement('button');
    ask.type = 'button';
    ask.textContent = 'Preguntar';
    ask.style.cssText = 'position:absolute;left:0;bottom:-36px;border:0;border-radius:999px;background:#1a73e8;color:#fff;font:650 12px system-ui;padding:6px 10px;cursor:pointer;white-space:nowrap';
    box.appendChild(ask);
    veil.append(tip, box);
    document.body.appendChild(veil);
    var x0 = 0, y0 = 0, drag = false, moving = false, mx = 0, my = 0;
    veil.addEventListener('pointerdown', function (e) {
      if (e.target === ask) return;
      if (e.target === box) {
        moving = true;
        mx = e.clientX - box.offsetLeft;
        my = e.clientY - box.offsetTop;
        return;
      }
      drag = true;
      x0 = e.clientX;
      y0 = e.clientY;
      box.style.display = 'block';
      box.style.left = x0 + 'px';
      box.style.top = y0 + 'px';
      box.style.width = '0';
      box.style.height = '0';
    });
    veil.addEventListener('pointermove', function (e) {
      if (moving) {
        box.style.left = Math.max(0, e.clientX - mx) + 'px';
        box.style.top = Math.max(0, e.clientY - my) + 'px';
        return;
      }
      if (!drag) return;
      var x = Math.min(x0, e.clientX), y = Math.min(y0, e.clientY);
      box.style.left = x + 'px';
      box.style.top = y + 'px';
      box.style.width = Math.abs(e.clientX - x0) + 'px';
      box.style.height = Math.abs(e.clientY - y0) + 'px';
    });
    veil.addEventListener('pointerup', function () { drag = false; moving = false; });
    ask.onclick = async function (e) {
      e.preventDefault();
      e.stopPropagation();
      var rect = box.getBoundingClientRect();
      veil.remove();
      var blob = null;
      try {
        var stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' }, preferCurrentTab: true, selfBrowserSurface: 'include', monitorTypeSurfaces: 'exclude', surfaceSwitching: 'exclude' });
        var video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;
        await video.play();
        await new Promise(function (res) { setTimeout(res, 180); });
        var scale = video.videoWidth / Math.max(1, window.innerWidth);
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(rect.width * scale));
        c.height = Math.max(1, Math.round(rect.height * scale));
        c.getContext('2d').drawImage(video, rect.left * scale, rect.top * scale, rect.width * scale, rect.height * scale, 0, 0, c.width, c.height);
        stream.getTracks().forEach(function (t) { t.stop(); });
        blob = await new Promise(function (res) { c.toBlob(res, 'image/jpeg', 0.86); });
      } catch (err) { blob = null; }
      var w = document.createElement('div');
      w.style.cssText = 'position:fixed;z-index:80;left:8vw;top:8vh;width:min(520px,92vw);height:min(640px,84vh);display:flex;flex-direction:column;background:#fff;color:#1f1f1f;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.28);font:15px system-ui';
      var head = document.createElement('div');
      head.style.cssText = 'display:flex;align-items:center;gap:8px;padding:12px 14px;cursor:move;user-select:none';
      head.innerHTML = '<span style="width:18px;height:18px;border-radius:50%;background:conic-gradient(#4285f4,#ea4335,#fbbc05,#34a853,#4285f4)"></span><b>Lens</b>';
      var close = document.createElement('button');
      close.type = 'button';
      close.textContent = '✕';
      close.style.cssText = 'margin-left:auto;border:0;background:transparent;font-size:16px;cursor:pointer';
      close.onclick = function () { w.remove(); };
      head.append(close);
      var log = document.createElement('div');
      log.style.cssText = 'flex:1;overflow:auto;padding:8px 16px 12px';
      if (blob) {
        var img = document.createElement('img');
        img.alt = 'Selección';
        img.src = URL.createObjectURL(blob);
        img.style.cssText = 'max-width:100%;border-radius:16px;display:block;margin:8px 0';
        var cap = document.createElement('div');
        cap.style.cssText = 'font-size:12px;opacity:.6;margin-bottom:8px';
        cap.textContent = 'De la pantalla · adjunto al chat';
        log.append(cap, img);
      } else {
        var miss = document.createElement('div');
        miss.style.cssText = 'opacity:.7;margin:8px 0';
        miss.textContent = 'No se pudo capturar el recorte. Elige la pestaña Drift si Chrome lo pide, o descríbelo abajo.';
        log.appendChild(miss);
      }
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:8px;padding:12px;border-top:1px solid #eee';
      var input = document.createElement('input');
      input.placeholder = 'Pregunta sobre lo que marcaste';
      input.style.cssText = 'flex:1;border:0;background:#f1f3f4;border-radius:999px;padding:12px 14px;font:15px system-ui';
      var send = document.createElement('button');
      send.type = 'button';
      send.textContent = 'Enviar';
      send.style.cssText = 'border:0;border-radius:999px;background:#1a73e8;color:#fff;padding:0 14px;font-weight:700;cursor:pointer';
      row.append(input, send);
      w.append(head, log, row);
      document.body.appendChild(w);
      var dx = 0, dy = 0, on = false;
      head.addEventListener('pointerdown', function (ev) {
        if (ev.target === close) return;
        on = true;
        dx = ev.clientX - w.offsetLeft;
        dy = ev.clientY - w.offsetTop;
      });
      window.addEventListener('pointermove', function (ev) {
        if (!on) return;
        w.style.left = (ev.clientX - dx) + 'px';
        w.style.top = (ev.clientY - dy) + 'px';
      });
      window.addEventListener('pointerup', function () { on = false; });
      async function go() {
        var q = input.value.trim() || '¿Qué hay en esta selección?';
        input.value = '';
        var me = document.createElement('div');
        me.style.cssText = 'align-self:flex-end;max-width:86%;margin:8px 0 8px auto;background:#e8f0fe;border-radius:16px 16px 4px 16px;padding:10px 12px';
        me.textContent = q;
        var reply = document.createElement('div');
        reply.style.cssText = 'align-self:flex-start;max-width:86%;margin:8px auto 8px 0;white-space:pre-wrap;background:#f8f9fa;border-radius:16px 16px 16px 4px;padding:10px 12px';
        reply.textContent = '…';
        log.style.display = 'flex';
        log.style.flexDirection = 'column';
        log.append(me, reply);
        log.scrollTop = log.scrollHeight;
        try {
          var text = '';
          if (typeof window.driftAsk === 'function') text = await window.driftAsk(q, blob);
          if (!String(text || '').trim() && typeof window.driftAsk === 'function') text = await window.driftAsk(q, blob);
          reply.textContent = String(text || '').trim() || 'No llegó. Pregunta otra vez.';
        } catch (err2) {
          try {
            var again = typeof window.driftAsk === 'function' ? await window.driftAsk(q, blob) : '';
            reply.textContent = String(again || '').trim() || 'No llegó. Pregunta otra vez.';
          } catch (err3) { reply.textContent = 'No llegó. Pregunta otra vez.'; }
        }
      }
      send.onclick = go;
      input.onkeydown = function (ev) { if (ev.key === 'Enter') go(); };
    };
  }
  function installSupport() {
    var on = false;
    try { on = localStorage.getItem('wos:support') === '1'; } catch (e) {}
    var box = document.getElementById('drift-support');
    var scr = document.getElementById('drift-support-js');
    if (!on) {
      if (box) box.remove();
      if (scr) scr.remove();
      return;
    }
    if (!box) {
      box = document.createElement('div');
      box.id = 'drift-support';
      box.style.cssText = 'position:fixed;left:14px;bottom:12px;z-index:4;width:148px;max-height:90px;overflow:hidden;opacity:.42;pointer-events:auto';
      box.innerHTML = '<div id="container-81b3d549fa475d88a26a5b7bd2365c8f"></div>';
      document.body.appendChild(box);
    }
    if (!scr) {
      scr = document.createElement('script');
      scr.id = 'drift-support-js';
      scr.async = true;
      scr.setAttribute('data-cfasync', 'false');
      scr.src = 'https://bauval.org/21/81b3d549fa475d88a26a5b7bd2365c8f';
      document.body.appendChild(scr);
    }
  }
  function googleAppsShell(startUrl) {
    var apps = [
      ['Gmail', 'https://mail.google.com/mail/u/0/'],
      ['Classroom', 'https://classroom.google.com/'],
      ['Drive', 'https://drive.google.com/drive/u/0/'],
      ['Docs', 'https://docs.google.com/document/u/0/'],
      ['Sheets', 'https://docs.google.com/spreadsheets/u/0/'],
      ['Slides', 'https://docs.google.com/presentation/u/0/'],
      ['Calendar', 'https://calendar.google.com/calendar/u/0/r'],
      ['Meet', 'https://meet.google.com/']
    ];
    return function (root) {
      root.innerHTML = '<div style="height:100%;display:flex;flex-direction:column;min-height:0;background:#fff"><div data-apps style="flex:none;display:flex;gap:6px;align-items:center;padding:6px 8px;overflow:auto;background:#fff;border-bottom:1px solid #e0e0e0;font:12px system-ui,sans-serif"></div><div class="sjt" style="flex:1;min-height:0;position:relative;background:#fff"></div></div>';
      var bar = root.querySelector('[data-apps]');
      var box = root.querySelector('.sjt');
      function show(url) {
        box.innerHTML = '';
        var frame = document.createElement('iframe');
        frame.title = 'Google';
        frame.setAttribute('referrerpolicy', 'no-referrer');
        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals allow-downloads allow-pointer-lock');
        frame.setAttribute('allow', 'camera; microphone; clipboard-read; clipboard-write; fullscreen');
        frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff';
        frame.src = '/api/opera?u=' + encodeURIComponent(url) + '&b=firefox';
        armGoogleMenu(frame);
        box.appendChild(frame);
      }
      apps.forEach(function (item) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = item[0];
        b.style.cssText = 'border:0;border-radius:8px;padding:6px 10px;cursor:pointer;font-weight:700;background:' + (item[1] === startUrl ? '#1a73e8' : '#e8eaed') + ';color:' + (item[1] === startUrl ? '#fff' : '#111');
        b.onclick = function () {
          bar.querySelectorAll('button').forEach(function (n, i) {
            var on = apps[i][1] === item[1];
            n.style.background = on ? '#1a73e8' : '#e8eaed';
            n.style.color = on ? '#fff' : '#111';
          });
          show(item[1]);
        };
        bar.appendChild(b);
      });
      show(startUrl || apps[0][1]);
    };
  }
  function installGoogleApps() {
    if (!window.XAPPS) return;
    try { if (window.APPS) delete window.APPS.classroom; } catch (e) {}
    try { delete window.XAPPS.classroom; } catch (e2) {}
    try { if (window.IC) delete window.IC.classroom; } catch (e3) {}
    try {
      if (window.S && window.S.d) {
        ['pins', 'desk'].forEach(function (k) {
          if (Array.isArray(window.S.d[k])) window.S.d[k] = window.S.d[k].filter(function (id) { return id !== 'classroom'; });
        });
      }
    } catch (e4) {}
    var login = 'https://mail.google.com/mail/u/0/';
    window.XAPPS.gmail = { n: 'Gmail', f: googleAppsShell(login) };
    try { if (typeof rend === 'function') rend(); } catch (e5) {}
  }
  function installLensOrb() {
    var on = false;
    try { on = localStorage.getItem('wos:lens-bypass') === '1'; } catch (e) {}
    var btn = document.getElementById('drift-lens-orb');
    if (!on) { if (btn) btn.remove(); return; }
    if (btn) return;
    btn = document.createElement('button');
    btn.id = 'drift-lens-orb';
    btn.type = 'button';
    btn.title = 'Google Lens';
    btn.setAttribute('aria-label', 'Google Lens');
    btn.style.cssText = 'position:fixed;z-index:2147483000;left:18px;bottom:calc(var(--tbh, 76px) + 18px);width:56px;height:56px;padding:6px;border-radius:16px;border:0;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.28);cursor:pointer';
    btn.innerHTML = '<img alt="" src="/lens.png" style="width:100%;height:100%;object-fit:contain;display:block">';
    btn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openLensAsk();
    };
    document.body.appendChild(btn);
    prepGeminiLens();
  }
  function installOrb() {
    var on = false;
    try { on = localStorage.getItem('wos:ai-orb') === '1'; } catch (e) {}
    var btn = document.getElementById('drift-orb');
    if (!on) {
      if (btn) btn.remove();
      var old = document.getElementById('drift-orb-panel');
      if (old) old.remove();
      return;
    }
    if (btn) return;
    btn = document.createElement('button');
    btn.id = 'drift-orb';
    btn.type = 'button';
    btn.title = 'AI assistant';
    btn.setAttribute('aria-label', 'AI assistant');
    btn.style.cssText = 'position:fixed;z-index:2147483000;right:18px;bottom:calc(var(--tbh, 76px) + 18px);width:68px;height:68px;padding:0;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.45);background:#071226;box-shadow:0 8px 24px rgba(0,0,0,.4);cursor:grab;touch-action:none';
    btn.innerHTML = '<img src="/drift-mark.png" alt="" draggable="false" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;transform:scale(1.18);pointer-events:none">';
    try {
      var saved = JSON.parse(localStorage.getItem('wos:orb-pos') || 'null');
      if (saved && typeof saved.x === 'number') {
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
        btn.style.left = saved.x + 'px';
        btn.style.top = saved.y + 'px';
      }
    } catch (e) {}
    var drag = null, skipClick = false;
    btn.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      drag = { x: e.clientX, y: e.clientY, l: btn.offsetLeft, t: btn.offsetTop, moved: false, id: e.pointerId };
      btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
      if (!drag.moved) return;
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
      btn.style.left = Math.max(4, Math.min(window.innerWidth - 72, drag.l + dx)) + 'px';
      btn.style.top = Math.max(4, Math.min(window.innerHeight - 72, drag.t + dy)) + 'px';
    });
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      var moved = drag.moved;
      drag = null;
      if (moved) {
        skipClick = true;
        try { localStorage.setItem('wos:orb-pos', JSON.stringify({ x: btn.offsetLeft, y: btn.offsetTop })); } catch (err) {}
      }
    }
    btn.addEventListener('pointerup', endDrag);
    btn.addEventListener('pointercancel', endDrag);
    btn.addEventListener('click', function (e) {
      if (skipClick) { skipClick = false; e.preventDefault(); e.stopPropagation(); return; }
      orbAsk();
    });
    document.body.appendChild(btn);
  }
  function orbPanel() {
    var panel = document.getElementById('drift-orb-panel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'drift-orb-panel';
    panel.style.cssText = 'position:fixed;z-index:2147483002;width:min(520px,94vw);max-height:70vh;overflow:auto;background:#14141c;color:#eee;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:10px;font:14px/1.5 system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.45)';
    document.body.appendChild(panel);
    return panel;
  }
  function placeOrbPanel() {
    var panel = document.getElementById('drift-orb-panel');
    var btn = document.getElementById('drift-orb');
    if (!panel || !btn) return;
    var r = btn.getBoundingClientRect();
    var left = Math.max(8, Math.min(window.innerWidth - 376, r.left - 300));
    var top = r.top - 12;
    panel.style.left = left + 'px';
    panel.style.top = Math.max(8, top) + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    if (panel.getBoundingClientRect().bottom > window.innerHeight - 8) {
      panel.style.top = Math.max(8, r.bottom - panel.offsetHeight - r.height - 12) + 'px';
    }
  }
  function orbMessage(text) {
    var panel = orbPanel();
    var row = document.createElement('div');
    row.style.cssText = 'position:relative;padding:8px 8px 8px 32px;margin:0 0 8px;background:rgba(255,255,255,.04);border-radius:10px';
    var x = document.createElement('button');
    x.type = 'button';
    x.textContent = '×';
    x.setAttribute('aria-label', 'Dismiss message');
    x.style.cssText = 'position:absolute;top:2px;left:4px;border:0;background:transparent;color:#ddd;font-size:20px;line-height:1;cursor:pointer';
    x.onclick = function (e) {
      e.stopPropagation();
      row.remove();
      if (!panel.querySelector('[data-msg]')) panel.remove();
    };
    var body = document.createElement('div');
    body.dataset.msg = '1';
    driftPaint(body, text);
    row.append(x, body);
    panel.appendChild(row);
    placeOrbPanel();
    panel.scrollTop = panel.scrollHeight;
    return body;
  }
  async function orbAsk() {
    var status = orbMessage('Pick this screen in the share dialog. Drift 2.1 will look at it.');
    var stream;
    try { stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' }, audio: false }); }
    catch (e) {
      status.parentNode.remove();
      orbMessage('Screen share was blocked, so the assistant cannot see the screen. Allow the prompt and tap the Drift ball again.');
      return;
    }
    var video = document.createElement('video');
    video.srcObject = stream; video.muted = true;
    try { await video.play(); } catch (e) {}
    await new Promise(function (res) { if (video.videoWidth) res(); else video.onloadeddata = function () { res(); }; setTimeout(res, 700); });
    var w = Math.min(960, video.videoWidth || 960);
    var h = Math.max(1, Math.round(w * ((video.videoHeight || 720) / (video.videoWidth || 1280))));
    var canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(video, 0, 0, w, h);
    stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) {} });
    var q = prompt('What do you want to know about this screen?', 'What is on my screen?');
    if (!q) { if (status.parentNode) status.parentNode.remove(); return; }
    var click = /pantalla|on screen|selecci[oó]n|selection|\bclick\b|p[uú]lsa|responde lo que/i.test(q);
    driftPaint(status, 'Drift 2.1 is looking…');
    try { if (window.driftAct) window.driftAct(q, ''); } catch (e) {}
    var ask = q;
    if (click) ask += '\n\nIf the user wants a point on this screen clicked, end with one line CLICK: percentX percentY. Do not explain that line.';
    var data = canvas.toDataURL('image/jpeg', 0.62).split(',')[1];
    var ep = 'https://holy-firefly-982c.fert0480.workers.dev';
    try { if (typeof EP === 'function') ep = String(EP()).replace(/\/$/, ''); } catch (e) {}
    try {
      var body = {
        model: 'mistralai/mistral-large-2512',
        max_tokens: 900,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: data } },
          { type: 'text', text: ask }
        ]}]
      };
      var r = await fetch(ep + '/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      var j = await r.json().catch(function () { return {}; });
      var text = ((j.content || []).map(function (x) { return x.text || ''; }).join('')) || '';
      if (!String(text).trim()) {
        r = await fetch(ep + '/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        j = await r.json().catch(function () { return {}; });
        text = ((j.content || []).map(function (x) { return x.text || ''; }).join('')) || '';
      }
      text = String(text || '').replace(/Gemini said/gi, 'Drift said');
      if (window.driftAct) {
        var acted = window.driftAct('', text);
        if (typeof acted === 'string') text = acted;
      }
      var cm = text.match(/CLICK:\s*(\d{1,3}(?:\.\d+)?)\s+(\d{1,3}(?:\.\d+)?)\s*$/i);
      if (cm && click) {
        text = text.replace(cm[0], '').trim();
        driftClickAt(Number(cm[1]), Number(cm[2]));
      }
      if (status.parentNode) status.parentNode.remove();
      orbMessage(text || 'Drift 2.1 did not answer. Ask again.');
    } catch (e) {
      if (status.parentNode) status.parentNode.remove();
      orbMessage(String((e && e.message) || e));
    }
  }
  function driftClickAt(px, py) {
    var x = Math.max(0, Math.min(window.innerWidth - 1, (px / 100) * window.innerWidth));
    var y = Math.max(0, Math.min(window.innerHeight - 1, (py / 100) * window.innerHeight));
    var cur = document.createElement('div');
    cur.style.cssText = 'position:fixed;z-index:2147483646;width:16px;height:16px;margin-left:-8px;margin-top:-8px;border-radius:50%;border:2px solid #fff;background:#111;pointer-events:none;left:12px;top:12px;transition:left .45s ease,top .45s ease';
    document.body.appendChild(cur);
    requestAnimationFrame(function () { cur.style.left = x + 'px'; cur.style.top = y + 'px'; });
    setTimeout(function () {
      var el = document.elementFromPoint(x, y);
      if (el && el !== cur) {
        try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window })); } catch (e) { try { el.click(); } catch (e2) {} }
      }
      setTimeout(function () { cur.remove(); }, 350);
    }, 500);
  }
  function driftTaskbar(show) {
    var task = document.getElementById('task');
    if (show) {
      if (task) task.classList.remove('drift-hidden');
      document.body.classList.remove('drift-tb-off');
      try { localStorage.setItem('wos:tb-hidden', '0'); } catch (e) {}
    } else {
      if (task) task.classList.add('drift-hidden');
      document.body.classList.add('drift-tb-off');
      try { localStorage.setItem('wos:tb-hidden', '1'); } catch (e) {}
    }
  }
  var driftOpened = {};
  function driftOpen(id) {
    if (!id || driftOpened[id] || !window.APPS || !window.APPS[id]) return;
    driftOpened[id] = 1;
    try { openApp(id); } catch (e) {}
  }
  function driftSetSize(which, value) {
    if (!SIZE_MAP[value]) return;
    try { localStorage.setItem(which === 'tb' ? 'wos:size-tb' : 'wos:size-apps', value); } catch (e) {}
    applySize();
  }
  function driftFlag(key, on) {
    if (key === 'cros') setChromeOSAdapt(on);
    else if (key === 'edu') setEducationMode(on);
    else if (key === 'nodev') setNoDev(on);
    else if (key === 'glass') {
      try { localStorage.setItem('wos:liquid-glass', on ? '1' : '0'); } catch (e) {}
      installLiquidGlass();
    } else if (key === 'orb') {
      try { localStorage.setItem('wos:ai-orb', on ? '1' : '0'); } catch (e) {}
      installOrb();
    } else if (key === 'protector') {
      try { localStorage.setItem('wos:protector', on ? '1' : '0'); } catch (e) {}
    } else if (key === 'home' && /^(drift|mac|win)$/.test(String(on))) {
      try { localStorage.setItem('wos:home-btn', String(on)); } catch (e) {}
      try { applyHomeLogo(String(on)); } catch (e2) {}
    }
  }
  var lastAsk = '';
  function fileFromAnswer(text) {
    var blocks = [];
    var re = /```[^\n]*\n([\s\S]*?)```/g, m;
    var src = String(text || '');
    while ((m = re.exec(src))) blocks.push(m[1].replace(/\n$/, ''));
    blocks.sort(function (a, b) { return b.length - a.length; });
    return blocks[0] || '';
  }
  function driftEditFile(name, text) {
    name = String(name || '').replace(/[\\/]/g, '').trim();
    if (!name || text == null) return;
    var files = [];
    try { files = JSON.parse(localStorage.getItem('wos:vscode-files') || '[]'); } catch (e) { files = []; }
    if (!Array.isArray(files)) files = [];
    var i = -1;
    for (var k = 0; k < files.length; k++) {
      if (files[k] && String(files[k].name).toLowerCase() === name.toLowerCase()) i = k;
    }
    if (i < 0) files.push({ name: name, text: String(text) });
    else files[i].text = String(text);
    try { localStorage.setItem('wos:vscode-files', JSON.stringify(files)); } catch (e2) {}
    driftOpen('code');
    var n = 0;
    var timer = setInterval(function () {
      n++;
      if (window.DriftVS && typeof window.DriftVS.writeFile === 'function') {
        clearInterval(timer);
        try { window.DriftVS.writeFile(name, text); } catch (e3) {}
      } else if (n > 40) clearInterval(timer);
    }, 250);
  }
  var skipCmd = false;
  window.driftAct = function (userText, answerText) {
    if (userText) {
      driftOpened = {};
      lastAsk = String(userText);
      skipCmd = false;
      var rnd = String(userText).match(/\b(\d+)\s+(?:apps?|aplicaciones)\b/i);
      if (rnd && /\b(aleatori\w*|random|al azar)\b/i.test(userText) && /\b(open|abre|abrir|ábreme|abreme|abrime|launch|lanz\w*)\b/i.test(userText)) {
        var count = Math.min(8, Math.max(1, parseInt(rnd[1], 10) || 1));
        var pool = [];
        if (window.APPS) Object.keys(window.APPS).forEach(function (id) {
          if (id !== 'canva' && window.XAPPS && window.XAPPS[id]) pool.push(id);
        });
        for (var s = pool.length - 1; s > 0; s--) {
          var j = Math.floor(Math.random() * (s + 1));
          var tmp = pool[s]; pool[s] = pool[j]; pool[j] = tmp;
        }
        pool.slice(0, count).forEach(function (id) { driftOpen(id); });
        skipCmd = true;
      }
    }
    var answer = String(answerText || '');
    var did = false;
    if (!skipCmd) {
    answer.replace(/OPEN_APP:\s*([a-z0-9_]+)/gi, function (_, id) {
      id = id.toLowerCase();
      var qNow = String(userText || lastAsk || '');
      var asked = /\b(open|abre|abrir|ábreme|abreme|abrime|launch|lanz\w*|go to|ve a|pull up|bring up|switch to|cambia a|ponme)\b/i.test(qNow);
      if (!asked) return '';
      if (id === 'code' && !/\b(vs\s*code|vscode|code app|el code|the code)\b/i.test(qNow)) return '';
      driftOpen(id);
      did = true;
      return '';
    });
    answer.replace(/TASKBAR:\s*(hide|show)/gi, function (_, v) { driftTaskbar(v.toLowerCase() === 'show'); did = true; return ''; });
    answer.replace(/SIZE:\s*(apps|tb)\s*=\s*(xl|lg|sm|xs)/gi, function (_, which, value) { driftSetSize(which.toLowerCase(), value.toLowerCase()); did = true; return ''; });
    answer.replace(/SET:\s*([a-z]+)\s*=\s*([a-z0-9._-]+)/gi, function (_, key, value) {
      if (key === 'home') driftFlag('home', value);
      else driftFlag(key, value === '1' || value === 'on' || value === 'true');
      did = true;
      return '';
    });
    }
    answer = answer.replace(/^\s*(OPEN_APP:\s*[a-z0-9_<>]+|TASKBAR:\s*(?:hide|show)|SIZE:\s*(?:apps|tb)\s*=\s*(?:xl|lg|sm|xs)|SET:\s*[a-z]+\s*=\s*[a-z0-9._-]+)\s*$/gim, '').replace(/OPEN_APP:\s*[A-Za-z0-9_<>]+/gi, '').replace(/\n{3,}/g, '\n\n').trim();
    answer = answer.replace(/Gemini said/gi, 'Drift said');
    var q = String(userText || '');
    if (q) {
      if (/\b(hide|oculta|esconde|quita)\b/i.test(q) && /(task\s*bar|barra)/i.test(q)) { driftTaskbar(false); did = true; }
      else if (/\b(show|muestra|enseña|pon)\b/i.test(q) && /(task\s*bar|barra)/i.test(q)) { driftTaskbar(true); did = true; }
      var size = /extra\s*small|extra\s*peque/i.test(q) ? 'xs' : (/\bsmall\b|pequeñ/i.test(q) ? 'sm' : (/extra\s*large|extra\s*grande/i.test(q) ? 'xl' : (/\blarge\b|\bgrande\b/i.test(q) ? 'lg' : '')));
      if (size && /size|tama|apps|icon|task\s*bar|barra/i.test(q)) {
        driftSetSize(/task\s*bar|barra/i.test(q) && !/app|icon/i.test(q) ? 'tb' : 'apps', size);
        did = true;
      }
      function wantsOn() {
        if (/\b(off|apaga|desactiva|disable|quita)\b/i.test(q)) return false;
        if (/\b(on|prende|activa|enable|enciende)\b/i.test(q)) return true;
        return null;
      }
      var flag = wantsOn();
      if (flag !== null && /adapt|chrome\s*os|chromeos/i.test(q)) { driftFlag('cros', flag); did = true; }
      if (flag !== null && /education|modo edu/i.test(q)) { driftFlag('edu', flag); did = true; }
      if (flag !== null && /liquid glass/i.test(q)) { driftFlag('glass', flag); did = true; }
      if (flag !== null && /\borb\b|assistant|asistente/i.test(q)) { driftFlag('orb', flag); did = true; }
      if (flag !== null && /protector/i.test(q)) { driftFlag('protector', flag); did = true; }
      if (flag !== null && /no dev/i.test(q)) { driftFlag('nodev', flag); did = true; }
      var asking = /^\s*(how|why|what|when|who|donde|d[oó]nde|cuando|cu[aá]ndo|por\s*qu[eé]|c[oó]mo\s+(se|hago|funciona)|explica|explain|qu[eé]\s+es)\b/i.test(q);
      var verb = /\b(open|abre|abrir|ábreme|abreme|abrime|launch|lanz\w*|go to|ve a|pull up|bring up|switch to|cambia a|ponme)\b/i.test(q);
      var words = [
        ['js injector', 'injector'], ['vs code', 'code'], ['vscode', 'code'], ['classdojo', 'classdojo'], ['dojo islands', 'classdojo'], ['whatsapp', 'whatsapp'],
        ['wayground', 'wayground'], ['classroom', 'classroom'], ['instagram', 'ig'], ['calculator', 'calc'], ['calculadora', 'calc'],
        ['youtube', 'yt'], ['discord', 'discord'], ['roblox', 'roblox'], ['gimkit', 'gimkit'], ['github', 'github'],
        ['netflix', 'movies'], ['canva', 'canva'], ['gmail', 'gmail'], ['tiktok', 'tt'], ['gemini', 'gem'],
        ['browser', 'browser'], ['navegador', 'browser'], ['camera', 'cam'], ['cámara', 'cam'], ['camara', 'cam'],
        ['music', 'mus'], ['música', 'mus'], ['musica', 'mus'], ['games', 'games'], ['juegos', 'games'],
        ['chat', 'chat'], ['calc', 'calc'], ['ai', 'ai'], ['dojo', 'classdojo']
      ];
      var hits = [];
      for (var i = 0; i < words.length; i++) {
        var re = new RegExp('(^|[^a-z])' + words[i][0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z]|$)', 'i');
        if (re.test(q)) hits.push(words[i]);
      }
      if (verb && /\b(open|abre|abrir|launch)\b[^.?\n]{0,24}\b(vs\s*code|vscode|code)\b/i.test(q)) hits.push(['vs code', 'code']);
      if (!asking && verb) {
        hits.forEach(function (h) {
          var covered = hits.some(function (o) { return o[0] !== h[0] && o[0].length > h[0].length && o[0].indexOf(h[0]) !== -1; });
          if (covered) return;
          driftOpen(h[1]);
          did = true;
        });
      }
    }
    if (answerText) {
      var editQ = String(userText || lastAsk || '');
      var em = editQ.match(/\b(?:edita|edit|modifica)\s+(?:el\s+(?:archivo|file)\s+|archivo\s+|file\s+)?["'“”]?([A-Za-z0-9_.-]{1,64})["'“”]?/i);
      if (em) {
        var next = fileFromAnswer(answerText);
        if (next) { driftEditFile(em[1], next); did = true; }
      }
    }
    if (skipCmd && !answer) return 'Done.';
    if (!answer && did) return 'Done.';
    return answer;
  };
  function armAppLoader(app) {
    var id = String(app || '');
    var name = (window.APPS && window.APPS[app]) || id || 'app';
    if (/^(mus|code|injector|ai|cam|browser|chat)$/i.test(id)) return;
    if (/^(Music|VS Code|JS Injector|AI|Camera|Browser|Chat)$/i.test(String(name))) return;
    var list = document.querySelectorAll('.win');
    var w = list[list.length - 1];
    if (!w || w.querySelector('.drift-appload')) return;
    var body = w.querySelector('.body');
    if (!body) return;
    if (!document.getElementById('drift-appload-style')) {
      var css = document.createElement('style');
      css.id = 'drift-appload-style';
      css.textContent = '.drift-appload{position:absolute;left:0;right:0;bottom:0;top:36px;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#0e1016;color:#eee;font:15px/1.4 system-ui,sans-serif;pointer-events:none}.drift-spin{width:36px;height:36px;border-radius:50%;border:3px solid rgba(255,255,255,.2);border-top-color:#fff;animation:drift-spin .7s linear infinite}@keyframes drift-spin{to{transform:rotate(360deg)}}.drift-appload [data-play]{pointer-events:auto;margin-top:4px;padding:8px 14px;border:0;border-radius:10px;background:#1a73e8;color:#fff;font-weight:700;cursor:pointer}.drift-appload [data-game]{display:none;position:absolute;inset:0;width:100%;height:100%;background:#111}';
      document.head.appendChild(css);
    }
    var overlay = document.createElement('div');
    overlay.className = 'drift-appload';
    overlay.innerHTML = '<div class="drift-spin"></div><b>Loading app…</b><div data-type style="min-height:1.4em;opacity:.8;text-align:center;padding:0 18px"></div><button type="button" data-play>Play</button><canvas data-game></canvas>';
    w.appendChild(overlay);
    var stopGame = function () {};
    overlay.querySelector('[data-play]').onclick = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var btn = overlay.querySelector('[data-play]');
      if (btn) btn.style.display = 'none';
      var spin = overlay.querySelector('.drift-spin');
      if (spin) spin.style.display = 'none';
      var cv = overlay.querySelector('[data-game]');
      cv.style.display = 'block';
      cv.style.pointerEvents = 'auto';
      overlay.style.pointerEvents = 'auto';
      stopGame = playCube(cv);
    };
    function playCube(cv) {
      window.driftCubeGame = playCube;
      var ctx = cv.getContext('2d');
      var y = 0, vy = 0, dead = false, score = 0, best = 0, coins = 0, tickN = 0, raf = 0, started = false, shake = 0, runT = 0;
      var obs = [], flakes = [], far = [], coinsA = [], dust = [];
      try { best = Number(sessionStorage.getItem('wos:cube-best') || 0) || 0; } catch (e) {}
      function size() {
        var w0 = Math.max(320, cv.clientWidth || 640), h0 = Math.max(220, cv.clientHeight || 360);
        if (cv.width !== w0) cv.width = w0;
        if (cv.height !== h0) cv.height = h0;
        return { w: cv.width, h: cv.height };
      }
      function reset() {
        var box = size();
        y = box.h - 118;
        vy = 0; dead = false; started = false; score = 0; coins = 0; tickN = 0; shake = 0; runT = 0;
        obs = []; flakes = []; far = []; coinsA = []; dust = [];
        var i;
        for (i = 0; i < 7; i++) far.push({ x: Math.random() * box.w, h: 40 + Math.random() * 90, w: 70 + Math.random() * 80 });
        for (i = 0; i < 46; i++) flakes.push({ x: Math.random() * box.w, y: Math.random() * box.h, r: 0.6 + Math.random() * 1.8, v: 0.45 + Math.random() * 1.3, o: 0.35 + Math.random() * 0.55 });
      }
      function jump() {
        if (!cv.isConnected) return;
        if (dead) { reset(); return; }
        started = true;
        var box = size();
        if (y >= box.h - 122) {
          vy = -10.4;
          var k;
          for (k = 0; k < 6; k++) dust.push({ x: 92, y: y + 18, vx: -1.2 - Math.random() * 2, vy: -Math.random() * 1.4, l: 16 });
        }
      }
      function onKey(e) {
        if (e.code !== 'Space' && e.key !== ' ' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        jump();
      }
      cv.addEventListener('pointerdown', jump);
      window.addEventListener('keydown', onKey);
      reset();
      function ridge(px, ground, ph, wide, fill) {
        ctx.beginPath();
        ctx.moveTo(px, ground);
        ctx.lineTo(px + wide * 0.42, ground - ph * 0.62);
        ctx.lineTo(px + wide * 0.7, ground - ph);
        ctx.lineTo(px + wide * 1.15, ground - ph * 0.48);
        ctx.lineTo(px + wide * 1.55, ground);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px + wide * 0.52, ground - ph * 0.78);
        ctx.lineTo(px + wide * 0.7, ground - ph);
        ctx.lineTo(px + wide * 0.9, ground - ph * 0.7);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,.92)';
        ctx.fill();
      }
      function frame() {
        if (!cv.isConnected) { window.removeEventListener('keydown', onKey); return; }
        var box = size();
        var ground = box.h - 54;
        tickN++;
        if (shake > 0) shake *= 0.86;
        ctx.save();
        if (shake > 0.4) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
        var sky = ctx.createLinearGradient(0, 0, 0, ground);
        sky.addColorStop(0, '#06101f');
        sky.addColorStop(0.45, '#1a4b86');
        sky.addColorStop(1, '#f3d7b0');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, box.w, box.h);
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        var fi;
        for (fi = 0; fi < flakes.length; fi++) {
          var flake = flakes[fi];
          flake.y += flake.v;
          flake.x += Math.sin((tickN + fi) / 30) * 0.25;
          if (flake.y > ground) { flake.y = -4; flake.x = Math.random() * box.w; }
          ctx.globalAlpha = flake.o;
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.r, 0, 6.3);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        var speed = started && !dead ? 4.6 + Math.min(5.5, score / 28) : 1.2;
        var bi;
        for (bi = 0; bi < far.length; bi++) {
          var hill = far[bi];
          hill.x -= speed * 0.18;
          if (hill.x < -hill.w) hill.x = box.w + 20;
          ridge(hill.x, ground, hill.h * 0.55, hill.w, 'rgba(90,120,160,.35)');
        }
        var snowG = ctx.createLinearGradient(0, ground - 8, 0, box.h);
        snowG.addColorStop(0, '#f7fbff');
        snowG.addColorStop(1, '#8ea4bf');
        ctx.fillStyle = '#16324d';
        ctx.fillRect(0, ground + 8, box.w, box.h);
        ctx.fillStyle = snowG;
        ctx.fillRect(0, ground - 2, box.w, 14);
        if (started && !dead) {
          runT++;
          vy += 0.46;
          y += vy;
          if (y > ground - 28) { y = ground - 28; vy = 0; }
          if (tickN % Math.max(52, 92 - Math.floor(score / 12)) === 0) {
            var hgt = 34 + Math.random() * 86;
            obs.push({ x: box.w + 24, hgt: hgt, wide: 26 + Math.random() * 18, passed: false });
            if (Math.random() < 0.65) coinsA.push({ x: box.w + 70, y: ground - hgt - 36 - Math.random() * 20, got: false });
          }
        }
        var i;
        for (i = 0; i < obs.length; i++) {
          obs[i].x -= speed;
          ridge(obs[i].x, ground + 6, obs[i].hgt, obs[i].wide, '#6d8caf');
          var top = ground - obs[i].hgt + 16;
          var left = obs[i].x + obs[i].wide * 0.35;
          var right = obs[i].x + obs[i].wide * 1.05;
          if (started && !dead && 78 < right && 78 + 22 > left && y < top + obs[i].hgt - 18 && y + 22 > top + 8) {
            dead = true;
            shake = 10;
          }
          if (!obs[i].passed && obs[i].x + obs[i].wide < 70) { obs[i].passed = true; score += 1; }
        }
        obs = obs.filter(function (o) { return o.x > -120; });
        for (i = 0; i < coinsA.length; i++) {
          var coin = coinsA[i];
          coin.x -= speed;
          if (!coin.got) {
            ctx.fillStyle = '#ffe56a';
            ctx.beginPath();
            ctx.arc(coin.x, coin.y + Math.sin(tickN / 8 + i) * 3, 6, 0, 6.3);
            ctx.fill();
            ctx.fillStyle = '#b8860b';
            ctx.fillRect(coin.x - 1, coin.y - 4, 2, 8);
            if (started && !dead && Math.abs(coin.x - 88) < 16 && Math.abs(coin.y - (y + 8)) < 16) {
              coin.got = true;
              coins++;
              score += 3;
            }
          }
        }
        coinsA = coinsA.filter(function (c) { return c.x > -20 && !c.got; });
        if (score > best) {
          best = score;
          try { sessionStorage.setItem('wos:cube-best', String(best)); } catch (e2) {}
        }
        for (i = dust.length - 1; i >= 0; i--) {
          var p = dust[i];
          p.x += p.vx; p.y += p.vy; p.l--;
          ctx.globalAlpha = Math.max(0, p.l / 16);
          ctx.fillStyle = '#fff';
          ctx.fillRect(p.x, p.y, 3, 3);
          if (p.l <= 0) dust.splice(i, 1);
        }
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.translate(86, y + 12);
        ctx.rotate(!dead && vy < -0.4 ? -0.35 : (vy > 1 ? 0.25 : 0));
        ctx.fillStyle = 'rgba(7,20,38,.35)';
        ctx.fillRect(-8, 16, 20, 4);
        ctx.fillStyle = '#123056';
        ctx.fillRect(-6, -4, 22, 22);
        ctx.fillStyle = '#7ec8ff';
        ctx.fillRect(-12, -12, 22, 22);
        ctx.fillStyle = '#e8f4ff';
        ctx.fillRect(-12, -12, 7, 22);
        ctx.fillStyle = '#071426';
        ctx.fillRect(-8, -5, 3, 3);
        ctx.fillRect(-2, -5, 3, 3);
        ctx.restore();
        ctx.fillStyle = '#fff';
        ctx.font = '700 18px system-ui';
        ctx.fillText(String(score), 16, 28);
        ctx.font = '13px system-ui';
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.fillText('best ' + best + '   coins ' + coins, 16, 48);
        if (!started) {
          ctx.font = '700 20px system-ui';
          ctx.fillText('Tap or space — jump the peaks', 16, box.h * 0.38);
          ctx.font = '14px system-ui';
          ctx.fillStyle = 'rgba(255,255,255,.8)';
          ctx.fillText('Grab the coins. Speed climbs.', 16, box.h * 0.38 + 26);
        }
        if (dead) {
          ctx.fillStyle = 'rgba(6,16,31,.5)';
          ctx.fillRect(0, 0, box.w, box.h);
          ctx.fillStyle = '#fff';
          ctx.font = '800 32px system-ui';
          ctx.fillText('Wiped out', box.w * 0.5 - 78, box.h * 0.4);
          ctx.font = '16px system-ui';
          ctx.fillText('Score ' + score + '  ·  tap to run again', box.w * 0.5 - 100, box.h * 0.4 + 30);
        }
        ctx.restore();
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      return function () {
        cancelAnimationFrame(raf);
        window.removeEventListener('keydown', onKey);
      };
    }
    var phrases = [
      'Wait until we set up to you',
      'Almost there',
      'This shouldn\u2019t take too much',
      'this is not broken',
      'wait until we load ' + name
    ];
    var el = overlay.querySelector('[data-type]');
    var pi = 0, ci = 0, dir = 1;
    var timer = 0;
    function tick() {
      if (!overlay.isConnected) return;
      var full = phrases[pi];
      ci += dir;
      if (ci > full.length) { dir = -1; ci = full.length; el.textContent = full; timer = setTimeout(tick, 650); return; }
      if (ci < 0) { dir = 1; ci = 0; pi = (pi + 1) % phrases.length; el.textContent = ''; timer = setTimeout(tick, 220); return; }
      el.textContent = full.slice(0, ci);
      timer = setTimeout(tick, dir > 0 ? 38 : 24);
    }
    tick();
    function hide() {
      clearTimeout(timer);
      try { stopGame(); } catch (e) {}
      if (overlay.parentNode) overlay.remove();
    }
    function watch() {
      if (!overlay.isConnected || !body.isConnected) { hide(); return; }
      var frame = body.querySelector('iframe');
      if (frame && !frame.__driftLoadWatch) {
        frame.__driftLoadWatch = 1;
        frame.addEventListener('load', function () {
          var bad = false;
          try {
            var title = frame.contentDocument && frame.contentDocument.getElementById('errorTitle');
            bad = !!(title && /uh oh/i.test(title.textContent || ''));
          } catch (err) {}
          if (bad) return;
          setTimeout(hide, 180);
        });
      }
      var note = body.querySelector('.ym');
      var waiting = note && /loading|cargando|opening|starting|proxy/i.test(note.textContent || '');
      if (frame) { setTimeout(watch, 400); return; }
      if (!waiting && body.childElementCount > 0) { setTimeout(hide, 160); return; }
      setTimeout(watch, 250);
    }
    setTimeout(watch, 160);
    setTimeout(hide, 18000);
  }
  function hookOpenApp() {
    if (typeof window.openApp !== 'function' || window.openApp.__driftUse) return;
    var orig = window.openApp;
    function wrapped(app) {
      try {
        var name = (window.APPS && window.APPS[app]) || app;
        var t0 = Date.now();
        var who = 'guest';
        try { who = (window.S && window.S.user) || 'guest'; } catch (e0) {}
        setTimeout(function () {
          fetch('/api/use', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ app: String(name).slice(0, 48), user: String(who).slice(0, 40), ms: Date.now() - t0 }) }).catch(function () {});
        }, 400);
      } catch (e) {}
      function launch() {
        var opened = orig(app);
        try { armAppLoader(app); } catch (e2) {}
        return opened;
      }
      var block = false;
      try { block = localStorage.getItem('wos:autoblock') === '1'; } catch (e3) {}
      if (!block || window.__driftScramReady) return launch();
      var note = document.createElement('div');
      note.textContent = 'Scramjet is still starting. The app will open when it is ready.';
      note.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483000;background:#1a73e8;color:#fff;padding:12px 14px;border-radius:12px;font:600 14px system-ui';
      document.body.appendChild(note);
      var ready = (typeof sjInit === 'function') ? sjInit() : Promise.resolve();
      Promise.resolve(ready).then(function () {
        window.__driftScramReady = true;
        if (note.parentNode) note.remove();
        launch();
      }).catch(function () {
        if (note.parentNode) note.textContent = 'Scramjet did not start, so this app stayed closed.';
        setTimeout(function () { if (note.parentNode) note.remove(); }, 2600);
      });
      return null;
    }
    wrapped.__driftUse = true;
    window.openApp = wrapped;
  }
  function hookLens() {
    if (window.__driftLens) return;
    window.__driftLens = true;
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-lens]');
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      openLensAsk();
    }, true);
  }
  function openInBrowser(url) {
    url = String(url || '');
    if (!/^https?:/i.test(url)) return;
    try { window.__driftBrowserOpen = [url]; } catch (e) {}
    if (typeof openApp === 'function') openApp('browser');
    setTimeout(function () {
      if (typeof window.driftBrowse === 'function') window.driftBrowse(url);
    }, 500);
  }
  function openQueuedBrowse() {
    var u = '';
    try { u = new URLSearchParams(location.search).get('browse') || ''; } catch (e) {}
    if (!u || !/^https?:/i.test(u)) return;
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    openInBrowser(u);
  }
  function boot() {
    window.driftPaint = driftPaint;
    applyBrandLogos();
    try { applyHomeLogo(localStorage.getItem('wos:home-btn') || 'drift'); } catch (e) { applyHomeLogo('drift'); }
    injectXkiroModels();
    wireGames();
    wireLoginApps();
    try { openQueuedBrowse(); } catch (e) {}
    installLiquidGlass();
    installAppGlass();
    try { installLowDetail(); } catch (e) {}
    try { installLensOrb(); } catch (e) {}
    speedDesk();
    styleCavemanAsSwitch();
    bindCustomKeybinds();
    installCustomAppContextMenu();
    try { applySize(); } catch (e) {}
    try {
      if (localStorage.getItem('wos:edu-mode') === '1') setEducationMode(true);
      applySavedAdapts(true);
      if (localStorage.getItem('wos:no-dev') === '1') setNoDev(true);
    } catch (e) {}
    try { installOrb(); } catch (e) {}
    try { installSettingsButton(); } catch (e) {}
    try { installProtector(); } catch (e) {}
    try { hookOpenApp(); } catch (e) {}
    try { hookLens(); } catch (e) {}
    if (typeof installChromeUI === 'function') try { installChromeUI(); } catch (e) {}
    setTimeout(function () {
      applyBrandLogos();
      try { applyHomeLogo(localStorage.getItem('wos:home-btn') || 'drift'); } catch (e) {}
      try { if (typeof rend === 'function') rend(); } catch (e) {}
      injectXkiroModels();
      wireGames();
      wireLoginApps();
      installSettingsButton();
      installLiquidGlass();
      installAppGlass();
      try { installLowDetail(); } catch (e) {}
      try { installLensOrb(); } catch (e) {}
      try { applySize(); } catch (e) {}
      try { applySavedAdapts(true); } catch (e) {}
      try { hookOpenApp(); } catch (e) {}
    }, 500);
    setTimeout(function () {
      wireGames(); wireLoginApps(); installSettingsButton(); injectXkiroModels();
      try { applySize(); } catch (e) {}
      try { applySavedAdapts(true); } catch (e) {}
    }, 1500);
    setTimeout(function () {
      try { applySize(); } catch (e) {}
      try { applySavedAdapts(true); } catch (e) {}
    }, 3000);
  }


  function installBgClock(on) {
    var el = document.getElementById('drift-bg-clock');
    if (!on) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement('div');
      el.id = 'drift-bg-clock';
      el.style.cssText = 'position:fixed;left:50%;top:22%;transform:translate(-50%,-50%);z-index:2;pointer-events:none;user-select:none;margin:0;padding:0;border:0;background:linear-gradient(180deg,rgba(255,255,255,.96) 0%,rgba(255,255,255,.7) 42%,rgba(255,255,255,.34) 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;font:700 108px/0.9 system-ui,-apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:-4px;filter:drop-shadow(0 1px 0 rgba(255,255,255,.55)) drop-shadow(0 12px 24px rgba(0,0,0,.28))';
      document.body.appendChild(el);
    }
    function tick() {
      if (!document.getElementById('drift-bg-clock')) return;
      var d = new Date();
      var next = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (el.textContent !== next) {
        el.textContent = next;
        if (typeof layout === 'function') layout();
      }
      setTimeout(tick, 1000);
    }
    el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (typeof layout === 'function') layout();
    tick();
  }

  function installMacosDesks() {
    if (window.__driftMacosDesks) return;
    window.__driftMacosDesks = true;
    var desk = document.getElementById('desk');
    if (!desk) return;
    var icons = desk.querySelector('.icons');
    if (!icons) return;
    var wrap = document.getElementById('drift-pages');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'drift-pages';
      wrap.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden';
      icons.parentNode.insertBefore(wrap, icons);
      wrap.appendChild(icons);
    }
    icons.style.transition = 'transform .35s cubic-bezier(.2,.8,.2,1)';
    icons.style.width = '100%';
    var page = 0;
    var dots = document.getElementById('drift-page-dots');
    if (!dots) {
      dots = document.createElement('div');
      dots.id = 'drift-page-dots';
      dots.style.cssText = 'position:absolute;bottom:calc(var(--tbh,76px) + 10px);left:0;right:0;display:flex;justify-content:center;gap:7px;z-index:6;pointer-events:auto;';
      desk.appendChild(dots);
    }
    function paint() {
      dots.innerHTML = '';
      for (var i = 0; i < 3; i++) {
        var d = document.createElement('span');
        d.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + (i === page ? '#fff' : 'rgba(255,255,255,.4)') + ';cursor:pointer';
        d.dataset.page = i;
        d.onclick = (function (idx) { return function () { go(idx); }; })(i);
        dots.appendChild(d);
      }
    }
    function go(p) {
      page = Math.max(0, Math.min(2, p));
      icons.style.transform = 'translateX(' + (-page * 100) + '%)';
      paint();
    }
    paint();
    var track = null;
    var edgeAt = 0;
    wrap.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.ico, .win, button, a, input, textarea')) { track = null; return; }
      track = { x: e.clientX, y: e.clientY, id: e.pointerId };
    });
    document.addEventListener('pointermove', function (e) {
      if (!document.body.classList.contains('drift-macos-desk')) return;
      var ico = e.target && e.target.closest ? e.target.closest('.ico') : null;
      if (!ico || !(e.buttons & 1)) { edgeAt = 0; return; }
      if (e.clientX > window.innerWidth - 28 && page < 2) {
        if (!edgeAt) edgeAt = Date.now();
        if (Date.now() - edgeAt > 280) { go(page + 1); edgeAt = Date.now(); }
      } else if (e.clientX < 28 && page > 0) {
        if (!edgeAt) edgeAt = Date.now();
        if (Date.now() - edgeAt > 280) { go(page - 1); edgeAt = Date.now(); }
      } else edgeAt = 0;
    });
    wrap.addEventListener('pointerup', function (e) {
      if (!track || track.id !== e.pointerId) { track = null; return; }
      var dx = e.clientX - track.x;
      var dy = e.clientY - track.y;
      track = null;
      if (Math.abs(dx) < 110 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      go(page + (dx < 0 ? 1 : -1));
    });
    var jiggling = false;
    function setJiggle(on) {
      jiggling = on;
      icons.classList.toggle('jiggle', on);
    }
    icons.addEventListener('pointerdown', function (e) {
      var ico = e.target.closest('.ico');
      if (!ico) return;
      var t = setTimeout(function () { setJiggle(true); }, 550);
      function clear() { clearTimeout(t); icons.removeEventListener('pointerup', clear); icons.removeEventListener('pointercancel', clear); }
      icons.addEventListener('pointerup', clear);
      icons.addEventListener('pointercancel', clear);
    });
    document.addEventListener('pointerdown', function (e) {
      if (jiggling && !e.target.closest('.ico')) setJiggle(false);
    });
  }

  function installVersionBadge() {
    var v = document.getElementById('drift-version');
    if (v) v.remove();
  }

  var DS_WHALE = '<svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><path fill="#4D6BFE" d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"></path></svg>';
  function thinkLiveMarkup(style) {
    if (style === 'claude') return '<img alt="" src="/think-claude.gif">';
    if (style === 'grok') return '<img alt="" src="/think-grok.png">';
    if (style === 'chatgpt') return '<span class="gpt-orb"><i class="glow"></i><i class="ring"></i><i class="core"></i></span>';
    if (style === 'deepseek') return '<span class="ds-logo">' + DS_WHALE + '</span>';
    if (style === 'gemini') return '<span class="gem-dots"><i></i><i></i><i></i></span>';
    return '';
  }
  function syncThinkLive() {
    var live = document.querySelector('.think-panel.live');
    var box = document.getElementById('drift-think-live');
    var style = (document.body.dataset.thinkStyle || 'default');
    var html = thinkLiveMarkup(style);
    if (!live || !html) {
      if (box) box.remove();
      return;
    }
    if (!box) {
      box = document.createElement('div');
      box.id = 'drift-think-live';
    }
    var want = 'drift-think-live style-' + style;
    if (box.className !== want) {
      box.className = want;
      box.innerHTML = html;
    }
    if (box.parentNode !== live.parentNode || box.nextSibling !== live) live.parentNode.insertBefore(box, live);
  }
  window.__driftSyncThink = syncThinkLive;
  function installThinkStyles() {
    if (document.getElementById('drift-think-styles')) return;
    var st = document.createElement('style');
    st.id = 'drift-think-styles';
    st.textContent = `
      body.drift-hub .icons { display:none !important; }
      body.drift-hub #task { display:none !important; }
      #task .tb, #task #clock, .icons .ico { color:#fff; }
      body.drift-round-tb #task { width: max-content; max-width: calc(100% - 16px); left: 50%; right: auto; transform: translateX(-50%); bottom: 8px; border-radius: 22px !important; padding: 0 14px; overflow: hidden; backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px); }
      #drift-settings-win button[style*="1a73e8"], #drift-settings-win a[style*="1a73e8"] { background: #c5c8ce !important; color: #1c1e22 !important; }
      #task { padding-right: 248px !important; box-sizing: border-box !important; }
      #pins { margin-left: auto; min-width: 0; max-width: calc(100% - 64px); display: flex; overflow-x: auto; scrollbar-width: none; }
      #pins::-webkit-scrollbar { display: none; }
      #drift-join { position: absolute; right: 128px; top: 50%; transform: translateY(-50%); z-index: 6; border: 0; border-radius: 999px; background: #e8e8e8; color: #111; font: 650 12px system-ui; padding: 6px 10px; cursor: pointer; white-space: nowrap; }
      body.drift-login #task,
      body.drift-login .icons,
      body.drift-login #menu,
      body.drift-login .win,
      body.drift-login #drift-snow,
      body.drift-login #drift-orb,
      body.drift-login #drift-orb-panel,
      body.drift-login #drift-lens-orb,
      body.drift-login #drift-support,
      body.drift-login #drift-bg-clock,
      body.drift-login #drift-page-dots,
      body.drift-login #drift-settings-btn,
      body.drift-login #drift-hub-side,
      body.drift-login #drift-hub-stage,
      body.drift-login #drift-join { display: none !important; }
      body.drift-login { background: #000 !important; }
      #drift-settings-win nav button { min-height: 40px; font-weight: 650; }
      #drift-settings-win #drift-set-main section > div { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
      #drift-settings-win input, #drift-settings-win select, #drift-settings-win textarea { max-width: 100%; box-sizing: border-box; }
      #drift-settings-win .bm-card { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 12px; margin: 8px 0; border: 1px solid rgba(255,255,255,.1); border-radius: 14px; background: rgba(255,255,255,.04); }
      body.drift-hub #drift-hub-side { background: rgba(255,255,255,.16) !important; color: #111; backdrop-filter: blur(22px) saturate(1.4); -webkit-backdrop-filter: blur(22px) saturate(1.4); border-right: 1px solid rgba(255,255,255,.28) !important; }
      body.drift-hub #drift-hub-side .hub-sec { background: rgba(255,255,255,.28); border: 1px solid rgba(255,255,255,.35); border-radius: 14px; justify-content: space-between; color: #111; font-weight: 600; }
      body.drift-hub #drift-hub-side .hub-sec i { order: 2; margin-left: auto; }
      body.drift-hub #drift-hub-side .hub-name { order: 1; }
      body.drift-macos-desk #task { border-radius: 24px 24px 0 0 !important; overflow: hidden; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
      .icons.jiggle .ico { animation: drift-jiggle .28s infinite alternate; }
      @keyframes drift-jiggle { from { transform: rotate(-2.5deg); } to { transform: rotate(2.5deg); } }
      #drift-bg-clock { animation: drift-clock-fade .4s ease; }
      @keyframes drift-clock-fade { from { opacity:0 } to { opacity:1 } }
      .drift-think-live{display:flex;align-items:center;justify-content:flex-start;margin:2px 0 2px;min-height:24px;pointer-events:none}
      .drift-think-live img{width:24px;height:24px;object-fit:contain;background:transparent}
      .drift-think-live.style-claude img{width:24px;height:24px;mix-blend-mode:multiply}
      .drift-think-live.style-grok img{width:24px;height:24px;border-radius:50%;object-fit:cover;background:#05070c;animation:grok-idle 1.7s ease-in-out infinite}
      .gpt-orb{width:24px;height:24px;position:relative;display:block}
      .gpt-orb i{position:absolute;display:block;border-radius:50%}
      .gpt-orb .glow{inset:-4px;background:radial-gradient(circle,rgba(96,165,250,.72),rgba(37,99,235,.18) 46%,transparent 70%);filter:blur(1px);animation:gpt-pulse 1.5s ease-in-out infinite}
      .gpt-orb .ring{inset:0;background:radial-gradient(circle at 36% 30%,#fff 0 8%,#dbeafe 14%,#60a5fa 28%,#2563eb 52%,#1e3a8a 70%,#93c5fd 86%,#1d4ed8 100%);box-shadow:0 0 8px #3b82f6,inset 0 0 6px rgba(255,255,255,.65);animation:gpt-spin 2.6s linear infinite}
      .gpt-orb .core{left:6px;top:4px;width:8px;height:6px;background:radial-gradient(circle,#fff 0%,rgba(255,255,255,.15) 72%,transparent 76%);filter:blur(.3px);animation:gpt-pulse 1.15s ease-in-out infinite}
      .ds-logo{width:24px;height:24px;display:grid;place-items:center;animation:ds-swim 1.5s ease-in-out infinite;filter:drop-shadow(0 0 4px rgba(77,107,254,.65))}
      .ds-logo svg{width:22px;height:22px}
      .gem-dots{display:flex;gap:4px;align-items:flex-end;height:16px;padding:0 2px 2px}
      .gem-dots i{width:6px;height:6px;border-radius:50%;display:block;animation:gem-b .9s ease-in-out infinite}
      .gem-dots i:nth-child(1){background:#4285F4}
      .gem-dots i:nth-child(2){background:#EA4335;animation-delay:.15s}
      .gem-dots i:nth-child(3){background:#FBBC05;animation-delay:.3s}
      @keyframes grok-idle{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-6px) rotate(4deg)}}
      @keyframes gpt-spin{to{transform:rotate(360deg)}}
      @keyframes gpt-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.62;transform:scale(.9)}}
      @keyframes ds-swim{0%,100%{transform:translate(0,1px) rotate(-8deg)}50%{transform:translate(4px,-6px) rotate(6deg)}}
      @keyframes gem-b{0%,70%,100%{transform:translateY(0) scale(.85);opacity:.55}35%{transform:translateY(-10px) scale(1.15);opacity:1}}
    `;
    document.head.appendChild(st);
    try { document.body.dataset.thinkStyle = localStorage.getItem('wos:think-style') || 'default'; } catch (e) {}
    try { if (localStorage.getItem('wos:hub') === '1') document.body.classList.add('drift-hub'); } catch (e) {}
    try { if (localStorage.getItem('wos:bg-clock') === '1') { document.body.classList.add('drift-bg-clock'); installBgClock(true); } } catch (e) {}
    try { if (localStorage.getItem('wos:macos-desk') === '1') { document.body.classList.add('drift-macos-desk'); setTimeout(installMacosDesks, 600); } } catch (e) {}
    try { if (localStorage.getItem('wos:round-tb') === '1') document.body.classList.add('drift-round-tb'); } catch (e) {}
    if (!window.__driftThinkObs) {
      window.__driftThinkObs = new MutationObserver(function () { syncThinkLive(); });
      window.__driftThinkObs.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    }
    syncThinkLive();
  }

  window.openSettingsPanel = openSettingsPanel;
  function installTour() {
    var cur = '';
    try { cur = localStorage.getItem('wos:cur') || ''; } catch (e) {}
    var hasAccount = !!(cur && cur !== 'null' && cur !== '""');
    try { if (localStorage.getItem('wos:tour-en') === '1') return; } catch (e2) {}
    var steps = [
      { sel: '.icons', t: 'Desktop', d: 'Apps live on the desktop. Drag one to move it. Open it with a click.' },
      { sel: '#task', t: 'Taskbar', d: 'Pinned apps sit here, close to the account button and the clock, with a small gap so they do not cover each other.' },
      { sel: '#start', t: 'Start', d: 'Opens the full app list.' },
      { sel: '#clock', t: 'Clock', d: 'Time and date. The account button stays just to its left.' },
      { sel: '#drift-settings-win', nav: 'ui', t: 'Settings · UI', d: 'Home button, app size, taskbar size, liquid glass, snow, hub, background clock, macOS desktops, and the rounded taskbar.' },
      { sel: '#drift-settings-win [data-sec="os"]', nav: 'os', t: 'Settings · OS Adapts', d: 'Fits Drift to ChromeOS, iPad, macOS, Windows, or Linux. Dynamic OS, in UI, is what unlocks these.' },
      { sel: '#drift-settings-win [data-sec="apps"]', nav: 'apps', t: 'Settings · Apps', d: 'Choose the games library and the movie provider. Drift Movies is that provider. Racial stays the in-app catalog.' },
      { sel: '#drift-settings-win [data-sec="tools"]', nav: 'tools', t: 'Settings · Tools', d: 'AI assistant is the Drift ball. Reasoning, Support Drift, and the switches that remove dev apps stay off until you turn them on.' },
      { sel: '#drift-settings-win [data-sec="bypass"]', nav: 'bypass', t: 'Settings · Bypass', d: 'Keybinds, education mode, clean history, Protector, Lens, and the bookmarklets. The bypass bar uses these same controls.' }
    ];
    var i = 0;
    var veil = document.createElement('div');
    veil.id = 'drift-tour';
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483645;background:transparent';
    var hole = document.createElement('div');
    hole.style.cssText = 'position:fixed;border:2px solid #fff;border-radius:16px;box-shadow:0 0 0 9999px rgba(0,0,0,.62);pointer-events:none;z-index:2147483645';
    var card = document.createElement('div');
    card.style.cssText = 'position:fixed;z-index:2147483647;width:min(380px,92vw);background:rgba(255,255,255,.16);color:#111;border:1px solid rgba(255,255,255,.45);border-radius:18px;padding:16px;font:15px/1.45 system-ui;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 12px 40px rgba(0,0,0,.28)';
    veil.append(hole, card);
    function target(sel) {
      try { return document.querySelector(sel); } catch (e) { return null; }
    }
    function place(el) {
      var r = el ? el.getBoundingClientRect() : { left: 24, top: 24, width: 80, height: 40, bottom: 64, right: 104 };
      if (!el || r.width < 2) r = { left: 24, top: 24, width: Math.min(280, innerWidth - 48), height: 48, bottom: 72, right: 304 };
      hole.style.left = Math.max(4, r.left - 6) + 'px';
      hole.style.top = Math.max(4, r.top - 6) + 'px';
      hole.style.width = Math.max(28, r.width + 12) + 'px';
      hole.style.height = Math.max(28, r.height + 12) + 'px';
      var below = r.bottom + 16;
      if (below + 180 > innerHeight) below = Math.max(12, r.top - 190);
      card.style.top = below + 'px';
      card.style.left = Math.max(12, Math.min(r.left, innerWidth - 392)) + 'px';
    }
    function paint() {
      var s = steps[i];
      if (s.nav) {
        var panel = document.getElementById('drift-settings-win');
        if (!panel && typeof openSettingsPanel === 'function') openSettingsPanel();
        panel = document.getElementById('drift-settings-win');
        if (panel) {
          var nav = panel.querySelector('[data-nav="' + s.nav + '"]');
          if (nav) nav.click();
        }
      }
      var el = target(s.sel);
      place(el);
      card.innerHTML = '<div style="opacity:.65;font-size:12px">' + (i + 1) + ' / ' + steps.length + '</div><b style="display:block;font-size:18px;margin:4px 0 6px">' + s.t + '</b><p style="margin:0 0 12px">' + s.d + '</p><div style="display:flex;justify-content:space-between"><button type="button" data-skip style="border:0;background:transparent;color:#333;cursor:pointer">Skip tour</button><button type="button" data-next style="border:0;border-radius:999px;background:#e8e8e8;color:#111;padding:8px 14px;font-weight:700;cursor:pointer">' + (i === steps.length - 1 ? 'Done' : 'Next') + '</button></div>';
      card.querySelector('[data-skip]').onclick = done;
      card.querySelector('[data-next]').onclick = function () {
        if (i < steps.length - 1) { i++; paint(); }
        else done();
      };
    }
    function done() {
      try { localStorage.setItem('wos:tour-en', '1'); localStorage.setItem('wos:toured', '1'); } catch (e3) {}
      veil.remove();
      var panel = document.getElementById('drift-settings-win');
      if (panel) panel.remove();
      if (!hasAccount && typeof authUI === 'function') {
        authUI('up');
        document.body.classList.add('drift-login');
      }
    }
    paint();
    document.body.appendChild(veil);
  }
  function installAccountGate() {
    function hasAccount() {
      try {
        if (window.S && window.S.user) return true;
        var raw = '';
        try { raw = localStorage.getItem('wos:cur') || ''; } catch (e1) { raw = ''; }
        if (!raw) { try { raw = sessionStorage.getItem('wos:cur') || ''; } catch (e2) { raw = ''; } }
        if (!raw || raw === 'null' || raw === '""') return false;
        var name = JSON.parse(raw);
        var usersRaw = '{}';
        try { usersRaw = localStorage.getItem('wos:users') || sessionStorage.getItem('wos:users') || '{}'; } catch (e3) {
          try { usersRaw = sessionStorage.getItem('wos:users') || '{}'; } catch (e4) { usersRaw = '{}'; }
        }
        var users = JSON.parse(usersRaw || '{}');
        return !!(name && users && users[name]);
      } catch (e) { return !!(window.S && window.S.user); }
    }
    var btn = document.getElementById('drift-join');
    if (hasAccount()) {
      if (btn) btn.remove();
      document.body.classList.remove('drift-login');
      return;
    }
    if (document.querySelector('.auth') && !document.getElementById('drift-tour')) document.body.classList.add('drift-login');
    if (!document.querySelector('.auth') && !document.getElementById('drift-tour') && typeof authUI === 'function') authUI('up');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'drift-join';
      btn.type = 'button';
      btn.textContent = 'Crear cuenta';
      btn.onclick = function () { if (typeof authUI === 'function' && !document.querySelector('.auth')) authUI('up'); };
      var task = document.getElementById('task');
      if (task) task.appendChild(btn);
    }
  }
  onReady(function () { try { if (typeof sjInit === 'function') sjInit(); } catch (e) {} boot(); setTimeout(installThinkStyles, 400); setTimeout(installVersionBadge, 500); setTimeout(installGoogleApps, 700); setTimeout(installSupport, 800); setTimeout(installTour, 900); setTimeout(installAccountGate, 1100); setInterval(installAccountGate, 4000); });
  console.log('[Drift] fixup loaded');
})();

  var hubStyle = document.createElement('style');
  hubStyle.id = 'drift-hub-css';
  hubStyle.textContent = '#drift-hub-side{position:fixed;left:0;top:0;bottom:0;width:220px;background:#f4f4f6;color:#111;display:none;flex-direction:column;z-index:20;padding:12px 10px;gap:8px;overflow:hidden;border-right:1px solid rgba(0,0,0,.08)}#drift-hub-side.collapsed{width:0;padding:0;border:0;overflow:visible}#drift-hub-side.collapsed>*{display:none!important}#drift-hub-side.collapsed .hub-toggle{display:flex!important;position:fixed;left:10px;top:10px;z-index:30}#drift-hub-side .hub-search{width:100%;height:36px;border-radius:18px;border:1px solid rgba(0,0,0,.08);padding:0 12px;background:#fff;color:#111;box-sizing:border-box}#drift-hub-side .hub-sections{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:4px;scrollbar-width:none;-ms-overflow-style:none}#drift-hub-side .hub-sections::-webkit-scrollbar{display:none;width:0;height:0}#drift-hub-side .hub-sec{display:flex;align-items:center;gap:8px;background:transparent;border:none;color:#111;padding:8px;border-radius:8px;text-align:left;cursor:pointer;font:600 13px system-ui}#drift-hub-side .hub-sec i{width:22px;height:22px;display:inline-flex;flex:none}#drift-hub-side .hub-sec i img,#drift-hub-side .hub-sec i svg{width:22px;height:22px}#drift-hub-side .hub-settings,#drift-hub-side .hub-toggle,#drift-hub-side .hub-home{background:#fff;border:1px solid rgba(0,0,0,.08);color:#111;padding:8px;border-radius:8px;cursor:pointer}#drift-hub-stage{position:fixed;left:220px;top:0;right:0;bottom:0;background:#050505;z-index:15;display:none;overflow:hidden}body.drift-hub #task,body.drift-hub .icons,body.drift-hub #drift-settings-btn,body.drift-hub #drift-page-dots{display:none!important}body.drift-hub [data-desk-only]{display:none!important}#task .tb,#task #clock,.icons .ico{color:#fff}.hub-home{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:28px 18px 40px;background:#050505 url(/drift-mark.png) center 12%/160px no-repeat;color:#fff}.hub-word{font:800 76px/0.9 system-ui;letter-spacing:-2px;color:#fff;margin-top:28px}.hub-hi{opacity:.75;font:15px system-ui}.hub-web{width:min(560px,92%);height:52px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.1);color:#fff;padding:0 18px;font:16px system-ui;outline:none;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}body.drift-liquid .hub-web{background:rgba(255,255,255,.16)}.hub-tiles{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;max-width:780px;margin-top:8px}.hub-tile{width:108px;min-height:104px;border-radius:18px;border:1px solid rgba(0,0,0,.06);background:#f4f4f6;color:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;font:600 12px system-ui;padding:10px 6px}.hub-tile i{width:36px;height:36px;display:grid;place-items:center}.hub-tile i img,.hub-tile i svg{width:36px;height:36px}';
  if (!document.getElementById('drift-hub-css')) document.head.appendChild(hubStyle);

  function installHubMode() {
    if (window.__driftHubInstalled) return;
    window.__driftHubInstalled = true;
    var desk = document.getElementById('desk');
    if (!desk) return;
    var side = document.createElement('div');
    side.id = 'drift-hub-side';
    side.innerHTML = '<button type="button" class="hub-toggle">☰</button><input class="hub-search" placeholder="Search apps" /><div class="hub-sections"></div><button type="button" class="hub-home">Home</button><button type="button" class="hub-settings">Settings</button>';
    desk.appendChild(side);
    var stage = document.createElement('div');
    stage.id = 'drift-hub-stage';
    desk.appendChild(stage);
    var sections = side.querySelector('.hub-sections');
    var search = side.querySelector('.hub-search');
    function appIds() {
      var apps = window.DRIFT_APPS || Object.keys(window.XAPPS || {});
      if (!apps || !apps.length) apps = ['browser','ai','yt','movies','minecraft','discord','github','roblox'];
      return apps;
    }
    function listApps() {
      var q = (search.value || '').toLowerCase().trim();
      sections.innerHTML = '';
      appIds().forEach(function (id) {
        var name = (window.APPS && window.APPS[id]) || (window.XAPPS && window.XAPPS[id] && window.XAPPS[id].n) || id;
        if (q && String(name).toLowerCase().indexOf(q) < 0 && String(id).toLowerCase().indexOf(q) < 0) return;
        var ico = (window.IC && window.IC[id]) || '';
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'hub-sec';
        b.innerHTML = '<span class="hub-name">' + name + '</span><i>' + ico + '</i>';
        b.onclick = function () { openSection(id); };
        sections.appendChild(b);
      });
    }
    function paintHome() {
      stage.innerHTML = '';
      stage.style.display = 'block';
      var home = document.createElement('div');
      home.className = 'hub-home';
      home.innerHTML = '<div class="hub-word">Drift</div><div class="hub-hi">Welcome To drift</div><input class="hub-web" placeholder="Search the web…" /><div class="hub-tiles"></div>';
      stage.appendChild(home);
      var tiles = home.querySelector('.hub-tiles');
      appIds().slice(0, 8).forEach(function (id) {
        var name = (window.APPS && window.APPS[id]) || id;
        var ico = (window.IC && window.IC[id]) || '';
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'hub-tile';
        b.innerHTML = '<i>' + ico + '</i><span>' + name + '</span>';
        b.onclick = function () { openSection(id); };
        tiles.appendChild(b);
      });
      var web = home.querySelector('.hub-web');
      web.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var q = web.value.trim();
        openSection('browser');
        if (!q) return;
        setTimeout(function () {
          var fr = stage.querySelector('iframe');
          if (fr) fr.src = '/go?u=' + encodeURIComponent('https://duckduckgo.com/?kl=mx-es&ia=web&q=' + encodeURIComponent(q));
        }, 300);
      });
    }
    function openSection(id) {
      stage.innerHTML = '';
      stage.style.display = 'block';
      var root = document.createElement('div');
      root.style.cssText = 'height:100%;width:100%;position:relative;overflow:hidden;background:#000';
      stage.appendChild(root);
      var fn = (window.XAPPS && window.XAPPS[id] && window.XAPPS[id].f) || null;
      if (typeof fn === 'function') fn(root);
      else if (id === 'browser' && typeof window.openProxied === 'function') window.openProxied('https://duckduckgo.com/?kl=mx-es&ia=web', root);
    }
    search.addEventListener('input', listApps);
    search.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var first = sections.querySelector('.hub-sec');
      if (first) first.click();
    });
    side.querySelector('.hub-home').onclick = paintHome;
    side.querySelector('.hub-settings').onclick = function () {
      if (typeof window.openSettingsPanel === 'function') window.openSettingsPanel();
      else if (typeof openSettingsPanel === 'function') openSettingsPanel();
    };
    side.querySelector('.hub-toggle').onclick = function () {
      side.classList.toggle('collapsed');
      stage.style.left = side.classList.contains('collapsed') ? '0' : '220px';
    };
    function apply() {
      var on = document.body.classList.contains('drift-hub');
      side.style.display = on ? 'flex' : 'none';
      if (!on) stage.style.display = 'none';
      else if (!stage.childNodes.length) paintHome();
      else stage.style.display = 'block';
      var task = document.getElementById('task');
      if (task) task.style.display = on ? 'none' : '';
      var icons = desk.querySelector('.icons');
      if (icons) icons.style.display = on ? 'none' : '';
      document.querySelectorAll('[data-desk-only]').forEach(function (el) { el.style.display = on ? 'none' : ''; });
      if (on) listApps();
    }
    new MutationObserver(apply).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    apply();
  }
  try { if (localStorage.getItem('wos:hub') === '1') document.body.classList.add('drift-hub'); } catch (e) {}
  setTimeout(installHubMode, 800);
