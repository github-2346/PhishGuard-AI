import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import type { RiskLevel } from '../../types';

// ── Badge ─────────────────────────────────────────────────────
type BadgeVariant = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'gray';
const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  red:    { background: 'rgba(255,71,87,.15)',   color: 'var(--red)',    border: '1px solid rgba(255,71,87,.3)' },
  orange: { background: 'rgba(255,107,53,.15)',  color: 'var(--orange)', border: '1px solid rgba(255,107,53,.3)' },
  yellow: { background: 'rgba(255,215,0,.12)',   color: 'var(--yellow)', border: '1px solid rgba(255,215,0,.25)' },
  green:  { background: 'rgba(0,212,170,.15)',   color: 'var(--accent)', border: '1px solid rgba(0,212,170,.3)' },
  blue:   { background: 'rgba(0,153,255,.15)',   color: 'var(--accent2)', border: '1px solid rgba(0,153,255,.3)' },
  gray:   { background: 'rgba(139,165,199,.1)',  color: 'var(--text2)',  border: '1px solid var(--border)' },
};
interface BadgeProps { variant?: BadgeVariant; risk?: RiskLevel; children: ReactNode; style?: React.CSSProperties; }
export function Badge({ variant, risk, children, style }: BadgeProps) {
  const v = variant ?? (risk === 'HIGH' ? 'red' : risk === 'MEDIUM' ? 'orange' : risk === 'LOW' ? 'green' : 'gray');
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', ...badgeStyles[v], ...style }}>{children}</span>;
}

// ── Button ─────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'outline' | 'danger';
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: BtnVariant; size?: 'sm' | 'md'; children: ReactNode; }
export function Button({ variant = 'outline', size = 'md', children, style, ...rest }: BtnProps) {
  const base: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 7, borderRadius: 7, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all .18s', letterSpacing: '.2px', padding: size === 'sm' ? '5px 10px' : '8px 16px', fontSize: size === 'sm' ? 11 : 12 };
  const variantStyle: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg,var(--accent),var(--accent2))', color: '#000' },
    outline: { background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text)' },
    danger:  { background: 'rgba(255,71,87,.12)', border: '1px solid rgba(255,71,87,.3)', color: 'var(--red)' },
  };
  return <button style={{ ...base, ...variantStyle[variant], ...style }} {...rest}>{children}</button>;
}

// ── Alert ─────────────────────────────────────────────────────
type AlertType = 'success' | 'error' | 'warning';
interface AlertProps { type?: AlertType; children: ReactNode; }
export function Alert({ type = 'success', children }: AlertProps) {
  const styles: Record<AlertType, React.CSSProperties> = {
    success: { background: 'rgba(0,212,170,.1)', border: '1px solid rgba(0,212,170,.25)', color: 'var(--accent)' },
    error:   { background: 'rgba(255,71,87,.1)',  border: '1px solid rgba(255,71,87,.25)',  color: 'var(--red)'    },
    warning: { background: 'rgba(255,215,0,.07)', border: '1px solid rgba(255,215,0,.2)',   color: 'var(--yellow)' },
  };
  return <div style={{ padding: '10px 14px', borderRadius: 7, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, ...styles[type] }}>{children}</div>;
}

// ── Toggle ────────────────────────────────────────────────────
interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; }
export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <label style={{ position: 'relative', width: 36, height: 20, flexShrink: 0, display: 'inline-block' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: 'absolute', inset: 0, background: checked ? 'var(--accent)' : 'var(--border2)', borderRadius: 20, cursor: 'pointer', transition: '.25s' }}>
        <span style={{ position: 'absolute', width: 14, height: 14, left: checked ? 19 : 3, bottom: 3, background: '#fff', borderRadius: '50%', transition: '.25s' }} />
      </span>
    </label>
  );
}

// ── Modal ─────────────────────────────────────────────────────
interface ModalProps { title: string; onClose: () => void; children: ReactNode; maxWidth?: number; }
export function Modal({ title, onClose, children, maxWidth = 520 }: ModalProps) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(4,9,15,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 14, padding: 24, width: '100%', maxWidth, maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 18, cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, fontFamily: 'var(--font)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────
interface PagProps { page: number; total: number; pageSize: number; onChange: (p: number) => void; }
export function Pagination({ page, total, pageSize, onChange }: PagProps) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 14, justifyContent: 'flex-end' }}>
      <span style={{ fontSize: 11, color: 'var(--text3)', marginRight: 6 }}>Showing {Math.min((page-1)*pageSize+1, total)}–{Math.min(page*pageSize, total)} of {total}</span>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} onClick={() => onChange(i + 1)} style={{ width: 28, height: 28, border: `1px solid ${page === i+1 ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 6, background: page === i+1 ? 'rgba(0,212,170,.08)' : 'transparent', color: page === i+1 ? 'var(--accent)' : 'var(--text2)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)' }}>{i + 1}</button>
      ))}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────
type CardColor = 'teal' | 'blue' | 'red' | 'green';
interface StatCardProps { label: string; value: string; change?: string; icon: string; color?: CardColor; }
const colorMap: Record<CardColor, string> = { teal: 'var(--accent)', blue: 'var(--accent2)', red: 'var(--red)', green: 'var(--green)' };
export function StatCard({ label, value, change, icon, color = 'teal' }: StatCardProps) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 11, padding: 16, position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'border-color .2s' }}>
      <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 20, opacity: .4 }}>{icon}</div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -1, fontFamily: 'var(--mono)', color: colorMap[color] }}>{value}</div>
      {change && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{change}</div>}
    </div>
  );
}

// ── RiskMeter ─────────────────────────────────────────────────
interface RiskMeterProps { value: number; color?: string; }
export function RiskMeter({ value, color }: RiskMeterProps) {
  const c = color ?? (value > 70 ? 'var(--red)' : value > 40 ? 'var(--orange)' : 'var(--accent)');
  return (
    <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden', margin: '6px 0' }}>
      <div style={{ height: '100%', borderRadius: 3, background: c, width: `${value}%`, transition: 'width .7s ease' }} />
    </div>
  );
}

// ── Loader ────────────────────────────────────────────────────
export function Loader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
      <div style={{ fontSize: 28, marginBottom: 10, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⌛</div>
      <div style={{ fontSize: 12 }}>{text}</div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────
export function EmptyState({ icon = '🔍', title = 'Nothing found', subtitle }: { icon?: string; title?: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: 48, color: 'var(--text3)' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12 }}>{subtitle}</div>}
    </div>
  );
}

// ── Panel ─────────────────────────────────────────────────────
interface PanelProps { title?: string; action?: { label: string; onClick: () => void }; children: ReactNode; style?: React.CSSProperties; }
export function Panel({ title, action, children, style }: PanelProps) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 11, padding: 18, ...style }}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          {title && <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.4px' }}>{title}</div>}
          {action && <span onClick={action.onClick} style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>{action.label}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
