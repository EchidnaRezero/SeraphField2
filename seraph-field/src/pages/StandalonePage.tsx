import { Search } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { CategoryNav } from '../components/CategoryNav';
import { HomeButton } from '../components/HomeButton';
import type { DocumentRecord } from '../data/types';

const ContentRenderer = lazy(() =>
  import('../components/ContentRenderer').then((module) => ({
    default: module.ContentRenderer,
  })),
);

type StandalonePageProps = {
  document: DocumentRecord;
};

export const StandalonePage = ({ document }: StandalonePageProps) => (
  <main className="sf-app standalone-page">
    <header className="page-toolbar">
      <HomeButton />
      <CategoryNav activeCategory={document.category} />
      <a className="icon-button top-search-link" href="#/search" title="Search">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">검색</span>
      </a>
    </header>

    <article className="standalone-layout">
      <header className="standalone-hero">
        <h1>{document.title}</h1>
        {document.summary && <p>{document.summary}</p>}
      </header>

      <div className="standalone-body">
        {document.sections.map((section) => (
          <section id={section.id} key={section.id}>
            {section.title !== 'Overview' && <h2>{section.title}</h2>}
            <Suspense fallback={<div className="section-markdown section-markdown--loading" />}>
              <ContentRenderer markdown={section.markdown} />
            </Suspense>
          </section>
        ))}
      </div>
    </article>
  </main>
);
