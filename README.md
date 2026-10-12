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
  
## Notes on Eurasian Jay (image to text)

- OCR runs in the browser with [tesseract.js](https://github.com/naptha/tesseract.js)
  (Apache-2.0). The engine, worker and English model are self-hosted under
  `public/vendor/tesseract/` (about 7 MB is fetched, and only when someone first
  reads an image). Nothing is loaded from a third-party CDN, so the CSP needs
  no extra hosts; it relies on the existing `worker-src 'self'` and
  `'wasm-unsafe-eval'`.
- The service worker does not precache `vendor/**`; a runtime `CacheFirst` rule
  (`ocr-engine`) keeps the files after first use so the tool works offline.
- Small pictures are enlarged, huge ones shrunk, and light-on-dark text is
  inverted before recognition, which noticeably improves accuracy.
- English only for now. Another language means adding its `.traineddata.gz` to
  `public/vendor/tesseract/lang/` (the Chinese models are large).

## License
  
  Code: GPL-3.0-or-later. © 2026 Philip Gaw. See [LICENSE](LICENSE).
  
  Artwork: the bird marks, logo, and icons are not covered by the GPL. Please don't use the corvidae.tools name or bird marks in a way that suggests affiliation.
