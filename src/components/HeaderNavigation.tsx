import React from 'react';
import { ZhonnexTokens } from '../config/design-tokens';
import { useIsMobile } from '../hooks/useIsMobile';

interface HeaderProps {
  onHamburgerClick?: () => void;
  showHamburger?: boolean;
}

export const HeaderNavigation: React.FC<HeaderProps> = ({
  onHamburgerClick,
  showHamburger
}) => {
  const isMobile = useIsMobile();

  return (
    <header
      style={{
        ...styles.header,
        padding: isMobile ? '0.9rem 1.1rem' : '1.25rem 3rem'
      }}
    >
      <div style={styles.logoGroup}>
        <img
          src="/assets/logo_final_zhonnex.png"
          alt="ZHONNEX CORP Official Emblem"
          style={{ ...styles.logoImage, height: isMobile ? 28 : 36 }}
        />
        <span
          style={{ ...styles.logoText, fontSize: isMobile ? '1rem' : '1.25rem' }}
        >
          ZHONNEX CORP
        </span>
      </div>

      {/* Inert navigation labels — intentionally NOT interactive.
          Hidden on mobile: the non-wrapping tab row was wider than phone
          viewports and forced horizontal scroll (the white gutter bug). */}
      {!isMobile && (
        <nav style={styles.rightGroup} aria-hidden="true">
          <span style={styles.tab}>Ecosystem</span>
          <span style={styles.tab}>Technology</span>
          <span style={styles.tab}>Solutions</span>
          <span style={styles.tab}>Infrastructure</span>
        </nav>
      )}

      {showHamburger && (
        <button
          type="button"
          onClick={onHamburgerClick}
          aria-label="Open Zhonnex directory menu"
          style={styles.hamburgerBtn}
        >
          <span style={styles.hamburgerBar} />
          <span style={styles.hamburgerBar} />
          <span style={styles.hamburgerBar} />
        </button>
      )}
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 3rem',
    backgroundColor: ZhonnexTokens.colors.voidBlack,
    borderBottom: '1px solid #111111',
    position: 'sticky',
    top: 0,
    zIndex: 4000,
    width: '100%',
    maxWidth: '100vw'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minWidth: 0
  },
  logoImage: { height: '36px', width: 'auto', display: 'block' },
  logoText: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '1.25rem',
    color: '#ffffff',
    letterSpacing: '2px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    flexShrink: 0
  },
  tab: {
    color: ZhonnexTokens.colors.textMuted,
    fontSize: '0.85rem',
    fontFamily: ZhonnexTokens.typography.displayFont,
    letterSpacing: '1px',
    userSelect: 'none'
  },
  hamburgerBtn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    flexShrink: 0
  },
  hamburgerBar: {
    display: 'block',
    width: '22px',
    height: '2px',
    backgroundColor: '#ffffff'
  }
};
