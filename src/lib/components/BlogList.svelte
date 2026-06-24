<script lang="ts">
  import { slugify } from "$lib/slugify"
  interface Props {
    posts: any[]
    showDate?: boolean
    dateLabel?: "published" | "updated"
  }

  let { posts, showDate = true, dateLabel = "published" }: Props = $props()

  function getDisplayDate(metadata: any): string | null {
    if (!showDate) return null
    const raw =
      dateLabel === "updated"
        ? (metadata?.updated ?? metadata?.date)
        : metadata?.date
    if (!raw) return null
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(raw))
  }
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
      {#if false}
        <!-- Teaser image intentionally suppressed for text-first design -->
      {/if}
    </div>
  {/each}
</div>
