import { site } from '../data/site.ts';

export const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
export const TURNSTILE_TIMEOUT_MS = 4000;
const MAX_TOKEN_LENGTH = 2048;
export const TURNSTILE_ACTION = 'rdv';
const LOCAL_HOSTS = ['localhost', '127.0.0.1'];

export interface TurnstileEnv {
  TURNSTILE_SECRET_KEY?: string;
  VERCEL_ENV?: string;
  NODE_ENV?: string;
}

/** Contexte de développement : Vercel `development`, ou hors Vercel sans NODE_ENV=production. */
function isDevContext(env: TurnstileEnv): boolean {
  return env.VERCEL_ENV === 'development' || (env.VERCEL_ENV === undefined && env.NODE_ENV !== 'production');
}

export type TurnstileResult = { ok: true } | { ok: false; reason: 'missing_token' | 'no_secret' | 'rejected' | 'unreachable' };

export function extractToken(body: unknown): string {
  if (typeof body !== 'object' || body === null) return '';
  const t = (body as Record<string, unknown>).turnstileToken;
  return typeof t === 'string' && t.length <= MAX_TOKEN_LENGTH ? t.trim() : '';
}

function isAllowedHostname(hostname: unknown, env: TurnstileEnv): boolean {
  if (typeof hostname !== 'string') return false;
  if (hostname === new URL(site.url).hostname) return true;
  return isDevContext(env) && LOCAL_HOSTS.includes(hostname);
}

/** Première adresse de x-forwarded-for, ou chaîne vide. */
export function clientIp(forwardedFor: string | null): string {
  return forwardedFor?.split(',')[0]?.trim() ?? '';
}

/**
 * Vérifie le jeton Turnstile auprès de Cloudflare.
 * Secret absent : refus (fail closed) sauf en développement (VERCEL_ENV=development, ou hors Vercel sans NODE_ENV=production).
 */
export async function verifyTurnstile(
  token: string,
  ip: string,
  env: TurnstileEnv,
  fetchImpl: typeof fetch = fetch,
  timeoutMs: number = TURNSTILE_TIMEOUT_MS,
): Promise<TurnstileResult> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return isDevContext(env) ? { ok: true } : { ok: false, reason: 'no_secret' };
  if (!token) return { ok: false, reason: 'missing_token' };
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set('remoteip', ip);
  try {
    const res = await fetchImpl(SITEVERIFY_URL, { method: 'POST', body: form, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return { ok: false, reason: 'unreachable' };
    const data = (await res.json()) as { success?: unknown; action?: unknown; hostname?: unknown };
    const valid = data.success === true && data.action === TURNSTILE_ACTION && isAllowedHostname(data.hostname, env);
    return valid ? { ok: true } : { ok: false, reason: 'rejected' };
  } catch {
    return { ok: false, reason: 'unreachable' };
  }
}
