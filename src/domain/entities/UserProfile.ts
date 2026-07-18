/**
 * UserProfile — o que o Companion sabe sobre a pessoa.
 *
 * Existe desde o MVP para que o restante do sistema possa referenciá-lo
 * (por exemplo, `CompanionContext.profile`). A maioria dos campos fica
 * vazia nesta versão e será preenchida por eventos futuros de memória.
 */
export interface UserPreferences {
  // Reservado. Ex.: tom preferido, horário de check-in, idioma.
  [key: string]: unknown;
}

export interface KnownFact {
  id: string;
  content: string;
  createdAt: string; // ISO 8601
}

export interface UserProfile {
  id: string;
  name?: string;
  identity?: string; // como a pessoa se descreve
  preferences: UserPreferences;
  knownFacts: KnownFact[];
}

export function createEmptyProfile(id: string): UserProfile {
  return {
    id,
    preferences: {},
    knownFacts: [],
  };
}
