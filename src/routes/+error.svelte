<script lang="ts">
  import { page } from "$app/state"
  import abductionIllustration from "$lib/images/abduction-illustration.svg"
  import SEO from "$lib/components/SEO.svelte"
</script>

<SEO
  title="Error - Chris J Mears"
  description="Something went wrong."
  type="website"
/>

{#if page.status === 404}
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
  <h1>{page.status} {page.error?.message}</h1>
{/if}
