<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"

  export let data: PageData

  $: component = data.component
</script>

<Section containerClasses="container mx-auto max-w-3xl p-5 md:pt-10">
  <div class="post-content">
    <svelte:component this={component} />
  </div>
</Section>
