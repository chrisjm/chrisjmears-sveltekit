<script lang="ts">
  import Section from "$lib/components/Section.svelte"
  import Header2 from "$lib/components/Heading2.svelte"

  export let posts: any[]

  $: console.log(posts);
</script>

<Section sectionClasses="bg-blue-800 text-white">
  <Header2 title="Most Recent Posts" />
  <ul class="flex flex-col md:flex-row">
    {#each posts as post (post.id)}
      <li class="md:flex-1 md:mr-5">
        <a
          href={post.slug}
          rel="prev"
          class="hover:text-blue-200 hover:no-underline"
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
        <i class="block mt-2">{post.frontmatter.date}</i>
      </li>
    {/each}
  </ul>
</Section>
