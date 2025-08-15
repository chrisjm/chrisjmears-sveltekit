<script lang="ts">
  import { onMount } from "svelte"
  import Section from "$lib/components/Section.svelte"
  import type { Item } from "$lib/bsky/types"
  import { timeAgo, linkify, normalizeEntry } from "$lib/bsky/utils"

  let items: Item[] = $state([])
  let loading: boolean = $state(true)
  let error: string | null = $state(null)

  const LIMIT = 3
  const ACTOR = "chrisjmears.com"

  const ENDPOINT = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(
    ACTOR
  )}&limit=${LIMIT}&filter=posts_no_replies`

  onMount(async () => {
    // 1) Try to read prefilled JSON
    try {
      const res = await fetch("/data/bsky.json", {
        headers: { accept: "application/json" },
      })
      if (res.ok) {
        const json = await res.json()
        const prefilled: Item[] = Array.isArray(json?.items) ? json.items : []
        if (prefilled.length) items = prefilled.slice(0, LIMIT)
      }
    } catch {
      // ignore prefill errors
    }

    // 2) Fetch live data and update
    try {
      const res = await fetch(ENDPOINT, {
        headers: { accept: "application/json" },
      })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data = await res.json()
      const feed = Array.isArray(data?.feed) ? data.feed : []
      const normalized: Item[] = feed.map(normalizeEntry).filter(Boolean)

      // Merge with prefilled by id, prefer live
      const map = new Map<string, Item>()
      for (const it of items) map.set(it.id, it)
      for (const it of normalized) map.set(it.id, it)
      const merged = Array.from(map.values())
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        )
        .slice(0, LIMIT)
      items = merged
      error = null
    } catch (e: any) {
      if (!items.length) error = "Unable to load Bluesky posts right now."
    } finally {
      loading = false
    }
  })

</script>

<Section sectionClasses="bg-sky-600">
  <div class="flex items-baseline justify-between">
    <h2 class="text-xl text-white font-semibold">Latest on Bluesky</h2>
    <a
      href="https://bsky.app/profile/chrisjmears.com"
      target="_blank"
      rel="noopener noreferrer"
      class="text-sm text-sky-200 hover:text-sky-100">View profile</a
    >
  </div>

  {#if loading && items.length === 0}
    <ul
      class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
    >
      {#each Array(3) as _, i}
        <li
          class="rounded-md border border-gray-200 p-4 animate-pulse bg-gray-50"
          aria-hidden="true"
        >
          <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div class="mt-2 h-4 w-2/3 bg-gray-200 rounded"></div>
          <div class="mt-3 h-3 w-24 bg-gray-200 rounded"></div>
        </li>
      {/each}
    </ul>
  {:else if error && items.length === 0}
    <p class="mt-4 text-sm text-gray-600 bg-gray-50">{error}</p>
  {:else}
    <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each items as it}
        <li class="rounded-md border border-gray-200 p-4 bg-gray-50">
          {#if it.repost?.byHandle}
            <div
              class="mb-2 flex items-center justify-between text-xs text-gray-600"
            >
              <div>
                <span aria-hidden="true">↻</span>
                <span> Reposted by </span>
                {#if it.repost.profileUrl}
                  <a
                    href={it.repost.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hover:underline"
                  >
                    {it.repost.byDisplayName || `@${it.repost.byHandle}`}
                  </a>
                {:else}
                  <span
                    >{it.repost.byDisplayName || `@${it.repost.byHandle}`}</span
                  >
                {/if}
              </div>
              {#if it.url}
                <a
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sky-600 hover:text-sky-700">Original post →</a
                >
              {/if}
            </div>
          {/if}
          <div class="flex items-center gap-3">
            {#if it.author?.avatar}
              <img
                src={it.author.avatar}
                alt={it.author?.displayName || it.author?.handle || "Avatar"}
                class="h-8 w-8 rounded-full"
                loading="lazy"
              />
            {/if}
            <div class="text-sm">
              {#if it.author?.handle}
                <a
                  href={`https://bsky.app/profile/${it.author.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium hover:underline"
                >
                  {it.author?.displayName || it.author?.handle}
                </a>
              {:else}
                <span class="font-medium"
                  >{it.author?.displayName || it.author?.handle}</span
                >
              {/if}
              {#if it.createdAt}
                <span class="text-gray-500"> · {timeAgo(it.createdAt)}</span>
              {/if}
            </div>
          </div>
          <div class="mt-2 text-[15px] leading-relaxed">
            {@html linkify(it.text)}
          </div>

          {#if it.embed}
            {#if it.embed.type === "image" && (it.embed.thumb || it.embed.fullsize)}
              <a
                class="mt-3 block"
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={it.embed.thumb || it.embed.fullsize}
                  alt={it.embed.alt || ""}
                  class="rounded-md border border-gray-200 max-h-80 w-auto"
                  loading="lazy"
                />
              </a>
            {:else if it.embed.type === "external"}
              <a
                class="mt-3 block rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                href={it.embed.uri}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="flex items-center gap-3">
                  {#if it.embed.thumb}
                    <img
                      src={it.embed.thumb}
                      alt={it.embed.title || "Link thumbnail"}
                      class="h-12 w-12 rounded object-cover border border-gray-200"
                      loading="lazy"
                    />
                  {/if}
                  <div>
                    <div class="text-sm font-medium line-clamp-1">
                      {it.embed.title}
                    </div>
                    <div class="text-xs text-gray-600 line-clamp-2">
                      {it.embed.description}
                    </div>
                  </div>
                </div>
              </a>
            {:else if it.embed.type === "record"}
              <div
                class="mt-3 rounded-md border border-gray-200 p-3 text-sm text-gray-700"
              >
                Quoted post{it.embed.by ? ` by ${it.embed.by}` : ""}
              </div>
            {/if}
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</Section>
