import React, { useState } from 'react';
import knowledgeData from '../../knowledge_data.json';

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

const data = knowledgeData as KnowledgeData;

const allCategories = Array.from(
  new Set([
    ...Object.values(data.books).flatMap((b) => b.categories),
    ...Object.values(data.libraries).flatMap((l) => l.categories),
  ])
).sort();

export default function App() {
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
    <div className="container py-4">
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
    </div>
  );
}
