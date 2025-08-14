<script lang="ts">
  import Section from "$lib/components/Section.svelte"
  import Header2 from "$lib/components/Heading2.svelte"

  interface Props {
    // TODO: Replace `any`
    posts: any[]
  }

  let { posts }: Props = $props()
</script>

<Section sectionClasses="bg-sky-800 text-white">
  <Header2 title="Most Recent Posts" />
  <ul class="flex flex-col md:flex-row">
    {#each posts as post (post.slug)}
      <li class="md:flex-1 md:mr-5">
        <a
          href="/blog/{post.slug}"
          rel="prev"
          class="hover:text-sky-200 hover:no-underline"
        >
          {#if post.frontmatter.header}
            <div class="mb-2">
              <img src={post.frontmatter.header.teaser} alt="Featured" />
            </div>
          {/if}
          <div class="text-lg leading-tight">
            {post.frontmatter.title}
          </div>
        </a>
        <i class="block mt-1 text-sm text-blue-200"
          >{new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(post.frontmatter.date))}</i
        >
      </li>
    {/each}
  </ul>
</Section>
