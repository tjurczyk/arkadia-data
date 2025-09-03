import React, { useState } from 'react';
import knowledgeData from '../../knowledge_data.json';

type Book = {
  mianownik: string;
  categories: string[];
};

type Library = {
  location_id: number;
  name: string;
  categories: string[];
};

type KnowledgeData = {
  books: Record<string, Book>;
  libraries: Record<string, Library>;
};

const data = knowledgeData as KnowledgeData;

export default function App() {
  const [query, setQuery] = useState('');

  const search = query.trim().toLowerCase();

  const books = Object.entries(data.books).filter(([_, book]) =>
    book.categories.some((c) => c.toLowerCase().includes(search))
  );

  const libraries = Object.values(data.libraries).filter((lib) =>
    lib.categories.some((c) => c.toLowerCase().includes(search))
  );

  return (
    <div className="container">
      <h1 className="mb-4">Knowledge Data Browser</h1>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="row">
        <div className="col-md-6">
          <h2>Books</h2>
          <ul className="list-group">
            {books.map(([name, book]) => (
              <li key={name} className="list-group-item">
                <strong>{book.mianownik}</strong>
                <div className="text-muted">{book.categories.join(', ')}</div>
              </li>
            ))}
            {books.length === 0 && (
              <li className="list-group-item">No matching books</li>
            )}
          </ul>
        </div>
        <div className="col-md-6">
          <h2>Libraries</h2>
          <ul className="list-group">
            {libraries.map((lib) => (
              <li key={lib.location_id} className="list-group-item">
                <strong>{lib.name}</strong>
                <div className="text-muted">{lib.categories.join(', ')}</div>
              </li>
            ))}
            {libraries.length === 0 && (
              <li className="list-group-item">No matching libraries</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
