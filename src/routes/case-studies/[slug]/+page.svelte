<script lang="ts">
  import Section from "$lib/components/Section.svelte"
  import SEO from "$lib/components/SEO.svelte"
  import type { PageData } from "./$types"

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<SEO
  title="{data.title} - Case Study - Chris J Mears"
  description={data.description}
  type="article"
/>

<Section>
  <div class="max-w-4xl mx-auto">
    <nav class="mb-8">
      <a href="/services" class="text-sky-600 hover:text-sky-700">
        ← Back to Services
      </a>
    </nav>

    <article>
      <h1 class="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>

      <div class="flex flex-wrap gap-2 mb-8">
        {#each data.tags as tag}
          <span class="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm">
            {tag}
          </span>
        {/each}
      </div>

      <div class="prose prose-lg max-w-none">
        <div class="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 rounded-r">
          <p class="text-lg font-semibold text-amber-900 mb-2">
            📝 Case Study Coming Soon
          </p>
          <p class="text-amber-800">
            I'm currently writing detailed case studies for my projects. Check
            back soon for an in-depth look at {data.title}, including
            challenges, solutions, and outcomes.
          </p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 class="text-2xl font-bold mb-4 mt-0">Project Overview</h2>
          <p class="text-gray-700 leading-relaxed">{data.description}</p>
        </div>

        {#if data.links && data.links.length > 0}
          <div
            class="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-lg p-6"
          >
            <h2 class="text-2xl font-bold mb-4 mt-0">Project Links</h2>
            <div class="flex flex-col gap-3">
              {#each data.links as link}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium hover:translate-x-1 transition-transform"
                >
                  <svg
                    class="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>{link.text}</span>
                </a>
              {/each}
            </div>
          </div>
        {/if}

        <div class="mt-12 p-6 bg-sky-50 rounded-lg">
          <h3 class="text-xl font-semibold mb-3">
            Interested in Similar Work?
          </h3>
          <p class="mb-4">
            I'm available for consulting on projects like this. Let's discuss
            how I can help with your needs.
          </p>
          <a
            href="/contact"
            class="inline-block bg-sky-600 hover:bg-sky-700 text-white! font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </article>
  </div>
</Section>
