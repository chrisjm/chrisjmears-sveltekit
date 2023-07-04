<script lang="ts">
  import type { PageData } from "./$types"
  import { AdvancedImage } from "@cloudinary/svelte"
  export let data: PageData
  export let title: string
</script>

<div class="blog-list">
  {#each data.allPosts as post (post.id)}
    <div class="mb-10 leading-normal">
      <a
        class="underline hover:text-black text-blue-500 block"
        href="/blog/{post.id}"
      >
        <h3 class="text-2xl md:text-3xl">
          {title ?? post.data.metadata.title}
        </h3>
      </a>
      <div class="mt-2 block text-sm text-gray-700">
        {post.data.metadata.date}
      </div>
      {#if post.data.metadata.header.teaser}
        <div class="mt-2 shadow-lg">
          <a href="/blog/{post.id}">
            {#if post.data.metadata.header.cloudinaryPublicId}
              <AdvancedImage
                class="w-full h-48 object-cover"
                public_id={post.data.metadata.header.cloudinaryPublicId}
                cloud_name="wanderingleafstudios"
                secure="true"
                transformation={{
                  width: 1152,
                  height: 192,
                  gravity: "auto",
                  crop: "fill",
                }}
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
