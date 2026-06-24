import type { PageLoad } from "./$types";
import { listAllPostsRaw, listPostsByCategory, listRecentPosts } from "$lib/content/posts";

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

  const CATEGORY_ORDER = ["Career Development", "Tech & Data", "Resources", "Business", "Personal"];

  const categorySections = Array.from(categoryPosts.values())
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

  const mostVisitedPosts = allPosts.filter((p) => MOST_VISITED_SLUGS.includes(p.id));

  return {
    categorySections,
    recentPosts,
    mostVisitedPosts,
  };
};
