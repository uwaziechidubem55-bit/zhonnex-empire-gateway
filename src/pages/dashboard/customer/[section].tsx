import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { ZhonnexTokens } from '../../../config/design-tokens';
import { HeaderNavigation } from '../../../components/HeaderNavigation';
import { HamburgerMenu } from '../../../components/HamburgerMenu';
import { useIsMobile } from '../../../hooks/useIsMobile';

/* ------------------------------------------------------------------ */
/* Customer rooms — one dynamic page serves every hamburger link.     */
/* Routes: /dashboard/customer/{billing|products|offers|help|privacy| */
/*         terms|jobs|ads}                                            */
/* ------------------------------------------------------------------ */

const ROOMS: Record<string, { title: string; badge: string }> = {
  billing: { title: 'BILLING LEDGER', badge: 'READ-ONLY' },
  products: { title: 'PRODUCTS VAULT', badge: 'LICENSES' },
  offers: { title: 'EXCLUSIVE OFFERS & UPGRADES', badge: 'CUSTOMER TIER' },
  help: { title: 'HELP CENTER & SUPPORT', badge: 'TICKETS OPEN' },
  privacy: { title: 'PRIVACY SETTINGS & MFA', badge: 'SHIELD MATRIX' },
  terms: { title: 'TERMS & CONDITIONS', badge: 'v2.4' },
  jobs: { title: 'JOB OPTIONS & OPENINGS', badge: 'CAREERS NODE' },
  ads: { title: 'ZHONNEX AD STATION', badge: 'REWARD FEED' }
};

/* Pre-render every known room so SSR HTML contains the real content;
   unknown sections server-render on demand (fallback: blocking). */
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(ROOMS).map(section => ({ params: { section } })),
  fallback: 'blocking'
});

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const BILLING_ROWS = [
  { date: '2026-09-24', ref: 'ZX-INV-8841', desc: 'Empire Gateway Platform Fee', amount: '₦ 12,500.00', status: 'SETTLED' },
  { date: '2026-09-18', ref: 'ZX-INV-8790', desc: 'Velocity Finance Engine — Cycle 09', amount: '₦ 48,000.00', status: 'SETTLED' },
  { date: '2026-09-11', ref: 'ZX-INV-8732', desc: 'MX Suite Logistics Core Add-On', amount: '₦ 22,750.00', status: 'PENDING' },
  { date: '2026-09-02', ref: 'ZX-INV-8688', desc: 'Cognitive Mesh Uplink Renewal', amount: '₦ 15,000.00', status: 'SETTLED' }
];

const PRODUCTS = [
  { name: 'Empire Gateway Core', key: 'ZX-CORE-9917-EMPIRE', seats: '1 Terminal', expiry: '2027-01-01', status: 'ACTIVE' },
  { name: 'Velocity Finance Engine', key: 'ZX-VEL-4410-FINANCE', seats: '3 Operators', expiry: '2026-12-15', status: 'ACTIVE' },
  { name: 'MX Suite Logistics Core', key: 'ZX-MXS-2280-LOGISTICS', seats: '5 Fleet Nodes', expiry: '2026-10-30', status: 'EXPIRING' }
];

const OFFERS = [
  { tier: 'GOLD TIER UPLIFT', perk: 'Zero platform fees for 90 days plus priority mesh routing on every transaction pipeline.' },
  { tier: 'FLEET EXPANSION PACK', perk: 'Add 10 extra MX Suite logistics nodes at 40% below the standard rate.' }
];

const JOBS = [
  { role: 'Vector Guidance Analyst', division: 'MX SUITE LOGISTICS', loc: 'Onitsha HQ / Remote', type: 'FULL-TIME' },
  { role: 'Ledger Integrity Auditor', division: 'VELOCITY FINANCE', loc: 'Remote', type: 'CONTRACT' },
  { role: 'Cognitive Mesh Trainer', division: 'GENERATIONAL MESH', loc: 'Lagos Node', type: 'FULL-TIME' }
];

export default function CustomerRoom() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const section =
    typeof router.query.section === 'string' ? router.query.section : '';
  const room = ROOMS[section];

  /* help-center form state */
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [ticketId, setTicketId] = useState('');

  /* privacy state */
  const [privacy, setPrivacy] = useState({
    mfa: true,
    emailTelemetry: true,
    biometric: false
  });

  const submitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket.subject.trim() || !ticket.message.trim()) return;
    setTicketId(`ZX-TKT-${Math.floor(1000 + Math.random() * 9000)}`);
    setTicket({ subject: '', message: '' });
  };

  return (
    <div style={styles.pageWrapper}>
      <HeaderNavigation
        onHamburgerClick={() => setMenuOpen(true)}
        showHamburger={true}
      />
      <HamburgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        role="CUSTOMER"
      />

      <main
        style={{ ...styles.main, padding: isMobile ? '2rem 1.1rem' : '3rem' }}
      >
        {!room ? (
          <div style={styles.card}>
            <h1 style={{ ...styles.roomTitle, color: ZhonnexTokens.colors.securityFail }}>
              SIGNAL LOST
            </h1>
            <p style={styles.muted}>
              Unknown room coordinate. Return to the workspace and re-select a
              directory entry.
            </p>
            <button
              style={styles.backBtn}
              type="button"
              onClick={() => router.push('/dashboard/customer')}
            >
              ← BACK TO WORKSPACE
            </button>
          </div>
        ) : (
          <>
            <div style={styles.titleRow}>
              <h1 style={styles.roomTitle}>{room.title}</h1>
              <span style={styles.roomBadge}>{room.badge}</span>
            </div>
            {notice && <p style={styles.notice}>{notice}</p>}

            {section === 'billing' && (
              <div style={styles.card}>
                <p style={styles.muted}>
                  Atomic cash-transaction trace. Ledger is read-only for
                  customer tier — modifications require Management clearance.
                </p>
                {BILLING_ROWS.map(row => (
                  <div key={row.ref} style={styles.ledgerRow}>
                    <div style={styles.ledgerLeft}>
                      <span style={styles.ledgerRef}>{row.ref}</span>
                      <span style={styles.ledgerDesc}>{row.desc}</span>
                      <span style={styles.ledgerDate}>{row.date}</span>
                    </div>
                    <div style={styles.ledgerRight}>
                      <span style={styles.ledgerAmount}>{row.amount}</span>
                      <span
                        style={{
                          ...styles.statusPill,
                          color:
                            row.status === 'SETTLED'
                              ? ZhonnexTokens.colors.securityPass
                              : ZhonnexTokens.colors.velocityGold
                        }}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section === 'products' && (
              <div style={styles.card}>
                {PRODUCTS.map(p => (
                  <div key={p.key} style={styles.productCard}>
                    <div style={styles.productHead}>
                      <span style={styles.productName}>{p.name}</span>
                      <span
                        style={{
                          ...styles.statusPill,
                          color:
                            p.status === 'ACTIVE'
                              ? ZhonnexTokens.colors.securityPass
                              : ZhonnexTokens.colors.velocityGold
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div style={styles.licenseKey}>{p.key}</div>
                    <div style={styles.productMeta}>
                      {p.seats} · Expires {p.expiry}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section === 'offers' && (
              <div style={styles.card}>
                {OFFERS.map(o => (
                  <div key={o.tier} style={styles.offerCard}>
                    <div style={styles.offerTier}>{o.tier}</div>
                    <p style={styles.muted}>{o.perk}</p>
                    <button
                      type="button"
                      style={styles.goldBtn}
                      onClick={() =>
                        setNotice(`${o.tier} request logged to Management queue.`)
                      }
                    >
                      REQUEST UPGRADE
                    </button>
                  </div>
                ))}
              </div>
            )}

            {section === 'help' && (
              <div style={styles.card}>
                <div style={styles.faqItem}>
                  <span style={styles.faqQ}>How do I reset my ID Key?</span>
                  <span style={styles.muted}>
                    Open a ticket below. Management rotates keys within one
                    mesh cycle (24h).
                  </span>
                </div>
                <div style={styles.faqItem}>
                  <span style={styles.faqQ}>Why is a bill PENDING?</span>
                  <span style={styles.muted}>
                    Pending entries settle atomically at cycle close — usually
                    under 12 hours.
                  </span>
                </div>

                {ticketId && (
                  <p style={styles.notice}>
                    Ticket {ticketId} opened — support mesh notified.
                  </p>
                )}
                <form onSubmit={submitTicket} style={styles.form}>
                  <label style={styles.label} htmlFor="t-subject">SUBJECT</label>
                  <input
                    id="t-subject"
                    style={styles.input}
                    placeholder="Short summary of the issue"
                    value={ticket.subject}
                    onChange={e =>
                      setTicket({ ...ticket, subject: e.target.value })
                    }
                    required
                  />
                  <label style={styles.label} htmlFor="t-message">MESSAGE</label>
                  <textarea
                    id="t-message"
                    style={{ ...styles.input, minHeight: '110px', resize: 'vertical' }}
                    placeholder="Describe the issue with as much detail as possible"
                    value={ticket.message}
                    onChange={e =>
                      setTicket({ ...ticket, message: e.target.value })
                    }
                    required
                  />
                  <button type="submit" style={styles.cyanBtn}>
                    OPEN SUPPORT TICKET
                  </button>
                </form>
              </div>
            )}

            {section === 'privacy' && (
              <div style={styles.card}>
                {(
                  [
                    ['mfa', 'Two-Factor Authentication (MFA)'],
                    ['emailTelemetry', 'Email activity summaries'],
                    ['biometric', 'Biometric quick-sign on trusted devices']
                  ] as Array<[keyof typeof privacy, string]>
                ).map(([key, label]) => (
                  <div key={key} style={styles.toggleRow}>
                    <span style={styles.toggleLabel}>{label}</span>
                    <button
                      type="button"
                      aria-pressed={privacy[key]}
                      onClick={() =>
                        setPrivacy({ ...privacy, [key]: !privacy[key] })
                      }
                      style={{
                        ...styles.toggleTrack,
                        backgroundColor: privacy[key] ? '#003a40' : '#1a1a1a',
                        borderColor: privacy[key]
                          ? ZhonnexTokens.colors.imperialCyan
                          : '#333'
                      }}
                    >
                      <span
                        style={{
                          ...styles.toggleKnob,
                          transform: privacy[key]
                            ? 'translateX(22px)'
                            : 'translateX(0)',
                          backgroundColor: privacy[key]
                            ? ZhonnexTokens.colors.imperialCyan
                            : '#666'
                        }}
                      />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  style={styles.cyanBtn}
                  onClick={() => setNotice('Privacy matrix saved to your profile.')}
                >
                  SAVE PRIVACY MATRIX
                </button>
              </div>
            )}

            {section === 'terms' && (
              <div style={{ ...styles.card, maxHeight: '60vh', overflowY: 'auto' }}>
                <div style={styles.faqItem}>
                  <span style={styles.faqQ}>1. Ecosystem Access</span>
                  <span style={styles.muted}>
                    Access is licensed per Zhonnex ID Key and is non-transferable.
                    Shared keys are frozen automatically by the security mesh.
                  </span>
                </div>
                <div style={styles.faqItem}>
                  <span style={styles.faqQ}>2. Transaction Finality</span>
                  <span style={styles.muted}>
                    All ledger entries are atomic and final at cycle close.
                    Reversals require Management MD countersignature.
                  </span>
                </div>
                <div style={styles.faqItem}>
                  <span style={styles.faqQ}>3. Data Sovereignty</span>
                  <span style={styles.muted}>
                    Customer telemetry is encrypted at rest and never sold.
                    Privacy matrix choices override all default pipelines.
                  </span>
                </div>
                <div style={styles.faqItem}>
                  <span style={styles.faqQ}>4. Termination</span>
                  <span style={styles.muted}>
                    Either party may terminate with one cycle notice. Settled
                    ledger history remains available read-only for 7 years.
                  </span>
                </div>
              </div>
            )}

            {section === 'jobs' && (
              <div style={styles.card}>
                {JOBS.map(j => (
                  <div key={j.role} style={styles.jobCard}>
                    <div style={styles.productHead}>
                      <span style={styles.productName}>{j.role}</span>
                      <span style={styles.roomBadge}>{j.type}</span>
                    </div>
                    <div style={styles.productMeta}>
                      {j.division} · {j.loc}
                    </div>
                    <button
                      type="button"
                      style={styles.goldBtn}
                      onClick={() =>
                        setNotice(`Application for ${j.role} routed to HR mesh.`)
                      }
                    >
                      APPLY
                    </button>
                  </div>
                ))}
              </div>
            )}

            {section === 'ads' && (
              <div style={styles.card}>
                <div style={styles.rewardBanner}>
                  <h3 style={styles.rewardTitle}>
                    ⚡ ZHONNEX INCENTIVIZED REWARD MATRIX
                  </h3>
                  <p style={styles.muted}>
                    Engage with premium corporate updates below to instantly
                    credit your Zhonnex ID with 100 free Core API tokens.
                  </p>
                </div>
                <div style={styles.adSlotFrame}>
                  <p style={styles.adLabel}>ADVERTISEMENT SPONSOR PORTAL</p>
                  <div style={styles.adBox}>
                    <span style={styles.muted}>
                      Sponsor slot reserved — network feed goes live here.
                    </span>
                  </div>
                </div>
                <div style={styles.tokenCard}>
                  <h4 style={styles.productName}>Your Ad-Earned Utility Ledger</h4>
                  <p style={styles.tokenCount}>+400 Tokens Available</p>
                </div>
              </div>
            )}

            <button
              style={styles.backBtn}
              type="button"
              onClick={() => router.push('/dashboard/customer')}
            >
              ← BACK TO WORKSPACE
            </button>
          </>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundColor: ZhonnexTokens.colors.voidBlack,
    minHeight: '100vh',
    color: '#ffffff',
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden'
  },
  main: { maxWidth: '900px', margin: '0 auto', padding: '3rem' },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem'
  },
  roomTitle: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    color: ZhonnexTokens.colors.imperialCyan,
    fontSize: '1.2rem',
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
  notice: {
    color: ZhonnexTokens.colors.securityPass,
    fontFamily: ZhonnexTokens.typography.primaryFont,
    fontSize: '0.85rem',
    marginBottom: '1rem'
  },
  card: {
    backgroundColor: ZhonnexTokens.colors.quantumSlate,
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '1.75rem',
    marginBottom: '1.5rem'
  },
  muted: {
    color: ZhonnexTokens.colors.textMuted,
    fontFamily: ZhonnexTokens.typography.primaryFont,
    fontSize: '0.9rem',
    lineHeight: 1.6,
    display: 'block'
  },
  ledgerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    padding: '1rem 0',
    borderBottom: '1px solid #1a1a1c'
  },
  ledgerLeft: { display: 'flex', flexDirection: 'column', gap: '2px' },
  ledgerRef: {
    fontFamily: 'monospace',
    color: ZhonnexTokens.colors.imperialCyan,
    fontSize: '0.8rem'
  },
  ledgerDesc: { color: '#fff', fontSize: '0.95rem' },
  ledgerDate: { color: '#666', fontSize: '0.75rem' },
  ledgerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  ledgerAmount: { fontFamily: 'monospace', fontSize: '0.95rem' },
  statusPill: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.6rem',
    letterSpacing: '2px'
  },
  productCard: {
    border: '1px solid #262626',
    borderRadius: '6px',
    padding: '1.25rem',
    marginBottom: '1rem',
    backgroundColor: '#030303'
  },
  productHead: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  productName: {
    color: '#fff',
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.9rem',
    letterSpacing: '1px'
  },
  licenseKey: {
    fontFamily: 'monospace',
    color: ZhonnexTokens.colors.imperialCyan,
    margin: '0.6rem 0 0.3rem 0',
    fontSize: '0.9rem',
    wordBreak: 'break-all' as const
  },
  productMeta: { color: '#777', fontSize: '0.8rem' },
  offerCard: {
    borderLeft: `4px solid ${ZhonnexTokens.colors.velocityGold}`,
    backgroundColor: '#030303',
    borderRadius: '4px',
    padding: '1.25rem',
    marginBottom: '1rem'
  },
  offerTier: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    color: ZhonnexTokens.colors.velocityGold,
    letterSpacing: '2px',
    fontSize: '0.85rem',
    marginBottom: '0.5rem'
  },
  goldBtn: {
    marginTop: '0.75rem',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${ZhonnexTokens.colors.velocityGold}`,
    color: ZhonnexTokens.colors.velocityGold,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.7rem',
    letterSpacing: '2px',
    borderRadius: '6px',
    cursor: 'pointer'
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
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' },
  label: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.6rem',
    letterSpacing: '2px',
    color: ZhonnexTokens.colors.textMuted,
    marginTop: '0.5rem'
  },
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
  faqItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    padding: '1rem 0',
    borderBottom: '1px solid #1a1a1c'
  },
  faqQ: {
    color: '#fff',
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.85rem',
    letterSpacing: '1px'
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.9rem 0',
    borderBottom: '1px solid #1a1a1c'
  },
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
  jobCard: {
    border: '1px solid #262626',
    borderRadius: '6px',
    padding: '1.25rem',
    marginBottom: '1rem',
    backgroundColor: '#030303'
  },
  rewardBanner: {
    backgroundColor: '#030303',
    borderLeft: `4px solid ${ZhonnexTokens.colors.imperialCyan}`,
    padding: '1.25rem',
    borderRadius: '4px',
    marginBottom: '1.5rem'
  },
  rewardTitle: {
    color: '#fff',
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.9rem',
    letterSpacing: '1px',
    margin: '0 0 0.5rem 0'
  },
  adSlotFrame: {
    border: '1px solid #333',
    padding: '1.5rem',
    borderRadius: '6px',
    backgroundColor: '#09090b',
    textAlign: 'center' as const
  },
  adLabel: {
    fontSize: '0.7rem',
    color: '#444',
    letterSpacing: '2px',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  adBox: {
    minHeight: '90px',
    backgroundColor: '#030303',
    border: '1px dashed #262626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  tokenCard: { marginTop: '1.5rem', borderTop: '1px solid #222', paddingTop: '1.25rem' },
  tokenCount: {
    fontSize: '1.4rem',
    color: ZhonnexTokens.colors.securityPass,
    fontWeight: 'bold',
    margin: '0.5rem 0 0 0'
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