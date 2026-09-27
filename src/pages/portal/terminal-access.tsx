import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ZhonnexTokens } from '../../config/design-tokens';
import { HeaderNavigation } from '../../components/HeaderNavigation';

/* Workforce handshake tokens -> real dashboard routes. */
const ROLE_ROUTES: Record<string, string> = {
  'ZX-STAFF-CORE': '/dashboard/staff',
  'ZX-MD-EXEC': '/dashboard/management-md',
  'ZX-SEC-FIN': '/dashboard/management-secretary',
  'ZHONNEX-OVERLORD-991': '/dashboard/overlord-core-gate'
};

export default function CorporateTerminalGateway() {
  const router = useRouter();
  const [internalToken, setInternalToken] = useState('');
  const [error, setError] = useState('');

  const executeInternalHandshake = (e: React.FormEvent) => {
    e.preventDefault();
    const destination = ROLE_ROUTES[internalToken.trim()];
    if (!destination) {
      setError('CRITICAL BLOCK: Invalid Internal Gateway Token Mapping.');
      return;
    }
    setError('');
    router.push(destination);
  };

  return (
    <div style={{ backgroundColor: ZhonnexTokens.colors.voidBlack, minHeight: '100vh', color: '#fff' }}>
      <HeaderNavigation showHamburger={false} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1.5rem' }}>
        <form
          onSubmit={executeInternalHandshake}
          style={{ backgroundColor: ZhonnexTokens.colors.quantumSlate, padding: '3rem', borderRadius: '8px', border: '1px solid #222', width: '100%', maxWidth: '420px', textAlign: 'center' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
          <h2 style={{ fontFamily: ZhonnexTokens.typography.displayFont, marginBottom: '1rem', fontSize: '1.2rem', color: ZhonnexTokens.colors.imperialCyan }}>
            INTERNAL TERMINAL ROUTER
          </h2>
          <p style={{ color: ZhonnexTokens.colors.textMuted, fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            Verified tokens route straight to the assigned workforce dashboard.
          </p>
          {error && (
            <p style={{ color: ZhonnexTokens.colors.securityFail, fontSize: '0.8rem', marginBottom: '1rem' }}>
              {error}
            </p>
          )}
          <input
            type="password"
            placeholder="Input Assigned Workforce Hash Token"
            style={{ padding: '14px', backgroundColor: '#030303', border: '1px solid #333', borderRadius: '6px', color: '#fff', width: '100%', fontFamily: 'monospace', marginBottom: '1.5rem' }}
            onChange={e => setInternalToken(e.target.value)}
            required
          />
          <button
            type="submit"
            style={{ padding: '14px', width: '100%', backgroundColor: 'transparent', border: `1px solid ${ZhonnexTokens.colors.velocityGold}`, color: ZhonnexTokens.colors.velocityGold, fontFamily: ZhonnexTokens.typography.displayFont, fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}
          >
            VERIFY ROUTE
          </button>
        </form>
      </div>
    </div>
  );
}
