<script lang="ts">
  import { CldImage } from "svelte-cloudinary"
  export let posts: any[]
</script>

<div class="blog-list">
  {#each posts as post (post.id)}
    <div class="mb-10 leading-normal">
      <a
        class="underline hover:text-black text-blue-500 block"
        href="/blog/{post.id}"
      >
        <h3 class="text-2xl md:text-3xl">
          {post.data.metadata.title}
        </h3>
      </a>
      <div class="mt-2 block text-sm text-gray-700">
        {post.data.metadata.date}
      </div>
      {#if post.data.metadata.header.teaser}
        <div class="mt-2 shadow-lg">
          <a href="/blog/{post.id}">
            {#if post.data.metadata.header.cloudinaryPublicId}
              <CldImage
                class="w-full h-48 object-cover"
                src={post.data.metadata.header.cloudinaryPublicId}
                width={1152}
                height={192}
              />
            {:else}
              <img
                class="w-full h-48 object-cover"
                src={post.data.metadata.header.teaser}
                alt={`Featured`}
              />
            {/if}
          </a>
        </div>
      {/if}
      <div class="mt-2">
        <p class="text-lg">
          {post.data.metadata.description || post.data.metadata.excerpt}
        </p>
        <p class="text-body mt-1">
          <a href="/blog/{post.id}">Read more.</a>
        </p>
      </div>
    </div>
  {/each}
</div>
