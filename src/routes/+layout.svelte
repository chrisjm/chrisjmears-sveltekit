<script lang="ts">
  import Header from "$lib/components/Header.svelte"
  import Footer from "$lib/components/Footer.svelte"
  import SEO from "$lib/components/SEO.svelte"
  import "../app.css"
  import { page } from "$app/state"

  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()

  let routeId = $derived(page.route.id)
  let isHome = $derived(routeId === "/")
</script>

<SEO />

<div class="flex flex-col min-h-screen text-gray-900">
  <Header
    backgroundColor={isHome ? "white" : "sky-700"}
    mobileMenuTextColor={isHome ? "black" : "sky-700"}
    textColor={isHome ? "gray-900" : "white"}
  />

  <main class="flex flex-col flex-1 md:justify-center">
    {@render children?.()}
  </main>

  <Footer />
</div>
