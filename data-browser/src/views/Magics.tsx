import React, { useMemo, useState } from 'react';
import magicsData from '../../../magics_data_v3.json';
import type { Magic, MagicsData } from '../types';
import { Chip, Empty, FilterBar, toggle } from '../components/Controls';
import { fold, highlight, matches } from '../lib/search';
import {
  allForms,
  CASE_LABELS,
  CASE_ORDER,
  FAMILIES,
  familyColor,
  familyOf,
  type Family,
} from '../lib/magics';

const data = magicsData as MagicsData;
const entries = Object.entries(data.magics);

function Paradigm({ magic, q }: { magic: Magic; q: string }) {
  const rows = (prefix: '' | 'mnoga_') =>
    CASE_ORDER.map((c) => [c, magic.odmiana[prefix + c]] as const).filter(
      ([, forms]) => forms && forms.length > 0
    );

  const singular = rows('');
  const plural = rows('mnoga_');

  const block = (list: ReturnType<typeof rows>) => (
    <div className="paradigm">
      {list.map(([c, forms]) => (
        <React.Fragment key={c}>
          <div className="paradigm__case">{CASE_LABELS[c]}</div>
          <ul className="paradigm__forms">
            {forms!.map((f) => (
              <li className="paradigm__form" key={f}>
                {highlight(f, q)}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      {singular.length > 0 && block(singular)}
      {plural.length > 0 && (
        <>
          <div className="paradigm-break">liczba mnoga</div>
          {block(plural)}
        </>
      )}
      {magic.dodatkowe_regexps && (
        <>
          <div className="paradigm-break">inne formy</div>
          <ul className="paradigm__forms" style={{ borderLeft: 'none', paddingLeft: 0 }}>
            {magic.dodatkowe_regexps.map((f) => (
              <li className="paradigm__form" key={f}>
                {highlight(f, q)}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default function Magics({ query }: { query: string }) {
  const [families, setFamilies] = useState<Set<Family>>(new Set());
  const q = fold(query.trim());

  const shown = useMemo(
    () =>
      entries.filter(([name, magic]) => {
        if (families.size > 0 && !families.has(familyOf(magic))) return false;
        if (!q) return true;
        return (
          matches(name, q) ||
          magic.type.some((t) => matches(t, q)) ||
          allForms(magic).some((f) => matches(f, q))
        );
      }),
    [q, families]
  );

  return (
    <>
      <FilterBar label="rodzaj" shown={shown.length} total={entries.length} noun="przedmiotów">
        {FAMILIES.map((f) => (
          <Chip
            key={f.id}
            active={families.has(f.id)}
            tint={f.color}
            onClick={() => setFamilies((prev) => toggle(prev, f.id))}
          >
            {f.label}
          </Chip>
        ))}
      </FilterBar>

      {shown.length === 0 ? (
        <Empty query={query} hint="Szukanie obejmuje nazwę, rodzaj i każdą odmienioną formę." />
      ) : (
        <div className="grid">
          {shown.map(([name, magic]) => (
            <article
              className="card card--spined"
              key={name}
              style={{ '--spine': familyColor(familyOf(magic)) } as React.CSSProperties}
            >
              <h3 className="card__name">{highlight(name, q)}</h3>
              <div className="card__meta">{magic.type.join(', ')}</div>
              <div className="card__body">
                <Paradigm magic={magic} q={q} />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
