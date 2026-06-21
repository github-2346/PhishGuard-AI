import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';

export default function LoginPage() {
  const { setUser, setTokens } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      setTokens({ token: response.token, refreshToken: response.refreshToken });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMsg = 'Invalid email or password';
      if (err.response?.data) {
        errorMsg = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.message || err.response.data.error || 'Invalid credentials';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)', fontFamily: 'var(--font)' }}>
      {/* Left branding panel */}
      <div style={{ flex: 1, display: 'none', background: 'linear-gradient(135deg, #04090f 0%, #0d1626 50%, #0a1f3a 100%)', padding: '60px', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,212,170,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,153,255,0.06) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#00d4aa,#0099ff)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛡️</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>PhishGuard</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: '2px' }}>AI · SECURITY</div>
            </div>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            Defend Against<br />
            <span style={{ background: 'linear-gradient(135deg,#00d4aa,#0099ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Phishing Attacks</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.7, maxWidth: 400 }}>
            AI-powered threat detection that analyzes URLs and emails in real-time to protect you from phishing, malware, and social engineering attacks.
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 24 }}>
            {[['99.7%', 'Detection Rate'], ['<2s', 'Response Time'], ['50M+', 'URLs Scanned']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
        <div style={{ width: '100%' }} className="fadein">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#00d4aa,#0099ff)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛡️</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>PhishGuard AI</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '2px' }}>SECURITY PLATFORM</div>
            </div>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Welcome back</h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 32 }}>Sign in to your security dashboard</p>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(255,71,87,.1)', border: '1px solid rgba(255,71,87,.3)', borderRadius: 8, marginBottom: 20, fontSize: 12, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8, letterSpacing: '.3px' }}>EMAIL ADDRESS</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--card)', color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border .2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8, letterSpacing: '.3px' }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '13px 46px 13px 16px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--card)', color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border .2s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                />
                <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 16 }}>
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>Forgot password?</Link>
            </div>

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg, #00d4aa, #0099ff)', color: '#000', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, opacity: loading ? 0.8 : 1, transition: 'opacity .2s', letterSpacing: '.3px' }}
            >
              {loading ? '⌛ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--text3)' }}>
            New to PhishGuard?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}