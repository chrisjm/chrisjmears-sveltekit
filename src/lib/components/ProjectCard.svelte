<script lang="ts">
  import { goto } from "$app/navigation"

  interface Props {
    title: string
    description: string
    tags: string[]
    imageUrl: string
    imageAlt: string
    links: { url: string; text: string }[]
  }

  let { title, description, tags, imageUrl, imageAlt, links }: Props = $props()

  const isExternal = (url: string) => url.includes("http")
</script>

<div
  class="rounded overflow-hidden shadow-xl border-1 border-gray-300 hover:shadow-sm mx-4 my-3 transition-all duration-300"
>
  {#if isExternal(links[0].url)}
    <a href={links[0].url} target="_blank">
      <img class="w-full h-64 object-cover" src={imageUrl} alt={imageAlt} />
    </a>
  {:else}
    <a
      href={links[0].url}
      onclick={(event) => {
        event.preventDefault()
        goto(links[0].url)
      }}
    >
      <img class="w-full h-64 object-cover" src={imageUrl} alt={imageAlt} />
    </a>
  {/if}
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">
      {#if isExternal(links[0].url)}
        <a href={links[0].url} class="text-black" target="_blank">{title}</a>
      {:else}
        <a
          href={links[0].url}
          class="text-black"
          onclick={(event) => {
            event.preventDefault()
            goto(links[0].url)
          }}
        >
          {title}
        </a>
      {/if}
    </div>
    <p class="text-gray-700 text-base mb-2">{@html description}</p>
    {#each links as link (link.url)}
      <p class="font-bold text-base">
        {#if isExternal(link.url)}
          <a href={link.url} target="_blank">{link.text}</a>
        {:else}
          <a
            href={link.url}
            onclick={(event) => {
              event.preventDefault()
              goto(link.url)
            }}
          >
            {link.text}
          </a>
        {/if}
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
