#!/usr/bin/env node
/**
 * Downloads exercises.json and all GIFs for offline use.
 * Usage: node scripts/download-data.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const GIFS_DIR = path.join(ROOT, "gifs");
const DATA_URL =
  "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json";
const GIF_BASE =
  "https://cdn.jsdelivr.net/gh/omercotkd/exercises-gifs@main/assets/";
const CONCURRENCY = 8;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function fetchBuffer(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}

function isGif(buffer) {
  return (
    buffer.length > 500 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46
  );
}

async function downloadJson() {
  console.log("Downloading exercises.json…");
  const buffer = await fetchBuffer(DATA_URL);
  const json = JSON.parse(buffer.toString("utf8"));
  if (!Array.isArray(json)) {
    throw new Error("Expected exercises.json to be an array");
  }
  ensureDir(DATA_DIR);
  const outPath = path.join(DATA_DIR, "exercises.json");
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
  console.log(`Saved ${json.length} exercises → ${path.relative(ROOT, outPath)}`);
  return json;
}

async function downloadGifs(exercises) {
  ensureDir(GIFS_DIR);
  const ids = [...new Set(exercises.map((e) => e.id).filter(Boolean))].sort();
  let done = 0;
  let skipped = 0;
  let ok = 0;
  let missing = [];

  const queue = [...ids];

  async function worker() {
    while (queue.length) {
      const id = queue.shift();
      if (!id) break;

      const outPath = path.join(GIFS_DIR, `${id}.gif`);
      if (fs.existsSync(outPath)) {
        const existing = fs.readFileSync(outPath);
        if (isGif(existing)) {
          skipped += 1;
          done += 1;
          continue;
        }
      }

      const url = `${GIF_BASE}${id}.gif`;
      try {
        const buffer = await fetchBuffer(url);
        if (!isGif(buffer)) {
          missing.push(id);
        } else {
          fs.writeFileSync(outPath, buffer);
          ok += 1;
        }
      } catch {
        missing.push(id);
      }

      done += 1;
      if (done % 50 === 0 || done === ids.length) {
        process.stdout.write(
          `\rGIFs: ${done}/${ids.length} (${ok} downloaded, ${skipped} cached, ${missing.length} missing)`
        );
      }
    }
  }

  console.log(`Downloading ${ids.length} GIFs to gifs/…`);
  await Promise.all(
    Array.from({ length: CONCURRENCY }, () => worker())
  );
  console.log("");

  if (missing.length) {
    const reportPath = path.join(DATA_DIR, "missing-gifs.json");
    fs.writeFileSync(reportPath, JSON.stringify(missing, null, 2));
    console.log(`Missing ${missing.length} GIF(s): ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? "…" : ""}`);
    console.log(`Full list → ${path.relative(ROOT, reportPath)}`);
  } else {
    console.log("All GIFs downloaded successfully.");
  }

  return { ok, skipped, missing };
}

async function main() {
  const exercises = await downloadJson();
  await downloadGifs(exercises);
  console.log("\nDone. Open index.html via a local server, e.g.:");
  console.log("  npx serve .");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
