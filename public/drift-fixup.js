/* Drift fixup: logos, games, injector dedupe, wayground, taskbar corners, vscode */
(function () {
  'use strict';

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
    IC.canva =
      '<div style="width:100%;height:100%;border-radius:11px;background:linear-gradient(135deg,#00d4aa 0%,#3b8bff 45%,#9b5cff 100%);display:grid;place-items:center;overflow:hidden">' +
      '<span style="font-family:Georgia,\'Palatino Linotype\',serif;font-style:italic;font-weight:700;font-size:15px;color:#fff;letter-spacing:-0.5px;text-shadow:0 1px 2px rgba(0,0,0,.25)">Canva</span></div>';
    IC.classroom = svg(
      '<rect width="48" height="48" rx="6" fill="#FABB05"/>' +
      '<rect x="6" y="6" width="36" height="36" rx="3" fill="#0F9D58"/>' +
      '<circle cx="24" cy="20" r="5" fill="#fff"/>' +
      '<circle cx="14" cy="22" r="3.5" fill="#c8e6c9"/>' +
      '<circle cx="34" cy="22" r="3.5" fill="#c8e6c9"/>' +
      '<path d="M12 34c0-4 5-6 12-6s12 2 12 6" fill="#fff"/>' +
      '<path d="M8 33c0-2.5 3-4 6-4" fill="#c8e6c9"/>' +
      '<path d="M34 29c3 0 6 1.5 6 4" fill="#c8e6c9"/>' +
      '<rect x="30" y="38" width="8" height="3" rx="1" fill="#fff" opacity=".9"/>'
    );
    IC.roblox = svg(
      '<rect width="48" height="48" rx="8" fill="#0089EF"/>' +
      '<g transform="translate(24 24) rotate(-18)">' +
      '<rect x="-12" y="-12" width="24" height="24" fill="#fff"/>' +
      '<rect x="-5" y="-5" width="10" height="10" fill="#0089EF"/>' +
      '</g>'
    );
    IC.gimkit = svg(
      '<rect width="48" height="48" rx="11" fill="#6D28D9"/>' +
      '<text x="24" y="34" text-anchor="middle" font-size="32" font-weight="800" fill="#fff" font-family="Arial,sans-serif">G</text>'
    );
    IC.games = svg(
      '<rect width="48" height="48" rx="11" fill="#111827"/>' +
      '<rect x="8" y="14" width="14" height="10" rx="2" fill="#34d399"/>' +
      '<rect x="26" y="14" width="14" height="10" rx="2" fill="#60a5fa"/>' +
      '<rect x="8" y="28" width="14" height="10" rx="2" fill="#f472b6"/>' +
      '<rect x="26" y="28" width="14" height="10" rx="2" fill="#fbbf24"/>'
    );
    IC.injector = svg(
      '<rect width="48" height="48" rx="11" fill="#0F172A"/>' +
      '<path d="M14 16h20v3H14zm0 7h14v3H14zm0 7h9v3h-9z" fill="#38BDF8"/>' +
      '<path d="M30 30l7 4-7 4z" fill="#FBBF24"/>'
    );
    IC.gem = svg(
      '<rect width="48" height="48" rx="11" fill="#1a73e8"/>' +
      '<path d="M24 10l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff"/>'
    );
  }

  function fixInjectorDupes() {
    try {
      var apps = window.APPS;
      var x = window.XAPPS;
      var IC = window.IC;
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
      if (window.S && window.S.d) {
        ['desk', 'pins'].forEach(function (k) {
          if (Array.isArray(window.S.d[k])) {
            window.S.d[k] = window.S.d[k].filter(function (id) {
              return apps[id] && apps[id] !== 'undefined';
            });
          }
        });
      }
      try {
        var list = JSON.parse(localStorage.getItem('wos:userscripts') || '{}');
        var changed = false;
        Object.keys(list).forEach(function (id) {
          var n = (list[id] && list[id].name) || '';
          if (/injector/i.test(n) || !n) {
            delete list[id];
            changed = true;
          }
        });
        if (changed) localStorage.setItem('wos:userscripts', JSON.stringify(list));
      } catch (e) {}
      if (typeof tiles === 'function') tiles();
      if (typeof rend === 'function') rend();
    } catch (e) {
      console.warn('fixInjector', e);
    }
  }

  function noahGamesApp(root) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0;background:#0b0b12;color:#eee">' +
      '<div style="padding:10px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #222">' +
      '<b style="flex:none">Games</b>' +
      '<input id="ng-q" placeholder="Search games…" style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid #333;background:#15151f;color:#eee">' +
      '<span id="ng-count" style="font-size:11px;opacity:.6"></span></div>' +
      '<div id="ng-grid" style="flex:1;overflow:auto;padding:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px"></div>' +
      '<div id="ng-play" style="display:none;flex:1;flex-direction:column;min-height:0">' +
      '<div style="padding:8px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #222">' +
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
        'border:0;padding:0;background:#15151f;border-radius:12px;overflow:hidden;cursor:pointer;text-align:left;color:#eee;display:flex;flex-direction:column';
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = '';
      img.src = 'https://noahstutoring.academy/' + g.i;
      img.style.cssText = 'width:100%;aspect-ratio:16/10;object-fit:cover;background:#222;display:block';
      img.onerror = function () {
        img.style.display = 'none';
        el.insertAdjacentHTML(
          'afterbegin',
          '<div style="aspect-ratio:16/10;background:linear-gradient(135deg,#333,#111)"></div>'
        );
      };
      var cap = document.createElement('div');
      cap.style.cssText = 'padding:8px;font-size:12px;font-weight:600;line-height:1.3;min-height:40px';
      cap.textContent = g.t;
      el.appendChild(img);
      el.appendChild(cap);
      el.onclick = function () { openGame(g); };
      return el;
    }

    function render(list) {
      grid.innerHTML = '';
      list.forEach(function (g) { grid.appendChild(card(g)); });
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
        if (typeof window.openProxied === 'function') {
          await window.openProxied(url, frameBox);
        } else if (typeof proxySite === 'function') {
          proxySite(frameBox, url, g.t);
        } else {
          frameBox.innerHTML =
            '<iframe src="' + url.replace(/"/g, '') + '" style="width:100%;height:100%;border:0;background:#000" allowfullscreen></iframe>';
        }
      } catch (e) {
        frameBox.innerHTML =
          '<div class="ym" style="padding:16px">' +
          String(e.message || e) +
          '<br><a href="' + url + '" target="_blank" rel="noopener">Open in new tab</a></div>';
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
          '<div class="ym" style="grid-column:1/-1;padding:20px">Could not load games: ' +
          String(e.message || e) +
          '</div>';
      });
  }

  function wireGames() {
    try {
      if (window.APPS) window.APPS.games = 'Games';
      if (window.XAPPS) window.XAPPS.games = { n: 'Games', f: noahGamesApp };
      applyBrandLogos();
    } catch (e) {}
  }

  window.driftDo = async function (action, payload) {
    action = String(action || '').toLowerCase();
    payload = payload || {};
    if (action === 'open' || action === 'openapp') {
      var id = String(payload.app || payload.id || payload.name || '').toLowerCase();
      var map = {
        'vs code': 'code', vscode: 'code', code: 'code', browser: 'browser',
        youtube: 'yt', ai: 'ai', games: 'games', wayground: 'wayground', gimkit: 'gimkit'
      };
      var app = map[id] || id;
      if (typeof openApp === 'function') openApp(app);
      return { ok: true, opened: app };
    }
    if (action === 'vscode-write' || action === 'write-code') {
      if (typeof openApp === 'function') openApp('code');
      await new Promise(function (r) { setTimeout(r, 400); });
      var code = payload.code || payload.text || '';
      var wins = document.querySelectorAll('.win');
      var last = wins[wins.length - 1];
      var ta = last && last.querySelector('textarea, [data-code]');
      if (ta) {
        ta.value = code;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return { ok: !!ta, wrote: code.length };
    }
    return { ok: false, error: 'unknown action' };
  };

  function enhanceVSCode() {
    if (typeof window.vscode !== 'function') return;
    if (window.vscode.__multi) return;
    function wrapped(root) {
      root.innerHTML = '';
      root.style.cssText = 'display:flex;flex-direction:column;height:100%;min-height:0;background:#1e1e1e;color:#d4d4d4';
      var tabsBar = document.createElement('div');
      tabsBar.style.cssText =
        'display:flex;align-items:center;gap:4px;padding:6px 8px;background:#252526;border-bottom:1px solid #333;flex:none;overflow-x:auto';
      var editors = document.createElement('div');
      editors.style.cssText = 'flex:1;min-height:0;position:relative';
      root.appendChild(tabsBar);
      root.appendChild(editors);

      var files = [{ name: 'main.js', lang: 'js', value: '// main.js\n' }];
      var active = 0;
      var ta = null;

      function renderTabs() {
        tabsBar.innerHTML = '';
        files.forEach(function (f, i) {
          var t = document.createElement('button');
          t.type = 'button';
          t.textContent = f.name;
          t.style.cssText =
            'padding:6px 10px;border:0;border-radius:6px 6px 0 0;cursor:pointer;font-size:12px;' +
            (i === active ? 'background:#1e1e1e;color:#fff' : 'background:#2d2d2d;color:#aaa');
          t.onclick = function () {
            saveActive();
            active = i;
            showEditor();
            renderTabs();
          };
          tabsBar.appendChild(t);
        });
        var add = document.createElement('button');
        add.type = 'button';
        add.textContent = '+';
        add.title = 'New file';
        add.style.cssText =
          'padding:4px 10px;border:0;border-radius:6px;background:#333;color:#fff;cursor:pointer;font-size:14px';
        add.onclick = function () {
          saveActive();
          var n = prompt('File name', 'file' + (files.length + 1) + '.js');
          if (!n) return;
          var lang = /\.sql$/i.test(n) ? 'sql' : /\.html?$/i.test(n) ? 'html' : 'js';
          files.push({
            name: n,
            lang: lang,
            value: lang === 'sql' ? '-- SQL\nSELECT 1;\n' : '// ' + n + '\n'
          });
          active = files.length - 1;
          showEditor();
          renderTabs();
        };
        tabsBar.appendChild(add);
        var sql = document.createElement('button');
        sql.type = 'button';
        sql.textContent = 'SQL';
        sql.title = 'New SQL tab';
        sql.style.cssText =
          'padding:4px 10px;border:0;border-radius:6px;background:#0e639c;color:#fff;cursor:pointer;font-size:12px;margin-left:4px';
        sql.onclick = function () {
          saveActive();
          files.push({
            name: 'query' + (files.length + 1) + '.sql',
            lang: 'sql',
            value: '-- SQL query\nSELECT * FROM users LIMIT 10;\n'
          });
          active = files.length - 1;
          showEditor();
          renderTabs();
        };
        tabsBar.appendChild(sql);
      }

      function saveActive() {
        if (ta && files[active]) files[active].value = ta.value;
      }
      function showEditor() {
        editors.innerHTML = '';
        var wrap = document.createElement('div');
        wrap.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column';
        ta = document.createElement('textarea');
        ta.spellcheck = false;
        ta.value = (files[active] && files[active].value) || '';
        ta.style.cssText =
          'flex:1;border:0;resize:none;background:#1e1e1e;color:#d4d4d4;padding:12px;font:13px/1.45 ui-monospace,monospace;outline:none';
        ta.addEventListener('input', function () {
          if (files[active]) files[active].value = ta.value;
        });
        wrap.appendChild(ta);
        var ai = document.createElement('div');
        ai.style.cssText =
          'flex:none;display:flex;gap:8px;padding:8px;border-top:1px solid #333;background:#252526;align-items:center';
        var inp = document.createElement('input');
        inp.placeholder =
          files[active] && files[active].lang === 'sql' ? 'Ask AI for SQL…' : 'Ask AI for code…';
        inp.style.cssText =
          'flex:1;padding:8px;border-radius:8px;border:1px solid #444;background:#1e1e1e;color:#eee';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Generate';
        btn.style.cssText =
          'padding:8px 12px;border:0;border-radius:8px;background:#007acc;color:#fff;cursor:pointer';
        btn.onclick = async function () {
          var q = inp.value.trim();
          if (!q) return;
          btn.textContent = '…';
          try {
            var ep = (window.DDG0 || 'https://holy-firefly-982c.fert0480.workers.dev').replace(/\/$/, '');
            var lang = (files[active] && files[active].lang) || 'js';
            var r = await fetch(ep + '/ai', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'groq-llama',
                messages: [{ role: 'user', content: 'Write only ' + lang + ' code. No markdown.\n' + q }],
                system: 'You write clean code for Drift VS Code. Output code only.'
              })
            });
            var j = await r.json();
            var text = ((j.content || []).map(function (x) { return x.text || ''; }).join('') || j.text || '')
              .replace(/^```[a-z]*\n?/i, '')
              .replace(/```$/, '');
            ta.value = text;
            if (files[active]) files[active].value = text;
          } catch (e) {
            ta.value = String(e.message || e);
          }
          btn.textContent = 'Generate';
        };
        ai.appendChild(inp);
        ai.appendChild(btn);
        wrap.appendChild(ai);
        editors.appendChild(wrap);
      }

      renderTabs();
      showEditor();
    }
    wrapped.__multi = true;
    wrapped.__drift = true;
    try { window.vscode = wrapped; } catch (e) {}
    if (window.XAPPS && window.XAPPS.code) window.XAPPS.code.f = wrapped;
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
    fixInjectorDupes();
    wireGames();
    enhanceVSCode();
    tightenCornerReveal();
    setTimeout(function () {
      applyBrandLogos();
      fixInjectorDupes();
      wireGames();
      enhanceVSCode();
      if (typeof installChromeUI === 'function') try { installChromeUI(); } catch (e) {}
      tightenCornerReveal();
    }, 500);
    setTimeout(fixInjectorDupes, 1500);
  }

  onReady(boot);
  console.log('[Drift] fixup loaded');
})();
