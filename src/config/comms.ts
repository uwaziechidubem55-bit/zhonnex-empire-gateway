/* ZHONNEX CROSS-INTERFACE COMMS.
 *
 * Directives, documents and issues travel between dashboards here.
 * Only cleared positions may transmit; every track can receive.
 */

export interface CommMessage {
  id: string;
  from: string;
  role: string;
  subject: string;
  body: string;
  time: string;
}

export const COMMS_KEY = 'zhonnex_comms_mesh';

/** Positions cleared to transmit across interfaces. */
export const SENDER_ROLES = ['OVERLORD', 'MANAGEMENT_MD', 'MANAGEMENT_SECRETARY'];

export function canTransmit(role: string): boolean {
  return SENDER_ROLES.includes(role);
}

export function loadComms(): CommMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(COMMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CommMessage[]) : [];
  } catch {
    return [];
  }
}

export function sendComm(msg: Omit<CommMessage, 'id' | 'time'>): CommMessage[] | null {
  if (typeof window === 'undefined' || !canTransmit(msg.role)) return null;
  const entry: CommMessage = {
    ...msg,
    id: `ZX-COM-${Math.floor(100 + Math.random() * 900)}`,
    time: new Date().toISOString().slice(0, 16).replace('T', ' ')
  };
  const updated = [entry, ...loadComms()];
  window.localStorage.setItem(COMMS_KEY, JSON.stringify(updated));
  return updated;
}