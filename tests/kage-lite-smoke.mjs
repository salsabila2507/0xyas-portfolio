#!/usr/bin/env node
/**
 * Static smoke checks for Kage lite + factual content.
 * No browser / WebGL — parses source only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kagePath = path.join(root, 'landing-pages', 'kage.html');
const indexPath = path.join(root, 'index.html');

const CONTACT = [
  'mailto:arkhanalghozali18&#64;gmail.com',
  'https://x.com/calbuldelis69',
  'https://github.com/salsabila2507',
  'https://www.linkedin.com/in/imam-i',
  'https://t.me/invisiblefoxyasuo',
];

const REQUIRED_TITLES = [
  'Bountix',
  'Xora Finance',
  'X Post Analyzer',
  'iNeedCodes',
  'iNeed',
  'Squeek City',
  'Squeek Heist',
  'ineedhood Hunt',
  'Automation',
];

const REQUIRED_URLS = [
  'https://bountix-stellar.vercel.app',
  'https://xora.finance',
  'https://app.0xyas.xyz',
  'https://ineed.codes',
  'https://ineed.web.id',
  'https://squeekcity.space',
  'https://salsabila2507.github.io/squeek-heist/',
  'https://ineedhood-hunt.vercel.app',
];

const FORBIDDEN = [
  /57K/i,
  /2M\+/,
  /Projects scaled/i,
  /\(self-reported role\)/i,
  /live-wheel/i,
];

let failed = 0;
function ok(name, cond, detail = '') {
  if (cond) console.log(`PASS  ${name}`);
  else {
    failed++;
    console.error(`FAIL  ${name}${detail ? ' — ' + detail : ''}`);
  }
}

const kage = fs.readFileSync(kagePath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');

// Parse #pathways cards block
const pathways = kage.match(/id="pathways"[\s\S]*?(?=<section class="sec" id="lessons")/);
ok('pathways section present', !!pathways);
const pathwaysHtml = pathways ? pathways[0] : '';

const cardArticles = [...pathwaysHtml.matchAll(/<article\b[^>]*class="[^"]*\bcard\b[^"]*"[^>]*>/g)];
ok('at least 8 selected-work cards', cardArticles.length >= 8, `got ${cardArticles.length}`);

const dataViewsInPathways = [...pathwaysHtml.matchAll(/data-view="(\d+)"/g)];
ok('pathways data-view count ≤ 3', dataViewsInPathways.length <= 3, `got ${dataViewsInPathways.length}`);

for (const title of REQUIRED_TITLES) {
  ok(`card title: ${title}`, pathwaysHtml.includes(`<b>${title}</b>`) || pathwaysHtml.includes(`>${title}<`));
}
for (const url of REQUIRED_URLS) {
  ok(`project url present: ${url}`, kage.includes(url));
}

ok('Squeek Heist uses real-wheel wording', /Squeektoshi'?s real wheel/i.test(kage));
ok('Squeek City notes collaboration', /0xyas\s*&\s*Jex|Built by 0xyas/i.test(kage) || /with Jex/i.test(kage));
ok('ineedhood marked playtest', /playtest/i.test(pathwaysHtml));
ok('Discord automation capability', /Discord/i.test(kage) && /moderat/i.test(kage));
ok('Community management capability', /community management/i.test(kage));

for (const re of FORBIDDEN) {
  ok(`forbidden absent: ${re}`, !re.test(kage) && !re.test(index));
}

for (const href of CONTACT) {
  const count = kage.split(href).length - 1;
  ok(`contact href retained (${href.slice(0, 40)}…)`, count >= 1, `count=${count}`);
}

ok('cards CSS uses auto-fit or auto-fill', /\.cards\s*\{[^}]*grid-template-columns:\s*repeat\(auto-(fit|fill)/.test(kage));
ok('static card frame class exists', /\.card--static|\.card-fr--static|\.card\.static/.test(kage) || /card--static/.test(kage));
ok('no-webgl card-fr fallback CSS present', /\.no-webgl\s+\.card-fr/.test(kage));
ok('WANT_POST defaults off unless post=1', /WANT_POST\s*=\s*qs\(\s*['"]post['"]\s*,\s*['"]0['"]\s*\)/.test(kage));
ok('DPR_CAP high ≤ 1.15', /DPR_CAP\s*=\s*qn\(\s*['"]dpr['"]\s*,\s*LOW\s*\?\s*1\s*:\s*1\.15\s*\)/.test(kage));
ok('early unlock helper for lite path', /earlyUnlock|unlockLite|CONTENT_FIRST|unlockContent/.test(kage));
ok('index meta mentions products factually', /iNeedCodes|Bountix|Web3/i.test(index));
ok('README is not claiming React Vite as production stack', !/Built with React, Vite/i.test(fs.readFileSync(path.join(root, 'README.md'), 'utf8')));


ok('default q is low (lite desktop)', /const HI\s*=\s*qs\(\s*['"]q['"]\s*,\s*['"]low['"]\s*\)/.test(kage));
ok('nogl short-circuits boot via fallback', /qs\(\s*['"]nogl['"].*\)\s*!==\s*['"]0['"]/.test(kage) && /if\s*\([^)]*nogl[^)]*\)[\s\S]{0,120}?fallback\s*\(/.test(kage));
ok('noscript hides preloader / reveals content', /<noscript>[\s\S]*?#pre[\s\S]*?display\s*:\s*none/i.test(kage));
ok('fg-sky sits under .page (decorative behind text)', /#fg-sky\s*\{[^}]*z-index:\s*([0-9]+)/.test(kage) && (m => m && +m[1] < 10)(kage.match(/#fg-sky\s*\{[^}]*z-index:\s*([0-9]+)/)));
ok('section content above in-section .fg', /\.sec\s*>\s*\*:not\(\.fg\)[^}]*z-index:\s*([4-9]|[1-9][0-9])/.test(kage));
ok('static cards use cohesive panel class', /card-panel/.test(kage) && (kage.match(/card--static/g) || []).length >= 6);
ok('static panels are not 4\/5 empty frames', !/\.card--static[^{]*\{[^}]*aspect-ratio:\s*4\s*\/\s*5/.test(kage) && /\.card-panel/.test(kage));
ok('card descriptions use stronger contrast token', /\.card-panel-desc|\.card-desc/.test(kage) && !/\.card-meta\{[^}]*color:var\(--muted\)/.test(kage.replace(/\s+/g,' ')));
ok('cur-head body wraps with min-width 0', /\.cur-head[^{]*\{[^}]*minmax\(0/.test(kage) && /\.cur-head\s+\.body-lg|\.cur-head\s*>\s*\*/.test(kage) && /overflow-wrap|word-break|min-width:\s*0/.test(kage));
ok('hero-cue contrast raised above muted', /\.hero-cue\{[^}]*color:\s*(?!var\(--muted\))[^;]+/.test(kage.replace(/\n/g,' ')));

// Syntax: balanced script tag + no obvious unclosed
const scripts = kage.match(/<script\b/gi) || [];
const scriptEnds = kage.match(/<\/script>/gi) || [];
ok('script tags balanced', scripts.length === scriptEnds.length, `${scripts.length} vs ${scriptEnds.length}`);

// Reveal / lock markers still present for progressive enhancement
ok('preloader #pre present', /id="pre"/.test(kage));
ok('is-locked used in boot', /is-locked/.test(kage));
ok('rv-in reveal class present', /rv-in/.test(kage));
ok('prefers-reduced-motion CSS present', /prefers-reduced-motion:\s*reduce/.test(kage));
ok('mobile cards 1fr rule present', /\.cards\s*\{\s*grid-template-columns:\s*1fr/.test(kage));

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log('\nAll smoke checks passed.');
