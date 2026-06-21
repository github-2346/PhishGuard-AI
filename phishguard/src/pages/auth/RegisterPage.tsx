import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';

export default function RegisterPage() {
  const { setUser, setTokens } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await authService.register({ name: form.name, email: form.email, password: form.password });
      // Registration returns a string from backend, so we must manually login after registration
      const loginRes = await authService.login({ email: form.email, password: form.password });
      setUser(loginRes.user);
      setTokens({ token: loginRes.token, refreshToken: loginRes.refreshToken });
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: 10,
    border: '1px solid var(--border2)', background: 'var(--card)',
    color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border .2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 460 }} className="fadein">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, justifyContent: 'center' }}>
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#00d4aa,#0099ff)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛡️</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>PhishGuard AI</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '2px' }}>SECURITY PLATFORM</div>
          </div>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 32px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Create account</h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 28 }}>Join thousands of security-conscious users</p>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(255,71,87,.1)', border: '1px solid rgba(255,71,87,.3)', borderRadius: 8, marginBottom: 20, fontSize: 12, color: 'var(--red)' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'FULL NAME', key: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'EMAIL ADDRESS', key: 'email', type: 'email', placeholder: 'you@company.com' },
              { label: 'PASSWORD', key: 'password', type: 'password', placeholder: '••••••••' },
              { label: 'CONFIRM PASSWORD', key: 'confirm', type: 'password', placeholder: '••••••••' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text2)', marginBottom: 7, letterSpacing: '.5px' }}>{label}</label>
                <input
                  type={type} required placeholder={placeholder}
                  value={(form as any)[key]} onChange={set(key)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                />
              </div>
            ))}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg, #00d4aa, #0099ff)', color: '#000', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, marginTop: 8, opacity: loading ? 0.8 : 1, letterSpacing: '.3px' }}
            >
              {loading ? '⌛ Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}