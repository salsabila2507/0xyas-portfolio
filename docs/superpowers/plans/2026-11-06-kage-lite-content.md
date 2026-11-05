# Kage Lite + Factual Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (single executor; user already approved implementation + PR). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the Kage portfolio look, lighten default WebGL/preloader behavior, and add factual project cards + copy—then open a PR (no production merge).

**Architecture:** Static site. Nearly all edits in `landing-pages/kage.html` (DOM + CSS grid + JS defaults). `index.html` meta only. Node smoke tests parse HTML/JS source without a browser.

**Tech Stack:** Static HTML/CSS/JS, Three.js (existing local bundle), Vercel static, Node test runner (no new deps).

## Global Constraints

- Preserve Kage visual identity (colors, JP chrome, imagery, card chrome). No typography-first redesign.
- Contact hrefs must remain byte-identical: `mailto:arkhanalghozali18&#64;gmail.com`, `https://x.com/calbuldelis69`, `https://github.com/salsabila2507`, `https://www.linkedin.com/in/imam-i`, `https://t.me/invisiblefoxyasuo`.
- No unsupported metrics (`57K`, `2M+`, `Projects scaled`). No `(self-reported role)` disclaimers in public copy. No bounty/target disclosures.
- Discord automation / CM / moderator: normal capability wording, no invented bot names/metrics.
- Squeek Heist wording from its README (“driven by Squeektoshi's real wheel”), not “live-wheel”.
- Only first three Selected Work cards may use `data-view` (GL cameras). Extra cards static.
- Default `WANT_POST` off unless `?post=1`; lower DPR defaults; earlier unlock on REDUCE/LOW/COARSE.
- Feature branch PR only; do not merge/deploy production.
- No browser automation from Shell; static tests only.

## File map

| File | Responsibility |
|------|----------------|
| `tests/kage-lite-smoke.mjs` | Content + structure + GL-budget + contact immutability checks |
| `landing-pages/kage.html` | Content, CSS grid, lighter defaults, early unlock |
| `index.html` | Meta/OG factual summary |
| `README.md` | Accurate static/Three description |

---

### Task 1: Smoke tests (RED)

**Files:**
- Create: `tests/kage-lite-smoke.mjs`
- Create: `package.json` with `"test": "node tests/kage-lite-smoke.mjs"` (minimal)

- [ ] **Step 1: Write failing smoke tests** asserting required project titles, forbidden metrics, contact href freeze, ≤3 pathway `data-view` cards, `WANT_POST` default pattern, auto-fit cards CSS, no-webgl CSS present, early unlock helpers.
- [ ] **Step 2: Run tests — expect FAIL** on missing content.
- [ ] **Step 3: Commit** test harness only.

### Task 2: Content + CSS + JS lite defaults (GREEN)

**Files:**
- Modify: `landing-pages/kage.html`
- Modify: `index.html`
- Modify: `README.md`

- [ ] **Step 1: Replace gate stats + about body; expand Selected Work cards; update capabilities + footer projects.**
- [ ] **Step 2: CSS auto-fit grid; static card frame class; stagger only first three.**
- [ ] **Step 3: JS — WANT_POST default off; DPR caps; trim particle counts; early unlock for REDUCE/LOW/COARSE; keep 4s outer bound.**
- [ ] **Step 4: Run smoke tests — expect PASS.**
- [ ] **Step 5: Commit.**

### Task 3: Self-review, push once, open PR

- [ ] Diff review: no secrets, contact unchanged, no production merge.
- [ ] Push `kage-lite-content-20261106` once; `gh pr create` into `main`.
- [ ] Note preview/checks if available; list unverified visual runtime items.

## Spec coverage self-review

| Spec requirement | Task |
|------------------|------|
| Keep Kage identity | Task 2 (no redesign) |
| Lighter GL defaults / preloader | Task 2 step 3 |
| Factual cards / stats removal | Task 2 step 1 + Task 1 tests |
| Static extra cards / GL budget | Task 1 + Task 2 |
| Contact freeze | Task 1 + Task 2 |
| README fix | Task 2 |
| PR not merge | Task 3 |

