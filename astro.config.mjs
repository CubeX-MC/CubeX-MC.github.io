// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';

const astroPrerenderEntry = fileURLToPath(
  new URL('./node_modules/astro/dist/entrypoints/prerender.js', import.meta.url),
);

export default defineConfig({
  site: 'https://cubexmc.org',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'astro/entrypoints/prerender': astroPrerenderEntry,
      },
    },
  },
  integrations: [mdx()]
});
