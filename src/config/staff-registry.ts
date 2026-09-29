/* ZHONNEX STAFF REGISTRY.
 *
 * Appointed applicants become staff accounts. Each account owns a private
 * Duty Post space reached with username (the name filled at application)
 * plus the randomly issued passcode: ZH-XXXXXX-Corp.
 */

export interface StaffAccount {
  username: string;
  passcode: string;
  job: string;
  position: string;
  duties: string[];
  appointedAt: string;
}

export const STAFF_KEY = 'zhonnex_staff_registry';

/** Duties are derived from the position so every space is personal. */
export function dutiesFor(position: string, job: string): string[] {
  const p = position.toLowerCase();
  if (p.includes('lead') || p.includes('chief') || p.includes('head')) {
    return [
      `Direct the ${job} unit and approve weekly outputs`,
      'Review subordinate task logs in the Duty Post matrix',
      'Escalate division risks to the MD directorate'
    ];
  }
  if (p.includes('senior')) {
    return [
      `Own complex ${job} casework end-to-end`,
      'Mentor junior holders of the same position',
      'File weekly output reports to the division lead'
    ];
  }
  if (p.includes('designer') || p.includes('trainer')) {
    return [
      `Deliver ${job} programmes on the assigned node`,
      'Log session outcomes in the personal Duty Post',
      'Flag asset faults through Security Threat Escalation'
    ];
  }
  return [
    `Execute assigned ${job} task queue daily`,
    'Keep personal Duty Post dossier and documents current',
    'Report output counts to the division lead each cycle'
  ];
}

/** Random access code: always ZH- … -Corp */
export function generatePasscode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let core = '';
  for (let i = 0; i < 6; i++) {
    core += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `ZH-${core}-Corp`;
}

export function loadStaffAccounts(): StaffAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STAFF_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StaffAccount[]) : [];
  } catch {
    return [];
  }
}

export function saveStaffAccounts(accounts: StaffAccount[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STAFF_KEY, JSON.stringify(accounts));
}

export function addStaffAccount(entry: Omit<StaffAccount, 'passcode' | 'duties' | 'appointedAt'>): StaffAccount {
  const account: StaffAccount = {
    ...entry,
    passcode: generatePasscode(),
    duties: dutiesFor(entry.position, entry.job),
    appointedAt: new Date().toISOString().slice(0, 10)
  };
  saveStaffAccounts([...loadStaffAccounts(), account]);
  return account;
}

export function verifyStaff(username: string, passcode: string): StaffAccount | undefined {
  return loadStaffAccounts().find(
    a =>
      a.username.toLowerCase() === username.trim().toLowerCase() &&
      a.passcode === passcode.trim()
  );
}