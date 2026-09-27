/* ZHONNEX EXECUTIVE PAYROLL PIPELINE.
 *
 * MD stages a salary allocation -> Secretary executes the final wire ->
 * Overlord observes the queue. Shared per-browser storage for now;
 * swaps to the real API/database in the server-side step.
 */

export interface PayrollItem {
  id: string;
  name: string;
  position: string;
  account: string;
  amount: string;
  status: 'STAGED_FOR_SECRETARY' | 'PAID_TRANSACTION_SETTLED';
}

export const PAYROLL_KEY = 'zhonnex_payroll_queue';

export const DEFAULT_QUEUE: PayrollItem[] = [
  {
    id: 'PAY-991',
    name: 'Alexander Thorne',
    position: 'MX Vector Auditor',
    account: 'IBAN: US77•••1004',
    amount: '$8,500.00',
    status: 'STAGED_FOR_SECRETARY'
  },
  {
    id: 'PAY-992',
    name: 'Seraphina Vance',
    position: 'Rust Infrastructure SRE',
    account: 'IBAN: US88•••9921',
    amount: '$12,400.00',
    status: 'STAGED_FOR_SECRETARY'
  }
];

export function loadPayrollQueue(): PayrollItem[] {
  if (typeof window === 'undefined') return DEFAULT_QUEUE;
  try {
    const raw = window.localStorage.getItem(PAYROLL_KEY);
    if (!raw) return DEFAULT_QUEUE;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PayrollItem[]) : DEFAULT_QUEUE;
  } catch {
    return DEFAULT_QUEUE;
  }
}

export function savePayrollQueue(queue: PayrollItem[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PAYROLL_KEY, JSON.stringify(queue));
}

/** MD action: push a salary allocation into the Secretary queue. */
export function stagePayment(item: Omit<PayrollItem, 'id' | 'status'>): PayrollItem[] {
  const queue = loadPayrollQueue();
  const next: PayrollItem = {
    ...item,
    id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'STAGED_FOR_SECRETARY'
  };
  const updated = [...queue, next];
  savePayrollQueue(updated);
  return updated;
}

/** Secretary action: execute the final wire on a staged item. */
export function executePayment(id: string): PayrollItem[] {
  const updated = loadPayrollQueue().map(p =>
    p.id === id ? { ...p, status: 'PAID_TRANSACTION_SETTLED' as const } : p
  );
  savePayrollQueue(updated);
  return updated;
}
