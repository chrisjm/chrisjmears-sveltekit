<script lang="ts">
  import type { PageData } from "./$types";
  import Section from "$lib/components/Section.svelte";
  import BlogList from "$lib/components/BlogList.svelte";
  import SEO from "$lib/components/SEO.svelte";

  interface Props { data: PageData }
  let { data }: Props = $props();
</script>

<SEO
  title={`Posts tagged ${data.tag.name} - Chris J Mears`}
  description={`All blog posts tagged with ${data.tag.name}.`}
  type="website"
/>

<Section>
  <h1 class="text-4xl mb-6">Tag: {data.tag.name}</h1>
  <p class="mb-6 text-sm">
    <a class="underline text-blue-600 hover:text-blue-800" href="/blog">← All posts</a>
  </p>
  <BlogList posts={data.posts} />
</Section>
