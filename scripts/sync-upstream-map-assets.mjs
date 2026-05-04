import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { regenerateDarkThumbnail } from './regenerate-dark-thumbnails.mjs';

const upstreamRoot = process.argv[2];

if (!upstreamRoot) {
  console.error('Usage: node scripts/sync-upstream-map-assets.mjs <path-to-openfrontio>');
  process.exit(1);
}

const mapsData = JSON.parse(await readFile('src/data/maps_data.json', 'utf8'));
const slugs = Object.keys(mapsData).sort();

await mkdir(path.join('public', 'maps'), { recursive: true });
await mkdir(path.join('public', 'maps-dark'), { recursive: true });

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function lightTerrainColor(tile) {
  if (!tile.land) {
    if (tile.shoreline) return [100, 143, 255, 0];
    return [70, 132, 180, 0];
  }

  if (tile.shoreline) return [204, 203, 158, 255];

  if (tile.magnitude < 10) {
    return [190, clamp(220 - 2 * tile.magnitude), 138, 255];
  }

  if (tile.magnitude < 20) {
    return [
      clamp(200 + 2 * tile.magnitude),
      clamp(183 + 2 * tile.magnitude),
      clamp(138 + 2 * tile.magnitude),
      255,
    ];
  }

  const mountain = clamp(230 + tile.magnitude / 2);
  return [mountain, mountain, mountain, 255];
}

function darkTerrainColor(tile) {
  if (!tile.land) return [14, 11, 30, 255];

  const [r, g, b] = lightTerrainColor(tile);
  let nr = r * 0.6;
  let ng = g * 0.625;
  let nb = b * 0.55;
  const luma = 0.299 * nr + 0.587 * ng + 0.114 * nb;

  nr = nr * 0.88 + luma * 0.12;
  ng = ng * 0.88 + luma * 0.12;
  nb = nb * 0.88 + luma * 0.12;

  return [clamp(nr), clamp(ng), clamp(nb), 255];
}

function decodeTile(value) {
  return {
    land: (value & 0b10000000) !== 0,
    shoreline: (value & 0b01000000) !== 0,
    ocean: (value & 0b00100000) !== 0,
    magnitude: value & 0b00011111,
  };
}

function renderTerrain(buffer, width, height, colorForTile) {
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0, j = 0; i < buffer.length; i += 1, j += 4) {
    const [r, g, b, a] = colorForTile(decodeTile(buffer[i]));
    out[j] = r;
    out[j + 1] = g;
    out[j + 2] = b;
    out[j + 3] = a;
  }

  return out;
}

async function renderMapVariant(slug, mapBuffer, width, height, output, colorForTile) {
  const data = renderTerrain(mapBuffer, width, height, colorForTile);

  await sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .webp({ quality: 82, effort: 4 })
    .toFile(output);
}

async function syncMapAssets(slug) {
  const upstreamMapDir = path.join(upstreamRoot, 'resources', 'maps', slug);
  const manifestPath = path.join(upstreamMapDir, 'manifest.json');
  const mapPath = path.join(upstreamMapDir, 'map.bin');
  const thumbnailPath = path.join(upstreamMapDir, 'thumbnail.webp');

  for (const source of [manifestPath, mapPath, thumbnailPath]) {
    if (!existsSync(source)) {
      throw new Error(`Missing upstream map asset for ${slug}: ${source}`);
    }
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const width = manifest.map.width;
  const height = manifest.map.height;
  const mapBuffer = await readFile(mapPath);

  if (mapBuffer.length !== width * height) {
    throw new Error(
      `Unexpected map.bin size for ${slug}: expected ${width * height}, got ${mapBuffer.length}`,
    );
  }

  await copyFile(thumbnailPath, path.join('public', 'thumbnails', `${slug}.webp`));
  await regenerateDarkThumbnail(slug);
  await renderMapVariant(
    slug,
    mapBuffer,
    width,
    height,
    path.join('public', 'maps', `${slug}.webp`),
    lightTerrainColor,
  );
  await renderMapVariant(
    slug,
    mapBuffer,
    width,
    height,
    path.join('public', 'maps-dark', `${slug}.webp`),
    darkTerrainColor,
  );

  console.log(`Synced thumbnail and full-size map assets for ${slug}`);
}

for (const slug of slugs) {
  await syncMapAssets(slug);
}
