import type { PageLoad } from "./$types";
import { sorter } from "sorters";
import { slugFromPath } from "$lib/slugFromPath";
import type { PostSummary } from "$lib/content/types";

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

  const recentPosts: PostSummary[] = allPosts
    .sort(
      sorter({
        value: (v) => new Date(v.resolvedPost.metadata.date),
        descending: true,
      }),
    )
    .slice(0, 3)
    .map((p) => {
      const slug = slugFromPath(p.path);
      if (!slug) return null;
      return {
        frontmatter: p.resolvedPost.metadata,
        slug,
      } as PostSummary;
    })
    .filter((p): p is PostSummary => p !== null);

  return { recentPosts };
};
