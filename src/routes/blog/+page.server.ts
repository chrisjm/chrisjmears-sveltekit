import type { PageLoad } from "./$types";
import { listAllPostsRaw } from "$lib/content/posts.server";

export const load: PageLoad = async () => {
  const allPosts = await listAllPostsRaw();
  return { allPosts };
};
