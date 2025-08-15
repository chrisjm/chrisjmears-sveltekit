<script lang="ts">
  import type { PageData } from "./$types"
  import Section from "$lib/components/Section.svelte"
  import SEO from "$lib/components/SEO.svelte"

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  let component = $derived(data.component)
</script>

<SEO
  title={data.frontmatter.title + " - Chris J Mears"}
  description={data.frontmatter.description}
  type="website"
  image={data.frontmatter.header.teaser
    ? data.frontmatter.header.teaser
    : undefined}
/>

<Section containerClasses="container mx-auto max-w-3xl p-5 md:pt-10">
  {@const SvelteComponent = component}
  <h1 class="text-4xl mb-2">{data.frontmatter.title}</h1>
  <p class="text-gray-700 text-sm mb-6">
    Posted on {new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(data.frontmatter.date))}
  </p>
  <div class="post-content">
    <SvelteComponent />
  </div>
</Section>
