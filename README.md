# corvidae.tools

A small flock of browser-based tools. Each one runs entirely client-side —
nothing is ever uploaded anywhere.

## Stack

Astro (static output). Most pages are plain HTML/CSS with a little vanilla
JS — no framework needed for tools this size. If a future tool genuinely
needs component state, Astro supports dropping in a React/Vue/Svelte
"island" on just that page without adding it to the rest of the site.

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:4321

## Build

```bash
npm run build
```

Static output lands in `dist/`.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect
   to Git → select the repo.
3. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy. Cloudflare will rebuild automatically on every push.
5. Add the `corvidae.tools` custom domain under the Pages project's
   Custom domains tab once DNS is pointed at Cloudflare.

## Adding a new tool

1. Add an entry to `src/data/tools.js` (status: `"planned"` until it's
   built — it'll show up on the homepage grid automatically, greyed out
   with no link).
2. Build the tool's page under `src/pages/tools/<slug>.astro`. Copy
   `jackdaw.astro`'s structure (Layout + back-link + Footer) as a
   starting point.
3. Flip the tool's `status` to `"beta"` or `"live"` and add its `href`
   once the page is ready.

## Structure

```
src/
  layouts/Layout.astro      shared <head>, favicons, fonts
  components/
    Header.astro            wordmark + mascot + nav
    Footer.astro
    ToolCard.astro           homepage grid card
  data/tools.js              tool metadata — edit this to add/reorder tools
  pages/
    index.astro              homepage
    tools/jackdaw.astro       image converter (JPEG/PNG/WebP)
  styles/global.css          design tokens (colors, fonts) + shared styles
public/
  corvid-mark.png             the mascot, full illustration
  favicon-*.png, icon-*.png   generated favicon/touch-icon set
```

## Notes on Jackdaw (the image converter)

- Uses `canvas.toBlob()` for encoding — no libraries, no build-time
  dependencies.
- Safari doesn't support encoding to WebP (only decoding), so the page
  feature-detects this on load and shows a warning banner rather than
  silently handing Safari users a mislabeled PNG.
- Everything happens in-memory in the browser tab; nothing is sent
  anywhere, and the file is discarded when the tab closes.
