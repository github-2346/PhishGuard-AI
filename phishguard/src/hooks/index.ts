
import { useState, useCallback } from 'react';
import * as urlScanService   from '../services/urlScanService';
import * as emailScanService from '../services/emailScanService';
import * as reportService    from '../services/reportService';
import * as adminService     from '../services/adminService';
import type {
  URLScanResult, EmailScanResult, ScanHistoryItem,
  PaginatedResponse, Report, AdminUser, AdminAnalytics,
  CreateUserPayload,
} from '../types';

// ── useURLScan ────────────────────────────────────────────────
export function useURLScan() {
  const [result,   setResult]   = useState<URLScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const scan = useCallback(async (url: string) => {
    setScanning(true); setError(null); setResult(null);
    try {
      const data = await urlScanService.scanUrl(url);
      setResult(data);
      return data;
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Scan failed. Please try again.');
      return null;
    } finally {
      setScanning(false);
    }
  }, []);

  const clear = () => { setResult(null); setError(null); };
  return { result, scanning, error, scan, clear };
}

// ── useEmailScan ──────────────────────────────────────────────
export function useEmailScan() {
  const [result,    setResult]    = useState<EmailScanResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const analyze = useCallback(async (content: string) => {
    setAnalyzing(true); setError(null); setResult(null);
    try {
      const data = await emailScanService.analyzeEmail({ content });
      setResult(data);
      return data;
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Analysis failed. Please try again.');
      return null;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const clear = () => { setResult(null); setError(null); };
  return { result, analyzing, error, analyze, clear };
}



// ── useReports ────────────────────────────────────────────────
export function useReports() {
  const [data,    setData]    = useState<PaginatedResponse<Report> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetch = useCallback(async (page = 1, filters?: object) => {
    setLoading(true);
    try {
      const res = await reportService.getReports(page, 10, filters);
      setData(res);
    } catch (e: any) {
      setError(e?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const download = useCallback(async (id: string) => {
    const blob = await reportService.downloadReport(id);
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `report-${id}.pdf`; a.click();
    URL.revokeObjectURL(url);
  }, []);

  return { data, loading, error, fetch, download };
}

// ── useAdmin ──────────────────────────────────────────────────
export function useAdmin() {
  const [users,     setUsers]     = useState<PaginatedResponse<AdminUser> | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const fetchUsers = useCallback(async (page = 1, filters?: object) => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(page, 20, filters);
      setUsers(res);
    } catch (e: any) {
      setError(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await adminService.getAnalytics();
      setAnalytics(res);
    } catch (e: any) {
      setError(e?.message || 'Failed to load analytics');
    }
  }, []);

  const createUser = useCallback(async (payload: CreateUserPayload) => {
    const user = await adminService.createUser(payload);
    setUsers(p => p ? { ...p, data: [user, ...p.data], total: p.total + 1 } : p);
    return user;
  }, []);

  const removeUser = useCallback(async (id: string) => {
    await adminService.deleteUser(id);
    setUsers(p => p ? { ...p, data: p.data.filter(u => u.id !== id), total: p.total - 1 } : p);
  }, []);

  const toggleStatus = useCallback(async (id: string, status: 'Active' | 'Inactive') => {
    const updated = await adminService.toggleUserStatus(id, status);
    setUsers(p => p ? { ...p, data: p.data.map(u => u.id === id ? updated : u) } : p);
  }, []);

  return { users, analytics, loading, error, fetchUsers, fetchAnalytics, createUser, removeUser, toggleStatus };
}
