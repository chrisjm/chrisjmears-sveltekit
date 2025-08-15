import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const PORT = Number(process.env.OG_PORT ?? 4173);
const BASE_URL = process.env.OG_URL ?? `http://localhost:${PORT}`;
const OUT_PATH = process.env.OG_OUT ?? join(ROOT, "static", "og-home.png");
const VIEWPORT = { width: 1200, height: 630 };

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return true;
    } catch (_) {
      // ignore until it comes up
    }
    await sleep(300);
  }
  return false;
}

async function main() {
  // Start preview server for the built site
  const preview = spawn(
    "npm",
    ["run", "preview", "--", "--port", String(PORT), "--strictPort"],
    { cwd: ROOT, stdio: "inherit" },
  );

  const stopPreview = async () => {
    if (!preview.killed) {
      preview.kill("SIGINT");
      await sleep(500);
      try {
        preview.kill("SIGKILL");
      } catch (_) {}
    }
  };

  process.on("SIGINT", stopPreview);
  process.on("SIGTERM", stopPreview);
  process.on("exit", stopPreview);

  const up = await waitForServer(BASE_URL);
  if (!up) {
    await stopPreview();
    throw new Error("Preview server did not start in time");
  }

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: VIEWPORT });
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.screenshot({ path: OUT_PATH, fullPage: false });
    console.log(`OpenGraph image saved to: ${OUT_PATH}`);
  } finally {
    await browser.close();
    await stopPreview();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
