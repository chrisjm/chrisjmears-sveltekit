<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import NewsletterList from "$lib/components/NewsletterList.svelte"
  import SEO from "$lib/components/SEO.svelte"
  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<SEO
  title="Data Nerd Newsletter Archive - Chris J Mears"
  description="Articles and posts by Chris J Mears on software engineering, data, and AI."
  type="website"
/>

<Section>
  <h1 class="text-4xl mb-6">Data Nerd Newsletter Archive</h1>
  <NewsletterList posts={data.allPosts} />
</Section>
