import { BookOpen, Code2, FileText, TerminalSquare } from 'lucide-react';
import { categories } from '../data/categories';
import type { DocumentCategory } from '../data/types';

type CategoryNavProps = {
  activeCategory?: DocumentCategory;
};

const iconByCategory = {
  THEORY: BookOpen,
  PAPER: FileText,
  REPO: Code2,
  IMPLEMENT: TerminalSquare,
};

export const CategoryNav = ({ activeCategory }: CategoryNavProps) => (
  <nav className="category-nav" aria-label="문서 카테고리">
    {categories.map((category) => {
      const Icon = iconByCategory[category.id];

      return (
        <a
          className="category-nav__item"
          data-active={activeCategory === category.id}
          href={`#/wiki?category=${category.id}`}
          key={category.id}
          title={category.label}
        >
          <Icon size={19} aria-hidden="true" />
          <span className="sr-only">{category.label}</span>
        </a>
      );
    })}
  </nav>
);
