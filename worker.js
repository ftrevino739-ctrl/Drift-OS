// Worker Drift-OS — Groq + OpenRouter + xKiro
// Secrets: GROQ_KEY, OPENROUTER_KEY, XKIRO_KEY, SERPAPI_KEY, YT_KEY
const ALLOW = "*";

const EMBEDDED = { GROQ: "", OPENROUTER: "", XKIRO: "" };

const MODEL_MAP = {
  "groq-llama": { p: "groq", m: "llama-3.3-70b-versatile" },
  "groq-llama-8b": { p: "groq", m: "llama-3.1-8b-instant" },
  "groq-gemma": { p: "groq", m: "gemma2-9b-it" },
  "or-gemini": { p: "openrouter", m: "google/gemini-2.0-flash-exp:free" },
  "or-llama": { p: "openrouter", m: "meta-llama/llama-3.3-70b-instruct:free" },
  "or-deepseek": { p: "openrouter", m: "deepseek/deepseek-r1:free" },
  "or-qwen": { p: "openrouter", m: "qwen/qwen-2.5-72b-instruct:free" },
  "or-mistral": { p: "openrouter", m: "mistralai/mistral-small-3.1-24b-instruct:free" },
  "gemini-2.0-flash": { p: "groq", m: "llama-3.3-70b-versatile" },
  "gemini-2.5-flash": { p: "openrouter", m: "google/gemini-2.0-flash-exp:free" },
  "gemini-2.5-flash-lite": { p: "groq", m: "llama-3.1-8b-instant" },
  "claude-sonnet-5-5": { p: "openrouter", m: "meta-llama/llama-3.3-70b-instruct:free" },
  "claude-haiku-5-5": { p: "groq", m: "llama-3.1-8b-instant" },
  "qwen-max": { p: "openrouter", m: "qwen/qwen-2.5-72b-instruct:free" },
  "qwen-flash": { p: "xkiro", m: "qwen/qwen3.7-flash:free" },
  "free": { p: "groq", m: "llama-3.1-8b-instant" },
};

const XKIRO_FALLBACKS = ["mistralai/ministral-14b", "qwen/qwen3.7-flash:free", "qwen/qwen3.8-max:free"];
const BASE = "Eres el asistente de Drift. Haz lo que el usuario te pida. Dilo con claridad.";

function cors(res) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", ALLOW);
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}
function j(o, s) {
  s = s || 200;
  return cors(new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } }));
}
function toOpenAIMessages(messages, system) {
  const out = [{ role: "system", content: system || BASE }];
  for (const m of messages || []) {
    const role = m.role === "assistant" ? "assistant" : "user";
    let content = m.content;
    if (Array.isArray(content)) {
      content = content.map(function (p) {
        if (typeof p === "string") return p;
        if (p.type === "text") return p.text || "";
        return "";
      }).filter(Boolean).join("\n");
    }
    if (content) out.push({ role: role, content: String(content) });
  }
  return out;
}
async function callGroq(env, model, messages) {
  const key = (env && env.GROQ_KEY) || EMBEDDED.GROQ;
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ model: model, messages: messages, temperature: 0.7, max_tokens: 4096 }),
  });
  return { ok: r.ok, status: r.status, d: await r.json() };
}
async function callOpenRouter(env, model, messages) {
  const key = (env && env.OPENROUTER_KEY) || EMBEDDED.OPENROUTER;
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/ftrevino739-ctrl/Drift-OS",
      "X-Title": "Drift-OS",
    },
    body: JSON.stringify({ model: model, messages: messages, temperature: 0.7, max_tokens: 4096 }),
  });
  return { ok: r.ok, status: r.status, d: await r.json() };
}
async function callXkiro(env, model, messages) {
  const key = (env && env.XKIRO_KEY) || EMBEDDED.XKIRO;
  const r = await fetch("https://api.xkiro.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ model: model, messages: messages, temperature: 0.7, max_tokens: 4096 }),
  });
  return { ok: r.ok, status: r.status, d: await r.json() };
}
function extractText(d) {
  if (!d) return "";
  if (d.choices && d.choices[0] && d.choices[0].message) return d.choices[0].message.content || "";
  if (d.content && Array.isArray(d.content)) return d.content.map(function (x) { return x.text || ""; }).join("");
  if (typeof d.content === "string") return d.content;
  return "";
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    const u = new URL(request.url);
    try {
      if (u.pathname === "/ai" && request.method === "POST") {
        const b = await request.json();
        const msgs = toOpenAIMessages(b.messages, (b.system && String(b.system)) || BASE);
        const name = String(b.model || "groq-llama");
        let route = MODEL_MAP[name];
        if (!route && name.indexOf("/") >= 0) route = { p: "openrouter", m: name };
        if (!route) route = { p: "groq", m: "llama-3.3-70b-versatile" };
        const tried = [];
        let last = null;
        const attempts = [{ p: route.p, m: route.m }];
        if (route.p === "groq") {
          attempts.push({ p: "openrouter", m: "meta-llama/llama-3.3-70b-instruct:free" });
          attempts.push({ p: "xkiro", m: XKIRO_FALLBACKS[0] });
        } else if (route.p === "openrouter") {
          attempts.push({ p: "groq", m: "llama-3.3-70b-versatile" });
        }
        for (let i = 0; i < attempts.length; i++) {
          const a = attempts[i];
          tried.push(a.p + ":" + a.m);
          try {
            if (a.p === "groq") last = await callGroq(env, a.m, msgs);
            else if (a.p === "openrouter") last = await callOpenRouter(env, a.m, msgs);
            else last = await callXkiro(env, a.m, msgs);
            if (last.ok) {
              const text = extractText(last.d);
              if (text) return j({ content: [{ type: "text", text: text }], model: a.m, provider: a.p });
            }
          } catch (e) {
            last = { ok: false, status: 500, d: { error: { message: String(e) } } };
          }
        }
        const msg = (last && last.d && last.d.error && (last.d.error.message || last.d.error)) || "Error de IA";
        return j({ error: { message: String(msg), model_requested: name, tried: tried } }, (last && last.status) || 502);
      }
      if (u.pathname === "/yt") {
        const key = (env && env.YT_KEY) || "";
        const base = "https://www.googleapis.com/youtube/v3/";
        const q = u.searchParams.get("q");
        const url = u.searchParams.get("chart")
          ? base + "videos?part=snippet&chart=mostPopular&regionCode=MX&maxResults=12&key=" + key
          : q
            ? base + "search?part=snippet&type=video&maxResults=12&safeSearch=moderate&q=" + encodeURIComponent(q) + "&key=" + key
            : null;
        if (!url) return j({ items: [] });
        const d = await (await fetch(url)).json();
        if (d.error) return j({ error: d.error.message });
        return j({
          items: (d.items || []).map(function (i) {
            return {
              id: i.id.videoId || i.id,
              title: i.snippet.title,
              channel: i.snippet.channelTitle,
              thumb: (i.snippet.thumbnails.medium || i.snippet.thumbnails.default).url,
            };
          }),
        });
      }
      return j({ ok: true, service: "Drift-OS worker", providers: ["groq", "openrouter", "xkiro"] });
    } catch (err) {
      return j({ error: String(err) }, 500);
    }
  },
};
