# OpenFront Atlas

An interactive atlas of all 105 current [OpenFront.io](https://openfront.io) maps — plus the legacy archive — with real geography, historical context, and strategy for every battlefield.

🗺️ **Live site:** [openfront-atlas.xyz](https://www.openfront-atlas.xyz/)

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
| Continental | 10 |
| Regional | 66 |
| Other Worlds (fantasy) | 16 |
| Arcade | 9 |
| Tournament | 4 |
| **Current total** | **105** |
| Legacy archive | 1 |

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

## Contributing

Contributions are welcome.

If you want to improve map descriptions, translations, data, visuals, or site behavior, please open a **pull request** rather than pushing changes directly.

---

## Disclaimer

OpenFront Atlas is an **unofficial community project** — not affiliated with or endorsed by the OpenFront.io team.  
Map data, thumbnails, and flag assets are derived from the OpenFront.io open-source repository.

---

## License

This project is released into the public domain under the [Unlicense](LICENSE).
