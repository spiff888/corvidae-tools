libheif (HEIC/HEIF decoder), WebAssembly build
==============================================

Files here are loaded by the Jackdaw tool only when someone converts a HEIC file.

  libheif.js    Emscripten glue code
  libheif.wasm  libheif compiled to WebAssembly

Source package: libheif-js 1.23.5  https://github.com/catdad-experiments/libheif-js
Upstream library: libheif          https://github.com/strukturag/libheif
Licence: GNU Lesser General Public License v3.0 (LICENSE-libheif-js.txt, LICENSE-libheif.txt)

These files are copied unmodified from the npm package libheif-js@1.23.5
(libheif-wasm/libheif.js and libheif-wasm/libheif.wasm). To update them, install a newer
libheif-js, copy the same two files here, and re-test Jackdaw with a HEIC photo.
The corvidae.tools code that loads them is GPL-3.0-or-later and is in src/pages/tools/jackdaw.astro.
