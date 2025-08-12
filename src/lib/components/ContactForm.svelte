<script lang="ts">
  let fullName: string = $state("")
  let botField: string = $state("")
  let email: string = $state("")
  let message: string = $state("")
  const website: string = "chrisjmears.com"

  let { url }: { url: string } = $props()

  let submitting: boolean = $state(false)
  let successMessage: string = $state("")
  let errorMessage: string = $state("")

  const handleSubmit = async (event: Event) => {
    event.preventDefault()
    if (submitting) return
    errorMessage = ""
    successMessage = ""
    submitting = true
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          website,
          message,
          "bot-field": botField,
        }),
      })

      let payload: any = null
      try {
        payload = await res.json()
      } catch {
        // ignore parse error if no/invalid JSON
      }

      if (!res.ok) {
        const errMsg =
          (payload &&
            (payload.message || payload.error || payload.errorMessage)) ||
          `Request failed with status ${res.status}`
        throw new Error(errMsg)
      }

      let messageText = "Form submitted successfully!"
      if (payload) {
        if (typeof payload.statusCode === "number" && payload.body) {
          try {
            const inner =
              typeof payload.body === "string"
                ? JSON.parse(payload.body)
                : payload.body
            messageText = inner?.message || messageText
          } catch {
            // keep default
          }
        } else if (payload.message) {
          messageText = payload.message
        }
      }

      successMessage = messageText
      // reset fields
      fullName = ""
      email = ""
      message = ""
      botField = ""
    } catch (err: any) {
      errorMessage = err?.message || "Something went wrong. Please try again."
    } finally {
      submitting = false
    }
  }
</script>

<div class="contact-form w-full mx-auto my-6 max-w-lg p-3">
  <h1 class="text-2xl mb-3">Contact Me</h1>
  <form
    name="contact"
    method="post"
    action={url}
    data-netlify="true"
    data-netlify-honeypot="bot-field"
    onsubmit={handleSubmit}
  >
    <input type="hidden" name="form-name" value="contact" />
    <input type="hidden" name="website" value={website} />
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
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? "Sending..." : "Send"}
      </button>
    </p>
    {#if successMessage}
      <p
        class="mt-4 text-green-700 bg-green-50 border border-green-200 rounded p-3"
        role="status"
      >
        {successMessage}
      </p>
    {/if}
    {#if errorMessage}
      <p
        class="mt-4 text-red-700 bg-red-50 border border-red-200 rounded p-3"
        role="alert"
      >
        {errorMessage}
      </p>
    {/if}
  </form>
</div>
