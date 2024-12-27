<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let component = $derived(data.component)
</script>

<Section containerClasses="container mx-auto max-w-3xl p-5 md:pt-10">
  {@const SvelteComponent = component}
  <div class="post-content">
    <SvelteComponent />
  </div>
</Section>
