import React from 'react';
import { useApp } from '../../context/AppContext';
import type { NotifType } from '../../types';

const icons: Record<NotifType, string> = { danger: '🚨', info: 'ℹ️', warn: '⚠️' };

interface Props { onClose: () => void; }

export default function NotificationPanel({ onClose }: Props) {
  const { notifications, markRead, markAllRead } = useApp();
  return (
    <div style={{ position: 'absolute', top: 40, right: 0, width: 280, background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 11, zIndex: 50, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: 12, fontWeight: 700 }}>Notifications</span>
        <button onClick={markAllRead} style={{ fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>Mark all read</button>
      </div>
      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {notifications.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(26,47,74,.3)', cursor: 'pointer', background: n.read ? 'transparent' : 'rgba(0,212,170,.04)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>{icons[n.type]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: n.read ? 'var(--text2)' : 'var(--text)', lineHeight: 1.5 }}>{n.msg}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2, fontFamily: 'var(--mono)' }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 3, flexShrink: 0 }} />}
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <span onClick={onClose} style={{ fontSize: 11, color: 'var(--text3)', cursor: 'pointer' }}>Close</span>
      </div>
    </div>
  );
}
