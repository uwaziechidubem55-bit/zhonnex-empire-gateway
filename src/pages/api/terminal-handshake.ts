import type { NextApiRequest, NextApiResponse } from 'next';
import { GATE_COOKIE, matchWorkforceToken, sealGate, secretsConfigured } from '../../server/secrets';

/* The access codes never leave the server. The browser only receives
 * a route and an HttpOnly cookie. */

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false });
    return;
  }
  if (!secretsConfigured()) {
    res.status(503).json({
      ok: false,
      error: 'Gateway secrets are not configured on the server.'
    });
    return;
  }
  const token = typeof req.body?.token === 'string' ? req.body.token : '';
  const match = matchWorkforceToken(token);
  if (!match) {
    res.status(401).json({
      ok: false,
      error: 'CRITICAL BLOCK: Invalid Internal Gateway Token Mapping.'
    });
    return;
  }
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${GATE_COOKIE}=${sealGate(match.role)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200${secure}`
  );
  res.status(200).json({ ok: true, destination: match.destination });
}
