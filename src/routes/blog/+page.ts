import type { PageLoad } from "./$types";
import { listAllPostsRaw } from "$lib/content/posts";
import { slugify } from "$lib/slugify";

export const load: PageLoad = async () => {
  const allPosts = await listAllPostsRaw();

  const categoryMap = new Map<
    string,
    { name: string; slug: string; count: number }
  >();
  const tagMap = new Map<
    string,
    { name: string; slug: string; count: number }
  >();

  for (const p of allPosts) {
    const fm = p.data?.metadata ?? {};
    const categories: string[] = Array.isArray(fm.categories)
      ? fm.categories
      : fm.categories
        ? [fm.categories]
        : [];
    const tags: string[] = Array.isArray(fm.tags) ? fm.tags : [];

    for (const c of categories) {
      const s = slugify(c);
      const item = categoryMap.get(s) ?? { name: c, slug: s, count: 0 };
      item.count += 1;
      categoryMap.set(s, item);
    }
    for (const t of tags) {
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

  return { allPosts, categories, tags };
};
