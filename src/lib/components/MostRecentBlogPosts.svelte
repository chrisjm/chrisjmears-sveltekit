<script lang="ts">
  import Section from "$lib/components/Section.svelte"
  import Header2 from "$lib/components/Heading2.svelte"
  import type { PostSummary } from "$lib/content/types"
  import { slugify } from "$lib/slugify"

  interface Props {
    posts: PostSummary[]
  }

  let { posts }: Props = $props()
</script>

<Section sectionClasses="bg-sky-700 text-white">
  <Header2 title="Most Recent Posts" />
  <ul class="flex flex-col md:flex-row">
    {#each posts as post (post.slug)}
      <li class="md:flex-1 md:mr-5 md:my-2 my-4">
        <a
          href="/blog/{post.slug}"
          rel="prev"
          class="hover:text-sky-200 hover:no-underline"
        >
          <div class="text-lg leading-tight">
            {post.frontmatter.title}
          </div>
        </a>
        <div class="mt-2 flex flex-wrap gap-2">
          {#if post.frontmatter.categories}
            {#each Array.isArray(post.frontmatter.categories) ? post.frontmatter.categories : [post.frontmatter.categories] as cat}
              <a
                href="/blog/category/{slugify(cat)}"
                class="rounded-full border border-sky-300/70 px-2 py-0.5 text-xs text-sky-100 hover:bg-sky-600/30"
                >{cat}</a
              >
            {/each}
          {/if}
          {#if Array.isArray(post.frontmatter.tags) && post.frontmatter.tags.length}
            {#each post.frontmatter.tags as tag}
              <a
                href="/blog/tag/{slugify(tag)}"
                class="rounded-full bg-sky-600 px-2 py-0.5 text-xs text-white hover:bg-sky-500"
                >#{tag}</a
              >
            {/each}
          {/if}
        </div>
        <i class="block mt-1 text-sm text-sky-200">
          {new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(post.frontmatter.date))}
          {#if post.frontmatter.updated}
            <span class="text-xs text-sky-300">
              (Updated: {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(post.frontmatter.updated))})
            </span>
          {/if}
        </i>
      </li>
    {/each}
  </ul>
</Section>
