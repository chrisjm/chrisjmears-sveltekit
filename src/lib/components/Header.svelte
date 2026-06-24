<script lang="ts">
  import { Menu, X } from "@lucide/svelte"
  import { afterNavigate } from "$app/navigation"
  import { onMount } from "svelte"

  interface Props {
    backgroundColor: string
    textColor: string
    mobileMenuTextColor: string
  }

  let { backgroundColor, textColor, mobileMenuTextColor }: Props = $props()

  let isExpanded = $state(false)
  let isScrolled = $state(false)

  let isLightHeader = $derived(
    backgroundColor === "white" && textColor === "gray-900"
  )

  afterNavigate(() => {
    isExpanded = false
  })

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 10
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  })
</script>

<header
  class="sticky top-0 z-50 transition-shadow duration-300"
  class:bg-white={isLightHeader}
  class:text-gray-900={isLightHeader}
  class:bg-sky-700={!isLightHeader}
  class:text-white={!isLightHeader}
  class:shadow-md={isScrolled}
>
  <div class="container mx-auto p-8 md:px-16">
    <div class="flex flex-row justify-between items-center">
      <div class="flex-1 text-3xl md:text-4xl font-black font-display">
        <a href="/" class="no-underline antialiased">
          <span class="hidden md:inline lg:hidden">CJM</span>
          <span class="inline md:hidden lg:inline">Chris J Mears</span>
        </a>
      </div>
      <div class="md:text-right relative">
        <div class="flex flex-wrap items-center justify-end">
          <button
            class="md:hidden border flex items-center px-3 py-2 rounded"
            class:border-gray-900={isLightHeader}
            class:text-gray-900={isLightHeader}
            class:border-white={!isLightHeader}
            class:text-white={!isLightHeader}
            aria-expanded={isExpanded}
            aria-controls="primary-menu"
            onclick={() => (isExpanded = !isExpanded)}
          >
            {#if isExpanded}
              <X class="h-4 w-4" />
            {:else}
              <Menu class="h-4 w-4" />
            {/if}
          </button>
        </div>
        <div
          id="primary-menu"
          class="md:flex md:items-center md:w-auto"
          class:hidden={!isExpanded}
          class:expanded={isExpanded}
          class:bg-white={isExpanded}
          class:absolute={isExpanded}
          class:right-0={isExpanded}
          class:mr-5={isExpanded}
          class:mt-2={isExpanded}
          class:text-black={isExpanded && mobileMenuTextColor === "black"}
          class:text-sky-700={isExpanded && mobileMenuTextColor === "sky-700"}
        >
          <ul
            class="list-none flex flex-col shadow md:inline-block md:shadow-none md:p-0 font-black"
          >
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                onclick={() => (isExpanded = false)}
                href="/about"
              >
                About
              </a>
            </li>
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                onclick={() => (isExpanded = false)}
                href="/blog"
              >
                Blog
              </a>
            </li>
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                onclick={() => (isExpanded = false)}
                href="/services"
              >
                Services
              </a>
            </li>
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                onclick={() => (isExpanded = false)}
                href="/resume"
              >
                Resume
              </a>
            </li>
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                onclick={() => (isExpanded = false)}
                href="/contact"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</header>
