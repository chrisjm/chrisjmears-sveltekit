<script lang="ts">
  interface Props {
    title?: string;
  }

  let { title = "Heading 2 Placeholder" }: Props = $props();
</script>

<div class="mb-10 text-center">
  <h2 class="text-4xl font-bold mb-2">{title}</h2>
  <hr class="h-1 bg-sky-800" />
</div>
