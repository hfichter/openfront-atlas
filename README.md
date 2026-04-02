# OpenFront Atlas

An interactive atlas of all 64 [OpenFront.io](https://openfront.io) maps — real geography, historical context, and strategy for every battlefield.

🗺️ **Live site:** [hfichter.github.io/openfront-atlas](https://hfichter.github.io/openfront-atlas)

---

## What it is

OpenFront Atlas is a community companion site for [OpenFront.io](https://openfront.io), a real-time strategy browser game built around historical and geographic maps.

The atlas gives players:
- An **interactive world map** with clickable pins for every Earth map
- **Nation spawn overlays** on map detail pages (flags + toggle)
- **Per-map stats**: dimensions, nation count, max players, land %, playlist frequency
- **Editorial content**: geography, history, and strategy context for each map
- **EN + FR** language support with official OpenFront French translations
- **Light/dark mode** with theme-aware map thumbnails

---

## Maps covered

| Category | Count |
|---|---|
| Continental | 9 |
| Regional | 35 |
| Other Worlds (fantasy) | 12 |
| Arcade / Tournament | 8 |
| **Total** | **64** |

---

## Tech stack

- [Astro](https://astro.build) — static site generator
- [React](https://react.dev) — interactive map component
- [react-simple-maps](https://www.react-simple-maps.io) — world map projection
- [Tailwind CSS](https://tailwindcss.com) — utility styling
- [GitHub Pages](https://pages.github.com) — hosting

---

## Running locally

```bash
npm install
npm run dev       # dev server at localhost:4321
npm run build     # production build to ./dist
npm run preview   # preview build locally
```

---

## Disclaimer

OpenFront Atlas is an **unofficial community project** — not affiliated with or endorsed by the OpenFront.io team.  
Map data, thumbnails, and flag assets are derived from the OpenFront.io open-source repository.

---

## License

This project is released into the public domain under the [Unlicense](LICENSE).
