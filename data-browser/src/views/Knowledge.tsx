import React, { useMemo, useState } from 'react';
import knowledgeData from '../../../knowledge_data.json';
import type { KnowledgeData } from '../types';
import { Chip, Empty, FilterBar, toggle } from '../components/Controls';
import { fold, highlight, matches } from '../lib/search';

const data = knowledgeData as KnowledgeData;
const books = Object.values(data.books);
const libraries = Object.values(data.libraries);

const allCategories = [
  ...new Set([
    ...books.flatMap((b) => b.categories),
    ...libraries.flatMap((l) => l.categories),
  ]),
].sort((a, b) => a.localeCompare(b, 'pl'));

export default function Knowledge({ query }: { query: string }) {
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const q = fold(query.trim());

  const inCategories = (own: string[]) =>
    categories.size === 0 || own.some((c) => categories.has(c));

  const shownBooks = useMemo(
    () =>
      books.filter(
        (b) =>
          inCategories(b.categories) &&
          (matches(b.mianownik, q) || b.categories.some((c) => matches(c, q)))
      ),
    [q, categories]
  );

  const shownLibraries = useMemo(
    () =>
      libraries.filter(
        (l) =>
          inCategories(l.categories) &&
          (matches(l.name, q) || l.categories.some((c) => matches(c, q)))
      ),
    [q, categories]
  );

  const empty = shownBooks.length === 0 && shownLibraries.length === 0;

  return (
    <>
      <FilterBar
        label="dziedzina"
        shown={shownBooks.length + shownLibraries.length}
        total={books.length + libraries.length}
        noun="wpisów"
      >
        {allCategories.map((c) => (
          <Chip
            key={c}
            active={categories.has(c)}
            onClick={() => setCategories((prev) => toggle(prev, c))}
          >
            {c}
          </Chip>
        ))}
      </FilterBar>

      {empty ? (
        <Empty query={query} hint="Dziedziny łączą się sumą — wybierz kilka, żeby zobaczyć więcej." />
      ) : (
        <>
          {shownLibraries.length > 0 && (
            <>
              <h2 className="section-title">Biblioteki</h2>
              <div className="grid">
                {shownLibraries.map((lib) => (
                  <article className="card" key={lib.location_id}>
                    <h3 className="card__name">{highlight(lib.name, q)}</h3>
                    <ul className="taglist">
                      {lib.categories.map((c) => (
                        <li className="tag" key={c}>
                          {highlight(c, q)}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </>
          )}

          {shownBooks.length > 0 && (
            <>
              <h2 className="section-title">Księgi</h2>
              <div className="grid">
                {shownBooks.map((book) => (
                  <article className="card" key={book.mianownik}>
                    <h3 className="card__name">{highlight(book.mianownik, q)}</h3>
                    <ul className="taglist">
                      {book.categories.map((c) => (
                        <li className="tag" key={c}>
                          {highlight(c, q)}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
