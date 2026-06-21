
import api from './axiosInstance';
import type { AdminUser, AdminAnalytics, CreateUserPayload, PaginatedResponse } from '../types';

// ── Get all users ─────────────────────────────────────────────
export async function getUsers(
  page = 1,
  pageSize = 20,
  filters?: { role?: string; status?: string; search?: string }
): Promise<PaginatedResponse<AdminUser>> {
  const { data } = await api.get<PaginatedResponse<AdminUser>>('/admin/users', {
    params: { page, pageSize, ...filters },
  });
  return data;
}

// ── Get single user by ID ─────────────────────────────────────
export async function getUserById(userId: string): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>(`/admin/users/${userId}`);
  return data;
}

// ── Create new user ───────────────────────────────────────────
export async function createUser(payload: CreateUserPayload): Promise<AdminUser> {
  const { data } = await api.post<AdminUser>('/admin/users', payload);
  return data;
}

// ── Update user ───────────────────────────────────────────────
export async function updateUser(userId: string, payload: Partial<AdminUser>): Promise<AdminUser> {
  const { data } = await api.put<AdminUser>(`/admin/users/${userId}`, payload);
  return data;
}

// ── Toggle user active/inactive ───────────────────────────────
export async function toggleUserStatus(userId: string, status: 'Active' | 'Inactive'): Promise<AdminUser> {
  const { data } = await api.put<AdminUser>(`/admin/users/${userId}/status`, { status });
  return data;
}

// ── Delete user ───────────────────────────────────────────────
export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

// ── Get platform analytics ────────────────────────────────────
export async function getAnalytics(): Promise<AdminAnalytics> {
  const { data } = await api.get<AdminAnalytics>('/admin/analytics');
  return data;
}

// ── Export users CSV ──────────────────────────────────────────
export async function exportUsersCSV(): Promise<Blob> {
  const { data } = await api.get('/admin/users/export', { responseType: 'blob' });
  return data;
}
