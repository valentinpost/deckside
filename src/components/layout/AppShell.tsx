import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          {!isHome && (
            <Link
              to="/"
              className="text-slate-400 hover:text-slate-200 transition-colors -ml-1 p-1"
              aria-label="Back to home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
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
