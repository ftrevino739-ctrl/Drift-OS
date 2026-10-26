# Drift-OS

Web Operating system for (school)

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
- **Total access** to all Drift apps
- Model list: hover **⋯** for capabilities (code / vision / thinking) — no separate About page
- Markdown: **bold**, tables (`| col |`), code blocks with copy/download/preview

## Apps

- Chat (Discord-style channels) 
- Games (PENDING FIXES but WORKING)
- local leaderboard
- Gimkit join (modified)
- Classroom (SOON MODIFIED)
- VS Code (with AI)
- Canva
- Roblox (PENDING fixes only for ChromeOS)
- Discord
- Youtube (Shorts and Video Search)
- Tiktok
- Instagram
- Gemini AI
- Netflix-style
- Movies
- Camera (VIDEO AND AUDIO)
- ClassDojo 
- JS injector (injects .js just as tampermonkey without extension)
- Music 
- Github
- Wayground (Modified)
- WhatsApp (PENDING FIXES)
- Calculator (Basic, Scientific and Convert)
- ESPN
- Gmail (PENDING FIXES)
- Working Browser (Bing, DuckDuckGo and Google)
- AI: 4 Drift AI models,  LLama 3.1 8B, Gemma 2 9B, Mistral Mini, Qwen Flash, Gemma 2 (LOCAL) and Gemini Nano all this with custom instructions, Effort; Medium, High and Low.

## Gimkit and Wayground Cheat

Gimkit: The userscript from TheLazySquid needs **Tampermonkey** in a normal browser tab (`GM_*` APIs). It cannot fully run inside a locked iframe.
Wayground: Same as gimkit it uses a Userscript ByOSCARPINE that requieres a API key from Gemini AI studio but we modified taht so it uses Drift AI


## Worker secrets (Cloudflare)

`GROQ_KEY`, `OPENROUTER_KEY`, optional `XKIRO_KEY`, `YT_KEY`.

## License

AGPL for Scramjet (Mercury Workshop). UI as-is for personal use.
