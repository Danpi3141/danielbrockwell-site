import { visible } from '../../eleventy.config.js';

export default {
  eleventyComputed: {
    layout: (data) => (data.page.fileSlug === 'android' ? data.layout : 'layouts/project.njk'),
    permalink: (data) => {
      if (data.page.fileSlug === 'android') return data.permalink;
      return visible(data) ? `/android/${data.page.fileSlug}/` : false;
    },
    slug: (data) => data.page.fileSlug,
    downloadDir: (data) => `/downloads/android/${data.page.fileSlug}/`,
  },
};
