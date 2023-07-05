<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import NewsletterList from "$lib/components/NewsletterList.svelte"
  import NewsletterSignup from "$lib/components/NewsletterSignup.svelte"
  export let data: PageData
</script>

<Section>
  <h1 class="text-4xl mb-6">Data Nerd Newsletter Archive</h1>
  <NewsletterList posts={data.allPosts} />
</Section>
<NewsletterSignup />
