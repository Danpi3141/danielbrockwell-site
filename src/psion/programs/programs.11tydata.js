import { visible } from '../../../eleventy.config.js';

export default {
  layout: 'layouts/program.njk',
  section: 'psion',
  eleventyComputed: {
    permalink: (data) => (visible(data) ? `/psion/${data.page.fileSlug}/` : false),
    slug: (data) => data.page.fileSlug,
    downloadDir: (data) => `/downloads/psion/${data.page.fileSlug}/`,
  },
};
