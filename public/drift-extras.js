/* Drift OS extras — loaded after main index */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* ---------- Logos (match official styles) ---------- */
  function applyLogos() {
    if (typeof IC === 'undefined') return;
    // Classroom — yellow frame + green board + people (Google Classroom style)
    IC.classroom =
      '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#FABB05"/>' +
      '<rect x="6" y="6" width="36" height="36" rx="4" fill="#0F9D58"/>' +
      '<circle cx="24" cy="20" r="5" fill="#fff"/>' +
      '<ellipse cx="24" cy="32" rx="10" ry="6" fill="#fff"/>' +
      '<circle cx="14" cy="22" r="3.5" fill="#81C995"/>' +
      '<ellipse cx="12" cy="32" rx="6" ry="4" fill="#81C995"/>' +
      '<circle cx="34" cy="22" r="3.5" fill="#81C995"/>' +
      '<ellipse cx="36" cy="32" rx="6" ry="4" fill="#81C995"/>' +
      '<rect x="30" y="38" width="8" height="3" rx="1" fill="#fff"/></svg>';

    // Canva — gradient + script wordmark
    IC.canva =
      '<svg viewBox="0 0 48 48"><defs><linearGradient id="cvg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#00C4CC"/><stop offset="45%" stop-color="#2B8CEE"/><stop offset="100%" stop-color="#7D2AE7"/></linearGradient></defs>' +
      '<rect width="48" height="48" rx="10" fill="url(#cvg)"/>' +
      '<text x="24" y="30" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="Georgia,serif" font-style="italic">Canva</text></svg>';

    // Roblox — blue + white tilted square
    IC.roblox =
      '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#2B5BFF"/>' +
      '<g transform="translate(24,24) rotate(-18)"><rect x="-12" y="-12" width="24" height="24" rx="2" fill="#fff"/>' +
      '<rect x="-4" y="-4" width="8" height="8" fill="#2B5BFF"/></g></svg>';

    // Gimkit
    IC.gimkit =
      '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#11B5A0"/>' +
      '<rect x="9" y="11" width="30" height="22" rx="4" fill="#fff"/>' +
      '<path d="M15 19h18M15 24h14M15 29h10" stroke="#11B5A0" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="36" cy="36" r="8" fill="#FFB020"/><text x="36" y="40" text-anchor="middle" font-size="10" font-weight="800" fill="#111">?</text></svg>';

    // GitHub
    IC.github =
      '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#24292F"/>' +
      '<path fill="#fff" d="M24 10c-7.7 0-14 6.3-14 14 0 6.2 4 11.4 9.6 13.3.7.1 1-.3 1-.6v-2.2c-3.9.9-4.7-1.9-4.7-1.9-.6-1.6-1.5-2-1.5-2-1.3-.9.1-.9.1-.9 1.4.1 2.1 1.4 2.1 1.4 1.2 2.1 3.2 1.5 4 1.1.1-.9.5-1.5.9-1.8-3.1-.4-6.4-1.6-6.4-7 0-1.5.5-2.8 1.4-3.8-.1-.4-.6-1.8.1-3.7 0 0 1.2-.4 3.9 1.4A13.4 13.4 0 0124 16c1.3 0 2.6.2 3.8.5 2.7-1.8 3.9-1.4 3.9-1.4.7 1.9.3 3.3.1 3.7.9 1 1.4 2.3 1.4 3.8 0 5.4-3.3 6.6-6.4 7 .5.4 1 1.3 1 2.6v3.9c0 .3.3.7 1 .6C34 35.4 38 30.2 38 24c0-7.7-6.3-14-14-14z"/></svg>';

    // WhatsApp
    IC.whatsapp =
      '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#25D366"/>' +
      '<path fill="#fff" d="M24 12c-6.6 0-12 5.2-12 11.6 0 2 .5 3.9 1.5 5.6L12 36l6.9-1.8c1.6.9 3.5 1.4 5.1 1.4 6.6 0 12-5.2 12-11.6S30.6 12 24 12zm0 21c-1.5 0-3-.4-4.3-1.1l-.3-.2-4.1 1.1 1.1-4-.2-.3A9.3 9.3 0 0114.7 23.6c0-5.1 4.2-9.3 9.3-9.3s9.3 4.2 9.3 9.3-4.2 9.4-9.3 9.4zm5.1-7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.3.2-.6.1-1.5-.7-2.6-1.5-3.5-2.9-.2-.3 0-.4.2-.6l.5-.6c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1.8.7 2.5.8 3.4.7.5 0 1.6-.6 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.2-.3-.2-.6-.4z"/></svg>';

    // Wayground
    IC.wayground =
      '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#4579F2"/>' +
      '<text x="24" y="29" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">WG</text></svg>';

    // Injector
    IC.injector =
      '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#111827"/>' +
      '<path d="M16 18h16v4H16zm0 8h10v4H16z" fill="#34D399"/><path d="M30 28l6 4-6 4v-8z" fill="#FBBF24"/></svg>';

    // Chat bubble upgrade
    IC.chat =
      '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#5865F2"/>' +
      '<path d="M14 15h16a5 5 0 015 5v7a5 5 0 01-5 5H23l-6 5v-5h-3a5 5 0 01-5-5v-7a5 5 0 015-5z" fill="#fff"/>' +
      '<circle cx="20" cy="24" r="1.8" fill="#5865F2"/><circle cx="25" cy="24" r="1.8" fill="#5865F2"/><circle cx="30" cy="24" r="1.8" fill="#5865F2"/></svg>';
  }

  /* ---------- Daily Windows-like wallpaper (Bing) ---------- */
  function applyDailyWallpaper() {
    var day = new Date().toISOString().slice(0, 10);
    var url = 'https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=en-US&_=' + day;
    var desk = document.getElementById('desk');
    if (!desk) return;
    desk.style.backgroundImage = 'url("' + url + '")';
    desk.style.backgroundSize = 'cover';
    desk.style.backgroundPosition = 'center';
    desk.style.backgroundAttachment = 'fixed';
    // fallback
    var img = new Image();
    img.onerror = function () {
      desk.style.backgroundImage =
        'linear-gradient(145deg,#0f172a 0%,#1e3a5f 40%,#312e81 100%)';
    };
    img.src = url;
  }

  /* ---------- New app implementations ---------- */
  function githubApp(root) {
    if (typeof proxySite === 'function') proxySite(root, 'https://github.com', 'GitHub');
    else root.innerHTML = '<div style="padding:16px"><a href="https://github.com" target="_blank">Open GitHub</a></div>';
  }

  function whatsappApp(root) {
    if (typeof proxySite === 'function') proxySite(root, 'https://web.whatsapp.com', 'WhatsApp');
    else root.innerHTML = '<div style="padding:16px"><a href="https://web.whatsapp.com" target="_blank">Open WhatsApp Web</a></div>';
  }

  function waygroundApp(root) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%">' +
      '<div style="padding:8px 12px;border-bottom:1px solid var(--line);display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
      '<b>Wayground</b>' +
      '<button type="button" id="wg-open" style="padding:6px 10px;border-radius:8px;border:0;background:#4579F2;color:#fff;cursor:pointer">Open site</button>' +
      '<button type="button" id="wg-help" style="padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:var(--omni);cursor:pointer">Ask Drift for answers</button>' +
      '</div>' +
      '<div id="wg-body" style="flex:1;min-height:0"></div></div>';
    var body = root.querySelector('#wg-body');
    root.querySelector('#wg-open').onclick = function () {
      if (typeof proxySite === 'function') proxySite(body, 'https://wayground.com', 'Wayground');
      else body.innerHTML = '<iframe src="https://wayground.com" style="width:100%;height:100%;border:0"></iframe>';
    };
    root.querySelector('#wg-help').onclick = function () {
      body.innerHTML =
        '<div style="padding:16px;max-width:560px">' +
        '<p style="margin:0 0 10px">Paste a quiz question. Drift AI will suggest an answer using your existing API keys.</p>' +
        '<textarea id="wg-q" rows="4" style="width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:1px solid var(--line);background:var(--omni);color:var(--ink)"></textarea>' +
        '<button type="button" id="wg-ask" style="margin-top:10px;padding:8px 14px;border:0;border-radius:8px;background:#4579F2;color:#fff;cursor:pointer">Get answer</button>' +
        '<pre id="wg-out" style="margin-top:12px;white-space:pre-wrap;font-size:13px"></pre></div>';
      body.querySelector('#wg-ask').onclick = async function () {
        var q = body.querySelector('#wg-q').value.trim();
        var out = body.querySelector('#wg-out');
        if (!q) return;
        out.textContent = 'Thinking…';
        try {
          var ans = await window.__driftAsk?.(q, true);
          out.textContent = ans || 'No answer (open AI app once so models load, or check API keys).';
        } catch (e) {
          out.textContent = String(e.message || e);
        }
      };
    };
    root.querySelector('#wg-open').click();
  }

  function injectorApp(root) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;font-family:ui-sans-serif,system-ui,sans-serif">' +
      '<div style="padding:10px 12px;border-bottom:1px solid var(--line)"><b>JS Injector</b> <span style="color:var(--mute);font-size:12px">Tampermonkey-style (this page / open apps)</span></div>' +
      '<div style="padding:12px;display:flex;flex-direction:column;gap:8px;flex:1;min-height:0">' +
      '<label style="font-size:12px;color:var(--mute)">Script name</label>' +
      '<input id="inj-name" placeholder="my-script" style="padding:8px;border-radius:8px;border:1px solid var(--line);background:var(--omni);color:var(--ink)"/>' +
      '<label style="font-size:12px;color:var(--mute)">JavaScript</label>' +
      '<textarea id="inj-code" style="flex:1;min-height:160px;padding:10px;border-radius:8px;border:1px solid var(--line);background:#0b1220;color:#e2e8f0;font-family:ui-monospace,monospace;font-size:12px" placeholder="// runs in Drift page context\nconsole.log(\'hello from injector\')"></textarea>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<button type="button" id="inj-run" style="padding:8px 12px;border:0;border-radius:8px;background:#34D399;color:#052e1b;font-weight:700;cursor:pointer">Run now</button>' +
      '<button type="button" id="inj-save" style="padding:8px 12px;border:0;border-radius:8px;background:#3b82f6;color:#fff;cursor:pointer">Save</button>' +
      '<button type="button" id="inj-list" style="padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--omni);cursor:pointer">Saved scripts</button>' +
      '</div>' +
      '<pre id="inj-out" style="font-size:12px;color:var(--mute);white-space:pre-wrap"></pre>' +
      '</div></div>';
    var key = 'wos:injectors';
    function loadAll() {
      try {
        return JSON.parse(localStorage.getItem(key) || '{}');
      } catch (e) {
        return {};
      }
    }
    function saveAll(o) {
      localStorage.setItem(key, JSON.stringify(o));
    }
    root.querySelector('#inj-run').onclick = function () {
      var code = root.querySelector('#inj-code').value;
      var out = root.querySelector('#inj-out');
      try {
        var fn = new Function(code);
        var r = fn();
        out.textContent = r === undefined ? 'OK (no return)' : String(r);
      } catch (e) {
        out.textContent = 'Error: ' + (e && e.message);
      }
    };
    root.querySelector('#inj-save').onclick = function () {
      var n = root.querySelector('#inj-name').value.trim() || 'script-' + Date.now();
      var all = loadAll();
      all[n] = root.querySelector('#inj-code').value;
      saveAll(all);
      root.querySelector('#inj-out').textContent = 'Saved: ' + n;
    };
    root.querySelector('#inj-list').onclick = function () {
      var all = loadAll();
      var names = Object.keys(all);
      root.querySelector('#inj-out').textContent = names.length ? names.join('\n') : '(empty)';
      if (names[0]) {
        root.querySelector('#inj-name').value = names[0];
        root.querySelector('#inj-code').value = all[names[0]];
      }
    };
  }

  function registerApps() {
    if (typeof APPS === 'object') {
      Object.assign(APPS, {
        github: 'GitHub',
        whatsapp: 'WhatsApp',
        wayground: 'Wayground',
        injector: 'JS Injector',
      });
    }
    if (typeof XAPPS === 'object') {
      XAPPS.github = { n: 'GitHub', f: githubApp };
      XAPPS.whatsapp = { n: 'WhatsApp', f: whatsappApp };
      XAPPS.wayground = { n: 'Wayground', f: waygroundApp };
      XAPPS.injector = { n: 'JS Injector', f: injectorApp };
    }
    try {
      if (typeof tiles === 'function') tiles();
      if (typeof rend === 'function') rend();
    } catch (e) {}
  }

  /* ---------- AI tools UI: Caveman toggle + Instructions holder ---------- */
  function enhanceAiTools() {
    var style = document.createElement('style');
    style.textContent =
      '.ai-tools{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:6px 10px 2px}' +
      '.ai-sw{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--ink)}' +
      '.ai-sw input{appearance:none;width:36px;height:20px;border-radius:999px;background:#64748b;position:relative;cursor:pointer;border:0;outline:0}' +
      '.ai-sw input:checked{background:var(--acc,#7c3aed)}' +
      '.ai-sw input::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .15s}' +
      '.ai-sw input:checked::after{left:18px}' +
      '.ai-instr-wrap{flex:1;min-width:160px;max-width:420px}' +
      '.ai-instr-wrap textarea{width:100%;min-height:34px;max-height:90px;resize:vertical;padding:6px 8px;border-radius:8px;border:1px solid var(--line);background:var(--omni);color:var(--ink);font-size:12px;box-sizing:border-box}' +
      '.ai-instr-wrap label{display:block;font-size:10px;color:var(--mute);margin-bottom:2px}';
    document.head.appendChild(style);

    // When AI windows open, restyle tools bar
    var obs = new MutationObserver(function () {
      document.querySelectorAll('.ai-tools').forEach(function (bar) {
        if (bar.dataset.enhanced) return;
        bar.dataset.enhanced = '1';
        var cavBtn = bar.querySelector('[data-t="caveman"]');
        var insBtn = bar.querySelector('[data-t="instr"]');
        if (!cavBtn || !insBtn) return;

        var sw = document.createElement('label');
        sw.className = 'ai-sw';
        sw.innerHTML = '<input type="checkbox" data-cav-toggle /> <span>Caveman</span>';
        var hold = document.createElement('div');
        hold.className = 'ai-instr-wrap';
        hold.innerHTML =
          '<label>Instructions (like Claude)</label>' +
          '<textarea data-instr-hold placeholder="Custom instructions for this chat…"></textarea>';

        var saved = '';
        try {
          saved = localStorage.getItem('wos:cinst') || '';
        } catch (e) {}
        hold.querySelector('textarea').value = saved;

        bar.innerHTML = '';
        bar.appendChild(sw);
        bar.appendChild(hold);

        var box = sw.querySelector('input');
        box.addEventListener('change', function () {
          // trigger original caveman path by synthesizing state on nearest AI root
          cavBtn.classList.toggle('on', box.checked);
          cavBtn.click();
          // click toggles twice if already on — sync carefully
          if (cavBtn.classList.contains('on') !== box.checked) cavBtn.click();
        });
        hold.querySelector('textarea').addEventListener('change', function () {
          var v = hold.querySelector('textarea').value;
          try {
            localStorage.setItem('wos:cinst', v);
          } catch (e) {}
        });
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- Expand AI OPEN_APP actions ---------- */
  function enhanceOpenAppCommands() {
    if (typeof openApp !== 'function') return;
    var _open = openApp;
    window.openApp = function (id) {
      var map = {
        youtube: 'yt',
        netflix: 'movies',
        vscode: 'code',
        vs: 'code',
        ig: 'ig',
        instagram: 'ig',
        tiktok: 'tt',
        wa: 'whatsapp',
        gh: 'github',
      };
      id = map[id] || id;
      return _open(id);
    };

    // Parse richer commands from AI replies on the page
    var _origFetch = window.fetch;
    // Hook is too invasive; instead monkey-patch text insertion via MutationObserver for OPEN_APP lines
    document.addEventListener(
      'click',
      function () {
        /* no-op keep alive */
      },
      true
    );

    // Extend parser: watch AI message nodes
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes &&
          m.addedNodes.forEach(function (n) {
            if (!n || n.nodeType !== 1) return;
            var t = n.textContent || '';
            var re = /OPEN_APP:([a-z0-9_]+)/gi;
            var hit;
            while ((hit = re.exec(t))) {
              try {
                window.openApp(hit[1].toLowerCase());
              } catch (e) {}
            }
            // Natural phrases
            var low = t.toLowerCase();
            if (/opening vs code|opened vs code|open vscode/.test(low)) try { window.openApp('code'); } catch (e) {}
            if (/opening netflix|open movies|open netflix/.test(low)) try { window.openApp('movies'); } catch (e) {}
            if (/opening discord|open discord/.test(low)) try { window.openApp('discord'); } catch (e) {}
            if (/opening github|open github/.test(low)) try { window.openApp('github'); } catch (e) {}
          });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- Minimal Drift ask helper for Wayground ---------- */
  window.__driftAsk = async function (question, caveman) {
    // Try to reuse page MODELS / keys if present by opening AI internals is hard;
    // Use OpenRouter-compatible path if key in localStorage, else return guidance.
    var key =
      localStorage.getItem('wos:openrouter') ||
      localStorage.getItem('openrouter_key') ||
      '';
    if (!key) {
      return 'Set your OpenRouter/Groq key in the AI app settings first. Then ask again.\n\nQuestion was: ' + question;
    }
    var sys = caveman
      ? 'Answer in as few words as possible. For quizzes, reply only with the correct option letter or short answer.'
      : 'You help with quiz questions. Be accurate and brief. Give the best answer and a one-line reason.';
    var res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        'HTTP-Referer': location.origin,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: question },
        ],
      }),
    });
    if (!res.ok) throw new Error('API ' + res.status);
    var data = await res.json();
    return data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : JSON.stringify(data);
  };

  ready(function () {
    applyLogos();
    applyDailyWallpaper();
    registerApps();
    enhanceAiTools();
    enhanceOpenAppCommands();
    setTimeout(applyLogos, 500);
    setTimeout(registerApps, 800);
    setTimeout(applyDailyWallpaper, 1000);
  });
})();
