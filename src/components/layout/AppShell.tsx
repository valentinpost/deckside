import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, HomeIcon } from '@/components/icons';

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  // /deck/:id/:slug → /deck/:id, /deck/:id → /, / → null
  const backTo =
    segments.length >= 3 && segments[0] === 'deck'
      ? `/deck/${segments[1]}`
      : segments.length >= 1
        ? '/'
        : null;

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="header-inner">
          {backTo && (
            <Link
              to={backTo}
              className="back-link"
              aria-label={backTo === '/' ? 'Back to home' : 'Back to deck'}
            >
              {backTo === '/' ? <HomeIcon /> : <ChevronLeftIcon />}
            </Link>
          )}
          <Link to="/" className="logo">
            Sideboard Guide
          </Link>
        </div>
      </header>
      <main className="app-shell__main">
        {children}
      </main>
    </div>
  );
}
