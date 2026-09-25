import React, { useState } from 'react';
import { ZhonnexTokens } from '../../config/design-tokens';
import { HeaderNavigation } from '../../components/HeaderNavigation';
import { HamburgerMenu } from '../../components/HamburgerMenu';

export default function StaffDashboardZone() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: "T-901", description: "Validate anomalous velocity deviation on tracking path vector ZNX-SHUTTLE-04.", urgency: "HIGH" }
  ]);

  return (
    <div style={styles.pageWrapper}>
      <HeaderNavigation onHamburgerClick={() => setMenuOpen(true)} showHamburger={true} />
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} role="STAFF" />
      
      <main style={styles.mainContent}>
        <div style={styles.welcomeBanner}>
          <h1 style={styles.title}>STAFF OPERATIONAL TERMINAL</h1>
          <span style={styles.deptBadge}>MX SUITE — TRAFFIC ROUTING DIVISION</span>
        </div>

        {/* COMPREHENSIVE AUTOMATED TASK MANIFEST SYSTEM */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Active Production Tasks Manifest</h3>
          {tasks.length > 0 ? (
            <div style={styles.taskList}>
              {tasks.map(task => (
                <div key={task.id} style={styles.taskCard}>
                  <div style={styles.taskMeta}>
                    <span style={styles.taskSelector}>ID: {task.id}</span>
                    <span style={styles.urgencyLabel}>{task.urgency} PRIORITY</span>
                  </div>
                  <p style={styles.taskText}>{task.description}</p>
                  <button onClick={() => setTasks([])} style={styles.actionBtn}>Mark Task Resolved & Log to Core</button>
                </div>
              ))}
            </div>
          ) : (
            /* 🛡️ NOMINAL NOMINAL SHIELD SHOWN IF ACTIONS ARE CLEAR */
            <div style={styles.nominalShield}>
              <div style={styles.shieldIcon}>🛡️</div>
              <h4>SYSTEM COGNITION STATUS: NOMINAL</h4>
              <p>All automated infrastructure processes clearing validation rules. Zero manual tasks pending.</p>
            </div>
          )}
        </div>

        {/* WORKFORCE PAYROLL DEPOSIT INGESTION BOARD */}
        <div style={{...styles.card, marginTop: '2rem'}}>
          <h3 style={styles.cardTitle}>Direct Salary Remittance & Payroll Dossier</h3>
          <p style={styles.textLight}>Input or modify your corporate routing parameters. Financial payouts are handled securely via Stripe banking gates.</p>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}><label style={styles.label}>Corporate Employee Legal Name</label><input type="text" defaultValue="Alexander Thorne" style={styles.input} readOnly /></div>
            <div style={styles.formGroup}><label style={styles.label}>Global Bank Routing Key / BIC</label><input type="text" placeholder="STRXUS33XXX" style={styles.input} /></div>
            <div style={styles.formGroup}><label style={styles.label}>International Bank Account Number (IBAN)</label><input type="text" placeholder="US7719002283991004" style={styles.input} /></div>
            <button style={styles.saveBtn}>Lock Payout Configuration</button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: { backgroundColor: ZhonnexTokens.colors.voidBlack, minHeight: '100vh', color: '#fff' },
  mainContent: { padding: '3rem', maxWidth: '1200px', margin: '0 auto' },
  welcomeBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #121214', paddingBottom: '1.5rem' },
  title: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '1.6rem', color: ZhonnexTokens.colors.velocityGold, margin: 0 },
  deptBadge: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.75rem', color: ZhonnexTokens.colors.imperialCyan, border: `1px solid ${ZhonnexTokens.colors.imperialCyan}`, padding: '4px 10px', borderRadius: '4px' },
  card: { backgroundColor: ZhonnexTokens.colors.quantumSlate, border: '1px solid #222', borderRadius: '8px', padding: '2rem' },
  cardTitle: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '1.1rem', marginTop: 0, borderBottom: '1px solid #1a1a1c', paddingBottom: '0.8rem' },
  taskList: { marginTop: '1.5rem' },
  taskCard: { backgroundColor: '#030303', borderLeft: `4px solid ${ZhonnexTokens.colors.securityFail}`, padding: '1.5rem', borderRadius: '4px' },
  taskMeta: { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'monospace' },
  taskSelector: { color: '#666' },
  urgencyLabel: { color: ZhonnexTokens.colors.securityFail, fontWeight: 'bold' },
  taskText: { margin: '1rem 0', fontSize: '0.95rem', color: '#ccc' },
  actionBtn: { backgroundColor: 'transparent', border: `1px solid ${ZhonnexTokens.colors.securityPass}`, color: ZhonnexTokens.colors.securityPass, padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  nominalShield: { textAlign: 'center', padding: '3rem 1rem', color: ZhonnexTokens.colors.securityPass },
  shieldIcon: { fontSize: '3rem', marginBottom: '1rem' },
  textLight: { color: ZhonnexTokens.colors.textLight, fontSize: '0.9rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.8rem', color: '#888', fontFamily: ZhonnexTokens.typography.displayFont },
  input: { padding: '12px', backgroundColor: '#030303', border: '1px solid #333', borderRadius: '4px', color: '#fff' },
  saveBtn: { gridColumn: 'span 2', padding: '14px', backgroundColor: 'transparent', border: `1px solid ${ZhonnexTokens.colors.velocityGold}`, color: ZhonnexTokens.colors.velocityGold, fontFamily: ZhonnexTokens.typography.displayFont, cursor: 'pointer', borderRadius: '4px', marginTop: '1rem' }
};
