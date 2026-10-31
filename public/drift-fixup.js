/* Drift fixup */
(function () {
  'use strict';
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
    // Load Peak's real Movies & Shows page through Drift's existing Scramjet proxy.
    var homeUrl = 'https://racialequityleadership.com/movies.html';
    var home = new URL(homeUrl);

    root.innerHTML = '';
    root.style.cssText = 'height:100%;min-height:0;position:relative;background:#000';

    if (typeof window.openProxied !== 'function') {
      root.textContent = 'Scramjet no está listo. Recarga Drift.';
      return;
    }

    function attachPeakCleaners(opened) {
      // openProxied owns iframe creation; do not append/create a second frame.
      var frame = (opened && opened.frame) || root.querySelector('iframe');
      if (!frame) return;

      function cleanPeak() {
        var win, doc;
        try {
          win = frame.contentWindow;
          doc = frame.contentDocument || (win && win.document);
          if (!win || !doc || !doc.documentElement) return;
        } catch (e) {
          return;
        }

        // Keep the real Peak catalogue and player; hide only sidebar and known ad slots.
        if (!doc.getElementById('drift-peak-clean-style')) {
          var style = doc.createElement('style');
          style.id = 'drift-peak-clean-style';
          style.textContent = [
            '#sidebar, #side-bar, .sidebar, .side-bar, [data-sidebar],',
            '[role="complementary"], [aria-label*="sidebar" i],',
            '[class*="sidebar" i], [id*="sidebar" i],',
            '[class*="side-bar" i], [id*="side-bar" i] {',
            '  display:none !important; visibility:hidden !important;',
            '  pointer-events:none !important;',
            '}',
            'main, [role="main"], [class*="main-content" i], [id*="main-content" i] {',
            '  max-width:none !important; width:100% !important;',
            '  margin-left:0 !important;',
            '}',
            '[id*="ad-container" i], [class*="ad-container" i],',
            '[id*="ad-slot" i], [class*="ad-slot" i],',
            '[id*="ad-banner" i], [class*="ad-banner" i],',
            '[id*="advert" i], [class*="advert" i],',
            '[id*="sponsor" i], [class*="sponsor" i],',
            '[id*="popunder" i], [class*="popunder" i],',
            '[data-ad], [data-ad-slot], [data-ad-client], ins.adsbygoogle,',
            'iframe[src*="doubleclick.net" i],',
            'iframe[src*="googlesyndication.com" i],',
            'iframe[src*="googleadservices.com" i],',
            'iframe[src*="popads.net" i], iframe[src*="popcash.net" i],',
            'iframe[src*="propellerads.com" i], iframe[src*="adsterra.com" i],',
            'iframe[src*="exoclick.com" i], iframe[src*="taboola.com" i],',
            'iframe[src*="outbrain.com" i], iframe[src*="mgid.com" i] {',
            '  display:none !important; visibility:hidden !important;',
            '  pointer-events:none !important;',
            '}'
          ].join('\n');
          (doc.head || doc.documentElement).appendChild(style);
        }

        // Attach once. Do not intercept fetch, delete DOM nodes, or block window.open:
        // those behaviors can break Peak's dynamic listings and movie/episode players.
        if (doc.documentElement.hasAttribute('data-drift-peak-nav')) return;
        doc.documentElement.setAttribute('data-drift-peak-nav', '1');

        function sendToMoviesHome() {
          try {
            win.location.href = homeUrl;
          } catch (e) {
            try { frame.src = homeUrl; } catch (_) {}
          }
        }

        function redirectIfPeakRoot() {
          try {
            var current = new win.URL(win.location.href);
            if (current.origin === home.origin &&
                (current.pathname === '/' || current.pathname === '/index.html')) {
              win.location.replace(homeUrl);
            }
          } catch (e) {}
        }

        doc.addEventListener('click', function (event) {
          var element = event.target && event.target.closest
            ? event.target.closest('button, [role="button"], a[href], [aria-label], [title]')
            : null;

          if (element) {
            var labels = [
              element.getAttribute('aria-label') || '',
              element.getAttribute('title') || '',
              element.textContent || ''
            ].map(function (value) {
              return String(value).replace(/\s+/g, ' ').trim();
            });

            var marker = [
              element.id || '',
              typeof element.className === 'string' ? element.className : ''
            ].join(' ');

            // Match an actual Back/Return control without touching play or episode controls.
            var isBackControl = labels.some(function (label) {
              return /^(?:←\s*)?(?:back|go back|return|back to movies|back to home|back to catalogue|back to catalog|movies home|volver|regresar|atrás|atras)(?:\s*→)?$/i.test(label);
            }) || /(?:^|[\s_-])(?:back|go-back|back-button|back-btn|return-button|back-home)(?:$|[\s_-])/i.test(marker);

            if (isBackControl) {
              event.preventDefault();
              event.stopImmediatePropagation();
              sendToMoviesHome();
              return;
            }
          }

          // If Peak's logo/home link goes to its landing page, keep the user in Movies.
          // Do not block movie-detail routes, episode routes, player iframes, or other media links.
          var link = event.target && event.target.closest
            ? event.target.closest('a[href]')
            : null;
          if (link) {
            try {
              var destination = new win.URL(link.href, win.location.href);
              if (destination.origin === home.origin &&
                  (destination.pathname === '/' || destination.pathname === '/index.html')) {
                event.preventDefault();
                event.stopImmediatePropagation();
                sendToMoviesHome();
              }
            } catch (e) {}
          }
        }, true);

        win.addEventListener('popstate', redirectIfPeakRoot);
        redirectIfPeakRoot();
      }

      frame.addEventListener('load', function () {
        setTimeout(cleanPeak, 100);
        setTimeout(cleanPeak, 500);
      });

      // Apply once after open, plus a short retry in case Peak's document is still parsing.
      setTimeout(cleanPeak, 150);
      setTimeout(cleanPeak, 700);
    }

    // Use the same existing Scramjet loader as Drift's other proxied apps.
    // This directly starts at movies.html each time Movies is opened.
    try {
      Promise.resolve(window.openProxied(homeUrl, root))
        .then(attachPeakCleaners)
        .catch(function (error) {
          console.error('Peak Movies:', error);
        });
    } catch (error) {
      console.error('Peak Movies:', error);
    }
  }

function driftSite(url) {
    return function (root) {
      root.innerHTML = '';
      root.style.cssText = 'height:100%;min-height:0;position:relative;background:#000';
      if (typeof window.openProxied === 'function') window.openProxied(url, root);
      else root.textContent = 'Scramjet is not ready.';
    };
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
      var path = type === 'tv' ? '/tv/' + item.id + (episode ? '/season/' + season + '/episode/' + episode : '') + '/videos' : '/movie/' + item.id + '/videos';
      tmdbGet(path).then(function (j) {
        var vids = (j && j.results) || [];
        var yt = vids.filter(function (v) { return v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Clip'); })[0] || vids.filter(function (v) { return v.site === 'YouTube'; })[0];
        var slot = view.querySelector('[data-slot]');
        if (yt) slot.outerHTML = '<iframe credentialless allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt.key) + '?autoplay=1&rel=0"></iframe>';
        else slot.textContent = 'TMDB no tiene trailer de este título.';
      }).catch(function () { var slot = view.querySelector('[data-slot]'); if (slot) slot.textContent = 'No se pudo abrir el trailer.'; });
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
    bar.style.cssText = 'flex:none;display:flex;gap:6px;align-items:center;padding:6px 8px;background:#1a1a1f;overflow:auto;border-bottom:1px solid #2a2a32';
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
    window.XAPPS.aleks = { n: 'ALEKS', f: driftSite('https://www.aleks.com/') };
    window.XAPPS.winemu = { n: 'Windows emulator', f: windowsEmulator };
    window.XAPPS.gbuild = { n: 'Game Builder', f: driftSite('https://tesana.com/create') };
    window.XAPPS.espn = { n: 'ESPN', f: driftSite('https://www.espn.com/') };
    window.XAPPS.yt = { n: 'YouTube', f: driftSite('https://www.youtube.com/') };
    window.XAPPS.tt = { n: 'TikTok', f: typeof window.__driftTtFeed === 'function' ? window.__driftTtFeed : driftSite('https://www.tiktok.com/foryou') };
    window.XAPPS.gem = { n: 'Gemini', f: driftSite('https://gemini.google.com/app') };
    window.XAPPS.movies = {
      n: 'Movies',
      f: peakMoviesApp
    };
    window.XAPPS.whatsapp = { n: 'WhatsApp', f: function (root) {
      var browser = 'win';
      try { browser = robloxOs(); } catch (e) {}
      if (browser === 'ipad') browser = 'mac';
      operaPage('https://web.whatsapp.com/', browser)(root);
    } };
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
        ['qwen/qwen3-coder-plus:free', 'Drift Code', 'xKiro free · best code', 'default', 'Qwen3 Coder Plus, free on xKiro. Best free coding model. JS Injector uses this. Below Drift 2.1 for normal chat.', { code: 1, vision: 1, files: 0, think: 1, fast: 1 }],
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
    } catch (e) {}
  }


  function installAppGlass() {
    var on = false;
    try { on = localStorage.getItem('wos:liquid-apps') === '1'; } catch (e) {}
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
    try { on = localStorage.getItem('wos:liquid-glass') === '1'; } catch (e) {}
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
    try {
      if (/classroom\.google\.com/i.test(url) && typeof openApp === 'function') { openApp('classroom'); return; }
      if (/aleks\.com/i.test(url) && typeof openApp === 'function') { openApp('aleks'); return; }
      if (typeof openApp === 'function' && window.XAPPS && /^https?:/i.test(url)) {
        var id = /docs\.google\.com/i.test(url) ? 'docs' : (/discoveryeducation/i.test(url) ? 'discovery' : 'inpage');
        var label = id === 'docs' ? 'Docs' : (id === 'discovery' ? 'Discovery' : 'Page');
        if (window.APPS) window.APPS[id] = window.APPS[id] || label;
        window.XAPPS[id] = { n: label, f: operaPage(url, 'chrome') };
        openApp(id);
        return;
      }
    } catch (e) {}
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
  function setChromeOSAdapt(on) {
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
  function setIpadAdapt(on) {
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
    operaPage('https://www.roblox.com/login', robloxOs())(root);
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
  function operaPage(url, browser) {
    browser = browser || "edge";
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
        frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-pointer-lock");
        frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff";
        frame.src = "/api/opera?u=" + encodeURIComponent(url) + "&b=" + encodeURIComponent(browser);
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
      "/api/opera?u=" + encodeURIComponent("https://accounts.google.com/ServiceLogin?service=classroom&continue=" + encodeURIComponent("https://classroom.google.com/")) + "&b=chrome",
      "/api/opera?u=" + encodeURIComponent("https://classroom.google.com/u/0/") + "&b=opera"
    ];
    var i = 0;
    root.innerHTML = '<div class="sjt" style="height:100%;min-height:0;position:relative;background:#fff"></div>';
    var box = root.querySelector(".sjt");
    function direct() {
      box.innerHTML = "";
      var frame = document.createElement("iframe");
      frame.setAttribute("referrerpolicy", "no-referrer");
      frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff";
      frame.src = "https://classroom.google.com/";
      box.appendChild(frame);
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
        if (kind === "classroom") operaPage(loginUrl, "edge")(root);
        else if (loginInChrome) openInChrome(loginUrl)(root);
        else operaPage(loginUrl, "edge")(root);
      };
      root.querySelector('[data-oauth]').onclick = function () {
        if (kind === "classroom") classroomOauth(root);
        else if (oauthInChrome) openInChrome(url)(root);
        else operaPage(url, "edge")(root);
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
  function wireLoginApps() {
    try {
      if (!window.XAPPS) return;
      window.XAPPS.gmail = { n: 'Gmail', f: operaPage('https://mail.google.com/mail/u/0/h/', 'firefox') };
      window.XAPPS.classroom = { n: 'Classroom', f: operaPage('https://classroom.google.com/', 'chrome') };
      delete window.XAPPS.canva;
      if (window.APPS) delete window.APPS.canva;
      window.__driftRoblox = robloxShell;
      window.__driftGmail = operaPage('https://mail.google.com/mail/u/0/h/', 'firefox');
      window.XAPPS.roblox = { n: 'Roblox', f: robloxShell };
    } catch (e) {}
  }
  function protectorHit(why) {
    var on = false;
    try { on = localStorage.getItem('wos:protector') === '1'; } catch (e) {}
    if (!on) return;
    var now = Date.now();
    if (window.__driftProtAt && now - window.__driftProtAt < 2500) return;
    window.__driftProtAt = now;
    try { console.warn('[Drift Protector] live view', why); } catch (e) {}
    location.replace('https://classroom.google.com/');
  }
  function installProtector() {
    if (window.__driftProtHook) return;
    window.__driftProtHook = true;
    var strong = /StreamingClass|startStreamingClass|streaming[_ ]?(class|screen)|class started|clase iniciada|live view|teacher is viewing|viewing your screen|screen capture started|captureVisibleTab|screenshot|frame captured/i;
    var heartRe = /heartbeat sent/i;
    var hearts = [];
    function consider(text, why) {
      if (!text) return;
      if (strong.test(text)) protectorHit(why);
      else if (heartRe.test(text)) {
        var now = Date.now();
        hearts.push(now);
        hearts = hearts.filter(function (t) { return now - t < 20000; });
        if (hearts.length >= 2) protectorHit('heartbeat');
      }
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
            if (/classwize|linewize|goguardian|securly/i.test(u)) {
              ws.addEventListener('message', function (ev) {
                var text = '';
                try { text = typeof ev.data === 'string' ? ev.data : ''; } catch (e) {}
                consider(u + ' ' + text, 'websocket');
              });
            }
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
            if (/classwize|linewize/i.test(u) && /stream|screenshot|liveview|capture|frame|heartbeat/i.test(u)) consider(u, 'fetch');
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
          if (/classwize|linewize/i.test(n) && /stream|screenshot|liveview|livestream|capture|frames|streamingclass/i.test(n)) protectorHit('network');
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
      if (!/linewize|classwize|goguardian|securly|class started|clase iniciada|joined class|en clase|sesi[oó]n iniciada/i.test(blob)) return;
      if (window.__driftClassAt) return;
      window.__driftClassAt = Date.now();
      try { alert('Protector: se detectó que te uniste a una clase.'); } catch (err) {}
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
        if (!/linewize|classwize|goguardian|securly/i.test(blob + ' ' + text) && !/you are (now )?connected|conectado a|class session|en clase|joined class/i.test(text)) continue;
        window.__driftClassAt = Date.now();
        var msg = text.replace(/\s+/g, ' ').trim().slice(0, 140);
        try { alert('Protector: Linewize muestra una clase' + (msg ? ': ' + msg : '.')); } catch (err) {}
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
  function openSettingsPanel() {
    var old = document.getElementById('drift-settings-panel');
    if (old) { old.remove(); return; }
    var panel = document.createElement('div');
    panel.id = 'drift-settings-panel';
    panel.style.cssText =
      'position:fixed;right:16px;bottom:108px;z-index:2147483001;width:min(380px,94vw);max-height:min(70vh,520px);overflow:auto;scrollbar-width:none;-ms-overflow-style:none;' +
      'background:#1c1c24;color:#eee;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 16px;' +
      'box-shadow:0 12px 40px rgba(0,0,0,.45);font:13px/1.45 system-ui,sans-serif';
    var liquidOn = false, eduOn = false, gk = 'lazy', kbHide = 'F9', kbClass = 'F10', appSize = 'lg', tbSize = 'lg', orbOn = true, xmasOn = false;
    try {
      liquidOn = localStorage.getItem('wos:liquid-glass') === '1';
      eduOn = localStorage.getItem('wos:edu-mode') === '1';
      gk = localStorage.getItem('wos:gimkit-injector') || 'lazy';
      kbHide = localStorage.getItem('wos:kb-hide') || 'F9';
      kbClass = localStorage.getItem('wos:kb-class') || 'F10';
      appSize = localStorage.getItem('wos:size-apps') || 'lg';
      tbSize = localStorage.getItem('wos:size-tb') || 'lg';
      orbOn = localStorage.getItem('wos:ai-orb') === '1';
      xmasOn = localStorage.getItem('wos:xmas') === '1';
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
      '<div style="flex:1"><b>Christmas mode</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Slow snow you can push with the mouse. It rests on your windows and fades so it never piles up.</div></div>' +
      switchHTML('drift-xmas-sw', xmasOn) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Enable Liquid Glass (experimental)</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Make Drift OS look like an iOS device with the new liquid glass UI applied on the task bar.</div></div>' +
      switchHTML('drift-liquid-sw', liquidOn) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:16px">' +
      '<div style="flex:1"><b>Apply Liquid Glass to apps</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Makes the app windows transparent so the desktop shows through. Pages inside a site stay readable.</div></div>' +
      switchHTML('drift-app-glass-sw', localStorage.getItem('wos:liquid-apps') === '1') + '</div>' +
      '<div style="margin-bottom:14px"><b>Home button</b>' +
      '<div style="opacity:.75;font-size:12px;margin:4px 0 8px">MacOS logo, Windows logo, or Drift logo (default).</div>' +
      '<div id="drift-home-opts" style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="home-logo" value="mac"/> macOS</label>' +
      '<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="home-logo" value="win"/> Windows</label>' +
      '<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="home-logo" value="drift"/> Drift logo</label>' +
      '</div></div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Adapt Drift OS for ChromeOS</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">On ChromeOS the apps and the task bar are a little smaller. The task bar stays on screen. Windows keeps the size you picked.</div></div>' +
      switchHTML('drift-cros-sw', localStorage.getItem('wos:cros-adapt') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Adapt Drift for iPad</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Fits Drift on iPad 10 and iPad 11. Apps and the task bar stay on screen, with a little more room for touch. Windows size is unchanged.</div></div>' +
      switchHTML('drift-ipad-sw', localStorage.getItem('wos:ipad-adapt') === '1') + '</div>' +
      '<div style="margin-bottom:14px;border-top:1px solid rgba(255,255,255,.08);padding-top:12px"><b>Choose your Movies</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">TMDB shows posters, the description and the episodes. Noah is the catalog already in Drift. Racial opens racialequityleadership.com/movies.html.</div>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="movies-src" value="tmdb"/> TMDB</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="movies-src" value="noah"/> Noah</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="movies-src" value="racial"/> Racial</label></div>' +
      '<div style="margin-bottom:14px;border-top:1px solid rgba(255,255,255,.08);padding-top:12px"><b>Choose your Games</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Noah is the in-app catalog. Tesana, Poki and CrazyGames open in the app. Tesana has a Back button to leave a game.</div>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="games-lib" value="noah"/> Noah (recommended)</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="games-lib" value="tesana"/> Tesana</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="games-lib" value="poki"/> Poki</label>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer"><input type="radio" name="games-lib" value="crazygames"/> CrazyGames</label></div>' +
      '<div style="margin-bottom:14px;border-top:1px solid rgba(255,255,255,.08);padding-top:12px"><b>Customize Task Bar and Apps Size</b>' +
      '<div style="opacity:.75;font-size:12px;margin:4px 0 8px">Apps and the task bar are separate. Large is the normal Drift size.</div>' +
      '<div style="font-size:12px;font-weight:650;margin:6px 0">Apps</div>' + sizeRadios('size-apps', appSize) +
      '<div style="font-size:12px;font-weight:650;margin:8px 0 4px">Task bar</div>' + sizeRadios('size-tb', tbSize) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>AI assistant</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Off until you turn this on. Then the Drift ball appears. Drag it anywhere. Each reply has an X to dismiss it.</div></div>' +
      switchHTML('drift-orb-sw', orbOn) + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>NO dev apps</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">This deletes VS Code, JS Injector and GitHub.</div></div>' +
      switchHTML('drift-nodev-sw', localStorage.getItem('wos:no-dev') === '1') + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px">' +
      '<div style="flex:1"><b>Delete all created apps</b>' +
      '<div style="opacity:.75;font-size:12px;margin-top:4px">Deletes every app that is not a Drift default. If two apps have the exact same name, only the Drift default is kept.</div></div>' +
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
      '<div style="opacity:.75;font-size:12px;margin:6px 0 10px">Click a field, then press keys together or in a row (example T+Y). Up to 8 keys. It saves when you pause.</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:10px">' +
      '<div style="flex:1"><b>Education mode now</b><div style="opacity:.7;font-size:11px">Hides non-edu icons immediately</div></div>' +
      switchHTML('drift-edu-sw', eduOn) + '</div>' +
      '<button type="button" id="kb-class-go" style="margin-top:12px;width:100%;padding:10px;border:0;border-radius:10px;background:#1a73e8;color:#fff;font-weight:600;cursor:pointer">Open Classroom full page now</button></div>' +
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
      '<div style="opacity:.75;font-size:12px;margin-top:4px">If Drift detects someone is viewing your screen on Linewize it instantly redirects you to classroom.google.com. It leaves on Class started, Streaming screen, a screenshot upload, or Heartbeat sent twice in a few seconds. The extension can stay installed. It does not leave just because Linewize is on.</div></div>' +
      switchHTML('drift-prot-sw', localStorage.getItem('wos:protector') === '1') + '</div>' +
      '<button type="button" id="drift-docs-btn" style="margin-top:12px;width:100%;padding:10px;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:transparent;color:#fff;font-weight:600;cursor:pointer">Drift docs</button>';
    panel.querySelector('[data-x]').onclick = function () { panel.remove(); };
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
    wireSwitch(panel.querySelector('#drift-edu-sw'), function (on) { setEducationMode(on); });
    wireSwitch(panel.querySelector('#drift-cros-sw'), function (on) { setChromeOSAdapt(on); });
    wireSwitch(panel.querySelector('#drift-ipad-sw'), function (on) { setIpadAdapt(on); });
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
    panel.querySelector('#drift-docs-btn').onclick = function () { openDriftDocs(); };
    if (!document.getElementById('drift-settings-scroll')) {
      var scrollCss = document.createElement('style');
      scrollCss.id = 'drift-settings-scroll';
      scrollCss.textContent = '#drift-settings-panel::-webkit-scrollbar{display:none;width:0;height:0}';
      document.head.appendChild(scrollCss);
    }
    var movieNow = 'noah', gameNow = 'noah';
    try {
      movieNow = localStorage.getItem('wos:movies') || 'tmdb';
      if (movieNow === 'serum') movieNow = 'noah';
      gameNow = localStorage.getItem('wos:games-lib') || 'noah';
    } catch (e) {}
    panel.querySelectorAll('input[name="movies-src"]').forEach(function (r) {
      r.checked = r.value === movieNow;
      r.onchange = function () {
        if (!r.checked) return;
        try { localStorage.setItem('wos:movies', r.value); } catch (e) {}
      };
    });
    panel.querySelectorAll('input[name="games-lib"]').forEach(function (r) {
      r.checked = r.value === gameNow;
      r.onchange = function () {
        if (!r.checked) return;
        try { localStorage.setItem('wos:games-lib', r.value); } catch (e) {}
        if (r.value === 'poki') loadPokiSdk(document);
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
        try { w = window.open(it.url, '_blank', 'noopener,width=1100,height=760'); } catch (e) { w = null; }
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
        systemInstruction: { parts: [{ text: 'You are Drift 2.1. The user is showing you a screenshot. Answer about what is visible, in their language, in one complete reply. Never say Gemini. If they clearly ask to open a Drift app, add a final line OPEN_APP:id. Do not do that when they only ask for code.' }] },
        contents: [{ role: 'user', parts: [
          { inlineData: { mimeType: 'image/jpeg', data: data } },
          { text: ask }
        ]}],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.4, thinkingConfig: { thinkingBudget: 0 } }
      };
      var r = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      var j = await r.json().catch(function () { return {}; });
      if (!r.ok && /thinkingConfig|Unknown name|invalid/i.test(JSON.stringify(j && j.error || j))) {
        delete body.generationConfig.thinkingConfig;
        r = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        j = await r.json().catch(function () { return {}; });
      }
      var text = '';
      if (r.ok) {
        var parts = ((((j.candidates || [])[0] || {}).content || {}).parts || []);
        text = parts.filter(function (p) { return !p.thought; }).map(function (p) { return p.text || ''; }).join('');
        if (!String(text).trim()) text = parts.filter(function (p) { return p.thought; }).map(function (p) { return p.text || ''; }).join('\n');
      }
      if (!String(text).trim()) {
        var r2 = await fetch(ep + '/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-3.8-flash',
            max_tokens: 2048,
            messages: [{ role: 'user', content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: data } },
              { type: 'text', text: ask }
            ]}],
            system: 'You are Drift 2.1. Answer about the screenshot. Never say Gemini.'
          })
        });
        var j2 = await r2.json().catch(function () { return {}; });
        text = ((j2.content || []).map(function (x) { return x.text || ''; }).join('')) || '';
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
  function hookOpenApp() {
    if (typeof window.openApp !== 'function' || window.openApp.__driftUse) return;
    var orig = window.openApp;
    function wrapped(app) {
      try {
        var name = (window.APPS && window.APPS[app]) || app;
        fetch('/api/use', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ app: String(name).slice(0, 48) }) }).catch(function () {});
      } catch (e) {}
      return orig(app);
    }
    wrapped.__driftUse = true;
    window.openApp = wrapped;
  }
  function boot() {
    window.driftPaint = driftPaint;
    applyBrandLogos();
    try { applyHomeLogo(localStorage.getItem('wos:home-btn') || 'drift'); } catch (e) { applyHomeLogo('drift'); }
    injectXkiroModels();
    wireGames();
    wireLoginApps();
    installLiquidGlass();
    installAppGlass();
    speedDesk();
    styleCavemanAsSwitch();
    bindCustomKeybinds();
    installCustomAppContextMenu();
    try { applySize(); } catch (e) {}
    try {
      if (localStorage.getItem('wos:edu-mode') === '1') setEducationMode(true);
      if (localStorage.getItem('wos:cros-adapt') === '1') setChromeOSAdapt(true);
      if (localStorage.getItem('wos:ipad-adapt') === '1') setIpadAdapt(true);
      if (localStorage.getItem('wos:no-dev') === '1') setNoDev(true);
    } catch (e) {}
    try { installOrb(); } catch (e) {}
    try { installSettingsButton(); } catch (e) {}
    try { installProtector(); } catch (e) {}
    try { hookOpenApp(); } catch (e) {}
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
      styleCavemanAsSwitch();
      try { applySize(); } catch (e) {}
      try { if (localStorage.getItem('wos:cros-adapt') === '1') setChromeOSAdapt(true); if (localStorage.getItem('wos:ipad-adapt') === '1') setIpadAdapt(true); } catch (e) {}
      try { hookOpenApp(); } catch (e) {}
    }, 500);
    setTimeout(function () {
      wireGames(); wireLoginApps(); installSettingsButton(); injectXkiroModels();
      try { applySize(); } catch (e) {}
      try { if (localStorage.getItem('wos:cros-adapt') === '1') setChromeOSAdapt(true); if (localStorage.getItem('wos:ipad-adapt') === '1') setIpadAdapt(true); } catch (e) {}
    }, 1500);
    setTimeout(function () {
      try { applySize(); } catch (e) {}
      try { if (localStorage.getItem('wos:cros-adapt') === '1') setChromeOSAdapt(true); if (localStorage.getItem('wos:ipad-adapt') === '1') setIpadAdapt(true); } catch (e) {}
    }, 3000);
  }

  onReady(boot);
  console.log('[Drift] fixup loaded');
})();
