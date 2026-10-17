/* ChromeOS / Chromebook BareMux + Scramjet resilience */
(function () {
  'use strict';

  function isChromeOS() {
    try {
      if (navigator.userAgentData && /Chrome OS|Chromium OS/i.test(navigator.userAgentData.platform || '')) return true;
    } catch (e) {}
    return /CrOS|Chromebook/i.test(navigator.userAgent || '');
  }

  function withTimeout(promise, ms, label) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var t = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error((label || 'Timeout') + ' after ' + ms + 'ms'));
      }, ms);
      Promise.resolve(promise).then(
        function (v) { if (!done) { done = true; clearTimeout(t); resolve(v); } },
        function (e) { if (!done) { done = true; clearTimeout(t); reject(e); } }
      );
    });
  }

  function loadScriptOnce(src) {
    if (document.querySelector('script[data-drift-src="' + src + '"]')) {
      return Promise.resolve();
    }
    return new Promise(function (ok, no) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.dataset.driftSrc = src;
      s.onload = ok;
      s.onerror = function () { no(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  var cache = null;

  window.sjInit = function sjInitChromeOS() {
    if (cache) return cache;
    cache = (async function () {
      var chromeos = isChromeOS();
      try {
        if (typeof scramjetAvailable === 'function' && !(await scramjetAvailable())) {
          throw new Error('Proxy server offline. On Chromebook this often means Render is cold-starting or /wisp is blocked. Wait 30–60s and retry.');
        }
      } catch (e) {
        if (/Proxy server|offline|cold/i.test(String(e.message || e))) throw e;
      }

      if (typeof $scramjetLoadController !== 'function') {
        await loadScriptOnce('/scram/scramjet.all.js');
        await loadScriptOnce('/baremux/index.js');
      }
      if (typeof $scramjetLoadController !== 'function') {
        throw new Error('Scramjet scripts did not load. Hard refresh (Ctrl+Shift+R) on https://drift-os.onrender.com');
      }
      if (!navigator.serviceWorker) {
        throw new Error('Service Workers unavailable. Must use HTTPS (not file://).');
      }

      var Ctrl = $scramjetLoadController().ScramjetController;
      var SJC = new Ctrl({
        files: {
          wasm: '/scram/scramjet.wasm.wasm',
          all: '/scram/scramjet.all.js',
          sync: '/scram/scramjet.sync.js'
        }
      });
      SJC.init();

      try {
        var swr = await fetch('/sw.js', { method: 'HEAD', cache: 'no-store' });
        if (swr.ok) {
          await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
          await withTimeout(navigator.serviceWorker.ready, chromeos ? 20000 : 12000, 'ServiceWorker ready');
        }
      } catch (e) {
        console.warn('SW', e);
      }

      if (typeof BareMux === 'undefined') {
        await loadScriptOnce('/baremux/index.js');
      }
      if (typeof BareMux === 'undefined') {
        throw new Error('BareMux no cargó. On Chromebook keep this tab focused while the proxy worker starts.');
      }

      var wisp = (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host + '/wisp/';
      var lastErr = null;
      for (var attempt = 1; attempt <= 4; attempt++) {
        try {
          var c = new BareMux.BareMuxConnection('/baremux/worker.js');
          var transport = await withTimeout(c.getTransport(), chromeos ? 15000 : 8000, 'BareMux getTransport');
          if (transport !== '/libcurl/index.mjs') {
            await withTimeout(
              c.setTransport('/libcurl/index.mjs', [{ websocket: wisp }]),
              chromeos ? 20000 : 10000,
              'BareMux setTransport'
            );
          }
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
          console.warn('BareMux attempt ' + attempt, e);
          await new Promise(function (r) { setTimeout(r, 500 * attempt); });
        }
      }
      if (lastErr) {
        var msg = String(lastErr.message || lastErr);
        throw new Error(
          'BareMux no respondió. On Chromebook this often happens because the Scramjet server is waking up or Wisp WebSockets are blocked. ' +
          'Wait 30s and retry, or use Open in new tab. Detail: ' + msg
        );
      }

      window.SJC = SJC;
      return SJC;
    })();
    cache.catch(function () { cache = null; });
    return cache;
  };

  window.sjLoad = async function (box, url) {
    box.innerHTML = '<div class="ym">Starting proxy…</div>';
    try {
      await window.sjInit();
      var f = window.SJC.createFrame();
      f.frame.style.cssText = 'width:100%;height:100%;min-height:70vh;border:0;border-radius:12px;background:#fff';
      box.innerHTML = '';
      box.appendChild(f.frame);
      f.go(url);
      return f;
    } catch (e) {
      var u = String(url || '');
      box.innerHTML =
        '<div class="ym" style="padding:16px;line-height:1.5">' +
        '<b>Proxy failed</b><br>' + String(e && e.message || e) +
        '<br><br><a href="' + u.replace(/"/g, '') + '" target="_blank" rel="noopener" style="color:var(--acc)">Open in new tab</a>' +
        (isChromeOS()
          ? '<br><br><small>ChromeOS: wait if Render is cold-starting, disable offline mode, keep this tab open, then retry.</small>'
          : '') +
        '</div>';
      return null;
    }
  };

  console.log('[Drift] ChromeOS proxy helper loaded', isChromeOS() ? '(Chromebook detected)' : '');
})();
