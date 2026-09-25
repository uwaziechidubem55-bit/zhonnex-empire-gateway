import React from 'react';
import { ZhonnexTokens } from '../config/design-tokens';

interface HeaderProps {
  onHamburgerClick: () => void;
  showHamburger: boolean;
}

export const HeaderNavigation: React.FC<HeaderProps> = ({ onHamburgerClick, showHamburger }) => {
  return (
    <header style={styles.header}>
      {/* 🔷 BRAND LOGO EMBLEM ANCHORED IN THE TOP LEFT CORNER */}
      <div style={styles.logoGroup}>
        <div style={styles.logoIcon}>🖲️</div>
        <span style={styles.logoText}>ZHONNEX CORP</span>
      </div>

      <div style={styles.rightGroup}>
        <span style={styles.tab}>Ecosystem</span>
        <span style={styles.tab}>Technology</span>
        <span style={styles.tab}>Solutions</span>
        <span style={styles.tab}>Infrastructure</span>
        
        {showHamburger && (
          <button onClick={onHamburgerClick} style={styles.hamburgerBtn} aria-label="Toggle Menu">
            <div style={styles.line}></div>
            <div style={styles.line}></div>
            <div style={styles.line}></div>
          </button>
        )}
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 3rem', backgroundColor: ZhonnexTokens.colors.voidBlack, borderBottom: `1px solid #121214`, position: 'sticky', top: 0, zIndex: 4000 },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  logoIcon: { fontSize: '1.6rem' },
  logoText: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '1.25rem', color: '#fff', letterSpacing: '2px', fontWeight: 'bold' },
  rightGroup: { display: 'flex', alignItems: 'center', gap: '2rem' },
  tab: { color: ZhonnexTokens.colors.textLight, fontSize: '0.85rem', fontFamily: ZhonnexTokens.typography.displayFont, cursor: 'pointer' },
  hamburgerBtn: { background: 'none', border: 'none', display: 'flex', flexDirection: 'column', gap: '5px', cursor: 'pointer' },
  line: { width: '24px', height: '2px', backgroundColor: ZhonnexTokens.colors.imperialCyan }
};
