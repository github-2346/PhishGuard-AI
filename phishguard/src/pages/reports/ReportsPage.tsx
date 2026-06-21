import React from 'react';
import { Badge, Button } from '../../components/common';

const REPORTS = [
  { id: 'RPT-001', type: 'URL Scan',    threat: 'HIGH',   result: 'Phishing URL Blocked',        created: '2026-06-20', summary: 'login-paypal-secure.xyz was identified as a phishing domain targeting PayPal users.' },
  { id: 'RPT-002', type: 'Email Scan',  threat: 'HIGH',   result: 'Phishing Email Flagged',       created: '2026-06-19', summary: 'Email contained credential theft patterns and urgency manipulation language.' },
  { id: 'RPT-003', type: 'URL Scan',    threat: 'LOW',    result: 'Safe URL Verified',            created: '2026-06-19', summary: 'github.com verified as safe with valid SSL and clean reputation.' },
  { id: 'RPT-004', type: 'URL Scan',    threat: 'MEDIUM', result: 'Suspicious Redirect Detected', created: '2026-06-18', summary: 'URL uses URL shortener with multiple redirects. Exercise caution.' },
  { id: 'RPT-005', type: 'Email Scan',  threat: 'HIGH',   result: 'Scam Email Detected',          created: '2026-06-17', summary: 'Lottery scam email requesting bank account details was blocked.' },
];

export default function ReportsPage() {
  return (
    <div style={{ padding: '28px 32px', animation: 'fadein .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📊 Reports</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>Detailed threat detection reports from your scans</p>
        </div>
        <Button variant="outline" style={{ fontSize: 12 }}>⬇️ Export All</Button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Reports', val: REPORTS.length, icon: '📋', color: 'var(--accent2)' },
          { label: 'High Threat',   val: REPORTS.filter(r => r.threat === 'HIGH').length, icon: '🚨', color: 'var(--red)' },
          { label: 'Safe Reports',  val: REPORTS.filter(r => r.threat === 'LOW').length, icon: '✅', color: 'var(--accent)' },
        ].map(({ label, val, icon, color }) => (
          <div key={label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: 'var(--mono)' }}>{val}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reports list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {REPORTS.map(r => (
          <div key={r.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>{r.threat === 'HIGH' ? '🚨' : r.threat === 'MEDIUM' ? '⚠️' : '✅'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.result}</span>
                <Badge risk={r.threat as any}>{r.threat}</Badge>
                <span style={{ fontSize: 11, padding: '2px 7px', border: '1px solid var(--border2)', borderRadius: 4, color: 'var(--text3)' }}>{r.type}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 8 }}>{r.summary}</p>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                {r.id} · {r.created}
              </div>
            </div>
            <Button variant="outline" size="sm">Download PDF</Button>
          </div>
        ))}
      </div>
    </div>
  );
}