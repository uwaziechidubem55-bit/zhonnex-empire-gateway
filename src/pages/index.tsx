import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ZhonnexTokens } from '../config/design-tokens';
import { HeaderNavigation } from '../components/HeaderNavigation';

export default function DeepScrollGateway() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ idKey: '', password: '' });

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.idKey && credentials.password) {
      router.push('/dashboard/customer');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <HeaderNavigation onHamburgerClick={() => {}} showHamburger={false} />

      {/* VIEW SECTION 1: CYBERNETIC POWER HERO MATRIX */}
      <section style={styles.heroSection}>
        <div style={styles.svgContainer}>
          <svg width="100%" height="240" viewBox="0 0 800 240" fill="none" xmlns="http://w3.org">
            <circle cx="400" cy="120" r="8" fill={ZhonnexTokens.colors.imperialCyan} />
            <line x1="400" y1="120" x2="250" y2="70" stroke={ZhonnexTokens.colors.imperialCyan} strokeWidth="2" />
            <line x1="400" y1="120" x2="550" y2="70" stroke={ZhonnexTokens.colors.imperialCyan} strokeWidth="2" />
            <line x1="400" y1="120" x2="400" y2="200" stroke={ZhonnexTokens.colors.imperialCyan} strokeWidth="2" />
            <circle cx="250" cy="70" r="5" fill={ZhonnexTokens.colors.velocityGold} />
            <circle cx="550" cy="70" r="5" fill={ZhonnexTokens.colors.imperialCyan} />
            <circle cx="400" cy="200" r="5" fill="#fff" />
            <text x="160" y="45" fill="#fff" fontFamily="Orbitron" fontSize="12">Velocity Finance Engine</text>
            <text x="500" y="45" fill="#fff" fontFamily="Orbitron" fontSize="12">MX Suite Logistics Core</text>
            <text x="310" y="225" fill="#fff" fontFamily="Orbitron" fontSize="12">Generational Cognitive Mesh</text>
          </svg>
        </div>
        <h1 style={styles.mainTitle}>INITIALIZE YOUR ECOSYSTEM ACCESS</h1>
        <p style={styles.tagline}>UNLEASH GENERATIONAL OPERATIONAL POWER WITHOUT HUMAN LATENCY.</p>
      </section>

      {/* VIEW SECTION 2: THE MID-SCROLL ENTERPRISE HEALTH MONITOR */}
      <section style={styles.featuresSection}>
        <div style={styles.featureCard}>
          <h3>Sovereign Multi-Currency Execution</h3>
          <p>Real-time atomic cash transaction tracking and automated platform fee distribution tracking pipelines.</p>
        </div>
        <div style={styles.featureCard}>
          <h3>Multi-Domain Kinematics Matrix</h3>
          <p>Vector guidance pipelines monitoring automated assets across Sea, Land, Rail, and Atmospheric vectors seamlessly.</p>
        </div>
      </section>

      {/* VIEW SECTION 3: THE DEEP-SCROLL BOTTOM CUSTOMER ROUTE BLOCK */}
      <section style={styles.getStartedAnchorSection}>
        <div style={styles.authContainerFrame}>
          <h2 style={styles.authTitle}>Ecosystem Terminal Ingestion</h2>
          <form onSubmit={handleCustomerLogin} style={styles.form}>
            <input 
              type="text" 
              placeholder="Enter Private Zhonnex ID Key" 
              style={styles.input} 
              onChange={e => setCredentials({...credentials, idKey: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder="Enter Cryptographic Token Password" 
              style={styles.input} 
              onChange={e => setCredentials({...credentials, password: e.target.value})}
              required
            />
            <button type="submit" style={styles.getStartedBtn}>GET STARTED</button>
          </form>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: { backgroundColor: ZhonnexTokens.colors.voidBlack, minHeight: '100vh', color: '#fff', scrollBehavior: 'smooth' },
  heroSection: { minHeight: '75vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' },
  svgContainer: { width: '100%', maxWidth: '800px', marginBottom: '2rem' },
  mainTitle: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '2.8rem', letterSpacing: '4px', margin: '0 0 1rem 0' },
  tagline: { fontFamily: ZhonnexTokens.typography.primaryFont, color: ZhonnexTokens.colors.textLight, fontSize: '1rem', letterSpacing: '1px' },
  featuresSection: { minHeight: '60vh', display: 'flex', gap: '3rem', padding: '5rem 3rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'center' },
  featureCard: { flex: 1, backgroundColor: ZhonnexTokens.colors.quantumSlate, padding: '2.5rem', borderRadius: '8px', border: '1px solid #222' },
  getStartedAnchorSection: { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090b', borderTop: '1px solid #121214' },
  authContainerFrame: { backgroundColor: ZhonnexTokens.colors.quantumSlate, padding: '3.5rem', borderRadius: '12px', width: '100%', maxWidth: '480px', textAlign: 'center', border: '1px solid #222' },
  authTitle: { fontFamily: ZhonnexTokens.typography.displayFont, color: ZhonnexTokens.colors.imperialCyan, marginBottom: '2rem', fontSize: '1.4rem', letterSpacing: '1px' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  input: { padding: '14px', backgroundColor: '#030303', border: '1px solid #333', borderRadius: '6px', color: '#fff', fontSize: '0.95rem', fontFamily: 'monospace' },
  getStartedBtn: { padding: '16px', backgroundColor: 'transparent', border: `1px solid ${ZhonnexTokens.colors.imperialCyan}`, color: ZhonnexTokens.colors.imperialCyan, fontFamily: ZhonnexTokens.typography.displayFont, fontWeight: 'bold', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer', letterSpacing: '2px', transition: 'all 0.3s' }
};
