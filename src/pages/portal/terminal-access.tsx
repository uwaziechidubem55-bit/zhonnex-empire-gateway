import React, { useState } from 'react';
import { ZhonnexTokens } from '../../config/design-tokens';
import { HeaderNavigation } from '../../components/HeaderNavigation';
import { HamburgerMenu } from '../../components/HamburgerMenu';

type RoleTypes = 'STAFF' | 'MANAGEMENT_MD' | 'MANAGEMENT_SECRETARY' | 'OVERLORD';

export default function CorporateTerminalGateway() {
  const [internalToken, setInternalToken] = useState('');
  const [authenticatedRole, setAuthenticatedRole] = useState<RoleTypes | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const executeInternalHandshake = (e: React.FormEvent) => {
    e.preventDefault();
    if (internalToken === 'ZX-STAFF-CORE') setAuthenticatedRole('STAFF');
    else if (internalToken === 'ZX-MD-EXEC') setAuthenticatedRole('MANAGEMENT_MD');
    else if (internalToken === 'ZX-SEC-FIN') setAuthenticatedRole('MANAGEMENT_SECRETARY');
    else if (internalToken === 'ZHONNEX-OVERLORD-991') setAuthenticatedRole('OVERLORD');
    else alert('CRITICAL BLOCK: Invalid Internal Gateway Token Mapping.');
  };

  if (authenticatedRole) {
    return (
      <div style={{ backgroundColor: ZhonnexTokens.colors.voidBlack, minHeight: '100vh', color: '#fff' }}>
        <HeaderNavigation onHamburgerClick={() => setMenuOpen(true)} showHamburger={true} />
        <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} role={authenticatedRole} />
        
        <main style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: ZhonnexTokens.typography.displayFont, color: ZhonnexTokens.colors.velocityGold }}>
            INTERNAL {authenticatedRole.replace('_', ' ')} NODE ACCESS
          </h1>
          <div style={{ backgroundColor: ZhonnexTokens.colors.quantumSlate, padding: '2rem', marginTop: '2rem', borderRadius: '8px', border: '1px solid #222' }}>
            <h3>System Status: Connected to Core</h3>
            <p>Your workspace controls have loaded based on your specific job purpose. Open the 3-line hamburger drop-down in the navigation header to view your operational tools, log files, or transaction queues.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: ZhonnexTokens.colors.voidBlack, minHeight: '100vh', color: '#fff' }}>
      <HeaderNavigation onHamburgerClick={() => {}} showHamburger={false} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <form onSubmit={executeInternalHandshake} style={{ backgroundColor: ZhonnexTokens.colors.quantumSlate, padding: '3rem', borderRadius: '8px', border: '1px solid #222', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
          <h2 style={{ fontFamily: ZhonnexTokens.typography.displayFont, marginBottom: '2rem', fontSize: '1.2rem', color: ZhonnexTokens.colors.imperialCyan }}>INTERNAL TERMINAL ROUTER</h2>
          <input 
            type="password" 
            placeholder="Input Assigned Workforce Hash Token" 
            style={{ padding: '14px', backgroundColor: '#030303', border: '1px solid #333', borderRadius: '6px', color: '#fff', width: '100%', fontFamily: 'monospace', marginBottom: '1.5rem' }} 
            onChange={e => setInternalToken(e.target.value)}
            required
          />
          <button type="submit" style={{ padding: '14px', width: '100%', backgroundColor: 'transparent', border: `1px solid ${ZhonnexTokens.colors.velocityGold}`, color: ZhonnexTokens.colors.velocityGold, fontFamily: ZhonnexTokens.typography.displayFont, fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>
            VERIFY ROUTE
          </button>
        </form>
      </div>
    </div>
  );
}
