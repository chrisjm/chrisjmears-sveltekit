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
  <ul class="flex flex-col md:flex-row gap-6">
    {#each posts as post (post.slug)}
      <li class="md:flex-1 bg-sky-800/50 rounded-lg p-5 flex flex-col">
        <i class="block mb-2 text-sm text-sky-300">
          {new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(post.frontmatter.date))}
        </i>
        <a
          href="/blog/{post.slug}"
          rel="prev"
          class="hover:text-sky-200 hover:no-underline"
        >
          <div class="text-lg font-bold leading-snug mb-2">
            {post.frontmatter.title}
          </div>
        </a>
        {#if post.frontmatter.excerpt || post.frontmatter.description}
          <p class="text-sm text-sky-200 leading-relaxed mb-3 flex-1">
            {post.frontmatter.excerpt || post.frontmatter.description}
          </p>
        {:else}
          <div class="flex-1"></div>
        {/if}
        <div class="flex items-center justify-between mt-auto">
          <div class="flex flex-wrap gap-2">
            {#if post.frontmatter.categories}
              {#each Array.isArray(post.frontmatter.categories) ? post.frontmatter.categories : [post.frontmatter.categories] as cat}
                <a
                  href="/blog/category/{slugify(cat)}"
                  class="rounded-full border border-sky-300/70 px-2 py-0.5 text-xs text-sky-100 hover:bg-sky-600/30"
                  >{cat}</a
                >
              {/each}
            {/if}
          </div>
          <a
            href="/blog/{post.slug}"
            class="text-sm font-semibold text-amber-400 hover:text-amber-300 hover:no-underline whitespace-nowrap ml-3"
          >
            Read more →
          </a>
        </div>
      </li>
    {/each}
  </ul>
  <div class="mt-8 text-center">
    <a href="/blog" class="text-sky-200 hover:text-white text-sm font-medium">View all posts →</a>
  </div>
</Section>
