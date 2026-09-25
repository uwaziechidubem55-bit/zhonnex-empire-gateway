import React, { useState } from 'react';
import { ZhonnexTokens } from '../../config/design-tokens';
import { HeaderNavigation } from '../../components/HeaderNavigation';
import { HamburgerMenu } from '../../components/HamburgerMenu';

export default function ManagementSecretaryZone() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [queue, setQueue] = useState([
    { id: "PAY-991", name: "Alexander Thorne", account: "IBAN: US77•••1004", amount: "\$8,500.00", status: "AWAITING_SECRETARY_CLEARANCE" },
    { id: "PAY-992", name: "Seraphina Vance", account: "IBAN: US88•••9921", amount: "\$12,400.00", status: "AWAITING_SECRETARY_CLEARANCE" }
  ]);

  const releaseStripeFunds = (index: number) => {
    const updated = [...queue];
    updated[index].status = "PAID_TRANSACTION_SETTLED";
    setQueue(updated);
    alert(`💸 STRIPE WIRE SUCCESSFUL: Funds released to ${updated[index].name}. System state updated to PAID.`);
  };

  return (
    <div style={styles.pageWrapper}>
      <HeaderNavigation onHamburgerClick={() => setMenuOpen(true)} showHamburger={true} />
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} role="MANAGEMENT_SECRETARY" />
      
      <main style={styles.mainContent}>
        <div style={styles.welcomeBanner}>
          <h1 style={styles.title}>TREASURY SECRETARY DISBURSEMENT</h1>
          <span style={styles.statusBadge}>STRIPE BANKING CONTEXT LINKED</span>
        </div>

        {/* FINAL PAYOUT CLEARANCE TERMINAL */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>MD-Approved Executive Payroll Distribution Queue</h3>
          <p style={styles.textLight}>The following items have been signed by the Managing Director. Execute final transmission clearance below.</p>
          
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th>Transaction Token</th>
                <th>Employee Recipient</th>
                <th>Target Bank Routing</th>
                <th>Disbursement Gross</th>
                <th>Action Clearance</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item, i) => (
                <tr key={i} style={styles.trRow}>
                  <td style={{fontFamily: 'monospace', color: '#666'}}>{item.id}</td>
                  <td><strong>{item.name}</strong></td>
                  <td style={{fontFamily: 'monospace', fontSize: '0.85rem'}}>{item.account}</td>
                  <td style={{color: ZhonnexTokens.colors.securityPass, fontWeight: 'bold'}}>{item.amount}</td>
                  <td>
                    {item.status === 'AWAITING_SECRETARY_CLEARANCE' ? (
                      <button onClick={() => releaseStripeFunds(i)} style={styles.executeBtn}>Execute Payout & Wire</button>
                    ) : (
                      <span style={styles.paidBadge}>✓ PAID & SETTLED</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: { backgroundColor: ZhonnexTokens.colors.voidBlack, minHeight: '100vh', color: '#fff' },
  mainContent: { padding: '3rem', maxWidth: '1200px', margin: '0 auto' },
  welcomeBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #121214', paddingBottom: '1.5rem' },
  title: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '1.6rem', color: ZhonnexTokens.colors.securityPass, margin: 0 },
  statusBadge: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.75rem', color: ZhonnexTokens.colors.imperialCyan, border: `1px solid ${ZhonnexTokens.colors.imperialCyan}`, padding: '4px 10px', borderRadius: '4px' },
  card: { backgroundColor: ZhonnexTokens.colors.quantumSlate, border: '1px solid #222', borderRadius: '8px', padding: '2rem' },
  cardTitle: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '1.1rem', marginTop: 0, borderBottom: '1px solid #1a1a1c', paddingBottom: '0.8rem' },
  textLight: { color: ZhonnexTokens.colors.textLight, fontSize: '0.9rem', marginTop: '0.5rem' },
  table: { width: '100%', marginTop: '1.5rem', borderCollapse: 'collapse' },
  thRow: { textAlign: 'left', borderBottom: '2px solid #222', color: '#666', fontSize: '0.85rem', fontFamily: ZhonnexTokens.typography.displayFont, height: '40px' },
  trRow: { borderBottom: '1px solid #1a1a1c', height: '55px', fontSize: '0.95rem' },
  executeBtn: { backgroundColor: 'transparent', border: `1px solid ${ZhonnexTokens.colors.securityPass}`, color: ZhonnexTokens.colors.securityPass, padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
  paidBadge: { color: ZhonnexTokens.colors.securityPass, fontSize: '0.85rem', fontWeight: 'bold', fontFamily: ZhonnexTokens.typography.displayFont }
};
