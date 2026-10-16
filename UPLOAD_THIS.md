# Your GitHub `public/index.html` is OUTDATED

Verified: the file on `main` is still the old **WebOS + Scramjet** build (no Northwind gate, no new AI/Gimkit inject).

## Fix (2 minutes)

1. Download the latest `WebOS-index.html` from the chat.
2. GitHub → Drift-OS → `public/index.html` → pencil or **Upload files**.
3. Replace the file (same name `index.html` inside `public/`).
4. Railway → Redeploy.

## Gimkit (no extension)

The new app opens Gimkit **inside Scramjet** and injects [GimkitCheat](https://github.com/TheLazySquid/GimkitCheat) using a Tampermonkey **polyfill** (`GM_getValue` / `GM_setValue` / `GM_deleteValue` / `GM_xmlhttpRequest`).

Requires Scramjet host online (Railway `npm start`), not static Vercel alone.
