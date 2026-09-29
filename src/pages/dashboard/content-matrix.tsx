import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ZhonnexTokens } from '../../config/design-tokens';
import { HeaderNavigation } from '../../components/HeaderNavigation';
import { HamburgerMenu } from '../../components/HamburgerMenu';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  ContentMatrix,
  DEFAULT_MATRIX,
  loadContentMatrix,
  saveContentMatrix,
  resetContentMatrix
} from '../../config/content-matrix';
import { Application, appointApplication, loadApplications } from '../../config/applications';

/* ------------------------------------------------------------------ */
/* MD PUBLISH CONSOLE — Management edits the customer-facing matrix   */
/* (billing prices, licenses, offers, job vacancies) and publishes.   */
/* Customer rooms read what is published here.                        */
/* ------------------------------------------------------------------ */

type Row = Record<string, string>;

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <label style={s.field}>
    <span style={s.fieldLabel}>{label}</span>
    <input
      style={s.fieldInput}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </label>
);

const Select: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => (
  <label style={s.field}>
    <span style={s.fieldLabel}>{label}</span>
    <select
      style={s.fieldInput}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </label>
);

export default function ContentMatrixControl() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [matrix, setMatrix] = useState<ContentMatrix>(DEFAULT_MATRIX);
  const [apps, setApps] = useState<Application[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setMatrix(loadContentMatrix());
    setApps(loadApplications());
  }, []);

  const setJobPositions = (i: number, v: string) => {
    setMatrix(m => ({
      ...m,
      jobs: m.jobs.map((j, idx) =>
        idx === i
          ? { ...j, positions: v.split(',').map(x => x.trim()).filter(Boolean) }
          : j
      )
    }));
  };

  const appoint = (id: string) => {
    const res = appointApplication(id);
    setApps(loadApplications());
    if (res.app && res.app.passcode) {
      setNotice(
        `APPOINTED ${res.app.fullName} as ${res.app.position}. Passcode ${res.app.passcode} — username is the name on their application.`
      );
    }
  };

  const setRow = (key: keyof ContentMatrix, index: number, field: string, value: string) => {
    setMatrix(m => ({
      ...m,
      [key]: (m[key] as unknown as Row[]).map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      )
    }) as ContentMatrix);
  };

  const addRow = (key: keyof ContentMatrix, template: unknown) => {
    setMatrix(m => ({
      ...m,
      [key]: [...(m[key] as unknown as Row[]), template as Row]
    }) as ContentMatrix);
  };

  const removeRow = (key: keyof ContentMatrix, index: number) => {
    setMatrix(m => ({
      ...m,
      [key]: (m[key] as unknown as Row[]).filter((_, i) => i !== index)
    }) as ContentMatrix);
  };

  const publish = () => {
    saveContentMatrix(matrix);
    setNotice('PUBLISHED — customer rooms on this terminal now show the new matrix.');
  };

  const reset = () => {
    resetContentMatrix();
    setMatrix(DEFAULT_MATRIX);
    setNotice('Matrix reset to factory defaults — publish to push it.');
  };

  return (
    <div style={s.pageWrapper}>
      <HeaderNavigation
        onHamburgerClick={() => setMenuOpen(true)}
        showHamburger={true}
      />
      <HamburgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        role="MANAGEMENT_MD"
      />

      <main style={{ ...s.main, padding: isMobile ? '2rem 1.1rem' : '3rem' }}>
        <div style={s.titleRow}>
          <h1 style={s.title}>CUSTOMER CONTENT MATRIX</h1>
          <span style={s.badge}>MD PUBLISH CONSOLE</span>
        </div>
        <p style={s.muted}>
          Everything the customer mesh sees — billing prices, product
          licenses, offers and job vacancies — is dictated here. Edit, then
          publish.
        </p>

        {notice && <p style={s.notice}>{notice}</p>}

        <div style={s.actionRow}>
          <button type="button" style={s.publishBtn} onClick={publish}>
            ⬆ PUBLISH TO CUSTOMER MESH
          </button>
          <button type="button" style={s.resetBtn} onClick={reset}>
            RESET TO DEFAULTS
          </button>
        </div>

        {/* BILLING */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>📁 Billing Ledger Entries & Prices</h3>
          {matrix.billing.map((row, i) => (
            <div key={i} style={s.rowBox}>
              <div style={s.rowGrid}>
                <Field label="DATE" value={row.date} onChange={v => setRow('billing', i, 'date', v)} />
                <Field label="REF" value={row.ref} onChange={v => setRow('billing', i, 'ref', v)} />
                <Field label="DESCRIPTION" value={row.desc} onChange={v => setRow('billing', i, 'desc', v)} />
                <Field label="AMOUNT (PRICE)" value={row.amount} onChange={v => setRow('billing', i, 'amount', v)} />
                <Select label="STATUS" value={row.status} options={['SETTLED', 'PENDING']} onChange={v => setRow('billing', i, 'status', v)} />
              </div>
              <button type="button" style={s.removeBtn} onClick={() => removeRow('billing', i)}>
                REMOVE ENTRY
              </button>
            </div>
          ))}
          <button
            type="button"
            style={s.addBtn}
            onClick={() =>
              addRow('billing', { date: '2026-09-26', ref: 'ZX-INV-0000', desc: 'New ledger entry', amount: '₦ 0.00', status: 'PENDING' })
            }
          >
            + ADD BILLING ENTRY
          </button>
        </div>

        {/* PRODUCTS */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>📦 Product Licenses</h3>
          {matrix.products.map((row, i) => (
            <div key={i} style={s.rowBox}>
              <div style={s.rowGrid}>
                <Field label="PRODUCT NAME" value={row.name} onChange={v => setRow('products', i, 'name', v)} />
                <Field label="LICENSE KEY" value={row.key} onChange={v => setRow('products', i, 'key', v)} />
                <Field label="SEATS" value={row.seats} onChange={v => setRow('products', i, 'seats', v)} />
                <Field label="EXPIRY DATE" value={row.expiry} onChange={v => setRow('products', i, 'expiry', v)} />
                <Select label="STATUS" value={row.status} options={['ACTIVE', 'EXPIRING']} onChange={v => setRow('products', i, 'status', v)} />
              </div>
              <button type="button" style={s.removeBtn} onClick={() => removeRow('products', i)}>
                REMOVE LICENSE
              </button>
            </div>
          ))}
          <button
            type="button"
            style={s.addBtn}
            onClick={() =>
              addRow('products', { name: 'New Product', key: 'ZX-NEW-0000-CORE', seats: '1 Terminal', expiry: '2027-01-01', status: 'ACTIVE' })
            }
          >
            + ADD PRODUCT LICENSE
          </button>
        </div>

        {/* OFFERS */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>💎 Exclusive Offers & Upgrades</h3>
          {matrix.offers.map((row, i) => (
            <div key={i} style={s.rowBox}>
              <div style={s.rowGrid}>
                <Field label="OFFER TIER" value={row.tier} onChange={v => setRow('offers', i, 'tier', v)} />
                <Field label="BENEFIT TEXT" value={row.perk} onChange={v => setRow('offers', i, 'perk', v)} />
              </div>
              <button type="button" style={s.removeBtn} onClick={() => removeRow('offers', i)}>
                REMOVE OFFER
              </button>
            </div>
          ))}
          <button
            type="button"
            style={s.addBtn}
            onClick={() => addRow('offers', { tier: 'NEW OFFER', perk: 'Describe the benefit here.' })}
          >
            + ADD OFFER
          </button>
        </div>

        {/* JOBS */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>💼 Job Opportunities & Vacancies</h3>
          {matrix.jobs.map((row, i) => (
            <div key={i} style={s.rowBox}>
              <div style={s.rowGrid}>
                <Field label="ROLE TITLE" value={row.role} onChange={v => setRow('jobs', i, 'role', v)} />
                <Field label="DIVISION" value={row.division} onChange={v => setRow('jobs', i, 'division', v)} />
                <Field label="LOCATION" value={row.loc} onChange={v => setRow('jobs', i, 'loc', v)} />
                <Field label="TYPE" value={row.type} onChange={v => setRow('jobs', i, 'type', v)} />
                <Field
                  label="POSITIONS (COMMA SEPARATED)"
                  value={(row.positions || []).join(', ')}
                  onChange={v => setJobPositions(i, v)}
                />
              </div>
              <button type="button" style={s.removeBtn} onClick={() => removeRow('jobs', i)}>
                REMOVE VACANCY
              </button>
            </div>
          ))}
          <button
            type="button"
            style={s.addBtn}
            onClick={() =>
              addRow('jobs', { role: 'New Role', division: 'DIVISION', loc: 'Remote', type: 'FULL-TIME', positions: ['Graduate Trainee'] })
            }
          >
            + ADD VACANCY
          </button>
        </div>

        {/* APPLICATIONS & APPOINTMENTS */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>🧾 Applications & Appointments</h3>
          <p style={s.muted}>
            Customer 4-step applications land here. Appointing issues the
            ZH-…-Corp passcode and opens the person&apos;s Duty Post space.
          </p>
          {apps.length === 0 && (
            <p style={s.muted}>No applications received yet.</p>
          )}
          {apps.map(a => (
            <div key={a.id} style={s.rowBox}>
              <div style={s.appHead}>
                <span style={s.appName}>{a.fullName}</span>
                <span style={s.appMeta}>
                  {a.position} · {a.job} · {a.id}
                </span>
              </div>
              <p style={s.appMeta}>
                {a.email} · {a.phone} · {a.nationality} · DOB {a.dob}
              </p>
              <p style={s.appMeta}>
                Location: {a.location} — {a.address1}
                {a.address2 ? `, ${a.address2}` : ''}
              </p>
              <p style={s.appMeta}>Experience: {a.experience}</p>
              <p style={s.appMeta}>
                CV: {a.cvFile}
                {a.docFile ? ` · Document: ${a.docFile}` : ''}
              </p>
              <p style={s.appMeta}>Brings: {a.bring}</p>
              <p style={s.appMeta}>Will change: {a.change}</p>
              {a.status === 'APPOINTED' ? (
                <p style={s.passLine}>
                  ✓ APPOINTED — passcode {a.passcode}
                </p>
              ) : (
                <button
                  type="button"
                  style={s.appointBtn}
                  onClick={() => appoint(a.id)}
                >
                  APPOINT & ISSUE PASSCODE
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={s.actionRow}>
          <button type="button" style={s.publishBtn} onClick={publish}>
            ⬆ PUBLISH TO CUSTOMER MESH
          </button>
        </div>

        <button
          type="button"
          style={s.backBtn}
          onClick={() => router.push('/dashboard/management-md')}
        >
          ← BACK TO DIRECTORATE
        </button>
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundColor: ZhonnexTokens.colors.voidBlack,
    minHeight: '100vh',
    color: '#fff',
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden'
  },
  main: { maxWidth: '980px', margin: '0 auto', padding: '3rem' },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1rem'
  },
  title: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    color: ZhonnexTokens.colors.velocityGold,
    fontSize: '1.3rem',
    letterSpacing: '2px',
    margin: 0
  },
  badge: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.6rem',
    letterSpacing: '2px',
    color: ZhonnexTokens.colors.imperialCyan,
    border: '1px solid #0f3a3f',
    borderRadius: '4px',
    padding: '4px 8px'
  },
  muted: {
    color: ZhonnexTokens.colors.textMuted,
    fontFamily: ZhonnexTokens.typography.primaryFont,
    fontSize: '0.9rem',
    lineHeight: 1.6
  },
  notice: {
    color: ZhonnexTokens.colors.securityPass,
    fontFamily: ZhonnexTokens.typography.primaryFont,
    fontSize: '0.85rem',
    margin: '1rem 0 0 0'
  },
  actionRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    margin: '1.5rem 0'
  },
  publishBtn: {
    padding: '14px 20px',
    backgroundColor: ZhonnexTokens.colors.imperialCyan,
    border: 'none',
    color: '#000',
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontWeight: 'bold',
    fontSize: '0.75rem',
    letterSpacing: '2px',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: '1 1 220px'
  },
  resetBtn: {
    padding: '14px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${ZhonnexTokens.colors.velocityGold}`,
    color: ZhonnexTokens.colors.velocityGold,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.75rem',
    letterSpacing: '2px',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: '1 1 160px'
  },
  card: {
    backgroundColor: ZhonnexTokens.colors.quantumSlate,
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '1.75rem',
    marginBottom: '1.5rem'
  },
  cardTitle: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.95rem',
    letterSpacing: '1px',
    color: ZhonnexTokens.colors.imperialCyan,
    marginTop: 0,
    borderBottom: '1px solid #1a1a1c',
    paddingBottom: '0.8rem'
  },
  rowBox: {
    backgroundColor: '#030303',
    border: '1px solid #262626',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '1rem'
  },
  rowGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.75rem'
  },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldLabel: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.55rem',
    letterSpacing: '2px',
    color: ZhonnexTokens.colors.textMuted
  },
  fieldInput: {
    padding: '10px',
    backgroundColor: '#000',
    border: '1px solid #262626',
    borderRadius: '6px',
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%'
  },
  removeBtn: {
    marginTop: '0.75rem',
    background: 'transparent',
    border: 'none',
    color: ZhonnexTokens.colors.securityFail,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.6rem',
    letterSpacing: '2px',
    cursor: 'pointer',
    padding: 0
  },
  addBtn: {
    background: 'transparent',
    border: `1px dashed #333`,
    color: ZhonnexTokens.colors.textMuted,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.65rem',
    letterSpacing: '2px',
    cursor: 'pointer',
    padding: '10px 14px',
    borderRadius: '6px',
    width: '100%'
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: ZhonnexTokens.colors.textMuted,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.65rem',
    letterSpacing: '2px',
    cursor: 'pointer',
    padding: 0
  },
  appHead: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.75rem',
    flexWrap: 'wrap',
    marginBottom: '0.4rem'
  },
  appName: {
    color: '#fff',
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.9rem',
    letterSpacing: '1px'
  },
  appMeta: {
    color: ZhonnexTokens.colors.textMuted,
    fontSize: '0.8rem',
    margin: '0.2rem 0',
    lineHeight: 1.5
  },
  passLine: {
    color: ZhonnexTokens.colors.securityPass,
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    marginTop: '0.6rem'
  },
  appointBtn: {
    marginTop: '0.75rem',
    padding: '12px 16px',
    backgroundColor: ZhonnexTokens.colors.imperialCyan,
    border: 'none',
    color: '#000',
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontWeight: 'bold',
    fontSize: '0.7rem',
    letterSpacing: '2px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%'
  }
};
