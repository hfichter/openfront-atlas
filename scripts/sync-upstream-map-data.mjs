import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const upstreamRoot = process.argv[2];

if (!upstreamRoot) {
  console.error('Usage: node scripts/sync-upstream-map-data.mjs <path-to-openfrontio>');
  process.exit(1);
}

const dataPath = path.join('src', 'data', 'maps_data.json');
const current = JSON.parse(await readFile(dataPath, 'utf8'));
const upstreamMapsRoot = path.join(upstreamRoot, 'resources', 'maps');
const english = JSON.parse(
  await readFile(path.join(upstreamRoot, 'resources', 'lang', 'en.json'), 'utf8'),
);

function atlasCategory(upstreamCategories) {
  if (upstreamCategories.includes('tournament')) return 'tournament';
  if (upstreamCategories.includes('arcade')) return 'arcade';
  if (upstreamCategories.some((category) => ['cosmic', 'fictional'].includes(category))) {
    return 'fantasy';
  }
  if (upstreamCategories.some((category) => ['world', 'continental'].includes(category))) {
    return 'continental';
  }
  return 'regional';
}

function translatedName(translationKey, fallback) {
  const value = translationKey
    .split('.')
    .reduce((object, key) => object?.[key], english);
  return typeof value === 'string' ? value : fallback;
}

const upstreamSlugs = (
  await readdir(upstreamMapsRoot, { withFileTypes: true })
)
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const removedSlugs = Object.keys(current).filter((slug) => !upstreamSlugs.includes(slug));
if (removedSlugs.length > 0) {
  throw new Error(
    `Active Atlas maps missing upstream (move them to legacy data explicitly): ${removedSlugs.join(', ')}`,
  );
}

const updated = {};

for (const slug of upstreamSlugs) {
  const manifest = JSON.parse(
    await readFile(path.join(upstreamMapsRoot, slug, 'manifest.json'), 'utf8'),
  );
  const previous = current[slug];
  const width = manifest.map.width;
  const height = manifest.map.height;
  const totalPixels = width * height;
  const landTiles = manifest.map.num_land_tiles;
  const landPct = Math.round((landTiles / totalPixels) * 1000) / 10;
  const nations = (manifest.nations ?? [])
    .filter((nation) => Array.isArray(nation.coordinates))
    .map((nation) => ({
      name: nation.name,
      flag: nation.flag ?? '',
      x: nation.coordinates[0],
      y: nation.coordinates[1],
    }));

  const entry = {
    enum_key: manifest.id,
    display_name: manifest.name,
    translated_name: translatedName(manifest.translation_key, manifest.name),
    category: previous?.category ?? atlasCategory(manifest.categories ?? []),
    width,
    height,
    total_pixels: totalPixels,
    land_tiles: landTiles,
    land_pct: landPct,
    water_pct: Math.round((100 - landPct) * 10) / 10,
    estimated_max_players: Math.max(5, Math.round(landTiles / 100000) * 5),
    playlist_frequency: manifest.multiplayer_frequency,
    nation_count: (manifest.nations ?? []).length,
    nations,
    thumbnail: `thumbnails/${slug}.webp`,
  };

  for (const field of ['geo_lat', 'geo_lng', 'geo_type']) {
    if (previous?.[field] != null) entry[field] = previous[field];
  }

  updated[slug] = entry;
}

await writeFile(dataPath, `${JSON.stringify(updated, null, 2)}\n`);
console.log(`Synced data for ${upstreamSlugs.length} upstream maps`);
