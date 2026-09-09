import type { Magic } from '../types';

/** The 34 raw types collapse into the five things a player actually sorts by. */
export type Family = 'bron' | 'pancerz' | 'ozdoby' | 'pojemniki' | 'inne';

export const FAMILIES: { id: Family; label: string; color: string }[] = [
  { id: 'bron', label: 'broń', color: 'var(--family-weapon)' },
  { id: 'pancerz', label: 'pancerz', color: 'var(--family-armour)' },
  { id: 'ozdoby', label: 'ozdoby', color: 'var(--family-worn)' },
  { id: 'pojemniki', label: 'pojemniki', color: 'var(--family-container)' },
  { id: 'inne', label: 'inne', color: 'var(--family-other)' },
];

const WORN = [
  'bransoleta',
  'broszka',
  'diadem',
  'kolczyk',
  'naszyjnik',
  'opaska',
  'pas',
  'pierscien',
];

const ARMOUR = [
  'buty',
  'ciezka zbroja',
  'helm',
  'lekka zbroja',
  'naramienniki',
  'plaszcz',
  'srednia zbroja',
  'tarcza',
];

const CONTAINERS = ['plecak', 'pojemnik'];

function familyOfType(type: string): Family {
  if (WORN.includes(type)) return 'ozdoby';
  if (ARMOUR.includes(type)) return 'pancerz';
  if (CONTAINERS.includes(type)) return 'pojemniki';
  if (/miecz|topor|mlot|maczuga|sztylet|bron drzewcowa/.test(type)) return 'bron';
  return 'inne';
}

export function familyOf(magic: Magic): Family {
  return familyOfType(magic.type[0] ?? 'inne');
}

export function familyColor(family: Family): string {
  return FAMILIES.find((f) => f.id === family)!.color;
}

/** The data keys are ASCII, the way the MUD writes them. The labels are not. */
export const CASE_LABELS: Record<string, string> = {
  mianownik: 'mianownik',
  dopelniacz: 'dopełniacz',
  celownik: 'celownik',
  biernik: 'biernik',
  narzednik: 'narzędnik',
  miejscownik: 'miejscownik',
};

export const CASE_ORDER = [
  'mianownik',
  'dopelniacz',
  'celownik',
  'biernik',
  'narzednik',
  'miejscownik',
];

export function allForms(magic: Magic): string[] {
  return [
    ...Object.values(magic.odmiana).flat(),
    ...(magic.dodatkowe_regexps || []),
  ];
}
