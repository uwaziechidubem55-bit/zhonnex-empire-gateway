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
    dossier: { title: 'EMPLOYEE DOSSIER & CREDENTIAL', badge: 'STAFF', menu: 'STAFF' },
    compensation: { title: 'COMPENSATION & DIRECT DEPOSIT', badge: 'PAYROLL', menu: 'STAFF' },
    metrics: { title: 'OPERATIONAL METRICS PIPELINE', badge: 'LIVE', menu: 'STAFF' },
    'vector-feed': { title: 'MX SUITE TRACKING VECTOR FEED', badge: 'TELEMETRY', menu: 'STAFF' },
    escalation: { title: 'SECURITY THREAT ESCALATION', badge: 'PRIORITY', menu: 'STAFF' }
  },
  md: {
    holdings: { title: 'HOLDINGS MATRIX', badge: 'COMPANY REGISTRY', menu: 'MANAGEMENT_MD' },
    productivity: { title: 'PRODUCTIVITY TRACKER & TASK METRICS', badge: 'WORKFORCE', menu: 'MANAGEMENT_MD' },
    'role-config': { title: 'ROLE CONFIGURATION MATRIX', badge: 'TRACKS', menu: 'MANAGEMENT_MD' }
  },
  secretary: {
    holdings: { title: 'HOLDINGS MATRIX', badge: 'READ-ONLY', menu: 'MANAGEMENT_SECRETARY' },
    audit: { title: 'TASK COUNTER AUDIT RECORDS', badge: 'AUDIT', menu: 'MANAGEMENT_SECRETARY' }
  },
  overlord: {
    logs: { title: 'ABSOLUTE SYSTEM LOG MATRIX', badge: 'EVERY ACTIVITY', menu: 'OVERLORD' },
    telemetry: { title: 'EMPIRE FINANCIAL TELEMETRY', badge: 'GROSS CASH', menu: 'OVERLORD' },
    'price-matrix': { title: 'MASTER PRICE MATRIX CORE', badge: 'GLOBAL OVERRIDE', menu: 'OVERLORD' },
    positions: { title: 'POSITION CREATOR PANEL', badge: 'R&S INJECTION', menu: 'OVERLORD' },
    override: { title: 'GLOBAL OVERRIDE MATRIX', badge: 'KILL SWITCHES', menu: 'OVERLORD' },
    payroll: { title: 'MASTER PAYROLL SCHEDULER', badge: 'OBSERVE', menu: 'OVERLORD' }
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
  const [pos, setPos] = useState({ role: '', division: '', loc: 'Remote', type: 'FULL-TIME' });

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
    if (!pos.role.trim() || !pos.division.trim()) return;
    const jobs = [
      ...matrix.jobs,
      { role: pos.role.trim(), division: pos.division.trim(), loc: pos.loc, type: pos.type }
    ];
    publishMatrix({ ...matrix, jobs });
    setPos({ role: '', division: '', loc: 'Remote', type: 'FULL-TIME' });
    setNotice('POSITION INJECTED — vacancy now live in the customer Jobs room.');
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
                  <label style={st.label} htmlFor="pos-role">ROLE TITLE</label>
                  <input
                    id="pos-role"
                    style={st.input}
                    placeholder="e.g. Sub-Orbital Pilot"
                    value={pos.role}
                    onChange={e => setPos({ ...pos, role: e.target.value })}
                    required
                  />
                  <label style={st.label} htmlFor="pos-div">DIVISION</label>
                  <input
                    id="pos-div"
                    style={st.input}
                    placeholder="e.g. MX SUITE LOGISTICS"
                    value={pos.division}
                    onChange={e => setPos({ ...pos, division: e.target.value })}
                    required
                  />
                  <label style={st.label} htmlFor="pos-type">TRACK / TYPE</label>
                  <select
                    id="pos-type"
                    style={st.input}
                    value={pos.type}
                    onChange={e => setPos({ ...pos, type: e.target.value })}
                  >
                    <option>FULL-TIME</option>
                    <option>CONTRACT</option>
                  </select>
                  <button type="submit" style={st.cyanBtn}>
                    INJECT POSITION INTO R&S MATRIX
                  </button>
                </form>
                <div style={{ marginTop: '1.5rem' }}>
                  {matrix.jobs.map(j => (
                    <div key={j.role} style={st.ledgerRow}>
                      <span style={st.white}>{j.role}</span>
                      <span style={st.muted}>{j.division} · {j.type}</span>
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
