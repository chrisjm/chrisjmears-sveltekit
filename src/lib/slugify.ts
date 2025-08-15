export function slugify(input: string): string {
  if (!input) return "";
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function unslugify(slug: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const slugFromPath = (path: string) =>
  path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;
