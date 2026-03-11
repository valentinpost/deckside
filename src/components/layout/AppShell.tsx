import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDeckStore } from '@/store/deckStore';
import { ChevronLeftIcon, LogoIcon } from '@/components/icons';

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const deckName = useDeckStore((state) => state.deck?.deckName);

  // On matchup page: back arrow → deck page, header shows deck name
  // On deck page: back arrow → home, header shows Deckside logo
  // On home: no back arrow, header shows Deckside logo
  const isMatchupPage = segments.length >= 3 && segments[0] === 'deck';
  const isDeckPage = segments.length === 2 && segments[0] === 'deck';

  const backTo = isMatchupPage
    ? `/deck/${segments[1]}`
    : isDeckPage
      ? '/'
      : null;

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="header-inner">
          {backTo && (
            <Link to={backTo} className="back-link" aria-label="Go back">
              <ChevronLeftIcon />
            </Link>
          )}
          {isMatchupPage && deckName ? (
            <Link to={`/deck/${segments[1]}`} className="logo">
              {deckName}
            </Link>
          ) : (
            <Link to="/" className="logo">
              <LogoIcon size={22} />
              Deckside
            </Link>
          )}
        </div>
      </header>
      <main className="app-shell__main">
        {children}
      </main>
    </div>
  );
}
