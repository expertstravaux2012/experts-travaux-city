import { accuse } from '../data/rdv.ts';
import { site } from '../data/site.ts';
import { escapeHtml } from './rdv-mail.ts';
import type { RdvData } from './rdv-mail.ts';

// Un e-mail ne peut pas lire global.css : hex de la charte, dupliqués ici (texte ink sur stone/face-light >= 10:1, stone sur city 5,2:1).
const COLORS = { deep: '#1C1B1B', stone: '#FAF9F9', city: '#B24824', light: '#D9D6D1', ink: '#1C1B1B' } as const;

const FONT = 'Arial, Helvetica, sans-serif';
const RECAP_KEYS = ['motif', 'date', 'creneau'] as const;

const html = (s: string) => escapeHtml(s).replace(/\r?\n/g, '<br>');

function footerLines(): string[] {
  const { address, horaires, phone } = site;
  return [
    address ? `${address.street}, ${address.city}` : null,
    horaires?.length ? horaires.map((h) => `${h.jours} : ${h.horaires}`).join(' · ') : null,
    phone ? `Tél. ${phone.display}` : null,
  ].filter((l): l is string => !!l);
}

/** AAAA-MM-JJ -> jj/mm/aaaa ; valeur brute si le format ou la date est invalide. Sans fuseau. */
export function formatDateFr(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const jours = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  if (mo < 1 || mo > 12 || d < 1 || d > jours) return value;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/** Accusé de réception envoyé au visiteur. Ne reprend jamais le champ libre `message`. */
export function buildAccuse(d: RdvData): { Subject: string; TextPart: string; HTMLPart: string } {
  const a = accuse;
  const recap = RECAP_KEYS.map((k) => [a.recapLabels[k], k === 'date' ? formatDateFr(d[k]) : d[k]] as const).filter(([, v]) => v);
  const footer = footerLines();

  const text = [
    a.title,
    '',
    a.intro,
    '',
    ...(recap.length ? [a.recapTitle, ...recap.map(([l, v]) => `${l} : ${v}`), ''] : []),
    a.nextStepsTitle,
    a.nextSteps,
    ...(a.delai ? [a.delai] : []),
    '',
    `${a.button} : ${site.url}`,
    '',
    a.signature,
    '',
    ...footer,
    a.footerNote,
  ].join('\n');

  const p = (s: string, extra = '') => `<p style="margin:0 0 16px;font:16px/1.5 ${FONT};color:${COLORS.ink};${extra}">${s}</p>`;
  const h2 = (s: string) => `<h2 style="margin:0 0 8px;font:bold 16px/1.4 ${FONT};color:${COLORS.ink};">${html(s)}</h2>`;

  const recapHtml = recap.length
    ? `<tr><td style="padding:0 32px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.light};"><tr><td style="padding:16px 20px;">${h2(a.recapTitle)}${recap
        .map(([l, v]) => `<p style="margin:0 0 6px;font:15px/1.5 ${FONT};color:${COLORS.ink};"><strong>${html(l)}</strong> : ${html(v)}</p>`)
        .join('')}</td></tr></table></td></tr>`
    : '';

  const body = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${html(a.subject)}</title></head>
<body style="margin:0;padding:0;background:${COLORS.light};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${html(a.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.light};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${COLORS.stone};">
<tr><td style="background:${COLORS.deep};padding:20px 32px;font:bold 20px/1.2 ${FONT};color:${COLORS.stone};">${html(site.name)}</td></tr>
<tr><td style="padding:32px 32px 8px;"><h1 style="margin:0 0 16px;font:bold 24px/1.3 ${FONT};color:${COLORS.ink};">${html(a.title)}</h1>${p(html(a.intro))}</td></tr>
${recapHtml}
<tr><td style="padding:0 32px 8px;">${h2(a.nextStepsTitle)}${p(html(a.nextSteps), a.delai ? 'margin-bottom:8px;' : '')}${a.delai ? p(html(a.delai)) : ''}</td></tr>
<tr><td style="padding:8px 32px 24px;"><a href="${escapeHtml(site.url)}" style="display:inline-block;padding:14px 28px;background:${COLORS.city};color:${COLORS.stone};font:bold 16px/1.2 ${FONT};text-decoration:none;">${html(a.button)}</a></td></tr>
<tr><td style="padding:0 32px 32px;">${p(html(a.signature))}</td></tr>
<tr><td style="background:${COLORS.light};padding:20px 32px;font:13px/1.5 ${FONT};color:${COLORS.ink};">${footer.map((l) => `${html(l)}<br>`).join('')}<span style="display:block;margin-top:8px;">${html(a.footerNote)}</span></td></tr>
</table></td></tr></table></body></html>`;

  return { Subject: a.subject, TextPart: text, HTMLPart: body };
}
