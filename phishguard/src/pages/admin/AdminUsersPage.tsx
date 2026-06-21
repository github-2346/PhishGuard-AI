import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge, Button } from '../../components/common';
import type { AdminUser } from '../../types';

const SEED_USERS: AdminUser[] = [
  { id: 'u1', name: 'Alice Johnson',  email: 'alice@corp.com',  role: 'USER',  avatar: 'AJ', scans: 45, joined: '2026-01-10', status: 'Active'   },
  { id: 'u2', name: 'Bob Smith',      email: 'bob@corp.com',    role: 'USER',  avatar: 'BS', scans: 12, joined: '2026-02-22', status: 'Inactive' },
  { id: 'u3', name: 'Carol White',    email: 'carol@corp.com',  role: 'ADMIN', avatar: 'CW', scans: 98, joined: '2025-11-05', status: 'Active'   },
  { id: 'u4', name: 'David Lee',      email: 'david@corp.com',  role: 'USER',  avatar: 'DL', scans: 7,  joined: '2026-05-14', status: 'Active'   },
  { id: 'u5', name: 'Eva Martinez',   email: 'eva@corp.com',    role: 'USER',  avatar: 'EM', scans: 31, joined: '2026-03-30', status: 'Inactive' },
];

export default function AdminUsersPage() {
  const { users, deleteUser, toggleUserStatus } = useApp();
  const [search, setSearch] = useState('');
  const allUsers = users.length ? users : SEED_USERS;
  const filtered = allUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '28px 32px', animation: 'fadein .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>👥 User Management</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>{allUsers.length} registered users</p>
        </div>
        <Button variant="primary" size="sm">+ Add User</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Users',    val: allUsers.length,                              color: 'var(--accent2)' },
          { label: 'Active',         val: allUsers.filter(u => u.status === 'Active').length,   color: 'var(--accent)' },
          { label: 'Inactive',       val: allUsers.filter(u => u.status === 'Inactive').length, color: 'var(--red)' },
          { label: 'Admins',         val: allUsers.filter(u => u.role === 'ADMIN').length,       color: 'var(--orange)' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: 'var(--mono)' }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input placeholder="🔍 Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 16px', borderRadius: 9, border: '1px solid var(--border2)', background: 'var(--card)', color: 'var(--text)', fontSize: 13, outline: 'none', marginBottom: 16 }} />

      {/* Table */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 100px 80px 80px 120px', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
          {['#', 'USER', 'EMAIL', 'ROLE', 'SCANS', 'STATUS', 'ACTIONS'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.5px', color: 'var(--text3)' }}>{h}</div>
          ))}
        </div>
        {filtered.map((u, i) => (
          <div key={u.id}
            style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 100px 80px 80px 120px', padding: '12px 16px', borderBottom: '1px solid rgba(26,47,74,.4)', alignItems: 'center', transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{i + 1}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4aa,#0099ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#000', flexShrink: 0 }}>{u.avatar}</div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{u.email}</div>
            <div><Badge variant={u.role === 'ADMIN' ? 'red' : 'blue'}>{u.role}</Badge></div>
            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>{u.scans}</div>
            <div>
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 700, background: u.status === 'Active' ? 'rgba(0,212,170,.12)' : 'rgba(255,71,87,.12)', color: u.status === 'Active' ? 'var(--accent)' : 'var(--red)' }}>
                {u.status === 'Active' ? '🟢' : '🔴'} {u.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button size="sm" variant="outline" onClick={() => toggleUserStatus(u.id)} style={{ fontSize: 10, padding: '4px 8px' }}>
                {u.status === 'Active' ? 'Disable' : 'Enable'}
              </Button>
              <Button size="sm" variant="danger" onClick={() => deleteUser(u.id)} style={{ fontSize: 10, padding: '4px 8px' }}>Del</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}