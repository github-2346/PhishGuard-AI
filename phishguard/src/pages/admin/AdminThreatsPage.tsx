import React, { useState } from 'react';
import { Badge } from '../../components/common';

const THREATS = [
  { id: 'T-001', type: 'Phishing URL',    target: 'login-paypal-secure.xyz',    severity: 'HIGH',   country: '🇷🇺 Russia',    time: '2 min ago',  status: 'Blocked'    },
  { id: 'T-002', type: 'Malware Drop',    target: 'free-download-movies.tk',    severity: 'HIGH',   country: '🇳🇬 Nigeria',   time: '8 min ago',  status: 'Blocked'    },
  { id: 'T-003', type: 'Email Scam',      target: 'Lottery Winner Notification', severity: 'HIGH',   country: '🇧🇷 Brazil',    time: '15 min ago', status: 'Quarantine' },
  { id: 'T-004', type: 'Suspicious URL',  target: 'bit.ly/3xH7mPq',             severity: 'MEDIUM', country: '🇺🇸 USA',       time: '1h ago',     status: 'Monitoring' },
  { id: 'T-005', type: 'Credential Theft', target: 'banking-secure-update.com',  severity: 'HIGH',   country: '🇨🇳 China',     time: '2h ago',     status: 'Blocked'    },
  { id: 'T-006', type: 'Social Engineer', target: 'Prize claim email',           severity: 'MEDIUM', country: '🇮🇳 India',     time: '3h ago',     status: 'Flagged'    },
];

export default function AdminThreatsPage() {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  const shown = THREATS.filter(t => filter === 'ALL' || t.severity === filter);

  return (
    <div style={{ padding: '28px 32px', animation: 'fadein .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🚨 Live Threat Monitor</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>Real-time threat intelligence feed · Auto-refreshes every 30s</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(0,212,170,.08)', border: '1px solid rgba(0,212,170,.2)', borderRadius: 8, fontSize: 12 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          LIVE MONITORING
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Active Threats',    val: THREATS.length, color: 'var(--red)',     icon: '🚨' },
          { label: 'Blocked Today',     val: 128,            color: 'var(--accent)',  icon: '🛡️' },
          { label: 'Under Review',      val: 7,              color: 'var(--orange)',  icon: '🔍' },
          { label: 'Countries',         val: 6,              color: 'var(--accent2)', icon: '🌍' },
        ].map(({ label, val, color, icon }) => (
          <div key={label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</span>
              <span>{icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: 'var(--mono)' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {(['ALL', 'HIGH', 'MEDIUM'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 18px', borderRadius: 8, border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`, background: filter === f ? 'rgba(0,212,170,.1)' : 'transparent', color: filter === f ? 'var(--accent)' : 'var(--text2)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font)' }}>
            {f === 'ALL' ? 'All Threats' : f + ' Risk'}
          </button>
        ))}
      </div>

      {/* Threat feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shown.map(t => (
          <div key={t.id}
            style={{ background: 'var(--card)', border: `1px solid ${t.severity === 'HIGH' ? 'rgba(255,71,87,.25)' : 'var(--border)'}`, borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 24 }}>{t.severity === 'HIGH' ? '🚨' : '⚠️'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{t.type}</span>
                <Badge risk={t.severity as any}>{t.severity}</Badge>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.target}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>{t.country}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{t.time}</div>
            </div>
            <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 700,
              background: t.status === 'Blocked' ? 'rgba(255,71,87,.12)' : t.status === 'Quarantine' ? 'rgba(255,107,53,.12)' : 'rgba(255,215,0,.08)',
              color: t.status === 'Blocked' ? 'var(--red)' : t.status === 'Quarantine' ? 'var(--orange)' : 'var(--yellow)',
              border: `1px solid ${t.status === 'Blocked' ? 'rgba(255,71,87,.3)' : t.status === 'Quarantine' ? 'rgba(255,107,53,.3)' : 'rgba(255,215,0,.2)'}`,
            }}>{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}