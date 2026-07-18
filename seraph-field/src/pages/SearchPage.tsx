import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { HomeButton } from '../components/HomeButton';
import { TagList } from '../components/TagList';
import { UtilityNav } from '../components/UtilityNav';
import { searchDocuments } from '../data/search';
import type { DocumentRecord, SearchScope } from '../data/types';

type SearchPageProps = {
  documents: DocumentRecord[];
  initialQuery: string;
};

const scopes: SearchScope[] = ['All', 'Title', 'Tag', 'Group', 'Series'];

export const SearchPage = ({ documents, initialQuery }: SearchPageProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState<SearchScope>('All');
  const results = useMemo(
    () => searchDocuments(documents, query, scope),
    [documents, query, scope],
  );

  return (
    <main className="sf-app search-page">
      <header className="page-toolbar">
        <HomeButton />
        <div className="page-toolbar__title">
          <h1>Search Results</h1>
        </div>
        <UtilityNav compact showHome={false} showSearch={false} />
      </header>

      <section className="search-panel" aria-label="문서 검색">
        <label className="search-input">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="title, tag, group, series"
          />
          <Search size={19} aria-hidden="true" />
        </label>
        <div className="scope-tabs" role="tablist" aria-label="검색 범위">
          {scopes.map((item) => (
            <button
              type="button"
              role="tab"
              aria-selected={scope === item}
              data-active={scope === item}
              key={item}
              onClick={() => setScope(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="search-results" aria-label="검색 결과">
        <div className="search-meta">
          <span>Integrated Search</span>
          <span>{results.length} matches</span>
        </div>
        <div className="result-list">
          {results.map((document) => (
            <a className="result-item" href={`#/wiki/${document.slug}`} key={document.slug}>
              <div>
                <div className="result-head">
                  <span>{document.category}</span>
                  <span>Created {document.createdAt}</span>
                  <span>Updated {document.updatedAt}</span>
                </div>
                <strong>{document.title}</strong>
                <p>{document.summary}</p>
              </div>
              <TagList tags={document.tags} />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
};
