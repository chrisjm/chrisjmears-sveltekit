<script lang="ts">
  import Header from "$lib/components/Header.svelte"
  import Footer from "$lib/components/Footer.svelte"
  import "../app.css"
</script>

<div class="flex flex-col min-h-screen text-gray-900">
  <Header
    backgroundColor="sky-700"
    mobileMenuTextColor="sky-700"
    textColor="white"
  />

  <main class="flex flex-col flex-1 md:justify-center">
    <slot />
  </main>

  <Footer />
</div>
