export interface HeaderMeta {
  teaser?: string;
  cloudinaryPublicId?: string;
}

export interface Frontmatter {
  title: string;
  date: string; // ISO string preferred
  updated?: string; // ISO string preferred
  description?: string;
  excerpt?: string;
  header?: HeaderMeta;
  // Blog taxonomy
  categories?: string | string[];
  tags?: string[];
}

export interface PostSummary {
  slug: string;
  frontmatter: Frontmatter;
}
