import type { PageLoad } from "./$types";
import { listAllPostsRaw, listPostsByCategory, RESOURCES_CATEGORY_SLUG } from "$lib/content/posts";
import { slugify } from "$lib/slugify";

export const load: PageLoad = async () => {
  const [allPosts, { categoryPosts, resourcePosts }] = await Promise.all([
    listAllPostsRaw(),
    listPostsByCategory(),
  ]);

  const tagMap = new Map<string, { name: string; slug: string; count: number }>();

  for (const p of allPosts) {
    const fm = p.data?.metadata ?? {};
    const tags: string[] = Array.isArray(fm.tags) ? fm.tags : [];
    for (const t of tags) {
      const s = slugify(t);
      const item = tagMap.get(s) ?? { name: t, slug: s, count: 0 };
      item.count += 1;
      tagMap.set(s, item);
    }
  }

  const tags = Array.from(tagMap.values()).sort((a, b) => b.count - a.count);

  // Convert map to sorted array of categories (by name), excluding resources
  const categorySections = Array.from(categoryPosts.values())
    .filter((c) => c.slug !== RESOURCES_CATEGORY_SLUG)
    .sort((a, b) => a.name.localeCompare(b.name));

  return { categorySections, resourcePosts, tags };
};
