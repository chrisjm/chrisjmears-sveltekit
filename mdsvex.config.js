import remarkGithub from "remark-github";
import remarkAbbr from "remark-abbr";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatexSvelte from "rehype-katex-svelte";
import { defineMDSveXConfig as defineConfig } from "mdsvex";

// Rehype plugin: set target="_blank" and safe rel on all anchors generated from Markdown
function rehypeTargetBlankAllLinks() {
  function visitNode(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "element" && node.tagName === "a") {
      const href = node.properties?.href;
      if (!(typeof href === "string" && href.startsWith("#"))) {
        node.properties ||= {};
        node.properties.target = "_blank";
        const rel = node.properties.rel;
        const list = Array.isArray(rel)
          ? rel
          : typeof rel === "string"
            ? rel.split(" ")
            : [];
        const set = new Set(list);
        set.add("noopener");
        set.add("noreferrer");
        node.properties.rel = Array.from(set);
      }
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) visitNode(child);
    }
  }
  return (tree) => visitNode(tree);
}

const config = defineConfig({
  extensions: [".svelte.md", ".md", ".svx"],

  smartypants: {
    dashes: "oldschool",
  },

  remarkPlugins: [
    [
      remarkGithub,
      {
        repository: "https://github.com/chrisjm/chrisjmears-sveltekit.git",
      },
    ],
    remarkAbbr,
    remarkMath,
  ],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "wrap",
      },
    ],
    rehypeTargetBlankAllLinks,
    rehypeKatexSvelte,
  ],
});

export default config;
