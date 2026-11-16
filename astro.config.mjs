// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://truescaletech.github.io',
  base: '/blockchain-explained',
  trailingSlash: 'always',
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  vite: {
    build: {
      // Never inline scripts or assets into the HTML: the Content-Security-Policy allows
      // scripts only from the site's own files ('self'), not inline code.
      assetsInlineLimit: 0,
    },
  },
});
