<script lang="ts">
  interface Props {
    title: string
    initiallyOpen?: boolean
    headerBgClass?: string
    headerTextClass?: string
    children?: import("svelte").Snippet
  }

  let {
    title,
    initiallyOpen = true,
    headerBgClass = "",
    headerTextClass = "",
    children,
  }: Props = $props()

  let isOpen = $state<boolean>(initiallyOpen)

  function toggle() {
    isOpen = !isOpen
  }
</script>

<div class="space-y-2 text-sm">
  <button
    type="button"
    class={`flex w-full items-center justify-between cursor-pointer select-none ${headerBgClass}`}
    onclick={toggle}
    aria-expanded={isOpen}
  >
    <h2 class={`text-lg font-semibold ${headerTextClass}`}>{title}</h2>
    <span
      class={`text-xs text-slate-500 hover:text-slate-300 ${headerTextClass}`}
    >
      {isOpen ? "Hide" : "Show"}
    </span>
  </button>

  {#if isOpen}
    {@render children?.()}
  {/if}
</div>
