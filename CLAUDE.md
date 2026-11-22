# p5 sketchbook

- One sketch per folder: `sketches/YYYY-MM-DD-<slug>/` with `index.html` + `sketch.js`, created via `npm run new <slug>`.
- p5.js 1.11, **global mode**, classic `<script>` tags. No bundler, no ES modules. Code must paste 1:1 into OpenProcessing.
- Default canvas: `createCanvas(windowWidth, windowHeight)` + `windowResized()`.
- Seed `randomSeed()`/`noiseSeed()` and `console.log` the seed so outputs are reproducible.
- Dev server: `npm run dev` → http://localhost:3000 (the user keeps it running).
- After every change: open the sketch with /browse, take a screenshot, check the console for errors, and iterate until it matches the request.
- Export keys `s` / `g` / `v` belong to `lib/export.js`. Never bind them in sketch code.
- Ports from OpenProcessing: keep the original code, and add a header comment with author, URL and license.