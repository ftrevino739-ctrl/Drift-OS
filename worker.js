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
const BASE = "Eres el asistente de Drift. Haz lo que el usuario te pida. Dilo con claridad. Si piden código, escribe el archivo completo, sin cortes, sin puntos suspensivos y sin decir que el resto continúa.";

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
function partToOpenAI(p) {
  if (typeof p === "string") return { type: "text", text: p };
  if (!p || typeof p !== "object") return null;
  if (p.type === "text") return { type: "text", text: p.text || "" };
  if (p.type === "image_url") return p;
  if (p.type === "image" && p.source && p.source.data) {
    var mime = p.source.media_type || "image/jpeg";
    return { type: "image_url", image_url: { url: "data:" + mime + ";base64," + p.source.data } };
  }
  if (p.inline_data && p.inline_data.data) {
    return { type: "image_url", image_url: { url: "data:" + (p.inline_data.mime_type || "image/jpeg") + ";base64," + p.inline_data.data } };
  }
  return null;
}
function toOpenAIMessages(messages, system) {
  const out = [{ role: "system", content: system || BASE }];
  for (const m of messages || []) {
    const role = m.role === "assistant" ? "assistant" : "user";
    let content = m.content;
    if (Array.isArray(content)) {
      content = content.map(partToOpenAI).filter(Boolean);
      if (content.length === 1 && content[0].type === "text") content = content[0].text;
    }
    if (content && (typeof content === "string" ? content : content.length)) out.push({ role: role, content: content });
  }
  return out;
}
function textOnly(messages) {
  return (messages || []).map(function (m) {
    if (!Array.isArray(m.content)) return m;
    var t = m.content.map(function (p) { return p.type === "text" ? (p.text || "") : "[image]"; }).join("\n");
    return { role: m.role, content: t };
  });
}
function tokenBudget(raw, requested) {
  var n = Number(requested);
  if (n >= 256) return Math.min(n, 32768);
  var blob = "";
  try { blob = JSON.stringify(raw || "").slice(0, 8000); } catch (e) {}
  if (/\b(1000|2000|3000|mil l[ií]neas|thousand lines|archivo completo|full script|todo el c[oó]digo|entire file)\b/i.test(blob)) return 32768;
  return 4096;
}
async function postJSON(url, headers, body) {
  const r = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(body) });
  let d = {};
  try { d = await r.json(); } catch (e) { d = { error: { message: "Bad response" } }; }
  return { ok: r.ok, status: r.status, d: d };
}
async function callGroq(env, model, messages, maxTokens) {
  const key = (env && env.GROQ_KEY) || EMBEDDED.GROQ;
  return postJSON("https://api.groq.com/openai/v1/chat/completions", { Authorization: "Bearer " + key, "Content-Type": "application/json" }, {
    model: model, messages: textOnly(messages), temperature: 0.35, max_tokens: Math.min(maxTokens || 4096, 8192),
  });
}
async function callOpenRouter(env, model, messages, maxTokens) {
  const key = (env && env.OPENROUTER_KEY) || EMBEDDED.OPENROUTER;
  const headers = {
    Authorization: "Bearer " + key,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://github.com/ftrevino739-ctrl/Drift-OS",
    "X-Title": "Drift-OS",
  };
  var cap = Math.min(maxTokens || 4096, 32768);
  var last = await postJSON("https://openrouter.ai/api/v1/chat/completions", headers, { model: model, messages: messages, temperature: 0.35, max_tokens: cap });
  if (!last.ok && (last.status === 400 || last.status === 422) && cap > 8192) {
    last = await postJSON("https://openrouter.ai/api/v1/chat/completions", headers, { model: model, messages: messages, temperature: 0.35, max_tokens: 8192 });
  }
  return last;
}
async function callXkiro(env, model, messages, maxTokens) {
  const key = (env && env.XKIRO_KEY) || EMBEDDED.XKIRO;
  const headers = { Authorization: "Bearer " + key, "Content-Type": "application/json" };
  var caps = [Math.min(maxTokens || 4096, 32768)];
  if (caps[0] > 16384) caps.push(16384);
  if (caps[0] > 8192) caps.push(8192);
  var last = null;
  for (var i = 0; i < caps.length; i++) {
    last = await postJSON("https://api.xkiro.com/v1/chat/completions", headers, { model: model, messages: messages, temperature: 0.35, max_tokens: caps[i] });
    if (last.ok || (last.status !== 400 && last.status !== 422)) return last;
  }
  return last;
}
function extractText(d) {
  if (!d) return "";
  if (d.choices && d.choices[0] && d.choices[0].message) return d.choices[0].message.content || "";
  if (d.content && Array.isArray(d.content)) return d.content.map(function (x) { return x.text || ""; }).join("");
  if (typeof d.content === "string") return d.content;
  return "";
}
function routeModel(name) {
  if (MODEL_MAP[name]) return MODEL_MAP[name];
  if (/^(google\/gemini|qwen\/|mistralai\/|cohere\/)/.test(name)) return { p: "xkiro", m: name };
  if (name.indexOf("/") >= 0) return { p: "openrouter", m: name };
  return { p: "groq", m: "llama-3.3-70b-versatile" };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    const u = new URL(request.url);
    try {
      if (u.pathname === "/ai" && request.method === "POST") {
        const b = await request.json();
        const budget = tokenBudget(b.messages, b.max_tokens);
        const msgs = toOpenAIMessages(b.messages, (b.system && String(b.system)) || BASE);
        const name = String(b.model || "groq-llama");
        let route = routeModel(name);
        const tried = [];
        let last = null;
        const attempts = [{ p: route.p, m: route.m }];
        if (route.p === "groq") {
          attempts.push({ p: "openrouter", m: "meta-llama/llama-3.3-70b-instruct:free" });
          attempts.push({ p: "xkiro", m: XKIRO_FALLBACKS[0] });
        } else if (route.p === "xkiro") {
          attempts.push({ p: "xkiro", m: "qwen/qwen3-coder-plus:free" });
          attempts.push({ p: "openrouter", m: route.m });
        } else if (route.p === "openrouter") {
          attempts.push({ p: "groq", m: "llama-3.3-70b-versatile" });
        }
        for (let i = 0; i < attempts.length; i++) {
          const a = attempts[i];
          tried.push(a.p + ":" + a.m);
          try {
            if (a.p === "groq") last = await callGroq(env, a.m, msgs, budget);
            else if (a.p === "openrouter") last = await callOpenRouter(env, a.m, msgs, budget);
            else last = await callXkiro(env, a.m, msgs, budget);
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
