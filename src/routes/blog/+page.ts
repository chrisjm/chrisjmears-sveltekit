import type { PageLoad } from "./$types";

// Client-side universal loader intentionally returns nothing.
// Server-only loader in `+page.server.ts` provides the data.
export const load: PageLoad = async () => {
  return {};
};
