import React, { useMemo, useState } from 'react';
import herbsData from '../../../herbs_data.json';
import type { HerbsData, HerbUse } from '../types';
import { Chip, Empty, FilterBar, toggle } from '../components/Controls';
import { extractTokens, renderEffect, sortTokens } from '../lib/effects';
import { fold, highlight, matches } from '../lib/search';

const data = herbsData as HerbsData;
const ids = Object.keys(data.herb_id_to_use);

const tokenColors = new Map<string, string>();
for (const uses of Object.values(data.herb_id_to_use)) {
  for (const use of uses) {
    for (const { token, color } of extractTokens(use.effect)) {
      if (!tokenColors.has(token)) tokenColors.set(token, color);
    }
  }
}
const allTokens = [...tokenColors.keys()].sort(sortTokens);

function plainText(uses: HerbUse[]): string {
  return uses.map((u) => `${u.action} ${u.effect.replace(/<[^>]+>/g, '')}`).join(' ');
}

function Use({ use }: { use: HerbUse }) {
  // dont_bind tells the script to skip this use when it binds click actions,
  // so in Mudlet the line stays plain text.
  const noAction = use.dont_bind || use.don_bind;
  return (
    <li className="use">
      <span className="use__action">{use.action}</span>
      <span className="use__effect">{renderEffect(use.effect)}</span>
      {use.smokable && <span className="flag">do palenia</span>}
      {noAction && (
        <span className="flag" title="Skrypt nie podpina akcji pod kliknięcie">
          bez akcji
        </span>
      )}
    </li>
  );
}

export default function Herbs({ query }: { query: string }) {
  const [effects, setEffects] = useState<Set<string>>(new Set());
  const q = fold(query.trim());

  const shown = useMemo(
    () =>
      ids.filter((id) => {
        const uses = data.herb_id_to_use[id];
        if (
          effects.size > 0 &&
          !uses.some((u) => extractTokens(u.effect).some((t) => effects.has(t.token)))
        ) {
          return false;
        }
        if (!q) return true;
        const name = data.herb_id_to_odmiana[id]?.mianownik ?? '';
        return matches(id, q) || matches(name, q) || matches(plainText(uses), q);
      }),
    [q, effects]
  );

  return (
    <>
      <FilterBar label="działanie" shown={shown.length} total={ids.length} noun="ziół">
        {allTokens.map((token) => (
          <Chip
            key={token}
            mono
            active={effects.has(token)}
            tint={tokenColors.get(token)}
            onClick={() => setEffects((prev) => toggle(prev, token))}
          >
            {token}
          </Chip>
        ))}
      </FilterBar>

      {shown.length === 0 ? (
        <Empty query={query} hint="Wybierz działanie powyżej albo szukaj po nazwie zioła." />
      ) : (
        <div className="grid">
          {shown.map((id) => (
            <article className="card" key={id}>
              <h3 className="card__name">{highlight(id, q)}</h3>
              {data.herb_id_to_odmiana[id]?.mianownik && (
                <div className="card__meta card__meta--game">
                  {highlight(data.herb_id_to_odmiana[id].mianownik, q)}
                </div>
              )}
              <ul className="uses card__body">
                {data.herb_id_to_use[id].map((use, idx) => (
                  <Use use={use} key={idx} />
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
