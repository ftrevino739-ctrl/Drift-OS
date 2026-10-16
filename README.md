# Drift-OS

Web desktop (WebOS) with Scramjet proxy, YouTube, AI (Drift models), Camera, Movies, Gmail, Instagram, TikTok.

## Quick start (with Scramjet)

```bash
cd WebOS-Scramjet   # or clone root and npm install
npm install
npm start
```

Open http://localhost:8080

## Static WebOS only

Open `index.html` — apps that need login (Discord, IG, TikTok) require the Scramjet server (`npm start`).

## AI Worker (Cloudflare)

1. Create a Worker and paste `worker.js`
2. Set secrets: `GROQ_KEY`, `OPENROUTER_KEY`, optional `XKIRO_KEY`, `YT_KEY`, `SERPAPI_KEY`
3. Point WebOS `DDG0` / `wos:ddg` to your worker URL

## Drift models (recommended)

| Name | Backend |
|------|---------|
| Drift 1.0 | Groq Llama 3.3 70B |
| Drift 1.1 | OpenRouter DeepSeek R1 |
| Drift 1.2 | OpenRouter Gemini Flash |
| Drift 1.3 | OpenRouter Qwen 72B |
| Drift 1.4 | OpenRouter Llama 70B |

## Announcement toggle

In `index.html`:

```js
window.DRIFT_CONFIG = {
  announce: true,  // false to hide
  announceTitle: 'Drift has been updated',
  announceBody: '...'
};
```

## License

AGPL for Scramjet components (Mercury Workshop). WebOS UI provided as-is for personal use.
