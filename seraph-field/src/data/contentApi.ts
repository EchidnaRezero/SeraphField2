import { fixtureDocuments } from './fixtures';
import type { DocumentRecord } from './types';

type ExportDocument = Partial<DocumentRecord> & {
  wiki_relpath?: string;
  content_relpath?: string;
  created_at?: string;
  updated_at?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const normalizeDocument = (value: unknown): DocumentRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const candidate = value as ExportDocument;

  if (
    typeof candidate.slug !== 'string' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.summary !== 'string' ||
    typeof candidate.category !== 'string'
  ) {
    return null;
  }

  return {
    slug: candidate.slug,
    title: candidate.title,
    summary: candidate.summary,
    category: candidate.category as DocumentRecord['category'],
    layout: candidate.layout === 'standalone' ? 'standalone' : 'wiki',
    role:
      candidate.role === 'profile' ||
      candidate.role === 'not-found' ||
      candidate.role === 'content-unavailable' ||
      candidate.role === 'empty-category'
        ? candidate.role
        : 'content',
    wikiRelpath:
      typeof candidate.wikiRelpath === 'string'
        ? candidate.wikiRelpath
        : candidate.wiki_relpath ?? '',
    contentRelpath:
      typeof candidate.contentRelpath === 'string'
        ? candidate.contentRelpath
        : candidate.content_relpath,
    createdAt:
      typeof candidate.createdAt === 'string'
        ? candidate.createdAt
        : candidate.created_at ?? '',
    updatedAt:
      typeof candidate.updatedAt === 'string'
        ? candidate.updatedAt
        : candidate.updated_at ?? '',
    tags: isStringArray(candidate.tags) ? candidate.tags : [],
    groups: isStringArray(candidate.groups) ? candidate.groups : [],
    series: candidate.series,
    repository: candidate.repository,
    roadmap: isStringArray(candidate.roadmap) ? candidate.roadmap : [],
    sections: Array.isArray(candidate.sections) ? candidate.sections : [],
    contentAvailable: false,
  };
};

const loadDocumentContent = async (document: DocumentRecord): Promise<DocumentRecord> => {
  if (!document.contentRelpath) {
    return document;
  }

  try {
    const relpath = document.contentRelpath.replace(/^\/+/, '');
    const response = await fetch(`${import.meta.env.BASE_URL}${relpath}`, {
      cache: 'no-cache',
    });

    if (!response.ok) {
      return document;
    }

    const payload = await response.json();

    if (!isRecord(payload) || !Array.isArray(payload.sections)) {
      return document;
    }

    return {
      ...document,
      title: typeof payload.title === 'string' ? payload.title : document.title,
      summary: typeof payload.summary === 'string' ? payload.summary : document.summary,
      sections: payload.sections,
      contentAvailable: payload.sections.some(
        (section) =>
          isRecord(section) &&
          typeof section.markdown === 'string' &&
          section.markdown.trim().length > 0,
      ),
      roadmap: payload.sections
        .map((section) =>
          isRecord(section) && typeof section.title === 'string' ? section.title : '',
        )
        .filter(Boolean),
    };
  } catch {
    return document;
  }
};

export const loadDocuments = async (): Promise<DocumentRecord[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}db/exports/documents.json`,
      {
        cache: 'no-cache',
      },
    );

    if (response.ok) {
      const payload = await response.json();
      const documents = Array.isArray(payload)
        ? payload.map(normalizeDocument).filter((item) => item !== null)
        : [];

      if (documents.length > 0) {
        return Promise.all(documents.map(loadDocumentContent));
      }
    }
  } catch {
    return fixtureDocuments;
  }

  return fixtureDocuments;
};
