<script lang="ts">
  import { getDisplayDate } from "$lib/utils"
  interface Props {
    posts: any[]
    showDate?: boolean
    dateLabel?: "published" | "updated"
  }

  let { posts, showDate = true, dateLabel = "published" }: Props = $props()
</script>

<div class="grid grid-cols-1 gap-6">
  {#each posts as post (post.id)}
    {@const isNewsletter = post.path?.includes("data-nerd-newsletter") || post.data?.metadata?.categories === "data-nerd-newsletter"}
    <div class="mb-10 leading-normal">
      <a
        class="underline hover:text-black text-blue-500 block"
        href={isNewsletter ? `/data-nerd-newsletter/${post.id}` : `/blog/${post.id}`}
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
