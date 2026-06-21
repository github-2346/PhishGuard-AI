import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge, RiskMeter, Alert, Button } from '../../components/common';
import type { URLScanResult, ScanHistoryItem } from '../../types';
import * as urlScanService from '../../services/urlScanService';

type Phase = 'idle' | 'scanning' | 'done';

const CHECKS = ['Querying VirusTotal API...', 'Checking Google Safe Browsing...', 'Analyzing domain reputation...', 'Verifying SSL certificate...', 'Detecting phishing patterns...'];

export default function URLScannerPage() {
  const { addScan } = useApp();
  const [url, setUrl]       = useState('');
  const [phase, setPhase]   = useState<Phase>('idle');
  const [result, setResult] = useState<URLScanResult | null>(null);
  const [step, setStep]     = useState(0);
  const [err, setErr]       = useState('');

  const runScan = async () => {
    if (!url.trim()) return;
    setErr(''); setResult(null); setPhase('scanning'); setStep(0);

    // Animated steps
    let s = 0;
    const iv = setInterval(() => { s++; setStep(s); if (s >= CHECKS.length - 1) clearInterval(iv); }, 600);

    try {
      const data = await urlScanService.scanUrl(url.trim());
      clearInterval(iv);
      setResult(data);
      setPhase('done');

      const histItem: ScanHistoryItem = {
        id: 'scan-' + Date.now(),
        type: 'URL',
        content: url.trim(),
        risk: data.threatLevel,
        status: data.status,
        date: 'Just now',
      };
      addScan(histItem);
    } catch {
      clearInterval(iv);
      setErr('Scan failed. Please check the URL and try again.');
      setPhase('idle');
    }
  };

  const reset = () => { setUrl(''); setResult(null); setPhase('idle'); setErr(''); };

  const riskColor = result
    ? result.threatLevel === 'HIGH' ? 'var(--red)' : result.threatLevel === 'MEDIUM' ? 'var(--orange)' : 'var(--accent)'
    : 'var(--accent)';

  return (
    <div style={{ padding: '28px 32px', maxWidth: 800, margin: '0 auto', animation: 'fadein .3s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🔗 URL Scanner</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Analyze any URL for phishing, malware, and reputation threats using real-time threat intelligence.</p>
      </div>

      {/* Input */}
      {phase !== 'done' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', color: 'var(--text2)', marginBottom: 10 }}>ENTER URL TO SCAN</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="url" placeholder="https://suspicious-site.com"
              value={url} onChange={e => setUrl(e.target.value)}
              disabled={phase === 'scanning'}
              onKeyDown={e => e.key === 'Enter' && runScan()}
              style={{ flex: 1, padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, outline: 'none', opacity: phase === 'scanning' ? .6 : 1 }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
            <Button variant="primary" onClick={runScan} disabled={phase === 'scanning' || !url.trim()} style={{ padding: '14px 28px', fontSize: 14, borderRadius: 10 }}>
              {phase === 'scanning' ? '⌛' : '🔍'} {phase === 'scanning' ? 'Scanning' : 'Scan'}
            </Button>
          </div>
          {err && <Alert type="error" >{err}</Alert>}

          {/* Try examples */}
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>Try:</span>
            {['https://login-paypal-update.xyz', 'https://google.com', 'http://free-iphone-winner.tk'].map(u => (
              <span key={u} onClick={() => setUrl(u)} style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer', padding: '2px 8px', border: '1px solid rgba(0,212,170,.2)', borderRadius: 4 }}>{u}</span>
            ))}
          </div>
        </div>
      )}

      {/* Scanning animation */}
      {phase === 'scanning' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 32, textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 16, animation: 'spin 1s linear infinite', display: 'inline-block' }}>🔍</div>
          <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>Analyzing URL...</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380, margin: '0 auto', textAlign: 'left' }}>
            {CHECKS.map((c, i) => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: i <= step ? 'var(--text)' : 'var(--text3)', transition: 'color .3s' }}>
                <span style={{ fontSize: 14 }}>{i < step ? '✅' : i === step ? '⌛' : '⭕'}</span>
                {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {phase === 'done' && result && (
        <div style={{ animation: 'fadein .4s ease' }}>
          {/* Risk banner */}
          <div style={{ background: `linear-gradient(135deg, ${riskColor}18, var(--card))`, border: `1px solid ${riskColor}40`, borderRadius: 14, padding: 24, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 48 }}>{result.threatLevel === 'HIGH' ? '🚨' : result.threatLevel === 'MEDIUM' ? '⚠️' : '✅'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 800 }}>URL Status: {result.status}</span>
                <Badge risk={result.threatLevel}>{result.threatLevel} RISK</Badge>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10, fontFamily: 'var(--mono)', wordBreak: 'break-all' }}>{result.url}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>⚡ {result.recommendation}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: riskColor, fontFamily: 'var(--mono)' }}>{result.riskScore}%</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Risk Score</div>
              <div style={{ width: 80, marginTop: 8 }}><RiskMeter value={result.riskScore} color={riskColor} /></div>
            </div>
          </div>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'HTTPS',        value: result.https ? '✅ Secure' : '❌ Insecure', ok: result.https },
              { label: 'SSL Certificate', value: result.ssl,        ok: result.ssl === 'Valid' },
              { label: 'Domain Age',   value: result.domainAge,    ok: !result.domainAge.includes('days') },
              { label: 'Reputation',   value: result.reputation,   ok: result.reputation === 'Clean' },
              { label: 'Malware',      value: result.malware,      ok: result.malware === 'None Detected' },
              { label: 'Scan ID',      value: result.scanId,       ok: true },
            ].map(({ label, value, ok }) => (
              <div key={label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.5px', color: 'var(--text3)', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: ok ? 'var(--text)' : 'var(--red)' }}>{value}</div>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={reset}>← Scan Another URL</Button>
        </div>
      )}
    </div>
  );
}