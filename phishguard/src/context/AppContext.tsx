
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type {
  AppContextType, Notification, ScanHistoryItem,
  Report, AdminUser, AppSettings, CreateUserPayload,
} from '../types';

// ── Default settings ──────────────────────────────────────────
const DEFAULT_SETTINGS: AppSettings = {
  emailNotif: true, pushNotif: false, smsAlert: false, weeklyReport: true,
  twoFA: false, loginNotif: true, sessionTimeout: true,
  theme: 'dark', dataRetention: '90days', analyticsShare: true, autoDelete: true,
};

// ── Seed notifications ────────────────────────────────────────
const SEED_NOTIFICATIONS: Notification[] = [
  { id: 1, msg: 'New phishing campaign targeting banking sector detected', time: '2m ago', read: false, type: 'danger' },
  { id: 2, msg: 'Weekly security report is ready for download',           time: '1h ago', read: false, type: 'info'   },
  { id: 3, msg: '3 new high-risk scans flagged for review',               time: '3h ago', read: true,  type: 'warn'   },
];

// ── Context ───────────────────────────────────────────────────
const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────
interface Props {
  children: ReactNode;
  initialHistory?: ScanHistoryItem[];
  initialReports?: Report[];
  initialUsers?: AdminUser[];
}

export function AppProvider({ children, initialHistory = [], initialReports = [], initialUsers = [] }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  const [scanHistory,   setScanHistory]   = useState<ScanHistoryItem[]>(initialHistory);
  const [reports,       setReports]       = useState<Report[]>(initialReports);
  const [users,         setUsers]         = useState<AdminUser[]>(initialUsers);
  const [settings,      setSettings]      = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading,       setLoadingMap]    = useState<Record<string, boolean>>({});

  const setLoad     = useCallback((key: string, val: boolean) => setLoadingMap(p => ({ ...p, [key]: val })), []);
  const markRead    = useCallback((id: number) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const markAllRead = useCallback(() => setNotifications(p => p.map(n => ({ ...n, read: true }))), []);
  const addScan     = useCallback((scan: ScanHistoryItem) => setScanHistory(p => [scan, ...p]), []);
  const deleteScan  = useCallback((id: string) => setScanHistory(p => p.filter(s => s.id !== id)), []);
  const deleteUser  = useCallback((id: string) => setUsers(p => p.filter(u => u.id !== id)), []);

  const toggleUserStatus = useCallback((id: string) =>
    setUsers(p => p.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u)), []);

  const addUser = useCallback((payload: CreateUserPayload) => {
    const newUser: AdminUser = {
      id:       'USR-' + Date.now(),
      name:     payload.name,
      email:    payload.email,
      role:     payload.role as any,
      status:   payload.status,
      avatar:   payload.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
      scans:    0,
      joined:   new Date().toISOString().slice(0, 10),
    };
    setUsers(p => [newUser, ...p]);
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) =>
    setSettings(p => ({ ...p, ...patch })), []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: AppContextType = {
    notifications, scanHistory, reports, users, settings,
    loading, unreadCount,
    setLoad, markRead, markAllRead, addScan, deleteScan,
    deleteUser, toggleUserStatus, addUser, updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
