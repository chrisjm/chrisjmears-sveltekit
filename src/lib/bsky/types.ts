export type ImageEmbed = {
  type: "image";
  thumb?: string;
  fullsize?: string;
  alt?: string;
};

export type ExternalEmbed = {
  type: "external";
  uri?: string;
  title?: string;
  description?: string;
  thumb?: string;
};

export type RecordEmbed = {
  type: "record";
  by?: string;
  uri?: string;
  valueType?: string;
};

export type Embed = ImageEmbed | ExternalEmbed | RecordEmbed | null;

export type Author = {
  handle?: string;
  displayName?: string;
  avatar?: string;
};

export type Repost = {
  byHandle?: string;
  byDisplayName?: string;
  byAvatar?: string;
  profileUrl?: string;
};

export type Item = {
  id: string;
  text: string;
  createdAt?: string;
  author?: Author;
  url?: string;
  embed: Embed;
  repost?: Repost;
};
