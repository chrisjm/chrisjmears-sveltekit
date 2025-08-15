<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import BlogList from "$lib/components/BlogList.svelte"
  import SEO from "$lib/components/SEO.svelte"
  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<SEO
  title="Blog Archive - Chris J Mears"
  description="Articles and posts by Chris J Mears on software engineering, data, and AI."
  type="website"
/>

<Section>
  <h1 class="text-4xl mb-6">Blog Archive</h1>
  {#if data.categories?.length}
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Browse by Category</h2>
      <ul class="flex flex-wrap gap-2">
        {#each data.categories as c (c.slug)}
          <li>
            <a
              class="inline-block rounded-full border px-3 py-1 text-sm hover:bg-gray-100"
              href="/blog/category/{c.slug}"
              >{c.name} <span class="opacity-60">({c.count})</span></a
            >
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if data.tags?.length}
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Browse by Tag</h2>
      <ul class="flex flex-wrap gap-2">
        {#each data.tags as t (t.slug)}
          <li>
            <a
              class="inline-block rounded-full border px-3 py-1 text-sm hover:bg-gray-100"
              href="/blog/tag/{t.slug}"
              >{t.name} <span class="opacity-60">({t.count})</span></a
            >
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  <BlogList posts={data.allPosts} />
</Section>
