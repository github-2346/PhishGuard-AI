const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'phishguard', 'src', 'pages');

const pages = {
  'auth/LoginPage.tsx': `
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <h2 style={{ color: 'var(--text)', marginBottom: '20px', textAlign: 'center', fontSize: '24px' }}>Welcome Back</h2>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: 'var(--text2)', marginBottom: '8px', fontSize: '14px' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontSize: '14px' }} required />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: 'var(--text2)', marginBottom: '8px', fontSize: '14px' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontSize: '14px' }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #00d4aa, #0099ff)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Sign In</button>
        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--text3)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign up</Link>
        </div>
      </form>
    </div>
  );
}
`,
  'auth/RegisterPage.tsx': `
import React from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: 'var(--text)', marginBottom: '20px', textAlign: 'center' }}>Create Account</h2>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: 'var(--text2)', marginBottom: '8px', fontSize: '14px' }}>Name</label>
          <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)' }} required />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: 'var(--text2)', marginBottom: '8px', fontSize: '14px' }}>Email</label>
          <input type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)' }} required />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: 'var(--text2)', marginBottom: '8px', fontSize: '14px' }}>Password</label>
          <input type="password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)' }} required />
        </div>
        <button style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #00d4aa, #0099ff)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Register</button>
        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--text3)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
`,
  'auth/ForgotPasswordPage.tsx': `
import React from 'react';
export default function ForgotPasswordPage() {
  return <div style={{ padding: 40, color: '#fff' }}>Forgot Password - Coming Soon</div>;
}
`,
  'auth/ResetPasswordPage.tsx': `
import React from 'react';
export default function ResetPasswordPage() {
  return <div style={{ padding: 40, color: '#fff' }}>Reset Password - Coming Soon</div>;
}
`,
  'dashboard/DashboardPage.tsx': `
import React from 'react';
export default function DashboardPage() {
  return (
    <div style={{ padding: 40, color: '#fff' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: 'bold' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'var(--card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '8px' }}>Total Scans</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent)' }}>124</p>
        </div>
        <div style={{ background: 'var(--card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '8px' }}>Threats Detected</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--red)' }}>12</p>
        </div>
        <div style={{ background: 'var(--card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '8px' }}>Safe URLs</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#00cc66' }}>112</p>
        </div>
      </div>
    </div>
  );
}
`,
  'scanner/URLScannerPage.tsx': `
import React, { useState } from 'react';
export default function URLScannerPage() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const scanUrl = () => {
    if (!url) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult({
        status: url.includes('phishing') ? 'Suspicious' : 'Safe',
        score: url.includes('phishing') ? 82 : 12,
        recommendation: url.includes('phishing') ? 'Avoid Visiting' : 'Safe to proceed'
      });
    }, 1500);
  };

  return (
    <div style={{ padding: 40, color: '#fff', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>URL Scanner</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '32px' }}>Analyze suspicious URLs with AI and threat intelligence feeds.</p>
      
      <div style={{ background: 'var(--card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <input 
          type="url" 
          placeholder="https://example.com" 
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border2)', color: '#fff', fontSize: '16px', marginBottom: '20px' }}
        />
        <button 
          onClick={scanUrl}
          disabled={scanning}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #00d4aa, #0099ff)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: scanning ? 0.7 : 1 }}
        >
          {scanning ? 'Scanning...' : 'Scan URL'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '32px', background: 'var(--bg2)', padding: '24px', borderRadius: '12px', border: \`1px solid \${result.status === 'Safe' ? '#00cc66' : 'var(--red)'}\` }}>
          <h2 style={{ color: result.status === 'Safe' ? '#00cc66' : 'var(--red)', marginBottom: '16px' }}>Result: {result.status}</h2>
          <p style={{ marginBottom: '8px' }}>Risk Score: <strong>{result.score}%</strong></p>
          <p>Recommendation: <strong>{result.recommendation}</strong></p>
        </div>
      )}
    </div>
  );
}
`,
  'email/EmailAnalysisPage.tsx': `
import React, { useState } from 'react';
export default function EmailAnalysisPage() {
  const [content, setContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeEmail = () => {
    if (!content) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        status: content.includes('urgent') || content.includes('password') ? 'Phishing Attempt Detected' : 'Clean',
        riskLevel: content.includes('urgent') || content.includes('password') ? 'HIGH' : 'LOW'
      });
    }, 1500);
  };

  return (
    <div style={{ padding: 40, color: '#fff', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>Email Analysis</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '32px' }}>Paste email headers and content to detect phishing patterns.</p>
      
      <div style={{ background: 'var(--card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <textarea 
          placeholder="Paste email content here..." 
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={10}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border2)', color: '#fff', fontSize: '14px', marginBottom: '20px', resize: 'vertical' }}
        />
        <button 
          onClick={analyzeEmail}
          disabled={analyzing}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #00d4aa, #0099ff)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: analyzing ? 0.7 : 1 }}
        >
          {analyzing ? 'Analyzing...' : 'Analyze Content'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '32px', background: 'var(--bg2)', padding: '24px', borderRadius: '12px', border: \`1px solid \${result.riskLevel === 'LOW' ? '#00cc66' : 'var(--red)'}\` }}>
          <h2 style={{ color: result.riskLevel === 'LOW' ? '#00cc66' : 'var(--red)', marginBottom: '16px' }}>Status: {result.status}</h2>
          <p>Risk Level: <strong>{result.riskLevel}</strong></p>
        </div>
      )}
    </div>
  );
}
`,
  'history/ScanHistoryPage.tsx': `
import React from 'react';
export default function ScanHistoryPage() {
  return (
    <div style={{ padding: 40, color: '#fff' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: 'bold' }}>Scan History</h1>
      <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', color: 'var(--text2)', fontWeight: 500 }}>Target</th>
              <th style={{ padding: '16px', color: 'var(--text2)', fontWeight: 500 }}>Type</th>
              <th style={{ padding: '16px', color: 'var(--text2)', fontWeight: 500 }}>Result</th>
              <th style={{ padding: '16px', color: 'var(--text2)', fontWeight: 500 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px' }}>google.com</td>
              <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', background: 'var(--bg)', borderRadius: '4px', fontSize: '12px' }}>URL</span></td>
              <td style={{ padding: '16px', color: '#00cc66' }}>Safe</td>
              <td style={{ padding: '16px', color: 'var(--text3)' }}>Today, 10:23 AM</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px' }}>login-paypal-update.com</td>
              <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', background: 'var(--bg)', borderRadius: '4px', fontSize: '12px' }}>URL</span></td>
              <td style={{ padding: '16px', color: 'var(--red)' }}>Phishing</td>
              <td style={{ padding: '16px', color: 'var(--text3)' }}>Yesterday, 14:05 PM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,
  'reports/ReportsPage.tsx': `
import React from 'react';
export default function ReportsPage() {
  return <div style={{ padding: 40, color: '#fff' }}>Reports - Implementation pending</div>;
}
`,
  'profile/ProfilePage.tsx': `
import React from 'react';
export default function ProfilePage() {
  return <div style={{ padding: 40, color: '#fff' }}>Profile - Implementation pending</div>;
}
`,
  'settings/SettingsPage.tsx': `
import React from 'react';
export default function SettingsPage() {
  return <div style={{ padding: 40, color: '#fff' }}>Settings - Implementation pending</div>;
}
`,
  'admin/AdminUsersPage.tsx': `
import React from 'react';
export default function AdminUsersPage() {
  return <div style={{ padding: 40, color: '#fff' }}>User Management - Admin Area</div>;
}
`,
  'admin/AdminAnalyticsPage.tsx': `
import React from 'react';
export default function AdminAnalyticsPage() {
  return <div style={{ padding: 40, color: '#fff' }}>Global Analytics - Admin Area</div>;
}
`,
  'admin/AdminThreatsPage.tsx': `
import React from 'react';
export default function AdminThreatsPage() {
  return <div style={{ padding: 40, color: '#fff' }}>Live Threat Monitor - Admin Area</div>;
}
`
};

Object.entries(pages).forEach(([relPath, content]) => {
  const fullPath = path.join(basePath, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim());
});

console.log('Pages generated successfully!');
