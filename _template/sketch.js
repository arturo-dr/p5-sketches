let seed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  seed = floor(random(1e9));
  randomSeed(seed);
  noiseSeed(seed);
  console.log("seed:", seed);
}

function draw() {
  background(17);
  noStroke();
  fill(240);
  const t = frameCount * 0.01;
  const x = noise(t) * width;
  const y = noise(t + 100) * height;
  circle(x, y, 40);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
