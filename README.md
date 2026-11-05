# 0XYAS Portfolio

Static Kage portfolio for [0xyas.xyz](https://www.0xyas.xyz) — Web3 growth, product building, and automation from Jakarta.

Production serves `index.html` (iframe shell) → `landing-pages/kage.html` (HTML/CSS/JS + optional Three.js WebGL scene). No React/Vite build step; Vercel deploys the repo as static files.

```bash
# local preview
python3 -m http.server 4173
# open http://127.0.0.1:4173/
```

```bash
npm test   # static smoke checks (no browser)
```
