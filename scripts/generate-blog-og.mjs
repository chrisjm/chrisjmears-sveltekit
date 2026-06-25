import { readdir, readFile, mkdir, access } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, "src", "posts", "blog");
const NEWSLETTER_DIR = join(ROOT, "src", "posts", "data-nerd-newsletter");
const BLOG_OUT_DIR = join(ROOT, "static", "images", "og", "blog");
const NEWSLETTER_OUT_DIR = join(ROOT, "static", "images", "og", "data-nerd-newsletter");
const SITE_URL = "chrisjmears.com";
const BASE_SEED = 42;
const WIDTH = 1200;
const HEIGHT = 630;
const FORCE = process.argv.includes("--force");

// Category-specific palettes for visual grouping
const CATEGORY_PALETTES = {
  Business: { hues: [10, 40, 350, 300] },
  "Career Development": { hues: [200, 220, 180, 240] },
  Personal: { hues: [120, 80, 160, 60] },
  Resources: { hues: [270, 240, 300, 210] },
  "data-nerd-newsletter": { hues: [180, 200, 160, 220] },
};

// Fallback vibrant palettes for uncategorized posts
const FALLBACK_PALETTES = [
  { hues: [280, 320, 200, 180] },
  { hues: [160, 180, 200, 280] },
  { hues: [50, 30, 0, 340] },
  { hues: [120, 80, 160, 200] },
  { hues: [270, 240, 210, 300] },
  { hues: [330, 280, 220, 190] },
  { hues: [20, 60, 180, 220] },
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
  const lines = yaml.split("\n");
  for (const line of lines) {
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (!kvMatch) continue;
    const key = kvMatch[1];
    let value = kvMatch[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    } else if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1);
      value = inner
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    }
    fm[key] = value;
  }
  return fm;
}

function slugFromFilename(filename) {
  return basename(filename, extname(filename));
}

function getFirstCategory(fm) {
  const cats = fm.categories;
  if (Array.isArray(cats)) return cats[0] || null;
  return cats || null;
}

// Estimate text width for auto-sizing (sans-serif heuristic)
function estimateTextWidth(text, fontSize) {
  // Average char width factor for bold sans-serif
  const avgCharWidth = 0.52;
  return text.length * fontSize * avgCharWidth;
}

// Auto-size title text: find the largest font size that fits, with line wrapping
function layoutTitle(title, maxWidth, maxHeight, maxFontSize = 96, minFontSize = 42) {
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

function getPalette(category, slug) {
  if (category && CATEGORY_PALETTES[category]) {
    return CATEGORY_PALETTES[category];
  }
  const seed = BASE_SEED + hashSlug(slug);
  return FALLBACK_PALETTES[seed % FALLBACK_PALETTES.length];
}

const CATEGORY_EMOJIS = {
  Business: "💼",
  "Career Development": "🎯",
  Personal: "❤️",
  Resources: "📚",
  "data-nerd-newsletter": "📊",
};

function generateBadgeSVG(badgeText, emoji) {
  const badgeFontSize = 30;
  const badgeHeight = 68;
  const badgePadding = 48;
  const fullText = emoji ? `${emoji} ${badgeText}` : badgeText;
  const badgeWidth = Math.ceil(estimateTextWidth(fullText, badgeFontSize)) + badgePadding * 2;
  const badgeX = (WIDTH - badgeWidth) / 2;
  const badgeY = 25;

  return `  <!-- Category badge -->
  <g transform="translate(${badgeX}, ${badgeY})">
    <rect width="${badgeWidth}" height="${badgeHeight}" rx="${badgeHeight / 2}" fill="#000000" fill-opacity="0.45" />
    <text x="${badgeWidth / 2}" y="${badgeHeight / 2}" font-size="${badgeFontSize}" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="'DM Sans', 'Helvetica Neue', Arial, sans-serif">${escapeXml(fullText)}</text>
  </g>`;
}

function generateSVG(slug, title, category, type, rng) {
  const seed = BASE_SEED + hashSlug(slug);
  const palette = getPalette(category, slug);

  // Seeded turbulence parameters
  const turbSeed = seed % 10000;
  const baseFreq = 0.004 + rng() * 0.008;
  const numOctaves = 2 + Math.floor(rng() * 3);
  const displacementScale = 80 + rng() * 120;

  // Generate gradient stops with vibrant colors
  const hueShift = rng() * 60 - 30;
  const colors = palette.hues.map((h) => {
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

  // Determine badge text and emoji
  let badgeText = null;
  let badgeEmoji = null;
  if (type === "newsletter") {
    badgeText = "Data Nerd Newsletter";
    badgeEmoji = CATEGORY_EMOJIS["data-nerd-newsletter"];
  } else if (category) {
    badgeText = category;
    badgeEmoji = CATEGORY_EMOJIS[category];
  }

  // Title layout — shift down to make room for badge
  const titleAreaHeight = 280;
  const { fontSize, lines, lineHeight } = layoutTitle(
    title,
    WIDTH,
    titleAreaHeight,
  );

  // Build title text elements (shifted down for larger badge)
  const titleShift = badgeText ? 10 : -40;
  const titleYCenter =
    HEIGHT / 2 - ((lines.length - 1) * lineHeight) / 2 + titleShift;
  const titleText = lines
    .map((line, i) => {
      const y = titleYCenter + i * lineHeight;
      return `      <text x="${WIDTH / 2}" y="${y}" font-size="${fontSize}" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="'DM Sans', 'Helvetica Neue', Arial, sans-serif" filter="url(#textShadow)">${escapeXml(line)}</text>`;
    })
    .join("\n");

  // URL text at bottom
  const urlY = HEIGHT - 55;
  const badgeSVG = badgeText ? generateBadgeSVG(badgeText, badgeEmoji) : "";

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

${badgeSVG}

  <!-- Title -->
  ${titleText}

  <!-- Site URL -->
  <text x="${WIDTH / 2}" y="${urlY}" font-size="39" font-weight="400" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" fill-opacity="0.7" font-family="'DM Sans', 'Helvetica Neue', Arial, sans-serif">${SITE_URL}</text>
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

async function processDirectory(srcDir, outDir, type) {
  await mkdir(outDir, { recursive: true });

  const files = await readdir(srcDir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  if (mdFiles.length === 0) {
    console.log(`No posts found in ${srcDir}`);
    return { generated: 0, skipped: 0, total: 0 };
  }

  let generated = 0;
  let skipped = 0;

  for (const file of mdFiles) {
    const slug = slugFromFilename(file);
    const outPath = join(outDir, `${slug}.png`);

    if (!FORCE && (await fileExists(outPath))) {
      console.log(`  SKIP  ${type}/${slug} (already exists)`);
      skipped++;
      continue;
    }

    const content = await readFile(join(srcDir, file), "utf-8");
    const fm = parseFrontmatter(content);
    const title = fm.title || slug;
    const category = getFirstCategory(fm);

    const seed = BASE_SEED + hashSlug(slug);
    const rng = mulberry32(seed);
    const svg = generateSVG(slug, title, category, type, rng);

    await sharp(Buffer.from(svg)).png().toFile(outPath);
    console.log(`  OK    ${type}/${slug}`);
    generated++;
  }

  return { generated, skipped, total: mdFiles.length };
}

async function main() {
  console.log("Generating blog OG images...");
  const blog = await processDirectory(BLOG_DIR, BLOG_OUT_DIR, "blog");

  console.log("\nGenerating newsletter OG images...");
  const newsletter = await processDirectory(
    NEWSLETTER_DIR,
    NEWSLETTER_OUT_DIR,
    "newsletter",
  );

  const totalGen = blog.generated + newsletter.generated;
  const totalSkip = blog.skipped + newsletter.skipped;
  const totalPosts = blog.total + newsletter.total;

  console.log(
    `\nDone: ${totalGen} generated, ${totalSkip} skipped, ${totalPosts} total`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
