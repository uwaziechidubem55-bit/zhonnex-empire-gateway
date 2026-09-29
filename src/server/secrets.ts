import crypto from 'crypto';
import type { NextApiRequest } from 'next';

/* Server-only. Never import this file from a page or component.
 * Values come from Vercel environment variables, not from source. */

export type GateRole = 'STAFF' | 'MD' | 'SECRETARY' | 'OVERLORD';

const DESTINATIONS: Record<GateRole, string> = {
  STAFF: '/dashboard/staff',
  MD: '/dashboard/management-md',
  SECRETARY: '/dashboard/management-secretary',
  OVERLORD: '/dashboard/overlord-core-gate'
};

const TOKEN_ENV: Array<[string, GateRole]> = [
  ['ZHONNEX_TOKEN_STAFF', 'STAFF'],
  ['ZHONNEX_TOKEN_MD', 'MD'],
  ['ZHONNEX_TOKEN_SECRETARY', 'SECRETARY'],
  ['ZHONNEX_TOKEN_OVERLORD', 'OVERLORD']
];

export const GATE_COOKIE = 'zhonnex_gate';

export interface WorkforceRecord {
  name: string;
  position: string;
  tasks: number;
  salary: string;
  account: string;
  credential: string;
  bic: string;
  iban: string;
  clearance: string;
}

export function secretsConfigured(): boolean {
  return TOKEN_ENV.every(([key]) => Boolean(process.env[key])) && Boolean(process.env.ZHONNEX_SESSION_SECRET);
}

function sameSecret(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function matchWorkforceToken(token: string): { role: GateRole; destination: string } | null {
  const trimmed = token.trim();
  if (!trimmed) return null;
  for (const [envKey, role] of TOKEN_ENV) {
    const expected = process.env[envKey];
    if (!expected) continue;
    if (sameSecret(trimmed, expected)) {
      return { role, destination: DESTINATIONS[role] };
    }
  }
  return null;
}

export function sealGate(role: GateRole): string {
  const secret = process.env.ZHONNEX_SESSION_SECRET || '';
  const exp = Date.now() + 12 * 60 * 60 * 1000;
  const body = Buffer.from(JSON.stringify({ role, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function openGate(rawCookie: string | undefined): GateRole | null {
  const secret = process.env.ZHONNEX_SESSION_SECRET;
  if (!secret || !rawCookie) return null;
  const value = readCookieValue(rawCookie, GATE_COOKIE);
  if (!value || !value.includes('.')) return null;
  const dot = value.lastIndexOf('.');
  const body = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (!sameSecret(sig, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as {
      role?: GateRole;
      exp?: number;
    };
    if (!parsed.role || !parsed.exp || parsed.exp < Date.now()) return null;
    if (!DESTINATIONS[parsed.role]) return null;
    return parsed.role;
  } catch {
    return null;
  }
}

export function readCookieValue(header: string, name: string): string | undefined {
  const parts = header.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return undefined;
}

export function gateFromRequest(req: NextApiRequest): GateRole | null {
  const header = req.headers.cookie;
  return openGate(typeof header === 'string' ? header : undefined);
}

export function loadWorkforce(): WorkforceRecord[] {
  const raw = process.env.ZHONNEX_WORKFORCE_JSON;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(row => ({
      name: String(row.name || ''),
      position: String(row.position || ''),
      tasks: Number(row.tasks) || 0,
      salary: String(row.salary || ''),
      account: String(row.account || ''),
      credential: String(row.credential || ''),
      bic: String(row.bic || ''),
      iban: String(row.iban || ''),
      clearance: String(row.clearance || '')
    })).filter(row => row.name);
  } catch {
    return [];
  }
}
