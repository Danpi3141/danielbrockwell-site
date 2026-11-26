// Checks the built site in _site/: every internal link and asset reference resolves to a file,
// every page is under the 64 KB HTML + CSS budget, and no page carries personal details
// (an email address other than the site's own contact address, or a phone number).
// The machine-readable files are checked too: every page's JSON-LD parses, and llms.txt,
// feed.xml and sitemap.xml link only to pages and files that exist.
// Run after `npm run build`; `npm run check` also runs html-validate.
import fs from 'node:fs';
import path from 'node:path';

const OUT = '_site';
const { email: SITE_EMAIL, url: SITE_URL } = JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8'));
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
const siteLinks = [];
// absolute links to this site, up to the first character that cannot be part of the URL
const siteUrlRe = new RegExp(`${SITE_URL.replace(/[.]/g, '\\.')}(?:/[^\\s)<>"'\\]]*?)?(?=[.,;:]?(?:[\\s)<>"'\\]]|$))`, 'g');
for (const f of html) {
  const text = fs.readFileSync(f, 'utf8');
  const rel = path.relative(OUT, f);
  for (const m of text.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) {
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
  if (size > 64 * 1024) errors.push(`${rel}: HTML + CSS is ${size} bytes, over 64 KB`);
  for (const m of text.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) {
    if (m[0].replace(/\.$/, '') !== SITE_EMAIL) errors.push(`${rel}: an email address other than the contact address: ${m[0]}`);
  }
  if (/\b(?:\+44\s?|0)7\d{3}\s?\d{6}\b/.test(text)) errors.push(`${rel}: looks like a phone number`);
  // structured data: every indexed page has one JSON-LD block, and it parses
  const ld = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!text.includes('<meta name="robots" content="noindex">') && ld.length !== 1) errors.push(`${rel}: ${ld.length} JSON-LD blocks (expected 1)`);
  for (const m of ld) {
    try {
      const j = JSON.parse(m[1]);
      if (j['@context'] !== 'https://schema.org' || !Array.isArray(j['@graph'])) errors.push(`${rel}: JSON-LD without @context or @graph`);
      for (const u of m[1].matchAll(siteUrlRe)) siteLinks.push([rel, u[0]]);
    } catch (e) { errors.push(`${rel}: JSON-LD does not parse: ${e.message}`); }
  }
}

// the machine-readable files: present, no personal details, and their links to this site resolve
for (const name of ['llms.txt', 'feed.xml', 'sitemap.xml', 'robots.txt']) {
  const f = path.join(OUT, name);
  if (!fs.existsSync(f)) { errors.push(`${name} is missing`); continue; }
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) {
    if (m[0].replace(/\.$/, '') !== SITE_EMAIL) errors.push(`${name}: an email address other than the contact address: ${m[0]}`);
  }
  if (/\b(?:\+44\s?|0)7\d{3}\s?\d{6}\b/.test(text)) errors.push(`${name}: looks like a phone number`);
  for (const u of text.matchAll(siteUrlRe)) siteLinks.push([name, u[0]]);
  if (name.endsWith('.xml')) {
    // well-formed enough: every element closes, in order
    const stack = [];
    for (const t of text.replace(/<\?[\s\S]*?\?>/g, '').matchAll(/<(\/?)([\w:]+)[^>]*?(\/?)>/g)) {
      if (t[3]) continue;
      if (!t[1]) stack.push(t[2]);
      else if (stack.pop() !== t[2]) { errors.push(`${name}: </${t[2]}> does not match its opening tag`); break; }
    }
    if (stack.length) errors.push(`${name}: <${stack.at(-1)}> is never closed`);
  }
}
for (const [from, u] of siteLinks) {
  const t = resolve(path.join(OUT, 'index.html'), u.slice(SITE_URL.length) || '/');
  if (t && !fs.existsSync(t)) errors.push(`${from}: links to ${u}, which does not exist`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log(`OK: ${html.length} pages, ${links} internal links and assets, all resolve; all pages under 64 KB with CSS (${css} bytes of CSS); JSON-LD parses; ${siteLinks.length} links from JSON-LD, llms.txt, the feed and the sitemap resolve.`);
