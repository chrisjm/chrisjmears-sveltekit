<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import SEO from "$lib/components/SEO.svelte"

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  const filteredSections = $derived(data.categorySections)
  const openCategories = $state({} as Record<string, boolean>)

</script>

<SEO
  title="Writing - Chris J Mears"
  description="Articles, guides, and resources by Chris J Mears on software engineering, data, and career development."
  type="website"
/>

<Section>
  <div class="mb-10">
    <h1 class="text-4xl font-bold mb-2">Writing</h1>
    <p class="text-gray-500 mb-6">Thoughts on data science, career development, and technology.</p>
  </div>

  {#if data.mostVisitedPosts?.length}
    <section class="mb-12">
      <div class="flex items-baseline justify-between mb-4 border-b border-gray-200 pb-2">
        <h2 class="text-2xl font-bold">Most Visited</h2>
      </div>
      <ul class="space-y-3">
        {#each data.mostVisitedPosts as post (post.id)}
          {@const fm = post.data?.metadata ?? {}}
          <li>
            <a href="/blog/{post.id}" class="group block">
              <h3 class="text-lg font-semibold text-sky-700 group-hover:text-sky-900 group-hover:underline leading-snug">
                {fm.title}
              </h3>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if data.recentPosts?.length}
    <section class="mb-12">
      <div class="flex items-baseline justify-between mb-4 border-b border-gray-200 pb-2">
        <h2 class="text-2xl font-bold">Most Recent</h2>
      </div>
      <ul class="space-y-3">
        {#each data.recentPosts as post (post.slug)}
          <li>
            <a href="/blog/{post.slug}" class="group block">
              <h3 class="text-lg font-semibold text-sky-700 group-hover:text-sky-900 group-hover:underline leading-snug">
                {post.frontmatter.title}
              </h3>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}


  {#if filteredSections.length > 0}
    {#each filteredSections as cat (cat.slug)}
      {@const previewPosts = cat.posts.slice(0, 5)}
      {@const olderPosts = cat.posts.slice(5)}
      {@const isOpen = openCategories[cat.slug] ?? false}
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">{cat.name}</h2>
        {#if cat.explanation}
          <p class="text-gray-500 mb-4 -mt-2 italic">{cat.explanation}</p>
        {/if}
        <ul class="space-y-3">
          {#each previewPosts as post (post.id)}
            {@const fm = post.data?.metadata ?? {}}
            <li>
              <a href={cat.slug === "data-nerd-newsletter" ? `/data-nerd-newsletter/${post.id}` : `/blog/${post.id}`} class="group block">
                <h3 class="text-lg font-semibold text-sky-700 group-hover:text-sky-900 group-hover:underline leading-snug">
                  {fm.title}
                </h3>
              </a>
            </li>
          {/each}
        </ul>
        {#if olderPosts.length > 0}
          <button
            class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mt-4"
            onclick={() => openCategories[cat.slug] = !isOpen}
            aria-expanded={isOpen}
          >
            <span class="text-xs uppercase tracking-widest font-medium">Older writing</span>
            <span class="text-xs opacity-60">({olderPosts.length} posts)</span>
            <span class="ml-1 text-xs">{isOpen ? "▲" : "▼"}</span>
          </button>
          {#if isOpen}
            <ul class="space-y-3 mt-4 opacity-75">
              {#each olderPosts as post (post.id)}
                {@const fm = post.data?.metadata ?? {}}
                <li>
                  <a href={cat.slug === "data-nerd-newsletter" ? `/data-nerd-newsletter/${post.id}` : `/blog/${post.id}`} class="group block">
                    <h3 class="text-lg font-semibold text-sky-700 group-hover:text-sky-900 group-hover:underline leading-snug">
                      {fm.title}
                    </h3>
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        {/if}
      </section>
    {/each}
  {/if}
</Section>
