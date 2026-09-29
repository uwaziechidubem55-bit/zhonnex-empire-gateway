/* ZHONNEX RECRUITMENT PIPELINE.
 *
 * 4-step customer application -> UNDER_REVIEW -> Management appoints ->
 * APPOINTED with a ZH-…-Corp passcode and a staff registry account.
 */

import { addStaffAccount, StaffAccount } from './staff-registry';

export interface Application {
  id: string;
  job: string;
  position: string;
  /* step 1 */
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  nationality: string;
  /* step 2 */
  experience: string;
  cvFile: string;
  docFile: string;
  location: string;
  address1: string;
  address2: string;
  bring: string;
  change: string;
  /* lifecycle */
  status: 'UNDER_REVIEW' | 'APPOINTED';
  passcode?: string;
  createdAt: string;
}

export const APPLICATIONS_KEY = 'zhonnex_applications';

export function loadApplications(): Application[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Application[]) : [];
  } catch {
    return [];
  }
}

export function saveApplications(list: Application[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list));
}

export function submitApplication(
  data: Omit<Application, 'id' | 'status' | 'passcode' | 'createdAt'>
): Application {
  const app: Application = {
    ...data,
    id: `ZX-APP-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'UNDER_REVIEW',
    createdAt: new Date().toISOString().slice(0, 10)
  };
  saveApplications([...loadApplications(), app]);
  return app;
}

/** Management appointment: issue passcode + open the staff Duty Post account. */
export function appointApplication(id: string): { app?: Application; account?: StaffAccount } {
  const list = loadApplications();
  const target = list.find(a => a.id === id);
  if (!target || target.status === 'APPOINTED') return { app: target };
  const account = addStaffAccount({
    username: target.fullName,
    job: target.job,
    position: target.position
  });
  const updated = list.map(a =>
    a.id === id
      ? { ...a, status: 'APPOINTED' as const, passcode: account.passcode }
      : a
  );
  saveApplications(updated);
  return { app: updated.find(a => a.id === id), account };
}