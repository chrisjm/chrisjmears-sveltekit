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
    for (const t2 of tags2) {
      const s = slugify(t2);
      const item = tagMap.get(s) ?? { name: t2, slug: s, count: 0 };
      item.count += 1;
      tagMap.set(s, item);
    }
  }

  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const tagsList = Array.from(tagMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return {
    posts: filtered,
    tag: { slug: tag, name: display },
    categories,
    tags: tagsList,
  };
};
