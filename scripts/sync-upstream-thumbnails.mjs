import { copyFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { regenerateDarkThumbnail } from './regenerate-dark-thumbnails.mjs';

const upstreamRoot = process.argv[2];

if (!upstreamRoot) {
  console.error('Usage: node scripts/sync-upstream-thumbnails.mjs <path-to-openfrontio>');
  process.exit(1);
}

const mapsData = JSON.parse(await readFile('src/data/maps_data.json', 'utf8'));
const slugs = Object.keys(mapsData).sort();

for (const slug of slugs) {
  const source = path.join(upstreamRoot, 'resources', 'maps', slug, 'thumbnail.webp');
  const output = path.join('public', 'thumbnails', `${slug}.webp`);

  if (!existsSync(source)) {
    throw new Error(`Missing upstream thumbnail for ${slug}: ${source}`);
  }

  await copyFile(source, output);
  await regenerateDarkThumbnail(slug);
  console.log(`Synced light and dark thumbnails for ${slug}`);
}
