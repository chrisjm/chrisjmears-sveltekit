import type { PageLoad } from "./$types";
import { sorter } from "sorters";
import { slugFromPath } from "$lib/slugFromPath";

export const load: PageLoad = async ({ params }) => {
  const posts = import.meta.glob(`/src/posts/blog/*.{md,svx,svelte.md}`);

  let allPosts = [];

  for (const [path, resolver] of Object.entries(posts)) {
    const post = { path, resolver };
    const resolvedPost = await post?.resolver?.();
    if (resolvedPost) {
      allPosts.push({ path, resolvedPost });
    }
  }

  const recentPosts = allPosts
    .sort(
      sorter({
        value: (v) => new Date(v.resolvedPost.metadata.date),
        descending: true,
      })
    )
    .slice(0, 3)
    .map((p) => {
      console.log({ header: p.resolvedPost.metadata.header });
      return {
        component: p.resolvedPost.default,
        frontmatter: p.resolvedPost.metadata,
        slug: slugFromPath(p.path),
      };
    });

  return { posts: recentPosts };
};
