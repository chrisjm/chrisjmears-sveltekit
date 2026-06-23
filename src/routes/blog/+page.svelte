<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import SEO from "$lib/components/SEO.svelte"
  import CategorySection from "$lib/components/CategorySection.svelte"
  import ResourceCard from "$lib/components/ResourceCard.svelte"
  import { slugify } from "$lib/slugify"

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  let selectedTag = $state<string | null>(null)
  let showAllTags = $state(false)
  let showDemoted = $state(false)

  const TOP_TAG_COUNT = 8

  const FEATURED_SLUGS = $derived(new Set(data.FEATURED_SLUGS ?? []))
  const DEMOTED_SLUGS = $derived(new Set(data.DEMOTED_SLUGS ?? []))

  function toggleTag(slug: string) {
    selectedTag = selectedTag === slug ? null : slug
  }

  function isFeatured(slug: string) {
    return FEATURED_SLUGS.has(slug)
  }

  function isDemoted(slug: string) {
    return DEMOTED_SLUGS.has(slug)
  }

  const filteredSections = $derived(
    selectedTag
      ? data.categorySections
          .map((cat: any) => ({
            ...cat,
            posts: cat.posts.filter((p: any) => {
              const tags: string[] = Array.isArray(p.data?.metadata?.tags)
                ? p.data.metadata.tags
                : []
              return tags.some((t) => slugify(t) === selectedTag)
            }),
          }))
          .filter((cat: any) => cat.posts.length > 0)
      : data.categorySections,
  )

  const featuredSections = $derived(filteredSections.filter((c: any) => isFeatured(c.slug)))
  const midSections = $derived(filteredSections.filter((c: any) => !isFeatured(c.slug) && !isDemoted(c.slug)))
  const demotedSections = $derived(filteredSections.filter((c: any) => isDemoted(c.slug)))

  const filteredResources = $derived(
    selectedTag
      ? data.resourcePosts.filter((p: any) => {
          const tags: string[] = Array.isArray(p.data?.metadata?.tags)
            ? p.data.metadata.tags
            : []
          return tags.some((t) => slugify(t) === selectedTag)
        })
      : data.resourcePosts,
  )
</script>

<SEO
  title="Writing - Chris J Mears"
  description="Articles, guides, and resources by Chris J Mears on software engineering, data, and career development."
  type="website"
/>

<Section>
  <div class="mb-10">
    <h1 class="text-4xl font-bold mb-2">Writing</h1>
    <p class="text-gray-500 mb-6">Posts and resources organized by topic.</p>
  </div>

  {#if data.tags?.length}
    <div class="mb-10">
      <p class="text-xs uppercase tracking-widest text-gray-400 mb-3">Filter by tag</p>
      <div class="flex flex-wrap gap-2">
        {#each (showAllTags ? data.tags : data.tags.slice(0, TOP_TAG_COUNT)) as tag (tag.slug)}
          <button
            class={`rounded-full border px-3 py-1 text-sm transition-colors ${
              selectedTag === tag.slug
                ? "bg-gray-900 text-white border-gray-900"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            aria-pressed={selectedTag === tag.slug}
            onclick={() => toggleTag(tag.slug)}
          >
            #{tag.name}
            <span class="opacity-50 text-xs">({tag.count})</span>
          </button>
        {/each}
        {#if data.tags.length > TOP_TAG_COUNT}
          <button
            class="rounded-full border border-dashed px-3 py-1 text-sm text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors"
            onclick={() => (showAllTags = !showAllTags)}
          >
            {showAllTags ? "Show less" : `+${data.tags.length - TOP_TAG_COUNT} more`}
          </button>
        {/if}
        {#if selectedTag}
          <button
            class="text-sm text-gray-400 underline ml-2"
            onclick={() => (selectedTag = null)}
          >Clear</button>
        {/if}
      </div>
    </div>
  {/if}

  {#if filteredSections.length === 0}
    <p class="text-gray-500 mb-8">No posts match the selected tag.</p>
  {:else}
    {#each featuredSections as cat (cat.slug)}
      <CategorySection
        title={cat.name}
        posts={cat.posts}
        seeAllHref="/blog/category/{cat.slug}"
        limit={3}
      />
    {/each}

    {#each midSections as cat (cat.slug)}
      <CategorySection
        title={cat.name}
        posts={cat.posts}
        seeAllHref="/blog/category/{cat.slug}"
        limit={3}
      />
    {/each}

    {#if filteredResources.length}
      <section class="mt-4 mb-12">
        <div class="flex items-baseline justify-between mb-4 border-b border-gray-200 pb-2">
          <h2 class="text-2xl font-bold">Resources</h2>
          <p class="text-sm text-gray-400">Living documents, updated over time</p>
        </div>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each filteredResources as post (post.id)}
            <ResourceCard {post} />
          {/each}
        </ul>
      </section>
    {/if}

    {#if demotedSections.length && !selectedTag}
      <div class="mt-4 border-t border-gray-100 pt-8">
        <button
          class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
          onclick={() => (showDemoted = !showDemoted)}
          aria-expanded={showDemoted}
        >
          <span class="text-xs uppercase tracking-widest font-medium">Older writing</span>
          <span class="text-xs opacity-60">({demotedSections.reduce((n: number, c: any) => n + c.posts.length, 0)} posts)</span>
          <span class="ml-1 text-xs">{showDemoted ? "▲" : "▼"}</span>
        </button>
        {#if showDemoted}
          <div class="opacity-75">
            {#each demotedSections as cat (cat.slug)}
              <CategorySection
                title={cat.name}
                posts={cat.posts}
                seeAllHref="/blog/category/{cat.slug}"
                limit={3}
              />
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    {#if demotedSections.length && selectedTag}
      {#each demotedSections as cat (cat.slug)}
        <CategorySection
          title={cat.name}
          posts={cat.posts}
          seeAllHref="/blog/category/{cat.slug}"
          limit={3}
        />
      {/each}
    {/if}
  {/if}
</Section>
