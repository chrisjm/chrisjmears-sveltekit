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

  // Build global categories and tags with counts for sidebar
  const categoryMap = new Map<
    string,
    { name: string; slug: string; count: number }
  >();
  const tagMap = new Map<
    string,
    { name: string; slug: string; count: number }
  >();
  for (const p of allPosts) {
    const fm2 = p.data?.metadata ?? {};
    const cats2: string[] = Array.isArray(fm2.categories)
      ? fm2.categories
      : fm2.categories
        ? [fm2.categories]
        : [];
    const tags2: string[] = Array.isArray(fm2.tags) ? fm2.tags : [];

    for (const c of cats2) {
      const s = slugify(c);
      const item = categoryMap.get(s) ?? { name: c, slug: s, count: 0 };
      item.count += 1;
      categoryMap.set(s, item);
    }
    for (const t of tags2) {
      const s = slugify(t);
      const item = tagMap.get(s) ?? { name: t, slug: s, count: 0 };
      item.count += 1;
      tagMap.set(s, item);
    }
  }

  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const tags = Array.from(tagMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return {
    posts: filtered,
    category: { slug: category, name: display },
    categories,
    tags,
  };
};
