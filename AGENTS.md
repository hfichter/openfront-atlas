# AGENTS.md — OpenFront Atlas

Instructions for AI agents (Codex, Claude Code, Clawd, etc.) working on this project.

---

## What this project is

OpenFront Atlas is a **static community companion site** for [OpenFront.io](https://openfront.io).
It covers all official OpenFront maps with stats, geography, history, and strategy content.

- Live site: https://www.openfront-atlas.xyz/
- GitHub: https://github.com/hfichter/openfront-atlas
- Stack: Astro + React + Tailwind CSS → deployed via GitHub Pages

---

## Key files and directories

```
src/
  content/maps/          # One .md file per map (editorial content)
  data/maps_data.json    # Authoritative map stats (pulled from upstream OpenFront repo)
  pages/                 # Astro pages (index, earth, worlds, arcade, map/[slug])
  components/            # React + Astro components
  layouts/               # BaseLayout.astro (shared shell)
public/
  thumbnails/            # Small light-mode map previews (copied from upstream published thumbnails)
  thumbnails-dark/       # Small dark-mode map previews generated from thumbnails/
  maps/                  # Full-size light-mode map images rendered from upstream map.bin
  maps-dark/             # Full-size dark-mode map images rendered from upstream map.bin
  images/                # Site images and icons
  flags/                 # Nation flags used by map spawn overlays
  CNAME                  # Custom domain (www.openfront-atlas.xyz) — do not delete
astro.config.mjs         # site + vite config — no base path (custom domain)
docs/map-status.md       # Map content status + upstream sync log (see below)
scripts/sync-upstream-map-assets.mjs
                         # Syncs map preview + full-size raster assets from upstream
```

---

## Map content structure

Each map page is powered by two sources:

1. **`src/data/maps_data.json`** — stats pulled from the upstream OpenFront.io repo.
   Fields include: `slug`, `display_name`, `translated_name`, `category`, `width`, `height`,
   `land_pct`, `water_pct`, `estimated_max_players`, `playlist_frequency`, `nation_count`, `nations`.

2. **`src/content/maps/<slug>.md`** — editorial content written for the atlas.
   Frontmatter fields:
   ```yaml
   ---
   slug: "world"
   title: "World"
   tagline: "The original theatre of everything"
   ---
   ```
   Body sections (vary by map):
   - `## The Geography` or `## The Map`
   - `## The History` (present on real-world maps)
   - `## The Battlefield` → `### Terrain Overview`, `### Best Spawns`, `### Avoid`, `### Strategic Insights`
   - `## Fun Facts`

---

## Adding a new map

When OpenFront.io adds a new map:

1. **Update `src/data/maps_data.json`** — add the new map's stats entry.
   Source of truth: [OpenFront.io GitHub repo](https://github.com/openfrontio/OpenFrontIO),
   specifically `resources/maps/<slug>/manifest.json`, `src/core/game/Game.ts`,
   and `src/server/MapPlaylist.ts` or their current equivalents.

2. **Create `src/content/maps/<slug>.md`** — write editorial content.
   Use existing maps as reference. Real-world maps get History sections; fantasy/arcade maps skip it.

3. **Update `docs/map-status.md`** — add the new map to the status table and bump `lastUpstreamSync`.

4. **Check page routing** — the dynamic route `src/pages/map/[slug].astro` picks up maps automatically
   if the slug in `maps_data.json` matches the filename in `src/content/maps/`.

5. **Check the category nav** — `earth.astro`, `worlds.astro`, `arcade.astro` filter by `category` field.
   Valid categories: `continental`, `regional`, `fantasy`, `arcade`.

6. **Sync map raster assets with the correct upstream sources** — see the asset rules below.

---

## Map raster asset rules

OpenFront has generator input images and published display assets. Do **not** confuse them.

- **Do not use** upstream `map-generator/assets/maps/<slug>/image.png` for atlas display images.
  Those files are generator inputs, not final map art. Some encode land as blue or grayscale because
  only the blue channel is meaningful to the OpenFront map generator.
- **Small preview thumbnails** in `public/thumbnails/<slug>.webp` must come from upstream
  `resources/maps/<slug>/thumbnail.webp`.
- **Full-size map images** in `public/maps/<slug>.webp` and `public/maps-dark/<slug>.webp`
  must be rendered from upstream `resources/maps/<slug>/map.bin` plus
  `resources/maps/<slug>/manifest.json`. The packed `map.bin` contains final terrain type,
  shoreline, and elevation data after upstream cleanup.
- Use the local helper:

```bash
npm run sync:map-assets -- /path/to/OpenFrontIO
```

This syncs `public/thumbnails/`, `public/thumbnails-dark/`, `public/maps/`, and
`public/maps-dark/` for all active slugs in `src/data/maps_data.json`.

After syncing map rasters, verify:

- Every active map has light and dark assets in both `public/thumbnails*` and `public/maps*`.
- `public/maps/<slug>.webp` dimensions match `width` × `height` in `src/data/maps_data.json`.
- Reported or newly added maps look correct in both light and dark modes; land should not appear
  as source-image blue or neutral grayscale unless that is intentionally part of the final terrain.

---

## Checking upstream for new maps

The maps_data.json is derived from the OpenFront.io open-source repo.
To check for new maps since the last sync:

```bash
# Quick check: compare slug count between our data and upstream
cat src/data/maps_data.json | jq 'keys | length'

# Or fetch upstream MapData and diff slug lists
```

Always update `docs/map-status.md → lastUpstreamSync` after checking, even if no new maps were found.

---

## Build and deploy

```bash
npm install
npm run dev       # dev server at localhost:4321
npm run build     # production build to ./dist
npm run preview   # preview build locally
```

Deployment is automatic via GitHub Actions on push to `main`.
The workflow builds with `npm run build` and pushes `./dist` to GitHub Pages.

**Important:** `public/CNAME` contains `www.openfront-atlas.xyz`.
Do not delete it — GitHub Pages needs it to serve the custom domain.

---

## PR conventions

- Branch from `main`, always pull latest before branching.
- One concern per PR: content updates, new maps, UI fixes, data updates are separate PRs.
- Do not push directly to `main`.
- Keep PRs small and reviewable.

---

## What not to do

- Do not change `base` in `astro.config.mjs` — there is intentionally no base path.
- Do not delete `public/CNAME`.
- Do not invent map stats — they must come from `maps_data.json` which tracks upstream data.
- Do not add map slugs to `maps_data.json` without a corresponding `.md` file and vice versa.
