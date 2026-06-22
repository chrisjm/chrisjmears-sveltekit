<script lang="ts">
  import { RefreshCw } from "@lucide/svelte"
  import { slugify } from "$lib/slugify"

  interface Props {
    post: { id: string; data: any }
  }

  let { post }: Props = $props()

  const fm = $derived(post.data?.metadata ?? {})

  const updatedDate = $derived(
    fm.updated
      ? new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(new Date(fm.updated))
      : fm.date
        ? new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(fm.date))
        : null,
  )
</script>

<li class="group">
  <a href="/blog/{post.id}" class="block">
    <h3 class="text-lg font-semibold text-sky-700 group-hover:text-sky-900 group-hover:underline leading-snug">
      {fm.title}
    </h3>
  </a>
  {#if fm.description || fm.excerpt}
    <p class="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-2">
      {fm.description || fm.excerpt}
    </p>
  {/if}
  {#if updatedDate}
    <p class="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
      <RefreshCw class="w-3 h-3" /> Last updated: {updatedDate}
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
