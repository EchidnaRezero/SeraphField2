export type DocumentCategory =
  | 'THEORY'
  | 'PAPER'
  | 'REPO'
  | 'IMPLEMENT'
  | 'PROFILE';

export type SearchScope = 'All' | 'Title' | 'Tag' | 'Group' | 'Series';

export type DocumentLayout = 'wiki' | 'standalone';

export type DocumentRole =
  | 'content'
  | 'profile'
  | 'not-found'
  | 'content-unavailable'
  | 'empty-category';

export type CategoryDefinition = {
  id: Exclude<DocumentCategory, 'PROFILE'>;
  label: string;
  shortLabel: string;
  description: string;
};

export type DocumentSection = {
  id: string;
  title: string;
  markdown: string;
};

export type DocumentRecord = {
  slug: string;
  title: string;
  summary: string;
  category: DocumentCategory;
  layout?: DocumentLayout;
  role?: DocumentRole;
  wikiRelpath: string;
  contentRelpath?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  groups: string[];
  series?: {
    id: string;
    title: string;
    order: number;
  };
  repository?: {
    owner: string;
    name: string;
    url: string;
  };
  roadmap: string[];
  sections: DocumentSection[];
  contentAvailable?: boolean;
};
