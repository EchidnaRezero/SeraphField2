import { Home, Search, UserRound } from 'lucide-react';

type UtilityNavProps = {
  compact?: boolean;
  showHome?: boolean;
  showSearch?: boolean;
};

export const UtilityNav = ({
  compact = false,
  showHome = true,
  showSearch = true,
}: UtilityNavProps) => (
  <nav className="utility-nav" data-compact={compact} aria-label="공통 메뉴">
    {showHome ? (
      <a className="icon-button" href="#/" title="Lobby">
        <Home size={18} aria-hidden="true" />
        <span className="sr-only">로비</span>
      </a>
    ) : null}
    <a className="icon-button" href="#/wiki/profile" title="Profile">
      <UserRound size={18} aria-hidden="true" />
      <span className="sr-only">프로필</span>
    </a>
    {showSearch ? (
      <a className="icon-button" href="#/search" title="Search">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">검색</span>
      </a>
    ) : null}
  </nav>
);
