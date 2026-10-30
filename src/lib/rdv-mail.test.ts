import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMailjetPayload, escapeHtml, isAllowedOrigin, parseRdv, sendRdvMail } from './rdv-mail.ts';
import type { MailEnv, RdvData } from './rdv-mail.ts';

const env: MailEnv = { MAILJET_API_KEY: 'k', MAILJET_API_SECRET: 's', MAILJET_SENDER_EMAIL: 'noreply@exemple.fr' };
const valid = { nom: 'Ada', email: 'ada@exemple.fr', tel: '0600000000', motif: 'Visite', consent: true, website: '' };
const ok = (input: unknown) => {
  const r = parseRdv(input);
  assert.equal(r.kind, 'ok');
  return (r as { data: RdvData }).data;
};

test('parseRdv accepte une demande valide', () => {
  assert.equal(ok(valid).nom, 'Ada');
});

test('parseRdv refuse nom, email ou consentement manquants', () => {
  for (const patch of [{ nom: ' ' }, { email: 'pas-un-mail' }, { consent: false }]) {
    const r = parseRdv({ ...valid, ...patch });
    assert.equal(r.kind, 'invalid');
  }
});

test('parseRdv refuse les valeurs trop longues ou non textuelles', () => {
  assert.equal(parseRdv({ ...valid, message: 'x'.repeat(3001) }).kind, 'invalid');
  assert.equal(parseRdv({ ...valid, tel: 42 }).kind, 'invalid');
  assert.equal(parseRdv(null).kind, 'invalid');
});

test('parseRdv détecte le champ piège', () => {
  assert.equal(parseRdv({ ...valid, website: 'http://spam' }).kind, 'spam');
});

test('isAllowedOrigin', () => {
  assert.equal(isAllowedOrigin('https://city.experts-travaux.fr', 'x'), true);
  for (const o of [
    'https://experts-travaux-city-abc123-experts-travaux.vercel.app',
    'https://experts-travaux-city-git-main-experts-travaux.vercel.app',
  ]) assert.equal(isAllowedOrigin(o, 'x'), true);
  for (const o of [
    'https://autre-projet-experts-travaux.vercel.app',
    'https://experts-travaux-city-x-autreequipe.vercel.app',
    'https://evil.vercel.app',
    'https://experts-travaux-city-abc-experts-travaux.vercel.app.evil.com',
    'http://experts-travaux-city-abc123-experts-travaux.vercel.app',
  ]) assert.equal(isAllowedOrigin(o, 'x'), false);
  assert.equal(isAllowedOrigin('https://autre.fr', 'autre.fr'), true);
  assert.equal(isAllowedOrigin('https://evil.fr', 'city.experts-travaux.fr'), false);
  assert.equal(isAllowedOrigin(null, 'x'), false);
  assert.equal(isAllowedOrigin('pas une url', 'x'), false);
});

test('le message retire CR/LF des en-têtes et échappe le HTML', () => {
  const d = ok({ ...valid, nom: 'Ada\r\nBcc: x@y.fr', email: 'ada@exemple.fr', message: '<script>a</script>\nligne' });
  const m = buildMailjetPayload(d, env).Messages[0]!;
  assert.doesNotMatch(m.Subject, /[\r\n]/);
  assert.match(m.Subject, /^Demande de rendez-vous — Ada Bcc: x@y\.fr$/);
  assert.doesNotMatch(m.HTMLPart, /<script>/);
  assert.match(m.HTMLPart, /&lt;script&gt;/);
  assert.equal(m.ReplyTo.Email, 'ada@exemple.fr');
  assert.equal(m.From.Email, 'noreply@exemple.fr');
  assert.equal(m.To[0]!.Email, 'contact@experts-travaux.fr');
});

test('RDV_TO_EMAIL remplace le destinataire par défaut', () => {
  const m = buildMailjetPayload(ok(valid), { ...env, RDV_TO_EMAIL: 'autre@exemple.fr' }).Messages[0]!;
  assert.equal(m.To[0]!.Email, 'autre@exemple.fr');
});

test('sendRdvMail appelle Mailjet avec auth Basic (fetch simulé)', async () => {
  const calls: { url: string; init: RequestInit }[] = [];
  const fake = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response('{}', { status: 200 });
  }) as unknown as typeof fetch;
  assert.equal(await sendRdvMail(ok(valid), env, fake), true);
  assert.equal(calls[0]!.url, 'https://api.mailjet.com/v3.1/send');
  const auth = (calls[0]!.init.headers as Record<string, string>).Authorization;
  assert.equal(auth, `Basic ${Buffer.from('k:s').toString('base64')}`);
});

test('sendRdvMail renvoie false sur échec Mailjet, erreur réseau ou env incomplet', async () => {
  const fail = (async () => new Response('{}', { status: 401 })) as unknown as typeof fetch;
  const boom = (async () => { throw new Error('réseau'); }) as unknown as typeof fetch;
  assert.equal(await sendRdvMail(ok(valid), env, fail), false);
  assert.equal(await sendRdvMail(ok(valid), env, boom), false);
  assert.equal(await sendRdvMail(ok(valid), {}, fail), false);
});

test('escapeHtml', () => {
  assert.equal(escapeHtml(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
});
