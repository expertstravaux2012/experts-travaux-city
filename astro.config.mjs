// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { site as siteData } from './src/data/site.ts';

// https://astro.build/config
export default defineConfig({
  site: siteData.url,
  integrations: siteData.indexable ? [sitemap()] : [],
  build: {
    inlineStylesheets: 'always',
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
    build: { chunkSizeWarningLimit: 900 },
  },
});
