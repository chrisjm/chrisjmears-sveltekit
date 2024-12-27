<script lang="ts">
  interface Props {
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    imageAlt: string;
    links: { url: string; text: string }[];
  }

  let {
    title,
    description,
    tags,
    imageUrl,
    imageAlt,
    links
  }: Props = $props();
</script>

<div
  class="rounded overflow-hidden shadow-lg hover:shadow-md mx-4 my-3"
>
  <img class="w-full h-48 object-cover" src={imageUrl} alt={imageAlt} />
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">{title}</div>
    <p class="text-gray-700 text-base mb-2">{description}</p>
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
