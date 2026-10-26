// Drift watch worker. Does not search the web.
// Set WATCHM_API and MOVIEOFTHEN_API in the worker variables. Do not paste the keys into this file.

var LIVE = [
  ["Drama Theater", "/live/drama"],
  ["Comedy Hour", "/live/comedy"],
  ["Crime & Mystery", "/live/noir"],
  ["Thriller", "/live/thrill"],
  ["Horror", "/live/horror"],
  ["Western Trail", "/live/western"],
  ["Sci-Fi Theater", "/live/scifi"],
  ["Silent Cinema", "/live/silent"],
  ["Cartoon Classics", "/live/cartoon"],
  ["Documentary", "/live/docs"],
  ["Classic TV", "/live/tv"]
];

function j(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" }
  });
}

async function watchmode(env, path) {
  var key = env && env.WATCHM_API;
  if (!key) return j({ error: "Set WATCHM_API on this worker" }, 503);
  var r = await fetch("https://api.watchmode.com/v1" + path, { headers: { "X-API-Key": key, accept: "application/json" } });
  var d = await r.json();
  return j(d, r.ok ? 200 : r.status);
}

async function motn(env, path) {
  var key = env && env.MOVIEOFTHEN_API;
  if (!key) return j({ error: "Set MOVIEOFTHEN_API on this worker" }, 503);
  var r = await fetch("https://api.movieofthenight.com/v4" + path, { headers: { "X-API-Key": key, accept: "application/json" } });
  var d = await r.json();
  return j(d, r.ok ? 200 : r.status);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*" } });
    var u = new URL(request.url);
    try {
      if (u.pathname === "/watchmode/list") {
        return watchmode(env, "/list-titles/?types=movie&limit=20&sort_by=popularity_desc");
      }
      if (u.pathname === "/watchmode/search") {
        return watchmode(env, "/search/?search_field=name&search_value=" + encodeURIComponent(u.searchParams.get("q") || ""));
      }
      if (u.pathname === "/watchmode/sources") {
        return watchmode(env, "/title/" + encodeURIComponent(u.searchParams.get("id") || "") + "/sources/?regions=MX,US");
      }
      if (u.pathname === "/motn/list") {
        return motn(env, "/shows/search/filters?country=mx&show_type=movie&order_by=rating&order_direction=desc");
      }
      if (u.pathname === "/motn/search") {
        return motn(env, "/shows/search/title?country=mx&show_type=movie&title=" + encodeURIComponent(u.searchParams.get("q") || ""));
      }
      if (u.pathname === "/archive/live") {
        return j({
          items: LIVE.map(function (row) {
            return { title: row[0], url: "https://archivewatch-pulse.benwilkoff.workers.dev" + row[1] };
          })
        });
      }
      if (u.pathname === "/archive/list") {
        var page = u.searchParams.get("page") || "1";
        var q = "collection:(feature_films) AND mediatype:(movies)";
        var r = await fetch("https://archive.org/advancedsearch.php?q=" + encodeURIComponent(q) + "&fl[]=identifier&fl[]=title&sort[]=downloads+desc&rows=24&page=" + encodeURIComponent(page) + "&output=json");
        var d = await r.json();
        var docs = (d.response && d.response.docs) || [];
        return j({
          items: docs.map(function (row) {
            return { id: row.identifier, title: row.title };
          })
        });
      }
      if (u.pathname === "/archive/file") {
        var id = u.searchParams.get("id") || "";
        if (!/^[A-Za-z0-9_().-]{2,180}$/.test(id)) return j({ error: "bad id" }, 400);
        var meta = await fetch("https://archive.org/metadata/" + encodeURIComponent(id));
        var body = await meta.json();
        var file = ((body && body.files) || []).filter(function (f) { return /\.mp4$/i.test(f.name || ""); })[0];
        if (!file) return j({ error: "no mp4" }, 404);
        return j({ url: "https://archive.org/download/" + id + "/" + file.name.split("/").map(encodeURIComponent).join("/") });
      }
      return j({ ok: true, service: "Drift watch worker", providers: ["watchmode", "movieofthenight", "archive"] });
    } catch (err) {
      return j({ error: String(err) }, 500);
    }
  }
};
