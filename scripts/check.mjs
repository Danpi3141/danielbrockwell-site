// Checks the built site in _site/: every internal link and asset reference resolves to a file,
// every page is under the 50 KB HTML + CSS budget, and no page carries personal details
// (an email address other than the site's own contact address, or a phone number).
// Run after `npm run build`; `npm run check` also runs html-validate.
import fs from 'node:fs';
import path from 'node:path';

const OUT = '_site';
const SITE_EMAIL = JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8')).email;
const errors = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

function resolve(fromFile, ref) {
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return null;
  let target = clean.startsWith('/') ? path.join(OUT, clean) : path.join(path.dirname(fromFile), clean);
  target = decodeURIComponent(target);
  if (clean.endsWith('/')) target = path.join(target, 'index.html');
  return target;
}

const files = walk(OUT);
const css = fs.statSync(path.join(OUT, 'assets/css/site.css')).size;
const html = files.filter((f) => f.endsWith('.html'));
let links = 0;
for (const f of html) {
  const text = fs.readFileSync(f, 'utf8');
  const rel = path.relative(OUT, f);
  for (const m of text.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|data:|#)/.test(ref)) continue;
    links++;
    const t = resolve(f, ref);
    if (t && !fs.existsSync(t)) errors.push(`${rel}: broken link ${ref}`);
  }
  for (const m of text.matchAll(/id="([^"]+)"/g)) void m;
  for (const m of text.matchAll(/href="#([^"]+)"/g)) {
    if (!text.includes(`id="${m[1]}"`)) errors.push(`${rel}: no element with id ${m[1]}`);
  }
  const size = Buffer.byteLength(text) + css;
  if (size > 50 * 1024) errors.push(`${rel}: HTML + CSS is ${size} bytes, over 50 KB`);
  for (const m of text.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) {
    if (m[0] !== SITE_EMAIL) errors.push(`${rel}: an email address other than the contact address: ${m[0]}`);
  }
  if (/\b(?:\+44\s?|0)7\d{3}\s?\d{6}\b/.test(text)) errors.push(`${rel}: looks like a phone number`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log(`OK: ${html.length} pages, ${links} internal links and assets, all resolve; all pages under 50 KB with CSS (${css} bytes of CSS).`);
