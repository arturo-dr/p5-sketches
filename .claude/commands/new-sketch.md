---
description: Create a new p5.js sketch from a description
argument-hint: <slug> <what the sketch should do>
---

Create a new sketch in this sketchbook from: $ARGUMENTS

1. Pick a short kebab-case slug (use the first word of the arguments if it already looks like one) and run `npm run new <slug>`. Note the folder it prints (`sketches/YYYY-MM-DD-<slug>/`).
2. Write the sketch in that folder's `sketch.js` following CLAUDE.md:
   - p5.js 1.11 global mode, classic script — no `import`/`export`, no modules. It must paste 1:1 into OpenProcessing.
   - `createCanvas(windowWidth, windowHeight)` plus `windowResized()`.
   - Keep the seeded `randomSeed()` / `noiseSeed()` and `console.log` of the seed.
   - Never bind the `s`, `g` or `v` keys; `lib/export.js` owns them.
   - Only touch `index.html` if the sketch genuinely needs another library (pinned jsDelivr URL, loaded before `sketch.js`).
3. Verify with /browse: open `http://localhost:3000/sketches/<folder>/` (the dev server is already running; if it isn't reachable, ask the user to run `npm run dev`), take a screenshot, and check the console for errors.
4. Iterate until the screenshot matches the request and the console is clean. Then report the folder, the seed, and what you saw.
