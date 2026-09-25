import React, { useState } from 'react';
import { ZhonnexTokens } from '../../config/design-tokens';
import { HeaderNavigation } from '../../components/HeaderNavigation';
import { HamburgerMenu } from '../../components/HamburgerMenu';

export default function CustomerDashboardZone() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ backgroundColor: ZhonnexTokens.colors.voidBlack, minHeight: '100vh', color: '#fff' }}>
      <HeaderNavigation onHamburgerClick={() => setMenuOpen(true)} showHamburger={true} />
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} role="CUSTOMER" />
      
      <main style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: ZhonnexTokens.typography.displayFont, color: ZhonnexTokens.colors.imperialCyan }}>CUSTOMER WORKSPACE</h1>
        <p style={{ color: ZhonnexTokens.colors.textLight }}>Status Verification: Connection Encrypted (Zero-Knowledge Mesh Active)</p>
        
        <div style={{ backgroundColor: ZhonnexTokens.colors.quantumSlate, padding: '2rem', marginTop: '2rem', borderRadius: '8px', border: '1px solid #222' }}>
          <h3>Welcome to the Zhonnex Vault</h3>
          <p>Click the upper-right 3-line hamburger menu to toggle and access your Billing metrics, Product licensing keys, Offers, and Legal agreements.</p>
        </div>
      </main>
    </div>
  );
}
