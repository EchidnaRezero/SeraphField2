import { HomeButton } from '../components/HomeButton';
import { UtilityNav } from '../components/UtilityNav';
import type { DocumentRecord } from '../data/types';
import { StandalonePage } from './StandalonePage';

type NotFoundPageProps = {
  document?: DocumentRecord;
};

export const NotFoundPage = ({ document }: NotFoundPageProps) =>
  document ? <StandalonePage document={document} /> : (
  <main className="sf-app utility-page">
    <header className="page-toolbar">
      <HomeButton />
      <UtilityNav compact />
    </header>
    <section className="empty-state">
      <h1>문서를 찾을 수 없습니다.</h1>
      <a className="text-link" href="#/">
        로비로 이동
      </a>
    </section>
  </main>
  );
