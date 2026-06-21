import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Alert } from '../../components/common';

export default function ProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', company: '' });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, outline: 'none' };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 700, animation: 'fadein .3s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>👤 Profile</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Manage your account information and preferences</p>
      </div>

      {saved && <Alert type="success">✅ Profile updated successfully!</Alert>}

      {/* Avatar section */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4aa, #0099ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#000', flexShrink: 0 }}>
          {initials(user?.name || 'U')}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
          <div style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 8 }}>{user?.email}</div>
          <span style={{ padding: '3px 10px', background: user?.role === 'ADMIN' ? 'rgba(255,71,87,.15)' : 'rgba(0,153,255,.15)', color: user?.role === 'ADMIN' ? 'var(--red)' : 'var(--accent2)', border: `1px solid ${user?.role === 'ADMIN' ? 'rgba(255,71,87,.3)' : 'rgba(0,153,255,.3)'}`, borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            {user?.role || 'USER'}
          </span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button variant="outline" size="sm">Change Photo</Button>
        </div>
      </div>

      {/* Profile form */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Personal Information</div>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {[
              { label: 'FULL NAME', key: 'name', type: 'text' },
              { label: 'EMAIL', key: 'email', type: 'email' },
              { label: 'PHONE', key: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
              { label: 'COMPANY', key: 'company', type: 'text', placeholder: 'Your organization' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text3)', marginBottom: 7, letterSpacing: '.5px' }}>{label}</label>
                <input
                  type={type} value={(form as any)[key]} onChange={set(key)}
                  placeholder={placeholder || ''}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                />
              </div>
            ))}
          </div>
          <Button type="submit" variant="primary" style={{ marginTop: 8, padding: '12px 32px' }}>Save Changes</Button>
        </form>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 20 }}>
        {[['🔍', 'Total Scans', '47'], ['🚨', 'Threats Found', '8'], ['✅', 'Safe Results', '39']].map(([icon, label, val]) => (
          <div key={label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}