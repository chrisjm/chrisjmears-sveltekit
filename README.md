## chrisjmears.com

Personal site for Chris Mears – portfolio, blog, and assorted experiments – built with SvelteKit, mdsvex, Tailwind CSS, and Vite.

Live site: https://chrisjmears.com

## Getting started

```bash
npm install
npm run dev
# or
npm run dev -- --open
```

Node: see `package.json` `engines` (currently 22.x).

## Scripts

- `npm run dev` – local dev server
- `npm run build` – production build (runs `npm run fetch-bsky` first)
- `npm run preview` – preview production build
- `npm run fetch-bsky` – pull latest data from Bluesky into `static/data/bsky.json`
- `npm run check` / `check:watch` – typechecking
- `npm run lint` / `format` – linting and formatting

## Notes

- Content is mostly mdsvex-based posts under `src/posts`.
- Pre-rendered with `adapter-auto` and `prerender.origin = "https://chrisjmears.com"` in `svelte.config.js`.
