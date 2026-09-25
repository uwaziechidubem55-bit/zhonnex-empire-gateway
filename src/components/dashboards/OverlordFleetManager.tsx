import React, { useState } from 'react';
import { ZhonnexTokens } from '../../config/design-tokens';

interface GlobalTransportFleet {
  operatorName: string;
  domainSector: 'MARITIME_SHIPPING' | 'AERIAL_DRONES' | 'HIGH_SPEED_RAIL' | 'TERRESTRIAL_FREIGHT';
  totalActiveAssets: number;
  monthlyRentalFeeCents: number;
  contractStatus: 'ACTIVE' | 'LAPSED' | 'OVERRIDDEN_LOCKDOWN';
}

export const OverlordFleetManager: React.FC = () => {
  const [fleets, setFleets] = useState<GlobalTransportFleet[]>([
    { operatorName: "Pacific Freight Maritime", domainSector: "MARITIME_SHIPPING", totalActiveAssets: 48, monthlyRentalFeeCents: 120000000, contractStatus: 'ACTIVE' },
    { operatorName: "Atlas Global Cargo Air", domainSector: "AERIAL_DRONES", totalActiveAssets: 2450, monthlyRentalFeeCents: 85000000, contractStatus: 'ACTIVE' },
    { operatorName: "Continental Rail Logistics", domainSector: "HIGH_SPEED_RAIL", totalActiveAssets: 110, monthlyRentalFeeCents: 65000000, contractStatus: 'LAPSED' }
  ]);

  const deploySovereignLockdownSwitch = (index: number) => {
    const updated = [...fleets];
    const target = updated[index];
    
    target.contractStatus = target.contractStatus === 'OVERRIDDEN_LOCKDOWN' ? 'ACTIVE' : 'OVERRIDDEN_LOCKDOWN';
    setFleets(updated);
    
    alert(`👑 OVERLORD FORCE ORDER SUMMARY: Cryptographic validation hash updated for ${target.operatorName}. Emitting remote sector lockdown parameters across global infrastructure arrays.`);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.sectionHeader}>👑 Sovereign Multi-Domain Fleet & Asset Command</h3>
      <p style={styles.subtext}>Oversee and enforce execution parameters for autonomous conveyance networks renting the Zhonnex MX Suite engine.</p>

      <div style={styles.listContainer}>
        {fleets.map((fleet, i) => (
          <div key={i} style={styles.fleetCard}>
            <div style={styles.metaRow}>
              <div>
                <h4 style={{ margin: 0, color: '#fff' }}>{fleet.operatorName}</h4>
                <span style={styles.domainText}>Domain Sector: {fleet.domainSector.replace('_', ' ')}</span>
              </div>
              <span style={fleet.contractStatus === 'ACTIVE' ? styles.statusActive : styles.statusKilled}>
                {fleet.contractStatus}
              </span>
            </div>

            <div style={styles.dataGrid}>
              <p><strong>Tracked Active Assets:</strong> {fleet.totalActiveAssets.toLocaleString()} Autonomous Nodes</p>
              <p><strong>Velocity License Revenue:</strong> \${(fleet.monthlyRentalFeeCents / 100).toLocaleString()} USD / mo</p>
            </div>

            <button 
              onClick={() => deploySovereignLockdownSwitch(i)} 
              style={fleet.contractStatus === 'OVERRIDDEN_LOCKDOWN' ? styles.reviveBtn : styles.killBtn}
            >
              {fleet.contractStatus === 'OVERRIDDEN_LOCKDOWN' ? 'Re-Authorize System License Token' : 'FORCE GLOBAL HARD CONVEYANCE LOCKDOWN'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '2rem', backgroundColor: ZhonnexTokens.colors.quantumSlate, border: '1px solid #222', borderRadius: '8px', marginTop: '2rem' },
  sectionHeader: { fontFamily: ZhonnexTokens.typography.displayFont, margin: 0, color: ZhonnexTokens.colors.imperialCyan, fontSize: '1.1rem' },
  subtext: { color: ZhonnexTokens.colors.textLight, fontSize: '0.85rem', margin: '0.5rem 0 1.5rem 0' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  fleetCard: { backgroundColor: '#030303', padding: '1.5rem', borderRadius: '6px', border: '1px solid #222' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  domainText: { fontSize: '0.75rem', color: ZhonnexTokens.colors.velocityGold, fontFamily: ZhonnexTokens.typography.displayFont },
  statusActive: { color: ZhonnexTokens.colors.securityPass, fontSize: '0.75rem', fontWeight: 'bold', border: `1px solid ${ZhonnexTokens.colors.securityPass}`, padding: '2px 8px', borderRadius: '4px' },
  statusKilled: { color: ZhonnexTokens.colors.securityFail, fontSize: '0.75rem', fontWeight: 'bold', border: `1px solid ${ZhonnexTokens.colors.securityFail}`, padding: '2px 8px', borderRadius: '4px' },
  dataGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: '#ccc', margin: '1rem 0' },
  killBtn: { width: '100%', padding: '12px', backgroundColor: 'transparent', border: `1px solid ${ZhonnexTokens.colors.securityFail}`, color: ZhonnexTokens.colors.securityFail, fontFamily: ZhonnexTokens.typography.displayFont, fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' },
  reviveBtn: { width: '100%', padding: '12px', backgroundColor: 'transparent', border: `1px solid ${ZhonnexTokens.colors.securityPass}`, color: ZhonnexTokens.colors.securityPass, fontFamily: ZhonnexTokens.typography.displayFont, fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }
};
