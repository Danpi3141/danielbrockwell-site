// /llms-full.txt: the text of every page as one Markdown file, for LLM agents. Each page's
// rendered content is turned back into Markdown; program and project pages lead with the facts
// their page shows from front matter (status, models, downloads with checksums, changelog).
import { site, person, models, abs, facts, htmlToMd, iso } from '../lib/machine.js';

export const data = {
  permalink: '/llms-full.txt',
  eleventyExcludeFromCollections: true,
  eleventyImport: { collections: ['all', 'programs', 'projects'] },
};

export function render({ collections, buildDate }) {
  const find = (url) => collections.all.find((i) => i.url === url);
  const out = [];
  const head = (title, url, description) => {
    out.push('---', '', `# ${title}`, '', `URL: ${abs(url)}`);
    if (description) out.push('', `> ${description}`);
    out.push('');
  };
  const pageText = (url, title) => {
    const p = find(url);
    if (!p) return;
    head(title || p.data.title, url, p.data.description);
    out.push(htmlToMd(p.content), '');
  };
  // a section page: its own introduction (the prose part only), then its entries in full
  const intro = (url) => {
    const p = find(url);
    const m = p?.content.match(/<div class="prose">([\s\S]*?)<\/div>/) || p?.content.match(/<p class="prose">([\s\S]*?)<\/p>/);
    return m ? htmlToMd(m[1]) : '';
  };
  const entry = (i, kind) => {
    head(`${i.data.title} (${kind})`, i.url, i.data.summary);
    out.push(facts(i.data), '', htmlToMd(i.content), '');
  };

  out.push(
    `# ${site.name}: the full text of ${site.url.replace(/^https?:\/\//, '')}`,
    '',
    `> ${site.description}`,
    '',
    `Every page of the site as Markdown, built ${iso(buildDate)}. A shorter index is at ${abs('/llms.txt')}. Each page starts with a level-1 heading and its URL.`,
    '',
    `Who this is: ${person.role}. ${person.degree}. ${person.records.map((r) => `${r.text} (source: ${r.url})`).join('. ')}. Contact: ${site.email}.`,
    '',
  );

  pageText('/about/');
  pageText('/cv/');
  pageText('/contact/');

  const programs = collections.programs || [];
  head('Psion Organiser II programs', '/psion/', find('/psion/')?.data.description);
  out.push(intro('/psion/'), '',
    'The Organiser II models, as the program pages name them:', '',
    '| Model | ROM | RAM | Screen |', '| --- | --- | --- | --- |',
    ...models.map((m) => `| ${m.label} | ${m.rom} | ${m.ram} | ${m.screen} |`), '',
    'Programs:', '', ...programs.map((i) => `- [${i.data.title}](${abs(i.url)}): ${i.data.summary}`), '');
  pageText('/psion/getting-started/', 'Getting started with the Psion programs');
  programs.forEach((i) => entry(i, `Psion Organiser II ${i.data.category === 'game' ? 'game' : 'utility'}`));

  for (const [s, name, kind] of [['android', 'Android apps', 'Android app'], ['personal', 'Personal projects', 'personal project']]) {
    const items = (collections.projects || []).filter((i) => i.data.section === s);
    head(name, `/${s}/`, find(`/${s}/`)?.data.description);
    out.push(...items.map((i) => `- [${i.data.title}](${abs(i.url)}): ${i.data.summary}`), '');
    items.forEach((i) => entry(i, kind));
  }

  pageText('/privacy/');
  return `${out.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}
