// /feed.xml: an RSS 2.0 feed of new and updated programs and projects, the same entries as the
// home page's Latest list (all of them, newest first). An entry reappears when its `updated` changes.
import { isProgram, site, abs, STATUS_LABELS, newestVersion, dateLong, rfc822, xml, platform } from '../lib/machine.js';

export const data = {
  permalink: '/feed.xml',
  eleventyExcludeFromCollections: true,
  eleventyImport: { collections: ['programs', 'projects'] },
};

const SECTION = { android: 'Android', personal: 'Personal' };

export function render({ collections }) {
  const items = [...(collections.programs || []), ...(collections.projects || [])]
    .sort((a, b) => b.data.updated - a.data.updated || a.data.title.localeCompare(b.data.title));
  const newest = items[0]?.data.updated || new Date();
  const item = (i) => {
    const d = i.data, url = abs(i.url);
    const v = newestVersion(d.files) || (d.version ? String(d.version) : null);
    const html = [`<p>${xml(d.summary)}</p>`,
      `<p>${[STATUS_LABELS[d.status], v && `version ${v}`, platform(d), `updated ${dateLong(d.updated)}`].filter(Boolean).map(xml).join(' · ')}</p>`];
    if (d.changelog?.length) html.push(`<p>Latest change (${xml(d.changelog[0].version)}): ${xml(d.changelog[0].change)}</p>`);
    if (d.proof?.length) html.push(`<p>Source: ${d.proof.map((l) => `<a href="${xml(l.url)}">${xml(l.label)}</a>`).join(', ')}</p>`);
    return [
      '<item>',
      `<title>${xml(d.title + (v ? ` ${v}` : ''))}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="false">${url}#updated-${d.updated.toISOString().slice(0, 10)}</guid>`,
      `<pubDate>${rfc822(d.updated)}</pubDate>`,
      `<category>${isProgram(d) ? 'Psion' : SECTION[d.section]}</category>`,
      `<description>${xml(html.join(''))}</description>`,
      '</item>',
    ].join('\n');
  };
  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${xml(site.name)}</title>
<link>${site.url}/</link>
<atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
<description>New and updated programs and projects from ${xml(site.name)}: Psion Organiser II programs, Android apps and personal projects.</description>
<language>en-gb</language>
<lastBuildDate>${rfc822(newest)}</lastBuildDate>
${items.map(item).join('\n')}
</channel>
</rss>
`;
}
