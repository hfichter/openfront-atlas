// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.openfront-atlas.xyz',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
