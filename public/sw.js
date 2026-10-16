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
    event.respondWith(handleRequest(event));
  });
} catch (err) {
  console.warn("Scramjet SW unavailable", err);
  self.addEventListener("install", (e) => self.skipWaiting());
  self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
}
