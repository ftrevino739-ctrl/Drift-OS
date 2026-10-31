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
    window.open = function (u, target) {
      if (badNav(u)) return null;
      if (typeof u === 'string' && /classroom\.google\.com/i.test(u) && typeof openApp === 'function') {
        openApp('classroom');
        return null;
      }
      return open0.apply(window, arguments);
    };
    window.open.__driftStay = true;
  }

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
      '<rect width="48" height="48" rx="12" fill="#7c3aed"/>' +
      '<circle cx="17.5" cy="33" r="4.2" fill="#fff"/>' +
      '<circle cx="32" cy="29" r="4.2" fill="#fff"/>' +
      '<path d="M21.7 33V15.2L36.2 12v17" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    );
    IC.games = svg(
      '<rect width="48" height="48" rx="12" fill="#312e81"/>' +
      '<path d="M11 20.5h26c2.6 0 5 2 5 5.4 0 4.6-3 7.8-6.6 7.8h-3.1l-2.4-3h-8.8l-2.4 3H13.6C10 33.7 7 30.5 7 25.9c0-3.4 2.4-5.4 4-5.4z" fill="#6366f1"/>' +
      '<path d="M16 24.2v5.6M13.2 27h5.6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="30" cy="25.4" r="1.45" fill="#f87171"/>' +
      '<circle cx="33.6" cy="28.4" r="1.45" fill="#fbbf24"/>' +
      '<circle cx="33.6" cy="22.6" r="1.45" fill="#4ade80"/>' +
      '<circle cx="37.2" cy="25.4" r="1.45" fill="#60a5fa"/>'
    );
    IC.gbuild = svg(
      '<rect width="48" height="48" rx="12" fill="#0f766e"/>' +
      '<rect x="8" y="22" width="13" height="13" rx="2.2" fill="#5eead4"/>' +
      '<rect x="17.5" y="12" width="13" height="13" rx="2.2" fill="#99f6e4"/>' +
      '<rect x="26" y="24" width="13" height="13" rx="2.2" fill="#ccfbf1"/>' +
      '<path d="M33.2 9.2l1.5 3.1 3.4.4-2.5 2.3.7 3.3-3.1-1.7-3.1 1.7.7-3.3-2.5-2.3 3.4-.4z" fill="#fde68a"/>'
    );
    IC.winemu = svg(
      '<path fill="#00A4EF" d="M4 8.6 21.2 6.1v16.4H4z"/>' +
      '<path fill="#7FBA00" d="M23.2 5.7 44 2.9v19.6H23.2z"/>' +
      '<path fill="#FFB900" d="M4 24.7h17.2V41.6L4 39.2z"/>' +
      '<path fill="#F25022" d="M23.2 24.7H44V45l-20.8-2.5z"/>'
    );
  }

  function stripDesk() {
    if (window.APPS) {
      delete window.APPS.canva;
      window.APPS.mus = 'Música';
    }
    if (window.XAPPS) {
      delete window.XAPPS.canva;
      if (window.XAPPS.mus) window.XAPPS.mus.n = 'Música';
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
      s.appendChild(document.createTextNode('Windows'));
      s.appendChild(document.createElement('br'));
      s.appendChild(document.createTextNode('emulator'));
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
      lips.push({ id: el.id, x: r.left, y: r.top, w: r.width });
    });
    var ground = h - 6;
    var task = document.getElementById('task');
    if (task) ground = task.getBoundingClientRect().top;
    if (flakes.length < 70 && Math.random() < 0.45) {
      flakes.push({
        x: Math.random() * w,
        y: -4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: 0.28 + Math.random() * 0.38,
        r: 1.1 + Math.random() * 1.5,
        a: 0.55 + Math.random() * 0.4,
        stuck: 0,
        win: '',
        ox: 0
      });
    }
    var next = [];
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      if (f.stuck) {
        var sdx = f.x - mx;
        var sdy = f.y - my;
        var sd = Math.sqrt(sdx * sdx + sdy * sdy) || 1;
        if (sd < 26) {
          f.stuck = 0;
          f.win = '';
          f.vx = (sdx / sd) * 1.6;
          f.vy = (sdy / sd) * 0.45;
        }
      }
      if (!f.stuck) {
        var dx = f.x - mx;
        var dy = f.y - my;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 28) {
          var push = (28 - dist) / 28;
          f.vx += (dx / dist) * push * 1.15;
          f.vy += (dy / dist) * push * 0.55;
        }
        f.vx *= 0.98;
        f.vy = Math.min(0.85, f.vy + 0.004);
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < -8) f.x = w + 4;
        if (f.x > w + 8) f.x = -4;
        var landed = null;
        for (var k = 0; k < lips.length; k++) {
          var lip = lips[k];
          if (f.x >= lip.x + 2 && f.x <= lip.x + lip.w - 2 && f.y >= lip.y - 1 && f.y <= lip.y + 5 && f.vy > 0) {
            landed = lip;
            break;
          }
        }
        if (landed) {
          f.stuck = 1;
          f.win = landed.id;
          f.ox = f.x - landed.x;
          f.y = landed.y + 1;
          f.vx = 0;
          f.vy = 0;
        } else if (f.y >= ground) {
          f.stuck = 1;
          f.win = '';
          f.y = ground;
          f.vx = 0;
          f.vy = 0;
        }
      } else if (f.win) {
        var host = document.getElementById(f.win);
        if (!host || host.classList.contains('min')) {
          f.stuck = 0;
          f.win = '';
          f.vy = 0.4;
        } else {
          var hr = host.getBoundingClientRect();
          if (f.ox < -2 || f.ox > hr.width + 2) {
            f.stuck = 0;
            f.win = '';
            f.vx = f.ox < 0 ? -0.45 : 0.45;
            f.vy = 0.35;
          } else {
            f.x = hr.left + f.ox;
            f.y = hr.top + 1.2;
          }
        }
      }
      if (f.stuck) f.a -= 0.0016;
      if (f.a <= 0.04 || f.y > h + 12) continue;
      next.push(f);
      snowCtx.globalAlpha = Math.max(0, Math.min(1, f.a));
      snowCtx.fillStyle = '#fff';
      snowCtx.beginPath();
      snowCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      snowCtx.fill();
    }
    snowCtx.globalAlpha = 1;
    flakes = next;
    snowTimer = requestAnimationFrame(snowFrame);
  }
  window.driftSnow = function (on) {
    snowOn = !!on;
    try { localStorage.setItem('wos:xmas', snowOn ? '1' : '0'); } catch (e) {}
    if (!snowOn) {
      if (snowTimer) cancelAnimationFrame(snowTimer);
      snowTimer = 0;
      flakes = [];
      if (snowCanvas && snowCanvas.parentNode) snowCanvas.parentNode.removeChild(snowCanvas);
      snowCanvas = null;
      snowCtx = null;
      return;
    }
    if (!snowCanvas) {
      snowCanvas = document.createElement('canvas');
      snowCanvas.id = 'drift-snow';
      snowCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99990';
      document.body.appendChild(snowCanvas);
      snowCtx = snowCanvas.getContext('2d');
      function fit() {
        if (!snowCanvas) return;
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
