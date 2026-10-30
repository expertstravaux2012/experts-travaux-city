import { site } from '../data/site.ts';

export const MAX_BODY_BYTES = 10_000;
const MAILJET_URL = 'https://api.mailjet.com/v3.1/send';
// Prévisualisations Vercel de ce projet (projet experts-travaux-city, équipe experts-travaux).
const VERCEL_PREVIEW_HOST = /^experts-travaux-city(-[a-z0-9-]+)?-experts-travaux\.vercel\.app$/;
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

const LIMITS = { nom: 120, email: 254, tel: 40, motif: 120, date: 20, creneau: 60, message: 3000, source: 60, page: 200 } as const;
type Field = keyof typeof LIMITS;

export interface RdvData extends Record<Field, string> {}

export interface MailEnv {
  MAILJET_API_KEY?: string;
  MAILJET_API_SECRET?: string;
  MAILJET_SENDER_EMAIL?: string;
  RDV_TO_EMAIL?: string;
}

export type ParseResult =
  | { kind: 'ok'; data: RdvData }
  | { kind: 'spam' }
  | { kind: 'invalid'; fields: string[] };

const oneLine = (s: string) => s.replace(/[\r\n\u2028\u2029]+/g, ' ').trim();

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function parseRdv(input: unknown): ParseResult {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return { kind: 'invalid', fields: ['body'] };
  const raw = input as Record<string, unknown>;
  if (typeof raw.website === 'string' ? raw.website.trim() !== '' : raw.website != null && raw.website !== false) {
    return { kind: 'spam' };
  }

  const invalid: string[] = [];
  const data = {} as RdvData;
  for (const key of Object.keys(LIMITS) as Field[]) {
    const v = raw[key];
    const str = typeof v === 'string' ? v : '';
    if (v != null && typeof v !== 'string') invalid.push(key);
    if (str.length > LIMITS[key]) invalid.push(key);
    data[key] = str.trim();
  }
  const consent = raw.consent === true || raw.consent === 'on' || raw.consent === 'true';
  if (!data.nom) invalid.push('nom');
  if (!EMAIL_RE.test(data.email)) invalid.push('email');
  if (!consent) invalid.push('consent');
  return invalid.length ? { kind: 'invalid', fields: [...new Set(invalid)] } : { kind: 'ok', data };
}

/** Origine acceptée : domaine du site, hôte de la requête, ou preview Vercel. */
export function isAllowedOrigin(origin: string | null, host: string | null): boolean {
  if (!origin) return false;
  let u: URL;
  try {
    u = new URL(origin);
  } catch {
    return false;
  }
  const h = u.host;
  return (
    h === new URL(site.url).host ||
    h === host ||
    (u.protocol === 'https:' && VERCEL_PREVIEW_HOST.test(h))
  );
}

const ROWS: [string, Field][] = [
  ['Nom', 'nom'],
  ['E-mail', 'email'],
  ['Téléphone', 'tel'],
  ['Motif', 'motif'],
  ['Date souhaitée', 'date'],
  ['Créneau', 'creneau'],
  ['Message', 'message'],
  ['Page', 'page'],
];

export function buildMailjetPayload(d: RdvData, env: MailEnv) {
  const nom = oneLine(d.nom);
  const rows = ROWS.map(([label, key]) => [label, d[key]] as const).filter(([, v]) => v);
  const text = rows.map(([l, v]) => `${l} : ${v}`).join('\n');
  const html = `<table>${rows
    .map(([l, v]) => `<tr><th align="left" valign="top">${escapeHtml(l)}</th><td>${escapeHtml(v).replace(/\r?\n/g, '<br>')}</td></tr>`)
    .join('')}</table>`;
  return {
    Messages: [
      {
        From: { Email: env.MAILJET_SENDER_EMAIL, Name: site.name },
        To: [{ Email: env.RDV_TO_EMAIL || site.email }],
        ReplyTo: { Email: oneLine(d.email), Name: nom },
        Subject: `Demande de rendez-vous — ${nom}`,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  };
}

export async function sendRdvMail(d: RdvData, env: MailEnv, fetchImpl: typeof fetch = fetch): Promise<boolean> {
  const { MAILJET_API_KEY: key, MAILJET_API_SECRET: secret, MAILJET_SENDER_EMAIL: sender } = env;
  if (!key || !secret || !sender) return false;
  try {
    const res = await fetchImpl(MAILJET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`,
      },
      body: JSON.stringify(buildMailjetPayload(d, env)),
    });
    return res.ok;
  } catch {
    return false;
  }
}
