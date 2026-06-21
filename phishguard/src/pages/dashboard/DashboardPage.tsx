import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Badge, StatCard, RiskMeter } from '../../components/common';
import type { ScanHistoryItem } from '../../types';

const SAMPLE_HISTORY: ScanHistoryItem[] = [
  { id: 'h1', type: 'URL',   content: 'login-paypal-secure.xyz',  risk: 'HIGH',   status: 'Phishing',  date: '2 min ago' },
  { id: 'h2', type: 'Email', content: 'Urgent: Verify your account now!',   risk: 'HIGH',   status: 'Phishing',  date: '18 min ago' },
  { id: 'h3', type: 'URL',   content: 'https://github.com',                  risk: 'LOW',    status: 'Safe',      date: '1h ago' },
  { id: 'h4', type: 'URL',   content: 'free-iphone-winner.site',             risk: 'HIGH',   status: 'Suspicious', date: '3h ago' },
  { id: 'h5', type: 'Email', content: 'Meeting tomorrow at 9am.',            risk: 'LOW',    status: 'Safe',      date: '5h ago' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { scanHistory, addScan } = useApp();
  const history = scanHistory.length ? scanHistory : SAMPLE_HISTORY;

  const total   = history.length;
  const threats = history.filter(h => h.risk === 'HIGH').length;
  const safe    = history.filter(h => h.risk === 'LOW').length;
  const riskPct = total ? Math.round((threats / total) * 100) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '28px 32px', animation: 'fadein .3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
          {greeting}, {user?.name?.split(' ')[0] ?? 'User'} 👋
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>
          Here's your security overview for today · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Scans"      value={String(total)}   icon="🔍" color="teal"  change="All time" />
        <StatCard label="Threats Detected" value={String(threats)}  icon="🚨" color="red"   change={`${riskPct}% of scans`} />
        <StatCard label="Safe Results"     value={String(safe)}     icon="✅" color="green" change="Cleared" />
        <StatCard label="Risk Rate"        value={`${riskPct}%`}    icon="📊" color="blue"  change="Detection accuracy" />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Recent Activity */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Recent Scans</div>
            <span style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer' }}>View All →</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.slice(0, 6).map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.type === 'URL' ? '🔗' : '📧'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.content}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{item.type} · {item.date}</div>
                </div>
                <Badge risk={item.risk}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Threat Breakdown</div>
            {[
              { label: 'Phishing URLs',    pct: 42, color: 'var(--red)'    },
              { label: 'Email Scams',      pct: 28, color: 'var(--orange)' },
              { label: 'Malware Links',    pct: 18, color: 'var(--yellow)' },
              { label: 'Safe Content',     pct: 12, color: 'var(--accent)' },
            ].map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text2)' }}>{label}</span>
                  <span style={{ color, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width .8s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Quick Actions</div>
            {[
              { icon: '🔗', label: 'Scan a URL', to: '/scanner', color: 'var(--accent)' },
              { icon: '📧', label: 'Analyze Email', to: '/email', color: 'var(--accent2)' },
              { icon: '📋', label: 'View History', to: '/history', color: 'var(--text2)' },
            ].map(({ icon, label, to, color }) => (
              <a key={label} href={to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)', fontSize: 13, fontWeight: 500, transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = color)}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                {label}
                <span style={{ marginLeft: 'auto', color: 'var(--text3)', fontSize: 12 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}