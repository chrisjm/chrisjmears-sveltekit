<script lang="ts">
  interface Props {
    title?: string
  }

  let { title = "Heading 2 Placeholder" }: Props = $props()
</script>

<div class="mb-10 text-center">
  <h2 class="text-4xl font-bold mb-2">{title}</h2>
  <hr class="bg-sky-900 h-1" />
</div>
