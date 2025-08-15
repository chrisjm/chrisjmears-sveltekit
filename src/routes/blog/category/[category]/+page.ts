import type { PageLoad } from "./$types";
import { listAllPostsRaw } from "$lib/content/posts";
import { slugify, unslugify } from "$lib/slugify";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  const { category } = params;
  const allPosts = await listAllPostsRaw();

  const filtered = allPosts.filter((p) => {
    const fm = p.data?.metadata ?? {};
    const cats: string[] = Array.isArray(fm.categories)
      ? fm.categories
      : fm.categories
        ? [fm.categories]
        : [];
    return cats.some((c) => slugify(c) === category);
  });

  if (!filtered.length) {
    error(404);
  }

  // Determine display name from first matching post's original category string
  const first = filtered[0];
  let display = unslugify(category);
  const fm = first.data?.metadata ?? {};
  const cats: string[] = Array.isArray(fm.categories)
    ? fm.categories
    : fm.categories
      ? [fm.categories]
      : [];
  const match = cats.find((c) => slugify(c) === category);
  if (match) display = match;

  return { posts: filtered, category: { slug: category, name: display } };
};
