<script lang="ts">
  import Hero from "$lib/components/Hero.svelte"
  import Projects from "$lib/components/Projects.svelte"
  import AboutMe from "$lib/components/AboutMe.svelte"

  import type { PageData } from "./$types"
  import MostRecentBlogPosts from "$lib/components/MostRecentBlogPosts.svelte"

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<Hero />
<Projects />
<AboutMe />
<MostRecentBlogPosts posts={data.recentPosts} />
