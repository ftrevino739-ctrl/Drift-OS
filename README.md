# Drift-OS / Northwind Atlas

Web desktop with Scramjet proxy, YouTube, Drift AI, Chat, Games, Gimkit, Classroom, Canva, Roblox.

## Quick start (Scramjet / Railway)

```bash
npm install --legacy-peer-deps
npm start
```

Open http://localhost:8080 (Railway injects `PORT`).

## Vercel (static only)

- Output Directory: `public`
- Full Scramjet proxy will **not** work on Vercel (no `/wisp`).

## Access gate

- Hardware ID fixed to `1`
- Password verified with **SHA-256** (`DRIFT_ACCESS.passwordHash`)
- Owner panel: `?owner=YOUR_PIN` → hash a new password

## AI features

- **Thinking** panel for models flagged with think (DeepSeek / Qwen-style)
- **Caveman** mode: minimal answers
- **Custom instructions** (saved on device)
- Say **open Browser** → AI emits `OPEN_APP:browser` and the OS opens it
- Model list: hover **⋯** for capabilities (code / vision / thinking) — no separate About page
- Markdown: **bold**, tables (`| col |`), code blocks with copy/download/preview

## Apps

Chat (Discord-style channels), Games + local leaderboard, Gimkit join, Classroom, Canva, Roblox, Netflix-style Movies.

## Gimkit cheat

The userscript from TheLazySquid needs **Tampermonkey** in a normal browser tab (`GM_*` APIs). It cannot fully run inside a locked iframe.

## Worker secrets (Cloudflare)

`GROQ_KEY`, `OPENROUTER_KEY`, optional `XKIRO_KEY`, `YT_KEY`.

## License

AGPL for Scramjet (Mercury Workshop). UI as-is for personal use.
