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
    <div className="min-h-dvh flex flex-col">
      <header className="sticky-header">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          {backTo && (
            <Link
              to={backTo}
              className="text-slate-400 hover:text-slate-200 transition-colors -ml-1 p-1"
              aria-label={backTo === '/' ? 'Back to home' : 'Back to deck'}
            >
              {backTo === '/' ? <HomeIcon /> : <ChevronLeftIcon />}
            </Link>
          )}
          <Link to="/" className="font-bold text-lg tracking-tight">
            Sideboard Guide
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
