#!/usr/bin/env node
// Fetch top 3 recent Bluesky posts (no replies, includes reposts) and write to static/data/bsky.json
// Run: npm run fetch-bsky

const ACTOR = process.env.BSKY_ACTOR || "chrisjmears.com";
const LIMIT = Number(process.env.BSKY_LIMIT || 3);
const ENDPOINT = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(
  ACTOR,
)}&limit=${LIMIT}&filter=posts_no_replies`;

const fs = await import("fs/promises");
const path = await import("path");

async function main() {
  try {
    const res = await fetch(ENDPOINT, {
      headers: { accept: "application/json" },
    });
    if (!res.ok)
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    const data = await res.json();

    const items = Array.isArray(data?.feed) ? data.feed : [];
    // Include reposts; replies already excluded via filter=posts_no_replies
    const normalized = items
      .slice(0, LIMIT)
      .map((it) => normalizeItem(it))
      .filter(Boolean);

    const outDir = path.resolve("static", "data");
    const outFile = path.join(outDir, "bsky.json");
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(
      outFile,
      JSON.stringify(
        {
          actor: ACTOR,
          fetchedAt: new Date().toISOString(),
          items: normalized,
        },
        null,
        2,
      ),
    );

    console.log(`Wrote ${normalized.length} items to ${outFile}`);
  } catch (err) {
    console.error("Error prefetching Bluesky feed:", err);
    process.exitCode = 1;
  }
}

function normalizeItem(entry) {
  try {
    const post = entry.post;
    const author = post.author || {};
    const record = post.record || {};
    const createdAt = record.createdAt || post.indexedAt;

    const uri = post.uri; // e.g., at://did:plc:.../app.bsky.feed.post/3abc123
    if (!uri) return null;
    const rkey = uri?.split("/").pop();
    const handle = author.handle;
    const appUrl =
      handle && rkey
        ? `https://bsky.app/profile/${handle}/post/${rkey}`
        : undefined;

    // Basic text; you can extend for facets later
    const text = record.text || "";

    // Minimal embed summary
    const embed = summarizeEmbed(post.embed);

    // Repost metadata from feed.reason
    const reason = entry?.reason || {};
    const isRepost = reason?.$type === "app.bsky.feed.defs#reasonRepost";
    const rep = isRepost ? reason.by || {} : {};
    const repost = isRepost
      ? {
          byHandle: rep.handle,
          byDisplayName: rep.displayName,
          byAvatar: rep.avatar,
          profileUrl: rep.handle
            ? `https://bsky.app/profile/${rep.handle}`
            : undefined,
        }
      : undefined;

    return {
      id: uri,
      text,
      createdAt,
      author: {
        handle,
        displayName: author.displayName,
        avatar: author.avatar,
      },
      url: appUrl,
      embed,
      repost,
    };
  } catch {
    return null;
  }
}

function summarizeEmbed(embed) {
  if (!embed || typeof embed !== "object") return null;
  const t = embed.$type;
  if (
    t === "app.bsky.embed.images#view" &&
    Array.isArray(embed.images) &&
    embed.images.length > 0
  ) {
    const img = embed.images[0];
    return {
      type: "image",
      thumb: img.thumb,
      fullsize: img.fullsize,
      alt: img.alt || "",
    };
  }
  if (t === "app.bsky.embed.external#view" && embed.external) {
    return {
      type: "external",
      uri: embed.external.uri,
      title: embed.external.title,
      description: embed.external.description,
      thumb: embed.external.thumb,
    };
  }
  if (t === "app.bsky.embed.record#view" && embed.record) {
    return {
      type: "record",
      by: embed.record.author?.handle,
      uri: embed.record.uri,
      valueType: embed.record.value?.$type,
    };
  }
  return null;
}

await main();
