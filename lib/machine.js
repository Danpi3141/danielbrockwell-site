// Machine-readable views of the site, for search engines, feed readers and LLM agents:
//   lastModified  - the date a page last changed (sitemap, JSON-LD dateModified)
//   jsonLd        - schema.org structured data for a page (one @graph per page, in base.njk)
//   htmlToMd      - rendered page content as Markdown (the full text in llms.txt)
//   facts         - the facts a program or project page shows from its front matter, as text
// Everything here reads the same front matter the pages do, so the views cannot disagree with them.
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'src';
const read = (f) => JSON.parse(fs.readFileSync(path.join(SRC, '_data', f), 'utf8'));
export const site = read('site.json');
export const person = read('person.json');
export const models = read('models.json');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const toDate = (d) => (d instanceof Date ? d : new Date(d));
export const iso = (d) => (d ? toDate(d).toISOString().slice(0, 10) : undefined);
export const dateLong = (d) => { const x = toDate(d); return `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };
export const abs = (u) => (/^[a-z]+:/i.test(u) ? u : site.url + u);
export const STATUS_LABELS = {
  released: 'Released', ongoing: 'Ongoing research', 'working-build': 'Working build', 'in-development': 'In development', planned: 'Planned', exploring: 'Exploring',
};
const LICENCE_URLS = { MIT: 'https://opensource.org/licenses/MIT' };

// ---------------------------------------------------------------------------------------------
// Last-modified dates: the newest of the page's own `updated`, the last git commit of its source
// file (today if it has uncommitted changes), and, for a section page, the `updated` of every entry
// it lists.
let git;
function gitFacts() {
  if (git) return git;
  git = { dates: new Map(), dirty: new Set(), ok: true };
  try {
    const log = execFileSync('git', ['log', '--format=@%cI', '--name-only', '--', SRC], { encoding: 'utf8', maxBuffer: 1 << 26 });
    let date;
    for (const line of log.split('\n')) {
      if (line.startsWith('@')) date = line.slice(1, 11);
      else if (line.trim() && !git.dates.has(line.trim())) git.dates.set(line.trim(), date);
    }
    const st = execFileSync('git', ['status', '--porcelain', '--', SRC], { encoding: 'utf8' });
    for (const line of st.split('\n')) if (line.trim()) git.dirty.add(line.slice(3).split(' -> ').pop().trim().replace(/^"|"$/g, ''));
  } catch { git.ok = false; }
  return git;
}
function fileDate(inputPath) {
  if (!inputPath) return undefined;
  const rel = inputPath.replace(/\\/g, '/').replace(/^\.\//, '');
  const g = gitFacts();
  // changed since the last commit (or in an untracked folder): it is being changed today
  if (g.ok && (g.dirty.has(rel) || [...g.dirty].some((d) => d.endsWith('/') && rel.startsWith(d)))) return iso(new Date());
  if (g.ok && g.dates.has(rel)) return g.dates.get(rel);
  try { return iso(fs.statSync(rel).mtime); } catch { return undefined; }
}

// The entries a section page lists, by its URL.
export function listedBy(url, collections) {
  const programs = collections.programs || [], projects = collections.projects || [];
  if (url === '/') return [...programs, ...projects];
  if (url === '/psion/') return programs;
  if (url === '/android/' || url === '/personal/') return projects.filter((i) => i.data.section === url.slice(1, -1));
  return [];
}

export function lastModified(inputPath, url, data, collections) {
  const dates = [fileDate(inputPath), iso(data.updated), ...listedBy(url, collections).map((i) => iso(i.data.updated))];
  return dates.filter(Boolean).sort().at(-1);
}

// ---------------------------------------------------------------------------------------------
// Downloads and facts shared by the JSON-LD and llms.txt.
const fileFacts = new Map();
export function fileInfo(rel) {
  rel = rel.replace(/^\//, '');
  if (!fileFacts.has(rel)) {
    const buf = fs.readFileSync(path.join(SRC, rel));
    fileFacts.set(rel, { bytes: buf.length, sha256: crypto.createHash('sha256').update(buf).digest('hex') });
  }
  return fileFacts.get(rel);
}
export function newestVersion(files) {
  return (files || []).map((f) => String(f.version)).sort((a, b) => b.localeCompare(a, 'en', { numeric: true }))[0];
}
// The newest version's files, the main download first (Organiser files zip, else the build).
export function currentFiles(data) {
  const v = newestVersion(data.files);
  if (!v) return [];
  const cur = data.files.filter((f) => String(f.version) === v);
  const main = cur.find((f) => f.kind === 'psion') || cur.find((f) => (f.kind || 'build') === 'build') || cur[0];
  return [main, ...cur.filter((f) => f !== main)];
}
export function fileLabel(f, data) {
  const kind = f.kind || 'build';
  if (kind === 'psion') return 'Organiser files (zip), for a real Organiser';
  if (kind === 'source') return 'Source + build (zip)';
  return data.section === 'android' ? 'Android APK' : 'Pack image (.opk), for emulators and pack writers';
}
// A Psion program has its own `models` table (an object); every page also sees the global
// `models` list (an array, from _data/models.json), which does not count.
export const isProgram = (data) => Boolean(data.models) && !Array.isArray(data.models);
export function worksOn(data) {
  if (!isProgram(data)) return [];
  return models.filter((m) => data.models?.[m.id]?.state === 'works');
}
export function platform(data) {
  if (isProgram(data)) {
    const ok = worksOn(data).map((m) => m.name);
    return `Psion Organiser II (${ok.length === models.length ? 'all models: ' : ''}${ok.join(', ')})`;
  }
  return data.section === 'android' ? 'Android' : undefined;
}

// ---------------------------------------------------------------------------------------------
// JSON-LD. Every page has the WebSite, the Person (in full on the pages about Daniel) and its own
// WebPage; entry pages add the program or project and a breadcrumb trail.
const ID = { person: `${site.url}/#person`, website: `${site.url}/#website` };

function personNode(full) {
  const p = { '@type': 'Person', '@id': ID.person, name: site.name, url: `${site.url}/` };
  if (!full) return p;
  return {
    ...p,
    description: site.description,
    jobTitle: person.jobTitle,
    worksFor: { '@type': 'Organization', name: person.worksFor },
    alumniOf: { '@type': 'CollegeOrUniversity', name: person.alumniOf },
    hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: person.degree },
    knowsAbout: person.knowsAbout,
    award: person.records.map((r) => r.text),
    email: `mailto:${site.email}`,
    sameAs: [site.github].filter(Boolean),
  };
}

function pageType(url) {
  return ({
    '/about/': ['AboutPage', 'ProfilePage'], '/cv/': 'ProfilePage', '/contact/': 'ContactPage',
    '/psion/': 'CollectionPage', '/android/': 'CollectionPage', '/personal/': 'CollectionPage',
  })[url] || 'WebPage';
}

function crumbs(ctx) {
  const url = ctx.page.url;
  let trail = null;
  if (isProgram(ctx)) {
    const group = ctx.category === 'game' ? 'Games' : 'Utilities';
    trail = [['Psion', '/psion/'], [group, `/psion/#${group.toLowerCase()}`], [ctx.title, url]];
  } else if (ctx.section === 'android' || ctx.section === 'personal') {
    if (url !== `/${ctx.section}/`) trail = [[ctx.section === 'android' ? 'Android' : 'Personal', `/${ctx.section}/`], [ctx.title, url]];
  } else if (ctx.section === 'psion' && url !== '/psion/') {
    trail = [['Psion', '/psion/'], [ctx.title, url]];
  }
  if (!trail) return null;
  return {
    '@type': 'BreadcrumbList', '@id': `${site.url}${url}#breadcrumb`,
    itemListElement: trail.map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(u) })),
  };
}

function entryNode(ctx, url) {
  const isApp = ctx.section === 'android';
  const author = { '@id': ID.person };
  const shots = [...(ctx.animations || []), ...(ctx.screenshots || [])].map((s) => abs(s.src));
  if (isProgram(ctx) || isApp) {
    const files = currentFiles(ctx);
    const main = files[0];
    const dates = (ctx.files || []).map((f) => iso(f.date)).sort();
    const app = {
      '@type': 'SoftwareApplication', '@id': `${url}#software`, name: ctx.title, description: ctx.summary, url,
      applicationCategory: ctx.category === 'utility' ? 'UtilitiesApplication' : 'GameApplication',
      operatingSystem: platform(ctx),
      softwareVersion: newestVersion(ctx.files) || (ctx.version ? String(ctx.version) : undefined),
      creativeWorkStatus: STATUS_LABELS[ctx.status],
      datePublished: dates[0],
      dateModified: iso(ctx.updated),
      author, creator: author,
      mainEntityOfPage: { '@id': url },
      inLanguage: 'en-GB',
      screenshot: shots.length ? shots : undefined,
    };
    if (main) {
      const rel = `${ctx.downloadDir}${main.file}`;
      Object.assign(app, {
        downloadUrl: abs(rel),
        fileSize: `${fileInfo(rel).bytes} bytes`,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP', url },
      });
    }
    if (ctx.licence) app.license = LICENCE_URLS[ctx.licence] || ctx.licence;
    if (ctx.pack) app.storageRequirements = `A ${ctx.pack} pack or larger`;
    const free = worksOn(ctx).map((m) => ctx.models[m.id].free).filter(Boolean);
    if (free.length) app.memoryRequirements = `${Math.min(...free).toLocaleString('en-GB')} bytes of free memory`;
    const latest = (ctx.changelog || [])[0];
    if (latest) app.releaseNotes = latest.change;
    return app;
  }
  // a personal project: a piece of research, with its sources
  return {
    '@type': 'CreativeWork', '@id': `${url}#work`, name: ctx.title, description: ctx.summary, url,
    creativeWorkStatus: STATUS_LABELS[ctx.status],
    dateModified: iso(ctx.updated),
    author, creator: author,
    mainEntityOfPage: { '@id': url },
    citation: (ctx.proof || []).map((l) => ({ '@type': 'WebPage', name: l.label, url: l.url })),
    isPartOf: { '@id': `${site.url}/personal/` },
  };
}

export function jsonLd(ctx) {
  const url = `${site.url}${ctx.page.url}`;
  const about = ['/', '/about/', '/cv/'].includes(ctx.page.url);
  const isEntry = Boolean(ctx.summary && ctx.status);
  const crumb = crumbs(ctx);
  const webpage = {
    '@type': pageType(ctx.page.url), '@id': url, url,
    name: ctx.page.url === '/' ? site.name : ctx.title,
    description: ctx.description || ctx.summary || site.description,
    inLanguage: 'en-GB',
    isPartOf: { '@id': ID.website },
    dateModified: lastModified(ctx.page.inputPath, ctx.page.url, ctx, ctx.collections || {}),
  };
  if (ctx.page.url.startsWith('/work/')) webpage.author = { '@id': ID.person };
  if (about) webpage[ctx.page.url === '/' ? 'about' : 'mainEntity'] = { '@id': ID.person };
  if (isEntry) webpage.mainEntity = { '@id': `${url}#${isProgram(ctx) || ctx.section === 'android' ? 'software' : 'work'}` };
  if (crumb) webpage.breadcrumb = { '@id': crumb['@id'] };
  const listed = listedBy(ctx.page.url, ctx.collections || {});
  if (ctx.page.url !== '/' && listed.length) {
    webpage.mainEntity = {
      '@type': 'ItemList',
      itemListElement: listed.map((i, n) => ({ '@type': 'ListItem', position: n + 1, url: abs(i.url), name: i.data.title })),
    };
  }
  if (ctx.page.url === '/cv/') webpage.significantLink = abs('/downloads/cv/daniel-brockwell-cv.pdf');
  const graph = [
    { '@type': 'WebSite', '@id': ID.website, url: `${site.url}/`, name: site.name, description: site.description, inLanguage: 'en-GB', publisher: { '@id': ID.person } },
    personNode(about),
    webpage,
  ];
  if (isEntry) graph.push(entryNode(ctx, url));
  if (crumb) graph.push(crumb);
  // drop undefined fields, and keep "</script>" from ever appearing inside the block
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, (k, v) => (v === undefined ? undefined : v))
    .replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

// ---------------------------------------------------------------------------------------------
// HTML to Markdown, for the page content markdown-it renders (headings, paragraphs, lists, links,
// tables, code). Elements hidden from screen readers or printed only are left out.
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', times: '×', minus: '−', middot: '·', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', copy: '©' };
export const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#'
  ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
  : ENTITIES[e] ?? m));
const VOID = new Set(['br', 'img', 'hr', 'input', 'meta', 'link', 'source', 'wbr']);
const BLOCK = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'pre', 'table', 'blockquote', 'hr', 'div', 'section', 'article', 'header', 'footer', 'nav', 'figure', 'figcaption', 'main', 'aside', 'details', 'summary', 'dl', 'dt', 'dd']);

function parse(html) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+|<)/g;
  for (const m of html.matchAll(re)) {
    const [all, close, tagRaw, attrStr, selfClose, text] = m;
    if (all.startsWith('<!--')) continue;
    const top = stack.at(-1);
    if (text !== undefined) { top.children.push(decode(text)); continue; }
    const tag = tagRaw.toLowerCase();
    if (close) { const i = stack.map((n) => n.tag).lastIndexOf(tag); if (i > 0) stack.length = i; continue; }
    const attrs = {};
    for (const a of attrStr.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? a[4] ?? '');
    const node = { tag, attrs, children: [] };
    top.children.push(node);
    if (!VOID.has(tag) && !selfClose) stack.push(node);
  }
  return root;
}

const hidden = (n) => typeof n !== 'string' && (n.attrs['aria-hidden'] === 'true' || /\bprint-only\b/.test(n.attrs.class || '') || ['script', 'style', 'svg', 'template'].includes(n.tag));
const textOf = (n) => (typeof n === 'string' ? n : n.children.map(textOf).join(''));

function inline(nodes) {
  let s = '';
  for (const n of nodes) {
    if (typeof n === 'string') { s += n.replace(/\s+/g, ' '); continue; }
    if (hidden(n)) continue;
    const inner = () => inline(n.children);
    switch (n.tag) {
      case 'br': s += '\n'; break;
      case 'strong': case 'b': { const t = inner().trim(); s += t ? `**${t}**` : ''; break; }
      case 'em': case 'i': { const t = inner().trim(); s += t ? `*${t}*` : ''; break; }
      case 'code': s += `\`${textOf(n).replace(/\s+/g, ' ')}\``; break;
      case 'img': s += n.attrs.alt ? `![${n.attrs.alt}](${abs(n.attrs.src || '')})` : ''; break;
      case 'a': {
        const t = inner().trim(), href = n.attrs.href || '';
        if (!href || href.startsWith('#')) s += t;
        else { const u = abs(href); s += t === u || `mailto:${t}` === u ? `<${t}>` : `[${t}](${u})`; }
        break;
      }
      default: s += inner();
    }
  }
  return s;
}

const tidy = (s) => s.replace(/[ \t]*\n[ \t]*/g, '\n').trim();

function blocks(nodes, depth = 0) {
  const out = [];
  let run = [];
  const flush = () => { const t = tidy(inline(run)); if (t) out.push(t); run = []; };
  for (const n of nodes) {
    if (typeof n === 'string' || !BLOCK.has(n.tag)) { if (typeof n === 'string' || !hidden(n)) run.push(n); continue; }
    flush();
    if (hidden(n)) continue;
    const t = n.tag;
    if (/^h[1-6]$/.test(t)) out.push(`${'#'.repeat(Math.min(6, Number(t[1]) + headingShift))} ${inline(n.children).trim()}`);
    else if (t === 'p' || t === 'dt' || t === 'summary') { const x = tidy(inline(n.children)); if (x) out.push(x); }
    else if (t === 'figcaption') { const x = inline(n.children).trim(); if (x) out.push(`*${x}*`); }
    else if (t === 'hr') out.push('---');
    else if (t === 'pre') out.push(`\`\`\`\n${textOf(n).replace(/\n$/, '')}\n\`\`\``);
    else if (t === 'blockquote') out.push(blocks(n.children, depth).split('\n').map((l) => `> ${l}`.trimEnd()).join('\n'));
    else if (t === 'ul' || t === 'ol') {
      let k = Number(n.attrs.start || 1);
      const items = n.children.filter((c) => typeof c !== 'string' && c.tag === 'li' && !hidden(c)).map((li) => {
        const mark = t === 'ol' ? `${k++}. ` : '- ';
        const body = blocks(li.children, depth + 1).replace(/\n\n(?=\s*(?:- |\d+\. ))/g, '\n');
        return mark + body.split('\n').map((l, i) => (i && l ? ' '.repeat(mark.length) + l : l)).join('\n');
      });
      out.push(items.join('\n'));
    } else if (t === 'table') {
      const rows = [];
      const walk = (x) => { for (const c of x.children) if (typeof c !== 'string') (c.tag === 'tr' ? rows.push(c) : walk(c)); };
      walk(n);
      const cells = rows.map((r) => r.children.filter((c) => typeof c !== 'string' && (c.tag === 'td' || c.tag === 'th'))
        .map((c) => inline(c.children).replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|')));
      if (cells.length) {
        const w = Math.max(...cells.map((r) => r.length));
        const line = (r) => `| ${Array.from({ length: w }, (_, i) => r[i] ?? '').join(' | ')} |`;
        out.push([line(cells[0]), `|${' --- |'.repeat(w)}`, ...cells.slice(1).map(line)].join('\n'));
      }
    } else out.push(blocks(n.children, depth));
  }
  flush();
  return out.filter(Boolean).join('\n\n');
}

// `shift` moves every heading down that many levels, to nest a page's headings under its title.
let headingShift = 0;
export function htmlToMd(html, shift = 0) {
  headingShift = shift;
  return blocks(parse(html || '').children).replace(/\n{3,}/g, '\n\n').trim();
}

// ---------------------------------------------------------------------------------------------
// The facts a program or project page shows beside its text, as Markdown lines.
export function facts(data, url) {
  const L = [];
  const v = newestVersion(data.files) || (data.version ? String(data.version) : null);
  L.push(`- Status: ${STATUS_LABELS[data.status]}`);
  if (v) L.push(`- Version: ${v}`);
  L.push(`- Updated: ${dateLong(data.updated)}`);
  if (data.category) L.push(`- Category: ${data.category === 'game' ? 'Game' : 'Utility'}`);
  const pf = platform(data);
  if (pf) L.push(`- Platform: ${pf}`);
  if (isProgram(data)) {
    const no = models.filter((m) => data.models[m.id]?.state === 'no').map((m) => m.name);
    const untested = models.filter((m) => data.models[m.id]?.state === 'untested').map((m) => m.name);
    if (no.length) L.push(`- Does not run on: ${no.join(', ')}`);
    if (untested.length) L.push(`- Untested on: ${untested.join(', ')}`);
    const free = worksOn(data).filter((m) => data.models[m.id].free).map((m) => `${m.name} ${data.models[m.id].free.toLocaleString('en-GB')} bytes`);
    if (free.length) L.push(`- Free memory needed: ${free.join('; ')}`);
  }
  if (data.memory_note) L.push(`- Memory: ${data.memory_note}`);
  if (data.pack) L.push(`- Pack: ${data.pack} or larger`);
  if (data.needs) L.push(`- What you need: ${data.needs}`);
  if (data.licence) L.push(`- Licence: ${data.licence}`);
  if (data.tested_on) L.push(`- Tested on: ${data.tested_on}`);
  for (const l of data.proof || []) L.push(`- Source for the record: [${l.label}](${l.url})`);
  const cur = currentFiles(data);
  if (cur.length) {
    L.push('- Downloads (current version):');
    for (const f of cur) {
      const rel = `${data.downloadDir}${f.file}`, info = fileInfo(rel);
      L.push(`  - ${fileLabel(f, data)}: ${abs(rel)} (${info.bytes.toLocaleString('en-GB')} bytes, SHA-256 ${info.sha256})`);
    }
  } else if (data.offers_download || isProgram(data)) {
    L.push('- Downloads: not released yet');
  }
  const older = (data.files || []).filter((f) => String(f.version) !== v);
  if (older.length) L.push(`- Older versions: ${older.map((f) => abs(`${data.downloadDir}${f.file}`)).join(', ')}`);
  for (const l of data.links || []) if (!(data.proof || []).some((p) => p.url === l.url)) L.push(`- Link: [${l.label}](${abs(l.url)})`);
  if (data.changelog?.length) {
    L.push('- Changelog:');
    for (const c of data.changelog) L.push(`  - ${dateLong(c.date)}, version ${c.version}: ${c.change}`);
  }
  if (url) L.push(`- Page: ${abs(url)}`);
  return L.join('\n');
}

// RFC 822 dates for RSS, and XML escaping.
export const rfc822 = (d) => toDate(d).toUTCString().replace('GMT', '+0000');
export const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
