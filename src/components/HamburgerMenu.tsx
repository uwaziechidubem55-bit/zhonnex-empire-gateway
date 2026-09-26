import React from 'react';
import { useRouter } from 'next/router';
import { ZhonnexTokens } from '../config/design-tokens';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'CUSTOMER' | 'STAFF' | 'MANAGEMENT_MD' | 'MANAGEMENT_SECRETARY' | 'OVERLORD';
}

/* Customer directory entries are live routes served by
   src/pages/dashboard/customer/[section].tsx */
const CUSTOMER_LINKS: Array<{ label: string; path: string }> = [
  { label: '📁 Billing Ledger (Read-Only)', path: '/dashboard/customer/billing' },
  { label: '📦 Products Vault (Licenses)', path: '/dashboard/customer/products' },
  { label: '💎 Exclusive Offers & Upgrades', path: '/dashboard/customer/offers' },
  { label: '🛠️ Help Center & Support Tickets', path: '/dashboard/customer/help' },
  { label: '🛡️ Privacy Settings & MFA', path: '/dashboard/customer/privacy' },
  { label: '📜 Terms & Conditions (v2.4)', path: '/dashboard/customer/terms' },
  { label: '💼 Job Options & Openings', path: '/dashboard/customer/jobs' },
  { label: '📺 Zhonnex Ad Station', path: '/dashboard/customer/ads' }
];

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, role }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const goTo = (path: string) => {
    onClose();
    router.push(path);
  };

  const renderMenuItems = () => {
    switch (role) {
      case 'CUSTOMER':
        return (
          <>
            {CUSTOMER_LINKS.map(item => (
              <button
                key={item.path}
                type="button"
                onClick={() => goTo(item.path)}
                style={styles.menuItemBtn}
              >
                {item.label}
              </button>
            ))}
          </>
        );
      case 'STAFF':
        return (
          <>
            <div style={styles.menuItem}>🗃️ Employee Dossier & Credential</div>
            <div style={styles.menuItem}>💳 Compensation & Direct Deposit</div>
            <div style={styles.menuItem}>📊 Operational Metrics Pipeline</div>
            <div style={styles.menuItem}>🛠️ MX Suite Tracking Vector Feed</div>
            <div style={styles.menuItem}>🔒 Security Threat Escalation</div>
          </>
        );
      case 'MANAGEMENT_MD':
        return (
          <>
            <div style={styles.menuItem}>🏢 Holdings Matrix (Company Registry)</div>
            <div style={styles.menuItem}>📉 Productivity Tracker & Task Metrics</div>
            <div style={styles.menuItem}>🔧 Role Configuration Matrix</div>
            <div style={{ ...styles.menuItem, color: ZhonnexTokens.colors.velocityGold }}>💸 Payment Hub: Initiate Board</div>
          </>
        );
      case 'MANAGEMENT_SECRETARY':
        return (
          <>
            <div style={styles.menuItem}>🏢 Holdings Matrix (Read-Only)</div>
            <div style={styles.menuItem}>📉 Task Counter Audit Records</div>
            <div style={{ ...styles.menuItem, color: ZhonnexTokens.colors.securityPass }}>💸 Payment Hub: Execute Queue</div>
          </>
        );
      case 'OVERLORD':
        return (
          <>
            <div style={{ ...styles.menuItem, color: ZhonnexTokens.colors.securityFail }}>👁️ Absolute System Log Matrix</div>
            <div style={styles.menuItem}>💰 Empire Financial Telemetry</div>
            <div style={styles.menuItem}>⚙️ Master Price Matrix Core</div>
            <div style={styles.menuItem}>👑 Position Creator Panel</div>
            <div style={styles.menuItem}>🔑 Global Override Matrix</div>
            <div style={styles.menuItem}>📝 Master Payroll Scheduler</div>
          </>
        );
    }
  };

  return (
    <div style={styles.overlayBackground}>
      <div style={styles.menuContainer}>
        {/* ❌ THE SYSTEM CLOSING X ANCHOR */}
        <button onClick={onClose} style={styles.closeXButton}>X</button>
        <div style={styles.menuHeader}>ZHONNEX DIRECTORY</div>
        <div style={styles.badge}>{role} MATRIX</div>
        <nav style={styles.navLinks}>{renderMenuItems()}</nav>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlayBackground: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 5000, display: 'flex', justifyContent: 'flex-end' },
  menuContainer: { width: '380px', maxWidth: '85vw', height: '100%', backgroundColor: ZhonnexTokens.colors.quantumSlate, borderLeft: `1px solid #222`, padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' },
  closeXButton: { position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: 'transparent', border: 'none', color: ZhonnexTokens.colors.imperialCyan, fontSize: '1.5rem', fontFamily: ZhonnexTokens.typography.displayFont, cursor: 'pointer', fontWeight: 'bold' },
  menuHeader: { fontFamily: ZhonnexTokens.typography.displayFont, color: '#fff', fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '0.2rem', marginTop: '1rem' },
  badge: { fontSize: '0.7rem', color: ZhonnexTokens.colors.velocityGold, letterSpacing: '1px', marginBottom: '2rem', fontFamily: ZhonnexTokens.typography.displayFont },
  navLinks: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  menuItem: { color: ZhonnexTokens.colors.textLight, fontFamily: ZhonnexTokens.typography.primaryFont, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', borderBottom: '1px solid #1a1a1c', paddingBottom: '0.6rem' },
  menuItemBtn: {
    color: ZhonnexTokens.colors.textLight,
    fontFamily: ZhonnexTokens.typography.primaryFont,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #1a1a1c',
    textAlign: 'left',
    padding: '0 0 0.6rem 0',
    width: '100%'
  }
};