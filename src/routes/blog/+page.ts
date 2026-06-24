import type { PageLoad } from "./$types";
import { listAllPostsRaw, listPostsByCategory, listRecentPosts } from "$lib/content/posts";
import { slugFromPath } from "$lib/utils";

export const load: PageLoad = async () => {
  const [allPosts, { categoryPosts }, recentPosts] = await Promise.all([
    listAllPostsRaw(),
    listPostsByCategory(),
    listRecentPosts(5),
  ]);

  // Most visited posts (manually curated)
  const MOST_VISITED_SLUGS = [
    "conduct-life-design-interviews",
    "learn-to-code-from-the-beginning",
    "the-power-of-no-how-life-design-interviews-shaped-my-career"
  ];

  const CATEGORY_ORDER = ["Career Development", "Business", "Resources", "Personal"];

  const categorySections: Array<{
    name: string;
    slug: string;
    posts: any[];
    explanation?: string;
  }> = Array.from(categoryPosts.values())
    .sort((a, b) => {
      const aIndex = CATEGORY_ORDER.indexOf(a.name);
      const bIndex = CATEGORY_ORDER.indexOf(b.name);
      // If both are in the order, sort by their position
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      // If only a is in the order, it comes first
      if (aIndex !== -1) return -1;
      // If only b is in the order, it comes first
      if (bIndex !== -1) return 1;
      // If neither is in the order, sort alphabetically
      return a.name.localeCompare(b.name);
    });

  // Load Data Nerd Newsletter posts
  const newsletterModules = import.meta.glob(
    "/src/posts/data-nerd-newsletter/*.{md,svx,svelte.md}"
  );
  const newsletterPosts: Array<{ id: string; path: string; data: any }> = [];

  for (const [path, resolver] of Object.entries(newsletterModules)) {
    const resolved = await (resolver as () => Promise<any>)?.();
    const id = slugFromPath(path);
    if (resolved && id) {
      newsletterPosts.push({ id, path, data: resolved });
    }
  }

  // Sort descending by date
  newsletterPosts.sort((a, b) => {
    const aDate = new Date(a.data.metadata?.date ?? 0).getTime();
    const bDate = new Date(b.data.metadata?.date ?? 0).getTime();
    return bDate - aDate;
  });

  const newsletterSection = {
    name: "Data Nerd Newsletter",
    slug: "data-nerd-newsletter",
    posts: newsletterPosts,
    explanation: "An old weekly data-focused newsletter that I wrote and subsequently abandoned. Topics range from data science and machine learning to interesting visual datasets.",
  };

  categorySections.push(newsletterSection);

  const mostVisitedPosts = allPosts.filter((p) => MOST_VISITED_SLUGS.includes(p.id));

  return {
    categorySections,
    recentPosts,
    mostVisitedPosts,
  };
};
