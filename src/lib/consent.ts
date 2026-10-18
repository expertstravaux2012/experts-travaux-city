import { consentStorageKey, consentTtlDays, optionalCategoryIds } from '../data/cookies.ts';
import type { ConsentCategory } from '../data/cookies.ts';

export type ConsentChoice = Record<ConsentCategory, boolean>;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const CONSENT_EVENT = 'consent:change';

const DAY_MS = 86_400_000;
const STORAGE_VERSION = 1;

const isChoice = (value: unknown): value is ConsentChoice =>
  typeof value === 'object' &&
  value !== null &&
  optionalCategoryIds.every((id) => typeof (value as Record<string, unknown>)[id] === 'boolean');

const attempt = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

/** Store pur : le stockage et l'horloge sont injectés (testable sans navigateur). */
export function createConsentStore(storage: StorageLike | null, now: () => number = Date.now) {
  return {
    read(): ConsentChoice | null {
      if (!storage) return null;
      return attempt<ConsentChoice | null>(() => {
        const raw = storage.getItem(consentStorageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const valid =
          parsed?.v === STORAGE_VERSION &&
          typeof parsed.expiresAt === 'number' &&
          parsed.expiresAt > now() &&
          isChoice(parsed.categories);
        if (!valid) {
          storage.removeItem(consentStorageKey);
          return null;
        }
        return parsed.categories;
      }, null);
    },
    write(categories: ConsentChoice): void {
      if (!storage) return;
      attempt(
        () =>
          storage.setItem(
            consentStorageKey,
            JSON.stringify({ v: STORAGE_VERSION, categories, expiresAt: now() + consentTtlDays * DAY_MS }),
          ),
        undefined,
      );
    },
  };
}

// --- API navigateur -------------------------------------------------------

let store: ReturnType<typeof createConsentStore> | undefined;
/** Dernier choix de la session : couvre un localStorage indisponible. */
let sessionChoice: ConsentChoice | null = null;

const getStore = () => {
  if (!store) {
    store = createConsentStore(attempt<StorageLike | null>(() => window.localStorage, null));
  }
  return store;
};

export const getConsent = (): ConsentChoice | null => sessionChoice ?? getStore().read();

export function setConsent(choice: ConsentChoice): void {
  sessionChoice = choice;
  getStore().write(choice);
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: choice }));
}

export function setAllConsent(granted: boolean): void {
  setConsent(Object.fromEntries(optionalCategoryIds.map((id) => [id, granted])) as ConsentChoice);
}

/** Exécute `callback` une seule fois, dès que `category` est accordée (immédiatement si déjà le cas). */
export function onConsent(category: ConsentCategory, callback: () => void): void {
  let done = false;
  const run = () => {
    if (done || !getConsent()?.[category]) return;
    done = true;
    callback();
  };
  run();
  window.addEventListener(CONSENT_EVENT, run);
}
