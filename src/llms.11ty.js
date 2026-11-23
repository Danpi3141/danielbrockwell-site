// /llms.txt: the whole site in one Markdown file for LLM agents. It opens in the llmstxt.org
// format (who Daniel is, then every page with a one-line note), then gives the full text of every
// page. Program and project pages lead with the facts their page shows from front matter (status,
// models, downloads with checksums, changelog). Built from the same front matter as the pages.
import { isProgram, site, person, models, abs, STATUS_LABELS, newestVersion, platform, currentFiles, fileLabel, facts, htmlToMd, iso } from '../lib/machine.js';

export const data = {
  permalink: '/llms.txt',
  eleventyExcludeFromCollections: true,
  eleventyImport: { collections: ['all', 'programs', 'projects'] },
};

export function render({ collections, buildDate }) {
  const find = (url) => collections.all.find((i) => i.url === url);
  const programs = collections.programs || [];
  const projects = collections.projects || [];
  const section = (s) => projects.filter((i) => i.data.section === s);

  // the index ------------------------------------------------------------------------------------
  const link = (url, name, note) => `- [${name}](${abs(url)})${note ? `: ${note}` : ''}`;
  const pageLink = (url, name) => { const p = find(url); return p ? link(url, name || p.data.title, p.data.description) : null; };
  const entry = (i) => {
    const d = i.data, bits = [STATUS_LABELS[d.status]];
    const v = newestVersion(d.files) || (d.version ? String(d.version) : null);
    if (v) bits.push(`version ${v}`);
    const pf = platform(d);
    if (pf) bits.push(isProgram(d) ? `runs on ${pf}` : `${pf} app`);
    bits.push(`updated ${iso(d.updated)}`);
    const main = currentFiles(d)[0];
    if (main) bits.push(`download: ${fileLabel(main, d)} ${abs(d.downloadDir + main.file)}`);
    for (const l of d.proof || []) bits.push(`source: ${l.url}`);
    return link(i.url, d.title, `${d.summary} (${bits.join('; ')})`);
  };

  const out = [
    `# ${site.name}`,
    '',
    `> The personal website of ${site.name}: ${site.description.charAt(0).toLowerCase()}${site.description.slice(1)} It holds his CV, Psion Organiser II programs with downloads and source, his Android apps, and record-setting computations in number theory.`,
    '',
    `About ${site.name}:`,
    '',
    `- ${person.role}.`,
    `- ${person.degree}.`,
    ...person.records.map((r) => `- ${r.text}. Source: [${r.source}](${r.url}); details: ${abs(r.page)}`),
    `- Contact: ${site.email}. GitHub: ${site.github}`,
    '',
    `This one file holds the whole site: an index of every page, then the full text of every page (built ${iso(buildDate)}). New and updated entries: ${abs('/feed.xml')} (RSS). Each page also carries schema.org JSON-LD (Person, SoftwareApplication, BreadcrumbList).`,
    '',
    '## About and CV',
    '',
    pageLink('/about/'),
    pageLink('/cv/'),
    link('/downloads/cv/daniel-brockwell-cv.pdf', 'CV (PDF, two A4 pages)', 'the same CV as a PDF'),
    pageLink('/contact/'),
    '',
    '## Psion Organiser II programs',
    '',
    pageLink('/psion/', 'All Psion programs'),
    ...programs.map(entry),
    '',
    '## Android apps',
    '',
    pageLink('/android/', 'All Android apps'),
    ...section('android').map(entry),
    '',
    '## Personal projects',
    '',
    pageLink('/personal/', 'All personal projects'),
    ...section('personal').map(entry),
    '',
    '## Optional',
    '',
    pageLink('/psion/getting-started/', 'Getting started with the Psion programs'),
    pageLink('/privacy/'),
    link('/sitemap.xml', 'Sitemap', 'every page with its last-modified date'),
    link('/feed.xml', 'RSS feed', 'new and updated programs and projects'),
    '',
    '---',
    '',
    'The full text of every page follows. Each page is a level-2 heading, then its URL; its own headings are one level lower.',
    '',
  ].filter((l) => l !== null);

  // the full text --------------------------------------------------------------------------------
  const head = (title, url, description) => {
    out.push('---', '', `## ${title}`, '', `URL: ${abs(url)}`);
    if (description) out.push('', `> ${description}`);
    out.push('');
  };
  const pageText = (url, title) => {
    const p = find(url);
    if (!p) return;
    head(title || p.data.title, url, p.data.description);
    out.push(htmlToMd(p.content, 1), '');
  };
  // a section page's own introduction: the prose part only, not its cards
  const intro = (url) => {
    const p = find(url);
    const m = p?.content.match(/<div class="prose">([\s\S]*?)<\/div>/);
    return m ? htmlToMd(m[1], 1) : '';
  };
  const fullEntry = (i, kind) => {
    head(`${i.data.title} (${kind})`, i.url, i.data.summary);
    out.push(facts(i.data), '', htmlToMd(i.content, 1), '');
  };

  pageText('/about/');
  pageText('/cv/');
  pageText('/contact/');

  head('Psion Organiser II programs: overview', '/psion/', find('/psion/')?.data.description);
  out.push(intro('/psion/'), '',
    'The Organiser II models, as the program pages name them:', '',
    '| Model | ROM | RAM | Screen |', '| --- | --- | --- | --- |',
    ...models.map((m) => `| ${m.label} | ${m.rom} | ${m.ram} | ${m.screen} |`), '');
  pageText('/psion/getting-started/', 'Getting started with the Psion programs');
  programs.forEach((i) => fullEntry(i, `Psion Organiser II ${i.data.category === 'game' ? 'game' : 'utility'}`));

  for (const [s, name, kind] of [['android', 'Android apps', 'Android app'], ['personal', 'Personal projects', 'personal project']]) {
    head(`${name}: overview`, `/${s}/`, find(`/${s}/`)?.data.description);
    out.push(...section(s).map((i) => `- [${i.data.title}](${abs(i.url)}): ${i.data.summary}`), '');
    section(s).forEach((i) => fullEntry(i, kind));
  }

  pageText('/privacy/');
  return `${out.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}
