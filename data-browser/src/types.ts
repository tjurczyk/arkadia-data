export type Book = {
  mianownik: string;
  categories: string[];
};

export type Library = {
  location_id: string;
  name: string;
  categories: string[];
};

export type KnowledgeData = {
  books: Record<string, Book>;
  libraries: Record<string, Library>;
};

export type Magic = {
  type: string[];
  odmiana: Record<string, string[]>;
  dodatkowe_regexps?: string[];
};

export type MagicsData = {
  magics: Record<string, Magic>;
};

export type MagicKeysData = {
  magic_keys: string[];
};

export type HerbUse = {
  action: string;
  effect: string;
  smokable?: boolean;
  dont_bind?: boolean;
  don_bind?: boolean;
};

export type HerbsData = {
  herb_id_to_odmiana: Record<string, { mianownik: string }>;
  herb_id_to_use: Record<string, HerbUse[]>;
};
