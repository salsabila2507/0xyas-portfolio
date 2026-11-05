# Design: Kage Lite + Factual Content (keep visual identity)

**Date:** 2026-11-06 (Asia/Jakarta)  
**Repo:** https://github.com/salsabila2507/0xyas-portfolio  
**Checkout:** `/workspace/0xyas-portfolio-kage-lite-20261106`  
**Branch for work:** `kage-lite-content-20261106` (from `main` @ `9bb078b`)  
**Live today:** https://www.0xyas.xyz → static Vercel project `0xyas-portfolio`; `index.html` iframes `/landing-pages/kage.html`  
**User decision:** Keep recognizable Kage design; lighten effects; add researched accomplishments. Do **not** replace with a typography-first redesign.

---

## 1. Goal & non-goals

### Goal
Make the existing Kage portfolio feel lighter and show substantial, factual work—while looking like the same site (colors, Japanese accents, section chapters, masks/imagery, dark `#05070a` world).

### Non-goals
- New visual system / typography-first rebuild / removing Japanese chapter chrome.
- Changing contact URLs, mailto, or social handles.
- Adding new paid services or CTAs beyond existing “selected remote collaborations.”
- Publishing private repo internals, undisclosed security targets, or bounty payout claims.
- Inflating or inventing metrics (including keeping unsupported `57K+` / `2M+` / `10 Projects scaled`).
- Merging to production or deploying production in this phase (feature-branch PR only).
- Claiming Discord-bot shipping from GitHub (no public Discord bot repos found); community/moderator roles may appear as **user-stated** skills, not as verified shipped products.

---

## 2. Current architecture (grounded)

| Piece | Role |
|--------|------|
| `index.html` | Thin dark shell + full-viewport iframe to Kage |
| `landing-pages/kage.html` | Entire experience: CSS (~900 lines), DOM chapters, inline JS (~3.6k lines), WebGL via local `three.min.js` |
| `landing-pages/secret-pathways-assets/` | `three.min.js` (~596KB), `fonts.css` (~100KB), foreground/generated webp (~2.5MB) |
| `vercel.json` | Static: no framework, `outputDirectory: "."` |
| Tests | **None** in HEAD (no `package.json`, no CI workflows) |

**Chapter DOM (keep ids/names):** `#top` hero → `#gate` About → `#pathways` Selected Work → `#lessons` Capabilities → `#eternity` Contact + footer.

**Progressive paths already present (reuse, do not reinvent):**
- `prefers-reduced-motion: reduce` → `REDUCE`; CSS kills some motion; JS targets ~10 FPS.
- Coarse pointer defaults `q=low` → fewer particles, lower DPR, post off by default on low.
- Query knobs: `q`, `post`, `shadow`, `dpr`, `fps`, `nogl`, `adapt`, `shot`.
- `.no-webgl` fallback CSS for gradient card frames if `initGL` fails.
- Hard unlock: `setTimeout(..., 4000)` already dismisses `#pre` and unlocks scroll—but boot still runs heavy JOBS and `is-locked` until then / until GL ready.

**Pain points to address (not redesign):**
1. Content sits behind `#pre` + `body.is-locked` while JOBS build the full Three scene.
2. Selected Work is only three cards; stats are unsupported.
3. Extra `[data-view]` cards would each get WebGL card cameras (`CARDS[]` + cloth)—multiplying cost if every new project uses `data-view`.
4. README still claims React/Vite—stale; fix in same PR as docs hygiene only.

---

## 3. Approaches considered

| | Approach | Tradeoff |
|--|----------|----------|
| **A (chosen)** | Keep Kage DOM/CSS/JS; content edits + default-to-lighter GL + safer preloader/content visibility; new project cards mostly **static** frames | Preserves identity; smallest risk; must carefully avoid exploding `CARDS` cost |
| B | Strip WebGL entirely, keep CSS/HTML look | Lightest, but loses “WebGL · ThreeUI” signature the footer advertises |
| C | New static page, archive Kage | User rejected (“pakai desain lama”) |

**Recommendation: A.**

---

## 4. Design: preserve look, lighten runtime

### 4.1 Visual identity (must keep)
- Palette, wordmark/brand SVG, Japanese labels (`山門` / `庭園` / `手業` / etc.), chapter rails, foreground webp stages, hero copy structure, card chrome (`.card-fr`, glow orbs, meta row), capability “atlas” plates, contact chapter layout.
- Do **not** restyle into Inter/light design-system from `design-system/0xyas-portfolio/MASTER.md` (that file is a legacy alternate; ignore for this work).

### 4.2 Performance / progressive enhancement (concrete)

All changes live primarily in `landing-pages/kage.html` JS/CSS unless noted.

1. **Content before GPU**
   - On `DOMContentLoaded`, ensure About / Selected Work / Capabilities / Contact text is in the DOM (already true) and **readable without WebGL**.
   - Change lock/preloader policy:
     - Keep `#pre` as optional brand moment, but **do not block reading** past a short cap (existing 4s unlock stays as outer bound; prefer unlocking scroll/`is-locked` removal as soon as first paint + fonts optional, **before** JOBS finish when `REDUCE` or `LOW` or `COARSE`).
     - If `initGL` throws → existing `fallback()` path; ensure all `[data-rv]` get `.rv-in` (already).
   - Optional small CSS: when `#pre` is visible, page underneath may remain visible at reduced opacity **or** pre dismisses earlier on `REDUCE`/`LOW` (target: first meaningful content &lt; ~1.5s on mid phone when reduced/low).

2. **Default lighter scene (desktop included, still opt-up)**
   - Flip defaults so portfolio prefers stability (comment in file already says this intent):
     - Default `WANT_POST` to **off** unless `?post=1` (today high desktop enables post).
     - Cap `DPR` default ≤ `1.15` on high, `1` on low.
     - Lower particle / maple / wisp counts slightly further on both LOW and high paths (tune constants near existing `LOW ? N : M` sites—do not remove systems).
     - Keep `WANT_SHADOW` default `0`.
   - Preserve query overrides so `?q=high&post=1` remains the “cinematic” demo mode.

3. **Card WebGL budget**
   - **Only the first three** Selected Work cards may keep `data-view` (live scissor views / cloth), reusing views `0..2` (and hero peek `3` unchanged).
   - **All additional project cards:** same HTML chrome (`.card`, `.card-fr`, `.card-lab`, `.card-meta`) **without** `data-view`, so they never enter `CARDS[]`. Use existing `.no-webgl .card-fr` gradient (or a shared static class) so they look intentional, not broken.
   - Add real outbound links via wrapping `<a>` or `article` click → URL (new): each card must open its primary URL in a new tab (`rel="noopener noreferrer"`). Do not change contact block links.

4. **Assets**
   - Do **not** delete `three.min.js` or foreground webps in v1 (identity).
   - Optional v1 stretch (only if easy): defer `<script src="…/three.min.js">` until after pre dismiss / idle callback; if deferred, ensure `fallback` still works if script fails.
   - Out of scope for v1: recompress every webp / subset fonts.css (note as follow-up).

5. **`index.html`**
   - **Keep iframe shell** for v1 (smallest deploy surface; matches current Vercel static mapping).
   - Tradeoff accepted: crawlers that ignore iframes still see thin shell meta only—mitigate by updating shell `<meta name="description">` / OG description to factual summary (no new metrics). No contact changes.

6. **Reduced motion / mobile**
   - Honor existing `@media (prefers-reduced-motion:reduce)` blocks; ensure new cards inherit reveal behavior.
   - Mobile already forces `.cards { 1fr }`; extend CSS so nth-child stagger rules cover only first three; extra cards `transform:none`.
   - Desktop: change `.cards` from fixed `repeat(3,1fr)` to auto-fit grid, e.g. `repeat(auto-fit, minmax(240px, 1fr))`, so 8–9 cards wrap without a new layout language.

---

## 5. Content: sections & candidate copy

Tone: factual, English (site language today), no hype numbers. Distinguish shipped products vs role/self-report vs collaboration.

### 5.1 `#gate` About — update body only
Keep display heading “Builder brain…”. Replace unsupported stats row and tighten body.

**Stats replacement (four cells, keep Jakarta):**
| Label | Value |
|--------|--------|
| Open-source CLI | iNeedCodes on npm |
| AI access | iNeed free tier |
| Marketplace | Bountix (Stellar live) |
| Base | GMT+7 · Jakarta |

(Exact short labels may be tightened in implementation as long as they remain non-numeric marketing claims.)

**About body (candidate):**  
Independent builder in Jakarta. Ships Web3/AI products and automation; founder of Bountix; Marketing Manager at Xora Finance (self-reported role). Builds community systems and tools people can actually open.

### 5.2 `#pathways` Selected Work — expand cards

Keep section title “Selected Work”. Update eyebrow/supporting line to: “Products, tools, and shipped playtests.”

**Card set (order = visual priority):**

| # | Title | Meta one-liner | Primary URL | Notes / evidence class | GL `data-view` |
|---|--------|----------------|-------------|------------------------|----------------|
| 01 | Bountix | Task marketplace with USDC escrow on Stellar | https://bountix-stellar.vercel.app (also mention bountix.xyz in meta/footer if desired) | Shipped public deploy; Base/ARC/Solana variants exist—**do not** claim all live equally; one primary link | yes (0) |
| 02 | Xora Finance | Marketing & growth (role) | https://xora.finance | Role self-reported; company site only | yes (1) |
| 03 | X Post Analyzer | Engagement authenticity tooling | https://app.0xyas.xyz | Repo `0xyas-app` | yes (2) |
| 04 | iNeedCodes | Autonomous CLI AI agent (MIT, npm) | https://ineed.codes | npm `ineedcodes`; GitHub stars are factual if mentioned sparingly (“open-source on GitHub”)—prefer no star flex | no |
| 05 | iNeed | Free-tier AI learning + API for beginners | https://ineed.web.id | Note maintenance banner is site truth; don’t promise uptime | no |
| 06 | Squeek City | Live Squeekchain heist game | https://squeekcity.space | **Collab: Built by 0xyas & Jex** | no |
| 07 | Squeek Heist | Small live-wheel heist game | https://salsabila2507.github.io/squeek-heist/ | Own repo | no |
| 08 | ineedhood Hunt | Browser playtest / hood games | https://ineedhood-hunt.vercel.app | Playtest/beta; source private—say “playtest”, not “open-source” | no |
| 09 | Automation | Telegram bots & trading/mint tooling | https://github.com/salsabila2507/bitget-llm-bot (or GitHub profile) | Public bots are Telegram-centric; dry-run defaults—no profit claims | no |

**Optional 10th (only if grid still calm):** ineedhood-tech — “3D office that mirrors local AI agents” — link GitHub repo; **no** fake live homepage.

**Japanese gem labels:** reuse pattern (short katakana/kanji flavor) without requiring accurate translation review; may clone existing style (`創業`, `構築`, etc.) or use `制作` / `協働` / `試験` sparingly.

**Footer Projects list:** replace the three links with the same primary set (Bountix, iNeedCodes, iNeed, Analyzer, Squeek City, ineedhood)—keep Elsewhere/contact columns unchanged.

### 5.3 `#lessons` Capabilities — light wording only
Keep five plates. Adjust copy to match evidence:
- Automation Systems: mention Telegram/API/AI workflows (not Discord-specific).
- Community Growth: may include “community management & moderation” as skill (user-stated).
- Web3 Research: “ecosystem and security research” **without** named targets, programs, or bounty results.

### 5.4 Hero chips / chapter strip
Hero already lists Growth / Automation / Contact. Optional micro-edit only if needed for consistency—no new services.

### 5.5 Explicitly excluded from public copy
- Unsupported `57K+`, `2M+`, `10 Projects scaled`.
- Bug bounty accepted/paid claims; specific vulnerability writeups.
- Private repos as if public; Discord bot as shipped GitHub proof.
- Rage-bait / outreach spam internals; personal pay/phone threads.

---

## 6. Smallest file change set

| File | Change |
|------|--------|
| `landing-pages/kage.html` | **Primary.** Stats, about, cards HTML, footer projects, CSS grid for N cards, JS defaults (post/dpr/particles), preloader/lock timing, ensure static cards skip `data-view` |
| `index.html` | Meta/OG description sync only; keep iframe |
| `README.md` | Correct “static Kage HTML + Three.js”, drop false React/Vite claim |
| `docs/superpowers/specs/2026-11-06-kage-lite-content-design.md` | This spec |
| `vercel.json` | **No change** |
| Assets under `secret-pathways-assets/` | **No delete** in v1 |
| Contact anchors | **No change** |

No new npm toolchain, no React.

---

## 7. Acceptance checks (performance & content)

Manual / scriptable without a test framework (add a short `docs/superpowers/specs/…` checklist; optional later `scripts/smoke.sh`):

1. **No-JS / broken GL:** With JS disabled or `?nogl=1` (or forced `fallback`), all new project titles and links are visible and clickable; layout remains Kage-dark, not a blank canvas.
2. **Reduced motion:** `prefers-reduced-motion: reduce` → preloader clears quickly; scroll unlocked; no reliance on WebGL for reading.
3. **Mobile width 390:** Cards stack single column; no horizontal overflow from new cards; nav burger still usable.
4. **Default desktop load:** With default query (no `?post=1`), post-processing path off; page remains interactive; cinematic mode still available via `?q=high&post=1`.
5. **Card budget:** `CARDS.length` ≤ 4 (three work cards + peek) after change—assert in code review / quick console check.
6. **Content audit:** Zero occurrences of `57K`, `2M+`, or “Projects scaled” in `kage.html` / `index.html`.
7. **Links:** Each listed primary URL returns success from a public GET (allow transient 429 on bountix.xyz; prefer stellar vercel URL as primary).
8. **Contact unchanged:** mailto + four social hrefs byte-identical to pre-change.
9. **Visual identity:** Side-by-side screenshot hero + about vs production still recognizable as Kage (human check on preview).

---

## 8. Tests & quality bar

- No automated suite exists; **do not** block v1 on adding Playwright.
- Add a minimal smoke checklist in the PR description mirroring §7.
- Optional follow-up: `smoke` script curling preview URL + `rg` for forbidden metrics.

---

## 9. Delivery / deployment policy

1. Implement only on feature branch `kage-lite-content-20261106` (or successor).
2. Open **PR into `main`**; Vercel Preview validates.
3. **Do not** merge to production / promote production deploy until user explicitly approves the preview.
4. No force-push to `main`; no direct production CLI deploy in implementation phase.

---

## 10. Tradeoffs (explicit)

- Keeping WebGL means the site will never be as light as a pure static page; we only **bias defaults down** and stop new cards from adding GL views.
- Keeping `index.html` iframe preserves deploy simplicity but weakens non-JS iframe SEO.
- Static extra cards won’t show live temple-in-card previews—acceptable to protect FPS.
- Xora remains a role card without independent employment proof in-repo.
- Community/moderator mentioned as capability, not as a dated case study with member counts.

---

## 11. Spec self-review

| Check | Result |
|--------|--------|
| Placeholders / TBD | None left for v1 scope; asset recompress deferred explicitly |
| Contradictions | Rejects typography redesign; keeps Kage; lighter ≠ remove Three |
| Scope | Single PR-sized: one HTML content/perf pass + meta/README |
| Ambiguity | Primary Bountix URL fixed to stellar vercel; GL limited to 3 cards; contact frozen |

**Ready for user review of this file before `writing-plans` / implementation.**
