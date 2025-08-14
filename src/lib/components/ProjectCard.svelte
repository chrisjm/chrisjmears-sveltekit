<script lang="ts">
  interface Props {
    title: string
    description: string
    tags: string[]
    imageUrl: string
    imageAlt: string
    links: { url: string; text: string }[]
  }

  let { title, description, tags, imageUrl, imageAlt, links }: Props = $props()
</script>

<div
  class="rounded overflow-hidden shadow-xl border-1 border-gray-300 hover:shadow-sm mx-4 my-3 transition-all duration-300"
>
  <a href={links[0].url} target="_blank"
    ><img class="w-full h-64 object-cover" src={imageUrl} alt={imageAlt} /></a
  >
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">
      <a href={links[0].url} class="text-black" target="_blank">{title}</a>
    </div>
    <p class="text-gray-700 text-base mb-2">{@html description}</p>
    {#each links as link (link.url)}
      <p class="font-bold text-base">
        <a href={link.url} target="_blank">{link.text}</a>
      </p>
    {/each}
  </div>
  <div class="px-6 py-4">
    {#each tags as tag (tag)}
      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >
        #{tag}
      </span>
    {/each}
  </div>
</div>
