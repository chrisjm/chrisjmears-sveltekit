<script lang="ts">
  import { page } from "$app/stores"
  import abductionIllustration from "$lib/images/abduction-illustration.svg"

  const { status } = $page
  const title = `${status}: ${$page.error?.message}`
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#if status === 404}
  <div class="mx-auto max-w-xl">
    <img
      src={abductionIllustration}
      class="block mx-auto w-1/2"
      alt="Ghost getting abducted by aliens"
    />
    <h2 class="bg-yellow-400 text-2xl font-bold text-center my-8 p-3">
      Looks like this page is a ghost that got abducted by aliens...
    </h2>
  </div>
{:else}
  <h1>{status} {$page.error?.message}</h1>
{/if}
