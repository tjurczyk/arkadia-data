import React, { useMemo } from 'react';
import magicKeysData from '../../../magic_keys.json';
import type { MagicKeysData } from '../types';
import { Empty, FilterBar } from '../components/Controls';
import { fold, highlight, matches } from '../lib/search';

const data = magicKeysData as MagicKeysData;

export default function Keys({ query }: { query: string }) {
  const q = fold(query.trim());

  const shown = useMemo(
    () => data.magic_keys.filter((k) => matches(k, q)),
    [q]
  );

  return (
    <>
      <FilterBar shown={shown.length} total={data.magic_keys.length} noun="form" />

      {shown.length === 0 ? (
        <Empty query={query} hint="Lista zawiera każdą odmienioną formę osobno." />
      ) : (
        <ul className="keys">
          {shown.map((key, idx) => (
            <li className="keys__item" key={`${key}-${idx}`}>
              {highlight(key, q)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
