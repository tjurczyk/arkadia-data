import React from 'react';

/** The MUD's own colour names, mapped to values that hold up on a dark ground. */
const ANSI: Record<string, string> = {
  grey: 'var(--ansi-grey)',
  reset: 'var(--ansi-grey)',
  olive_drab: 'var(--ansi-olive)',
  LimeGreen: 'var(--ansi-lime)',
  medium_turquoise: 'var(--ansi-turquoise)',
  tomato: 'var(--ansi-tomato)',
};

type Segment = { text: string; color: string };

export function parseEffect(effect: string): Segment[] {
  const segments: Segment[] = [];
  const tag = /<([^>]+)>/g;
  let last = 0;
  let color = ANSI.grey;
  let match: RegExpExecArray | null;

  while ((match = tag.exec(effect)) !== null) {
    if (match.index > last) {
      segments.push({ text: effect.slice(last, match.index), color });
    }
    color = ANSI[match[1]] || color;
    last = tag.lastIndex;
  }
  if (last < effect.length) {
    segments.push({ text: effect.slice(last), color });
  }
  return segments;
}

export type EffectToken = { token: string; color: string };

export function extractTokens(effect: string): EffectToken[] {
  return parseEffect(effect).flatMap((segment) =>
    segment.text
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => ({ token, color: segment.color }))
  );
}

export function renderEffect(effect: string) {
  return parseEffect(effect).map((segment, idx) => (
    <span key={idx} style={{ color: segment.color }}>
      {segment.text}
    </span>
  ));
}

/** Buffs first, then debuffs, then the plain-word effects. */
export function sortTokens(a: string, b: string): number {
  const rank = (t: string) => (t.startsWith('+') ? 0 : t.startsWith('-') ? 1 : 2);
  const ra = rank(a);
  const rb = rank(b);
  return ra === rb ? a.localeCompare(b, 'pl') : ra - rb;
}
