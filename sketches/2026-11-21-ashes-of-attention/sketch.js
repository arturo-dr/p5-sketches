/*
 * Ashes of Attention
 * Author:  Nanaka (https://openprocessing.org/user/607909)
 * Source:  https://openprocessing.org/sketch/2995171
 * License: CC BY-NC-SA 3.0
 * Ported to this sketchbook on 2026-11-21; changes are marked with "// PORT:".
 */

/***
A neural field of glowing signals drifting toward exhaustion. Connections flare briefly, clusters ignite, and fragments of attention scatter like embers into the dark.
The network never fully collapses, nor fully recovers—remaining suspended between focus and fatigue.

Interaction
Click to release a pulse through the network.
Drag to stir heat and disturb connections.
R — regenerate the field.
S — save image.

***/

let nodes = [];
let embers = [];
let pulses = [];
let t = 0;

const NODE_COUNT = 180;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  pixelDensity(1);
  initField();
}

function initField() {
  nodes = [];
  embers = [];
  pulses = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    let a = random(TWO_PI);
    let r = pow(random(), 0.62) * min(width, height) * 0.42;

    nodes.push({
      baseX: cos(a) * r,
      baseY: sin(a) * r,
      x: cos(a) * r,
      y: sin(a) * r,
      vx: 0,
      vy: 0,
      phase: random(TWO_PI),
      burn: random(0.25, 1),
      size: random(2.2, 6.5)
    });
  }
}

function draw() {
  background(238, 48, 5, 18);

  translate(width / 2, height / 2);
  t += 0.01;

  drawAshVeil();
  updateNodes();
  drawConnections();
  drawNodes();
  updateEmbers();
  updatePulses();

  // slow burnout drift
  if (frameCount % 3 === 0) {
    spawnEmber(random(-width * 0.35, width * 0.35), random(-height * 0.35, height * 0.35));
  }
}

function updateNodes() {
  for (let n of nodes) {
    let d = dist(0, 0, n.baseX, n.baseY);
    let collapse = sin(t * 0.55 + n.phase) * 18;
    let tremor = noise(n.baseX * 0.006, n.baseY * 0.006, t) * 45;

    let angle = atan2(n.baseY, n.baseX);
    let swirl = angle + sin(t + d * 0.004) * 0.45;

    let targetX = n.baseX + cos(swirl) * tremor + cos(angle) * collapse;
    let targetY = n.baseY + sin(swirl) * tremor + sin(angle) * collapse;

    // mouse heat disturbance
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    let md = dist(mx, my, n.x, n.y);

    if (mouseIsPressed && md < 180) {
      let force = map(md, 0, 180, 2.6, 0);
      let pushA = atan2(n.y - my, n.x - mx) + HALF_PI;
      n.vx += cos(pushA) * force;
      n.vy += sin(pushA) * force;
      n.burn = min(1.8, n.burn + 0.025);
    }

    n.vx += (targetX - n.x) * 0.012;
    n.vy += (targetY - n.y) * 0.012;

    n.vx *= 0.91;
    n.vy *= 0.91;

    n.x += n.vx;
    n.y += n.vy;

    n.burn *= 0.997;
    n.burn = max(0.18, n.burn);
  }
}

function drawConnections() {
  blendMode(ADD);

  for (let i = 0; i < nodes.length; i++) {
    let a = nodes[i];

    for (let j = i + 1; j < nodes.length; j++) {
      let b = nodes[j];
      let d = dist(a.x, a.y, b.x, b.y);

      if (d < 92) {
        let heat = map(d, 0, 92, 1, 0);
        let flicker = noise(i * 0.1, j * 0.1, t * 3);
        let h = lerp(18, 46, flicker);
        let alpha = heat * 38 * ((a.burn + b.burn) * 0.5);

        stroke(h, 85, 95, alpha);
        strokeWeight(heat * 1.7);
        line(a.x, a.y, b.x, b.y);

        if (heat > 0.72 && random() < 0.006) {
          spawnEmber((a.x + b.x) / 2, (a.y + b.y) / 2);
        }
      }
    }
  }

  blendMode(BLEND);
}

function drawNodes() {
  blendMode(ADD);

  for (let n of nodes) {
    let glow = n.size * (2.5 + n.burn * 2.2);
    let pulse = sin(t * 5 + n.phase) * 0.5 + 0.5;

    noStroke();

    fill(25, 90, 100, 8 * n.burn);
    circle(n.x, n.y, glow * 4);

    fill(35, 95, 100, 22 * n.burn);
    circle(n.x, n.y, glow * 2);

    fill(48, 60, 100, 85);
    circle(n.x, n.y, n.size + pulse * 2.2);
  }

  blendMode(BLEND);
}

function spawnEmber(x, y) {
  embers.push({
    x,
    y,
    vx: random(-0.35, 0.35),
    vy: random(-1.25, -0.25),
    life: random(55, 130),
    maxLife: random(55, 130),
    s: random(1.2, 4.8),
    h: random(18, 48)
  });

  if (embers.length > 260) embers.shift();
}

function updateEmbers() {
  blendMode(ADD);

  for (let i = embers.length - 1; i >= 0; i--) {
    let e = embers[i];

    e.x += e.vx + sin(t * 3 + e.y * 0.02) * 0.25;
    e.y += e.vy;
    e.vy -= 0.002;
    e.life--;

    let a = map(e.life, 0, e.maxLife, 0, 60);

    noStroke();
    fill(e.h, 95, 100, a);
    circle(e.x, e.y, e.s);

    fill(e.h + 20, 45, 100, a * 0.25);
    circle(e.x, e.y, e.s * 5);

    if (e.life <= 0) embers.splice(i, 1);
  }

  blendMode(BLEND);
}

function updatePulses() {
  noFill();

  for (let i = pulses.length - 1; i >= 0; i--) {
    let p = pulses[i];

    p.r += p.speed;
    p.life -= 2.2;

    stroke(32, 80, 100, p.life);
    strokeWeight(1.2);
    circle(p.x, p.y, p.r * 2);

    stroke(12, 70, 90, p.life * 0.45);
    strokeWeight(5);
    circle(p.x, p.y, p.r * 1.35);

    if (p.life <= 0) pulses.splice(i, 1);
  }
}

function drawAshVeil() {
  noStroke();

  for (let i = 0; i < 140; i++) {
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    let n = noise(x * 0.003, y * 0.003, t * 0.5);
    fill(250, 20, 25, n * 5);
    circle(x, y, random(1, 3));
  }
}

function mousePressed() {
  let x = mouseX - width / 2;
  let y = mouseY - height / 2;

  pulses.push({
    x,
    y,
    r: 8,
    speed: 4.5,
    life: 80
  });

  for (let i = 0; i < 42; i++) {
    spawnEmber(x + random(-20, 20), y + random(-20, 20));
  }
}



function keyPressed() {
  console.log(key);

  if (key.toLowerCase() === "r") {
    initField();
  }

  // PORT: removed the "s" binding (saveCanvas("Embers of Thought", "png")); lib/export.js owns "s" and saves a PNG.

  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initField();
}