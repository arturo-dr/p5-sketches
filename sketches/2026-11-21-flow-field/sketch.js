// Flow field — Perlin noise, warm palette, slow trails.
// Click to reseed. Keys s/g/v are reserved for lib/export.js.

let seed;
let particles = [];
const NUM_PARTICLES = 1400;
const NOISE_SCALE = 0.0022;
const SPEED = 0.9;
const BG = [22, 12, 10];
const PALETTE = ["#ffb347", "#ff7e3d", "#e8483b", "#c42b4a", "#ffd88a", "#f2a65a"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  init(floor(random(1e9)));
}

function init(s) {
  seed = s;
  randomSeed(seed);
  noiseSeed(seed);
  console.log("seed:", seed);
  background(BG);
  particles = [];
  for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());
}

function draw() {
  // Very faint fade so trails linger and dissolve slowly
  noStroke();
  fill(BG[0], BG[1], BG[2], 9);
  rect(0, 0, width, height);

  const z = frameCount * 0.0008;
  for (const p of particles) {
    p.update(z);
    p.show();
  }
}

class Particle {
  constructor() {
    this.reset();
    this.col = color(random(PALETTE));
    this.col.setAlpha(random(70, 140));
    this.w = random(0.7, 1.8);
  }
  reset() {
    this.pos = createVector(random(width), random(height));
    this.prev = this.pos.copy();
    this.life = random(200, 700);
  }
  update(z) {
    this.prev.set(this.pos);
    const a = noise(this.pos.x * NOISE_SCALE, this.pos.y * NOISE_SCALE, z) * TWO_PI * 2.5;
    this.pos.x += cos(a) * SPEED;
    this.pos.y += sin(a) * SPEED;
    this.life--;
    if (this.life < 0 || this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.reset();
    }
  }
  show() {
    stroke(this.col);
    strokeWeight(this.w);
    line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
  }
}

function mousePressed() {
  init(floor(random(1e9)));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(BG);
}
