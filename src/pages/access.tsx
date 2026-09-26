import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ZhonnexTokens } from '../config/design-tokens';
import { HeaderNavigation } from '../components/HeaderNavigation';
import { useIsMobile } from '../hooks/useIsMobile';

type Mode = 'signin' | 'register';

interface StoredAccount {
  fullName: string;
  email: string;
  idKey: string;
  password: string;
}

const STORAGE_KEY = 'zhonnex_customer_accounts';

function readAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export default function CustomerAccessTerminal() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [mode, setMode] = useState<Mode>('signin');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [signIn, setSignIn] = useState({ idKey: '', password: '' });
  const [register, setRegister] = useState({
    fullName: '',
    email: '',
    idKey: '',
    password: '',
    confirm: ''
  });

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setNotice('');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const idKey = signIn.idKey.trim();
    if (!idKey || !signIn.password) {
      setError('ID Key and password are required.');
      return;
    }
    const accounts = readAccounts();
    if (accounts.length > 0) {
      const match = accounts.find(
        a =>
          a.idKey.toLowerCase() === idKey.toLowerCase() &&
          a.password === signIn.password
      );
      if (!match) {
        setError('Invalid Zhonnex ID Key or password for this terminal.');
        return;
      }
    }
    setError('');
    router.push('/dashboard/customer');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = register.fullName.trim();
    const email = register.email.trim();
    const idKey = register.idKey.trim();

    if (!fullName || !email || !idKey || !register.password || !register.confirm) {
      setError('All fields are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (idKey.length < 6) {
      setError('Zhonnex ID Key must be at least 6 characters.');
      return;
    }
    if (register.password.length < 6) {
      setError('Access password must be at least 6 characters.');
      return;
    }
    if (register.password !== register.confirm) {
      setError('Passwords do not match.');
      return;
    }

    const accounts = readAccounts();
    if (accounts.some(a => a.idKey.toLowerCase() === idKey.toLowerCase())) {
      setError('That Zhonnex ID Key is already registered on this terminal.');
      return;
    }

    accounts.push({ fullName, email, idKey, password: register.password });
    writeAccounts(accounts);

    setRegister({ fullName: '', email: '', idKey: '', password: '', confirm: '' });
    setSignIn({ idKey, password: '' });
    setMode('signin');
    setError('');
    setNotice('PROFILE INITIALIZED — sign in with your new Zhonnex ID Key.');
  };

  return (
    <div style={styles.pageWrapper}>
      <HeaderNavigation />

      <main
        style={{
          ...styles.main,
          padding: isMobile ? '2.5rem 1.1rem' : '4rem 2rem'
        }}
      >
        <div
          style={{
            ...styles.card,
            padding: isMobile ? '2.25rem 1.25rem' : '3rem'
          }}
        >
          <p style={styles.eyebrow}>CUSTOMER INTERFACE</p>
          <h1 style={styles.title}>ECOSYSTEM ACCESS TERMINAL</h1>

          <div style={styles.tabRow}>
            <button
              type="button"
              onClick={() => switchMode('signin')}
              style={{
                ...styles.tabBtn,
                ...(mode === 'signin' ? styles.tabActive : {})
              }}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              style={{
                ...styles.tabBtn,
                ...(mode === 'register' ? styles.tabActive : {})
              }}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {notice && <p style={styles.noticeText}>{notice}</p>}
          {error && <p style={styles.errorText}>{error}</p>}

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} style={styles.form}>
              <label style={styles.label} htmlFor="signin-idkey">
                ZHONNEX ID KEY
              </label>
              <input
                id="signin-idkey"
                type="text"
                placeholder="Enter your private Zhonnex ID Key"
                style={styles.input}
                value={signIn.idKey}
                onChange={e => setSignIn({ ...signIn, idKey: e.target.value })}
                required
              />
              <label style={styles.label} htmlFor="signin-password">
                ACCESS PASSWORD
              </label>
              <input
                id="signin-password"
                type="password"
                placeholder="Enter your cryptographic token password"
                style={styles.input}
                value={signIn.password}
                onChange={e => setSignIn({ ...signIn, password: e.target.value })}
                required
              />
              <button type="submit" style={styles.primaryBtn}>
                SIGN IN
              </button>
              <p style={styles.hint}>
                New to Zhonnex? Switch to CREATE ACCOUNT above.
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={styles.form}>
              <label style={styles.label} htmlFor="reg-name">
                FULL NAME
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Enter your full legal name"
                style={styles.input}
                value={register.fullName}
                onChange={e =>
                  setRegister({ ...register, fullName: e.target.value })
                }
                required
              />
              <label style={styles.label} htmlFor="reg-email">
                EMAIL ADDRESS
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="name@domain.com"
                style={styles.input}
                value={register.email}
                onChange={e => setRegister({ ...register, email: e.target.value })}
                required
              />
              <label style={styles.label} htmlFor="reg-idkey">
                CREATE ZHONNEX ID KEY
              </label>
              <input
                id="reg-idkey"
                type="text"
                placeholder="Min 6 characters — e.g. ZX-EMPIRE-001"
                style={styles.input}
                value={register.idKey}
                onChange={e => setRegister({ ...register, idKey: e.target.value })}
                required
              />
              <label style={styles.label} htmlFor="reg-password">
                ACCESS PASSWORD
              </label>
              <input
                id="reg-password"
                type="password"
                placeholder="Min 6 characters"
                style={styles.input}
                value={register.password}
                onChange={e =>
                  setRegister({ ...register, password: e.target.value })
                }
                required
              />
              <label style={styles.label} htmlFor="reg-confirm">
                CONFIRM PASSWORD
              </label>
              <input
                id="reg-confirm"
                type="password"
                placeholder="Repeat your access password"
                style={styles.input}
                value={register.confirm}
                onChange={e =>
                  setRegister({ ...register, confirm: e.target.value })
                }
                required
              />
              <button type="submit" style={styles.primaryBtn}>
                CREATE ACCOUNT
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => router.push('/')}
            style={styles.backLink}
          >
            ← RETURN TO GATEWAY
          </button>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundColor: ZhonnexTokens.colors.voidBlack,
    minHeight: '100vh',
    color: '#ffffff',
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden'
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '4rem 2rem'
  },
  card: {
    backgroundColor: ZhonnexTokens.colors.surfaceBlack,
    border: '1px solid #151515',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '480px',
    padding: '3rem',
    textAlign: 'center'
  },
  eyebrow: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    color: ZhonnexTokens.colors.velocityGold,
    fontSize: '0.65rem',
    letterSpacing: '4px',
    margin: '0 0 0.75rem 0'
  },
  title: {
    fontFamily: ZhonnexTokens.typography.displayFont,
    color: ZhonnexTokens.colors.imperialCyan,
    fontSize: '1.15rem',
    letterSpacing: '2px',
    margin: '0 0 2rem 0'
  },
  tabRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  tabBtn: {
    flex: 1,
    padding: '12px 8px',
    backgroundColor: 'transparent',
    border: '1px solid #262626',
    borderRadius: '6px',
    color: ZhonnexTokens.colors.textMuted,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.7rem',
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabActive: {
    borderColor: ZhonnexTokens.colors.imperialCyan,
    color: ZhonnexTokens.colors.imperialCyan,
    backgroundColor: 'rgba(0, 240, 255, 0.06)'
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
    outline: 'none',
    width: '100%'
  },
  primaryBtn: {
    marginTop: '1.25rem',
    padding: '16px',
    backgroundColor: ZhonnexTokens.colors.imperialCyan,
    border: 'none',
    color: '#000000',
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontWeight: 'bold',
    fontSize: '0.95rem',
    borderRadius: '6px',
    cursor: 'pointer',
    letterSpacing: '3px'
  },
  hint: {
    fontFamily: ZhonnexTokens.typography.primaryFont,
    color: ZhonnexTokens.colors.textMuted,
    fontSize: '0.8rem',
    textAlign: 'center',
    margin: '1rem 0 0 0'
  },
  noticeText: {
    color: ZhonnexTokens.colors.securityPass,
    fontSize: '0.8rem',
    fontFamily: ZhonnexTokens.typography.primaryFont,
    marginBottom: '0.5rem'
  },
  errorText: {
    color: ZhonnexTokens.colors.securityFail,
    fontSize: '0.8rem',
    fontFamily: ZhonnexTokens.typography.primaryFont,
    marginBottom: '0.5rem'
  },
  backLink: {
    marginTop: '1.75rem',
    background: 'transparent',
    border: 'none',
    color: ZhonnexTokens.colors.textMuted,
    fontFamily: ZhonnexTokens.typography.displayFont,
    fontSize: '0.65rem',
    letterSpacing: '2px',
    cursor: 'pointer'
  }
};
