import type { NextApiRequest, NextApiResponse } from 'next';
import { gateFromRequest, loadWorkforce } from '../../server/secrets';

/* Names, credentials and account numbers are read from Vercel env.
 * Anonymous visitors get nothing. */

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ ok: false });
    return;
  }
  if (!gateFromRequest(req)) {
    res.status(401).json({ ok: false });
    return;
  }
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: true, people: loadWorkforce() });
}
