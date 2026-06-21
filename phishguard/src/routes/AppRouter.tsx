

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/layouts/AppShell';

// Lazy-loaded pages
const LoginPage         = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPage        = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPage         = lazy(() => import('../pages/auth/ResetPasswordPage'));
const DashboardPage     = lazy(() => import('../pages/dashboard/DashboardPage'));
const URLScannerPage    = lazy(() => import('../pages/scanner/URLScannerPage'));
const EmailAnalysisPage = lazy(() => import('../pages/email/EmailAnalysisPage'));
const ScanHistoryPage   = lazy(() => import('../pages/history/ScanHistoryPage'));
const ReportsPage       = lazy(() => import('../pages/reports/ReportsPage'));
const AdminUsersPage    = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AdminAnalyticsPage'));
const AdminThreatsPage  = lazy(() => import('../pages/admin/AdminThreatsPage'));
const ProfilePage       = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage      = lazy(() => import('../pages/settings/SettingsPage'));

// Loading fallback
function PageLoader() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4aa' }}>
      ⌛ Loading...
    </div>
  );
}

// ── Protected route — redirect to login if not authed ────────
function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// ── Admin-only route ──────────────────────────────────────────
function RequireAdmin() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

// ── Public-only route (redirect authed users to dashboard) ───
function PublicOnly() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public auth routes */}
          <Route element={<PublicOnly />}>
            <Route path="/login"          element={<LoginPage />} />
            <Route path="/register"       element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPage />} />
            <Route path="/reset-password" element={<ResetPage />} />
          </Route>

          {/* Protected user routes */}
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard"    element={<DashboardPage />} />
              <Route path="/scanner"      element={<URLScannerPage />} />
              <Route path="/email"        element={<EmailAnalysisPage />} />
              <Route path="/history"      element={<ScanHistoryPage />} />
              <Route path="/reports"      element={<ReportsPage />} />
              <Route path="/profile"      element={<ProfilePage />} />
              <Route path="/settings"     element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Admin-only routes */}
          <Route element={<RequireAdmin />}>
            <Route element={<AppShell />}>
              <Route path="/admin/users"     element={<AdminUsersPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/threats"   element={<AdminThreatsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
