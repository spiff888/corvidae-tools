Self-hosted OCR engine for /tools/eurasianjay (Eurasian Jay).
Nothing here is loaded until someone opens that page and recognizes an image, and nothing is fetched from a third party.

tesseract.min.js          tesseract.js 7.0.0 main-thread library (global `Tesseract`)
worker.min.js             tesseract.js 7.0.0 web worker
core/*.wasm.js            tesseract.js-core 7.0.0, LSTM-only builds (the worker picks relaxed SIMD, SIMD or plain by feature detection)
lang/eng.traineddata.gz   English model (tessdata_best, integer)
LICENSES.txt              licenses (Apache-2.0 for the engine and the model, MIT for the small bundled helpers)

All files are unmodified copies from the npm packages tesseract.js@7.0.0, tesseract.js-core@7.0.0 (the copy nested inside tesseract.js) and @tesseract.js-data/eng@1.0.0.
