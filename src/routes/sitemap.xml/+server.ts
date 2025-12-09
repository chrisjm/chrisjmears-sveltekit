import type { RequestHandler } from "@sveltejs/kit";
import { slugFromPath, slugify } from "$lib/slugify";
import { listAllPostsRaw } from "$lib/content/posts";

export const prerender = true;

const encode = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: RequestHandler = async ({ url }) => {
  const origin = url.origin;

  const staticPaths = [
    "/",
    "/about",
    "/blog",
    "/contact",
    "/resume",
    "/archives",
    "/data-nerd-newsletter",
  ];

  const blogModules = import.meta.glob("/src/posts/blog/*.{md,svx,svelte.md}");
  const newsletterModules = import.meta.glob(
    "/src/posts/data-nerd-newsletter/*.{md,svx,svelte.md}",
  );

  const loadEntries = async (
    modules: Record<string, () => Promise<any>>,
    basePath: string,
  ) => {
    const entries: { loc: string; lastmod?: string }[] = [];
    for (const [path, resolver] of Object.entries(modules)) {
      const mod: any = await resolver();
      const slug = slugFromPath(path);
      if (!slug) continue;
      const date = mod?.metadata?.date as string | undefined;
      entries.push({ loc: `${origin}${basePath}/${slug}/`, lastmod: date });
    }
    return entries;
  };

  const [blogEntries, newsletterEntries] = await Promise.all([
    loadEntries(blogModules, "/blog"),
    loadEntries(newsletterModules, "/data-nerd-newsletter"),
  ]);

  // Compute unique tag pages
  const allPosts = await listAllPostsRaw();
  const tagSet = new Set<string>();
  const categorySet = new Set<string>();
  for (const p of allPosts) {
    const fm = p.data?.metadata ?? {};
    const tags: string[] = Array.isArray(fm.tags) ? fm.tags : [];
    const categories: string[] = Array.isArray(fm.categories)
      ? fm.categories
      : fm.categories
        ? [fm.categories]
        : [];
    for (const t of tags) tagSet.add(slugify(t));
    for (const c of categories) categorySet.add(slugify(c));
  }
  const tagEntries = Array.from(tagSet).map((slug) => ({
    loc: `${origin}/blog/tag/${slug}/`,
  }));
  const categoryEntries = Array.from(categorySet).map((slug) => ({
    loc: `${origin}/blog/category/${slug}/`,
  }));

  type UrlItem = {
    loc: string;
    lastmod?: string;
    changefreq?:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority?: number; // 0.0 to 1.0
  };

  const urls: UrlItem[] = [
    // Static pages
    ...staticPaths.map((p) => ({
      loc: `${origin}${p}`,
      changefreq: "weekly" as const,
      priority: 0.7,
    })),
    // Blog posts
    ...blogEntries.map((u) => ({
      ...u,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
    // Newsletter posts
    ...newsletterEntries.map((u) => ({
      ...u,
      changefreq: "monthly" as const,
      priority: 0.6,
    })),
    // Tag pages
    ...tagEntries.map((u) => ({
      ...u,
      changefreq: "weekly" as const,
      priority: 0.5,
    })),
    // Category pages
    ...categoryEntries.map((u) => ({
      ...u,
      changefreq: "weekly" as const,
      priority: 0.5,
    })),
  ].sort((a, b) => a.loc.localeCompare(b.loc));

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const lastmod = u.lastmod ? new Date(u.lastmod).toISOString() : "";
        const changefreq = u.changefreq ?? "";
        const priority =
          typeof u.priority === "number" ? u.priority.toFixed(1) : "";
        return (
          `  <url>\n` +
          `    <loc>${encode(u.loc)}</loc>\n` +
          (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : "") +
          (changefreq ? `    <changefreq>${changefreq}</changefreq>\n` : "") +
          (priority ? `    <priority>${priority}</priority>\n` : "") +
          `  </url>`
        );
      })
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=600",
    },
  });
};
