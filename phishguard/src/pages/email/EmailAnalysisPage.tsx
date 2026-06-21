import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge, RiskMeter, Button } from '../../components/common';
import type { EmailScanResult, ScanHistoryItem } from '../../types';

const PHISHING_KEYWORDS = ['urgent', 'password', 'verify', 'account suspended', 'click here', 'confirm your', 'update required', 'limited time', 'act now', 'prize', 'winner', 'free', 'congratulations', 'wire transfer', 'bank account', 'social security', 'ssn', 'credit card'];

function mockEmailScan(content: string): EmailScanResult {
  const lower = content.toLowerCase();
  const found = PHISHING_KEYWORDS.filter(k => lower.includes(k));
  const hasLinks = /https?:\/\/\S+/gi.test(content);
  const hasUrgency = /urgent|immediately|asap|now|today|expire|deadline/i.test(content);
  const hasCreds = /password|username|login|verify|account|ssn|credit card/i.test(content);
  const hasSocial = /dear customer|dear user|congratulations|you have been selected/i.test(content);

  const score = Math.min(95, found.length * 12 + (hasLinks ? 15 : 0) + (hasUrgency ? 10 : 0) + (hasCreds ? 20 : 0));
  const level = score > 60 ? 'HIGH' : score > 30 ? 'MEDIUM' : 'LOW';

  return {
    scanId: 'EML-' + Date.now(),
    riskLevel: level,
    riskScore: score || 5,
    credentialRequest: hasCreds,
    urgencyDetected: hasUrgency,
    maliciousLinks: hasLinks && level !== 'LOW',
    socialEngineering: hasSocial,
    suspiciousKeywords: found.slice(0, 8),
    recommendation: level === 'HIGH'
      ? 'This email exhibits multiple phishing characteristics. Do not click any links or provide any information.'
      : level === 'MEDIUM'
      ? 'Suspicious patterns detected. Verify the sender before taking any action.'
      : 'Email appears legitimate. No significant threats detected.',
    distribution: { credentialTheft: hasCreds ? 45 : 5, urgencyManipulation: hasUrgency ? 30 : 5, maliciousLinks: hasLinks ? 15 : 0, socialEngineering: hasSocial ? 10 : 0 },
    scannedAt: new Date().toISOString(),
  };
}

const SAMPLE_EMAILS = [
  { label: '🚨 Phishing', text: 'Urgent: Your account has been suspended! Click here immediately to verify your password and avoid account deletion. Limited time offer — act now or lose access.' },
  { label: '📧 Normal', text: 'Hi team, just a reminder about our meeting tomorrow at 10am. Please review the attached agenda. Best regards, John.' },
  { label: '⚠️ Scam', text: 'Congratulations! You have been selected as a winner of $1,000,000. To claim your prize, please provide your bank account and social security number.' },
];

export default function EmailAnalysisPage() {
  const { addScan } = useApp();
  const [content, setContent] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult]   = useState<EmailScanResult | null>(null);

  const analyze = async () => {
    if (!content.trim()) return;
    setScanning(true);
    await new Promise(r => setTimeout(r, 1800));
    const res = mockEmailScan(content);
    setResult(res);
    setScanning(false);
    addScan({ id: res.scanId, type: 'Email', content: content.slice(0, 60) + '...', risk: res.riskLevel, status: res.riskLevel === 'HIGH' ? 'Phishing' : res.riskLevel === 'MEDIUM' ? 'Suspicious' : 'Safe', date: 'Just now' });
  };

  const riskColor = result ? (result.riskLevel === 'HIGH' ? 'var(--red)' : result.riskLevel === 'MEDIUM' ? 'var(--orange)' : 'var(--accent)') : 'var(--accent)';

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto', animation: 'fadein .3s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📧 Email Analysis</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Paste email content below to detect phishing patterns, credential theft attempts, and social engineering tactics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* Input Panel */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px', color: 'var(--text2)' }}>EMAIL CONTENT</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {SAMPLE_EMAILS.map(s => (
                <span key={s.label} onClick={() => { setContent(s.text); setResult(null); }} style={{ fontSize: 10, padding: '3px 8px', border: '1px solid var(--border2)', borderRadius: 4, cursor: 'pointer', color: 'var(--text2)' }}>{s.label}</span>
              ))}
            </div>
          </div>
          <textarea
            placeholder="Paste email subject, body, and headers here..."
            value={content} onChange={e => { setContent(e.target.value); setResult(null); }}
            rows={12}
            style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, resize: 'vertical', outline: 'none', lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Button variant="primary" onClick={analyze} disabled={scanning || !content.trim()} style={{ flex: 1, justifyContent: 'center', padding: '13px' }}>
              {scanning ? '⌛ Analyzing...' : '🔬 Analyze Email'}
            </Button>
            <Button variant="outline" onClick={() => { setContent(''); setResult(null); }} style={{ padding: '13px 18px' }}>Clear</Button>
          </div>
        </div>

        {/* Result Panel */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadein .4s ease' }}>
            {/* Risk banner */}
            <div style={{ background: `${riskColor}12`, border: `1px solid ${riskColor}40`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{result.riskLevel === 'HIGH' ? '🚨' : result.riskLevel === 'MEDIUM' ? '⚠️' : '✅'}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{result.riskLevel === 'HIGH' ? 'Phishing Detected!' : result.riskLevel === 'MEDIUM' ? 'Suspicious Content' : 'Content Appears Safe'}</div>
                  <Badge risk={result.riskLevel} style={{ marginTop: 4 }}>{result.riskLevel} RISK · Score: {result.riskScore}%</Badge>
                </div>
              </div>
              <RiskMeter value={result.riskScore} color={riskColor} />
              <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 10, lineHeight: 1.6 }}>{result.recommendation}</p>
            </div>

            {/* Threat indicators */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>THREAT INDICATORS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Credential Request',  val: result.credentialRequest,  icon: '🔑' },
                  { label: 'Urgency Language',    val: result.urgencyDetected,    icon: '⏰' },
                  { label: 'Malicious Links',     val: result.maliciousLinks,     icon: '🔗' },
                  { label: 'Social Engineering',  val: result.socialEngineering,  icon: '🎭' },
                ].map(({ label, val, icon }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text2)' }}>{icon} {label}</span>
                    <span style={{ fontWeight: 700, color: val ? 'var(--red)' : 'var(--accent)' }}>{val ? '⚠️ Detected' : '✅ None'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            {result.suspiciousKeywords.length > 0 && (
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>SUSPICIOUS KEYWORDS ({result.suspiciousKeywords.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.suspiciousKeywords.map(kw => (
                    <span key={kw} style={{ padding: '3px 10px', background: 'rgba(255,71,87,.12)', border: '1px solid rgba(255,71,87,.25)', borderRadius: 20, fontSize: 11, color: 'var(--red)' }}>{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}