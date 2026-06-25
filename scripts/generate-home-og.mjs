#!/usr/bin/env node
// Screenshot the home page and save as static/og-home.png
// NOTE: Run `npm run dev` first to start the dev server
// Usage: node scripts/generate-home-og.mjs [--url http://localhost:5173]

import puppeteer from "puppeteer";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT_PATH = join(ROOT, "static", "og-home.png");
const WIDTH = 1200;
const HEIGHT = 630;

const urlArgIdx = process.argv.indexOf("--url");
const BASE_URL =
  urlArgIdx !== -1 && process.argv[urlArgIdx + 1]
    ? process.argv[urlArgIdx + 1]
    : "http://localhost:5173";

async function main() {
  console.log(`Screenshotting ${BASE_URL} → ${OUT_PATH}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT });
    await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 30000 });

    // Extra delay for web fonts and lazy images to render
    await new Promise((r) => setTimeout(r, 800));

    await mkdir(join(ROOT, "static"), { recursive: true });
    const screenshot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    await writeFile(OUT_PATH, screenshot);
    console.log(`  OK  static/og-home.png (${WIDTH}×${HEIGHT})`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
