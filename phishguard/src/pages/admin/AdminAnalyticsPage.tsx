import React from 'react';
import { StatCard, RiskMeter } from '../../components/common';

const MONTHLY = [
  { month: 'Jan', scans: 120, threats: 32 },
  { month: 'Feb', scans: 145, threats: 41 },
  { month: 'Mar', scans: 178, threats: 52 },
  { month: 'Apr', scans: 210, threats: 63 },
  { month: 'May', scans: 265, threats: 78 },
  { month: 'Jun', scans: 312, threats: 95 },
];
const MAX_SCANS = Math.max(...MONTHLY.map(m => m.scans));

export default function AdminAnalyticsPage() {
  return (
    <div style={{ padding: '28px 32px', animation: 'fadein .3s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📊 Platform Analytics</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Global threat intelligence and platform performance metrics</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Users"   value="1,247"  icon="👥" color="blue"  change="+18% this month" />
        <StatCard label="Total Scans"   value="45,832" icon="🔍" color="teal"  change="+312 today" />
        <StatCard label="Threats Blocked" value="8,921" icon="🛡️" color="red"  change="19.5% threat rate" />
        <StatCard label="API Uptime"    value="99.7%"  icon="⚡" color="green" change="Last 30 days" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Bar chart */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Scan Volume (2026)</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 24 }}>Monthly scans vs threats detected</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 160 }}>
            {MONTHLY.map(({ month, scans, threats }) => (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 130, width: '100%' }}>
                  <div style={{ flex: 1, background: 'var(--accent2)', borderRadius: '3px 3px 0 0', height: `${(scans / MAX_SCANS) * 100}%`, opacity: .8, transition: 'height .8s ease' }} title={`${scans} scans`} />
                  <div style={{ flex: 1, background: 'var(--red)', borderRadius: '3px 3px 0 0', height: `${(threats / MAX_SCANS) * 100}%`, opacity: .8, transition: 'height .8s ease' }} title={`${threats} threats`} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>{month}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: 'var(--accent2)', borderRadius: 2 }} /><span style={{ fontSize: 11, color: 'var(--text3)' }}>Total Scans</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, background: 'var(--red)', borderRadius: 2 }} /><span style={{ fontSize: 11, color: 'var(--text3)' }}>Threats Detected</span></div>
          </div>
        </div>

        {/* Threat categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Threat Categories</div>
            {[
              { label: 'Phishing URLs',      pct: 42, color: 'var(--red)'     },
              { label: 'Email Scams',         pct: 28, color: 'var(--orange)'  },
              { label: 'Malware Downloads',   pct: 18, color: 'var(--yellow)'  },
              { label: 'Social Engineering',  pct: 12, color: 'var(--accent2)' },
            ].map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: 'var(--text2)' }}>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width .8s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Platform Health</div>
            {[
              { label: 'API Response',    val: 98, color: 'var(--accent)' },
              { label: 'DB Performance',  val: 95, color: 'var(--accent2)' },
              { label: 'Detection Rate',  val: 99, color: 'var(--green)' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text2)' }}>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{val}%</span>
                </div>
                <RiskMeter value={val} color={color} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}