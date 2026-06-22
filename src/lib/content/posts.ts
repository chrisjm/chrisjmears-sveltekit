import { slugFromPath, slugify } from "$lib/slugify";
import { sorter } from "sorters";
import type { PostSummary } from "$lib/content/types";

export const RESOURCES_CATEGORY_SLUG = "resources";

export async function loadAllPostModules() {
  const posts = import.meta.glob(`/src/posts/blog/*.{md,svx,svelte.md}`);
  const modules: Array<{ path: string; module: any }> = [];
  for (const [path, resolver] of Object.entries(posts)) {
    const resolved = await (resolver as () => Promise<any>)?.();
    if (resolved) modules.push({ path, module: resolved });
  }
  return modules;
}

export async function listRecentPosts(n: number): Promise<PostSummary[]> {
  const modules = await loadAllPostModules();
  const recent = modules
    .sort(
      sorter({
        value: (v) => new Date(v.module.metadata?.date ?? 0),
        descending: true,
      }),
    )
    .slice(0, n)
    .map((p) => {
      const slug = slugFromPath(p.path);
      if (!slug) return null;
      return {
        slug,
        frontmatter: p.module.metadata,
      } satisfies PostSummary;
    })
    .filter((p): p is PostSummary => p !== null);

  return recent;
}

export async function listAllPostsRaw() {
  const modules = await loadAllPostModules();
  return modules
    .sort(
      sorter({
        value: (v) => new Date(v.module.metadata?.date ?? 0),
        descending: true,
      }),
    )
    .map((p) => {
      const id = slugFromPath(p.path);
      if (!id) return null;
      return { id, path: p.path, data: p.module };
    })
    .filter((p): p is { id: string; path: string; data: any } => p !== null);
}

export type RawPost = { id: string; path: string; data: any };

export async function listPostsByCategory(): Promise<{
  categoryPosts: Map<string, { name: string; slug: string; posts: RawPost[] }>;
  resourcePosts: RawPost[];
}> {
  const allPosts = await listAllPostsRaw();

  const categoryPosts = new Map<
    string,
    { name: string; slug: string; posts: RawPost[] }
  >();
  const resourcePosts: RawPost[] = [];

  for (const post of allPosts) {
    const fm = post.data?.metadata ?? {};
    const cats: string[] = Array.isArray(fm.categories)
      ? fm.categories
      : fm.categories
        ? [fm.categories]
        : [];

    for (const cat of cats) {
      const slug = slugify(cat);
      if (slug === RESOURCES_CATEGORY_SLUG) {
        resourcePosts.push(post);
      } else {
        const entry = categoryPosts.get(slug) ?? { name: cat, slug, posts: [] };
        entry.posts.push(post);
        categoryPosts.set(slug, entry);
      }
    }
  }

  resourcePosts.sort(
    (a, b) =>
      new Date(b.data?.metadata?.updated ?? b.data?.metadata?.date ?? 0).getTime() -
      new Date(a.data?.metadata?.updated ?? a.data?.metadata?.date ?? 0).getTime(),
  );

  return { categoryPosts, resourcePosts };
}
