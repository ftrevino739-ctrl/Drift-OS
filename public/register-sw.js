"use strict";
async function registerSW() {
  if (!navigator.serviceWorker) throw new Error("No service workers");
  try {
    const r = await fetch("/scram/scramjet.all.js", { method: "HEAD", cache: "no-store" });
    if (!r.ok) return null;
  } catch (e) {
    return null;
  }
  return navigator.serviceWorker.register("./sw.js");
}
