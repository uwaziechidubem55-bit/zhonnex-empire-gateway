import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ZhonnexTokens } from '../config/design-tokens';
import { HeaderNavigation } from '../components/HeaderNavigation';
import { useIsMobile } from '../hooks/useIsMobile';
import { Application, submitApplication } from '../config/applications';

/* ------------------------------------------------------------------ */
/* 4-STEP RECRUITMENT WIZARD                                          */
/* 1 identity -> 2 experience & documents -> 3 review & submit ->     */
/* 4 confirmation (under review)                                      */
/* ------------------------------------------------------------------ */

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  nationality: '',
  experience: '',
  cvFile: '',
  docFile: '',
  location: '',
  address1: '',
  address2: '',
  bring: '',
  change: ''
};

export default function ApplyTerminal() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const job = typeof router.query.job === 'string' ? router.query.job : '';
  const position =
    typeof router.query.position === 'string' ? router.query.position : '';

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...EMPTY });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<Application | null>(null);

  const set = (key: keyof typeof EMPTY, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const nextFrom1 = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.dob || !form.nationality.trim()) {
      setError('All identity fields are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setStep(2);
  };

  const nextFrom2 = () => {
    if (!form.experience.trim() || !form.cvFile || !form.location.trim() || !form.address1.trim() || !form.bring.trim() || !form.change.trim()) {
      setError('Experience, CV file, location, address line 1 and both essay fields are required.');
      return;
    }
    setError('');
    setStep(3);
  };

  const submit = () => {
    const app = submitApplication({ ...form, job, position });
    setSubmitted(app);
    setStep(4);
  };

  return (
    <div style={st.pageWrapper}>
      <HeaderNavigation />
      <main style={{ ...st.main, padding: isMobile ? '2rem 1.1rem' : '3rem' }}>
        <div style={st.card}>
          <p style={st.eyebrow}>ZHONNEX RECRUITMENT MESH</p>
          <h1 style={st.title}>POSITION APPLICATION</h1>
          <p style={st.sub}>
            {job || '—'} · <span style={{ color: ZhonnexTokens.colors.velocityGold }}>{position || '—'}</span>
          </p>

          {/* progress */}
          <div style={st.steps}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{ ...st.stepDot, ...(step >= n ? st.stepOn : {}) }}>
                {n}
              </div>
            ))}
          </div>

          {error && <p style={st.error}>{error}</p>}

          {step === 1 && (
            <div style={st.form}>
              <p style={st.stepTitle}>STEP 1 — IDENTITY</p>
              <label style={st.label}>FULL NAME</label>
              <input style={st.input} value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="As on official documents" />
              <label style={st.label}>EMAIL ADDRESS</label>
              <input style={st.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="name@domain.com" />
              <label style={st.label}>PHONE NUMBER</label>
              <input style={st.input} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234…" />
              <label style={st.label}>DATE OF BIRTH</label>
              <input style={st.input} type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
              <label style={st.label}>NATIONALITY</label>
              <input style={st.input} value={form.nationality} onChange={e => set('nationality', e.target.value)} placeholder="Nationality" />
              <button type="button" style={st.cyanBtn} onClick={nextFrom1}>NEXT →</button>
            </div>
          )}

          {step === 2 && (
            <div style={st.form}>
              <p style={st.stepTitle}>STEP 2 — EXPERIENCE & DOCUMENTS</p>
              <label style={st.label}>JOB EXPERIENCE (YEARS + SUMMARY)</label>
              <textarea style={{ ...st.input, minHeight: '90px' }} value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="Roles held, years, key results" />
              <label style={st.label}>SUBMIT CV (PDF/DOC)</label>
              <input
                type="file"
                style={st.fileInput}
                onChange={e => set('cvFile', e.target.files && e.target.files[0] ? e.target.files[0].name : '')}
              />
              {form.cvFile && <p style={st.fileNote}>Attached: {form.cvFile}</p>}
              <label style={st.label}>SUPPORTING DOCUMENT (CERTIFICATE / ID)</label>
              <input
                type="file"
                style={st.fileInput}
                onChange={e => set('docFile', e.target.files && e.target.files[0] ? e.target.files[0].name : '')}
              />
              {form.docFile && <p style={st.fileNote}>Attached: {form.docFile}</p>}
              <label style={st.label}>CURRENT LOCATION</label>
              <input style={st.input} value={form.location} onChange={e => set('location', e.target.value)} placeholder="City, State / Country" />
              <label style={st.label}>ADDRESS LINE 1</label>
              <input style={st.input} value={form.address1} onChange={e => set('address1', e.target.value)} placeholder="Street address" />
              <label style={st.label}>ADDRESS LINE 2</label>
              <input style={st.input} value={form.address2} onChange={e => set('address2', e.target.value)} placeholder="Apartment, suite, unit (optional)" />
              <label style={st.label}>WHAT WILL YOU BRING TO THIS COMPANY?</label>
              <textarea style={{ ...st.input, minHeight: '90px' }} value={form.bring} onChange={e => set('bring', e.target.value)} placeholder="Skills, energy, networks, discipline…" />
              <label style={st.label}>WHAT WILL YOU CHANGE IN THE COMPANY?</label>
              <textarea style={{ ...st.input, minHeight: '90px' }} value={form.change} onChange={e => set('change', e.target.value)} placeholder="The improvement you will drive…" />
              <div style={st.rowBtns}>
                <button type="button" style={st.ghostBtn} onClick={() => setStep(1)}>← BACK</button>
                <button type="button" style={st.cyanBtn} onClick={nextFrom2}>NEXT →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={st.form}>
              <p style={st.stepTitle}>STEP 3 — REVIEW & SUBMIT</p>
              <div style={st.reviewBox}>
                <div style={st.reviewHead}>
                  <span>IDENTITY</span>
                  <button type="button" style={st.editBtn} onClick={() => setStep(1)}>EDIT</button>
                </div>
                <p style={st.reviewLine}>Name: {form.fullName}</p>
                <p style={st.reviewLine}>Email: {form.email} · Phone: {form.phone}</p>
                <p style={st.reviewLine}>DOB: {form.dob} · Nationality: {form.nationality}</p>
                <div style={st.reviewHead}>
                  <span>EXPERIENCE & DOCUMENTS</span>
                  <button type="button" style={st.editBtn} onClick={() => setStep(2)}>EDIT</button>
                </div>
                <p style={st.reviewLine}>Experience: {form.experience}</p>
                <p style={st.reviewLine}>CV: {form.cvFile} {form.docFile ? `· Document: ${form.docFile}` : ''}</p>
                <p style={st.reviewLine}>Location: {form.location}</p>
                <p style={st.reviewLine}>Address: {form.address1}{form.address2 ? `, ${form.address2}` : ''}</p>
                <p style={st.reviewLine}>Brings: {form.bring}</p>
                <p style={st.reviewLine}>Will change: {form.change}</p>
              </div>
              <div style={st.rowBtns}>
                <button type="button" style={st.ghostBtn} onClick={() => setStep(2)}>← BACK</button>
                <button type="button" style={st.cyanBtn} onClick={submit}>SUBMIT APPLICATION</button>
              </div>
            </div>
          )}

          {step === 4 && submitted && (
            <div style={st.form}>
              <p style={st.stepTitle}>STEP 4 — TRANSMISSION COMPLETE</p>
              <div style={st.confirmBox}>
                <p style={st.confirmBig}>✅ YOUR REQUEST HAS BEEN SENT</p>
                <p style={st.reviewLine}>Reference: {submitted.id}</p>
                <p style={st.muted}>
                  Status: UNDER REVIEW. Check back later here or check your
                  mail. When the position is given to you, your access link
                  and ZH-…-Corp passcode will appear in the Jobs room under
                  “Your Applications”.
                </p>
              </div>
              <button
                type="button"
                style={st.ghostBtn}
                onClick={() => router.push('/dashboard/customer/jobs')}
              >
                ← RETURN TO JOB OPENINGS
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const st: Record<string, React.CSSProperties> = {
  pageWrapper: { backgroundColor: ZhonnexTokens.colors.voidBlack, minHeight: '100vh', color: '#fff', width: '100%', maxWidth: '100vw', overflowX: 'hidden' },
  main: { maxWidth: '720px', margin: '0 auto' },
  card: { backgroundColor: ZhonnexTokens.colors.surfaceBlack, border: '1px solid #151515', borderRadius: '12px', padding: '2rem' },
  eyebrow: { fontFamily: ZhonnexTokens.typography.displayFont, color: ZhonnexTokens.colors.velocityGold, fontSize: '0.65rem', letterSpacing: '4px', margin: '0 0 0.5rem 0' },
  title: { fontFamily: ZhonnexTokens.typography.displayFont, color: ZhonnexTokens.colors.imperialCyan, fontSize: '1.2rem', letterSpacing: '2px', margin: '0 0 0.5rem 0' },
  sub: { color: ZhonnexTokens.colors.textMuted, fontSize: '0.9rem', marginBottom: '1.5rem' },
  steps: { display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' },
  stepDot: { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #333', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.8rem' },
  stepOn: { borderColor: ZhonnexTokens.colors.imperialCyan, color: ZhonnexTokens.colors.imperialCyan },
  error: { color: ZhonnexTokens.colors.securityFail, fontSize: '0.8rem', marginBottom: '0.75rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  stepTitle: { fontFamily: ZhonnexTokens.typography.displayFont, color: '#fff', letterSpacing: '2px', fontSize: '0.8rem', margin: '0.5rem 0 0.5rem 0' },
  label: { fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.6rem', letterSpacing: '2px', color: ZhonnexTokens.colors.textMuted, marginTop: '0.5rem' },
  input: { padding: '12px', backgroundColor: '#000', border: '1px solid #262626', borderRadius: '6px', color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', width: '100%' },
  fileInput: { color: ZhonnexTokens.colors.textMuted, fontSize: '0.85rem', fontFamily: 'monospace' },
  fileNote: { color: ZhonnexTokens.colors.securityPass, fontSize: '0.75rem', margin: 0 },
  rowBtns: { display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' },
  cyanBtn: { flex: 1, padding: '14px', backgroundColor: ZhonnexTokens.colors.imperialCyan, border: 'none', color: '#000', fontFamily: ZhonnexTokens.typography.displayFont, fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '2px', borderRadius: '6px', cursor: 'pointer', minWidth: '160px' },
  ghostBtn: { padding: '14px 18px', backgroundColor: 'transparent', border: '1px solid #333', color: ZhonnexTokens.colors.textMuted, fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.7rem', letterSpacing: '2px', borderRadius: '6px', cursor: 'pointer' },
  reviewBox: { backgroundColor: '#030303', border: '1px solid #262626', borderRadius: '8px', padding: '1.25rem' },
  reviewHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.65rem', letterSpacing: '2px', color: ZhonnexTokens.colors.imperialCyan, marginTop: '0.75rem' },
  editBtn: { background: 'transparent', border: '1px solid #333', color: ZhonnexTokens.colors.textMuted, fontFamily: ZhonnexTokens.typography.displayFont, fontSize: '0.6rem', letterSpacing: '1px', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' },
  reviewLine: { color: ZhonnexTokens.colors.textLight, fontSize: '0.85rem', margin: '0.35rem 0', lineHeight: 1.5 },
  confirmBox: { backgroundColor: '#030303', borderLeft: `4px solid ${ZhonnexTokens.colors.securityPass}`, borderRadius: '6px', padding: '1.25rem', marginBottom: '1rem' },
  confirmBig: { color: ZhonnexTokens.colors.securityPass, fontFamily: ZhonnexTokens.typography.displayFont, letterSpacing: '1px', fontSize: '0.95rem', margin: '0 0 0.5rem 0' },
  muted: { color: ZhonnexTokens.colors.textMuted, fontSize: '0.85rem', lineHeight: 1.6 }
};