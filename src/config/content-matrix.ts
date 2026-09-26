/* ZHONNEX CUSTOMER-FACING CONTENT MATRIX.
 *
 * Management publishes these values from /dashboard/content-matrix and the
 * customer rooms (/dashboard/customer/*) read them. Storage is per-browser
 * (localStorage) for now — in the server-side step this module swaps to a
 * real API/database without touching the pages that use it.
 */

export interface BillingRow {
  date: string;
  ref: string;
  desc: string;
  amount: string;
  status: string; /* SETTLED | PENDING */
}

export interface ProductLicense {
  name: string;
  key: string;
  seats: string;
  expiry: string;
  status: string; /* ACTIVE | EXPIRING */
}

export interface Offer {
  tier: string;
  perk: string;
}

export interface JobOpening {
  role: string;
  division: string;
  loc: string;
  type: string;
}

export interface ContentMatrix {
  billing: BillingRow[];
  products: ProductLicense[];
  offers: Offer[];
  jobs: JobOpening[];
}

export const STORAGE_KEY = 'zhonnex_content_matrix';

export const DEFAULT_MATRIX: ContentMatrix = {
  billing: [
    { date: '2026-09-24', ref: 'ZX-INV-8841', desc: 'Empire Gateway Platform Fee', amount: '₦ 12,500.00', status: 'SETTLED' },
    { date: '2026-09-18', ref: 'ZX-INV-8790', desc: 'Velocity Finance Engine — Cycle 09', amount: '₦ 48,000.00', status: 'SETTLED' },
    { date: '2026-09-11', ref: 'ZX-INV-8732', desc: 'MX Suite Logistics Core Add-On', amount: '₦ 22,750.00', status: 'PENDING' },
    { date: '2026-09-02', ref: 'ZX-INV-8688', desc: 'Cognitive Mesh Uplink Renewal', amount: '₦ 15,000.00', status: 'SETTLED' }
  ],
  products: [
    { name: 'Empire Gateway Core', key: 'ZX-CORE-9917-EMPIRE', seats: '1 Terminal', expiry: '2027-01-01', status: 'ACTIVE' },
    { name: 'Velocity Finance Engine', key: 'ZX-VEL-4410-FINANCE', seats: '3 Operators', expiry: '2026-12-15', status: 'ACTIVE' },
    { name: 'MX Suite Logistics Core', key: 'ZX-MXS-2280-LOGISTICS', seats: '5 Fleet Nodes', expiry: '2026-10-30', status: 'EXPIRING' }
  ],
  offers: [
    { tier: 'GOLD TIER UPLIFT', perk: 'Zero platform fees for 90 days plus priority mesh routing on every transaction pipeline.' },
    { tier: 'FLEET EXPANSION PACK', perk: 'Add 10 extra MX Suite logistics nodes at 40% below the standard rate.' }
  ],
  jobs: [
    { role: 'Vector Guidance Analyst', division: 'MX SUITE LOGISTICS', loc: 'Onitsha HQ / Remote', type: 'FULL-TIME' },
    { role: 'Ledger Integrity Auditor', division: 'VELOCITY FINANCE', loc: 'Remote', type: 'CONTRACT' },
    { role: 'Cognitive Mesh Trainer', division: 'GENERATIONAL MESH', loc: 'Lagos Node', type: 'FULL-TIME' }
  ]
};

export function loadContentMatrix(): ContentMatrix {
  if (typeof window === 'undefined') return DEFAULT_MATRIX;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MATRIX;
    const parsed = JSON.parse(raw) as Partial<ContentMatrix>;
    return {
      billing: Array.isArray(parsed.billing) ? (parsed.billing as BillingRow[]) : DEFAULT_MATRIX.billing,
      products: Array.isArray(parsed.products) ? (parsed.products as ProductLicense[]) : DEFAULT_MATRIX.products,
      offers: Array.isArray(parsed.offers) ? (parsed.offers as Offer[]) : DEFAULT_MATRIX.offers,
      jobs: Array.isArray(parsed.jobs) ? (parsed.jobs as JobOpening[]) : DEFAULT_MATRIX.jobs
    };
  } catch {
    return DEFAULT_MATRIX;
  }
}

export function saveContentMatrix(matrix: ContentMatrix): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix));
}

export function resetContentMatrix(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}