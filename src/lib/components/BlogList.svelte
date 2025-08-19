<script lang="ts">
  import { slugify } from "$lib/slugify"
  interface Props {
    posts: any[]
  }

  let { posts }: Props = $props()
</script>

<div class="grid grid-cols-1 gap-6">
  {#each posts as post (post.id)}
    <div class="mb-10 leading-normal">
      <a
        class="underline hover:text-black text-blue-500 block"
        href="/blog/{post.id}"
      >
        <h3 class="text-2xl md:text-3xl">
          {post.data.metadata.title}
        </h3>
      </a>
      <div class="mt-2 block text-sm text-gray-700">
        {new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(new Date(post.data.metadata.date))}

        {#if post.data.metadata.updated}
          <span class="text-xs text-gray-400">
            (Updated: {new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(post.data.metadata.updated))})
          </span>
        {/if}
      </div>
      {#if false}
        <!-- Teaser image intentionally suppressed for text-first design -->
      {/if}
      <div class="mt-2">
        <p class="text-base md:text-lg leading-relaxed">
          {post.data.metadata.description || post.data.metadata.excerpt}
        </p>
        <div class="mt-2 flex flex-wrap gap-2">
          {#if post.data.metadata.categories}
            {#each (Array.isArray(post.data.metadata.categories)
              ? post.data.metadata.categories
              : [post.data.metadata.categories]) as cat}
              <a
                href="/blog/category/{slugify(cat)}"
                class="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-50"
              >{cat}</a>
            {/each}
          {/if}
          {#if Array.isArray(post.data.metadata.tags) && post.data.metadata.tags.length}
            {#each post.data.metadata.tags as tag}
              <a
                href="/blog/tag/{slugify(tag)}"
                class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-200"
              >#{tag}</a>
            {/each}
          {/if}
        </div>
        <p class="text-body mt-1">
          <a href="/blog/{post.id}">Read more.</a>
        </p>
      </div>
    </div>
  {/each}
</div>
