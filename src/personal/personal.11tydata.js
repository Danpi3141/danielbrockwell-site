import { visible } from '../../eleventy.config.js';

export default {
  eleventyComputed: {
    layout: (data) => (data.page.fileSlug === 'personal' ? data.layout : 'layouts/project.njk'),
    permalink: (data) => {
      if (data.page.fileSlug === 'personal') return data.permalink;
      return visible(data) ? `/personal/${data.page.fileSlug}/` : false;
    },
    slug: (data) => data.page.fileSlug,
    downloadDir: (data) => `/downloads/personal/${data.page.fileSlug}/`,
  },
};
