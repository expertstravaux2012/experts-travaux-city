import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clientIp, extractToken, verifyTurnstile } from './turnstile.ts';

const reply = (body: unknown, status = 200) => (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
const ok = reply({ success: true, action: 'rdv', hostname: 'city.experts-travaux.fr' });
const prod = { TURNSTILE_SECRET_KEY: 's', VERCEL_ENV: 'production' };

test('extractToken', () => {
  assert.equal(extractToken({ turnstileToken: ' abc ' }), 'abc');
  assert.equal(extractToken({}), '');
  assert.equal(extractToken({ turnstileToken: 42 }), '');
  assert.equal(extractToken({ turnstileToken: 'x'.repeat(2049) }), '');
  assert.equal(extractToken(null), '');
});

test('clientIp prend la première adresse', () => {
  assert.equal(clientIp('1.2.3.4, 5.6.7.8'), '1.2.3.4');
  assert.equal(clientIp(null), '');
});

test('jeton manquant refusé sans appeler Cloudflare', async () => {
  const f = (async () => assert.fail('appel inattendu')) as typeof fetch;
  assert.deepEqual(await verifyTurnstile('', '', prod, f), { ok: false, reason: 'missing_token' });
});

test('siteverify ok, ko, HTTP en erreur', async () => {
  assert.deepEqual(await verifyTurnstile('t', '1.2.3.4', prod, ok), { ok: true });
  assert.deepEqual(await verifyTurnstile('t', '', prod, reply({ success: false })), { ok: false, reason: 'rejected' });
  assert.deepEqual(await verifyTurnstile('t', '', prod, reply({}, 500)), { ok: false, reason: 'unreachable' });
});

test('siteverify reçoit secret, jeton et remoteip', async () => {
  let sent: URLSearchParams | undefined;
  const f = (async (_u: unknown, init: RequestInit) => {
    sent = init.body as URLSearchParams;
    return new Response('{"success":true,"action":"rdv","hostname":"city.experts-travaux.fr"}');
  }) as unknown as typeof fetch;
  await verifyTurnstile('tok', '1.2.3.4', prod, f);
  assert.equal(sent?.get('secret'), 's');
  assert.equal(sent?.get('response'), 'tok');
  assert.equal(sent?.get('remoteip'), '1.2.3.4');
});

test('délai dépassé ou erreur réseau : refus', async () => {
  const hang = ((_u: unknown, init: RequestInit) =>
    new Promise((_, reject) => init.signal?.addEventListener('abort', () => reject(new Error('timeout'))))) as unknown as typeof fetch;
  assert.deepEqual(await verifyTurnstile('t', '', prod, hang, 20), { ok: false, reason: 'unreachable' });
  const boom = (async () => { throw new Error('net'); }) as typeof fetch;
  assert.deepEqual(await verifyTurnstile('t', '', prod, boom), { ok: false, reason: 'unreachable' });
});

test('secret absent : toléré seulement en développement', async () => {
  const refused = { ok: false, reason: 'no_secret' };
  assert.deepEqual(await verifyTurnstile('t', '', { VERCEL_ENV: 'production' }), refused);
  assert.deepEqual(await verifyTurnstile('', '', { VERCEL_ENV: 'preview' }), refused);
  assert.deepEqual(await verifyTurnstile('', '', { NODE_ENV: 'production' }), refused);
  assert.deepEqual(await verifyTurnstile('', '', { VERCEL_ENV: 'development' }), { ok: true });
  assert.deepEqual(await verifyTurnstile('', '', {}), { ok: true });
});

test('action et hostname contrôlés', async () => {
  const r = (action: unknown, hostname: unknown) => reply({ success: true, action, hostname });
  const bad = { ok: false, reason: 'rejected' };
  assert.deepEqual(await verifyTurnstile('t', '', prod, r('autre', 'city.experts-travaux.fr')), bad);
  assert.deepEqual(await verifyTurnstile('t', '', prod, r(undefined, 'city.experts-travaux.fr')), bad);
  assert.deepEqual(await verifyTurnstile('t', '', prod, r('rdv', 'evil.example')), bad);
  assert.deepEqual(await verifyTurnstile('t', '', prod, r('rdv', undefined)), bad);
  assert.deepEqual(await verifyTurnstile('t', '', prod, r('rdv', 'x-preview.vercel.app')), bad);
});

test('localhost accepté en développement seulement', async () => {
  const local = reply({ success: true, action: 'rdv', hostname: 'localhost' });
  assert.deepEqual(await verifyTurnstile('t', '', { TURNSTILE_SECRET_KEY: 's', VERCEL_ENV: 'development' }, local), { ok: true });
  assert.deepEqual(await verifyTurnstile('t', '', { TURNSTILE_SECRET_KEY: 's' }, reply({ success: true, action: 'rdv', hostname: '127.0.0.1' })), { ok: true });
  assert.deepEqual(await verifyTurnstile('t', '', prod, local), { ok: false, reason: 'rejected' });
  assert.deepEqual(await verifyTurnstile('t', '', { TURNSTILE_SECRET_KEY: 's', VERCEL_ENV: 'preview' }, local), { ok: false, reason: 'rejected' });
  assert.deepEqual(await verifyTurnstile('t', '', { TURNSTILE_SECRET_KEY: 's', NODE_ENV: 'production' }, local), { ok: false, reason: 'rejected' });
});
