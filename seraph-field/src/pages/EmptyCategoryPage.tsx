import { Search } from 'lucide-react';
import { CategoryNav } from '../components/CategoryNav';
import { HomeButton } from '../components/HomeButton';
import type { DocumentCategory } from '../data/types';
import type { DocumentRecord } from '../data/types';
import { StandalonePage } from './StandalonePage';

type EmptyCategoryPageProps = {
  category: DocumentCategory;
  document?: DocumentRecord;
};

export const EmptyCategoryPage = ({ category, document }: EmptyCategoryPageProps) =>
  document ? <StandalonePage document={document} /> : (
  <main className="sf-app wiki-page">
    <header className="page-toolbar">
      <HomeButton />
      <CategoryNav activeCategory={category} />
      <a className="icon-button top-search-link" href="#/search" title="Search">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">검색</span>
      </a>
    </header>
    <section className="empty-state" aria-label={`${category} 문서 없음`}>
      <h1>문서를 찾을 수 없습니다.</h1>
      <a className="text-link" href="#/">
        로비로 이동
      </a>
    </section>
  </main>
  );
