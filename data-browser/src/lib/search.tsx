import React from 'react';

const DIACRITICS: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

/**
 * Lowercase and strip Polish diacritics, one character in, one character out -
 * indices stay valid so a match can be highlighted in the original string.
 * The data is written without diacritics (the MUD emits it that way), but
 * people type with them.
 */
export function fold(text: string): string {
  return text.toLowerCase().replace(/[ąćęłńóśźż]/g, (c) => DIACRITICS[c]);
}

export function matches(text: string, foldedQuery: string): boolean {
  return foldedQuery === '' || fold(text).includes(foldedQuery);
}

/** Renders `text`, wrapping every occurrence of the query so it stands out. */
export function highlight(text: string, foldedQuery: string) {
  if (!foldedQuery) return text;

  const haystack = fold(text);
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (;;) {
    const at = haystack.indexOf(foldedQuery, cursor);
    if (at === -1) break;
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(
      <mark className="hit" key={at}>
        {text.slice(at, at + foldedQuery.length)}
      </mark>
    );
    cursor = at + foldedQuery.length;
  }

  if (parts.length === 0) return text;
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}
