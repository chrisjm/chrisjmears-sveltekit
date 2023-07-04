import type { PageLoad } from "./$types";
import { slugFromPath } from "$lib/slugFromPath";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  const posts = import.meta.glob(`/src/posts/blog/*.{md,svx,svelte.md}`);

  let allPosts = [];

  for (const [path, resolver] of Object.entries(posts)) {
    const post = { path, resolver };
    const resolvedPost = await post?.resolver?.();
    if (resolvedPost) {
      allPosts.push({ id: slugFromPath(path), path, data: resolvedPost });
    }
  }

  return { allPosts };
};
