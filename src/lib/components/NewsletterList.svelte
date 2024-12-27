<script lang="ts">
  interface Props {
    posts: any[];
  }

  let { posts }: Props = $props();
</script>

<ul class="post-list mt-12">
  {#each posts as node (node.data.metadata.slug)}
    {@const title = node.data.metadata.title || node.data.metadata.slug}
    <li class="mt-6">
      <a
        class="underline hover:text-black text-sky-500"
        href={node.data.metadata.slug}
      >
        <h3 class="text-lg md:text-xl">{title}</h3>
      </a>
      <div class="mt-1 text-sm text-gray-500">
        {node.data.metadata.date}
      </div>
      <div class="mt-1 text-gray-700">
        {node.data.metadata.description}
      </div>
    </li>
  {/each}
</ul>
