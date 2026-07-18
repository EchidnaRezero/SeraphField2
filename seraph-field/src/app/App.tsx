import { useEffect, useMemo, useState } from 'react';
import { useHashRoute } from './routes';
import { loadDocuments } from '../data/contentApi';
import type { DocumentRecord } from '../data/types';
import { PageTransition } from '../components/PageTransition';
import { LobbyPage } from '../pages/LobbyPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SearchPage } from '../pages/SearchPage';
import { WikiPage } from '../pages/WikiPage';

export const App = () => {
  const route = useHashRoute();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    loadDocuments().then((loadedDocuments) => {
      if (mounted) {
        setDocuments(loadedDocuments);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const featuredDocuments = useMemo(
    () => documents.filter((document) => document.category !== 'PROFILE'),
    [documents],
  );

  if (isLoading) {
    return (
      <main className="sf-app sf-loading">
        <span>LOADING FIELD INDEX</span>
      </main>
    );
  }

  let routeKey: string;
  let page;

  if (route.kind === 'lobby') {
    routeKey = 'lobby';
    page = <LobbyPage documents={featuredDocuments} />;
  } else if (route.kind === 'search') {
    routeKey = `search:${route.query}`;
    page = <SearchPage documents={documents} initialQuery={route.query} />;
  } else if (route.kind === 'wiki') {
    routeKey = `wiki:${route.slug ?? ''}:${route.category ?? ''}`;
    page = <WikiPage documents={documents} route={route} />;
  } else {
    routeKey = 'not-found';
    page = (
      <NotFoundPage document={documents.find((document) => document.role === 'not-found')} />
    );
  }

  return <PageTransition routeKey={routeKey}>{page}</PageTransition>;
};
