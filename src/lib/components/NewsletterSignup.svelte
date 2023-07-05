<script lang="ts">
  import Section from "$lib/components/Section.svelte"

  let firstName: string
  let email: string
  let honeypot: string
</script>

<Section sectionClasses="bg-sky-900 text-white">
  <div class="content" id="newsletter">
    <div class="mb-6 text-center">
      <h2 class="text-4xl font-bold">Sign up for my newsletter.</h2>
    </div>
    <div class="md:max-w-2xl md:mx-auto">
      <form
        class="mb-0"
        action="https://chrisjmears.us17.list-manage.com/subscribe/post?u=94e0dca41551038d6ef6f68bd&amp;id=1c278b28af"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
      >
        <p class="mb-4">
          I sometimes send out a newsletter. It used to be called "Data Nerd
          Newsletter," but it's more or less my thoughts on data topics.
        </p>
        <div class="flex justify-between flex-col md:flex-row">
          <div class="flex-1 md:mr-5">
            <input
              class="shadow appearance-none border-2 border-white rounded w-full py-2 px-3 text-gray-700 mb-3 md:mb-0 leading-tight focus:outline-none focus:shadow-outline"
              id="mce-FNAME"
              type="text"
              name="FNAME"
              placeholder="First Name"
              bind:value={firstName}
            />
          </div>
          <div class="flex-1 md:mr-5">
            <input
              class="shadow appearance-none border-2 border-white rounded w-full py-2 px-3 text-gray-700 mb-3 md:mb-0 leading-tight focus:outline-none focus:shadow-outline"
              id="mce-EMAIL"
              type="email"
              name="EMAIL"
              placeholder="you@email.com"
              bind:value={email}
            />
          </div>
          <div class="flex-0">
            <button
              class="shadow bg-green-700 hover:bg-green-500 text-white font-bold leading-tight py-2 px-4 rounded border-2 border-white focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Subscribe
            </button>
          </div>
        </div>
        <div class="absolute left-[5000px]" aria-hidden="true">
          <input
            type="text"
            name="b_94e0dca41551038d6ef6f68bd_1c278b28af"
            tabIndex="-1"
            bind:value={honeypot}
          />
        </div>
      </form>
    </div>
  </div>
</Section>
