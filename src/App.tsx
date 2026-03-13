import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { DeckPage } from './pages/DeckPage';
import { MatchupPage } from './pages/MatchupPage';
import { useDeckSync } from './hooks/useDeckSync';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function SyncProvider({ children }: { children: React.ReactNode }) {
  useDeckSync();
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <SyncProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deck/:deckId" element={<DeckPage />} />
            <Route path="/deck/:deckId/:matchupSlug" element={<MatchupPage />} />
          </Routes>
        </AppShell>
      </SyncProvider>
    </HashRouter>
  );
}
