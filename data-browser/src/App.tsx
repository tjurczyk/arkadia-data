import React, { useState } from 'react';
import { SearchField } from './components/Controls';
import Knowledge from './views/Knowledge';
import Magics from './views/Magics';
import Keys from './views/Keys';
import Herbs from './views/Herbs';

const SECTIONS = [
  {
    id: 'wiedza',
    label: 'Wiedza',
    placeholder: 'Szukaj księgi, biblioteki lub dziedziny',
    View: Knowledge,
  },
  {
    id: 'magia',
    label: 'Magia',
    placeholder: 'Wklej formę z gry, np. zamknietej smoczej szkatulce',
    View: Magics,
  },
  {
    id: 'klucze',
    label: 'Klucze',
    placeholder: 'Szukaj klucza',
    View: Keys,
  },
  {
    id: 'ziola',
    label: 'Zioła',
    placeholder: 'Szukaj po nazwie, wyglądzie lub działaniu',
    View: Herbs,
  },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

export default function App() {
  const [section, setSection] = useState<SectionId>('wiedza');
  const [query, setQuery] = useState('');
  const active = SECTIONS.find((s) => s.id === section)!;

  const goTo = (id: SectionId) => {
    setSection(id);
    setQuery('');
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__row">
          <h1 className="brand">Dane Arkadii</h1>
          <nav className="sections" aria-label="Zbiory danych">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="section-btn"
                aria-current={s.id === section}
                onClick={() => goTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder={active.placeholder}
        />
        <div className="topbar__pad" />
      </header>
      <main>
        <active.View key={active.id} query={query} />
      </main>
    </div>
  );
}
