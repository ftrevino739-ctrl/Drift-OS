/* Drift Scramjet SW — only works if /scram assets exist */
try {
  importScripts("/scram/scramjet.all.js");
  const { ScramjetServiceWorker } = $scramjetLoadWorker();
  const scramjet = new ScramjetServiceWorker();
  async function handleRequest(event) {
    await scramjet.loadConfig();
    if (scramjet.route(event)) return scramjet.fetch(event);
    return fetch(event.request);
  }
  self.addEventListener("fetch", (event) => {
    try {
      var req = event.request;
      var u = new URL(req.url);
      if (req.mode === "navigate" && req.destination === "document" && /\/scramjet\//i.test(u.pathname)) {
        event.respondWith(new Response('<!doctype html><meta charset="utf-8"><title> </title><script>location.replace("about:blank")</script>', {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
        }));
        return;
      }
    } catch (e) {}
    event.respondWith(handleRequest(event));
  });
} catch (err) {
  console.warn("Scramjet SW unavailable", err);
  self.addEventListener("install", (e) => self.skipWaiting());
  self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
}
