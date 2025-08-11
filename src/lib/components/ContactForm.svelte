<script lang="ts">
  let fullName: string = $state('');
  let botField: string = $state('');
  let email: string = $state('');
  let message: string = $state('');
</script>

<div class="contact-form w-full mx-auto my-6 max-w-lg p-3">
  <h1 class="text-2xl mb-3">Contact Me</h1>
  <form
    name="contact"
    method="post"
    action="/contact"
    data-netlify="true"
    data-netlify-honeypot="bot-field"
  >
    <!-- The `form-name` hidden field is required to support form submissions without JavaScript -->
    <input type="hidden" name="form-name" value="contact" />
    <p hidden>
      <label>
        Don’t fill this out:
        <input name="bot-field" bind:value={botField} />
      </label>
    </p>
    <p class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        Your name:
        <br />
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="name"
          bind:value={fullName}
        />
      </label>
    </p>
    <p class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        Your email:
        <br />
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          name="email"
          bind:value={email}
        />
      </label>
    </p>
    <p class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        Message:
        <br />
        <textarea
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="message"
          bind:value={message}
></textarea>
      </label>
    </p>
    <p>
      <button
        class="bg-green-700 border-2 border-white hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-md hover:shadow-none inline-block no-underline text-xl"
        type="submit"
      >
        Send
      </button>
    </p>
  </form>
</div>
