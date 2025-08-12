<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import BlogList from "$lib/components/BlogList.svelte"
  import SEO from "$lib/components/SEO.svelte"
  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<SEO
  title="Blog Archive - Chris J Mears"
  description="Articles and posts by Chris J Mears on software engineering, data, and AI."
  type="website"
/>

<Section>
  <h1 class="text-4xl mb-6">Blog Archive</h1>
  <BlogList posts={data.allPosts} />
</Section>
