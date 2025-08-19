<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import SEO from "$lib/components/SEO.svelte"
  import { slugify } from "$lib/slugify"

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  let component = $derived(data.component)
</script>

<SEO
  title={data.frontmatter.title + " - Chris J Mears"}
  description={data.frontmatter.description}
  type="website"
  image={data.frontmatter.header?.teaser}
/>

<Section containerClasses="container mx-auto max-w-3xl p-5 md:pt-10">
  {@const SvelteComponent = component}
  <h1 class="text-4xl">{data.frontmatter.title}</h1>
  <p class="text-gray-700 text-sm mt-3">
    Posted on {new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(data.frontmatter.date))}
  </p>
  {#if data.frontmatter.updated}
    <p class="text-gray-400 text-sm">
      Updated on {new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(data.frontmatter.updated))}
    </p>
  {/if}
  {@const categories = Array.isArray(data.frontmatter.categories)
    ? data.frontmatter.categories
    : data.frontmatter.categories
      ? [data.frontmatter.categories]
      : []}
  {#if categories.length}
    <div class="mt-2 text-sm">
      <span class="opacity-70 mr-2">Categories:</span>
      {#each categories as c, i}
        <a
          class="underline text-blue-600 hover:text-blue-800"
          href="/blog/category/{slugify(c)}">{c}</a
        >{i < categories.length - 1 ? ", " : ""}
      {/each}
    </div>
  {/if}
  {#if Array.isArray(data.frontmatter.tags) && data.frontmatter.tags.length}
    <div class="mb-6 text-sm">
      <span class="opacity-70 mr-2">Tags:</span>
      {#each data.frontmatter.tags as t, i}
        <a
          class="underline text-blue-600 hover:text-blue-800"
          href="/blog/tag/{slugify(t)}">{t}</a
        >{i < data.frontmatter.tags.length - 1 ? ", " : ""}
      {/each}
    </div>
  {/if}
  <div class="post-content">
    <SvelteComponent />
  </div>
</Section>
