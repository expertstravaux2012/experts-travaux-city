import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createConsentStore } from './consent.ts';
import type { StorageLike } from './consent.ts';
import { consentStorageKey, consentTtlDays } from '../data/cookies.ts';

const DAY_MS = 86_400_000;

const memoryStorage = (): StorageLike & { has(key: string): boolean } => {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
    has: (key) => data.has(key),
  };
};

test('read renvoie null sans choix enregistré', () => {
  const store = createConsentStore(memoryStorage());
  assert.equal(store.read(), null);
});

test('write puis read restitue le choix', () => {
  const store = createConsentStore(memoryStorage());
  store.write({ 'mesure-audience': true });
  assert.deepEqual(store.read(), { 'mesure-audience': true });
});

test('write est idempotent : le dernier choix remplace le précédent', () => {
  const store = createConsentStore(memoryStorage());
  store.write({ 'mesure-audience': true });
  store.write({ 'mesure-audience': false });
  store.write({ 'mesure-audience': false });
  assert.deepEqual(store.read(), { 'mesure-audience': false });
});

test('read renvoie null et purge le choix expiré', () => {
  const storage = memoryStorage();
  let now = 1_000_000;
  const store = createConsentStore(storage, () => now);
  store.write({ 'mesure-audience': true });

  now += consentTtlDays * DAY_MS - 1;
  assert.deepEqual(store.read(), { 'mesure-audience': true });

  now += 1;
  assert.equal(store.read(), null);
  assert.equal(storage.has(consentStorageKey), false);
});

test('read ignore un contenu corrompu ou incomplet', () => {
  const storage = memoryStorage();
  const store = createConsentStore(storage);

  storage.setItem(consentStorageKey, '{pas du json');
  assert.equal(store.read(), null);

  storage.setItem(consentStorageKey, JSON.stringify({ v: 1, categories: {}, expiresAt: Date.now() + DAY_MS }));
  assert.equal(store.read(), null);

  storage.setItem(consentStorageKey, JSON.stringify({ v: 99, categories: { 'mesure-audience': true }, expiresAt: Date.now() + DAY_MS }));
  assert.equal(store.read(), null);
});

test('sans stockage disponible, read renvoie null et write ne lève pas', () => {
  const store = createConsentStore(null);
  assert.doesNotThrow(() => store.write({ 'mesure-audience': true }));
  assert.equal(store.read(), null);
});

test('un stockage qui lève ne casse ni read ni write', () => {
  const failing: StorageLike = {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('quota');
    },
    removeItem: () => {
      throw new Error('blocked');
    },
  };
  const store = createConsentStore(failing);
  assert.doesNotThrow(() => store.write({ 'mesure-audience': true }));
  assert.equal(store.read(), null);
});
