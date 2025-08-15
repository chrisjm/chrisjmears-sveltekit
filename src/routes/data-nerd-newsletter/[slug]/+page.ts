import type { PageLoad } from "./$types";
import { slugFromPath } from "$lib/slugify";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob(
    `/src/posts/data-nerd-newsletter/*.{md,svx,svelte.md}`,
  );

  // TODO: Fix `any` type below
  let match: { path?: string; resolver?: any } = {};
  for (const [path, resolver] of Object.entries(modules)) {
    if (slugFromPath(path) === params.slug) {
      match = { path, resolver };
      break;
    }
  }

  const post = await match?.resolver?.();

  if (!post) {
    error(404); // Couldn't resolve the post
  }

  return {
    component: post.default,
    frontmatter: post.metadata,
  };
};
