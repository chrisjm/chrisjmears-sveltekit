<script lang="ts">
  import { createEventDispatcher } from "svelte"
  interface Item {
    slug: string
    name: string
    count?: number
  }

  interface Props {
    title: string
    items: Item[]
    hrefPrefix: string
    defaultExpanded?: boolean
    interactive?: boolean
    selected?: string[]
    hideToggle?: boolean
    kind?: "category" | "tag"
  }

  let {
    title,
    items,
    hrefPrefix,
    defaultExpanded = false,
    interactive = false,
    selected = [],
    hideToggle = false,
    kind = "category",
  }: Props = $props()

  let showAll = $state(defaultExpanded)

  const sortedItems = $derived(
    (items ?? []).slice().sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  )

  const dispatch = createEventDispatcher<{
    select: { slug: string; name: string; kind: "category" | "tag" }
  }>()
</script>

<div class="mb-6">
  <h2 class="text-xl font-semibold">{title}</h2>
  <ul
    class={showAll
      ? "flex flex-wrap gap-2 my-2 px-4"
      : "flex flex-nowrap gap-2 my-2 overflow-x-auto px-4 mr-4"}
  >
    {#each sortedItems as i (i.slug)}
      <li class="shrink-0">
        {#if interactive}
          <button
            class={
              `inline-block whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors ${
                selected?.includes(i.slug)
                  ? "bg-gray-900 text-white border-gray-900"
                  : "hover:bg-gray-100"
              }`
            }
            aria-pressed={selected?.includes(i.slug)}
            onclick={() => dispatch("select", { slug: i.slug, name: i.name, kind })}
          >
            {i.name}
            {#if i.count != null}
              <span class="opacity-60">({i.count})</span>
            {/if}
          </button>
        {:else}
          <a
            class="inline-block whitespace-nowrap rounded-full border px-3 py-1 text-sm hover:bg-gray-100"
            href={`${hrefPrefix}${i.slug}`}
            >{i.name}
            {#if i.count != null}
              <span class="opacity-60">({i.count})</span>
            {/if}
          </a>
        {/if}
      </li>
    {/each}
  </ul>
  {#if !hideToggle}
    <div class="mt-2 flex items-center gap-3">
      <div class="h-px bg-gray-300 flex-1" aria-hidden="true"></div>
      <button
        class="text-sm text-gray-400 whitespace-nowrap hover:underline px-2"
        aria-expanded={showAll}
        onclick={() => (showAll = !showAll)}
      >
        {showAll ? "Show less" : "Show all"}
      </button>
      <div class="h-px bg-gray-300 flex-1" aria-hidden="true"></div>
    </div>
  {/if}
</div>
