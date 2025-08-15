import type { PageLoad } from "./$types";
import { listAllPostsRaw } from "$lib/content/posts";
import { slugify, unslugify } from "$lib/slugify";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  const { tag } = params;
  const allPosts = await listAllPostsRaw();

  const filtered = allPosts.filter((p) => {
    const fm = p.data?.metadata ?? {};
    const tags: string[] = Array.isArray(fm.tags) ? fm.tags : [];
    return tags.some((t) => slugify(t) === tag);
  });

  if (!filtered.length) {
    error(404);
  }

  // Determine display name from first matching post's tag
  const first = filtered[0];
  let display = unslugify(tag);
  const fm = first.data?.metadata ?? {};
  const tags: string[] = Array.isArray(fm.tags) ? fm.tags : [];
  const match = tags.find((t) => slugify(t) === tag);
  if (match) display = match;

  return { posts: filtered, tag: { slug: tag, name: display } };
};
