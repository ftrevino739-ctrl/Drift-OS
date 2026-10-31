/* Drift user patch — only the requested fixes */
(function () {
  'use strict';

  function jsIssue(code) {
    var src = String(code || '');
    try { new Function(src); return null; } catch (e) {}
    var lines = src.split('\n');
    var pending = null;
    for (var i = 0; i < lines.length; i++) {
      var slice = lines.slice(0, i + 1).join('\n');
      try { new Function(slice); pending = null; }
      catch (err) {
        var msg = String((err && err.message) || 'Syntax error');
        if (/Unexpected end of input|Unexpected end|Unterminated/i.test(msg)) {
          pending = { line: i + 1, col: 1, message: msg };
          continue;
        }
        var col = 1;
        var tok = msg.match(/Unexpected token\s+(.+)$/);
        var line = lines[i] || '';
        if (tok) {
          var raw = tok[1].replace(/^['"]|['"]$/g, '');
          var ch = raw.charAt(0);
          if (ch) {
            var idx = line.lastIndexOf(ch);
            if (idx >= 0) col = idx + 1;
          }
        }
        return { line: i + 1, col: col, message: msg };
      }
    }
    if (pending) {
      var lineNo = pending.line;
      for (var j = lines.length - 1; j >= 0; j--) {
        if (String(lines[j]).trim()) { lineNo = j + 1; break; }
      }
      return { line: lineNo, col: Math.max(1, String(lines[lineNo - 1] || '').length), message: pending.message };
    }
    return { line: 1, col: 1, message: 'Syntax error' };
  }
  window.driftJsIssue = jsIssue;

  var origFetch = window.fetch;
  if (typeof origFetch === 'function' && !origFetch.__driftAi) {
    function aiTarget(url) {
      return /\/ai(\?|$)/.test(url) && !/\/api\/ai(\?|$)/.test(url) && url.indexOf('pollinations.ai') < 0;
    }
    function appResponse(text) {
      return new Response(JSON.stringify({ content: [{ type: 'text', text: String(text || '') }] }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    }
    function looksBad(statusOk, raw) {
      if (/Missing Authentication|no-key|invalid api key|Unauthorized/i.test(raw)) return true;
      try {
        var j = JSON.parse(raw);
        var got = ((j.content || []).map(function (x) { return (x && x.text) || ''; }).join('')).trim();
        if (got && !/Missing Authentication/i.test(got)) return false;
        if (j.error) return true;
      } catch (e) {}
      return !statusOk;
    }
    function pollinate(body) {
      var payload = {};
      try { payload = JSON.parse(body || '{}'); } catch (e) { payload = {}; }
      var messages = [];
      if (payload.system) messages.push({ role: 'system', content: String(payload.system) });
      if (payload.instructions) messages.push({ role: 'system', content: String(payload.instructions) });
      (payload.messages || []).forEach(function (m) {
        if (!m) return;
        var content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content || '');
        if (content) messages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: content });
      });
      if (!messages.length && payload.contents) {
        try {
          payload.contents.forEach(function (c) {
            var t = (((c || {}).parts || [])[0] || {}).text || '';
            if (t) messages.push({ role: 'user', content: t });
          });
        } catch (e2) {}
      }
      if (!messages.length) messages.push({ role: 'user', content: 'Hello' });
      return origFetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages: messages,
          max_tokens: Math.min(8192, Number(payload.max_tokens) || 4096)
        })
      }).then(function (r) { return r.json(); }).then(function (j) {
        var text = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (!text) throw new Error('empty');
        return appResponse(text);
      });
    }
    function wrappedFetch(input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var method = (init && init.method) || (input && input.method) || 'GET';
      var pending = origFetch.apply(this, arguments);
      if (!aiTarget(url) || String(method).toUpperCase() !== 'POST') return pending;
      var body = init && init.body;
      return pending.then(function (res) {
        return res.clone().text().then(function (raw) {
          if (!looksBad(res.ok, raw)) return res;
          return origFetch('/api/ai', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: body
          }).then(function (r2) {
            return r2.clone().text().then(function (raw2) {
              if (!looksBad(r2.ok, raw2)) return r2;
              return pollinate(body);
            });
          }).catch(function () { return pollinate(body); });
        });
      });
    }
    wrappedFetch.__driftAi = true;
    window.fetch = wrappedFetch;
  }

  function badNav(url) {
    try {
      var u = new URL(String(url || ''), location.href);
      if (u.origin === location.origin && /\/scramjet\//i.test(u.pathname)) return true;
      if (/hostless\.com$/i.test(u.hostname) && /scramjet/i.test(u.pathname + u.search)) return true;
    } catch (e) {}
    return false;
  }
  try {
    var assign0 = Location.prototype.assign;
    var replace0 = Location.prototype.replace;
    if (assign0 && !assign0.__driftStay) {
      Location.prototype.assign = function (v) {
        if (badNav(v)) return;
        return assign0.call(this, v);
      };
      Location.prototype.assign.__driftStay = true;
    }
    if (replace0 && !replace0.__driftStay) {
      Location.prototype.replace = function (v) {
        if (badNav(v)) return;
        return replace0.call(this, v);
      };
      Location.prototype.replace.__driftStay = true;
    }
  } catch (e) {}
  if (!window.open.__driftStay) {
    var open0 = window.open;
    window.open = function (u) {
      var s = u == null ? '' : String(u);
      if (badNav(s)) return null;
      if (/^https?:/i.test(s)) {
        try {
          window.__driftBrowserOpen = [s];
          if (typeof openApp === 'function') openApp('browser');
        } catch (e) {}
        return null;
      }
      if (typeof s === 'string' && /classroom\.google\.com/i.test(s) && typeof openApp === 'function') {
        openApp('classroom');
        return null;
      }
      return open0.apply(window, arguments);
    };
    window.open.__driftStay = true;
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href) return;
    if (/\/scramjet\//i.test(href)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (a.getAttribute('target') === '_blank' && /^https?:/i.test(href)) {
      e.preventDefault();
      e.stopPropagation();
      window.open(href);
    }
  }, true);

  function svg(inner) {
    return '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }
  function paintLogos() {
    var IC = window.IC;
    if (!IC) return;
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
    IC.gbuild = svg(
      '<rect width="48" height="48" rx="12" fill="#0f766e"/>' +
      '<rect x="8" y="22" width="13" height="13" rx="2.2" fill="#5eead4"/>' +
      '<rect x="17.5" y="12" width="13" height="13" rx="2.2" fill="#99f6e4"/>' +
      '<rect x="26" y="24" width="13" height="13" rx="2.2" fill="#ccfbf1"/>' +
      '<path d="M33.2 9.2l1.5 3.1 3.4.4-2.5 2.3.7 3.3-3.1-1.7-3.1 1.7.7-3.3-2.5-2.3 3.4-.4z" fill="#fde68a"/>'
    );
    IC.winemu = svg(
      '<rect x="5" y="5" width="16.5" height="16.5" rx="2" fill="#0078D4"/>' +
      '<rect x="26.5" y="5" width="16.5" height="16.5" rx="2" fill="#0078D4"/>' +
      '<rect x="5" y="26.5" width="16.5" height="16.5" rx="2" fill="#0078D4"/>' +
      '<rect x="26.5" y="26.5" width="16.5" height="16.5" rx="2" fill="#0078D4"/>'
    );
  }

  function stripDesk() {
    if (window.APPS) {
      delete window.APPS.canva;
      window.APPS.mus = 'Music';
    }
    if (window.XAPPS) {
      delete window.XAPPS.canva;
      if (window.XAPPS.mus) window.XAPPS.mus.n = 'Music';
    }
    if (window.IC) delete window.IC.canva;
    paintLogos();
    var changed = false;
    try {
      if (window.S && window.S.d) {
        ['desk', 'pins'].forEach(function (k) {
          if (!Array.isArray(window.S.d[k])) return;
          var next = window.S.d[k].filter(function (id) { return id && id !== 'canva'; });
          if (next.length !== window.S.d[k].length) { window.S.d[k] = next; changed = true; }
        });
      }
    } catch (e) {}
    if (changed) { try { if (typeof save === 'function') save(); } catch (e2) {} }
    document.querySelectorAll('#tbs .tb').forEach(function (b) {
      if (!/Windows emulator/i.test(b.textContent || '')) return;
      b.classList.add('drift-winemu');
      if (b.querySelector('.wem-name')) return;
      var mi = b.querySelector('.mi');
      var label = (b.textContent || '').replace(/\s+/g, ' ').trim() || 'Windows emulator';
      b.textContent = '';
      if (mi) b.appendChild(mi);
      var s = document.createElement('span');
      s.className = 'wem-name';
      s.textContent = 'Windows emulator';
      b.appendChild(s);
    });
    var gear = document.getElementById('drift-settings-btn');
    if (gear) {
      gear.style.margin = '0';
      gear.style.background = 'transparent';
      gear.style.alignSelf = 'center';
      var lf = gear.closest && gear.closest('.lf');
      if (lf) lf.style.alignItems = 'center';
    }
  }

  if (typeof rend === 'function' && !rend.__driftUser) {
    var origRend = rend;
    var guard = false;
    function wrappedRend() {
      var out = origRend.apply(this, arguments);
      if (!guard) {
        guard = true;
        try { stripDesk(); } catch (e) {}
        guard = false;
      }
      return out;
    }
    wrappedRend.__driftUser = true;
    try { window.rend = wrappedRend; rend = wrappedRend; } catch (e) {}
  }

  var flakes = [];
  var snowOn = false;
  var snowCanvas = null;
  var snowCtx = null;
  var snowTimer = 0;
  var mx = -9999;
  var my = -9999;
  var cm35 = 132;
  var sandBins = [];
  var sandLevel = 0;
  var sandWin = {};
  function measureCm() {
    var p = document.createElement('div');
    p.style.cssText = 'position:absolute;left:-999px;height:3.5cm';
    document.body.appendChild(p);
    cm35 = p.getBoundingClientRect().height || 132;
    p.remove();
  }
  function snowFrame() {
    if (!snowOn || !snowCtx || !snowCanvas) return;
    var w = snowCanvas.width;
    var h = snowCanvas.height;
    snowCtx.clearRect(0, 0, w, h);
    var lips = [];
    document.querySelectorAll('.win').forEach(function (el) {
      if (!el.isConnected || el.classList.contains('min')) return;
      var r = el.getBoundingClientRect();
      if (r.width < 40 || r.height < 30) return;
      lips.push({ id: el.id, x: r.left, y: r.top, w: r.width, right: r.right, bottom: r.bottom });
    });
    var ground = h - 6;
    var task = document.getElementById('task');
    var taskH = 76;
    if (task) {
      var tr = task.getBoundingClientRect();
      ground = tr.top;
      if (tr.height > 20) taskH = tr.height;
    }
    var sandStop = taskH * 2.25;
    var cols = Math.max(1, Math.ceil(w / 4));
    if (sandBins.length !== cols) {
      var nb = new Array(cols);
      for (var c = 0; c < cols; c++) nb[c] = sandBins[c] || 0;
      sandBins = nb;
    }
    var seenWin = {};
    for (var li = 0; li < lips.length; li++) {
      var lip0 = lips[li];
      seenWin[lip0.id] = 1;
      var pile = sandWin[lip0.id];
      if (!pile) pile = sandWin[lip0.id] = { h: 0, x: lip0.x, y: lip0.y, w: lip0.w };
      else { pile.x = lip0.x; pile.y = lip0.y; pile.w = lip0.w; }
    }
    Object.keys(sandWin).forEach(function (id) {
      if (seenWin[id]) return;
      var gone = sandWin[id];
      var nspill = Math.min(18, Math.ceil((gone.h || 0) / 6));
      for (var s = 0; s < nspill; s++) {
        flakes.push({
          x: gone.x + Math.random() * Math.max(8, gone.w),
          y: gone.y + 4,
          vx: (Math.random() - 0.5) * 1.2,
          vy: 0.6,
          r: 0.7 + Math.random() * 1.4,
          a: 0.8
        });
      }
      delete sandWin[id];
    });
    if (sandLevel < sandStop && flakes.length < 280) {
      flakes.push({
        x: Math.random() * w,
        y: -6,
        vx: (Math.random() - 0.5) * 0.22,
        vy: 0.32 + Math.random() * 0.5,
        r: 0.55 + Math.random() * 1.15,
        a: 0.5 + Math.random() * 0.45
      });
    }
    function addGround(x, amt) {
      sandLevel = Math.min(sandStop, sandLevel + amt);
      var col = Math.max(0, Math.min(cols - 1, Math.floor(x / 4)));
      sandBins[col] = Math.min(12, (sandBins[col] || 0) + amt * 4);
      if (col > 0) sandBins[col - 1] = Math.min(12, (sandBins[col - 1] || 0) + amt);
      if (col + 1 < cols) sandBins[col + 1] = Math.min(12, (sandBins[col + 1] || 0) + amt);
    }
    if (mx >= 0 && my > ground - sandLevel - 40 && my < ground + 14) {
      var mc = Math.floor(mx / 4);
      for (var pk = -8; pk <= 8; pk++) {
        var ci = mc + pk;
        if (ci < 0 || ci >= cols) continue;
        if (sandBins[ci] > 0) sandBins[ci] = Math.max(0, sandBins[ci] - 0.8);
      }
      if (sandLevel > 0) sandLevel = Math.max(0, sandLevel - 0.35);
      if (flakes.length < 340) {
        flakes.push({ x: mx + (Math.random() - 0.5) * 20, y: Math.max(0, ground - sandLevel - 4), vx: (Math.random() - 0.5) * 2.4, vy: -1.2, r: 0.8, a: 0.85 });
      }
    }
    var next = [];
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      var dx = f.x - mx;
      var dy = f.y - my;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dist < 36) {
        var push = (36 - dist) / 36;
        f.vx += (dx / dist) * push * 1.2;
        f.vy += (dy / dist) * push * 0.45;
      }
      f.vx *= 0.98;
      f.vy = Math.min(1.15, (f.vy || 0) + 0.012);
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < -8) f.x = w + 4;
      if (f.x > w + 8) f.x = -4;
      var landed = null;
      for (var k = 0; k < lips.length; k++) {
        var lip = lips[k];
        var top = lip.y - ((sandWin[lip.id] && sandWin[lip.id].h) || 0);
        if (f.x >= lip.x + 2 && f.x <= lip.x + lip.w - 2 && f.y >= top - f.r && f.y <= top + 10 && f.vy > 0) {
          landed = lip;
          break;
        }
      }
      if (landed) {
        var wp = sandWin[landed.id];
        if (wp && wp.h < sandStop) wp.h = Math.min(sandStop, wp.h + 0.45);
        continue;
      }
      if (f.y >= ground - sandLevel) {
        addGround(f.x, 0.085);
        continue;
      }
      next.push(f);
    }
    flakes = next;
    for (var b = 1; b < cols - 1; b++) sandBins[b] = sandBins[b] * 0.992;
    snowCtx.fillStyle = '#f6f7fb';
    snowCtx.beginPath();
    snowCtx.moveTo(0, ground);
    snowCtx.lineTo(0, ground - sandLevel - (sandBins[0] || 0));
    for (var d = 1; d < cols; d++) snowCtx.lineTo(d * 4, ground - sandLevel - (sandBins[d] || 0));
    snowCtx.lineTo(w, ground - sandLevel - (sandBins[cols - 1] || 0));
    snowCtx.lineTo(w, ground);
    snowCtx.closePath();
    snowCtx.fill();
    snowCtx.fillStyle = 'rgba(255,255,255,.72)';
    Object.keys(sandWin).forEach(function (id) {
      var p = sandWin[id];
      if (!p.h) return;
      snowCtx.beginPath();
      snowCtx.moveTo(p.x, p.y);
      var steps = Math.max(2, Math.floor(p.w / 8));
      for (var st = 0; st <= steps; st++) {
        var xx = p.x + (p.w * st) / steps;
        var wave = Math.sin(xx * 0.17) * Math.min(2.5, p.h * 0.12);
        snowCtx.lineTo(xx, p.y - p.h - wave);
      }
      snowCtx.lineTo(p.x + p.w, p.y);
      snowCtx.closePath();
      snowCtx.fill();
    });
    for (var z = 0; z < flakes.length; z++) {
      var flake = flakes[z];
      snowCtx.globalAlpha = Math.max(0, Math.min(1, flake.a || 0.8));
      snowCtx.fillStyle = '#fff';
      snowCtx.beginPath();
      snowCtx.save();
      snowCtx.translate(flake.x, flake.y);
      snowCtx.scale(1.25, 0.62);
      snowCtx.arc(0, 0, flake.r, 0, Math.PI * 2);
      snowCtx.fill();
      snowCtx.restore();
    }
    snowCtx.globalAlpha = 1;
    snowTimer = requestAnimationFrame(snowFrame);
  }
  window.driftSnow = function (on) {
    snowOn = !!on;
    try { localStorage.setItem('wos:xmas', snowOn ? '1' : '0'); } catch (e) {}
    if (!snowOn) {
      if (snowTimer) cancelAnimationFrame(snowTimer);
      snowTimer = 0;
      flakes = [];
      sandBins = [];
      sandLevel = 0;
      sandWin = {};
      if (snowCanvas && snowCanvas.parentNode) snowCanvas.parentNode.removeChild(snowCanvas);
      snowCanvas = null;
      snowCtx = null;
      return;
    }
    try { measureCm(); } catch (e) {}
    if (!snowCanvas) {
      snowCanvas = document.createElement('canvas');
      snowCanvas.id = 'drift-snow';
      snowCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99990';
      document.body.appendChild(snowCanvas);
      snowCtx = snowCanvas.getContext('2d');
      function fit() {
        if (!snowCanvas) return;
        try { measureCm(); } catch (e) {}
        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;
      }
      fit();
      window.addEventListener('resize', fit);
    }
    if (!snowTimer) snowTimer = requestAnimationFrame(snowFrame);
  };
  document.addEventListener('pointermove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  }, true);

  function boot() {
    stripDesk();
    var on = false;
    try { on = localStorage.getItem('wos:xmas') === '1'; } catch (e) {}
    if (on) window.driftSnow(true);
  }
  if (!window.__driftTbWatch) {
    window.__driftTbWatch = true;
    var tbs = document.getElementById('tbs');
    if (tbs && window.MutationObserver) {
      new MutationObserver(function () { stripDesk(); }).observe(tbs, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 700);
  setTimeout(boot, 1700);
})();
