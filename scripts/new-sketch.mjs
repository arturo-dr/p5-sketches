#!/usr/bin/env node
// Usage: npm run new <slug>
// Copies _template/ to sketches/YYYY-MM-DD-<slug>/ and registers it in sketches.json.
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = process.argv[2];

if (!raw) {
  console.error("Usage: npm run new <slug>");
  process.exit(1);
}

const slug = raw
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
if (!slug) {
  console.error(`Invalid slug: "${raw}"`);
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const dir = `${date}-${slug}`;
const dest = join(root, "sketches", dir);

if (existsSync(dest)) {
  console.error(`Already exists: sketches/${dir}`);
  process.exit(1);
}

cpSync(join(root, "_template"), dest, { recursive: true });

const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const htmlPath = join(dest, "index.html");
writeFileSync(htmlPath, readFileSync(htmlPath, "utf8").replaceAll("{{TITLE}}", title));

const listPath = join(root, "sketches.json");
const list = existsSync(listPath) ? JSON.parse(readFileSync(listPath, "utf8")) : [];
list.push({ dir, slug, title, date });
list.sort((a, b) => a.dir.localeCompare(b.dir));
writeFileSync(listPath, JSON.stringify(list, null, 2) + "\n");

console.log(`Created sketches/${dir}/`);
console.log(`Open http://localhost:3000/sketches/${dir}/`);
