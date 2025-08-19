<script lang="ts">
  import type { PageData } from "./$types";
  import Section from "$lib/components/Section.svelte";
  import BlogList from "$lib/components/BlogList.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import ChipRow from "$lib/components/ChipRow.svelte";

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
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="md:col-span-2">
      <BlogList posts={data.posts} />
    </div>
    <aside class="md:col-span-1 md:sticky top-4 h-fit">
      {#if data.categories?.length}
        <ChipRow
          title="Browse by Category"
          items={data.categories}
          hrefPrefix="/blog/category/"
          defaultExpanded={true}
          hideToggle={true}
        />
      {/if}

      {#if data.tags?.length}
        <div class="mt-6">
          <ChipRow
            title="Browse by Tag"
            items={data.tags}
            hrefPrefix="/blog/tag/"
            defaultExpanded={true}
            hideToggle={true}
          />
        </div>
      {/if}
    </aside>
  </div>
</Section>
