import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ZhonnexTokens } from '../config/design-tokens';
import { HeaderNavigation } from '../components/HeaderNavigation';

export default function DeepScrollGateway() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ idKey: '', password: '' });
  const [error, setError] = useState('');

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.idKey.trim() || !credentials.password) {
      setError('ID Key and password are required.');
      return;
    }
    setError('');
    router.push('/dashboard/customer');
  };

  return (
    <div style={styles.pageWrapper}>
      <HeaderNavigation />

      {/* SECTION 1: HERO */}
      <section style={styles.heroSection}>
        <p style={styles.eyebrow}>ZHONNEX EMPIRE GATEWAY</p>
        <h1 style={styles.mainTitle}>INITIALIZE YOUR ECOSYSTEM ACCESS</h1>
        <p style={styles.tagline}>
          Generational operational power. Zero human latency. One gateway.
        </p>

        <div style={styles.svgContainer}>
          <svg
            width="100%"
            height="240"
            viewBox="0 0 800 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Zhonnex ecosystem network diagram"
          >
            <circle cx="400" cy="120" r="90" stroke="#1a1a1a" strokeWidth="1" />
            <circle cx="400" cy="120" r="8" fill={ZhonnexTokens.colors.imperialCyan} />
            <line x1="400" y1="120" x2="250" y2="70" stroke={ZhonnexTokens.colors.imperialCyan} strokeWidth="1.5" />
            <line x1="400" y1="120" x2="550" y2="70" stroke={ZhonnexTokens.colors.imperialCyan} strokeWidth="1.5" />
            <line x1="400" y1="120" x2="400" y2="200" stroke={ZhonnexTokens.colors.imperialCyan} strokeWidth="1.5" />
            <circle cx="250" cy="70" r="5" fill={ZhonnexTokens.colors.velocityGold} />
            <circle cx="550" cy="70" r="5" fill={ZhonnexTokens.colors.imperialCyan} />
            <circle cx="400" cy="200" r="5" fill="#ffffff" />
            <text x="140" y="55" fill="#999999" fontFamily="Orbitron" fontSize="12">VELOCITY FINANCE ENGINE</text>
            <text x="500" y="55" fill="#999999" fontFamily="Orbitron" fontSize="12">MX SUITE LOGISTICS CORE</text>
            <text x="290" y="228" fill="#999999" fontFamily="Orbitron" fontSize="12">GENERATIONAL COGNITIVE MESH</text>
          </svg>
        </div>
      </section>

      {/* SECTION 2: CAPABILITIES */}
      <section style={styles.featuresSection}>
        <div style={styles.featureCard}>
          <div style={styles.featureIndex}>01</div>
          <h3 style={styles.featureTitle}>Sovereign Multi-Currency Execution</h3>
          <p style={styles.featureBody}>
            Real-time atomic cash transaction tracking with automated platform
            fee distribution pipelines.
          </p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIndex}>02</div>
          <h3 style={styles.featureTitle}>Multi-Domain Kinematics Matrix</h3>
          <p style={styles.featureBody}>
            Vector guidance pipelines monitoring automated assets across sea,
            land, rail, and atmospheric domains seamlessly.
          </p>
        </div>
      </section>

      {/* SECTION 3: GET STARTED */}
      <section style={styles.getStartedAnchorSection} id="get-started">
        <div style={styles.authContainerFrame}>
          <h2 style={styles.authTitle}>ECOSYSTEM TERMINAL INGESTION</h2>
          <form onSubmit={handleCustomerLogin} style={styles.form}>
            <label style={styles.label} htmlFor="idKey">ZHONNEX ID KEY</label>
            <input
              id="idKey"
              type="text"
              placeholder="Enter your private Zhonnex ID Key"
              style={styles.input}
              value={credentials.idKey}
              onChange={e => setCredentials({ ...credentials, idKey: e.target.value })}
              required
            />
            <label style={styles.label} htmlFor="password">ACCESS PASSWORD</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your cryptographic token password"
              style={styles.input}
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
            {error && <p style={styles.errorText}>{error}</p>}
            <button type="submit" style={styles.getStartedBtn}>GET STARTED</button>
          </form>
        </div>
      </section>

      {/* FOOTER — inert */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>© 2026 ZHONNEX CORP. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundColor: ZhonnexTokens.colors.voidBlack,
    minHeight: '100vh',
    color: '#ffffff',
    scrollBehavior: 'smooth'
  },
  heroSection: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: ZhonnexTokens.colors.voidBlack
  },
  eyebrow: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    color: ZhonnexTokens.colors.imperialCyan,
    fontSize: '0.75rem',
    letterSpacing: '6px',
    marginBottom: '1.5rem'
  },
  mainTitle: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
    letterSpacing: '4px',
    margin: '0 0 1rem 0'
  },
  tagline: {
    fontFamily: ZhonnexTokens.typography.primaryFont,
    color: ZhonnexTokens.colors.textMuted,
    fontSize: '1rem',
    letterSpacing: '1px',
    maxWidth: '640px',
    marginBottom: '3rem'
  },
  svgContainer: { width: '100%', maxWidth: '800px' },
  featuresSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    padding: '5rem 3rem',
    maxWidth: '1100px',
    margin: '0 auto',
    backgroundColor: ZhonnexTokens.colors.voidBlack
  },
  featureCard: {
    flex: '1 1 320px',
    backgroundColor: ZhonnexTokens.colors.surfaceBlack,
    padding: '2.5rem',
    borderRadius: '8px',
    border: '1px solid #151515'
  },
  featureIndex: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    color: ZhonnexTokens.colors.velocityGold,
    fontSize: '0.8rem',
    letterSpacing: '3px',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '1.15rem',
    letterSpacing: '1px',
    margin: '0 0 0.75rem 0'
  },
  featureBody: {
    fontFamily: ZhonnexTokens.typography.primaryFont,
    color: ZhonnexTokens.colors.textMuted,
    fontSize: '0.95rem',
    lineHeight: '1.7'
  },
  getStartedAnchorSection: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ZhonnexTokens.colors.voidBlack,
    padding: '4rem 2rem'
  },
  authContainerFrame: {
    backgroundColor: ZhonnexTokens.colors.surfaceBlack,
    padding: '3rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '480px',
    textAlign: 'center',
    border: '1px solid #151515'
  },
  authTitle: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    color: ZhonnexTokens.colors.imperialCyan,
    marginBottom: '2rem',
    fontSize: '1.2rem',
    letterSpacing: '2px'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left' },
  label: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.65rem',
    letterSpacing: '2px',
    color: ZhonnexTokens.colors.textMuted,
    marginTop: '0.75rem'
  },
  input: {
    padding: '14px',
    backgroundColor: '#000000',
    border: '1px solid #262626',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontFamily: 'monospace',
    outline: 'none'
  },
  errorText: {
    color: ZhonnexTokens.colors.securityFail,
    fontSize: '0.8rem',
    fontFamily: ZhonnexTokens.typography.primaryFont
  },
  getStartedBtn: {
    marginTop: '1.25rem',
    padding: '16px',
    backgroundColor: ZhonnexTokens.colors.imperialCyan,
    border: 'none',
    color: '#000000',
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontWeight: 'bold',
    fontSize: '1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    letterSpacing: '3px',
    transition: 'opacity 0.3s'
  },
  footer: {
    padding: '2rem 3rem',
    backgroundColor: ZhonnexTokens.colors.voidBlack,
    borderTop: '1px solid #111111',
    display: 'flex',
    justifyContent: 'center'
  },
  footerText: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.7rem',
    letterSpacing: '2px',
    color: ZhonnexTokens.colors.textMuted
  }
};