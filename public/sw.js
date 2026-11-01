/* Drift Scramjet SW.
   Scramjet 1.1.0 loadConfig() opens IndexedDB "$scramjet" at version 1 with no
   upgrade callback. If that open happens before ScramjetController.init(),
   the browser creates version 1 with zero object stores and never fires
   upgradeneeded again. loadConfig then throws NotFoundError on "config".
   Stores must exist before loadConfig, still at version 1 (Scramjet hardcodes it). */
try {
  importScripts("/scram/scramjet.all.js");
  const { ScramjetServiceWorker } = $scramjetLoadWorker();
  const scramjet = new ScramjetServiceWorker();
  const SCRAMJET_STORES = ["config", "cookies", "redirectTrackers", "referrerPolicies", "publicSuffixList"];

  function openScramjetDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("$scramjet", 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        for (const name of SCRAMJET_STORES) {
          if (!db.objectStoreNames.contains(name)) db.createObjectStore(name);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function deleteScramjetDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase("$scramjet");
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function ensureScramjetDB() {
    const db = await openScramjetDB();
    const missing = SCRAMJET_STORES.some((name) => !db.objectStoreNames.contains(name));
    db.close();
    if (!missing) return;
    await deleteScramjetDB();
    const fresh = await openScramjetDB();
    fresh.close();
  }

  let ready = null;
  function whenReady() {
    if (!ready) {
      ready = ensureScramjetDB().catch((err) => {
        ready = null;
        throw err;
      });
    }
    return ready;
  }

  self.addEventListener("install", (event) => {
    event.waitUntil(
      Promise.race([
        whenReady(),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]).then(() => self.skipWaiting())
    );
  });
  self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
  });

  async function handleRequest(event) {
    try {
      await whenReady();
      await scramjet.loadConfig();
      if (scramjet.config && scramjet.route(event)) return scramjet.fetch(event);
    } catch (err) {
      ready = null;
    }
    return fetch(event.request);
  }

  self.addEventListener("fetch", (event) => {
    try {
      var req = event.request;
      var u = new URL(req.url);
      if (req.mode === "navigate" && req.destination === "document" && req.headers.get("sec-fetch-site") === "none" && /\/scramjet\//i.test(u.pathname)) {
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
