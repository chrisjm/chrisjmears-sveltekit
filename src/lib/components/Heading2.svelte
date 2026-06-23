<script lang="ts">
  interface Props {
    title?: string
  }

  let { title = "Heading 2 Placeholder" }: Props = $props()
</script>

<div class="mb-10 text-center">
  <h2 class="text-4xl font-display font-bold mb-3">{title}</h2>
  <div class="mx-auto h-1 w-16 rounded bg-amber-400"></div>
</div>
