import type { DocumentRecord, SearchScope } from './types';

const normalize = (value: string) => value.toLocaleLowerCase();

const includesQuery = (values: string[], query: string) =>
  values.some((value) => normalize(value).includes(query));

const toId = (value: string) =>
  normalize(value)
    .normalize('NFKD')
    .replace(/[^\w\s/-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/-+/g, '-');

const parseScopedQuery = (query: string) => {
  const match = query.match(/^(group|series):(.+)$/i);

  if (!match) {
    return null;
  }

  return {
    scope: match[1].toLocaleLowerCase() as 'group' | 'series',
    id: toId(match[2]),
  };
};

export const searchDocuments = (
  documents: DocumentRecord[],
  rawQuery: string,
  scope: SearchScope,
) => {
  const query = normalize(rawQuery.trim());

  if (!query) {
    return documents;
  }

  const scopedQuery = parseScopedQuery(rawQuery.trim());

  if (scopedQuery?.scope === 'group') {
    return documents.filter((document) =>
      document.groups.some((group) => toId(group) === scopedQuery.id),
    );
  }

  if (scopedQuery?.scope === 'series') {
    return documents.filter(
      (document) =>
        document.series &&
        (toId(document.series.id) === scopedQuery.id ||
          toId(document.series.title) === scopedQuery.id),
    );
  }

  return documents.filter((document) => {
    if (scope === 'Title') {
      return includesQuery([document.title], query);
    }

    if (scope === 'Tag') {
      return includesQuery(document.tags, query);
    }

    if (scope === 'Group') {
      return includesQuery(
        document.groups.flatMap((group) => [group, toId(group)]),
        query,
      );
    }

    if (scope === 'Series') {
      return document.series
        ? includesQuery([document.series.title, document.series.id], query)
        : false;
    }

    return includesQuery(
      [
        document.title,
        document.summary,
        document.category,
        ...document.tags,
        ...document.groups,
        ...document.groups.map((group) => toId(group)),
        document.series?.title ?? '',
        document.series?.id ?? '',
        document.repository?.name ?? '',
      ],
      query,
    );
  });
};
