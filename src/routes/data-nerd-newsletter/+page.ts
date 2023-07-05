import type { PageLoad } from "./$types";
import { slugFromPath } from "$lib/slugFromPath";
import sorter from "sorters";

export const load: PageLoad = async ({ params }) => {
  const posts = import.meta.glob(
    `/src/posts/data-nerd-newsletter/*.{md,svx,svelte.md}`
  );

  let allPosts = [];

  for (const [path, resolver] of Object.entries(posts)) {
    const post = { path, resolver };
    const resolvedPost = await post?.resolver?.();
    if (resolvedPost) {
      allPosts.push({ id: slugFromPath(path), path, data: resolvedPost });
    }
  }

  return {
    allPosts: allPosts.sort(
      sorter({ value: (v) => v.data.metadata.date, descending: true })
    ),
  };
};
