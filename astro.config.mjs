// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://hfichter.github.io',
  base: '/openfront-atlas/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
