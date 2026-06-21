import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Toggle, Button, Alert } from '../../components/common';

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 18 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>{title}</div>
      {children}
    </div>
  );

  const SettingRow = ({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(26,47,74,.4)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );

  return (
    <div style={{ padding: '28px 32px', maxWidth: 700, animation: 'fadein .3s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>⚙️ Settings</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Customize your PhishGuard experience and security preferences</p>
      </div>

      {saved && <Alert type="success">✅ Settings saved successfully!</Alert>}

      <Section title="🔔 Notifications">
        <SettingRow label="Email Notifications"  sub="Receive scan reports via email"    checked={settings.emailNotif}   onChange={v => updateSettings({ emailNotif: v })} />
        <SettingRow label="Push Notifications"   sub="Browser push alerts for threats"   checked={settings.pushNotif}    onChange={v => updateSettings({ pushNotif: v })} />
        <SettingRow label="SMS Alerts"           sub="SMS for high-risk detections"      checked={settings.smsAlert}     onChange={v => updateSettings({ smsAlert: v })} />
        <SettingRow label="Weekly Report"        sub="Auto-generate weekly summaries"    checked={settings.weeklyReport} onChange={v => updateSettings({ weeklyReport: v })} />
      </Section>

      <Section title="🔐 Security">
        <SettingRow label="Two-Factor Authentication" sub="Extra protection for your account"  checked={settings.twoFA}          onChange={v => updateSettings({ twoFA: v })} />
        <SettingRow label="Login Notifications"       sub="Alert when new session starts"       checked={settings.loginNotif}     onChange={v => updateSettings({ loginNotif: v })} />
        <SettingRow label="Session Timeout"           sub="Auto-logout after 30 min inactivity" checked={settings.sessionTimeout} onChange={v => updateSettings({ sessionTimeout: v })} />
      </Section>

      <Section title="💾 Data & Privacy">
        <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(26,47,74,.4)' }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Data Retention Period</div>
          <select
            value={settings.dataRetention}
            onChange={e => updateSettings({ dataRetention: e.target.value })}
            style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, width: 200 }}>
            <option value="30days">30 Days</option>
            <option value="90days">90 Days</option>
            <option value="1year">1 Year</option>
            <option value="forever">Forever</option>
          </select>
        </div>
        <SettingRow label="Share Analytics"  sub="Help improve detection accuracy"    checked={settings.analyticsShare} onChange={v => updateSettings({ analyticsShare: v })} />
        <SettingRow label="Auto-Delete Logs" sub="Remove old scan logs automatically" checked={settings.autoDelete}     onChange={v => updateSettings({ autoDelete: v })} />
      </Section>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="primary" onClick={save} style={{ padding: '12px 28px' }}>💾 Save Settings</Button>
        <Button variant="danger" size="sm" style={{ padding: '12px 18px' }}>🗑️ Delete Account</Button>
      </div>
    </div>
  );
}