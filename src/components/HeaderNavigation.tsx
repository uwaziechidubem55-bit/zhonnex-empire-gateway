import React from 'react';
import { ZhonnexTokens } from '../config/design-tokens';

interface HeaderProps {
  onHamburgerClick?: () => void;
  showHamburger?: boolean;
}

export const HeaderNavigation: React.FC<HeaderProps> = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logoGroup}>
        <img
          src="/assets/logo_final_zhonnex.png"
          alt="ZHONNEX CORP Official Emblem"
          style={styles.logoImage}
        />
        <span style={styles.logoText}>ZHONNEX CORP</span>
      </div>

      {/* Inert navigation labels — intentionally NOT interactive */}
      <nav style={styles.rightGroup} aria-hidden="true">
        <span style={styles.tab}>Ecosystem</span>
        <span style={styles.tab}>Technology</span>
        <span style={styles.tab}>Solutions</span>
        <span style={styles.tab}>Infrastructure</span>
      </nav>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 3rem',
    backgroundColor: ZhonnexTokens.colors.voidBlack,
    borderBottom: '1px solid #111111',
    position: 'sticky',
    top: 0,
    zIndex: 4000
  },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '1rem' },
  logoImage: { height: '36px', width: 'auto', display: 'block' },
  logoText: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '1.25rem',
    color: '#ffffff',
    letterSpacing: '2px',
    fontWeight: 'bold'
  },
  rightGroup: { display: 'flex', alignItems: 'center', gap: '2rem' },
  tab: {
    color: ZhonnexTokens.colors.textMuted,
    fontSize: '0.85rem',
    fontFamily: ZhonnexTokens.typography.displayFont,
    letterSpacing: '1px',
    userSelect: 'none'
  }
};