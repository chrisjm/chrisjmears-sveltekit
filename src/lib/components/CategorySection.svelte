<script lang="ts">
  import { ArrowRight } from "@lucide/svelte"
  import { slugify } from "$lib/slugify"

  interface Post {
    id: string
    data: any
  }

  interface Props {
    title: string
    posts: Post[]
    seeAllHref: string
    limit?: number
  }

  let { title, posts, seeAllHref, limit = 3 }: Props = $props()

  const preview = $derived(posts.slice(0, limit))
  const total = $derived(posts.length)
</script>

<section class="mb-12">
  <div class="flex items-baseline justify-between mb-4 border-b border-gray-200 pb-2">
    <h2 class="text-2xl font-bold">{title}</h2>
    {#if total > limit}
      <a
        href={seeAllHref}
        class="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1"
      >
        See all {total} posts <ArrowRight class="w-3 h-3" />
      </a>
    {/if}
  </div>

  <ul class="space-y-6">
    {#each preview as post (post.id)}
      {@const fm = post.data?.metadata ?? {}}
      <li>
        <a
          href="/blog/{post.id}"
          class="group block"
        >
          <h3 class="text-lg font-semibold text-sky-700 group-hover:text-sky-900 group-hover:underline leading-snug">
            {fm.title}
          </h3>
        </a>
        {#if fm.date}
          <p class="mt-0.5 text-xs text-gray-400">
            {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(fm.date))}
            {#if fm.updated}
              · updated {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(fm.updated))}
            {/if}
          </p>
        {/if}
        {#if fm.description || fm.excerpt}
          <p class="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-2">
            {fm.description || fm.excerpt}
          </p>
        {/if}
        {#if Array.isArray(fm.tags) && fm.tags.length}
          <div class="mt-2 flex flex-wrap gap-1.5">
            {#each fm.tags as tag}
              <a
                href="/blog/tag/{slugify(tag)}"
                class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
                onclick={(e) => e.stopPropagation()}
              >#{tag}</a>
            {/each}
          </div>
        {/if}
      </li>
    {/each}
  </ul>

  {#if total > limit}
    <div class="mt-4">
      <a
        href={seeAllHref}
        class="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1"
      >
        See all {total} posts in {title} <ArrowRight class="w-3 h-3" />
      </a>
    </div>
  {/if}
</section>
