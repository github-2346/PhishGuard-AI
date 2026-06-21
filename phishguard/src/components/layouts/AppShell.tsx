
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp }  from '../../context/AppContext';
import * as authService from '../../services/authService';
import Tooltip from '../common/Tooltip';
import NotificationPanel from '../common/NotificationPanel';

// ── Nav config ────────────────────────────────────────────────
const userNav = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/scanner',   icon: '🔗', label: 'URL Scanner' },
  { to: '/email',     icon: '📧', label: 'Email Analysis' },
  { to: '/history',   icon: '📋', label: 'Scan History', badge: true },
  { to: '/reports',   icon: '📊', label: 'Reports' },
  { to: '/profile',   icon: '👤', label: 'Profile' },
  { to: '/settings',  icon: '⚙️', label: 'Settings' },
];

const adminOnlyNav = [
  { section: 'Admin' },
  { to: '/admin/users',     icon: '👥', label: 'User Management' },
  { to: '/admin/analytics', icon: '📊', label: 'Analytics' },
  { to: '/admin/threats',   icon: '🚨', label: 'Threat Monitor' },
];

const sharedNav = [
  { section: 'Tools' },
  { to: '/scanner',  icon: '🔗', label: 'URL Scanner' },
  { to: '/email',    icon: '📧', label: 'Email Analysis' },
  { to: '/history',  icon: '📋', label: 'Scan History', badge: true },
  { to: '/reports',  icon: '📊', label: 'Reports' },
  { section: 'Account' },
  { to: '/profile',  icon: '👤', label: 'Profile' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function AppShell() {
  const { user, setUser } = useAuth();
  const { unreadCount }   = useApp();
  const navigate          = useNavigate();
  const [showNotif,    setShowNotif]    = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'ADMIN';
  const nav = isAdmin
    ? [{ to: '/dashboard', icon: '🏠', label: 'Dashboard' }, ...adminOnlyNav, ...sharedNav]
    : userNav;

  // Close menus on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/login');
  };

  const initials = (name?: string) =>
    (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* ── SIDEBAR ────────────────────────────────────────── */}
      <aside style={{ width: 220, minWidth: 220, background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#00d4aa,#0099ff)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🛡️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>PhishGuard</div>
            <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>AI · Security</div>
          </div>
        </div>

        {!isAdmin && <div style={{ padding: '14px 10px 4px', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)' }}>Navigation</div>}

        {(nav as any[]).map((item, i) => {
          if ('section' in item) {
            return <div key={i} style={{ padding: '14px 10px 4px', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)' }}>{item.section}</div>;
          }
          return (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 7, margin: '1px 6px',
              color: isActive ? 'var(--accent)' : 'var(--text2)', fontSize: 12, fontWeight: 500, textDecoration: 'none',
              background: isActive ? 'rgba(0,212,170,.1)' : 'transparent',
              border: isActive ? '1px solid rgba(0,212,170,.2)' : '1px solid transparent',
              transition: 'all .18s',
            })}>
              <span style={{ width: 16, textAlign: 'center', fontSize: 14 }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && unreadCount > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--red)', color: '#fff', fontSize: 9, padding: '1px 5px', borderRadius: 20, fontWeight: 700 }}>{unreadCount}</span>
              )}
            </NavLink>
          );
        })}

        <div style={{ flex: 1 }} />
        <div style={{ padding: '10px 6px', borderTop: '1px solid var(--border)' }}>
          <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 7, margin: '1px 2px', color: 'var(--red)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            <span style={{ width: 16, textAlign: 'center', fontSize: 14 }}>🚪</span>Logout
          </div>
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* TOPBAR */}
        <header style={{ height: 52, minHeight: 52, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, position: 'relative', zIndex: 30 }}>
          <span style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>PhishGuard AI</span>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 7, padding: '5px 11px', width: 170 }}>
            <span style={{ fontSize: 12 }}>🔍</span>
            <input placeholder="Quick search..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 12, width: '100%', fontFamily: 'var(--font)' }} />
          </div>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <Tooltip text="Notifications">
              <div onClick={() => { setShowNotif(p => !p); setShowUserMenu(false); }}
                style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', color: 'var(--text2)', position: 'relative' }}>
                🔔
                {unreadCount > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 5, height: 5, background: 'var(--red)', borderRadius: '50%' }} />}
              </div>
            </Tooltip>
            {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
          </div>

          <Tooltip text="Help & Docs">
            <div style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', color: 'var(--text2)' }}>❓</div>
          </Tooltip>

          {/* User Menu Popover */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <div onClick={() => { setShowUserMenu(p => !p); setShowNotif(false); }}
              style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4aa,#0099ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#000' }}>
              {initials(user?.name)}
            </div>
            {showUserMenu && (
              <div style={{ position: 'absolute', top: 40, right: 0, width: 200, background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 10, padding: 0, zIndex: 50, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,.5)' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{user?.email}</div>
                  <span style={{ display: 'inline-block', marginTop: 5, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: isAdmin ? 'rgba(255,71,87,.15)' : 'rgba(0,153,255,.15)', color: isAdmin ? 'var(--red)' : 'var(--accent2)', border: `1px solid ${isAdmin ? 'rgba(255,71,87,.3)' : 'rgba(0,153,255,.3)'}` }}>
                    {isAdmin ? 'Administrator' : 'User'}
                  </span>
                </div>
                {[['👤', 'View Profile', '/profile'], ['⚙️', 'Settings', '/settings'], ['📊', 'My Reports', '/reports']].map(([ic, label, to]) => (
                  <div key={label} onClick={() => { navigate(to); setShowUserMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', fontSize: 12, color: 'var(--text2)', cursor: 'pointer', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span style={{ fontSize: 14 }}>{ic}</span>{label}
                  </div>
                ))}
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                <div onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', fontSize: 12, color: 'var(--red)', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ fontSize: 14 }}>🚪</span>Logout
                </div>
              </div>
            )}
          </div>
        </header>

        {/* PAGE OUTLET */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
