// /llms.txt: a short Markdown guide to the site for LLM agents (the llmstxt.org format):
// who Daniel is, then every page with a one-line note, built from the same front matter as the pages.
import { isProgram, site, person, abs, STATUS_LABELS, newestVersion, platform, currentFiles, fileLabel, iso } from '../lib/machine.js';

export const data = {
  permalink: '/llms.txt',
  eleventyExcludeFromCollections: true,
  eleventyImport: { collections: ['all', 'programs', 'projects'] },
};

export function render({ collections }) {
  const page = (url) => collections.all.find((i) => i.url === url);
  const link = (url, name, note) => `- [${name}](${abs(url)})${note ? `: ${note}` : ''}`;
  const pageLink = (url, name) => { const p = page(url); return p ? link(url, name || p.data.title, p.data.description) : null; };
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
  const programs = collections.programs || [];
  const projects = collections.projects || [];
  const section = (s) => projects.filter((i) => i.data.section === s);

  return [
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
    `The full text of every page, as one Markdown file: ${abs('/llms-full.txt')}. New and updated entries: ${abs('/feed.xml')} (RSS). Each page also carries schema.org JSON-LD (Person, SoftwareApplication, BreadcrumbList).`,
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
    link('/llms-full.txt', 'Full text', 'every page as one Markdown file'),
    link('/sitemap.xml', 'Sitemap', 'every page with its last-modified date'),
    link('/feed.xml', 'RSS feed', 'new and updated programs and projects'),
    '',
  ].filter((l) => l !== null).join('\n');
}
