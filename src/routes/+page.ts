import type { PageLoad } from "./$types";
import type { PostSummary } from "$lib/content/types";
import { listRecentPosts } from "$lib/content/posts";

export const load: PageLoad = async () => {
  const recentPosts: PostSummary[] = await listRecentPosts(3);
  return { recentPosts };
};
