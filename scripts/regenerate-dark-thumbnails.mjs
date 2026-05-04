import sharp from 'sharp';
import { pathToFileURL } from 'node:url';

const WATER_RGB = [14, 11, 30];
const LAND_SCALE = { r: 0.6, g: 0.625, b: 0.55 };
const LAND_LUMA_BLEND = 0.12;

function isWater(r, g, b) {
  return b > g + 12 && g > r + 8;
}

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

function gradeLand(r, g, b) {
  let nr = Math.round(r * LAND_SCALE.r);
  let ng = Math.round(g * LAND_SCALE.g);
  let nb = Math.round(b * LAND_SCALE.b);

  // Blend a little back toward luminance so relief shading stays readable.
  const luma = Math.round(0.299 * nr + 0.587 * ng + 0.114 * nb);
  nr = Math.round(nr * (1 - LAND_LUMA_BLEND) + luma * LAND_LUMA_BLEND);
  ng = Math.round(ng * (1 - LAND_LUMA_BLEND) + luma * LAND_LUMA_BLEND);
  nb = Math.round(nb * (1 - LAND_LUMA_BLEND) + luma * LAND_LUMA_BLEND);

  return [clamp(nr), clamp(ng), clamp(nb)];
}

export async function regenerateDarkThumbnail(slug) {
  const input = `public/thumbnails/${slug}.webp`;
  const output = `public/thumbnails-dark/${slug}.webp`;

  const { data, info } = await sharp(input)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 3);

  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 3) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const [nr, ng, nb] = isWater(r, g, b)
      ? WATER_RGB
      : gradeLand(r, g, b);

    out[j] = nr;
    out[j + 1] = ng;
    out[j + 2] = nb;
  }

  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .webp({ quality: 92 })
    .toFile(output);
}

const slugs = process.argv.slice(2);
const cliUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';

if (import.meta.url === cliUrl) {
  if (slugs.length === 0) {
    console.error('Usage: node scripts/regenerate-dark-thumbnails.mjs <slug> [slug...]');
    process.exit(1);
  }

  for (const slug of slugs) {
    await regenerateDarkThumbnail(slug);
    console.log(`Regenerated dark thumbnail for ${slug}`);
  }
}
