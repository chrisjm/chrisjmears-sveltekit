<script lang="ts">
  interface Props {
    backgroundColor: string
    textColor: string
    mobileMenuTextColor: string
  }

  let { backgroundColor, textColor, mobileMenuTextColor }: Props = $props()

  let isExpanded = $state(false)
</script>

<header class="bg-{backgroundColor} text-{textColor}">
  <div class="container mx-auto p-8 md:px-16">
    <div class="flex flex-row justify-between items-center">
      <div class="flex-1 text-3xl md:text-4xl font-black">
        <a href="/" class="no-underline antialiased">
          <span class="hidden md:inline lg:hidden">CJM</span>
          <span class="inline md:hidden lg:inline">Chris J Mears</span>
        </a>
      </div>
      <div class="md:text-right">
        <div class="flex flex-wrap items-center justify-end">
          <button
            class="block md:hidden border flex items-center px-3 py-2 rounded border-{textColor} text-{textColor}"
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
          class="md:block md:flex md:items-center md:w-auto {isExpanded
            ? `expanded bg-white absolute right-0 mr-5 mt-2 text-${mobileMenuTextColor}`
            : `hidden`}"
        >
          <ul
            class="list-none flex flex-col shadow md:inline-block md:shadow-none md:p-0 font-black"
          >
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                href="/about"
              >
                About
              </a>
            </li>
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                href="/blog"
              >
                Blog
              </a>
            </li>
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                href="/resume"
              >
                Resume
              </a>
            </li>
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
                href="/data-nerd-newsletter"
              >
                <span class="lg:hidden">Newsletter</span>
                <span class="hidden lg:inline">Data Nerd Newsletter</span>
              </a>
            </li>
            <li class="md:inline-block md:mr-2 mb-0">
              <a
                class="no-underline antialiased px-5 py-3 block hover:bg-gray-200 active:bg-gray-300 md:hover:bg-transparent"
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
