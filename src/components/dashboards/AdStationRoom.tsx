import React, { useEffect } from 'react';
import { ZhonnexTokens } from '../../config/design-tokens';

export const ZhonnexAdStation: React.FC = () => {
  
  useEffect(() => {
    // 🧠 1. This loads your Ad Network's global scripts into your Vercel frontend automatically
    const script = document.createElement('script');
    script.src = 'https://doubleclick.net'; // Example premium Google Tag network script
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // Cleans up server memory when user exits the ad room
    };
  }, []);

  return (
    <div style={styles.roomContainer}>
      <div style={styles.rewardBanner}>
        <h3>⚡ ZHONNEX INCENTIVIZED REWARD MATRIX</h3>
        <p>Engage with premium corporate updates below to instantly credit your Zhonnex ID with 100 Free Core API Tokens.</p>
      </div>

      {/* 📺 2. THE VISUAL AD EMBEDMENT HOLE */}
      <div style={styles.adSlotFrame}>
        <p style={styles.adLabel}>ADVERTISEMENT SPONSOR PORTAL</p>
        
        {/* ⚠️ PASTE YOUR COPIED AD NETWORK CODE TAG RIGHT HERE IN PRODUCTION */}
        <div 
          id="div-gpt-ad-zhonnex-station" 
          style={{ width: '728px', height: '90px', backgroundColor: '#030303', margin: '0 auto' }}
        >
          {/* Live ads pull automatically from the network and render right inside this box */}
        </div>
      </div>

      <div style={styles.tokenLedgerCard}>
        <h4>Your Ad-Earned Utility Ledger</h4>
        <p style={{ fontSize: '1.5rem', color: ZhonnexTokens.colors.securityPass, fontWeight: 'bold', margin: '0.5rem 0' }}>+400 Tokens Available</p>
      </div>
    </div>
  );
};

const styles = {
  roomContainer: { padding: '2rem', backgroundColor: ZhonnexTokens.colors.quantumSlate, borderRadius: '8px', border: '1px solid #222' },
  rewardBanner: { backgroundColor: '#030303', borderLeft: `4px solid ${ZhonnexTokens.colors.imperialCyan}`, padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' },
  adSlotFrame: { border: '1px solid #333', padding: '2rem', borderRadius: '6px', backgroundColor: '#09090b', textAlign: 'center' as const },
  adLabel: { fontSize: '0.75rem', color: '#444', letterSpacing: '2px', marginBottom: '1rem', fontWeight: 'bold' as const },
  tokenLedgerCard: { marginTop: '2rem', borderTop: '1px solid #222', paddingTop: '1.5rem' }
};
