import type { Embed, Item } from "./types"

export function buildProfileUrl(handle?: string): string | undefined {
  return handle ? `https://bsky.app/profile/${handle}` : undefined
}

export function extractRkey(uri?: string): string | undefined {
  return uri?.split("/").pop()
}

export function buildAppPostUrl(handle?: string, uri?: string): string | undefined {
  const rkey = extractRkey(uri)
  return handle && rkey ? `https://bsky.app/profile/${handle}/post/${rkey}` : undefined
}

export function summarizeEmbed(embed: any): Embed {
  if (!embed || typeof embed !== "object") return null
  const t = embed.$type
  if (t === "app.bsky.embed.images#view" && Array.isArray(embed.images) && embed.images.length > 0) {
    const img = embed.images[0]
    return { type: "image", thumb: img.thumb, fullsize: img.fullsize, alt: img.alt || "" }
  }
  if (t === "app.bsky.embed.external#view" && embed.external) {
    return { type: "external", uri: embed.external.uri, title: embed.external.title, description: embed.external.description, thumb: embed.external.thumb }
  }
  if (t === "app.bsky.embed.record#view" && embed.record) {
    return { type: "record", by: embed.record.author?.handle, uri: embed.record.uri, valueType: embed.record.value?.$type }
  }
  return null
}

export function normalizeEntry(entry: any): Item | null {
  try {
    const post = entry.post || {}
    const author = post.author || {}
    const record = post.record || {}
    const createdAt = record.createdAt || post.indexedAt
    const uri: string | undefined = post.uri
    if (!uri) return null

    const handle: string | undefined = author?.handle
    const appUrl = buildAppPostUrl(handle, uri)

    // Repost metadata from feed.reason
    const reason = entry?.reason || {}
    const isRepost = reason?.$type === "app.bsky.feed.defs#reasonRepost"
    const rep = isRepost ? reason.by || {} : {}
    const repost = isRepost
      ? {
          byHandle: rep.handle,
          byDisplayName: rep.displayName,
          byAvatar: rep.avatar,
          profileUrl: buildProfileUrl(rep.handle)
        }
      : undefined

    return {
      id: uri,
      text: record.text || "",
      createdAt,
      author: { handle, displayName: author.displayName, avatar: author.avatar },
      url: appUrl,
      embed: summarizeEmbed(post.embed),
      repost
    }
  } catch {
    return null
  }
}

export function timeAgo(iso?: string): string {
  if (!iso) return ""
  const now = Date.now()
  const then = new Date(iso).getTime()
  const s = Math.max(0, Math.floor((now - then) / 1000))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo}mo`
  const y = Math.floor(mo / 12)
  return `${y}y`
}

export function linkify(text: string): string {
  if (!text) return ""
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" class="underline hover:no-underline" target="_blank" rel="noopener noreferrer">${url}</a>`
  )
}
