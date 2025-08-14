import type { PageLoad } from "./$types";
import { slugFromPath } from "$lib/slugFromPath";
import sorter from "sorters";
import type { Frontmatter } from "$lib/content/types";

type PostModule = { metadata: Frontmatter } & Record<string, unknown>;

export const load: PageLoad = async ({ params }) => {
  const posts = import.meta.glob(
    `/src/posts/data-nerd-newsletter/*.{md,svx,svelte.md}`,
  ) as Record<string, () => Promise<PostModule>>;

  let allPosts: Array<{ id: string; path: string; data: PostModule }> = [];

  for (const [path, resolver] of Object.entries(posts)) {
    const post = { path, resolver };
    const resolvedPost = await post?.resolver?.();
    const id = slugFromPath(path);
    if (resolvedPost && id) {
      allPosts.push({ id, path, data: resolvedPost });
    }
  }

  return {
    allPosts: allPosts.sort(
      sorter({
        value: (v) => new Date(v.data.metadata.date),
        descending: true,
      }),
    ),
  };
};
