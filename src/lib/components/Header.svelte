<script lang="ts">
  interface Props {
    backgroundColor: string
    textColor: string
    mobileMenuTextColor: string
  }

  import { afterNavigate } from "$app/navigation"

  let { backgroundColor, textColor, mobileMenuTextColor }: Props = $props()

  let isExpanded = $state(false)

  let isLightHeader = $derived(
    backgroundColor === "white" && textColor === "gray-900"
  )

  afterNavigate(() => {
    isExpanded = false
  })
</script>

<header
  class="sticky top-0 z-50"
  class:bg-white={isLightHeader}
  class:text-gray-900={isLightHeader}
  class:bg-sky-700={!isLightHeader}
  class:text-white={!isLightHeader}
>
  <div class="container mx-auto p-8 md:px-16">
    <div class="flex flex-row justify-between items-center">
      <div class="flex-1 text-3xl md:text-4xl font-black">
        <a href="/" class="no-underline antialiased">
          <span class="hidden md:inline lg:hidden">CJM</span>
          <span class="inline md:hidden lg:inline">Chris J Mears</span>
        </a>
      </div>
      <div class="md:text-right relative">
        <div class="flex flex-wrap items-center justify-end">
          <button
            class="block md:hidden border flex items-center px-3 py-2 rounded"
            class:border-gray-900={isLightHeader}
            class:text-gray-900={isLightHeader}
            class:border-white={!isLightHeader}
            class:text-white={!isLightHeader}
            aria-expanded={isExpanded}
            aria-controls="primary-menu"
            onclick={() => (isExpanded = !isExpanded)}
          >
            <svg
              class="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div
          id="primary-menu"
          class="md:block md:flex md:items-center md:w-auto"
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
                href="/resume"
              >
                Resume
              </a>
            </li>
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                onclick={() => (isExpanded = false)}
                href="/archives"
              >
                Archives
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
