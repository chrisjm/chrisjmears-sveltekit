export interface HeaderMeta {
  teaser?: string;
  cloudinaryPublicId?: string;
}

export interface Frontmatter {
  title: string;
  date: string; // ISO string preferred
  description?: string;
  excerpt?: string;
  header?: HeaderMeta;
}

export interface PostSummary {
  slug: string;
  frontmatter: Frontmatter;
}
