import React, { useState } from 'react';
import knowledgeData from '../../knowledge_data.json';
import magicsData from '../../magics_data.json';
import magicKeysData from '../../magic_keys.json';
import herbsData from '../../herbs_data.json';

type Book = {
  mianownik: string;
  categories: string[];
};

type Library = {
  location_id: string;
  name: string;
  categories: string[];
};

type KnowledgeData = {
  books: Record<string, Book>;
  libraries: Record<string, Library>;
};

type MagicsData = {
  magics: Record<string, { type: string[]; regexps: string[] }>;
};

type MagicKeysData = {
  magic_keys: string[];
};

type HerbsData = {
  herb_id_to_odmiana: Record<string, { mianownik: string }>;
  herb_id_to_use: Record<string, { action: string; effect: string }[]>;
};

const tagColors: Record<string, string> = {
  grey: 'grey',
  reset: 'grey',
  olive_drab: 'OliveDrab',
  LimeGreen: 'LimeGreen',
  medium_turquoise: 'MediumTurquoise',
  tomato: 'Tomato',
};

type EffectSegment = { text: string; color: string };

function parseEffect(effect: string): EffectSegment[] {
  const segments: EffectSegment[] = [];
  const regex = /<([^>]+)>/g;
  let last = 0;
  let color = tagColors.grey;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(effect)) !== null) {
    if (match.index > last) {
      segments.push({ text: effect.slice(last, match.index), color });
    }
    color = tagColors[match[1]] || color;
    last = regex.lastIndex;
  }
  if (last < effect.length) {
    segments.push({ text: effect.slice(last), color });
  }
  return segments;
}

type EffectToken = { token: string; color: string };

function extractTokens(effect: string): EffectToken[] {
  return parseEffect(effect).flatMap((seg) =>
    seg.text
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => ({ token: t, color: seg.color }))
  );
}

function renderEffect(effect: string) {
  return parseEffect(effect).map((seg, idx) => (
    <span key={idx} style={{ color: seg.color }}>
      {seg.text}
    </span>
  ));
}

function KnowledgeBrowser() {
  const data = knowledgeData as KnowledgeData;

  const allCategories = Array.from(
    new Set([
      ...Object.values(data.books).flatMap((b) => b.categories),
      ...Object.values(data.libraries).flatMap((l) => l.categories),
    ])
  ).sort();

  const [selected, setSelected] = useState<Set<string>>(new Set(allCategories));

  const toggleCategory = (category: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(category) ? next.delete(category) : next.add(category);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === allCategories.length ? new Set() : new Set(allCategories)
    );
  };

  const chosen = Array.from(selected);

  const books =
    chosen.length === 0
      ? []
      : Object.entries(data.books).filter(([_, book]) =>
          chosen.some((c) => book.categories.includes(c))
        );

  const libraries =
    chosen.length === 0
      ? []
      : Object.values(data.libraries).filter((lib) =>
          chosen.some((c) => lib.categories.includes(c))
        );

  return (
    <>
      <h1 className="mb-4">Przeglądarka wiedzy</h1>
      <div className="mb-3 d-flex flex-wrap gap-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="cat-all"
            checked={selected.size === allCategories.length}
            onChange={toggleAll}
          />
          <label className="form-check-label" htmlFor="cat-all">
            Wszystkie
          </label>
        </div>
        {allCategories.map((cat, idx) => (
          <div className="form-check" key={cat}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`cat-${idx}`}
              checked={selected.has(cat)}
              onChange={() => toggleCategory(cat)}
            />
            <label className="form-check-label" htmlFor={`cat-${idx}`}>
              {cat}
            </label>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-md-6">
          <h2>Książki</h2>
          <ul className="list-group">
            {books.map(([name, book]) => (
              <li key={name} className="list-group-item">
                <strong>{book.mianownik}</strong>
                <div className="text-muted">{book.categories.join(', ')}</div>
              </li>
            ))}
            {books.length === 0 && (
              <li className="list-group-item">Brak pasujących książek</li>
            )}
          </ul>
        </div>
        <div className="col-md-6">
          <h2>Biblioteki</h2>
          <ul className="list-group">
            {libraries.map((lib) => (
              <li key={lib.location_id} className="list-group-item">
                <strong>{lib.name}</strong>
                <ul className="text-muted small mb-0">
                  {lib.categories.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </li>
            ))}
            {libraries.length === 0 && (
              <li className="list-group-item">Brak pasujących bibliotek</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

function MagicsBrowser() {
  const data = magicsData as MagicsData;
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();

  const magics = Object.entries(data.magics).filter(
    ([name, magic]) =>
      name.toLowerCase().includes(q) ||
      magic.type.some((t) => t.toLowerCase().includes(q))
  );

  return (
    <>
      <h1 className="mb-4">Przeglądarka magii</h1>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Szukaj..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="list-group">
        {magics.map(([name, magic]) => (
          <li key={name} className="list-group-item">
            <strong>{name}</strong>
            {magic.type.length > 0 && (
              <div className="text-muted small">{magic.type.join(', ')}</div>
            )}
          </li>
        ))}
        {magics.length === 0 && (
          <li className="list-group-item">Brak wyników</li>
        )}
      </ul>
    </>
  );
}

function KeysBrowser() {
  const data = magicKeysData as MagicKeysData;
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();

  const keys = data.magic_keys.filter((k) => k.toLowerCase().includes(q));

  return (
    <>
      <h1 className="mb-4">Przeglądarka kluczy</h1>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Szukaj..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="list-group">
        {keys.map((k, idx) => (
          <li key={idx} className="list-group-item">
            {k}
          </li>
        ))}
        {keys.length === 0 && (
          <li className="list-group-item">Brak wyników</li>
        )}
      </ul>
    </>
  );
}

function HerbsBrowser() {
  const data = herbsData as HerbsData;

  const allEffects = Array.from(
    new Map(
      Object.values(data.herb_id_to_use).flatMap((uses) =>
        uses.flatMap((u) =>
          extractTokens(u.effect).map(({ token, color }) => [token, color] as const)
        )
      )
    ).entries()
  ).sort(([a], [b]) => {
    const order = (t: string) => (t.startsWith('+') ? 0 : t.startsWith('-') ? 1 : 2);
    const oa = order(a);
    const ob = order(b);
    return oa === ob ? a.localeCompare(b) : oa - ob;
  });

  const [selected, setSelected] = useState<Set<string>>(
    new Set(allEffects.map(([t]) => t))
  );

  const [query, setQuery] = useState('');
  const q = query.toLowerCase();

  const toggleEffect = (effect: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(effect) ? next.delete(effect) : next.add(effect);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === allEffects.length
        ? new Set()
        : new Set(allEffects.map(([t]) => t))
    );
  };

  const herbs = Object.keys(data.herb_id_to_use).filter((id) => {
    const matchesSelected =
      selected.size === 0 ||
      data.herb_id_to_use[id].some((u) =>
        extractTokens(u.effect).some((t) => selected.has(t.token))
      );
    if (!matchesSelected) return false;

    if (!q) return true;

    const name = data.herb_id_to_odmiana[id]?.mianownik || id;
    const description = data.herb_id_to_use[id]
      .map((u) => `${u.action} ${u.effect.replace(/<[^>]+>/g, '')}`)
      .join(' ')
      .toLowerCase();
    return (
      name.toLowerCase().includes(q) ||
      description.includes(q)
    );
  });

  return (
    <>
      <h1 className="mb-4">Przeglądarka ziół</h1>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Szukaj..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mb-3 d-flex flex-wrap gap-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="eff-all"
            checked={selected.size === allEffects.length}
            onChange={toggleAll}
          />
          <label className="form-check-label" htmlFor="eff-all">
            Wszystkie
          </label>
        </div>
        {allEffects.map(([eff, color], idx) => (
          <div className="form-check" key={eff}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`eff-${idx}`}
              checked={selected.has(eff)}
              onChange={() => toggleEffect(eff)}
            />
            <label
              className="form-check-label"
              htmlFor={`eff-${idx}`}
              style={{ color }}
            >
              {eff}
            </label>
          </div>
        ))}
      </div>
      <ul className="list-group">
        {herbs.map((id) => (
          <li key={id} className="list-group-item">
            <strong>{id}</strong>
            {data.herb_id_to_odmiana[id]?.mianownik && (
              <div className="text-muted small">
                {data.herb_id_to_odmiana[id]?.mianownik}
              </div>
            )}
            <ul className="text-muted small mb-0">
              {data.herb_id_to_use[id].map((u, idx) => (
                <li key={idx}>
                  {u.action}: {renderEffect(u.effect)}
                </li>
              ))}
            </ul>
          </li>
        ))}
        {herbs.length === 0 && (
          <li className="list-group-item">Brak wyników</li>
        )}
      </ul>
    </>
  );
}

export default function App() {
  const [view, setView] = useState<'knowledge' | 'magics' | 'keys' | 'herbs'>(
    'knowledge'
  );

  return (
    <div className="container py-4">
      <div className="btn-group mb-4" role="group">
        <button
          type="button"
          className={`btn btn-secondary${view === 'knowledge' ? ' active' : ''}`}
          onClick={() => setView('knowledge')}
        >
          Wiedza
        </button>
        <button
          type="button"
          className={`btn btn-secondary${view === 'magics' ? ' active' : ''}`}
          onClick={() => setView('magics')}
        >
          Magia
        </button>
        <button
          type="button"
          className={`btn btn-secondary${view === 'keys' ? ' active' : ''}`}
          onClick={() => setView('keys')}
        >
          Klucze
        </button>
        <button
          type="button"
          className={`btn btn-secondary${view === 'herbs' ? ' active' : ''}`}
          onClick={() => setView('herbs')}
        >
          Zioła
        </button>
      </div>
      {view === 'knowledge' && <KnowledgeBrowser />}
      {view === 'magics' && <MagicsBrowser />}
      {view === 'keys' && <KeysBrowser />}
      {view === 'herbs' && <HerbsBrowser />}
    </div>
  );
}
