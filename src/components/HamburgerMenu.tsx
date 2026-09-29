import React from 'react';
import { useRouter } from 'next/router';
import { ZhonnexTokens } from '../config/design-tokens';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'CUSTOMER' | 'STAFF' | 'MANAGEMENT_MD' | 'MANAGEMENT_SECRETARY' | 'OVERLORD';
}

/* Every directory entry is a live route.
   Customer rooms:  src/pages/dashboard/customer/[section].tsx
   Internal rooms:  src/pages/dashboard/room/[role]/[section].tsx */
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

const STAFF_LINKS: Array<{ label: string; path: string }> = [
  { label: '🛰️ Duty Post (Personal Space)', path: '/dashboard/room/staff/duty-post' },
  { label: '🗃️ Employee Dossier & Credential', path: '/dashboard/room/staff/dossier' },
  { label: '💳 Compensation & Direct Deposit', path: '/dashboard/room/staff/compensation' },
  { label: '📊 Operational Metrics Pipeline', path: '/dashboard/room/staff/metrics' },
  { label: '🛠️ MX Suite Tracking Vector Feed', path: '/dashboard/room/staff/vector-feed' },
  { label: '🔒 Security Threat Escalation', path: '/dashboard/room/staff/escalation' }
];

const MD_LINKS: Array<{ label: string; path: string }> = [
  { label: '🎛️ Customer Content Matrix (Publish)', path: '/dashboard/content-matrix' },
  { label: '🏢 Holdings Matrix (Company Registry)', path: '/dashboard/room/md/holdings' },
  { label: '📉 Productivity Tracker & Task Metrics', path: '/dashboard/room/md/productivity' },
  { label: '🔧 Role Configuration Matrix', path: '/dashboard/room/md/role-config' },
  { label: '📑 Secretary General Desk', path: '/dashboard/room/md/sec-gen' },
  { label: '🏛️ Board of Directors Chamber', path: '/dashboard/room/md/board' },
  { label: '📨 Cross-Interface Comms', path: '/dashboard/room/md/comms' },
  { label: '💸 Payment Hub: Initiate Board', path: '/dashboard/management-md' }
];

const SECRETARY_LINKS: Array<{ label: string; path: string }> = [
  { label: '🏢 Holdings Matrix (Read-Only)', path: '/dashboard/room/secretary/holdings' },
  { label: '📉 Task Counter Audit Records', path: '/dashboard/room/secretary/audit' },
  { label: '📊 Financial Documentation & Reports', path: '/dashboard/room/secretary/fin-reports' },
  { label: '🏦 Treasury Fund Monitor', path: '/dashboard/room/secretary/treasury' },
  { label: '📨 Cross-Interface Comms', path: '/dashboard/room/secretary/comms' },
  { label: '💸 Payment Hub: Execute Queue', path: '/dashboard/management-secretary' }
];

const OVERLORD_LINKS: Array<{ label: string; path: string }> = [
  { label: '👁️ Absolute System Log Matrix', path: '/dashboard/room/overlord/logs' },
  { label: '💰 Empire Financial Telemetry', path: '/dashboard/room/overlord/telemetry' },
  { label: '⚙️ Master Price Matrix Core', path: '/dashboard/room/overlord/price-matrix' },
  { label: '👑 Position Creator Panel', path: '/dashboard/room/overlord/positions' },
  { label: '🔑 Global Override Matrix', path: '/dashboard/room/overlord/override' },
  { label: '📝 Master Payroll Scheduler', path: '/dashboard/room/overlord/payroll' },
  { label: '📨 Cross-Interface Comms', path: '/dashboard/room/overlord/comms' }
];

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, role }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const goTo = (path: string) => {
    onClose();
    router.push(path);
  };

  const linksFor = (): Array<{ label: string; path: string }> => {
    switch (role) {
      case 'CUSTOMER':
        return CUSTOMER_LINKS;
      case 'STAFF':
        return STAFF_LINKS;
      case 'MANAGEMENT_MD':
        return MD_LINKS;
      case 'MANAGEMENT_SECRETARY':
        return SECRETARY_LINKS;
      case 'OVERLORD':
        return OVERLORD_LINKS;
    }
  };

  return (
    <div style={styles.overlayBackground}>
      <div style={styles.menuContainer}>
        {/* ❌ THE SYSTEM CLOSING X ANCHOR */}
        <button onClick={onClose} style={styles.closeXButton}>X</button>
        <div style={styles.menuHeader}>ZHONNEX DIRECTORY</div>
        <div style={styles.badge}>{role} MATRIX</div>
        <nav style={styles.navLinks}>
          {linksFor().map(item => (
            <button
              key={item.path}
              type="button"
              onClick={() => goTo(item.path)}
              style={styles.menuItemBtn}
            >
              {item.label}
            </button>
          ))}
        </nav>
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