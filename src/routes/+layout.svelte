<script lang="ts">
  import Header from "$lib/components/Header.svelte"
  import Footer from "$lib/components/Footer.svelte"
  import "../app.css"
  import { page } from "$app/stores"

  // TODO: Font stuff here?

  $: routeId = $page.route.id
  $: isHome = routeId === "/"
</script>

<div class="flex flex-col min-h-screen text-gray-900">
  <Header
    backgroundColor={isHome ? "white" : "sky-700"}
    mobileMenuTextColor={isHome ? "black" : "sky-700"}
    textColor={isHome ? "sky-700" : "white"}
  />

  <main class="flex flex-col flex-1 md:justify-center">
    <slot />
  </main>

  <Footer />
</div>
