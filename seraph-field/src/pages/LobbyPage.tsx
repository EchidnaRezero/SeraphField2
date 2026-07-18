import { BookOpen, Code2, FileText, TerminalSquare } from 'lucide-react';
import { UtilityNav } from '../components/UtilityNav';
import { categories } from '../data/categories';
import type { DocumentRecord } from '../data/types';

type LobbyPageProps = {
  documents: DocumentRecord[];
};

const iconByCategory = {
  THEORY: BookOpen,
  PAPER: FileText,
  REPO: Code2,
  IMPLEMENT: TerminalSquare,
};

export const LobbyPage = ({ documents }: LobbyPageProps) => {
  const backgroundUrl = `${import.meta.env.BASE_URL}images/lobby-backdrop.png`;

  return (
    <main className="lobby-viewport">
      <section className="sf-app lobby-page" aria-label="Seraph Field lobby">
        <div
          className="lobby-page__backdrop"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
          aria-hidden="true"
        />
        <div className="lobby-page__overlay" aria-hidden="true" />
        <div className="lobby-page__hud-tint" aria-hidden="true" />
        <div className="lobby-page__vignette" aria-hidden="true" />

        <div className="lobby-page__content">
          <header className="lobby-page__header">
            <div aria-hidden="true" />
            <UtilityNav compact />
          </header>

          <div className="lobby-page__spacer" aria-hidden="true" />

          <nav className="lobby-page__console" aria-label="문서 카테고리">
            {categories.map((category) => {
              const Icon = iconByCategory[category.id];
              const count = documents.filter(
                (document) => document.category === category.id,
              ).length;

              return (
                <a
                  className="lobby-card"
                  href={`#/wiki?category=${category.id}`}
                  key={category.id}
                  aria-label={`${category.label} ${count} documents`}
                >
                  <Icon size={22} aria-hidden="true" />
                  <strong>{category.label}</strong>
                </a>
              );
            })}
          </nav>

          <footer className="lobby-page__footer">
            <div>Background Image: Squad 31-A</div>
            <div>Heaven Burns Red ©WFS, Developed by Wright Flyer Studios, ©VISUAL ARTS/Key</div>
          </footer>
        </div>
      </section>
    </main>
  );
};
