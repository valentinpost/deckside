import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { DeckPage } from './pages/DeckPage';
import { MatchupPage } from './pages/MatchupPage';
import { useDeckSync } from './hooks/useDeckSync';

function SyncProvider({ children }: { children: React.ReactNode }) {
  useDeckSync();
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
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
