<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import BlogList from "$lib/components/BlogList.svelte"
  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<Section>
  <h1 class="text-4xl mb-6">Blog Archive</h1>
  <BlogList posts={data.allPosts} />
</Section>
