<script lang="ts">
  import Hero from "$lib/components/Hero.svelte"
  import Projects from "$lib/components/Projects.svelte"
  import AboutMe from "$lib/components/AboutMe.svelte"

  import type { PageData } from "./$types"
  import MostRecentBlogPosts from "$lib/components/MostRecentBlogPosts.svelte"
  import SEO from "$lib/components/SEO.svelte"

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<SEO
  title="Chris J Mears"
  description="Senior Software Engineer focused on JavaScript/TypeScript, data, and AI. Projects, writing, and ways to get in touch."
  type="website"
/>

<Hero />
<Projects />
<AboutMe />
<MostRecentBlogPosts posts={data.recentPosts} />
