import { readdir, readFile, mkdir, access } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const ROOT = process.cwd();
const POSTS_DIR = join(ROOT, "src", "posts", "blog");
const OUT_DIR = join(ROOT, "static", "images", "og", "blog");
const SITE_URL = "chrisjmears.com";
const WIDTH = 1200;
const HEIGHT = 630;
const FORCE = process.argv.includes("--force");

// Vibrant base palettes — each is a set of HSL hues
const PALETTES = [
  { hues: [280, 320, 200, 180], name: "magenta-cyan" },
  { hues: [10, 40, 350, 300], name: "sunset" },
  { hues: [160, 180, 200, 280], name: "ocean" },
  { hues: [50, 30, 0, 340], name: "gold-crimson" },
  { hues: [120, 80, 160, 200], name: "forest-spring" },
  { hues: [270, 240, 210, 300], name: "violet-indigo" },
  { hues: [330, 280, 220, 190], name: "berry-sky" },
  { hues: [20, 60, 180, 220], name: "amber-azure" },
];

// Simple seeded PRNG (mulberry32)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSlug(slug) {
  const hash = createHash("md5").update(slug).digest();
  return hash.readUInt32LE(0);
}

function hsl(h, s, l) {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const fm = {};
  // Simple YAML parsing for our flat key-value frontmatter
  const lines = yaml.split("\n");
  for (const line of lines) {
    const kv = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kv) {
      fm[kv[1]] = kv[2].replace(/"/g, "");
    }
  }
  return fm;
}

function slugFromFilename(filename) {
  return basename(filename, extname(filename));
}

// Estimate text width for auto-sizing (sans-serif heuristic)
function estimateTextWidth(text, fontSize) {
  // Average char width factor for bold sans-serif
  const avgCharWidth = 0.52;
  return text.length * fontSize * avgCharWidth;
}

// Auto-size title text: find the largest font size that fits, with line wrapping
function layoutTitle(title, maxWidth, maxHeight, maxFontSize = 64, minFontSize = 28) {
  const padding = 80;
  const availableWidth = maxWidth - padding * 2;
  const lineHeightFactor = 1.25;

  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 2) {
    const words = title.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (estimateTextWidth(testLine, fontSize) <= availableWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
        // If single word is too wide, it just overflows — acceptable
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * lineHeightFactor;
    const totalHeight = lines.length * lineHeight;

    // Check if it fits vertically (leave room for URL at bottom + top padding)
    if (totalHeight <= maxHeight && lines.length <= 3) {
      return { fontSize, lines, lineHeight };
    }
  }

  // Fallback: use min font size with aggressive wrapping
  const fontSize = minFontSize;
  const words = title.split(" ");
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (estimateTextWidth(testLine, fontSize) <= availableWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  const lineHeight = fontSize * lineHeightFactor;
  return { fontSize, lines: lines.slice(0, 4), lineHeight };
}

function generateSVG(slug, title, rng) {
  const seed = hashSlug(slug);
  const palette = PALETTES[seed % PALETTES.length];

  // Seeded turbulence parameters
  const turbSeed = seed % 10000;
  const baseFreq = 0.004 + rng() * 0.008;
  const numOctaves = 2 + Math.floor(rng() * 3);
  const displacementScale = 80 + rng() * 120;

  // Generate gradient stops with vibrant colors
  const hueShift = rng() * 60 - 30;
  const colors = palette.hues.map((h, i) => {
    const hue = (h + hueShift + 360) % 360;
    const sat = 70 + rng() * 25;
    const light = 35 + rng() * 25;
    return hsl(hue, sat, light);
  });

  // Random gradient focal points
  const cx1 = 20 + rng() * 60;
  const cy1 = 20 + rng() * 60;
  const cx2 = 20 + rng() * 60;
  const cy2 = 20 + rng() * 60;
  const cx3 = 20 + rng() * 60;
  const cy3 = 20 + rng() * 60;

  // Background base color (dark, vibrant)
  const bgHue = (palette.hues[0] + hueShift + 360) % 360;
  const bgColor = hsl(bgHue, 50, 12);

  // Title layout
  const titleAreaHeight = 320;
  const titleYStart = 100;
  const { fontSize, lines, lineHeight } = layoutTitle(
    title,
    WIDTH,
    titleAreaHeight,
  );

  // Build title text elements
  const titleYCenter = HEIGHT / 2 - ((lines.length - 1) * lineHeight) / 2;
  const titleText = lines
    .map((line, i) => {
      const y = titleYCenter + i * lineHeight;
      return `      <text x="${WIDTH / 2}" y="${y}" font-size="${fontSize}" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="'DM Sans', 'Helvetica Neue', Arial, sans-serif" filter="url(#textShadow)">${escapeXml(line)}</text>`;
    })
    .join("\n");

  // URL text at bottom
  const urlY = HEIGHT - 40;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <filter id="turbulence" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${baseFreq.toFixed(6)}" numOctaves="${numOctaves}" seed="${turbSeed}" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="${displacementScale.toFixed(1)}" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.6" />
    </filter>
    <radialGradient id="grad1" cx="${cx1}%" cy="${cy1}%" r="70%">
      <stop offset="0%" stop-color="${colors[0]}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${colors[0]}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="grad2" cx="${cx2}%" cy="${cy2}%" r="60%">
      <stop offset="0%" stop-color="${colors[1]}" stop-opacity="0.85" />
      <stop offset="100%" stop-color="${colors[1]}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="grad3" cx="${cx3}%" cy="${cy3}%" r="55%">
      <stop offset="0%" stop-color="${colors[2]}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${colors[2]}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="grad4" cx="${100 - cx1}%" cy="${100 - cy1}%" r="50%">
      <stop offset="0%" stop-color="${colors[3]}" stop-opacity="0.75" />
      <stop offset="100%" stop-color="${colors[3]}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.25" />
      <stop offset="40%" stop-color="#000000" stop-opacity="0.45" />
      <stop offset="60%" stop-color="#000000" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.25" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${bgColor}" />

  <!-- Swirl layers with turbulence displacement -->
  <g filter="url(#turbulence)">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad1)" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad2)" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad3)" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad4)" />
  </g>

  <!-- Dark overlay for text readability -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#overlay)" />

  <!-- Title -->
  ${titleText}

  <!-- Site URL -->
  <text x="${WIDTH / 2}" y="${urlY}" font-size="26" font-weight="400" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" fill-opacity="0.7" font-family="'DM Sans', 'Helvetica Neue', Arial, sans-serif">${SITE_URL}</text>
</svg>`;
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const files = await readdir(POSTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  if (mdFiles.length === 0) {
    console.log("No blog posts found in", POSTS_DIR);
    return;
  }

  let generated = 0;
  let skipped = 0;

  for (const file of mdFiles) {
    const slug = slugFromFilename(file);
    const outPath = join(OUT_DIR, `${slug}.png`);

    if (!FORCE && (await fileExists(outPath))) {
      console.log(`  SKIP  ${slug} (already exists)`);
      skipped++;
      continue;
    }

    const content = await readFile(join(POSTS_DIR, file), "utf-8");
    const fm = parseFrontmatter(content);
    const title = fm.title || slug;

    const seed = hashSlug(slug);
    const rng = mulberry32(seed);
    const svg = generateSVG(slug, title, rng);

    await sharp(Buffer.from(svg)).png().toFile(outPath);
    console.log(`  OK    ${slug}`);
    generated++;
  }

  console.log(
    `\nDone: ${generated} generated, ${skipped} skipped, ${mdFiles.length} total`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
