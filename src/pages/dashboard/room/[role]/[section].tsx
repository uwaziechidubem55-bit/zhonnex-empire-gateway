import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { ZhonnexTokens } from '../../../../config/design-tokens';
import { HeaderNavigation } from '../../../../components/HeaderNavigation';
import { HamburgerMenu } from '../../../../components/HamburgerMenu';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import {
  ContentMatrix,
  loadContentMatrix,
  saveContentMatrix
} from '../../../../config/content-matrix';
import { loadPayrollQueue, PayrollItem } from '../../../../config/payroll-queue';
import {
  StaffAccount,
  loadStaffAccounts,
  verifyStaff
} from '../../../../config/staff-registry';
import {
  CommMessage,
  canTransmit,
  loadComms,
  sendComm
} from '../../../../config/comms';

/* ------------------------------------------------------------------ */
/* Internal role rooms — one dynamic page for every hamburger link    */
/* across STAFF / MD / SECRETARY / OVERLORD directories.              */
/* Routes: /dashboard/room/{role}/{section}                           */
/* ------------------------------------------------------------------ */

type MenuRole =
  | 'STAFF'
  | 'MANAGEMENT_MD'
  | 'MANAGEMENT_SECRETARY'
  | 'OVERLORD';

const ROOMS: Record<string, Record<string, { title: string; badge: string; menu: MenuRole }>> = {
  staff: {
    'duty-post': { title: 'DUTY POST — PERSONAL SPACE', badge: 'PRIVATE', menu: 'STAFF' },
    dossier: { title: 'EMPLOYEE DOSSIER & CREDENTIAL', badge: 'STAFF', menu: 'STAFF' },
    compensation: { title: 'COMPENSATION & DIRECT DEPOSIT', badge: 'PAYROLL', menu: 'STAFF' },
    metrics: { title: 'OPERATIONAL METRICS PIPELINE', badge: 'LIVE', menu: 'STAFF' },
    'vector-feed': { title: 'MX SUITE TRACKING VECTOR FEED', badge: 'TELEMETRY', menu: 'STAFF' },
    escalation: { title: 'SECURITY THREAT ESCALATION', badge: 'PRIORITY', menu: 'STAFF' }
  },
  md: {
    holdings: { title: 'HOLDINGS MATRIX', badge: 'COMPANY REGISTRY', menu: 'MANAGEMENT_MD' },
    productivity: { title: 'PRODUCTIVITY TRACKER & TASK METRICS', badge: 'WORKFORCE', menu: 'MANAGEMENT_MD' },
    'role-config': { title: 'ROLE CONFIGURATION MATRIX', badge: 'TRACKS', menu: 'MANAGEMENT_MD' },
    'sec-gen': { title: 'SECRETARY GENERAL DESK', badge: 'DOCUMENTATION & REPORTS', menu: 'MANAGEMENT_MD' },
    board: { title: 'BOARD OF DIRECTORS CHAMBER', badge: 'SHAREHOLDERS VIEW', menu: 'MANAGEMENT_MD' },
    comms: { title: 'CROSS-INTERFACE COMMS', badge: 'MD CLEARANCE', menu: 'MANAGEMENT_MD' }
  },
  secretary: {
    holdings: { title: 'HOLDINGS MATRIX', badge: 'READ-ONLY', menu: 'MANAGEMENT_SECRETARY' },
    audit: { title: 'TASK COUNTER AUDIT RECORDS', badge: 'AUDIT', menu: 'MANAGEMENT_SECRETARY' },
    'fin-reports': { title: 'FINANCIAL DOCUMENTATION & REPORTS', badge: 'FINANCIAL SECRETARY', menu: 'MANAGEMENT_SECRETARY' },
    treasury: { title: 'TREASURY FUND MONITOR', badge: 'TREASURER', menu: 'MANAGEMENT_SECRETARY' },
    comms: { title: 'CROSS-INTERFACE COMMS', badge: 'SEC CLEARANCE', menu: 'MANAGEMENT_SECRETARY' }
  },
  overlord: {
    logs: { title: 'ABSOLUTE SYSTEM LOG MATRIX', badge: 'EVERY ACTIVITY', menu: 'OVERLORD' },
    telemetry: { title: 'EMPIRE FINANCIAL TELEMETRY', badge: 'GROSS CASH', menu: 'OVERLORD' },
    'price-matrix': { title: 'MASTER PRICE MATRIX CORE', badge: 'GLOBAL OVERRIDE', menu: 'OVERLORD' },
    positions: { title: 'POSITION CREATOR PANEL', badge: 'R&S INJECTION', menu: 'OVERLORD' },
    override: { title: 'GLOBAL OVERRIDE MATRIX', badge: 'KILL SWITCHES', menu: 'OVERLORD' },
    payroll: { title: 'MASTER PAYROLL SCHEDULER', badge: 'OBSERVE', menu: 'OVERLORD' },
    comms: { title: 'CROSS-INTERFACE COMMS', badge: 'SOVEREIGN', menu: 'OVERLORD' }
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: Array<{ params: { role: string; section: string } }> = [];
  Object.entries(ROOMS).forEach(([role, sections]) => {
    Object.keys(sections).forEach(section => paths.push({ params: { role, section } }));
  });
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const OVERLORD_OVERRIDES_KEY = 'zhonnex_overlord_overrides';

const ASSETS = [
  { id: 'ZNX-SHUTTLE-04', domain: 'ATMOSPHERIC', status: 'IN TRANSIT' },
  { id: 'ZNX-RAIL-11', domain: 'RAIL', status: 'NOMINAL' },
  { id: 'ZNX-MARINE-02', domain: 'SEA', status: 'NOMINAL' },
  { id: 'ZNX-ROVER-19', domain: 'LAND', status: 'MAINTENANCE' }
];

const HOLDS = [
  { name: 'Zhonnex Premium Logistics Corp', status: 'ACTIVE', note: 'Recurring License Balance Clear' },
  { name: 'Zhonnex Velocity Finance Ltd', status: 'ACTIVE', note: 'Platform split fees current' },
  { name: 'Zhonnex Cognitive Mesh Holdings', status: 'RENEWAL DUE', note: 'Uplink renewal pending cycle close' }
];

const WORKFORCE = [
  { name: 'Alexander Thorne', position: 'MX Vector Auditor', tasks: 142 },
  { name: 'Seraphina Vance', position: 'Rust Infrastructure SRE', tasks: 289 }
];

const LOGS = [
  '[2026-09-25 17:11:02] [LEDGER] SUCCESS: User ID #8819 compiled transaction split inside collection.',
  '[2026-09-25 17:11:45] [MX-SUITE] TELEMETRY: Asset ZNX-SHUTTLE-04 processed vector avoidance path. 0.00ms latency.',
  '[2026-09-25 17:12:10] [AUTH] RLS VERIFICATION: Profile lookup passed via relational schema query.',
  '[2026-09-26 09:02:51] [GATE] HANDSHAKE: Terminal access token verified for MANAGEMENT_MD track.'
];

export default function InternalRoleRoom() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const role = typeof router.query.role === 'string' ? router.query.role : '';
  const section =
    typeof router.query.section === 'string' ? router.query.section : '';
  const room =
    ROOMS[role] && ROOMS[role][section] ? ROOMS[role][section] : undefined;

  /* shared matrices */
  const [matrix, setMatrix] = useState<ContentMatrix>(() => loadContentMatrix());
  const [queue, setQueue] = useState<PayrollItem[]>(() => loadPayrollQueue());
  useEffect(() => {
    setMatrix(loadContentMatrix());
    setQueue(loadPayrollQueue());
  }, [role, section]);

  /* overlord overrides */
  const [overrides, setOverrides] = useState({
    freezeSignIns: false,
    maintenanceMode: false,
    verboseMesh: false
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(OVERLORD_OVERRIDES_KEY);
      if (raw) setOverrides({ ...overrides, ...JSON.parse(raw) });
    } catch {
      /* keep defaults */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* escalation form (staff) */
  const [esc, setEsc] = useState({ severity: 'HIGH', detail: '' });
  const [escId, setEscId] = useState('');

  /* overlord position creator */
  const [pos, setPos] = useState({ jobRole: '', title: '' });

  const publishMatrix = (next: ContentMatrix) => {
    saveContentMatrix(next);
    setMatrix(next);
    setNotice('PUBLISHED — customer mesh updated.');
  };

  const setBillingAmount = (i: number, amount: string) => {
    const billing = matrix.billing.map((r, idx) =>
      idx === i ? { ...r, amount } : r
    );
    setMatrix({ ...matrix, billing });
  };

  const injectPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const title = pos.title.trim();
    if (!pos.jobRole || !title) return;
    const jobs = matrix.jobs.map(j =>
      j.role === pos.jobRole
        ? { ...j, positions: [...(j.positions || []), title] }
        : j
    );
    publishMatrix({ ...matrix, jobs });
    setPos({ jobRole: '', title: '' });
    setNotice('POSITION INJECTED — now live under that job in the customer Jobs room.');
  };

  const saveOverrides = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(OVERLORD_OVERRIDES_KEY, JSON.stringify(overrides));
    }
    setNotice('OVERRIDE MATRIX COMMITTED TO GLOBAL STATE.');
  };

  const submitEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esc.detail.trim()) return;
    setEscId(`ZX-SEC-${Math.floor(100 + Math.random() * 900)}`);
    setEsc({ severity: 'HIGH', detail: '' });
  };

  /* ---- duty post (private staff space) ---- */
  const [staffSession, setStaffSession] = useState<string | null>(null);
  const [duUser, setDuUser] = useState('');
  const [duPass, setDuPass] = useState('');
  const [duError, setDuError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setStaffSession(window.localStorage.getItem('zhonnex_staff_session'));
  }, []);

  const dutyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = verifyStaff(duUser, duPass);
    if (!acc) {
      setDuError(
        'INVALID CREDENTIALS — username is the name on your application; passcode is your ZH-…-Corp code.'
      );
      return;
    }
    window.localStorage.setItem('zhonnex_staff_session', acc.username);
    setStaffSession(acc.username);
    setDuError('');
  };

  const dutyLogout = () => {
    window.localStorage.removeItem('zhonnex_staff_session');
    setStaffSession(null);
  };

  const myAccount: StaffAccount | undefined = staffSession
    ? loadStaffAccounts().find(a => a.username === staffSession)
    : undefined;

  /* ---- cross-interface comms ---- */
  const [comms, setComms] = useState<CommMessage[]>([]);
  useEffect(() => {
    setComms(loadComms());
  }, [role, section]);
  const [commSubject, setCommSubject] = useState('');
  const [commBody, setCommBody] = useState('');

  const transmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    const updated = sendComm({
      from: room.menu,
      role: room.menu,
      subject: commSubject,
      body: commBody
    });
    if (updated) {
      setComms(updated);
      setCommSubject('');
      setCommBody('');
      setNotice('TRANSMITTED ACROSS ALL INTERFACES.');
    }
  };

  /* ---- secretary general reports ---- */
  const [reports, setReports] = useState<
    Array<{ id: string; title: string; summary: string; by: string; time: string }>
  >([]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('zhonnex_reports');
      setReports(raw ? (JSON.parse(raw) as typeof reports) : []);
    } catch {
      setReports([]);
    }
  }, [role, section]);
  const [repTitle, setRepTitle] = useState('');
  const [repSummary, setRepSummary] = useState('');

  const fileReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repTitle.trim() || !repSummary.trim() || typeof window === 'undefined') return;
    const next = [
      {
        id: `ZX-REP-${Math.floor(100 + Math.random() * 900)}`,
        title: repTitle.trim(),
        summary: repSummary.trim(),
        by: 'Secretary General',
        time: new Date().toISOString().slice(0, 10)
      },
      ...reports
    ];
    window.localStorage.setItem('zhonnex_reports', JSON.stringify(next));
    setReports(next);
    setRepTitle('');
    setRepSummary('');
    setNotice('REPORT FILED TO THE BOARD RECORD.');
  };

  /* ---- treasury math ---- */
  const money = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
  const stagedTotal = queue
    .filter(q => q.status !== 'PAID_TRANSACTION_SETTLED')
    .reduce((t, q) => t + money(q.amount), 0)
    .toFixed(2);
  const paidTotal = queue
    .filter(q => q.status === 'PAID_TRANSACTION_SETTLED')
    .reduce((t, q) => t + money(q.amount), 0)
    .toFixed(2);

  return (
    <div style={st.pageWrapper}>
      <HeaderNavigation
        onHamburgerClick={() => setMenuOpen(true)}
        showHamburger={true}
      />
      {room && (
        <HamburgerMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          role={room.menu}
        />
      )}

      <main style={{ ...st.main, padding: isMobile ? '2rem 1.1rem' : '3rem' }}>
        {!room ? (
          <div style={st.card}>
            <h1 style={{ ...st.roomTitle, color: ZhonnexTokens.colors.securityFail }}>
              SIGNAL LOST
            </h1>
            <p style={st.muted}>Unknown internal coordinate.</p>
          </div>
        ) : (
          <>
            <div style={st.titleRow}>
              <h1 style={st.roomTitle}>{room.title}</h1>
              <span style={st.roomBadge}>{room.badge}</span>
            </div>
            {notice && <p style={st.notice}>{notice}</p>}

            {/* ---------------- STAFF ---------------- */}
            {role === 'staff' && section === 'dossier' && (
              <div style={st.card}>
                <div style={st.kvRow}><span style={st.kvLabel}>LEGAL NAME</span><span>Alexander Thorne</span></div>
                <div style={st.kvRow}><span style={st.kvLabel}>ASSIGNED POSITION</span><span>MX Vector Auditor</span></div>
                <div style={st.kvRow}><span style={st.kvLabel}>EMPLOYEE CREDENTIAL</span><span style={st.mono}>ZX-EMP-0007</span></div>
                <div style={st.kvRow}><span style={st.kvLabel}>CLEARANCE</span><span style={{ color: ZhonnexTokens.colors.securityPass }}>TRAFFIC ROUTING DIVISION</span></div>
                <button
                  type="button"
                  style={st.goldBtn}
                  onClick={() => setNotice('Credential rotation requested — HR mesh will respond within one cycle.')}
                >
                  REQUEST CREDENTIAL ROTATION
                </button>
              </div>
            )}

            {role === 'staff' && section === 'compensation' && (
              <div style={st.card}>
                <div style={st.kvRow}><span style={st.kvLabel}>CYCLE 09 GROSS</span><span style={st.mono}>$8,500.00</span></div>
                <div style={st.kvRow}><span style={st.kvLabel}>REMITTANCE STATUS</span><span style={{ color: ZhonnexTokens.colors.velocityGold }}>IN EXECUTIVE QUEUE</span></div>
                <div style={st.kvRow}><span style={st.kvLabel}>ROUTING (MASKED)</span><span style={st.mono}>IBAN: US77•••1004</span></div>
                <p style={st.muted}>
                  Payouts execute after MD initiation and Secretary clearance.
                  Track final state in your next cycle statement.
                </p>
              </div>
            )}

            {role === 'staff' && section === 'metrics' && (
              <div style={st.card}>
                <div style={st.statRow}>
                  <div style={st.statCard}><h4>TASKS RESOLVED</h4><p style={st.statNum}>142</p></div>
                  <div style={st.statCard}><h4>MESH UPTIME</h4><p style={{ ...st.statNum, color: ZhonnexTokens.colors.imperialCyan }}>99.98%</p></div>
                  <div style={st.statCard}><h4>AVG LATENCY</h4><p style={{ ...st.statNum, color: ZhonnexTokens.colors.velocityGold }}>0.4ms</p></div>
                </div>
              </div>
            )}

            {role === 'staff' && section === 'vector-feed' && (
              <div style={st.card}>
                {ASSETS.map(a => (
                  <div key={a.id} style={st.ledgerRow}>
                    <div>
                      <span style={st.monoCyan}>{a.id}</span>
                      <span style={st.muted}> · {a.domain} DOMAIN</span>
                    </div>
                    <span
                      style={{
                        ...st.pill,
                        color:
                          a.status === 'NOMINAL'
                            ? ZhonnexTokens.colors.securityPass
                            : a.status === 'IN TRANSIT'
                              ? ZhonnexTokens.colors.imperialCyan
                              : ZhonnexTokens.colors.velocityGold
                      }}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {role === 'staff' && section === 'escalation' && (
              <div style={st.card}>
                {escId && <p style={st.notice}>Escalation {escId} transmitted to Security Command.</p>}
                <form onSubmit={submitEscalation} style={st.form}>
                  <label style={st.label} htmlFor="esc-sev">SEVERITY</label>
                  <select
                    id="esc-sev"
                    style={st.input}
                    value={esc.severity}
                    onChange={e => setEsc({ ...esc, severity: e.target.value })}
                  >
                    <option>LOW</option>
                    <option>HIGH</option>
                    <option>CRITICAL</option>
                  </select>
                  <label style={st.label} htmlFor="esc-detail">THREAT DETAIL</label>
                  <textarea
                    id="esc-detail"
                    style={{ ...st.input, minHeight: '110px', resize: 'vertical' }}
                    placeholder="Describe the anomaly, affected asset and observed behaviour"
                    value={esc.detail}
                    onChange={e => setEsc({ ...esc, detail: e.target.value })}
                    required
                  />
                  <button type="submit" style={st.cyanBtn}>TRANSMIT ESCALATION</button>
                </form>
              </div>
            )}

            {role === 'staff' && section === 'duty-post' && (
              !myAccount ? (
                <div style={st.card}>
                  <p style={st.muted}>
                    Every staff member owns a private Duty Post space — any
                    position, any task. Sign in with the name on your
                    application and your ZH-…-Corp passcode.
                  </p>
                  {duError && <p style={st.error}>{duError}</p>}
                  <form onSubmit={dutyLogin} style={st.form}>
                    <label style={st.label} htmlFor="du-user">USERNAME (APPLICATION NAME)</label>
                    <input id="du-user" style={st.input} value={duUser} onChange={e => setDuUser(e.target.value)} required />
                    <label style={st.label} htmlFor="du-pass">ACCESS PASSCODE</label>
                    <input id="du-pass" type="password" style={st.input} placeholder="ZH-XXXXXX-Corp" value={duPass} onChange={e => setDuPass(e.target.value)} required />
                    <button type="submit" style={st.cyanBtn}>ENTER DUTY POST</button>
                  </form>
                </div>
              ) : (
                <>
                  <div style={st.card}>
                    <div style={st.kvRow}><span style={st.kvLabel}>USERNAME</span><span>{myAccount.username}</span></div>
                    <div style={st.kvRow}><span style={st.kvLabel}>POSITION</span><span>{myAccount.position}</span></div>
                    <div style={st.kvRow}><span style={st.kvLabel}>JOB FAMILY</span><span>{myAccount.job}</span></div>
                    <div style={st.kvRow}><span style={st.kvLabel}>APPOINTED</span><span>{myAccount.appointedAt}</span></div>
                    <div style={st.kvRow}><span style={st.kvLabel}>PASSCODE</span><span style={st.mono}>{myAccount.passcode.slice(0, 3)}••••••{myAccount.passcode.slice(-5)}</span></div>
                    <button type="button" style={st.goldBtn} onClick={dutyLogout}>SIGN OUT OF DUTY POST</button>
                  </div>
                  <div style={st.card}>
                    <h3 style={st.sectionHead}>MY DUTIES (POSITION-BASED)</h3>
                    {myAccount.duties.map(d => (
                      <div key={d} style={st.ledgerRow}>
                        <span style={st.white}>• {d}</span>
                      </div>
                    ))}
                  </div>
                  <div style={st.card}>
                    <h3 style={st.sectionHead}>INTERFACE INBOX</h3>
                    {comms.length === 0 && (
                      <p style={st.muted}>No directives received yet.</p>
                    )}
                    {comms.map(c => (
                      <div key={c.id} style={st.ledgerRow}>
                        <div>
                          <span style={st.white}>{c.subject}</span>
                          <span style={st.muted}> — {c.body}</span>
                          <span style={st.muted}> · {c.from} · {c.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}

            {/* ---------------- MD ---------------- */}
            {role === 'md' && section === 'holdings' && (
              <div style={st.card}>
                {HOLDS.map(h => (
                  <div key={h.name} style={st.ledgerRow}>
                    <div>
                      <span style={st.white}>{h.name}</span>
                      <span style={st.muted}> · {h.note}</span>
                    </div>
                    <span
                      style={{
                        ...st.pill,
                        color:
                          h.status === 'ACTIVE'
                            ? ZhonnexTokens.colors.securityPass
                            : ZhonnexTokens.colors.velocityGold
                      }}
                    >
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {role === 'md' && section === 'productivity' && (
              <div style={st.card}>
                {WORKFORCE.map(w => (
                  <div key={w.name} style={st.ledgerRow}>
                    <div>
                      <span style={st.white}>{w.name}</span>
                      <span style={st.muted}> · {w.position}</span>
                    </div>
                    <span style={st.monoCyan}>{w.tasks} UNITS</span>
                  </div>
                ))}
                <p style={st.muted}>
                  Task counters stream from the staff terminals. Initiate
                  payouts from the Directorate Payment Hub.
                </p>
              </div>
            )}

            {role === 'md' && section === 'role-config' && (
              <div style={st.card}>
                {['STAFF', 'MANAGEMENT_MD', 'MANAGEMENT_SECRETARY', 'OVERLORD'].map(r => (
                  <div key={r} style={st.ledgerRow}>
                    <span style={st.white}>{r} TRACK</span>
                    <span style={st.pill}>
                      {r === 'OVERLORD' ? 'SOVEREIGN' : 'ENTERPRISE'}
                    </span>
                  </div>
                ))}
                <p style={st.muted}>
                  New position injection is executed from the Overlord Command
                  Center → Position Creator Panel.
                </p>
              </div>
            )}

            {role === 'md' && section === 'sec-gen' && (
              <>
                <div style={st.card}>
                  <h3 style={st.sectionHead}>FILE DOCUMENTATION / REPORT</h3>
                  <p style={st.muted}>
                    Secretary General desk — corporate documentation and
                    reports land in the board record below.
                  </p>
                  <form onSubmit={fileReport} style={st.form}>
                    <label style={st.label} htmlFor="rep-t">REPORT TITLE</label>
                    <input id="rep-t" style={st.input} value={repTitle} onChange={e => setRepTitle(e.target.value)} required />
                    <label style={st.label} htmlFor="rep-s">SUMMARY</label>
                    <textarea id="rep-s" style={{ ...st.input, minHeight: '80px' }} value={repSummary} onChange={e => setRepSummary(e.target.value)} required />
                    <button type="submit" style={st.cyanBtn}>FILE TO BOARD RECORD</button>
                  </form>
                </div>
                <div style={st.card}>
                  <h3 style={st.sectionHead}>CORPORATE RECORD</h3>
                  {reports.length === 0 && (
                    <p style={st.muted}>No reports filed yet.</p>
                  )}
                  {reports.map(r => (
                    <div key={r.id} style={st.ledgerRow}>
                      <div>
                        <span style={st.white}>{r.title}</span>
                        <span style={st.muted}> — {r.summary}</span>
                        <span style={st.muted}> · {r.by} · {r.time} · {r.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {role === 'md' && section === 'board' && (
              <>
                <div style={st.card}>
                  <div style={st.statRow}>
                    <div style={st.statCard}><h4>GROSS EARNED CASH</h4><p style={st.statNum}>$3,489,120.50</p></div>
                    <div style={st.statCard}><h4>SHAREHOLDER EQUITY</h4><p style={{ ...st.statNum, color: ZhonnexTokens.colors.velocityGold }}>$1,204,775.00</p></div>
                    <div style={st.statCard}><h4>DIVIDEND YIELD</h4><p style={{ ...st.statNum, color: ZhonnexTokens.colors.imperialCyan }}>6.4%</p></div>
                  </div>
                </div>
                <div style={st.card}>
                  <h3 style={st.sectionHead}>SUB-HOLDINGS PERFORMANCE</h3>
                  {HOLDS.map(h => (
                    <div key={h.name} style={st.ledgerRow}>
                      <div>
                        <span style={st.white}>{h.name}</span>
                        <span style={st.muted}> · {h.note}</span>
                      </div>
                      <span style={st.pill}>{h.status}</span>
                    </div>
                  ))}
                  <p style={st.muted}>
                    Directors and shareholders observe here; operational
                    controls remain with the MD and Overlord tracks.
                  </p>
                </div>
              </>
            )}

            {/* ---------------- SECRETARY ---------------- */}
            {role === 'secretary' && section === 'holdings' && (
              <div style={st.card}>
                {HOLDS.map(h => (
                  <div key={h.name} style={st.ledgerRow}>
                    <div>
                      <span style={st.white}>{h.name}</span>
                      <span style={st.muted}> · {h.note}</span>
                    </div>
                    <span style={st.pill}>{h.status}</span>
                  </div>
                ))}
                <p style={st.muted}>Read-only mirror — modifications require MD track.</p>
              </div>
            )}

            {role === 'secretary' && section === 'audit' && (
              <div style={st.card}>
                {WORKFORCE.map(w => (
                  <div key={w.name} style={st.ledgerRow}>
                    <div>
                      <span style={st.white}>{w.name}</span>
                      <span style={st.muted}> · last audit 2026-09-25</span>
                    </div>
                    <span style={{ ...st.pill, color: ZhonnexTokens.colors.securityPass }}>
                      ✓ {w.tasks} VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            )}

            {role === 'secretary' && section === 'fin-reports' && (
              <div style={st.card}>
                <div style={st.statRow}>
                  <div style={st.statCard}><h4>STAGED VALUE</h4><p style={{ ...st.statNum, color: ZhonnexTokens.colors.velocityGold }}>${stagedTotal}</p></div>
                  <div style={st.statCard}><h4>SETTLED VALUE</h4><p style={st.statNum}>${paidTotal}</p></div>
                </div>
                <h3 style={st.sectionHead}>EXECUTED WIRES RECORD</h3>
                {queue.filter(q => q.status === 'PAID_TRANSACTION_SETTLED').length === 0 && (
                  <p style={st.muted}>No executed wires yet.</p>
                )}
                {queue
                  .filter(q => q.status === 'PAID_TRANSACTION_SETTLED')
                  .map(q => (
                    <div key={q.id} style={st.ledgerRow}>
                      <div>
                        <span style={st.monoCyan}>{q.id}</span>
                        <span style={st.white}> · {q.name}</span>
                      </div>
                      <span style={st.mono}>{q.amount}</span>
                    </div>
                  ))}
              </div>
            )}

            {role === 'secretary' && section === 'treasury' && (
              <div style={st.card}>
                <p style={st.muted}>
                  Treasurer monitor — every digital movement of company funds
                  across the executive payroll pipeline.
                </p>
                {queue.map(q => (
                  <div key={q.id} style={st.ledgerRow}>
                    <div>
                      <span style={st.monoCyan}>{q.id}</span>
                      <span style={st.white}> · {q.name}</span>
                      <span style={st.muted}> · {q.amount}</span>
                    </div>
                    <span
                      style={{
                        ...st.pill,
                        color:
                          q.status === 'PAID_TRANSACTION_SETTLED'
                            ? ZhonnexTokens.colors.securityPass
                            : ZhonnexTokens.colors.velocityGold
                      }}
                    >
                      {q.status === 'PAID_TRANSACTION_SETTLED' ? 'MOVED — SETTLED' : 'PENDING MOVE'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ---------------- OVERLORD ---------------- */}
            {role === 'overlord' && section === 'logs' && (
              <div style={st.card}>
                <div style={st.logTerminal}>
                  {LOGS.map((l, i) => (
                    <p key={i} style={st.logLine}><code>{l}</code></p>
                  ))}
                </div>
              </div>
            )}

            {role === 'overlord' && section === 'telemetry' && (
              <div style={st.card}>
                <div style={st.statRow}>
                  <div style={st.statCard}><h4>GROSS EARNED CASH</h4><p style={st.statNum}>$3,489,120.50</p></div>
                  <div style={st.statCard}><h4>PLATFORM SPLIT FEES</h4><p style={{ ...st.statNum, color: ZhonnexTokens.colors.velocityGold }}>$842,109.15</p></div>
                  <div style={st.statCard}><h4>ACTIVE RUNTIMES</h4><p style={{ ...st.statNum, color: ZhonnexTokens.colors.imperialCyan }}>9,412</p></div>
                </div>
              </div>
            )}

            {role === 'overlord' && section === 'price-matrix' && (
              <div style={st.card}>
                <p style={st.muted}>
                  Master price coupling — editing an amount and publishing
                  shifts the customer Billing Ledger instantly.
                </p>
                {matrix.billing.map((row, i) => (
                  <div key={row.ref} style={st.ledgerRow}>
                    <div>
                      <span style={st.monoCyan}>{row.ref}</span>
                      <span style={st.muted}> · {row.desc}</span>
                    </div>
                    <input
                      style={{ ...st.input, width: '140px' }}
                      value={row.amount}
                      onChange={e => setBillingAmount(i, e.target.value)}
                    />
                  </div>
                ))}
                <button type="button" style={st.redBtn} onClick={() => publishMatrix(matrix)}>
                  FORCE GLOBAL PRICE SHIFT
                </button>
              </div>
            )}

            {role === 'overlord' && section === 'positions' && (
              <div style={st.card}>
                <form onSubmit={injectPosition} style={st.form}>
                  <label style={st.label} htmlFor="pos-job">TARGET JOB OPENING</label>
                  <select
                    id="pos-job"
                    style={st.input}
                    value={pos.jobRole}
                    onChange={e => setPos({ ...pos, jobRole: e.target.value })}
                    required
                  >
                    <option value="">— select job —</option>
                    {matrix.jobs.map(j => (
                      <option key={j.role} value={j.role}>{j.role}</option>
                    ))}
                  </select>
                  <label style={st.label} htmlFor="pos-title">NEW POSITION TITLE</label>
                  <input
                    id="pos-title"
                    style={st.input}
                    placeholder="e.g. Sub-Orbital Pilot"
                    value={pos.title}
                    onChange={e => setPos({ ...pos, title: e.target.value })}
                    required
                  />
                  <button type="submit" style={st.cyanBtn}>
                    INJECT POSITION INTO R&S MATRIX
                  </button>
                </form>
                <div style={{ marginTop: '1.5rem' }}>
                  {matrix.jobs.map(j => (
                    <div key={j.role} style={st.ledgerRow}>
                      <span style={st.white}>{j.role}</span>
                      <span style={st.muted}>{(j.positions || []).join(' · ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role === 'overlord' && section === 'override' && (
              <div style={st.card}>
                {(
                  [
                    ['freezeSignIns', 'Freeze all ecosystem sign-ins'],
                    ['maintenanceMode', 'Maintenance mode (customer mesh read-only)'],
                    ['verboseMesh', 'Verbose cognitive mesh logging']
                  ] as Array<[keyof typeof overrides, string]>
                ).map(([key, label]) => (
                  <div key={key} style={st.toggleRow}>
                    <span style={st.toggleLabel}>{label}</span>
                    <button
                      type="button"
                      aria-pressed={overrides[key]}
                      onClick={() => setOverrides({ ...overrides, [key]: !overrides[key] })}
                      style={{
                        ...st.toggleTrack,
                        backgroundColor: overrides[key] ? '#3a0d16' : '#1a1a1a',
                        borderColor: overrides[key]
                          ? ZhonnexTokens.colors.securityFail
                          : '#333'
                      }}
                    >
                      <span
                        style={{
                          ...st.toggleKnob,
                          transform: overrides[key] ? 'translateX(22px)' : 'translateX(0)',
                          backgroundColor: overrides[key]
                            ? ZhonnexTokens.colors.securityFail
                            : '#666'
                        }}
                      />
                    </button>
                  </div>
                ))}
                <button type="button" style={st.redBtn} onClick={saveOverrides}>
                  COMMIT OVERRIDE MATRIX
                </button>
              </div>
            )}

            {role === 'overlord' && section === 'payroll' && (
              <div style={st.card}>
                {queue.map(q => (
                  <div key={q.id} style={st.ledgerRow}>
                    <div>
                      <span style={st.monoCyan}>{q.id}</span>
                      <span style={st.white}> · {q.name}</span>
                      <span style={st.muted}> · {q.amount}</span>
                    </div>
                    <span
                      style={{
                        ...st.pill,
                        color:
                          q.status === 'PAID_TRANSACTION_SETTLED'
                            ? ZhonnexTokens.colors.securityPass
                            : ZhonnexTokens.colors.velocityGold
                      }}
                    >
                      {q.status === 'PAID_TRANSACTION_SETTLED' ? 'PAID & SETTLED' : 'IN QUEUE'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {section === 'comms' && (
              <>
                <div style={st.card}>
                  <h3 style={st.sectionHead}>INBOX — ALL INTERFACES</h3>
                  {comms.length === 0 && (
                    <p style={st.muted}>Mesh silent — no transmissions yet.</p>
                  )}
                  {comms.map(c => (
                    <div key={c.id} style={st.ledgerRow}>
                      <div>
                        <span style={st.monoCyan}>[{c.role}]</span>{' '}
                        <span style={st.white}>{c.subject}</span>
                        <span style={st.muted}> — {c.body}</span>
                        <span style={st.muted}> · {c.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {room && canTransmit(room.menu) && (
                  <div style={st.card}>
                    <h3 style={st.sectionHead}>TRANSMIT DIRECTIVE</h3>
                    <p style={st.muted}>
                      Cleared positions: OVERLORD, MD, SECRETARY. All tracks
                      receive.
                    </p>
                    <form onSubmit={transmit} style={st.form}>
                      <label style={st.label} htmlFor="c-sub">SUBJECT</label>
                      <input id="c-sub" style={st.input} value={commSubject} onChange={e => setCommSubject(e.target.value)} required />
                      <label style={st.label} htmlFor="c-body">MESSAGE / DOCUMENT NOTE</label>
                      <textarea id="c-body" style={{ ...st.input, minHeight: '90px' }} value={commBody} onChange={e => setCommBody(e.target.value)} required />
                      <button type="submit" style={st.cyanBtn}>TRANSMIT ACROSS INTERFACES</button>
                    </form>
                  </div>
                )}
              </>
            )}

            <button
              style={st.backBtn}
              type="button"
              onClick={() => router.back()}
            >
              ← BACK
            </button>
          </>
        )}
      </main>
    </div>
  );
}

const st: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundColor: ZhonnexTokens.colors.voidBlack,
    minHeight: '100vh',
    color: '#fff',
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden'
  },
  main: { maxWidth: '900px', margin: '0 auto', padding: '3rem' },
  titleRow: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  roomTitle: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    color: ZhonnexTokens.colors.imperialCyan,
    fontSize: '1.15rem',
    letterSpacing: '2px',
    margin: 0
  },
  roomBadge: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.6rem',
    letterSpacing: '2px',
    color: ZhonnexTokens.colors.velocityGold,
    border: '1px solid #3a2f10',
    borderRadius: '4px',
    padding: '4px 8px'
  },
  notice: { color: ZhonnexTokens.colors.securityPass, fontSize: '0.85rem', marginBottom: '1rem' },
  error: { color: ZhonnexTokens.colors.securityFail, fontSize: '0.8rem', marginBottom: '0.75rem' },
  sectionHead: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.85rem',
    letterSpacing: '2px',
    color: ZhonnexTokens.colors.imperialCyan,
    margin: '0 0 1rem 0'
  },
  card: {
    backgroundColor: ZhonnexTokens.colors.quantumSlate,
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '1.75rem',
    marginBottom: '1.5rem'
  },
  muted: { color: ZhonnexTokens.colors.textMuted, fontSize: '0.9rem', lineHeight: 1.6 },
  white: { color: '#fff', fontSize: '0.95rem' },
  mono: { fontFamily: 'monospace', fontSize: '0.9rem' },
  monoCyan: { fontFamily: 'monospace', color: ZhonnexTokens.colors.imperialCyan, fontSize: '0.85rem' },
  pill: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.6rem', letterSpacing: '2px', color: ZhonnexTokens.colors.textMuted },
  kvRow: { display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.8rem 0', borderBottom: '1px solid #1a1a1c', fontSize: '0.95rem', flexWrap: 'wrap' },
  kvLabel: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.6rem', letterSpacing: '2px', color: ZhonnexTokens.colors.textMuted },
  ledgerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '0.9rem 0', borderBottom: '1px solid #1a1a1c' },
  statRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  statCard: { flex: '1 1 160px', backgroundColor: '#030303', border: '1px solid #222', borderRadius: '6px', padding: '1.25rem' },
  statNum: { fontSize: '1.5rem', fontFamily: ZhonnexTokens.typography.displayFont, color: ZhonnexTokens.colors.securityPass, fontWeight: 'bold', margin: '0.5rem 0 0 0' },
  logTerminal: { backgroundColor: '#030303', border: '1px solid #333', borderRadius: '6px', padding: '1.25rem', maxHeight: '320px', overflowY: 'auto', fontFamily: 'monospace' },
  logLine: { fontSize: '0.8rem', color: '#aaa', margin: '0.4rem 0', borderBottom: '1px solid #09090b', paddingBottom: '0.4rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.6rem', letterSpacing: '2px', color: ZhonnexTokens.colors.textMuted, marginTop: '0.5rem' },
  input: {
    padding: '12px',
    backgroundColor: '#000',
    border: '1px solid #262626',
    borderRadius: '6px',
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%'
  },
  cyanBtn: {
    marginTop: '1rem',
    padding: '14px',
    width: '100%',
    backgroundColor: ZhonnexTokens.colors.imperialCyan,
    border: 'none',
    color: '#000',
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontWeight: 'bold',
    fontSize: '0.8rem',
    letterSpacing: '2px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  goldBtn: {
    marginTop: '1.25rem',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${ZhonnexTokens.colors.velocityGold}`,
    color: ZhonnexTokens.colors.velocityGold,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.7rem',
    letterSpacing: '2px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  redBtn: {
    marginTop: '1.25rem',
    padding: '14px',
    width: '100%',
    backgroundColor: 'transparent',
    border: `1px solid ${ZhonnexTokens.colors.securityFail}`,
    color: ZhonnexTokens.colors.securityFail,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontWeight: 'bold',
    fontSize: '0.8rem',
    letterSpacing: '2px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid #1a1a1c' },
  toggleLabel: { color: '#ddd', fontSize: '0.9rem' },
  toggleTrack: {
    width: '52px',
    height: '26px',
    borderRadius: '13px',
    border: '1px solid #333',
    position: 'relative' as const,
    cursor: 'pointer',
    flexShrink: 0,
    padding: 0
  },
  toggleKnob: {
    position: 'absolute' as const,
    top: '3px',
    left: '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    transition: 'all 0.2s',
    display: 'block'
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: ZhonnexTokens.colors.textMuted,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.65rem',
    letterSpacing: '2px',
    cursor: 'pointer',
    padding: 0
  }
};
