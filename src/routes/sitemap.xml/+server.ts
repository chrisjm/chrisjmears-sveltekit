import type { RequestHandler } from "@sveltejs/kit";
import { slugFromPath } from "$lib/slugFromPath";

export const prerender = true;

const encode = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: RequestHandler = async ({ url }) => {
  const origin = url.origin;

  const staticPaths = [
    "/",
    "/about",
    "/blog",
    "/contact",
    "/resume",
    "/data-nerd-newsletter",
  ];

  const blogModules = import.meta.glob("/src/posts/blog/*.{md,svx,svelte.md}");
  const newsletterModules = import.meta.glob(
    "/src/posts/data-nerd-newsletter/*.{md,svx,svelte.md}"
  );

  const loadEntries = async (
    modules: Record<string, () => Promise<any>>,
    basePath: string
  ) => {
    const entries: { loc: string; lastmod?: string }[] = [];
    for (const [path, resolver] of Object.entries(modules)) {
      const mod: any = await resolver();
      const slug = slugFromPath(path);
      if (!slug) continue;
      const date = mod?.metadata?.date as string | undefined;
      entries.push({ loc: `${origin}${basePath}/${slug}`, lastmod: date });
    }
    return entries;
  };

  const [blogEntries, newsletterEntries] = await Promise.all([
    loadEntries(blogModules, "/blog"),
    loadEntries(newsletterModules, "/data-nerd-newsletter"),
  ]);

  const urls: { loc: string; lastmod?: string }[] = [
    ...staticPaths.map((p) => ({ loc: `${origin}${p}` })),
    ...blogEntries,
    ...newsletterEntries,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const lastmod = u.lastmod ? new Date(u.lastmod).toISOString() : "";
        return `  <url>\n    <loc>${encode(u.loc)}</loc>\n${
          lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""
        }  </url>`;
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
