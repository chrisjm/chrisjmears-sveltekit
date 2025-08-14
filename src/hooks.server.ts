import { dev } from "$app/environment";

// Prevent Chrome DevTools from being exposed to the client
export function handle({ event, resolve }) {
  if (
    dev &&
    event.url.pathname === "/.well-known/appspecific/com.chrome.devtools.json"
  ) {
    return new Response(undefined, { status: 404 });
  }

  return resolve(event);
}
