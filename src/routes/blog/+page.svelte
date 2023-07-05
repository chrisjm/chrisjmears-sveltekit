<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import BlogList from "$lib/components/BlogList.svelte"
  import NewsletterSignup from "$lib/components/NewsletterSignup.svelte"
  export let data: PageData
</script>

<Section>
  <h1 class="text-4xl mb-6">Blog Archive</h1>
  <BlogList posts={data.allPosts} />
</Section>
<NewsletterSignup />
