import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAccuse, formatDateFr } from './rdv-accuse.ts';
import { accuse } from '../data/rdv.ts';
import { parseRdv } from './rdv-mail.ts';
import type { RdvData } from './rdv-mail.ts';

const base = { nom: 'Ada', email: 'ada@exemple.fr', consent: true };
const data = (extra: Record<string, unknown> = {}) => (parseRdv({ ...base, ...extra }) as { data: RdvData }).data;

test('l’accusé échappe les valeurs injectées', () => {
  const a = buildAccuse(data({ motif: '<img src=x onerror=1>', date: '2026-12-01', creneau: 'a\nb' }));
  assert.doesNotMatch(a.HTMLPart, /<img/);
  assert.match(a.HTMLPart, /&lt;img src=x onerror=1&gt;/);
  assert.match(a.HTMLPart, /a<br>b/);
});

test('l’accusé ne reprend jamais le message libre', () => {
  const a = buildAccuse(data({ message: 'SECRET-LIBRE <b>x</b>' }));
  assert.doesNotMatch(a.HTMLPart + a.TextPart, /SECRET-LIBRE/);
});

test('les champs vides sont omis du récapitulatif', () => {
  const vide = buildAccuse(data());
  assert.doesNotMatch(vide.TextPart, /Votre demande\n/);
  const partiel = buildAccuse(data({ motif: 'Visite' }));
  assert.match(partiel.TextPart, /Visite/);
  assert.equal((partiel.TextPart.match(/ : /g) ?? []).length >= 1, true);
});

test('structure e-mail : preheader, bouton vers le site, sans CSS moderne', () => {
  const a = buildAccuse(data({ motif: 'Visite' }));
  assert.match(a.HTMLPart, /display:none[^>]*>Nous avons bien reçu/);
  assert.match(a.HTMLPart, /href="https:\/\/city\.experts-travaux\.fr"/);
  assert.doesNotMatch(a.HTMLPart, /var\(--|clip-path|@font-face/);
  assert.match(a.TextPart, /https:\/\/city\.experts-travaux\.fr/);
});

test('delai : affiché seulement s’il est renseigné', async () => {
  const { accuse } = await import('../data/rdv.ts');
  const init = accuse.delai;
  try {
    accuse.delai = null;
    assert.doesNotMatch(buildAccuse(data()).HTMLPart, /DELAI-TEST/);
    accuse.delai = 'DELAI-TEST <b>';
    const a = buildAccuse(data());
    assert.match(a.HTMLPart, /DELAI-TEST &lt;b&gt;/);
    assert.match(a.TextPart, /DELAI-TEST/);
  } finally {
    accuse.delai = init;
  }
});

test('date : affichée en jj/mm/aaaa', () => {
  const a = buildAccuse(data({ date: '2026-11-10' }));
  assert.match(a.TextPart, /10\/11\/2026/);
  assert.match(a.HTMLPart, /10\/11\/2026/);
  assert.doesNotMatch(a.TextPart, /2026-11-10/);
});

test('date invalide : valeur brute conservée', () => {
  assert.match(buildAccuse(data({ date: '2026-02-31' })).TextPart, /2026-02-31/);
  assert.match(buildAccuse(data({ date: 'demain' })).TextPart, /demain/);
  assert.equal(formatDateFr('2024-02-29'), '29/02/2024');
});

test('date vide : ligne omise', () => {
  const a = buildAccuse(data({ motif: 'Visite' }));
  assert.doesNotMatch(a.TextPart, new RegExp(`^${accuse.recapLabels.date} : `, 'm'));
});
