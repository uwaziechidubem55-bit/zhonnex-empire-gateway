import React, { useState } from 'react';
import { ZhonnexTokens } from '../../config/design-tokens';
import { HeaderNavigation } from '../../components/HeaderNavigation';
import { HamburgerMenu } from '../../components/HamburgerMenu';
import {
  PayrollItem,
  loadPayrollQueue,
  stagePayment
} from '../../config/payroll-queue';

const EMPLOYEES = [
  { name: 'Alexander Thorne', position: 'MX Vector Auditor', tasksDone: 142, salary: '$8,500.00', account: 'IBAN: US77•••1004' },
  { name: 'Seraphina Vance', position: 'Rust Infrastructure SRE', tasksDone: 289, salary: '$12,400.00', account: 'IBAN: US88•••9921' }
];

export default function ManagementMdZone() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [queue, setQueue] = useState<PayrollItem[]>(() => loadPayrollQueue());
  const [notice, setNotice] = useState('');

  const entryFor = (name: string) => queue.find(q => q.name === name);

  const initiatePaymentPipeline = (emp: (typeof EMPLOYEES)[number]) => {
    const updated = stagePayment({
      name: emp.name,
      position: emp.position,
      account: emp.account,
      amount: emp.salary
    });
    setQueue(updated);
    setNotice(
      `💸 Salary allocation for ${emp.name} staged to the Financial Secretary queue.`
    );
  };

  return (
    <div style={styles.pageWrapper}>
      <HeaderNavigation onHamburgerClick={() => setMenuOpen(true)} showHamburger={true} />
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} role="MANAGEMENT_MD" />

      <main style={styles.mainContent}>
        <div style={styles.welcomeBanner}>
          <h1 style={styles.title}>MANAGING DIRECTOR DIRECTORATE</h1>
          <span style={styles.holdingsBadge}>ZHONNEX SUB-HOLDINGS BOARD</span>
        </div>

        {notice && <p style={styles.notice}>{notice}</p>}

        {/* AUTOMATED SUBSIDIARY EXPIRY TRACKER */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Global Subsidiary Registry & License Enforcement</h3>
          <div style={styles.registryGrid}>
            <div style={styles.companyRow}>
              <div><strong>Zhonnex Premium Logistics Corp</strong><br /><span style={styles.metaText}>Status: active • Recurring License Balance Clear</span></div>
            </div>
          </div>
        </div>

        {/* WORKFORCE PERFORMANCE & COMPENSATION LEVERAGE */}
        <div style={{ ...styles.card, marginTop: '2rem' }}>
          <h3 style={styles.cardTitle}>Workforce Productivity Tracker & Payment Hub</h3>
          <p style={styles.hintText}>
            Initiating a payment stages it into the shared executive queue —
            the Treasury Secretary executes the final wire from her terminal.
          </p>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th>Employee Name</th>
                  <th>Assigned Position</th>
                  <th>Tasks Completed</th>
                  <th>Contract Salary</th>
                  <th>Pipeline Action</th>
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map(emp => {
                  const entry = entryFor(emp.name);
                  return (
                    <tr key={emp.name} style={styles.trRow}>
                      <td><strong>{emp.name}</strong></td>
                      <td>{emp.position}</td>
                      <td style={{ color: ZhonnexTokens.colors.imperialCyan, fontFamily: 'monospace' }}>{emp.tasksDone} Units</td>
                      <td>{emp.salary}</td>
                      <td>
                        {!entry ? (
                          <button onClick={() => initiatePaymentPipeline(emp)} style={styles.initiateBtn}>Initiate Payment</button>
                        ) : entry.status === 'STAGED_FOR_SECRETARY' ? (
                          <span style={styles.stagedBadge}>STAGED IN QUEUE</span>
                        ) : (
                          <span style={styles.paidBadge}>✓ PAID & SETTLED</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: { backgroundColor: ZhonnexTokens.colors.voidBlack, minHeight: '100vh', color: '#fff' },
  mainContent: { padding: '3rem', maxWidth: '1200px', margin: '0 auto' },
  welcomeBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #121214', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '1.6rem', color: ZhonnexTokens.colors.velocityGold, margin: 0 },
  holdingsBadge: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.75rem', color: '#fff', border: '1px solid #444', padding: '4px 10px', borderRadius: '4px' },
  notice: { color: ZhonnexTokens.colors.securityPass, fontSize: '0.85rem', marginBottom: '1.5rem' },
  card: { backgroundColor: ZhonnexTokens.colors.quantumSlate, border: '1px solid #222', borderRadius: '8px', padding: '2rem' },
  cardTitle: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '1.1rem', marginTop: 0, borderBottom: '1px solid #1a1a1c', paddingBottom: '0.8rem', color: ZhonnexTokens.colors.imperialCyan },
  hintText: { color: ZhonnexTokens.colors.textMuted, fontSize: '0.85rem', marginTop: '0.75rem' },
  registryGrid: { marginTop: '1.5rem' },
  companyRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#030303', padding: '1.2rem', borderRadius: '6px', border: '1px solid #222', flexWrap: 'wrap', gap: '0.5rem' },
  metaText: { fontSize: '0.8rem', color: ZhonnexTokens.colors.securityPass },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', marginTop: '1.5rem', borderCollapse: 'collapse' },
  thRow: { textAlign: 'left', borderBottom: '2px solid #222', color: '#666', fontSize: '0.85rem', fontFamily: ZhonnexTokens.typography.displayFont, height: '40px' },
  trRow: { borderBottom: '1px solid #1a1a1c', height: '55px', fontSize: '0.95rem' },
  initiateBtn: { backgroundColor: 'transparent', border: `1px solid ${ZhonnexTokens.colors.velocityGold}`, color: ZhonnexTokens.colors.velocityGold, padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
  stagedBadge: { color: ZhonnexTokens.colors.textMuted, fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 'bold' },
  paidBadge: { color: ZhonnexTokens.colors.securityPass, fontSize: '0.8rem', fontWeight: 'bold' }
};
