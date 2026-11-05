/* Wayground: Accept opens the real site in the browser's own tab. Not inside Drift. */
(function () {
  'use strict';
  function quizUrl(raw) {
    raw = String(raw || '').trim();
    if (!raw) return 'https://wayground.com/join';
    if (/^https?:\/\//i.test(raw)) return raw;
    if (/wayground\.com|quizizz\.com/i.test(raw)) return 'https://' + raw.replace(/^\/+/, '');
    return 'https://wayground.com/join?gc=' + encodeURIComponent(raw.replace(/\s+/g, ''));
  }
  window.waygroundApp = function waygroundApp(root) {
    root.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%;min-height:0;background:#11131a;color:#eee;font:14px system-ui">' +
      '<form data-ask style="flex:none;display:flex;gap:8px;align-items:center;padding:10px;border-bottom:1px solid #2a2a35">' +
      '<b>Wayground</b>' +
      '<input data-u placeholder="Código o https://wayground.com/…" style="flex:1;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:#0e1016;color:#fff">' +
      '<button type="submit" style="border:0;border-radius:10px;background:#fff;color:#111;font-weight:700;padding:8px 12px;cursor:pointer">Accept</button>' +
      '<span data-msg style="font-size:12px;opacity:.75"></span></form>' +
      '<div style="flex:1;display:grid;place-items:center;padding:24px;text-align:center;opacity:.8">El código se abre en una pestaña de tu navegador, fuera de Drift.</div></div>';
    var form = root.querySelector('[data-ask]');
    var msg = root.querySelector('[data-msg]');
    form.onsubmit = function (e) {
      e.preventDefault();
      var url = quizUrl(form.querySelector('[data-u]').value);
      var w = null;
      try { w = window.open(url, '_blank', 'popup,width=1100,height=760'); } catch (err) { w = null; }
      if (!w) msg.textContent = 'Permite las ventanas emergentes y pulsa Accept otra vez.';
      else msg.textContent = 'Abierto en tu navegador.';
    };
  };
  function wire() {
    try {
      if (window.XAPPS) window.XAPPS.wayground = { n: 'Wayground', f: window.waygroundApp };
    } catch (e) {}
  }
  wire();
  setTimeout(wire, 400);
  setTimeout(wire, 1400);
})();
