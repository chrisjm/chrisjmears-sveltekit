<script lang="ts">
  interface Post {
    id: string
    data: any
  }

  interface Props {
    title: string
    posts: Post[]
    limit?: number
  }

  let { title, posts, limit = 3 }: Props = $props()

  const preview = $derived(posts.slice(0, limit))
  const total = $derived(posts.length)
</script>

<section class="mb-12">
  <h2 class="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">{title}</h2>

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
      </li>
    {/each}
  </ul>

</section>
