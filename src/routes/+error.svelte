<script lang="ts">
  import { page } from '$app/stores';
  import abductionIllustration from "$lib/images/abduction-illustration.svg"
</script>

{#if $page.status === 404}
  <div>
    <img
      src={abductionIllustration}
      class="block mx-auto w-1/2"
      alt="Ghost getting abducted by aliens"
    />
    <h2 class="bg-yellow-400 text-2xl font-bold inline-block my-8 p-3">
      Looks like this page is a ghost that got abducted by aliens...
    </h2>
  </div>
{:else}
  <h1>{$page.status} {$page.error?.message}</h1>
{/if}
