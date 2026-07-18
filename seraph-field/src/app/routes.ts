import { useEffect, useState } from 'react';
import type { DocumentCategory } from '../data/types';

export type AppRoute =
  | { kind: 'lobby' }
  | { kind: 'search'; query: string }
  | { kind: 'wiki'; slug?: string; category?: DocumentCategory }
  | { kind: 'not-found' };

const categorySet = new Set<DocumentCategory>([
  'THEORY',
  'PAPER',
  'REPO',
  'IMPLEMENT',
  'PROFILE',
]);

const isDocumentCategory = (value: string): value is DocumentCategory =>
  categorySet.has(value as DocumentCategory);

export const parseHashRoute = (hash: string): AppRoute => {
  const rawRoute = hash.replace(/^#/, '') || '/';
  const [path, queryString = ''] = rawRoute.split('?');
  const params = new URLSearchParams(queryString);

  if (path === '/search') {
    return { kind: 'search', query: params.get('q') ?? '' };
  }

  if (path === '/wiki') {
    const category = params.get('category')?.toUpperCase() ?? '';
    return isDocumentCategory(category)
      ? { kind: 'wiki', category }
      : { kind: 'wiki' };
  }

  if (path.startsWith('/wiki/')) {
    const slug = decodeURIComponent(path.slice('/wiki/'.length));
    return { kind: 'wiki', slug };
  }

  return path === '/' ? { kind: 'lobby' } : { kind: 'not-found' };
};

export const useHashRoute = () => {
  const [route, setRoute] = useState<AppRoute>(() =>
    parseHashRoute(window.location.hash),
  );

  useEffect(() => {
    const updateRoute = () => setRoute(parseHashRoute(window.location.hash));
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  return route;
};
