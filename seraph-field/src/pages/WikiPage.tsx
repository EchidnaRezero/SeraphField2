import { ChevronDown, Search } from 'lucide-react';
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import type { AppRoute } from '../app/routes';
import { CategoryNav } from '../components/CategoryNav';
import { HomeButton } from '../components/HomeButton';
import { TagList } from '../components/TagList';
import type { DocumentRecord, DocumentRole } from '../data/types';
import { EmptyCategoryPage } from './EmptyCategoryPage';
import { NotFoundPage } from './NotFoundPage';
import { StandalonePage } from './StandalonePage';

type WikiPageProps = {
  documents: DocumentRecord[];
  route: Extract<AppRoute, { kind: 'wiki' }>;
};

const ContentRenderer = lazy(() =>
  import('../components/ContentRenderer').then((module) => ({
    default: module.ContentRenderer,
  })),
);

const formatDate = (value: string) => value || 'pending';

const formatCollectionLabel = (value: string) =>
  value
    .split('-')
    .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join(' ');

const toNavigationId = (value: string) =>
  value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s/-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/-+/g, '-');

const searchHref = (query: string) => `#/search?q=${encodeURIComponent(query)}`;

export const WikiPage = ({ documents, route }: WikiPageProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [isCompactViewport, setIsCompactViewport] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < 1024,
  );
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isSeriesOpen, setIsSeriesOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const selectedDocument = documents.find((item) => item.slug === route.slug);
  const roadmapEntries = useMemo(
    () =>
      selectedDocument?.sections.map((section) => ({
        id: section.id,
        title: section.title,
      })) ?? [],
    [selectedDocument],
  );
  const seriesNavigation = useMemo(() => {
    if (!selectedDocument?.series) {
      return { documents: [], previous: undefined, next: undefined };
    }

    const seriesDocuments = documents
      .filter((document) => document.series?.id === selectedDocument.series?.id)
      .sort(
        (left, right) =>
          (left.series?.order ?? 0) - (right.series?.order ?? 0) ||
          left.title.localeCompare(right.title),
      );
    const currentIndex = seriesDocuments.findIndex(
      (document) => document.slug === selectedDocument.slug,
    );

    return {
      documents: seriesDocuments,
      previous: currentIndex > 0 ? seriesDocuments[currentIndex - 1] : undefined,
      next:
        currentIndex >= 0 && currentIndex < seriesDocuments.length - 1
          ? seriesDocuments[currentIndex + 1]
          : undefined,
    };
  }, [documents, selectedDocument]);
  const groupNavigation = useMemo(() => {
    if (!selectedDocument) {
      return [];
    }

    const seenGroupIds = new Set<string>();

    return selectedDocument.groups
      .map((group) => {
        const id = toNavigationId(group);

        if (!id || seenGroupIds.has(id)) {
          return null;
        }

        seenGroupIds.add(id);

        return {
          id,
          title: group,
          documents: documents
            .filter(
              (document) =>
                document.slug !== selectedDocument.slug &&
                document.groups.some((item) => toNavigationId(item) === id),
            )
            .sort(
              (left, right) =>
                left.title.localeCompare(right.title) || left.slug.localeCompare(right.slug),
            ),
        };
      })
      .filter((item) => item !== null);
  }, [documents, selectedDocument]);
  const visibleGroupEntries = groupNavigation.filter((entry) => entry.documents.length > 0);
  const hasCollectionHub =
    seriesNavigation.documents.length > 1 || visibleGroupEntries.length > 0;
  const roleDocument = (role: DocumentRole) =>
    documents.find((document) => document.role === role);

  useEffect(() => {
    const handleResize = () => {
      setIsCompactViewport(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveSectionId(roadmapEntries[0]?.id ?? '');
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    setIsNetworkOpen(false);
    setIsSeriesOpen(false);
    setOpenGroups({});
  }, [roadmapEntries, selectedDocument?.slug]);

  useEffect(
    () => () => {
      if (scrollAnimationRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const root = contentRef.current;

    if (!selectedDocument || !root) {
      return;
    }

    const scrollRoot = root.scrollHeight > root.clientHeight + 1 ? root : null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      {
        root: scrollRoot,
        rootMargin: '-10% 0% -72% 0%',
      },
    );

    selectedDocument.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [selectedDocument]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    const root = contentRef.current;

    if (!element) {
      return;
    }

    setActiveSectionId(sectionId);

    if (scrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
    }

    if (!root || !root.contains(element) || root.scrollHeight <= root.clientHeight + 1) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const startTop = root.scrollTop;
    const targetTop =
      startTop + element.getBoundingClientRect().top - root.getBoundingClientRect().top;
    const distance = targetTop - startTop;
    const duration = 560;
    const startTime = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      root.scrollTop = startTop + distance * eased;

      if (progress < 1) {
        scrollAnimationRef.current = window.requestAnimationFrame(tick);
        return;
      }

      setActiveSectionId(sectionId);
      scrollAnimationRef.current = null;
    };

    scrollAnimationRef.current = window.requestAnimationFrame(tick);
  };

  if (route.category && !route.slug) {
    const categoryDocuments = documents.filter(
      (document) => document.category === route.category,
    );

    if (categoryDocuments.length === 0) {
      return (
        <EmptyCategoryPage
          category={route.category}
          document={roleDocument('empty-category')}
        />
      );
    }

    return (
      <main className="sf-app wiki-page">
        <header className="page-toolbar">
          <HomeButton />
          <CategoryNav activeCategory={route.category} />
          <a className="icon-button top-search-link" href="#/search" title="Search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">검색</span>
          </a>
        </header>
        <section className="wiki-index">
          <h1>{route.category}</h1>
          <div className="wiki-index__list">
            {categoryDocuments.map((document) => (
              <a href={`#/wiki/${document.slug}`} key={document.slug}>
                <span>{document.updatedAt}</span>
                <strong>{document.title}</strong>
                <p>{document.summary}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const currentDocument = selectedDocument;

  if (!currentDocument) {
    return <NotFoundPage document={roleDocument('not-found')} />;
  }

  if (currentDocument.contentAvailable === false) {
    return <NotFoundPage document={roleDocument('content-unavailable')} />;
  }

  if (currentDocument.layout === 'standalone') {
    return <StandalonePage document={currentDocument} />;
  }

  return (
    <main className="sf-app wiki-page">
      <header className="page-toolbar">
        <HomeButton />
        <CategoryNav activeCategory={currentDocument.category} />
        <a className="icon-button top-search-link" href="#/search" title="Search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">검색</span>
        </a>
      </header>

      <article className="wiki-layout">
        <div className="wiki-content-scroll" ref={contentRef}>
          <header className="wiki-hero">
            <h1>{currentDocument.title}</h1>
            <p>{currentDocument.summary}</p>
            <div className="wiki-meta">
              <div className="meta-row">
                <span className="meta-label">Created</span>
                <span>{formatDate(currentDocument.createdAt)}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Updated</span>
                <span>{formatDate(currentDocument.updatedAt)}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Tags</span>
                <TagList tags={currentDocument.tags} />
              </div>
            </div>
          </header>

          <details className="roadmap-mobile">
            <summary>Document Roadmap</summary>
            <ol>
              {roadmapEntries.map((item) => (
                <li data-active={activeSectionId === item.id} key={item.id}>
                  <button type="button" onClick={() => scrollToSection(item.id)}>
                    {item.title}
                  </button>
                </li>
              ))}
            </ol>
          </details>

          <div className="wiki-body">
            {currentDocument.sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                <Suspense fallback={<div className="section-markdown section-markdown--loading" />}>
                  <ContentRenderer markdown={section.markdown} />
                </Suspense>
              </section>
            ))}

            {hasCollectionHub && (
              <section className="collection-hub" aria-label="시리즈와 그룹 탐색">
                {isCompactViewport ? (
                  <button
                    type="button"
                    onClick={() => setIsNetworkOpen((current) => !current)}
                    className="collection-hub__toggle"
                  >
                    <span>
                      <span className="collection-hub__eyebrow">Document Network</span>
                      <span className="collection-hub__title">Series and Groups</span>
                      <span className="collection-hub__summary">관련 시리즈와 그룹 탐색</span>
                    </span>
                    <ChevronDown
                      className={isNetworkOpen ? 'collection-chevron is-open' : 'collection-chevron'}
                      size={16}
                      aria-hidden="true"
                    />
                  </button>
                ) : (
                  <div className="collection-hub__header">
                    <div className="collection-hub__eyebrow">Document Network</div>
                    <h2 className="collection-hub__title">Series and Groups</h2>
                    <p className="collection-hub__summary">
                      같은 읽기 흐름과 같은 주제 묶음을 한곳에서 이동할 수 있게 정리한 탐색 구역이다.
                    </p>
                  </div>
                )}

                {(!isCompactViewport || isNetworkOpen) && (
                  <>
                    {currentDocument.series &&
                      seriesNavigation.documents.length > 1 &&
                      (isCompactViewport ? (
                        <div className="collection-cluster">
                          <button
                            type="button"
                            onClick={() => setIsSeriesOpen((current) => !current)}
                            className="collection-cluster__toggle"
                          >
                            <span>
                              <span className="collection-cluster__eyebrow">Series</span>
                              <span className="collection-cluster__title">
                                {currentDocument.series.title}
                              </span>
                              <span className="collection-cluster__meta">
                                {seriesNavigation.documents.findIndex(
                                  (document) => document.slug === currentDocument.slug,
                                ) + 1}{' '}
                                / {seriesNavigation.documents.length} 문서
                              </span>
                            </span>
                            <ChevronDown
                              className={
                                isSeriesOpen ? 'collection-chevron is-open' : 'collection-chevron'
                              }
                              size={16}
                              aria-hidden="true"
                            />
                          </button>

                          {isSeriesOpen && (
                            <>
                              <a
                                href={searchHref(`series:${currentDocument.series.id}`)}
                                className="collection-cluster__action"
                              >
                                Search Series
                              </a>
                              <div className="collection-nav-grid">
                                {seriesNavigation.previous && (
                                  <a
                                    href={`#/wiki/${seriesNavigation.previous.slug}`}
                                    className="collection-nav-card"
                                  >
                                    <span className="collection-nav-card__eyebrow">
                                      Previous In Series
                                    </span>
                                    <span className="collection-nav-card__title">
                                      {seriesNavigation.previous.title}
                                    </span>
                                  </a>
                                )}
                                {seriesNavigation.next && (
                                  <a
                                    href={`#/wiki/${seriesNavigation.next.slug}`}
                                    className="collection-nav-card"
                                  >
                                    <span className="collection-nav-card__eyebrow">
                                      Next In Series
                                    </span>
                                    <span className="collection-nav-card__title">
                                      {seriesNavigation.next.title}
                                    </span>
                                  </a>
                                )}
                              </div>
                              <div className="collection-series-list">
                                {seriesNavigation.documents.map((document) => (
                                  <a
                                    key={document.slug}
                                    href={`#/wiki/${document.slug}`}
                                    className={`collection-series-item ${
                                      document.slug === currentDocument.slug
                                        ? 'collection-series-item--active'
                                        : 'collection-series-item--idle'
                                    }`}
                                  >
                                    <span className="collection-series-item__title">
                                      {document.title}
                                    </span>
                                    <span className="collection-series-item__order">
                                      #{document.series?.order ?? '?'}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="collection-cluster">
                          <div className="collection-cluster__header">
                            <div>
                              <div className="collection-cluster__eyebrow">Series</div>
                              <h3 className="collection-cluster__title">
                                {currentDocument.series.title}
                              </h3>
                              <div className="collection-cluster__meta">
                                {seriesNavigation.documents.findIndex(
                                  (document) => document.slug === currentDocument.slug,
                                ) + 1}{' '}
                                / {seriesNavigation.documents.length} 문서
                              </div>
                            </div>
                            <a
                              href={searchHref(`series:${currentDocument.series.id}`)}
                              className="collection-cluster__action"
                            >
                              Search Series
                            </a>
                          </div>

                          <div className="collection-nav-grid">
                            {seriesNavigation.previous && (
                              <a
                                href={`#/wiki/${seriesNavigation.previous.slug}`}
                                className="collection-nav-card"
                              >
                                <span className="collection-nav-card__eyebrow">
                                  Previous In Series
                                </span>
                                <span className="collection-nav-card__title">
                                  {seriesNavigation.previous.title}
                                </span>
                              </a>
                            )}
                            {seriesNavigation.next && (
                              <a
                                href={`#/wiki/${seriesNavigation.next.slug}`}
                                className="collection-nav-card"
                              >
                                <span className="collection-nav-card__eyebrow">
                                  Next In Series
                                </span>
                                <span className="collection-nav-card__title">
                                  {seriesNavigation.next.title}
                                </span>
                              </a>
                            )}
                          </div>

                          <div className="collection-series-list">
                            {seriesNavigation.documents.map((document) => (
                              <a
                                key={document.slug}
                                href={`#/wiki/${document.slug}`}
                                className={`collection-series-item ${
                                  document.slug === currentDocument.slug
                                    ? 'collection-series-item--active'
                                    : 'collection-series-item--idle'
                                }`}
                              >
                                <span className="collection-series-item__title">
                                  {document.title}
                                </span>
                                <span className="collection-series-item__order">
                                  #{document.series?.order ?? '?'}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}

                    {visibleGroupEntries.length > 0 &&
                      (isCompactViewport ? (
                        <div className="collection-group-grid">
                          {visibleGroupEntries.map((entry) => {
                            const isOpen = openGroups[entry.id] ?? false;

                            return (
                              <div key={entry.id} className="collection-group-card">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenGroups((current) => ({
                                      ...current,
                                      [entry.id]: !current[entry.id],
                                    }))
                                  }
                                  className="collection-group-card__toggle"
                                >
                                  <span>
                                    <span className="collection-group-card__eyebrow">Group</span>
                                    <span className="collection-group-card__title">
                                      {formatCollectionLabel(entry.title)}
                                    </span>
                                    <span className="collection-group-card__meta">
                                      {entry.documents.length} related document
                                      {entry.documents.length === 1 ? '' : 's'}
                                    </span>
                                  </span>
                                  <ChevronDown
                                    className={
                                      isOpen ? 'collection-chevron is-open' : 'collection-chevron'
                                    }
                                    size={16}
                                    aria-hidden="true"
                                  />
                                </button>

                                {isOpen && (
                                  <>
                                    <a
                                      href={searchHref(`group:${entry.id}`)}
                                      className="collection-cluster__action"
                                    >
                                      Open Search
                                    </a>
                                    <div className="collection-group-card__list">
                                      {entry.documents.slice(0, 5).map((document) => (
                                        <a
                                          key={document.slug}
                                          href={`#/wiki/${document.slug}`}
                                          className="collection-group-item"
                                        >
                                          <span className="collection-group-item__title">
                                            {document.title}
                                          </span>
                                          <span className="collection-group-item__category">
                                            {document.category}
                                          </span>
                                        </a>
                                      ))}
                                    </div>
                                    {entry.documents.length > 5 && (
                                      <div className="collection-group-card__more">
                                        +{entry.documents.length - 5} more in this group
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="collection-cluster">
                          <div className="collection-cluster__header">
                            <div>
                              <div className="collection-cluster__eyebrow">Groups</div>
                              <h3 className="collection-cluster__title">
                                Related Group Collections
                              </h3>
                              <div className="collection-cluster__meta">
                                {visibleGroupEntries.length}개 그룹에서 관련 문서를 찾을 수 있다.
                              </div>
                            </div>
                          </div>
                          <div className="collection-group-grid">
                            {visibleGroupEntries.map((entry) => (
                              <div key={entry.id} className="collection-group-card">
                                <div className="collection-group-card__header">
                                  <div>
                                    <div className="collection-group-card__eyebrow">Group</div>
                                    <h4 className="collection-group-card__title">
                                      {formatCollectionLabel(entry.title)}
                                    </h4>
                                    <div className="collection-group-card__meta">
                                      {entry.documents.length} related document
                                      {entry.documents.length === 1 ? '' : 's'}
                                    </div>
                                  </div>
                                  <a
                                    href={searchHref(`group:${entry.id}`)}
                                    className="collection-cluster__action"
                                  >
                                    Open Search
                                  </a>
                                </div>
                                <div className="collection-group-card__list">
                                  {entry.documents.slice(0, 5).map((document) => (
                                    <a
                                      key={document.slug}
                                      href={`#/wiki/${document.slug}`}
                                      className="collection-group-item"
                                    >
                                      <span className="collection-group-item__title">
                                        {document.title}
                                      </span>
                                      <span className="collection-group-item__category">
                                        {document.category}
                                      </span>
                                    </a>
                                  ))}
                                </div>
                                {entry.documents.length > 5 && (
                                  <div className="collection-group-card__more">
                                    +{entry.documents.length - 5} more in this group
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </section>
            )}
          </div>
        </div>

        <aside className="roadmap-desktop" aria-label="문서 로드맵">
          <p className="eyebrow">ROADMAP</p>
          <ol>
            {roadmapEntries.map((item) => (
              <li data-active={activeSectionId === item.id} key={item.id}>
                <button type="button" onClick={() => scrollToSection(item.id)}>
                  {item.title}
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </article>
    </main>
  );
};
