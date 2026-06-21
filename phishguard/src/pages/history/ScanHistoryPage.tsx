import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge, Button, EmptyState } from '../../components/common';
import type { ScanHistoryItem, RiskLevel, ScanType } from '../../types';

const SEED: ScanHistoryItem[] = [
  { id: 'h1', type: 'URL',   content: 'login-paypal-secure.xyz',              risk: 'HIGH',   status: 'Phishing',   date: '2 min ago'  },
  { id: 'h2', type: 'Email', content: 'Urgent: Verify your account now!',      risk: 'HIGH',   status: 'Phishing',   date: '18 min ago' },
  { id: 'h3', type: 'URL',   content: 'https://github.com',                    risk: 'LOW',    status: 'Safe',       date: '1h ago'     },
  { id: 'h4', type: 'URL',   content: 'free-iphone-winner.site',               risk: 'HIGH',   status: 'Suspicious', date: '3h ago'     },
  { id: 'h5', type: 'Email', content: 'Meeting tomorrow at 9am — agenda attached', risk: 'LOW', status: 'Safe',     date: '5h ago'     },
  { id: 'h6', type: 'URL',   content: 'bit.ly/3xH7mPq',                        risk: 'MEDIUM', status: 'Suspicious', date: 'Yesterday'  },
];

export default function ScanHistoryPage() {
  const { scanHistory, deleteScan } = useApp();
  const [search, setSearch]   = useState('');
  const [riskF,  setRiskF]   = useState<'ALL' | RiskLevel>('ALL');
  const [typeF,  setTypeF]   = useState<'ALL' | ScanType>('ALL');

  const history = [...(scanHistory.length ? scanHistory : []), ...SEED];
  const filtered = history.filter(h => {
    if (riskF !== 'ALL' && h.risk !== riskF) return false;
    if (typeF !== 'ALL' && h.type !== typeF) return false;
    if (search && !h.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = { high: history.filter(h => h.risk === 'HIGH').length, medium: history.filter(h => h.risk === 'MEDIUM').length, low: history.filter(h => h.risk === 'LOW').length };

  return (
    <div style={{ padding: '28px 32px', animation: 'fadein .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📋 Scan History</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>{history.length} total scans across all sessions</p>
        </div>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'All Scans', val: 'ALL', count: history.length, color: 'var(--text2)' },
          { label: 'High Risk', val: 'HIGH', count: counts.high, color: 'var(--red)' },
          { label: 'Medium',    val: 'MEDIUM', count: counts.medium, color: 'var(--orange)' },
          { label: 'Safe',      val: 'LOW', count: counts.low, color: 'var(--accent)' },
        ].map(({ label, val, count, color }) => (
          <div key={val} onClick={() => setRiskF(val as any)}
            style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${riskF === val ? color : 'var(--border)'}`, background: riskF === val ? `${color}15` : 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all .2s' }}>
            <span style={{ fontWeight: 700, color, fontSize: 16, fontFamily: 'var(--mono)' }}>{count}</span>
            <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input
          placeholder="🔍 Search content..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--card)', color: 'var(--text)', fontSize: 13, outline: 'none' }}
        />
        <select value={typeF} onChange={e => setTypeF(e.target.value as any)}
          style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--card)', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
          <option value="ALL">All Types</option>
          <option value="URL">URL Only</option>
          <option value="Email">Email Only</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 80px 1fr 100px 120px 80px', gap: 0, padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
          {['#', 'TYPE', 'CONTENT', 'RISK', 'STATUS', 'DATE'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.5px', color: 'var(--text3)' }}>{h}</div>
          ))}
        </div>
        {filtered.length === 0 && <EmptyState icon="📋" title="No scan records found" subtitle="Try adjusting your filters" />}
        {filtered.map((item, i) => (
          <div key={item.id}
            style={{ display: 'grid', gridTemplateColumns: '40px 80px 1fr 100px 120px 80px', gap: 0, padding: '12px 16px', borderBottom: '1px solid rgba(26,47,74,.4)', alignItems: 'center', transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{i + 1}</div>
            <div>
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: item.type === 'URL' ? 'rgba(0,153,255,.15)' : 'rgba(0,212,170,.12)', color: item.type === 'URL' ? 'var(--accent2)' : 'var(--accent)', fontWeight: 700 }}>
                {item.type === 'URL' ? '🔗' : '📧'} {item.type}
              </span>
            </div>
            <div style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 16, fontFamily: item.type === 'URL' ? 'var(--mono)' : 'var(--font)' }}>{item.content}</div>
            <div><Badge risk={item.risk}>{item.risk}</Badge></div>
            <div style={{ fontSize: 12, color: item.risk === 'HIGH' ? 'var(--red)' : item.risk === 'MEDIUM' ? 'var(--orange)' : 'var(--accent)' }}>{item.status}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}