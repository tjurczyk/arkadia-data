import React from 'react';

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="search">
      <span className="search__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        className="search__input"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="search__clear"
          type="button"
          onClick={() => onChange('')}
        >
          wyczyść
        </button>
      )}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  tint,
  mono,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tint?: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={mono ? 'chip chip--mono' : 'chip'}
      aria-pressed={active}
      onClick={onClick}
      style={tint ? ({ '--chip-tint': tint } as React.CSSProperties) : undefined}
    >
      {children}
    </button>
  );
}

export function FilterBar({
  label,
  shown,
  total,
  noun,
  children,
}: {
  label?: string;
  shown: number;
  total: number;
  noun: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="filterbar">
      <div className="filterbar__chips">
        {label && <span className="filterbar__label">{label}</span>}
        {children}
      </div>
      <span className="count">
        {shown === total ? `${total} ${noun}` : `${shown} z ${total}`}
      </span>
    </div>
  );
}

export function Empty({ query, hint }: { query: string; hint: string }) {
  return (
    <div className="empty">
      {query ? (
        <>
          Nic nie pasuje do <span className="empty__query">{query}</span>
        </>
      ) : (
        'Nic tu nie ma przy tych filtrach'
      )}
      <div className="empty__hint">{hint}</div>
    </div>
  );
}

/** Toggle helper shared by every filter bar. */
export function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}
