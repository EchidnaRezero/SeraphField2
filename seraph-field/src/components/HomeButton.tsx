import { Home } from 'lucide-react';

export const HomeButton = () => (
  <a className="icon-button icon-button--round" href="#/" title="Lobby">
    <Home size={18} aria-hidden="true" />
    <span className="sr-only">로비로 이동</span>
  </a>
);
