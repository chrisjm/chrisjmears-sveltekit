<script lang="ts">
  import Hero from "$lib/components/Hero.svelte"
  import Projects from "$lib/components/Projects.svelte"
  import AboutMe from "$lib/components/AboutMe.svelte"
  import BlueskyFeed from "$lib/components/BlueskyFeed.svelte"

  import type { PageData } from "./$types"
  import MostRecentBlogPosts from "$lib/components/MostRecentBlogPosts.svelte"
  import SEO from "$lib/components/SEO.svelte"

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<SEO />

<Hero />
<Projects />
<AboutMe />
<BlueskyFeed />
<MostRecentBlogPosts posts={data.recentPosts} />
