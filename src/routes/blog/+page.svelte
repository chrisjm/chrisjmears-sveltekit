<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import BlogList from "$lib/components/BlogList.svelte"
  import SEO from "$lib/components/SEO.svelte"
  import ChipRow from "$lib/components/ChipRow.svelte"
  import { slugify } from "$lib/slugify"
  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  // Interactive filtering state
  let selectedCategories = $state<string[]>([])
  let selectedTags = $state<string[]>([])

  function toggleSelected(kind: "category" | "tag", slug: string) {
    if (kind === "category") {
      selectedCategories = selectedCategories.includes(slug)
        ? selectedCategories.filter((s) => s !== slug)
        : [...selectedCategories, slug]
    } else {
      selectedTags = selectedTags.includes(slug)
        ? selectedTags.filter((s) => s !== slug)
        : [...selectedTags, slug]
    }
  }

  // Derive filtered posts by OR within each facet, AND between facets
  const filteredPosts = $derived(
    data.allPosts.filter((p) => {
      const fm = p.data?.metadata ?? {}
      const cats: string[] = Array.isArray(fm.categories)
        ? fm.categories
        : fm.categories
          ? [fm.categories]
          : []
      const tags: string[] = Array.isArray(fm.tags) ? fm.tags : []

      const catSlugs = cats.map((c) => slugify(c))
      const tagSlugs = tags.map((t) => slugify(t))

      const hasCat =
        selectedCategories.length === 0 ||
        catSlugs.some((s) => selectedCategories.includes(s))

      const hasTag =
        selectedTags.length === 0 ||
        tagSlugs.some((s) => selectedTags.includes(s))

      return hasCat && hasTag
    })
  )

  function clearFilters() {
    selectedCategories = []
    selectedTags = []
  }

  function displayCategory(slug: string) {
    return data.categories?.find((c) => c.slug === slug)?.name ?? slug
  }
  function displayTag(slug: string) {
    return data.tags?.find((t) => t.slug === slug)?.name ?? slug
  }
</script>

<SEO
  title="Blog Archive - Chris J Mears"
  description="Articles and posts by Chris J Mears on software engineering, data, and AI."
  type="website"
/>

<Section>
  <h1 class="text-4xl mb-6">Blog Archive</h1>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="md:col-span-2">
      {#if selectedCategories.length || selectedTags.length}
        <div class="mb-4 text-sm text-gray-600 flex items-center gap-2 flex-wrap">
          <span class="opacity-80">Active filters:</span>
          {#each selectedCategories as sc}
            <span class="rounded-full border px-2 py-0.5">Category: {displayCategory(sc)}</span>
          {/each}
          {#each selectedTags as st}
            <span class="rounded-full border px-2 py-0.5">Tag: #{displayTag(st)}</span>
          {/each}
          <button class="ml-2 underline" onclick={clearFilters}>Clear</button>
        </div>
      {/if}
      <BlogList posts={filteredPosts} />
    </div>
    <aside class="md:col-span-1 md:sticky top-4 h-fit">
      {#if data.categories?.length}
        <ChipRow
          title="Browse by Category"
          items={data.categories}
          hrefPrefix="/blog/category/"
          interactive={true}
          selected={selectedCategories}
          hideToggle={true}
          defaultExpanded={true}
          kind="category"
          on:select={(e) => toggleSelected(e.detail.kind, e.detail.slug)}
        />
      {/if}

      {#if data.tags?.length}
        <div class="mt-6">
          <ChipRow
            title="Browse by Tag"
            items={data.tags}
            hrefPrefix="/blog/tag/"
            interactive={true}
            selected={selectedTags}
            hideToggle={true}
            defaultExpanded={true}
            kind="tag"
            on:select={(e) => toggleSelected(e.detail.kind, e.detail.slug)}
          />
        </div>
      {/if}
    </aside>
  </div>
</Section>
