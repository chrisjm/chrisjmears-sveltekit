<script lang="ts">
  import Hero from "$lib/components/Hero.svelte"
  import Projects from "$lib/components/Projects.svelte"
  import AboutMe from "$lib/components/AboutMe.svelte"
  import NewsletterSignup from "$lib/components/NewsletterSignup.svelte"

  import type { PageData } from "./$types"
  import MostRecentBlogPosts from "$lib/components/MostRecentBlogPosts.svelte"

  export let data: PageData
</script>

<Hero />
<Projects />
<AboutMe />
<MostRecentBlogPosts posts={data.posts} />
<NewsletterSignup />
