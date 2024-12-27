<script lang="ts">
  interface Props {
    sectionClasses?: string;
    containerClasses?: string;
    children?: import('svelte').Snippet;
  }

  let { sectionClasses = "bg-white text-black", containerClasses = "container mx-auto p-8 md:p-16", children }: Props = $props();
</script>

<section class={sectionClasses}>
  <div class={containerClasses}>{@render children?.()}</div>
</section>
