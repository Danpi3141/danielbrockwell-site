// Eleventy 3 config: reads src/, writes _site/.
// Builds the program and project collections, the latest-entries list, and the filters for
// dates, byte counts and SHA-256. Runs the build checks: a missing required field, a status or
// category outside its list, or a listed file that does not exist stops the build.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { jsonLd, lastModified } from './lib/machine.js';

const SRC = 'src';
const STATUSES = ['released', 'in-use', 'ongoing', 'working-build', 'in-development', 'planned', 'exploring'];
const CATEGORIES = ['game', 'utility'];
const SECTIONS = ['android', 'personal'];
const MODEL_IDS = ['cm', 'xp', 'la', 'lz', 'lz64'];
const MODEL_STATES = ['works', 'no', 'untested'];
const FILE_KINDS = ['psion', 'build', 'source'];

const isLive = () => process.env.ELEVENTY_RUN_MODE === 'build';

// An entry is shown unless public: false, or draft: true on the live build.
export function visible(data) {
  if (data.public === false) return false;
  if (data.draft === true && isLive()) return false;
  return true;
}

const fileCache = new Map();
function fileFacts(rel) {
  if (!fileCache.has(rel)) {
    const full = path.join(SRC, rel);
    const buf = fs.readFileSync(full);
    fileCache.set(rel, { bytes: buf.length, sha256: crypto.createHash('sha256').update(buf).digest('hex') });
  }
  return fileCache.get(rel);
}

function pngSize(rel) {
  const buf = fs.readFileSync(path.join(SRC, rel));
  if (buf.toString('latin1', 0, 3) === 'GIF') return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  if (buf.toString('latin1', 1, 4) !== 'PNG') throw new Error(`${rel} is not a PNG or GIF`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function check(item, kind) {
  const d = item.data, where = item.inputPath, errs = [];
  const need = kind === 'program'
    ? ['title', 'category', 'status', 'summary', 'updated', 'models']
    : ['title', 'section', 'status', 'summary', 'updated'];
  for (const f of need) if (d[f] === undefined || d[f] === null || d[f] === '') errs.push(`missing ${f}`);
  if (d.status && !STATUSES.includes(d.status)) errs.push(`status "${d.status}" is not one of ${STATUSES.join(', ')}`);
  if (d.summary && d.summary.length > 120) errs.push(`summary is ${d.summary.length} characters (120 at most)`);
  if (kind === 'program') {
    if (d.category && !CATEGORIES.includes(d.category)) errs.push(`category "${d.category}" is not game or utility`);
    for (const m of MODEL_IDS) {
      const e = d.models?.[m];
      if (!e) errs.push(`models.${m} missing`);
      else if (!MODEL_STATES.includes(e.state)) errs.push(`models.${m}.state "${e.state}" is not works, no or untested`);
    }
  } else if (d.section && !SECTIONS.includes(d.section)) errs.push(`section "${d.section}" is not android or personal`);
  for (const f of d.files || []) {
    if (!f.file || !f.version || !f.date) errs.push('a files entry needs file, version and date');
    if (f.kind && !FILE_KINDS.includes(f.kind)) errs.push(`file kind "${f.kind}" is not build or source`);
    const rel = `downloads/${kind === 'program' ? 'psion' : d.section}/${item.fileSlug}/${f.file}`;
    if (!fs.existsSync(path.join(SRC, rel))) errs.push(`listed file ${rel} does not exist`);
  }
  for (const s of d.screenshots || []) {
    if (!s.src || !s.alt) errs.push('a screenshot needs src and alt');
    else if (!fs.existsSync(path.join(SRC, s.src.replace(/^\//, '')))) errs.push(`screenshot ${s.src} does not exist`);
  }
  for (const c of d.clips || []) {
    if (!c.src || !c.poster || !c.alt || !c.caption) errs.push('a clip needs src, poster, alt and caption');
    else for (const f of [c.src, c.poster]) if (!fs.existsSync(path.join(SRC, f.replace(/^\//, '')))) errs.push(`clip file ${f} does not exist`);
  }
  if (errs.length) throw new Error(`Build check failed for ${where}:\n  ${errs.join('\n  ')}`);
}

const statusRank = (s) => STATUSES.indexOf(s);
const byStatusThenNewest = (a, b) =>
  statusRank(a.data.status) - statusRank(b.data.status) || b.data.updated - a.data.updated || a.data.title.localeCompare(b.data.title);

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/downloads': 'downloads' });
  eleventyConfig.addPassthroughCopy({ 'src/_headers': '_headers', 'src/_redirects': '_redirects' });
  eleventyConfig.ignores.add('src/downloads/**');

  // collections ------------------------------------------------------------
  eleventyConfig.addCollection('programs', (api) => {
    const all = api.getFilteredByGlob('src/psion/programs/*.md');
    all.forEach((i) => check(i, 'program'));
    return all.filter((i) => visible(i.data)).sort(byStatusThenNewest);
  });
  eleventyConfig.addCollection('projects', (api) => {
    const all = api.getFilteredByGlob(['src/android/*.md', 'src/personal/*.md']);
    all.forEach((i) => check(i, 'project'));
    return all.filter((i) => visible(i.data)).sort(byStatusThenNewest);
  });
  eleventyConfig.addCollection('latest', (api) =>
    api.getFilteredByGlob(['src/psion/programs/*.md', 'src/android/*.md', 'src/personal/*.md'])
      .filter((i) => visible(i.data))
      .sort((a, b) => b.data.updated - a.data.updated)
      .slice(0, 3));
  eleventyConfig.addCollection('sitemap', (api) =>
    api.getAll().filter((i) => i.url && i.url.endsWith('/') && !i.data.noindex && visible(i.data)));

  // filters ----------------------------------------------------------------
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const toDate = (d) => (d instanceof Date ? d : new Date(d));
  eleventyConfig.addFilter('dateIso', (d) => toDate(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter('dateLong', (d) => { const x = toDate(d); return `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`; });
  eleventyConfig.addFilter('bytes', (n) => Number(n).toLocaleString('en-GB'));
  // file facts read from the file itself, so the page cannot disagree with the download
  eleventyConfig.addFilter('fileSize', (rel) => fileFacts(rel.replace(/^\//, '')).bytes);
  eleventyConfig.addFilter('sha256', (rel) => fileFacts(rel.replace(/^\//, '')).sha256);
  eleventyConfig.addFilter('pngSize', (rel) => pngSize(rel.replace(/^\//, '')));
  eleventyConfig.addFilter('statusLabel', (s) => ({
    released: 'Released', 'in-use': 'In use', ongoing: 'Ongoing research', 'working-build': 'Working build', 'in-development': 'In development', planned: 'Planned', exploring: 'Exploring',
  })[s] || s);
  eleventyConfig.addFilter('byCategory', (items, c) => (items || []).filter((i) => i.data.category === c));
  eleventyConfig.addFilter('bySection', (items, s) => (items || []).filter((i) => i.data.section === s));
  eleventyConfig.addFilter('withFiles', (items) => (items || []).filter((i) => (i.data.files || []).length));
  eleventyConfig.addFilter('filesOfKind', (files, k) => (files || []).filter((f) => (f.kind || 'build') === k));
  eleventyConfig.addFilter('newestVersion', (files) => {
    const v = (files || []).map((f) => String(f.version));
    return v.sort((a, b) => b.localeCompare(a, 'en', { numeric: true }))[0];
  });
  // 'works' if any model with that screen runs it, 'no' if none can, otherwise 'untested'
  eleventyConfig.addFilter('screenSupport', (models, lines) => {
    const ids = lines === 2 ? ['cm', 'xp', 'la'] : ['lz', 'lz64'];
    const st = ids.map((id) => models?.[id]?.state);
    return st.includes('works') ? 'works' : st.every((s) => s === 'no') ? 'no' : 'untested';
  });
  // the first screenshot of a two-line or four-line screen (unmarked screenshots are four-line)
  eleventyConfig.addFilter('shotFor', (shots, lines) => (shots || []).find((s) => (s.lines || 4) === lines));
  // 61274 -> "60 KB", 5067464 -> "4.8 MB" (exact byte counts stay on the program pages)
  eleventyConfig.addFilter('humanSize', (n) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`));
  eleventyConfig.addFilter('dateShort', (d) => { const x = toDate(d); return `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()].slice(0, 3)} ${x.getUTCFullYear()}`; });
  // the models that run it: "All five models", or "LZ, LZ64"
  eleventyConfig.addFilter('modelsText', (models, list) => {
    const ok = list.filter((m) => models?.[m.id]?.state === 'works').map((m) => m.name);
    return ok.length === list.length ? 'All five models' : ok.join(', ');
  });
  eleventyConfig.addFilter('onlyVersion', (files, v) => (files || []).filter((f) => String(f.version) === String(v)));
  eleventyConfig.addFilter('concat', (arr, x) => (arr || []).concat([x]));
  eleventyConfig.addFilter('notVersion', (files, v) => (files || []).filter((f) => String(f.version) !== String(v)));
  eleventyConfig.addFilter('neighbours', (items, url) => {
    const i = (items || []).findIndex((x) => x.url === url);
    return { prev: i > 0 ? items[i - 1] : null, next: i >= 0 && i < items.length - 1 ? items[i + 1] : null };
  });
  eleventyConfig.addFilter('countIn', (items, key, value) => (items || []).filter((i) => i.data[key] === value).length);
  eleventyConfig.addFilter('fileExists', (rel) => fs.existsSync(path.join(SRC, rel.replace(/^\//, ''))));

  // machine-readable views (lib/machine.js): JSON-LD in every page head, last-modified dates
  eleventyConfig.addShortcode('jsonLd', function () { return jsonLd(this.ctx); });
  eleventyConfig.addFilter('lastMod', (inputPath, url, data, collections) => lastModified(inputPath, url, data, collections));

  eleventyConfig.addGlobalData('buildDate', () => new Date());
  eleventyConfig.addGlobalData('liveBuild', () => isLive());   // the analytics beacon only on the live build, not --serve

  return {
    dir: { input: SRC, output: '_site', includes: '_includes', data: '_data' },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', '11ty.js'],
  };
}
