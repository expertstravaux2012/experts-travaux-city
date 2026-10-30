import { isAllowedOrigin, MAX_BODY_BYTES, parseRdv, sendRdvMail } from '../src/lib/rdv-mail.ts';

const json = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export async function POST(request: Request): Promise<Response> {
  if (!isAllowedOrigin(request.headers.get('origin'), request.headers.get('host'))) {
    return json(403, { ok: false, error: 'forbidden' });
  }
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return json(400, { ok: false, error: 'invalid_content_type' });
  }
  const text = await request.text();
  if (Buffer.byteLength(text) > MAX_BODY_BYTES) return json(400, { ok: false, error: 'payload_too_large' });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json(400, { ok: false, error: 'invalid_json' });
  }

  const parsed = parseRdv(body);
  if (parsed.kind === 'spam') return json(200, { ok: true });
  if (parsed.kind === 'invalid') return json(400, { ok: false, error: 'validation', fields: parsed.fields });

  const sent = await sendRdvMail(parsed.data, process.env);
  return sent ? json(200, { ok: true }) : json(500, { ok: false, error: 'send_failed' });
}

export const GET = () => json(405, { ok: false, error: 'method_not_allowed' }, { Allow: 'POST' });
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
